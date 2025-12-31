/**
 * Right Sidebar with Drag Handle
 * Tool properties, Object inspector, Layers, History
 */

import React, { useState, useEffect } from 'react';
import { VectorLayer, ToolType, ToolProperties, AnimationKeyframe, FrameState, AppState } from '../types';
import ToolPropertiesPanel from './ToolPropertiesPanel';
import ProfessionalLayersPanel from './ProfessionalLayersPanel';
import ScriptEditor from './ScriptEditor';
import AIChatbot from './AIChatbot';
import RegistryBrowser from './RegistryBrowser';
import ErrorBoundary from './ErrorBoundary';
import ContextualHelpPanel from './ContextualHelpPanel';
import Tooltip from './Tooltip';
import MCPSettings from './MCPSettings';
import TerminalSettings from './TerminalSettings';
import FileBrowser from './FileBrowser';
import Terminal from './Terminal';
import DevChatbot from './DevChatbot';
import DevChatTestSimple from './DevChatTestSimple';
import { usePanelResize } from '../hooks/usePanelResize';
import { useClickTracking } from '../hooks/useClickTracking';
import { TabSystem } from './shared/TabSystem';
import { IconButton } from './shared/IconButton';

interface RightSidebarProps {
  layers: VectorLayer[];
  selectedLayerId: string | null;
  activeTool: ToolType;
  toolProperties: ToolProperties;
  onToolPropertiesChange: (properties: Partial<ToolProperties>) => void;
  onSelectLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onUpdateProperty: (id: string, property: string, value: any) => void;
  onUpdateShapeProperty?: (id: string, property: string, value: any) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onReorderLayer: (oldIndex: number, newIndex: number) => void;
  onRenameLayer: (id: string, newName: string) => void;
  onUpdateLayer: (id: string, updates: Partial<VectorLayer>) => void;
  onCreateLayer: () => void;
  onCreateSublayer: (parentId: string) => void;
  onGroupLayers: (ids: string[]) => void;
  onUngroupLayer: (id: string) => void;
  onCreateClippingMask: (layerId: string, maskId: string) => void;
  onReleaseClippingMask: (layerId: string) => void;
  onBringToFront?: (id: string) => void;
  onSendToBack?: (id: string) => void;
  onBringForward?: (id: string) => void;
  onSendBackward?: (id: string) => void;
  onExpandAppearance?: (id: string) => void;
  onCreateOutlines?: (id: string) => void;
  snapshots: { id: string; name: string; svg: string; timestamp: number }[];
  onRestoreSnapshot: (svg: string) => void;
  // Scripting system props
  keyframes: AnimationKeyframe[];
  frameState: FrameState;
  onScriptChange: (frame: number, layerId: string | null, script: string) => void;
  onScriptExecute?: (script: string) => void;
  // AI Chatbot props (moved from LeftSidebar)
  state?: AppState;
  setState?: React.Dispatch<React.SetStateAction<AppState>>;
  onScriptGenerated?: (script: string) => void;
  // Terminal command handler
  onTerminalCommand?: (cmd: string) => void;
  // Conversation history
  onShowConversationHistory?: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  layers, selectedLayerId, activeTool, toolProperties, onToolPropertiesChange, 
  onSelectLayer, onToggleVisibility, onToggleLock, onUpdateProperty, onUpdateShapeProperty, 
  onDeleteLayer, onDuplicateLayer, onReorderLayer, onRenameLayer,
  onUpdateLayer, onCreateLayer, onCreateSublayer, onGroupLayers, onUngroupLayer,
  onCreateClippingMask, onReleaseClippingMask,
  onBringToFront, onSendToBack, onBringForward, onSendBackward,
  onExpandAppearance, onCreateOutlines,
  snapshots, onRestoreSnapshot,
  keyframes, frameState, onScriptChange, onScriptExecute,
  state, setState,   onScriptGenerated, onTerminalCommand, onShowConversationHistory
}) => {
  const selectedLayer = layers.find(l => l.id === selectedLayerId);
  // Default to Dev Chat tab for easy access - ALWAYS devchat on mount
  const [activeRightTab, setActiveRightTab] = useState<'tool' | 'inspector' | 'layers' | 'scripts' | 'chat' | 'console' | 'engine' | 'registry' | 'checkpoints' | 'help' | 'files' | 'terminal' | 'devchat' | 'tasks'>('devchat');
  
  // Debug: Log when RightSidebar renders
  useEffect(() => {
    console.log('✅ RightSidebar mounted - Dev Chat tab should be active');
    console.log('✅ Active tab:', activeRightTab);
  }, [activeRightTab]);
  
  // TRACKING: Patent-safe click tracking
  const { trackClick } = useClickTracking({ componentName: 'RightSidebar' });
  const [showTerminalSettings, setShowTerminalSettings] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  
  // Auto-switch to Scripts tab when script icon is clicked from timeline
  useEffect(() => {
    // This will be triggered externally when needed
  }, []);

  // Expose methods to switch tabs (can be called from parent)
  useEffect(() => {
    // Store references for external access if needed
    (window as any).__switchToScriptsTab = () => setActiveRightTab('scripts');
    (window as any).__switchToLayersTab = () => setActiveRightTab('layers');
    (window as any).__switchToDevChatTab = () => setActiveRightTab('devchat');
  }, []);

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
    defaultWidth: 360,
    minWidth: 200,
    maxWidth: 600,
    side: 'right',
  });

  // CRITICAL: Force sidebar to be expanded on mount (for Dev Chat access)
  useEffect(() => {
    if (isCollapsed) {
      console.log('⚠️ Right Sidebar was collapsed, forcing it expanded for Dev Chat access');
      setIsCollapsed(false);
    }
  }, [isCollapsed, setIsCollapsed]);

  const renderParametricControls = () => {
    if (!selectedLayer || selectedLayer.shape.type !== 'rect' || !onUpdateShapeProperty) return null;

    const shape = selectedLayer.shape;
    return (
      <div className="xibalba-panel-professional space-y-4">
        <h3 className="xibalba-label-professional">Rectangle Properties</h3>
        <div className="grid grid-cols-2 gap-4">
          <Tooltip content="Width - Set the width of the rectangle in pixels" position="left">
            <div>
              <label className="xibalba-label-professional">Width</label>
              <input
                type="number"
                value={shape.width}
                onChange={(e) => onUpdateShapeProperty(selectedLayer.id, 'width', parseFloat(e.target.value) || 0)}
                className="xibalba-input-professional w-full"
                min="0"
                step="1"
                placeholder="100"
              />
            </div>
          </Tooltip>
          <Tooltip content="Height - Set the height of the rectangle in pixels" position="left">
            <div>
              <label className="xibalba-label-professional">Height</label>
              <input
                type="number"
                value={shape.height}
                onChange={(e) => onUpdateShapeProperty(selectedLayer.id, 'height', parseFloat(e.target.value) || 0)}
                className="xibalba-input-professional w-full"
                min="0"
                step="1"
                placeholder="100"
              />
            </div>
          </Tooltip>
          <Tooltip content="Border Radius - Set the corner radius for rounded corners (0 = sharp corners)" position="left">
            <div>
              <label className="xibalba-label-professional">Border Radius</label>
              <input
                type="number"
                value={shape.borderRadius}
                onChange={(e) => onUpdateShapeProperty(selectedLayer.id, 'borderRadius', parseFloat(e.target.value) || 0)}
                className="xibalba-input-professional w-full"
                min="0"
                step="1"
                placeholder="0"
              />
            </div>
          </Tooltip>
        </div>
      </div>
    );
  };

  // Update CSS variables for positioning - REUSE: Now handled by usePanelResize hook

  return (
        <div 
          ref={sidebarRef}
          className="flex flex-col min-h-0 shrink-0 xibalba-dockable-palette sidebar-fixed-right bg-[var(--xibalba-grey-050)]"
          onPointerDown={handleDragStart}
          data-palette-id="right-sidebar"
          data-sidebar-right-width={width}
          data-sidebar-width={width}
        >
      {/* Resize Handle - Always Visible */}
      <Tooltip content="Drag to resize sidebar" position="right">
        <div
          ref={resizeHandleRef}
          onPointerDown={(e) => {
            trackClick('resize-handle', 'drag');
            handleResizeStart(e);
          }}
          className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize bg-[var(--xibalba-grey-200)] hover:bg-[var(--xibalba-accent)] opacity-40 hover:opacity-100 transition-all z-sidebar-resize-handle z-[1000]"
        />
      </Tooltip>

      {/* REUSE: Using TabSystem component */}
      <div className="shrink-0">
        <TabSystem
          tabs={[
            // DEV CHAT FIRST - Most important, always visible
            { id: 'devchat', label: '💬 Dev Chat', icon: 'chat', tooltip: 'Dev Chat - AI assistant with file and CLI access (PRIORITY)', category: 'system' },
            { id: 'tool', label: 'Tool', icon: 'tune', tooltip: 'Tool Properties - Adjust settings for the active tool', category: 'primary' },
            { id: 'inspector', label: 'Object', icon: 'deployed_code', tooltip: 'Object Inspector - View and edit selected object properties', category: 'primary' },
            { id: 'layers', label: 'Layers', icon: 'layers', tooltip: 'Layers - Manage document layers and hierarchy', category: 'primary' },
            { id: 'scripts', label: 'Scripts', icon: 'code', tooltip: 'Scripts - Edit animation scripts and hashtag commands', category: 'primary' },
            { id: 'files', label: 'Files', icon: 'folder', tooltip: 'File Browser - Browse and edit files visually', category: 'system' },
            { id: 'terminal', label: 'Terminal', icon: 'terminal', tooltip: 'Terminal - Execute commands safely', category: 'system' },
            { id: 'console', label: 'Console', icon: 'code', tooltip: 'Terminal Console - Execute commands and view logs', category: 'system' },
            { id: 'engine', label: 'Engine', icon: 'settings_input_component', tooltip: 'MCP Engine - Configure AI and MCP settings', category: 'system' },
            { id: 'chat', label: 'AI Chat', icon: 'smart_toy', tooltip: 'AI Chat - Get help and generate scripts with AI', category: 'system' },
            { id: 'registry', label: 'Registry', icon: 'apps', tooltip: 'Registry - Browse components, services, and tools', category: 'system' },
            { id: 'checkpoints', label: 'History', icon: 'history', tooltip: 'History - View and restore document snapshots', category: 'system' },
            { id: 'help', label: 'Help', icon: 'help', tooltip: 'Help - Contextual help and documentation', category: 'help' },
          ]}
          activeTab={activeRightTab}
          onTabChange={(tabId) => setActiveRightTab(tabId as any)}
          grouped={true}
          className="bg-[var(--xibalba-grey-050)]"
        />
      </div>

              <div 
                className="xibalba-right-sidebar-content xibalba-tab-content xibalba-scrollable bg-[var(--xibalba-grey-050)] text-[var(--xibalba-text-000)]"
              >
        {activeRightTab === 'tool' ? (
          <ToolPropertiesPanel
            activeTool={activeTool}
            toolProperties={toolProperties}
            onPropertiesChange={onToolPropertiesChange}
          />
        ) : activeRightTab === 'inspector' ? (
          <div className="xibalba-panel-content-inner">
            {selectedLayer ? (
              <>
                <div className="xibalba-panel-section xibalba-ia-group">
                  <div className="xibalba-ia-group-header">Object Properties</div>
                  <div className="xibalba-form-group">
                    <div className="xibalba-form-row">
                      <label className="xibalba-form-label" htmlFor="layer-name-input">Node Address</label>
                      <input 
                        id="layer-name-input"
                        className="xibalba-form-input xibalba-input-professional"
                        value={selectedLayer.name}
                        onChange={(e) => onRenameLayer(selectedLayer.id, e.target.value)}
                        aria-label="Layer name"
                      />
                    </div>
                    <div className="xibalba-form-row xibalba-form-row-actions">
                      <IconButton
                        icon="content_copy"
                        onClick={() => onDuplicateLayer(selectedLayer.id)}
                        tooltip="Duplicate"
                        size="md"
                      />
                      <IconButton
                        icon="delete"
                        onClick={() => onDeleteLayer(selectedLayer.id)}
                        tooltip="Delete"
                        variant="danger"
                        size="md"
                      />
                    </div>
                  </div>
                  
                  <div className="xibalba-form-group">
                    <Tooltip content="Fill Color - Set the fill color for the selected object" position="left">
                      <div className="xibalba-form-group">
                        <label className="xibalba-form-label">Fill Color</label>
                        <div className="xibalba-form-input-group">
                          <div 
                            ref={(node) => {
                              if (node && selectedLayer) {
                                node.style.setProperty('--layer-color', selectedLayer.color);
                              }
                            }}
                            className="xibalba-color-picker-professional layer-color-swatch"
                          >
                            <input 
                              type="color" 
                              value={selectedLayer.color || 'var(--xibalba-text-000)'}
                              onChange={(e) => onUpdateProperty(selectedLayer.id, 'color', e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              aria-label="Fill color picker"
                            />
                          </div>
                          <input
                            type="text"
                            value={selectedLayer.color || 'var(--xibalba-text-000)'}
                            onChange={(e) => onUpdateProperty(selectedLayer.id, 'color', e.target.value)}
                            className="xibalba-input-professional flex-1"
                            placeholder="var(--xibalba-text-000)"
                          />
                        </div>
                      </div>
                    </Tooltip>

                    <Tooltip content="Stroke Color - Set the stroke (outline) color for the selected object" position="left">
                      <div className="xibalba-form-group">
                        <label className="xibalba-form-label">Stroke Color</label>
                        <div className="xibalba-form-input-group">
                          <div 
                            ref={(node) => {
                              if (node && selectedLayer) {
                                node.style.setProperty('--layer-color', selectedLayer.stroke || '#000000');
                              }
                            }}
                            className="xibalba-color-picker-professional layer-color-swatch"
                          >
                            <input 
                              type="color" 
                              value={selectedLayer.stroke || '#000000'}
                              onChange={(e) => onUpdateProperty(selectedLayer.id, 'stroke', e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              aria-label="Stroke color picker"
                            />
                          </div>
                          <input
                            type="text"
                            value={selectedLayer.stroke || '#000000'}
                            onChange={(e) => onUpdateProperty(selectedLayer.id, 'stroke', e.target.value)}
                            className="xibalba-input-professional flex-1"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    </Tooltip>

                    <div className="xibalba-form-input-group">
                      <Tooltip content="Stroke Width - Set the thickness of the stroke (outline) in pixels" position="left">
                        <div className="xibalba-form-group">
                          <label className="xibalba-form-label">Stroke Width</label>
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={selectedLayer.strokeWidth || 0}
                            onChange={(e) => onUpdateProperty(selectedLayer.id, 'strokeWidth', parseFloat(e.target.value) || 0)}
                            className="xibalba-form-input xibalba-input-professional"
                            placeholder="0"
                          />
                        </div>
                      </Tooltip>
                      <Tooltip content="Opacity - Set the transparency of the object (0 = transparent, 1 = opaque)" position="left">
                        <div className="xibalba-form-group">
                          <label className="xibalba-form-label">Opacity</label>
                          <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            value={selectedLayer.opacity || 1}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val) && val >= 0 && val <= 1) {
                                onUpdateProperty(selectedLayer.id, 'opacity', val);
                              }
                            }}
                            className="xibalba-form-input xibalba-input-professional"
                            placeholder="1"
                          />
                        </div>
                      </Tooltip>
                    </div>

                    {renderParametricControls()}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2 text-[var(--xibalba-text-100)]">deployed_code</span>
                <p className="xibalba-text-caption text-[var(--xibalba-text-100)]">No object selected</p>
              </div>
            )}
          </div>
        ) : activeRightTab === 'layers' ? (
          <ProfessionalLayersPanel
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={onSelectLayer}
            onUpdateLayer={(id, updates) => {
              onUpdateProperty(id, 'name', updates.name);
            }}
            onDeleteLayer={onDeleteLayer}
            onDuplicateLayer={onDuplicateLayer}
            onReorderLayer={(id, direction) => {
              const index = layers.findIndex(l => l.id === id);
              if (index === -1) return;
              const newIndex = direction === 'up' ? index - 1 : index + 1;
              if (newIndex >= 0 && newIndex < layers.length) {
                onReorderLayer(index, newIndex);
              }
            }}
            onCreateLayer={onCreateLayer}
            onCreateSublayer={onCreateSublayer}
            onGroupLayers={onGroupLayers}
            onUngroupLayer={onUngroupLayer}
            onCreateClippingMask={onCreateClippingMask}
            onReleaseClippingMask={onReleaseClippingMask}
            onBringToFront={onBringToFront}
            onSendToBack={onSendToBack}
            onBringForward={onBringForward}
            onSendBackward={onSendBackward}
            onExpandAppearance={onExpandAppearance}
            onCreateOutlines={onCreateOutlines}
          />
        ) : activeRightTab === 'scripts' ? (
          <ErrorBoundary>
            <ScriptEditor
              frame={frameState.currentFrame}
              layerId={selectedLayerId}
              layers={layers}
              script={
                keyframes.find(
                  kf => kf.frame === frameState.currentFrame && 
                  (selectedLayerId ? kf.layerId === selectedLayerId : true)
                )?.script || ''
              }
              onScriptChange={(script) => {
                onScriptChange(frameState.currentFrame, selectedLayerId, script);
              }}
              onExecute={onScriptExecute}
            />
          </ErrorBoundary>
        ) : activeRightTab === 'files' ? (
          <ErrorBoundary>
            <FileBrowser
              onFileSelect={(path) => {
                // File selected - implement file opening logic
              }}
            />
          </ErrorBoundary>
        ) : activeRightTab === 'terminal' ? (
          <ErrorBoundary>
            <Terminal />
          </ErrorBoundary>
        ) : activeRightTab === 'devchat' ? (
          <ErrorBoundary>
            <DevChatbot
              onFileSelect={(path) => {
                setActiveRightTab('files');
              }}
              onShowHistory={onShowConversationHistory}
            />
          </ErrorBoundary>
        ) : activeRightTab === 'chat' && state && setState && onScriptGenerated ? (
          <ErrorBoundary>
            <AIChatbot
              frame={frameState.currentFrame}
              layerId={selectedLayerId}
              layers={layers}
              currentScript={
                keyframes.find(
                  kf => kf.frame === frameState.currentFrame && 
                  (selectedLayerId ? kf.layerId === selectedLayerId : true)
                )?.script || ''
              }
              onScriptGenerated={onScriptGenerated}
              onExecuteScript={onScriptExecute}
            />
          </ErrorBoundary>
        ) : activeRightTab === 'registry' ? (
          <ErrorBoundary>
            <RegistryBrowser
              onSelectEntry={(entry) => {
                // Registry entry selected - implement registry logic
              }}
            />
          </ErrorBoundary>
        ) : activeRightTab === 'tasks' ? (
          <div className="space-y-4">
            <div className="xibalba-section-header-professional">
              <span>Task Management</span>
            </div>
            <p className="xibalba-text-caption">
              Switch to Tasks view to see SprintBoard and manage tasks.
            </p>
          </div>
        ) : activeRightTab === 'console' ? (
          <div className="flex flex-col h-full animate-in slide-in-from-left-4">
            {/* Terminal Settings Toggle */}
            <div className="shrink-0 p-4 flex items-center justify-between">
              <span className="xibalba-text-subheading">Terminal Console</span>
              <Tooltip content="Terminal Settings - Configure terminal behavior and appearance" position="left">
                <button
                  onClick={() => setShowTerminalSettings(!showTerminalSettings)}
                  className="xibalba-button-professional text-sm"
                >
                  <span className="material-symbols-outlined text-[16px] mr-1">settings</span>
                  Settings
                </button>
              </Tooltip>
            </div>

            {/* Terminal Settings Panel */}
            {showTerminalSettings && (
              <div className="shrink-0 max-h-[60vh] overflow-y-auto xibalba-scrollbar">
                <TerminalSettings />
              </div>
            )}

            {/* Terminal Console */}
            <div className="flex-1 flex flex-col p-6 mono text-sm min-h-0">
              <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar mb-4">
                 {state?.terminalLogs?.map(log => (
                   <div key={log.id} className="flex gap-3">
                      <span className="text-[var(--xibalba-text-100)] select-none">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                      <span className={log.type === 'error' ? 'text-[var(--vectorforge-accent)]' : log.type === 'success' ? 'text-[var(--xibalba-text-100)]' : 'text-[var(--xibalba-text-000)]'}>{log.text}</span>
                   </div>
                 )) || <div className="text-[var(--xibalba-text-100)]">No terminal logs yet</div>}
              </div>
              <input 
                type="text" 
                value={terminalInput} 
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => { 
                  if(e.key === 'Enter') { 
                    onTerminalCommand?.(terminalInput);
                    setTerminalInput(''); 
                  }
                }}
                className="xibalba-input-professional w-full"
                placeholder="root@xibalba:~$ "
              />
            </div>
          </div>
        ) : activeRightTab === 'engine' ? (
          <ErrorBoundary>
            <MCPSettings />
          </ErrorBoundary>
        ) : activeRightTab === 'help' ? (
          <ErrorBoundary>
            <ContextualHelpPanel
              context={{
                activeTool,
                selectedObjectId: selectedLayerId || undefined,
                activeWorkflow: 'vectorforge',
                hasError: false,
              }}
              maxPriority="P1"
              onHelpClick={(elementId) => {
                // Help clicked - implement help navigation
              }}
            />
          </ErrorBoundary>
        ) : (
          <div className="space-y-4">
            <div className="xibalba-section-header-professional">
              <span>History</span>
            </div>
            <div className="space-y-2">
              {snapshots.map(snapshot => (
                <button
                  key={snapshot.id}
                  onClick={() => onRestoreSnapshot(snapshot.svg)}
                  className="xibalba-interactive w-full text-left px-4 py-2 text-sm hover:bg-[var(--xibalba-grey-150)]"
                >
                  <div className="font-semibold">{snapshot.name}</div>
                  <div className="xibalba-text-caption">
                    {new Date(snapshot.timestamp).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
