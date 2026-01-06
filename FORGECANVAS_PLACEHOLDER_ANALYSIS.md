# ForgeCanvas Placeholder - Complete Dependency Analysis

## Purpose
Create a minimal placeholder component that:
1. **Allows the app to load** without the full ForgeCanvas component
2. **Accepts the same props** as ForgeCanvas to avoid breaking the parent component
3. **Does NOT require** any of the complex dependencies (CanvasContext, useViewport, child components)
4. **Provides visual feedback** that the placeholder is active

## ForgeCanvas Component Analysis

### Props Interface (Required)
```typescript
interface ForgeCanvasProps {
  width: number;              // Canvas width in pixels
  height: number;             // Canvas height in pixels
  zoom: number;               // Zoom level (percentage, e.g., 100 = 100%)
  gridEnabled: boolean;       // Whether grid is visible
  gridSize: number;           // Grid spacing in pixels
  rulersEnabled: boolean;      // Whether rulers are visible
  unit: 'px' | 'cm' | 'in' | 'pt';  // Measurement unit
  onCanvasClick?: (x: number, y: number) => void;  // Optional click handler
  onCanvasDrag?: (dx: number, dy: number) => void; // Optional drag handler
  children?: React.ReactNode;  // Optional children
}
```

### Critical Dependencies (MUST NOT be in placeholder)

#### 1. **CanvasContext** (`useCanvas()` hook)
- **Location**: `contexts/CanvasContext.tsx`
- **Required by**: ForgeCanvas MUST be wrapped in `<CanvasProvider>`
- **Provides**: 
  - `canvas.activeTool`
  - `canvas.zoom`
  - `canvas.rotation`
  - `canvas.pan`
  - `canvas.shapes`
  - `canvas.guides`
  - `canvas.fileBounds`
  - `canvas.unit`
  - Methods: `setZoom()`, `setRotation()`, `setPan()`, `selectShape()`, `updateShape()`, etc.
- **Placeholder Impact**: Placeholder should NOT use this - it would require CanvasProvider

#### 2. **useViewport Hook**
- **Location**: `hooks/useViewport.ts`
- **Required**: Container ref and initial viewport state
- **Provides**: 
  - `viewport.zoom`
  - `viewport.rotation`
  - `viewport.pan`
  - Methods: `setZoom()`, `setRotation()`, `setPan()`, `zoomToPoint()`, `startPan()`, `reset()`, `fitToView()`
- **Placeholder Impact**: Placeholder should NOT use this - complex viewport management

#### 3. **Child Components** (All optional for placeholder)
- `Rulers` - Adaptive rulers component
- `Guides` - Interactive guide lines
- `CanvasGrid` - Adaptive grid background
- `DocumentBoundary` - Paper/document boundary visualization
- `MeasurementOverlay` - Distance/angle measurement display
- `ViewportIndicators` - Zoom/rotation indicators

#### 4. **CSS Files** (Optional for placeholder)
- `ForgeCanvas.css`
- `Rulers.css`
- `Guides.css`
- `CanvasGrid.css`
- `DocumentBoundary.css`
- `MeasurementOverlay.css`

#### 5. **Utility Functions** (Not needed for placeholder)
- `applySnap()` - Snap system
- `applyDocSnap()` - Document boundary snapping
- `calculateGridSpacing()` - Grid calculations

### State Management (Not needed for placeholder)
ForgeCanvas uses extensive state:
- `isDrawing`, `drawStart` - Drawing state
- `isDragging`, `dragOffset` - Drag state
- `isSpacebarDown`, `isPanning`, `panStart` - Pan state
- `measurementStart` - Measurement state
- `snapEnabled` - Snap state

### Event Handlers (Optional for placeholder)
- Mouse events (click, drag, wheel)
- Keyboard events (spacebar for pan)
- Touch events (mobile support)
- Pointer events

## Placeholder Requirements

### MUST HAVE
1. ✅ **Same props interface** - Accept all ForgeCanvasProps
2. ✅ **React component** - Functional component returning JSX
3. ✅ **Visual indicator** - Show that it's a placeholder
4. ✅ **No dependencies** - No CanvasContext, useViewport, or child components
5. ✅ **No errors** - Must not throw or cause runtime errors

### SHOULD HAVE
1. ✅ **Display props** - Show received props values for debugging
2. ✅ **Styling** - Basic styling to fill container
3. ✅ **Error boundary safe** - Should not crash if props are invalid

### MUST NOT HAVE
1. ❌ **CanvasContext dependency** - Would require CanvasProvider wrapper
2. ❌ **useViewport hook** - Complex viewport management
3. ❌ **Child components** - Rulers, Guides, Grid, etc.
4. ❌ **Event handlers** - No mouse/keyboard/touch handling
5. ❌ **State management** - No useState, useRef for canvas logic
6. ❌ **CSS imports** - No ForgeCanvas CSS files

## Historical Usage

### In App.hardened.tsx (Current)
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

### In ForgeApp.tsx (Reference)
```tsx
<ForgeCanvas
  width={1920}
  height={1080}
  zoom={zoom}
  gridEnabled={true}
  gridSize={20}
  rulersEnabled={true}
  unit="px"
  onCanvasClick={() => {}}
  onCanvasDrag={() => {}}
/>
```

## Ideal Placeholder Implementation

### Minimal Version
- Accept all props (for compatibility)
- Render a simple div with placeholder text
- Show received props for debugging
- No dependencies on CanvasContext or useViewport
- No child components
- Basic inline styles (no CSS imports)

### Enhanced Version (Optional)
- Display prop values in the placeholder
- Show which features would be active (gridEnabled, rulersEnabled, etc.)
- Visual indication of canvas dimensions
- Debug information about zoom level

## Current Issue
The placeholder was defined but then removed during refactoring. It needs to be:
1. Defined AFTER all imports
2. BEFORE the App component
3. With proper TypeScript typing
4. Matching the ForgeCanvasProps interface exactly

