# Canvas Visibility Fix

**Date:** January 27, 2025  
**Status:** ✅ **FIX APPLIED**

---

## Problem Identified

The canvas container was using `flex-1` with `min-h-[400px]`, which prevented proper flexbox sizing in an absolutely positioned parent.

---

## Fix Applied

**File:** `App.hardened.tsx:2025-2028`

**Changed:**
```tsx
// Before
<div
  className="flex-1 relative overflow-hidden min-h-[400px] bg-[var(--xibalba-grey-000)]"
>

// After
<div
  className="relative overflow-hidden bg-[var(--xibalba-grey-000)]"
  style={{ 
    flex: '1 1 0',
    minHeight: 0,
    height: '100%'
  } as React.CSSProperties}
>
```

**Why:**
1. `flex: '1 1 0'` explicitly sets flex-grow, flex-shrink, and flex-basis
2. `minHeight: 0` allows flexbox to shrink below content size
3. `height: '100%'` ensures the container takes full available height

---

## Expected Result

- Canvas container should now properly fill available space
- Canvas should be visible between sidebars
- Layout should be responsive to sidebar visibility

---

## Next Validation

1. Check browser to verify canvas is visible
2. Test canvas interaction (click, draw)
3. Verify layout doesn't break when sidebars toggle

