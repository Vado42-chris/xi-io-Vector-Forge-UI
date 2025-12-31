# Missing Menu Action Handlers

**Date:** January 27, 2025  
**Status:** ⚠️ **MULTIPLE HANDLERS MISSING**

## Menu Actions Without Handlers

### File Menu
- ❌ `FILE_NEW_TEMPLATE` - New from Template
- ❌ `FILE_OPEN_RECENT_*` - Open Recent (submenu items)
- ❌ `FILE_SAVE_WEB` - Save for Web
- ❌ `FILE_COLOR_MODE_RGB` - Color Mode RGB
- ❌ `FILE_COLOR_MODE_CMYK` - Color Mode CMYK
- ❌ `FILE_COLOR_MODE_GRAYSCALE` - Color Mode Grayscale
- ❌ `FILE_EXPORT_PDF` - Export as PDF
- ❌ `FILE_EXPORT_EPS` - Export as EPS
- ❌ `FILE_EXPORT_ANIMATION` - Export for Animation Studio

### Object Menu - Transform
- ❌ `OBJECT_TRANSFORM_MOVE` - Move
- ❌ `OBJECT_TRANSFORM_ROTATE` - Rotate
- ❌ `OBJECT_TRANSFORM_REFLECT` - Reflect
- ❌ `OBJECT_TRANSFORM_SCALE` - Scale
- ❌ `OBJECT_TRANSFORM_SHEAR` - Shear
- ❌ `OBJECT_TRANSFORM_EACH` - Transform Each

### Object Menu - Arrange
- ❌ `OBJECT_ARRANGE_FRONT` - Bring to Front (needs handler)
- ❌ `OBJECT_ARRANGE_FORWARD` - Bring Forward (needs handler)
- ❌ `OBJECT_ARRANGE_BACKWARD` - Send Backward (needs handler)
- ❌ `OBJECT_ARRANGE_BACK` - Send to Back (needs handler)

### Object Menu - Path
- ❌ `OBJECT_PATH_JOIN` - Join
- ❌ `OBJECT_PATH_AVERAGE` - Average
- ❌ `OBJECT_PATH_OUTLINE` - Outline Stroke
- ❌ `OBJECT_PATH_OFFSET` - Offset Path
- ❌ `OBJECT_PATH_SIMPLIFY` - Simplify
- ❌ `OBJECT_PATH_ADD_ANCHOR` - Add Anchor Points
- ❌ `OBJECT_PATH_REMOVE_ANCHOR` - Remove Anchor Points
- ❌ `OBJECT_PATH_DIVIDE` - Divide Objects Below
- ❌ `OBJECT_PATH_SPLIT_GRID` - Split Into Grid

### Object Menu - Blend
- ❌ `OBJECT_BLEND_MAKE` - Make
- ❌ `OBJECT_BLEND_RELEASE` - Release
- ❌ `OBJECT_BLEND_OPTIONS` - Blend Options
- ❌ `OBJECT_BLEND_EXPAND` - Expand
- ❌ `OBJECT_BLEND_REPLACE_SPINE` - Replace Spine
- ❌ `OBJECT_BLEND_REVERSE_SPINE` - Reverse Spine

### Object Menu - Envelope
- ❌ `OBJECT_ENVELOPE_WARP` - Make with Warp
- ❌ `OBJECT_ENVELOPE_MESH` - Make with Mesh
- ❌ `OBJECT_ENVELOPE_TOP` - Make with Top Object
- ❌ `OBJECT_ENVELOPE_RELEASE` - Release
- ❌ `OBJECT_ENVELOPE_OPTIONS` - Envelope Options

### Object Menu - Compound Path
- ❌ `OBJECT_COMPOUND_PATH_MAKE` - Make
- ❌ `OBJECT_COMPOUND_PATH_RELEASE` - Release

### Object Menu - Graph
- ❌ `OBJECT_GRAPH_TYPE` - Type
- ❌ `OBJECT_GRAPH_DATA` - Data
- ❌ `OBJECT_GRAPH_DESIGN` - Design
- ❌ `OBJECT_GRAPH_COLUMN` - Column
- ❌ `OBJECT_GRAPH_STACKED_COLUMN` - Stacked Column
- ❌ `OBJECT_GRAPH_BAR` - Bar
- ❌ `OBJECT_GRAPH_STACKED_BAR` - Stacked Bar
- ❌ `OBJECT_GRAPH_LINE` - Line
- ❌ `OBJECT_GRAPH_AREA` - Area
- ❌ `OBJECT_GRAPH_SCATTER` - Scatter
- ❌ `OBJECT_GRAPH_PIE` - Pie
- ❌ `OBJECT_GRAPH_RADAR` - Radar

### Edit Menu - Preferences
- ✅ `EDIT_PREFERENCES_GENERAL` - Has handler (opens PreferencesDialog)
- ✅ `EDIT_PREFERENCES_INTERFACE` - Has handler (opens PreferencesDialog)
- ✅ `EDIT_PREFERENCES_PERFORMANCE` - Has handler (opens PreferencesDialog)
- ✅ `EDIT_PREFERENCES_ACCESSIBILITY` - Has handler (opens PreferencesDialog)
- ✅ `EDIT_PREFERENCES_AI` - Has handler (opens PreferencesDialog)

## Impact

**User Experience:**
- Clicking these menu items will do nothing
- No feedback to user that action is not implemented
- Menu appears broken/incomplete

**Priority:**
- **P0 (Critical):** Core file operations (FILE_NEW_TEMPLATE, FILE_OPEN_RECENT, FILE_SAVE_WEB)
- **P1 (High):** Transform and Arrange operations (users expect these to work)
- **P2 (Medium):** Advanced path operations
- **P3 (Low):** Graph and advanced blend operations

## Recommended Fix

Add default handlers that show "Coming soon" toast or open appropriate dialogs:

```typescript
case 'FILE_NEW_TEMPLATE':
  // Open template library
  setShowTemplateLibrary(true);
  break;

case 'FILE_OPEN_RECENT_1':
case 'FILE_OPEN_RECENT_2':
// ... etc
  const index = parseInt(action.split('_').pop() || '0') - 1;
  const recentFiles = getRecentFiles();
  if (recentFiles[index]) {
    handleOpenFile(recentFiles[index].path);
  }
  break;

case 'OBJECT_ARRANGE_FRONT':
  if (state.selectedLayerId) {
    // Move layer to front
    const newLayers = [...state.layers];
    const layerIndex = newLayers.findIndex(l => l.id === state.selectedLayerId);
    if (layerIndex >= 0) {
      const [layer] = newLayers.splice(layerIndex, 1);
      newLayers.push(layer);
      setState(prev => ({ ...prev, layers: newLayers }));
      showToast('Brought to front', 'success');
    }
  }
  break;
```

