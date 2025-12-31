/**
 * Professional Palette Docking System
 * Adobe Photoshop/Illustrator style draggable, dockable palettes
 * Supports: left, right, top, bottom, floating docking zones
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

export type DockingZone = 'left' | 'right' | 'top' | 'bottom' | 'floating';

export interface PalettePosition {
  zone: DockingZone;
  x: number;
  y: number;
  width?: number;
  height?: number;
  order?: number; // For stacking in same zone
}

export interface PaletteProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultZone?: DockingZone;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
  onDock?: (zone: DockingZone) => void;
  onUndock?: () => void;
  className?: string;
}

interface PaletteDockingSystemProps {
  palettes: PaletteProps[];
  onPaletteMove?: (id: string, position: PalettePosition) => void;
}

// Docking zone detection
const DOCKING_THRESHOLD = 50; // pixels from edge to trigger docking

const detectDockingZone = (x: number, y: number, width: number, height: number): DockingZone | null => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Left zone
  if (x < DOCKING_THRESHOLD) return 'left';
  // Right zone
  if (x + width > viewportWidth - DOCKING_THRESHOLD) return 'right';
  // Top zone
  if (y < DOCKING_THRESHOLD) return 'top';
  // Bottom zone
  if (y + height > viewportHeight - DOCKING_THRESHOLD) return 'bottom';
  
  return 'floating';
};

// Individual draggable palette component
export const DraggablePalette: React.FC<PaletteProps & {
  position: PalettePosition;
  onPositionChange: (position: PalettePosition) => void;
  zIndex: number;
}> = ({
  id, title, children, position, onPositionChange, zIndex,
  defaultWidth = 300, defaultHeight = 400,
  minWidth = 200, minHeight = 200,
  resizable = true, onDock, onUndock, className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const paletteRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  const width = position.width || defaultWidth;
  const height = position.height || defaultHeight;

  const handleDragStart = (e: React.PointerEvent) => {
    if (dragHandleRef.current?.contains(e.target as Node)) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
    }
  };

  const handleResizeStart = (e: React.PointerEvent) => {
    if (resizeHandleRef.current?.contains(e.target as Node) && resizable) {
      setIsResizing(true);
      setResizeStart({ 
        x: e.clientX, 
        y: e.clientY, 
        width, 
        height 
      });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Detect docking zone
        const detectedZone = detectDockingZone(newX, newY, width, height);
        
        // If dragging into a zone, snap to it (magnetic docking)
        if (detectedZone && detectedZone !== 'floating') {
          let snappedX = newX;
          let snappedY = newY;
          
          if (detectedZone === 'left') {
            snappedX = 0;
            snappedY = Math.max(56, Math.min(newY, window.innerHeight - height - 48)); // Account for header/footer
          } else if (detectedZone === 'right') {
            snappedX = window.innerWidth - width;
            snappedY = Math.max(56, Math.min(newY, window.innerHeight - height - 48));
          } else if (detectedZone === 'top') {
            snappedX = Math.max(0, Math.min(newX, window.innerWidth - width));
            snappedY = 56; // Below header
          } else if (detectedZone === 'bottom') {
            snappedX = Math.max(0, Math.min(newX, window.innerWidth - width));
            snappedY = window.innerHeight - height - 48; // Above footer
          }
          
          onPositionChange({
            zone: detectedZone,
            x: snappedX,
            y: snappedY,
            width,
            height
          });
          
          if (onDock) onDock(detectedZone);
        } else {
          // Floating - constrain to viewport
          const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - width));
          const constrainedY = Math.max(56, Math.min(newY, window.innerHeight - height - 48));
          
          onPositionChange({
            zone: 'floating',
            x: constrainedX,
            y: constrainedY,
            width,
            height
          });
          
          if (onUndock) onUndock();
        }
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        const newWidth = Math.max(minWidth, resizeStart.width + deltaX);
        const newHeight = Math.max(minHeight, resizeStart.height + deltaY);
        
        onPositionChange({
          ...position,
          width: newWidth,
          height: newHeight
        });
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isDragging || isResizing) {
        if (e.target instanceof HTMLElement) {
          e.target.releasePointerCapture(e.pointerId);
        }
        setIsDragging(false);
        setIsResizing(false);
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, width, height, minWidth, minHeight, position, onPositionChange, onDock, onUndock]);

  // FIXED: Convert positioning style to CSS custom properties
  const paletteRefWithStyle = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (paletteRefWithStyle.current) {
      const left = position.zone === 'left' ? 0 : position.zone === 'right' ? undefined : position.x;
      const right = position.zone === 'right' ? 0 : undefined;
      const top = position.zone === 'top' ? 0 : position.zone === 'bottom' ? undefined : (position.y || 56);
      const bottom = position.zone === 'bottom' ? 0 : undefined;
      const paletteHeight = height || (position.zone === 'top' || position.zone === 'bottom' ? height : `calc(100vh - ${position.y || 56}px)`);
      
      if (left !== undefined) paletteRefWithStyle.current.style.setProperty('--palette-left', `${left}px`);
      if (right !== undefined) paletteRefWithStyle.current.style.setProperty('--palette-right', `${right}px`);
      if (top !== undefined) paletteRefWithStyle.current.style.setProperty('--palette-top', `${top}px`);
      if (bottom !== undefined) paletteRefWithStyle.current.style.setProperty('--palette-bottom', `${bottom}px`);
      paletteRefWithStyle.current.style.setProperty('--palette-width', typeof width === 'number' ? `${width}px` : width || '300px');
      paletteRefWithStyle.current.style.setProperty('--palette-height', typeof paletteHeight === 'number' ? `${paletteHeight}px` : paletteHeight || '400px');
      paletteRefWithStyle.current.style.setProperty('--palette-z-index', zIndex.toString());
    }
  }, [position, width, height, zIndex]);

  return (
    <div
      ref={(node) => {
        paletteRef.current = node;
        if (node) paletteRefWithStyle.current = node;
      }}
      className={`xibalba-palette bg-[var(--xibalba-grey-050)] border border-white/10 shadow-lg palette-positioned ${className}`}
    >
      {/* Drag Handle */}
      <div
        ref={dragHandleRef}
        onPointerDown={handleDragStart}
        className="h-8 bg-[var(--xibalba-grey-100)] border-b border-white/10 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing"
      >
        <span className="xibalba-text-subheading text-sm font-black uppercase tracking-widest">{title}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (position.zone === 'floating') {
                onDock?.('left');
              } else {
                onUndock?.();
              }
            }}
            className="xibalba-toolbar-button-professional size-6"
            title={position.zone === 'floating' ? 'Dock' : 'Undock'}
          >
            <span className="material-symbols-outlined text-[14px]">
              {position.zone === 'floating' ? 'vertical_align_center' : 'open_in_new'}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto xibalba-scrollbar palette-content-height">
        {children}
      </div>

      {/* Resize Handle */}
      {resizable && position.zone === 'floating' && (
        <div
          ref={resizeHandleRef}
          onPointerDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize bg-[var(--xibalba-grey-200)] opacity-0 hover:opacity-100 transition-opacity palette-clip-corner"
        />
      )}
    </div>
  );
};

// Main docking system container
export const PaletteDockingSystem: React.FC<PaletteDockingSystemProps> = ({
  palettes,
  onPaletteMove
}) => {
  const [palettePositions, setPalettePositions] = useState<Map<string, PalettePosition>>(new Map());

  useEffect(() => {
    // Initialize default positions
    const positions = new Map<string, PalettePosition>();
    palettes.forEach((palette, index) => {
      const defaultZone = palette.defaultZone || 'floating';
      positions.set(palette.id, {
        zone: defaultZone,
        x: defaultZone === 'left' ? 0 : defaultZone === 'right' ? window.innerWidth - (palette.defaultWidth || 300) : 100 + index * 20,
        y: defaultZone === 'top' ? 0 : defaultZone === 'bottom' ? window.innerHeight - (palette.defaultHeight || 400) : 100 + index * 20,
        width: palette.defaultWidth,
        height: palette.defaultHeight,
        order: index
      });
    });
    setPalettePositions(positions);
  }, []);

  const handlePositionChange = useCallback((id: string, position: PalettePosition) => {
    setPalettePositions(prev => {
      const next = new Map(prev);
      next.set(id, position);
      return next;
    });
    onPaletteMove?.(id, position);
  }, [onPaletteMove]);

  return (
    <>
      {palettes.map((palette, index) => {
        const position = palettePositions.get(palette.id);
        if (!position) return null;
        
        return (
          <DraggablePalette
            key={palette.id}
            {...palette}
            position={position}
            onPositionChange={(pos) => handlePositionChange(palette.id, pos)}
            zIndex={1000 + index}
          />
        );
      })}
    </>
  );
};

