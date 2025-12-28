/**
 * Tool Palette Component
 * Draggable, dockable tool palette that can be pinned to left panel
 * NO INLINE STYLES - Component-based platform
 */

import React, { useState, useRef, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import Tooltip from './Tooltip';

export interface ToolPaletteItem {
  id: string;
  label: string;
  icon: string;
  action?: () => void;
  shortcut?: string;
  tooltip?: string;
}

export interface ToolPaletteProps {
  id: string;
  title: string;
  icon?: string;
  items: ToolPaletteItem[];
  position?: { x: number; y: number };
  isPinned?: boolean;
  onPin?: (paletteId: string, pinned: boolean) => void;
  onClose?: (paletteId: string) => void;
  onItemClick?: (paletteId: string, itemId: string) => void;
  className?: string;
}

const ToolPalette: React.FC<ToolPaletteProps> = ({
  id,
  title,
  icon = 'palette',
  items,
  position = { x: 100, y: 100 },
  isPinned = false,
  onPin,
  onClose,
  onItemClick,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);
  const [isHovering, setIsHovering] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const paletteRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  // Update CSS variables for positioning
  useEffect(() => {
    if (paletteRef.current && !isPinned) {
      paletteRef.current.style.setProperty('--palette-left', `${currentPosition.x}px`);
      paletteRef.current.style.setProperty('--palette-top', `${currentPosition.y}px`);
    }
  }, [currentPosition, isPinned]);

  // Drag handling
  const handleDragStart = (e: React.PointerEvent) => {
    if (isPinned) return; // Can't drag pinned palettes
    
    const target = e.target as HTMLElement;
    if (dragHandleRef.current?.contains(target) || target.closest('.palette-drag-handle')) {
      setIsDragging(true);
      dragStartPos.current = {
        x: e.clientX - currentPosition.x,
        y: e.clientY - currentPosition.y
      };
      target.setPointerCapture(e.pointerId);
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging && !isPinned) {
        const newX = e.clientX - dragStartPos.current.x;
        const newY = e.clientY - dragStartPos.current.y;
        setCurrentPosition({ x: newX, y: newY });
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isDragging) {
        if (e.target instanceof HTMLElement) {
          e.target.releasePointerCapture(e.pointerId);
        }
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
      };
    }
  }, [isDragging, isPinned]);

  const handlePin = () => {
    if (onPin) {
      onPin(id, !isPinned);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose(id);
    }
  };

  return (
    <ErrorBoundary>
      <div
        ref={paletteRef}
        className={`tool-palette xibalba-card ${isPinned ? 'tool-palette-pinned' : 'tool-palette-floating'} ${className}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        data-palette-id={id}
      >
        {/* Construction Paper Intermediary Layer for Text Readability */}
        <div className="construction-paper-layer-menu" />

        {/* Drag Handle / Header */}
        <div
          ref={dragHandleRef}
          onPointerDown={handleDragStart}
          className="palette-drag-handle flex items-center justify-between p-2 border-b border-white/10 cursor-grab active:cursor-grabbing relative z-10"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px] text-[var(--xibalba-text-200)]">{icon}</span>
            <span className="text-[11px] font-semibold text-[var(--xibalba-text-000)] uppercase tracking-wider">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip content={isPinned ? 'Unpin from panel' : 'Pin to left panel'} position="bottom">
              <button
                onClick={handlePin}
                className="palette-pin-button xibalba-toolbar-button-professional text-[12px] p-1"
                title={isPinned ? 'Unpin' : 'Pin'}
              >
                <span className={`material-symbols-outlined text-[14px] ${isPinned ? 'text-[var(--xibalba-accent)]' : ''}`}>
                  {isPinned ? 'push_pin' : 'push_pin'}
                </span>
              </button>
            </Tooltip>
            {onClose && (
              <Tooltip content="Close palette" position="bottom">
                <button
                  onClick={handleClose}
                  className="palette-close-button xibalba-toolbar-button-professional text-[12px] p-1"
                  title="Close"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Palette Items */}
        <div className="palette-content p-2 space-y-1 relative z-10">
          {items.map((item) => (
            <Tooltip
              key={item.id}
              content={item.tooltip || `${item.label}${item.shortcut ? ` (${item.shortcut})` : ''}`}
              position="right"
            >
              <button
                onClick={() => {
                  if (item.action) {
                    item.action();
                  }
                  if (onItemClick) {
                    onItemClick(id, item.id);
                  }
                }}
                className="palette-item-button w-full text-left px-3 py-2 text-[10px] font-medium text-[var(--xibalba-text-000)] hover:text-[var(--xibalba-text-000)] hover:bg-[var(--xibalba-grey-150)] flex items-center gap-3 bg-transparent border-none cursor-pointer rounded transition-colors"
              >
                <span className="material-symbols-outlined text-[14px] opacity-80">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="text-[8px] font-mono text-[var(--xibalba-text-300)] px-1.5 py-0.5 rounded bg-[var(--xibalba-grey-100)]">
                    {item.shortcut}
                  </span>
                )}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ToolPalette;

