
import React from 'react';

interface PowerUserToolbarProps {
  snapToGrid: boolean;
  showGrid: boolean;
  setSnap: (v: boolean) => void;
  setGrid: (v: boolean) => void;
  zoom: number;
  setZoom: (z: number) => void;
}

const PowerUserToolbar: React.FC<PowerUserToolbarProps> = ({ snapToGrid, showGrid, setSnap, setGrid, zoom, setZoom }) => {
  return (
    <div className="h-10 shrink-0 bg-obsidian-100 border-b border-white/5 flex items-center justify-between px-4 z-40">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5">
          <button onClick={() => setSnap(!snapToGrid)} className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${snapToGrid ? 'text-primary' : 'text-obsidian-500 hover:text-white'}`}>
             <span className="material-symbols-outlined text-[16px]">{snapToGrid ? 'grid_guides' : 'grid_off'}</span>
             <span className="text-[9px] font-black uppercase tracking-widest">Snap</span>
          </button>
          <button onClick={() => setGrid(!showGrid)} className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${showGrid ? 'text-primary' : 'text-obsidian-500 hover:text-white'}`}>
             <span className="material-symbols-outlined text-[16px]">{showGrid ? 'grid_on' : 'grid_off'}</span>
             <span className="text-[9px] font-black uppercase tracking-widest">Grid</span>
          </button>
        </div>
        <div className="w-px h-4 bg-white/5"></div>
        <div className="flex items-center gap-4">
           <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-widest">Grid Units: 10px</span>
           <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-widest">Artboard: 512x512</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setZoom(Math.max(25, zoom - 25))} className="text-obsidian-500 hover:text-white">
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>
        <span className="text-[10px] font-mono font-bold text-primary w-12 text-center">{zoom}%</span>
        <button onClick={() => setZoom(Math.min(400, zoom + 25))} className="text-obsidian-500 hover:text-white">
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
      </div>
    </div>
  );
};

export default PowerUserToolbar;
