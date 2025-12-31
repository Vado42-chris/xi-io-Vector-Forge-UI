# PowerUserToolbar Positioning Fix

## Problem
PowerUserToolbar was using `position: fixed` with hardcoded `z-50`, causing it to escape the canvas container and overlap other elements. It was positioned relative to the viewport instead of the canvas area.

## Root Cause
1. **Fixed positioning**: Using `position: fixed` positions relative to viewport, not parent container
2. **Hardcoded z-index**: Using `z-50` instead of z-stack system
3. **Wrong positioning context**: Positioned relative to window instead of canvas area

## Fixes Applied

### 1. Changed to Absolute Positioning
**File**: `components/PowerUserToolbar.tsx`
- Changed from `position: fixed` to `position: absolute`
- Now positions relative to parent container (canvas area)
- Added wrapper div in App.hardened.tsx with `position: relative` to provide positioning context

### 2. Z-Stack Integration
**File**: `components/PowerUserToolbar.tsx`
- Changed from hardcoded `z-50` to `zstack-power-toolbar` class
- Uses `var(--z-power-toolbar, 50)` from z-stack system
- Ensures proper layering

### 3. Positioning Context
**File**: `App.hardened.tsx`
- Wrapped PowerUserToolbar in a `relative` positioned div
- This div is inside the canvas area container
- Provides proper positioning context for absolute children

### 4. Drag Handling
**File**: `components/PowerUserToolbar.tsx`
- Updated drag handling to calculate positions relative to parent container
- Uses `getBoundingClientRect()` on parent to get correct bounds
- Positions are now relative to canvas area, not viewport

## Expected Results
- PowerUserToolbar stays within canvas area
- No overlap with header or sidebars
- Proper z-stack hierarchy
- Dragging works correctly within canvas bounds

## Status
✅ **FIXES APPLIED** - PowerUserToolbar now positioned correctly within canvas area

