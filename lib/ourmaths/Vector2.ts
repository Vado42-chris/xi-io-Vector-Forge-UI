/**
 * Vector2 - 2D Vector Math
 * Immutable-friendly wrapper with non-allocating helpers for hot loops
 * 
 * #hashtag: math vector2 coordinate-system
 */

export class Vector2 {
  constructor(public x = 0, public y = 0) {}

  /**
   * Create a copy of this vector
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Set values (mutable, returns self for chaining)
   */
  set(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Add another vector (immutable)
   */
  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  /**
   * Subtract another vector (immutable)
   */
  sub(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  /**
   * Multiply by scalar (immutable)
   */
  mul(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  /**
   * Divide by scalar (immutable)
   */
  div(scalar: number): Vector2 {
    if (scalar === 0) throw new Error('Division by zero');
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  /**
   * Dot product
   */
  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Cross product (returns scalar for 2D)
   */
  cross(v: Vector2): number {
    return this.x * v.y - this.y * v.x;
  }

  /**
   * Length (magnitude)
   */
  length(): number {
    return Math.hypot(this.x, this.y);
  }

  /**
   * Squared length (faster, avoids sqrt)
   */
  lengthSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Normalize to unit vector (immutable)
   * Returns zero vector if length is zero
   */
  normalize(): Vector2 {
    const l = this.length();
    return l > 0 ? new Vector2(this.x / l, this.y / l) : new Vector2(0, 0);
  }

  /**
   * Distance to another vector
   */
  distanceTo(v: Vector2): number {
    return this.sub(v).length();
  }

  /**
   * Squared distance (faster, avoids sqrt)
   */
  distanceToSq(v: Vector2): number {
    return this.sub(v).lengthSq();
  }

  /**
   * Angle in radians
   */
  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Rotate by angle in radians (immutable)
   */
  rotate(angle: number): Vector2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  /**
   * Convert to array [x, y]
   */
  toArray(): [number, number] {
    return [this.x, this.y];
  }

  /**
   * Convert to Float32Array (for GPU)
   */
  toFloat32Array(): Float32Array {
    return new Float32Array([this.x, this.y]);
  }

  /**
   * Convert to Float64Array (for high precision)
   */
  toFloat64Array(): Float64Array {
    return new Float64Array([this.x, this.y]);
  }

  /**
   * Non-allocating add (for hot loops)
   * Mutates `out` and returns it
   */
  static addTo(out: Vector2, a: Vector2, b: Vector2): Vector2 {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
  }

  /**
   * Non-allocating subtract (for hot loops)
   */
  static subTo(out: Vector2, a: Vector2, b: Vector2): Vector2 {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    return out;
  }

  /**
   * Non-allocating multiply by scalar (for hot loops)
   */
  static mulTo(out: Vector2, a: Vector2, scalar: number): Vector2 {
    out.x = a.x * scalar;
    out.y = a.y * scalar;
    return out;
  }

  /**
   * Create from array [x, y]
   */
  static fromArray(arr: [number, number] | number[]): Vector2 {
    return new Vector2(arr[0] || 0, arr[1] || 0);
  }

  /**
   * Zero vector
   */
  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  /**
   * Unit vector in X direction
   */
  static unitX(): Vector2 {
    return new Vector2(1, 0);
  }

  /**
   * Unit vector in Y direction
   */
  static unitY(): Vector2 {
    return new Vector2(0, 1);
  }
}

