# Deploy Branch Guide

## What is the Deploy Branch?

The `deploy` branch is a special branch designed specifically for deployment. It contains only the essential files needed to deploy and run Era Manifesto in production, excluding development files and configurations.

## How It Works

### Automatic Synchronization

A GitHub Actions workflow automatically keeps the `deploy` branch synchronized with the `main` branch:

1. **Trigger**: Whenever changes are pushed to the `main` branch
2. **Sync**: The workflow merges the latest changes from `main` into `deploy`
3. **Cleanup**: Development-only files are removed (e.g., `.eslintrc.cjs`)
4. **Push**: The updated `deploy` branch is pushed back to GitHub

### Manual Trigger

You can also manually trigger the sync workflow:

1. Go to your repository on GitHub
2. Navigate to "Actions" tab
3. Select "Sync Deploy Branch" workflow
4. Click "Run workflow"
5. Select the branch (main) and click "Run workflow"

## What's Included in the Deploy Branch?

The deploy branch includes:

### Essential Files ✅
- **Source code** (`src/` directory)
- **Build configuration** (`vite.config.js`, `tailwind.config.js`, `postcss.config.js`)
- **Dependencies** (`package.json`, `package-lock.json`)
- **Entry point** (`index.html`)
- **Documentation** (`README.md`, `FIREBASE_SETUP.md`, `DEPLOYMENT.md`, `MOBILE_GUIDE.md`)
- **Deployment configs** (`firebase.json`, `netlify.toml`, `vercel.json`, etc.)
- **Templates** (`firebase-config.template.json`, `.firebaserc.template`)
- **Firestore configuration** (`firestore.rules`, `firestore.indexes.json`)
- **License** (`LICENSE`)

### Excluded Files ❌
- **ESLint configuration** (`.eslintrc.cjs`) - only needed for development
- **Git metadata** (kept minimal)
- **Other development-only files** as needed

## Using the Deploy Branch

### Option 1: Deploy Directly from GitHub

Many hosting platforms can deploy directly from a GitHub branch:

**Netlify**:
1. Connect your repository
2. Select the `deploy` branch
3. Set build command: `npm run build`
4. Set publish directory: `dist`

**Vercel**:
1. Import your project
2. Select the `deploy` branch
3. Vercel auto-detects Vite configuration

**Firebase Hosting** (with GitHub Actions):
1. Set up Firebase Hosting GitHub Action
2. Configure it to build from the `deploy` branch

### Option 2: Clone and Deploy Manually

```bash
# Clone only the deploy branch
git clone -b deploy https://github.com/YOUR-USERNAME/era-manifesto.git era-manifesto-deploy
cd era-manifesto-deploy

# Install dependencies
npm install --production

# Build
npm run build

# Deploy (using your preferred method)
firebase deploy
# or
netlify deploy --prod --dir=dist
# or
vercel --prod
```

### Option 3: Pull Latest Changes

If you already have the deploy branch cloned:

```bash
cd album-tracker-deploy
git pull origin deploy
npm install
npm run build
# Deploy...
```

## Benefits of Using the Deploy Branch

1. **Cleaner Repository**: Only deployment-essential files
2. **Smaller Clone Size**: Faster downloads for deployment
3. **Automatic Updates**: Always in sync with main branch
4. **Separation of Concerns**: Development vs. production environments
5. **Easy Rollback**: Deploy branch maintains its own history

## Deploy Branch Workflow

```
┌─────────────┐
│ Development │
│   on main   │
└──────┬──────┘
       │
       │ Push to main
       │
       ▼
┌─────────────────┐
│ GitHub Actions  │
│ (Auto-trigger)  │
└──────┬──────────┘
       │
       │ Merge + Cleanup
       │
       ▼
┌─────────────┐
│   deploy    │
│   branch    │
└──────┬──────┘
       │
       │ Deploy from here
       │
       ▼
┌─────────────┐
│  Hosting    │
│  Platform   │
└─────────────┘
```

## Troubleshooting

### Deploy Branch Not Created

The workflow creates the deploy branch automatically on the first run after merging to main. If it doesn't exist:

1. Make sure the workflow file is in `.github/workflows/sync-deploy-branch.yml`
2. Push any change to the main branch to trigger it
3. Or manually trigger it from GitHub Actions tab

### Deploy Branch Out of Sync

This shouldn't happen with automatic sync, but if needed:

1. Go to GitHub Actions
2. Manually trigger "Sync Deploy Branch" workflow
3. Or merge main into deploy manually:
   ```bash
   git checkout deploy
   git merge main
   git push origin deploy
   ```

### Build Fails on Deploy Branch

1. Ensure `package.json` and `package-lock.json` are present
2. Check that all source files are included
3. Verify build configuration files exist
4. Test build locally: `npm install && npm run build`

## Alternative Approaches

If you prefer not to use the deploy branch:

1. **Deploy from main**: Most hosting platforms can deploy from any branch
2. **Use GitHub Releases**: Tag releases and deploy from tags
3. **Use CI/CD**: Set up your own build pipeline without a separate branch

## Customizing the Deploy Branch

To customize what's included/excluded in the deploy branch:

1. Edit `.github/workflows/sync-deploy-branch.yml`
2. Modify the "Remove development files" step
3. Add or remove files as needed
4. Commit and push to main
5. The next sync will use your new configuration

Example - exclude more files:
```yaml
- name: Remove development files
  run: |
    rm -f .eslintrc.cjs
    rm -rf tests/
    rm -f jest.config.js
    # Add more as needed
```

## Best Practices

1. **Never develop directly on deploy branch** - always work on main or feature branches
2. **Let automation handle it** - avoid manual changes to deploy branch
3. **Test before deploying** - verify builds work on main before deployment
4. **Monitor workflow runs** - check GitHub Actions for sync status
5. **Use versioning** - tag releases on main for tracking deployed versions

## Questions?

- Check the [Deployment Guide](DEPLOYMENT.md) for deployment instructions
- Review [GitHub Actions documentation](https://docs.github.com/en/actions) for workflow details
- See the workflow file for implementation details

---

**The deploy branch keeps your deployments clean and automated!** 🚀
