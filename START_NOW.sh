#!/bin/bash
# START VECTORFORGE - Auto-opens browser, auto-configures Ollama
cd /home/chrishallberg/xi-io-Vector-Forge-UI

echo "🚀 Starting VectorForge..."
npm run dev &
DEV_PID=$!

echo "⏳ Waiting for server..."
sleep 8

echo "🌐 Opening browser..."
xdg-open http://localhost:5173 2>/dev/null || x-www-browser http://localhost:5173 2>/dev/null || echo "Open manually: http://localhost:5173"

echo ""
echo "✅ VectorForge is starting"
echo "   Ollama will auto-configure (no setup needed)"
echo "   Press Ctrl+C to stop"
echo ""

wait $DEV_PID

