import React, { useState } from 'react';
import { AppState } from './types';
import ProfessionalFileMenu from './components/ProfessionalFileMenu';
import LeftSidebar from './components/LeftSidebar';
import DraftsmanCanvas from './components/DraftsmanCanvas';

const App: React.FC = () => {
  const [state] = useState<AppState>(() => ({
    activeTab: 'text',
    activeTool: 'select',
    prompt: '',
    isGenerating: false,
    style: 'abstract' as any,
    complexity: 92,
    credits: 25000,
    layers: [],
    selectedLayerId: null,
    selectedNodeId: null,
    zoom: 100,
    pan: { x: 0, y: 0 },
    currentSvg: '<svg viewBox="0 0 512 512"></svg>',
    history: [],
    redoHistory: [],
    snapshots: [],
    chatHistory: [],
    terminalLogs: [],
    terminalHistory: [],
    mcpServers: [],
    toasts: [],
    guides: [],
    showRulers: true,
    engineConfig: { provider: 'gemini-pro' as any, apiKey: '', thinkingBudget: 32768 }
  }));

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: 'var(--xibalba-grey-000, #0a0b0e)',
      color: 'var(--xibalba-text-000, #ffffff)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'var(--xibalba-grey-050, #12141a)'
      }}>
        <ProfessionalFileMenu 
          onAction={() => {}}
        />
      </div>
      <div style={{ 
        flex: 1, 
        display: 'flex',
        backgroundColor: 'var(--xibalba-grey-000, #0a0b0e)'
      }}>
        <LeftSidebar 
          state={state}
          setState={() => {}}
          onGenerate={() => {}}
        />
        <div style={{ flex: 1 }}>
          <DraftsmanCanvas 
            svgContent={state.currentSvg}
            layers={state.layers}
            activeTool={state.activeTool}
            selectedLayerId={state.selectedLayerId}
            zoom={state.zoom}
            pan={state.pan}
            onPan={() => {}}
            onZoom={() => {}}
            onLayerSelect={() => {}}
            onSvgChange={() => {}}
            onToolChange={() => {}}
            keyframes={[]}
            frameState={{ currentFrame: 0, fps: 24, isPlaying: false }}
            onKeyframeAdd={() => {}}
            onKeyframeUpdate={() => {}}
            onKeyframeDelete={() => {}}
            measurementUnit="px"
          />
        </div>
      </div>
    </div>
  );
};

export default App;

