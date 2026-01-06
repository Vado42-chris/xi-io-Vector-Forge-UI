# Black Box Diagnostic Instructions

## Quick Diagnostic Script

Copy and paste this into your browser console (F12 → Console):

```javascript
// Copy the entire contents of diagnose-black-box.js
```

Or run the diagnostic file directly if you have it loaded.

## What to Look For

### 1. ErrorBoundary Messages
- **If you see "ErrorBoundary DETECTED"**: A React component is throwing an error
- **Action**: Check the error message in the console
- **Fix**: The error needs to be resolved in the component code

### 2. Overlay Detection Logs
Look for elements with:
- `coversScreen: true` - These are covering the entire screen
- `zIndex > 100` - These have high z-index and may be on top
- `background: rgba(0, 0, 0, ...)` or `background: #000000` - Black backgrounds

### 3. Canvas Visibility Check
- `visible: false` - Canvas area has zero dimensions
- `dimensions: { width: 0, height: 0 }` - Canvas not rendering
- `opacity: 0` - Canvas is invisible
- `zIndex: auto` or low number - Canvas may be behind other elements

### 4. Topmost Element at Screen Center
- This tells you what element is actually visible at the center of the screen
- If it's not the canvas, that's what's covering it

## Common Culprits

1. **ErrorBoundary** - Shows black screen with error message (z-index: 99999)
2. **WelcomeScreen** - Should be removed, but check if it's still rendering
3. **ErrorDashboard** - Modal overlay (z-index: 200)
4. **texture-substrate** - Should have z-index: -1, check if it's higher
5. **CSS overlay** - Some CSS rule creating a black overlay

## Report Back

After running the diagnostic, provide:
1. Do you see "ErrorBoundary DETECTED"?
2. List of elements in "Screen-Covering Elements" (especially those with `coversScreen: true`)
3. Highest z-index value and which element has it
4. Canvas Area Status (visible: true/false, dimensions)
5. Topmost Element at Screen Center (tag, classes, z-index)

