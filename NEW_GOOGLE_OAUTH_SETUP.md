# ✅ Google OAuth Setup Complete!

## ✅ Step 1: Google Cloud Console में जाएं
1. https://console.cloud.google.com पर जाएं
2. Sign in करें अपने Google account से

## ✅ Step 2: नया Project बनाएं
1. Top में project selector click करें
2. "New Project" click करें
3. Project name: `qr-emergency-app` ✅
4. "Create" click करें

## ✅ Step 3: APIs Enable करें
1. Left menu में "APIs & Services" > "Library"
2. Search करें "Google+ API" और enable करें
3. Search करें "People API" और enable करें

## ✅ Step 4: OAuth Consent Screen Setup
1. "APIs & Services" > "OAuth consent screen"
2. "External" select करें
3. Fill करें:
   - App name: `CloudArchitect`
   - User support email: `msshelke0505@gmail.com`
   - Developer contact: `msshelke0505@gmail.com`
4. "Save and Continue" सभी steps में

## ✅ Step 5: OAuth Credentials बनाएं
1. "APIs & Services" > "Credentials"
2. "Create Credentials" > "OAuth 2.0 Client ID"
3. Application type: "Web application"
4. Name: `CloudArchitect-Web-Client`
5. Authorized redirect URIs में add करें:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
6. "Create" click करें
7. Client ID और Client Secret copy करें ✅

## ✅ Step 6: .env.local Update करें
नए credentials को .env.local में paste करें:
```
GOOGLE_CLIENT_ID=61565400475-0bvuldko0vgocla8c05jjmn9navaljt1.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

## ✅ Step 7: Server Files Updated
- ✅ .env.local updated with new credentials
- ✅ server.js updated with new fallback credentials
- ✅ All OAuth configurations are now active

## 🚀 Final Step: Test करें
1. Server restart करें: `cd server && npm start`
2. Frontend restart करें: `npm run dev`
3. Google login try करें

---

## 📋 Current OAuth Configuration:
- **Project ID**: qr-emergency-app
- **Client ID**: 61565400475-0bvuldko0vgocla8c05jjmn9navaljt1.apps.googleusercontent.com
- **Redirect URI**: http://localhost:5000/api/auth/google/callback
- **Status**: ✅ Ready to use!