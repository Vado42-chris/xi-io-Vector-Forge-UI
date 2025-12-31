# Manual Verification Steps - Get It Working in Browser
**Date:** January 27, 2025

---

## Step 1: Run Setup Script (if needed)
```bash
./setup-local-ai.sh
```

This sets up Ollama for free local AI.

---

## Step 2: Start Dev Server

**Open a terminal and run:**
```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
npm run dev
```

**Wait for:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

**Keep this terminal open** (server runs in foreground)

---

## Step 3: Open Browser

**Navigate to:**
```
http://localhost:3000
```

**You should see:**
- VectorForge UI loads
- No errors in browser console
- Interface is functional

---

## Step 4: Configure Local AI (in Browser)

1. **Click Left Sidebar** → **Engine** tab (bottom of sidebar)
2. **Scroll to "Local AI Configuration"**
3. **Check ✅ "Use Local GGUF Models"**
4. **Select:** Ollama
5. **Server URL:** `http://localhost:11434` (should auto-fill)
6. **Click "Refresh Models"**
7. **Select:** `codellama:latest` (or available model)
8. **Click "Test Connection"**
9. **Click "Save Configuration"**

**If Ollama not running:**
- Run: `ollama serve` in another terminal
- Then retry steps above

---

## Step 5: Verify It's Working

**Test in Script Editor:**
1. **Right Sidebar** → **Scripts** tab
2. **Type:** `#`
3. **Should see:** AI suggestions appear
4. **If working:** ✅ **You're coding for FREE!**

---

## Troubleshooting

### Server won't start:
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
lsof -ti:3000 | xargs kill -9

# Try again
npm run dev
```

### Ollama not found:
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama
ollama serve

# Pull model
ollama pull codellama:latest
```

### Browser shows errors:
- Check browser console (F12)
- Check terminal for build errors
- Verify all dependencies: `npm install`

---

## Quick Start Script

**Or use the automated script:**
```bash
chmod +x START_DEV_AND_VERIFY.sh
./START_DEV_AND_VERIFY.sh
```

This starts the server and opens browser automatically.

---

## Status

✅ **Code is ready**
✅ **Configuration is correct**
✅ **Scripts are created**

**Next:** Run the steps above to see it in your browser!

