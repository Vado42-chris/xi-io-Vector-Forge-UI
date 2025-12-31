# Terminal/Browser Timeout Fix Plan
**Date:** January 27, 2025  
**Status:** 🔴 **ROOT CAUSE IDENTIFIED** - Need to fix existing issues

---

## Root Causes Found

### 1. **File Watcher Limit (ENOSPC)**
**Location:** `docs/DEV_SERVER_DIAGNOSIS.md`
- System file watcher limit too low (65536)
- Vite needs file watching
- Causes terminal commands to hang

### 2. **Vite Polling Configuration**
**Location:** `vite.config.ts` lines 13-16
- `usePolling: true` - Polling every 2000ms
- May be too aggressive for large codebase
- Could cause resource exhaustion

### 3. **Terminal Timeout Settings**
**Location:** `server.js` line 139, `services/terminalService.ts` line 91
- Timeout: 30000ms (30 seconds)
- Commands may be taking longer
- Timeout too short for some operations

### 4. **Background Processes**
**Location:** Multiple scripts
- `start-dev-server.sh` tries to kill processes on port 5173
- But Vite runs on port 3000 (per vite.config.ts)
- Processes may be hanging

---

## Fix Plan

### Fix 1: Increase File Watcher Limit
**Priority:** HIGH  
**Action:** System-level fix (requires sudo)

```bash
# Temporary fix (until reboot)
sudo sysctl fs.inotify.max_user_watches=524288

# Permanent fix (add to /etc/sysctl.conf)
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**Why:** Vite dev server needs file watching. System limit too low causes hangs.

---

### Fix 2: Optimize Vite Polling
**Priority:** MEDIUM  
**Action:** Update `vite.config.ts`

**Current:**
```typescript
watch: {
  usePolling: true,
  interval: 2000, // 2 seconds
}
```

**Fix:**
```typescript
watch: {
  usePolling: true,
  interval: 4000, // Increase to 4 seconds (less aggressive)
}
```

**Why:** 2 second polling may be too aggressive, causing resource exhaustion.

---

### Fix 3: Increase Terminal Timeout
**Priority:** MEDIUM  
**Action:** Update `server.js` and `services/terminalService.ts`

**Current:**
```javascript
timeout: 30000 // 30 seconds
```

**Fix:**
```javascript
timeout: 60000 // 60 seconds
```

**Why:** Some commands (like `npm run dev`) take longer than 30 seconds to start.

---

### Fix 4: Fix Port Mismatch
**Priority:** LOW  
**Action:** Update scripts that reference wrong port

**Issue:** Scripts reference port 5173, but Vite runs on 3000

**Files to fix:**
- `start-dev-server.sh` - Line 11: kills port 5173, should be 3000
- `START_NOW.sh` - Line 13: opens port 5173, should be 3000
- `FIX_CONNECTION_REFUSED.md` - References wrong port

**Why:** Port mismatch causes confusion and failed connections.

---

### Fix 5: Kill Hanging Processes
**Priority:** HIGH (Immediate)  
**Action:** Manual cleanup

```bash
# Kill any hanging node/npm processes
pkill -f "vite|npm run dev"

# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Kill processes on port 5173 (old config)
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Clear Vite cache
rm -rf node_modules/.vite
```

**Why:** Hanging processes block new commands and consume resources.

---

## Execution Order

1. **Immediate:** Kill hanging processes (Fix 5)
2. **Immediate:** Increase file watcher limit (Fix 1)
3. **Next:** Optimize Vite polling (Fix 2)
4. **Next:** Increase terminal timeout (Fix 3)
5. **Later:** Fix port mismatches (Fix 4)

---

## Verification

After fixes, test:
1. `npm run dev` starts without hanging
2. Terminal commands complete within timeout
3. Browser tools can navigate to localhost:3000
4. No ENOSPC errors
5. File watching works correctly

---

## Status

🔴 **READY TO FIX** - All root causes identified, fix plan created

