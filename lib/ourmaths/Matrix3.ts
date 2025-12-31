/**
 * Matrix3 - 2D Homogeneous Transform Matrix (3x3)
 * Wraps gl-matrix for 2D transforms
 * 
 * #hashtag: math matrix3 transform coordinate-system
 */

import { mat3, vec2 } from 'gl-matrix';
import { Vector2 } from './Vector2';

export class Matrix3 {
  /**
   * Internal matrix storage (column-major, 9 elements)
   * [0, 3, 6]   [a, c, tx]
   * [1, 4, 7] = [b, d, ty]
   * [2, 5, 8]   [0, 0,  1]
   */
  private m: mat3;

  constructor(matrix?: mat3) {
    this.m = matrix ? mat3.clone(matrix) : mat3.create();
  }

  /**
   * Create identity matrix
   */
  static identity(): Matrix3 {
    const out = new Matrix3();
    mat3.identity(out.m);
    return out;
  }

  /**
   * Create from translation, rotation, scale (TRS)
   * Order: Translate * Rotate * Scale
   */
  static fromTRS(
    tx: number,
    ty: number,
    rotation: number = 0,
    sx: number = 1,
    sy: number = 1
  ): Matrix3 {
    const out = new Matrix3();
    
    // Start with identity
    mat3.identity(out.m);
    
    // Apply translation
    mat3.translate(out.m, out.m, [tx, ty]);
    
    // Apply rotation (around origin, then translate)
    if (rotation !== 0) {
      const rotMat = mat3.create();
      mat3.rotate(rotMat, mat3.create(), rotation);
      mat3.multiply(out.m, out.m, rotMat);
    }
    
    // Apply scale
    if (sx !== 1 || sy !== 1) {
      const scaleMat = mat3.create();
      mat3.fromScaling(scaleMat, [sx, sy]);
      mat3.multiply(out.m, out.m, scaleMat);
    }
    
    return out;
  }

  /**
   * Create from translation only
   */
  static fromTranslation(tx: number, ty: number): Matrix3 {
    const out = new Matrix3();
    mat3.fromTranslation(out.m, [tx, ty]);
    return out;
  }

  /**
   * Create from rotation only (in radians)
   */
  static fromRotation(angle: number): Matrix3 {
    const out = new Matrix3();
    mat3.fromRotation(out.m, angle);
    return out;
  }

  /**
   * Create from scale only
   */
  static fromScaling(sx: number, sy: number): Matrix3 {
    const out = new Matrix3();
    mat3.fromScaling(out.m, [sx, sy]);
    return out;
  }

  /**
   * Multiply with another matrix (this * other)
   * Returns new matrix
   */
  multiply(other: Matrix3): Matrix3 {
    const out = new Matrix3();
    mat3.multiply(out.m, this.m, other.m);
    return out;
  }

  /**
   * Invert this matrix
   * Returns null if matrix is singular (non-invertible)
   */
  invert(): Matrix3 | null {
    const out = new Matrix3();
    const success = mat3.invert(out.m, this.m);
    return success ? out : null;
  }

  /**
   * Apply transform to a point
   * Returns new Vector2
   */
  applyToPoint(point: Vector2 | [number, number]): Vector2 {
    const v = vec2.create();
    const p = point instanceof Vector2 ? point.toArray() : point;
    vec2.transformMat3(v, p, this.m);
    return new Vector2(v[0], v[1]);
  }

  /**
   * Apply transform to a point (non-allocating)
   * Mutates `out` and returns it
   */
  applyToPointTo(out: Vector2, point: Vector2 | [number, number]): Vector2 {
    const v = vec2.create();
    const p = point instanceof Vector2 ? point.toArray() : point;
    vec2.transformMat3(v, p, this.m);
    out.set(v[0], v[1]);
    return out;
  }

  /**
   * Get translation component
   */
  getTranslation(): Vector2 {
    return new Vector2(this.m[6], this.m[7]);
  }

  /**
   * Get scale component (approximate, assumes uniform scale)
   */
  getScale(): Vector2 {
    const sx = Math.hypot(this.m[0], this.m[1]);
    const sy = Math.hypot(this.m[3], this.m[4]);
    return new Vector2(sx, sy);
  }

  /**
   * Get rotation component (in radians)
   */
  getRotation(): number {
    return Math.atan2(this.m[1], this.m[0]);
  }

  /**
   * Decompose into translation, rotation, scale
   */
  decompose(): { translation: Vector2; rotation: number; scale: Vector2 } {
    return {
      translation: this.getTranslation(),
      rotation: this.getRotation(),
      scale: this.getScale()
    };
  }

  /**
   * Clone this matrix
   */
  clone(): Matrix3 {
    return new Matrix3(this.m);
  }

  /**
   * Get internal matrix (for gl-matrix interop)
   */
  getMatrix(): mat3 {
    return mat3.clone(this.m);
  }

  /**
   * Convert to CSS transform string
   */
  toCSSTransform(): string {
    const [a, b, c, d, e, f] = [
      this.m[0], this.m[1],
      this.m[3], this.m[4],
      this.m[6], this.m[7]
    ];
    return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
  }

  /**
   * Convert to Float32Array (for GPU)
   */
  toFloat32Array(): Float32Array {
    return new Float32Array(this.m);
  }
}

