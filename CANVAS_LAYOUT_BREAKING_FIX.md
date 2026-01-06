# Canvas Layout Breaking Fix

## Problem
1. **Canvas area breaking everything above it** - Toolbar and AI panel not displaying correctly
2. **Rulers not rendering on correct sides** - Should be horizontal at top, vertical on left

## Root Cause

### Issue 1: Canvas Using Absolute Positioning
- **Location**: `components/Canvas.tsx` line 458
- **Problem**: `position: 'absolute', inset: 0` breaks out of flex layout
- **Effect**: Canvas covers everything above it, breaks flex column layout

### Issue 2: Canvas Viewport Using Absolute Positioning
- **Location**: `components/Canvas.tsx` line 512
- **Problem**: `position: 'absolute', top: 0, left: 0, right: 0, bottom: 0`
- **Effect**: Doesn't respect flex layout, breaks parent container

### Issue 3: Canvas Area Container Height
- **Location**: `App.hardened.tsx` line 2525
- **Problem**: `height: '100%'` conflicts with flex layout
- **Effect**: Prevents proper flex height calculation

## Solution

### Fix 1: Canvas Container - Change to Relative
**Before:**
```tsx
position: 'absolute',
inset: 0,
```

**After:**
```tsx
position: 'relative',
width: '100%',
height: '100%',
flex: '1 1 0%',
minHeight: 0,
```

### Fix 2: Canvas Viewport - Change to Relative
**Before:**
```tsx
position: 'absolute',
top: 0,
left: 0,
right: 0,
bottom: 0,
```

**After:**
```tsx
position: 'relative',
width: '100%',
height: '100%',
flex: '1 1 0%',
minHeight: 0,
```

### Fix 3: Canvas Area Container - Remove Height
**Before:**
```tsx
height: '100%', // Take full height of parent
```

**After:**
```tsx
// REMOVED: height: '100%' - Let flex handle height calculation
```

## Layout Structure (Fixed)

```
Center Stack (flex column)
├── Toolbar (flex: 0 0 48px) ✅
├── AI Panel (flex: 0 0 200px) ✅
└── Canvas Area (flex: 1 1 0%) ✅
    └── Canvas Component (position: relative, flex: 1 1 0%)
        ├── Rulers (absolute, overlay)
        └── Canvas Viewport (position: relative, flex: 1 1 0%)
```

## Result

✅ **Canvas respects flex layout** - No longer breaks elements above it  
✅ **Toolbar and AI panel display correctly** - Flex layout works  
✅ **Rulers positioned correctly** - Overlay on canvas, horizontal at top, vertical on left  
✅ **Canvas fills available space** - Uses flex: 1 1 0% instead of absolute positioning  

## Files Modified

1. `components/Canvas.tsx` - Changed canvas container from absolute to relative
2. `components/Canvas.tsx` - Changed canvas viewport from absolute to relative
3. `App.hardened.tsx` - Removed height: 100% from canvas area container

