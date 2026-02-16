# Android Studio Setup Guide

This guide explains how to open and run the Era Manifesto Android app in Android Studio.

## Prerequisites

1. **Android Studio** installed (Arctic Fox 2020.3.1 or later)
   - Download from: https://developer.android.com/studio
   
2. **JDK 17** or later installed
   - Android Studio typically includes this
   
3. **Node.js and npm** (for building the web app)
   - Already required for the web version

## Quick Start

### 1. Build the Web App

Before opening in Android Studio, you must build the web app:

```bash
npm install
npm run build
```

### 2. Sync Android Assets

Sync the built web app to the Android project:

```bash
npm run android:sync
```

This command:
- Builds the web app (`npm run build`)
- Copies the built files to `android/app/src/main/assets/public`
- Updates Capacitor plugins

### 3. Open in Android Studio

Run the following command to open the Android project:

```bash
npm run android:open
```

Or manually:
1. Open Android Studio
2. Click "Open an Existing Project"
3. Navigate to `Era-Manifesto/android` folder
4. Click "OK"

### 4. Configure Android SDK

If prompted, allow Android Studio to:
- Download required SDK versions
- Install build tools
- Sync Gradle

This may take a few minutes on first run.

### 5. Run the App

**On Emulator:**
1. Click the device dropdown in the toolbar
2. Select "Create New Virtual Device" if needed
3. Choose a device (Pixel 5 recommended)
4. Click the green "Run" button (▶)

**On Physical Device:**
1. Enable Developer Mode on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"
2. Connect device via USB
3. Select your device from the device dropdown
4. Click the green "Run" button (▶)

## Development Workflow

### Making Code Changes

When you modify the web app code:

```bash
# 1. Make your changes to src/ files
# 2. Build and sync
npm run android:sync

# 3. In Android Studio, click "Run" to reload the app
```

### Updating Capacitor Configuration

If you modify `capacitor.config.ts`:

```bash
npx cap sync android
```

### Adding Capacitor Plugins

To add native functionality:

```bash
# Install the plugin
npm install @capacitor/[plugin-name]

# Sync to Android
npx cap sync android
```

Popular plugins:
- `@capacitor/camera` - Camera access
- `@capacitor/filesystem` - File system access
- `@capacitor/share` - Native sharing
- `@capacitor/splash-screen` - Splash screen control
- `@capacitor/status-bar` - Status bar styling

### Debugging

**JavaScript Console:**
- In Android Studio, open "Logcat" (bottom panel)
- Filter by package name: `com.eramanifesto.app`
- JavaScript logs appear as `Console` or `Chromium` tags

**Chrome DevTools:**
1. Connect device or start emulator
2. In Chrome browser, go to: `chrome://inspect`
3. Find "Era Manifesto" in the list
4. Click "inspect"

**Android Studio Debugger:**
- Set breakpoints in native code (if any)
- Click the "Debug" button (🐞) instead of "Run"

## Building Release APK

### 1. Generate Signing Key

```bash
cd android
keytool -genkey -v -keystore my-release-key.keystore -alias era-manifesto -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing

Create `android/keystore.properties`:

```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=era-manifesto
storeFile=my-release-key.keystore
```

### 3. Update build.gradle

Edit `android/app/build.gradle` to add signing config (already configured by Capacitor).

### 4. Build Release APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Troubleshooting

### Gradle Build Failed

```bash
cd android
./gradlew clean
./gradlew build
```

### Assets Not Updating

```bash
# Clean and rebuild
rm -rf android/app/src/main/assets/public
npm run android:sync
```

### Plugin Issues

```bash
# Remove and re-add Android platform
npx cap sync android --force
```

### White Screen on Launch

1. Check Logcat for errors
2. Ensure `npm run build` completed successfully
3. Verify `dist/index.html` exists
4. Try: `npm run android:sync`

## Project Structure

```
Era-Manifesto/
├── android/                          # Android native project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── assets/public/       # Built web app files
│   │   │   ├── java/                # Native Java/Kotlin code
│   │   │   ├── res/                 # Android resources
│   │   │   └── AndroidManifest.xml  # App manifest
│   │   └── build.gradle             # App-level build config
│   ├── gradle/                       # Gradle wrapper
│   └── build.gradle                 # Project-level build config
├── src/                              # Web app source code
├── dist/                             # Built web app (git-ignored)
├── capacitor.config.ts               # Capacitor configuration
└── package.json                      # npm scripts
```

## Available npm Scripts

- `npm run build` - Build the web app
- `npm run android:sync` - Build and sync to Android
- `npm run android:open` - Open in Android Studio
- `npm run android:run` - Build, sync, and open (all-in-one)

## App Configuration

### App ID and Name

Edit `capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  appId: 'com.eramanifesto.app',  // Change if needed
  appName: 'Era Manifesto',       // Display name
  webDir: 'dist',
  // ... other config
};
```

After changing, run:
```bash
npx cap sync android
```

### App Icon and Splash Screen

**App Icon:**
- Edit `android/app/src/main/res/mipmap-*/ic_launcher.png`
- Use Android Studio: Right-click `res` → New → Image Asset

**Splash Screen:**
- Edit `android/app/src/main/res/drawable/splash.png`
- Configure in `android/app/src/main/res/values/styles.xml`

### Permissions

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <!-- Add more as needed -->
</manifest>
```

## Firebase Configuration (Optional)

If using Firebase in Android:

1. Download `google-services.json` from Firebase Console
2. Place in `android/app/`
3. Add to `android/app/build.gradle`:
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```

## Testing Checklist

Before release:

- [ ] App builds without errors
- [ ] App launches successfully
- [ ] All major features work
- [ ] Firebase sync works (if enabled)
- [ ] Offline mode works
- [ ] App icon appears correctly
- [ ] No console errors in Logcat
- [ ] Performance is acceptable
- [ ] Back button behavior is correct
- [ ] Deep links work (if implemented)

## Performance Tips

1. **Optimize Build Size:**
   - Run `npm run build` with production mode
   - Enable ProGuard in `android/app/build.gradle`

2. **Improve Load Time:**
   - Implement splash screen
   - Lazy load heavy components
   - Cache assets aggressively

3. **Memory Management:**
   - Monitor memory in Android Studio Profiler
   - Clear unused data in app lifecycle

## Next Steps

- **Distribution:** See `ANDROID_DEPLOYMENT_CHECKLIST.md` for Play Store submission
- **PWA Version:** App can also be installed as PWA from browser
- **Updates:** OTA updates via web, or full update via Play Store

## Resources

- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Android Studio User Guide](https://developer.android.com/studio/intro)
- [Era Manifesto Documentation](../README.md)

## Support

For issues:
1. Check Android Studio Logcat
2. Review this guide's troubleshooting section
3. See [GitHub Issues](https://github.com/jxburros/Era-Manifesto/issues)
4. Consult [Capacitor Community](https://ionic.io/community)

---

**Last Updated:** February 16, 2026

**Ready to develop!** 🚀📱
