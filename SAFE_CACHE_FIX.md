# Safe Cache Fix - No Process Killing

## The Problem
Browser is serving cached files instead of latest code.

## Safe Diagnostic Steps (No Killing Processes)

### Step 1: Check What's Running
```bash
# See what's on each port (safe - read-only)
lsof -i :3000
lsof -i :5173
lsof -i :4173
```

### Step 2: Check Browser DevTools
1. Open browser to `http://localhost:3000` (or whatever port)
2. Press **F12** → **Network tab**
3. Check **"Disable cache"** checkbox (top of Network tab)
4. Look at the **Size** column:
   - If it says "(disk cache)" → Browser is using cached files
   - If it shows actual file sizes → Files are loading fresh

### Step 3: Check Console for Cache-Bust Messages
Open **Console tab** (F12) and look for:
```
🚀 MOUNTING APP - Version: [timestamp]
🎨 App.hardened RENDERING - Version: [timestamp]
```

**If you DON'T see these:** Browser is serving old cached files.

### Step 4: Clear Browser Cache (Safe Method)
1. **F12** → **Application tab**
2. **Storage** → **Clear site data**
3. **Service Workers** → **Unregister** (if any)
4. **Cache Storage** → **Delete all**

### Step 5: Hard Refresh
- **Windows/Linux:** `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`

### Step 6: Verify Files Are Fresh
In browser console, run:
```javascript
// Check if service worker is caching
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service workers:', regs.length);
  if (regs.length > 0) {
    console.log('⚠️ Service worker found - unregistering...');
    regs.forEach(reg => reg.unregister());
  }
});

// Check which files loaded
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('App') || r.name.includes('index'))
  .forEach(r => console.log(r.name, r.transferSize === 0 ? '(cached)' : '(fresh)'));
```

## If Still Cached

### Option A: Use Incognito Mode
1. Open browser in **Incognito/Private mode**
2. Navigate to `http://localhost:3000`
3. Check if UI is different

If incognito works → Browser extension or cache is the issue.

### Option B: Check Which Server is Running
```bash
# See what npm script is running
ps aux | grep "npm run" | grep -v grep

# Check package.json to see what "dev" does
cat package.json | grep -A 1 '"dev"'
```

### Option C: Verify Vite is Watching Files
If using `npm run dev:vite`, check terminal output for:
```
VITE v6.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

If you see file change notifications when editing → Vite is watching correctly.

## Most Likely Issue
**Browser cache** - The browser is serving old JavaScript files from cache.

**Fix:** Disable cache in DevTools Network tab, then hard refresh.


