
import React, { useState } from 'react';
import { ViewportType, CameraState } from '../types';

interface SovereignViewProps {
  id: string;
  type: ViewportType;
  children: React.ReactNode;
  isFocused?: boolean;
  onFocus?: () => void;
  onClose?: () => void;
  onSplit?: (direction: 'HORIZONTAL' | 'VERTICAL') => void;
  onPop?: () => void;
  onTypeChange?: (type: ViewportType) => void;
  onLayoutQuad?: () => void;
  camera: CameraState;
  onCameraChange: (cam: Partial<CameraState>) => void;
}

const PRODUCTION_VIEW_OPTIONS: { type: ViewportType | 'QUAD_GRID', label: string, icon: string, desc: string }[] = [
  { type: 'PERSPECTIVE', label: 'PERSPECTIVE_3D', icon: 'view_in_ar', desc: 'Free-orbit orbital navigation' },
  { type: 'CANVAS_2D', label: '2D_ARTBOARD', icon: 'polyline', desc: 'Standard 2D vector substrate' },
  { type: 'NODE_GRAPH', label: 'LOGIC_SCHEMATIC', icon: 'account_tree', desc: 'Visual logic node-graph' },
  { type: 'QUAD_GRID', label: 'QUAD_VIEW_GRID', icon: 'grid_view', desc: 'Standard 4-way projection grid' },
  { type: 'ORTHO_TOP', label: 'TOP_ORTHO_XY', icon: 'grid_view', desc: 'Planar top-down projection' },
  { type: 'ORTHO_FRONT', label: 'FRONT_ORTHO_XZ', icon: 'grid_view', desc: 'Planar front projection' },
  { type: 'ORTHO_SIDE', label: 'SIDE_ORTHO_YZ', icon: 'grid_view', desc: 'Planar side projection' }
];

const SovereignView: React.FC<SovereignViewProps> = ({ 
  id, type, children, isFocused, onFocus, onTypeChange, onLayoutQuad, onSplit, onPop, onClose 
}) => {
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

  return (
    <div 
      className={`flex-1 flex flex-col overflow-hidden border transition-all duration-300 relative group min-w-0 min-h-0 ${isFocused ? 'bg-obsidian-900 border-primary/40' : 'bg-obsidian-950 border-white/[0.03]'}`}
      onPointerDown={onFocus}
    >
      {/* MINIMALIST INDUSTRIAL VIEWPORT HEADER */}
      <div className={`h-8 shrink-0 border-b border-white/5 flex items-center justify-between px-2 select-none relative z-[350] ${isFocused ? 'bg-obsidian-850' : 'bg-obsidian-950'}`}>
        <div className="flex items-center gap-1 relative">
           <button 
            onClick={(e) => { e.stopPropagation(); setIsViewDropdownOpen(!isViewDropdownOpen); }}
            className={`flex items-center gap-2 px-2 h-6 rounded hover:bg-white/5 transition-all ${isViewDropdownOpen ? 'bg-white/10 text-white' : 'text-obsidian-400'}`}
           >
              <div className={`size-1 rounded-full transition-shadow duration-500 ${isFocused ? 'bg-primary shadow-[0_0_10px_var(--xi-accent)]' : 'bg-obsidian-700'}`}></div>
              <span className="text-[7px] font-black uppercase tracking-[0.2em] italic leading-none">{type.replace(/_/g, ' ')}</span>
              <span className="material-symbols-outlined !text-[10px] opacity-40">expand_more</span>
           </button>

           {isViewDropdownOpen && (
             <div className="absolute top-7 left-0 w-60 bg-obsidian-850 border border-white/10 rounded-lg xi-backlit py-1 z-[400] backdrop-blur-2xl animate-in slide-in-from-top-1 duration-200">
               <span className="px-3 py-1.5 text-[6px] font-black text-obsidian-600 uppercase tracking-[0.4em] block italic border-b border-white/5 mb-1">PROD_LENS_STACK</span>
               {PRODUCTION_VIEW_OPTIONS.map((opt) => (
                 <button 
                  key={opt.label}
                  onClick={(e) => { e.stopPropagation(); opt.type === 'QUAD_GRID' ? onLayoutQuad?.() : onTypeChange?.(opt.type as ViewportType); setIsViewDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-all group ${type === opt.type ? 'bg-primary text-black' : 'text-obsidian-400 hover:bg-white/5'}`}
                 >
                   <span className="material-symbols-outlined text-[14px] opacity-40 group-hover:opacity-100">{opt.icon}</span>
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest leading-none">{opt.label}</span>
                   </div>
                 </button>
               ))}
             </div>
           )}
        </div>

        {/* COMPACT ACTION CLUSTER */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
           <button onClick={() => onSplit?.('VERTICAL')} title="Split V" className="size-6 flex items-center justify-center text-obsidian-500 hover:text-white transition-all">
              <span className="material-symbols-outlined !text-[12px]">vertical_split</span>
           </button>
           <button onClick={() => onSplit?.('HORIZONTAL')} title="Split H" className="size-6 flex items-center justify-center text-obsidian-500 hover:text-white transition-all rotate-90">
              <span className="material-symbols-outlined !text-[12px]">vertical_split</span>
           </button>
           <button onClick={onPop} title="DETACH / POP INTO NEW WINDOW" className="size-6 flex items-center justify-center text-obsidian-500 hover:text-primary transition-all">
              <span className="material-symbols-outlined !text-[14px]">open_in_new</span>
           </button>
           <div className="w-px h-3 bg-white/10 mx-1"></div>
           <button onClick={onClose} title="Close View" className="size-6 flex items-center justify-center text-obsidian-500 hover:text-red-500 transition-all">
              <span className="material-symbols-outlined !text-[14px]">close</span>
           </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-obsidian-950/20 z-[100]">
        {children}
      </div>
    </div>
  );
};

export default SovereignView;
