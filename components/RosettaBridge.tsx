
import React, { useState } from 'react';

const RosettaBridge: React.FC = () => {
  const [activeLogic, setActiveLogic] = useState(0);

  const logicStack = [
    {
      intent: "Make the navigation feel like it belongs in a high-security vault.",
      spec: "Apply cubic-bezier(0.9, 0, 0.1, 1), 2px inset obsidian-400 borders, and a 150ms staggered opacity delay.",
      math: "Friction(μ) = (Complexity / Visual_Silence) * Δt^-1.5"
    },
    {
      intent: "The user should feel immediate gratification when clicking 'Forge'.",
      spec: "Trigger a 0.8s particle burst (Flux_V1), haptic resonance at 40Hz, and immediate state mutation 'READY'.",
      math: "Delight(D) = ∫(Expectation - Reality) dt + Σ(Reward_Signals)"
    },
    {
      intent: "Optimize the layout for complex multi-tasking without clutter.",
      spec: "Implement a 12-column variable grid with dynamic occlusion and z-index depth sorting (Layer_Stack_v8).",
      math: "Entropy(S) = -k * Σ(p_i * ln(p_i)) where p_i is UI_Density_Node"
    }
  ];

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-700">
      <div className="h-14 border-b border-white/5 bg-obsidian-100 flex items-center justify-between px-8 shrink-0">
         <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
               <span className="material-symbols-outlined text-xl">translate</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[11px] font-black text-white uppercase tracking-widest italic">Rosetta_Bridge_v1.0</span>
               <span className="text-[7px] font-mono text-obsidian-600 uppercase">Universal_UX_Translation_Layer</span>
            </div>
         </div>
         <div className="flex gap-2">
            {logicStack.map((_, i) => (
              <button key={i} onClick={() => setActiveLogic(i)} className={`h-1 rounded-full transition-all ${activeLogic === i ? 'w-12 bg-primary shadow-lg shadow-primary/30' : 'w-4 bg-obsidian-600 hover:bg-white/20'}`}></button>
            ))}
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-10 gap-10">
         {/* INTENT PANEL */}
         <div className="flex-1 bg-obsidian-100 border border-white/5 rounded-[48px] p-12 flex flex-col gap-10 relative overflow-hidden group hover:border-white/10 transition-all">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-[160px] text-white">psychology</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Section_01 // Plain_Intent</span>
               <div className="h-px flex-1 bg-white/5"></div>
            </div>
            <div className="flex-1 flex items-center">
               <p className="text-3xl font-medium text-white/80 italic leading-relaxed">
                 "{logicStack[activeLogic].intent}"
               </p>
            </div>
            <p className="text-[10px] text-obsidian-600 font-mono italic">"Humor breeds curiosity. Curiosity breeds growth."</p>
         </div>

         {/* SPEC PANEL */}
         <div className="flex-1 bg-obsidian-100 border border-white/5 rounded-[48px] p-12 flex flex-col gap-10 relative overflow-hidden group hover:border-white/10 transition-all">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-[160px] text-cyan-400">code_blocks</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.4em]">Section_02 // Industrial_Spec</span>
               <div className="h-px flex-1 bg-white/5"></div>
            </div>
            <div className="flex-1 flex items-center">
               <p className="text-xl font-mono text-cyan-500/80 leading-relaxed">
                 {logicStack[activeLogic].spec}
               </p>
            </div>
            <div className="flex items-center gap-3">
               <div className="size-2 rounded-full bg-cyan-500 animate-pulse"></div>
               <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">Compiling_Logic_0x82...</span>
            </div>
         </div>

         {/* MATH PANEL */}
         <div className="flex-1 bg-obsidian-100 border border-white/5 rounded-[48px] p-12 flex flex-col gap-10 relative overflow-hidden group hover:border-white/10 transition-all">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-[160px] text-purple-400">functions</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.4em]">Section_03 // #Hallberg_Maths</span>
               <div className="h-px flex-1 bg-white/5"></div>
            </div>
            <div className="flex-1 flex items-center">
               <p className="text-2xl font-bold text-purple-400/90 italic tracking-tighter text-center w-full">
                 {logicStack[activeLogic].math}
               </p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-[11px] text-purple-300 italic text-center">
               "Give a man a fish, he eats for a day. Teach him UX maths, he builds a sovereign empire."
            </div>
         </div>
      </div>
    </div>
  );
};

export default RosettaBridge;
