# Google OAuth Setup Instructions

## Current Error: redirect_uri_mismatch

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com
2. Select your project or create a new one

### Step 2: Enable Google+ API
1. Go to "APIs & Services" > "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google OAuth2 API"

### Step 3: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill required fields:
   - App name: CloudArchitect
   - User support email: your email
   - Developer contact: your email
4. Save and continue through all steps

### Step 4: Create/Edit OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Add these Authorized redirect URIs:
   ```
   http://localhost:5000/api/auth/google/callback
   http://127.0.0.1:5000/api/auth/google/callback
   ```
5. Save and copy Client ID and Client Secret

### Step 5: Update .env.local
Replace the values in .env.local with your new credentials:
```
GOOGLE_CLIENT_ID=your_new_client_id
GOOGLE_CLIENT_SECRET=your_new_client_secret
```

### Current Configuration:
- Client ID: 583987670801-jb44jt44pu9k6pcabd36d7f024f23p4b.apps.googleusercontent.com
- Callback URL: http://localhost:5000/api/auth/google/callback
- Frontend URL: http://localhost:3000

### If still getting error:
1. Clear browser cache
2. Try incognito mode
3. Wait 5-10 minutes after making changes in Google Console
4. Restart both frontend and backend servers