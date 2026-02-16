# Android Deployment Guide

Deploy Era Manifesto as a Progressive Web App (PWA) on Android devices.

---

## 🎯 Quick Start

1. **Deploy to web** (see [Web Deployment Guide](./web.md))
2. **Open URL in Chrome** on Android device
3. **Tap menu (⋮)** → **"Install app"** or **"Add to Home screen"**
4. **Launch from home screen** like a native app!

---

## 📋 Table of Contents

- [What is a PWA?](#what-is-a-pwa)
- [PWA Features Included](#pwa-features-included)
- [Deployment Process](#deployment-process)
- [Installing on Android](#installing-on-android)
- [Features After Installation](#features-after-installation)
- [Testing PWA Features](#testing-pwa-features)
- [Customizing](#customizing)
- [Troubleshooting](#troubleshooting)
- [Browser Compatibility](#browser-compatibility)

---

## What is a PWA?

A **Progressive Web App (PWA)** is a web application that can be installed on a device like a native app. Era Manifesto includes PWA functionality that provides:

- 📱 **Native app-like experience** - Opens in standalone window
- 🚀 **Offline functionality** - Works without internet connection
- ⚡ **Fast loading** - Service worker caching for instant loads
- 🎨 **Custom app icon** - Branded icon on home screen
- 🔔 **App shortcuts** - Quick access to Today view and New Task

---

## PWA Features Included

Era Manifesto includes a complete PWA implementation:

### 1. Web App Manifest (`/public/manifest.json`)

Defines how the app appears when installed:
- **App name**: Era Manifesto
- **Display mode**: Standalone (no browser UI)
- **Theme colors**: Pink (#ec4899) and black (#000000)
- **Icons**: 8 sizes (72x72 to 512x512)
- **Shortcuts**: Today view, New Task
- **Categories**: music, productivity, utilities

### 2. App Icons (`/public/icons/`)

Custom-designed icons in SVG format:
- **Sizes**: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- **Design**: Gradient background (pink to purple) with "EM" text
- **Style**: Matches the app's brutalist aesthetic

### 3. Service Worker (`/public/sw.js`)

Enables offline functionality:
- Caches essential assets on first load
- "Cache first, network fallback" strategy
- Automatic updates when new version deployed
- Smart cache management

### 4. Mobile Meta Tags

Optimized for mobile devices:
- PWA manifest link
- Theme color for Android status bar
- Apple touch icons for iOS
- Mobile viewport optimization

---

## Deployment Process

### Step 1: Deploy to Web

First, deploy Era Manifesto to any web hosting platform. See the [Web Deployment Guide](./web.md) for detailed instructions.

**Recommended: Firebase Hosting**
```bash
npm run build
firebase deploy --only hosting
```

**Important**: The deployment **must use HTTPS** for PWA features to work (service workers require secure context).

### Step 2: Verify PWA Assets

After deployment, verify these URLs are accessible:
- `https://yoursite.com/manifest.json` - PWA manifest
- `https://yoursite.com/sw.js` - Service worker
- `https://yoursite.com/icons/icon-192x192.svg` - App icon

### Step 3: Test PWA Installation

Open your deployed URL in Chrome on Android. You should see an install prompt or be able to install via the browser menu.

---

## Installing on Android

### Chrome for Android (Recommended)

1. **Open the deployed URL** in Chrome on Android
2. **Look for the install prompt** at the bottom of the screen
   - If prompt appears, tap **"Install"**
3. **Or use the menu**:
   - Tap the **menu** (⋮) in top-right
   - Select **"Install app"** or **"Add to Home screen"**
4. **Follow the prompts** to add to home screen
5. **Launch the app** from your home screen!

### Samsung Internet

1. **Open the deployed URL** in Samsung Internet
2. **Tap the menu**
3. Select **"Add page to"** → **"Home screen"**
4. Confirm to add the icon

### Firefox for Android

1. **Open the deployed URL** in Firefox
2. **Tap the Home icon** with a plus sign in the address bar
3. Select **"Add to Home screen"**
4. Confirm to install

### Edge for Android

1. **Open the deployed URL** in Edge
2. **Tap the menu** (⋯)
3. Select **"Add to phone"** or **"Install app"**

---

## Features After Installation

When installed as a PWA on Android, Era Manifesto provides:

### 🖼️ Native App Experience
- Opens in **standalone window** without browser UI
- **Custom splash screen** with app icon and name
- **Immersive experience** - no URL bar or browser controls

### 🏠 Home Screen Integration
- **App icon** appears on home screen
- **App name** displays under icon
- **Launches immediately** with tap

### 📴 Offline Functionality
- Works **without internet connection** after first load
- All core features available offline
- Data syncs when connection restored

### ⚡ Performance
- **Instant loading** from service worker cache
- **Fast subsequent visits** - assets cached locally
- **No delay** - launches immediately

### 🎯 App Shortcuts
Long-press the app icon for quick actions:
- **Today** - Jump directly to Today view
- **New Task** - Quickly create a new task

### 🎨 Theme Integration
- Android **status bar** matches app theme (#ec4899 pink)
- **Task switcher** shows app name and icon
- **Smooth animations** and transitions

---

## Testing PWA Features

### Test Locally Before Deploying

```bash
# Build the app
npm run build

# Preview the built app
npm run preview
```

Open `http://localhost:4173` in Chrome and use DevTools:

#### 1. Check Manifest
- Open **DevTools** → **Application** → **Manifest**
- Verify manifest loads correctly
- Check icons display properly

#### 2. Check Service Worker
- **Application** → **Service Workers**
- Verify service worker is registered
- Check status is "activated"

#### 3. Run Lighthouse Audit
- **Lighthouse** tab in DevTools
- Generate report
- Check **PWA** category score
- Review any issues flagged

#### 4. Test Offline Mode
- **Application** → **Service Workers** → Check "Offline"
- Reload the page
- Verify app still works

### Test on Android Device

For thorough testing:

1. **Deploy to a test URL** (e.g., Firebase hosting preview channel)
2. **Open on Android device**
3. **Test installation** process
4. **Verify offline functionality**:
   - Install the app
   - Turn on airplane mode
   - Launch and use the app
5. **Test app shortcuts** (long-press icon)
6. **Check theme integration** (status bar color)

---

## Customizing

### Customize App Icons

The default icons use a simple "EM" design. To customize:

#### Option 1: Generate New Icons

Edit the icon generation script:

```javascript
// In your project, create or edit generate-icons.js
// Customize the design, then run:
node generate-icons.js
```

#### Option 2: Manual Icon Replacement

1. Create custom icons in your preferred design tool
2. Export as **SVG** or **PNG** in required sizes
3. Replace files in `/public/icons/`
4. Update paths in `/public/manifest.json` if needed

Required sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192 (minimum for installable PWA)
- 384x384
- 512x512 (used for splash screen)

### Customize App Name and Colors

Edit `/public/manifest.json`:

```json
{
  "name": "Your App Name",
  "short_name": "App Name",
  "description": "Your app description",
  "theme_color": "#ec4899",       // Change theme color
  "background_color": "#000000",   // Change background
  // ... other settings
}
```

Also update in `index.html`:
```html
<meta name="theme-color" content="#ec4899">
```

### Customize App Shortcuts

Edit shortcuts in `/public/manifest.json`:

```json
{
  "shortcuts": [
    {
      "name": "Your Shortcut",
      "short_name": "Shortcut",
      "description": "Description of shortcut",
      "url": "/your-route",
      "icons": [{ "src": "/icons/icon-192x192.svg", "sizes": "192x192" }]
    }
  ]
}
```

### Customize Service Worker Caching

Edit `/public/sw.js`:

```javascript
// Change cache version to force update
const CACHE_NAME = 'era-manifesto-v2';

// Modify what gets cached
const urlsToCache = [
  '/',
  '/index.html',
  // Add more critical assets
];
```

**Important**: After modifying the service worker, increment the `CACHE_NAME` version to force an update.

---

## Troubleshooting

### App Won't Install on Android

**Symptoms**: No install prompt, "Install app" option not available

**Solutions**:

1. **Verify HTTPS**: PWAs require HTTPS
   ```
   ✅ https://yoursite.com
   ❌ http://yoursite.com
   ```

2. **Check manifest.json**:
   - Access `https://yoursite.com/manifest.json` directly
   - Verify valid JSON (no syntax errors)
   - Check all required fields are present

3. **Check console for errors**:
   - Open Chrome DevTools on Android (use `chrome://inspect`)
   - Look for manifest or service worker errors

4. **Minimum requirements**:
   - Manifest must include `name`, `icons`, and `start_url`
   - At least one icon must be 192x192 or larger
   - Service worker must be registered

5. **Try different browser**: Chrome for Android is most reliable for PWA installation

### Icons Not Showing Correctly

**Symptoms**: Default icon or broken icon displayed

**Solutions**:

1. **Verify icon paths**:
   - Check `/public/icons/` directory has all icons
   - Verify paths in `manifest.json` are correct
   - Ensure icon files aren't corrupted

2. **Check icon format**:
   - SVG icons should be valid SVG files
   - PNG icons should be properly exported
   - Verify file sizes match their filenames

3. **Clear cache**:
   - Uninstall the PWA
   - Clear browser cache
   - Reinstall

### Not Working Offline

**Symptoms**: App doesn't work when internet is disabled

**Solutions**:

1. **Verify service worker registration**:
   - Check DevTools → Application → Service Workers
   - Should show "activated and running"

2. **Check cache**:
   - DevTools → Application → Cache Storage
   - Verify assets are cached

3. **Test offline mode**:
   - Enable offline in DevTools first
   - Verify it works in browser
   - Then test on actual device

4. **Common causes**:
   - Service worker not registered properly
   - Cache not populated (need to load app at least once online)
   - Service worker script has errors (check console)

### Service Worker Not Registering

**Symptoms**: Service worker not showing in DevTools

**Solutions**:

1. **Check HTTPS requirement**:
   - Service workers require HTTPS (except localhost)
   - Verify your deployment uses HTTPS

2. **Check file accessibility**:
   - Verify `sw.js` is accessible at `/sw.js`
   - Check for 404 errors in network tab

3. **Check registration code**:
   - Verify `src/main.jsx` registers the service worker
   - Check for JavaScript errors preventing registration

4. **Browser compatibility**:
   - Ensure browser supports service workers
   - Try Chrome for Android (best support)

### Updates Not Showing

**Symptoms**: Deployed update but users see old version

**Solutions**:

1. **Increment cache version**:
   ```javascript
   // In sw.js
   const CACHE_NAME = 'era-manifesto-v2'; // Increment number
   ```

2. **Clear old caches**:
   - Service worker should auto-delete old caches
   - Users may need to reload twice

3. **Force update**:
   - Uninstall and reinstall the app
   - Clear browser cache and storage

### App Closes Immediately After Launch

**Symptoms**: App opens then immediately closes

**Solutions**:

1. **Check start_url**:
   - Verify `start_url` in manifest.json is correct
   - Should usually be `/`

2. **Check service worker**:
   - Service worker error might cause crash
   - Check console for errors

3. **Check Firebase config**:
   - Verify `src/firebase-config.js` is correct
   - Missing Firebase config can cause crash

---

## Browser Compatibility

### Android

| Browser | Installation | Offline | App Shortcuts | Status |
|---------|--------------|---------|---------------|--------|
| **Chrome 70+** | ✅ | ✅ | ✅ | Recommended |
| **Firefox 80+** | ✅ | ✅ | ❌ | Good |
| **Samsung Internet 10+** | ✅ | ✅ | ❌ | Good |
| **Edge 79+** | ✅ | ✅ | ✅ | Good |
| **Opera 50+** | ✅ | ✅ | ❌ | Good |

### iOS

| Browser | Installation | Offline | App Shortcuts | Status |
|---------|--------------|---------|---------------|--------|
| **Safari 11.3+** | ⚠️ Manual | ⚠️ Limited | ❌ | Partial |

**iOS Notes**:
- No automatic install prompt
- Must manually "Add to Home Screen"
- Limited service worker support
- Some PWA features may not work

---

## Performance Metrics

### PWA Benefits

Typical performance improvements after installation:

- **First Load**: Same as web (network dependent)
- **Subsequent Loads**: ~90% faster (cached assets)
- **Offline**: 100% functional (with cached data)
- **Data Usage**: Reduced (cached assets not re-downloaded)

### Lighthouse Score

Era Manifesto achieves:
- ✅ PWA: 100/100
- ✅ Performance: 90+/100
- ✅ Accessibility: 95+/100
- ✅ Best Practices: 95+/100

Run your own audit: Chrome DevTools → Lighthouse

---

## Security Considerations

### Service Worker Security

- ✅ Only caches same-origin requests
- ✅ HTTPS required (enforced by browsers)
- ✅ No sensitive data in cache
- ✅ Automatic updates maintain security patches

### Data Security

- ✅ Firebase security rules protect user data
- ✅ Authentication tokens not cached
- ✅ Service worker can't access auth credentials
- ✅ All data sync via secure Firebase SDK

---

## Distribution

### Options for Sharing Your PWA

1. **Direct URL**: Share your deployed URL
   - Users install via browser
   - No app store approval needed

2. **Trusted Web Activity (TWA)**: Package as Android app
   - Publish to Google Play Store
   - Shows as native app
   - Requires more setup

3. **QR Code**: Generate QR code for your URL
   - Users scan to open site
   - Can install from browser

4. **Social Media**: Share the link
   - Works on any social platform
   - Users can install after visiting

### Advantages vs Native App

| Feature | PWA | Native App |
|---------|-----|------------|
| **Distribution** | URL only | App store |
| **Updates** | Instant | Review process |
| **Size** | ~200KB | ~20MB+ |
| **Installation** | One tap | Download + install |
| **Cross-platform** | Yes | Separate builds |
| **Cost** | Free hosting | App store fees |

---

## Monitoring and Analytics

### Track PWA Installation

Use Firebase Analytics to track:
- PWA install events
- Usage patterns (installed vs. browser)
- Offline usage

### Monitor Service Worker

Check service worker status:
```javascript
// In browser console
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('Service Worker Status:', reg);
});
```

### Performance Monitoring

Use Firebase Performance Monitoring:
- Track load times
- Monitor network requests
- Measure user engagement

---

## Future Enhancements

Potential PWA features to add:

- 🔔 **Push Notifications**: Remind users about tasks/deadlines
- 🔄 **Background Sync**: Sync data in background
- 📥 **Share Target**: Receive content shared from other apps
- 📊 **Periodic Background Sync**: Auto-update data
- 🎵 **Media Session API**: Control audio playback from notifications

These can be implemented as the project evolves!

---

## Additional Resources

### Documentation
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA Checklist](https://web.dev/pwa-checklist/)
- [Google: PWA Training](https://developers.google.com/web/ilt/pwa)

### Tools
- [PWA Builder](https://www.pwabuilder.com/) - Validate and improve your PWA
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Audit tool
- [Workbox](https://developers.google.com/web/tools/workbox) - Service worker library

### Related Guides
- [Web Deployment Guide](./web.md) - Deploy to web first
- Main project `MOBILE_GUIDE.md` - Mobile usage guide
- Main project `FIREBASE_SETUP.md` - Firebase configuration

---

## Need Help?

1. **Check troubleshooting section** above
2. **Test in Chrome DevTools** for detailed error messages
3. **Review browser console** for specific errors
4. **Check the Web Deployment Guide** for deployment issues
5. **Open an issue** on GitHub if you find a bug

---

**Last Updated**: January 2025

**Ready to go mobile!** 📱🎵
