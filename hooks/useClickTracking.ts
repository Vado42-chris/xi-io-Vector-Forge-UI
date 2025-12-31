/**
 * useClickTracking Hook - Patent-Safe Click Tracking
 * Tracks UI interactions for usability studies
 * 
 * PATENT-SAFE: No personal identifiers, aggregate patterns only
 * #hashtag: click-tracking patent-safe usability
 */

import { useCallback } from 'react';
import { uiMetricsService } from '../services/uiMetricsService';

export interface UseClickTrackingOptions {
  componentName: string;
  enabled?: boolean;
}

export interface UseClickTrackingReturn {
  trackClick: (elementType: string, interactionType?: 'click' | 'hover' | 'focus' | 'drag' | 'resize') => void;
  trackInteraction: (elementType: string, interactionType: 'click' | 'hover' | 'focus' | 'drag' | 'resize') => void;
}

/**
 * Hook for patent-safe click tracking
 */
export const useClickTracking = (
  options: UseClickTrackingOptions
): UseClickTrackingReturn => {
  const { componentName, enabled = true } = options;

  const trackClick = useCallback(
    (elementType: string, interactionType: 'click' | 'hover' | 'focus' | 'drag' | 'resize' = 'click') => {
      if (!enabled) return;
      uiMetricsService.trackClick(elementType, componentName, interactionType);
    },
    [componentName, enabled]
  );

  const trackInteraction = useCallback(
    (elementType: string, interactionType: 'click' | 'hover' | 'focus' | 'drag' | 'resize') => {
      if (!enabled) return;
      uiMetricsService.trackClick(elementType, componentName, interactionType);
    },
    [componentName, enabled]
  );

  return {
    trackClick,
    trackInteraction,
  };
};

