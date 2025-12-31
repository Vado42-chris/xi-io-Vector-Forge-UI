#!/bin/bash
# Quick UI Status Check

echo "🔍 VectorForge UI Status Check"
echo "================================"
echo ""

# Check if server is running
echo "1. Server Status:"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Server is RUNNING on port 3000"
    echo "   Open: http://localhost:3000"
else
    echo "   ❌ Server is NOT running"
    echo ""
    echo "   To start:"
    echo "   cd /home/chrishallberg/xi-io-Vector-Forge-UI"
    echo "   npm run dev"
    echo ""
fi

echo ""
echo "2. Entry Point Check:"
if [ -f "index.tsx" ]; then
    echo "   ✅ index.tsx exists"
else
    echo "   ❌ index.tsx MISSING"
fi

if [ -f "App.hardened.tsx" ]; then
    echo "   ✅ App.hardened.tsx exists"
else
    echo "   ❌ App.hardened.tsx MISSING"
fi

echo ""
echo "3. Key Components:"
COMPONENTS=("DevChatbot.tsx" "ConversationHistoryPanel.tsx" "TemplateLibrary.tsx")
for comp in "${COMPONENTS[@]}"; do
    if [ -f "components/$comp" ]; then
        echo "   ✅ $comp"
    else
        echo "   ❌ $comp MISSING"
    fi
done

echo ""
echo "================================"
echo ""
echo "Next:"
echo "1. If server not running: npm run dev"
echo "2. Open browser: http://localhost:3000"
echo "3. Open console (F12) and check for errors"
echo "4. Tell me what you see (or don't see)"

