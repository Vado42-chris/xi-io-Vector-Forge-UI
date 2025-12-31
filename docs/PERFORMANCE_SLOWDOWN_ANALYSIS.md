# Performance Slowdown Analysis
**Date:** January 27, 2025  
**Issue:** Painstakingly slow compared to local AI that "used to sing"

---

## Key Differences: Local vs Remote AI

### Local AI (Fast - "Used to Sing")
- ✅ Runs on same machine
- ✅ No network latency
- ✅ Direct file system access
- ✅ No API calls needed
- ✅ Instant responses

### Current Setup (Slow)
- ❌ Likely using remote API (Gemini/MCP)
- ❌ Network latency on every request
- ❌ API rate limits
- ❌ Network timeouts
- ❌ Multiple hops (Cursor → API → Response)

---

## Performance Killers Found

### 1. **Network API Calls**
**Location:** `vite.config.ts` lines 44-47
```typescript
'import.meta.env.VITE_XIBALBA_MCP_URL': JSON.stringify(env.VITE_XIBALBA_MCP_URL || 'http://localhost:8000'),
'import.meta.env.VITE_XIBALBA_API_KEY': JSON.stringify(env.VITE_XIBALBA_API_KEY || ''),
'import.meta.env.VITE_XIBALBA_MODEL': JSON.stringify(env.VITE_XIBALBA_MODEL || 'xibalba-local'),
```

**Issue:**
- If using remote API, every tool call goes over network
- Network latency adds 100-500ms per call
- Multiple tool calls = seconds of delay

**Fix:** Use local model if available (Ollama, local MCP server)

---

### 2. **File Watcher Overhead**
**Location:** `vite.config.ts` lines 13-16
```typescript
watch: {
  usePolling: true,
  interval: 2000, // Polls every 2 seconds
}
```

**Issue:**
- Polling every 2 seconds on large codebase
- Each poll checks thousands of files
- CPU/memory intensive

**Fix:** Increase interval to 4000ms or disable polling if file watcher limit fixed

---

### 3. **Terminal Timeout Too Short**
**Location:** `server.js` line 139
```javascript
timeout = 30000 // 30 seconds
```

**Issue:**
- Commands that take 31+ seconds timeout
- Causes retries and delays
- Network commands especially slow

**Fix:** Increase to 60000ms (60 seconds)

---

### 4. **Multiple Background Processes**
**Issue:**
- Dev server running
- MCP server running (port 8000)
- File watchers active
- Terminal service running

**Impact:**
- Resource contention
- Slower responses
- Timeouts

**Fix:** Kill unnecessary processes, optimize what's needed

---

### 5. **Large Codebase**
**Issue:**
- Thousands of files
- Large node_modules
- Many watchers needed
- Slow file operations

**Impact:**
- File searches slow
- Grep operations slow
- Codebase searches slow

**Fix:** Better ignore patterns, optimize search scope

---

### 6. **Network Configuration**
**Issue:**
- If using remote API, network quality matters
- Firewall/proxy delays
- DNS resolution delays
- Connection overhead

**Fix:** Use local services when possible

---

## What Made Local AI Fast

### Local Setup Advantages:
1. **No Network Latency** - Direct execution
2. **Full System Access** - No API overhead
3. **Instant File Access** - No network round-trips
4. **No Rate Limits** - Unlimited requests
5. **Lower Resource Usage** - No network stack

---

## Performance Fixes

### Immediate (Biggest Impact):

1. **Use Local Model** (if available)
   - Check if Ollama is running
   - Use local MCP server
   - Avoid remote API calls

2. **Kill Unnecessary Processes**
   ```bash
   pkill -f "vite|npm|node"  # Kill dev servers
   # Keep only what's needed
   ```

3. **Increase File Watcher Limit**
   ```bash
   sudo sysctl fs.inotify.max_user_watches=524288
   ```

### Code Fixes:

4. **Optimize Vite Polling**
   - Increase interval to 4000ms
   - Better ignore patterns

5. **Increase Timeouts**
   - Terminal: 30s → 60s
   - Network: Add retry logic

6. **Optimize Searches**
   - Limit search scope
   - Better ignore patterns
   - Cache results

---

## Diagnostic Questions

1. **Is MCP server local or remote?**
   - Check `VITE_XIBALBA_MCP_URL`
   - If `localhost:8000` = local (good)
   - If remote URL = network latency (bad)

2. **Is Ollama running locally?**
   - Check `scripts/check-ollama.sh`
   - Local Ollama = fast
   - Remote API = slow

3. **How many background processes?**
   - Check `ps aux | grep -E "node|npm|vite"`
   - Too many = resource contention

4. **Network quality?**
   - If using remote API, network speed matters
   - Local = instant, Remote = 100-500ms per call

---

## Expected Performance

### Local AI (What "Used to Sing"):
- Tool calls: < 100ms
- File operations: < 50ms
- Searches: < 200ms
- Total response: < 1 second

### Current (If Remote):
- Tool calls: 200-1000ms (network latency)
- File operations: 100-500ms (API overhead)
- Searches: 500-2000ms (network + processing)
- Total response: 2-5 seconds

**Difference: 2-5x slower due to network overhead**

---

## Root Cause

**If using remote API instead of local model:**
- Every tool call = network round-trip
- Network latency = 100-500ms per call
- Multiple tool calls = seconds of delay
- This is why it's "painstakingly slow"

**Solution:** Use local model (Ollama) or local MCP server

---

## Next Steps

1. **Check if local model available:**
   ```bash
   # Check Ollama
   curl http://localhost:11434/api/tags
   
   # Check MCP server
   curl http://localhost:8000/health
   ```

2. **If local available, use it:**
   - Configure to use localhost
   - Avoid remote API calls

3. **If remote only, optimize:**
   - Increase timeouts
   - Batch operations
   - Reduce tool calls

---

## Status

🔴 **INVESTIGATING** - Need to check if using local vs remote model

