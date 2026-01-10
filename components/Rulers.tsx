
import React, { useState, useRef } from 'react';
import { ViewportMode, UnitSystem, Guide } from '../types';

interface RulersProps {
  zoom: number;
  pan: { x: number, y: number };
  viewportMode: ViewportMode;
  unitSystem: UnitSystem;
  onSetUnitSystem: (u: UnitSystem) => void;
  onToggleSnap: () => void;
  snapEnabled: boolean;
  guides: Guide[];
  onAddGuide: (guide: Omit<Guide, 'id'>) => void;
  onUpdateGuide: (id: string, pos: number) => void;
  onDeleteGuide: (id: string) => void;
  onClearGuides: () => void;
  onSwitchViewport: () => void;
  onResetOrigin: () => void;
}

const Rulers: React.FC<RulersProps> = ({ 
  zoom, pan, viewportMode, unitSystem, onToggleSnap, snapEnabled, guides, 
  onAddGuide, onUpdateGuide, onDeleteGuide, onResetOrigin 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);
  const [isHoveringDeleteArea, setIsHoveringDeleteArea] = useState(false);
  
  const zoomScale = zoom / 100;
  const SNAP_INTERVAL = 10;
  const RULER_SIZE = 32;
  
  const getPosFromEvent = (axis: 'x' | 'y' | 'z' | 'p', e: PointerEvent) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const isXCoord = axis === 'x' || axis === 'z';
    const offset = isXCoord 
      ? (e.clientX - rect.left - (rect.width / 2) - pan.x) 
      : (e.clientY - rect.top - (rect.height / 2) - pan.y);
    
    let pos = offset / zoomScale;
    if (snapEnabled) {
      pos = Math.round(pos / SNAP_INTERVAL) * SNAP_INTERVAL;
    }
    return Math.round(pos);
  };

  const handleRulerPointerDown = (axis: 'x' | 'y', e: React.PointerEvent) => {
    e.preventDefault();
    const pos = getPosFromEvent(axis, e.nativeEvent);
    onAddGuide({ axis, position: pos, locked: false });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleGuidePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setActiveGuideId(id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeGuideId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const guide = guides.find(g => g.id === activeGuideId);
    if (!guide) return;
    
    const inDeleteZone = 
      e.clientX < rect.left + RULER_SIZE || 
      e.clientX > rect.right - RULER_SIZE || 
      e.clientY < rect.top + RULER_SIZE || 
      e.clientY > rect.bottom - RULER_SIZE;
      
    setIsHoveringDeleteArea(inDeleteZone);
    const pos = getPosFromEvent(guide.axis, e.nativeEvent);
    onUpdateGuide(activeGuideId, pos);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!activeGuideId) return;
    if (isHoveringDeleteArea) onDeleteGuide(activeGuideId);
    setActiveGuideId(null);
    setIsHoveringDeleteArea(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const axisLabels = {
    [ViewportMode.SVG_2D]: { x: 'X-SPATIAL', y: 'Y-SPATIAL' },
    [ViewportMode.PERSPECTIVE_3D]: { x: 'X-WORLD', y: 'Y-WORLD' }
  }[viewportMode] || { x: 'X', y: 'Y' };

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-[120] select-none ${activeGuideId && isHoveringDeleteArea ? 'cursor-no-drop' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* QUADRANT I: TOP-LEFT (ORIGIN & SNAP) */}
      <div className="absolute top-0 left-0 size-8 bg-obsidian-900 border-r border-b border-white/10 z-[160] flex items-center justify-center">
        <button 
          onMouseDown={onResetOrigin}
          onContextMenu={(e) => { e.preventDefault(); onToggleSnap(); }}
          className={`pointer-events-auto size-full flex items-center justify-center transition-all ${snapEnabled ? 'text-primary shadow-[0_0_10px_var(--xi-accent)]' : 'text-obsidian-600 hover:text-obsidian-200'}`}
          title="L-Click: Reset Viewport Origin | R-Click: Toggle Magnetism (Snap)"
        >
          <span className="material-symbols-outlined !text-[16px]">{snapEnabled ? 'grid_guides' : 'filter_center_focus'}</span>
        </button>
      </div>

      {/* QUADRANT II: TOP-RIGHT (AXIS READOUT) */}
      <div className="absolute top-0 right-0 size-8 bg-obsidian-900 border-l border-b border-white/10 z-[160] flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity" title="Horizontal Axis Telemetry">
        <span className="text-[7px] font-black text-primary italic uppercase rotate-90">{axisLabels.y.split('-')[0]}</span>
      </div>

      {/* QUADRANT III: BOTTOM-LEFT (Y-LABEL) */}
      <div className="absolute bottom-0 left-0 size-8 bg-obsidian-900 border-r border-t border-white/10 z-[160] flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity" title="Vertical Axis Telemetry">
        <span className="text-[7px] font-black text-primary italic uppercase">{axisLabels.x.split('-')[0]}</span>
      </div>

      {/* QUADRANT IV: BOTTOM-RIGHT (SHARD TAG) */}
      <div className="absolute bottom-0 right-0 size-8 bg-obsidian-900 border-l border-t border-white/10 z-[160] flex items-center justify-center" title="Shard System Node">
        <div className="size-1 rounded-full bg-primary/40 animate-pulse shadow-[0_0_5px_var(--xi-accent)]"></div>
      </div>

      {/* TOP RULER (X-BAR) */}
      <div 
        onPointerDown={(e) => handleRulerPointerDown('y', e)}
        className="pointer-events-auto absolute top-0 left-8 right-8 h-8 bg-obsidian-950 border-b border-white/10 flex items-center cursor-ns-resize group z-[130] overflow-hidden"
      >
        <div className="absolute left-1/2 flex items-end h-full" style={{ transform: `translateX(${pan.x}px)` }}>
          {Array.from({ length: 61 }).map((_, i) => (
            <div key={i} className="absolute bottom-0 flex flex-col items-center" style={{ left: `${(i - 30) * 100 * zoomScale}px` }}>
              <div className={`w-px ${i === 30 ? 'h-5 bg-primary/60 shadow-[0_0_5px_orange]' : 'h-2.5 bg-obsidian-700'}`}></div>
              <span className="text-[6px] font-mono text-obsidian-600 absolute bottom-4">{(i - 30) * 100}</span>
            </div>
          ))}
        </div>
        <span className="absolute left-4 text-[7px] font-black text-obsidian-500 tracking-[0.2em] italic uppercase group-hover:text-primary transition-colors">{axisLabels.y}</span>
      </div>

      {/* LEFT RULER (Y-BAR) */}
      <div 
        onPointerDown={(e) => handleRulerPointerDown('x', e)}
        className="pointer-events-auto absolute top-8 left-0 bottom-8 w-8 bg-obsidian-950 border-r border-white/10 flex flex-col items-center cursor-ew-resize group z-[130] overflow-hidden"
      >
        <div className="absolute top-1/2 flex flex-col items-end w-full" style={{ transform: `translateY(${pan.y}px)` }}>
          {Array.from({ length: 61 }).map((_, i) => (
            <div key={i} className="absolute right-0 flex items-center" style={{ top: `${(i - 30) * 100 * zoomScale}px` }}>
              <div className={`h-px ${i === 30 ? 'w-5 bg-primary/60 shadow-[0_0_5px_orange]' : 'w-2.5 bg-obsidian-700'}`}></div>
              <span className="text-[6px] font-mono text-obsidian-600 absolute right-4 transform rotate-[-90deg]">{(i - 30) * 100}</span>
            </div>
          ))}
        </div>
        <span className="absolute top-4 text-[7px] font-black text-obsidian-500 tracking-[0.2em] italic rotate-[-90deg] translate-y-12 uppercase group-hover:text-primary transition-colors">{axisLabels.x}</span>
      </div>

      {/* GUIDES OVERLAY */}
      <svg className="absolute inset-0 size-full pointer-events-none overflow-visible z-[140]">
        <defs>
          <filter id="guide-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {guides.map(g => {
          if (!containerRef.current) return null;
          const rect = containerRef.current.getBoundingClientRect();
          const isVertical = g.axis === 'x';
          const pos = isVertical 
            ? g.position * zoomScale + pan.x + (rect.width / 2)
            : g.position * zoomScale + pan.y + (rect.height / 2);

          const isDragging = activeGuideId === g.id;
          const color = isDragging 
            ? (isHoveringDeleteArea ? '#ef4444' : '#b8860b') 
            : 'rgba(184, 134, 11, 0.4)';

          return (
            <React.Fragment key={g.id}>
              <line 
                x1={isVertical ? pos : 0}
                y1={isVertical ? 0 : pos}
                x2={isVertical ? pos : '100%'}
                y2={isVertical ? '100%' : pos}
                stroke="transparent"
                strokeWidth="12"
                className="pointer-events-auto cursor-move"
                onPointerDown={(e) => handleGuidePointerDown(g.id, e)}
              />
              <line 
                x1={isVertical ? pos : 0}
                y1={isVertical ? 0 : pos}
                x2={isVertical ? pos : '100%'}
                y2={isVertical ? '100%' : pos}
                stroke={color}
                strokeWidth={isDragging ? "1.5" : "0.5"}
                strokeDasharray={isDragging ? "none" : "6 4"}
                filter={isDragging ? "url(#guide-glow)" : "none"}
                className="transition-all duration-75"
              />
              {isDragging && !isHoveringDeleteArea && (
                <foreignObject x={isVertical ? pos + 10 : 40} y={isVertical ? 40 : pos + 10} width="100" height="40" className="overflow-visible">
                  <div className="bg-primary text-black px-2 py-1 rounded text-[10px] font-mono font-black italic shadow-2xl border border-white/20 whitespace-nowrap inline-block animate-in fade-in zoom-in-95 duration-150">
                    {g.axis.toUpperCase()}: {Math.round(g.position)}PX
                  </div>
                </foreignObject>
              )}
            </React.Fragment>
          );
        })}
      </svg>
    </div>
  );
};

export default Rulers;
