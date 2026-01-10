
import React, { useState } from 'react';

const SovereignScholar: React.FC = () => {
  const [activeCourse, setActiveCourse] = useState('UX_MATHS_101');

  const curriculum = [
    { id: 'UX_MATHS_101', title: 'The Calculus of Curiosity', reward: 500, status: 'Active', desc: 'Understanding friction coefficients in user-flow manifolds.' },
    { id: 'ECON_202', title: 'Recursive Revenue Models', reward: 1200, status: 'Locked', desc: 'How to build plugins that generate passive royalties.' },
    { id: 'PSYCH_303', title: 'Gaze Entropy & Attention', reward: 2500, status: 'Locked', desc: 'Advanced simulations for virtual user eye-tracking.' },
  ];

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-1000">
       <div className="h-20 border-b border-white/5 bg-obsidian-100 flex items-center px-12 gap-12 shrink-0 shadow-2xl relative z-10">
          <div className="flex items-center gap-6">
             <div className="size-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-inner">
                <span className="material-symbols-outlined text-[32px] font-black animate-pulse">school</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[18px] font-black text-white uppercase italic tracking-tighter leading-none">Sovereign_Scholar</span>
                <span className="text-[8px] font-mono text-obsidian-600 uppercase tracking-[0.4em] mt-1">Teaching_The_Maths_Of_Design</span>
             </div>
          </div>
          <div className="ml-auto flex items-center gap-10">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-obsidian-600 uppercase tracking-widest">Scholarship_Yield</span>
                <span className="text-[20px] font-black text-primary italic tabular-nums leading-none">2.4K CORE</span>
             </div>
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden p-12 gap-12 bg-obsidian-300">
          {/* CURRICULUM LIST */}
          <div className="w-96 space-y-6">
             <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-[0.3em]">Learning_Roadmap</span>
             <div className="space-y-4">
                {curriculum.map(course => (
                  <button 
                    key={course.id}
                    onClick={() => setActiveCourse(course.id)}
                    className={`w-full text-left p-6 rounded-[32px] border transition-all relative overflow-hidden group ${activeCourse === course.id ? 'bg-cyan-500/10 border-cyan-500/40 shadow-xl shadow-cyan-500/5' : 'bg-obsidian-100 border-white/5 hover:border-white/20 opacity-60'}`}
                  >
                     <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className={`text-[8px] font-black px-2 py-1 rounded-md ${course.status === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white/5 text-obsidian-600 border border-white/5'}`}>{course.status}</span>
                        <span className="text-[9px] font-mono text-primary font-bold">+{course.reward} CORE</span>
                     </div>
                     <h4 className="text-[14px] font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors relative z-10">{course.title}</h4>
                     <p className="text-[10px] text-obsidian-500 italic mt-2 relative z-10 line-clamp-1">{course.desc}</p>
                  </button>
                ))}
             </div>
          </div>

          {/* LEARNING STAGE */}
          <div className="flex-1 bg-black/40 border-2 border-white/5 rounded-[60px] p-16 flex flex-col gap-12 relative overflow-hidden group shadow-2xl">
             <div className="absolute inset-0 canvas-grid opacity-[0.1] pointer-events-none"></div>
             <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                <span className="material-symbols-outlined text-[300px] text-white font-black">menu_book</span>
             </div>

             <div className="space-y-4 relative z-10">
                <span className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.6em] italic">Lesson_V8 // Pattern_Recognition</span>
                <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-tight">
                   The_Maths_of_<br/>
                   <span className="text-cyan-500">Curiosity</span>
                </h3>
             </div>

             <div className="flex-1 flex flex-col justify-center max-w-2xl relative z-10">
                <p className="text-2xl text-obsidian-500 leading-relaxed italic">
                  "Most people think UX is about colors. In the Forge, we know UX is about the **Decay of Gaze Uncertainty**. Teach a user how to buy fish, and they consume. Teach them the math of the transaction, and they become the **Sovereign Operator**."
                </p>
                <div className="mt-12 flex gap-8">
                   <button className="px-12 py-5 bg-cyan-600 text-white rounded-3xl text-[12px] font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                      Begin_Simulation
                   </button>
                   <button className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-3xl text-[12px] font-black uppercase tracking-[0.4em] transition-all">
                      View_Logic_Proof
                   </button>
                </div>
             </div>

             <div className="mt-auto p-10 bg-cyan-500/5 border-2 border-cyan-500/20 rounded-[48px] flex items-center justify-between relative z-10 group-hover:border-cyan-400/40 transition-colors">
                <div className="flex items-center gap-8">
                   <div className="size-16 rounded-[24px] bg-cyan-500 flex items-center justify-center text-black shadow-2xl">
                      <span className="material-symbols-outlined text-[32px] font-black">verified</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-black text-white uppercase italic">Heuristic_Certification</span>
                      <span className="text-[9px] font-mono text-cyan-500 uppercase font-bold tracking-widest italic">Industry_Standard // Xibalba_Foundry</span>
                   </div>
                </div>
                <div className="text-right">
                   <span className="text-2xl font-black text-white tabular-nums">98%_COMPLETE</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default SovereignScholar;
