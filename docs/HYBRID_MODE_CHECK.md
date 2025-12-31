# Hybrid Mode Check - Ollama Setup
**Date:** January 27, 2025

---

## Configuration Found

### Default Settings:
- **Local AI Provider:** `ollama` (default)
- **Local AI URL:** `http://localhost:11434` (default)
- **Default Model:** `codellama:latest`
- **MCP Server:** `http://localhost:8000` (fallback)

### Code Configuration:
- ✅ `config/mcpConfig.ts` - Has Ollama defaults
- ✅ `services/localAIService.ts` - Supports Ollama
- ✅ Scripts exist: `check-ollama.sh`, `find-ollama.sh`

---

## What Needs to Be Checked

### 1. Is Ollama Installed?
```bash
which ollama
ollama --version
```

### 2. Is Ollama Running?
```bash
curl http://localhost:11434/api/tags
```

### 3. What Models Are Available?
```bash
ollama list
```

### 4. Environment Variables?
```bash
env | grep -i ollama
env | grep -i local_ai
```

---

## Quick Check Script

Run: `./scripts/check-ollama.sh`

This will tell you:
- ✅ If Ollama is running
- ✅ What models are available
- ❌ If Ollama needs to be installed

---

## If Ollama Not Found

### Install:
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Pull Model:
```bash
ollama pull codellama:latest
```

### Start:
```bash
ollama serve
```

---

## Next Step

**Run the check script to see actual status:**
```bash
./scripts/check-ollama.sh
```

**Or check manually:**
```bash
curl http://localhost:11434/api/tags
```

---

**Status:** Configuration ready, need to verify Ollama is actually running.

