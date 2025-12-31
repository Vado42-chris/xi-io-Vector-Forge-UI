#!/bin/bash
# Test script to verify UI works as standalone product
# Run this outside of Cursor to test in clean environment

echo "🧪 Testing VectorForge as Standalone Product"
echo ""

# Check if dev server is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ Dev server not running. Starting..."
    npm run dev &
    sleep 5
fi

echo "✅ Dev server running"
echo ""

# Build production version
echo "📦 Building production version..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    echo ""
    echo "🌐 Testing in browser..."
    echo "Open: http://localhost:3000"
    echo ""
    echo "Checklist:"
    echo "  [ ] No dev buttons visible (Diagnostics, Dev Chat)"
    echo "  [ ] Material Icons display as icons (not text)"
    echo "  [ ] All buttons are clickable"
    echo "  [ ] Resize handles work"
    echo "  [ ] Keyboard navigation works"
    echo "  [ ] Focus indicators visible"
    echo ""
    echo "If issues persist:"
    echo "  1. Hard refresh browser (Ctrl+Shift+R)"
    echo "  2. Clear browser cache"
    echo "  3. Check browser console for errors"
    echo "  4. Verify Material Symbols font loads in Network tab"
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi

