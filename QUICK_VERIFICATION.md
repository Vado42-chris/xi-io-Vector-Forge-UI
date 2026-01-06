# ⚡ Quick Verification Guide
**VectorForge - Current State Check**  
**Time:** 10 minutes  
**Purpose:** Know exactly what's working before we fix/build

---

## 🎯 Step 1: Start Dev Server

```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
npm run dev
```

**Wait for:** `VITE ready in XXX ms`  
**Then open:** http://localhost:3000

---

## 🎯 Step 2: Visual Check (30 seconds)

**Look at the screen and answer:**

```
Canvas: [Yes/No]
Save:   [Yes/No]  
Load:   [Yes/No]
Export: [Yes/No]
```

**What to look for:**
- **Canvas:** Large dark area in center with grid lines (or empty white area)
- **Save:** Green "💾 Save" button in header
- **Load:** Blue "📂 Load" button in header
- **Export:** Orange "📥 Export SVG" button in header

---

## 🎯 Step 3: Console Check (If Canvas = No)

**Open DevTools (F12) → Console tab**

**Run these commands one by one:**

```javascript
// Check 1: Is SVG element present?
!!document.querySelector('svg')
// Expected: true or false

// Check 2: Is canvas container present?
!!document.querySelector('[data-canvas-area="true"]')
// Expected: true

// Check 3: Is center stack present?
!!document.querySelector('[data-center-stack="true"]')
// Expected: true

// Check 4: Get center stack dimensions
const centerStack = document.querySelector('[data-center-stack="true"]');
if (centerStack) {
  const rect = centerStack.getBoundingClientRect();
  console.log('Center Stack:', {
    width: rect.width + 'px',
    height: rect.height + 'px',
    visible: rect.width > 0 && rect.height > 0,
    top: rect.top + 'px',
    left: rect.left + 'px'
  });
}

// Check 5: Get canvas area dimensions
const canvasArea = document.querySelector('[data-canvas-area="true"]');
if (canvasArea) {
  const rect = canvasArea.getBoundingClientRect();
  const styles = getComputedStyle(canvasArea);
  console.log('Canvas Area:', {
    width: rect.width + 'px',
    height: rect.height + 'px',
    visible: rect.width > 0 && rect.height > 0,
    display: styles.display,
    visibility: styles.visibility,
    opacity: styles.opacity,
    zIndex: styles.zIndex
  });
}

// Check 6: Check for Canvas component
const canvasViewport = document.querySelector('.canvas-viewport, .canvas-container');
if (canvasViewport) {
  const rect = canvasViewport.getBoundingClientRect();
  console.log('Canvas Viewport:', {
    width: rect.width + 'px',
    height: rect.height + 'px',
    visible: rect.width > 0 && rect.height > 0
  });
} else {
  console.log('Canvas Viewport: NOT FOUND');
}
```

**Copy all console output** and paste here.

---

## 🎯 Step 4: Test Buttons (If Visible)

**Test Save Button:**
1. Click "💾 Save"
2. Should see alert: "✅ Project saved"
3. **Result:** [Works/Doesn't Work]

**Test Load Button:**
1. Click "📂 Load"
2. Should see alert: "✅ Project loaded" or "No saved project found"
3. **Result:** [Works/Doesn't Work]

**Test Export Button:**
1. Click "📥 Export SVG"
2. Should download file: `vectorforge-export.svg`
3. **Result:** [Works/Doesn't Work]

---

## 🎯 Step 5: Paste Results Here

**Format:**
```
Canvas: [Yes/No]
Save: [Yes/No]
Load: [Yes/No]
Export: [Yes/No]

Console output:
[paste here]

Button test results:
Save: [Works/Doesn't Work]
Load: [Works/Doesn't Work]
Export: [Works/Doesn't Work]
```

---

## 🎯 What Happens Next

**If Canvas = Yes:**
- ✅ Move to Phase 1 (build to wireframe spec)
- ✅ Start with timeline depth
- ✅ Add stage boundaries
- ✅ Build Library panel

**If Canvas = No:**
- ✅ I generate exact fix based on console output
- ✅ Apply fix (2-4 hours)
- ✅ Retest
- ✅ Then move to Phase 1

**If Partial:**
- ✅ I diagnose specific issue
- ✅ Generate targeted fix
- ✅ Test again
- ✅ Then move to Phase 1

---

**Time:** 10 minutes  
**Risk:** Zero  
**Value:** Complete clarity on current state

**Run this now. Paste results. I'll respond immediately.**

