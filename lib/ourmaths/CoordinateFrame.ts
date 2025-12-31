/**
 * CoordinateFrame - Coordinate Frame System
 * Defines explicit coordinate frames for VectorForge
 * 
 * #hashtag: math coordinate-frame coordinate-system
 */

import { Matrix3 } from './Matrix3';
import { Vector2 } from './Vector2';

/**
 * Coordinate frames in VectorForge
 * 
 * - WORLD: Absolute world coordinates (canvas space, origin at center)
 * - LOCAL: Object-local coordinates (relative to object origin)
 * - VIEWPORT: Screen/viewport coordinates (pixels, origin at top-left)
 * - CANVAS: Canvas element coordinates (relative to canvas element, origin at top-left)
 */
export enum CoordinateFrame {
  WORLD = 'WORLD',
  LOCAL = 'LOCAL',
  VIEWPORT = 'VIEWPORT',
  CANVAS = 'CANVAS'
}

/**
 * Frame transform definition
 * Stores a transform matrix between two coordinate frames
 */
export interface FrameTransform {
  from: CoordinateFrame;
  to: CoordinateFrame;
  matrix: Matrix3;
}

/**
 * CoordinateConverter - Convert between coordinate frames
 * 
 * Usage:
 * ```typescript
 * const converter = new CoordinateConverter();
 * converter.setViewportToWorld(viewTransform);
 * const worldPos = converter.viewportToWorld(viewportPos);
 * ```
 */
export class CoordinateConverter {
  private transforms: Map<string, Matrix3> = new Map();

  /**
   * Set transform from one frame to another
   */
  setTransform(from: CoordinateFrame, to: CoordinateFrame, matrix: Matrix3): void {
    const key = `${from}->${to}`;
    this.transforms.set(key, matrix);
  }

  /**
   * Get transform from one frame to another
   * Returns identity if not set
   */
  getTransform(from: CoordinateFrame, to: CoordinateFrame): Matrix3 {
    if (from === to) {
      return Matrix3.identity();
    }

    const key = `${from}->${to}`;
    const direct = this.transforms.get(key);
    if (direct) {
      return direct;
    }

    // Try inverse
    const inverseKey = `${to}->${from}`;
    const inverse = this.transforms.get(inverseKey);
    if (inverse) {
      const inv = inverse.invert();
      if (inv) {
        this.setTransform(from, to, inv); // Cache
        return inv;
      }
    }

    // Default to identity if no transform found
    return Matrix3.identity();
  }

  /**
   * Convert point from one frame to another
   */
  convert(point: Vector2, from: CoordinateFrame, to: CoordinateFrame): Vector2 {
    if (from === to) {
      return point.clone();
    }

    const transform = this.getTransform(from, to);
    return transform.applyToPoint(point);
  }

  /**
   * Convenience: Viewport to World
   */
  viewportToWorld(point: Vector2): Vector2 {
    return this.convert(point, CoordinateFrame.VIEWPORT, CoordinateFrame.WORLD);
  }

  /**
   * Convenience: World to Viewport
   */
  worldToViewport(point: Vector2): Vector2 {
    return this.convert(point, CoordinateFrame.WORLD, CoordinateFrame.VIEWPORT);
  }

  /**
   * Convenience: Canvas to World
   */
  canvasToWorld(point: Vector2): Vector2 {
    return this.convert(point, CoordinateFrame.CANVAS, CoordinateFrame.WORLD);
  }

  /**
   * Convenience: World to Canvas
   */
  worldToCanvas(point: Vector2): Vector2 {
    return this.convert(point, CoordinateFrame.WORLD, CoordinateFrame.CANVAS);
  }

  /**
   * Convenience: Viewport to Canvas
   */
  viewportToCanvas(point: Vector2): Vector2 {
    return this.convert(point, CoordinateFrame.VIEWPORT, CoordinateFrame.CANVAS);
  }

  /**
   * Convenience: Canvas to Viewport
   */
  canvasToViewport(point: Vector2): Vector2 {
    return this.convert(point, CoordinateFrame.CANVAS, CoordinateFrame.VIEWPORT);
  }

  /**
   * Set viewport to world transform from pan/zoom
   * This is the main transform used in VectorForge canvas
   */
  setViewportToWorld(pan: Vector2, zoom: number, canvasCenter: Vector2): void {
    // Viewport coordinates: origin at top-left, pixels
    // World coordinates: origin at canvas center, world units
    
    const zoomScale = zoom / 100; // Convert percentage to scale
    
    // Transform: 
    // 1. Translate viewport point relative to canvas element (viewport -> canvas)
    // 2. Translate to canvas center (canvas -> world origin)
    // 3. Apply pan offset
    // 4. Scale by zoom
    
    // Combined: (viewport - canvasCenter) / zoomScale - pan
    // Or: viewport / zoomScale - (canvasCenter / zoomScale + pan)
    
    const transform = Matrix3.identity()
      .multiply(Matrix3.fromScaling(1 / zoomScale, 1 / zoomScale))
      .multiply(Matrix3.fromTranslation(-pan.x, -pan.y))
      .multiply(Matrix3.fromTranslation(-canvasCenter.x, -canvasCenter.y));
    
    this.setTransform(CoordinateFrame.VIEWPORT, CoordinateFrame.WORLD, transform);
  }

  /**
   * Clear all transforms
   */
  clear(): void {
    this.transforms.clear();
  }
}

