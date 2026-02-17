#!/bin/bash

# Install Certbot
sudo yum install certbot -y

# Get domain from user
read -p "Enter your domain name (e.g., example.com): " DOMAIN

# Stop nginx temporarily
sudo docker-compose stop nginx

# Get SSL certificate
sudo certbot certonly --standalone -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

# Copy certificates
sudo mkdir -p ssl
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem ssl/key.pem
sudo chmod 644 ssl/*.pem

# Update .env with domain
echo "DOMAIN=$DOMAIN" >> .env

# Restart nginx
sudo docker-compose up -d nginx

echo "✅ SSL Certificate installed for $DOMAIN"
echo "🔒 Your site is now secured with HTTPS"

# Setup auto-renewal
(crontab -l 2>/dev/null; echo "0 0 1 * * certbot renew --quiet && docker-compose restart nginx") | crontab -
