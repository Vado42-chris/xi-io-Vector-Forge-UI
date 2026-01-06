# 🧪 VectorForge Testing Instructions
**Product Lead: Testing Phase**  
**Date:** January 6, 2025

---

## 🚀 Quick Start

**1. Start Dev Server:**
```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
npm run dev
```

**2. Open Browser:**
- Navigate to: `http://localhost:3000`
- Wait for page to fully load (3-5 seconds)

---

## ✅ Test Checklist

### Test 1: Canvas Visibility
- [ ] Open http://localhost:3000
- [ ] Look at center area
- [ ] **Question:** Do you see the canvas with a grid pattern?
- [ ] **Answer:** `Canvas: [Yes/No]`

**If No:**
- Open DevTools (F12 → Console)
- Run: `!!document.querySelector('svg')`
- Check for red error messages
- Paste console output

### Test 2: Save Button
- [ ] Find "💾 Save" button in toolbar
- [ ] Click the button
- [ ] **Question:** Does it show "✅ Project saved" alert?
- [ ] **Answer:** `Save: [Yes/No]`

**If No:**
- Check browser console for errors
- Run: `localStorage.getItem('vectorforge:project')`
- Paste console output

### Test 3: Load Button
- [ ] Find "📂 Load" button in toolbar
- [ ] Click the button
- [ ] **Question:** Does it show "✅ Project loaded" alert?
- [ ] **Answer:** `Load: [Yes/No]`

**If No:**
- Check if you saved first (Save must work before Load)
- Check browser console for errors
- Paste console output

### Test 4: Export Button
- [ ] Find "📥 Export SVG" button in toolbar
- [ ] Click the button
- [ ] **Question:** Does it download an SVG file?
- [ ] **Answer:** `Export: [Yes/No]`

**If No:**
- Check browser console for errors
- Run: `!!document.querySelector('svg')`
- Check Downloads folder
- Paste console output

---

## 📋 Report Format

**Paste this exactly:**
```
Canvas: [Yes/No]
Save: [Yes/No]
Load: [Yes/No]
Export: [Yes/No]
```

**If any answer is "No", also paste:**
1. Browser console errors (F12 → Console, copy all red text)
2. Output of: `!!document.querySelector('svg')` (run in console)
3. Output of: `localStorage.getItem('vectorforge:project')` (run in console)

---

## 🔍 Diagnostic Commands

**If canvas is black:**
```javascript
// Run in browser console:
!!document.querySelector('svg')
```

**If save/load fails:**
```javascript
// Run in browser console:
localStorage.getItem('vectorforge:project')
```

**If export fails:**
```javascript
// Run in browser console:
document.querySelector('.canvas-svg-content svg') || document.querySelector('svg')
```

**Check for overlays:**
```javascript
// Run in browser console:
Array.from(document.querySelectorAll('*'))
  .filter(el => {
    const s = getComputedStyle(el);
    return s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0;
  })
  .slice(0, 50)
  .map(el => ({ tag: el.tagName, id: el.id, classes: el.className }))
```

---

## 🎯 Next Steps Based on Results

**If all Yes:**
- ✅ Hotfix verified
- ✅ Proceed to Phase 2 (root cause analysis)
- ✅ Start P1 tech debt reduction

**If any No:**
- 🔧 Tech Lead coordinates fix
- 🔧 Agent assigned based on issue
- 🔧 Retest after fix

---

**Status:** 🟢 Ready to test  
**Action:** Run dev server, test in browser, report results

