/**
 * Self-Contained Floating Toolbar Component
 * Isolated, responsive, with error boundary and drag functionality
 */

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { ToolType } from '../types';
import ErrorBoundary from './ErrorBoundary';
import { ToolButton } from './shared/ToolButton';

interface FloatingToolbarProps {
  activeTool: ToolType;
  setTool: (tool: ToolType) => void;
  onSmartMagic: () => void;
  className?: string;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ 
  activeTool, setTool, onSmartMagic, className = '' 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: window.innerHeight / 2 });
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Professional tool palette - all tools in order, grouped visually
  const tools = useMemo(() => [
    // Selection
    { id: 'select' as ToolType, icon: 'near_me', label: 'Selection', shortcut: 'V' },
    { id: 'direct-select' as ToolType, icon: 'ads_click', label: 'Direct Selection', shortcut: 'A' },
    { id: 'group-select' as ToolType, icon: 'group', label: 'Group Selection', shortcut: '' },
    // Drawing
    { id: 'pen' as ToolType, icon: 'edit', label: 'Pen', shortcut: 'P' },
    { id: 'pencil' as ToolType, icon: 'draw', label: 'Pencil', shortcut: 'N' },
    { id: 'brush' as ToolType, icon: 'brush', label: 'Brush', shortcut: 'B' },
    { id: 'line' as ToolType, icon: 'show_chart', label: 'Line', shortcut: '\\' },
    // Shapes
    { id: 'rectangle' as ToolType, icon: 'crop_square', label: 'Rectangle', shortcut: 'M' },
    { id: 'ellipse' as ToolType, icon: 'radio_button_unchecked', label: 'Ellipse', shortcut: 'L' },
    { id: 'polygon' as ToolType, icon: 'change_history', label: 'Polygon', shortcut: '' },
    { id: 'star' as ToolType, icon: 'star', label: 'Star', shortcut: '' },
    { id: 'spiral' as ToolType, icon: 'sync', label: 'Spiral', shortcut: '' },
    // Text
    { id: 'text' as ToolType, icon: 'text_fields', label: 'Type', shortcut: 'T' },
    { id: 'text-on-path' as ToolType, icon: 'text_rotate_vertical', label: 'Text on Path', shortcut: '' },
    // Transform
    { id: 'rotate' as ToolType, icon: 'rotate_right', label: 'Rotate', shortcut: 'R' },
    { id: 'scale' as ToolType, icon: 'open_with', label: 'Scale', shortcut: 'S' },
    { id: 'free-transform' as ToolType, icon: 'transform', label: 'Free Transform', shortcut: 'E' },
    { id: 'reflect' as ToolType, icon: 'flip', label: 'Reflect', shortcut: 'O' },
    // Paint
    { id: 'eyedropper' as ToolType, icon: 'colorize', label: 'Eyedropper', shortcut: 'I' },
    { id: 'gradient' as ToolType, icon: 'gradient', label: 'Gradient', shortcut: 'G' },
    { id: 'mesh' as ToolType, icon: 'grid_on', label: 'Gradient Mesh', shortcut: 'U' },
    // Navigation
    { id: 'pan' as ToolType, icon: 'pan_tool', label: 'Hand', shortcut: 'H' },
    { id: 'zoom' as ToolType, icon: 'zoom_in', label: 'Zoom', shortcut: 'Z' },
  ], []);

  // Drag handling - fully movable
  const handleDragStart = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (dragHandleRef.current?.contains(target) || target.closest('[data-drag-handle]')) {
      setIsDragging(true);
      dragStartPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
      target.setPointerCapture(e.pointerId);
      e.preventDefault();
    }
  }, [position]);

  // Use window-level pointer events for proper dragging
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - 56, e.clientX - dragStartPos.current.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragStartPos.current.y));
        setPosition({ x: newX, y: newY });
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        if (e.target instanceof HTMLElement) {
          e.target.releasePointerCapture(e.pointerId);
        }
      }
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, dragStartPos]);


  // Group tools visually with dividers
  const selectionEnd = 3;
  const drawingEnd = 7;
  const shapesEnd = 12;
  const textEnd = 14;
  const transformEnd = 18;
  const paintEnd = 21;

  // Update CSS variables for positioning
  useEffect(() => {
    if (toolbarRef.current) {
      toolbarRef.current.style.setProperty('--toolbar-left', `${position.x}px`);
      toolbarRef.current.style.setProperty('--toolbar-top', `${position.y}px`);
    }
  }, [position]);

  return (
    <ErrorBoundary
      fallback={
        <div className="xibalba-panel-elevated-professional absolute left-4 p-2 z-[100] border border-[var(--vectorforge-accent)]/50">
          <p className="xibalba-text-caption text-[var(--vectorforge-accent)]">Toolbar error</p>
        </div>
      }
    >
      <div 
        ref={toolbarRef}
        className={`xibalba-panel-elevated-professional absolute flex flex-col gap-1 p-2 z-[100] w-14 border border-white/10 shadow-lg toolbar-positioned ${className}`}
      >
        {/* Drag Handle - visible drag handle */}
        <div
          ref={dragHandleRef}
          data-drag-handle
          onPointerDown={handleDragStart}
          className="w-full h-4 cursor-grab active:cursor-grabbing flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity mb-1 border-b border-white/10 toolbar-drag-handle"
          title="Drag to move toolbar"
        >
          <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-[var(--xibalba-text-200)]"></div>
              <div className="w-1.5 h-1.5 bg-[var(--xibalba-text-200)]"></div>
              <div className="w-1.5 h-1.5 bg-[var(--xibalba-text-200)]"></div>
          </div>
        </div>

        {tools.map((tool, idx) => (
          <React.Fragment key={tool.id}>
            <ToolButton
              tool={tool}
              activeTool={activeTool}
              onClick={setTool}
              variant="icon-only"
            />
            {/* Visual dividers between tool groups */}
            {(idx === selectionEnd - 1 || idx === drawingEnd - 1 || idx === shapesEnd - 1 || idx === textEnd - 1 || idx === transformEnd - 1 || idx === paintEnd - 1) && idx < tools.length - 1 && (
              <div className="h-px w-10 bg-white/10 my-1 mx-auto" />
            )}
          </React.Fragment>
        ))}

        <div className="h-px w-10 bg-white/10 my-1 mx-auto" />

        <button
          onClick={onSmartMagic}
          className="xibalba-toolbar-button-professional size-12 flex items-center justify-center relative group overflow-hidden bg-[var(--xibalba-grey-200)] hover:bg-[var(--xibalba-grey-250)] border-2 border-[var(--xibalba-text-100)]"
          title="Smart Magic"
        >
          <span className="material-symbols-outlined text-[20px] relative z-10" aria-hidden="true" data-icon="auto_awesome"></span>
        </button>
      </div>
    </ErrorBoundary>
  );
};

export default FloatingToolbar;
