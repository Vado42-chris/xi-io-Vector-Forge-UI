# Cursor Bridge - Cut the Cord on Aries-PC

## 🎯 Purpose

This is the **network-level Cursor bypass** from Loki-PC, adapted for Aries-PC.

**How it works**:
- Runs a Flask proxy server on port 8080
- Intercepts Cursor API requests
- Routes them to local Ollama (port 11434)
- Returns responses in OpenAI format (transparent to Cursor)

**Result**: Cursor uses local AI, **NO CREDITS CONSUMED** ✅

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI/cursor-bridge
pip3 install flask flask-cors requests
```

### 2. Start the Bridge

```bash
./start_cursor_bridge.sh
```

Or manually:
```bash
python3 cursor_filter_bridge.py
```

### 3. Configure Cursor

**Option A: System Proxy (Recommended)**
- Set system proxy to `http://localhost:8080`
- Cursor will automatically use it

**Option B: Cursor Settings**
- Point Cursor API endpoint to `http://localhost:8080/api/cursor/filter`
- (May require Cursor restart)

### 4. Verify It's Working

```bash
# Check bridge is running
curl http://localhost:8080/health

# Check logs
tail -f cursor_bridge.log
```

## 📋 Configuration

### Environment Variables

```bash
export OLLAMA_URL="http://localhost:11434"
export DEFAULT_OLLAMA_MODEL="codellama:latest"
export CURSOR_FILTER_KEY="xibalba-backend-filter-key"
```

### Port

Default: **8080**  
Change in `cursor_filter_bridge.py` if needed.

## 🔍 How It Works

1. **Cursor makes API request** → Goes to bridge (port 8080)
2. **Bridge intercepts** → Converts OpenAI format to Ollama format
3. **Bridge calls Ollama** → Local AI processing (port 11434)
4. **Bridge converts response** → Back to OpenAI format
5. **Cursor receives response** → Thinks it's from cloud, but it's local!

## ✅ Verification

When working correctly:
- ✅ Bridge running on port 8080
- ✅ Ollama running on port 11434
- ✅ Cursor requests show in bridge logs
- ✅ No credits consumed in Cursor
- ✅ AI features work (using local Ollama)

## 🚨 Troubleshooting

### Bridge won't start
```bash
# Check if port 8080 is in use
lsof -i :8080

# Kill existing process
pkill -f cursor_filter_bridge.py
```

### Cursor still uses cloud
- Check system proxy settings
- Verify bridge is running: `curl http://localhost:8080/health`
- Check Cursor network requests (DevTools)

### Ollama not responding
```bash
# Start Ollama
ollama serve

# Verify it's running
curl http://localhost:11434/api/tags
```

---

**Status**: Ready to cut the cord! Start the bridge and configure Cursor to use it.

