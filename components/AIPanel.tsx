
import React, { useState } from 'react';
import { AppState } from '../types';
import { XI_Button, XI_Telemetry } from './IndustrialPrimitives';
import { translate } from '../services/lexiconService';

interface AIPanelProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onGenerate: () => void;
  verboseMode?: boolean;
}

const AIPanel: React.FC<AIPanelProps> = ({ state, setState, onGenerate, verboseMode = false }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const randomizeSeed = () => {
    const newSeed = `0.${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}_XIB`;
    setState(p => ({ ...p, entropySeed: newSeed }));
  };

  return (
    <div className={`shrink-0 bg-obsidian-800 border-t border-white/[0.01] p-6 flex flex-col gap-6 z-40 transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)] grain-layer grain-4 ${showAdvanced ? 'h-[420px]' : 'h-48'}`}>
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3">
              <span className="material-symbols-outlined !text-[18px] text-primary/60">auto_fix_high</span>
              <span className="text-[10px] font-black text-obsidian-100 tracking-[0.4em] uppercase italic">
                {translate('NEURAL_SYNTH', verboseMode)}
              </span>
           </div>
           <div className="flex items-center bg-obsidian-950/40 border border-white/[0.01] rounded px-1 py-1 shadow-inner">
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
           <XI_Telemetry label={verboseMode ? "PROCESSOR_TEMP" : "GPU_HEAT"} value="14%" />
           <XI_Telemetry label={verboseMode ? "RESPONSE_TIME" : "INFERENCE_Σ"} value="0.98s" />
        </div>
      </div>
      
      <div className="flex-1 flex gap-6 min-h-0 relative z-20">
        <div className="flex-1 bg-obsidian-950 rounded-xi border border-white/[0.08] p-5 flex flex-col relative group overflow-hidden shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)]">
           <textarea 
             value={state.prompt}
             onChange={(e) => setState(p => ({ ...p, prompt: e.target.value }))}
             className="flex-1 bg-transparent border-none p-0 text-[13px] font-mono placeholder-obsidian-300/20 outline-none resize-none text-obsidian-100 leading-relaxed custom-scrollbar selection:bg-primary/20 relative z-30"
             placeholder={verboseMode ? "Describe what you want to create..." : "[SYSTEM_PROMPT] > Issue directive to neural kernel..."}
           />
           <button 
             onClick={() => setShowAdvanced(!showAdvanced)}
             className="absolute bottom-4 right-4 text-[7px] font-black text-obsidian-300 hover:text-primary transition-all uppercase tracking-[0.4em] z-30 flex items-center gap-2"
           >
             {showAdvanced ? (
               <>{verboseMode ? "HIDE OPTIONS" : "RETRACT"} <span className="material-symbols-outlined !text-[10px]">expand_more</span></>
             ) : (
               <>{verboseMode ? "SHOW OPTIONS" : "EXPAND"} <span className="material-symbols-outlined !text-[10px]">expand_less</span></>
             )}
           </button>
        </div>

        <XI_Button 
          label={translate('FORGE_KERNEL', verboseMode)}
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
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black text-obsidian-300 uppercase tracking-[0.4em] block italic">
                    {translate('TOPOLOGICAL_DENSITY', verboseMode)}
                  </span>
                  <span className="text-[10px] font-mono text-primary font-bold italic">{state.complexity}%</span>
               </div>
               <div className="relative h-6 flex items-center">
                  <input 
                    type="range" value={state.complexity} 
                    onChange={(e) => setState(p => ({ ...p, complexity: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-obsidian-950 rounded-full appearance-none accent-primary cursor-pointer border border-white/[0.01]" 
                  />
                  <div className="absolute top-0 bottom-0 pointer-events-none flex justify-between w-full opacity-10">
                     {Array.from({ length: 11 }).map((_, i) => <div key={i} className="w-px h-full bg-white"></div>)}
                  </div>
               </div>
            </div>
            
            <div className="space-y-4">
               <span className="text-[8px] font-black text-obsidian-300 uppercase tracking-[0.4em] block italic">
                 {translate('ENTROPY_SEED', verboseMode)}
               </span>
               <div className="flex items-center gap-4">
                  <div className="flex-1 bg-obsidian-950 border border-white/5 rounded-lg px-6 py-3 flex items-center justify-between group hover:border-primary/20 transition-all cursor-default">
                     <span className="text-[12px] font-mono text-primary italic font-bold tracking-tighter">{state.entropySeed}</span>
                     <span className="material-symbols-outlined text-[14px] text-obsidian-700">fingerprint</span>
                  </div>
                  <button 
                    onClick={randomizeSeed}
                    className="size-12 rounded-lg bg-obsidian-850 border border-white/5 flex items-center justify-center text-obsidian-500 hover:text-primary hover:border-primary/40 transition-all shadow-xl active:scale-90"
                    title={verboseMode ? "Regenerate Random Key" : "Regenerate Entropy Manifest"}
                  >
                     <span className="material-symbols-outlined text-[20px]">cached</span>
                  </button>
               </div>
               <p className="text-[8px] text-obsidian-600 uppercase font-bold italic tracking-tight opacity-60">
                 {verboseMode ? "Each unique key produces a different variation of your design." : "Each seed manifest produces a unique topological variance."}
               </p>
            </div>
        </div>
      )}
    </div>
  );
};

export default AIPanel;
