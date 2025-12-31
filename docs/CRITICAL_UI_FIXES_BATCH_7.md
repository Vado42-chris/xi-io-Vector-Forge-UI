# Critical UI Fixes - Batch 7

## Issues Identified from Screenshot
1. **Construction Paper Layer Escaping**: Large light grey noisy texture covering left side and overlapping header
2. **Canvas Not Rendering**: Black rectangle with no content visible
3. **Sidebars Bunched Up**: Content clustered in top-left corners, unreadable
4. **Empty State Not Visible**: Canvas empty state text not showing

## Fixes Applied

### 1. Construction Paper Layer Containment
**File**: `styles/xibalba-design-language.css`, `components/LeftSidebar.tsx`
- Added `max-width: 100%`, `max-height: 100%`, `overflow: hidden` to `.construction-paper-layer-menu`
- Added explicit `position: relative` and `overflow: hidden` to parent container in `LeftSidebar.tsx`
- Added inline styles to construction paper layer div to ensure containment

### 2. Canvas Background Visibility
**File**: `components/DraftsmanCanvas.tsx`
- Added explicit `backgroundColor: 'var(--xibalba-grey-050)'` to canvas content wrapper style
- This ensures the canvas background is visible even if CSS classes don't apply

### 3. Empty State Visibility
**File**: `components/DraftsmanCanvas.tsx`
- Changed empty state opacity from `opacity-40` to inline `opacity: 0.8`
- Changed text colors from `text-[var(--xibalba-text-100)]` to `text-[var(--xibalba-text-000)]` for better contrast
- Added `z-10` to ensure empty state is above other layers

## MCP Tools Status
- **Found**: `config/mcpConfig.ts`, `services/mcpScriptService.ts`, `components/MCPSettings.tsx`
- **Purpose**: MCP tools are for script editing/AI assistance, not DOM inspection
- **Status**: Tools exist but are for code completion/validation, not UI debugging
- **Note**: Cursor's browser tools are being used for DOM inspection instead

## Coordinate System Verification
- **Status**: ✅ **VERIFIED**
- **Files**: `lib/ourmaths/CoordinateFrame.ts`, `utils/coordinateConverter.ts`
- **Implementation**: Correct coordinate frame system with WORLD, LOCAL, VIEWPORT, CANVAS frames
- **Integration**: Properly integrated with `DraftsmanCanvas` via `createCanvasCoordinateConverter`
- **ResizeObserver**: Added to update coordinate converter when canvas dimensions change

## Remaining Issues
1. Sidebar positioning - need to verify `panelVisibility` initialization
2. Canvas rendering - need to verify SVG is actually rendering
3. Layout structure - need to verify root container structure

## Next Steps
1. Verify `panelVisibility` state initialization
2. Check if SVG is rendering (even if empty)
3. Verify sidebar CSS classes are applying correctly
4. Test in browser after fixes

