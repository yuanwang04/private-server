# Step 4: Create and Attach Block Volume (Agent Executable)

To persist database data safely, create a separate 50GB block volume. 

**1. Create Volume:**
```bash
VOLUME_ID=$(oci bstorage volume create --compartment-id <COMPARTMENT_OCID> --availability-domain $AD_NAME --display-name "DB-Volume" --size-in-gbs 50 | jq -r '.data.id')
echo "VOLUME_ID=$VOLUME_ID"
```
*(Wait a few moments for the volume to become 'AVAILABLE' before proceeding).*

**2. Attach Volume:**
```bash
oci compute volume-attachment attach --instance-id <INSTANCE_ID> --type paravirtualized --volume-id $VOLUME_ID
```
