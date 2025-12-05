# Deploy to Railway - Complete Guide

## Prerequisites

1. Railway account (sign up at https://railway.app)
2. GitHub account (to connect your repo)
3. Your code pushed to GitHub

---

## Option 1: Deploy via GitHub (Recommended)

### Step 1: Push Code to GitHub

```bash
cd /workspaces/siteperformance

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Site performance analyzer ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/siteperformance.git
git branch -M main
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Click "New Project" → "Empty Project"
3. Give it a name (e.g., "siteperformance")

### Step 3: Deploy Backend Service

1. In your project, click "+ New"
2. Select "GitHub Repo"
3. Select your `siteperformance` repository
4. **IMPORTANT**: Change the root directory to `/backend`
   - Click on the service → Settings → Service Settings
   - Set "Root Directory" to `backend`
5. Railway will detect `Dockerfile` and `railway.json`
6. Go to "Variables" tab and add:
   ```
   PORT=3001
   NODE_ENV=production
   ```
7. Go to Settings → Networking → Generate Domain
8. **Save this backend URL** (e.g., `backend-production-xxxx.up.railway.app`)

### Step 4: Deploy Frontend Service

1. In the same project, click "+ New" again
2. Select "GitHub Repo"
3. Select your `siteperformance` repository again
4. **IMPORTANT**: Change the root directory to `/frontend`
   - Click on the service → Settings → Service Settings
   - Set "Root Directory" to `frontend`
5. Go to "Variables" tab and add:
   ```
   VITE_API_URL=https://YOUR_BACKEND_URL
   ```
   (Replace with the backend URL from Step 3)
6. Go to Settings → Networking → Generate Domain
7. **This is your app URL!**

### Step 5: Update Backend CORS

1. Go back to the backend service
2. Add/update environment variable:
   ```
   FRONTEND_URL=https://YOUR_FRONTEND_URL
   ```
   (Replace with the frontend URL from Step 4)
3. Backend will automatically redeploy

### Step 6: Watch Deployment

Railway will automatically build and deploy both services. Watch the build logs:
- Backend takes ~5-10 minutes (installs Chromium)
- Frontend takes ~2-3 minutes

---

## Option 2: Deploy via Railway CLI

### Step 1: Install Railway CLI

```bash
npm i -g @railway/cli
```

### Step 2: Login

```bash
railway login
```

### Step 3: Initialize Project

```bash
cd /workspaces/siteperformance
railway init
```

Follow prompts to create a new project.

### Step 4: Link Services

```bash
# Railway will detect docker-compose.yml
railway up
```

### Step 5: Set Environment Variables

```bash
# For backend
railway variables set PORT=3001 NODE_ENV=production

# Get frontend URL and set it for backend
railway variables set FRONTEND_URL=<your-frontend-url>
```

---

## Important Configuration Notes

### 1. Backend Environment Variables

Required:
- `PORT=3001`
- `NODE_ENV=production`
- `FRONTEND_URL` - Your frontend URL (for CORS)

Optional:
- `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium` (already in Dockerfile)

### 2. Frontend Environment Variables

For production, the frontend needs to know the backend URL:
- `VITE_API_URL` - Your backend URL

The nginx.conf is configured to proxy `/api` requests, but for Railway you may need to update it.

### 3. Update Frontend API Calls

If using Railway's generated domains, you have two options:

**Option A: Use full backend URL**
Update `frontend/src/services/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function analyzeUrl(url) {
  const response = await fetch(`${API_URL}/analyze`, {
    // ... rest of code
  });
}
```

**Option B: Keep nginx proxy (current setup)**
The current nginx.conf proxies `/api` to `http://backend:3001`. For Railway, update nginx.conf to use environment variable:

Railway doesn't support nginx environment variables easily, so **Option A is recommended**.

---

## Troubleshooting

### Backend Takes Long to Deploy
- Normal! Puppeteer + Chromium takes 5-10 minutes first time
- Subsequent deploys are cached and faster

### CORS Errors
- Check `FRONTEND_URL` environment variable in backend
- Make sure it matches your frontend Railway domain exactly
- Include `https://` in the URL

### Backend Crashes / Out of Memory
- Railway free tier has memory limits
- Backend needs ~1GB RAM for Puppeteer
- Upgrade to Hobby plan ($5/month) if needed

### Frontend Can't Connect to Backend
- Check `VITE_API_URL` environment variable
- Rebuild frontend after changing environment variables
- Make sure backend domain is correct and includes `https://`

### 404 Errors on Frontend Routes
- Nginx is configured to serve React Router routes
- Should work automatically with the provided nginx.conf

---

## Cost on Railway

**Free Tier:**
- $5 credit per month
- Good for testing, may need upgrade for production

**Hobby Plan:**
- $5/month flat fee
- Usage-based after that
- Recommended for this app

**Estimated Monthly Cost:**
- Backend: ~$3-5/month (depends on usage)
- Frontend: ~$1-2/month
- Total: ~$5-7/month on Hobby plan

With GitHub Student Pack, you may get Railway credits too!

---

## Post-Deployment

### Custom Domain (Optional)

1. Go to Railway project → Frontend service → Settings → Networking
2. Click "Add Custom Domain"
3. Enter your domain (e.g., from Namecheap Student Pack)
4. Follow DNS instructions
5. SSL automatically provisioned

### Monitoring

Railway provides:
- Real-time logs
- Metrics dashboard
- Deployment history
- Resource usage graphs

### Auto-Deploy on Git Push

Railway automatically deploys when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
# Railway auto-deploys! 🚀
```

---

## Quick Reference Commands

```bash
# View logs
railway logs

# Check service status
railway status

# Open in browser
railway open

# SSH into container (for debugging)
railway run bash

# Redeploy
railway up --detach
```

---

## Success Checklist

- [ ] Both services deployed successfully
- [ ] Backend has environment variables set
- [ ] Frontend has VITE_API_URL set
- [ ] Can access frontend URL
- [ ] Can analyze a test URL (e.g., https://example.com)
- [ ] Results display correctly
- [ ] Export button works
- [ ] No CORS errors in console

---

## Need Help?

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- Check logs: `railway logs` or in Railway dashboard

---

**Congratulations! Your Site Performance Analyzer is now live! 🎉**
