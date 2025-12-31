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
    toolProperties: {},
    measurementUnit: 'px',
    workspaceLayout: 'default',
    dockedPanels: [],
    engineConfig: { provider: 'gemini-pro' as any, apiKey: '', thinkingBudget: 32768 },
  }));

  return (
    <div className="w-screen h-screen bg-[var(--xibalba-grey-000)] text-[var(--xibalba-text-000)] flex flex-col font-sans">
      <div className="p-5 border-b border-white/10">
        <h1>VectorForge - Staged Loading</h1>
        <p>State initialized: {state.layers.length} layers</p>
        <p>Now adding components...</p>
      </div>
      <div className="flex-1 p-5">
        <p>Canvas area will go here</p>
      </div>
    </div>
  );
};

export default App;
