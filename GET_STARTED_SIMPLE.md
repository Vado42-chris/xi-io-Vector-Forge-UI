# 🚀 Get VectorForge Working - Simple Guide

**You don't need to understand Linux or coding. Just run these commands.**

## Step 1: Find Everything (2 minutes)

```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
chmod +x scripts/*.sh
./scripts/find-ollama.sh
./scripts/find-all-models.sh
```

**This will show you:**
- ✅ Where Ollama is installed
- ✅ What models you have
- ✅ Where everything is located

## Step 2: Start Ollama (if found)

**If Ollama is installed but not running:**
```bash
ollama serve
```
(Leave this terminal open - it runs in background)

**In a NEW terminal, check models:**
```bash
ollama list
```

## Step 3: Start VectorForge

```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
npm run dev
```

## Step 4: Connect in VectorForge

1. Open browser: `http://localhost:5173`
2. Click **Engine** tab (left sidebar)
3. Check **"Use Local GGUF Models"**
4. Select **Ollama**
5. Click **Refresh** → Pick a model
6. Click **Test** → **Save**

**Done!** VectorForge is now using your local models.

---

## If Ollama Not Found

**Quick install:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama serve
```

**Or use VectorForge WITHOUT AI:**
- Just skip the AI setup
- All core features work without it
- You can add AI later

---

## Need Help?

**Run the find scripts first** - they'll tell you exactly what you have and where it is.

