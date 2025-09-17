#!/bin/bash
# Vercel Deployment Test Script
# Run this to validate the app before deploying to Vercel

echo "🚀 Testing BOB EMPIRE for Vercel deployment..."

# Check required files
echo "📋 Checking required files..."
files=("index.html" "package.json" "vercel.json" "BOB_EMPIRE_FINAL.js" "main.js" "config.js" "agents.json")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Test local server
echo "🌐 Starting local test server..."
python3 -m http.server 8001 &
server_pid=$!
sleep 2

# Test app endpoints
echo "🧪 Testing app functionality..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/)
if [ "$response" -eq 200 ]; then
    echo "✅ Main page loads successfully"
else
    echo "❌ Main page failed to load (HTTP $response)"
fi

# Test JSON loading
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/agents.json)
if [ "$response" -eq 200 ]; then
    echo "✅ agents.json loads successfully"
else
    echo "❌ agents.json failed to load (HTTP $response)"
fi

# Clean up
kill $server_pid
echo "🎉 All tests passed! Ready for Vercel deployment."