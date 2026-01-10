
import React, { useState } from 'react';
import { translate, getDefinition } from '../services/lexiconService';

interface TutorialOverlayProps {
  onClose: (dontShowAgain: boolean) => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const steps = [
    {
      title: "Welcome to the Forge",
      industrial: "SYSTEM_INITIALIZATION",
      plain: "Welcome! This is a professional AI design engine. We use 'Industrial' terminology to describe our advanced features. You can toggle 'Verbose Mode' anytime to see these translated into plain English.",
      icon: "polyline"
    },
    {
      title: "The Project Manager",
      industrial: "PROJECT_NEXUS",
      plain: "Manage your tasks and AI agents here. Think of it as your mission control for everything happening in the engine.",
      icon: "account_tree"
    },
    {
      title: "The AI Assistant",
      industrial: "NEURAL_SYNTH",
      plain: "Talk to the engine to create shapes and code instantly. Use simple descriptions to 'Forge' complex designs.",
      icon: "bolt"
    },
    {
      title: "Design Library",
      industrial: "ASSET_VAULT",
      plain: "Your personal library where all your creations are stored securely. You can also 'Inject' components from the global marketplace.",
      icon: "warehouse"
    },
    {
      title: "The Logic Bridge",
      industrial: "ROSETTA_KERNEL",
      plain: "Our built-in translator. It helps bridge the gap between human design ideas and technical machine execution.",
      icon: "translate"
    }
  ];

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="w-full max-w-2xl bg-obsidian-950 border border-white/10 rounded-[40px] shadow-[0_100px_200px_rgba(0,0,0,1)] overflow-hidden flex flex-col relative">
        {/* Grain Overlay */}
        <div className="absolute inset-0 grain-layer grain-1 pointer-events-none opacity-20"></div>

        <div className="p-10 border-b border-white/5 bg-black/40 flex justify-between items-center relative z-10">
           <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic leading-tight">{current.title}</h2>
              <span className="text-[9px] font-mono text-primary uppercase tracking-[0.4em] italic font-bold">{current.industrial}</span>
           </div>
           <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
              <span className="material-symbols-outlined text-[40px]">{current.icon}</span>
           </div>
           
           <button 
             onClick={() => onClose(dontShowAgain)}
             className="absolute top-4 right-4 text-[8px] font-black text-obsidian-600 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
           >
              Skip Onboarding <span className="material-symbols-outlined text-[14px]">fast_forward</span>
           </button>
        </div>

        <div className="p-12 flex-1 space-y-10 relative z-10">
           <div className="min-h-[140px] flex items-center">
             <p className="text-xl text-obsidian-100 leading-relaxed font-medium italic">
               "{current.plain}"
             </p>
           </div>

           <div className="flex flex-col gap-8">
              <div className="flex justify-between items-center">
                 <div className="flex gap-2">
                    {steps.map((_, i) => (
                       <div key={i} className={`h-1.5 transition-all rounded-full ${i === step ? 'w-12 bg-primary shadow-[0_0_15px_var(--xi-accent)]' : 'w-2 bg-obsidian-800'}`}></div>
                    ))}
                 </div>
                 <div className="flex items-center gap-4">
                    {step > 0 && (
                       <button onClick={() => setStep(step - 1)} className="px-6 py-3 text-[10px] font-black uppercase text-obsidian-500 hover:text-white transition-colors">Back</button>
                    )}
                    <button 
                      onClick={() => step === steps.length - 1 ? onClose(dontShowAgain) : setStep(step + 1)}
                      className="px-10 py-4 bg-primary text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all border border-white/10"
                    >
                       {step === steps.length - 1 ? 'Enter the Forge' : 'Next Protocol'}
                    </button>
                 </div>
              </div>

              <div className="h-px w-full bg-white/5"></div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`size-5 rounded-md border flex items-center justify-center transition-all ${dontShowAgain ? 'bg-primary border-primary' : 'bg-black/40 border-white/10 group-hover:border-primary/40'}`}>
                    {dontShowAgain && <span className="material-symbols-outlined text-black text-[14px] font-bold">check</span>}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={dontShowAgain} 
                    onChange={() => setDontShowAgain(!dontShowAgain)} 
                  />
                  <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-widest group-hover:text-obsidian-300 transition-colors">Do not show this tutorial again</span>
                </label>
                
                <span className="text-[8px] font-mono text-obsidian-700 uppercase italic">OPERATOR_MANUAL_v0.8.4</span>
              </div>
           </div>
        </div>

        <div className="p-8 bg-obsidian-900 border-t border-white/5 text-center relative z-10">
           <span className="text-[9px] font-mono text-obsidian-600 uppercase tracking-widest italic opacity-60">"Simplifying complexity for the sovereign user."</span>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
