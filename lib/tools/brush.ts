/**
 * Brush Tool - Core Implementation
 * Variable width strokes with pressure simulation
 * Headless core (no React dependencies)
 * 
 * #hashtag: tools brush drawing pressure
 */

export interface BrushPoint {
  x: number;
  y: number;
  pressure: number; // 0-1, simulated from velocity if not available
  timestamp: number;
}

export interface BrushStroke {
  id: string;
  points: BrushPoint[];
  minWidth: number;
  maxWidth: number;
  color: string;
  opacity: number;
  startTime: number;
  endTime: number;
}

export interface BrushConfig {
  minWidth?: number;
  maxWidth?: number;
  pressureSensitivity?: number; // 0-1, how much velocity affects width
  smoothing?: number; // 0-1, smoothing factor
  pointCompression?: boolean; // Remove redundant points
  color?: string;
  opacity?: number;
}

class BrushTool {
  private currentStroke: BrushPoint[] = [];
  private strokeHistory: BrushStroke[] = [];
  private undoStack: BrushStroke[] = [];
  private config: Required<BrushConfig>;
  private lastPoint: BrushPoint | null = null;
  private lastVelocity: number = 0;

  constructor(config: BrushConfig = {}) {
    this.config = {
      minWidth: config.minWidth ?? 2,
      maxWidth: config.maxWidth ?? 20,
      pressureSensitivity: config.pressureSensitivity ?? 0.7,
      smoothing: config.smoothing ?? 0.3,
      pointCompression: config.pointCompression ?? true,
      color: config.color ?? '#ff9800',
      opacity: config.opacity ?? 1.0,
    };
  }

  /**
   * Start a new stroke
   */
  startStroke(x: number, y: number, pressure?: number): void {
    this.currentStroke = [];
    this.lastPoint = null;
    this.lastVelocity = 0;
    
    const point: BrushPoint = {
      x,
      y,
      pressure: pressure ?? 0.5,
      timestamp: Date.now(),
    };
    
    this.currentStroke.push(point);
    this.lastPoint = point;
  }

  /**
   * Add a point to the current stroke
   * Simulates pressure from velocity if pressure not provided
   */
  addPoint(x: number, y: number, pressure?: number): void {
    if (this.currentStroke.length === 0) {
      this.startStroke(x, y, pressure);
      return;
    }

    const now = Date.now();
    let simulatedPressure = pressure;

    // Simulate pressure from velocity if not provided
    if (simulatedPressure === undefined && this.lastPoint) {
      const dx = x - this.lastPoint.x;
      const dy = y - this.lastPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const timeDelta = now - this.lastPoint.timestamp;
      const velocity = timeDelta > 0 ? distance / timeDelta : 0;

      // Smooth velocity changes
      this.lastVelocity = this.lastVelocity * 0.7 + velocity * 0.3;

      // Map velocity to pressure (faster = less pressure = thinner)
      // Invert: slow = high pressure, fast = low pressure
      const normalizedVelocity = Math.min(this.lastVelocity / 10, 1); // Normalize to 0-1
      simulatedPressure = 1 - (normalizedVelocity * this.config.pressureSensitivity);
      simulatedPressure = Math.max(0.1, Math.min(1, simulatedPressure));
    } else if (simulatedPressure === undefined) {
      simulatedPressure = 0.5;
    }

    // Apply smoothing
    let smoothedX = x;
    let smoothedY = y;
    if (this.lastPoint && this.config.smoothing > 0) {
      smoothedX = this.lastPoint.x + (x - this.lastPoint.x) * (1 - this.config.smoothing);
      smoothedY = this.lastPoint.y + (y - this.lastPoint.y) * (1 - this.config.smoothing);
    }

    const point: BrushPoint = {
      x: smoothedX,
      y: smoothedY,
      pressure: simulatedPressure,
      timestamp: now,
    };

    // Point compression: skip if too close to last point
    if (this.config.pointCompression && this.lastPoint) {
      const dx = point.x - this.lastPoint.x;
      const dy = point.y - this.lastPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 0.5) {
        // Update last point pressure if this one is more extreme
        if (Math.abs(point.pressure - 0.5) > Math.abs(this.lastPoint.pressure - 0.5)) {
          this.currentStroke[this.currentStroke.length - 1].pressure = point.pressure;
        }
        return;
      }
    }

    this.currentStroke.push(point);
    this.lastPoint = point;
  }

  /**
   * End the current stroke and add it to history
   */
  endStroke(): BrushStroke | null {
    if (this.currentStroke.length < 2) {
      this.currentStroke = [];
      this.lastPoint = null;
      return null;
    }

    const stroke: BrushStroke = {
      id: `brush_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      points: [...this.currentStroke],
      minWidth: this.config.minWidth,
      maxWidth: this.config.maxWidth,
      color: this.config.color,
      opacity: this.config.opacity,
      startTime: this.currentStroke[0].timestamp,
      endTime: this.currentStroke[this.currentStroke.length - 1].timestamp,
    };

    this.strokeHistory.push(stroke);
    this.currentStroke = [];
    this.lastPoint = null;
    this.undoStack = []; // Clear redo stack on new action

    return stroke;
  }

  /**
   * Get current stroke (for preview)
   */
  getCurrentStroke(): BrushPoint[] {
    return [...this.currentStroke];
  }

  /**
   * Get all completed strokes
   */
  getStrokes(): BrushStroke[] {
    return [...this.strokeHistory];
  }

  /**
   * Undo last stroke
   */
  undo(): BrushStroke | null {
    if (this.strokeHistory.length === 0) {
      return null;
    }

    const stroke = this.strokeHistory.pop()!;
    this.undoStack.push(stroke);
    return stroke;
  }

  /**
   * Redo last undone stroke
   */
  redo(): BrushStroke | null {
    if (this.undoStack.length === 0) {
      return null;
    }

    const stroke = this.undoStack.pop()!;
    this.strokeHistory.push(stroke);
    return stroke;
  }

  /**
   * Clear all strokes
   */
  clear(): void {
    this.strokeHistory = [];
    this.undoStack = [];
    this.currentStroke = [];
    this.lastPoint = null;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<BrushConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): Required<BrushConfig> {
    return { ...this.config };
  }

  /**
   * Convert stroke to SVG path with variable width
   * Uses stroke-width variation per point
   */
  strokeToSvgPath(stroke: BrushStroke): string {
    if (stroke.points.length < 2) {
      return '';
    }

    // For variable width, we'll use stroke-width animation or multiple paths
    // For MVP, we'll create a path with average width and add width metadata
    const pathParts: string[] = [];
    
    stroke.points.forEach((point, index) => {
      const width = this.config.minWidth + 
        (point.pressure * (this.config.maxWidth - this.config.minWidth));
      
      if (index === 0) {
        pathParts.push(`M ${point.x} ${point.y}`);
      } else {
        // Use quadratic curves for smoother strokes
        if (index === 1) {
          pathParts.push(`L ${point.x} ${point.y}`);
        } else {
          const prev = stroke.points[index - 1];
          const midX = (prev.x + point.x) / 2;
          const midY = (prev.y + point.y) / 2;
          pathParts.push(`Q ${prev.x} ${prev.y} ${midX} ${midY}`);
        }
      }
    });

    // Close the path smoothly
    if (stroke.points.length > 2) {
      const last = stroke.points[stroke.points.length - 1];
      const secondLast = stroke.points[stroke.points.length - 2];
      pathParts.push(`L ${last.x} ${last.y}`);
    }

    return pathParts.join(' ');
  }

  /**
   * Convert all strokes to SVG paths
   */
  strokesToSvgPaths(): string[] {
    return this.strokeHistory.map(stroke => this.strokeToSvgPath(stroke));
  }

  /**
   * Get stroke width at a specific point
   */
  getStrokeWidth(pressure: number): number {
    return this.config.minWidth + 
      (pressure * (this.config.maxWidth - this.config.minWidth));
  }
}

export default BrushTool;



