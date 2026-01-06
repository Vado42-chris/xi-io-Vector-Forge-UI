# 🚀 SHIPPABLE PLAN - 3 DAYS TO WORKING PRODUCT

**Date:** January 6, 2025  
**Goal:** Get VectorForge to SHIPPABLE state  
**Timeline:** 3 days (72 hours)

---

## 🔴 CRITICAL BLOCKERS (Must Fix to Ship)

### 1. EXPORT SYSTEM (10% → 90% in 1 day)
**Status:** SVG works, PNG/PDF missing  
**Impact:** Users CAN'T save their work  
**Priority:** P0 - BLOCKER

**What to build:**
- ✅ PNG export (multiple resolutions, DPI)
- ✅ PDF export (vector PDF)
- ✅ Export dialog with options
- ✅ Batch export

**Files to modify:**
- `App.hardened.tsx` (lines 1070-1089 - currently shows "Coming soon")
- Create `services/exportService.ts`

**Time:** 8 hours

---

### 2. DRAWING TOOLS (40% → 80% in 1 day)
**Status:** Basic tools work, but incomplete  
**Impact:** Users can't create professional work  
**Priority:** P0 - BLOCKER

**What to fix:**
- ✅ Pen tool: Add smoothness controls
- ✅ Transform tools: Make rotate/scale actually work
- ✅ Selection: Fix multi-select, group-select
- ✅ Path editing: Make node editor functional

**Files to modify:**
- `components/Canvas.tsx`
- `components/ToolPropertiesPanel.tsx`
- `services/drawingService.ts` (if exists)

**Time:** 8 hours

---

### 3. ANIMATION PLAYBACK (30% → 70% in 1 day)
**Status:** Timeline UI works, but doesn't play  
**Impact:** Core feature doesn't work  
**Priority:** P1 - HIGH VALUE

**What to build:**
- ✅ Keyframe interpolation (linear)
- ✅ Animation playback (actually play)
- ✅ Frame scrubbing
- ✅ Basic export (GIF)

**Files to modify:**
- `components/AnimationTimeline.tsx`
- Create `services/animationService.ts`

**Time:** 8 hours

---

## 📋 DAY-BY-DAY PLAN

### DAY 1: EXPORT SYSTEM (8 hours)
**Goal:** Users can export their work

**Morning (4 hours):**
1. Implement PNG export (2 hours)
   - Use canvas.toDataURL() or html2canvas
   - Add resolution options (1x, 2x, 4x)
   - Add DPI options (72, 150, 300)

2. Create export dialog (2 hours)
   - Format selector (SVG, PNG, PDF)
   - Resolution/DPI options
   - Quality settings

**Afternoon (4 hours):**
3. Implement PDF export (3 hours)
   - Use jsPDF or pdfkit
   - Convert SVG to PDF
   - Add page size options

4. Wire up export menu (1 hour)
   - Replace "Coming soon" messages
   - Connect to export service
   - Test all formats

**Deliverable:** Users can export PNG and PDF

---

### DAY 2: DRAWING TOOLS (8 hours)
**Goal:** Core drawing tools work properly

**Morning (4 hours):**
1. Fix Pen tool (2 hours)
   - Add smoothness slider
   - Fix path preview
   - Make close path work

2. Fix Transform tools (2 hours)
   - Make rotate actually rotate
   - Make scale actually scale
   - Add transform handles

**Afternoon (4 hours):**
3. Fix Selection (2 hours)
   - Multi-select (Shift+click)
   - Group selection (drag box)
   - Fix selection highlighting

4. Fix Path editing (2 hours)
   - Make node editor clickable
   - Add/delete nodes
   - Move nodes

**Deliverable:** All core drawing tools functional

---

### DAY 3: ANIMATION PLAYBACK (8 hours)
**Goal:** Animation actually plays

**Morning (4 hours):**
1. Implement interpolation (3 hours)
   - Linear interpolation between keyframes
   - Property tweening (position, scale, rotation)
   - Frame calculation

2. Create animation service (1 hour)
   - Animation state management
   - Playback controls
   - Frame updates

**Afternoon (4 hours):**
3. Wire up playback (2 hours)
   - Connect play button
   - Update canvas on frame change
   - Handle play/pause/stop

4. Basic GIF export (2 hours)
   - Capture frames
   - Generate GIF
   - Export file

**Deliverable:** Animation plays and exports

---

## ✅ SHIPPABLE CRITERIA

After 3 days, VectorForge is SHIPPABLE if:

1. ✅ Users can export PNG and PDF
2. ✅ Core drawing tools work (pen, shapes, transform)
3. ✅ Animation plays
4. ✅ No critical bugs
5. ✅ Basic documentation

**NOT required for shipping:**
- ❌ Advanced features (pathfinder, boolean ops)
- ❌ All drawing tools (pencil, brush can wait)
- ❌ Perfect UX (tooltips, polish can wait)
- ❌ Full test suite
- ❌ Documentation

---

## 🎯 EXECUTION PLAN

### Start NOW:
1. **Create export service** (`services/exportService.ts`)
2. **Implement PNG export** (replace "Coming soon")
3. **Implement PDF export** (replace "Coming soon")
4. **Test export** (verify files work)

### Then:
5. **Fix pen tool** (add smoothness)
6. **Fix transform tools** (make them work)
7. **Fix selection** (multi-select)

### Finally:
8. **Animation interpolation**
9. **Animation playback**
10. **Basic GIF export**

---

## 📊 SUCCESS METRICS

**Day 1 End:**
- [ ] PNG export works
- [ ] PDF export works
- [ ] Export dialog functional

**Day 2 End:**
- [ ] Pen tool works smoothly
- [ ] Transform tools work
- [ ] Selection works (multi-select)

**Day 3 End:**
- [ ] Animation plays
- [ ] GIF export works
- [ ] No critical bugs

---

## 🚨 IF BEHIND SCHEDULE

**Cut scope:**
- Skip GIF export (animation playback is enough)
- Skip advanced transform (basic rotate/scale is enough)
- Skip path editing (basic paths are enough)

**Minimum shippable:**
- PNG export
- PDF export
- Working pen tool
- Working transform
- Animation playback

---

## 💪 THIS IS THE PLAN

**No more tooltips. No more polish. No more design system expansion.**

**Just:**
1. Export (Day 1)
2. Drawing tools (Day 2)
3. Animation (Day 3)

**Then ship.**

---

## 🎬 START NOW

**First task:** Implement PNG export in `App.hardened.tsx`

**Replace this:**
```typescript
case 'FILE_EXPORT_PNG':
  showToast('PNG export - Coming soon', 'info');
  break;
```

**With working PNG export.**

**Let's go.**

