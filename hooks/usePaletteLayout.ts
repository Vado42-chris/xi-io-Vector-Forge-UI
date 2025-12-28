/**
 * Palette Layout Hook
 * Manages layout calculations based on docked palettes
 * Adjusts canvas and content areas to account for palette positions
 */

import { useState, useEffect, useCallback } from 'react';
import { PalettePosition, DockingZone } from '../components/PaletteDockingSystem';

export interface LayoutBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

export const usePaletteLayout = () => {
  const [palettePositions, setPalettePositions] = useState<Map<string, PalettePosition>>(new Map());
  const [layoutBounds, setLayoutBounds] = useState<LayoutBounds>({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: window.innerWidth,
    height: window.innerHeight
  });

  const updatePalettePosition = useCallback((id: string, position: PalettePosition) => {
    setPalettePositions(prev => {
      const next = new Map(prev);
      next.set(id, position);
      return next;
    });
  }, []);

  useEffect(() => {
    const calculateLayout = () => {
      let leftOffset = 0;
      let rightOffset = 0;
      let topOffset = 0;
      let bottomOffset = 0;

      // Calculate offsets from docked palettes
      palettePositions.forEach((position) => {
        if (position.zone === 'left' && position.width) {
          leftOffset = Math.max(leftOffset, position.width);
        } else if (position.zone === 'right' && position.width) {
          rightOffset = Math.max(rightOffset, position.width);
        } else if (position.zone === 'top' && position.height) {
          topOffset = Math.max(topOffset, position.height);
        } else if (position.zone === 'bottom' && position.height) {
          bottomOffset = Math.max(bottomOffset, position.height);
        }
      });

      setLayoutBounds({
        left: leftOffset,
        right: rightOffset,
        top: topOffset,
        bottom: bottomOffset,
        width: window.innerWidth - leftOffset - rightOffset,
        height: window.innerHeight - topOffset - bottomOffset
      });
    };

    calculateLayout();
    window.addEventListener('resize', calculateLayout);
    return () => window.removeEventListener('resize', calculateLayout);
  }, [palettePositions]);

  return {
    layoutBounds,
    updatePalettePosition,
    palettePositions
  };
};

