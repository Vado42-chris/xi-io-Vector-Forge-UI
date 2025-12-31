/**
 * Transform Unit Tests
 */

import { Transform } from '../../../lib/ourmaths/Transform';
import { Vector2 } from '../../../lib/ourmaths/Vector2';

describe('Transform', () => {
  describe('construction', () => {
    it('should create identity transform', () => {
      const t = Transform.identity();
      const point = new Vector2(1, 2);
      const transformed = t.applyToPoint(point);
      expect(transformed.x).toBeCloseTo(1, 10);
      expect(transformed.y).toBeCloseTo(2, 10);
    });

    it('should create from translation', () => {
      const t = Transform.fromTranslation(10, 20);
      const point = new Vector2(0, 0);
      const transformed = t.applyToPoint(point);
      expect(transformed.x).toBeCloseTo(10, 10);
      expect(transformed.y).toBeCloseTo(20, 10);
    });

    it('should create from rotation', () => {
      const t = Transform.fromRotation(Math.PI / 2);
      const point = new Vector2(1, 0);
      const transformed = t.applyToPoint(point);
      expect(transformed.x).toBeCloseTo(0, 5);
      expect(transformed.y).toBeCloseTo(1, 5);
    });

    it('should create from scale', () => {
      const t = Transform.fromScale(2, 3);
      const point = new Vector2(1, 1);
      const transformed = t.applyToPoint(point);
      expect(transformed.x).toBeCloseTo(2, 10);
      expect(transformed.y).toBeCloseTo(3, 10);
    });
  });

  describe('composition', () => {
    it('should compose transforms', () => {
      const t1 = Transform.fromTranslation(10, 20);
      const t2 = Transform.fromTranslation(5, 5);
      const combined = t1.compose(t2);
      const point = new Vector2(0, 0);
      const transformed = combined.applyToPoint(point);
      expect(transformed.x).toBeCloseTo(15, 10);
      expect(transformed.y).toBeCloseTo(25, 10);
    });
  });

  describe('inversion', () => {
    it('should invert transform', () => {
      const t = Transform.fromTranslation(10, 20);
      const inv = t.invert();
      expect(inv).not.toBeNull();
      
      if (inv) {
        const point = new Vector2(15, 25);
        const transformed = inv.applyToPoint(point);
        expect(transformed.x).toBeCloseTo(5, 10);
        expect(transformed.y).toBeCloseTo(5, 10);
      }
    });
  });

  describe('decomposition', () => {
    it('should decompose translation', () => {
      const t = Transform.fromTranslation(10, 20);
      const { translation } = t.decompose();
      expect(translation.x).toBeCloseTo(10, 10);
      expect(translation.y).toBeCloseTo(20, 10);
    });
  });
});

