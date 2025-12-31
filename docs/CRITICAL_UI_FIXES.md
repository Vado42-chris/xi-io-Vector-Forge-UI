# Critical UI Fixes - Making It Actually Work

**Date:** January 27, 2025  
**Status:** 🔴 **CRITICAL - FIXING NOW**

---

## The Problem

The UI is completely broken - user cannot see or use anything. This is blocking everything.

---

## Fixes Applied

### 1. ✅ All Background Classes Fixed
- Changed ALL `bg-dark` to `bg-[var(--xibalba-grey-050)]`
- Changed ALL `bg-darkest` to `bg-[var(--xibalba-grey-000)]`
- Changed ALL `bg-darker` to `bg-[var(--xibalba-grey-100)]`
- **Why:** These classes weren't using CSS variables, so they weren't getting proper colors

### 2. ✅ Canvas Area Background
- Added visible background with grid pattern
- Changed from `background: var(--xibalba-grey-050)` to `background-color: var(--xibalba-grey-050, #12141a) !important`
- Added grid pattern for visual feedback
- **Why:** Canvas was completely black/invisible

### 3. ✅ Sidebar Backgrounds
- LeftSidebar: All `bg-dark` → `bg-[var(--xibalba-grey-050)]`
- RightSidebar: All `bg-dark` → `bg-[var(--xibalba-grey-050)]`
- **Why:** Sidebars were invisible

### 4. ✅ Main App Container
- Changed `bg-darkest` → `bg-[var(--xibalba-grey-000)]`
- **Why:** Main container wasn't visible

### 5. ✅ Canvas Layout
- Fixed width calculation based on sidebar visibility
- Proper margins for fixed sidebars
- **Why:** Canvas was overlapping sidebars or not visible

---

## Files Modified

1. `App.hardened.tsx` - Main container and canvas area
2. `components/LeftSidebar.tsx` - All background classes
3. `components/RightSidebar.tsx` - All background classes
4. `components/DraftsmanCanvas.tsx` - Canvas container background
5. `styles/xibalba-design-language.css` - Canvas area background

---

## What Should Work Now

1. ✅ Sidebars are visible with proper backgrounds
2. ✅ Canvas is visible with grid pattern
3. ✅ All components have proper backgrounds
4. ✅ Layout doesn't overlap
5. ✅ Everything uses CSS variables

---

## Next Steps

1. Test in browser - verify everything renders
2. Check console for errors
3. Verify all interactive elements work
4. Make sure text is visible
5. Ensure icons are visible

**THE UI MUST WORK OR WE HAVE NOTHING.**

