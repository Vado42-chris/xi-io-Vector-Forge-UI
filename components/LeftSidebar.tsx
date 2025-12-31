/**
 * Left Sidebar with Drag Handle
 * Forge, Console, Engine tabs with resizable/draggable panel
 */

import React from 'react';
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
import GenerativeVectorAIPanel from './GenerativeVectorAIPanel';

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
  state,
  setState,
  onGenerate,
  onRefine,
  onTerminalCommand,
  onVisionScan,
  activeTool,
  onToolChange,
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

  // Tool selector for quick access - FULL LABELS (no truncation)
  const tools: { id: ToolType; label: string; icon: string; shortcut?: string }[] = [
    { id: 'select', label: 'Select', icon: 'near_me', shortcut: 'V' },
    { id: 'pen', label: 'Pen', icon: 'edit', shortcut: 'P' },
    { id: 'rectangle', label: 'Rectangle', icon: 'crop_square', shortcut: 'M' },
    { id: 'ellipse', label: 'Ellipse', icon: 'radio_button_unchecked', shortcut: 'L' },
    { id: 'text', label: 'Text', icon: 'text_fields', shortcut: 'T' },
    { id: 'pan', label: 'Pan', icon: 'open_with', shortcut: 'H' },
    { id: 'zoom', label: 'Zoom', icon: 'zoom_in', shortcut: 'Z' },
  ];

  // REMOVED: Terminal settings moved to RightSidebar
  // REUSE: Resize/drag logic now in usePanelResize hook

  return (
    <aside
      ref={sidebarRef}
      className="xibalba-sidebar shrink-0 flex flex-row xibalba-dockable-palette sidebar-fixed-left bg-[var(--xibalba-grey-050)] overflow-hidden zstack-sidebar-left left-sidebar-container"
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
          className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize bg-[var(--xibalba-grey-200)] hover:bg-[var(--xibalba-accent)] opacity-60 hover:opacity-100 transition-all zstack-sidebar-resize-handle z-[1000]"
        />
      </Tooltip>

      {/* Vertical Toolbar - Far Left (just icons) */}
      <div className="left-sidebar-vertical-toolbar">
        {tools.map(tool => {
          const tooltipContent =
            tool.id === 'select'
              ? `Select Tool (${tool.shortcut})`
              : tool.id === 'pen'
                ? `Pen Tool (${tool.shortcut})`
                : tool.id === 'rectangle'
                  ? `Rectangle Tool (${tool.shortcut})`
                  : tool.id === 'ellipse'
                    ? `Ellipse Tool (${tool.shortcut})`
                    : tool.id === 'text'
                      ? `Text Tool (${tool.shortcut})`
                      : tool.id === 'pan'
                        ? `Pan Tool (${tool.shortcut})`
                        : tool.id === 'zoom'
                          ? `Zoom Tool (${tool.shortcut})`
                          : `${tool.label} (${tool.shortcut || 'N/A'})`;

          return (
            <Tooltip key={tool.id} content={tooltipContent} position="right">
              <button
                className={`left-sidebar-tool-icon ${activeTool === tool.id ? 'left-sidebar-tool-icon-active' : ''}`}
                onClick={() => onToolChange && onToolChange(tool.id)}
                disabled={!onToolChange}
                aria-label={tool.label}
              >
                <span className="material-symbols-outlined">{tool.icon}</span>
              </button>
            </Tooltip>
          );
        })}
      </div>

      {/* Generative Vector AI Panel - Right Side */}
      <div className="left-sidebar-ai-panel-container">
        <GenerativeVectorAIPanel
          prompt={state.prompt}
          onPromptChange={p => setState(prev => ({ ...prev, prompt: p }))}
          style={state.style}
          onStyleChange={s => setState(prev => ({ ...prev, style: s }))}
          complexity={state.complexity}
          onComplexityChange={c => setState(prev => ({ ...prev, complexity: c }))}
          palette={['#d46b32', '#343842', '#b8bfcc']}
          onPaletteChange={p => {
            // Store palette in state if needed
            console.log('Palette changed:', p);
          }}
          credits={state.credits}
          onGenerate={onGenerate || (async () => {})}
        />
      </div>
    </aside>
  );
};

export default LeftSidebar;
