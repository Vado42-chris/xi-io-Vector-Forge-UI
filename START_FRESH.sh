#!/bin/bash
# Start Fresh Dev Server - Safe version
# This doesn't kill processes, just starts a clean server

echo "=== Starting Fresh Dev Server ==="
echo ""

cd ~/xi-io-Vector-Forge-UI 2>/dev/null || cd /home/chrishallberg/xi-io-Vector-Forge-UI

# Check if port is in use
if lsof -i :3000 >/dev/null 2>&1; then
    echo "⚠️  Port 3000 is already in use!"
    echo "   Run this to see what's using it:"
    echo "   lsof -i :3000"
    echo ""
    echo "   Or use a different port:"
    echo "   PORT=3001 npm run dev:vite"
    exit 1
fi

# Clean caches
echo "Cleaning caches..."
rm -rf node_modules/.vite dist .vite

# Start dev server
echo ""
echo "Starting Vite dev server on port 3000..."
echo "Open browser to: http://localhost:3000"
echo ""
echo "Look for these messages in browser console:"
echo "  🚀 MOUNTING APP - Version:"
echo "  🎨 App.hardened RENDERING - Version:"
echo ""

npm run dev:vite


