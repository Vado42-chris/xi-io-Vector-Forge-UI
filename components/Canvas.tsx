
import React, { useRef, useEffect, useState } from 'react';
import { ToolType, AppState, VectorNode, VectorLayer } from '../types';
import Rulers from './Rulers';

interface CanvasProps {
  svgContent: string;
  isGenerating: boolean;
  activeTool: ToolType;
  selectedLayerId: string | null;
  selectedNodeId: string | null;
  layers: VectorLayer[];
  onSelectLayer: (id: string) => void;
  onSelectNode: (id: string | null) => void;
  onUpdateNode: (layerId: string, nodeId: string, delta: {x: number, y: number}) => void;
  zoom: number;
  pan: { x: number, y: number };
  onPan: (pan: { x: number, y: number }) => void;
  guides: AppState['guides'];
  onAddGuide: (type: 'h' | 'v', pos: number) => void;
  onUpdateGuide: (id: string, pos: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({ 
  svgContent, isGenerating, activeTool, selectedLayerId, selectedNodeId, layers,
  onSelectLayer, onSelectNode, onUpdateNode, zoom, pan, onPan, guides, onAddGuide, onUpdateGuide
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasViewportRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{ type: 'pan' | 'node' | 'guide', id: string, startX: number, startY: number } | null>(null);
  const zoomScale = zoom / 100;

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    
    // Handle Pan
    if (activeTool === 'pan' || e.button === 1) {
      setDragState({ type: 'pan', id: '', startX: e.clientX, startY: e.clientY });
      target.setPointerCapture(e.pointerId);
      return;
    }

    // Handle Guide selection/drag
    const guideEl = target.closest('[data-guide-id]');
    if (guideEl) {
      const guideId = guideEl.getAttribute('data-guide-id')!;
      setDragState({ type: 'guide', id: guideId, startX: e.clientX, startY: e.clientY });
      target.setPointerCapture(e.pointerId);
      return;
    }

    // Handle Node selection/drag (Sub-selection mode)
    const nodeEl = target.closest('[data-node-id]');
    if (activeTool === 'direct-select' && nodeEl) {
      const nodeId = nodeEl.getAttribute('data-node-id')!;
      onSelectNode(nodeId);
      setDragState({ type: 'node', id: nodeId, startX: e.clientX, startY: e.clientY });
      target.setPointerCapture(e.pointerId);
      return;
    }

    // Handle Object selection
    if ((activeTool === 'select' || activeTool === 'direct-select') && !isGenerating) {
      let current: SVGElement | null = e.target as SVGElement;
      while (current && current.tagName !== 'DIV') {
        if (current.id && current.id !== 'bg' && current.id !== 'workspace_root' && current.tagName !== 'svg') {
          onSelectLayer(current.id);
          if (activeTool !== 'direct-select') onSelectNode(null);
          return;
        }
        current = current.parentElement as unknown as SVGElement;
      }
      onSelectLayer('');
      onSelectNode(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState) return;

    const dx = (e.clientX - dragState.startX) / zoomScale;
    const dy = (e.clientY - dragState.startY) / zoomScale;

    if (dragState.type === 'pan') {
      onPan({ x: pan.x + (e.clientX - dragState.startX), y: pan.y + (e.clientY - dragState.startY) });
      setDragState({ ...dragState, startX: e.clientX, startY: e.clientY });
    } else if (dragState.type === 'node' && selectedLayerId) {
      onUpdateNode(selectedLayerId, dragState.id, { x: dx, y: dy });
      setDragState({ ...dragState, startX: e.clientX, startY: e.clientY });
    } else if (dragState.type === 'guide') {
      const guide = guides.find(g => g.id === dragState.id);
      if (guide) {
        const val = guide.type === 'v' ? dx : dy;
        onUpdateGuide(dragState.id, guide.pos + val);
        setDragState({ ...dragState, startX: e.clientX, startY: e.clientY });
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDragState(null);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const selectedLayerData = layers.find(l => l.id === selectedLayerId);

  return (
    <div 
      ref={containerRef}
      className={`flex-1 relative bg-[var(--xibalba-grey-100)] overflow-hidden flex items-center justify-center canvas-grid select-none cursor-${activeTool === 'pan' ? 'grab' : 'default'} canvas-container-touch`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Rulers zoom={zoom} pan={pan} onAddGuide={(type, pos) => onAddGuide(type, pos)} />

      {/* Interactive Guides */}
      {guides.map((g) => {
        return (
        <div 
          key={g.id}
          data-guide-id={g.id}
          className={`absolute z-[55] cursor-${g.type === 'v' ? 'col-resize' : 'row-resize'} group guide-line ${g.type === 'v' ? 'guide-vertical' : 'guide-horizontal'}`}
          data-guide-type={g.type}
          data-guide-position={g.type === 'v' ? pan.x + g.pos * zoomScale : pan.y + g.pos * zoomScale}
        >
          <div className={`absolute ${g.type === 'v' ? 'left-1/2 h-full w-px border-l' : 'top-1/2 w-full h-px border-t'} border-[var(--xibalba-text-200)] transition-opacity opacity-20 group-hover:opacity-100`}></div>
        </div>
        );
      })}

      <div 
        ref={canvasViewportRef}
        className="bg-[var(--xibalba-grey-050)] relative flex items-center justify-center shadow-[0_80px_200px_-40px_rgba(0,0,0,0.8)] rounded-none overflow-hidden canvas-viewport"
      >
        {/* Gestalt Base */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none canvas-grid-pattern"></div>
        
        <div 
          className={`w-[512px] h-[512px] transition-all duration-500 pointer-events-auto ${isGenerating ? 'opacity-10 blur-xl grayscale' : 'opacity-100'}`}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Selection Bounding Box (Gestalt mode) */}
        {selectedLayerId && activeTool === 'select' && (
          <div className="absolute w-[512px] h-[512px] pointer-events-none border border-[var(--xibalba-text-200)]/50 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
             <div className="absolute -top-1 -left-1 size-2.5 bg-[var(--xibalba-text-200)] border border-[var(--xibalba-text-100)]"></div>
             <div className="absolute -top-1 -right-1 size-2.5 bg-[var(--xibalba-text-200)] border border-[var(--xibalba-text-100)]"></div>
             <div className="absolute -bottom-1 -left-1 size-2.5 bg-[var(--xibalba-text-200)] border border-[var(--xibalba-text-100)]"></div>
             <div className="absolute -bottom-1 -right-1 size-2.5 bg-[var(--xibalba-text-200)] border border-[var(--xibalba-text-100)]"></div>
          </div>
        )}

        {/* Atomic Sub-Selection Handles */}
        {selectedLayerId && activeTool === 'direct-select' && selectedLayerData && selectedLayerData.shape.type === 'path' && (
           <div className="absolute w-[512px] h-[512px] pointer-events-none">
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                 {/* Draw the "Spline Backbone" for clarity */}
                 <path 
                    d={selectedLayerData.shape.nodes.reduce((acc, n, i) => {
                       if (n.type === 'move') return `M ${n.x} ${n.y}`;
                       if (n.type === 'line') return `${acc} L ${n.x} ${n.y}`;
                       if (n.type === 'cubic') return `${acc} C ${n.cx1} ${n.cy1}, ${n.cx2} ${n.cy2}, ${n.x} ${n.y}`;
                       if (n.type === 'close') return `${acc} Z`;
                       return acc;
                    }, '')}
                    fill="none" stroke="var(--xibalba-text-200)" strokeWidth="1" strokeDasharray="4 2" opacity="0.4"
                 />
              </svg>
              {selectedLayerData.shape.nodes.map((node) => (
                <div 
                  key={node.id}
                  data-node-id={node.id}
                  className={`absolute pointer-events-auto cursor-crosshair transition-all hover:scale-150 node-handle ${
                    node.isKinetic ? 'rounded-none border-[2px]' : 'rounded-none border-[1.5px]'
                  } ${selectedNodeId === node.id ? 'bg-[var(--xibalba-text-200)] border-[var(--xibalba-text-000)] scale-125 z-10' : 'bg-[var(--xibalba-text-200)] border-[var(--xibalba-text-100)] opacity-80'}`}
                  ref={(nodeEl) => {
                    if (nodeEl) {
                      nodeEl.style.setProperty('--node-left', `${node.x}px`);
                      nodeEl.style.setProperty('--node-top', `${node.y}px`);
                      nodeEl.style.setProperty('transform', 'translate(-50%, -50%)');
                    }
                  }}
                ></div>
              ))}
           </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center zstack-scanning-overlay bg-[var(--xibalba-grey-100)]/95 backdrop-blur-3xl ai-scanning">
             <div className="size-16 border-[4px] border-[var(--xibalba-text-200)]/20 border-t-[var(--xibalba-text-200)] rounded-none animate-spin"></div>
             <span className="mt-6 text-sm font-black text-[var(--xibalba-text-100)] tracking-[0.5em] uppercase">Kernel Link Active</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
