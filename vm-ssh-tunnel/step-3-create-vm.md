# Step 3: Create the VM (Agent Executable)

Update the `get-arm.sh` script configuration block with the `SUBNET_ID`, `IMAGE_ID`, `AD_NAME`, and your `<COMPARTMENT_OCID>` (Tenancy OCID) obtained in Step 2. 

Run the script. It will loop continuously until it successfully secures an ARM VM instance (4 OCPUs, 24GB RAM).
```bash
chmod +x get-arm.sh
./get-arm.sh
```
The script outputs the instance OCID (`INSTANCE_ID`) and appends an entry to your `~/.ssh/config` to allow access via `ssh oci-vm`. Note down the `INSTANCE_ID`.
