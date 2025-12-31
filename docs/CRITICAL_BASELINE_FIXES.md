# Critical Baseline Fixes - Canvas & Rulers

**Date:** January 27, 2025  
**Status:** 🔴 **CRITICAL - BASELINE MUST WORK**

---

## Current Critical Issues

### 1. Canvas Area Not Working

- **Problem:** Canvas not rendering properly
- **Impact:** Users can't draw or interact
- **Priority:** P0 - BLOCKING

### 2. Rulers Completely Broken

- **Problem:** Rulers not displaying or functioning
- **Impact:** No measurement reference
- **Priority:** P0 - BLOCKING

### 3. Multi-File Support Missing

- **Problem:** Can only work with one file at a time
- **Impact:** Workflow limitation
- **Priority:** P1 - HIGH

### 4. DraftsmanCanvas 500 Error
- **Problem:** Component returning 500 on load
- **Impact:** UI won't render
- **Priority:** P0 - BLOCKING

---

## Immediate Fixes Needed

### Fix 1: DraftsmanCanvas Hooks Issue ✅
- **Status:** Fixed (removed hooks from render)
- **Validation:** Need to verify build passes

### Fix 2: Canvas Rendering
- **Check:** Canvas container sizing
- **Check:** SVG rendering
- **Check:** Event handlers
- **Check:** Coordinate system

### Fix 3: Rulers
- **Check:** ProfessionalRulers component
- **Check:** Ruler positioning
- **Check:** Measurement calculations
- **Check:** Unit display

### Fix 4: Multi-File Support
- **Design:** Tab system for open files
- **Design:** File switching
- **Design:** State management per file

---

## VS Code Lessons Applied

### 1. Editor Groups (Multi-File)
- VS Code: Multiple editors side-by-side
- Our Approach: Tabbed canvas system
- Implementation: File tabs above canvas

### 2. Panel System
- VS Code: Dockable panels
- Our Approach: Already have DockablePanel
- Enhancement: Better integration

### 3. Activity Bar
- VS Code: Switch between activities
- Our Approach: Add activity switching
- Implementation: Design/Code/Preview modes

---

## Next Steps

1. ✅ Fix DraftsmanCanvas (done)
2. ⏳ Fix canvas rendering
3. ⏳ Fix rulers
4. ⏳ Add multi-file support
5. ⏳ Validate in browser

