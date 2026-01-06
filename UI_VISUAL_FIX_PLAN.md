# UI Visual Fix Plan

## 🔴 DIAGNOSIS: Canvas Misalignment

**Problem:** Canvas is shifted right, overlapping left sidebar, extending beyond right sidebar.

**Root Cause:** Sidebars are `position: relative` but the flexbox layout isn't constraining them properly. The canvas is taking full width instead of remaining space between sidebars.

---

## 🎯 FIX PLAN

### **Fix 1: Ensure Sidebars Have Fixed Widths**
- Left sidebar: MUST be `width: 320px` and `shrink-0`
- Right sidebar: MUST be `width: 360px` and `shrink-0`
- Canvas: MUST be `flex-1` (takes remaining space)

### **Fix 2: Verify Flex Container**
- Main container: `flex flex-row` with `overflow-hidden`
- Each sidebar: `shrink-0` to prevent compression
- Canvas: `flex-1` to fill remaining space

### **Fix 3: Remove Conflicting CSS**
- Check for CSS that overrides flexbox
- Remove any `position: absolute` on canvas
- Ensure no width calculations conflict

---

## 🚀 IMMEDIATE ACTIONS

1. **Check App.hardened.tsx layout structure**
2. **Verify sidebar widths are enforced**
3. **Ensure canvas uses flex-1 correctly**
4. **Test in browser**

