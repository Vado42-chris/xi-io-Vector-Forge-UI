
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
      { id: 'pen', icon: 'draw', label: 'Path Forge', shortcut: 'P' },
      { id: 'rect', icon: 'rectangle', label: 'Primitive Builder', shortcut: 'S' },
    ],
    [
      { id: 'pan', icon: 'pan_tool', label: 'Navigation', shortcut: 'H' },
    ]
  ];

  return (
    <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col gap-4 p-2 bg-obsidian-100/90 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] z-[100]">
      {toolGroups.map((group, idx) => (
        <React.Fragment key={idx}>
          <div className="flex flex-col gap-2">
            {group.map(tool => (
              <button 
                key={tool.id}
                onClick={() => setTool(tool.id)}
                className={`size-11 rounded-xl flex items-center justify-center transition-all relative group ${
                  activeTool === tool.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 border border-primary/40' 
                    : 'text-obsidian-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] font-bold ${tool.id === 'subselect' ? 'rotate-[-45deg] scale-x-[-1]' : ''}`}>
                  {tool.icon}
                </span>
                
                {/* TOOLTIP MANIFEST */}
                <div className="absolute left-16 px-4 py-2 bg-obsidian-300 border border-white/10 text-[9px] font-black text-white rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-8px] group-hover:translate-x-0 whitespace-nowrap uppercase tracking-widest shadow-2xl flex items-center gap-4">
                  {tool.label}
                  <span className="px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded-md text-primary font-mono text-[8px]">{tool.shortcut}</span>
                </div>
              </button>
            ))}
          </div>
          {idx < toolGroups.length - 1 && <div className="h-px w-6 bg-white/5 mx-auto"></div>}
        </React.Fragment>
      ))}

      <div className="h-px w-6 bg-white/5 mx-auto"></div>
      
      <button 
        onClick={onSmartMagic}
        className="size-11 rounded-xl flex items-center justify-center bg-primary text-white shadow-xl hover:scale-110 active:scale-95 transition-all relative group overflow-hidden border border-primary/40"
      >
        <span className="material-symbols-outlined text-[20px] relative z-10 font-black">auto_fix_high</span>
        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
      </button>
    </div>
  );
};

export default FloatingToolbar;
