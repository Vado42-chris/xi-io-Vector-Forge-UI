# Surgical Fixes Ready - Waiting for Diagnosis

**Date:** January 27, 2025  
**Status:** ⏳ Ready to apply once diagnosis confirmed

---

## Fix A: CSS Override (If element exists but hidden)

**File:** `styles/file-bar-fix.css` (create new)

**Content:**

```css
.xibalba-header {
  display: flex !important;
  min-height: 48px !important;
  z-index: 9999 !important;
  visibility: visible !important;
  opacity: 1 !important;
}
```

**Link in:** `index.html` (add `<link rel="stylesheet" href="/styles/file-bar-fix.css">`)

**Tool calls:** 2 (create file + link in HTML)

---

## Fix B: Min-Height (If element exists but collapsed)

**File:** `styles/file-bar-fix.css` (create new)

**Content:**

```css
.xibalba-header {
  min-height: 48px !important;
}
```

**Link in:** `index.html`

**Tool calls:** 2 (create file + link in HTML)

---

## Fix C: Conditional Rendering (If element NOT in DOM)

**File:** `App.hardened.tsx`

**Check:** Look for `{showHeader && <ProfessionalFileMenu />}` or similar

**Fix Option 1:** Remove guard (if safe)

```tsx
// Remove: {showHeader && <ProfessionalFileMenu />}
// Replace with: <ProfessionalFileMenu />
```

**Fix Option 2:** Ensure default true

```tsx
const [showHeader, setShowHeader] = useState<boolean>(true);
```

**Tool calls:** 1-2 (depending on fix)

---

## Fix D: Early Guard in Component (If React shows but DOM empty)

**File:** `components/ProfessionalFileMenu.tsx`

**Check:** Look for early `return null;` or `if (!enabled) return null;`

**Fix:** Adjust guard or set default

```tsx
// Change: if (!props.enabled) return null;
// To: const enabled = props.enabled ?? true; if (!enabled) return null;
```

**Tool calls:** 1-2 (depending on fix)

---

## Verification Steps (After Fix)

1. **Hard refresh browser** (Ctrl+Shift+R)
2. **Check Console:** No errors
3. **Check Elements:** `.xibalba-header` visible
4. **Visual check:** File bar visible at top
5. **Click test:** Menu buttons clickable

---

## Status

**Ready to apply fix once diagnosis confirmed.**

**Waiting for DevTools outputs to match to scenario.**
