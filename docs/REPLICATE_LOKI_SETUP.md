# Replicate Loki-PC Setup
**Date:** January 27, 2025  
**Issue:** Loki-PC had local AI working, this machine doesn't

---

## What We Need to Find

### On Loki-PC:
1. **Ollama installation** - Was it installed?
2. **Ollama models** - What models were loaded?
3. **Environment variables** - What was configured?
4. **MCP server** - Was there a local MCP server?
5. **Port configuration** - What ports were used?

---

## Quick Check Scripts

### Check if Ollama exists:
```bash
./scripts/check-ollama.sh
```

### Find Ollama:
```bash
./scripts/find-ollama.sh
```

---

## What to Check on Loki-PC

### 1. Check Ollama Status
```bash
# On Loki-PC, run:
curl http://localhost:11434/api/tags
ollama list
```

### 2. Check Environment Variables
```bash
# On Loki-PC, check:
cat .env
cat .env.local
env | grep -i ollama
env | grep -i mcp
env | grep -i xibalba
```

### 3. Check Running Services
```bash
# On Loki-PC, check:
lsof -i :11434  # Ollama
lsof -i :8000   # MCP server
ps aux | grep ollama
ps aux | grep mcp
```

### 4. Check Configuration Files
```bash
# On Loki-PC, check:
cat config/mcpConfig.ts | grep -i localhost
cat vite.config.ts | grep -i local
cat config/xibalba.config.json
```

---

## What to Copy Over

### Files to Copy:
1. `.env` or `.env.local` - Environment variables
2. `config/xibalba.config.json` - Configuration
3. Any model files (if using GGUF directly)

### Settings to Note:
1. Ollama server URL (usually `http://localhost:11434`)
2. Model names used
3. MCP server URL (if separate)
4. Port numbers

---

## Quick Setup Here (If Ollama Available)

### If Ollama is installed here:
```bash
# Check if running
curl http://localhost:11434/api/tags

# If not running, start it
ollama serve

# Pull models (check what Loki-PC had)
ollama list  # On Loki-PC to see models
ollama pull <model-name>  # On this machine
```

### Configure VectorForge:
1. Open VectorForge → Left Sidebar → Engine tab
2. Enable "Use Local GGUF Models"
3. Select Ollama → `http://localhost:11434`
4. Select model
5. Test connection

---

## If Ollama Not Installed Here

### Install Ollama:
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Then pull models (check what Loki-PC had)

---

## Next Steps

1. **Check Loki-PC** - Run the check scripts above
2. **Note the configuration** - Write down what was set up
3. **Replicate here** - Install/configure the same way
4. **Test** - Verify it works

---

## Status

🔴 **NEED INFO FROM LOKI-PC** - Can't replicate without knowing what was there

