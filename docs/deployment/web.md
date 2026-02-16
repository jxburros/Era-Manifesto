# Web Deployment Guide

Complete guide for deploying Era Manifesto to web hosting platforms.

---

## 🎯 Quick Deploy (Recommended)

### Firebase Hosting

```bash
# Build the app
npm run build

# Deploy
firebase deploy --only hosting
```

Your app will be live at: `https://YOUR-PROJECT-ID.web.app`

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Platform Guides](#platform-guides)
  - [Firebase Hosting](#firebase-hosting-recommended)
  - [Netlify](#netlify)
  - [Vercel](#vercel)
  - [GitHub Pages](#github-pages)
- [Deploy Branch Workflow](#deploy-branch-workflow)
- [Environment Configuration](#environment-configuration)
- [Custom Domains](#custom-domains)
- [Continuous Deployment](#continuous-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Node.js v16+ installed
- ✅ Project dependencies installed: `npm install`
- ✅ Build succeeds locally: `npm run build`
- ✅ Firebase project configured (see `FIREBASE_SETUP.md`)
- ✅ `src/firebase-config.js` properly configured

---

## Platform Guides

### Firebase Hosting (Recommended)

Firebase Hosting is recommended because it integrates seamlessly with Firebase Authentication and Firestore.

#### Initial Setup

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting** (if not already done)
   ```bash
   firebase init hosting
   ```
   
   When prompted:
   - Select your existing Firebase project
   - Public directory: `dist`
   - Configure as single-page app: **Yes**
   - Set up automatic builds with GitHub: Your choice (see [CI/CD](#continuous-deployment))
   - Don't overwrite `dist/index.html`: **No**

#### Deploy

```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting
```

#### Your App URL

After deployment:
- Default: `https://YOUR-PROJECT-ID.web.app`
- Alternative: `https://YOUR-PROJECT-ID.firebaseapp.com`

#### Update Deployment

```bash
npm run build
firebase deploy --only hosting
```

#### Advanced Options

```bash
# Deploy to a specific site (multi-site hosting)
firebase deploy --only hosting:SITE_ID

# Deploy with a custom message
firebase deploy --only hosting -m "Deployed new features"

# Preview before deploying
firebase hosting:channel:deploy preview-branch
```

---

### Netlify

Deploy to Netlify for simple, free hosting with automatic deployments.

#### Method A: Deploy via Netlify UI (Easiest)

1. Go to [Netlify](https://www.netlify.com/)
2. Sign up/Login with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect to your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**: Add any needed variables
6. Click **"Deploy"**

#### Method B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Initialize** (first time only)
   ```bash
   netlify init
   ```

4. **Build and deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

#### Configuration File

Create `netlify.toml` (already included):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Vercel

Deploy to Vercel for fast, optimized React deployments.

#### Method A: Deploy via Vercel UI

1. Go to [Vercel](https://vercel.com/)
2. Sign up/Login with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your GitHub repository
5. Configure (auto-detected for Vite):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **"Deploy"**

#### Method B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```
   
   Follow the prompts to link to your project.

#### Configuration File

Create `vercel.json` (already included):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### GitHub Pages

Deploy directly from your GitHub repository for free static hosting.

#### Setup

1. **Install gh-pages package**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   
   Add these scripts:
   ```json
   {
     "homepage": "https://YOUR-USERNAME.github.io/Era-Manifesto",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.js**
   
   Add base path:
   ```javascript
   export default defineConfig({
     base: '/Era-Manifesto/',
     // ... rest of config
   })
   ```

#### Deploy

```bash
npm run deploy
```

#### Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Source: Deploy from branch **`gh-pages`**
3. Click **Save**

Your app will be live at: `https://YOUR-USERNAME.github.io/Era-Manifesto`

#### Note on Base Path

GitHub Pages requires a base path. If deploying to a custom domain or organization GitHub Pages (username.github.io), you can remove the `base` setting from vite.config.js.

---

## Deploy Branch Workflow

A special `deploy` branch can streamline your deployment process by maintaining a clean, deployment-ready version of your code.

### What is the Deploy Branch?

The `deploy` branch contains only production-essential files:
- ✅ Source code (`src/`)
- ✅ Build configuration
- ✅ Dependencies (`package.json`)
- ✅ Deployment configs
- ❌ Development files (`.eslintrc.cjs`, etc.)

### Automatic Synchronization

A GitHub Actions workflow automatically keeps the `deploy` branch synchronized with `main`:

1. **Trigger**: Whenever you push to `main`
2. **Sync**: Changes are merged into `deploy`
3. **Cleanup**: Development-only files are removed
4. **Push**: Updated `deploy` branch is pushed

### Manual Trigger

Trigger the sync manually:

1. Go to your repository on GitHub
2. Navigate to **Actions** tab
3. Select **"Sync Deploy Branch"** workflow
4. Click **"Run workflow"**

### Using the Deploy Branch

#### Option 1: Deploy from GitHub

Configure your hosting platform to deploy from the `deploy` branch instead of `main`:

- **Netlify**: Select `deploy` branch in site settings
- **Vercel**: Choose `deploy` branch during project import
- **Firebase**: Configure GitHub Actions to deploy from `deploy`

#### Option 2: Clone and Deploy

```bash
# Clone only the deploy branch
git clone -b deploy https://github.com/YOUR-USERNAME/Era-Manifesto.git era-manifesto-deploy
cd era-manifesto-deploy

# Install and build
npm install --production
npm run build

# Deploy
firebase deploy --only hosting
```

### Benefits

1. **Cleaner Repository**: Only deployment-essential files
2. **Smaller Clone Size**: Faster CI/CD pipelines
3. **Automatic Updates**: Always in sync with main
4. **Separation of Concerns**: Clear dev vs. production environments

### Deploy Branch Workflow Diagram

```
┌─────────────────┐
│  Development    │
│   on main       │
└────────┬────────┘
         │
         │ Push to main
         │
         ▼
┌─────────────────────┐
│  GitHub Actions     │
│  Auto-trigger sync  │
└────────┬────────────┘
         │
         │ Merge + Cleanup
         │
         ▼
┌─────────────────┐
│ deploy branch   │
│ (prod-ready)    │
└────────┬────────┘
         │
         │ Deploy from here
         │
         ▼
┌─────────────────┐
│ Hosting Platform│
└─────────────────┘
```

### Customizing

Edit `.github/workflows/sync-deploy-branch.yml` to customize which files are included/excluded.

---

## Environment Configuration

### Firebase Configuration

Your Firebase config is in `src/firebase-config.js`. Keep this secure:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Environment Variables

For platform-specific environment variables:

#### Netlify
Add in **Site settings** → **Build & deploy** → **Environment**

#### Vercel  
Add in **Project settings** → **Environment Variables**

#### GitHub Actions
Add as **Repository secrets** in **Settings** → **Secrets**

### Variable Format

If using Vite environment variables:
- Prefix with `VITE_`
- Access via `import.meta.env.VITE_VARIABLE_NAME`

---

## Custom Domains

### Firebase Hosting

1. Go to **Firebase Console** → **Hosting**
2. Click **"Add custom domain"**
3. Enter your domain
4. Follow DNS configuration steps
5. Wait for SSL certificate provisioning (can take 24-48 hours)

### Netlify

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain
4. Update DNS records as instructed
5. SSL is automatic via Let's Encrypt

### Vercel

1. Go to **Project settings** → **Domains**
2. Add your domain
3. Configure DNS with your provider
4. Vercel automatically provisions SSL

### DNS Configuration

For all platforms, you typically need to add:
- **A record** pointing to the platform's IP, or
- **CNAME record** pointing to the platform's domain

---

## Continuous Deployment

### GitHub Actions with Firebase

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: YOUR_PROJECT_ID
```

### Netlify Auto-Deploy

Netlify automatically deploys on push to your connected branch. Configure in:
- **Site settings** → **Build & deploy** → **Continuous Deployment**

### Vercel Auto-Deploy

Vercel automatically deploys on push. Configure in:
- **Project settings** → **Git** → **Production Branch**

---

## Troubleshooting

### Build Fails

**Symptoms**: Build command fails, no `dist` folder created

**Solutions**:
```bash
# Check Node.js version
node --version  # Should be v16+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Try building locally
npm run build
```

### 404 Errors on Page Refresh

**Symptoms**: Direct navigation to `/tasks` returns 404

**Cause**: Server doesn't redirect all routes to `index.html`

**Solutions**:

**Firebase**: Ensure `firebase.json` has:
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Netlify**: Use the included `netlify.toml` or add to `_redirects`:
```
/*    /index.html   200
```

**Vercel**: Use the included `vercel.json`

### Firebase Deploy Fails

**Symptoms**: `firebase deploy` command errors

**Solutions**:
```bash
# Ensure you're logged in
firebase login

# Verify project is selected
firebase use --add

# Check firebase.json exists
ls -la firebase.json

# Try deploying to a preview channel first
firebase hosting:channel:deploy test
```

### Blank Page After Deploy

**Symptoms**: App loads but shows blank screen

**Solutions**:
1. Check browser console for errors
2. Verify Firebase config is correct
3. Check that `dist/index.html` exists after build
4. Verify base path in vite.config.js (should be `/` for most hosts)
5. Clear browser cache and reload

### Environment Variables Not Working

**Symptoms**: Features requiring env vars fail

**Solutions**:
1. Ensure variables are prefixed with `VITE_` if using Vite
2. Verify variables are set in hosting platform dashboard
3. Rebuild after adding variables
4. Check that you're accessing them correctly: `import.meta.env.VITE_VAR`

### PWA Features Not Working

**Symptoms**: Can't install as PWA, offline doesn't work

**Solutions**:
1. Verify deployment uses **HTTPS** (required for service workers)
2. Check that `manifest.json` is accessible: `https://yoursite.com/manifest.json`
3. Verify service worker is registered: Check DevTools → Application → Service Workers
4. Clear browser cache and reload
5. See [Android Deployment Guide](./android.md) for more PWA troubleshooting

---

## Performance Optimization

### Build Optimization

Already configured in `vite.config.js`:
- Code splitting
- Tree shaking
- Minification
- Asset optimization

### Caching

Configure cache headers:

**Firebase** - Add to `firebase.json`:
```json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css|woff|woff2)",
        "headers": [{
          "key": "Cache-Control",
          "value": "max-age=31536000"
        }]
      }
    ]
  }
}
```

**Netlify** - Add to `netlify.toml`:
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Monitoring

After deployment, monitor performance:
- Use **Lighthouse** in Chrome DevTools
- Check **Firebase Performance Monitoring**
- Use **web.dev/measure** for metrics

---

## Cost Considerations

### Free Tier Limits

| Platform | Storage | Bandwidth | SSL | Custom Domain |
|----------|---------|-----------|-----|---------------|
| **Firebase** | 10 GB | 360 MB/day | ✅ Free | ✅ Free |
| **Netlify** | Unlimited | 100 GB/month | ✅ Free | ✅ Free |
| **Vercel** | Unlimited | 100 GB/month | ✅ Free | ✅ Free |
| **GitHub Pages** | 1 GB | 100 GB/month (soft) | ✅ Free | ✅ Free |

All platforms are **free for most projects**!

### Scaling Considerations

If you exceed free tier:
- **Firebase**: Pay as you go, ~$0.15/GB after free tier
- **Netlify**: Pro plan ($19/month) for 400GB bandwidth
- **Vercel**: Pro plan ($20/month) for 1TB bandwidth
- **GitHub Pages**: Generally unlimited for public repos

---

## Testing Before Deploy

Always test your build locally:

```bash
# Build the app
npm run build

# Preview the built app
npm run preview
```

Open `http://localhost:4173` and verify:
- ✅ All routes work
- ✅ Firebase authentication works
- ✅ Data loads from Firestore
- ✅ No console errors
- ✅ Responsive design works on mobile screen sizes

---

## Rollback Strategy

### Firebase

```bash
# List recent deployments
firebase hosting:clone --list

# Rollback to previous version
firebase hosting:rollback
```

### Netlify

Use the Netlify dashboard:
1. Go to **Deploys**
2. Find the previous working deployment
3. Click **"Publish deploy"**

### Vercel

Use the Vercel dashboard:
1. Go to **Deployments**
2. Find the previous working deployment  
3. Click **"⋯"** → **"Promote to Production"**

---

## Security Best Practices

1. **Never commit secrets**: Use environment variables for API keys
2. **Configure Firestore security rules**: See your `firestore.rules` file
3. **Use HTTPS**: All recommended platforms provide free SSL
4. **Enable Firebase App Check**: Protect against abuse
5. **Keep dependencies updated**: Run `npm audit` regularly

---

## Next Steps

- ✅ Deploy successful? See [Android Deployment Guide](./android.md) to make it installable
- ✅ Need monitoring? Set up Firebase Analytics
- ✅ Want CI/CD? See [Continuous Deployment](#continuous-deployment)
- ✅ Custom domain? See [Custom Domains](#custom-domains)

---

**Last Updated**: January 2025

**Happy deploying!** 🚀
