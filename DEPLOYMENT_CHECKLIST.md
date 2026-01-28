# Vercel Deployment Checklist

Use this checklist to ensure your app is ready for production deployment.

## Pre-Deployment Checklist ✅

### Code & Repository
- [x] Code pushed to GitHub (verified)
- [ ] All changes committed and pushed
- [ ] No sensitive data in code (passwords, API keys, etc.)
- [ ] `.env.local` is in `.gitignore` (verified)
- [ ] `node_modules/` is in `.gitignore` (verified)

### Environment Variables
- [ ] **DATABASE_URL** - Neon PostgreSQL connection string obtained
  - Instructions: https://neon.tech → Create Project → Connection Details
  - Format check: Starts with `postgresql://`, includes `sslmode=require`
  
- [ ] **JWT_SECRET** - Secure random string generated
  - Generate: `openssl rand -hex 32` (Linux/Mac)
  - Or: `[System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))` (Windows)
  - Length: At least 32 characters
  
- [ ] **NEXT_PUBLIC_APP_URL** - Will be set after deployment
  - Format: `https://your-domain.vercel.app`

### Database Setup
- [ ] Neon account created (https://neon.tech)
- [ ] Neon project created
- [ ] Database is active and accessible
- [ ] Connection string is secure and includes SSL

### Testing
- [ ] Local dev server runs: `npm run dev`
- [ ] Can sign up locally
- [ ] Can log in locally
- [ ] Can create a paste locally
- [ ] Can view pastes with syntax highlighting
- [ ] Dashboard shows user's pastes
- [ ] Theme toggle works
- [ ] Dark and light modes render correctly
- [ ] Responsive design works on mobile

## Deployment Steps

### Step 1: Create Neon Database
- [ ] Go to https://neon.tech and sign up
- [ ] Create a new project
- [ ] Go to "Connection details"
- [ ] Copy connection string (looks like: `postgresql://user:password@...`)
- [ ] Store this value - you'll need it in Step 3

### Step 2: Generate JWT Secret
- [ ] Run one of these commands:
  - macOS/Linux: `openssl rand -hex 32`
  - Windows PowerShell: `[System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`
- [ ] Copy the output
- [ ] Store this value - you'll need it in Step 3

### Step 3: Create Vercel Project
- [ ] Go to https://vercel.com/new
- [ ] Click "Import Git Repository"
- [ ] Paste your GitHub repository URL
- [ ] Select your GitHub repository
- [ ] Click "Continue"
- [ ] Accept project name (or change if desired)
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete (2-3 minutes)

### Step 4: Add Environment Variables in Vercel
- [ ] After deployment, go to your Vercel project
- [ ] Click "Settings" → "Environment Variables"
- [ ] Add **DATABASE_URL**
  - Name: `DATABASE_URL`
  - Value: Your Neon connection string (from Step 1)
  - Select: Production, Preview, Development
  - Click "Save"
  
- [ ] Add **JWT_SECRET**
  - Name: `JWT_SECRET`
  - Value: Your generated random string (from Step 2)
  - Select: Production, Preview, Development
  - Click "Save"
  
- [ ] Add **NEXT_PUBLIC_APP_URL**
  - Name: `NEXT_PUBLIC_APP_URL`
  - Value: Your Vercel project URL (e.g., `https://paste-share.vercel.app`)
  - To find it: Project → Domains tab (copy the URL)
  - Select: Production, Preview, Development
  - Click "Save"

### Step 5: Redeploy
- [ ] Go to "Deployments" tab
- [ ] Click the three-dot menu on the latest deployment
- [ ] Click "Redeploy"
- [ ] Wait for redeploy to complete

## Post-Deployment Verification ✅

### Functionality Tests
- [ ] App loads without errors
- [ ] Can sign up with a new account
- [ ] Can log in with test account
- [ ] Can create a paste
- [ ] Paste displays with syntax highlighting
- [ ] Share link works and pre-fills correctly
- [ ] Copy code button works
- [ ] Copy link button works
- [ ] Dashboard shows all created pastes
- [ ] Theme toggle works in production
- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] Responsive design on mobile
- [ ] Can create another paste from paste view

### Performance & Monitoring
- [ ] Page loads in under 3 seconds
- [ ] No JavaScript errors in browser console
- [ ] Check Vercel logs for deployment errors: Project → Deployments → View Logs
- [ ] Test with slow 3G network (Chrome DevTools)

## Troubleshooting

### Issue: "Database connection failed"
**Solution:**
1. Verify `DATABASE_URL` is exactly correct in Vercel
2. Check Neon project is active
3. Ensure URL includes `?sslmode=require`
4. Wait 2-3 minutes for Vercel to restart
5. Redeploy

### Issue: "Cannot sign in / login not working"
**Solution:**
1. Verify `JWT_SECRET` is set in Vercel
2. Ensure it's not empty and is a long string
3. Redeploy

### Issue: "Pastes not saving"
**Solution:**
1. Check `DATABASE_URL` points to correct Neon database
2. Verify Neon database is active
3. Check Vercel deployment logs for errors
4. Ensure database user has proper permissions

### Issue: "App URL showing as localhost"
**Solution:**
1. Update `NEXT_PUBLIC_APP_URL` in Vercel to your production URL
2. Redeploy the project

### Issue: "Build failed"
**Solution:**
1. Check Vercel build logs: Project → Deployments → View Logs
2. Fix any TypeScript or build errors
3. Push fixes to GitHub
4. Vercel will auto-redeploy

## Optimization Tips (Optional)

### Custom Domain
- [ ] Purchase domain from registrar (Vercel, Namecheap, etc.)
- [ ] Add to Vercel: Settings → Domains
- [ ] Follow DNS configuration instructions
- [ ] Update `NEXT_PUBLIC_APP_URL` to custom domain
- [ ] Redeploy

### Monitoring
- [ ] Enable Vercel Analytics: Settings → Analytics
- [ ] Monitor: Project → Analytics tab
- [ ] Check errors: Project → Logs → Function Logs

### Performance
- [ ] Check Core Web Vitals: Project → Analytics
- [ ] Lighthouse score should be 90+

## Success Criteria 🎉

Your deployment is successful when:
- ✅ App is live at Vercel URL
- ✅ All environment variables are set
- ✅ Can sign up and log in
- ✅ Can create and view pastes
- ✅ Dashboard shows user's pastes
- ✅ Share links work
- ✅ No console errors
- ✅ Database is working

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: Check your repository issues

---

**You're all set! Your Paste Share app is now live in production. 🚀**
