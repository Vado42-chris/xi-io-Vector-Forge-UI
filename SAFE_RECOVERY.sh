#!/bin/bash
# Safe Recovery Script - No sudo, no killing system processes
# Run this if terminal crashes again

echo "=== SAFE RECOVERY - VectorForge Dev Environment ==="
echo ""

# 1. Clean VectorForge caches
echo "1. Cleaning VectorForge caches..."
cd ~/xi-io-Vector-Forge-UI 2>/dev/null || cd /home/chrishallberg/xi-io-Vector-Forge-UI
rm -rf node_modules/.vite
rm -rf dist
rm -rf .vite
echo "✅ Caches cleared"
echo ""

# 2. Check if dev server is already running
echo "2. Checking for running dev servers..."
if lsof -i :3000 >/dev/null 2>&1; then
    echo "⚠️  Port 3000 is in use"
    echo "   Run: lsof -i :3000 to see what's using it"
else
    echo "✅ Port 3000 is free"
fi
echo ""

# 3. Verify files are correct
echo "3. Verifying code files..."
if grep -q "MOUNTING APP" index.tsx 2>/dev/null; then
    echo "✅ index.tsx has cache-bust messages"
else
    echo "❌ index.tsx missing cache-bust messages"
fi

if grep -q "App.hardened RENDERING" App.hardened.tsx 2>/dev/null; then
    echo "✅ App.hardened.tsx has cache-bust messages"
else
    echo "❌ App.hardened.tsx missing cache-bust messages"
fi
echo ""

# 4. Instructions
echo "4. Next steps:"
echo "   a) If port 3000 is in use, kill that process first"
echo "   b) Start dev server: npm run dev:vite"
echo "   c) Open browser: http://localhost:3000"
echo "   d) Check console for cache-bust messages"
echo ""

echo "=== Recovery Complete ==="


