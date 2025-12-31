# Panel-by-Panel Critical Fixes - Making UI Actually Usable

## From Screenshot Analysis

### Panel 1: Top Bar (Header/File Menu)
**FAILURES:**
1. **"Diagnostics" button visible** - Should be removed
2. **"Dev Chat" button visible in top right** - Should be removed  
3. **File menu may not be visible/clickable** - Z-index issue

**FIXES NEEDED:**
- Remove Diagnostics button (CSS already hides it, but may be rendered)
- Remove Dev Chat button (CSS already hides it, but may be rendered)
- Ensure File menu has highest z-index (above everything)
- Ensure File menu buttons are clickable

---

### Panel 2: Left Sidebar (Tools)
**FAILURES:**
1. **Tool labels truncated** - "SelectionV", "SelectV", "TextT", "PenP"
2. **"open_in_new" highlighted** - Unclear what this is
3. **Labels concatenated** - "SelectionV" = "Selection" + "V" (shortcut)

**FIXES NEEDED:**
- Fix tool label CSS to prevent truncation
- Show full labels: "Select (V)", not "SelectionV"
- Separate label and shortcut visually
- Remove or fix "open_in_new" element

---

### Panel 3: Canvas Area
**FAILURES:**
1. **Grid may be too faint** - Hard to see
2. **No clear workspace boundaries** - Canvas blends with UI

**FIXES NEEDED:**
- Increase grid contrast
- Add clear canvas border
- Ensure canvas is clearly defined

---

### Panel 4: Right Sidebar (Dev Chat)
**FAILURES:**
1. **Chat input may be hidden** - Container height issues
2. **Material Icons showing as text** - Font not loading

**FIXES NEEDED:**
- Ensure input is visible and accessible
- Fix Material Icons font loading
- Ensure chat is usable

---

### Panel 5: Bottom Command Bar (Footer/Timeline)
**FAILURES:**
1. **"keyboard arrow_down" text visible** - Material Icon not loading
2. **Suggestions truncated** - "Animation Ti", "Frame 0/30"
3. **Unclear purpose** - What is this bar for?

**FIXES NEEDED:**
- Fix Material Icons in timeline/input
- Fix suggestion text truncation
- Add clear labels/purpose
- Ensure input is usable

---

## Critical Z-Stack Issues

**File Menu MUST be above everything:**
- Current: `z-index: var(--z-menu, 400)`
- Need: Ensure it's above sidebars (100), canvas (10), everything

**Sidebars MUST be above canvas:**
- Current: `z-index: var(--z-sidebar-left/right, 100)`
- Canvas: `z-index: var(--z-canvas, 10)`
- This should work, but verify

**Dropdowns MUST be above sidebars:**
- Current: `z-index: var(--z-dropdown, 500)`
- This should work

---

## Biggest User Frustrations

1. **"I can't see the File menu"** - Z-index or visibility issue
2. **"I can't click on tools"** - Labels broken, unclear
3. **"Icons showing as text"** - Material Icons not loading
4. **"I don't understand what things do"** - Truncated labels, unclear purpose
5. **"I can't save my work"** - Can't access File menu

---

## Immediate Fixes

1. **File Menu Visibility** - Ensure it's visible and clickable
2. **Tool Labels** - Fix truncation, show full labels
3. **Material Icons** - Fix font loading
4. **Remove Dev Buttons** - Ensure they're completely gone
5. **Fix Z-Stack** - Ensure proper layering

