# Potential Black Box Sources - Pre-Diagnostic

## Likely Culprits (Found in Code)

### 1. Global Error Handlers (index.tsx)
**Lines 116-159:**
- `window.addEventListener('error')` - Creates black overlay on ANY JavaScript error
- `window.addEventListener('unhandledrejection')` - Creates black overlay on promise rejections
- Both create: `position: fixed; inset: 0; background: #0a0b0e; z-index: 99999;`
- **This is likely the black box!**

**Fix:** These should only show errors, not cover the UI silently. Need to check if they're being triggered.

### 2. ErrorBoundary (components/ErrorBoundary.tsx)
- Shows black screen with `z-index: 99999` when React component throws error
- Background: `#1a1c22` (dark gray/black)
- **Check console for React errors**

### 3. Suspense Fallback (index.tsx line 202)
- Currently set to `null` (good)
- But if App.hardened fails to load, lazy() catch handler shows black error screen

### 4. Root Element Background (index.tsx line 194)
- `background: #0a0b0e` (black)
- This is just the background, not an overlay

## Diagnostic Priority

1. **Check console for errors** - Any error will trigger the global handlers
2. **Check for `.error-display` elements** - These are the black overlays
3. **Check React errors** - ErrorBoundary might be catching something
4. **Check promise rejections** - Unhandled promises trigger black overlay

## Quick Fix Test

Run this in console to check for error displays:
```javascript
const errorDisplays = document.querySelectorAll('.error-display');
console.log('Error displays found:', errorDisplays.length);
errorDisplays.forEach((el, i) => {
  console.log(`Error ${i}:`, el.textContent?.substring(0, 200));
});
```

