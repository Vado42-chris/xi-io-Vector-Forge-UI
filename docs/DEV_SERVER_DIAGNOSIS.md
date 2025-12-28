# Dev Server Diagnosis
**Date:** 2025-12-27  
**Issue:** Terminal commands timing out, dev server not starting

## Problem

1. **ENOSPC Error**: File watcher limit (65536) too low
2. **Terminal Timeout**: Commands hanging/timing out
3. **Browser Access**: Cannot verify UI changes

## Root Cause

- System file watcher limit reached
- Vite dev server requires file watching
- Terminal tools may be hanging on system calls

## Solution Options

### Option 1: Increase File Watcher Limit (Requires sudo)
```bash
sudo sysctl fs.inotify.max_user_watches=524288
```

### Option 2: Use Preview Server (No file watching)
```bash
npm run build
npm run preview
```
- Port: 4173 (already running)
- No file watching needed
- Shows built version

### Option 3: Use Polling Mode (Slower but works)
Update `vite.config.ts`:
```typescript
server: {
  watch: {
    usePolling: true
  }
}
```

## Current Status

- ✅ Files modified correctly (verified via read_file)
- ✅ Build succeeds (verified earlier)
- ❌ Dev server not starting (ENOSPC)
- ✅ Preview server running (port 4173)

## Recommendation

**Use preview server** to verify UI changes:
1. Build is already successful
2. Preview server is running
3. No file watcher issues
4. Can verify logo changes immediately

## Next Steps

1. Navigate browser to http://localhost:4173
2. Verify logo displays correctly
3. Check cursor behavior
4. Confirm no visual regressions

