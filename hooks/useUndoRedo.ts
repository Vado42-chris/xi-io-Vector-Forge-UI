/**
 * useUndoRedo Hook
 * Phase 3: User Flow Completion
 * 
 * Reusable hook for undo/redo functionality
 * NO INLINE STYLES - All styling via CSS classes
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface UndoRedoState<T> {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  recordState: (state: T) => void;
  clearHistory: () => void;
}

export interface UseUndoRedoOptions {
  maxHistorySize?: number;
  debounceMs?: number;
}

/**
 * useUndoRedo Hook
 * 
 * Provides undo/redo functionality with history management
 */
export const useUndoRedo = <T,>(
  initialState: T,
  options: UseUndoRedoOptions = {}
): [T, UndoRedoState<T>] => {
  const { maxHistorySize = 50, debounceMs = 0 } = options;
  
  const [currentState, setCurrentState] = useState<T>(initialState);
  const historyRef = useRef<T[]>([initialState]);
  const historyIndexRef = useRef(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateCanUndoRedo = useCallback(() => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  const recordState = useCallback((state: T) => {
    // Clear redo history if we're not at the end
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    }

    // Add new state
    historyRef.current.push(state);
    historyIndexRef.current = historyRef.current.length - 1;

    // Limit history size
    if (historyRef.current.length > maxHistorySize) {
      historyRef.current.shift();
      historyIndexRef.current--;
    }
    
    updateCanUndoRedo();
  }, [maxHistorySize, updateCanUndoRedo]);

  const recordStateDebounced = useCallback((state: T) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (debounceMs > 0) {
      debounceTimerRef.current = setTimeout(() => {
        recordState(state);
      }, debounceMs);
    } else {
      recordState(state);
    }
  }, [recordState, debounceMs]);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      const previousState = historyRef.current[historyIndexRef.current];
      setCurrentState(previousState);
      updateCanUndoRedo();
    }
  }, [updateCanUndoRedo]);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      const nextState = historyRef.current[historyIndexRef.current];
      setCurrentState(nextState);
      updateCanUndoRedo();
    }
  }, [updateCanUndoRedo]);

  const clearHistory = useCallback(() => {
    historyRef.current = [currentState];
    historyIndexRef.current = 0;
  }, [currentState]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Update canUndo/canRedo when state changes
  useEffect(() => {
    updateCanUndoRedo();
  }, [currentState, updateCanUndoRedo]);

  const undoRedoState: UndoRedoState<T> = {
    canUndo,
    canRedo,
    undo,
    redo,
    recordState: recordStateDebounced,
    clearHistory,
  };

  return [currentState, undoRedoState];
};

