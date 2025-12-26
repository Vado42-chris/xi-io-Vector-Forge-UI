
import React, { useState, useCallback, useEffect } from 'react';
import { TabType, ToolType, DesignStyle, VectorLayer, VectorNode, AppState, AIProvider, Toast } from './types';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Canvas from './components/Canvas';
import Footer from './components/Footer';
import FloatingToolbar from './components/FloatingToolbar';
import { generateVectorData, getSmartSuggestions } from './services/geminiService';

const INITIAL_SVG = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect id="bg" width="100%" height="100%" fill="#0a0b0e"/>
  <g id="workspace_root">
    <path id="prime_path" d="M 156 156 L 356 156 L 356 356 L 156 356 Z" fill="#FF9800" fill-opacity="0.1" stroke="#FF9800" stroke-width="2" />
  </g>
</svg>`;

const parseSvgPath = (d: string): VectorNode[] => {
  const commands = d.match(/[a-df-z][^a-df-z]*/ig) || [];
  return commands.map((cmd, i) => {
    const typeChar = cmd[0].toUpperCase();
    const args = cmd.slice(1).trim().split(/[\s,]+/).map(parseFloat);
    const id = `node_${i}_${Math.random().toString(36).substr(2, 4)}`;
    
    if (typeChar === 'M') return { id, type: 'move', x: args[0], y: args[1] };
    if (typeChar === 'L') return { id, type: 'line', x: args[0], y: args[1] };
    if (typeChar === 'C') return { id, type: 'cubic', cx1: args[0], cy1: args[1], cx2: args[2], cy2: args[3], x: args[4], y: args[5] };
    if (typeChar === 'Z') return { id, type: 'close', x: 0, y: 0 }; // simplified
    return { id, type: 'line', x: args[args.length-2], y: args[args.length-1] };
  });
};

const serializePath = (nodes: VectorNode[]): string => {
  return nodes.map(n => {
    if (n.type === 'move') return `M ${n.x} ${n.y}`;
    if (n.type === 'line') return `L ${n.x} ${n.y}`;
    if (n.type === 'cubic') return `C ${n.cx1} ${n.cy1} ${n.cx2} ${n.cy2} ${n.x} ${n.y}`;
    if (n.type === 'close') return `Z`;
    return '';
  }).join(' ');
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('vforge_xibalba_prime');
    const baseState: AppState = {
      activeTab: 'text',
      activeTool: 'select',
      prompt: '',
      isGenerating: false,
      style: DesignStyle.ABSTRACT,
      complexity: 92,
      credits: 25000,
      layers: [],
      selectedLayerId: null,
      selectedNodeId: null,
      zoom: 100,
      pan: { x: 0, y: 0 },
      currentSvg: INITIAL_SVG,
      history: [INITIAL_SVG],
      redoHistory: [],
      snapshots: [],
      chatHistory: [{ role: 'system', content: 'Xibalba OS Kernel 2.0. Geometrical Logic Active.', timestamp: Date.now() }],
      terminalLogs: [{ id: '1', type: 'info', text: 'XI_OS: Core initialized. Rulers locked to Forge.', timestamp: Date.now() }],
      terminalHistory: [],
      mcpServers: [],
      toasts: [],
      guides: [{ id: 'g1', type: 'v', pos: 256 }, { id: 'g2', type: 'h', pos: 256 }],
      showRulers: true,
      engineConfig: { provider: AIProvider.GEMINI_PRO, apiKey: '', thinkingBudget: 32768 }
    };
    return saved ? { ...baseState, ...JSON.parse(saved), isGenerating: false, toasts: [] } : baseState;
  });

  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  const syncLayersFromSvg = useCallback((svg: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");
    const paths = Array.from(doc.querySelectorAll('path'));
    
    return paths.map(p => ({
      id: p.id,
      name: p.getAttribute('data-name') || p.id || 'Unnamed Path',
      visible: p.getAttribute('display') !== 'none',
      locked: p.getAttribute('data-locked') === 'true',
      color: p.getAttribute('fill') || '#ffffff',
      stroke: p.getAttribute('stroke') || '#000000',
      strokeWidth: parseFloat(p.getAttribute('stroke-width') || '0'),
      opacity: parseFloat(p.getAttribute('opacity') || '1'),
      type: 'path' as const,
      nodes: parseSvgPath(p.getAttribute('d') || '')
    }));
  }, []);

  const updateSvgFromLayers = useCallback((layers: VectorLayer[]) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(state.currentSvg, "image/svg+xml");
    layers.forEach(layer => {
      const el = doc.getElementById(layer.id);
      if (el) {
        el.setAttribute('d', serializePath(layer.nodes));
        el.setAttribute('fill', layer.color);
        el.setAttribute('stroke', layer.stroke);
        el.setAttribute('stroke-width', layer.strokeWidth.toString());
        el.setAttribute('opacity', layer.opacity.toString());
      }
    });
    const newSvg = new XMLSerializer().serializeToString(doc);
    setState(p => ({ ...p, currentSvg: newSvg, layers }));
  }, [state.currentSvg]);

  useEffect(() => {
    if (state.layers.length === 0) {
      const parsedLayers = syncLayersFromSvg(state.currentSvg);
      setState(p => ({ ...p, layers: parsedLayers }));
    }
  }, [state.currentSvg, syncLayersFromSvg]);

  useEffect(() => {
    localStorage.setItem('vforge_xibalba_prime', JSON.stringify(state));
  }, [state]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setState(prev => ({ ...prev, toasts: [...prev.toasts, { id, message, type }] }));
    setTimeout(() => { setState(prev => ({ ...prev, toasts: prev.toasts.filter(t => t.id !== id) })); }, 3000);
  }, []);

  const handleUpdateNode = (layerId: string, nodeId: string, delta: {x: number, y: number}) => {
    const newLayers = state.layers.map(l => {
      if (l.id !== layerId) return l;
      return {
        ...l,
        nodes: l.nodes.map(n => n.id === nodeId ? { ...n, x: n.x + delta.x, y: n.y + delta.y } : n)
      };
    });
    updateSvgFromLayers(newLayers);
  };

  const handleAction = async (action: string) => {
    switch(action) {
      case 'FILE_NEW':
        if(confirm("Confirm workspace purge?")) {
          const freshSvg = INITIAL_SVG;
          const freshLayers = syncLayersFromSvg(freshSvg);
          setState(p => ({ ...p, currentSvg: freshSvg, layers: freshLayers, selectedLayerId: null, selectedNodeId: null }));
          showToast("Kernel Reset Complete", "success");
        }
        break;
      case 'FILE_EXPORT':
        const blob = new Blob([state.currentSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `xi_vector_${Date.now()}.svg`; a.click();
        showToast("SVG Exported", "success");
        break;
      case 'AI_SIMPLIFY':
        if(!state.selectedLayerId) { showToast("Select a path to rig", "warning"); return; }
        setState(p => ({ ...p, isGenerating: true }));
        const res = await generateVectorData(`Mathematically optimize and rig the path ID "${state.selectedLayerId}". Add kinetic joints for animation.`, state.style, state.currentSvg);
        if(res) {
          setState(p => ({ ...p, currentSvg: res.svg, layers: syncLayersFromSvg(res.svg) }));
          showToast("Rigging Calibrated", "success");
        }
        setState(p => ({ ...p, isGenerating: false }));
        break;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-obsidian-200 text-white antialiased">
      <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[200] pointer-events-none flex flex-col gap-2">
        {state.toasts.map(toast => (
          <div key={toast.id} className="px-5 py-3 rounded-xl border border-white/10 bg-obsidian-100/90 backdrop-blur-xl text-xs font-black uppercase tracking-widest text-primary shadow-2xl animate-in slide-in-from-top flex items-center gap-3">
             <span className="material-symbols-outlined text-[18px]">verified</span> {toast.message}
          </div>
        ))}
      </div>

      <Header onAction={handleAction} credits={state.credits} />
      
      <div className="flex-1 flex overflow-hidden relative">
        <LeftSidebar 
          state={state} setState={setState}
          onGenerate={async () => {
             setState(p => ({ ...p, isGenerating: true }));
             const res = await generateVectorData(state.prompt, state.style);
             if (res) { setState(p => ({ ...p, currentSvg: res.svg, layers: syncLayersFromSvg(res.svg) })); showToast("Logic Synthesized", "success"); }
             setState(p => ({ ...p, isGenerating: false }));
          }}
          onRefine={async () => {
             setState(p => ({ ...p, isGenerating: true }));
             const res = await generateVectorData(state.prompt, state.style, state.currentSvg);
             if (res) { setState(p => ({ ...p, currentSvg: res.svg, layers: syncLayersFromSvg(res.svg) })); showToast("Refined Geometry", "success"); }
             setState(p => ({ ...p, isGenerating: false }));
          }}
          onChat={(m) => setState(p => ({ ...p, chatHistory: [...p.chatHistory, {role:'user', content:m, timestamp:Date.now()}]}))}
          onTerminalCommand={(c) => setState(p => ({ ...p, terminalLogs: [...p.terminalLogs, {id:Date.now().toString(), type:'command', text:c, timestamp:Date.now()}]}))}
          onVisionScan={() => {}}
        />
        
        <main className="flex-1 flex flex-col bg-obsidian-200 relative overflow-hidden">
          <FloatingToolbar 
            activeTool={state.activeTool} 
            setTool={(t) => setState(p => ({...p, activeTool: t}))} 
            onSmartMagic={async () => {
              if(!state.selectedLayerId) { showToast("Select a topological node", "warning"); return; }
              setState(p => ({...p, isGenerating: true}));
              const suggestions = await getSmartSuggestions(state.currentSvg, state.selectedLayerId);
              setAiSuggestions(suggestions);
              setState(p => ({...p, isGenerating: false}));
            }} 
          />
          
          <Canvas 
            svgContent={state.currentSvg}
            layers={state.layers}
            isGenerating={state.isGenerating} 
            activeTool={state.activeTool}
            selectedLayerId={state.selectedLayerId}
            selectedNodeId={state.selectedNodeId}
            onSelectLayer={(id) => { setState(p => ({ ...p, selectedLayerId: id })); setAiSuggestions([]); }}
            onSelectNode={(id) => setState(p => ({ ...p, selectedNodeId: id }))}
            onUpdateNode={handleUpdateNode}
            zoom={state.zoom}
            pan={state.pan}
            onPan={(p) => setState(prev => ({ ...prev, pan: p }))}
            guides={state.guides}
            onAddGuide={(type, pos) => setState(prev => ({ ...prev, guides: [...prev.guides, { id: Math.random().toString(), type, pos }] }))}
            onUpdateGuide={(id, pos) => setState(prev => ({ ...prev, guides: prev.guides.map(g => g.id === id ? { ...g, pos } : g) }))}
          />

          {aiSuggestions.length > 0 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[650px] p-5 xi-card rounded-2xl shadow-3xl z-[150] flex flex-col gap-5 animate-in slide-in-from-bottom-10 backdrop-blur-3xl">
              <div className="flex items-center justify-between">
                 <span className="text-[11px] font-black text-primary tracking-[0.3em] uppercase flex items-center gap-3">
                   <span className="material-symbols-outlined text-sm">psychology</span> Logical Inferences
                 </span>
                 <button onClick={() => setAiSuggestions([])} className="material-symbols-outlined text-obsidian-500 text-[20px] hover:text-white">close</button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {aiSuggestions.map((s, i) => (
                  <button key={i} onClick={async () => {
                    setState(p => ({ ...p, isGenerating: true }));
                    const res = await generateVectorData(`Execution: ${s.action} - ${s.description}`, state.style, state.currentSvg);
                    if (res) { setState(p => ({ ...p, currentSvg: res.svg, layers: syncLayersFromSvg(res.svg) })); setAiSuggestions([]); showToast(`Logic Applied`, "success"); }
                    setState(p => ({ ...p, isGenerating: false }));
                  }} className="text-left p-4 rounded-xl xi-inset border border-white/5 hover:border-primary transition-all group">
                    <span className="text-[10px] font-black text-white uppercase block mb-2 group-hover:text-primary">{s.action}</span>
                    <p className="text-[9px] text-obsidian-500 leading-normal opacity-80">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>

        <RightSidebar 
          layers={state.layers}
          selectedLayerId={state.selectedLayerId}
          onSelectLayer={(id) => setState(p => ({ ...p, selectedLayerId: id }))}
          onUpdateProperty={(id, prop, val) => {
            const newLayers = state.layers.map(l => l.id === id ? { ...l, [prop]: val } : l);
            updateSvgFromLayers(newLayers);
          }}
          onToggleVisibility={(id) => {
            const l = state.layers.find(x => x.id === id);
            if(l) {
               const newLayers = state.layers.map(x => x.id === id ? { ...x, visible: !x.visible } : x);
               updateSvgFromLayers(newLayers);
            }
          }}
          onDeleteLayer={(id) => {
            const newLayers = state.layers.filter(l => l.id !== id);
            updateSvgFromLayers(newLayers);
            setState(p => ({ ...p, selectedLayerId: null }));
          }}
          onToggleLock={(id) => setState(p => ({ ...p, layers: p.layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l) }))}
          onRenameLayer={(id, name) => {
            const newLayers = state.layers.map(l => (l.id === id ? { ...l, name } : l));
            updateSvgFromLayers(newLayers);
          }}
          onDuplicateLayer={(id) => {
            const layerToDuplicate = state.layers.find(l => l.id === id);
            if (!layerToDuplicate) return;
            const newLayer: VectorLayer = {
              ...layerToDuplicate,
              id: `layer_${Date.now()}`,
              name: `${layerToDuplicate.name} (copy)`
            };
            const index = state.layers.findIndex(l => l.id === id);
            const newLayers = [...state.layers];
            newLayers.splice(index + 1, 0, newLayer);
            setState(p => ({ ...p, layers: newLayers }));
          }}
          onReorderLayer={(oldIndex, newIndex) => {
            const newLayers = [...state.layers];
            const [removed] = newLayers.splice(oldIndex, 1);
            newLayers.splice(newIndex, 0, removed);
            setState(p => ({ ...p, layers: newLayers }));
          }}
          snapshots={state.snapshots}
          onRestoreSnapshot={(svg) => setState(p => ({ ...p, currentSvg: svg, layers: syncLayersFromSvg(svg) }))}
        />
      </div>

      <Footer nodeCount={state.layers.length} fillInfo={state.selectedLayerId || 'WORKSPACE_ROOT'} isRendering={state.isGenerating} />
    </div>
  );
};

export default App;
