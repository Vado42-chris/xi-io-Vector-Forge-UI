
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TabType, ToolType, DesignStyle, VectorLayer, VectorNode, Shape, AppState, AIProvider, Toast } from './types';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Canvas from './components/Canvas';
import Footer from './components/Footer';
import FloatingToolbar from './components/FloatingToolbar';
import Timeline from './components/Timeline';
import { generateVectorData, getSmartSuggestions, createShapes } from './services/geminiService';

const INITIAL_SVG = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect id="bg" width="100%" height="100%" fill="#0a0b0e"/>
  <g id="workspace_root">
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
    if (typeChar === 'Z') return { id, type: 'close', x: 0, y: 0 };
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
      activeTab: 'chat',
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
      guides: [{ id: 'g1', type: 'v', pos: 256 }, { id: 'g2', type: 'h', pos: 256 }],
      showRulers: true,
      isPlaying: false,
      currentTime: 0,
      duration: 5,
      engineConfig: { provider: AIProvider.GEMINI_PRO, apiKey: '', thinkingBudget: 32768 }
    };
    return saved ? { ...baseState, ...JSON.parse(saved), isGenerating: false, toasts: [] } : baseState;
  });

  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  const syncLayersFromSvg = useCallback((svg: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");
    const elements = Array.from(doc.querySelectorAll('path, rect, ellipse'));
    
    return elements.map((el): VectorLayer | null => {
      const baseLayer = {
        id: el.id,
        name: el.getAttribute('data-name') || el.id || 'Unnamed Layer',
        visible: el.getAttribute('display') !== 'none',
        locked: el.getAttribute('data-locked') === 'true',
        color: el.getAttribute('fill') || '#ffffff',
        stroke: el.getAttribute('stroke') || '#000000',
        strokeWidth: parseFloat(el.getAttribute('stroke-width') || '0'),
        opacity: parseFloat(el.getAttribute('fill-opacity') || '1'),
        keyframes: [],
        isRigged: false,
      };

      if (el.tagName === 'path') {
        return { ...baseLayer, shape: { type: 'path', nodes: parseSvgPath(el.getAttribute('d') || '') } };
      } else if (el.tagName === 'rect') {
        return {
          ...baseLayer,
          shape: {
            type: 'rect',
            x: parseFloat(el.getAttribute('x') || '0'),
            y: parseFloat(el.getAttribute('y') || '0'),
            width: parseFloat(el.getAttribute('width') || '0'),
            height: parseFloat(el.getAttribute('height') || '0'),
            borderRadius: parseFloat(el.getAttribute('rx') || '0'),
          }
        };
      } else if (el.tagName === 'ellipse') {
        return {
          ...baseLayer,
          shape: {
            type: 'ellipse',
            cx: parseFloat(el.getAttribute('cx') || '0'),
            cy: parseFloat(el.getAttribute('cy') || '0'),
            rx: parseFloat(el.getAttribute('rx') || '0'),
            ry: parseFloat(el.getAttribute('ry') || '0'),
          }
        };
      }
      return null;
    }).filter((l): l is VectorLayer => l !== null);
  }, []);

  const updateSvgFromLayers = useCallback((layers: VectorLayer[]) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(state.currentSvg, "image/svg+xml");
    const workspace = doc.getElementById('workspace_root');
    if (!workspace) return;

    while (workspace.firstChild) {
      workspace.removeChild(workspace.firstChild);
    }

    layers.forEach(layer => {
      let el: SVGElement;
      if (layer.shape.type === 'path') {
        el = doc.createElementNS("http://www.w3.org/2000/svg", "path");
        el.setAttribute('d', serializePath(layer.shape.nodes));
      } else if (layer.shape.type === 'rect') {
        el = doc.createElementNS("http://www.w3.org/2000/svg", "rect");
        el.setAttribute('x', layer.shape.x.toString());
        el.setAttribute('y', layer.shape.y.toString());
        el.setAttribute('width', layer.shape.width.toString());
        el.setAttribute('height', layer.shape.height.toString());
        el.setAttribute('rx', layer.shape.borderRadius.toString());
      } else if (layer.shape.type === 'ellipse') {
        el = doc.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        el.setAttribute('cx', layer.shape.cx.toString());
        el.setAttribute('cy', layer.shape.cy.toString());
        el.setAttribute('rx', layer.shape.rx.toString());
        el.setAttribute('ry', layer.shape.ry.toString());
      } else {
        return;
      }

      el.id = layer.id;
      el.setAttribute('data-name', layer.name);
      el.setAttribute('fill', layer.color);
      el.setAttribute('stroke', layer.stroke);
      el.setAttribute('stroke-width', layer.strokeWidth.toString());
      el.setAttribute('fill-opacity', layer.opacity.toString());
      if (!layer.visible) {
        el.setAttribute('display', 'none');
      }
      workspace.appendChild(el);
    });

    const newSvg = new XMLSerializer().serializeToString(doc);
    setState(p => ({ ...p, currentSvg: newSvg, layers }));
  }, [state.currentSvg]);

  const animate = (time: number) => {
    if (lastTimeRef.current === undefined) {
        lastTimeRef.current = time;
    }
    const deltaTime = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    setState(p => {
        if (!p.isPlaying) return p;
        const newTime = p.currentTime + deltaTime;

        const animatedLayers = p.layers.map(layer => {
          let newLayer = { ...layer };
          layer.keyframes.forEach(kf => {
            const prevKeyframes = layer.keyframes.filter(k => k.property === kf.property && k.time <= newTime).sort((a, b) => b.time - a.time);
            const nextKeyframes = layer.keyframes.filter(k => k.property === kf.property && k.time > newTime).sort((a, b) => a.time - b.time);

            const start = prevKeyframes[0];
            const end = nextKeyframes[0];

            if (start && end) {
              const t = (newTime - start.time) / (end.time - start.time);
              const value = start.value + (end.value - start.value) * t;
              if (['x', 'y', 'width', 'height', 'borderRadius', 'cx', 'cy', 'rx', 'ry'].includes(kf.property)) {
                newLayer.shape = { ...newLayer.shape, [kf.property]: value } as Shape;
              } else {
                (newLayer as any)[kf.property] = value;
              }
            }
          });
          return newLayer;
        });

        if (newTime > p.duration) {
            return { ...p, currentTime: p.duration, isPlaying: false, layers: animatedLayers };
        }
        return { ...p, currentTime: newTime, layers: animatedLayers };
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (state.isPlaying) {
        lastTimeRef.current = undefined;
        animationFrameRef.current = requestAnimationFrame(animate);
    } else {
        cancelAnimationFrame(animationFrameRef.current!);
    }
    return () => cancelAnimationFrame(animationFrameRef.current!);
  }, [state.isPlaying]);

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

  const handleSendAiMessage = async (message: string) => {
    const newMessage = { role: 'user', content: message, timestamp: Date.now() };
    const updatedChatHistory = [...state.chatHistory, newMessage];
    setState(p => ({ ...p, isGenerating: true, chatHistory: updatedChatHistory }));

    const isGenerative = /create|add|draw/i.test(message);

    try {
      if (isGenerative) {
        const newShapes = await createShapes(message);
        if (newShapes) {
          const newLayers: VectorLayer[] = newShapes.map((shape, i) => ({
            id: `layer_${Date.now()}_${i}`,
            name: `${shape.type} ${i}`,
            visible: true,
            locked: false,
            color: shape.properties.fill || '#ffffff',
            stroke: shape.properties.stroke || '#000000',
            strokeWidth: 1,
            opacity: 1,
            keyframes: [],
            shape: shape as Shape,
          }));
          updateSvgFromLayers([...state.layers, ...newLayers]);
          showToast("Shapes Created", "success");
        }
      } else {
        const res = await generateVectorData(message, state.style, state.currentSvg);
        if (res) {
          setState(p => ({ ...p, currentSvg: res.svg, layers: syncLayersFromSvg(res.svg) }));
          showToast("Logic Refined", "success");
        } else {
          throw new Error("AI failed to generate a response.");
        }
      }
    } catch (error) {
      console.error(error);
      showToast("Request Failed", "error");
    } finally {
      setState(p => ({ ...p, isGenerating: false }));
    }
  };

  const handleTerminalCommand = (command: string) => {
    const log = (text: string, type: 'info' | 'error' = 'info') => {
      setState(p => ({
        ...p,
        terminalLogs: [...p.terminalLogs, { id: Date.now().toString(), type, text, timestamp: Date.now() }]
      }));
    };

    const api = {
      createLayer: (shape: Shape) => {
        const newLayer: VectorLayer = {
          id: `layer_${Date.now()}`,
          name: 'New Layer',
          visible: true,
          locked: false,
          color: '#ffffff',
          stroke: '#000000',
          strokeWidth: 1,
          opacity: 1,
          keyframes: [],
          shape,
        };
        const newLayers = [...state.layers, newLayer];
        updateSvgFromLayers(newLayers);
        log(`Created new layer: ${newLayer.id}`);
      },
      deleteLayer: (id: string) => {
        const newLayers = state.layers.filter(l => l.id !== id);
        updateSvgFromLayers(newLayers);
        log(`Deleted layer: ${id}`);
      },
      getLayer: (id: string) => {
        return state.layers.find(l => l.id === id);
      },
      timeline: {
        play: () => setState(p => ({ ...p, isPlaying: true })),
        pause: () => setState(p => ({ ...p, isPlaying: false })),
        seek: (time: number) => setState(p => ({ ...p, currentTime: time })),
      },
      selectedLayer: {
        set: (prop: string, value: any) => {
          const selectedLayer = state.layers.find(l => l.id === state.selectedLayerId);
          if (!selectedLayer) {
            log("No layer selected.", "error");
            return;
          }
          const newLayers = state.layers.map(l => {
            if (l.id === selectedLayer.id) {
              const isShapeProp = ['x', 'y', 'width', 'height', 'borderRadius', 'cx', 'cy', 'rx', 'ry'].includes(prop);
              if (isShapeProp) {
                return { ...l, shape: { ...l.shape, [prop]: value } };
              }
              return { ...l, [prop]: value };
            }
            return l;
          });
          updateSvgFromLayers(newLayers);
          log(`Set ${prop} to ${value}`);
        },
        get: (prop: string) => {
            const selectedLayer = state.layers.find(l => l.id === state.selectedLayerId);
            if (!selectedLayer) {
              log("No layer selected.", "error");
              return;
            }
            const isShapeProp = ['x', 'y', 'width', 'height', 'borderRadius', 'cx', 'cy', 'rx', 'ry'].includes(prop);
            if (isShapeProp) {
                log((selectedLayer.shape as any)[prop]);
            } else {
                log((selectedLayer as any)[prop]);
            }
        }
      }
    };

    try {
      new Function('api', command)(api);
    } catch (e) {
      log((e as Error).message, 'error');
    }
  };

  const handleUpdateNode = (layerId: string, nodeId: string, delta: {x: number, y: number}) => {
    const newLayers = state.layers.map(l => {
      if (l.id !== layerId || l.shape.type !== 'path') return l;
      const newNodes = l.shape.nodes.map(n =>
        n.id === nodeId ? { ...n, x: (n.x ?? 0) + delta.x, y: (n.y ?? 0) + delta.y } : n
      );
      return { ...l, shape: { ...l.shape, nodes: newNodes } };
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
    <div className="h-screen w-screen flex flex-col bg-obsidian-200 text-white antialiased">
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
          onSendAiMessage={handleSendAiMessage}
          onTerminalCommand={handleTerminalCommand}
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

          <Timeline
            isPlaying={state.isPlaying}
            currentTime={state.currentTime}
            duration={state.duration}
            onPlayPause={() => setState(p => ({ ...p, isPlaying: !p.isPlaying }))}
            onScrub={(time) => setState(p => ({ ...p, currentTime: time }))}
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
          onUpdateShapeProperty={(id, prop, val) => {
            const newLayers = state.layers.map(l => {
              if (l.id === id) {
                const newShape = { ...l.shape, [prop]: val };
                return { ...l, shape: newShape as Shape };
              }
              return l;
            });
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

      <Footer nodeCount={state.layers.reduce((acc, l) => acc + (l.shape.type === 'path' ? l.shape.nodes.length : 0), 0)} fillInfo={state.selectedLayerId || 'WORKSPACE_ROOT'} isRendering={state.isGenerating} />
    </div>
  );
};

export default App;
