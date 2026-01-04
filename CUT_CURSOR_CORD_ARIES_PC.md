# Cut the Cursor Cord on Aries-PC

## 🎯 Goal

Implement the **network-level Cursor bypass** from Loki-PC on Aries-PC to:
- ✅ Stop consuming Cursor credits (you're at 97%!)
- ✅ Use local Ollama instead
- ✅ Work exactly like Loki-PC

## ✅ What We've Done

1. **Copied Cursor Bridge** from Loki-PC
   - `cursor_filter_bridge.py` - The proxy server
   - `start_cursor_bridge.sh` - Startup script

2. **Installed Dependencies**
   - Flask, flask-cors, requests

3. **Started Bridge**
   - Running on port 8080
   - Ready to intercept Cursor API calls

## 🚀 Next Steps

### Step 1: Verify Bridge is Running

```bash
# Check bridge health
curl http://localhost:8080/health

# Check logs
tail -f /home/chrishallberg/xi-io-Vector-Forge-UI/cursor-bridge/cursor_bridge.log
```

### Step 2: Configure Cursor to Use Bridge

**Option A: System Proxy (Easiest)**

1. **Set System Proxy**:
   ```bash
   # For GNOME/KDE
   gsettings set org.gnome.system.proxy mode 'manual'
   gsettings set org.gnome.system.proxy.http host 'localhost'
   gsettings set org.gnome.system.proxy.http port 8080
   ```

2. **Or use environment variable**:
   ```bash
   export http_proxy="http://localhost:8080"
   export https_proxy="http://localhost:8080"
   ```

3. **Restart Cursor** - It will use the proxy automatically

**Option B: Cursor Settings (If Available)**

1. Open Cursor Settings
2. Find API endpoint setting
3. Change to: `http://localhost:8080/api/cursor/filter`
4. Restart Cursor

**Option C: Network-Level (Advanced)**

Configure your network/router to route Cursor API calls through the bridge.

### Step 3: Test It Works

1. **Use Cursor AI features** (chat, code completion, etc.)
2. **Check bridge logs** - Should see requests coming in
3. **Check Cursor credits** - Should NOT increase
4. **Verify AI works** - Should still work (using local Ollama)

## 🔍 Verification Checklist

- [ ] Bridge running on port 8080
- [ ] Ollama running on port 11434
- [ ] Cursor configured to use bridge
- [ ] Bridge logs show Cursor requests
- [ ] Cursor credits NOT increasing
- [ ] AI features still work

## 📊 How It Works

```
Cursor IDE
    ↓ (API request)
Bridge (port 8080) ← Intercepts here!
    ↓ (converts format)
Ollama (port 11434) ← Local AI processing
    ↓ (response)
Bridge (converts back)
    ↓ (OpenAI format)
Cursor IDE ← Thinks it's from cloud, but it's local!
```

## 🚨 Troubleshooting

### Bridge Not Starting

```bash
# Check if port 8080 is in use
lsof -i :8080

# Kill existing process
pkill -f cursor_filter_bridge.py

# Start again
cd /home/chrishallberg/xi-io-Vector-Forge-UI/cursor-bridge
python3 cursor_filter_bridge.py
```

### Cursor Still Using Cloud

1. **Check system proxy** is set correctly
2. **Verify bridge is running**: `curl http://localhost:8080/health`
3. **Check Cursor network** (DevTools → Network tab)
4. **Restart Cursor** completely

### Ollama Not Responding

```bash
# Start Ollama
ollama serve

# Verify
curl http://localhost:11434/api/tags
```

## 🎉 Success!

When working:
- ✅ **No more credits consumed**
- ✅ **AI still works** (local Ollama)
- ✅ **Same experience** as Loki-PC
- ✅ **97% usage stays at 97%** (or decreases if you stop using cloud)

---

**Status**: Bridge is set up and ready! Configure Cursor to use it and you're done!

