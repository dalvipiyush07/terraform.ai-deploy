#!/bin/bash

echo "🔧 Fixing deployment issues..."

# Install cronie for crontab
sudo yum install cronie -y
sudo systemctl start crond
sudo systemctl enable crond

# Update Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker-compose version

# Rebuild containers
echo "🐳 Rebuilding containers..."
sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d

# Setup auto-renewal
(sudo crontab -l 2>/dev/null; echo "0 0 1 * * certbot renew --quiet && cd /home/ec2-user/terraform.ai-deploy && docker-compose restart nginx") | sudo crontab -

echo "✅ Fixed! Checking status..."
sudo docker-compose ps
sudo docker-compose logs --tail=50

echo ""
echo "🌐 Access: https://terraa.online"
