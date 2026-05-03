# Step 6: Deploying Applications (Agent Executable)

This step documents how an agent can autonomously deploy the applications in the `examples/` directory to the VM. The deployment process is designed to be completely agnostic to the infrastructure provider—it only assumes you have SSH access to the VM and Docker is installed.

## Deployment Architecture

We use **Docker Compose** to orchestrate the deployment natively on the VM:

- **Nginx (Frontend & Proxy):** Serves the static HTML/JS/CSS files for the Landing Page, Calculator, and Stitch Pattern Generator. It also proxies any `/api/` requests to the Fridge Manager backend.
- **Node.js (Backend):** Runs the Fridge Manager API (`server.js`).

Docker natively handles cross-architecture builds. When Docker Compose builds the Node.js image on the VM, it automatically pulls the correct architecture base image (e.g., `linux/arm64` or `linux/amd64`) matching the host VM.

## Deployment Script

We have packaged the deployment logic into a reusable skill script located at `vm-ssh-tunnel/deploy.sh`. This script handles both the **initial deployment** and all **subsequent updates**.

_Note: the source code of the deployed apps are expected to be under `examples` directory in the repo. All source code are copied to the VM. The backend are built as Docker images, then run as Docker containers. Frontend and routing are handled by Nginx._

An agent can autonomously execute it as follows:

```bash
chmod +x vm-ssh-tunnel/deploy.sh
./vm-ssh-tunnel/deploy.sh
```

Under the hood, the `deploy.sh` script:

1. Syncs the local `examples/` directory to the remote VM via `rsync` (excluding `node_modules`).
2. Connects to the VM over SSH and detects the hardware architecture (`uname -m`).
3. Rebuilds and restarts the Docker containers natively on the VM via `docker compose`.

## Accessing the Apps

Since the VM's port `8080` is not exposed to the public internet (as per our security design), you must access it through your SSH tunnel.

1. Ensure your SSH tunnel is active (e.g., running `ssh -N -L 8080:127.0.0.1:8080 oci-vm` locally).
2. Open your browser and navigate to: [http://localhost:8080/landing-page/](http://localhost:8080/landing-page/)
3. From the landing page, you can click through to the Calculator, Stitch Pattern Generator, and Fridge Manager apps.
