# Template Dependency Graph - Iceberg Format
**Date:** January 27, 2025  
**Status:** 🔴 MAPPING DEPENDENCIES BEFORE FIXING  
**Method:** Fractal System Architecture - Dependency Graph Lens

---

## Current Understanding

### Template System Components
1. **TemplateLibrary.tsx** - Template browser component
2. **templateService.ts** - Template management and retrieval
3. **templateSeedService.ts** - Seed-based template reconstruction
4. **CustomPaletteBuilder.tsx** - Template frame attachment (`attachedToFrame`)
5. **PaletteDockingSystem.tsx** - Draggable palettes (may affect templates)
6. **EnhancedPanelSystem.tsx** - Panel system (may affect templates)

### Template Frame Concept
- Components can attach to template frames via `attachedToFrame?: string` property
- Template frames are referenced but structure is undefined
- Template compatibility plan is BLOCKED due to undefined structure

---

## Dependency Graph (Iceberg Format)

### Level 1: BUILD-BREAKING (Bottom of Iceberg - Fix First)

**Root Node: Template Frame Architecture Undefined**

```
Template Frame Structure Undefined
├── No clear definition of what a "template frame" is
├── No template frame ID system
├── No template frame rendering system
└── No template frame CSS/styling system
```

**Impact:** If template frames don't have clear structure, everything that depends on them breaks.

**Dependencies:**
- CustomPaletteBuilder uses `attachedToFrame` but frame system doesn't exist
- Template compatibility plan is BLOCKED
- Template rendering cannot work without frame structure

**Files Affected:**
- `components/CustomPaletteBuilder.tsx:24` - `attachedToFrame?: string` property exists but frame system undefined
- `docs/TEMPLATE_COMPATIBILITY_PLAN.md` - Blocked by undefined frame structure

---

### Level 2: RUNTIME-BREAKING (Fix Second)

**2.1: Template Frame Attachment System Missing**

```
Template Frame Attachment Missing
├── No way to attach components to frames
├── No frame registry/lookup system
├── No frame rendering context
└── No frame position/sizing system
```

**Dependencies on Level 1:**
- Requires template frame architecture (Level 1)

**Files Affected:**
- `components/CustomPaletteBuilder.tsx` - Uses `attachedToFrame` but no attachment system
- All components that should attach to templates

---

**2.2: Template CSS System Conflicts**

```
Template CSS System Conflicts
├── Template-specific CSS not defined
├── Component CSS conflicts with template context
├── Z-stack issues for templates (partially fixed)
└── Template frame styling undefined
```

**Dependencies on Level 1:**
- Requires template frame architecture to define CSS structure

**Files Affected:**
- `styles/button-template.css` - Template CSS files exist but structure unclear
- `styles/input-template.css`
- `styles/panel-template.css`
- `components/PaletteDockingSystem.tsx` - May need template-specific CSS

---

**2.3: Component Template Compatibility**

```
Component Template Compatibility Issues
├── Components don't detect template context
├── Components don't adapt to template frames
├── Template rendering breaks component isolation
└── Template-specific component variants missing
```

**Dependencies on Level 1:**
- Requires template frame architecture to define context

**Files Affected:**
- All components that should work in template context
- `components/PaletteDockingSystem.tsx`
- `components/EnhancedPanelSystem.tsx`

---

### Level 3: CODE QUALITY (Fix Third)

**3.1: Inline Styles in Template-Dependent Components**

```
Inline Styles in Template Components
├── PaletteDockingSystem uses CSS custom properties (✅ FIXED)
├── EnhancedPanelSystem uses CSS classes (✅ FIXED)
└── Template frame attachment may require inline styles
```

**Dependencies on Level 2:**
- Requires template CSS system (Level 2.2)
- Requires template compatibility (Level 2.3)

**Files Affected:**
- `components/PaletteDockingSystem.tsx` - Already converted to CSS custom properties
- `components/EnhancedPanelSystem.tsx` - Already converted to CSS classes
- Template frame components (when created)

---

**3.2: Template Test Coverage**

```
Template Test Coverage Missing
├── No template frame attachment tests
├── No template rendering tests
├── No template CSS tests
└── No template compatibility tests
```

**Dependencies on Level 2:**
- Requires all Level 2 fixes to be testable

---

### Level 4: WARNINGS (Fix Last)

**4.1: Template Documentation Gaps**

```
Template Documentation Missing
├── Template frame structure not documented
├── Template usage patterns not documented
├── Template API not documented
└── Template examples missing
```

**Dependencies on Level 3:**
- Requires all fixes to be complete before documenting

---

## Root Cause Analysis

### The Root Node: Template Frame Architecture Undefined

**Why this is the root:**
1. **Everything depends on it** - CustomPaletteBuilder, template compatibility, template rendering all require frame structure
2. **Blocking all other work** - Template compatibility plan is BLOCKED until structure is defined
3. **Cascading impact** - Once defined, frame attachment, CSS, and compatibility all become fixable

**What needs to be defined:**
1. **Template Frame Structure** - What is a template frame? How is it identified?
2. **Template Frame Registry** - How are frames registered/looked up?
3. **Template Frame Rendering** - How are frames rendered? Where do they appear?
4. **Template Frame CSS** - What CSS classes/variables do frames use?

**The Fix:**
Define template frame architecture as a minimal system:
- Template frames are identified by string IDs
- Template frames are registered in a frame registry
- Template frames render in a frame container
- Template frames use CSS classes for styling

**Expected Cascade:**
- 1 architecture fix → Template compatibility plan unblocked
- 1 architecture fix → Template frame attachment becomes possible
- 1 architecture fix → Template CSS system becomes definable
- 1 architecture fix → Template component compatibility becomes testable

---

## Dependency Chain Visualization

```
ROOT NODE (Level 1)
└── Template Frame Architecture Undefined
    ├── Level 2.1: Template Frame Attachment Missing
    │   └── Level 3.1: Inline Styles (if needed)
    │       └── Level 4.1: Documentation
    ├── Level 2.2: Template CSS System Conflicts
    │   └── Level 3.1: Inline Styles (if needed)
    │       └── Level 4.1: Documentation
    └── Level 2.3: Component Template Compatibility
        ├── Level 3.1: Inline Styles (if needed)
        └── Level 3.2: Template Test Coverage
            └── Level 4.1: Documentation
```

---

## Verification System

For each fix:
- ✅ Error count DECREASES (not just changes)
- ✅ Build succeeds
- ✅ Errors move up dependency tree (root → leaves)
- ✅ Template system becomes more functional
- ✅ Document proof

---

## Next Steps

1. **Fix Level 1: Template Frame Architecture** - Define minimal frame system
2. **Verify cascade begins** - Template compatibility plan unblocked
3. **Fix Level 2: Template Systems** - Frame attachment, CSS, compatibility
4. **Verify cascade continues** - Components work in template context
5. **Fix Level 3: Code Quality** - Tests, cleanup
6. **Fix Level 4: Documentation** - Document everything

---

**Patent:** VF-TEMPLATE-CASCADE-001  
**Blockchain Seed:** seed001  
**Work Tracking ID:** WT-2025-01-27-020

