/**
 * Dockable Panel Component
 * Draggable, resizable, and dockable panel system for VectorForge
 * 
 * #hashtag: dockable-panel component
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ErrorBoundary from './ErrorBoundary';

export type PanelPosition = 'left' | 'right' | 'top' | 'bottom' | 'floating';
export type Quadrant = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export interface DockablePanelProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultPosition?: PanelPosition;
  defaultQuadrant?: Quadrant;
  defaultSize?: { width?: number; height?: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  resizable?: boolean;
  dockable?: boolean;
  closable?: boolean;
  onClose?: () => void;
  onPositionChange?: (position: PanelPosition, quadrant?: Quadrant) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  icon?: string;
  className?: string;
}

interface PanelState {
  position: PanelPosition;
  quadrant?: Quadrant;
  size: { width: number; height: number };
  isDragging: boolean;
  isResizing: boolean;
  dragOffset: { x: number; y: number };
  resizeHandle: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null;
}

const DockablePanel: React.FC<DockablePanelProps> = ({
  id,
  title,
  children,
  defaultPosition = 'floating',
  defaultQuadrant,
  defaultSize = { width: 300, height: 400 },
  minSize = { width: 200, height: 150 },
  maxSize = { width: 2000, height: 2000 },
  resizable = true,
  dockable = true,
  closable = true,
  onClose,
  onPositionChange,
  onSizeChange,
  icon,
  className = '',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<PanelState>(() => {
    const saved = localStorage.getItem(`vforge_panel_${id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          position: parsed.position || defaultPosition,
          quadrant: parsed.quadrant || defaultQuadrant,
          size: parsed.size || defaultSize,
          isDragging: false,
          isResizing: false,
          dragOffset: { x: 0, y: 0 },
          resizeHandle: null,
        };
      } catch (e) {
        console.error('Failed to load panel state:', e);
      }
    }
    return {
      position: defaultPosition,
      quadrant: defaultQuadrant,
      size: defaultSize,
      isDragging: false,
      isResizing: false,
      dragOffset: { x: 0, y: 0 },
      resizeHandle: null,
    };
  });

  // Save state to localStorage
  useEffect(() => {
    const stateToSave = {
      position: state.position,
      quadrant: state.quadrant,
      size: state.size,
    };
    localStorage.setItem(`vforge_panel_${id}`, JSON.stringify(stateToSave));
  }, [id, state.position, state.quadrant, state.size]);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!dockable || state.position === 'floating') return;
    
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) {
      setState(prev => ({
        ...prev,
        isDragging: true,
        dragOffset: {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        },
      }));
    }
  }, [dockable, state.position]);

  // Handle drag
  useEffect(() => {
    if (!state.isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (state.position === 'floating' && panelRef.current) {
        const newX = e.clientX - state.dragOffset.x;
        const newY = e.clientY - state.dragOffset.y;
        
        // Constrain to viewport
        const maxX = window.innerWidth - state.size.width;
        const maxY = window.innerHeight - state.size.height;
        
        // Use data attributes instead of inline styles (NO INLINE STYLES)
        panelRef.current.setAttribute('data-panel-left', `${Math.max(0, Math.min(newX, maxX))}`);
        panelRef.current.setAttribute('data-panel-top', `${Math.max(0, Math.min(newY, maxY))}`);
      }
    };

    const handleMouseUp = () => {
      setState(prev => ({ ...prev, isDragging: false }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [state.isDragging, state.dragOffset, state.position, state.size]);

  // Handle resize start
  const handleResizeStart = useCallback((handle: PanelState['resizeHandle']) => {
    if (!resizable) return;
    setState(prev => ({ ...prev, isResizing: true, resizeHandle: handle }));
  }, [resizable]);

  // Handle resize
  useEffect(() => {
    if (!state.isResizing || !state.resizeHandle) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelRef.current) return;

      const rect = panelRef.current.getBoundingClientRect();
      let newWidth = state.size.width;
      let newHeight = state.size.height;
      let newLeft = rect.left;
      let newTop = rect.top;

      const deltaX = e.clientX - (rect.left + rect.width);
      const deltaY = e.clientY - (rect.top + rect.height);

      if (state.resizeHandle?.includes('e')) {
        newWidth = Math.max(minSize.width, Math.min(maxSize.width, rect.width + deltaX));
      }
      if (state.resizeHandle?.includes('w')) {
        const widthDelta = rect.left - e.clientX;
        newWidth = Math.max(minSize.width, Math.min(maxSize.width, rect.width + widthDelta));
        newLeft = e.clientX;
      }
      if (state.resizeHandle?.includes('s')) {
        newHeight = Math.max(minSize.height, Math.min(maxSize.height, rect.height + deltaY));
      }
      if (state.resizeHandle?.includes('n')) {
        const heightDelta = rect.top - e.clientY;
        newHeight = Math.max(minSize.height, Math.min(maxSize.height, rect.height + heightDelta));
        newTop = e.clientY;
      }

      setState(prev => ({
        ...prev,
        size: { width: newWidth, height: newHeight },
      }));

      if (state.position === 'floating') {
        // Use data attributes instead of inline styles (NO INLINE STYLES)
        panelRef.current.setAttribute('data-panel-left', `${newLeft}`);
        panelRef.current.setAttribute('data-panel-top', `${newTop}`);
      }

      if (onSizeChange) {
        onSizeChange({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setState(prev => ({ ...prev, isResizing: false, resizeHandle: null }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [state.isResizing, state.resizeHandle, state.size, minSize, maxSize, state.position, onSizeChange]);

  // Determine quadrant based on position
  const getQuadrantFromPosition = useCallback((x: number, y: number): Quadrant => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    if (x < centerX && y < centerY) return 'top-left';
    if (x >= centerX && y < centerY) return 'top-right';
    if (x < centerX && y >= centerY) return 'bottom-left';
    if (x >= centerX && y >= centerY) return 'bottom-right';
    return 'center';
  }, []);

  // Handle docking zones
  const handleDockZoneEnter = useCallback((zone: PanelPosition) => {
    // Visual feedback for docking zones
    // This would show drop zones when dragging
  }, []);

  // Get panel styles based on position
  const getPanelStyles = (): React.CSSProperties => {
    // Use CSS custom properties instead of inline styles
    const baseStyles: React.CSSProperties = {
      '--panel-width': `${state.size.width}px`,
      '--panel-height': `${state.size.height}px`,
      '--panel-min-width': `${minSize.width}px`,
      '--panel-min-height': `${minSize.height}px`,
      '--panel-max-width': `${maxSize.width}px`,
      '--panel-max-height': `${maxSize.height}px`,
    } as React.CSSProperties;

    switch (state.position) {
      case 'left':
        return {
          ...baseStyles,
          '--panel-position': 'fixed',
          '--panel-left': '0',
          '--panel-top': '0',
          '--panel-bottom': '0',
          '--panel-height': '100vh',
          '--panel-width': `${state.size.width}px`,
        } as React.CSSProperties;
      case 'right':
        return {
          ...baseStyles,
          '--panel-position': 'fixed',
          '--panel-right': '0',
          '--panel-top': '0',
          '--panel-bottom': '0',
          '--panel-height': '100vh',
          '--panel-width': `${state.size.width}px`,
        } as React.CSSProperties;
      case 'top':
        return {
          ...baseStyles,
          '--panel-position': 'fixed',
          '--panel-left': '0',
          '--panel-right': '0',
          '--panel-top': '0',
          '--panel-height': `${state.size.height}px`,
          '--panel-width': '100vw',
        } as React.CSSProperties;
      case 'bottom':
        return {
          ...baseStyles,
          '--panel-position': 'fixed',
          '--panel-left': '0',
          '--panel-right': '0',
          '--panel-bottom': '0',
          '--panel-height': `${state.size.height}px`,
          '--panel-width': '100vw',
        } as React.CSSProperties;
      case 'floating':
      default:
        const leftValue = state.quadrant === 'top-left' ? '20px' : state.quadrant === 'top-right' ? 'calc(100% - 320px)' : '20px';
        const topValue = state.quadrant === 'top-left' || state.quadrant === 'top-right' ? '60px' : 'calc(100% - 420px)';
        return {
          ...baseStyles,
          '--panel-position': 'fixed',
          '--panel-left': leftValue,
          '--panel-top': topValue,
        } as React.CSSProperties;
    }
  };

  return (
    <ErrorBoundary>
      <div
        ref={panelRef}
        className={`xibalba-panel dockable-panel dockable-panel-${state.position} ${className}`}
        style={getPanelStyles()}
        data-panel-id={id}
        data-quadrant={state.quadrant}
      >
        {/* Header */}
        <div
          className={`dockable-panel-header ${dockable && state.position === 'floating' ? 'dockable-panel-header-draggable' : ''}`}
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-2">
            {icon && (
              <span className="material-symbols-outlined text-[var(--xibalba-accent)]" aria-hidden="true">
                {icon}
              </span>
            )}
            <h3 className="text-sm font-semibold text-[var(--xibalba-text-000)]">{title}</h3>
          </div>
          <div className="flex items-center gap-1">
            {dockable && (
              <button
                className="dockable-panel-button"
                onClick={() => {
                  const newPosition: PanelPosition = state.position === 'floating' ? 'right' : 'floating';
                  setState(prev => ({ ...prev, position: newPosition }));
                  if (onPositionChange) {
                    onPositionChange(newPosition, state.quadrant);
                  }
                }}
                aria-label={`${state.position === 'floating' ? 'Dock' : 'Undock'} panel`}
                title={state.position === 'floating' ? 'Dock' : 'Undock'}
              >
                <span className="material-symbols-outlined text-sm">
                  {state.position === 'floating' ? 'vertical_align_center' : 'open_in_new'}
                </span>
              </button>
            )}
            {closable && onClose && (
              <button
                className="dockable-panel-button"
                onClick={onClose}
                aria-label="Close panel"
                title="Close"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="dockable-panel-content flex-1 overflow-auto">
          {children}
        </div>

        {/* Resize Handles */}
        {resizable && state.position === 'floating' && (
          <>
            <div
              className="dockable-panel-resize-handle resize-n"
              onMouseDown={(e) => {
                e.preventDefault();
                handleResizeStart('n');
              }}
            />
            <div
              className="dockable-panel-resize-handle resize-s"
              onMouseDown={(e) => {
                e.preventDefault();
                handleResizeStart('s');
              }}
            />
            <div
              className="dockable-panel-resize-handle resize-e"
              onMouseDown={(e) => {
                e.preventDefault();
                handleResizeStart('e');
              }}
            />
            <div
              className="dockable-panel-resize-handle resize-w"
              onMouseDown={(e) => {
                e.preventDefault();
                handleResizeStart('w');
              }}
            />
            <div
              className="dockable-panel-resize-handle resize-ne"
              onMouseDown={(e) => {
                e.preventDefault();
                handleResizeStart('ne');
              }}
            />
            <div
              className="dockable-panel-resize-handle resize-nw"
              onMouseDown={(e) => {
                e.preventDefault();
                handleResizeStart('nw');
              }}
            />
            <div
              className="dockable-panel-resize-handle resize-se"
              onMouseDown={(e) => {
                e.preventDefault();
                handleResizeStart('se');
              }}
            />
            <div
              className="dockable-panel-resize-handle resize-sw"
              onMouseDown={(e) => {
                e.preventDefault();
                handleResizeStart('sw');
              }}
            />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default DockablePanel;

