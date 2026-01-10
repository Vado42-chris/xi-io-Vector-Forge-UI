
import React from 'react';
import { Persona, Manifest, ViewType } from '../types';
import { XI_Telemetry } from './IndustrialPrimitives';

interface IdentityBarProps {
  projectName: string;
  isProjectOpen: boolean;
  persona: Persona;
  currentView: ViewType;
  onAction: (action: string) => void;
  credits: number;
  isOmniBotOpen?: boolean;
}

const IdentityBar: React.FC<IdentityBarProps> = ({ projectName, persona, credits, isProjectOpen, currentView, onAction, isOmniBotOpen }) => {
  
  const navNodes = [
    { label: 'Exchange', type: 'MARKETPLACE_NEXUS' as ViewType, desc: 'Global Asset Exchange & Forge Shards' },
    { label: 'Colosseum', type: 'COLOSSEUM_TESTER' as ViewType, desc: 'Simulation Arena & Wargaming Designs' },
    { label: 'Registry', type: 'MCP_REGISTRY' as ViewType, desc: 'AI Intelligence Sources & MCP Connectors' }
  ];

  return (
    <div className="h-16 bg-obsidian-850 border-b border-obsidian-800 flex items-center justify-between z-[450] relative select-none px-6 grain-layer grain-2 shadow-xl">
      <div className="flex items-center gap-12">
        <div 
          className="flex items-center gap-5 group cursor-pointer" 
          onClick={() => onAction('FILE_HOME')}
          title="Return to Staging Hangar"
        >
           <div className="size-11 bg-obsidian-900 border border-primary/30 rounded-xi flex items-center justify-center text-primary shadow-inner group-hover:border-primary/60 transition-all">
              <span className="material-symbols-outlined !text-[26px] notranslate">polyline</span>
           </div>
           <div className="flex flex-col">
             <span className="text-[15px] font-black uppercase tracking-[0.2em] text-white leading-none italic">Forge_Control</span>
             <span className="text-[9px] font-mono text-primary/80 uppercase tracking-widest mt-2 italic font-bold">SOVEREIGN_ENGINE_V8.4</span>
           </div>
        </div>

        <nav className="flex items-center gap-3">
           {navNodes.map(node => (
             <button 
               key={node.label} 
               onClick={() => onAction(`PANEL_${node.type}`)} 
               title={node.desc}
               className={`
                 px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-[0.2em] transition-all border
                 ${currentView === node.type 
                   ? 'bg-primary/10 border-primary/30 text-primary shadow-[0_0_20px_rgba(184,134,11,0.15)]' 
                   : 'text-obsidian-400 border-transparent hover:text-white hover:bg-white/[0.05] active:scale-95'}
               `}
             >
                {node.label}
             </button>
           ))}
        </nav>
      </div>

      <div className="flex items-center gap-16">
        {/* GLOBAL OMNIBOT TOGGLE */}
        <button 
          onClick={() => onAction('TOGGLE_OMNIBOT')}
          title="Toggle Neural Hub (OmniBot)"
          className={`size-11 rounded-xi flex items-center justify-center border transition-all ${isOmniBotOpen ? 'bg-primary text-black border-primary shadow-[0_0_15px_var(--xi-accent)]' : 'bg-obsidian-900 border-white/10 text-primary/60 hover:text-primary hover:border-primary/40'}`}
        >
          <span className="material-symbols-outlined !text-[24px]">hub</span>
        </button>

        {isProjectOpen && (
          <div className="flex items-center gap-10 px-8 h-11 bg-obsidian-950/80 rounded-xi border border-obsidian-800 shadow-inner" title={`Current Project: ${projectName}`}>
             <div className="flex flex-col">
                <span className="text-[7px] font-black text-obsidian-500 uppercase tracking-widest leading-none mb-1.5">Active_Project</span>
                <span className="text-[14px] font-black text-white uppercase tracking-widest truncate max-w-[180px] italic">{projectName}</span>
             </div>
             <div className="w-px h-6 bg-obsidian-800"></div>
             <XI_Telemetry label="YIELD_RECURSIVE" value={`${credits.toLocaleString()} CORE`} />
          </div>
        )}

        <div 
          className="flex items-center gap-6 group cursor-pointer hover:bg-white/[0.03] p-2 -mr-2 rounded-xl transition-all border border-transparent hover:border-obsidian-800"
          onClick={() => onAction('MODAL_DOTFILE_MANAGER')}
          title="Operator Profile & Identity Dotfile"
        >
           <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-3">
                 <span className="text-[12px] font-black uppercase text-white group-hover:text-primary transition-colors">{persona.username}</span>
                 <div className={`size-2 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)] ${persona.nodeStatus === 'online' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
              </div>
              <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-all">
                <span className="text-[8px] font-mono text-obsidian-300 uppercase tracking-widest italic">{persona.dotfileId} // TRACES: {persona.traces.length}</span>
                <div className="w-px h-2.5 bg-obsidian-700"></div>
                <span className="text-[8px] font-mono text-primary font-bold tracking-tight">0x88...F07</span>
              </div>
           </div>
           
           <div className="relative size-12 flex items-center">
              <div className="absolute -left-4 h-9 w-1 bg-obsidian-800 rounded-full overflow-hidden" title={`Cognitive Depth: ${persona.cognitiveDepth}%`}>
                 <div className="w-full bg-primary transition-all duration-1000 shadow-[0_0_10px_orange]" style={{ height: `${persona.cognitiveDepth}%`, marginTop: `${100 - persona.cognitiveDepth}%` }}></div>
              </div>

              <div className="size-full rounded-xi bg-obsidian-950 border border-obsidian-700 overflow-hidden grayscale-0 group-hover:border-primary/40 transition-all shadow-xl p-1 relative">
                 <div className="size-full rounded-lg overflow-hidden bg-obsidian-900 relative z-10">
                   <img src={persona.avatarUrl} alt="User" className="size-full object-cover" />
                 </div>
                 <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-0 animate-pulse"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityBar;
