# Header Overflow Fix - Critical Z-Stack Issue

## Problem
Header elements ("view_quilt Default Layout", "25,000 CORE_LIBS", "Execution Layer", "Active_Session", "User") were overflowing the 48px header height and appearing below the header, overlapping the canvas area and horizontal ruler.

## Root Cause
1. **Header not constraining content**: Header had `height: 48px` but no `overflow: hidden` or `max-height` constraint
2. **Content escaping**: Flex children were not constrained, allowing content to overflow
3. **Z-index conflicts**: LayoutSwitcher dropdown using hardcoded z-index values instead of z-stack system

## Fixes Applied

### 1. Header CSS Constraints
**File**: `styles/xibalba-design-language.css`
- Added `max-height: 48px !important` to prevent growth
- Added `overflow: hidden !important` to clip overflowing content
- Added `contain: layout style paint !important` to prevent content escaping

### 2. Header Element Constraints
**File**: `components/ProfessionalFileMenu.tsx`
- Added inline `maxHeight: '48px'`, `overflow: 'hidden'`, `height: '48px'` to header element
- Added `maxHeight: '48px'`, `overflow: 'hidden'` to header's flex children
- This ensures all content is constrained within the 48px header height

### 3. LayoutSwitcher Z-Stack
**File**: `components/LayoutSwitcher.tsx`
- Changed dropdown z-index from hardcoded `z-[100]` to `var(--z-dropdown, 500)`
- Changed backdrop z-index from hardcoded `z-[90]` to `var(--z-modal-backdrop, 200)`
- This ensures proper z-stack hierarchy

## Expected Results
- Header content stays within 48px height
- No content escaping below header
- No overlap with canvas area
- Proper z-stack for dropdowns

## Status
✅ **FIXES APPLIED** - Header now properly constrains content

