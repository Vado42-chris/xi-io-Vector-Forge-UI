# Complete UI Fix Plan - All Issues

## 🔴 CRITICAL ISSUES IDENTIFIED

### 1. Canvas Showing Number List (P0 - BLOCKING)
**Problem:** Middle column shows AnimationTimeline frame numbers instead of canvas
**Root Cause:** AnimationTimeline may be rendering in canvas area OR canvas not rendering
**Fix:** Verify layout structure, ensure AnimationTimeline is at bottom, canvas in center

### 2. Material Icons Not Loading (P0 - BLOCKING)
**Problem:** Icons showing as text (keyboard_arrow_down, play_arrow, etc.)
**Fix Applied:** CSP updated in vite.config.ts
**Status:** May need dev server restart

### 3. Tool Groupings Unfinished (P1)
**Problem:** Tools not properly grouped in LeftSidebar
**Fix:** Organize tools into logical groups

### 4. Missing Bounding Boxes (P1)
**Problem:** Files/objects have no visual selection indicators
**Fix:** Add bounding box rendering

### 5. Missing File Bar (P1)
**Problem:** No file name display in header
**Fix:** Add file name/title to ProfessionalFileMenu

### 6. Right Panels Not in Accordions (P1)
**Problem:** Right sidebar panels not collapsible
**Fix:** Convert to accordion components

### 7. Button Labels Broken (P1)
**Problem:** Text concatenation (hi tory, kip_previou, Pre et)
**Fix:** Fix button label rendering

## 🎯 FIX ORDER

**Phase 1: Make Canvas Visible (CRITICAL)**
1. Verify Canvas component renders
2. Fix AnimationTimeline positioning
3. Ensure canvas has proper z-index

**Phase 2: Fix Icons**
1. Restart dev server
2. Verify Material Icons load

**Phase 3: Fix Remaining**
1. Tool groupings
2. Bounding boxes
3. File bar
4. Accordions
5. Button labels

**Status:** Investigating canvas/AnimationTimeline layout issue...

