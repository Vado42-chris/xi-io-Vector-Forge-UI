/**
 * Transform - High-level Transform Wrapper
 * Composable, invertible transforms for VectorForge
 * 
 * #hashtag: math transform coordinate-system
 */

import { Matrix3 } from './Matrix3';
import { Vector2 } from './Vector2';

/**
 * Transform class - wraps Matrix3 with higher-level API
 * 
 * Usage:
 * ```typescript
 * const t1 = Transform.fromTranslation(10, 20);
 * const t2 = Transform.fromRotation(Math.PI / 4);
 * const combined = t1.compose(t2);
 * const point = combined.applyToPoint(new Vector2(5, 5));
 * ```
 */
export class Transform {
  constructor(public matrix: Matrix3 = Matrix3.identity()) {}

  /**
   * Create from translation
   */
  static fromTranslation(tx: number, ty: number): Transform {
    return new Transform(Matrix3.fromTranslation(tx, ty));
  }

  /**
   * Create from rotation (in radians)
   */
  static fromRotation(angle: number): Transform {
    return new Transform(Matrix3.fromRotation(angle));
  }

  /**
   * Create from scale
   */
  static fromScale(sx: number, sy: number = sx): Transform {
    return new Transform(Matrix3.fromScaling(sx, sy));
  }

  /**
   * Create from translation, rotation, scale (TRS)
   */
  static fromTRS(
    tx: number,
    ty: number,
    rotation: number = 0,
    sx: number = 1,
    sy: number = 1
  ): Transform {
    return new Transform(Matrix3.fromTRS(tx, ty, rotation, sx, sy));
  }

  /**
   * Compose with another transform (this * other)
   * Returns new Transform
   */
  compose(other: Transform): Transform {
    return new Transform(this.matrix.multiply(other.matrix));
  }

  /**
   * Invert this transform
   * Returns null if transform is singular (non-invertible)
   */
  invert(): Transform | null {
    const inv = this.matrix.invert();
    return inv ? new Transform(inv) : null;
  }

  /**
   * Apply transform to a point
   * Returns new Vector2
   */
  applyToPoint(point: Vector2 | [number, number]): Vector2 {
    return this.matrix.applyToPoint(point);
  }

  /**
   * Apply transform to a point (non-allocating)
   * Mutates `out` and returns it
   */
  applyToPointTo(out: Vector2, point: Vector2 | [number, number]): Vector2 {
    return this.matrix.applyToPointTo(out, point);
  }

  /**
   * Get translation component
   */
  getTranslation(): Vector2 {
    return this.matrix.getTranslation();
  }

  /**
   * Get rotation component (in radians)
   */
  getRotation(): number {
    return this.matrix.getRotation();
  }

  /**
   * Get scale component
   */
  getScale(): Vector2 {
    return this.matrix.getScale();
  }

  /**
   * Decompose into translation, rotation, scale
   */
  decompose(): { translation: Vector2; rotation: number; scale: Vector2 } {
    return this.matrix.decompose();
  }

  /**
   * Clone this transform
   */
  clone(): Transform {
    return new Transform(this.matrix.clone());
  }

  /**
   * Identity transform
   */
  static identity(): Transform {
    return new Transform(Matrix3.identity());
  }
}

