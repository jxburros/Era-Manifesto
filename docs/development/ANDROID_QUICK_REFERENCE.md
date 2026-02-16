# Android App Quick Reference

## Overview

Era Manifesto is now available as both a Progressive Web App (PWA) and a native Android app using Capacitor.

## Prerequisites

- Node.js and npm installed
- Android Studio Arctic Fox or later
- JDK 17 or later

## Quick Commands

### Build and Sync to Android
```bash
npm run android:sync
```
Builds the web app and copies files to the Android project.

### Open in Android Studio
```bash
npm run android:open
```
Opens the `android/` folder in Android Studio.

### All-in-One Command
```bash
npm run android:run
```
Builds, syncs, and opens in Android Studio in one step.

## Development Workflow

1. **Make changes** to your web app code in `src/`
2. **Build and sync**: `npm run android:sync`
3. **Run in Android Studio**: Click the Run button (▶)

## Project Structure

```
Era-Manifesto/
├── android/                  # Native Android project (managed by Capacitor)
│   ├── app/
│   │   └── src/main/
│   │       ├── assets/public/    # Built web app
│   │       ├── java/             # Native Android code
│   │       ├── res/              # Android resources
│   │       └── AndroidManifest.xml
│   └── build.gradle
├── src/                      # Web app source
├── dist/                     # Built web app (git-ignored)
├── capacitor.config.ts       # Capacitor configuration
└── package.json             # npm scripts
```

## Configuration Files

- **capacitor.config.ts** - Main Capacitor configuration
- **android/app/build.gradle** - Android build configuration
- **android/app/src/main/AndroidManifest.xml** - Android app manifest
- **android/app/src/main/res/values/strings.xml** - App name and strings

## Running on Device/Emulator

### Emulator
1. In Android Studio, click device dropdown
2. Select "Create Device" if needed
3. Choose a device (Pixel 5 recommended)
4. Click Run (▶)

### Physical Device
1. Enable Developer Mode and USB Debugging on device
2. Connect via USB
3. Select device from dropdown
4. Click Run (▶)

## Debugging

### JavaScript Console
- Open Logcat in Android Studio
- Filter by package: `com.eramanifesto.app`

### Chrome DevTools
1. Connect device or start emulator
2. In Chrome, go to `chrome://inspect`
3. Find "Era Manifesto" and click "inspect"

## Adding Native Features

To add Capacitor plugins:

```bash
npm install @capacitor/[plugin-name]
npx cap sync android
```

Popular plugins:
- `@capacitor/camera` - Camera access
- `@capacitor/filesystem` - File system
- `@capacitor/share` - Native sharing
- `@capacitor/splash-screen` - Splash screen
- `@capacitor/status-bar` - Status bar styling

## Troubleshooting

### White screen on launch
```bash
npm run android:sync
```
Then rebuild in Android Studio.

### Assets not updating
```bash
rm -rf android/app/src/main/assets/public
npm run android:sync
```

### Gradle build failed
```bash
cd android
./gradlew clean
./gradlew build
```

## Building Release APK

```bash
cd android
./gradlew assembleRelease
```
APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Documentation

- **[Android Studio Guide](ANDROID_STUDIO_GUIDE.md)** - Complete setup and development guide
- **[Android Deployment Ready](../../ANDROID_DEPLOYMENT_READY.md)** - Overview of Android setup
- **[Capacitor Docs](https://capacitorjs.com/docs)** - Official Capacitor documentation

## App Information

- **App ID**: `com.eramanifesto.app`
- **App Name**: Era Manifesto
- **Package**: `com.eramanifesto.app`
- **Min SDK**: 22 (Android 5.1)
- **Target SDK**: 34 (Android 14)

## Key Files to Know

| File | Purpose |
|------|---------|
| `capacitor.config.ts` | Capacitor configuration |
| `android/app/src/main/AndroidManifest.xml` | Android manifest |
| `android/app/build.gradle` | App build config |
| `android/app/src/main/java/.../MainActivity.java` | Main activity |
| `android/app/src/main/res/values/strings.xml` | App strings |

## Common Tasks

### Change App Name
Edit `android/app/src/main/res/values/strings.xml`

### Change App ID
Edit `capacitor.config.ts` and run `npx cap sync android`

### Update App Icon
Right-click `android/app/src/main/res` → New → Image Asset

### Update Splash Screen
Edit splash images in `android/app/src/main/res/drawable-*/splash.png`

## Support

For detailed instructions, see [ANDROID_STUDIO_GUIDE.md](ANDROID_STUDIO_GUIDE.md)

For issues, check [GitHub Issues](https://github.com/jxburros/Era-Manifesto/issues)

---

**Last Updated:** February 16, 2026
