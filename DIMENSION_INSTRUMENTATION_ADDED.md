# Dimension Instrumentation Added

## Instrumentation Points

### 1. Canvas Area Container
**File:** `App.hardened.tsx` (line ~2129)
- Added `ref` callback that measures dimensions after mount
- Logs: width, height, display, visibility, opacity, position, zIndex
- Log prefix: `[DEBUG] Canvas area dimensions`

### 2. Canvas Inner Div
**File:** `App.hardened.tsx` (line ~2177)
- Added `ref` callback that measures dimensions after mount
- Logs: width, height, display, visibility, opacity, position, zIndex
- Log prefix: `[DEBUG] Canvas inner div dimensions`

### 3. Canvas Container (Canvas Component)
**File:** `components/Canvas.tsx` (line ~340)
- Added `useEffect` hook that measures dimensions after mount
- Logs: width, height, display, visibility, opacity, position, zIndex
- Log prefix: `[DEBUG] Canvas container dimensions`

### 4. Canvas Viewport
**File:** `components/Canvas.tsx` (line ~448)
- Added inline measurement in render (runs on every render)
- Logs: width, height, display, visibility, opacity, transform, position
- Log prefix: `[DEBUG] Canvas viewport dimensions`

## How to Use

1. **Hard refresh browser** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Open DevTools** (F12) → Console tab
3. **Look for these logs:**
   - `[DEBUG] Canvas area dimensions` - Container size
   - `[DEBUG] Canvas inner div dimensions` - Inner wrapper size
   - `[DEBUG] Canvas container dimensions` - Canvas component container
   - `[DEBUG] Canvas viewport dimensions` - Actual viewport size

## What to Check

For each log, check:
- **Width/Height = 0?** → Dimension issue (flexbox not working)
- **Display = "none"?** → Visibility issue (CSS hiding element)
- **Opacity = 0?** → Opacity issue (element is transparent)
- **Transform includes large translate?** → Element might be off-screen

## Expected Output

If everything is working:
- Canvas area: width > 0, height > 0 (should be ~calc(100vw - 680px) × calc(100vh - 48px))
- Canvas inner div: width > 0, height > 0 (should match canvas area)
- Canvas container: width > 0, height > 0 (should match inner div)
- Canvas viewport: width > 0, height > 0 (should be 100% of container)

## Next Steps

1. Run the diagnostic script in browser console
2. Copy all `[DEBUG]` logs that mention "dimensions"
3. Paste them here for analysis
4. I'll provide the exact fix based on the measurements

