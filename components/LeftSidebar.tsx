/**
 * Left Sidebar with Drag Handle
 * Forge, Console, Engine tabs with resizable/draggable panel
 */

import React, { useEffect } from 'react';
import { TabType, DesignStyle, AppState, VectorLayer, ToolType } from '../types';
// REMOVED: MCPSettings and TerminalSettings moved to RightSidebar
import ErrorBoundary from './ErrorBoundary';
import { Tooltip } from '@xibalba/design-system';
import { usePanelResize } from '../hooks/usePanelResize';
import { ToolButton } from './shared/ToolButton';
import { EmptyState } from './shared/EmptyState';
import { StatusIndicator } from './shared/StatusIndicator';
import { Button } from './shared/templates/Button';
import { useClickTracking } from '../hooks/useClickTracking';
import Library from './Library/Library';
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
  // Library props (Design Guide Compliance)
  showLibrary?: boolean;
  symbols?: any[];
  assets?: any[];
  onConvertToSymbol?: (name: string, type: 'movieclip' | 'graphic' | 'button') => void;
  onEditSymbol?: (id: string) => void;
  onDragStart?: (e: React.DragEvent, symbol: any) => void;
  onCreateAsset?: () => void;
  onSymbolCreated?: (symbol: any) => void;
  onShowToast?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  state,
  setState,
  onGenerate,
  onRefine,
  onTerminalCommand,
  onVisionScan,
  activeTool,
  onToolChange,
  showLibrary = true,
  symbols = [],
  assets = [],
  onConvertToSymbol,
  onEditSymbol,
  onDragStart,
  onCreateAsset,
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

  // REMOVED: Console and Engine tabs moved to RightSidebar
  // Left sidebar is now just for tools

  // Tool selector for quick access - MUST be defined before useEffect hooks
  const tools: { id: ToolType; label: string; icon: string; shortcut?: string }[] = [
    { id: 'select', label: 'Select', icon: 'near_me', shortcut: 'V' },
    { id: 'pen', label: 'Pen', icon: 'edit', shortcut: 'P' },
    { id: 'rectangle', label: 'Rectangle', icon: 'crop_square', shortcut: 'M' },
    { id: 'ellipse', label: 'Ellipse', icon: 'radio_button_unchecked', shortcut: 'L' },
    { id: 'text', label: 'Text', icon: 'text_fields', shortcut: 'T' },
    { id: 'pan', label: 'Pan', icon: 'open_with', shortcut: 'H' },
    { id: 'zoom', label: 'Zoom', icon: 'zoom_in', shortcut: 'Z' },
  ];

  // Ensure sidebar is expanded by default on mount
  useEffect(() => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  }, [isCollapsed, setIsCollapsed]);

  // #region agent log - LeftSidebar render verification
  useEffect(() => {
    console.log('[DEBUG] LeftSidebar RENDERED', {
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'test-ui-fixes',
      hypothesisId: 'C',
      data: {
        width,
        isCollapsed,
        toolsCount: tools.length,
      },
    });
  }, [width, isCollapsed, tools.length]);
  // #endregion

  // REMOVED: Terminal settings moved to RightSidebar
  // REUSE: Resize/drag logic now in usePanelResize hook

  return (
    <aside
      ref={sidebarRef}
      className="shrink-0 flex flex-col bg-[var(--xibalba-grey-050)] overflow-hidden sidebar-fixed-left"
      style={{
        width: '320px',
        minWidth: '320px',
        maxWidth: '320px',
        flex: '0 0 320px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
          onPointerDown={e => {
            trackClick('resize-handle', 'drag');
            handleResizeStart(e);
          }}
          className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize bg-[var(--xibalba-grey-200)] hover:bg-[var(--xibalba-accent)] opacity-40 hover:opacity-100 transition-all zstack-sidebar-resize-handle z-[1000]"
        />
      </Tooltip>

      {/* Header - Removed for now, can add back if needed */}

      {/* Single-column layout: Tool Dock only (AI Panel moved to center stack) */}
      {!isCollapsed && (
        <div
          className="sidebar-tool-dock flex-1 overflow-hidden min-h-0"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            minWidth: 0,
            position: 'relative',
          }}
        >
          {/* Vertical Tool Dock - Full Width */}
          <div
            className="tool-dock-column shrink-0 bg-[var(--xibalba-grey-000)] flex flex-col"
            style={{
              width: '100%',
              position: 'relative',
              zIndex: 10,
              overflow: 'hidden',
              boxSizing: 'border-box',
            }}
          >
            {tools.map(tool => {
              const tooltipConfig = {
                select: { content: 'Select and move objects on the canvas', shortcut: 'V' },
                pen: { content: 'Draw custom paths and shapes', shortcut: 'P' },
                rectangle: { content: 'Draw rectangles and squares', shortcut: 'M' },
                ellipse: { content: 'Draw circles and ellipses', shortcut: 'L' },
                text: { content: 'Add text to your design', shortcut: 'T' },
                pan: { content: 'Pan around the canvas', shortcut: 'H' },
                zoom: { content: 'Zoom in and out of the canvas', shortcut: 'Z' },
              }[tool.id] || { content: `${tool.label} tool`, shortcut: tool.shortcut };

              return (
                <Tooltip
                  key={tool.id}
                  content={tooltipConfig.content}
                  shortcut={tooltipConfig.shortcut}
                  position="right"
                >
                  <button
                    onClick={() => onToolChange && onToolChange(tool.id)}
                    className={`w-full h-12 flex items-center justify-center border-b border-[var(--xibalba-grey-200)] transition-colors ${
                      activeTool === tool.id
                        ? 'bg-[var(--vectorforge-accent)] text-white'
                        : 'bg-transparent text-[var(--xibalba-text-100)] hover:bg-[var(--xibalba-grey-100)]'
                    }`}
                    title={tooltipConfig.content}
                    aria-label={tool.label}
                    style={{
                      fontSize: 0,
                      lineHeight: 0,
                      textIndent: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-xl"
                      style={{ fontSize: '20px', lineHeight: '20px' }}
                    >
                      {tool.icon}
                    </span>
                  </button>
                </Tooltip>
              );
            })}
          </div>

          {/* Library Panel - Flash-style symbol system (Design Guide Compliance) */}
          {showLibrary && onConvertToSymbol && (
            <div
              className="library-section"
              style={{
                borderTop: '1px solid var(--xibalba-grey-200, #2a2a2a)',
                flex: '1 1 0%',
                minHeight: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Library
                symbols={symbols || []}
                assets={assets || []}
                onConvertToSymbol={onConvertToSymbol}
                onEditSymbol={onEditSymbol || (() => {})}
                onDragStart={onDragStart || (() => {})}
                onCreateAsset={onCreateAsset || (() => {})}
              />
            </div>
          )}
        </div>
      )}

      {/* REUSE: Using StatusIndicator component */}
      <div className="bg-[var(--xibalba-grey-100)]" style={{ padding: 'var(--spacing-md, 12px)' }}>
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
