# Step 5: SSH into VM and Setup Infrastructure (Agent Executable)

An agent can SSH directly into the VM to format the newly attached disk, mount it, install Docker, and spin up the services.

```bash
ssh -o StrictHostKeyChecking=no oci-vm << 'EOF'
# 1. Format and mount the paravirtualized volume (typically appears as /dev/sdb)
sudo mkfs.ext4 -F /dev/sdb
sudo mkdir -p /mnt/data
sudo mount /dev/sdb /mnt/data

# Persist mount on reboot
echo '/dev/sdb /mnt/data ext4 defaults,noatime 0 2' | sudo tee -a /etc/fstab

# 2. Install Docker
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# 3. Run NGINX on port 8080
sudo docker run -d --name nginx-server --restart always -p 8080:80 nginx:latest

# 4. Run PostgreSQL using the mounted volume for data
sudo docker run -d \
  --name postgres-server \
  --restart always \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -v /mnt/data/postgres:/var/lib/postgresql/data
  postgres:latest
EOF
```

You are now fully set up. Using your SSH tunnel, you can securely access the NGINX frontend via `localhost:8080` and the PostgreSQL database is also running.
