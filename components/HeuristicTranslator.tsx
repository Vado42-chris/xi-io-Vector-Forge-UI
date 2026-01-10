
import React, { useState } from 'react';

const HeuristicTranslator: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const entries = [
    {
      intent: "The user needs to find the 'Action' button instantly without scanning the entire page hierarchy.",
      spec: "Elevate CTA to Z-index 1000, apply 3px primary-glow (inner/outer), and implement 150ms hover resonance.",
      math: "Friction(μ) = (Density / Visual_Silence) * lim(t→0) [ Cognitive_Wait ]"
    },
    {
      intent: "Make the transition between workspace roles feel heavy, industrial, and secure like a vault door.",
      spec: "Apply cubic-bezier(0.95, 0.05, 0.1, 0.95), 1200ms duration, and 5px motion-blur trail (Flux_V8).",
      math: "Kinetic_Impulse(I) = ∫(UI_Mass * Interaction_Velocity) dt"
    },
    {
      intent: "Allow users to handle complex multi-tasking without feeling overwhelmed by terminal output.",
      spec: "Implement variable font-weight mono (JetBrains), 0.8 opacity background blur, and staggered text-fade intervals.",
      math: "Cognitive_Load(Ω) = Σ(Nodes) * Information_Entropy / Δt"
    }
  ];

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-1000 p-10 gap-10">
      <div className="flex items-center justify-between px-6 shrink-0">
         <div className="flex items-center gap-6">
            <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner border border-primary/20">
               <span className="material-symbols-outlined text-[32px]">translate</span>
            </div>
            <div className="flex flex-col">
               <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Rosetta_Kernel_v1.0</h2>
               <p className="text-[11px] font-mono text-obsidian-600 uppercase tracking-[0.5em] mt-2 italic">Universal_UX_Translation_Bridge</p>
            </div>
         </div>
         <div className="flex gap-4">
            {entries.map((_, i) => (
              <button key={i} onClick={() => setActiveIndex(i)} className={`h-2 rounded-full transition-all duration-500 ${activeIndex === i ? 'w-20 bg-primary shadow-[0_0_20px_var(--xi-vector-500)]' : 'w-4 bg-obsidian-600 hover:bg-white/10'}`}></button>
            ))}
         </div>
      </div>

      <div className="flex-1 flex gap-10">
         {/* COLUMN 01: PLAIN HUMAN INTENT */}
         <div className="flex-1 bg-obsidian-100 border border-white/5 rounded-[56px] p-14 flex flex-col gap-12 relative overflow-hidden group hover:border-white/10 transition-all shadow-[0_60px_100px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
               <span className="material-symbols-outlined text-[200px] text-white">psychology</span>
            </div>
            <div className="flex items-center gap-6">
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Phase_01 // Plain_Intent</span>
               <div className="h-px flex-1 bg-white/5"></div>
            </div>
            <div className="flex-1 flex items-center">
               <p className="text-4xl font-medium text-white/90 italic leading-snug">
                 "{entries[activeIndex].intent}"
               </p>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
               <div className="h-full bg-primary w-1/3 animate-pulse"></div>
            </div>
            <p className="text-[10px] text-obsidian-600 font-mono italic">"Humor breeds curiosity. Curiosity breeds growth."</p>
         </div>

         {/* COLUMN 02: INDUSTRIAL SPECIFICATION */}
         <div className="flex-1 bg-obsidian-100 border border-white/5 rounded-[56px] p-14 flex flex-col gap-12 relative overflow-hidden group hover:border-white/10 transition-all shadow-[0_60px_100px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
               <span className="material-symbols-outlined text-[200px] text-cyan-400">code_blocks</span>
            </div>
            <div className="flex items-center gap-6">
               <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em]">Phase_02 // Technical_Spec</span>
               <div className="h-px flex-1 bg-white/5"></div>
            </div>
            <div className="flex-1 flex items-center">
               <p className="text-2xl font-mono text-cyan-500/80 leading-relaxed italic tracking-tight">
                 {entries[activeIndex].spec}
               </p>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
               <div className="h-full bg-cyan-400 w-2/3 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-4">
               <div className="size-2.5 rounded-full bg-cyan-500 animate-ping"></div>
               <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">Compiling_Logic_Packet...</span>
            </div>
         </div>

         {/* COLUMN 03: #HALLBERG_MATHS PROOF */}
         <div className="flex-1 bg-obsidian-100 border border-white/5 rounded-[56px] p-14 flex flex-col gap-12 relative overflow-hidden group hover:border-white/10 transition-all shadow-[0_60px_100px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
               <span className="material-symbols-outlined text-[200px] text-purple-500">function</span>
            </div>
            <div className="flex items-center gap-6">
               <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.5em]">Phase_03 // Logic_Proof</span>
               <div className="h-px flex-1 bg-white/5"></div>
            </div>
            <div className="flex-1 flex items-center justify-center">
               <p className="text-3xl font-bold text-purple-400/90 tracking-tighter text-center italic w-full leading-tight">
                 {entries[activeIndex].math}
               </p>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
               <div className="h-full bg-purple-500 w-full animate-pulse shadow-[0_0_20px_purple]"></div>
            </div>
            <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-[32px] text-[12px] text-purple-300 italic text-center leading-relaxed">
               "Give a man a fish, he eats for a day. Teach him UX design and he can buy all the fucking fish he wants."
            </div>
         </div>
      </div>

      <div className="p-10 bg-black/20 rounded-[48px] border border-white/5 text-center flex items-center justify-center gap-12 group transition-all hover:bg-black/30">
         <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-125 transition-transform">school</span>
         <p className="text-[13px] font-black text-obsidian-600 uppercase tracking-[0.6em] group-hover:text-primary transition-colors italic">
           Educating_Users_Via_Recursive_Reasoning_Protocols
         </p>
         <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-125 transition-transform">school</span>
      </div>
    </div>
  );
};

export default HeuristicTranslator;
