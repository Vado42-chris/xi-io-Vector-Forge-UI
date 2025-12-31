# Systematic UX Fix Plan - From Bottom Up

## Critical Understanding

**User's Situation:**
- 30 years UX design experience
- Can't save files in Cursor (worktree issue)
- Files scattered across computer from 100s of failed attempts
- Been trying since August 5th
- Reputation on the line
- Understands design process, not the technical process

**My Role:**
- Fix the actual UI problems systematically
- Help with file saving/commit workflow
- Make this product actually usable
- Respect the 30 years of UX expertise

---

## File Saving Issue - IMMEDIATE FIX

**Problem:** This is a git worktree, `.git` is a file pointing to main repo
**Solution:** 
1. Files ARE being saved locally (they're in the worktree)
2. But they're not being committed to git
3. Need to commit changes to preserve them

**Action:**
```bash
# Check what's changed
git status

# Stage all changes
git add .

# Commit with message
git commit -m "Fix: Remove dev buttons, fix CSP, improve Material Icons"

# Push to remote (if needed)
git push
```

---

## UI Problems - Systematic Fix

### Problem 1: Left Sidebar Tools Invisible
**Root Cause:** Tools not rendering or hidden
**Fix:** Check LeftSidebar.tsx rendering logic

### Problem 2: Right Sidebar Broken Layout
**Root Cause:** Grid instead of tabs, broken labels
**Fix:** Fix RightSidebar.tsx tab system

### Problem 3: Material Icons Showing as Text
**Root Cause:** Font not loading
**Fix:** Ensure font loads correctly

### Problem 4: Z-Stack Issues
**Root Cause:** Elements overlapping
**Fix:** Fix z-index hierarchy

### Problem 5: Canvas Too Dark
**Root Cause:** Background color issues
**Fix:** Fix canvas background

---

## Disability Perspective - What Fails

1. **Visual Impairments:**
   - Icons showing as text (can't see icons)
   - Low contrast (can't read text)
   - No clear visual hierarchy (can't navigate)

2. **Motor Impairments:**
   - Buttons too small (can't click)
   - Overlapping elements (can't access)
   - No keyboard navigation (can't use)

3. **Cognitive Impairments:**
   - Unclear labels (can't understand)
   - No visual feedback (can't tell if it worked)
   - Broken layout (can't find things)

---

## Fix Order (Bottom Up)

1. **Foundation:** Fix file saving/commit workflow
2. **Rendering:** Fix components actually rendering
3. **Visibility:** Fix text/icons being visible
4. **Layout:** Fix proper layout structure
5. **Interaction:** Fix buttons/inputs working
6. **Polish:** Fix visual hierarchy and feedback

---

## Next Actions

1. Fix file saving workflow (commit changes)
2. Fix LeftSidebar rendering
3. Fix RightSidebar layout
4. Fix Material Icons font
5. Fix z-index hierarchy
6. Test in browser

