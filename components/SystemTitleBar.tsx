
import React from 'react';

interface SystemTitleBarProps {
  verboseMode: boolean;
  setVerboseMode: (v: boolean) => void;
}

const SystemTitleBar: React.FC<SystemTitleBarProps> = ({ verboseMode, setVerboseMode }) => {
  return (
    <div className="h-10 bg-obsidian-950 flex items-center justify-between px-6 border-b border-white/[0.02] select-none transition-colors duration-300 relative z-[1000]">
      <div className="flex items-center gap-10 z-10 h-full">
        <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-default">
           <div className="size-4 bg-primary/10 border border-primary/30 rounded flex items-center justify-center">
              <div className="size-1.5 bg-primary/60 rounded-full"></div>
           </div>
           <span className="text-[11px] font-black text-obsidian-100 uppercase tracking-[0.5em] italic">VectorForge</span>
        </div>
        
        <button 
          onClick={() => setVerboseMode(!verboseMode)}
          className={`flex items-center gap-3 px-4 py-1 rounded-lg border transition-all ${verboseMode ? 'bg-primary/10 border-primary/30 text-primary shadow-[0_0_15px_rgba(184,134,11,0.1)]' : 'bg-transparent border-white/10 text-obsidian-400 hover:text-obsidian-100 hover:border-white/20'}`}
        >
           <span className="material-symbols-outlined !text-[16px]">translate</span>
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">{verboseMode ? 'VERBOSE_MODE' : 'ENGINE_MODE'}</span>
        </button>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <span className="text-[8px] font-black text-obsidian-800 uppercase tracking-[1em] italic opacity-30">
             Xibalba_Foundry_Control_Chassis
           </span>
      </div>

      <div className="flex items-center h-full -mr-6 z-10">
        {['remove', 'check_box_outline_blank'].map(icon => (
          <button key={icon} className="h-full w-12 flex items-center justify-center text-obsidian-100 hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined !text-[18px]">{icon}</span>
          </button>
        ))}
        <button className="h-full w-14 flex items-center justify-center text-obsidian-100 hover:bg-red-900/80 hover:text-white transition-all">
          <span className="material-symbols-outlined !text-[20px]">close</span>
        </button>
      </div>
    </div>
  );
};

export default SystemTitleBar;
