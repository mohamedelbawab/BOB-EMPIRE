# BOB EMPIRE - Complete Platform Setup Guide

This guide covers the setup and configuration for both the Android mobile app and Desktop app for the BOB EMPIRE platform.

## 🚀 Platform Overview

BOB EMPIRE is a comprehensive AI-powered global commerce platform consisting of:

1. **Android Mobile App** (Flutter) - Complete mobile experience with voice commands
2. **Desktop App** (Electron) - Professional desktop application  
3. **Web Backend** (Node.js + Express) - API and business logic
4. **Real-time Sync** (WebSocket + Supabase) - Instant cross-device synchronization

## 📱 Android App Setup

### Prerequisites
- Flutter SDK (3.0+)
- Android Studio or VS Code
- Android device/emulator

### Installation
```bash
cd android_app
flutter pub get
flutter run
```

### Environment Configuration
Create `android_app/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
API_BASE_URL=http://your-server.com:3000
WEBSOCKET_URL=ws://your-server.com:3000/ws
OPENAI_API_KEY=your-openai-key
```

### Building APK
```bash
flutter build apk --release
# APK will be in build/app/outputs/flutter-apk/
```

### Features
- ✅ **Voice-Enabled AI Chat** - Arabic/English speech recognition
- ✅ **140+ Smart Agents** - Full agent management and execution
- ✅ **35+ Global Platforms** - Amazon, Shopify, AliExpress, etc.
- ✅ **Real-time Sync** - Instant data synchronization
- ✅ **QR Device Linking** - Pair devices easily
- ✅ **Multi-language** - Arabic/English with RTL support
- ✅ **Professional UI** - Material Design 3

## 🖥️ Desktop App Setup

### Prerequisites
- Node.js (16+)
- npm or yarn

### Installation
```bash
cd desktop_app
npm install
npm run dev
```

### Environment Configuration
Create `desktop_app/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
API_BASE_URL=http://localhost:3000
WEBSOCKET_URL=ws://localhost:3000/ws
OPENAI_API_KEY=your-openai-key
```

### Building Executables
```bash
# Build for current platform
npm run build

# Platform-specific builds
npm run build-win    # Windows
npm run build-mac    # macOS  
npm run build-linux  # Linux
```

### Features
- ✅ **Professional Desktop UI** - Native-like experience
- ✅ **Real-time Dashboard** - Live statistics and monitoring
- ✅ **Complete Agent Management** - Full CRUD operations
- ✅ **Platform Integration Hub** - Manage all 35+ platforms
- ✅ **Voice Commands** - Desktop speech recognition
- ✅ **Cross-device Sync** - Instant synchronization
- ✅ **File Operations** - Import/export data
- ✅ **System Integration** - OS notifications, tray support

## 🔧 Backend Server Setup

### Installation
```bash
cd /path/to/BOB-EMPIRE
npm install
npm start
```

### Environment Configuration
Create `.env`:
```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI Configuration  
OPENAI_API_KEY=your-openai-key-here

# Server Configuration
PORT=3000
NODE_ENV=production

# Platform API Keys (Optional)
AMAZON_API_KEY=your-amazon-key
SHOPIFY_API_KEY=your-shopify-key
# ... add other platform keys as needed
```

## 🔄 Real-time Synchronization Setup

### Supabase Configuration

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get URL and anon key

2. **Database Tables** (Optional - for enhanced sync)
   ```sql
   -- Sync data table
   CREATE TABLE sync_data (
     id SERIAL PRIMARY KEY,
     device_id TEXT NOT NULL,
     data JSONB NOT NULL,
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Agents table
   CREATE TABLE agents (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     role TEXT NOT NULL,
     status TEXT DEFAULT 'idle',
     description TEXT,
     config JSONB DEFAULT '{}'
   );

   -- Platforms table
   CREATE TABLE platforms (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     connected BOOLEAN DEFAULT false,
     last_sync TIMESTAMP,
     config JSONB DEFAULT '{}'
   );
   ```

3. **Real-time Subscriptions**
   - Enable real-time for tables
   - Configure row-level security if needed

### WebSocket Server
The WebSocket server runs on the same port as the main server (3000) and handles:
- Device registration and linking
- Real-time data synchronization  
- Chat message broadcasting
- Agent status updates
- Platform connection events

## 📱 Device Linking Process

### QR Code Linking
1. **Desktop App**: Generate QR code from sync section
2. **Mobile App**: Scan QR code from settings
3. **Automatic Pairing**: Devices link via WebSocket
4. **Real-time Sync**: All data syncs instantly

### Manual Linking
1. Get device ID from app settings
2. Enter device ID in other app
3. Confirm linking request
4. Start synchronization

## 🎯 Features Matrix

| Feature | Android App | Desktop App | Web Backend |
|---------|-------------|-------------|-------------|
| AI Chat with Voice | ✅ | ✅ | ✅ |
| 140+ Smart Agents | ✅ | ✅ | ✅ |
| 35+ Global Platforms | ✅ | ✅ | ✅ |
| Real-time Sync | ✅ | ✅ | ✅ |
| QR Device Linking | ✅ | ✅ | ✅ |
| Multi-language | ✅ | ✅ | ✅ |
| Dark/Light Themes | ✅ | ✅ | N/A |
| Voice Commands | ✅ | ✅ | N/A |
| Push Notifications | ✅ | ✅ | N/A |
| File Operations | ❌ | ✅ | ✅ |
| System Tray | ❌ | ✅ | N/A |
| Keyboard Shortcuts | ❌ | ✅ | N/A |

## 🔐 Security Configuration

### API Keys Management
- Store sensitive keys in environment variables
- Use different keys for development/production
- Regularly rotate API keys
- Monitor API usage

### Device Security
- Unique device IDs for each installation
- Secure WebSocket connections (WSS in production)
- Token-based authentication
- Data encryption for sensitive information

## 🚀 Production Deployment

### Server Deployment
```bash
# Build and deploy server
npm run build
pm2 start server.js --name bob-empire

# Or use Docker
docker build -t bob-empire .
docker run -p 3000:3000 bob-empire
```

### Mobile App Deployment
```bash
# Build signed APK for Google Play
flutter build appbundle --release

# For direct distribution
flutter build apk --release --split-per-abi
```

### Desktop App Deployment
```bash
# Create distributables
npm run dist

# Upload to release channels
# - Windows: Microsoft Store, direct download
# - macOS: App Store, direct download  
# - Linux: Snap Store, AppImage, direct download
```

## 🛠️ Development Workflow

### 1. Environment Setup
- Clone repository
- Install dependencies for all apps
- Configure environment variables
- Start development servers

### 2. Feature Development
- Make changes in respective app directories
- Test on all platforms
- Ensure synchronization works
- Update documentation

### 3. Testing
```bash
# Test backend
npm test

# Test Android app
cd android_app && flutter test

# Test desktop app
cd desktop_app && npm test
```

### 4. Deployment
- Build all applications
- Test in production environment
- Deploy server first, then apps
- Monitor for issues

## 📞 Support & Troubleshooting

### Common Issues

1. **Sync Not Working**
   - Check WebSocket connection
   - Verify environment variables
   - Ensure server is running

2. **Voice Commands Failing**
   - Check microphone permissions
   - Verify speech recognition support
   - Test with different languages

3. **Platform Connections Failing**
   - Verify API keys are correct
   - Check platform API status
   - Review rate limiting

### Getting Help
- Check application logs
- Review environment configuration
- Test with demo/development keys first
- Contact support team if needed

---

**🏆 Bob Empire - Empowering Global Commerce with AI**

Built with cutting-edge technology for seamless cross-platform experience.