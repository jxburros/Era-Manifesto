# Android Deployment Checklist

Complete guide to deploying Era Manifesto as a Progressive Web App (PWA) on Android devices.

## Pre-Deployment Checklist

### 1. Build Configuration

- [x] **Vite build configuration optimized**
  - Code splitting configured
  - Chunk size optimized
  - Assets properly configured

- [x] **PWA Assets Ready**
  - Manifest.json configured
  - Service worker implemented
  - Icons generated (all required sizes)
  - Maskable icon created for adaptive icons

- [x] **Meta Tags Configured**
  - Theme color for Android
  - Mobile web app capable tags
  - Apple touch icons for iOS
  - Format detection disabled

### 2. PWA Requirements

- [x] **Manifest.json Complete**
  - App name and short name
  - Description
  - Icons (192x192 and 512x512 minimum)
  - Maskable icon for Android adaptive icons
  - Start URL
  - Display mode (standalone)
  - Theme and background colors
  - App shortcuts defined
  - Scope and launch handler configured

- [x] **Service Worker**
  - Service worker file (sw.js) created
  - Registration code in main.jsx
  - Offline caching strategy implemented
  - Update mechanism configured

- [x] **HTTPS Requirement**
  - Deployment platform uses HTTPS (required for PWA)
  - Service workers require secure context

### 3. Icons and Branding

- [x] **Icon Sizes Available**
  - 72x72
  - 96x96
  - 128x128
  - 144x144
  - 152x152
  - 192x192 (minimum for PWA)
  - 384x384
  - 512x512 (for splash screen)

- [x] **Maskable Icon**
  - 512x512 maskable icon created
  - Safe zone (80% of icon) used for content
  - Works with Android adaptive icon system

- [ ] **Optional: PNG Icons**
  - SVG icons work well but PNG may have better compatibility
  - Use scripts/generate-png-icons.js for guidance
  - Consider using PWA Builder for optimized PNG generation

### 4. Firebase Configuration

- [x] **Hosting Configuration**
  - Public directory set to 'dist'
  - Rewrites configured for SPA routing
  - Cache headers optimized
  - PWA-specific headers added

- [x] **Headers Configured**
  - manifest.json with proper content-type
  - Service worker with no-cache headers
  - Static assets with long-term caching
  - .well-known directory accessible

- [ ] **Firebase Project Setup**
  - Firebase project created
  - Firebase CLI installed (`npm install -g firebase-tools`)
  - Logged in (`firebase login`)
  - Project initialized (`firebase init hosting`)

### 5. Testing

- [ ] **Local Testing**
  ```bash
  npm run build
  npm run preview
  ```
  - Build completes without errors
  - Preview works locally
  - Service worker registers successfully

- [ ] **Lighthouse Audit**
  - Open Chrome DevTools
  - Run Lighthouse audit
  - PWA score: 100/100
  - Performance: 90+/100
  - Check for any PWA issues

- [ ] **Service Worker Verification**
  - DevTools > Application > Service Workers
  - Service worker shows as "activated"
  - Cache storage populated with assets

- [ ] **Manifest Verification**
  - DevTools > Application > Manifest
  - All fields display correctly
  - Icons load properly

### 6. Deployment

- [ ] **Build for Production**
  ```bash
  npm run build
  ```

- [ ] **Deploy to Firebase**
  ```bash
  firebase deploy --only hosting
  ```

- [ ] **Verify Deployment**
  - Visit deployed URL
  - Check HTTPS is enabled
  - Verify manifest.json is accessible
  - Verify sw.js is accessible
  - Check console for errors

### 7. Android Installation Testing

- [ ] **Test on Android Device**
  - Open deployed URL in Chrome for Android
  - Look for install prompt
  - If no prompt, check menu > "Install app"
  - Install the app
  - Verify app icon appears on home screen

- [ ] **Verify PWA Features**
  - App opens in standalone mode (no browser UI)
  - Custom splash screen displays
  - Theme color applied to status bar
  - App shortcuts work (long-press icon)

- [ ] **Test Offline Functionality**
  - Open the app
  - Enable airplane mode
  - Verify app still works
  - Check that cached data is accessible

### 8. Post-Deployment

- [ ] **Monitor Performance**
  - Check Firebase Analytics (if enabled)
  - Monitor PWA install events
  - Track user engagement

- [ ] **Test on Multiple Devices**
  - Different Android versions
  - Different screen sizes
  - Different browsers (Chrome, Firefox, Samsung Internet)

- [ ] **Share Installation Instructions**
  - Provide users with URL
  - Explain how to install as PWA
  - Share benefits of installation

## Deployment Commands

### Standard Deployment

```bash
# 1. Build the project
npm run build

# 2. Deploy to Firebase
firebase deploy --only hosting

# 3. Verify deployment
# Visit: https://your-project.web.app
```

### Preview Deployment (Testing)

```bash
# Deploy to preview channel
firebase hosting:channel:deploy preview

# Test the preview URL before deploying to production
```

### Rollback (If Needed)

```bash
# List previous deployments
firebase hosting:releases:list

# Rollback to previous version
firebase hosting:rollback
```

## Common Issues and Solutions

### Issue: Install prompt doesn't appear

**Solutions:**
1. Verify HTTPS is enabled
2. Check manifest.json is valid JSON
3. Ensure at least one 192x192 icon exists
4. Verify service worker is registered
5. Try different browser (Chrome recommended)

### Issue: Icons not showing correctly

**Solutions:**
1. Check icon file paths in manifest.json
2. Verify icon files exist in public/icons/
3. Clear browser cache and reinstall
4. Check icon file formats (SVG or PNG)

### Issue: Not working offline

**Solutions:**
1. Verify service worker is activated
2. Check cache storage is populated
3. Ensure user has loaded app at least once online
4. Check service worker script for errors

### Issue: App closes immediately after launch

**Solutions:**
1. Check start_url in manifest.json
2. Verify Firebase config is correct
3. Check browser console for errors
4. Ensure service worker isn't blocking navigation

## Advanced: Trusted Web Activity (TWA)

To publish to Google Play Store as a native app:

### Prerequisites
- Deployed PWA with valid manifest
- HTTPS domain
- Digital Asset Links configured

### Steps

1. **Configure Asset Links**
   - Update `public/.well-known/assetlinks.json`
   - Add your app's package name and certificate fingerprint
   - Deploy to make it accessible

2. **Build TWA with Bubblewrap**
   ```bash
   npm install -g @bubblewrap/cli
   bubblewrap init --manifest https://your-domain.com/manifest.json
   bubblewrap build
   ```

3. **Test Locally**
   ```bash
   bubblewrap install
   ```

4. **Generate Signed APK**
   - Create keystore
   - Sign the APK
   - Test signed version

5. **Submit to Google Play**
   - Create developer account ($25 one-time fee)
   - Upload APK/AAB
   - Fill in store listing
   - Submit for review

### TWA Resources
- [Bubblewrap Documentation](https://github.com/GoogleChromeLabs/bubblewrap)
- [TWA Guide](https://developers.google.com/web/android/trusted-web-activity)
- [Digital Asset Links](https://developers.google.com/digital-asset-links/v1/getting-started)

## Monitoring and Analytics

### Firebase Analytics

```javascript
// Track PWA installation
import { logEvent } from 'firebase/analytics';

window.addEventListener('appinstalled', (event) => {
  logEvent(analytics, 'pwa_installed');
});
```

### Performance Monitoring

```javascript
// Monitor page load times
import { getPerformance } from 'firebase/performance';
const perf = getPerformance(app);
```

## Distribution Options

### Option 1: Direct URL (Easiest)
- Share your deployed URL
- Users install via browser
- No app store required

### Option 2: QR Code
- Generate QR code for your URL
- Users scan to visit and install
- Good for physical marketing

### Option 3: Google Play Store (TWA)
- Package as TWA
- Submit to Play Store
- Appears as native app
- Requires more setup

### Option 4: Samsung Galaxy Store
- Similar to Google Play
- May have lower competition
- Good for Samsung users

## Security Considerations

### Content Security Policy (CSP)

Add to index.html if needed:
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com;
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               font-src 'self' https://fonts.gstatic.com;
               img-src 'self' data: https:;
               connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;">
```

### Service Worker Security
- Only caches same-origin requests
- HTTPS enforced by browsers
- No sensitive data in cache
- Regular updates maintain security

## Performance Optimization

### For Android Devices

1. **Reduce JavaScript Bundle**
   - Already configured with code splitting
   - Lazy load heavy components
   - Use dynamic imports

2. **Optimize Images**
   - Use appropriate sizes
   - Consider WebP format
   - Lazy load images

3. **Cache Strategy**
   - Critical assets cached immediately
   - Non-critical assets cached on demand
   - Update strategy for new versions

## Maintenance

### Regular Updates

1. **Service Worker Cache Version**
   - Increment version in sw.js when updating
   - Users will get updated content automatically

2. **Manifest Updates**
   - Update manifest when changing branding
   - Users may need to reinstall for major changes

3. **Monitor Issues**
   - Check Firebase console regularly
   - Monitor error logs
   - Track user feedback

## Next Steps After Deployment

1. **Share with Users**
   - Provide installation instructions
   - Create video tutorial if needed
   - Explain benefits of PWA installation

2. **Gather Feedback**
   - Monitor user issues
   - Track installation rates
   - Collect feature requests

3. **Iterate and Improve**
   - Add push notifications (future)
   - Implement background sync (future)
   - Add share target (future)

## Resources

### Documentation
- [Era Manifesto Android Guide](./android.md)
- [Web Deployment Guide](./web.md)
- [Firebase Setup](../getting-started/FIREBASE_SETUP.md)

### External Resources
- [PWA Builder](https://www.pwabuilder.com/) - Validate and improve PWA
- [web.dev PWA](https://web.dev/progressive-web-apps/) - Best practices
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

## Checklist Summary

Quick reference for deployment:

- [x] Build configuration optimized
- [x] PWA assets configured
- [x] Service worker implemented
- [x] Icons and manifest ready
- [x] Firebase config updated
- [ ] Local testing completed
- [ ] Lighthouse audit passed
- [ ] Deployed to Firebase
- [ ] Tested on Android device
- [ ] Installation verified
- [ ] Offline functionality confirmed

## Support

If you encounter issues:
1. Check this checklist for missed steps
2. Review [android.md](./android.md) troubleshooting section
3. Test in Chrome DevTools first
4. Check Firebase hosting logs
5. Open GitHub issue if needed

---

**Last Updated:** February 2026

**Ready for Android deployment!** 📱✨
