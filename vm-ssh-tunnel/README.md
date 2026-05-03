# VM SSH Tunnels

## Overview

This solution utilizes Virtual Machines and SSH tunnels. The deployment and access strategies are agnostic to the VM provider once the instance is running. All traffic is routed through an SSH tunnel to maintain privacy and security.

All servers will be ran on the VM as Docker containers. The VM will also run a Database server with data stored on an encrypted mounted volume for persistance. Additional software (e.g. Redis) can also be added as Docker containers on the same VM.

_Note: Oracle's Always Free ARM VMs are highly preferred for this approach due to their generous resource limits (4 cores and 24GB of RAM) and are used as the reference infrastructure in our examples._

## Cost

Based on Oracle's always free tier:

- Oracle VM: Free tier (4 OCPUs, 24GB RAM);
- Disk: Free (50GB Boot + 50GB Mounted);
- Network: Free for first 10 TB.

## Privacy and Security

- All traffic must go through SSH tunnel, so the VM is only accessible from your own devices. This is great for keeping your data private.
- It may not be ideal if you want to share your applications with others.

## Infrastructure Setup

The infrastructure setup is split into 5 detailed steps:
1. [Step 1: Prerequisites (Human Interaction Required)](./step-1-prerequisites.md)
2. [Step 2: Create Network Dependencies (Agent Executable)](./step-2-network.md)
3. [Step 3: Create the VM (Agent Executable)](./step-3-create-vm.md)
4. [Step 4: Create and Attach Block Volume (Agent Executable)](./step-4-block-volume.md)
5. [Step 5: SSH into VM and Setup Infrastructure (Agent Executable)](./step-5-setup-infra.md)

## Connection Instructions

### Mac & Windows

Establish a standard SSH tunnel to map the VM's port to your localhost.

```bash
# Forward local port 8080 to the VM's internal IP and port
ssh -N -L 8080:10.0.0.84:8080 oci-vm
```

You can then access your server in your browser at `http://localhost:8080`.

### iOS

On iOS, you can use apps like **Shadowrocket** to create a proxy rule that tunnels specific domains through an SSH connection.

**Shadowrocket Configuration:**

```ini
# Shadowrocket: 2026-05-02 16:02:39
[General]
# DNS server settings to ensure local resolution works
dns-server = 1.1.1.1, 8.8.8.8
# Bypass common local addresses
skip-proxy =
hijack-dns =

[Rule]
IP-CIDR,10.0.0.0/8,PROXY,no-resolve
# 1. Route your specific dummy domain to your SSH Tunnel
# Replace "Oracle-SSH" with the name of your SSH profile in the app
DOMAIN-SUFFIX,mysite.vm,ORACLE,force-remote-dns

# 2. Final Rule: Everything else goes directly to the internet (Bypass)
FINAL,DIRECT

[Host]
# Map your dummy domain to the VM's internal loopback
# This ensures that when the request exits the tunnel on the VM,
# it looks for the Docker container on 127.0.0.1
mysite.vm = <VM_PRIVATE_IP>
```

With this configuration, start the proxy, then use any browser to navigate to `http://mysite.vm:8080`. The request will be securely tunneled to your Oracle VM.

### Android

Similar to iOS, you can use apps like Termux (to run standard SSH) or specialized proxy apps to establish an SSH tunnel and route traffic to a local loopback address.
