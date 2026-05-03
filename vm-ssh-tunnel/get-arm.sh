#!/bin/bash

# --- CONFIGURATION ---
TENANCY_ID="<YOUR_TENANCY_OCID>"
SUBNET_ID="<YOUR_SUBNET_OCID>"
IMAGE_ID="<YOUR_IMAGE_OCID>"
AD_NAME="<YOUR_AVAILABILITY_DOMAIN>"
SSH_KEY_PATH="$HOME/.ssh/id_ed25519.pub"

echo "Starting Shell ARM Sniper"

while true; do
    echo "Attempting launch at $(date '+%Y-%m-%d %H:%M:%S')..."
    
    # Use oci compute instance launch
    # We use --ssh-authorized-keys-file to avoid manual JSON escaping issues
    RESPONSE=$(oci compute instance launch \
        --availability-domain "$AD_NAME" \
        --compartment-id "$TENANCY_ID" \
        --shape "VM.Standard.A1.Flex" \
        --display-name "Arm-Server-Primary" \
        --image-id "$IMAGE_ID" \
        --subnet-id "$SUBNET_ID" \
        --shape-config '{"ocpus": 4, "memoryInGBs": 24}' \
        --ssh-authorized-keys-file "$SSH_KEY_PATH" \
        --assign-public-ip true 2>&1)
    
    EXIT_CODE=$?
    
    if [ $EXIT_CODE -eq 0 ]; then
        # Parse the instance ID from the JSON response
        INSTANCE_ID=$(echo "$RESPONSE" | jq -r '.data.id')
        INSTANCE_NAME=$(echo "$RESPONSE" | jq -r '.data."display-name"')
        echo "SUCCESS! Instance created."
        echo "Instance Name: $INSTANCE_NAME"
        echo "OCID: $INSTANCE_ID"
        
        echo "Waiting for instance to provision to fetch IPs (sleeping 20s)..."
        sleep 20
        
        # Get VNIC attachment
        VNIC_ATTACHMENT=$(oci compute vnic-attachment list --instance-id "$INSTANCE_ID" --all | jq -r '.data[0].id')
        if [ -n "$VNIC_ATTACHMENT" ] && [ "$VNIC_ATTACHMENT" != "null" ]; then
            VNIC_ID=$(oci compute vnic-attachment get --vnic-attachment-id "$VNIC_ATTACHMENT" | jq -r '.data."vnic-id"')
            if [ -n "$VNIC_ID" ] && [ "$VNIC_ID" != "null" ]; then
                VNIC_INFO=$(oci network vnic get --vnic-id "$VNIC_ID")
                PUBLIC_IP=$(echo "$VNIC_INFO" | jq -r '.data."public-ip"')
                PRIVATE_IP=$(echo "$VNIC_INFO" | jq -r '.data."private-ip"')
                
                echo "Public IP: $PUBLIC_IP"
                echo "Private IP: $PRIVATE_IP"
                
                if [ -n "$PUBLIC_IP" ] && [ "$PUBLIC_IP" != "null" ]; then
                    echo "Configuring ~/.ssh/config..."
                    echo "" >> ~/.ssh/config
                    echo "Host oci-vm" >> ~/.ssh/config
                    echo "    HostName $PUBLIC_IP" >> ~/.ssh/config
                    echo "    User ubuntu" >> ~/.ssh/config # Oracle Ubuntu images default to 'ubuntu', Oracle Linux uses 'opc'
                    echo "    IdentityFile ${SSH_KEY_PATH%.pub}" >> ~/.ssh/config
                    echo "You can now connect using: ssh oci-vm"
                fi
            fi
        fi
        
        break
    else
        # Handle various error conditions
        if echo "$RESPONSE" | grep -q "Out of host capacity"; then
            echo "Capacity full. Retrying in 60s..."
            sleep 60
        elif echo "$RESPONSE" | grep -q "LimitExceeded"; then
             echo "Limit exceeded or Quota reached. Check your OCPU limits. Retrying in 60s..."
             sleep 60
        elif echo "$RESPONSE" | grep -q "TooManyRequests"; then
            echo "Rate limited (429). Waiting 2 minutes..."
            sleep 120
        elif echo "$RESPONSE" | grep -q "NotAuthorizedOrNotFound"; then
            echo "Error: Unauthorized or Not Found. Check your OCIDs and permissions."
            echo "$RESPONSE"
            exit 1
        else
            echo "Unexpected error encountered:"
            # Try to extract the message if it's JSON, otherwise print raw
            MESSAGE=$(echo "$RESPONSE" | jq -r '.message' 2>/dev/null)
            if [ -n "$MESSAGE" ] && [ "$MESSAGE" != "null" ]; then
                echo "$MESSAGE"
            else
                echo "$RESPONSE"
            fi
            echo "Retrying in 30s..."
            sleep 30
        fi
    fi
done
