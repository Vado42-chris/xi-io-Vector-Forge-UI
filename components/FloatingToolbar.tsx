
import React from 'react';
import { ToolType } from '../types';

interface FloatingToolbarProps {
  activeTool: ToolType;
  setTool: (tool: ToolType) => void;
  onSmartMagic: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ activeTool, setTool, onSmartMagic }) => {
  const toolGroups: {id: ToolType, icon: string, label: string, shortcut: string}[][] = [
    [
      { id: 'select', icon: 'near_me', label: 'Gestalt Select', shortcut: 'V' },
      { id: 'subselect', icon: 'near_me', label: 'Atomic Sub-Select', shortcut: 'A' },
    ],
    [
      { id: 'pencil', icon: 'draw', label: 'Path Forge', shortcut: 'P' },
      { id: 'shape', icon: 'category', label: 'Primitive Builder', shortcut: 'S' },
    ],
    [
      { id: 'pan', icon: 'pan_tool', label: 'Navigation', shortcut: 'H' },
    ]
  ];

  return (
    <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-3 p-2.5 xi-card rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] z-[100] border-white/5 backdrop-blur-3xl">
      {toolGroups.map((group, idx) => (
        <React.Fragment key={idx}>
          <div className="flex flex-col gap-2">
            {group.map(tool => (
              <button 
                key={tool.id}
                onClick={() => setTool(tool.id)}
                className={`size-12 rounded-2xl flex items-center justify-center transition-all relative group ${
                  activeTool === tool.id 
                    ? 'bg-primary text-white xi-popping-glow shadow-[0_10px_25px_var(--xi-vector-glow)]' 
                    : 'text-obsidian-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] font-bold ${tool.id === 'subselect' ? 'rotate-[-45deg] scale-x-[-1]' : ''}`}>
                  {tool.icon}
                </span>
                
                {/* Tooltip */}
                <div className="absolute left-16 px-4 py-2 bg-obsidian-100 border border-white/10 text-[9px] font-black text-white rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap uppercase tracking-widest shadow-2xl flex items-center gap-3">
                  {tool.label}
                  <span className="px-1.5 py-0.5 bg-white/10 rounded text-obsidian-400 font-mono">{tool.shortcut}</span>
                </div>
              </button>
            ))}
          </div>
          {idx < toolGroups.length - 1 && <div className="h-px w-8 bg-white/5 mx-auto"></div>}
        </React.Fragment>
      ))}

      <div className="h-px w-8 bg-white/5 mx-auto my-1"></div>
      
      <button 
        onClick={onSmartMagic}
        className="size-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary via-[#FB8C00] to-[#E65100] text-white shadow-[0_15px_30px_var(--xi-vector-glow)] hover:scale-110 active:scale-95 transition-all relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse opacity-40"></div>
        <span className="material-symbols-outlined text-[22px] relative z-10 font-bold">auto_awesome</span>
      </button>
    </div>
  );
};

export default FloatingToolbar;
