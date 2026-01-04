#!/bin/bash
# Start Cursor Filter Bridge Service
# This routes Cursor's AI requests to local Ollama

cd "$(dirname "$0")"
SCRIPT_DIR="$(pwd)"

echo "Starting Cursor Filter Bridge..."
echo "Service will run on: http://localhost:8080"
echo "Status UI: http://localhost:8080/status"
echo ""

# Check if already running
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 8080 is already in use. Stopping existing process..."
    pkill -f "cursor_filter_bridge.py"
    sleep 2
fi

# Start the service
nohup python3 "$SCRIPT_DIR/cursor_filter_bridge.py" > "$SCRIPT_DIR/cursor_bridge.log" 2>&1 &

# Wait a moment for startup
sleep 2

# Check if it started
if curl -s http://localhost:8080/health > /dev/null; then
    echo "✅ Cursor Filter Bridge is running!"
    echo ""
    echo "View status: http://localhost:8080/status"
    echo "View logs: tail -f $SCRIPT_DIR/cursor_bridge.log"
    echo ""
    echo "To stop: pkill -f cursor_filter_bridge.py"
else
    echo "❌ Failed to start. Check logs: $SCRIPT_DIR/cursor_bridge.log"
    exit 1
fi

