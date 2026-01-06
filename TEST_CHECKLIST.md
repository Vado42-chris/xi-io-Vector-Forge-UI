# 🧪 TEST CHECKLIST - RUN THESE NOW

## 1. Start Dev Server
```bash
npm run dev
```

## 2. Open Browser
http://localhost:3000

## 3. Test Canvas Visibility
**Question:** Is the canvas visible?
- [ ] YES - I see grid pattern (#1a1a1a background)
- [ ] NO - Still black screen

**If NO, run in browser console:**
```javascript
// Check for SVG
!!document.querySelector('svg')

// Check for hidden elements
Array.from(document.querySelectorAll('*'))
  .filter(el => {
    const s = getComputedStyle(el);
    return s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0;
  })
  .slice(0, 10)
  .map(el => ({ tag: el.tagName, id: el.id, classes: el.className }))
```

## 4. Test Save Button
**Question:** Does Save work?
- [ ] YES - Shows "Project saved locally"
- [ ] NO - Error or nothing happens

**If NO, check localStorage:**
```javascript
localStorage.getItem('vectorforge:lastProject')
```

## 5. Test Load Button
**Question:** Does Load work?
- [ ] YES - Restores my work
- [ ] NO - Error or nothing happens

## 6. Test Export Button
**Question:** Does Export work?
- [ ] YES - Downloads SVG file
- [ ] NO - Error or nothing happens

**If NO, check for SVG:**
```javascript
document.querySelector('svg')
```

## 7. Test Rectangle Tool
**Question:** Does rectangle tool draw?
- [ ] YES - Creates rectangle shape
- [ ] NO - Nothing happens

---

## REPORT BACK

Paste ONE of these:

**If everything works:**
"all green (canvas visible, save/load/export work)"

**If something fails:**
"Canvas: [visible/black], Save: [works/fails], Export: [works/fails], Tools: [work/don't work]"

**If errors:**
Paste browser console errors and terminal output

