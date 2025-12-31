# Product UI Taxonomy
**Date:** January 27, 2025  
**Status:** 📐 **CANONICAL REFERENCE**

---

## Overview

This document defines the **deterministic rules** for when to create UI surfaces (panels, palettes, tabs, modals) based on feature complexity and usage patterns.

---

## Surface Score Formula

### Formula

```
surface_score = (number_of_options * 0.5)
              + frequency_of_use_score (1-3)
              + need_for_persistence (0 or 2)
              + complexity_penalty (+2 if crosses systems)
              + user_complexity_penalty (0, 1, or 2)
```

### Factors

**number_of_options** (number)
- Count of configurable options/parameters in the feature
- Example: Tool with 10 settings = 10

**frequency_of_use_score** (1-3)
- 1 = Rare (used < 5% of sessions)
- 2 = Occasional (used 5-20% of sessions)
- 3 = Frequent (used > 20% of sessions)

**need_for_persistence** (0 or 2)
- 0 = Feature can be accessed on-demand
- 2 = Feature needs to stay visible/accessible

**complexity_penalty** (0 or 2)
- 0 = Feature is self-contained
- 2 = Feature crosses multiple systems (e.g., animation + scripting)

**user_complexity_penalty** (0, 1, or 2)
- 0 = Simple concept (single mental model)
- 1 = Moderate (2-3 concepts)
- 2 = Complex (4+ concepts or advanced knowledge)

---

## Surface Type Mapping

| Surface Score | UI Type | Characteristics |
|---------------|---------|-----------------|
| >= 8 | **Dockable Panel** | Persistent, resizable, dockable |
| 5-7 | **Palette** | Floating, tool-specific, draggable |
| 2-4 | **Tab** | Grouped in inspector/palette, switchable |
| < 2 | **Modal / Command Palette** | On-demand, temporary |

---

## Examples

### Example 1: Tool Properties Panel

**Factors:**
- Options: 15 (stroke, fill, opacity, etc.)
- Frequency: 3 (frequent)
- Persistence: 2 (needs to stay visible)
- Crosses systems: 0 (self-contained)
- User complexity: 1 (moderate concepts)

**Calculation:**
```
score = (15 * 0.5) + 3 + 2 + 0 + 1
      = 7.5 + 3 + 2 + 0 + 1
      = 13.5
```

**Result:** **Dockable Panel** (score >= 8)

---

### Example 2: Color Picker

**Factors:**
- Options: 5 (hue, saturation, brightness, alpha, hex)
- Frequency: 3 (frequent)
- Persistence: 0 (on-demand)
- Crosses systems: 0 (self-contained)
- User complexity: 0 (simple)

**Calculation:**
```
score = (5 * 0.5) + 3 + 0 + 0 + 0
      = 2.5 + 3
      = 5.5
```

**Result:** **Palette** (5 <= score < 8)

---

### Example 3: Export Settings

**Factors:**
- Options: 8 (format, quality, size, etc.)
- Frequency: 1 (rare - only when exporting)
- Persistence: 0 (on-demand)
- Crosses systems: 0 (self-contained)
- User complexity: 1 (moderate)

**Calculation:**
```
score = (8 * 0.5) + 1 + 0 + 0 + 1
      = 4 + 1 + 0 + 0 + 1
      = 6
```

**Result:** **Palette** (5 <= score < 8)

---

### Example 4: Undo/Redo

**Factors:**
- Options: 0 (single action)
- Frequency: 3 (frequent)
- Persistence: 0 (on-demand)
- Crosses systems: 0 (self-contained)
- User complexity: 0 (simple)

**Calculation:**
```
score = (0 * 0.5) + 3 + 0 + 0 + 0
      = 3
```

**Result:** **Tab** (2 <= score < 5) - Actually, this should be a **Toolbar Button** (special case)

---

## Special Cases

### Toolbar Buttons
- Single-action features (score < 2)
- No configuration needed
- Examples: Undo, Redo, Zoom, Pan

### Context Menus
- Right-click actions
- Context-specific options
- Examples: Layer menu, Object menu

### Command Palette
- Quick actions (Cmd/Ctrl+K)
- Searchable
- Examples: "Create rectangle", "Export as PNG"

---

## Implementation

### TypeScript Interface

```typescript
interface SurfaceScoreFactors {
  numberOfOptions: number;
  frequencyOfUse: 1 | 2 | 3;
  needsPersistence: boolean;
  crossesSystems: boolean;
  userComplexity: 0 | 1 | 2;
}

function calculateSurfaceScore(factors: SurfaceScoreFactors): number {
  return (factors.numberOfOptions * 0.5)
       + factors.frequencyOfUse
       + (factors.needsPersistence ? 2 : 0)
       + (factors.crossesSystems ? 2 : 0)
       + factors.userComplexity;
}

function getSurfaceType(score: number): 'panel' | 'palette' | 'tab' | 'modal' {
  if (score >= 8) return 'panel';
  if (score >= 5) return 'palette';
  if (score >= 2) return 'tab';
  return 'modal';
}
```

---

## Audit Process

### Step 1: Analyze Feature
1. Count options/parameters
2. Determine frequency of use
3. Assess persistence needs
4. Check if crosses systems
5. Evaluate user complexity

### Step 2: Calculate Score
1. Apply formula
2. Round to nearest integer
3. Map to surface type

### Step 3: Validate
1. Check against existing UI
2. Compare to similar features
3. Consider user feedback
4. Adjust if needed

---

## Maintenance

### When to Recalculate
- Feature adds new options
- Usage patterns change
- User feedback indicates issues
- Major feature updates

### Review Process
- Quarterly audit of all features
- Update scores based on analytics
- Document changes in this file

---

## References

- **Strategic Vision:** `docs/VECTORFORGE_STRATEGIC_VISION.md`
- **Product Design Language:** `docs/PRODUCT_DESIGN_LANGUAGE.md` (to be created)
- **Screen Quadrants:** `docs/VECTORFORGE_STRATEGIC_VISION.md#screen-quadrants`

---

**This is the canonical reference for UI surface decisions. All features must be evaluated using this taxonomy.**

