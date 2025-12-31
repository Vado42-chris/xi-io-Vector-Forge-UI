#!/bin/bash
# Start VectorForge Dev Server

echo "🚀 Starting VectorForge Dev Server..."
echo ""

cd /home/chrishallberg/xi-io-Vector-Forge-UI

# Kill any existing processes on port 5173
echo "1. Cleaning up existing processes..."
lsof -ti:5173 2>/dev/null | xargs kill -9 2>/dev/null
sleep 1

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    npm install
fi

# Start dev server
echo "2. Starting dev server..."
echo ""
echo "   Server will be available at: http://localhost:5173"
echo "   Press Ctrl+C to stop"
echo ""

npm run dev

