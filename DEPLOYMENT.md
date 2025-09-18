# Bob Empire - Production Deployment Guide

## 🚀 Quick Production Setup

### 1. Environment Configuration
Create a `.env` file in the root directory:

```env
# Required for production
NODE_ENV=production
PORT=3000

# Optional: Supabase (for enhanced auth)
SUPABASE_URL=your-supabase-url-here
SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Optional: OpenAI (for enhanced AI)
OPENAI_API_KEY=your-openai-api-key-here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Tests
```bash
npm test
```

### 4. Start Production Server
```bash
npm run prod
```

## 🌐 Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Heroku
```bash
git add .
git commit -m "Production build"
git push heroku main
```

### Manual Server
```bash
npm start
```

## 🔧 Production Features

✅ **Security**: Helmet.js for security headers  
✅ **Performance**: Compression middleware  
✅ **PWA**: Service worker with caching  
✅ **Health Checks**: `/health` and `/api/status` endpoints  
✅ **Environment Aware**: Dynamic configuration  
✅ **Error Handling**: Graceful shutdown and error responses  
✅ **Icons**: Proper PWA icons generated  
✅ **Testing**: Automated test suite  

## 📊 Monitoring

- Health Check: `GET /health`
- API Status: `GET /api/status`
- Version Info: Included in health response

## 🔍 Troubleshooting

1. **Server won't start**: Check PORT is available
2. **API errors**: Verify environment variables
3. **Icons missing**: Run `npm run build:icons`
4. **Tests failing**: Ensure server is running

## 🌟 Production URLs

The application will work on any domain with proper environment configuration:
- Local: `http://localhost:3000`
- Vercel: `https://your-app.vercel.app`
- Heroku: `https://your-app.herokuapp.com`
- Custom: `https://your-domain.com`