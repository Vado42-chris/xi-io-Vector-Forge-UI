/**
 * Matrix3 Unit Tests
 */

import { Matrix3 } from '../../../lib/ourmaths/Matrix3';
import { Vector2 } from '../../../lib/ourmaths/Vector2';

describe('Matrix3', () => {
  describe('construction', () => {
    it('should create identity matrix', () => {
      const m = Matrix3.identity();
      const point = new Vector2(1, 2);
      const transformed = m.applyToPoint(point);
      expect(transformed.x).toBeCloseTo(1, 10);
      expect(transformed.y).toBeCloseTo(2, 10);
    });
  });

  describe('fromTRS', () => {
    it('should create from translation only', () => {
      const m = Matrix3.fromTRS(10, 20, 0, 1, 1);
      const point = new Vector2(0, 0);
      const transformed = m.applyToPoint(point);
      expect(transformed.x).toBeCloseTo(10, 10);
      expect(transformed.y).toBeCloseTo(20, 10);
    });

    it('should create from rotation', () => {
      const m = Matrix3.fromTRS(0, 0, Math.PI / 2, 1, 1);
      const point = new Vector2(1, 0);
      const transformed = m.applyToPoint(point);
      expect(transformed.x).toBeCloseTo(0, 5);
      expect(transformed.y).toBeCloseTo(1, 5);
    });

    it('should create from scale', () => {
      const m = Matrix3.fromTRS(0, 0, 0, 2, 3);
      const point = new Vector2(1, 1);
      const transformed = m.applyToPoint(point);
      expect(transformed.x).toBeCloseTo(2, 10);
      expect(transformed.y).toBeCloseTo(3, 10);
    });

    it('should create from translation, rotation, scale', () => {
      const m = Matrix3.fromTRS(10, 20, Math.PI / 2, 2, 2);
      const point = new Vector2(1, 0);
      const transformed = m.applyToPoint(point);
      // Rotated 90°: (1,0) -> (0,1)
      // Scaled 2x: (0,1) -> (0,2)
      // Translated: (0,2) -> (10,22)
      expect(transformed.x).toBeCloseTo(10, 5);
      expect(transformed.y).toBeCloseTo(22, 5);
    });
  });

  describe('multiplication', () => {
    it('should multiply matrices', () => {
      const t1 = Matrix3.fromTranslation(10, 20);
      const t2 = Matrix3.fromTranslation(5, 5);
      const combined = t1.multiply(t2);
      const point = new Vector2(0, 0);
      const transformed = combined.applyToPoint(point);
      expect(transformed.x).toBeCloseTo(15, 10);
      expect(transformed.y).toBeCloseTo(25, 10);
    });
  });

  describe('inversion', () => {
    it('should invert translation matrix', () => {
      const m = Matrix3.fromTranslation(10, 20);
      const inv = m.invert();
      expect(inv).not.toBeNull();
      
      if (inv) {
        const point = new Vector2(15, 25);
        const transformed = inv.applyToPoint(point);
        expect(transformed.x).toBeCloseTo(5, 10);
        expect(transformed.y).toBeCloseTo(5, 10);
      }
    });

    it('should return null for singular matrix', () => {
      // Create a matrix with zero scale (singular)
      const m = Matrix3.fromScaling(0, 0);
      const inv = m.invert();
      expect(inv).toBeNull();
    });
  });

  describe('decomposition', () => {
    it('should decompose translation', () => {
      const m = Matrix3.fromTranslation(10, 20);
      const { translation } = m.decompose();
      expect(translation.x).toBeCloseTo(10, 10);
      expect(translation.y).toBeCloseTo(20, 10);
    });

    it('should decompose rotation', () => {
      const m = Matrix3.fromRotation(Math.PI / 4);
      const { rotation } = m.decompose();
      expect(rotation).toBeCloseTo(Math.PI / 4, 5);
    });

    it('should decompose scale', () => {
      const m = Matrix3.fromScaling(2, 3);
      const { scale } = m.decompose();
      expect(scale.x).toBeCloseTo(2, 5);
      expect(scale.y).toBeCloseTo(3, 5);
    });
  });

  describe('round-trip', () => {
    it('should preserve point through transform and inverse', () => {
      const original = new Vector2(5, 10);
      const m = Matrix3.fromTRS(10, 20, Math.PI / 4, 2, 2);
      const transformed = m.applyToPoint(original);
      const inv = m.invert();
      
      expect(inv).not.toBeNull();
      if (inv) {
        const restored = inv.applyToPoint(transformed);
        expect(restored.x).toBeCloseTo(original.x, 5);
        expect(restored.y).toBeCloseTo(original.y, 5);
      }
    });
  });
});

