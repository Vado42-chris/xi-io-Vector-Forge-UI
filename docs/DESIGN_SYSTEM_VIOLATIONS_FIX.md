# Design System Violations - Comprehensive Fix
**Date:** January 27, 2025  
**Status:** 🔴 **CRITICAL - IN PROGRESS**

---

## The Problem

The entire UI violates fundamental Xibalba design system principles:

1. **Borders everywhere** - Using `border-white/10`, `border-white/5`, etc.
   - **Xibalba Rule:** "Borders restrain - we use subtle background color differences instead"
   - **Fix:** Remove all borders, use background color variations

2. **White/light colors** - Using `rgba(255, 255, 255, ...)` throughout
   - **Xibalba Rule:** Dark grey on grey theme only
   - **Fix:** Replace with `var(--xibalba-grey-*)` colors

3. **Selected states use borders** - `border-[var(--xibalba-accent)]`
   - **Xibalba Rule:** "Selected states are typically background colors not borders"
   - **Fix:** Use `bg-[var(--xibalba-bg-hover)]` with subtle orange tint

4. **Light greys** - Using light greys when should be dark
   - **Xibalba Rule:** Dark grey on grey with orange accent only
   - **Fix:** Use dark greys from palette

---

## Fix Strategy

### Phase 1: Core Design System (IN PROGRESS)
- ✅ Created `xibalba-no-borders.css` - Global border removal policy
- ✅ Fixed LeftSidebar - Removed borders, fixed selected states
- ✅ Fixed RightSidebar - Removed borders
- ✅ Fixed ProfessionalFileMenu - Removed borders, replaced white dividers
- ✅ Updated adobe-level-polish.css - Removed border variables

### Phase 2: Component-by-Component Fix (PENDING)
Need to fix ALL components:
- All panels, dialogs, modals
- All buttons, inputs, tabs
- All dividers and separators
- All selected/hover states

### Phase 3: CSS Files Cleanup (PENDING)
- Remove all `border-white/*` from CSS files
- Replace with background color variations
- Fix all selected states

---

## Files Modified So Far

1. `styles/xibalba-no-borders.css` - NEW - Design system enforcement
2. `index.html` - Added xibalba-no-borders.css
3. `components/LeftSidebar.tsx` - Removed borders, fixed selected states
4. `components/RightSidebar.tsx` - Removed borders
5. `components/ProfessionalFileMenu.tsx` - Removed borders, fixed dividers
6. `styles/adobe-level-polish.css` - Removed border variables

---

## Remaining Work

### Critical Components (50+ files)
- All modal/dialog components
- All panel components
- All form components
- All button components
- All tab components

### CSS Files (10+ files)
- `styles/xibalba-design-language.css` - Remove borders
- `styles/xibalba-theme.css` - Remove borders, fix colors
- `styles/dockable-panel.css` - Remove borders
- All other style files

---

## Design System Rules (Xibalba Bible)

1. **NO BORDERS** - Use background color differences
2. **NO WHITE COLORS** - Dark grey on grey only
3. **SELECTED = BACKGROUND** - Not borders
4. **ORANGE ACCENT ONLY** - #ff9800, as background tint, not border
5. **SUBTLE SEPARATION** - Use opacity/background differences

---

## Next Steps

1. Continue component-by-component fixes
2. Update all CSS files
3. Verify no borders remain
4. Verify no white colors remain
5. Verify selected states use backgrounds
6. Test in browser

---

**Priority:** 🔴 **CRITICAL - BLOCKING ALL UI RENDERING**

