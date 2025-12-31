/**
 * Vector2 Unit Tests
 */

import { Vector2 } from '../../../lib/ourmaths/Vector2';

describe('Vector2', () => {
  describe('construction', () => {
    it('should create zero vector by default', () => {
      const v = new Vector2();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
    });

    it('should create vector with values', () => {
      const v = new Vector2(1, 2);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
    });

    it('should clone vector', () => {
      const v1 = new Vector2(1, 2);
      const v2 = v1.clone();
      expect(v2.x).toBe(1);
      expect(v2.y).toBe(2);
      expect(v2).not.toBe(v1);
    });
  });

  describe('arithmetic', () => {
    it('should add vectors', () => {
      const a = new Vector2(1, 2);
      const b = new Vector2(3, 4);
      const c = a.add(b);
      expect(c.x).toBe(4);
      expect(c.y).toBe(6);
      expect(a.x).toBe(1); // Original unchanged
      expect(a.y).toBe(2);
    });

    it('should subtract vectors', () => {
      const a = new Vector2(5, 7);
      const b = new Vector2(2, 3);
      const c = a.sub(b);
      expect(c.x).toBe(3);
      expect(c.y).toBe(4);
    });

    it('should multiply by scalar', () => {
      const a = new Vector2(2, 3);
      const b = a.mul(2);
      expect(b.x).toBe(4);
      expect(b.y).toBe(6);
    });

    it('should divide by scalar', () => {
      const a = new Vector2(4, 6);
      const b = a.div(2);
      expect(b.x).toBe(2);
      expect(b.y).toBe(3);
    });

    it('should throw on division by zero', () => {
      const a = new Vector2(1, 2);
      expect(() => a.div(0)).toThrow('Division by zero');
    });
  });

  describe('dot and cross product', () => {
    it('should calculate dot product', () => {
      const a = new Vector2(1, 2);
      const b = new Vector2(3, 4);
      expect(a.dot(b)).toBe(11); // 1*3 + 2*4 = 11
    });

    it('should calculate cross product', () => {
      const a = new Vector2(1, 0);
      const b = new Vector2(0, 1);
      expect(a.cross(b)).toBe(1); // 1*1 - 0*0 = 1
    });
  });

  describe('length and normalization', () => {
    it('should calculate length', () => {
      const v = new Vector2(3, 4);
      expect(v.length()).toBe(5); // 3-4-5 triangle
    });

    it('should calculate squared length', () => {
      const v = new Vector2(3, 4);
      expect(v.lengthSq()).toBe(25);
    });

    it('should normalize vector', () => {
      const v = new Vector2(3, 4);
      const normalized = v.normalize();
      expect(normalized.length()).toBeCloseTo(1, 10);
      expect(normalized.x).toBeCloseTo(0.6, 10);
      expect(normalized.y).toBeCloseTo(0.8, 10);
    });

    it('should return zero vector when normalizing zero vector', () => {
      const v = new Vector2(0, 0);
      const normalized = v.normalize();
      expect(normalized.x).toBe(0);
      expect(normalized.y).toBe(0);
    });
  });

  describe('distance', () => {
    it('should calculate distance between vectors', () => {
      const a = new Vector2(0, 0);
      const b = new Vector2(3, 4);
      expect(a.distanceTo(b)).toBe(5);
    });

    it('should calculate squared distance', () => {
      const a = new Vector2(0, 0);
      const b = new Vector2(3, 4);
      expect(a.distanceToSq(b)).toBe(25);
    });
  });

  describe('rotation', () => {
    it('should calculate angle', () => {
      const v = new Vector2(1, 0);
      expect(v.angle()).toBe(0);
      
      const v2 = new Vector2(0, 1);
      expect(v2.angle()).toBeCloseTo(Math.PI / 2, 10);
    });

    it('should rotate vector', () => {
      const v = new Vector2(1, 0);
      const rotated = v.rotate(Math.PI / 2);
      expect(rotated.x).toBeCloseTo(0, 10);
      expect(rotated.y).toBeCloseTo(1, 10);
    });
  });

  describe('non-allocating operations', () => {
    it('should add vectors without allocation', () => {
      const a = new Vector2(1, 2);
      const b = new Vector2(3, 4);
      const out = new Vector2();
      Vector2.addTo(out, a, b);
      expect(out.x).toBe(4);
      expect(out.y).toBe(6);
    });

    it('should subtract vectors without allocation', () => {
      const a = new Vector2(5, 7);
      const b = new Vector2(2, 3);
      const out = new Vector2();
      Vector2.subTo(out, a, b);
      expect(out.x).toBe(3);
      expect(out.y).toBe(4);
    });

    it('should multiply by scalar without allocation', () => {
      const a = new Vector2(2, 3);
      const out = new Vector2();
      Vector2.mulTo(out, a, 2);
      expect(out.x).toBe(4);
      expect(out.y).toBe(6);
    });
  });

  describe('static methods', () => {
    it('should create from array', () => {
      const v = Vector2.fromArray([1, 2]);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
    });

    it('should create zero vector', () => {
      const v = Vector2.zero();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
    });

    it('should create unit vectors', () => {
      const x = Vector2.unitX();
      expect(x.x).toBe(1);
      expect(x.y).toBe(0);
      
      const y = Vector2.unitY();
      expect(y.x).toBe(0);
      expect(y.y).toBe(1);
    });
  });

  describe('conversion', () => {
    it('should convert to array', () => {
      const v = new Vector2(1, 2);
      const arr = v.toArray();
      expect(arr).toEqual([1, 2]);
    });

    it('should convert to Float32Array', () => {
      const v = new Vector2(1.5, 2.5);
      const arr = v.toFloat32Array();
      expect(arr.length).toBe(2);
      expect(arr[0]).toBeCloseTo(1.5, 5);
      expect(arr[1]).toBeCloseTo(2.5, 5);
    });

    it('should convert to Float64Array', () => {
      const v = new Vector2(1.5, 2.5);
      const arr = v.toFloat64Array();
      expect(arr.length).toBe(2);
      expect(arr[0]).toBe(1.5);
      expect(arr[1]).toBe(2.5);
    });
  });
});

