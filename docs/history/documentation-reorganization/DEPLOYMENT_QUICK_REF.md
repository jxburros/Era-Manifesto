# 🚀 Deployment Quick Reference

**Last Updated**: January 2025

---

## 📍 Start Here

👉 **[docs/deployment/README.md](docs/deployment/README.md)** - Main deployment hub

---

## ⚡ Quick Deploy Commands

### Firebase (Recommended)
```bash
npm run build
firebase deploy --only hosting
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Vercel
```bash
vercel --prod
```

---

## 📚 Documentation Map

| I Need To... | Go To... |
|--------------|----------|
| **Deploy to web** | [docs/deployment/web.md](docs/deployment/web.md) |
| **Install on Android** | [docs/deployment/android.md](docs/deployment/android.md) |
| **Fix deployment error** | [docs/deployment/web.md#troubleshooting](docs/deployment/web.md#troubleshooting) |
| **Fix PWA issue** | [docs/deployment/android.md#troubleshooting](docs/deployment/android.md#troubleshooting) |
| **Set up Firebase** | [FIREBASE_SETUP.md](FIREBASE_SETUP.md) |
| **Understand structure** | [docs/deployment/VISUAL_GUIDE.md](docs/deployment/VISUAL_GUIDE.md) |

---

## 🎯 Platform-Specific

### Firebase Hosting
- **Guide**: [web.md#firebase-hosting](docs/deployment/web.md#firebase-hosting-recommended)
- **Command**: `firebase deploy --only hosting`
- **URL**: `https://YOUR-PROJECT-ID.web.app`

### Netlify
- **Guide**: [web.md#netlify](docs/deployment/web.md#netlify)
- **Command**: `netlify deploy --prod --dir=dist`
- **UI**: [netlify.com](https://netlify.com)

### Vercel
- **Guide**: [web.md#vercel](docs/deployment/web.md#vercel)
- **Command**: `vercel --prod`
- **UI**: [vercel.com](https://vercel.com)

### GitHub Pages
- **Guide**: [web.md#github-pages](docs/deployment/web.md#github-pages)
- **Command**: `npm run deploy`
- **Setup**: Requires configuration

---

## 📱 Android PWA

### Install on Device
1. Deploy to web
2. Open in Chrome on Android
3. Tap menu (⋮) → "Install app"

**Guide**: [android.md#installing-on-android](docs/deployment/android.md#installing-on-android)

### Test Locally
```bash
npm run build
npm run preview
# Open Chrome DevTools → Lighthouse → PWA
```

**Guide**: [android.md#testing-pwa-features](docs/deployment/android.md#testing-pwa-features)

---

## 🔧 Common Issues

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```
**Guide**: [web.md#build-fails](docs/deployment/web.md#troubleshooting)

### 404 on Refresh
- Configure SPA redirects in hosting
- **Guide**: [web.md#404-errors-on-page-refresh](docs/deployment/web.md#troubleshooting)

### PWA Won't Install
- Verify HTTPS enabled
- Check manifest.json accessible
- **Guide**: [android.md#app-wont-install-on-android](docs/deployment/android.md#troubleshooting)

---

## 📖 Full Documentation

- **Deployment Hub**: [docs/deployment/README.md](docs/deployment/README.md)
- **Web Deployment**: [docs/deployment/web.md](docs/deployment/web.md)
- **Android PWA**: [docs/deployment/android.md](docs/deployment/android.md)
- **Visual Guide**: [docs/deployment/VISUAL_GUIDE.md](docs/deployment/VISUAL_GUIDE.md)

---

## ℹ️ Old Files?

Old deployment files have been reorganized:
- `DEPLOYMENT.md` → See [docs/deployment/web.md](docs/deployment/web.md)
- `DEPLOY_BRANCH.md` → See [docs/deployment/web.md#deploy-branch-workflow](docs/deployment/web.md#deploy-branch-workflow)
- `ANDROID_DEPLOYMENT.md` → See [docs/deployment/android.md](docs/deployment/android.md)

Deprecation notices created for backward compatibility.

---

**Need help?** Start at [docs/deployment/README.md](docs/deployment/README.md) 🚀
