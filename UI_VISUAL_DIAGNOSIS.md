# UI Visual Diagnosis & Fix Plan

## 🔴 CRITICAL ISSUES FOUND

### Issue 1: Missing CSS Files (404 Errors)
**Problem:** `index.html` references CSS files that don't exist:
- `/styles/professional-toolbar.css` - MISSING
- `/styles/devchat-fixes.css` - MISSING

**Impact:** Browser console shows 404 errors, styles not loading
**Status:** ✅ FIXED - Created empty placeholder files

### Issue 2: CSS Layout Conflict
**Problem:** `canvas-area.css` uses `position: absolute` with calculated positions, but `App.hardened.tsx` uses flexbox layout.

**Conflicting CSS:**
```css
/* canvas-area.css */
.xibalba-canvas-area {
  position: absolute;
  top: 48px;
  left: var(--sidebar-left-width, 320px);
  right: var(--sidebar-right-width, 360px);
  /* ... */
}
```

**Current Layout (App.hardened.tsx):**
```tsx
<div className="flex-1 flex flex-row">
  {/* Left Sidebar - flex item */}
  <div className="flex-1 flex flex-col">
    {/* Canvas - flex item */}
  </div>
  {/* Right Sidebar - flex item */}
</div>
```

**Impact:** CSS absolute positioning overrides flexbox, causing layout to break
**Status:** ❌ NEEDS FIX

### Issue 3: CSS Variables Not Set
**Problem:** Layout variables depend on data attributes, but may not be set correctly:
- `--sidebar-left-width` depends on `data-sidebar-left-visible`
- `--sidebar-right-width` depends on `data-sidebar-right-visible`

**Impact:** Sidebars may not position correctly
**Status:** ⚠️ NEEDS VERIFICATION

---

## 🎯 FIX PLAN (Priority Order)

### Priority 1: Fix CSS Layout Conflict (CRITICAL)
**Action:** Update `canvas-area.css` to work with flexbox layout instead of absolute positioning.

**Fix:**
1. Remove absolute positioning from `.xibalba-canvas-area`
2. Use flexbox classes that match App.hardened.tsx structure
3. Ensure canvas container uses `flex-1` to take remaining space

### Priority 2: Verify CSS Variables
**Action:** Ensure data attributes are set correctly on root element.

**Check:**
- `data-sidebar-left-visible` is set on root div
- `data-sidebar-right-visible` is set on root div
- CSS variables are being applied

### Priority 3: Verify Sidebar Positioning
**Action:** Check if sidebars are using correct positioning (relative vs fixed).

**Check:**
- LeftSidebar.tsx positioning
- RightSidebar.tsx positioning
- Ensure they work with flexbox layout

### Priority 4: Test Visual Layout
**Action:** After fixes, verify:
1. Header at top (48px)
2. Sidebars on left/right
3. Canvas in center
4. No overlapping elements
5. Proper spacing

---

## 🔧 IMMEDIATE FIXES NEEDED

### Fix 1: Update canvas-area.css
Change from absolute to flexbox-compatible styles.

### Fix 2: Verify App.hardened.tsx layout structure
Ensure flexbox classes match CSS expectations.

### Fix 3: Check for other CSS conflicts
Search for other absolute/fixed positioning that conflicts with flexbox.

---

## 📋 STATUS

- ✅ Missing CSS files: FIXED
- ❌ CSS layout conflict: NEEDS FIX
- ⚠️ CSS variables: NEEDS VERIFICATION
- ⚠️ Sidebar positioning: NEEDS VERIFICATION

**Next Step:** Fix canvas-area.css to work with flexbox layout.

