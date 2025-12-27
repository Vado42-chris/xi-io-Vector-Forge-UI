import React, { useState } from 'react';
import { AppState } from './types';

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
        <h1 style={{ margin: 0, fontSize: '24px' }}>VectorForge</h1>
        <p style={{ margin: '8px 0 0 0', color: 'var(--xibalba-text-200, #999999)' }}>
          React is working! State initialized with {state.layers.length} layers.
        </p>
      </div>
      <div style={{ 
        flex: 1, 
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--xibalba-grey-000, #0a0b0e)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>UI is Loading</h2>
          <p>Components will be added back gradually</p>
          <p style={{ fontSize: '12px', color: 'var(--xibalba-text-300, #666666)' }}>
            Active Tool: {state.activeTool} | Zoom: {state.zoom}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;

