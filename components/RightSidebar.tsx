/**
 * Right Sidebar with Drag Handle
 * Tool properties, Object inspector, Layers, History
 */

import React, { useState, useRef, useEffect } from 'react';
import { VectorLayer, ToolType, ToolProperties, AnimationKeyframe, FrameState, AppState } from '../types';
import ToolPropertiesPanel from './ToolPropertiesPanel';
import ProfessionalLayersPanel from './ProfessionalLayersPanel';
import ScriptEditor from './ScriptEditor';
import AIChatbot from './AIChatbot';
import RegistryBrowser from './RegistryBrowser';
import ErrorBoundary from './ErrorBoundary';

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
  state, setState, onScriptGenerated
}) => {
  const selectedLayer = layers.find(l => l.id === selectedLayerId);
  const [activeRightTab, setActiveRightTab] = useState<'tool' | 'inspector' | 'layers' | 'scripts' | 'chat' | 'registry' | 'checkpoints'>('tool');
  
  // Auto-switch to Scripts tab when script icon is clicked from timeline
  useEffect(() => {
    // This will be triggered externally when needed
  }, []);

  // Expose method to switch to scripts tab (can be called from parent)
  useEffect(() => {
    // Store reference for external access if needed
    (window as any).__switchToScriptsTab = () => setActiveRightTab('scripts');
  }, []);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [width, setWidth] = useState(360);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

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
        const newWidth = window.innerWidth - e.clientX;
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

  const renderParametricControls = () => {
    if (!selectedLayer || selectedLayer.shape.type !== 'rect' || !onUpdateShapeProperty) return null;

    const shape = selectedLayer.shape;
    return (
      <div className="xibalba-panel-professional space-y-4">
        <h3 className="xibalba-label-professional">Rectangle Properties</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="xibalba-label-professional">Width</label>
            <input
              type="number"
              value={shape.width}
              onChange={(e) => onUpdateShapeProperty(selectedLayer.id, 'width', parseFloat(e.target.value))}
              className="xibalba-input-professional w-full"
            />
          </div>
          <div>
            <label className="xibalba-label-professional">Height</label>
            <input
              type="number"
              value={shape.height}
              onChange={(e) => onUpdateShapeProperty(selectedLayer.id, 'height', parseFloat(e.target.value))}
              className="xibalba-input-professional w-full"
            />
          </div>
          <div>
            <label className="xibalba-label-professional">Border Radius</label>
            <input
              type="number"
              value={shape.borderRadius}
              onChange={(e) => onUpdateShapeProperty(selectedLayer.id, 'borderRadius', parseFloat(e.target.value))}
              className="xibalba-input-professional w-full"
            />
          </div>
        </div>
      </div>
    );
  };

  // Update CSS variables for positioning
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.setProperty('--sidebar-width', `${width}px`);
      sidebarRef.current.style.setProperty('--sidebar-right', `${position.x}px`);
      sidebarRef.current.style.setProperty('--sidebar-top', `${position.y}px`);
    }
  }, [width, position]);

  return (
    <div 
      ref={sidebarRef}
      className="flex-1 flex flex-col min-h-0 shrink-0 relative sidebar-right-positioned xibalba-dockable-palette"
      onPointerDown={handleDragStart}
      data-palette-id="right-sidebar"
    >
      {/* Resize Handle - Visible drag handle */}
      <div
        ref={resizeHandleRef}
        onPointerDown={handleResizeStart}
        className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize bg-[var(--xibalba-grey-200)] hover:bg-[var(--xibalba-text-100)] opacity-60 hover:opacity-100 transition-opacity z-30 border-r border-white/10"
        title="Drag to resize"
      />

      <div className="xibalba-tabs-professional shrink-0">
        {[
          { id: 'tool', label: 'Tool', icon: 'tune' },
          { id: 'inspector', label: 'Object', icon: 'deployed_code' },
          { id: 'layers', label: 'Layers', icon: 'layers' },
          { id: 'scripts', label: 'Scripts', icon: 'code' },
          { id: 'chat', label: 'AI Chat', icon: 'smart_toy' },
          { id: 'registry', label: 'Registry', icon: 'apps' },
          { id: 'workspace', label: 'Workspace', icon: 'tune' },
          { id: 'checkpoints', label: 'History', icon: 'history' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveRightTab(tab.id as any)}
            className={`xibalba-tab-professional ${activeRightTab === tab.id ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px] mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto xibalba-scrollbar p-6 min-h-0">
        {activeRightTab === 'tool' ? (
          <ToolPropertiesPanel
            activeTool={activeTool}
            toolProperties={toolProperties}
            onPropertiesChange={onToolPropertiesChange}
          />
        ) : activeRightTab === 'inspector' ? (
          <div className="space-y-6 xibalba-animate-fade-in">
            {selectedLayer ? (
              <>
                <div className="xibalba-panel-professional">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <label className="xibalba-label-professional">Node Address</label>
                      <input 
                        className="xibalba-input-professional w-full text-base font-semibold"
                        value={selectedLayer.name}
                        onChange={(e) => onRenameLayer(selectedLayer.id, e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button 
                        onClick={() => onDuplicateLayer(selectedLayer.id)} 
                        className="xibalba-toolbar-button-professional"
                        title="Duplicate"
                      >
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                      </button>
                      <button 
                        onClick={() => onDeleteLayer(selectedLayer.id)} 
                        className="xibalba-toolbar-button-professional delete-button-text"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="xibalba-label-professional">Fill Color</label>
                      <div className="flex items-center gap-4">
                        <div 
                          className="xibalba-color-picker-professional layer-color-swatch"
                          style={{ '--layer-color': selectedLayer.color } as React.CSSProperties}
                        >
                          <input 
                            type="color" 
                            value={selectedLayer.color}
                            onChange={(e) => onUpdateProperty(selectedLayer.id, 'color', e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={selectedLayer.color}
                          onChange={(e) => onUpdateProperty(selectedLayer.id, 'color', e.target.value)}
                          className="xibalba-input-professional flex-1"
                        />
                      </div>
                    </div>

                    {renderParametricControls()}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2 text-[var(--xibalba-text-200)]">deployed_code</span>
                <p className="xibalba-text-caption text-[var(--xibalba-text-200)]">No object selected</p>
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
              state={state}
              setState={setState}
            />
          </ErrorBoundary>
        ) : activeRightTab === 'registry' ? (
          <ErrorBoundary>
            <RegistryBrowser
              onSelectEntry={(entry) => {
                console.log('Selected registry entry:', entry);
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
