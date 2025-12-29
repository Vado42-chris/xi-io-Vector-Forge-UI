/**
 * useInteractionFeedback Hook
 * Phase 2: Component Templates & Reusability
 * 
 * Reusable hook for interaction feedback states
 * NO INLINE STYLES - All styling via CSS classes
 */

import { useState, useCallback } from 'react';

export interface UseInteractionFeedbackReturn {
  isHovering: boolean;
  isActive: boolean;
  isFocused: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onFocus: () => void;
  onBlur: () => void;
  className: string;
}

export const useInteractionFeedback = (
  baseClassName: string = '',
  options: {
    active?: boolean;
    disabled?: boolean;
    loading?: boolean;
  } = {}
): UseInteractionFeedbackReturn => {
  const [isHovering, setIsHovering] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const onMouseEnter = useCallback(() => {
    if (!options.disabled && !options.loading) {
      setIsHovering(true);
    }
  }, [options.disabled, options.loading]);

  const onMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsActive(false);
  }, []);

  const onMouseDown = useCallback(() => {
    if (!options.disabled && !options.loading) {
      setIsActive(true);
    }
  }, [options.disabled, options.loading]);

  const onMouseUp = useCallback(() => {
    setIsActive(false);
  }, []);

  const onFocus = useCallback(() => {
    if (!options.disabled) {
      setIsFocused(true);
    }
  }, [options.disabled]);

  const onBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Build className
  const classes = [
    baseClassName,
    isHovering && 'hover',
    isActive && 'active',
    isFocused && 'focused',
    options.active && 'active',
    options.disabled && 'disabled',
    options.loading && 'xibalba-loading',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    isHovering,
    isActive,
    isFocused,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onFocus,
    onBlur,
    className: classes,
  };
};

