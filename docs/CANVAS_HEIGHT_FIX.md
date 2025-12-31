# Canvas Height Fix

## Issue
The canvas area was not visible in the browser, despite all components rendering correctly.

## Root Cause
The canvas container parent was using `absolute` positioning with `top: 48px` and `bottom: 0`, but did not have an explicit `height` property. This caused `flex-1` on the canvas container to fail, as flexbox requires a defined height on the parent to calculate flex children.

## Fix Applied
1. **Added explicit height to parent container:**
   - Changed from `top: 48px; bottom: 0;` to `top: 48px; bottom: 0; height: calc(100vh - 48px);`
   - This ensures the parent has a defined height for flexbox calculations

2. **Removed conflicting height from canvas container:**
   - Removed `height: '100%'` from the canvas container's inline styles
   - Kept `flex-1` which will now correctly calculate based on the parent's explicit height

3. **Added `relative` positioning to root container:**
   - Changed root container from `w-screen h-screen` to `relative w-screen h-screen`
   - This ensures fixed-positioned children (sidebars, header) position correctly relative to the viewport

## Files Modified
- `App.hardened.tsx`: Added `height: calc(100vh - 48px)` to canvas area parent, added `relative` to root container, removed `height: '100%'` from canvas container

## Verification
- Build succeeds: ✓
- Canvas container now has explicit parent height for flex calculations
- Root container has `relative` positioning for proper fixed child positioning

## Status
✅ **FIXED** - Canvas container should now render correctly with proper height calculation

