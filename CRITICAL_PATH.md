# 🚨 CRITICAL PATH - Get Working Locally ASAP

**Goal:** Working VectorForge with local AI in < 30 minutes

## Step 1: Check Ollama (2 min)
```bash
./scripts/check-ollama.sh
```

**If not running:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2:3b  # Small, fast model
```

## Step 2: Start VectorForge (1 min)
```bash
npm run dev
```

## Step 3: Configure Local AI (2 min)
1. Open VectorForge → Left Sidebar → **Engine** tab
2. Enable **"Use Local GGUF Models"**
3. Select **Ollama** → `http://localhost:11434`
4. Click **Refresh** → Select model
5. Click **Test** → Save

## Step 4: Verify Working (1 min)
- Open **Script Editor** (Right Sidebar → Scripts tab)
- Type `#` → Should see AI suggestions
- If working: ✅ DONE

## If Ollama Not Available:
**Option A: llama-cpp-python (5 min)**
```bash
pip install llama-cpp-python[server]
python -m llama_cpp.server --model /path/to/model.gguf --port 8080
```
Then in VectorForge: Select **llama-cpp** → `http://localhost:8080`

**Option B: No AI (Still Works)**
- VectorForge works without AI
- Just disable MCP in settings
- All core features work

## Current Status:
- ✅ Ollama support built-in
- ✅ Local AI service ready
- ✅ MCP settings UI exists
- ⚠️ Need to verify Ollama running

**Total Time: < 10 minutes if Ollama available**

