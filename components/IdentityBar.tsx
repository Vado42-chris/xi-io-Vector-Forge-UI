
import React from 'react';
import { Persona, ShellMode, MiningState, ANTPipeline } from '../types';
import { XI_Telemetry } from './IndustrialPrimitives';

interface IdentityBarProps {
  projectName: string;
  isProjectOpen: boolean;
  persona: Persona;
  currentMode: ShellMode;
  onAction: (action: string, payload?: any) => void;
  credits: number;
  miningState: MiningState;
  antPipeline: ANTPipeline;
  verboseMode?: boolean;
}

const IdentityBar: React.FC<IdentityBarProps> = ({ 
  projectName, persona, isProjectOpen, currentMode, onAction, 
  verboseMode = false, miningState, antPipeline
}) => {
  
  const shellNodes = [
    { label: 'STUDIO_FORGE', mode: 'STUDIO' as ShellMode, icon: 'polyline' },
    { label: 'ASSET_VAULT', mode: 'VAULT' as ShellMode, icon: 'inventory_2' },
    { label: 'EXCHANGE', mode: 'EXCHANGE' as ShellMode, icon: 'shopping_cart' },
    { label: 'LEDGER', mode: 'LEDGER' as ShellMode, icon: 'account_balance_wallet' },
    { label: 'KNOWLEDGE', mode: 'ONBOARDING' as ShellMode, icon: 'school' }
  ];

  return (
    <div className="h-16 flex items-center justify-between z-[450] relative select-none px-8 shadow-xl paper-layer grain-fine bg-obsidian-850 border-b border-white/[0.03]">
      <div className="flex items-center gap-10">
        {/* LOGO - RESET TO HOME */}
        <div className="flex items-center gap-4 group cursor-pointer active:scale-95 transition-all" onClick={() => onAction('FILE_HOME')}>
           <div className="size-10 bg-obsidian-900 rounded-xi flex items-center justify-center text-primary group-hover:text-white transition-all shadow-inner border border-white/5 group-hover:shadow-[0_0_20px_var(--xi-accent)]">
              <span className="material-symbols-outlined !text-[24px]">polyline</span>
           </div>
           <div className="flex flex-col">
             <div className="flex items-center gap-2">
                <span className="text-[16px] font-black uppercase tracking-[0.15em] text-white leading-none italic">VectorForge</span>
                {isProjectOpen && (
                  <div className="px-2 py-0.5 bg-primary/20 border border-primary/40 rounded-xi text-[8px] font-black text-primary italic leading-none animate-pulse uppercase truncate max-w-[120px]">
                    {projectName}
                  </div>
                )}
             </div>
             <span className="text-[8px] font-mono text-primary/60 uppercase tracking-widest mt-1.5 italic font-bold">MODE_SHELL_0x84</span>
           </div>
        </div>

        {/* TOP LEVEL NAVIGATION */}
        <nav className="flex items-center gap-1">
           {shellNodes.map(node => (
             <button 
               key={node.mode} 
               onClick={() => onAction(`SHELL_${node.mode}`)} 
               className={`
                 px-6 py-2 rounded-xi text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border
                 ${currentMode === node.mode 
                   ? 'bg-primary text-black border-primary xi-backlit scale-105 z-10' 
                   : 'text-obsidian-500 hover:text-white hover:bg-white/[0.03] border-transparent'}
               `}
             >
                <span className="material-symbols-outlined !text-[16px]">{node.icon}</span>
                {node.label}
             </button>
           ))}
        </nav>
      </div>

      <div className="flex items-center gap-10">
        {/* TELEMETRY HUD */}
        <div className="flex items-center gap-8 px-6 h-10 bg-black/40 rounded-xi shadow-inner border border-white/[0.03] hidden xl:flex">
           <XI_Telemetry label="THROUGHPUT" value={antPipeline.bandwidth} />
           <div className="w-px h-5 bg-obsidian-800"></div>
           <XI_Telemetry label="CORE_YIELD" value={`${miningState.hashRate} MH/s`} />
        </div>

        {/* PROFILE - TOGGLE OMNIBOT */}
        <div className="flex items-center gap-5 group cursor-pointer hover:bg-white/[0.03] p-1.5 rounded-xi transition-all" onClick={() => onAction('TOGGLE_OMNI_BOT')}>
           <div className="flex flex-col items-end gap-1">
              <span className="text-[11px] font-black uppercase text-white group-hover:text-primary transition-colors">{persona.username}</span>
              <span className="text-[7px] font-mono text-obsidian-400 uppercase tracking-widest italic leading-none">{persona.dotfileId}</span>
           </div>
           <div className="size-11 rounded-xi bg-obsidian-950 border border-white/5 overflow-hidden group-hover:xi-backlit transition-all shadow-xl p-0.5 relative group-active:scale-90">
             <img src={persona.avatarUrl} alt="User" className="size-full object-cover rounded-sm" />
             <div className="absolute bottom-0 right-0 size-2 bg-green-500 rounded-full border-2 border-obsidian-950 shadow-[0_0_10px_green]"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityBar;
