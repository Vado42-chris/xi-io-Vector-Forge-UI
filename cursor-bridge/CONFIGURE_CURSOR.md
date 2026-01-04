# Configure Cursor to Use the Bridge

## ✅ Bridge Status

**Bridge is running!** ✅
- URL: `http://localhost:8080`
- Health: `http://localhost:8080/health`
- Status UI: `http://localhost:8080/status`

## 🎯 The Problem

Cursor makes API calls directly to its cloud servers. We need to intercept these calls and route them through the bridge.

## 🔧 Solution Options

### Option 1: System Proxy (Simplest - Recommended)

**Set system proxy to route Cursor API calls through the bridge:**

```bash
# For GNOME/KDE desktop
gsettings set org.gnome.system.proxy mode 'manual'
gsettings set org.gnome.system.proxy.http host 'localhost'
gsettings set org.gnome.system.proxy.http port 8080
gsettings set org.gnome.system.proxy.https host 'localhost'
gsettings set org.gnome.system.proxy.https port 8080

# Or use environment variables (for terminal)
export http_proxy="http://localhost:8080"
export https_proxy="http://localhost:8080"
```

**Then restart Cursor** - It will use the proxy automatically.

**⚠️ Note**: This routes ALL HTTP/HTTPS traffic through the bridge. The bridge needs to be modified to only intercept Cursor API calls and pass through everything else.

### Option 2: Modify Bridge to be Transparent Proxy

The bridge needs to:
1. Intercept Cursor API calls (to `api.cursor.com` or similar)
2. Route them to Ollama
3. Pass through all other traffic

This requires modifying `cursor_filter_bridge.py` to handle all HTTP traffic, not just `/api/cursor/filter`.

### Option 3: Use Cursor Settings (If Available)

Some Cursor versions allow setting a custom API endpoint. Check:
1. Cursor Settings → AI/Model Settings
2. Look for "API Endpoint" or "Custom API"
3. Set to: `http://localhost:8080/api/cursor/filter`

## 🚀 Quick Test

1. **Start the bridge** (already running):
   ```bash
   cd /home/chrishallberg/xi-io-Vector-Forge-UI/cursor-bridge
   ./start_cursor_bridge.sh
   ```

2. **Check bridge status**:
   ```bash
   curl http://localhost:8080/health
   # Should return: {"status":"healthy","ollama":"connected",...}
   ```

3. **View status UI**:
   Open in browser: `http://localhost:8080/status`

4. **Use Cursor AI features** and check the status page to see if requests are coming through.

## 🔍 Verify It's Working

1. **Use Cursor AI** (chat, code completion, etc.)
2. **Check bridge logs**:
   ```bash
   tail -f /home/chrishallberg/xi-io-Vector-Forge-UI/cursor-bridge/cursor_bridge.log
   ```
3. **Check status page**: `http://localhost:8080/status`
   - Should show "Cursor Requests Detected: ✅ YES"
4. **Check Cursor credits** - Should NOT increase

## ⚠️ Important Note

The current bridge requires an API key in the Authorization header. Cursor won't send this automatically. We may need to modify the bridge to:
- Remove the API key requirement, OR
- Use a transparent proxy that intercepts Cursor's actual API endpoints

---

**Next Step**: Try Option 1 (system proxy) first, then check if Cursor requests show up in the bridge logs.

