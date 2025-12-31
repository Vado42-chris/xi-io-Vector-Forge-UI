# Math & Coordinate System Inventory
**Date:** January 27, 2025  
**Status:** 🔍 **AUDIT IN PROGRESS**

---

## Purpose

Audit existing math implementations, coordinate systems, and transform code to determine:
1. What valuable work already exists
2. What will make development easier
3. What will improve product performance
4. Best strategic play (adapt vs. rebuild)

---

## Current State Analysis

### ✅ What We Have (Existing Implementations)

#### 1. Coordinate Conversion (DraftsmanCanvas.tsx)
**Location:** `components/DraftsmanCanvas.tsx`

**Functions Found:**
- `getCanvasCoords()` - Screen to canvas coordinate conversion
- `snapValue()` - Grid snapping
- `snapToGuide()` - Guide snapping

**Implementation:**
```typescript
// getCanvasCoords - converts screen coordinates to canvas coordinates
const getCanvasCoords = useCallback((screenX: number, screenY: number) => {
  const rect = canvasRef.current?.getBoundingClientRect();
  if (!rect) return { x: 0, y: 0 };
  
  const x = (screenX - rect.left - pan.x) / zoomScale;
  const y = (screenY - rect.top - pan.y) / zoomScale;
  return { x, y };
}, [pan, zoomScale]);
```

**Assessment:**
- ✅ Basic coordinate conversion exists
- ⚠️ Ad-hoc implementation (not centralized)
- ⚠️ No explicit coordinate frames (WORLD, VIEWPORT, etc.)
- ⚠️ No inverse transforms (canvas → screen)

---

#### 2. Snapping System (DraftsmanCanvas.tsx)
**Location:** `components/DraftsmanCanvas.tsx`

**Functions:**
- `snapValue()` - Grid snapping with threshold
- `snapToGuide()` - Guide snapping with threshold

**Implementation:**
```typescript
const snapValue = useCallback((value: number) => {
  if (!snapToGrid) return value;
  return Math.round(value / gridSize) * gridSize;
}, [snapToGrid, gridSize]);

const snapToGuide = useCallback((value: number, axis: 'x' | 'y') => {
  if (!snapToGuides) return value;
  const relevantGuides = guides.filter(g => 
    axis === 'x' ? g.type === 'v' : g.type === 'h'
  );
  const threshold = 5;
  for (const guide of relevantGuides) {
    if (Math.abs(value - guide.position) < threshold) {
      return guide.position;
    }
  }
  return value;
}, [snapToGuides, guides]);
```

**Assessment:**
- ✅ Basic snapping works
- ⚠️ No priority system (grid vs. guide vs. geometry)
- ⚠️ No spatial indexing (linear search through guides)
- ⚠️ Fixed threshold (not configurable per operation)

---

#### 3. Transform System (TransformHandles.tsx)
**Location:** `components/TransformHandles.tsx`

**What Exists:**
- Transform handles for resize/rotate
- Bounding box calculations
- Position tracking

**Implementation Pattern:**
```typescript
// Uses direct x, y properties
const bbox = { x, y, width, height };
// Transform via direct manipulation
```

**Assessment:**
- ✅ Visual transform handles work
- ⚠️ No canonical transform representation (Matrix3/Matrix4)
- ⚠️ Direct property manipulation (not composable)
- ⚠️ No transform composition/inversion

---

#### 4. Pan & Zoom (DraftsmanCanvas.tsx)
**Location:** `components/DraftsmanCanvas.tsx`

**State:**
- `pan: { x: number, y: number }`
- `zoom: number` (percentage)

**Usage:**
- Applied via CSS transforms or direct coordinate math
- Used in `getCanvasCoords()` conversion

**Assessment:**
- ✅ Basic pan/zoom works
- ⚠️ Not using homogeneous coordinates (3x3 matrix)
- ⚠️ Zoom as percentage (not scale factor)
- ⚠️ No transform composition with other transforms

---

#### 5. CSS Transform Usage
**Pattern Found:**
- Direct `style.setProperty()` for CSS custom properties
- CSS transforms for positioning
- Z-index for layering

**Assessment:**
- ✅ Works for rendering
- ⚠️ Not canonical (can't compose, invert, or query)
- ⚠️ Separated from logical transforms

---

### ❌ What We DON'T Have (Missing)

1. **No Centralized Math Library**
   - No `Vector2`, `Vector3`, `Matrix3`, `Matrix4` classes
   - No `Transform` type with composition

2. **No Coordinate Frame System**
   - No explicit WORLD, VIEWPORT, CANVAS, DEVICE frames
   - No frame conversion helpers

3. **No Spatial Indexing**
   - No quadtree or R-tree for hit testing
   - Linear search for snapping/selection

4. **No High-Level Vector Ops**
   - No curve proximity calculations
   - No path length calculations
   - No boolean operations

5. **No Precision Management**
   - No Float64/Float32 distinction
   - No epsilon constants
   - No precision-aware operations

6. **No Transform Composition**
   - Can't compose multiple transforms
   - Can't invert transforms
   - Can't decompose transforms

---

## Value Assessment

### ✅ High Value (Keep & Extend)

1. **Coordinate Conversion (`getCanvasCoords`)**
   - **Value:** Core functionality, works
   - **Action:** Extend to support frame system, add inverse

2. **Snapping System (`snapValue`, `snapToGuide`)**
   - **Value:** User-facing feature, works
   - **Action:** Add priority system, spatial indexing, geometry snapping

3. **Pan/Zoom State Management**
   - **Value:** Core interaction, works
   - **Action:** Migrate to Matrix3-based transforms

---

### ⚠️ Medium Value (Refactor)

1. **Transform Handles**
   - **Value:** Visual feedback works
   - **Action:** Migrate to canonical transform representation

2. **CSS Transform Usage**
   - **Value:** Rendering works
   - **Action:** Separate logical transforms from rendering

---

### ❌ Low Value (Replace)

1. **Ad-hoc Math Scattered in Components**
   - **Value:** Works but not reusable
   - **Action:** Centralize in math library

---

## Strategic Recommendations

### Option A: Build `ourmaths` Library (Recommended)

**Why:**
- Existing code works but is ad-hoc
- Need centralized, composable math
- Need coordinate frame system
- Need spatial indexing for performance

**Approach:**
1. Build thin wrapper around standard primitives
2. Keep existing coordinate conversion (extend it)
3. Keep existing snapping (enhance it)
4. Add missing pieces (spatial indexing, transform composition)

**Time:** 12-28 hours (2-4 days)

**Benefits:**
- Product-specific ergonomics
- Performance improvements (spatial indexing)
- Correctness (coordinate frames, precision)
- Interoperability (standard primitives)

---

### Option B: Use Existing Library (Three.js, gl-matrix)

**Why:**
- Proven, battle-tested
- GPU-optimized
- Well-documented

**Drawbacks:**
- Not tailored to VectorForge semantics
- Coordinate frame system still needed
- Snapping/vector ops still need custom code

**Time:** 8-16 hours (1-2 days) + ongoing adaptation

---

### Option C: Hybrid (Recommended)

**Approach:**
1. Use standard primitives (gl-matrix or similar) for core math
2. Build `ourmaths` wrapper for VectorForge-specific semantics:
   - Coordinate frames
   - Snapping pipeline
   - Vector-friendly ops
   - Spatial indexing

**Time:** 16-24 hours (2-3 days)

**Benefits:**
- Best of both worlds
- Interoperability + product-specific ergonomics
- Performance + correctness

---

## Best Play: Hybrid Approach

### Phase 1: Audit & Design (2-4 hours)
- ✅ This document (inventory)
- Design `ourmaths` API
- Choose base library (gl-matrix or custom)

### Phase 2: Build Core (4-8 hours)
- Implement `Vector2`, `Vector3`, `Matrix3`, `Matrix4`
- Implement coordinate frame system
- Implement transform composition

### Phase 3: Enhance Existing (4-8 hours)
- Extend `getCanvasCoords()` with frame system
- Enhance snapping with priority + spatial index
- Migrate pan/zoom to Matrix3

### Phase 4: Add Missing (4-8 hours)
- Spatial indexing (quadtree)
- High-level vector ops (curve proximity, path length)
- Precision management

### Phase 5: Integration (4-8 hours)
- Migrate TransformHandles
- Migrate coordinate conversions
- Add tests

**Total:** 18-36 hours (3-5 days)

---

## What Makes Our Lives Easier

1. **Centralized Math Library**
   - Single source of truth
   - Reusable across components
   - Testable in isolation

2. **Coordinate Frame System**
   - Prevents bugs (wrong frame conversions)
   - Clear semantics
   - Documented conversions

3. **Spatial Indexing**
   - Fast hit testing
   - Fast snapping
   - Better performance

4. **Transform Composition**
   - Composable operations
   - Invertible transforms
   - Queryable state

---

## What Makes Product Better

1. **Performance**
   - Spatial indexing → faster interactions
   - Typed arrays → less GC pressure
   - GPU-ready → future WebGL/WebGPU

2. **Correctness**
   - Coordinate frames → fewer bugs
   - Precision management → accurate exports
   - Deterministic → reliable undo/redo

3. **Features**
   - Better snapping (priority, geometry)
   - Curve operations (proximity, path length)
   - Boolean operations (union, intersection)

4. **Developer Experience**
   - Clear APIs
   - Well-documented
   - Testable

---

## Next Steps

1. **Review this audit** - Confirm findings
2. **Choose approach** - Hybrid recommended
3. **Design API** - `ourmaths` interface
4. **Build prototype** - Core primitives
5. **Integrate incrementally** - Start with high-value components

---

**Status:** Audit complete, ready for design phase ✅

