#!/bin/bash

echo "=== Starting VectorForge Dev Server ==="
echo ""

# Change to project directory
cd /home/chrishallberg/xi-io-Vector-Forge-UI || exit 1

# Kill any existing Vite processes
echo "1. Killing existing Vite processes..."
pkill -f "vite" 2>/dev/null
sleep 2

# Check if port 3000 is in use
echo "2. Checking port 3000..."
if lsof -ti:3000 > /dev/null 2>&1; then
  echo "⚠️  Port 3000 is in use. Killing process..."
  lsof -ti:3000 | xargs kill -9 2>/dev/null
  sleep 2
fi

# Start dev server
echo "3. Starting dev server..."
echo ""
echo "=========================================="
echo "  Dev server starting..."
echo "  Open: http://localhost:3000"
echo "  Press Ctrl+C to stop"
echo "=========================================="
echo ""

npm run dev

