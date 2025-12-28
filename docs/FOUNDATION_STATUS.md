# Foundation Status: File Creation & Editing

**Date:** January 2025  
**Priority:** CRITICAL - Everything depends on this

## What We Fixed

### 1. FILE_NEW Action
- **Before:** Was trying to sync layers from INITIAL_SVG (which has background elements)
- **After:** Starts with completely empty `layers: []` array
- **Result:** Clean slate for user to start drawing

### 2. Layer Creation (`onCreateLayer`)
- **Before:** State update and SVG update were separate, could get out of sync
- **After:** State and SVG update together, layer is auto-selected
- **Result:** Layers appear immediately on canvas and in layers panel

### 3. SVG Sync (`syncLayersFromSvg`)
- **Before:** Parsed ALL elements including background/workspace structure
- **After:** Filters out `bg`, `workspace_root`, `prime_path` elements
- **Result:** Only user-created layers are parsed

### 4. SVG Update (`updateSvgFromLayers`)
- **Before:** Used stale closure of `state.currentSvg`
- **After:** Uses current state via `setState` callback pattern
- **Result:** SVG always reflects current layer state

### 5. Layer Color Defaults
- **Before:** Hardcoded `#ffffff` and `#000000`
- **After:** Uses CSS variables `var(--xibalba-text-000)` and `var(--xibalba-grey-000)`
- **Result:** Colors match Xibalba design system

### 6. Size Validation
- **Before:** Could create rectangles/ellipses with 0 size
- **After:** Only creates if width/height > 0
- **Result:** No invisible or broken layers

## Current Workflow Status

### ✅ Should Work Now:
1. **File → New (Ctrl+N)**
   - Clears canvas
   - Resets to empty layers
   - Shows empty state hint
   - Ready to draw

2. **Select Tool (V)**
   - Tool selector highlights
   - Can click on canvas
   - Selection works

3. **Draw Rectangle (M)**
   - Click and drag on canvas
   - Rectangle appears immediately
   - Layer appears in layers panel
   - Layer is auto-selected

4. **Draw Ellipse (L)**
   - Click and drag on canvas
   - Ellipse appears immediately
   - Layer appears in layers panel
   - Layer is auto-selected

5. **Draw Path (P)**
   - Click and drag on canvas
   - Path appears as you draw
   - Layer created on mouse up
   - Layer appears in layers panel

6. **Edit Layer**
   - Select layer in layers panel
   - Modify properties in inspector
   - Changes appear on canvas

7. **Save File (Ctrl+S)**
   - Saves to localStorage
   - Toast confirms save

8. **Open File (Ctrl+O)**
   - Loads from file picker
   - Restores layers
   - Displays on canvas

## Testing Checklist

- [ ] Create new file - canvas clears
- [ ] Draw rectangle - appears on canvas
- [ ] Draw ellipse - appears on canvas  
- [ ] Draw path - appears on canvas
- [ ] Layer appears in layers panel
- [ ] Layer is auto-selected
- [ ] Can modify layer properties
- [ ] Changes appear on canvas
- [ ] Can save file
- [ ] Can open saved file
- [ ] Opened file displays correctly

## Next Steps

Once foundation is verified working:
1. Test each drawing tool individually
2. Test layer editing workflow
3. Test save/load workflow
4. Fix any bugs found
5. Then move to Phase 1 easy wins

## Known Issues to Watch For

1. **Canvas coordinate calculation** - May need adjustment for pan/zoom
2. **Layer rendering** - SVG elements may not update immediately
3. **State synchronization** - SVG and React state must stay in sync
4. **Color handling** - CSS variables vs hex values

## Success Criteria

**Must Work:**
- Can create new file
- Can draw on canvas
- Can see what was drawn
- Can edit what was drawn
- Can save and reopen

If any of these fail, foundation is broken and must be fixed before adding features.

