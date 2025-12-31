#!/bin/bash
# Find Ollama - Simple Search
echo "🔍 Finding Ollama..."
echo ""

# Check if Ollama service is running
if systemctl is-active --quiet ollama 2>/dev/null || pgrep -x ollama > /dev/null; then
  echo "✅ Ollama is RUNNING"
  echo "   Location: $(which ollama 2>/dev/null || echo 'unknown')"
  echo ""
fi

# Find Ollama binary
if command -v ollama > /dev/null; then
  echo "✅ Ollama installed at: $(which ollama)"
  echo "   Version: $(ollama --version 2>/dev/null || echo 'unknown')"
  echo ""
fi

# Find Ollama models directory
OLLAMA_MODELS="$HOME/.ollama/models"
if [ -d "$OLLAMA_MODELS" ]; then
  echo "✅ Models directory: $OLLAMA_MODELS"
  echo "   Models found: $(find "$OLLAMA_MODELS" -type f -name "*.gguf" 2>/dev/null | wc -l)"
  echo ""
fi

# Check if Ollama API is accessible
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
  echo "✅ Ollama API running on http://localhost:11434"
  echo "   Available models:"
  curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*"' | cut -d'"' -f4 | sed 's/^/     - /' || echo "     (checking...)"
  echo ""
else
  echo "❌ Ollama API not accessible"
  echo "   Try: ollama serve"
  echo ""
fi

# Find all GGUF files
echo "🔍 Searching for GGUF models..."
GGUF_COUNT=$(find /home/chrishallberg -name "*.gguf" -type f 2>/dev/null | wc -l)
if [ "$GGUF_COUNT" -gt 0 ]; then
  echo "✅ Found $GGUF_COUNT GGUF files:"
  find /home/chrishallberg -name "*.gguf" -type f 2>/dev/null | head -10 | sed 's/^/   /'
  [ "$GGUF_COUNT" -gt 10 ] && echo "   ... and $((GGUF_COUNT - 10)) more"
else
  echo "❌ No GGUF files found in /home/chrishallberg"
fi
echo ""

# Find common Ollama locations
echo "🔍 Checking common locations..."
for dir in "$HOME/.ollama" "$HOME/.local/share/ollama" "/usr/local/bin/ollama" "/opt/ollama"; do
  if [ -d "$dir" ] || [ -f "$dir" ]; then
    echo "✅ Found: $dir"
  fi
done

