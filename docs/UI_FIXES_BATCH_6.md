# UI Fixes Batch 6 - Canvas Rendering & Coordinate System

## Issues Fixed

### 1. Duplicate Style Prop in DraftsmanCanvas.tsx
**Problem**: Two `style` props on the same element (lines 362-366 and 368), causing invalid JSX.
**Fix**: Merged both style objects into a single `style` prop with all properties.

### 2. Canvas Container Height
**Problem**: Canvas container using `flex-1` without explicit height, causing zero dimensions.
**Fix**: Added explicit `width: '100%'` and `height: '100%'` to canvas container style.

### 3. Coordinate System Not Updating on Resize
**Problem**: Coordinate converter only recalculated on `pan`/`zoom` changes, not when canvas dimensions changed.
**Fix**: 
- Added `canvasSize` state to track canvas dimensions
- Added `ResizeObserver` to detect dimension changes
- Updated `coordinateConverter` dependencies to include `canvasSize`
- Added window resize listener as fallback

## Files Modified

1. **components/DraftsmanCanvas.tsx**:
   - Fixed duplicate `style` prop
   - Added `canvasSize` state
   - Added `ResizeObserver` for dimension tracking
   - Updated coordinate converter dependencies

2. **App.hardened.tsx**:
   - Added explicit width/height to canvas container

## Coordinate System Verification

The coordinate system (`ourmaths`) is now properly integrated:
- `CoordinateFrame` enum defines coordinate frames (WORLD, LOCAL, VIEWPORT, CANVAS)
- `CoordinateConverter` handles transformations between frames
- `createCanvasCoordinateConverter` creates converter from canvas state
- `screenToWorld` converts screen coordinates to world coordinates
- ResizeObserver ensures converter updates when canvas dimensions change

## Testing Checklist

- [ ] Canvas renders with correct dimensions
- [ ] Coordinate conversion works on initial render
- [ ] Coordinate conversion updates on canvas resize
- [ ] Coordinate conversion works when panning/zooming
- [ ] No console errors related to coordinate system
- [ ] Canvas is clickable and interactive

## Next Steps

1. Test MCP tools integration for debugging
2. Fix CSP violations for external resources
3. Verify z-stack layering is correct
4. Test panel positioning with coordinate system

