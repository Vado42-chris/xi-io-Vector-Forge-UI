/**
 * useCalculationsPerMinute Hook
 * Tracks calculation performance and rate
 * 
 * #hashtag: performance calculations-per-minute tracking
 */

import { useCallback, useEffect, useState } from 'react';
import { uiMetricsService, CalculationMetrics } from '../services/uiMetricsService';

export interface UseCalculationsPerMinuteReturn {
  calculationsPerMinute: number;
  averageCalculationTime: number;
  peakCalculationRate: number;
  trackCalculation: (calculationTime: number) => void;
  metrics: CalculationMetrics;
}

/**
 * Hook for tracking calculations per minute
 */
export const useCalculationsPerMinute = (): UseCalculationsPerMinuteReturn => {
  const [metrics, setMetrics] = useState<CalculationMetrics>(() =>
    uiMetricsService.getCalculationMetrics()
  );

  useEffect(() => {
    // Update metrics every second
    const interval = setInterval(() => {
      setMetrics(uiMetricsService.getCalculationMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const trackCalculation = useCallback((calculationTime: number) => {
    uiMetricsService.trackCalculation(calculationTime);
    setMetrics(uiMetricsService.getCalculationMetrics());
  }, []);

  return {
    calculationsPerMinute: metrics.calculationsPerMinute,
    averageCalculationTime: metrics.averageCalculationTime,
    peakCalculationRate: metrics.peakCalculationRate,
    trackCalculation,
    metrics,
  };
};

