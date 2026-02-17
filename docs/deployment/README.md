# Deployment Documentation Hub

Welcome to the Era Manifesto deployment documentation. This directory contains comprehensive guides for deploying the application to various platforms.

---

## 📑 Quick Navigation

### Web Deployment
**[Web Deployment Guide](./web.md)** - Complete guide for deploying to web platforms
- Firebase Hosting (recommended)
- Netlify
- Vercel  
- GitHub Pages
- Deploy branch workflow
- Environment configuration
- Custom domains

### Android Deployment
**[Android Deployment Guide](./android.md)** - Deploy as a Progressive Web App on Android
- PWA installation
- Offline capabilities
- App icons and manifest
- Service worker setup
- Testing and troubleshooting

**[Android Deployment Ready](./ANDROID_DEPLOYMENT_READY.md)** - Native Android (Capacitor) setup
- Capacitor v8.1.0 native wrapper
- Android Studio project structure
- Google Play Store preparation
- Quick start for native builds

---

## 🚀 Quick Start

### For Web Deployment

```bash
# Build the application
npm run build

# Deploy to Firebase (recommended)
firebase deploy --only hosting
```

See [Web Deployment Guide](./web.md) for detailed instructions.

### For Android PWA

1. Deploy to any web platform (see Web guide)
2. Open deployed URL in Chrome on Android
3. Tap menu (⋮) → "Install app"
4. App installs to home screen!

See [Android Deployment Guide](./android.md) for complete details.

---

## 📋 Deployment Checklist

Before deploying:

- [ ] Firebase configuration set up (see [Firebase Setup Guide](../getting-started/FIREBASE_SETUP.md))
- [ ] Environment variables configured
- [ ] Build succeeds locally: `npm run build`
- [ ] Preview works: `npm run preview`
- [ ] Tests passing: `npm test`
- [ ] Security rules configured (if using Firebase)

---

## 🎯 Recommended Platform: Firebase Hosting

Firebase Hosting is the recommended deployment platform because:

1. **Seamless Integration**: Works perfectly with Firebase Authentication and Firestore
2. **Easy Setup**: Simple CLI deployment workflow
3. **Free Tier**: Generous limits for most projects
4. **HTTPS & CDN**: Automatic SSL and global content delivery
5. **PWA Ready**: Fully supports Progressive Web App features

---

## 🌐 Platform Comparison

| Platform | Best For | Free Tier | CI/CD | PWA Support |
|----------|----------|-----------|-------|-------------|
| **Firebase Hosting** | Firebase apps | 10GB/360MB daily | GitHub Actions | ✅ Full |
| **Netlify** | Simple deploys | 100GB bandwidth | Built-in | ✅ Full |
| **Vercel** | React/Vite apps | 100GB bandwidth | Built-in | ✅ Full |
| **GitHub Pages** | Open source | 100GB (soft) | GitHub Actions | ✅ Full |

All platforms support the full feature set of Era Manifesto!

---

## 📱 Mobile Deployment

Era Manifesto works on mobile devices in two ways:

1. **Web Browser**: Access the deployed URL from any mobile browser
2. **PWA Installation**: Install as a standalone app on Android (and iOS with limitations)

The PWA provides:
- Offline functionality
- Native app-like experience
- Home screen icon
- Fast loading with service worker caching

---

## 🔧 Troubleshooting

### Build Fails
- Check Node.js version (v16+ recommended)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for missing dependencies in package.json

### 404 Errors on Refresh
- Configure your hosting for single-page apps (SPA)
- Ensure all routes redirect to `index.html`
- See platform-specific guides in the Web Deployment Guide

### Firebase Connection Issues
- Verify `src/firebase-config.js` has correct credentials
- Check Firestore security rules
- Ensure Authentication is enabled in Firebase Console

### PWA Won't Install on Android
- Ensure deployment uses HTTPS (required for PWA)
- Verify manifest.json is accessible at `/manifest.json`
- Check browser console for service worker errors
- Try using Chrome for Android (most reliable)

---

## 📚 Related Documentation

### Getting Started
- [Firebase Setup Guide](../getting-started/FIREBASE_SETUP.md) - Firebase configuration guide
- [Installation Checklist](../getting-started/INSTALLATION_CHECKLIST.md) - Setup instructions

### Features
- [Mobile Guide](../features/MOBILE_GUIDE.md) - Mobile usage and PWA
- Main [README](../../README.md) - Project overview

### In This Directory
- `web.md` - Web deployment platforms and instructions
- `android.md` - Android PWA deployment

### Historical
- [Android Capacitor Summary](../history/phases/ANDROID_CAPACITOR_SUMMARY.md) - Historical Capacitor implementation details

---

## 🔄 Deployment Workflow

```
┌──────────────────┐
│   Development    │
│   npm run dev    │
└────────┬─────────┘
         │
         │ Code & test
         │
         ▼
┌──────────────────┐
│  Build & Test    │
│  npm run build   │
└────────┬─────────┘
         │
         │ Build succeeds
         │
         ▼
┌──────────────────┐
│  Deploy          │
│  (Firebase/etc)  │
└────────┬─────────┘
         │
         │ Deployed!
         │
         ▼
┌──────────────────┐
│  Accessible Web  │
│  + Installable   │
│  PWA on Android  │
└──────────────────┘
```

---

## 🆘 Need Help?

1. **Check the specific guide**: Web or Android deployment docs have detailed troubleshooting
2. **Test locally first**: `npm run build && npm run preview`
3. **Review build logs**: Look for specific error messages
4. **Check platform docs**: Firebase/Netlify/Vercel have excellent documentation
5. **Open an issue**: If you find a bug or documentation problem

---

## 📝 Keeping Documentation Updated

When making deployment-related changes:

1. Update the relevant guide (web.md or android.md)
2. Update this README if navigation changes
3. Keep troubleshooting sections current
4. Add examples for new platforms or features

---

**Last Updated**: January 2025

**Happy deploying!** 🚀
