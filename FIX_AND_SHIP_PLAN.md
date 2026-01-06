# FIX AND SHIP - 5 DAY PLAN
**Goal:** Make VectorForge shippable in 5 days

## STATUS CHECK

### ✅ WHAT WORKS:
1. **Export SVG** - ✅ IMPLEMENTED (App.hardened.tsx:985-1015)
2. **Save/Load** - ✅ IMPLEMENTED (App.hardened.tsx:884-982)
   - Save: localStorage + file download
   - Load: File picker + JSON parse
3. **Drawing Tools** - ⚠️ PARTIAL
   - Canvas handles mouse events
   - Creates PATH layers only
   - Missing: Rectangle/Ellipse shape creation

### ❌ WHAT NEEDS FIXING:

**Priority 1: Fix Rectangle/Ellipse Tools (4 hours)**
- Current: Tools handle mouse events but create generic paths
- Fix: Create proper rectangle/ellipse shapes on drag
- Impact: Users can actually draw shapes

**Priority 2: Verify Canvas Visibility (1 hour)**
- Current: CSS exists, may need verification
- Fix: Ensure canvas background is visible
- Impact: Users can see what they're drawing

**Priority 3: Test End-to-End (2 hours)**
- Draw rectangle → Save → Load → Export
- Verify everything works
- Impact: Confirms shippable state

---

## DAY-BY-DAY PLAN

### DAY 1: Fix Drawing Tools
**Goal:** Rectangle and Ellipse tools create proper shapes

**Tasks:**
1. Fix rectangle tool to create rectangle shapes (2 hours)
2. Fix ellipse tool to create ellipse shapes (2 hours)
3. Test drawing works (30 min)

### DAY 2: Verify & Fix Canvas
**Goal:** Canvas is visible and functional

**Tasks:**
1. Verify canvas visibility (30 min)
2. Fix any CSS issues (1 hour)
3. Test all tools work (30 min)

### DAY 3: Test Save/Load/Export
**Goal:** Complete workflow works

**Tasks:**
1. Test save → load cycle (1 hour)
2. Test export SVG (30 min)
3. Fix any bugs found (2 hours)

### DAY 4: Polish & Test
**Goal:** Everything works smoothly

**Tasks:**
1. Fix any remaining bugs (2 hours)
2. Test on different browsers (1 hour)
3. Add error handling (1 hour)

### DAY 5: SHIP
**Goal:** Deploy and get first customer

**Tasks:**
1. Final testing (1 hour)
2. Deploy to production (1 hour)
3. Create landing page (2 hours)
4. Launch (1 hour)

---

## IMMEDIATE ACTION (TODAY)

**Fix Rectangle Tool NOW:**

The issue: Canvas.tsx creates PATH layers for all tools. Need to create RECTANGLE/ELLIPSE shapes.

**Fix:**
1. Update Canvas.tsx to detect tool type
2. Create proper shape on drag end
3. Test it works

**I'll do this now. Say "Fix tools now" and I'll start.**

