# Canvas Z-Index and Positioning Fix

## Issue
Canvas area was not visible despite being rendered. Sidebars were visible but canvas was not appearing.

## Root Cause Analysis
1. **Z-Index Hierarchy**: Canvas has `z-index: 10` (via `--z-canvas`), sidebars have `z-index: 100` (via `--z-sidebar-left/right`). This is correct - sidebars should be above canvas.
2. **Canvas Area Positioning**: Canvas area div was absolutely positioned but might not have explicit dimensions
3. **Canvas Container Layout**: DraftsmanCanvas container might not be using flexbox correctly

## Fixes Applied

### 1. Canvas Area Z-Index
**File**: `App.hardened.tsx`
- Added `zstack-canvas` class to canvas area div
- Added explicit `zIndex: 10` to inline styles
- This ensures canvas is in the correct z-stack layer

### 2. Canvas Area Width Calculation
**File**: `App.hardened.tsx`
- Added explicit `width` calculation based on sidebar visibility:
  - Both sidebars: `calc(100vw - 680px)`
  - Left only: `calc(100vw - 320px)`
  - Right only: `calc(100vw - 360px)`
  - Neither: `100vw`
- This ensures canvas always has correct width

### 3. DraftsmanCanvas Container Layout
**File**: `components/DraftsmanCanvas.tsx`
- Added `display: 'flex'` and `flexDirection: 'column'` to container style
- This ensures proper flex layout for canvas content

### 4. Canvas Area Explicit Dimensions
**File**: `components/DraftsmanCanvas.tsx`
- Added explicit `position`, `top`, `left`, `right`, `bottom`, `width`, `height` to canvas area div
- This ensures the canvas area fills its container completely

## Expected Results
- Canvas area should be visible between sidebars
- Canvas should have correct z-index (below sidebars, above background)
- Canvas should fill available space correctly
- Canvas background should be visible

## Status
✅ **FIXES APPLIED** - Ready for browser validation

