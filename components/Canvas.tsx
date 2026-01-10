
import React, { useRef, useState } from 'react';
import { AppState, VectorNode, ViewportMode, VectorLayer } from '../types';

interface CanvasProps {
  state: AppState;
  onUpdateState: (patch: Partial<AppState>) => void;
  onSelectLayer: (id: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ state, onUpdateState, onSelectLayer }) => {
  const { layers, isGenerating, selectedLayerId, zoom, pan, activeTool } = state;
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  const getCanvasCoords = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const zoomScale = zoom / 100;
    return {
      x: Math.round((clientX - rect.left - pan.x - (rect.width/2)) / zoomScale),
      y: Math.round((clientY - rect.top - pan.y - (rect.height/2)) / zoomScale)
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    setMouseCoords(coords);
    if (e.buttons === 2 || e.buttons === 4) { // Pan logic (Right or Middle)
       onUpdateState({ pan: { x: pan.x + e.movementX, y: pan.y + e.movementY } });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    onUpdateState({ zoom: Math.max(10, Math.min(800, zoom * delta)) });
  };

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 bg-obsidian-950 overflow-hidden select-none flex flex-col grain-layer grain-1 canvas-grid cursor-crosshair`}
      onPointerMove={handlePointerMove}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute top-6 left-6 z-[100] px-4 py-1.5 bg-black border-2 border-white/20 rounded shadow-2xl">
         <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">PRODUCTION_ARTBOARD_2D</span>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        <div 
          className="relative transition-transform duration-75"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})` }}
        >
          {/* Professional Printing Standards */}
          <div className="absolute -inset-10 border border-red-600/30 rounded-sm pointer-events-none">
             <span className="absolute -top-6 left-0 text-[6px] font-mono text-red-500/60 uppercase tracking-widest italic">BLEED_PROTOCOL_3MM</span>
          </div>

          <div className="bg-[#08090a] relative shadow-[0_40px_150px_-20px_rgba(0,0,0,1)] border border-white/5 overflow-hidden rounded-xi w-[512px] h-[512px]">
            <div className="absolute inset-10 border border-dashed border-cyan-500/10 pointer-events-none z-20">
               <span className="absolute -top-4 right-0 text-[6px] font-mono text-cyan-500/40 uppercase tracking-widest italic">SAFE_MARGIN_INNER</span>
            </div>

            <svg viewBox="0 0 512 512" className={`size-full relative z-10 transition-opacity ${isGenerating ? 'blur-md opacity-40' : ''}`}>
                <defs>
                   <filter id="layer-glow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                   </filter>
                </defs>
                {layers.map(layer => (
                  <g key={layer.id} onClick={(e) => { e.stopPropagation(); onSelectLayer(layer.id); }} className="cursor-pointer">
                    <rect 
                      x="100" y="100" width="312" height="312"
                      fill={layer.color} 
                      fillOpacity={layer.opacity}
                      stroke={selectedLayerId === layer.id ? 'var(--xi-accent)' : 'transparent'}
                      strokeWidth={selectedLayerId === layer.id ? '4' : '0'}
                      filter={selectedLayerId === layer.id ? 'url(#layer-glow)' : 'none'}
                    />
                    {selectedLayerId === layer.id && (
                       <rect x="98" y="98" width="316" height="316" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="4 2" className="animate-pulse" />
                    )}
                  </g>
                ))}
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-[160] flex items-center gap-6 px-6 py-2.5 bg-obsidian-900 border border-white/10 rounded shadow-2xl backdrop-blur-md">
         <div className="flex flex-col">
            <span className="text-[6px] font-mono text-obsidian-600 uppercase tracking-widest leading-none mb-1.5 font-bold italic">POS_X</span>
            <span className="text-[12px] font-mono text-primary font-bold italic tracking-tighter tabular-nums leading-none">{(mouseCoords.x || 0).toString().padStart(4, '0')}</span>
         </div>
         <div className="w-px h-6 bg-white/10"></div>
         <div className="flex flex-col">
            <span className="text-[6px] font-mono text-obsidian-600 uppercase tracking-widest leading-none mb-1.5 font-bold italic">POS_Y</span>
            <span className="text-[12px] font-mono text-primary font-bold italic tracking-tighter tabular-nums leading-none">{(mouseCoords.y || 0).toString().padStart(4, '0')}</span>
         </div>
      </div>
    </div>
  );
};

export default Canvas;
