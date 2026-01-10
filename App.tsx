
import React, { useState, useCallback, useRef } from 'react';
import { AppState, AIProvider, ViewportMode, WorkspaceRole, WorkflowPhase, ViewType, UnitSystem, Persona, CognitiveMessage, SovereignViewConfig } from './types';
import SystemTitleBar from './components/SystemTitleBar';
import IdentityBar from './components/IdentityBar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Canvas from './components/Canvas';
import Footer from './components/Footer';
import AIPanel from './components/AIPanel';
import SovereignView from './components/SovereignView';
import SovereignEntry from './components/SovereignEntry';
import HangarDashboard from './components/HangarDashboard';
import NewProjectModal from './components/modals/NewProjectModal';
import LoadingOverlay from './components/LoadingOverlay';
import SovereignEditor from './components/SovereignEditor';
import ProjectNexus from './components/ProjectNexus';
import MarketplaceNexus from './components/MarketplaceNexus';
import WalletNexus from './components/WalletNexus';
import TimelineSequencer from './components/TimelineSequencer';
import ColosseumTester from './components/ColosseumTester';
import MCPRegistry from './components/MCPRegistry';
import DotfileManagerModal from './components/modals/DotfileManagerModal';
import OmniBot from './components/OmniBot';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingShards, setIsResizingShards] = useState(false);
  
  const [state, setState] = useState<AppState>(() => ({
    activeRole: WorkspaceRole.MODELING,
    activePhase: WorkflowPhase.IDEATION, 
    activeTool: 'select',
    prompt: '',
    isGenerating: false,
    style: 'Flat' as any,
    credits: 142850,
    layers: [
      { id: 'l1', name: 'CORE_CHASSIS', visible: true, locked: false, color: '#b8860b', stroke: '#000', strokeWidth: 1, opacity: 1, nodes: [{id: 'n1', x: 256, y: 256, type: 'move'}] }
    ],
    selectedLayerId: 'l1',
    selectedDirectiveId: null,
    selectedAgentId: null,
    selectedNodeId: null,
    zoom: 100,
    pan: { x: 0, y: 0 },
    presets: [],
    activePresetId: 'MODELING',
    views: [{ id: 'v1', type: 'CANVAS_2D', mode: ViewportMode.SVG_2D, isVisible: true, isFocused: true, isDetached: false, activeTool: 'select' }],
    isProjectOpen: false, 
    projectName: 'VOID_KERNEL',
    manifestId: 'm1',
    persona: { 
      username: 'ARCHON_OPERATOR', 
      title: 'Sovereign Architect',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Archon', 
      nodeStatus: 'online', 
      dotfileId: 'DF_90210',
      trustScore: 0.9842,
      shardYield: 42800,
      cognitiveDepth: 82,
      traces: [],
      permissions: { coreMutation: true, marketInjection: true, deepReasoning: false }
    },
    shards: [],
    currentFrame: 0,
    totalFrames: 250,
    engineConfig: { provider: AIProvider.GEMINI_PRO, apiKey: '' },
    showGrid: true,
    showRulers: true,
    snapToGrid: true,
    snapToGuides: true,
    unitSystem: UnitSystem.PIXELS,
    guides: [],
    complexity: 50,
    viewportMode: ViewportMode.SVG_2D,
    directives: [],
    agents: [],
    cycles: [],
    recentManifests: [],
    activeChatHistory: [],
    isChatOpen: false,
  }));

  // Resizing Logic for Right Sidebar
  const handleSidebarResizeStart = useCallback((e: React.MouseEvent) => {
    setIsResizingSidebar(true);
    e.preventDefault();
  }, []);

  const handleShardResizeStart = useCallback((e: React.MouseEvent) => {
    setIsResizingShards(true);
    e.preventDefault();
  }, []);

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (isResizingSidebar) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 200 && newWidth < 800) {
        document.documentElement.style.setProperty('--right-sidebar-width', `${newWidth}px`);
      }
    }
    if (isResizingShards) {
      const container = document.getElementById('viewport-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        const ratio = ((e.clientX - rect.left) / rect.width) * 100;
        if (ratio > 10 && ratio < 90) {
          document.documentElement.style.setProperty('--shard-split-ratio', `${ratio}%`);
        }
      }
    }
  }, [isResizingSidebar, isResizingShards]);

  const handleGlobalMouseUp = useCallback(() => {
    setIsResizingSidebar(false);
    setIsResizingShards(false);
  }, []);

  React.useEffect(() => {
    if (isResizingSidebar || isResizingShards) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    } else {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isResizingSidebar, isResizingShards, handleGlobalMouseMove, handleGlobalMouseUp]);

  const handleAction = (action: string) => {
    if (action.startsWith('MODAL_')) { setActiveModal(action.replace('MODAL_', '')); return; }
    if (action === 'TOGGLE_EXPERT') { setIsExpertMode(!isExpertMode); return; }
    if (action === 'TOGGLE_OMNIBOT') { setState(p => ({ ...p, isChatOpen: !p.isChatOpen })); return; }
    if (action === 'FILE_CLOSE' || action === 'FILE_HOME') { setState(p => ({ ...p, isProjectOpen: false })); return; }
    if (action.startsWith('PANEL_')) {
      const type = action.replace('PANEL_', '') as ViewType;
      setState(p => ({ 
        ...p, 
        isProjectOpen: true, 
        views: [{ id: `v-${Date.now()}`, type, mode: ViewportMode.SVG_2D, isVisible: true, isFocused: true, isDetached: false, activeTool: 'select' }] 
      }));
      return;
    }
  };

  const handleSplitView = (viewId: string) => {
    const viewToSplit = state.views.find(v => v.id === viewId);
    if (!viewToSplit || state.views.length >= 4) return;
    
    const newView: SovereignViewConfig = {
      ...viewToSplit,
      id: `v-${Date.now()}`,
      isFocused: true
    };
    
    setState(p => ({
      ...p,
      views: p.views.map(v => ({ ...v, isFocused: false })).concat(newView)
    }));
  };

  const handleCloseView = (viewId: string) => {
    if (state.views.length <= 1) {
      handleAction('FILE_HOME');
      return;
    }
    setState(p => {
      const newViews = p.views.filter(v => v.id !== viewId);
      if (newViews.length > 0) newViews[newViews.length - 1].isFocused = true;
      return { ...p, views: newViews };
    });
  };

  const handleTypeChange = (viewId: string, newType: ViewType) => {
    setState(p => ({
      ...p,
      views: p.views.map(v => v.id === viewId ? { ...v, type: newType } : v)
    }));
  };

  const renderViewContent = (view: SovereignViewConfig) => {
    switch (view.type) {
      case 'OMNI_THREAD': return <OmniBot state={state} onClose={() => handleCloseView(view.id)} onExecuteTool={() => {}} isEmbedded={true} />;
      case 'CODE_KERNEL': return <SovereignEditor />;
      case 'PROJECT_NEXUS': return <ProjectNexus state={state} verboseMode={!isExpertMode} onCreateDirective={() => {}} onSelectDirective={() => {}} onSelectAgent={() => {}} />;
      case 'MARKETPLACE_NEXUS': return <MarketplaceNexus onClose={() => handleCloseView(view.id)} onSplit={() => handleSplitView(view.id)} />;
      case 'COLOSSEUM_TESTER': return <ColosseumTester />;
      case 'MCP_REGISTRY': return <MCPRegistry />;
      case 'WALLET_NEXUS': return <WalletNexus />;
      case 'CANVAS_2D': return (
        <Canvas 
          state={state} 
          onUpdateState={(patch) => setState(p => ({ ...p, ...patch }))}
          onSelectLayer={(id) => setState(p => ({ ...p, selectedLayerId: id }))} 
        />
      );
      case 'AI_SYNTHESIS': return <AIPanel state={state} setState={setState} onGenerate={() => {}} isExpertMode={isExpertMode} />;
      default: return null;
    }
  };

  if (!isInitialized) return <SovereignEntry onInitialize={(u) => { setState(p => ({ ...p, persona: { ...p.persona, username: u } })); setIsInitialized(true); }} />;

  return (
    <div className="xi-chassis-grid bg-obsidian-950 text-obsidian-100 select-none overflow-hidden font-sans">
      <LoadingOverlay isVisible={isLoading} type="SYNTHESIS" />
      
      {activeModal === 'NEW_PROJECT' && <NewProjectModal onClose={() => setActiveModal(null)} onCreate={(t) => { 
        setState(p => ({ ...p, isProjectOpen: true, projectName: t.toUpperCase(), activeRole: WorkspaceRole.MODELING, views: [{ id: 'v1', type: 'CANVAS_2D', mode: ViewportMode.SVG_2D, isVisible: true, isFocused: true, isDetached: false, activeTool: 'select' }] })); 
        setActiveModal(null); 
      }} />}

      {activeModal === 'DOTFILE_MANAGER' && (
        <DotfileManagerModal 
          persona={state.persona} 
          onClose={() => setActiveModal(null)} 
          onUpdatePersona={(patch) => setState(p => ({ ...p, persona: { ...p.persona, ...patch } }))}
          onRehydrateTrace={() => {}}
        />
      )}

      {/* GLOBAL OMNIBOT OVERLAY */}
      {state.isChatOpen && (
        <OmniBot 
          state={state} 
          onClose={() => handleAction('TOGGLE_OMNIBOT')} 
          onExecuteTool={() => {}} 
          style={{ position: 'fixed', inset: '80px 40px 60px 40px', zIndex: 600, width: 'auto', height: 'auto' }}
        />
      )}

      <div className="col-span-3 flex flex-col z-[500]">
        <SystemTitleBar verboseMode={isExpertMode} setVerboseMode={() => handleAction('TOGGLE_EXPERT')} />
        <IdentityBar 
          projectName={state.projectName} 
          isProjectOpen={state.isProjectOpen} 
          persona={state.persona} 
          currentView={state.views[0]?.type || 'CANVAS_2D'}
          onAction={handleAction} 
          credits={state.credits} 
          isOmniBotOpen={state.isChatOpen}
        />
      </div>

      <div className="row-span-1 bg-obsidian-950 border-r border-white/5 transition-all duration-500 overflow-hidden">
        {state.isProjectOpen && (
          <LeftSidebar activeRole={state.activeRole} setRole={(r) => setState(p => ({ ...p, activeRole: r }))} collapsed={true} activeTool={state.activeTool} onToolSelect={(t) => setState(p => ({ ...p, activeTool: t }))} />
        )}
      </div>

      <div className="row-span-1 bg-obsidian-900 overflow-hidden relative flex flex-col">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] canvas-grid z-0"></div>
        {state.isProjectOpen ? (
          <div className="flex-1 flex flex-col p-1 gap-1 min-h-0 overflow-hidden relative z-10" id="viewport-container">
            {state.views.length === 2 ? (
              <div className="flex-1 flex overflow-hidden gap-1 h-full">
                <div style={{ width: 'var(--shard-split-ratio)' }} className="flex">
                  <SovereignView 
                    key={state.views[0].id} id={state.views[0].id} type={state.views[0].type} mode={state.views[0].mode} title={state.views[0].type.replace('_', ' ')} isFocused={state.views[0].isFocused} activeTool={state.activeTool} onToolSelect={() => {}} onModeSelect={() => {}} 
                    onFocus={() => setState(p => ({ ...p, views: p.views.map((v, i) => ({ ...v, isFocused: i === 0 })) }))} 
                    onClose={() => handleCloseView(state.views[0].id)} 
                    onSplit={() => handleSplitView(state.views[0].id)} 
                    onTypeChange={(t) => handleTypeChange(state.views[0].id, t)} 
                  >
                    {renderViewContent(state.views[0])}
                  </SovereignView>
                </div>
                <div 
                  className={`resize-handle-v ${isResizingShards ? 'resizing-v' : ''}`}
                  onMouseDown={handleShardResizeStart}
                />
                <div className="flex-1 flex">
                  <SovereignView 
                    key={state.views[1].id} id={state.views[1].id} type={state.views[1].type} mode={state.views[1].mode} title={state.views[1].type.replace('_', ' ')} isFocused={state.views[1].isFocused} activeTool={state.activeTool} onToolSelect={() => {}} onModeSelect={() => {}} 
                    onFocus={() => setState(p => ({ ...p, views: p.views.map((v, i) => ({ ...v, isFocused: i === 1 })) }))} 
                    onClose={() => handleCloseView(state.views[1].id)} 
                    onSplit={() => handleSplitView(state.views[1].id)} 
                    onTypeChange={(t) => handleTypeChange(state.views[1].id, t)} 
                  >
                    {renderViewContent(state.views[1])}
                  </SovereignView>
                </div>
              </div>
            ) : (
              <div className={`flex-1 grid gap-1 overflow-hidden h-full ${state.views.length > 2 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-1'}`}>
                {state.views.map(view => (
                  <SovereignView 
                    key={view.id} id={view.id} type={view.type} mode={view.mode} title={view.type.replace('_', ' ')} isFocused={view.isFocused} activeTool={state.activeTool} onToolSelect={() => {}} onModeSelect={() => {}} 
                    onFocus={() => setState(p => ({ ...p, views: p.views.map(v => ({ ...v, isFocused: v.id === view.id })) }))} 
                    onClose={() => handleCloseView(view.id)} 
                    onSplit={() => handleSplitView(view.id)} 
                    onTypeChange={(t) => handleTypeChange(view.id, t)} 
                  >
                    {renderViewContent(view)}
                  </SovereignView>
                ))}
              </div>
            )}
            {isTimelineExpanded && (
              <div className="h-72 border-t border-white/10 bg-obsidian-950/90 animate-in slide-in-from-bottom-4 duration-300 z-[100] overflow-hidden">
                <TimelineSequencer currentFrame={state.currentFrame} totalFrames={state.totalFrames} shards={state.shards} onSeek={(f) => setState(p => ({ ...p, currentFrame: f }))} />
              </div>
            )}
          </div>
        ) : (
          <HangarDashboard onNewProject={() => handleAction('MODAL_NEW_PROJECT')} onOpenRecent={() => {}} onCloudSync={() => {}} recentManifests={[]} verboseMode={!isExpertMode} />
        )}
      </div>

      <div className="row-span-1 flex relative">
        <div 
          className={`resize-handle-v absolute left-0 h-full ${isResizingSidebar ? 'resizing-v' : ''}`}
          onMouseDown={handleSidebarResizeStart}
        />
        <div className="flex-1 bg-obsidian-950 border-l border-white/5 transition-all duration-500 overflow-hidden">
          {state.isProjectOpen && (
            <RightSidebar 
              state={state} 
              role={state.activeRole} 
              onUpdateModifier={() => {}} 
              onUpdateProperty={(id, prop, val) => setState(p => ({ ...p, layers: p.layers.map(l => l.id === id ? { ...l, [prop]: val } : l) }))} 
              onDeleteLayer={() => {}} 
              onRenameLayer={() => {}} 
              onRestoreSnapshot={() => {}} 
              onExecuteSuggestion={() => {}} 
              onSelectLayer={(id) => setState(p => ({ ...p, selectedLayerId: id }))} 
              verboseMode={isExpertMode} 
            />
          )}
        </div>
      </div>

      <div className="col-span-3 z-[500]">
        <Footer 
          nodeCount={state.layers.length} 
          isRendering={state.isGenerating} 
          currentFrame={state.currentFrame} 
          isPlaying={false} 
          setIsPlaying={() => {}} 
          setCurrentFrame={(f) => setState(p => ({ ...p, currentFrame: f }))} 
          isExpertMode={isExpertMode} 
          onExpandTimeline={() => setIsTimelineExpanded(!isTimelineExpanded)}
        />
      </div>
    </div>
  );
};

export default App;
