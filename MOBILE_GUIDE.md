# Mobile Quick Start Guide 📱

Era Manifesto is now a full Progressive Web App (PWA) with offline support and native-like features!

## Access Era Manifesto on Your Android Phone

### Method 1: Open in Browser
1. Open Chrome, Firefox, or your preferred browser on your Android device
2. Navigate to your deployed Era Manifesto URL
3. The app is fully responsive and works great on mobile!

### Method 2: Install as PWA (Recommended) ⭐
1. Open the Era Manifesto URL in Chrome on your Android device
2. Tap the **menu button** (⋮) in the top-right corner
3. Select **"Install app"** or **"Add to Home screen"**
4. Name it "Era Manifesto" or your preferred name
5. Tap **"Install"** or **"Add"**
6. The app icon will appear on your home screen like a native app!

**New PWA Features:**
- ✅ Standalone app window (no browser UI)
- ✅ Works offline with cached data
- ✅ Fast app-like performance
- ✅ Custom app icon on home screen
- ✅ Quick shortcuts (long-press icon)

For detailed PWA installation instructions, see the **[Android Deployment Guide](ANDROID_DEPLOYMENT.md)**.

## Syncing Between PC and Android

### First Time Setup

#### On Your PC:
1. Open Era Manifesto
2. Go to **Settings** (gear icon in sidebar)
3. Scroll to **"Cloud Sync (Optional)"**
4. Click **"Connect Cloud"**
5. Paste your Firebase configuration JSON
6. Click OK

#### On Your Android Phone:
1. Open Era Manifesto (from home screen or browser)
2. Tap the **menu** (☰) button to open the sidebar
3. Tap **Settings**
4. Scroll to **"Cloud Sync (Optional)"**
5. Tap **"Connect Cloud"**
6. Paste the **same Firebase configuration JSON** (you can email it to yourself)
7. Tap OK

### Verification
- Add a task on your PC → It should appear on your phone
- Add a task on your phone → It should appear on your PC
- Changes sync automatically when you have internet!

## Mobile Tips & Tricks

### Navigation
- **Tap the menu (☰)** in the top-left to open the sidebar
- **Swipe** or use back button to close the sidebar
- All views are optimized for touch input

### Offline Mode
- The app works offline using local storage
- Changes sync automatically when you reconnect
- No internet? No problem—keep working!

### Best Practices
1. **Add to Home Screen** for the best experience
2. **Use landscape mode** on phone for more screen space when editing
3. **Use Chrome** for best compatibility and performance
4. **Enable notifications** (if supported) to stay updated

### Editing Tasks on Mobile
1. Tap any task to open the editor
2. Swipe between tabs (Details, Finance, Photos)
3. Use the on-screen keyboard for input
4. Tap outside or use the X to close

### Taking Photos
1. Open a task
2. Go to the "Photos" tab
3. Tap "Choose File" or camera icon
4. Take a new photo or select from gallery
5. Photos sync across all devices!

## Troubleshooting

### App Won't Load
- Check your internet connection
- Clear browser cache
- Try a different browser
- Verify the URL is correct

### Not Syncing
- Ensure you're connected to internet
- Verify Firebase config is the same on both devices
- Check that you're logged in (anonymous auth should be automatic)
- Try refreshing the page

### Can't Add to Home Screen
- Make sure you're using Chrome or a compatible browser
- Some browsers don't support this feature
- Try the browser's "Desktop Site" option if needed

### Performance Issues
- Close other browser tabs
- Restart your browser
- Clear browser cache and data
- Update your browser to the latest version

## Privacy on Mobile

- Your data is stored locally on your device
- Cloud sync is optional—only enable if you want it
- No tracking or analytics without your consent
- You control your data completely

## Need Help?

If you encounter issues:
1. Check the main [Firebase Setup Guide](FIREBASE_SETUP.md)
2. Review the [Deployment Guide](DEPLOYMENT.md)
3. Verify your internet connection
4. Try the desktop version to verify sync is working

---

**Enjoy Era Manifesto on the go!** 🎵📱
