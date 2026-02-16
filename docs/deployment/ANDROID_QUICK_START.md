# Android Deployment Quick Start

Get Era Manifesto running on Android devices in minutes!

## TL;DR

```bash
# 1. Build
npm run build

# 2. Deploy to Firebase
firebase deploy --only hosting

# 3. Open URL on Android Chrome
# 4. Tap menu → "Install app"
```

## Prerequisites

- Node.js installed
- Firebase CLI: `npm install -g firebase-tools`
- Firebase account
- Android device with Chrome

## Step-by-Step

### 1. Setup Firebase (First Time Only)

```bash
# Login to Firebase
firebase login

# Initialize hosting (if not already done)
firebase init hosting
# Select "dist" as public directory
# Configure as single-page app: Yes
# Set up automatic builds: No
```

### 2. Build the App

```bash
# Install dependencies (first time only)
npm install

# Build for production
npm run build
```

Verify build succeeded - should see `dist/` directory created.

### 3. Deploy to Firebase

```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting
```

You'll get a URL like: `https://your-project.web.app`

### 4. Install on Android

#### On Your Android Device:

1. **Open Chrome** on your Android device
2. **Navigate** to your Firebase URL
3. **Look for install prompt** at bottom of screen
   - If you see it, tap **"Install"**
4. **Or use menu**:
   - Tap menu icon (⋮) in top-right
   - Select **"Install app"** or **"Add to Home screen"**
5. **Confirm** the installation
6. **Find the app** on your home screen
7. **Tap to launch** - it opens like a native app!

## Verify PWA Features

### Test Installation
- ✅ App icon appears on home screen
- ✅ Opens in standalone mode (no browser UI)
- ✅ Splash screen shows during launch
- ✅ Status bar matches app theme color

### Test Offline
1. Open the app
2. Enable airplane mode
3. Navigate around the app
4. Should work completely offline!

### Test App Shortcuts
1. Long-press the app icon
2. See shortcuts for "Today" and "New Task"
3. Tap a shortcut to test

## Troubleshooting

### "Install app" option not showing

**Quick fixes:**
- Make sure you're using **Chrome** on Android
- Verify URL uses **HTTPS** (Firebase does this automatically)
- Try closing and reopening the page
- Check if it's already installed

### App not working offline

**Quick fixes:**
- Load the app at least once while online first
- Check if service worker is registered (Chrome DevTools)
- Try reinstalling the app

### Icons not loading

**Quick fixes:**
- Clear browser cache
- Reinstall the app
- Check that icons exist in dist/icons/ after build

## What Was Set Up

This app is ready for Android because it includes:

- ✅ **PWA Manifest** - Defines app name, icons, colors
- ✅ **Service Worker** - Enables offline functionality
- ✅ **App Icons** - All sizes including maskable for adaptive icons
- ✅ **Meta Tags** - Android-specific theme colors
- ✅ **Optimized Build** - Code splitting and caching
- ✅ **Firebase Headers** - Proper caching for PWA assets

## Next Steps

### Share with Users

**Option 1: Direct Link**
Share your Firebase URL directly. Users can install it themselves.

**Option 2: QR Code**
Generate a QR code for your URL using a free online tool.

**Option 3: Instructions**
Send users this guide or create your own installation guide.

### Monitor Usage

```bash
# Check Firebase console for:
# - Number of users
# - Performance metrics
# - Errors and issues
```

Visit: `https://console.firebase.google.com`

### Update the App

When you make changes:

```bash
# 1. Build new version
npm run build

# 2. Deploy
firebase deploy --only hosting

# 3. Users get updates automatically next time they open the app
```

Service worker handles updates automatically!

## Advanced Options

### Preview Before Production

```bash
# Deploy to preview channel
firebase hosting:channel:deploy preview

# Test the preview URL first
# Then deploy to production when ready
```

### Custom Domain

1. Go to Firebase Console
2. Hosting → Add custom domain
3. Follow DNS configuration steps
4. Users access via your domain

### Google Play Store (Optional)

Want to publish to Play Store as a "native" app?

See: [ANDROID_DEPLOYMENT_CHECKLIST.md](./ANDROID_DEPLOYMENT_CHECKLIST.md) - Trusted Web Activity section

## Performance Tips

### Optimize for Mobile

- Images auto-optimized during build
- Code automatically split into chunks
- Assets cached for fast loading
- Lazy loading for heavy components

### Monitor Performance

Use Chrome DevTools:
1. Open deployed URL
2. F12 for DevTools
3. Lighthouse tab
4. Generate report
5. Check PWA score (should be 100)

## Support

### Common Commands

```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting

# Preview locally after build
npm run preview

# Check Firebase projects
firebase projects:list

# Use specific project
firebase use project-name
```

### Resources

- [Full Deployment Checklist](./ANDROID_DEPLOYMENT_CHECKLIST.md)
- [Android PWA Guide](./android.md)
- [Web Deployment Guide](./web.md)

### Get Help

1. Check troubleshooting above
2. Review [android.md](./android.md) for detailed issues
3. Test in Chrome DevTools first
4. Check Firebase console logs
5. Open GitHub issue

## Success Checklist

After deployment, verify:

- [ ] App deploys successfully to Firebase
- [ ] HTTPS URL is accessible
- [ ] manifest.json loads (visit /manifest.json)
- [ ] Service worker registers (check DevTools)
- [ ] Install prompt appears on Android Chrome
- [ ] App installs and icon shows on home screen
- [ ] App opens in standalone mode
- [ ] Works offline after first load
- [ ] App shortcuts work (long-press)

## That's It!

You now have Era Manifesto running as a PWA on Android. Users can install it with one tap and use it just like a native app!

---

**Time to Deploy:** ~5 minutes (after Firebase setup)

**Time to Install:** ~10 seconds (for users)

**Cost:** Free (on Firebase free tier)

**Updates:** Automatic (via service worker)

**Offline:** Yes (after first load)

**Native-like:** Yes (standalone mode)

---

**Questions?** See the full [Android Deployment Guide](./android.md) or open an issue.
