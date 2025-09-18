# 👑 Bob Empire - Global AI Commerce Platform

**منصة تجارة عالمية يقودها الذكاء الاصطناعي**

A comprehensive AI-driven global commerce platform that connects to 30+ international marketplaces and payment systems with 140+ AI agents for automated business operations.

![Bob Empire Main Interface](https://github.com/user-attachments/assets/ccf936c5-eac1-4ccf-8fcf-c486d11e5bc2)

## ✨ Features

### 🤖 AI-Powered Agent System
- **140+ Pre-configured AI Agents** for various business functions
- **SuperAI Command Interface** for natural language control
- **Dynamic Agent Management** - Add, remove, and configure agents on-the-fly
- **Real-time Agent Status Monitoring**

### 🌍 Global Platform Integration
**E-commerce Marketplaces:**
- Amazon, Shopify, AliExpress, Alibaba
- Coupang (Korea), Rakuten (Japan)
- Shopee, Lazada (Southeast Asia)
- MercadoLibre (Latin America)
- Flipkart (India), Ozon, Wildberries (Russia)
- Noon, Jumia, Souq (MENA/Africa), OLX

**Social Media Platforms:**
- Facebook, Instagram, WhatsApp, Telegram
- LinkedIn, TikTok, X (Twitter), WeChat, VK

**Payment Systems:**
- Stripe, PayPal, Paymob, Fawry, Wise
- Apple Pay, Google Pay, Alipay, KakaPay, LINE Pay

### 📊 Real-time Dashboard
- Order tracking and revenue monitoring
- Agent performance metrics
- Turbo mode for enhanced processing
- Connection status monitoring

### 🗄️ Supabase Integration
- Real-time data synchronization
- Persistent configuration storage
- Agent and flow state management
- Automatic fallback to localStorage

## 🚀 Quick Start

### Option 1: Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mohamedelbawab/BOB-EMPIRE)

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Add environment variables in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Deploy and access your live application!

### Option 2: Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohamedelbawab/BOB-EMPIRE.git
   cd BOB-EMPIRE
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Start development server:**
   ```bash
   python3 -m http.server 8000
   # or use any static file server
   ```

5. **Access the application:**
   Open http://localhost:8000 in your browser

## 🛠️ Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Settings > API

### 2. Create Database Tables
Run these SQL commands in your Supabase SQL editor:

```sql
-- Health monitoring table
CREATE TABLE health_ping (
  id BIGINT PRIMARY KEY,
  message TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Configuration storage
CREATE TABLE config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Agents management
CREATE TABLE agents (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'assistant',
  status TEXT DEFAULT 'idle',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation flows
CREATE TABLE flows (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  trigger TEXT DEFAULT 'manual',
  steps JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product catalog
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Environment Variables

For Vercel deployment, add these in your project settings:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🎮 Using the SuperAI Interface

### Available Commands

**🤖 Agent Management:**
```bash
/run <id> <text>          # Execute agent with specific ID
/add-agent <name>         # Create new AI agent
/remove-agent <id>        # Remove agent by ID
/list-agents [count]      # List agents (default: 10)
```

**🔗 Platform Connections:**
```bash
/connect all              # Connect all global platforms
/connect <platform>       # Connect specific platform (amazon, shopify, etc.)
```

**⚙️ System Control:**
```bash
/turbo on|off            # Toggle turbo mode
/status                  # Show system status
/test-supabase          # Test database connection
```

**🔄 Flow Management:**
```bash
/flows                   # Flow management commands
/help                   # Show all available commands
```

### Quick Actions
Use the interface buttons for common operations:
- **Test Supabase**: Verify database connectivity
- **Connect All Platforms**: Establish connections to all 30+ platforms
- **List Agents**: Display current AI agents
- **System Status**: Show dashboard metrics

## 🏗️ Architecture

### Frontend
- **Vanilla JavaScript ES6+** for maximum compatibility
- **Modular design** with separate config, main, and core logic files
- **Responsive CSS** with dark theme and gold accents
- **Progressive Web App** ready with manifest.json

### Backend Integration
- **Supabase** for real-time database operations
- **RESTful API** design for platform integrations
- **Mock mode fallback** when external services are unavailable
- **localStorage backup** for offline functionality

### File Structure
```
BOB-EMPIRE/
├── index.html              # Main application interface
├── main.js                 # UI logic and event handlers
├── BOB_EMPIRE_FINAL.js     # Core business logic and AI agents
├── config.js               # Environment configuration
├── style.css               # Application styling
├── agents.json             # Agent configurations
├── flows.json              # Automation flow definitions
├── vercel.json             # Vercel deployment configuration
├── .env.example            # Environment variables template
└── README.md               # This documentation
```

## 🔧 Customization

### Adding New Agents
```javascript
// In BOB_EMPIRE_FINAL.js or via UI
const newAgent = {
  name: "Custom Agent",
  role: "specialized_task",
  status: "idle"
};
addAgent(newAgent);
```

### Adding New Platform Connections
```javascript
// In BOB_EMPIRE_FINAL.js
export async function connectNewPlatform() {
  console.log("🔗 New Platform connected");
  // Add your integration logic here
}
```

### Customizing UI Theme
Edit the CSS variables in `index.html` or create a separate `style.css` file:
```css
:root {
  --primary-color: #ffd700;
  --bg-color: #000000;
  --text-color: #ffffff;
}
```

## 🚨 Troubleshooting

### Common Issues

**1. "CDN blocked" or Supabase connection issues:**
- The app will automatically fall back to mock mode
- Check your environment variables are correctly set
- Verify Supabase project is active and accessible

**2. Agents not loading:**
- Check that `agents.json` is accessible
- The app will use default agents if file is unavailable
- Verify JSON syntax is correct

**3. Commands not working:**
- Ensure you're using the correct command syntax (start with `/`)
- Check browser console for any JavaScript errors
- Try the quick action buttons as alternatives

### Debug Mode
Open browser developer tools to see detailed logs and connection status.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the browser console for error messages

---

**Built with ❤️ for global commerce automation**
