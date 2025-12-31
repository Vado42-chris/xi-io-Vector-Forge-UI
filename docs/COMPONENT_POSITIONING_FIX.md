# Component Positioning Fix - Root Cause

## Problem
PowerUserToolbar content was appearing BOTH as a floating toolbar AND overflowing into the header area. This indicates a fundamental rendering/positioning issue.

## Root Cause Analysis
1. **PowerUserToolbar was in wrong container**: It was in a separate wrapper div that took full width/height
2. **Header containment not strict enough**: Absolute/fixed positioned children could escape
3. **Z-stack conflicts**: Multiple elements competing for same space

## Fixes Applied

### 1. Moved PowerUserToolbar to Canvas Container
**File**: `App.hardened.tsx`
- Removed separate wrapper div for PowerUserToolbar
- Moved PowerUserToolbar INSIDE the canvas container div (the flex-1 div)
- Canvas container now has `position: relative` to provide positioning context
- PowerUserToolbar is now a sibling of DraftsmanCanvas, both inside the canvas container

### 2. Strict Header Containment
**File**: `styles/xibalba-design-language.css`
- Added rule to hide any absolute/fixed positioned children within header
- This prevents any content from escaping the header boundaries
- Added `position: relative !important` to direct children to ensure proper stacking

### 3. PowerUserToolbar Positioning
**File**: `components/PowerUserToolbar.tsx`
- Already using `position: absolute` (fixed from previous change)
- Positioned relative to canvas container (parent with `position: relative`)
- Added `pointerEvents: 'auto'` to ensure interactivity

## Component Structure (After Fix)
```
Root Container (relative)
├── Header (fixed, z-index 400, height 48px, overflow hidden)
├── Left Sidebar (fixed, z-index 100)
├── Right Sidebar (fixed, z-index 100)
└── Canvas Area (absolute, z-index 10, top: 48px)
    └── Canvas Container (relative, flex-1)
        ├── PowerUserToolbar (absolute, z-index 50, top-right)
        └── DraftsmanCanvas (absolute, fills container)
```

## Expected Results
- PowerUserToolbar only appears once, in canvas area
- No content escaping header
- Proper z-stack hierarchy
- No duplication of UI elements

## Status
✅ **FIXES APPLIED** - Component structure corrected

