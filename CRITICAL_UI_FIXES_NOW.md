# Critical UI Fixes - Immediate Action Plan

**Priority:** P0 - Fixing all critical UX issues now

---

## Issues to Fix (In Order)

### 1. Z-Index System Enforcement
- **Problem:** Z-index system exists but not used consistently
- **Fix:** Audit all components, replace arbitrary z-index with z-stack classes
- **File:** `styles/z-index-layers.css` exists, need to enforce usage

### 2. Top Left Corner Layout
- **Problem:** Dev Chat + Diagnostics buttons overlapping/misaligned
- **Fix:** Proper flex layout, spacing, alignment

### 3. File Menu Spacing
- **Problem:** Menu items bunched up, mixed with toolbar
- **Fix:** Proper spacing, separation from toolbar

### 4. Grid Settings Always Open
- **Problem:** Canvas Settings panel always visible
- **Fix:** Default to collapsed, add toggle

### 5. Rulers Not Full Page
- **Problem:** Only horizontal ruler, missing vertical
- **Fix:** Add vertical ruler, ensure both wrap canvas

### 6. Typography Hierarchy
- **Problem:** Font sizes inconsistent, unreadable
- **Fix:** Establish proper type scale, apply consistently

### 7. Multi-File Tabs
- **Problem:** No way to see multiple files
- **Fix:** Add tab system for open files

---

## Implementation Order

1. **Z-index audit** (30 min) - Fix stacking issues
2. **Top left corner** (15 min) - Fix layout
3. **File menu spacing** (15 min) - Fix bunching
4. **Grid settings** (10 min) - Default collapsed
5. **Rulers** (20 min) - Add vertical ruler
6. **Typography** (30 min) - Fix font sizes
7. **Multi-file tabs** (45 min) - Add tab system

**Total:** ~2.5 hours

---

Starting fixes now...


