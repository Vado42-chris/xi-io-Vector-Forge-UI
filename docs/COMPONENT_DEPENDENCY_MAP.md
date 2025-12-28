# Component Dependency Map
**Date:** 2025-12-27  
**Work Tracking ID:** WT-2025-01-27-036  
**Last Updated:** 2025-12-27

## Affected Components & Their Dependencies

### 1. App.hardened.tsx
**Status**: ⚠️ Has inline styles  
**Dependencies**: None (root component)  
**Used By**: 
- Main application entry point
- All pages inherit from this

**Impact**: 🔴 **CRITICAL** - Affects entire application

**Files Using**:
- `index.tsx` (main entry)
- All routes inherit styling

**Risk Level**: HIGH

---

### 2. DraftsmanCanvas.tsx
**Status**: ⚠️ Has inline styles (pointerEvents)  
**Dependencies**: None  
**Used By**:
- `App.hardened.tsx` (main app)
- `App.working.tsx` (working version)
- `App.tsx` (commented out)

**Impact**: 🟡 **MEDIUM** - Affects canvas rendering

**Files Using**:
- `App.hardened.tsx:1079`
- `App.working.tsx:5`

**Risk Level**: MEDIUM

---

### 3. PowerUserToolbar.tsx
**Status**: ⚠️ Has inline styles (position)  
**Dependencies**: None  
**Used By**:
- `App.hardened.tsx` (main app)
- `App.tsx` (commented out)

**Impact**: 🟡 **MEDIUM** - Affects toolbar positioning

**Files Using**:
- `App.hardened.tsx:1060`

**Risk Level**: MEDIUM

---

### 4. XibalbaLogomark.tsx
**Status**: ⚠️ Has inline styles (cursor, size)  
**Dependencies**: None  
**Used By**:
- `ProfessionalFileMenu.tsx` (header)
- `data/productRegistry.json` (registry)

**Impact**: 🟢 **LOW** - Affects logo display

**Files Using**:
- `components/ProfessionalFileMenu.tsx:8`
- `data/productRegistry.json:15`

**Risk Level**: LOW

**Pages Affected**:
- All pages with header (all pages)

---

### 5. PaletteDockingSystem.tsx
**Status**: ⚠️ Has inline styles (library style, height, clipPath)  
**Dependencies**: None  
**Used By**:
- `CustomPaletteBuilder.tsx` (custom palettes)
- `DockableToolPalette.tsx` (tool palettes)
- `EnhancedPanelSystem.tsx` (panel system)
- `hooks/useWorkspaceLayout.ts` (layout hooks)
- `hooks/usePaletteLayout.ts` (palette hooks)

**Impact**: 🔴 **CRITICAL** - Affects palette system and templates

**Files Using**:
- `components/CustomPaletteBuilder.tsx:8`
- `components/DockableToolPalette.tsx:9`
- `components/EnhancedPanelSystem.tsx:9`
- `hooks/useWorkspaceLayout.ts:8`
- `hooks/usePaletteLayout.ts:8`

**Risk Level**: CRITICAL

**Template Dependencies**:
- `CustomPaletteBuilder` uses `attachedToFrame` (template frame ID)
- Template frames may depend on palette styling

---

### 6. EnhancedPanelSystem.tsx
**Status**: ⚠️ Has inline styles (getGroupingStyles function)  
**Dependencies**: `PaletteDockingSystem`  
**Used By**:
- Unknown (needs investigation)

**Impact**: 🟡 **MEDIUM-HIGH** - Affects panel system

**Files Using**:
- Needs investigation

**Risk Level**: HIGH

---

### 7. SprintBoard.tsx
**Status**: ⚠️ Has inline styles (library style, opacity)  
**Dependencies**: @dnd-kit library  
**Used By**:
- `App.tsx` (commented out)
- Unknown pages

**Impact**: 🟡 **MEDIUM** - Affects sprint board

**Files Using**:
- `App.tsx:30` (commented out)

**Risk Level**: MEDIUM

**Library Dependency**: @dnd-kit (drag-and-drop)

---

## Dependency Graph

```
App.hardened.tsx (ROOT)
├── DraftsmanCanvas.tsx
├── PowerUserToolbar.tsx
├── ProfessionalFileMenu.tsx
│   └── XibalbaLogomark.tsx
└── (other components)

PaletteDockingSystem.tsx (CORE)
├── CustomPaletteBuilder.tsx
│   └── Templates (attachedToFrame)
├── DockableToolPalette.tsx
├── EnhancedPanelSystem.tsx
├── useWorkspaceLayout.ts
└── usePaletteLayout.ts

SprintBoard.tsx (ISOLATED)
└── @dnd-kit library
```

## Impact Summary

| Component | Direct Dependencies | Indirect Dependencies | Total Impact |
|-----------|---------------------|----------------------|--------------|
| App.hardened.tsx | 0 | All pages | 🔴 CRITICAL |
| DraftsmanCanvas.tsx | 0 | Canvas pages | 🟡 MEDIUM |
| PowerUserToolbar.tsx | 0 | Toolbar pages | 🟡 MEDIUM |
| XibalbaLogomark.tsx | 0 | All pages (header) | 🟢 LOW |
| PaletteDockingSystem.tsx | 0 | Templates, Palettes | 🔴 CRITICAL |
| EnhancedPanelSystem.tsx | 1 | Panels | 🟡 HIGH |
| SprintBoard.tsx | 1 (library) | Sprint pages | 🟡 MEDIUM |

## Testing Requirements

### High Priority Tests
1. **App.hardened.tsx**: Test all pages render correctly
2. **PaletteDockingSystem.tsx**: Test template frame attachment
3. **EnhancedPanelSystem.tsx**: Test panel grouping

### Medium Priority Tests
1. **DraftsmanCanvas.tsx**: Test canvas rendering
2. **PowerUserToolbar.tsx**: Test toolbar positioning
3. **SprintBoard.tsx**: Test drag-and-drop

### Low Priority Tests
1. **XibalbaLogomark.tsx**: Test logo display

