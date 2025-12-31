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
    { id: 'zoom', label: 'Zoom', icon: 'zoom_in', shortcut: 'Z' }
  ];
  
  // REMOVED: Terminal settings moved to RightSidebar
  // REUSE: Resize/drag logic now in usePanelResize hook

  return (
    <aside 
      ref={sidebarRef}
      className="xibalba-sidebar shrink-0 flex flex-col xibalba-dockable-palette sidebar-fixed-left bg-[var(--xibalba-grey-050)] overflow-hidden zstack-sidebar-left"
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
          className="absolute right-0 top-0 bottom-0 w-3 cursor-col-resize bg-[var(--xibalba-grey-200)] hover:bg-[var(--xibalba-accent)] opacity-60 hover:opacity-100 transition-all zstack-sidebar-resize-handle"
          style={{ 
            zIndex: 'var(--z-sidebar-resize-handle, 150)',
            pointerEvents: 'auto',
          }}
          style={{ 
            background: 'var(--xibalba-grey-200)',
            opacity: 0.6,
          }}
        />
      </Tooltip>

      {/* Tools Panel Header - Background layer with title */}
      <div className="relative w-full bg-[var(--xibalba-grey-050)] overflow-hidden xibalba-sidebar-header">
        {/* Construction Paper Layer for readability - constrained to header only */}
        <div className="construction-paper-layer-menu xibalba-sidebar-header-paper" />
        
        {/* Header Content */}
        <div className="relative z-10 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              icon={isCollapsed ? 'chevron_right' : 'chevron_left'}
              onClick={() => {
                trackClick('button', 'click');
                setIsCollapsed(!isCollapsed);
              }}
              variant="icon-only"
              size="sm"
              tooltip={isCollapsed ? 'Expand Tools Panel' : 'Collapse Tools Panel'}
              aria-label={isCollapsed ? 'Expand Tools Panel' : 'Collapse Tools Panel'}
            />
            <span className="text-xs font-bold text-[var(--xibalba-text-primary)] uppercase tracking-widest">Tools Panel</span>
          </div>
          <span className="text-xs text-[var(--xibalba-text-100)] normal-case">Press key to switch</span>
        </div>
      </div>

      {/* Quick Tool Selector - REUSE: Using ToolButton component - Organized Grid */}
      {!isCollapsed && (
        <div className="xibalba-panel-section bg-[var(--xibalba-grey-050)]">
          <div className="xibalba-ia-group-header">Tools</div>
          <div className="xibalba-tools-panel left-sidebar-tools">
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
                <ToolButton
                  key={tool.id}
                  tool={tool}
                  activeTool={activeTool}
                  onClick={(id) => {
                    console.log('Tool clicked:', id);
                    if (onToolChange) {
                      onToolChange(id);
                    }
                  }}
                  disabled={false}
                  tooltip={tooltipContent}
                  variant="compact"
                  style={{
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    opacity: 1
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Pinned Tool Palettes Area - REUSE: Using EmptyState component */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto xibalba-scrollbar p-4">
          <EmptyState
            icon="palette"
            message="Pin tool palettes here from the Palettes menu"
            action={{
              label: 'Window → Palettes',
              onClick: () => {},
            }}
          />
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
