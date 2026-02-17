# 🚀 AWS Docker Deployment - Step by Step Guide (Marathi)

## 📋 Prerequisites
- AWS Account
- Domain: terraa.online
- Git repository: https://github.com/dalvipiyush07/terraform.ai-deploy

---

## STEP 1: AWS EC2 Instance Create Kara

### 1.1 AWS Console madhye Login kara
- https://console.aws.amazon.com

### 1.2 EC2 Dashboard var jaa
- Services > EC2 > Launch Instance

### 1.3 Instance Configuration:
```
Name: terraform-ai-server
AMI: Amazon Linux 2 (Free Tier)
Instance Type: t2.micro (Free Tier)
Key Pair: Create new key pair
  - Name: terraform-ai-key
  - Type: RSA
  - Format: .pem
  - Download and save it!
```

### 1.4 Network Settings:
Security Group madhye ports open kara:
```
SSH     - Port 22   - Source: My IP
HTTP    - Port 80   - Source: 0.0.0.0/0
HTTPS   - Port 443  - Source: 0.0.0.0/0
```

### 1.5 Storage:
```
20 GB (Free Tier limit)
```

### 1.6 Launch Instance button click kara

### 1.7 Instance IP Copy kara
- Instance select kara
- Public IPv4 address copy kara (e.g., 13.234.56.78)

---

## STEP 2: Domain DNS Setup

### 2.1 Domain Provider madhye jaa (Godaddy/Namecheap/etc)

### 2.2 DNS Records add kara:
```
Type: A
Name: @
Value: YOUR_EC2_IP (e.g., 13.234.56.78)
TTL: 600

Type: A
Name: www
Value: YOUR_EC2_IP
TTL: 600
```

### 2.3 Wait kara
- DNS propagation la 5-30 minutes lagtat
- Check kara: ping terraa.online

---

## STEP 3: Local Machine var Preparation

### 3.1 Key file permissions set kara (Git Bash madhye):
```bash
chmod 400 terraform-ai-key.pem
```

### 3.2 .env file update kara:
```bash
cd terraform.ai
nano .env
```

Update kara:
```
DOMAIN=terraa.online
FRONTEND_URL=https://terraa.online
GOOGLE_CALLBACK_URL=https://terraa.online/api/auth/google/callback
JWT_SECRET=your_strong_random_secret_here
SESSION_SECRET=your_another_strong_secret_here
```

Save kara: Ctrl+O, Enter, Ctrl+X

### 3.3 Files server var upload kara:
```bash
scp -i terraform-ai-key.pem -r terraform.ai ec2-user@YOUR_EC2_IP:~/
```

Example:
```bash
scp -i terraform-ai-key.pem -r terraform.ai ec2-user@13.234.56.78:~/
```

---

## STEP 4: Server var SSH Kara

```bash
ssh -i terraform-ai-key.pem ec2-user@YOUR_EC2_IP
```

Example:
```bash
ssh -i terraform-ai-key.pem ec2-user@13.234.56.78
```

---

## STEP 5: Server Setup (EK COMMAND!)

### 5.1 Project folder madhye jaa:
```bash
cd terraform.ai
```

### 5.2 Deploy script executable banava:
```bash
chmod +x deploy.sh setup-ssl.sh
```

### 5.3 Deploy kara (Sagla automatic hoil!):
```bash
./deploy.sh
```

**Wait kara 5-10 minutes...**

He script:
- Docker install karel
- Docker Compose install karel
- Self-signed SSL certificate create karel
- Containers build ani start karel

---

## STEP 6: HTTPS Setup (Real SSL Certificate - FREE!)

### 6.1 Let's Encrypt SSL install kara:
```bash
./setup-ssl.sh
```

### 6.2 Domain enter kara jeva prompt hoil:
```
Enter your domain name: terraa.online
```

### 6.3 Wait kara...
SSL certificate automatically install hoil!

---

## STEP 7: Verify Deployment

### 7.1 Check containers:
```bash
sudo docker-compose ps
```

Output asa disel:
```
NAME                COMMAND                  STATUS
terraform-ai        "sh -c 'cd server &&…"   Up
nginx-proxy         "/docker-entrypoint.…"   Up
```

### 7.2 Check logs:
```bash
sudo docker-compose logs -f
```

Ctrl+C press kara to exit

### 7.3 Browser madhye open kara:
```
https://terraa.online
```

---

## STEP 8: Google OAuth Update

### 8.1 Google Cloud Console madhye jaa:
- https://console.cloud.google.com/apis/credentials

### 8.2 Tumcha OAuth Client edit kara

### 8.3 Authorized redirect URIs madhye add kara:
```
https://terraa.online/api/auth/google/callback
https://www.terraa.online/api/auth/google/callback
```

### 8.4 Save kara

---

## ✅ DEPLOYMENT COMPLETE!

Tumcha app aata live ahe:
- 🌐 https://terraa.online
- 🔒 HTTPS enabled
- 🐳 Docker containers running
- 🔥 Firebase database connected

---

## 📊 Useful Commands

### Logs bagha:
```bash
sudo docker-compose logs -f
```

### Restart kara:
```bash
sudo docker-compose restart
```

### Stop kara:
```bash
sudo docker-compose down
```

### Start kara:
```bash
sudo docker-compose up -d
```

### Rebuild kara (code change nantar):
```bash
sudo docker-compose down
sudo docker-compose build --no-cache
sudo docker-compose up -d
```

### Server status check kara:
```bash
sudo docker-compose ps
sudo systemctl status docker
```

### SSL certificate check kara:
```bash
sudo certbot certificates
```

### SSL auto-renewal test kara:
```bash
sudo certbot renew --dry-run
```

---

## 🔄 Code Update Kasa Karaycha (Future)

### Local machine var:
```bash
# 1. Code changes kara
# 2. Git push kara
git add .
git commit -m "Updated code"
git push

# 3. Server var upload kara
scp -i terraform-ai-key.pem -r terraform.ai ec2-user@YOUR_EC2_IP:~/
```

### Server var:
```bash
# 1. SSH kara
ssh -i terraform-ai-key.pem ec2-user@YOUR_EC2_IP

# 2. Project folder madhye jaa
cd terraform.ai

# 3. Git pull kara (if using git)
git pull

# 4. Rebuild kara
sudo docker-compose down
sudo docker-compose build --no-cache
sudo docker-compose up -d

# 5. Logs check kara
sudo docker-compose logs -f
```

---

## 🐛 Troubleshooting

### Problem: Container start nahi hot
```bash
sudo docker-compose logs app
sudo docker ps -a
```

### Problem: Port already in use
```bash
sudo docker-compose down
sudo lsof -i :80
sudo lsof -i :443
```

### Problem: SSL error
```bash
cd ssl
ls -la
# cert.pem ani key.pem files ahet ka check kara
```

### Problem: DNS not working
```bash
ping terraa.online
nslookup terraa.online
# DNS propagation wait kara (30 mins max)
```

### Problem: Firebase connection error
```bash
# .env file check kara
cat .env | grep FIREBASE
# Restart kara
sudo docker-compose restart
```

### Problem: Out of memory
```bash
free -h
sudo docker system prune -a
```

---

## 🔒 Security Best Practices

1. **SSH Key secure theva**:
   ```bash
   chmod 400 terraform-ai-key.pem
   ```

2. **Regular updates kara**:
   ```bash
   sudo yum update -y
   ```

3. **Firewall check kara**:
   ```bash
   sudo iptables -L
   ```

4. **Secrets rotate kara** (monthly):
   - JWT_SECRET
   - SESSION_SECRET
   - Firebase keys

5. **Backups ghya**:
   ```bash
   # Firestore automatic backup ahe
   # Code backup: Git repository
   ```

---

## 💰 AWS Free Tier Limits

- **EC2 t2.micro**: 750 hours/month (24/7 for 1 instance)
- **Storage**: 30 GB
- **Data Transfer**: 15 GB/month outbound
- **Elastic IP**: Free (if attached to running instance)

---

## 📞 Support

Problem asel tar:
1. Logs check kara: `sudo docker-compose logs -f`
2. GitHub Issues: https://github.com/dalvipiyush07/terraform.ai-deploy/issues
3. AWS Support: https://console.aws.amazon.com/support

---

## 🎉 Congratulations!

Tumcha **terraa.online** aata live ahe with:
- ✅ Docker containers
- ✅ HTTPS/SSL
- ✅ Firebase database
- ✅ AWS Free Tier
- ✅ Auto-scaling ready
- ✅ Production ready!

**Happy Deploying! 🚀**
