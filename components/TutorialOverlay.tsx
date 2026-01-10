
import React, { useState } from 'react';

interface TutorialOverlayProps {
  onClose: (dontShowAgain: boolean) => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const steps = [
    {
      title: "The Hangar Dashboard",
      industrial: "CHASSIS_STAGING_GROUND",
      plain: "This is your starting point. You can create a new 'Manifest' (Project File) or select an existing 'Kernel' (Project) to begin design.",
      icon: "warehouse"
    },
    {
      title: "Neural Synth",
      industrial: "GENERATIVE_SYNTHESIS_ENGINE",
      plain: "Located at the bottom, this is where you talk to the AI. Use 'Industrial Prompts' to forge complex shapes instantly.",
      icon: "bolt"
    },
    {
      title: "Scene Explorer",
      industrial: "HIERARCHICAL_NODE_TREE",
      plain: "On the right, find the 'Explorer'. It lists every 'Layer' and 'Node' (Path Point) in your design. Click them to edit their properties.",
      icon: "account_tree"
    },
    {
      title: "Verbose Mode",
      industrial: "SOVEREIGN_TRANSLATION_LAYER",
      plain: "If the interface feels too technical, look for the 'Verbose' toggle in the top bar. It translates the 'Engine Speak' into plain English for you.",
      icon: "translate"
    }
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-8 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="w-full max-w-2xl bg-obsidian-100 border border-white/10 rounded-[40px] shadow-[0_100px_200px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
        <div className="p-10 border-b border-white/5 bg-white/5 flex justify-between items-center relative">
           <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">{current.title}</h2>
              <span className="text-[9px] font-mono text-primary uppercase tracking-[0.4em] italic">{current.industrial}</span>
           </div>
           <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[40px]">{current.icon}</span>
           </div>
           
           <button 
             onClick={() => onClose(dontShowAgain)}
             className="absolute top-4 right-4 text-[8px] font-black text-obsidian-600 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
           >
              Skip Protocol <span className="material-symbols-outlined text-[14px]">fast_forward</span>
           </button>
        </div>

        <div className="p-12 flex-1 space-y-10">
           <div className="min-h-[120px]">
             <p className="text-xl text-white/80 leading-relaxed font-medium">
               "{current.plain}"
             </p>
           </div>

           <div className="flex flex-col gap-8">
              <div className="flex justify-between items-center">
                 <div className="flex gap-2">
                    {steps.map((_, i) => (
                       <div key={i} className={`h-1.5 transition-all rounded-full ${i === step ? 'w-12 bg-primary shadow-[0_0_10px_var(--xi-vector-glow)]' : 'w-1.5 bg-obsidian-400'}`}></div>
                    ))}
                 </div>
                 <div className="flex items-center gap-4">
                    {step > 0 && (
                       <button onClick={() => setStep(step - 1)} className="px-6 py-3 text-[10px] font-black uppercase text-obsidian-500 hover:text-white transition-colors">Previous</button>
                    )}
                    <button 
                      onClick={() => step === steps.length - 1 ? onClose(dontShowAgain) : setStep(step + 1)}
                      className="px-10 py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all border border-white/20"
                    >
                       {step === steps.length - 1 ? 'Start Forging' : 'Next Protocol'}
                    </button>
                 </div>
              </div>

              <div className="h-px w-full bg-white/5"></div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`size-5 rounded-md border flex items-center justify-center transition-all ${dontShowAgain ? 'bg-primary border-primary' : 'bg-black/40 border-white/10 group-hover:border-primary/40'}`}>
                    {dontShowAgain && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={dontShowAgain} 
                    onChange={() => setDontShowAgain(!dontShowAgain)} 
                  />
                  <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-widest group-hover:text-obsidian-300 transition-colors">Don't show this manifest again</span>
                </label>
                
                <span className="text-[8px] font-mono text-obsidian-700 uppercase">Ver: 0.8.4_Manual</span>
              </div>
           </div>
        </div>

        <div className="p-8 bg-obsidian-300 text-center border-t border-white/5">
           <span className="text-[9px] font-mono text-obsidian-600 uppercase tracking-widest italic opacity-50">User_Instructional_Manifest_v0.1 // VectorForge Training Simulation</span>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
