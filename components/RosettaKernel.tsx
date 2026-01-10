
import React, { useState } from 'react';

const RosettaKernel: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState(0);

  const translations = [
    {
      plain: "The user needs to find the 'Buy' button easily without thinking too much.",
      tech: "Implement a high-contrast CTA with < 200ms interaction latency and a clear Z-index hierarchy.",
      maths: "UX_Friction(x) = lim(δ→0) [ Cognitive_Load / Visual_Clarity ] * (Interaction_Time)^2"
    },
    {
      plain: "The animation should feel heavy and industrial, like a vault door closing.",
      tech: "cubic-bezier(0.7, 0, 0.3, 1) timing function with 1200ms duration and 5px blur-trail.",
      maths: "Kinetic_Mass(Σ) = ∫(Force * Mass) dt / Friction_Coefficient_v8"
    }
  ];

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-700">
      <div className="h-12 border-b border-white/5 bg-obsidian-100 flex items-center justify-between px-6 shrink-0">
         <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-sm">translate</span>
            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Rosetta_Kernel_v1.0 // Heuristic_Translator</span>
         </div>
         <div className="flex gap-2">
            {[0, 1].map(i => (
              <button key={i} onClick={() => setActiveSegment(i)} className={`size-2 rounded-full transition-all ${activeSegment === i ? 'bg-primary scale-125 shadow-lg' : 'bg-obsidian-600 hover:bg-white/20'}`}></button>
            ))}
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-8 gap-8">
         {/* PLAIN PANEL */}
         <div className="flex-1 bg-obsidian-100 border border-white/5 rounded-[40px] p-10 flex flex-col gap-8 group hover:border-white/20 transition-all shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
               <span className="material-symbols-outlined text-[120px] text-white">chat_bubble</span>
            </div>
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Segment_01 // Plain_Human</span>
            <div className="flex-1 flex items-center justify-center">
               <p className="text-2xl font-medium text-white/80 italic text-center leading-relaxed">
                 "{translations[activeSegment].plain}"
               </p>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-primary w-1/3 animate-pulse"></div>
            </div>
         </div>

         {/* TECH PANEL */}
         <div className="flex-1 bg-obsidian-100 border border-white/5 rounded-[40px] p-10 flex flex-col gap-8 group hover:border-white/20 transition-all shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
               <span className="material-symbols-outlined text-[120px] text-white">code</span>
            </div>
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.4em]">Segment_02 // Technical_Spec</span>
            <div className="flex-1 flex items-center justify-center">
               <p className="text-lg font-mono text-cyan-500/80 text-center leading-relaxed">
                 {translations[activeSegment].tech}
               </p>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-cyan-400 w-2/3 animate-pulse"></div>
            </div>
         </div>

         {/* MATHS PANEL */}
         <div className="flex-1 bg-obsidian-100 border border-white/5 rounded-[40px] p-10 flex flex-col gap-8 group hover:border-white/20 transition-all shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
               <span className="material-symbols-outlined text-[120px] text-white">function</span>
            </div>
            <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.4em]">Segment_03 // Hallberg_Maths</span>
            <div className="flex-1 flex items-center justify-center">
               <p className="text-xl font-bold text-purple-400/80 text-center italic tracking-tight">
                 {translations[activeSegment].maths}
               </p>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-purple-500 w-full animate-pulse shadow-[0_0_15px_purple]"></div>
            </div>
         </div>
      </div>

      <div className="p-10 bg-black/20 border-t border-white/5 text-center">
         <p className="text-[10px] font-mono text-obsidian-600 uppercase tracking-[0.5em]">
           Teaching a man UX design is the highest form of scalability.
         </p>
      </div>
    </div>
  );
};

export default RosettaKernel;
