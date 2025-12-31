# Math Strategy - Quick Reference
**Date:** January 27, 2025

---

## TL;DR

**Verdict:** Hybrid approach - Use standard math + build VectorForge wrapper

**Time:** 18-36 hours (3-5 days)

**Start:** Phase 1 (Foundation) - Build core math library

---

## What You Have (Keep & Extend)

1. ✅ `getCanvasCoords()` - Works, extend with coordinate frames
2. ✅ `snapValue()`, `snapToGuide()` - Works, enhance with spatial index
3. ✅ `svgPathParser.ts` - Complete, keep as-is
4. ✅ Transform handles - Works, refactor to use Matrix3

---

## What You Need (Build)

1. ❌ Centralized math library (`Vector2`, `Matrix3`, etc.)
2. ❌ Coordinate frame system (WORLD, VIEWPORT, CANVAS, DEVICE)
3. ❌ Spatial indexing (quadtree for hit testing/snapping)
4. ❌ Transform composition (compose, invert, decompose)
5. ❌ High-level vector ops (curve proximity, path length, boolean ops)

---

## Best Play

**Hybrid Approach:**
- Use `gl-matrix` for core math (proven, GPU-ready)
- Build `ourmaths` wrapper for VectorForge semantics
- Keep existing code (extend, don't replace)
- Add missing pieces (spatial indexing, coordinate frames)

**Why:**
- Correctness (standard math prevents bugs)
- Interoperability (works with libraries)
- Ergonomics (VectorForge-specific API)
- Performance (spatial indexing for speed)

---

## Implementation Phases

### Phase 1: Foundation (4-8 hours)
- Install `gl-matrix`
- Create `lib/ourmaths/` with `Vector2`, `Matrix3`, `CoordinateFrame`
- Add unit tests

### Phase 2: Enhance Existing (4-8 hours)
- Migrate `getCanvasCoords()` to coordinate frames
- Enhance snapping with priority + spatial index
- Migrate pan/zoom to Matrix3

### Phase 3: Add Missing (4-8 hours)
- Implement quadtree for spatial indexing
- Use for hit testing and snapping

### Phase 4: High-Level Ops (4-8 hours)
- Bezier curve proximity
- Path length calculations
- Boolean operations (wrap existing library)

### Phase 5: Integration (2-4 hours)
- Migrate TransformHandles
- Migrate DraftsmanCanvas
- Migrate animation system

---

## Performance Gains

- Hit testing: O(n) → O(log n) (10-100x faster)
- Snapping: O(n) → O(log n) (10-100x faster)
- Transform composition: Ad-hoc → Standard (more reliable)

---

## Next Steps

1. Install `gl-matrix`: `npm install gl-matrix @types/gl-matrix`
2. Create `lib/ourmaths/Vector2.ts`
3. Create `lib/ourmaths/Matrix3.ts`
4. Create `lib/ourmaths/CoordinateFrame.ts`
5. Add unit tests
6. Migrate `getCanvasCoords()` as proof of concept

---

**See:** `docs/MATH_STRATEGY_RECOMMENDATION.md` for full details

