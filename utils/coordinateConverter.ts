/**
 * Coordinate Converter Utility
 * Adapter for integrating ourmaths with DraftsmanCanvas
 * 
 * #hashtag: math coordinate-system integration
 */

import { CoordinateConverter, CoordinateFrame } from '../lib/ourmaths/CoordinateFrame';
import { Vector2 } from '../lib/ourmaths/Vector2';

/**
 * Create coordinate converter from canvas state
 * Updates viewport-to-world transform based on pan, zoom, and canvas dimensions
 */
export function createCanvasCoordinateConverter(
  pan: { x: number; y: number },
  zoom: number,
  canvasRect: DOMRect | null
): CoordinateConverter {
  const converter = new CoordinateConverter();
  
  if (canvasRect) {
    const canvasCenter = new Vector2(canvasRect.width / 2, canvasRect.height / 2);
    const panVector = new Vector2(pan.x, pan.y);
    converter.setViewportToWorld(panVector, zoom, canvasCenter);
  }
  
  return converter;
}

/**
 * Convert screen coordinates to canvas world coordinates
 * This replaces the ad-hoc getCanvasCoords() function
 * 
 * @param clientX - Screen X coordinate
 * @param clientY - Screen Y coordinate
 * @param converter - Coordinate converter with viewport-to-world transform set
 * @param canvasRect - Canvas element bounding rect
 * @returns World coordinates { x, y }
 */
export function screenToWorld(
  clientX: number,
  clientY: number,
  converter: CoordinateConverter,
  canvasRect: DOMRect | null
): { x: number; y: number } {
  if (!canvasRect) {
    return { x: 0, y: 0 };
  }

  // Convert screen coordinates to viewport coordinates (relative to canvas element)
  const viewportX = clientX - canvasRect.left;
  const viewportY = clientY - canvasRect.top;
  const viewportPoint = new Vector2(viewportX, viewportY);

  // Convert viewport to world
  const worldPoint = converter.viewportToWorld(viewportPoint);

  return { x: worldPoint.x, y: worldPoint.y };
}

/**
 * Convert world coordinates to screen coordinates
 * Inverse of screenToWorld
 * 
 * @param worldX - World X coordinate
 * @param worldY - World Y coordinate
 * @param converter - Coordinate converter with world-to-viewport transform
 * @param canvasRect - Canvas element bounding rect
 * @returns Screen coordinates { x, y }
 */
export function worldToScreen(
  worldX: number,
  worldY: number,
  converter: CoordinateConverter,
  canvasRect: DOMRect | null
): { x: number; y: number } {
  if (!canvasRect) {
    return { x: 0, y: 0 };
  }

  const worldPoint = new Vector2(worldX, worldY);
  const viewportPoint = converter.worldToViewport(worldPoint);

  // Convert viewport to screen coordinates
  return {
    x: viewportPoint.x + canvasRect.left,
    y: viewportPoint.y + canvasRect.top
  };
}

