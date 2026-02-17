# Firebase + AWS Setup (Marathi)

## Firebase Setup

1. **Firebase Project Create Kara**: https://console.firebase.google.com
   - "Add Project" var click kara
   - Project name dya (terraform-ai)

2. **Firestore Database Enable Kara**:
   - Left menu madhye "Firestore Database" var click kara
   - "Create database" button dabava
   - "Start in production mode" select kara
   - Location: asia-south1 (Mumbai) select kara

3. **Service Account Key Download Kara**:
   - Settings (gear icon) > Project Settings
   - "Service Accounts" tab var jaa
   - "Generate New Private Key" button dabava
   - File download hoil - save it as `server/serviceAccountKey.json`

4. **Environment Variables Set Kara**:
   `.env` file madhye add kara:
   ```
   FIREBASE_SERVICE_ACCOUNT=<entire JSON content paste kara as single line>
   ```

## AWS Free Tier Deployment

### Prerequisites Install Kara:
```bash
pip install awsebcli
```

### Deployment Steps:

1. **Build Kara**:
```bash
npm run build
cd server
npm install
```

2. **EB Initialize Kara**:
```bash
eb init -p node.js-18 terraform-ai --region us-east-1
```

3. **Environment Create Kara (Free Tier)**:
```bash
eb create terraform-ai-env --single --instance-type t2.micro
```

4. **Environment Variables Set Kara**:
```bash
eb setenv GOOGLE_CLIENT_ID=your_google_client_id GOOGLE_CLIENT_SECRET=your_google_client_secret JWT_SECRET=your_jwt_secret SESSION_SECRET=your_session_secret FIREBASE_SERVICE_ACCOUNT='paste_json_here' FRONTEND_URL=http://your-app.elasticbeanstalk.com
```

5. **Deploy Kara**:
```bash
eb deploy
```

6. **App Open Kara**:
```bash
eb open
```

## Free Tier Limits:
- EC2: 750 hours/month (t2.micro instance)
- Firestore: 1GB storage, 50K reads/day, 20K writes/day
- Elastic Beanstalk: Free (fakt EC2 charges)

## Commands:
```bash
eb logs          # Logs bagha
eb status        # Status check kara
eb ssh           # Server madhye SSH kara
eb terminate     # Environment delete kara
```

## Important Notes:
- `server/serviceAccountKey.json` file git madhye commit nako karu
- Production madhye `FIREBASE_SERVICE_ACCOUNT` environment variable use kara
- Free tier limits monitor kara AWS Console madhye
