/**
 * App.simple.tsx
 * Minimal working version of VectorForge
 * Purpose: Ship a working product while complex features are in vault
 */

import React, { useState } from 'react';
import ProfessionalFileMenu from './components/ProfessionalFileMenu';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import DraftsmanCanvas from './components/DraftsmanCanvas';
import ErrorBoundary from './components/ErrorBoundary';
import { VectorLayer, ToolType, ToolProperties, AppState } from './types';

const App: React.FC = () => {
  // Minimal state - just enough to render
  const [state, setState] = useState<AppState>({
    layers: [],
    selectedLayerId: null,
    activeTool: 'select',
    toolProperties: {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1,
    },
    pan: { x: 0, y: 0 },
    zoom: 1,
    snapToGrid: false,
    showGrid: true,
    showRulers: true,
    fileOperationLoading: false,
    terminalLogs: [],
  });

  // Panel visibility - not used but kept for compatibility
  const panelVisibility = {
    'left-sidebar': true,
    'right-sidebar': true,
  };

  // Minimal handlers
  const handleAction = (action: string) => {
    console.log('Action:', action);
    // Basic actions only
    if (action === 'FILE_NEW') {
      setState(prev => ({ ...prev, layers: [], selectedLayerId: null }));
    } else if (action === 'FILE_SAVE') {
      console.log('Save action (not implemented in simple version)');
    }
  };

  const handleLayoutChange = (layout: string) => {
    console.log('Layout:', layout);
  };

  const handleToolChange = (tool: ToolType) => {
    setState(prev => ({ ...prev, activeTool: tool }));
  };

  const handleToolPropertiesChange = (properties: Partial<ToolProperties>) => {
    setState(prev => ({
      ...prev,
      toolProperties: { ...prev.toolProperties, ...properties },
    }));
  };

  const handleSelectLayer = (id: string) => {
    setState(prev => ({ ...prev, selectedLayerId: id }));
  };

  const handleCreateLayer = () => {
    const newLayer: VectorLayer = {
      id: `layer-${Date.now()}`,
      name: 'New Layer',
      type: 'rectangle',
      visible: true,
      locked: false,
      opacity: 1,
      transform: { x: 100, y: 100, rotation: 0, scaleX: 1, scaleY: 1 },
      data: { width: 100, height: 100 },
    };
    setState(prev => ({
      ...prev,
      layers: [...prev.layers, newLayer],
      selectedLayerId: newLayer.id,
    }));
  };

  // Minimal handlers for required props
  const minimalHandlers = {
    onToggleVisibility: (id: string) => {
      setState(prev => ({
        ...prev,
        layers: prev.layers.map(l =>
          l.id === id ? { ...l, visible: !l.visible } : l
        ),
      }));
    },
    onToggleLock: (id: string) => {
      setState(prev => ({
        ...prev,
        layers: prev.layers.map(l =>
          l.id === id ? { ...l, locked: !l.locked } : l
        ),
      }));
    },
    onUpdateProperty: (id: string, property: string, value: any) => {
      setState(prev => ({
        ...prev,
        layers: prev.layers.map(l =>
          l.id === id ? { ...l, [property]: value } : l
        ),
      }));
    },
    onDeleteLayer: (id: string) => {
      setState(prev => ({
        ...prev,
        layers: prev.layers.filter(l => l.id !== id),
        selectedLayerId: prev.selectedLayerId === id ? null : prev.selectedLayerId,
      }));
    },
    onDuplicateLayer: (id: string) => {
      const layer = state.layers.find(l => l.id === id);
      if (layer) {
        const newLayer = { ...layer, id: `layer-${Date.now()}`, name: `${layer.name} Copy` };
        setState(prev => ({ ...prev, layers: [...prev.layers, newLayer] }));
      }
    },
    onReorderLayer: () => {},
    onRenameLayer: (id: string, newName: string) => {
      setState(prev => ({
        ...prev,
        layers: prev.layers.map(l => (l.id === id ? { ...l, name: newName } : l)),
      }));
    },
    onUpdateLayer: (id: string, updates: Partial<VectorLayer>) => {
      setState(prev => ({
        ...prev,
        layers: prev.layers.map(l => (l.id === id ? { ...l, ...updates } : l)),
      }));
    },
    onCreateSublayer: () => {},
    onGroupLayers: () => {},
    onUngroupLayer: () => {},
    onCreateClippingMask: () => {},
    onReleaseClippingMask: () => {},
    onBringToFront: () => {},
    onSendToBack: () => {},
    onBringForward: () => {},
    onSendBackward: () => {},
    onExpandAppearance: () => {},
    onCreateOutlines: () => {},
  };

  return (
    <ErrorBoundary>
      <div 
        className="app-layout-grid"
        data-sidebar-left-visible={panelVisibility['left-sidebar'] ? 'true' : 'false'}
        data-sidebar-right-visible={panelVisibility['right-sidebar'] ? 'true' : 'false'}
        style={{
          '--sidebar-left-width': panelVisibility['left-sidebar'] ? '320px' : '0px',
          '--sidebar-right-width': panelVisibility['right-sidebar'] ? '360px' : '0px',
        } as React.CSSProperties}
      >
        {/* Professional File Menu - Full menu bar with tabs */}
        <div className="app-header-container">
          <ProfessionalFileMenu 
            onAction={handleAction} 
            onLayoutChange={handleLayoutChange}
            fileOperationLoading={null}
          />
        </div>

        {/* Main Layout - MUST start below fixed header */}
        <div className="app-main-content">
          {/* Left Sidebar */}
          {panelVisibility['left-sidebar'] && (
            <ErrorBoundary>
              <LeftSidebar
                state={state}
                setState={setState}
                activeTool={state.activeTool}
                onToolChange={handleToolChange}
              />
            </ErrorBoundary>
          )}

          {/* Canvas Area */}
          <div className="app-canvas-area">
            <ErrorBoundary>
              <DraftsmanCanvas
                svgContent=""
                layers={state.layers}
                selectedLayerId={state.selectedLayerId}
                activeTool={state.activeTool}
                toolProperties={state.toolProperties}
                pan={state.pan}
                zoom={state.zoom}
                onPan={(newPan) => setState(prev => ({ ...prev, pan: newPan }))}
                onZoom={(newZoom) => setState(prev => ({ ...prev, zoom: newZoom }))}
                onSelectLayer={handleSelectLayer}
                onCreateLayer={handleCreateLayer}
                onUpdateLayer={minimalHandlers.onUpdateLayer}
                frameState={{ currentFrame: 0, totalFrames: 30 }}
                keyframes={[]}
                onAddKeyframe={() => {}}
                onUpdateKeyframe={() => {}}
                showGuides={false}
                snapToGrid={state.snapToGrid}
                snapToGuides={false}
                gridSize={20}
                measurementUnit="px"
                onUnitChange={() => {}}
              />
            </ErrorBoundary>
          </div>

          {/* Right Sidebar */}
          {panelVisibility['right-sidebar'] && (
            <ErrorBoundary>
              <RightSidebar
                layers={state.layers}
                selectedLayerId={state.selectedLayerId}
                activeTool={state.activeTool}
                toolProperties={state.toolProperties}
                onToolPropertiesChange={handleToolPropertiesChange}
                onSelectLayer={handleSelectLayer}
                {...minimalHandlers}
                snapshots={[]}
                onRestoreSnapshot={() => {}}
                keyframes={[]}
                frameState={{ currentFrame: 0, totalFrames: 30 }}
                onScriptChange={() => {}}
                state={state}
                setState={setState}
              />
            </ErrorBoundary>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;

