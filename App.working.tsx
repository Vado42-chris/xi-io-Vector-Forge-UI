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
    engineConfig: { provider: 'gemini-pro' as any, apiKey: '', thinkingBudget: 32768 },
    toolProperties: {},
    measurementUnit: 'px',
    workspaceLayout: 'default',
    dockedPanels: [],
  }));

  return (
    <div className="w-screen h-screen bg-[var(--xibalba-grey-000)] text-[var(--xibalba-text-000)] flex flex-col font-sans">
      <div className="p-4 border-b border-white/10 bg-[var(--xibalba-grey-050)]">
        <ProfessionalFileMenu onAction={() => {}} />
      </div>
      <div className="flex-1 flex bg-[var(--xibalba-grey-000)]">
        <LeftSidebar state={state} setState={() => {}} onGenerate={async () => {}} />
        <div className="flex-1">
          <DraftsmanCanvas
            svgContent={state.currentSvg}
            layers={state.layers}
            activeTool={state.activeTool}
            selectedLayerId={state.selectedLayerId}
            zoom={state.zoom}
            pan={state.pan}
            onPan={() => {}}
            onZoom={() => {}}
            onSelectLayer={() => {}}
            onCreateLayer={() => {}}
            onUpdateLayer={() => {}}
            frameState={{ currentFrame: 0, fps: 24, isPlaying: false, totalFrames: 100, isLooping: false }}
            keyframes={[]}
            onAddKeyframe={() => {}}
            onUpdateKeyframe={() => {}}
            showGuides={false}
            snapToGrid={false}
            snapToGuides={false}
            gridSize={10}
            measurementUnit="px"
            onUnitChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
