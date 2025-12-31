#!/bin/bash
# Start Dev Server and Verify Setup
# This starts VectorForge and verifies local AI is configured

echo "🚀 Starting VectorForge Dev Server..."
echo ""

# Kill any existing processes on port 3000
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null
sleep 1

# Start dev server in background
cd /home/chrishallberg/xi-io-Vector-Forge-UI
npm run dev > /tmp/vite-dev.log 2>&1 &
DEV_PID=$!

echo "⏳ Waiting for server to start..."
sleep 8

# Check if server is running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Dev server is running on http://localhost:3000"
    echo ""
    echo "🌐 Opening browser..."
    xdg-open http://localhost:3000 2>/dev/null || echo "Open manually: http://localhost:3000"
    echo ""
    echo "📋 To configure local AI:"
    echo "1. Left Sidebar → Engine tab"
    echo "2. Enable 'Use Local GGUF Models'"
    echo "3. Select Ollama → http://localhost:11434"
    echo "4. Click Refresh → Select model"
    echo "5. Test → Save"
    echo ""
    echo "✅ Server running (PID: $DEV_PID)"
    echo "   Logs: /tmp/vite-dev.log"
    echo "   Stop: kill $DEV_PID"
else
    echo "❌ Server failed to start"
    echo "   Check logs: /tmp/vite-dev.log"
    kill $DEV_PID 2>/dev/null
    exit 1
fi

