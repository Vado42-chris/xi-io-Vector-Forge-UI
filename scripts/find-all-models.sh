#!/bin/bash
# Find ALL Models and Agents - Simple Search
echo "🔍 Finding ALL Models and Agents..."
echo ""

# Find GGUF files
echo "📦 GGUF Models:"
find /home/chrishallberg -name "*.gguf" -type f 2>/dev/null | while read file; do
  size=$(du -h "$file" | cut -f1)
  echo "   $file ($size)"
done | head -20
echo ""

# Find model directories
echo "📁 Model Directories:"
for dir in "$HOME/.ollama" "$HOME/.local/share/ollama" "$HOME/models" "$HOME/Downloads/models" "$HOME/Documents/models"; do
  if [ -d "$dir" ]; then
    count=$(find "$dir" -type f \( -name "*.gguf" -o -name "*.bin" -o -name "*.safetensors" \) 2>/dev/null | wc -l)
    echo "   $dir ($count files)"
  fi
done
echo ""

# Find agent/config files
echo "🤖 Agent Configs:"
find /home/chrishallberg -type f \( -name "*agent*.json" -o -name "*model*.json" -o -name "*config*.json" \) 2>/dev/null | grep -v node_modules | head -10 | sed 's/^/   /'
echo ""

# Check Ollama models
if command -v ollama > /dev/null; then
  echo "📋 Ollama Models:"
  ollama list 2>/dev/null || echo "   (Ollama not running - start with: ollama serve)"
fi

