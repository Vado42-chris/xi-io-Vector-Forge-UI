/**
 * Left Sidebar with Drag Handle
 * Forge, Console, Engine tabs with resizable/draggable panel
 */

import React, { useEffect } from 'react';
import { TabType, DesignStyle, AppState, VectorLayer, ToolType } from '../types';
// REMOVED: MCPSettings and TerminalSettings moved to RightSidebar
import ErrorBoundary from './ErrorBoundary';
import Tooltip from './Tooltip';
import { usePanelResize } from '../hooks/usePanelResize';
import { ToolButton } from './shared/ToolButton';
import { EmptyState } from './shared/EmptyState';
import { StatusIndicator } from './shared/StatusIndicator';
import { Button } from './shared/templates/Button';
import { useClickTracking } from '../hooks/useClickTracking';
import { errorReportingService } from '../services/errorReportingService';
import { usabilityHeuristicsService } from '../services/usabilityHeuristicsService';

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
  // TRACKING: Patent-safe click tracking
  const { trackClick } = useClickTracking({ componentName: 'LeftSidebar' });

  // REUSE: Extract common resize/drag logic to shared hook
  const {
    width,
    isCollapsed,
    setIsCollapsed,
    sidebarRef,
    resizeHandleRef,
    handleResizeStart,
    handleDragStart,
  } = usePanelResize({
    defaultWidth: 320,
    minWidth: 200,
    maxWidth: 600,
    side: 'left',
  });

  // Ensure sidebar is expanded by default on mount
  useEffect(() => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  }, [isCollapsed, setIsCollapsed]);

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
  // REUSE: Resize/drag logic now in usePanelResize hook

  return (
    <aside 
      ref={sidebarRef}
      className="shrink-0 flex flex-col bg-[var(--xibalba-grey-050)] overflow-hidden sidebar-fixed-left"
      style={{ 
        width: `${width}px`, 
        minWidth: `${width}px`, 
        maxWidth: `${width}px`, 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
      onPointerDown={handleDragStart}
      data-palette-id="left-sidebar"
      data-sidebar-width={width}
      data-sidebar-left-width={width}
    >
      {/* Resize Handle - Always Visible */}
      <Tooltip content="Drag to resize sidebar" position="right">
        <div
          ref={resizeHandleRef}
          onPointerDown={(e) => {
            trackClick('resize-handle', 'drag');
            handleResizeStart(e);
          }}
          className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize bg-[var(--xibalba-grey-200)] hover:bg-[var(--xibalba-accent)] opacity-40 hover:opacity-100 transition-all zstack-sidebar-resize-handle z-[1000]"
        />
      </Tooltip>

      {/* Header - Removed for now, can add back if needed */}
      
      {/* Two-column layout: Tool Dock + AI Panel */}
      {!isCollapsed && (
        <div 
          className="sidebar-two-column-layout flex-1 overflow-hidden min-h-0"
          style={{ 
            display: 'grid',
            gridTemplateColumns: '48px 1fr',
            gridTemplateRows: '1fr',
            width: '100%',
            height: '100%',
            minWidth: 0,
            gap: 0,
            position: 'relative'
          }}
        >
          {/* Vertical Tool Dock - Far Left (48px) */}
          <div 
            className="tool-dock-column shrink-0 bg-[var(--xibalba-grey-000)] flex flex-col border-r border-[var(--xibalba-grey-200)]"
            style={{ 
              gridColumn: '1 / 2',
              gridRow: '1',
              width: '48px',
              minWidth: '48px',
              maxWidth: '48px',
              flexShrink: 0,
              flexGrow: 0,
              position: 'relative',
              zIndex: 10,
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}
          >
            {tools.map(tool => {
              const tooltipContent = tool.id === 'select' ? `Select Tool (${tool.shortcut})` :
                tool.id === 'pen' ? `Pen Tool (${tool.shortcut})` :
                tool.id === 'rectangle' ? `Rectangle Tool (${tool.shortcut})` :
                tool.id === 'ellipse' ? `Ellipse Tool (${tool.shortcut})` :
                tool.id === 'text' ? `Text Tool (${tool.shortcut})` :
                tool.id === 'pan' ? `Pan Tool (${tool.shortcut})` :
                tool.id === 'zoom' ? `Zoom Tool (${tool.shortcut})` :
                `${tool.label} (${tool.shortcut || 'N/A'})`;
              
              return (
                <Tooltip key={tool.id} content={tooltipContent} position="right" disabled={false}>
                  <button
                    onClick={() => onToolChange && onToolChange(tool.id)}
                    className={`w-12 h-12 flex items-center justify-center border-b border-[var(--xibalba-grey-200)] transition-colors ${
                      activeTool === tool.id
                        ? 'bg-[var(--vectorforge-accent)] text-white'
                        : 'bg-transparent text-[var(--xibalba-text-100)] hover:bg-[var(--xibalba-grey-100)]'
                    }`}
                    title={tooltipContent}
                    aria-label={tool.label}
                    style={{ 
                      fontSize: 0,
                      lineHeight: 0,
                      textIndent: 0,
                      overflow: 'hidden'
                    }}
                  >
                    <span className="material-symbols-outlined text-xl" style={{ fontSize: '20px', lineHeight: '20px' }}>{tool.icon}</span>
                  </button>
                </Tooltip>
              );
            })}
          </div>

          {/* Generative AI Panel - Right side of left sidebar */}
          <div 
            className="ai-panel-column flex-1 overflow-y-auto xibalba-scrollbar p-4 space-y-6 min-w-0"
            style={{ 
              gridColumn: '2',
              gridRow: '1',
              minWidth: 0,
              width: 'auto',
              position: 'relative',
              zIndex: 1,
              overflowX: 'hidden',
              overflowY: 'auto'
            }}
          >
            {/* AI Generation Panel */}
            <div className="xibalba-panel-section bg-[var(--xibalba-grey-100)] rounded-lg p-4 border border-[var(--xibalba-grey-200)]">
            <h3 className="text-xs font-bold text-[var(--xibalba-text-primary)] uppercase tracking-widest mb-4">
              GENERATIVE VECTOR AI
            </h3>
            
            {/* PROMPT Section */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-[var(--xibalba-text-100)] uppercase tracking-wide mb-2 block">
                PROMPT
              </label>
              <div className="flex gap-2">
                <textarea
                  value={state.prompt}
                  onChange={(e) => setState(p => ({ ...p, prompt: e.target.value }))}
                  placeholder="Describe the vector..."
                  className="flex-1 bg-[var(--xibalba-grey-050)] border border-[var(--xibalba-grey-200)] rounded px-3 py-2 text-sm text-[var(--xibalba-text-000)] placeholder:text-[var(--xibalba-text-200)] focus:outline-none focus:border-[var(--vectorforge-accent)] resize-none"
                  rows={3}
                />
                <Button
                  icon="history"
                  onClick={() => {}}
                  variant="icon-only"
                  size="sm"
                  tooltip="History"
                />
              </div>
            </div>

            {/* STYLE & COMPLEXITY Section */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-[var(--xibalba-text-100)] uppercase tracking-wide mb-2 block">
                STYLE & COMPLEXITY
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { id: 'flat-icon', label: 'Flat Icon' },
                  { id: 'line-art', label: 'Line Art' },
                  { id: 'isometric', label: 'Isometric' },
                  { id: 'abstract', label: 'Abstract' }
                ].map(style => (
                  <button
                    key={style.id}
                    onClick={() => setState(p => ({ ...p, style: style.id as any }))}
                    className={`px-3 py-2 text-xs font-medium rounded border transition-colors ${
                      state.style === style.id
                        ? 'bg-[var(--vectorforge-accent)] text-white border-[var(--vectorforge-accent)]'
                        : 'bg-[var(--xibalba-grey-050)] text-[var(--xibalba-text-100)] border-[var(--xibalba-grey-200)] hover:border-[var(--vectorforge-accent)]'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--xibalba-text-200)]">Minimal</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={state.complexity || 50}
                  onChange={(e) => setState(p => ({ ...p, complexity: parseInt(e.target.value) }))}
                  className="flex-1 h-2 bg-[var(--xibalba-grey-200)] rounded-lg appearance-none cursor-pointer accent-[var(--vectorforge-accent)]"
                />
                <span className="text-xs text-[var(--xibalba-text-200)]">Detailed</span>
              </div>
            </div>

            {/* PALETTE Section */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-[var(--xibalba-text-100)] uppercase tracking-wide mb-2 block">
                PALETTE
              </label>
              <div className="flex items-center gap-2">
                {['#ff9800', '#808080', '#404040'].map((color, i) => (
                  <button
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[var(--xibalba-grey-200)] hover:border-[var(--vectorforge-accent)] transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => {}}
                  />
                ))}
                <button className="w-8 h-8 rounded-full border-2 border-dashed border-[var(--xibalba-grey-200)] flex items-center justify-center text-[var(--xibalba-text-200)] hover:border-[var(--vectorforge-accent)]">
                  +
                </button>
              </div>
            </div>

            {/* GENERATE Button */}
            <Button
              onClick={onGenerate}
              disabled={!state.prompt || state.isGenerating}
              className="w-full bg-[var(--vectorforge-accent)] text-white font-semibold py-3 rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              GENERATE VECTOR
            </Button>

            {/* Credits */}
            <div className="mt-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-[var(--xibalba-text-100)]">
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span>{state.credits || 0} Credits</span>
              </div>
              <button className="text-[var(--vectorforge-accent)] hover:underline">
                Buy More
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* REUSE: Using StatusIndicator component */}
      <div className="p-4 bg-[var(--xibalba-grey-050)]">
        <StatusIndicator
          status={state.isGenerating ? 'processing' : 'ready'}
          message={state.isGenerating ? 'AI SYNTHESIZING' : 'SYSTEM READY'}
          secondary={`CREDITS: ${state.credits}`}
        />
      </div>
    </aside>
  );
};

export default LeftSidebar;
