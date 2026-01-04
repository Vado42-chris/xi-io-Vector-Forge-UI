#!/bin/bash
# Quick Ollama Check - Minimal Token Usage
echo "Checking Ollama..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
  echo "✅ Ollama running on localhost:11434"
  curl -s http://localhost:11434/api/tags | jq -r '.models[].name' 2>/dev/null || echo "Models available (jq not installed)"
  exit 0
else
  echo "❌ Ollama not running"
  echo "Quick install: curl -fsSL https://ollama.com/install.sh | sh"
  exit 1
fi

