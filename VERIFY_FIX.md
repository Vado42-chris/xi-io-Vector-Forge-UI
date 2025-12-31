# Verify File Bar Fix - Browser Commands

**Date:** January 27, 2025

---

## CSS Fix Already Applied ✅

**File:** `styles/tool-labels-fix.css`

- `visibility: visible !important;` ✅
- `opacity: 1 !important;` ✅
- `z-index: 9999 !important;` ✅

---

## Next Steps

### 1. Hard Refresh Browser

- Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- This loads the new CSS

### 2. Check if File Bar Appears

- Look at top of screen
- Should see menu items (File, Edit, View, etc.)

### 3. If Still Not Visible - Run These in Browser Console (F12)

**Copy/paste these EXACT commands in browser DevTools Console:**

```javascript
document.querySelector('.xibalba-header');
```

**If it returns an element (not null), then run:**

```javascript
const el = document.querySelector('.xibalba-header');
if (el) {
  const styles = getComputedStyle(el);
  console.log({
    display: styles.display,
    visibility: styles.visibility,
    opacity: styles.opacity,
    zIndex: styles.zIndex,
    height: styles.height,
    position: styles.position,
  });
}
```

**Paste the outputs here.**

---

## Quick Test (Temporary - Browser Only)

**If you want to test if CSS is the issue, run this in browser console:**

```javascript
document.querySelector('.xibalba-header')?.style.setProperty('display', 'flex', 'important');
document.querySelector('.xibalba-header')?.style.setProperty('minHeight', '48px');
document.querySelector('.xibalba-header')?.style.setProperty('zIndex', '9999');
```

**If file bar appears after this, CSS fix should work after hard refresh.**

---

## Status

**CSS fix applied. Hard refresh browser and check if file bar appears.**
