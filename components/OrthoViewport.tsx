
import React, { useRef } from 'react';
import { AppState, CameraState } from '../types';

interface OrthoViewportProps {
  state: AppState;
  axis: 'TOP' | 'SIDE' | 'FRONT';
  camera: CameraState;
  onCameraChange: (cam: Partial<CameraState>) => void;
}

const OrthoViewport: React.FC<OrthoViewportProps> = ({ state, axis, camera, onCameraChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const labels = {
    TOP: { title: 'TOP_ORTHO_XY', x: 'X-WORLD', y: 'Y-WORLD' },
    SIDE: { title: 'SIDE_ORTHO_YZ', x: 'Y-WORLD', y: 'Z-WORLD' },
    FRONT: { title: 'FRONT_ORTHO_XZ', x: 'X-WORLD', y: 'Z-WORLD' },
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };

    if (e.buttons === 2 || e.buttons === 4) { // Right/Middle click Pan
       onCameraChange({ 
         offset: { x: camera.offset.x + dx, y: camera.offset.y + dy } 
       });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    onCameraChange({ zoom: Math.max(0.1, Math.min(10, camera.zoom * delta)) });
  };

  return (
    <div 
      className="absolute inset-0 bg-obsidian-950 overflow-hidden select-none flex flex-col grain-layer grain-1 canvas-grid"
      onPointerDown={(e) => { isDragging.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; }}
      onPointerUp={() => isDragging.current = false}
      onPointerMove={handlePointerMove}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Top Label - Screenshot 1 Parity */}
      <div className="absolute top-6 left-6 z-[100] px-4 py-1.5 bg-black border-2 border-white/20 rounded shadow-2xl">
         <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">{labels[axis].title}</span>
      </div>

      {/* Axis Mapping readout - Screenshot 1 Parity */}
      <div className="absolute bottom-6 left-6 z-[100] flex flex-col gap-1.5">
         <span className="text-[7px] font-black text-obsidian-600 uppercase tracking-[0.4em] leading-none italic">AXIS_MAPPING</span>
         <div className="flex items-center gap-6">
            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">{labels[axis].x}</span>
            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">{labels[axis].y}</span>
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden">
         <div 
          className="size-[800px] border border-white/5 relative bg-obsidian-900 shadow-inner transition-transform duration-75"
          style={{ transform: `translate(${camera.offset.x}px, ${camera.offset.y}px) scale(${camera.zoom})` }}
         >
            <div className="absolute inset-0 canvas-grid opacity-10"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-48 border-2 border-primary/20 rounded flex items-center justify-center">
                   <span className="material-symbols-outlined text-[48px] text-primary/10 font-black">grid_4x4</span>
                </div>
            </div>
         </div>
      </div>

      {/* Telemetry Corner Bolts */}
      <div className="absolute top-0 right-0 size-6 border-b border-l border-white/5 opacity-40"></div>
      <div className="absolute bottom-0 left-0 size-6 border-t border-r border-white/5 opacity-40"></div>
    </div>
  );
};

export default OrthoViewport;
