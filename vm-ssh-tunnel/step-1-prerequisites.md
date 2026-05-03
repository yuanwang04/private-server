# Step 1: Prerequisites (Human Interaction Required)

1. **Create an Oracle Cloud Account:** Sign up for the Always Free tier.
2. **Install OCI CLI:** 
   - Mac: `brew install oci-cli`
   - Linux/Windows: See [official documentation](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm).
3. **Configure Authentication:** Run `oci setup config`. Enter your Tenancy OCID, User OCID, and Region. It will generate an API key pair. Upload the public API key to your Oracle Cloud account (User Profile -> API Keys).
4. **Generate SSH Keys:** If you don't have one, run:
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""
   ```
