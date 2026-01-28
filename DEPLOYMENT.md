# Vercel Deployment Guide - Paste Share

This guide will help you deploy the Paste Share application to Vercel.

## Prerequisites

1. **GitHub Repository** - Project must be pushed to GitHub (✅ Already done)
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Neon Database** - PostgreSQL database at [neon.tech](https://neon.tech)

## Step-by-Step Deployment

### Step 1: Get Your Database Connection String

1. Go to [neon.tech](https://neon.tech) and sign up (free tier available)
2. Create a new project
3. Go to "Connection details" → Copy the connection string
4. It will look like: `postgresql://user:password@host.us-east-1.aws.neon.tech/database?sslmode=require`
5. Save this - you'll need it in Step 4

### Step 2: Generate JWT Secret

Generate a secure random string for JWT signing:

**macOS/Linux:**
```bash
openssl rand -hex 32
```

**Windows PowerShell:**
```powershell
[System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Example output: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z`

Save this value - you'll need it in Step 4.

### Step 3: Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Paste your GitHub repository URL
4. Select your project and click "Continue"
5. Click "Deploy" (don't worry about env vars yet, we'll add them next)

Wait for the deployment to complete (usually 2-3 minutes).

### Step 4: Add Environment Variables in Vercel

1. After deployment completes, click the project
2. Go to **Settings → Environment Variables**
3. Add the following three variables:

| Name | Value | Notes |
|------|-------|-------|
| `DATABASE_URL` | Your Neon connection string | From Step 1 |
| `JWT_SECRET` | The random string you generated | From Step 2, use in production env |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Replace with your actual Vercel URL |

**To find your Vercel URL:**
- Go to your Vercel project
- Click "Domains" tab
- Copy the URL (looks like `your-project.vercel.app`)

4. Make sure all variables are set for: **Production**, **Preview**, and **Development**
5. Click "Save"

### Step 5: Redeploy with Environment Variables

1. Go back to your Vercel project dashboard
2. Click "Deployments" tab
3. Find the most recent deployment
4. Click the three-dot menu → "Redeploy"
5. Click "Redeploy" again to confirm

Wait for redeployment to complete.

### Step 6: Verify Deployment

1. Click the project URL to open your live app
2. Go through these checks:
   - ✅ Homepage loads without errors
   - ✅ Can sign up with a new account
   - ✅ Can log in with the account you just created
   - ✅ Can create a paste
   - ✅ Can view the paste with syntax highlighting
   - ✅ Dashboard shows your pastes
   - ✅ Theme toggle works
   - ✅ Share link works

**If something isn't working:**
- Check Vercel deployment logs: Project → Deployments → Click recent deployment → "Logs"
- Verify all three environment variables are set correctly
- Ensure Neon database is active and reachable

## Important Configuration Notes

### Database Setup
- **File-based fallback**: In development, pastes are stored in JSON files
- **Production**: Uses Neon PostgreSQL via Prisma ORM
- **No schema push needed**: Database schema is created automatically

### Security Checklist
- ✅ `.env.local` is in `.gitignore` (never committed)
- ✅ `JWT_SECRET` uses a strong random string
- ✅ Database connection uses SSL/TLS
- ✅ All sensitive variables in Vercel environment only
- ✅ Passwords hashed with bcryptjs

### Performance
- ✅ Next.js 16 with Turbopack for fast builds
- ✅ Syntax highlighting cached in browser
- ✅ Optimized images and fonts
- ✅ API routes with efficient database queries

## Troubleshooting

### "Database connection failed"
1. Verify `DATABASE_URL` in Vercel is exactly correct
2. Check Neon is active: neon.tech → Project → Check status
3. Ensure URL includes `?sslmode=require`
4. Wait 2-3 minutes after adding env var for Vercel to restart

### "Can't sign up/login"
1. Check `JWT_SECRET` is set in Vercel
2. Verify it's a non-empty string
3. Redeploy after changing

### "Pastes not saving"
1. Check `DATABASE_URL` is correct
2. Verify Neon database exists and is active
3. Check Vercel logs for database errors

### "App URL showing as localhost"
1. Update `NEXT_PUBLIC_APP_URL` to your Vercel domain
2. Redeploy the project

## Custom Domain (Optional)

To use your own domain instead of `vercel.app`:

1. In Vercel project → Settings → Domains
2. Enter your custom domain
3. Follow instructions for DNS configuration
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain
5. Redeploy

## Post-Deployment

### Monitor Your App
- Vercel Analytics: Project → Analytics tab
- Error tracking: Project → Logs → Function Logs
- Database monitoring: Neon → Project → Insights

### Scaling
- Free tier handles ~500 requests/minute
- Premium tier for higher traffic
- Database auto-scales on Neon free tier

### Backups
- Neon provides automatic backups
- Download data: `psql <DATABASE_URL> -c "SELECT * FROM Paste" > backup.sql`

## Next Steps

1. **Monitor initial traffic** - Watch error logs for the first week
2. **Share your app** - Get feedback from users
3. **Add custom domain** - Make it your own with a custom domain
4. **Enable analytics** - Track usage and performance

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**Your app is now live! 🚀**
