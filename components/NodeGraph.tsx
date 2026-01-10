
import React, { useState } from 'react';

interface Node {
  id: string;
  type: string;
  x: number;
  y: number;
  label: string;
}

interface Connection {
  from: string;
  to: string;
}

const NodeGraph: React.FC = () => {
  const [nodes] = useState<Node[]>([
    { id: '1', type: 'KERNEL', x: 100, y: 100, label: 'Vector_Input_0x' },
    { id: '2', type: 'MODIFIER', x: 400, y: 150, label: 'Warp_Noise_V3' },
    { id: '3', type: 'OUTPUT', x: 700, y: 120, label: 'Manifest_Export' },
  ]);

  return (
    <div className="flex-1 bg-obsidian-200 relative overflow-hidden canvas-grid p-8 animate-in fade-in duration-700">
      {/* GRAPH HEADER */}
      <div className="absolute top-6 left-6 z-10 flex gap-4">
         <div className="px-4 py-2 bg-black/60 border border-white/10 rounded-xl backdrop-blur-md flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-sm">hub</span>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Logic_Forge_Active</span>
         </div>
      </div>

      {/* SVG CONNECTOR LAYER */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full">
         <path d="M 220 120 C 310 120, 310 170, 400 170" stroke="#FF9800" strokeWidth="2" fill="none" className="opacity-40" />
         <path d="M 520 170 C 610 170, 610 140, 700 140" stroke="#FF9800" strokeWidth="2" fill="none" className="opacity-40" />
      </svg>

      {/* NODES */}
      {nodes.map(node => (
        <div 
          key={node.id}
          style={{ left: node.x, top: node.y }}
          className="absolute w-48 bg-obsidian-100 border border-white/10 rounded-2xl p-4 shadow-2xl group hover:border-primary/50 transition-all cursor-move"
        >
           <div className="flex justify-between items-center mb-3">
              <span className="text-[7px] font-mono text-obsidian-600 uppercase">{node.type}</span>
              <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
           </div>
           <h4 className="text-[10px] font-black text-white uppercase tracking-tight mb-4">{node.label}</h4>
           
           <div className="space-y-2">
              <div className="flex items-center justify-between text-[6px] font-mono text-obsidian-700">
                 <span>IN_PORT_A</span>
                 <div className="size-2 rounded-full border border-white/20 bg-black"></div>
              </div>
              <div className="flex items-center justify-between text-[6px] font-mono text-obsidian-700">
                 <span>OUT_PORT_B</span>
                 <div className="size-2 rounded-full border border-primary/50 bg-primary shadow-[0_0_5px_orange]"></div>
              </div>
           </div>
        </div>
      ))}

      {/* FOOTER CONTROLS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 border border-white/10 rounded-2xl px-8 py-3 backdrop-blur-xl flex items-center gap-8">
         <button className="flex items-center gap-3 text-[9px] font-black text-obsidian-500 hover:text-white transition-all uppercase tracking-widest">
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            Add_Kernel
         </button>
         <div className="h-4 w-px bg-white/10"></div>
         <button className="flex items-center gap-3 text-[9px] font-black text-primary hover:text-white transition-all uppercase tracking-widest">
            <span className="material-symbols-outlined text-[18px]">play_circle</span>
            Compute_Graph
         </button>
      </div>
    </div>
  );
};

export default NodeGraph;
