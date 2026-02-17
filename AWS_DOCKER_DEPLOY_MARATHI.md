# AWS Amazon Linux + Docker Deployment (Marathi)

## 🚀 Ek Command Made Sagla Setup!

### Prerequisites:
- AWS EC2 instance (Amazon Linux 2)
- Domain name (optional, for real SSL)

---

## Step 1: EC2 Instance Setup

1. **AWS Console madhye jaa**: https://console.aws.amazon.com/ec2
2. **Launch Instance** click kara
3. **Select**:
   - AMI: Amazon Linux 2
   - Instance Type: t2.micro (Free Tier)
   - Storage: 20GB
4. **Security Group** madhye ports open kara:
   - Port 22 (SSH)
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
5. **Key pair** download kara

---

## Step 2: Server var Files Upload Kara

```bash
# Local machine var (Git Bash/Terminal)
scp -i your-key.pem -r terraform.ai ec2-user@your-ec2-ip:~/
```

---

## Step 3: Server var SSH Kara

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

---

## Step 4: Ek Command Made Deploy Kara! 🎉

```bash
cd terraform.ai
chmod +x deploy.sh
./deploy.sh
```

**Done!** Tumcha app aata running ahe!

---

## Step 5: HTTPS Setup (Real SSL Certificate)

### Option A: Self-Signed SSL (Already Done)
- `deploy.sh` ne automatically self-signed certificate create kela
- Browser warning dakhvel, "Proceed Anyway" click kara

### Option B: Let's Encrypt (Production - Free Real SSL)

```bash
chmod +x setup-ssl.sh
./setup-ssl.sh
```

Domain name enter kara jeva prompt hoil.

---

## 🎯 Access Your App:

- **HTTP**: http://your-ec2-ip
- **HTTPS**: https://your-ec2-ip
- **With Domain**: https://yourdomain.com

---

## 📊 Useful Commands:

```bash
# Logs bagha
sudo docker-compose logs -f

# Restart kara
sudo docker-compose restart

# Stop kara
sudo docker-compose down

# Start kara
sudo docker-compose up -d

# Rebuild kara (code change nantar)
sudo docker-compose down
sudo docker-compose build --no-cache
sudo docker-compose up -d
```

---

## 🔧 Environment Variables Update

`.env` file edit kara:
```bash
nano .env
```

Changes nantar restart kara:
```bash
sudo docker-compose restart
```

---

## 🆓 AWS Free Tier Limits:
- EC2 t2.micro: 750 hours/month (1 instance 24/7)
- 30GB EBS storage
- 15GB data transfer out

---

## 🔒 Security Tips:
1. `.env` file git madhye commit nako karu
2. Strong JWT_SECRET ani SESSION_SECRET use kara
3. Security Group madhye fakt required ports open kara
4. Regular updates kara: `sudo yum update -y`

---

## 🐛 Troubleshooting:

**Container run nahi hot?**
```bash
sudo docker-compose logs app
```

**Port already in use?**
```bash
sudo docker-compose down
sudo docker ps -a
sudo docker rm -f $(sudo docker ps -aq)
```

**SSL error?**
```bash
cd ssl
ls -la
# Files ahet ka check kara
```

---

## 📝 Quick Deploy Summary:

```bash
# 1. SSH into server
ssh -i key.pem ec2-user@your-ip

# 2. Upload files (local machine var)
scp -i key.pem -r terraform.ai ec2-user@your-ip:~/

# 3. Deploy (server var)
cd terraform.ai
./deploy.sh

# 4. Setup real SSL (optional)
./setup-ssl.sh
```

**That's it!** 🎉
