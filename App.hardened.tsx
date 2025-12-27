import React, { useState, useCallback, useEffect } from 'react';
import { AppState, ToolType, VectorLayer } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import ProfessionalFileMenu from './components/ProfessionalFileMenu';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import ProfessionalLayersPanel from './components/ProfessionalLayersPanel';
import DraftsmanCanvas from './components/DraftsmanCanvas';
import PowerUserToolbar from './components/PowerUserToolbar';
import AnimationTimeline from './components/AnimationTimeline';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('vforge_xibalba_prime');
      const baseState: AppState = {
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
        currentSvg: '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="var(--xibalba-grey-000, #0a0b0e)"/></svg>',
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
      };
      return saved ? { ...baseState, ...JSON.parse(saved), isGenerating: false, toasts: [] } : baseState;
    } catch (error) {
      console.error('Failed to load state:', error);
      // Return safe default state
      return {
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
      };
    }
  });

  const [keyframes, setKeyframes] = useState<any[]>([]);
  const [frameState, setFrameState] = useState({ currentFrame: 0, fps: 24, isPlaying: false });

  // Toast management
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const toast = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now()
    };
    setState(prev => ({ ...prev, toasts: [...prev.toasts, toast] }));
    setTimeout(() => {
      setState(prev => ({ ...prev, toasts: prev.toasts.filter(t => t.id !== toast.id) }));
    }, 3000);
  }, []);

  // Handle actions from file menu
  const handleAction = useCallback((action: string) => {
    try {
      switch (action) {
        case 'FILE_NEW':
          setState(prev => ({
            ...prev,
            currentSvg: '<svg viewBox="0 0 512 512"></svg>',
            layers: [],
            selectedLayerId: null
          }));
          showToast('New file created', 'success');
          break;
        case 'FILE_SAVE':
          try {
            localStorage.setItem('vforge_xibalba_prime', JSON.stringify(state));
            showToast('File saved', 'success');
          } catch (error) {
            showToast('Failed to save file', 'error');
          }
          break;
        default:
          showToast(`Action: ${action}`, 'info');
      }
    } catch (error) {
      console.error('Action error:', error);
      showToast('Action failed', 'error');
    }
  }, [state, showToast]);

  // Handle tool changes
  const handleToolChange = useCallback((tool: ToolType) => {
    setState(prev => ({ ...prev, activeTool: tool }));
  }, []);

  // Handle layer selection
  const handleLayerSelect = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedLayerId: id }));
  }, []);

  // Handle SVG changes
  const handleSvgChange = useCallback((svg: string) => {
    setState(prev => ({ ...prev, currentSvg: svg }));
  }, []);

  // Handle pan
  const handlePan = useCallback((pan: { x: number; y: number }) => {
    setState(prev => ({ ...prev, pan }));
  }, []);

  // Handle zoom
  const handleZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(10, Math.min(500, zoom)) }));
  }, []);

  // Handle generate
  const handleGenerate = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isGenerating: true }));
      // Simulate generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Generation complete', 'success');
    } catch (error) {
      showToast('Generation failed', 'error');
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  }, [showToast]);

  return (
    <ErrorBoundary>
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: 'var(--xibalba-grey-000, #0a0b0e)',
        color: 'var(--xibalba-text-000, #ffffff)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden'
      }}>
        {/* Header with File Menu */}
        <ErrorBoundary>
          <div style={{ 
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'var(--xibalba-grey-050, #12141a)'
          }}>
            <ProfessionalFileMenu 
              onAction={handleAction}
            />
          </div>
        </ErrorBoundary>

        {/* Main Content Area */}
        <div style={{ 
          flex: 1, 
          display: 'flex',
          backgroundColor: 'var(--xibalba-grey-000, #0a0b0e)',
          overflow: 'hidden'
        }}>
          {/* Left Sidebar */}
          <ErrorBoundary>
            <LeftSidebar 
              state={state}
              setState={setState}
              onGenerate={handleGenerate}
            />
          </ErrorBoundary>

          {/* Center Canvas Area */}
          <div style={{ 
            flex: 1, 
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Power User Toolbar */}
            <ErrorBoundary>
              <PowerUserToolbar
                activeTool={state.activeTool}
                setTool={handleToolChange}
                onSmartMagic={async () => showToast('Smart Magic', 'info')}
              />
            </ErrorBoundary>

            {/* Canvas */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <ErrorBoundary>
                <DraftsmanCanvas 
                  svgContent={state.currentSvg}
                  layers={state.layers}
                  activeTool={state.activeTool}
                  selectedLayerId={state.selectedLayerId}
                  zoom={state.zoom}
                  pan={state.pan}
                  onPan={handlePan}
                  onZoom={handleZoom}
                  onSelectLayer={handleLayerSelect}
                  onCreateLayer={(layer: VectorLayer) => {
                    setState(prev => ({ ...prev, layers: [...prev.layers, layer] }));
                  }}
                  onUpdateLayer={(id: string, updates: Partial<VectorLayer>) => {
                    setState(prev => ({
                      ...prev,
                      layers: prev.layers.map(l => l.id === id ? { ...l, ...updates } : l)
                    }));
                  }}
                  onSvgChange={handleSvgChange}
                  onToolChange={handleToolChange}
                  keyframes={keyframes}
                  frameState={frameState}
                  onKeyframeAdd={(kf) => setKeyframes(prev => [...prev, kf])}
                  onKeyframeUpdate={(id, props) => setKeyframes(prev => prev.map(k => k.id === id ? { ...k, ...props } : k))}
                  onKeyframeDelete={(id) => setKeyframes(prev => prev.filter(k => k.id !== id))}
                  measurementUnit="px"
                />
              </ErrorBoundary>
            </div>

            {/* Animation Timeline */}
            <ErrorBoundary>
              <AnimationTimeline
                keyframes={keyframes}
                frameState={frameState}
                onFrameChange={(frame) => setFrameState(prev => ({ ...prev, currentFrame: frame }))}
                onPlayPause={() => setFrameState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                onAddKeyframe={(kf) => setKeyframes(prev => [...prev, kf])}
                onUpdateKeyframe={(id, props) => setKeyframes(prev => prev.map(k => k.id === id ? { ...k, ...props } : k))}
                onDeleteKeyframe={(id) => setKeyframes(prev => prev.filter(k => k.id !== id))}
                selectedLayerId={state.selectedLayerId}
                layers={state.layers}
                presets={[]}
              />
            </ErrorBoundary>
          </div>

          {/* Right Sidebar */}
          <ErrorBoundary>
            <RightSidebar
              layers={state.layers || []}
              selectedLayerId={state.selectedLayerId}
              activeTool={state.activeTool}
              toolProperties={{ strokeWidth: 1, opacity: 1, fill: '#ffffff' }}
              onToolPropertiesChange={() => {}}
              onSelectLayer={handleLayerSelect}
              onToggleVisibility={() => {}}
              onToggleLock={() => {}}
              onUpdateProperty={() => {}}
              onDeleteLayer={(id) => {
                setState(prev => ({ ...prev, layers: prev.layers.filter(l => l.id !== id) }));
              }}
              onDuplicateLayer={(id) => {
                const layer = state.layers.find(l => l.id === id);
                if (layer) {
                  setState(prev => ({ ...prev, layers: [...prev.layers, { ...layer, id: `${id}_copy_${Date.now()}` }] }));
                }
              }}
              onReorderLayer={() => {}}
              onRenameLayer={(id, name) => {
                setState(prev => ({
                  ...prev,
                  layers: prev.layers.map(l => l.id === id ? { ...l, name } : l)
                }));
              }}
              onUpdateLayer={(id, updates) => {
                setState(prev => ({
                  ...prev,
                  layers: prev.layers.map(l => l.id === id ? { ...l, ...updates } : l)
                }));
              }}
              onCreateLayer={() => {
                const newLayer: VectorLayer = {
                  id: `layer_${Date.now()}`,
                  name: 'New Layer',
                  color: '#ffffff',
                  visible: true,
                  locked: false,
                  shape: { type: 'path', d: 'M 0 0' }
                };
                setState(prev => ({ ...prev, layers: [...prev.layers, newLayer] }));
              }}
              onCreateSublayer={() => {}}
              onGroupLayers={() => {}}
              onUngroupLayer={() => {}}
              onCreateClippingMask={() => {}}
              onReleaseClippingMask={() => {}}
              snapshots={state.snapshots || []}
              onRestoreSnapshot={(svg) => {
                setState(prev => ({ ...prev, currentSvg: svg }));
              }}
              keyframes={keyframes}
              frameState={frameState}
              onScriptChange={() => {}}
              state={state}
              setState={setState}
            />
          </ErrorBoundary>
        </div>

        {/* Footer */}
        <ErrorBoundary>
          <Footer
            state={state}
            onAction={handleAction}
          />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default App;

