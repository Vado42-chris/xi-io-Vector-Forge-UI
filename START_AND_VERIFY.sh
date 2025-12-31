#!/bin/bash
# Start dev server and verify Dev Chat is accessible

echo "🚀 Starting VectorForge Dev Server..."
echo ""

# Check if port 3000 is already in use
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 is already in use"
    echo "   PID: $(lsof -ti:3000)"
    echo ""
    echo "   Options:"
    echo "   1. Kill existing process: kill $(lsof -ti:3000)"
    echo "   2. Use different port: PORT=3001 npm run dev"
    echo ""
    read -p "Kill existing process and start new server? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill $(lsof -ti:3000)
        sleep 2
    else
        echo "❌ Exiting - please resolve port conflict manually"
        exit 1
    fi
fi

# Start dev server in background
echo "📦 Starting Vite dev server..."
cd /home/chrishallberg/xi-io-Vector-Forge-UI
npm run dev > /tmp/vite-dev-server.log 2>&1 &
VITE_PID=$!

echo "✅ Dev server starting (PID: $VITE_PID)"
echo "📋 Logs: /tmp/vite-dev-server.log"
echo ""

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is responding
for i in {1..10}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Server is responding on http://localhost:3000"
        echo ""
        echo "🌐 Open in browser: http://localhost:3000"
        echo ""
        echo "📋 Verification Checklist:"
        echo "   1. Open browser console (F12)"
        echo "   2. Look for these messages:"
        echo "      - '📦 Starting module load...'"
        echo "      - '✅ App.hardened loaded successfully'"
        echo "      - '✅ App mounted - Right Sidebar visibility: true'"
        echo "      - '✅ RightSidebar mounted - Dev Chat tab should be active'"
        echo "      - '✅ DevChatbot mounted and ready'"
        echo ""
        echo "   3. Visual check:"
        echo "      - Right Sidebar visible on right side of screen"
        echo "      - '💬 Dev Chat' tab should be FIRST and ACTIVE"
        echo "      - Dev Chat interface should be visible"
        echo ""
        echo "   4. Test access methods:"
        echo "      - Click '💬 Dev Chat' tab"
        echo "      - Press Ctrl+K"
        echo "      - Click floating button (bottom right)"
        echo "      - Navigate to http://localhost:3000/devchat"
        echo ""
        echo "📊 Server logs: tail -f /tmp/vite-dev-server.log"
        echo "🛑 Stop server: kill $VITE_PID"
        exit 0
    fi
    echo "   Attempt $i/10... waiting..."
    sleep 2
done

echo "❌ Server failed to start after 20 seconds"
echo "📋 Check logs: cat /tmp/vite-dev-server.log"
echo "🛑 PID: $VITE_PID"
exit 1

