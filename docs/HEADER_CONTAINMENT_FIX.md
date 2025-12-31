# Header Containment Fix - Critical Template Rendering Issue

## Problem
Header content was overflowing its 48px container and overlapping the canvas area and horizontal ruler. The header's children were not being constrained, causing visual overlap and z-stack issues.

## Root Cause
1. **Header children not constrained**: Flex children had `h-full` which allowed them to exceed 48px
2. **No explicit height on all children**: Only the header had height constraints, not its direct children
3. **Missing containment on children**: Header's flex children could overflow
4. **Canvas z-index not explicit**: Canvas area needed explicit z-index to ensure it's below header

## Fixes Applied

### 1. Header CSS - Strict Containment
**File**: `styles/xibalba-design-language.css`
- Added `min-height: 48px !important` to prevent shrinking
- Added `contain: layout style paint size !important` for strict containment
- Added `box-sizing: border-box !important` to include borders in height
- Added universal selector `.xibalba-header *` to constrain ALL children to 48px max
- Added direct child selector `.xibalba-header > *` to force height and overflow on direct children

### 2. Header Element - Explicit Constraints
**File**: `components/ProfessionalFileMenu.tsx`
- Added `minHeight: '48px'` to header element
- Added `height: '48px'` and `alignItems: 'center'` to all flex containers
- Removed `h-full` from nav and buttons (was causing overflow)
- Added explicit `height: '48px'`, `maxHeight: '48px'`, `lineHeight: '48px'` to menu buttons
- Added height constraints to all header flex children

### 3. Canvas Z-Index
**File**: `App.hardened.tsx`
- Added explicit `zIndex: 'var(--z-canvas, 10)'` to canvas area
- Added explicit `position: 'absolute'` to ensure proper stacking

## Expected Results
- Header content stays strictly within 48px height
- No content escaping header boundaries
- No overlap with canvas area
- Proper z-stack: Header (400) > Sidebars (100) > Canvas (10)
- All header children constrained to 48px max height

## Status
✅ **FIXES APPLIED** - Header now has strict containment with universal child constraints

