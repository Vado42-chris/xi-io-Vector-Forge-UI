# Manual Verification Steps - File Bar Visibility

**From External Observer Analysis**

**Date:** January 27, 2025  
**Priority:** 🔴 P0 - File bar visibility FIRST, nothing else matters

---

## External Observer Verdict

**"File bar visibility FIRST. Nothing else matters."**

**Waste Pattern Identified:**

- Already spent ~50 tool calls on this issue
- Fix is likely 1-2 lines once root cause identified manually

**Strategy:**

- Manual verification FIRST (0 tokens)
- Then surgical fix (1-2 tool calls)

---

## IMMEDIATE ACTION: Manual Verification (0 Tokens)

**Do this NOW before any more tool calls:**

### Console Tab - Run These Exact Commands:

```javascript
// 1. Does the header container exist?
document.querySelector('.xibalba-header');

// 2. If null, try broader search:
document.querySelector('[class*="header"]');
document.querySelector('[class*="file"]');
document.querySelector('[class*="menu"]');

// 3. Check if React root has children:
document.getElementById('root')?.innerHTML.length;

// 4. Check for any hidden elements:
document.querySelectorAll('[style*="display: none"]');
```

### If Element EXISTS - Check Computed Styles:

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

### React DevTools:

1. Open Components tab
2. Search: `ProfessionalFileMenu`
3. Is it in the tree? Does it show props?
4. Check parent for conditional rendering

---

## Diagnosis Decision Tree

**If element exists with `display:none`:**

- → CSS override, find conflicting rule
- **Fix:** 1-2 token calls

**If element exists with `height:0`:**

- → CSS collapse, add min-height
- **Fix:** 1 call

**If element NOT in DOM:**

- → Component not mounting, check import/conditional
- **Fix:** 2-3 calls

**If React shows component but DOM empty:**

- → Render returns null, check logic
- **Fix:** 2-3 calls

---

## Next Steps

1. **Run manual DevTools checks** (0 tokens) - User must do this
2. **Report back exactly what you find** - Share results
3. **I'll give you the surgical 1-2 line fix** - Based on findings
4. **Apply fix** - Minimal tool calls

---

## For User (Chris)

**Please run these commands in your browser console and report back:**

1. Open browser at `http://localhost:3000`
2. Open DevTools (F12)
3. Run the console commands above
4. Check React DevTools
5. Report findings:
   - Does `.xibalba-header` exist?
   - What are computed styles?
   - Is `ProfessionalFileMenu` in React tree?
   - What's the root cause?

**Then I can apply the surgical fix (1-2 tool calls).**

---

**The experiment is live. We're proving distributed AI collaboration works under resource constraints.**
