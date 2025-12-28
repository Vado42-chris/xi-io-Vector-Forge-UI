/**
 * Left Sidebar with Drag Handle
 * Forge, Console, Engine tabs with resizable/draggable panel
 */

import React, { useState, useEffect, useRef } from 'react';
import { TabType, DesignStyle, AppState, VectorLayer, ToolType } from '../types';
// REMOVED: MCPSettings and TerminalSettings moved to RightSidebar
import ErrorBoundary from './ErrorBoundary';
import Tooltip from './Tooltip';

interface LeftSidebarProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onGenerate?: () => Promise<void>;
  onRefine?: () => Promise<void>;
  onChat?: (message: string) => void;
  onTerminalCommand?: (cmd: string) => void;
  onVisionScan?: () => void;
  frame?: number;
  layerId?: string | null;
  layers?: VectorLayer[];
  currentScript?: string;
  onScriptGenerated?: (script: string) => void;
  onExecuteScript?: (script: string) => void;
  activeTool?: ToolType;
  onToolChange?: (tool: ToolType) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  state, setState, onGenerate, onRefine, onTerminalCommand, onVisionScan, activeTool, onToolChange
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(320);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  // REMOVED: Console and Engine tabs moved to RightSidebar
  // Left sidebar is now just for tools
  
  // Tool selector for quick access
  const tools: { id: ToolType; label: string; icon: string; shortcut?: string }[] = [
    { id: 'select', label: 'Select', icon: 'near_me', shortcut: 'V' },
    { id: 'pen', label: 'Pen', icon: 'edit', shortcut: 'P' },
    { id: 'rectangle', label: 'Rectangle', icon: 'crop_square', shortcut: 'M' },
    { id: 'ellipse', label: 'Ellipse', icon: 'radio_button_unchecked', shortcut: 'L' },
    { id: 'text', label: 'Text', icon: 'text_fields', shortcut: 'T' },
    { id: 'pan', label: 'Pan', icon: 'open_with', shortcut: 'H' },
    { id: 'zoom', label: 'Zoom', icon: 'zoom_in', shortcut: 'Z' }
  ];
  
  // REMOVED: Terminal settings moved to RightSidebar


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
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 600) {
          setWidth(newWidth);
        }
      } else if (isDragging) {
        setPosition({ x: e.clientX - dragStartPos.current.x, y: e.clientY - dragStartPos.current.y });
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
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isResizing, isDragging, dragStartPos]);

  const handleResizeEnd = (e: React.PointerEvent) => {
    if (isResizing && e.target instanceof HTMLElement) {
      e.target.releasePointerCapture(e.pointerId);
    }
    setIsResizing(false);
    setIsDragging(false);
  };

  const handleDragStart = (e: React.PointerEvent) => {
    if (resizeHandleRef.current?.contains(e.target as Node)) {
      return; // Don't drag when resizing
    }
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  };


  // Update CSS variables for positioning
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.setProperty('--sidebar-width', `${width}px`);
      sidebarRef.current.style.setProperty('--sidebar-left', `${position.x}px`);
      sidebarRef.current.style.setProperty('--sidebar-top', `${position.y}px`);
    }
  }, [width, position]);

  return (
    <aside 
      ref={sidebarRef}
      className="xibalba-sidebar shrink-0 flex flex-col relative z-20 sidebar-positioned xibalba-dockable-palette"
      onPointerDown={handleDragStart}
      data-palette-id="left-sidebar"
    >
      {/* Resize Handle */}
      <Tooltip content="Drag to resize sidebar" position="right">
        <div
          ref={resizeHandleRef}
          onPointerDown={handleResizeStart}
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[var(--xibalba-text-100)] opacity-0 hover:opacity-100 transition-opacity z-30"
        />
      </Tooltip>

      {/* Tools Panel Header - Background layer with title */}
      <div className="relative bg-[var(--xibalba-bg-secondary)] border-b border-white/10">
        {/* Construction Paper Layer for readability */}
        <div className="construction-paper-layer-menu" />
        
        {/* Header Content */}
        <div className="relative z-10 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="xibalba-toolbar-button-professional p-1"
              title={isCollapsed ? 'Expand Tools Panel' : 'Collapse Tools Panel'}
            >
              <span className="material-symbols-outlined text-[14px]">
                {isCollapsed ? 'chevron_right' : 'chevron_left'}
              </span>
            </button>
            <span className="text-[9px] font-bold text-[var(--xibalba-text-primary)] uppercase tracking-widest">Tools Panel</span>
          </div>
          <span className="text-[8px] text-[var(--xibalba-text-muted)] normal-case">Press key to switch</span>
        </div>
      </div>

      {/* Quick Tool Selector - Single column layout, collapsible */}
      {!isCollapsed && activeTool && onToolChange && (
        <div className="p-3 border-b border-white/10 bg-[var(--xibalba-bg-secondary)]">
          <div className="flex flex-col gap-1.5">
            {tools.map(tool => {
              const tooltipContent = tool.id === 'select' ? `Select Tool (${tool.shortcut}) - Select and move objects` :
                tool.id === 'pen' ? `Pen Tool (${tool.shortcut}) - Draw freeform paths` :
                tool.id === 'rectangle' ? `Rectangle Tool (${tool.shortcut}) - Draw rectangles` :
                tool.id === 'ellipse' ? `Ellipse Tool (${tool.shortcut}) - Draw circles and ellipses` :
                tool.id === 'text' ? `Text Tool (${tool.shortcut}) - Add text to canvas` :
                tool.id === 'pan' ? `Pan Tool (${tool.shortcut}) - Move canvas view` :
                tool.id === 'zoom' ? `Zoom Tool (${tool.shortcut}) - Zoom in/out` :
                `${tool.label} (${tool.shortcut || 'N/A'})`;
              
              return (
                <Tooltip
                  key={tool.id}
                  content={tooltipContent}
                  position="right"
                >
                  <button
                    onClick={() => onToolChange(tool.id)}
                    className={`xibalba-button-professional text-[9px] py-1.5 px-2 flex items-center gap-1.5 transition-all ${
                      activeTool === tool.id 
                        ? 'bg-[var(--xibalba-bg-hover)] border border-[var(--xibalba-accent)] shadow-sm' 
                        : 'hover:bg-[var(--xibalba-bg-tertiary)]'
                    }`}
                  >
                <span className={`material-symbols-outlined text-[14px] ${activeTool === tool.id ? 'text-[var(--xibalba-accent)]' : ''}`}>
                  {tool.icon}
                </span>
                <span className={`flex-1 text-left ${activeTool === tool.id ? 'font-semibold' : ''}`}>
                  {tool.label}
                </span>
                {tool.shortcut && (
                  <span className={`text-[8px] font-mono px-1 py-0.5 rounded ${
                    activeTool === tool.id 
                      ? 'bg-[var(--xibalba-accent)]/20 text-[var(--xibalba-accent)]' 
                      : 'bg-[var(--xibalba-bg-tertiary)] text-[var(--xibalba-text-muted)]'
                  }`}>
                    {tool.shortcut}
                  </span>
                )}
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>
      )}

      {/* Pinned Tool Palettes Area - For custom palettes pinned to this panel, collapsible */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto xibalba-scrollbar p-4">
          {/* Empty state when no palettes pinned */}
          <div className="text-center text-[var(--xibalba-text-300)] text-sm py-8">
            <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">palette</span>
            <p className="text-xs mt-2 opacity-75">Pin tool palettes here from the Palettes menu</p>
            <p className="text-[10px] mt-1 opacity-60">Window → Palettes</p>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-white/10 bg-[var(--xibalba-bg-secondary)] flex items-center justify-between text-[9px] font-bold text-[var(--xibalba-text-muted)] uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className={`size-2 ${state.isGenerating ? 'bg-[var(--xibalba-bg-tertiary)] animate-pulse' : 'bg-green-500'}`}></div>
          <span>{state.isGenerating ? 'AI SYNTHESIZING' : 'SYSTEM READY'}</span>
        </div>
        <span>CREDITS: {state.credits}</span>
      </div>
    </aside>
  );
};

export default LeftSidebar;
