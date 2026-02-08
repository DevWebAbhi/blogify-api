#!/bin/bash

# DEPLOYMENT_CHECKLIST.md - Pre-deployment verification steps

## Before Deploying to Render

### 1. Environment Variables ✅
- [ ] Create `.env` file with all required variables
- [ ] Never commit `.env` file to repository
- [ ] Verify all values are production-ready:
  - MONGO_URI=production MongoDB connection
  - JWT_SECRET=strong random secret (generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
  - CLOUDINARY_CLOUD_NAME=your cloud name
  - CLOUDINARY_API_KEY=your API key
  - CLOUDINARY_API_SECRET=your API secret
  - ALLOWED_ORIGINS=your frontend domains (comma-separated)

### 2. Code Quality ✅
- [ ] All console.logs reviewed (remove debug logs)
- [ ] Error messages don't expose sensitive information
- [ ] No hardcoded credentials or secrets in code
- [ ] Dependencies are up to date: `npm audit`

### 3. MongoDB ✅
- [ ] MongoDB Atlas connection string verified
- [ ] IP whitelist includes Render deployment IPs (0.0.0.0/0 or specific IPs)
- [ ] Database created and user has correct permissions
- [ ] Collections are indexed for performance

### 4. Cloudinary (if using) ✅
- [ ] Cloud name, API key, and secret verified
- [ ] Upload folder configured if needed
- [ ] File size limits set appropriately

### 5. Git & Repository ✅
- [ ] All changes committed: `git status`
- [ ] Branch is clean and up to date
- [ ] `.env` is in `.gitignore` ✅
- [ ] `node_modules/` is in `.gitignore` ✅

### 6. Package.json ✅
- [ ] Version updated if needed
- [ ] All production dependencies listed
- [ ] Scripts are correct (start command)
- [ ] Node version specified (>=18.0.0)

### 7. Testing ✅
- [ ] Run locally: `npm run dev`
- [ ] Test main endpoints
- [ ] Test authentication flow
- [ ] Test file uploads (if applicable)
- [ ] Check error handling

### 8. Deployment Setup ✅
- [ ] GitHub account connected to Render
- [ ] Repository is public or Render has access
- [ ] Render account created
- [ ] Build settings configured

### 9. Render Dashboard Setup ✅
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Environment variables added
- [ ] Auto-deploy from main branch enabled

### 10. Post-Deployment ✅
- [ ] Access health endpoint: `https://your-api.onrender.com/health`
- [ ] Test API endpoints with fresh JWT
- [ ] Monitor logs in Render dashboard
- [ ] Set up alerts for failures
- [ ] Add custom domain if applicable

## Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to https://render.com
   - Create new Web Service
   - Connect GitHub repository
   - Select `main` branch

3. **Configure Settings**
   - Set Build Command: `npm install`
   - Set Start Command: `npm start`
   - Add all environment variables

4. **Deploy**
   - Review settings
   - Click "Deploy"
   - Wait for deployment to complete

5. **Verify**
   - Check deployment logs
   - Test `/health` endpoint
   - Test main API endpoints
   - Monitor error logs

## Troubleshooting

If deployment fails:

1. **Check build logs** in Render dashboard
2. **Verify environment variables** are set correctly
3. **Check MongoDB connection** - ensure IP is whitelisted
4. **Review error logs** - tail logs in Render dashboard
5. **Check Node version** - ensure it's >= 18.0.0

Common issues:
- Missing environment variables → Add in Render dashboard
- MongoDB connection timeout → Whitelist 0.0.0.0/0 in MongoDB Atlas
- CORS errors → Update ALLOWED_ORIGINS environment variable
- Port binding errors → Render automatically assigns PORT

## Monitoring

After deployment:
- Monitor error logs regularly
- Set up alerts in Render
- Check health endpoint periodically
- Monitor MongoDB connection pool
- Review API response times

---

Last updated: 2026-02-08
