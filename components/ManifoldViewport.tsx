
import React, { useState, useEffect } from 'react';
import { AppState, ViewportMode } from '../types';
import Canvas from './Canvas';
import PerspectiveViewport from './PerspectiveViewport';
import OrthoViewport from './OrthoViewport';
import { viewportMappingService } from '../services/viewportMappingService';

interface ManifoldViewportProps {
  state: AppState;
  onUpdateState: (patch: Partial<AppState>) => void;
}

const ManifoldViewport: React.FC<ManifoldViewportProps> = ({ state, onUpdateState }) => {
  const [isQuadView, setIsQuadView] = useState(true);

  // Hardening: Auto-sync all viewports on mount using unified service
  useEffect(() => {
    if (isQuadView) {
      const syncPatch = viewportMappingService.mapAllViewports(state);
      onUpdateState(syncPatch);
    }
  }, [isQuadView]);

  if (!isQuadView) {
    return (
      <div className="flex-1 relative bg-obsidian-950">
        <Canvas state={state} onUpdateState={onUpdateState} onSelectLayer={() => {}} />
        <button 
          onClick={() => setIsQuadView(true)}
          className="absolute top-4 right-4 z-[500] px-4 py-2 bg-primary/10 border border-primary/40 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
        >
          Enable_Quad_Manifold
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-px bg-obsidian-800 animate-in fade-in duration-700">
      {/* PERSPECTIVE (QUAD I) */}
      <div className="relative border border-white/5 bg-obsidian-950 overflow-hidden group">
         <PerspectiveViewport state={state} label="MASTER_PERSPECTIVE" />
         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[7px] font-mono text-primary uppercase bg-black/60 px-2 py-1 rounded">SYNC_ACTIVE // 0x84</span>
         </div>
      </div>

      {/* TOP ORTHO (QUAD II) */}
      <div className="relative border border-white/5 bg-obsidian-950 overflow-hidden group">
         <OrthoViewport state={state} axis="TOP" />
         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[7px] font-mono text-cyan-500 uppercase bg-black/60 px-2 py-1 rounded">ORTHO_XY</span>
         </div>
      </div>

      {/* SIDE ORTHO (QUAD III) */}
      <div className="relative border border-white/5 bg-obsidian-950 overflow-hidden group">
         <OrthoViewport state={state} axis="SIDE" />
         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[7px] font-mono text-amber-500 uppercase bg-black/60 px-2 py-1 rounded">ORTHO_YZ</span>
         </div>
      </div>

      {/* FRONT ORTHO (QUAD IV) */}
      <div className="relative border border-white/5 bg-obsidian-950 overflow-hidden group">
         <OrthoViewport state={state} axis="FRONT" />
         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button 
              onClick={() => setIsQuadView(false)}
              className="px-2 py-1 bg-primary/20 text-primary border border-primary/40 rounded text-[7px] font-black uppercase"
            >
              Expand
            </button>
            <span className="text-[7px] font-mono text-emerald-500 uppercase bg-black/60 px-2 py-1 rounded">ORTHO_XZ</span>
         </div>
      </div>

      {/* CENTRAL GIZMO CROSSHAIR */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
         <div className="size-1 bg-primary rounded-full shadow-[0_0_15px_var(--xi-accent)]"></div>
         <div className="absolute h-px w-32 bg-primary/20"></div>
         <div className="absolute w-px h-32 bg-primary/20"></div>
      </div>
    </div>
  );
};

export default ManifoldViewport;
