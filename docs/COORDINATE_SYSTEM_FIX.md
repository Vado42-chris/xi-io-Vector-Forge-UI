# Coordinate System Fix

## Issue
The coordinate converter was not updating when canvas dimensions changed, causing coordinate calculations to fail when the canvas was resized or initially rendered with zero dimensions.

## Root Cause
1. `coordinateConverter` was only recalculated when `pan` or `zoom` changed
2. Canvas dimensions were not tracked, so resizing didn't trigger recalculation
3. If canvas had zero dimensions initially, `getBoundingClientRect()` would return invalid values

## Fix Applied
1. **Added canvas size state**: `canvasSize` state tracks canvas width and height
2. **Added ResizeObserver**: Detects when canvas dimensions change
3. **Updated coordinateConverter dependencies**: Now depends on `canvasSize.width` and `canvasSize.height` in addition to `pan` and `zoom`
4. **Initial size check**: Checks canvas size on mount and updates state

## Files Modified
- `components/DraftsmanCanvas.tsx`:
  - Added `canvasSize` state
  - Added `ResizeObserver` to track canvas dimension changes
  - Updated `coordinateConverter` dependencies to include `canvasSize`
  - Added window resize listener as fallback

## Testing
- Verify coordinate conversion works when canvas is resized
- Verify coordinate conversion works on initial render
- Verify coordinate conversion works when panning/zooming
- Test with different canvas sizes

## Related
- `lib/ourmaths/CoordinateFrame.ts` - Coordinate system implementation
- `utils/coordinateConverter.ts` - Coordinate converter utilities

