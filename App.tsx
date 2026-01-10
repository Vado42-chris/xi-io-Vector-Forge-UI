
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AppState, ShellMode, WorkspaceRole, ViewportType, SovereignViewConfig, ProjectFile, ProjectManifest, Persona, SubscriptionTier, UnitSystem, ViewportMode, CameraState, ProjectTemplate, ToolType, Directive, Guide, VectorLayer } from './types';
import SystemTitleBar from './components/SystemTitleBar';
import IdentityBar from './components/IdentityBar';
import FileBar from './components/FileBar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Canvas from './components/Canvas';
import Footer from './components/Footer';
import SovereignView from './components/SovereignView';
import SovereignEntry from './components/SovereignEntry';
import HangarDashboard from './components/HangarDashboard';
import MarketplaceNexus from './components/MarketplaceNexus';
import ProjectExplorer from './components/ProjectExplorer';
import XibalbaLedger from './components/XibalbaLedger';
import StudioOnboarding from './components/StudioOnboarding';
import NodeGraph from './components/NodeGraph';
import PerspectiveViewport from './components/PerspectiveViewport';
import OrthoViewport from './components/OrthoViewport';
import NewProjectModal from './components/modals/NewProjectModal';
import ProjectNexus from './components/ProjectNexus';
import Rulers from './components/Rulers';
import CodeKernel from './components/CodeKernel';
import TimelineSequencer from './components/TimelineSequencer';
import LucidStage from './components/LucidStage';

const DEFAULT_CAMERA: CameraState = { offset: { x: 0, y: 0 }, zoom: 1, pitch: 35, yaw: 45 };

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [verboseMode, setVerboseMode] = useState(false);
  const [focusedViewportType, setFocusedViewportType] = useState<ViewportType>('CANVAS_2D');

  const [state, setState] = useState<AppState>(() => ({
    shellMode: 'STUDIO',
    activeRole: WorkspaceRole.VECTOR_DESIGN,
    activeTool: 'select',
    prompt: '',
    isGenerating: false,
    style: 'Flat',
    credits: 142850.42,
    layers: [{ id: 'l1', name: 'ROOT_CHASSIS', visible: true, locked: false, color: '#b8860b', stroke: '#000', strokeWidth: 2, opacity: 1, nodes: [{id: 'n1', x: 256, y: 150, type: 'move'}], position: { x: 0, y: 0, z: 0 } }],
    selectedLayerId: 'l1',
    zoom: 100,
    pan: { x: 0, y: 0 },
    views: [{ id: 'v-init', type: 'CANVAS_2D', isFocused: true, camera: { ...DEFAULT_CAMERA } }],
    isProjectOpen: false, 
    projectName: 'VOID_KERNEL',
    persona: { username: 'OPERATOR_ARCHON', title: 'Architect', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Archon', nodeStatus: 'online', dotfileId: 'DF_90210', trustScore: 0.98, shardYield: 42, cognitiveDepth: 82, rank: 'ARCHITECT', level: 14, xp: 8000, xpToNext: 10000, communityImpact: 4200, traces: [], interactions: [], permissions: { coreMutation: true, marketInjection: true, deepReasoning: false } },
    currentFrame: 0, totalFrames: 250,
    showGrid: true, showRulers: true, unitSystem: UnitSystem.PIXELS,
    guides: [], complexity: 50, entropySeed: '0.142850_XIB', viewportMode: ViewportMode.SVG_2D, 
    directives: [],
    agents: [
      { id: 'a-1', name: 'LOGIC_BOT', avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=logic', isIdle: false, load: 42, specialization: 'Kernel Logic' }
    ],
    miningState: { isMining: false, hashRate: 0, totalContributed: 0, sessionYield: 0, networkDifficulty: 0.14 },
    antPipeline: { activeAgents: 4, packetsInFlight: 42, tunnelStatus: 'ENCRYPTED', bandwidth: '42.8MB/s' },
    peers: [],
    savedLayouts: {}
  }));

  const handleAction = (actionType: string, payload: any = {}) => {
    if (actionType.startsWith('SHELL_')) {
      const newMode = actionType.replace('SHELL_', '') as ShellMode;
      setState(prev => ({ ...prev, shellMode: newMode }));
      return;
    }

    if (actionType === 'LAYOUT_SAVE') {
      const name = prompt("Enter name for this Layout Registry entry:") || "Custom_Layout";
      setState(prev => ({
        ...prev,
        savedLayouts: { ...prev.savedLayouts, [name]: prev.views }
      }));
      console.log(`[LAYOUT] Saved arrangement: ${name}`);
      return;
    }

    if (actionType === 'LAYOUT_RESET') {
       setState(prev => ({ ...prev, views: [{ id: 'v-master', type: 'CANVAS_2D', isFocused: true, camera: { ...DEFAULT_CAMERA } }] }));
       return;
    }

    if (actionType === 'PROJECT_INITIALIZE_FINALIZE') {
      const template = payload.name as ProjectTemplate;
      let initialViews: SovereignViewConfig[] = [];
      let role = WorkspaceRole.VECTOR_DESIGN;

      switch(template) {
        case ProjectTemplate.SKELETON_RIG:
          role = WorkspaceRole.SKELETON_RIG;
          initialViews = [
            { id: 'v1', type: 'PERSPECTIVE', isFocused: true, camera: { ...DEFAULT_CAMERA } },
            { id: 'v2', type: 'ORTHO_TOP', isFocused: false, camera: { ...DEFAULT_CAMERA, pitch: 90 } },
            { id: 'v3', type: 'ORTHO_FRONT', isFocused: false, camera: { ...DEFAULT_CAMERA, pitch: 0, yaw: 0 } },
            { id: 'v4', type: 'NODE_GRAPH', isFocused: false, camera: { ...DEFAULT_CAMERA } }
          ];
          break;
        case ProjectTemplate.ANIMATION_TIMELINE:
          role = WorkspaceRole.ANIMATION;
          initialViews = [
            { id: 'v-master', type: 'CANVAS_2D', isFocused: true, camera: { ...DEFAULT_CAMERA } },
            { id: 'v-temporal', type: 'TIMELINE_EDITOR', isFocused: false, camera: { ...DEFAULT_CAMERA } }
          ];
          break;
        case ProjectTemplate.CODE_FORGE:
          role = WorkspaceRole.LOGIC_FORGE;
          initialViews = [
            { id: 'v-ide', type: 'CODE_IDE', isFocused: true, camera: { ...DEFAULT_CAMERA } }
          ];
          break;
        case ProjectTemplate.PROJECT_NEXUS:
          role = WorkspaceRole.PROJECT_NEXUS;
          initialViews = [
            { id: 'v-nodes', type: 'NODE_GRAPH', isFocused: true, camera: { ...DEFAULT_CAMERA } }
          ];
          break;
        case ProjectTemplate.LUX_COMPOSITING:
          role = WorkspaceRole.LUX_STAGE;
          initialViews = [
            { id: 'v-comp', type: 'LUX_COMPOSITOR', isFocused: true, camera: { ...DEFAULT_CAMERA } },
            { id: 'v-side', type: 'PERSPECTIVE', isFocused: false, camera: { ...DEFAULT_CAMERA } }
          ];
          break;
        default:
          initialViews = [{ id: 'v-master', type: 'CANVAS_2D', isFocused: true, camera: { ...DEFAULT_CAMERA } }];
      }

      setState(prev => ({ 
        ...prev, 
        isProjectOpen: true, 
        shellMode: 'STUDIO', 
        projectName: template.replace(/_/g, ' '),
        activeRole: role,
        views: initialViews
      }));
      setActiveModal(null);
      return;
    }

    if (actionType === 'MODAL_NEW_PROJECT') setActiveModal('NEW_PROJECT');
    if (actionType === 'FILE_HOME' || actionType === 'FILE_CLOSE') setState(prev => ({ ...prev, isProjectOpen: false, shellMode: 'STUDIO' }));

    if (actionType === 'VIEW_CAMERA_UPDATE') {
      setState(prev => ({
        ...prev,
        views: prev.views.map(v => v.id === payload.id ? { ...v, camera: { ...v.camera, ...payload.camera } } : v)
      }));
    }

    if (actionType === 'VIEW_TYPE_SET') {
      setState(prev => ({
        ...prev,
        views: prev.views.map(v => v.id === payload.id ? { ...v, type: payload.type } : v)
      }));
      if (payload.isFocused) setFocusedViewportType(payload.type);
    }
  };

  const renderActiveShell = () => {
    if (state.shellMode === 'EXCHANGE') return <MarketplaceNexus credits={state.credits} onInject={(shard) => handleAction('INJECT_SHARD', shard)} verboseMode={verboseMode} />;
    if (state.shellMode === 'VAULT') return <ProjectExplorer state={state} verboseMode={verboseMode} />;
    if (state.shellMode === 'LEDGER') return <XibalbaLedger />;
    if (state.shellMode === 'ONBOARDING') return <StudioOnboarding state={state} verboseMode={verboseMode} />;

    if (state.shellMode === 'STUDIO') {
      if (!state.isProjectOpen) {
        return <HangarDashboard 
          onNewProject={() => handleAction('MODAL_NEW_PROJECT')} 
          onOpenRecent={() => handleAction('PROJECT_INITIALIZE_FINALIZE')} 
          onCloudSync={() => {}} 
          recentManifests={[]} 
          verboseMode={verboseMode} 
        />;
      }

      if (state.activeRole === WorkspaceRole.PROJECT_NEXUS) {
        return <ProjectNexus 
          state={state} 
          onSelectDirective={(id) => setState(p => ({ ...p, selectedDirectiveId: id }))} 
          onSelectAgent={() => {}} 
          onCreateDirective={() => {}} 
          onApplyDirective={() => {}} 
          verboseMode={verboseMode} 
        />;
      }

      const viewCount = state.views.length;
      const gridStyles: React.CSSProperties = {
        display: 'grid',
        gap: '2px',
        background: '#1c1d21', 
        height: '100%',
        gridTemplateColumns: viewCount === 1 ? '1fr' : viewCount === 2 ? '1.5fr 1fr' : 'repeat(2, 1fr)',
        gridTemplateRows: viewCount <= 2 ? '1fr' : 'repeat(2, 1fr)'
      };

      return (
        <div style={gridStyles} className="flex-1 overflow-hidden p-[2px]">
          {state.views.map(view => {
            const hasRulers = view.type === 'CANVAS_2D' || view.type.startsWith('ORTHO');
            return (
              <SovereignView 
                key={view.id} id={view.id} type={view.type} isFocused={view.isFocused}
                onFocus={() => {
                  setState(prev => ({ ...prev, views: prev.views.map(v => ({ ...v, isFocused: v.id === view.id })) }));
                  setFocusedViewportType(view.type);
                }} 
                onClose={() => setState(prev => ({ ...prev, views: prev.views.length > 1 ? prev.views.filter(v => v.id !== view.id) : prev.views }))}
                onTypeChange={(t) => handleAction('VIEW_TYPE_SET', { id: view.id, type: t, isFocused: view.isFocused })}
                camera={view.camera}
                onCameraChange={(cam) => handleAction('VIEW_CAMERA_UPDATE', { id: view.id, camera: cam })}
              >
                <div className="size-full paper-layer grain-medium xi-paper-sheet overflow-hidden relative rounded-xi">
                  {hasRulers && (
                    <Rulers 
                      zoom={state.zoom} pan={state.pan} viewportMode={state.viewportMode} unitSystem={state.unitSystem}
                      snapEnabled={state.showGrid} guides={state.guides} 
                      onAddGuide={() => {}} onUpdateGuide={() => {}} onDeleteGuide={() => {}} 
                      onClearGuides={() => {}} onResetOrigin={() => {}} onSetUnitSystem={() => {}}
                      onToggleSnap={() => {}} onSwitchViewport={() => {}}
                    />
                  )}
                  <div className={hasRulers ? 'absolute inset-8 border border-white/5 bg-obsidian-950/20 rounded-xi' : 'size-full'}>
                    {view.type === 'CANVAS_2D' && <Canvas state={state} onUpdateState={(p) => setState(prev => ({ ...prev, ...p }))} onSelectLayer={(id) => setState(prev => ({ ...prev, selectedLayerId: id }))} />}
                    {view.type === 'PERSPECTIVE' && <PerspectiveViewport state={state} camera={view.camera} onCameraChange={(cam) => handleAction('VIEW_CAMERA_UPDATE', { id: view.id, camera: cam })} label="MASTER_PERSPECTIVE" />}
                    {view.type === 'ORTHO_TOP' && <OrthoViewport state={state} axis="TOP" camera={view.camera} onCameraChange={(cam) => handleAction('VIEW_CAMERA_UPDATE', { id: view.id, camera: cam })} />}
                    {view.type === 'ORTHO_FRONT' && <OrthoViewport state={state} axis="FRONT" camera={view.camera} onCameraChange={(cam) => handleAction('VIEW_CAMERA_UPDATE', { id: view.id, camera: cam })} />}
                    {view.type === 'ORTHO_SIDE' && <OrthoViewport state={state} axis="SIDE" camera={view.camera} onCameraChange={(cam) => handleAction('VIEW_CAMERA_UPDATE', { id: view.id, camera: cam })} />}
                    {view.type === 'NODE_GRAPH' && <NodeGraph />}
                    {view.type === 'CODE_IDE' && <CodeKernel />}
                    {view.type === 'TIMELINE_EDITOR' && <TimelineSequencer currentFrame={state.currentFrame} totalFrames={state.totalFrames} shards={[]} onSeek={(f) => setState(p => ({ ...p, currentFrame: f }))} />}
                    {view.type === 'LUX_COMPOSITOR' && <LucidStage />}
                  </div>
                </div>
              </SovereignView>
            );
          })}
        </div>
      );
    }

    return null;
  };

  if (!isInitialized) return <SovereignEntry onInitialize={(u) => { setState(prev => ({ ...prev, persona: { ...prev.persona, username: u } })); setIsInitialized(true); }} />;

  return (
    <div className="flex flex-col h-screen bg-obsidian-950 text-obsidian-100 select-none overflow-hidden font-sans paper-layer grain-coarse">
      <header className="flex flex-col shrink-0 z-[1000] xi-paper-panel paper-layer grain-fine bg-obsidian-850">
        <SystemTitleBar verboseMode={verboseMode} setVerboseMode={() => setVerboseMode(!verboseMode)} />
        <FileBar onAction={handleAction} isProjectOpen={state.isProjectOpen} visiblePanels={[]} />
        <IdentityBar 
          projectName={state.projectName} isProjectOpen={state.isProjectOpen} persona={state.persona} currentMode={state.shellMode}
          onAction={handleAction} credits={state.credits} verboseMode={verboseMode} miningState={state.miningState} antPipeline={state.antPipeline}
        />
      </header>

      <main className="flex-1 flex overflow-hidden relative min-h-0">
        {state.isProjectOpen && state.shellMode === 'STUDIO' && (
          <aside className="w-16 h-full bg-obsidian-850 shrink-0 paper-layer grain-fine xi-paper-panel z-50">
            <LeftSidebar 
              activeRole={state.activeRole} 
              activeViewportType={focusedViewportType}
              setRole={(r) => setState(p => ({ ...p, activeRole: r }))} 
              collapsed={true} 
              activeTool={state.activeTool} 
              onToolSelect={(t) => setState(prev => ({ ...prev, activeTool: t }))} 
              verboseMode={verboseMode} 
            />
          </aside>
        )}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
          {renderActiveShell()}
        </div>
        {state.isProjectOpen && state.shellMode === 'STUDIO' && (
          <aside className="w-[340px] h-full bg-obsidian-850 shrink-0 flex flex-col paper-layer grain-fine xi-paper-panel z-50">
            <RightSidebar 
              state={state} role={state.activeRole} 
              onUpdateModifier={() => {}} 
              onUpdateProperty={(id, prop, val) => setState(prev => ({
                ...prev,
                layers: prev.layers.map(l => l.id === id ? { ...l, [prop]: val } : l)
              }))} 
              onDeleteLayer={() => {}} 
              onRenameLayer={() => {}} 
              onRestoreSnapshot={() => {}} 
              onExecuteSuggestion={() => {}} 
              onSelectLayer={(id) => setState(p => ({ ...p, selectedLayerId: id }))} 
              verboseMode={verboseMode} 
            />
          </aside>
        )}
      </main>

      <footer className="h-12 shrink-0 z-[700] xi-paper-panel paper-layer grain-fine bg-obsidian-850">
        <Footer nodeCount={state.layers.length} isRendering={state.isGenerating} currentFrame={state.currentFrame} isPlaying={false} setIsPlaying={() => {}} setCurrentFrame={(f) => setState(prev => ({ ...prev, currentFrame: f }))} verboseMode={verboseMode} />
      </footer>

      {activeModal === 'NEW_PROJECT' && (
        <NewProjectModal onClose={() => setActiveModal(null)} onCreate={(template) => handleAction('PROJECT_INITIALIZE_FINALIZE', { name: template })} />
      )}
    </div>
  );
};

export default App;
