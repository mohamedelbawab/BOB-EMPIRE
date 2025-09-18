# Bob Empire Desktop App

This is the desktop application for Bob Empire - Global AI Commerce Platform.

## Features

- **Professional Desktop UI** - Native-like experience with custom title bar
- **Real-time Synchronization** - WebSocket + Supabase for instant device sync
- **140+ AI Agents** - Manage and run intelligent agents for automation
- **35+ Global Platforms** - Connect to worldwide e-commerce and social platforms
- **Voice Commands** - Arabic/English speech recognition and text-to-speech
- **QR Device Linking** - Easy device pairing with QR codes
- **Multi-language Support** - Arabic and English interface
- **Theme Support** - Dark, light, and auto themes
- **Cross-platform** - Windows, macOS, and Linux support

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment (Optional)
```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Run in Development
```bash
npm run dev
```

### 4. Build for Production
```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build-win    # Windows
npm run build-mac    # macOS
npm run build-linux  # Linux
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Required for full functionality
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
WEBSOCKET_URL=ws://localhost:3000/ws
API_BASE_URL=http://localhost:3000

# Optional for enhanced features
OPENAI_API_KEY=your-openai-key
```

## Keyboard Shortcuts

- `Ctrl+1` - Dashboard
- `Ctrl+2` - Store Management  
- `Ctrl+3` - AI Agents
- `Ctrl+4` - Platform Connections
- `Ctrl+Shift+S` - Manual Sync
- `F11` - Fullscreen
- `F12` - Developer Tools

## Menu Actions

### File Menu
- New Project (`Ctrl+N`)
- Open File (`Ctrl+O`)
- Save (`Ctrl+S`)
- Settings (`Ctrl+,`)

### Tools Menu
- AI Chat (`Ctrl+1`)
- Store Management (`Ctrl+2`)
- Smart Agents (`Ctrl+3`)
- Platform Connections (`Ctrl+4`)
- Data Sync (`Ctrl+Shift+S`)
- Link New Device (QR Code)

## Architecture

```
desktop_app/
├── src/
│   ├── main.js              # Electron main process
│   └── renderer/            # Frontend application
│       ├── index.html       # Main HTML
│       ├── css/            # Styles
│       │   ├── styles.css   # Main styles
│       │   ├── themes.css   # Theme support
│       │   └── components.css # Component styles
│       └── js/             # JavaScript
│           ├── app.js       # Main application
│           ├── components/  # UI components
│           └── utils/       # Utility functions
├── assets/                 # Icons and images
├── build/                  # Build configuration
└── dist/                   # Built applications
```

## Features Details

### Real-time Synchronization
- WebSocket connection for instant updates
- Supabase integration for persistent storage
- Cross-device data synchronization
- Offline support with sync when reconnected

### AI Agents Management
- 140+ pre-configured intelligent agents
- Custom agent creation and configuration
- Real-time agent status monitoring
- Task assignment and execution tracking

### Global Platform Integration
- 35+ supported platforms including:
  - E-commerce: Amazon, Shopify, AliExpress, Alibaba
  - Social: Facebook, Instagram, WhatsApp, Telegram
  - Regional: Noon, Jumia, Souq (Middle East/Africa)
  - Asian: Coupang, Rakuten, Shopee, Lazada

### Voice Commands
- Arabic and English speech recognition
- Text-to-speech responses
- Voice-activated agent commands
- Accessibility support

### Device Linking
- QR code generation for device pairing
- Secure device authentication
- Multi-device session management
- Automatic sync across linked devices

## Build Configuration

The app uses `electron-builder` for packaging:

- **Windows**: NSIS installer
- **macOS**: DMG package
- **Linux**: AppImage

Auto-updater support included for seamless updates.

## Security

- Environment variables for sensitive data
- Secure WebSocket connections
- Device-specific authentication tokens
- Data encryption for local storage

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check if backend server is running on port 3000
   - Verify WEBSOCKET_URL in environment

2. **Voice Commands Not Working**
   - Check microphone permissions
   - Ensure browser supports Speech Recognition

3. **Build Fails**
   - Run `npm install` to ensure all dependencies
   - Check Node.js version (>= 16 required)

### Debug Mode

Run with debug logging:
```bash
npm run dev -- --debug
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the GitHub issues
3. Contact support team

---

**Built with ❤️ for global commerce powered by AI**