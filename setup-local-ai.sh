#!/bin/bash
# Setup Local AI for Free Coding
# This sets up Ollama so you can code without using remote API credits

echo "🚀 Setting up Local AI for Free Coding..."
echo ""

# Step 1: Check if Ollama is installed
echo "Step 1: Checking Ollama installation..."
if command -v ollama > /dev/null; then
    echo "✅ Ollama is installed: $(which ollama)"
    OLLAMA_VERSION=$(ollama --version 2>/dev/null || echo "unknown")
    echo "   Version: $OLLAMA_VERSION"
else
    echo "❌ Ollama not found. Installing..."
    curl -fsSL https://ollama.com/install.sh | sh
    if [ $? -eq 0 ]; then
        echo "✅ Ollama installed successfully"
    else
        echo "❌ Installation failed. Please install manually:"
        echo "   curl -fsSL https://ollama.com/install.sh | sh"
        exit 1
    fi
fi
echo ""

# Step 2: Check if Ollama is running
echo "Step 2: Checking if Ollama is running..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running on http://localhost:11434"
else
    echo "⚠️  Ollama not running. Starting..."
    ollama serve > /dev/null 2>&1 &
    sleep 3
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo "✅ Ollama started successfully"
    else
        echo "❌ Failed to start Ollama. Please start manually:"
        echo "   ollama serve"
        exit 1
    fi
fi
echo ""

# Step 3: Check available models
echo "Step 3: Checking available models..."
MODELS=$(curl -s http://localhost:11434/api/tags 2>/dev/null | grep -o '"name":"[^"]*"' | cut -d'"' -f4 || echo "")
if [ -z "$MODELS" ]; then
    echo "⚠️  No models found. Installing codellama:latest (good for coding)..."
    echo "   This may take a few minutes..."
    ollama pull codellama:latest
    if [ $? -eq 0 ]; then
        echo "✅ Model installed successfully"
    else
        echo "❌ Model installation failed"
        exit 1
    fi
else
    echo "✅ Models available:"
    echo "$MODELS" | sed 's/^/   - /'
    # Check if codellama is available
    if echo "$MODELS" | grep -q "codellama"; then
        echo "✅ codellama found (good for coding)"
    else
        echo "⚠️  codellama not found. Installing..."
        ollama pull codellama:latest
    fi
fi
echo ""

# Step 4: Verify setup
echo "Step 4: Verifying setup..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama API is accessible"
    echo "✅ Setup complete!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Start VectorForge: npm run dev"
    echo "2. Open VectorForge → Left Sidebar → Engine tab"
    echo "3. Enable 'Use Local GGUF Models'"
    echo "4. Select Ollama → http://localhost:11434"
    echo "5. Click Refresh → Select codellama:latest"
    echo "6. Click Test → Save"
    echo ""
    echo "🎉 You're now coding for FREE with local AI!"
else
    echo "❌ Setup verification failed"
    exit 1
fi

