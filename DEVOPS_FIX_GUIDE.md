# DevOps Projects Fix - Step by Step 🔧

## Problem
Admin panel मधून DevOps projects add केल्यावर ते main website मध्ये दिसत नाहीत.

## Solution - Follow These Steps EXACTLY:

### Step 1: Backend Server Restart करा ⚠️ IMPORTANT!

```bash
# Terminal 1
cd server
npm start
```

**Wait until you see:** `Server running on port 5000`

### Step 2: Test करा की API काम करतोय का

**Option A - Browser मध्ये:**
1. Open: `test-devops-api.html` file (double click)
2. Click "Test GET Projects" button
3. तुम्हाला 3 sample projects दिसायला हवेत

**Option B - Browser URL:**
```
http://localhost:5000/api/devops-projects
```
तुम्हाला JSON response दिसायला हवा

### Step 3: Admin Panel Start करा

```bash
# Terminal 2
cd admin-panel
npm run dev
```

Open: http://localhost:4000

### Step 4: Main Website Start करा

```bash
# Terminal 3 (root folder मध्ये)
npm run dev
```

Open: http://localhost:3000

### Step 5: Admin Panel मध्ये Project Add करा

1. Go to: http://localhost:4000
2. Click: "Content Management"
3. Click: "DevOps" tab
4. Click: "Add Project" button
5. Fill details:
   ```
   Title: My Test Project
   Description: Testing DevOps sync
   GitHub URL: https://github.com/test/project
   Tags: Docker, Kubernetes
   Icon: 🚀
   Difficulty: Beginner
   ```
6. Click: "Save"

### Step 6: Main Website मध्ये Check करा

1. Go to: http://localhost:3000
2. Login करा (if not logged in)
3. Sidebar मध्ये "DevOps Projects" button दाबा
4. तुमचा नवीन project दिसायला हवा! ✅

## Troubleshooting 🔍

### Problem: Projects दिसत नाहीत

**Check 1: Backend Server चालू आहे का?**
```bash
# New terminal
curl http://localhost:5000/api/devops-projects
```
Response मिळायला हवा

**Check 2: File exist करते का?**
```bash
cd server/database
dir devops_projects.json
```
File असायला हवी

**Check 3: Browser Console Check करा**
1. Press F12
2. Go to Console tab
3. काही errors आहेत का बघा

**Check 4: Network Tab Check करा**
1. Press F12
2. Go to Network tab
3. DevOps Projects button दाबा
4. `/api/devops-projects` call दिसायला हवा
5. Status 200 असायला हवा

### Problem: CORS Error

Backend server च्या CORS settings check करा:
```javascript
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:4000'], 
  credentials: true 
}));
```

### Problem: Connection Refused

Backend server restart करा:
```bash
cd server
# Ctrl+C to stop
npm start
```

## Verification Checklist ✅

- [ ] Backend server चालू आहे (port 5000)
- [ ] `devops_projects.json` file exist करते
- [ ] API test केली (browser किंवा curl)
- [ ] Admin panel चालू आहे (port 4000)
- [ ] Main website चालू आहे (port 3000)
- [ ] Admin panel मध्ये project add केलं
- [ ] Main website मध्ये project दिसतं

## Quick Test Commands

```bash
# Test 1: Check if backend is running
curl http://localhost:5000/api/devops-projects

# Test 2: Add a test project
curl -X POST http://localhost:5000/api/devops-projects ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"CLI Test\",\"description\":\"Test from command line\",\"githubUrl\":\"https://github.com/test\",\"tags\":[\"test\"],\"icon\":\"🧪\",\"difficulty\":\"Beginner\"}"

# Test 3: Check if project was added
curl http://localhost:5000/api/devops-projects
```

## Files Changed

1. ✅ `server/server.js` - DevOps API endpoints added
2. ✅ `server/database/devops_projects.json` - Database file created
3. ✅ `admin-panel/app/content/page.tsx` - Uses backend API
4. ✅ `components/DevOpsGallery.tsx` - Uses backend API

## Important Notes

⚠️ **Backend server MUST be running** for this to work!  
⚠️ **Restart backend server** after any changes to server.js  
⚠️ **Both applications** (admin + website) use same backend  
⚠️ **No localStorage** - everything is in database now  

## Success Indicators

✅ Backend logs: `Server running on port 5000`  
✅ API test returns JSON array  
✅ Admin panel shows projects list  
✅ Main website shows same projects  
✅ Adding project in admin panel → instantly visible in website  

---

**Still not working?** 

1. Stop ALL servers (Ctrl+C in all terminals)
2. Delete `node_modules` in server folder
3. Run `npm install` in server folder
4. Start backend server again
5. Try again!
