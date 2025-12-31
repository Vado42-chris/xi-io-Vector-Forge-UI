# Z-Stack and Template Rendering Fix

## Issue
Templates are still broken - z-stack issues preventing proper rendering order. Content not displaying correctly.

## Root Cause
1. **Canvas area** was using inline `zIndex: 10` instead of z-stack class
2. **Sidebars** had `zstack-sidebar-left/right` classes but CSS was overriding with `!important`
3. **Z-stack hierarchy** not being properly enforced

## Fixes Applied

### 1. Canvas Area Z-Stack
**File**: `App.hardened.tsx`
- Removed inline `zIndex: 10` and `position: 'absolute'` (already in className)
- Added `zstack-canvas` class which applies `z-index: var(--z-canvas, 10)`
- This ensures canvas is at the correct layer (10) below sidebars (100)

### 2. Sidebar Z-Stack
**Files**: `components/LeftSidebar.tsx`, `components/RightSidebar.tsx`
- Removed `zstack-sidebar-left/right` classes (CSS already handles this with `!important`)
- Added explicit inline `zIndex: 'var(--z-sidebar-left/right, 100)'` to ensure proper stacking
- This ensures sidebars are above canvas (z-index 100 vs 10)

### 3. Z-Stack Hierarchy (Correct Order)
```
Layer 0: Base (background)
Layer 1: Background
Layer 10: Canvas (zstack-canvas)
Layer 100: Sidebars (zstack-sidebar-left/right)
Layer 400: Header/Menu (zstack-menu)
Layer 1000: Modals
Layer 10000: Toasts/Tooltips
```

## Expected Results
- Canvas renders at z-index 10 (below sidebars)
- Sidebars render at z-index 100 (above canvas)
- Header renders at z-index 400 (above everything)
- Content displays in correct order
- No overlapping issues

## Status
✅ **FIXES APPLIED** - Z-stack hierarchy now properly enforced

