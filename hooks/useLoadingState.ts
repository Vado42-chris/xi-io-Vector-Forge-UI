/**
 * useLoadingState Hook
 * Phase 2: Component Templates & Reusability
 * 
 * Reusable hook for loading state management
 * NO INLINE STYLES - All styling via CSS classes
 */

import { useState, useCallback } from 'react';

export interface UseLoadingStateReturn {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(asyncFn: () => Promise<T>) => Promise<T>;
  loadingClassName: string;
  loadingProps: {
    'data-loading': string;
    'aria-busy': boolean;
    disabled: boolean;
  };
}

export const useLoadingState = (): UseLoadingStateReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(async <T,>(asyncFn: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadingClassName = isLoading ? 'xibalba-loading' : '';
  const loadingProps = {
    'data-loading': isLoading ? 'true' : 'false',
    'aria-busy': isLoading,
    disabled: isLoading,
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
    loadingClassName,
    loadingProps,
  };
};

