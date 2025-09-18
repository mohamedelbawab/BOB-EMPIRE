# Android Build Guide for Bob Empire

## Prerequisites
- Android Studio installed
- Android SDK (API Level 21+)
- Java Development Kit (JDK 11 or higher)
- Node.js and npm

## Quick Start

1. **Install React Native CLI** (if not already installed):
   ```bash
   npm install -g react-native-cli
   ```

2. **Install dependencies**:
   ```bash
   cd android
   npm install
   ```

3. **Connect Android device or start emulator**

4. **Run the app**:
   ```bash
   npm run android
   ```

## Building Release APK

1. **Build release APK**:
   ```bash
   npm run build:android
   ```

2. **Build AAB for Google Play**:
   ```bash
   npm run build:android-aab
   ```

## Configuration

### 1. Update API URL
Edit `BobEmpireApp.js` and change the `API_URL` to your deployed backend:

```javascript
const API_URL = 'https://your-deployed-backend.vercel.app';
```

### 2. App Signing (for release)
Create a keystore file for signing your app:

```bash
keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 3. Google Play Console
1. Create a new app in Google Play Console
2. Upload the AAB file
3. Fill in app details and store listing
4. Submit for review

## Features

- **WebView Integration**: Displays the Bob Empire web app
- **Offline Detection**: Shows error when no internet connection
- **Auto-login**: Remembers user sessions
- **Native Alerts**: Uses native Android alerts
- **Deep Linking**: Supports custom URL schemes
- **Auto-updater**: Can be configured for OTA updates

## Customization

### App Icon
Replace icons in `android/app/src/main/res/mipmap-*` folders

### App Name
Edit `android/app/src/main/res/values/strings.xml`

### Package Name
Change `com.bobempire` in:
- `AndroidManifest.xml`
- `package.json` (applicationId)
- Folder structure

## Troubleshooting

### Common Issues

1. **Metro bundler not starting**:
   ```bash
   npx react-native start --reset-cache
   ```

2. **App not installing**:
   ```bash
   adb uninstall com.bobempire
   npm run android
   ```

3. **Network requests failing**:
   - Check if `usesCleartextTraffic="true"` is set in AndroidManifest.xml
   - Verify API URL is correct
   - Ensure network permissions are granted

### Debug Mode
Enable debug mode by setting `__DEV__` to `true` in the app to see console logs and use localhost API.

## Deployment Checklist

- [ ] Update API URL to production
- [ ] Test on physical device
- [ ] Generate signed APK/AAB
- [ ] Test installation from APK
- [ ] Update app version in package.json
- [ ] Create store listing in Google Play Console
- [ ] Upload to Google Play Console
- [ ] Submit for review

## Support

For issues with the Android app, please check:
1. React Native documentation
2. Android development guides
3. Bob Empire main repository issues