# Private Server Deployment Skills & Tools

This repository contains the infrastructure code, deployment skills, and documentation to deploy private web applications securely. It provides two distinct solutions for hosting and securing your private servers, along with a collection of example applications.

## Solutions Overview

### VM SSH Tunnels
This solution utilizes an agnostic Virtual Machine approach. Once the VM is created, deployment is consistent across providers. Note: Oracle's generous Always Free ARM VMs (4 cores, 24GB RAM) are highly preferred in this case and are used in the examples. To ensure the connection remains private and secure, access is routed exclusively through an SSH tunnel.

- **Infrastructure:** Any Virtual Machine (e.g., Oracle Cloud Infrastructure (OCI) Compute Instance).
- **Security:** SSH Tunnels mapping a remote port to the local device.
- **Client Connections:**
  - **Mac/Windows:** Standard SSH port-forwarding (`ssh -L`).
  - **iOS/Android:** Using proxy utility apps like Shadowrocket.
- **Directory:** `/vm-ssh-tunnel/`

### Cloudflare Access + Serverless
This solution utilizes a Cloudflare domain and Cloudflare Access to protect the application, allowing access only to a predefined list of authenticated users (free for up to 50 users).

- **Infrastructure:** Serverless compute (Cloudflare Workers, AWS Lambda, or GCP CloudRun).
- **Security:** Cloudflare Access (Zero Trust).
- **Database:** Supabase (PostgreSQL) or similar serverless databases.
- **Directory:** `/cloudflare-serverless/`

## Examples
The `examples/` folder contains a suite of example applications to deploy, including:
1. **Landing Page:** A central navigation portal to access different deployed tools.
2. **Calculator:** A front-end only utility.
3. **Fridge Manager:** A full-stack tool connecting to a database to manage groceries.
4. **Stitch Pattern Generator:** A front-end creative tool.

See `examples/landing-page/index.html` to get started.
