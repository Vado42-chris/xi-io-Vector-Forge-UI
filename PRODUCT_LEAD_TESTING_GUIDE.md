# 🧪 Product Lead: Testing Guide
**VectorForge Hotfix Verification**  
**Date:** January 6, 2025

---

## 🎯 Mission

**Verify the hotfix works before proceeding with shipping plan.**

---

## ✅ Pre-Flight Checklist

**Files Verified:**
- [x] `styles/emergency-canvas-fix.css` - Emergency canvas visibility
- [x] `components/SaveLoadButtons.tsx` - Save/Load UI
- [x] `components/ExportButton.tsx` - Export UI
- [x] `utils/projectStorage.ts` - Save/Load functions
- [x] `utils/exportSvg.ts` - Export functions
- [x] `App.hardened.tsx` - Buttons integrated
- [x] `index.tsx` - CSS imported
- [x] Build successful

---

## 🚀 Test Execution

### Step 1: Start Dev Server

**Command:**
```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**If server fails to start:**
- Check for port conflicts: `lsof -i :3000`
- Check for errors in terminal output
- Report error to Tech Lead

---

### Step 2: Open Browser

**URL:** http://localhost:3000

**Expected:**
- Page loads without errors
- No blank screen
- UI elements visible

**If page doesn't load:**
- Check browser console (F12)
- Check terminal for errors
- Report to Tech Lead

---

### Step 3: Test Canvas Visibility

**Action:** Look at the center of the screen

**Expected:**
- Canvas area visible
- Grid pattern visible (if enabled)
- Background color: #1a1a1a (dark gray)
- No black overlay

**If canvas is black/hidden:**
- Open browser console (F12)
- Run: `!!document.querySelector('svg')`
- Run overlay probe (see below)
- Report result to Tech Lead

**Report:** `Canvas: Yes` or `Canvas: No`

---

### Step 4: Test Save Button

**Action:**
1. Draw something on canvas (or just click around)
2. Click "💾 Save" button (should be in header/toolbar)

**Expected:**
- Alert shows: "✅ Project saved"
- No console errors
- localStorage updated

**Verify in Console:**
```javascript
localStorage.getItem('vectorforge:project')
```
Should return JSON string (not null)

**If Save fails:**
- Check browser console for errors
- Check if button is visible/clickable
- Report error to Tech Lead

**Report:** `Save: Yes` or `Save: No`

---

### Step 5: Test Load Button

**Action:**
1. Clear canvas (refresh page or draw something different)
2. Click "📂 Load" button

**Expected:**
- Alert shows: "✅ Project loaded"
- Canvas restores previous state
- No console errors

**If Load fails:**
- Check if Save worked first
- Check browser console for errors
- Check localStorage has data
- Report error to Tech Lead

**Report:** `Load: Yes` or `Load: No`

---

### Step 6: Test Export Button

**Action:**
1. Draw something on canvas
2. Click "📥 Export SVG" button

**Expected:**
- Alert shows: "✅ SVG exported"
- File downloads: `vectorforge-export.svg`
- File opens in external editor (Inkscape/Illustrator)

**Verify:**
- Check Downloads folder for SVG file
- Open file in text editor - should see SVG XML
- Open file in Inkscape/Illustrator - should render correctly

**If Export fails:**
- Check browser console for errors
- Check if SVG element exists: `!!document.querySelector('svg')`
- Report error to Tech Lead

**Report:** `Export: Yes` or `Export: No`

---

## 📋 Report Format

**Paste this exact format:**

```
Canvas: [Yes/No]
Save: [Yes/No]
Load: [Yes/No]
Export: [Yes/No]
```

**If any "No", also paste:**
1. Browser console errors (F12 → Console, copy all red text)
2. Output of: `!!document.querySelector('svg')` (true/false)
3. Output of: `localStorage.getItem('vectorforge:project')` (should show JSON or null)

---

## 🔍 Debugging Probes

### If Canvas is Black

**Run in browser console:**
```javascript
// Check for SVG
!!document.querySelector('svg')

// Check for hidden overlays
Array.from(document.querySelectorAll('*'))
  .filter(el => {
    const s = getComputedStyle(el);
    return s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0;
  })
  .slice(0, 10)
  .map(el => ({ tag: el.tagName, id: el.id, classes: el.className }))
```

**Paste results to Tech Lead**

### If Save/Load Fails

**Run in browser console:**
```javascript
// Check localStorage
localStorage.getItem('vectorforge:project')

// Check if functions exist
typeof saveProject
typeof loadProject
```

**Paste results to Tech Lead**

### If Export Fails

**Run in browser console:**
```javascript
// Check for SVG element
document.querySelector('svg')

// Check SVG content
document.querySelector('svg')?.outerHTML.slice(0, 200)
```

**Paste results to Tech Lead**

---

## ✅ Success Criteria

**All tests pass when:**
- Canvas is visible
- Save button saves to localStorage
- Load button restores state
- Export button downloads SVG file

**If all pass:**
- ✅ Hotfix verified
- ✅ Ready for Day 1 (root cause fixes)
- ✅ Can merge to main

**If any fail:**
- 🚨 Tech Lead will coordinate fixes
- 🚨 Agents will provide patches
- 🚨 Retest after fixes

---

## 📞 Next Steps

**After reporting results:**

1. **If all Yes:**
   - Tech Lead: Merge hotfix, start Day 1 plan
   - Agents: Begin root cause analysis

2. **If any No:**
   - Tech Lead: Diagnose with agents
   - Agents: Provide exact fixes
   - Retest

---

**Last Updated:** 2025-01-06  
**Status:** Ready for Testing  
**Product Lead:** Awaiting test results

