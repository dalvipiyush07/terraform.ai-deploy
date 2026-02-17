# terraa.online Deployment Guide

## 🌐 Domain Setup

### 1. DNS Configuration (Godaddy/Namecheap/etc)

Tumchya domain provider madhye jaa ani A Record add kara:

```
Type: A
Name: @
Value: YOUR_EC2_IP_ADDRESS
TTL: 600
```

Optional - www subdomain:
```
Type: A
Name: www
Value: YOUR_EC2_IP_ADDRESS
TTL: 600
```

DNS propagation la 5-30 minutes lagtat.

---

## 🚀 Deployment Commands

### AWS EC2 var files upload kara:
```bash
scp -i your-key.pem -r terraform.ai ec2-user@YOUR_EC2_IP:~/
```

### SSH kara:
```bash
ssh -i your-key.pem ec2-user@YOUR_EC2_IP
```

### Deploy kara (EK COMMAND!):
```bash
cd terraform.ai
chmod +x deploy.sh setup-ssl.sh
./deploy.sh
```

---

## 🔒 Real SSL Certificate (Let's Encrypt - FREE)

Deploy nantar SSL setup kara:

```bash
./setup-ssl.sh
```

Jeva prompt hoil teva enter kara: `terraa.online`

---

## ✅ Access Your App:

- **Main Site**: https://terraa.online
- **With www**: https://www.terraa.online

---

## 🔧 Google OAuth Update

Google Cloud Console madhye jaa:
1. https://console.cloud.google.com/apis/credentials
2. Tumcha OAuth Client edit kara
3. **Authorized redirect URIs** madhye add kara:
   - `https://terraa.online/api/auth/google/callback`
   - `https://www.terraa.online/api/auth/google/callback`

---

## 📊 Verify Deployment:

```bash
# Logs check kara
sudo docker-compose logs -f

# Status check kara
sudo docker-compose ps

# SSL certificate check kara
openssl s_client -connect terraa.online:443 -servername terraa.online
```

---

## 🔄 Update Code (Future Changes):

```bash
# Local machine var
scp -i key.pem -r terraform.ai ec2-user@YOUR_IP:~/

# Server var
cd terraform.ai
sudo docker-compose down
sudo docker-compose build --no-cache
sudo docker-compose up -d
```

---

## 🆓 AWS Free Tier:
- t2.micro instance: 750 hours/month
- 30GB storage
- Perfect for terraa.online!

---

## 🎉 That's It!

Tumcha app aata **https://terraa.online** var live ahe!
