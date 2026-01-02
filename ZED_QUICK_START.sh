#!/bin/bash
# ZED QUICK SETUP - Use with your last 2% Cursor usage
# This sets up Zed as your backup coder

echo "🚀 Setting up Zed..."

# Check if Zed is installed
if ! command -v zed &> /dev/null; then
    echo "📥 Installing Zed..."
    wget -qO- https://zed.dev/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
fi

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "⚠️  Ollama not running - starting it..."
    ollama serve &
    sleep 3
fi

# Open project in Zed
echo "📂 Opening VectorForge in Zed..."
cd /home/chrishallberg/xi-io-Vector-Forge-UI
zed . &

echo ""
echo "✅ Zed is opening..."
echo ""
echo "📋 Next steps in Zed:"
echo "   1. Press Cmd/Ctrl + , to open settings"
echo "   2. Search for 'AI'"
echo "   3. Set provider to 'Ollama'"
echo "   4. Set URL: http://localhost:11434"
echo "   5. Set model: qwen2.5-coder:7b"
echo ""
echo "💡 Use Cmd/Ctrl + K in Zed for AI chat"
echo "💡 Use Cmd/Ctrl + L for inline AI edits"
echo ""

