#!/bin/bash

# Get the directory of the current script to reliably locate the examples folder
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 1. Sync the examples directory to the VM (requires rsync installed locally)
# We exclude node_modules to ensure the VM builds its own dependencies for its specific architecture.
echo "Syncing files to the VM..."
rsync -avz --exclude 'node_modules' "$DIR/../examples/" oci-vm:~/examples/

# 2. SSH into the VM, check architecture, and deploy using Docker Compose
echo "Connecting to VM to deploy..."
ssh -o StrictHostKeyChecking=no oci-vm << 'EOF'
  # Check and log the VM Architecture
  ARCH=$(uname -m)
  echo "Detected VM Architecture: $ARCH"
  
  # Navigate to the synced directory
  cd ~/examples
  
  # Stop existing containers, build new images, and start services
  echo "Building and starting Docker containers..."
  sudo docker compose down
  sudo docker compose up --build -d
  
  # Cleanup unused dangling images to save disk space
  sudo docker image prune -f
EOF

echo "Deployment complete! You can access the apps via the SSH tunnel."
