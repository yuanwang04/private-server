# Step 2: Create Network Dependencies (Agent Executable)

An agent can run these commands sequentially to build the networking infrastructure and retrieve the necessary OCIDs. 
*(Note: Replace `<COMPARTMENT_OCID>` with your Tenancy OCID before running).*

**1. Create VCN:**
```bash
VCN_ID=$(oci network vcn create --compartment-id <COMPARTMENT_OCID> --display-name "PrivateServerVCN" --cidr-block "10.0.0.0/16" | jq -r '.data.id')
echo "VCN_ID=$VCN_ID"
```

**2. Create Internet Gateway:**
```bash
IGW_ID=$(oci network internet-gateway create --compartment-id <COMPARTMENT_OCID> --vcn-id $VCN_ID --is-enabled true --display-name "PrivateServerIGW" | jq -r '.data.id')
echo "IGW_ID=$IGW_ID"
```

**3. Update Default Route Table:**
```bash
RT_ID=$(oci network vcn get --vcn-id $VCN_ID | jq -r '.data."default-route-table-id"')
oci network route-table update --rt-id $RT_ID --route-rules '[{"cidrBlock":"0.0.0.0/0","networkEntityId":"'$IGW_ID'"}]' --force
```

**4. Create Public Subnet:**
```bash
SUBNET_ID=$(oci network subnet create --compartment-id <COMPARTMENT_OCID> --vcn-id $VCN_ID --cidr-block "10.0.0.0/24" --display-name "PublicSubnet" | jq -r '.data.id')
echo "SUBNET_ID=$SUBNET_ID"
```

**5. Get Availability Domain and Image OCIDs:**
```bash
AD_NAME=$(oci iam availability-domain list --compartment-id <COMPARTMENT_OCID> | jq -r '.data[0].name')
echo "AD_NAME=$AD_NAME"

# Get Ubuntu 22.04 ARM image OCID for your region
IMAGE_ID=$(oci compute image list --compartment-id <COMPARTMENT_OCID> --operating-system "Canonical Ubuntu" --operating-system-version "22.04" --shape "VM.Standard.A1.Flex" --sort-by TIMECREATED --sort-order DESC | jq -r '.data[0].id')
echo "IMAGE_ID=$IMAGE_ID"
```
