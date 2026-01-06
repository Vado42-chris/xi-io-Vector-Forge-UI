# CRITICAL: Dark Area Below Rulers - DIAGNOSIS

## User Report
- **Black box AND dark grey background visible below rulers**
- **Toolbar and 3 columns not displaying correctly**
- **This area was supposedly removed/hidden but is still visible**
- **This has been causing production delays for 3 days**

## What We Know

### Library Component Status
- **Location**: `App.hardened.tsx` lines 2616-2644
- **Status**: ✅ **COMMENTED OUT** (not rendering)
- **Width**: Was 240px
- **Background**: `var(--xibalba-grey-100, #1a1a1a)` (dark grey)

### Current Layout Structure
```
Main Content Area (flex row)
├── Left Sidebar (320px) - Line 2281
├── Center Stack (flex-1) - Line 2292
│   ├── Toolbar (48px) - Line 2347
│   ├── AI Panel (200px) - Line 2400
│   └── Canvas Area - Line 2509
│       └── Canvas Component - Line 2540
└── Right Sidebar (360px) - Line 2647
```

## What Could Be Creating the Dark Area

### Hypothesis 1: Canvas Container Background
- **Location**: `App.hardened.tsx` line 2518
- **Background**: `backgroundColor: '#1a1a1a'` (dark grey/black)
- **Size**: Fills entire center-canvas-area
- **This is the canvas area itself - NOT the Library**

### Hypothesis 2: Canvas Component Container
- **Location**: `components/Canvas.tsx` line 462
- **Background**: `backgroundColor: '#1a1a1a'`
- **Position**: `position: absolute, inset: 0`
- **This fills the entire canvas area**

### Hypothesis 3: Canvas Viewport
- **Location**: `components/Canvas.tsx` line 520
- **Background**: `backgroundColor: 'var(--xibalba-grey-050, #1a1a1a)'`
- **Position**: `position: absolute, top: 0, left: 0, right: 0, bottom: 0`

## The Real Problem

**THE DARK AREA IS THE CANVAS ITSELF, NOT THE LIBRARY**

The user is seeing:
1. **Rulers** (overlaying the canvas)
2. **Dark grey/black area below rulers** = **THE CANVAS VIEWPORT**

This is NOT a bug - this is the canvas area. However:
- The canvas might not be rendering content correctly
- The canvas might be too dark
- The canvas might need better visual feedback (grid, borders, etc.)

## What Needs to Happen

1. **Confirm**: Is the dark area the canvas itself or something else?
2. **Fix Canvas Visibility**: Make canvas more visible (lighter background, better grid)
3. **Fix Layout**: Ensure toolbar and columns are displaying correctly
4. **Document**: What IS the canvas area and how should it look?

## Next Steps

1. Check if canvas is rendering SVG content
2. Improve canvas background visibility
3. Add visual indicators that this IS the canvas
4. Fix any layout issues with toolbar/columns

