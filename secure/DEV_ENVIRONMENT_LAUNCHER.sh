#!/bin/bash
# VectorForge Dev Environment Launcher
# Starts everything you need: dev server, browser preview, terminal access

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     VectorForge Dev Environment Launcher                 ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    npm install
fi

# Kill any existing processes on port 3000
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "🛑 Stopping existing server on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 2
fi

echo "🚀 Starting VectorForge Dev Environment..."
echo ""
echo "📋 What you'll get:"
echo "   • Dev server: http://localhost:3000"
echo "   • Browser preview: Auto-opens in default browser"
echo "   • Terminal: Available in UI (right sidebar → Terminal tab)"
echo "   • File browser: Available in UI (right sidebar → Files tab)"
echo "   • Dev Chat: Available in UI (right sidebar → Dev Chat tab)"
echo ""
echo "💡 Tips:"
echo "   • Press Ctrl+C to stop the server"
echo "   • Terminal commands run safely via /api/terminal/execute"
echo "   • All file operations available in the UI"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Start dev server
npm run dev

