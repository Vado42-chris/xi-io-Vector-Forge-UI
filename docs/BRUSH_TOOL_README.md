# Brush Tool - Implementation Guide

**Status:** ✅ Complete  
**Tool Type:** Variable-width drawing tool with pressure simulation  
**Integration:** Headless core + React adapter pattern

---

## Overview

The Brush tool provides variable-width strokes with pressure simulation. It follows the same architectural pattern as the Pencil tool:

- **Headless Core** (`lib/tools/brush.ts`) - Pure TypeScript, no React dependencies
- **React Adapter** (`components/tools/BrushTool.tsx`) - Connects core to React/Canvas
- **Tests** (`tests/brush.test.ts`) - Unit tests for core functionality
- **Export Integration** - `strokeToSvgPath()` for SVG export

---

## Features

### Core Functionality
- ✅ Variable width strokes (min/max width configurable)
- ✅ Pressure simulation from velocity (when stylus pressure unavailable)
- ✅ Real pressure support (when using stylus/pen input)
- ✅ Smoothing algorithm for fluid strokes
- ✅ Point compression (removes redundant points)
- ✅ Undo/redo support
- ✅ SVG path export

### Integration Points
- ✅ Tool palette selection
- ✅ Keyboard shortcuts (B for brush, Ctrl+B for undo, Ctrl+Shift+B for redo)
- ✅ Pointer event handling (mouse and stylus)
- ✅ Canvas coordinate conversion
- ✅ Stroke preview during drawing

---

## Manual Testing Steps

### 1. Basic Drawing
1. Select Brush tool from palette (or press `B`)
2. Click and drag on canvas
3. **Expected:** Variable-width stroke appears, width changes based on drawing speed
4. **Verify:** Slow strokes = thicker, fast strokes = thinner

### 2. Pressure Simulation
1. Draw slowly across canvas
2. **Expected:** Stroke is thicker (higher simulated pressure)
3. Draw quickly across canvas
4. **Expected:** Stroke is thinner (lower simulated pressure)

### 3. Stylus Pressure (if available)
1. Use stylus/pen input device
2. Apply varying pressure while drawing
3. **Expected:** Stroke width reflects actual pressure from device

### 4. Undo/Redo
1. Draw a stroke
2. Press `Ctrl+B` (or use undo button)
3. **Expected:** Last stroke is removed
4. Press `Ctrl+Shift+B` (or use redo button)
5. **Expected:** Stroke is restored

### 5. Export
1. Draw several strokes
2. Export as SVG
3. **Expected:** All strokes appear in exported SVG with correct paths

---

## Integration Notes

### Adding to Canvas Component

```tsx
import { BrushToolComponent } from './tools/BrushTool';

// In DraftsmanCanvas.tsx
{activeTool === 'brush' && (
  <BrushToolComponent
    canvasRef={canvasRef}
    config={{
      minWidth: toolProperties?.brush?.minWidth || 2,
      maxWidth: toolProperties?.brush?.maxWidth || 20,
      pressureSensitivity: toolProperties?.brush?.pressureSensitivity || 0.7,
      color: toolProperties?.color || '#ff9800',
      opacity: toolProperties?.opacity || 1.0,
    }}
    onStrokeComplete={(stroke) => {
      // Convert to VectorLayer and add to layers
      const layer: VectorLayer = {
        id: stroke.id,
        name: `Brush ${layers.length + 1}`,
        visible: true,
        locked: false,
        color: stroke.color,
        stroke: 'none',
        strokeWidth: (stroke.minWidth + stroke.maxWidth) / 2,
        opacity: stroke.opacity,
        blendMode: 'normal',
        shape: {
          type: 'path',
          nodes: stroke.points.map((p, i) => ({
            id: `node_${i}`,
            type: i === 0 ? 'move' : 'line',
            x: p.x,
            y: p.y,
          })),
        },
      };
      onCreateLayer(layer);
    }}
    active={activeTool === 'brush'}
    shortcut="B"
  />
)}
```

### Tool Properties Panel

Add brush-specific controls:

```tsx
{activeTool === 'brush' && (
  <>
    <label>Min Width</label>
    <input
      type="range"
      min="1"
      max="10"
      value={toolProperties?.brush?.minWidth || 2}
      onChange={(e) => onToolPropertiesChange({
        brush: { ...toolProperties?.brush, minWidth: Number(e.target.value) }
      })}
    />
    
    <label>Max Width</label>
    <input
      type="range"
      min="10"
      max="50"
      value={toolProperties?.brush?.maxWidth || 20}
      onChange={(e) => onToolPropertiesChange({
        brush: { ...toolProperties?.brush, maxWidth: Number(e.target.value) }
      })}
    />
    
    <label>Pressure Sensitivity</label>
    <input
      type="range"
      min="0"
      max="1"
      step="0.1"
      value={toolProperties?.brush?.pressureSensitivity || 0.7}
      onChange={(e) => onToolPropertiesChange({
        brush: { ...toolProperties?.brush, pressureSensitivity: Number(e.target.value) }
      })}
    />
  </>
)}
```

---

## Performance Considerations

### Point Compression
- Enabled by default to reduce memory usage
- Removes points closer than 0.5px
- Can be disabled via config: `pointCompression: false`

### Smoothing
- Default smoothing factor: 0.3
- Higher values = smoother but less responsive
- Lower values = more responsive but potentially jagged

### Stroke Rendering
- For many strokes, consider canvas-based rendering instead of SVG paths
- Variable width strokes can be rendered as filled paths or using canvas strokeWidth per segment

---

## Known Limitations

1. **Variable Width in SVG**: Current implementation uses average width per stroke. For true variable width in SVG, consider using `<path>` with `stroke-width` animation or multiple paths.

2. **Performance with Many Strokes**: Large numbers of strokes (>1000) may impact performance. Consider:
   - Canvas-based rendering for preview
   - Stroke batching/merging
   - LOD (Level of Detail) rendering

3. **Pressure Accuracy**: Simulated pressure from velocity is approximate. For production use, prefer actual pressure input devices.

---

## Future Enhancements

- [ ] Brush textures/patterns
- [ ] Brush presets (watercolor, oil, etc.)
- [ ] GPU-accelerated rendering (WebGL)
- [ ] Stroke merging/optimization
- [ ] Variable opacity based on pressure
- [ ] Brush stamp shapes (round, square, custom)

---

## Testing

Run unit tests:
```bash
npm test -- brush.test.ts
```

Manual integration test:
1. Select brush tool
2. Draw strokes at varying speeds
3. Verify width changes
4. Test undo/redo
5. Export and verify SVG

---

**#hashtag: tools brush implementation guide**



