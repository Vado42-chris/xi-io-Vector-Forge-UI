/**
 * App.simple.tsx
 * Minimal working version of VectorForge
 * Purpose: Ship a working product while complex features are in vault
 */

import React, { useState } from 'react';
import Header from './components/Header';
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
      <div className="relative w-screen h-screen text-[var(--xibalba-text-000)] font-sans overflow-hidden bg-[var(--xibalba-grey-000)]">
        {/* Header - Simple and working - MUST be fixed at top */}
        <Header
          onAction={handleAction}
          credits={25000}
        />

        {/* Main Layout - MUST start below fixed header */}
        <div className="flex absolute top-[48px] left-0 right-0 bottom-0">
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
          <div className="flex-1 relative overflow-hidden bg-[var(--xibalba-grey-000)]">
            <ErrorBoundary>
              <DraftsmanCanvas
                layers={state.layers}
                selectedLayerId={state.selectedLayerId}
                activeTool={state.activeTool}
                toolProperties={state.toolProperties}
                pan={state.pan}
                zoom={state.zoom}
                onSelectLayer={handleSelectLayer}
                onCreateLayer={handleCreateLayer}
                onUpdateLayer={minimalHandlers.onUpdateLayer}
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

