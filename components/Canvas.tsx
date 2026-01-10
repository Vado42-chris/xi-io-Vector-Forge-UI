
import React, { useRef, useState } from 'react';
import { AppState, VectorNode, ViewportMode, Guide } from '../types';
import Rulers from './Rulers';

interface CanvasProps {
  state: AppState;
  onUpdateState: (patch: Partial<AppState>) => void;
  onSelectLayer: (id: string) => void;
}

const serializePath = (nodes: VectorNode[]): string => {
  return nodes.map(n => {
    if (n.type === 'move') return `M ${n.x} ${n.y}`;
    if (n.type === 'line') return `L ${n.x} ${n.y}`;
    if (n.type === 'cubic') return `C ${n.cx1} ${n.cy1} ${n.cx2} ${n.cy2} ${n.x} ${n.y}`;
    if (n.type === 'close') return `Z`;
    return '';
  }).join(' ');
};

const Canvas: React.FC<CanvasProps> = ({ state, onUpdateState, onSelectLayer }) => {
  const { layers, isGenerating, selectedLayerId, zoom, pan, showGrid, showRulers, viewportMode, unitSystem, snapToGuides, guides } = state;
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const zoomScale = zoom / 100;

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
       setMouseCoords({
          x: Math.round((e.clientX - rect.left - pan.x - (rect.width/2)) / zoomScale),
          y: Math.round((e.clientY - rect.top - pan.y - (rect.height/2)) / zoomScale)
       });
    }
  };

  const addGuide = (g: Omit<Guide, 'id'>) => {
    const id = `g-${Date.now()}`;
    onUpdateState({ guides: [...guides, { ...g, id }] });
  };

  const updateGuide = (id: string, pos: number) => {
    onUpdateState({ guides: guides.map(g => g.id === id ? { ...g, position: pos } : g) });
  };

  const deleteGuide = (id: string) => {
    onUpdateState({ guides: guides.filter(g => g.id !== id) });
  };

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 bg-obsidian-950 overflow-hidden select-none flex flex-col grain-layer grain-1 ${showGrid ? 'canvas-grid' : ''}`}
      onPointerMove={handlePointerMove}
      style={{ touchAction: 'none' }}
    >
      {showRulers && (
        <Rulers 
           zoom={zoom} pan={pan} 
           viewportMode={viewportMode} 
           unitSystem={unitSystem}
           onSetUnitSystem={(u) => onUpdateState({ unitSystem: u })}
           snapEnabled={snapToGuides}
           onToggleSnap={() => onUpdateState({ snapToGuides: !snapToGuides })}
           guides={guides}
           onAddGuide={addGuide}
           onUpdateGuide={updateGuide}
           onDeleteGuide={deleteGuide}
           onClearGuides={() => onUpdateState({ guides: [] })}
           onSwitchViewport={() => onUpdateState({ viewportMode: viewportMode === ViewportMode.SVG_2D ? ViewportMode.PERSPECTIVE_3D : ViewportMode.SVG_2D })}
           onResetOrigin={() => onUpdateState({ pan: { x: 0, y: 0 }, zoom: 100 })}
        />
      )}

      <div className="absolute bottom-6 right-6 z-[160] flex items-center gap-6 px-5 py-2.5 bg-obsidian-900 border border-white/[0.01] rounded-xi shadow-2xl pointer-events-none transition-all grain-layer grain-2">
         <div className="flex flex-col relative z-10">
            <span className="text-[6px] font-mono text-obsidian-300 uppercase tracking-widest italic opacity-60">LOC_X</span>
            <span className="text-[10px] font-mono text-primary font-bold italic">{mouseCoords.x.toString().padStart(4, '0')}</span>
         </div>
         <div className="w-px h-3 bg-white/[0.02] relative z-10"></div>
         <div className="flex flex-col relative z-10">
            <span className="text-[6px] font-mono text-obsidian-300 uppercase tracking-widest italic opacity-60">LOC_Y</span>
            <span className="text-[10px] font-mono text-primary font-bold italic">{mouseCoords.y.toString().padStart(4, '0')}</span>
         </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <div 
          className="relative transition-all duration-1000 preserve-3d"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomScale}) ${viewportMode === ViewportMode.PERSPECTIVE_3D ? 'rotateX(35deg) rotateZ(-12deg)' : 'none'}` }}
        >
          <div 
            className="bg-obsidian-850 relative shadow-[0_40px_120px_-20px_rgba(0,0,0,1)] border border-white/[0.02] overflow-hidden rounded-xi grain-layer grain-3"
            style={{ width: 'var(--xi-artboard-size)', height: 'var(--xi-artboard-size)' }}
          >
            <svg viewBox="0 0 512 512" className={`w-full h-full transition-all duration-700 relative z-10 ${isGenerating ? 'blur-3xl opacity-20' : ''}`}>
                {layers.map(layer => (
                  <g key={layer.id} onClick={() => onSelectLayer(layer.id)} className="cursor-pointer">
                    <path 
                      d={serializePath(layer.nodes)} 
                      fill={layer.color} 
                      stroke={layer.id === selectedLayerId ? '#b8860b' : layer.stroke} 
                      strokeWidth={layer.id === selectedLayerId ? 1.5 : 0.5}
                      opacity={layer.opacity}
                    />
                  </g>
                ))}
            </svg>
            
            {isGenerating && (
              <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                 <div className="h-full w-px bg-primary/20 absolute left-1/2 -translate-x-1/2 animate-[scanning_4s_linear_infinite]"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
