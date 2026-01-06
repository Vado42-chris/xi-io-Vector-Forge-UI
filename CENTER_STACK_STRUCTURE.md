# Center Stack Structure - Complete Layout

## ✅ Current Structure (Found in App.hardened.tsx)

The center area has a **vertical stack** with three sections:

```
┌─────────────────────────────────────────┐
│ Center Canvas Area (flex column)        │
├─────────────────────────────────────────┤
│ 1. Toolbar (48px) - Top                 │
│    - PowerUserToolbar                   │
├─────────────────────────────────────────┤
│ 2. AI Vector Column (200px) - Middle    │
│    - AI Generation Panel                │
│    - Prompt, Style, Palette, Generate   │
├─────────────────────────────────────────┤
│ 3. Canvas (flex-1) - Bottom             │
│    - Grid background                    │
│    - SVG content                        │
│    - Empty state message                │
└─────────────────────────────────────────┘
```

## Component Locations

### 1. Toolbar (App.hardened.tsx:2220-2252)
- **Height**: 48px (fixed)
- **Component**: `PowerUserToolbar`
- **Contains**: Snap to grid, guides, grid size, onion skin controls
- **Visibility**: Controlled by `panelVisibility['toolbar']`

### 2. AI Vector Column (App.hardened.tsx:2254-2320+)
- **Height**: 200px (fixed)
- **Component**: AI Generation Panel (extracted from LeftSidebar)
- **Contains**: 
  - PROMPT textarea
  - STYLE & COMPLEXITY buttons and slider
  - PALETTE color swatches
  - GENERATE VECTOR button
  - Credits display
- **Visibility**: Always visible (no conditional)

### 3. Canvas (App.hardened.tsx:2320+)
- **Height**: `flex-1` (takes remaining space)
- **Component**: `Canvas`
- **Contains**: 
  - Grid pattern
  - SVG content
  - Empty state message
  - Rulers
  - Guides
  - Selection bounding boxes

## Expected Layout

```
┌─────────────────────────────────────────────────────────┐
│ Header (48px)                                           │
├──────┬──────────────────────────────┬───────────────────┤
│ Tool │  Toolbar (48px)              │                   │
│ Dock │  ─────────────────────────── │  Right Sidebar    │
│ 48px │  AI Vector Column (200px)    │  (Properties,     │
│      │  ─────────────────────────── │   Layers, etc.)   │
│ AI   │  Canvas (flex-1)             │                   │
│Panel │  (Grid + SVG + Empty state)  │                   │
│      │                              │                   │
├──────┴──────────────────────────────┴───────────────────┤
│ Footer/Status Bar                                       │
└─────────────────────────────────────────────────────────┘
```

## Status

✅ **Toolbar**: Implemented at line 2220
✅ **AI Vector Column**: Implemented at line 2254
✅ **Canvas**: Implemented at line 2320+
✅ **Layout Structure**: All three sections in vertical flex column

## Recent Fixes Applied

1. ✅ Canvas visibility - Grid pattern, SVG content, empty state
2. ✅ Overflow changed to 'visible' - Allows content to be seen
3. ✅ Z-index layering - Grid (0), SVG (2), Empty state (3)
4. ✅ Flexbox constraints - Proper minHeight/minWidth for shrinking

## Next Steps

1. Hard refresh browser (Ctrl+Shift+R)
2. Verify all three sections are visible:
   - Toolbar at top
   - AI Vector Column in middle
   - Canvas at bottom with grid visible
3. If any section is missing, check `panelVisibility` state

