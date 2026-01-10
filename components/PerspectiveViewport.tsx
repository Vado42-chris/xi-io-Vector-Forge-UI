
import React, { useState, useRef, useEffect } from 'react';
import { AppState, CameraState } from '../types';

interface PerspectiveViewportProps {
  state: AppState;
  camera: CameraState;
  onCameraChange: (cam: Partial<CameraState>) => void;
  label?: string;
}

const PerspectiveViewport: React.FC<PerspectiveViewportProps> = ({ state, camera, onCameraChange, label = "MASTER_PERSPECTIVE" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };

    if (e.buttons === 2) { // Right Click: Orbit
       onCameraChange({ 
         yaw: camera.yaw + dx * 0.5, 
         pitch: Math.max(5, Math.min(85, camera.pitch - dy * 0.5)) 
       });
    } else if (e.buttons === 4) { // Middle Click: Pan
       onCameraChange({ 
         offset: { x: camera.offset.x + dx, y: camera.offset.y + dy } 
       });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    onCameraChange({ zoom: Math.max(0.1, Math.min(5, camera.zoom * delta)) });
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 bg-obsidian-950 overflow-hidden select-none flex flex-col grain-layer grain-1 canvas-grid"
      onPointerDown={(e) => { isDragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; }}
      onPointerUp={() => isDragging.current = false}
      onPointerLeave={() => isDragging.current = false}
      onPointerMove={handlePointerMove}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 3D GIZMO HUD - Screenshot 1 Parity */}
      <div className="absolute top-6 left-6 z-[100] flex flex-col gap-3">
         <div className="px-4 py-1.5 bg-black border-2 border-white/20 rounded shadow-2xl">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">{label}</span>
         </div>
      </div>

      {/* Axis Mapping - Screenshot 1 Parity */}
      <div className="absolute bottom-6 right-6 z-[100] flex items-center gap-8 px-6 py-2.5 bg-obsidian-900 border border-white/10 rounded shadow-2xl backdrop-blur-md">
         <div className="flex items-center gap-3">
            <div className="size-2 rounded-full bg-red-500 shadow-[0_0_8px_red]"></div>
            <span className="text-[8px] font-mono text-obsidian-400 font-bold uppercase tracking-widest">X_AXIS</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_green]"></div>
            <span className="text-[8px] font-mono text-obsidian-400 font-bold uppercase tracking-widest">Y_AXIS</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="size-2 rounded-full bg-blue-500 shadow-[0_0_8px_blue]"></div>
            <span className="text-[8px] font-mono text-obsidian-400 font-bold uppercase tracking-widest">Z_AXIS</span>
         </div>
      </div>

      {/* Renders simulated perspective using CSS-3D Transforms */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden preserve-3d perspective-[1200px]">
         <div 
           className="w-[1200px] h-[1200px] border border-white/5 relative transition-transform duration-75"
           style={{ 
             transform: `translate(${camera.offset.x}px, ${camera.offset.y}px) scale(${camera.zoom}) rotateX(${camera.pitch}deg) rotateZ(${camera.yaw}deg)`, 
             transformStyle: 'preserve-3d' 
           }}
         >
            <div className="absolute inset-0 canvas-grid opacity-10"></div>
            
            {/* World Origin Gizmo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-40 border border-primary/20 rounded flex items-center justify-center">
               <span className="material-symbols-outlined text-[64px] text-primary/10 font-black">grid_4x4</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PerspectiveViewport;
