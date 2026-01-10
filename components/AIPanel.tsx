
import React, { useState } from 'react';
import { AppState } from '../types';
import { XI_Button, XI_Telemetry } from './IndustrialPrimitives';

interface AIPanelProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onGenerate: () => void;
  isExpertMode?: boolean;
}

const AIPanel: React.FC<AIPanelProps> = ({ state, setState, onGenerate, isExpertMode }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className={`shrink-0 bg-obsidian-800 border-t border-white/[0.01] p-6 flex flex-col gap-6 z-40 transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)] grain-layer grain-4 ${showAdvanced ? 'h-[420px]' : 'h-48'}`}>
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3">
              <span className="material-symbols-outlined !text-[18px] text-primary/60">auto_fix_high</span>
              <span className="text-[10px] font-black text-obsidian-100 tracking-[0.4em] uppercase italic">Neural_Synth</span>
           </div>
           <div className="flex items-center bg-obsidian-950/40 border border-white/[0.01] rounded px-1 py-1">
             {['Flat', 'Isometric', 'Abstract'].map(s => (
               <button 
                 key={s} 
                 onClick={() => setState(p => ({ ...p, style: s as any }))} 
                 className={`px-6 py-2 rounded text-[8px] font-black uppercase tracking-widest transition-all ${state.style === s ? 'bg-primary text-obsidian-950 shadow-lg' : 'text-obsidian-300 hover:text-obsidian-100'}`}
               >
                 {s}
               </button>
             ))}
           </div>
        </div>
        
        <div className="flex gap-12 items-center">
           <XI_Telemetry label="GPU_HEAT" value="12%" />
           <XI_Telemetry label="CORE_YIELD" value="42.8K" />
        </div>
      </div>
      
      <div className="flex-1 flex gap-6 min-h-0 relative z-20">
        <div className="flex-1 bg-obsidian-950 rounded-xi border border-white/[0.08] p-5 flex flex-col relative group overflow-hidden shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)]">
           <textarea 
             value={state.prompt}
             onChange={(e) => setState(p => ({ ...p, prompt: e.target.value }))}
             className="flex-1 bg-transparent border-none p-0 text-[13px] font-mono placeholder-obsidian-300/20 outline-none resize-none text-obsidian-100 leading-relaxed custom-scrollbar selection:bg-primary/20 relative z-30"
             placeholder="[SYSTEM_PROMPT] > Issue directive to neural kernel..."
           />
           <button 
             onClick={() => setShowAdvanced(!showAdvanced)}
             className="absolute bottom-4 right-4 text-[7px] font-black text-obsidian-300 hover:text-primary transition-all uppercase tracking-[0.4em] z-30"
           >
             {showAdvanced ? 'RETRACT' : 'EXPAND'}
           </button>
        </div>

        <XI_Button 
          label="FORGE_KERNEL" 
          icon="bolt" 
          variant="primary" 
          loading={state.isGenerating}
          disabled={!state.prompt.trim()}
          onClick={onGenerate}
          className="w-48 h-full rounded-xi text-[11px] z-10"
        />
      </div>

      {showAdvanced && (
        <div className="p-8 bg-obsidian-900 border border-white/[0.01] rounded-xi animate-in fade-in slide-in-from-top-4 duration-500 grid grid-cols-2 gap-12 relative z-10">
            <div className="space-y-4">
               <span className="text-[8px] font-black text-obsidian-300 uppercase tracking-[0.4em] block">Topology_Complexity</span>
               <input 
                 type="range" value={state.complexity} 
                 onChange={(e) => setState(p => ({ ...p, complexity: parseInt(e.target.value) }))}
                 className="w-full h-1 bg-obsidian-950 rounded-full appearance-none accent-primary cursor-pointer border border-white/[0.01]" 
               />
            </div>
            <div className="space-y-2">
               <span className="text-[8px] font-black text-obsidian-300 uppercase tracking-[0.4em] block">Entropy_Seed</span>
               <span className="text-[11px] font-mono text-primary italic">0.142850_XIB</span>
            </div>
        </div>
      )}
    </div>
  );
};

export default AIPanel;
