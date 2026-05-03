# Project: private-server

This project is an agent skill and toolset designed to deploy and manage private servers. It provides infrastructure setup, deployment skills, and connection instructions for different server architectures.

## Project Overview
- **Purpose:** To provide automated agent skills to deploy private servers securely, utilizing either VM SSH tunnels or Serverless architectures via Cloudflare Access.
- **Status:** Boilerplates initialized.
- **Target Technologies:** VMs, SSH Tunnels, Cloudflare Access, Cloudflare Workers, Node.js, HTML/JS/CSS.

## Architecture & Solutions
The repository is split into two primary solutions:
1. **`vm-ssh-tunnel`**: Deploying to Virtual Machines (agnostic to the provider), utilizing SSH tunnels for private and secure connections across Mac, Windows, iOS, and Android. Note: Oracle's Always Free ARM VMs are preferred and used in the examples.
2. **`cloudflare-serverless`**: A serverless approach utilizing Cloudflare Access for user authentication, routing traffic to Cloudflare Workers, AWS Lambda, or GCP CloudRun, backed by databases like Supabase.

## Getting Started
- Navigate to the respective solution directory to view infrastructure setup and deployment skills.
- The `examples/` directory contains a central landing page and several example applications (Calculator, Fridge Manager, Stitch Pattern Generator) that can be deployed to these private servers.

## Building and Running
*Refer to the specific README files in the solution directories for build and run instructions.*

## Development Conventions
- **Naming:** Follow standard conventions for the respective infrastructure tools and web frameworks.
- **Documentation:** Maintain this `GEMINI.md` and `README.md` as the project evolves.
