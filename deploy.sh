#!/bin/bash

echo "🚀 Starting Terraform.AI Deployment..."

# Update system
sudo yum update -y

# Install Docker
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create SSL directory
mkdir -p ssl

# Generate self-signed SSL certificate (replace with Let's Encrypt later)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem \
  -subj "/C=IN/ST=Maharashtra/L=Mumbai/O=TerraformAI/CN=localhost"

# Create .env file if not exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your credentials"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)
export DOMAIN=${DOMAIN:-localhost}

# Build and start containers
echo "🐳 Building Docker containers..."
sudo docker-compose down
sudo docker-compose build --no-cache
sudo docker-compose up -d

echo "✅ Deployment Complete!"
echo "🌐 Access your app at: https://${DOMAIN}"
echo "📊 Check logs: sudo docker-compose logs -f"
