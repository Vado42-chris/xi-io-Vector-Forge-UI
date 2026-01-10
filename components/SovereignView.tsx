
import React, { useState, useRef, useEffect } from 'react';
import { ViewType, ToolType, ViewportMode } from '../types';

interface SovereignViewProps {
  id: string;
  type: ViewType;
  mode: ViewportMode;
  title: string;
  children: React.ReactNode;
  isFocused?: boolean;
  activeTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  onModeSelect: (mode: ViewportMode) => void;
  onFocus?: () => void;
  onClose?: () => void;
  onSplit?: (direction: 'h' | 'v') => void;
  onTypeChange?: (type: ViewType) => void;
  hideHeader?: boolean;
}

const VIEW_OPTIONS: { type: ViewType, label: string, icon: string }[] = [
  { type: 'CANVAS_2D', label: 'Artboard_2D', icon: 'polyline' },
  { type: 'CODE_KERNEL', label: 'Code_Kernel', icon: 'code' },
  { type: 'PROJECT_NEXUS', label: 'Project_Nexus', icon: 'account_tree' },
  { type: 'MARKETPLACE_NEXUS', label: 'Forge_Exchange', icon: 'shopping_cart' },
  { type: 'COLOSSEUM_TESTER', label: 'Arena_Tester', icon: 'biotech' },
  { type: 'MCP_REGISTRY', label: 'AI_Registry', icon: 'settings_input_antenna' },
  { type: 'OMNI_THREAD', label: 'Omni_Thread', icon: 'hub' },
  { type: 'WALLET_NEXUS', label: 'Wallet_Nexus', icon: 'account_balance_wallet' },
  { type: 'AI_SYNTHESIS', label: 'Neural_Synth', icon: 'auto_fix_high' },
];

const SovereignView: React.FC<SovereignViewProps> = ({ 
  type, title, children, isFocused, onFocus, onClose, onSplit, onTypeChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className={`flex-1 flex flex-col overflow-hidden border transition-all duration-300 relative group min-w-0 min-h-0 ${isFocused ? 'bg-obsidian-900 border-primary/40 ring-1 ring-primary/10' : 'bg-obsidian-950 border-obsidian-800 opacity-95 hover:opacity-100'}`}
      onPointerDown={onFocus}
    >
      {/* MACHINED HEADER CHROME */}
      <div className={`h-10 shrink-0 border-b border-obsidian-800 flex items-center justify-between px-4 select-none transition-colors relative z-[200] ${isFocused ? 'bg-obsidian-800/80 backdrop-blur-md' : 'bg-obsidian-950/80'}`}>
        <div className="flex items-center gap-4 min-w-0 flex-1 relative" ref={dropdownRef}>
           <button 
            onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
            className={`flex items-center gap-3 px-3 h-6 rounded bg-black/50 text-obsidian-400 border border-white/5 truncate hover:border-primary/40 hover:text-white transition-all ${isDropdownOpen ? 'border-primary/40 ring-1 ring-primary/20' : ''}`}
           >
              <div className={`size-1.5 shrink-0 rounded-full ${isFocused ? 'bg-primary animate-pulse shadow-[0_0_8px_var(--xi-accent)]' : 'bg-obsidian-700'}`}></div>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] italic truncate ${isFocused ? 'text-white' : 'text-obsidian-500'}`}>{title}</span>
              <span className="material-symbols-outlined !text-[12px] opacity-40">expand_more</span>
           </button>

           {isDropdownOpen && (
             <div className="absolute top-8 left-0 w-64 bg-obsidian-850 border border-white/10 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] py-2 z-[300] animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
               <div className="px-4 py-2 border-b border-white/5 mb-2">
                 <span className="text-[7px] font-black text-obsidian-500 uppercase tracking-[0.4em] italic">Switch_Viewport_Module</span>
               </div>
               {VIEW_OPTIONS.map((opt) => (
                 <button 
                  key={opt.type}
                  onClick={(e) => { e.stopPropagation(); onTypeChange?.(opt.type); setIsDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-all ${type === opt.type ? 'bg-primary/10 text-primary' : 'text-obsidian-400 hover:bg-white/5 hover:text-white'}`}
                 >
                   <span className="material-symbols-outlined !text-[18px] opacity-40">{opt.icon}</span>
                   {opt.label}
                   {type === opt.type && <span className="ml-auto material-symbols-outlined !text-[14px]">check</span>}
                 </button>
               ))}
             </div>
           )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-4 pointer-events-auto">
           <button 
            onClick={(e) => { e.stopPropagation(); onSplit?.('v'); }} 
            className="size-8 flex items-center justify-center text-obsidian-500 hover:text-primary transition-all hover:bg-white/5 rounded-md border border-transparent hover:border-white/5"
            title="Split Shard"
           >
              <span className="material-symbols-outlined !text-[16px]">vertical_split</span>
           </button>
           <button 
            onClick={(e) => { e.stopPropagation(); onClose?.(); }} 
            className="size-8 flex items-center justify-center text-obsidian-500 hover:text-red-500 transition-all hover:bg-red-950/20 rounded-md border border-transparent hover:border-white/5"
            title="Terminate Shard"
           >
              <span className="material-symbols-outlined !text-[18px]">close</span>
           </button>
        </div>
      </div>

      {/* VIEWPORT CONTENT SURFACE */}
      <div className="flex-1 relative overflow-hidden bg-obsidian-950/20 z-[100]">
        {isFocused && <div className="absolute top-0 left-0 w-full h-px bg-primary/60 animate-pulse z-[300]"></div>}
        <div className="w-full h-full relative z-10 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SovereignView;
