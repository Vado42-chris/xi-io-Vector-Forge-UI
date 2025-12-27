/**
 * @module useContextualUI
 * @description
 * React hook for contextual UI surfacing based on MAI framework.
 * Provides reactive UI element visibility based on current context.
 * 
 * Server Timestamp: 1737955680000
 * Date: December 27, 2025
 * Patent Tracking ID: VF-UI-HOOK-2025-12-27-001
 * Work Tracking ID: WT-UI-HOOK-1737955680000
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  contextualUIService, 
  UIContextState, 
  UIElement, 
  UIPriority 
} from '../services/contextualUIService';

export interface UseContextualUIReturn {
  surfacedElements: UIElement[];
  elementsByLocation: Record<string, UIElement[]>;
  contextualHelp: { element: UIElement; helpText: string }[];
  updateContext: (context: Partial<UIContextState>) => void;
  shouldShow: (elementId: string) => boolean;
  getPriority: (elementId: string) => UIPriority | null;
  getElementsForLocation: (location: UIElement['location']) => UIElement[];
}

/**
 * Hook for contextual UI surfacing
 */
export function useContextualUI(
  initialContext?: Partial<UIContextState>,
  maxPriority: UIPriority = 'P2'
): UseContextualUIReturn {
  const [surfacedElements, setSurfacedElements] = useState<UIElement[]>([]);
  const [contextState, setContextState] = useState<UIContextState>(
    initialContext || {}
  );

  // Update context and refresh surfaced elements
  const updateContext = useCallback((context: Partial<UIContextState>) => {
    setContextState(prev => {
      const newState = { ...prev, ...context };
      contextualUIService.updateContext(newState);
      return newState;
    });
  }, []);

  // Get surfaced elements based on current context
  useEffect(() => {
    const elements = contextualUIService.getSurfacedElements(maxPriority);
    setSurfacedElements(elements);
  }, [contextState, maxPriority]);

  // Initialize context on mount
  useEffect(() => {
    if (initialContext) {
      contextualUIService.updateContext(initialContext);
    }
  }, []);

  // Get elements grouped by location
  const elementsByLocation = surfacedElements.reduce((acc, el) => {
    if (!acc[el.location]) {
      acc[el.location] = [];
    }
    acc[el.location].push(el);
    return acc;
  }, {} as Record<string, UIElement[]>);

  // Get contextual help
  const contextualHelp = contextualUIService.getContextualHelp();

  // Check if element should be shown
  const shouldShow = useCallback((elementId: string): boolean => {
    return contextualUIService.shouldShowElement(elementId);
  }, []);

  // Get priority for element
  const getPriority = useCallback((elementId: string): UIPriority | null => {
    return contextualUIService.getElementPriority(elementId);
  }, []);

  // Get elements for specific location
  const getElementsForLocation = useCallback(
    (location: UIElement['location']): UIElement[] => {
      return contextualUIService.getElementsForLocation(location);
    },
    []
  );

  return {
    surfacedElements,
    elementsByLocation,
    contextualHelp,
    updateContext,
    shouldShow,
    getPriority,
    getElementsForLocation,
  };
}

