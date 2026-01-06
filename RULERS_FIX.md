# Rulers and Canvas Area Fix

## Problem
- Horizontal and vertical rulers were both rendering vertically on the left side
- Canvas area was overlapping with rulers
- Poor visual experience

## Solution

### 1. Rulers Component (`components/Rulers.tsx`)
- **Zero Point**: Moved to render first (top-left corner, 8px × 8px)
- **Horizontal Ruler**: Positioned at `top-0 left-8` (starts after zero point, 8px high)
- **Vertical Ruler**: Positioned at `top-8 left-0` (starts below zero point, 8px wide)

### 2. Canvas Viewport (`components/Canvas.tsx`)
- **Position**: Changed from `relative` to `absolute`
- **Top**: `8px` (below horizontal ruler)
- **Left**: `8px` (to the right of vertical ruler)
- **Right/Bottom**: `0` (extends to edges)

## Layout Structure

```
┌─────────────────────────────────────┐
│ [ZP] [════════ Horizontal Ruler ════] │  ← top-0, zero point at left-0, ruler at left-8
│ [│]                                   │
│ [V]  Canvas Viewport                  │  ← top-8 left-8
│ [E]  (starts here)                    │
│ [R]                                   │
│ [T]                                   │
│ [I]                                   │
│ [C]                                   │
│ [A]                                   │
│ [L]                                   │
└─────────────────────────────────────┘
```

Where:
- `[ZP]` = Zero Point (8×8px)
- `[═══]` = Horizontal Ruler (8px high)
- `[│]` = Vertical Ruler (8px wide)
- Canvas starts at `top-8 left-8`

## Result
- ✅ Horizontal ruler at top
- ✅ Vertical ruler on left
- ✅ Canvas viewport properly positioned
- ✅ No overlap between rulers and canvas

