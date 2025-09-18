# BOB Empire - Global AI Commerce Platform

BOB Empire is a comprehensive global AI commerce platform that integrates multiple e-commerce platforms, AI agents, and automation flows. The project consists of a Node.js/Express backend, a Progressive Web App (PWA) frontend, and Flutter mobile app components.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Prerequisites and Environment Setup
- Ensure Node.js v20+ is installed (project tested with v20.19.5)
- Ensure npm v10+ is available (project tested with v10.8.2)
- Python 3 for serving static files during testing
- Flutter SDK required only for mobile development (optional)

### Bootstrap and Build the Repository
Run these commands in exact order:

1. **Install dependencies** (takes ~1-2 seconds):
   ```bash
   npm install
   ```
   - NEVER CANCEL: This is fast but set timeout to 30+ seconds for slower networks

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual Supabase credentials:
   # SUPABASE_URL=https://your-project-ref.supabase.co
   # SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Start the backend server**:
   ```bash
   node server.js
   ```
   - Server runs on http://localhost:3000
   - NEVER CANCEL: Server starts immediately, but set timeout to 30+ seconds

4. **Serve the frontend** (in a separate terminal):
   ```bash
   python3 -m http.server 8000
   ```
   - Frontend serves on http://localhost:8000
   - NEVER CANCEL: Starts immediately, but set timeout to 30+ seconds

### Testing and Validation
- **Test API endpoints**:
  ```bash
  curl -X GET http://localhost:3000/api/products
  curl -X POST http://localhost:3000/api/ai -H "Content-Type: application/json" -d '{"message":"hello"}'
  ```

- **Validate frontend**: Open http://localhost:8000 in browser
- **ALWAYS test the complete user flow** after making changes:
  1. Load the frontend interface
  2. Test login/signup functionality (requires valid Supabase config)
  3. Verify AI chat responds properly
  4. Check that products API returns data

## Key Project Structure

### Core Files
- `index.html` - Main PWA interface with chat, store, admin, agents, and flows
- `main.js` - Frontend JavaScript with voice commands, Turbo mode, unlimited agents
- `BOB_EMPIRE_FINAL.js` - Global platform integrations and AI orchestrator
- `server.js` - Express.js backend server (entry point)
- `config.js` - Supabase configuration (update with real credentials)
- `package.json` - Node.js dependencies (Express, Supabase, body-parser, dotenv)

### Data Files
- `agents.json` - 150 AI agents configuration
- `flows.json` - 120+ automation flows
- `phases.json` - Global expansion phases
- `products.js` - Product management API routes

### Mobile App Components (Flutter)
- `main.dart` - Flutter app entry point
- `auth_page.dart` - Authentication screen
- `chat_page.dart` - Chat interface
- `store_page.dart` - Product store
- `pubspec.yaml` - Flutter dependencies

### Styling and Assets
- `style.css` - Black and gold theme
- `manifest.json` - PWA configuration
- `service-worker.js` - PWA service worker
- `logo_bob_empire.png` - Application logo

## Build and Test Times

**CRITICAL TIMING INFORMATION:**
- `npm install`: ~1-2 seconds (NEVER CANCEL - set timeout 30+ seconds)
- Server startup: Immediate (NEVER CANCEL - set timeout 30+ seconds)
- Frontend serving: Immediate (NEVER CANCEL - set timeout 30+ seconds)
- API response times: <100ms for all endpoints

**NO LONG BUILD PROCESSES** - This is a straightforward JavaScript/Node.js project with minimal build requirements.

## Validation Scenarios

**MANDATORY: Always run these validation steps after making changes:**

1. **Backend API Validation**:
   ```bash
   # Start server (should show "✅ Backend running on http://localhost:3000")
   node server.js
   
   # Test endpoints
   curl -X GET http://localhost:3000/api/products  # Should return product array
   curl -X POST http://localhost:3000/api/ai -H "Content-Type: application/json" -d '{"message":"hello"}'  # Should return AI response
   ```

2. **Frontend Validation**:
   ```bash
   # Serve frontend
   python3 -m http.server 8000
   
   # Access http://localhost:8000 and verify:
   # - Page loads with "👑 Bob Empire" title
   # - Login and Sign Up buttons are present
   # - Black background with gold accents theme
   ```

3. **Integration Validation**:
   - Test login/signup flows (should show alert dialogs - requires valid Supabase configuration for full functionality)
   - Verify AI chat functionality
   - Check global platform integration stubs work
   - Validate agent and flow management
   - **CRITICAL**: Ensure JavaScript console shows "Bob Empire initialized" message
   - **CRITICAL**: Login and Sign Up buttons should trigger alert dialogs when clicked

## Common Development Tasks

### Adding New API Endpoints
- Modify `server.js` to add new routes
- Create separate router files following pattern in `products.js` and `auth.js`
- Always test endpoints with curl after adding

### Modifying AI Agents
- Edit `agents.json` for agent configurations
- Update `BOB_EMPIRE_FINAL.js` for agent logic
- Test agent responses through `/api/ai` endpoint

### Global Platform Integrations
- Platform connection functions are in `BOB_EMPIRE_FINAL.js`
- Most are placeholder functions that log connections
- Add actual API integration code to these functions

### Frontend Changes
- Modify `index.html` for UI structure
- Update `style.css` for styling (maintain black/gold theme)
- Edit `main.js` for JavaScript functionality

### Configuration Updates
- Update `config.js` for Supabase settings
- Modify `.env` for environment-specific variables
- Never commit real credentials to version control

## Deployment Considerations

### Supabase Setup
- Create tables: `products`, `health_ping`, `agents`, `flows`
- Configure authentication providers
- Update `config.js` with real URLs and keys

### Platform Integration
- Many platforms require OAuth/API keys
- Some require store approval processes
- Integration templates are provided but need real credentials

### PWA Deployment
- Can be deployed to static hosting (Vercel, Netlify, GitHub Pages)
- Update `manifest.json` for production URLs
- Configure service worker for offline functionality

## Troubleshooting

### Common Issues
- **"supabaseUrl is required" error**: Update `config.js` and `.env` with real Supabase credentials
- **CORS issues**: Ensure frontend and backend are on same domain or configure CORS properly
- **Module import errors**: Ensure `index.html` loads main.js as `<script type="module" src="main.js"></script>`
- **"Cannot use import statement outside a module"**: Check that script tag has `type="module"` attribute

### Debug Commands
```bash
# Check server status
curl -f http://localhost:3000/api/products || echo "Server not running"

# Verify environment
node -e "console.log(process.env.SUPABASE_URL || 'No SUPABASE_URL set')"

# Test frontend serving
curl -f http://localhost:8000/ | head -5
```

## Important Notes

- **NO Flutter SDK required** for backend/frontend development
- **NO complex build processes** - this is a flat file structure
- **Environment variables required** for full functionality
- **Supabase configuration essential** for authentication and data
- **Global platform integrations are stubs** - add real API keys for production
- **Project supports 150 AI agents and 120+ automation flows**
- **Designed for global e-commerce** with support for multiple platforms and regions

## File Reference Quick Access

**Most Frequently Modified Files:**
- `server.js` - Backend API modifications
- `main.js` - Frontend functionality
- `config.js` - Configuration updates
- `agents.json` - AI agent management
- `BOB_EMPIRE_FINAL.js` - Platform integrations

**Configuration Files:**
- `package.json` - Dependencies
- `.env` - Environment variables
- `manifest.json` - PWA settings
- `pubspec.yaml` - Flutter dependencies