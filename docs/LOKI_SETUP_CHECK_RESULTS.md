# Loki Setup Check Results
**Date:** January 27, 2025

---

## What to Check on Loki-PC

### 1. Ollama Status
```bash
curl http://localhost:11434/api/tags
ollama list
```

### 2. Environment Variables
```bash
cat .env
cat .env.local
env | grep -i ollama
env | grep -i mcp
env | grep -i xibalba
```

### 3. Running Services
```bash
lsof -i :11434  # Ollama
lsof -i :8000   # MCP server
ps aux | grep ollama
ps aux | grep mcp
```

### 4. Configuration Files
```bash
cat config/mcpConfig.ts | grep -i localhost
cat vite.config.ts | grep -i local
cat config/xibalba.config.json
```

---

## What to Copy

1. **Ollama models** - Note which models were installed
2. **Environment variables** - Copy .env or .env.local
3. **Configuration** - Copy config/xibalba.config.json
4. **Model paths** - If using GGUF files directly

---

## Quick Setup Here

### If Ollama exists on Loki-PC:
1. Install Ollama here: `curl -fsSL https://ollama.com/install.sh | sh`
2. Pull same models: `ollama pull <model-name>`
3. Configure VectorForge to use `http://localhost:11434`

### If different setup:
- Note what was running on Loki-PC
- Replicate the same setup here

---

**Run the checks on Loki-PC and note the results.**

