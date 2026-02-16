# Android Deployment Guide

Era Manifesto is now fully ready for Android deployment as a Progressive Web App (PWA). This guide explains how to deploy and install the app on Android devices.

## What's Been Added

The following PWA features have been implemented:

1. **Web App Manifest** (`/public/manifest.json`)
   - App name, description, and icons
   - Theme colors matching the Era Manifesto design
   - Standalone display mode for app-like experience
   - Shortcuts for quick access to Today view and New Task

2. **App Icons** (`/public/icons/`)
   - SVG icons in multiple sizes (72x72 to 512x512)
   - Optimized for Android home screen
   - Brutalist/punk design matching the app aesthetic

3. **Service Worker** (`/public/sw.js`)
   - Offline capabilities
   - Smart caching strategy
   - Automatic updates

4. **Mobile Meta Tags** (in `index.html`)
   - PWA manifest link
   - Theme color for Android status bar
   - Apple touch icons for iOS
   - Mobile viewport optimization

## Deployment Options

### Option 1: Firebase Hosting (Recommended)

Firebase Hosting is the recommended option as it integrates seamlessly with Firebase sync:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting (if not already done)
firebase init hosting

# Build and deploy
npm run build
firebase deploy --only hosting
```

Your app will be available at: `https://YOUR-PROJECT-ID.web.app`

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the app
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (Vercel will auto-detect Vite)
vercel --prod
```

### Option 4: Any Static Host

You can deploy the `dist` directory to any static hosting service:

1. Build the app: `npm run build`
2. Upload the contents of the `dist` directory to your hosting provider
3. Ensure your server is configured to serve `index.html` for all routes (SPA configuration)

## Installing on Android

Once deployed, users can install Era Manifesto on their Android devices:

### Chrome for Android

1. Open the deployed URL in Chrome on Android
2. Tap the **menu** (⋮) → **"Add to Home screen"** or **"Install app"**
3. Follow the prompts to install
4. The app icon will appear on the home screen

### Samsung Internet

1. Open the deployed URL in Samsung Internet
2. Tap the **menu** → **"Add page to"** → **"Home screen"**
3. The app will be added to the home screen

### Firefox for Android

1. Open the deployed URL in Firefox
2. Tap the **Home icon** with a plus sign in the address bar
3. Select **"Add to Home screen"**

## Features After Installation

When installed as a PWA on Android:

- **Standalone Mode**: Opens in its own window without browser UI
- **Home Screen Icon**: Launches like a native app
- **Offline Support**: Works without internet connection
- **Fast Loading**: Cached assets load instantly
- **App Shortcuts**: Long-press icon for quick actions (Today view, New Task)
- **Theme Integration**: Status bar matches app theme color (#ec4899 pink)

## Updating the PWA

When you deploy updates:

1. Build and deploy as normal: `npm run build && firebase deploy`
2. The service worker will automatically detect and cache new versions
3. Users will get the update on their next app launch
4. The service worker uses a "cache first, network fallback" strategy

## Testing PWA Features Locally

Before deploying, you can test PWA features:

```bash
# Build the app
npm run build

# Preview the built app
npm run preview
```

Then open `http://localhost:4173` in Chrome and:
1. Open DevTools → Application → Manifest (check manifest loads correctly)
2. Application → Service Workers (verify SW is registered)
3. Lighthouse → Generate report (check PWA score)

## Customizing Icons

The current icons use a simple "EM" text design. To customize:

1. Edit `/home/runner/work/Era-Manifesto/Era-Manifesto/generate-icons.cjs` to change the icon design
2. Run: `node generate-icons.cjs`
3. Rebuild and redeploy

Alternatively, replace the SVG files in `public/icons/` with your own custom designs.

## Troubleshooting

### App Won't Install on Android

- Ensure you're using HTTPS (required for PWA installation)
- Verify the manifest.json is accessible at `/manifest.json`
- Check that icons are loading correctly
- Try a different browser (Chrome recommended)

### Service Worker Not Registering

- Check browser console for errors
- Ensure the app is served over HTTPS (or localhost)
- Clear browser cache and reload
- Verify `sw.js` is accessible at `/sw.js`

### Icons Not Showing

- Ensure icons exist in `public/icons/`
- Verify icon paths in `manifest.json` are correct
- Check that SVG icons are valid
- Try clearing app data and reinstalling

### Not Working Offline

- Verify service worker is registered (check DevTools → Application → Service Workers)
- Ensure you've loaded the app at least once online
- Check that critical assets are being cached
- Look for service worker errors in the console

## Performance Optimization

The app is already optimized for mobile:

- Code splitting for faster initial load
- Lazy loading of heavy libraries (jsPDF, Recharts)
- Service worker caching for instant subsequent loads
- Responsive design optimized for mobile screens

## Security Considerations

- All assets are served over HTTPS (required for service workers)
- Service worker only caches same-origin requests
- Firebase security rules protect user data
- No sensitive data is stored in the service worker cache

## Further Reading

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA Best Practices](https://web.dev/pwa-checklist/)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Chrome: Install Web Apps](https://developer.chrome.com/docs/android/trusted-web-activity/)

## Support

For issues or questions:
1. Check the main [Deployment Guide](DEPLOYMENT.md)
2. Review the [Mobile Guide](MOBILE_GUIDE.md)
3. Open an issue on GitHub

---

**Ready to go mobile!** 📱🎵
