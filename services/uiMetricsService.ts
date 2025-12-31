/**
 * UI Metrics Service - Patent-Safe Tracking
 * Tracks UI interactions, calculations per minute, and usability metrics
 * 
 * PATENT-SAFE: No personal identifiers, aggregate patterns only
 * #hashtag: ui-metrics tracking patent-safe usability
 */

export interface ClickPattern {
  elementType: string; // 'button', 'input', 'select', etc.
  componentName: string; // Component identifier (e.g., 'LeftSidebar', 'ToolButton')
  interactionType: 'click' | 'hover' | 'focus' | 'drag' | 'resize';
  timestamp: number;
  // NO personal identifiers
  // NO user-specific data
  // Aggregate patterns only
}

export interface CalculationMetrics {
  calculationsPerMinute: number;
  averageCalculationTime: number; // milliseconds
  peakCalculationRate: number;
  totalCalculations: number;
  timestamp: number;
  // Performance metrics only
  // No personal data
}

export interface UIMetrics {
  clickPatterns: ClickPattern[];
  calculationMetrics: CalculationMetrics;
  errorCount: number;
  heuristicViolations: number;
  timestamp: number;
}

class UIMetricsService {
  private clickPatterns: ClickPattern[] = [];
  private calculationMetrics: CalculationMetrics = {
    calculationsPerMinute: 0,
    averageCalculationTime: 0,
    peakCalculationRate: 0,
    totalCalculations: 0,
    timestamp: Date.now(),
  };
  private calculationTimes: number[] = [];
  private calculationWindow: number[] = []; // Last minute of calculations
  private storageKey = 'vectorforge-ui-metrics';
  private maxPatterns = 1000; // Limit stored patterns
  private metricsInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadMetrics();
    this.startMetricsCollection();
  }

  /**
   * Track a click/interaction pattern (Patent-Safe)
   */
  trackClick(
    elementType: string,
    componentName: string,
    interactionType: ClickPattern['interactionType'] = 'click'
  ): void {
    const pattern: ClickPattern = {
      elementType,
      componentName,
      interactionType,
      timestamp: Date.now(),
    };

    this.clickPatterns.push(pattern);

    // Limit stored patterns
    if (this.clickPatterns.length > this.maxPatterns) {
      this.clickPatterns = this.clickPatterns.slice(-this.maxPatterns);
    }

    // Save periodically (not on every click for performance)
    if (this.clickPatterns.length % 10 === 0) {
      this.saveMetrics();
    }
  }

  /**
   * Track a calculation (for calculations per minute)
   */
  trackCalculation(calculationTime: number): void {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Add to window
    this.calculationWindow.push(now);
    this.calculationTimes.push(calculationTime);

    // Remove calculations older than 1 minute
    this.calculationWindow = this.calculationWindow.filter(t => t > oneMinuteAgo);
    this.calculationTimes = this.calculationTimes.slice(-this.calculationWindow.length);

    // Update metrics
    this.updateCalculationMetrics();
  }

  /**
   * Update calculation metrics
   */
  private updateCalculationMetrics(): void {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Count calculations in last minute
    const recentCalculations = this.calculationWindow.filter(t => t > oneMinuteAgo);
    const calculationsPerMinute = recentCalculations.length;

    // Calculate average time
    const recentTimes = this.calculationTimes.slice(-recentCalculations.length);
    const averageCalculationTime = recentTimes.length > 0
      ? recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length
      : 0;

    // Update peak rate
    const peakCalculationRate = Math.max(
      this.calculationMetrics.peakCalculationRate,
      calculationsPerMinute
    );

    this.calculationMetrics = {
      calculationsPerMinute,
      averageCalculationTime,
      peakCalculationRate,
      totalCalculations: this.calculationWindow.length,
      timestamp: now,
    };
  }

  /**
   * Get current metrics
   */
  getMetrics(): UIMetrics {
    return {
      clickPatterns: [...this.clickPatterns],
      calculationMetrics: { ...this.calculationMetrics },
      errorCount: 0, // Updated by errorReportingService
      heuristicViolations: 0, // Updated by usabilityHeuristicsService
      timestamp: Date.now(),
    };
  }

  /**
   * Get click patterns (aggregate only, patent-safe)
   */
  getClickPatterns(): ClickPattern[] {
    return [...this.clickPatterns];
  }

  /**
   * Get calculation metrics
   */
  getCalculationMetrics(): CalculationMetrics {
    return { ...this.calculationMetrics };
  }

  /**
   * Get aggregate statistics (patent-safe)
   */
  getAggregateStats(): {
    totalClicks: number;
    clicksByComponent: Record<string, number>;
    clicksByType: Record<string, number>;
    calculationsPerMinute: number;
    averageCalculationTime: number;
  } {
    const clicksByComponent: Record<string, number> = {};
    const clicksByType: Record<string, number> = {};

    this.clickPatterns.forEach(pattern => {
      clicksByComponent[pattern.componentName] = (clicksByComponent[pattern.componentName] || 0) + 1;
      clicksByType[pattern.elementType] = (clicksByType[pattern.elementType] || 0) + 1;
    });

    return {
      totalClicks: this.clickPatterns.length,
      clicksByComponent,
      clicksByType,
      calculationsPerMinute: this.calculationMetrics.calculationsPerMinute,
      averageCalculationTime: this.calculationMetrics.averageCalculationTime,
    };
  }

  /**
   * Start metrics collection interval
   */
  private startMetricsCollection(): void {
    // Update calculation metrics every 10 seconds
    this.metricsInterval = setInterval(() => {
      this.updateCalculationMetrics();
      this.saveMetrics();
    }, 10000);
  }

  /**
   * Save metrics to localStorage
   */
  private saveMetrics(): void {
    try {
      const data = {
        clickPatterns: this.clickPatterns.slice(-100), // Keep last 100 for persistence
        calculationMetrics: this.calculationMetrics,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('UIMetricsService: Failed to save metrics:', error);
    }
  }

  /**
   * Load metrics from localStorage
   */
  private loadMetrics(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.clickPatterns) {
          this.clickPatterns = parsed.clickPatterns;
        }
        if (parsed.calculationMetrics) {
          this.calculationMetrics = parsed.calculationMetrics;
        }
      }
    } catch (error) {
      console.warn('UIMetricsService: Failed to load metrics:', error);
    }
  }

  /**
   * Clear all metrics (for testing/reset)
   */
  clearMetrics(): void {
    this.clickPatterns = [];
    this.calculationWindow = [];
    this.calculationTimes = [];
    this.calculationMetrics = {
      calculationsPerMinute: 0,
      averageCalculationTime: 0,
      peakCalculationRate: 0,
      totalCalculations: 0,
      timestamp: Date.now(),
    };
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
    this.saveMetrics();
  }
}

export const uiMetricsService = new UIMetricsService();

