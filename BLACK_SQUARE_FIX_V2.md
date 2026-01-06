# Black Square Fix V2 - Rulers Overlay Approach

## Problem
The black square returned after fixing rulers. The issue was:
- Canvas viewport was offset by 8px top/left to account for rulers
- This created an 8px × 8px gap at top-left
- Parent container's black background (`#1a1a1a`) showed through the gap

## Root Cause
**Wrong approach**: Offsetting canvas viewport to make room for rulers
- Canvas viewport: `top: 8px, left: 8px`
- Gap created: 8px × 8px at top-left
- Parent background visible: Black square

## Solution
**Correct approach**: Rulers overlay on top of canvas viewport
- Canvas viewport: `top: 0, left: 0` (fills entire container)
- Rulers: Positioned absolutely with higher z-index, overlay canvas
- No gaps: Canvas fills entire area, rulers sit on top

## Changes Made

### 1. Canvas Viewport (`components/Canvas.tsx`)
- **Before**: `top: 8px, left: 8px` (offset for rulers)
- **After**: `top: 0, left: 0` (fills entire container)
- Canvas now fills entire area, no gaps

### 2. Canvas Container Background
- **Before**: `backgroundColor: '#1a1a1a'` (hardcoded black)
- **After**: `backgroundColor: 'var(--xibalba-grey-050, #1a1a1a)'` (matches viewport)
- Consistent background color

### 3. Rulers Z-Index
- **Zero Point**: `z-[80]` (highest, always visible)
- **Horizontal Ruler**: `z-[70]` (overlays canvas)
- **Vertical Ruler**: `z-[70]` (overlays canvas)
- **Canvas Viewport**: `z-index: 1` (base layer)

## Layout Structure (Fixed)

```
┌─────────────────────────────────────┐
│ [ZP] [════════ Horizontal Ruler ════] │  ← z-[80] and z-[70], overlays canvas
│ [│]                                   │
│ [V]  Canvas Viewport                  │  ← z-index: 1, fills entire area
│ [E]  (fills from 0,0)                 │
│ [R]                                   │
│ [T]                                   │
│ [I]                                   │
│ [C]                                   │
│ [A]                                   │
│ [L]                                   │
└─────────────────────────────────────┘
```

Where:
- `[ZP]` = Zero Point (z-[80], top-left)
- `[═══]` = Horizontal Ruler (z-[70], overlays canvas)
- `[│]` = Vertical Ruler (z-[70], overlays canvas)
- Canvas = Fills entire area (z-index: 1), no gaps

## Result
- ✅ No black square (canvas fills entire area)
- ✅ Rulers overlay correctly (higher z-index)
- ✅ Zero point visible (highest z-index)
- ✅ Canvas viewport fills container (no gaps)

