# UI Visual Diagnosis & Fix Plan

## 🔴 PROBLEM DIAGNOSED

**Canvas is shifted right, overlapping left sidebar, extending beyond right sidebar.**

**Root Cause:** Multiple CSS rules conflicting:
1. `.canvas-area` class has `position: absolute` in `xibalba-design-language.css`
2. Canvas container might not have explicit flex constraints
3. Sidebars might not be properly constrained in flex layout

## ✅ FIXES APPLIED

### Fix 1: RightSidebar Width Constraints
- Added explicit inline styles: `width`, `minWidth`, `maxWidth`, `flexShrink: 0`, `flexGrow: 0`
- Ensures sidebar stays at 360px

### Fix 2: LeftSidebar Flex Constraints  
- Added `flexShrink: 0`, `flexGrow: 0` to prevent compression
- Already had width constraints

### Fix 3: Canvas Flex Constraints
- Added `minWidth: 0`, `flex: '1 1 0%'` for proper flex behavior
- Added explicit `position: 'relative'`, `display: 'flex'`, `flexDirection: 'column'`

### Fix 4: Disabled Conflicting CSS
- Disabled `.canvas-area` absolute positioning in `xibalba-design-language.css`

## 🎯 EXPECTED RESULT

- Left sidebar: Fixed 320px, no compression
- Canvas: Takes remaining space between sidebars  
- Right sidebar: Fixed 360px, no compression
- No overlapping elements

**Status:** Testing in browser...

