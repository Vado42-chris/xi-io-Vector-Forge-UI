/**
 * Shared Panel Resize/Drag Hook
 * REDUCE, REUSE, RECYCLE: Extract common logic from LeftSidebar and RightSidebar
 * 
 * This hook provides resize and drag functionality that both sidebars use
 */

import { useState, useRef, useEffect } from 'react';

interface UsePanelResizeOptions {
  defaultWidth: number;
  minWidth?: number;
  maxWidth?: number;
  side: 'left' | 'right';
  onWidthChange?: (width: number) => void;
}

interface UsePanelResizeReturn {
  width: number;
  isResizing: boolean;
  isDragging: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  resizeHandleRef: React.RefObject<HTMLDivElement | null>;
  handleResizeStart: (e: React.PointerEvent) => void;
  handleDragStart: (e: React.PointerEvent) => void;
}

export const usePanelResize = ({
  defaultWidth,
  minWidth = 200,
  maxWidth = 600,
  side,
  onWidthChange,
}: UsePanelResizeOptions): UsePanelResizeReturn => {
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(defaultWidth);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  // Resize handling
  const handleResizeStart = (e: React.PointerEvent) => {
    if (resizeHandleRef.current?.contains(e.target as Node)) {
      setIsResizing(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
    }
  };

  // Use window-level pointer events for proper dragging/resizing
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isResizing) {
        e.preventDefault();
        const newWidth = side === 'left' 
          ? e.clientX 
          : window.innerWidth - e.clientX;
        const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        setWidth(clampedWidth);
        if (onWidthChange) {
          onWidthChange(clampedWidth);
        }
        // Update CSS variable immediately
        if (sidebarRef.current) {
          if (side === 'left') {
            sidebarRef.current.style.width = `${clampedWidth}px`;
            sidebarRef.current.setAttribute('data-sidebar-left-width', `${clampedWidth}`);
          } else {
            sidebarRef.current.style.width = `${clampedWidth}px`;
            sidebarRef.current.setAttribute('data-sidebar-right-width', `${clampedWidth}`);
          }
          sidebarRef.current.setAttribute('data-sidebar-width', `${clampedWidth}`);
        }
      } else if (isDragging) {
        // Dragging logic can be added here if needed
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isResizing && e.target instanceof HTMLElement) {
        e.target.releasePointerCapture(e.pointerId);
      }
      setIsResizing(false);
      setIsDragging(false);
    };

    if (isResizing || isDragging) {
      window.addEventListener('pointermove', handlePointerMove, { passive: false });
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
      };
    }
  }, [isResizing, isDragging, side, minWidth, maxWidth, onWidthChange]);

  const handleDragStart = (e: React.PointerEvent) => {
    if (resizeHandleRef.current?.contains(e.target as Node)) {
      return; // Don't drag when resizing
    }
    setIsDragging(true);
    // Drag logic can be enhanced here if needed
    e.preventDefault();
  };

  // Update CSS variables and inline styles for positioning
  useEffect(() => {
    if (sidebarRef.current) {
      const actualWidth = isCollapsed ? 48 : width;
      sidebarRef.current.setAttribute('data-sidebar-width', `${actualWidth}`);
      sidebarRef.current.style.width = `${actualWidth}px`;
      if (side === 'left') {
        sidebarRef.current.setAttribute('data-sidebar-left-width', `${actualWidth}`);
        // Update CSS variable
        document.documentElement.style.setProperty('--sidebar-left-width', `${actualWidth}px`);
      } else {
        sidebarRef.current.setAttribute('data-sidebar-right-width', `${actualWidth}`);
        // Update CSS variable
        document.documentElement.style.setProperty('--sidebar-right-width', `${actualWidth}px`);
      }
    }
  }, [width, isCollapsed, side]);

  return {
    width,
    isResizing,
    isDragging,
    isCollapsed,
    setIsCollapsed,
    sidebarRef,
    resizeHandleRef,
    handleResizeStart,
    handleDragStart,
  };
};

