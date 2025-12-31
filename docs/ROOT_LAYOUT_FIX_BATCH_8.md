# Root Layout Fix - Batch 8

## Critical Issues Identified
1. **CSS Variables Not Available**: Canvas area was trying to use CSS variables set on sidebar elements, but CSS variables don't cascade from siblings
2. **Canvas Width Calculation**: Canvas area wasn't calculating width correctly when sidebars are visible
3. **Sidebar Positioning**: Sidebars have correct CSS classes but canvas wasn't accounting for them properly

## Fixes Applied

### 1. Root Container CSS Variables
**File**: `App.hardened.tsx`
- Added CSS variables `--sidebar-left-width` and `--sidebar-right-width` to root container
- These are now available to all children, including the canvas area
- Values are set based on `panelVisibility` state

### 2. Canvas Area Positioning
**File**: `App.hardened.tsx`
- Changed from using CSS variables to hardcoded pixel values for `left` and `right` positioning
- Added explicit `width` calculation based on sidebar visibility:
  - Both sidebars: `calc(100vw - 680px)` (320px + 360px)
  - Left only: `calc(100vw - 320px)`
  - Right only: `calc(100vw - 360px)`
  - Neither: `100vw`
- This ensures the canvas area always has the correct width regardless of sidebar state

### 3. Construction Paper Layer Containment (Previous Fix)
**Files**: `styles/xibalba-design-language.css`, `components/LeftSidebar.tsx`
- Added `max-width: 100%`, `max-height: 100%`, `overflow: hidden` to `.construction-paper-layer-menu`
- Added explicit containment styles to parent container

### 4. Canvas Background Visibility (Previous Fix)
**File**: `components/DraftsmanCanvas.tsx`
- Added explicit `backgroundColor` to canvas content wrapper
- Improved empty state visibility with better opacity and text colors

## Expected Results
- Sidebars should be fixed at left and right edges
- Canvas area should be correctly positioned between sidebars
- Canvas should have correct width calculation
- Construction paper layer should be contained
- Canvas background should be visible

## Status
✅ **FIXES APPLIED** - Ready for browser validation

