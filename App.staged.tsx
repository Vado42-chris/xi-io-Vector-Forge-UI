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
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1>VectorForge - Staged Loading</h1>
        <p>State initialized: {state.layers.length} layers</p>
        <p>Now adding components...</p>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <p>Canvas area will go here</p>
      </div>
    </div>
  );
};

export default App;

