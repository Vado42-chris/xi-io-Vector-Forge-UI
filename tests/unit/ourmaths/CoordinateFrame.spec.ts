/**
 * CoordinateFrame Unit Tests
 */

import { CoordinateFrame, CoordinateConverter } from '../../../lib/ourmaths/CoordinateFrame';
import { Vector2 } from '../../../lib/ourmaths/Vector2';
import { Matrix3 } from '../../../lib/ourmaths/Matrix3';

describe('CoordinateConverter', () => {
  let converter: CoordinateConverter;

  beforeEach(() => {
    converter = new CoordinateConverter();
  });

  describe('basic conversion', () => {
    it('should return same point for same frame', () => {
      const point = new Vector2(10, 20);
      const result = converter.convert(point, CoordinateFrame.WORLD, CoordinateFrame.WORLD);
      expect(result.x).toBe(10);
      expect(result.y).toBe(20);
    });

    it('should use identity when no transform set', () => {
      const point = new Vector2(10, 20);
      const result = converter.convert(point, CoordinateFrame.WORLD, CoordinateFrame.VIEWPORT);
      expect(result.x).toBe(10);
      expect(result.y).toBe(20);
    });
  });

  describe('viewport to world', () => {
    it('should convert viewport to world with pan/zoom', () => {
      const pan = new Vector2(100, 200);
      const zoom = 200; // 200% = 2x scale
      const canvasCenter = new Vector2(400, 300); // Canvas center in viewport
      
      converter.setViewportToWorld(pan, zoom, canvasCenter);
      
      // Viewport point at canvas center should map to world position after accounting for pan
      const viewportCenter = new Vector2(400, 300);
      const worldPos = converter.viewportToWorld(viewportCenter);
      
      // Original formula: (viewport - canvasCenter - pan) / zoomScale
      // (400, 300) - (400, 300) - (100, 200) = (-100, -200)
      // (-100, -200) / 2 = (-50, -100)
      expect(worldPos.x).toBeCloseTo(-50, 5);
      expect(worldPos.y).toBeCloseTo(-100, 5);
    });
  });

  describe('transform caching', () => {
    it('should cache inverse transforms', () => {
      const transform = Matrix3.fromTranslation(10, 20);
      converter.setTransform(CoordinateFrame.WORLD, CoordinateFrame.VIEWPORT, transform);
      
      // First call should compute and cache inverse
      const point = new Vector2(15, 25);
      const result1 = converter.convert(point, CoordinateFrame.VIEWPORT, CoordinateFrame.WORLD);
      
      // Second call should use cached inverse
      const result2 = converter.convert(point, CoordinateFrame.VIEWPORT, CoordinateFrame.WORLD);
      
      expect(result1.x).toBeCloseTo(result2.x, 10);
      expect(result1.y).toBeCloseTo(result2.y, 10);
    });
  });
});

