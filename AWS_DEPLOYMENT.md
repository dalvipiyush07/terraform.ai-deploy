# AWS Free Tier Deployment Guide

## Prerequisites
1. AWS Account (Free Tier eligible)
2. Firebase Project setup
3. EB CLI installed: `pip install awsebcli`

## Firebase Setup

1. **Create Firebase Project**: https://console.firebase.google.com
2. **Enable Firestore Database** (Start in production mode)
3. **Download Service Account Key**:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save as `server/serviceAccountKey.json`
4. **Update .env**:
   ```
   FIREBASE_SERVICE_ACCOUNT=<paste entire JSON content as single line>
   ```

## AWS Deployment Steps

### 1. Build Frontend
```bash
npm run build
```

### 2. Initialize EB
```bash
eb init -p node.js-18 terraform-ai --region us-east-1
```

### 3. Create Environment (Free Tier)
```bash
eb create terraform-ai-env --single --instance-type t2.micro
```

### 4. Set Environment Variables
```bash
eb setenv GOOGLE_CLIENT_ID=your_id \
  GOOGLE_CLIENT_SECRET=your_secret \
  JWT_SECRET=your_jwt_secret \
  SESSION_SECRET=your_session_secret \
  FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}' \
  FRONTEND_URL=http://your-eb-url.elasticbeanstalk.com
```

### 5. Deploy
```bash
eb deploy
```

### 6. Open App
```bash
eb open
```

## Free Tier Limits
- **EC2**: 750 hours/month (t2.micro)
- **Elastic Beanstalk**: Free
- **Firestore**: 1GB storage, 50K reads/day, 20K writes/day

## Cost Optimization
- Use single instance (--single flag)
- Enable auto-scaling only if needed
- Monitor Firebase usage
- Use CloudWatch free tier for monitoring

## Troubleshooting
```bash
eb logs          # View logs
eb status        # Check status
eb ssh           # SSH into instance
```
