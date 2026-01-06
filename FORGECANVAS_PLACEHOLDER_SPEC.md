# ForgeCanvas Placeholder - Implementation Specification

## Complete Dependency Map

### ✅ Props Interface (MUST MATCH EXACTLY)
```typescript
interface ForgeCanvasProps {
  width: number;              // ✅ Required
  height: number;             // ✅ Required
  zoom: number;               // ✅ Required (percentage, e.g., 100 = 100%)
  gridEnabled: boolean;       // ✅ Required
  gridSize: number;           // ✅ Required
  rulersEnabled: boolean;      // ✅ Required
  unit: 'px' | 'cm' | 'in' | 'pt';  // ✅ Required
  onCanvasClick?: (x: number, y: number) => void;  // ✅ Optional
  onCanvasDrag?: (dx: number, dy: number) => void; // ✅ Optional
  children?: React.ReactNode;  // ✅ Optional
}
```

### ❌ Dependencies NOT Required (Placeholder Must Avoid)

#### 1. CanvasContext (`useCanvas()`)
- **Why NOT needed**: Placeholder doesn't need canvas state management
- **What it provides**: shapes, activeTool, zoom, pan, rotation, guides, fileBounds, unit
- **Impact if used**: Would require `<CanvasProvider>` wrapper - NOT needed for placeholder

#### 2. useViewport Hook
- **Why NOT needed**: Placeholder doesn't need viewport navigation
- **What it provides**: zoom, rotation, pan state and controls
- **Impact if used**: Complex viewport management - NOT needed for placeholder

#### 3. Child Components
- `Rulers` - NOT needed (just visual indicator)
- `Guides` - NOT needed (just visual indicator)
- `CanvasGrid` - NOT needed (just visual indicator)
- `DocumentBoundary` - NOT needed (just visual indicator)
- `MeasurementOverlay` - NOT needed (just visual indicator)
- `ViewportIndicators` - NOT needed (just visual indicator)

#### 4. CSS Files
- All ForgeCanvas CSS files - NOT needed (use inline styles)

#### 5. Utility Functions
- `applySnap()`, `applyDocSnap()`, `calculateGridSpacing()` - NOT needed

#### 6. State Management
- No useState for drawing/dragging/panning - NOT needed
- No useRef for canvas elements - NOT needed (unless for basic container)

#### 7. Event Handlers
- Mouse/keyboard/touch events - NOT needed (optional callbacks only)

## Implementation Requirements

### Location
- **File**: `App.hardened.tsx`
- **Position**: After all imports, before `const App: React.FC = () => {`
- **Line**: ~87 (after last import, before App component)

### TypeScript Type
```typescript
const ForgeCanvasPlaceholder: React.FC<ForgeCanvasProps> = ({ ... }) => { ... }
```

### Minimal Implementation
```typescript
const ForgeCanvasPlaceholder: React.FC<ForgeCanvasProps> = ({
  width,
  height,
  zoom,
  gridEnabled,
  gridSize,
  rulersEnabled,
  unit,
  onCanvasClick,
  onCanvasDrag,
}) => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      background: '#1a1a1a', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      color: '#ff9800', 
      fontSize: '18px',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div>🧪 TEST: Canvas Placeholder</div>
      <div style={{ fontSize: '14px', opacity: 0.7 }}>
        App loaded successfully - ForgeCanvas import disabled
      </div>
      <div style={{ fontSize: '12px', opacity: 0.5, marginTop: '8px' }}>
        Props: {width}×{height} @ {zoom}% | Grid: {gridEnabled ? 'ON' : 'OFF'} | Rulers: {rulersEnabled ? 'ON' : 'OFF'} | Unit: {unit}
      </div>
    </div>
  );
};
```

### Assignment
```typescript
// After placeholder definition, before App component
const ForgeCanvas: React.FC<ForgeCanvasProps> = ForgeCanvasPlaceholder;
```

## Historical Context

### What ForgeCanvas Actually Does
1. **Uses CanvasContext** - Gets canvas state (shapes, tools, zoom, pan, rotation)
2. **Uses useViewport** - Manages viewport navigation (zoom, pan, rotation)
3. **Renders child components**:
   - Rulers (adaptive rulers)
   - Guides (interactive guide lines)
   - CanvasGrid (adaptive grid background)
   - DocumentBoundary (paper boundary)
   - MeasurementOverlay (distance/angle display)
   - ViewportIndicators (zoom/rotation indicators)
4. **Handles events** - Mouse, keyboard, touch for drawing/interaction
5. **Manages state** - Drawing, dragging, panning, measurement states

### What Placeholder Should Do
1. ✅ **Accept same props** - For compatibility
2. ✅ **Render simple UI** - Visual indicator that placeholder is active
3. ✅ **No dependencies** - No CanvasContext, useViewport, or child components
4. ✅ **No errors** - Must not throw or cause runtime errors
5. ✅ **Display props** - Show received props for debugging

## Current Usage in App.hardened.tsx

```tsx
<ForgeCanvasPlaceholder
  width={1920}
  height={1080}
  zoom={state.zoom}
  gridEnabled={true}
  gridSize={20}
  rulersEnabled={true}
  unit="px"
  onCanvasClick={() => {}}
  onCanvasDrag={() => {}}
/>
```

## Verification Checklist

- [ ] Placeholder defined after all imports
- [ ] Placeholder defined before App component
- [ ] Props interface matches ForgeCanvasProps exactly
- [ ] No CanvasContext dependency
- [ ] No useViewport dependency
- [ ] No child components imported
- [ ] No CSS files imported
- [ ] TypeScript types correct
- [ ] Component returns valid JSX
- [ ] No runtime errors
- [ ] Visual indicator shows placeholder is active
- [ ] Props displayed for debugging

