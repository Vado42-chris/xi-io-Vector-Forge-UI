
import React, { useState } from 'react';

const ConciergeAgent: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState('MONETIZING_FRICTION');

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-1000">
       <div className="h-16 border-b border-white/5 bg-obsidian-100 flex items-center justify-between px-10 shrink-0 shadow-lg relative z-10">
          <div className="flex items-center gap-6">
             <div className="size-11 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-inner">
                <span className="material-symbols-outlined text-[28px] animate-pulse">support_agent</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[14px] font-black text-white uppercase tracking-[0.2em] italic leading-tight">Concierge_Peer_v8.4</span>
                <span className="text-[8px] font-mono text-obsidian-600 uppercase tracking-widest italic">Teaching_Sovereign_Industrial_Design</span>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-3">
                <div className="size-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">MENTOR_LINK_SOLID</span>
             </div>
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden p-10 gap-10">
          {/* THE MENTOR CHAT / REASONING */}
          <div className="flex-1 flex flex-col gap-8">
             <div className="flex-1 bg-obsidian-100 border border-white/5 rounded-[48px] p-12 space-y-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform">
                   <span className="material-symbols-outlined text-[200px] text-white">psychology</span>
                </div>
                
                <div className="space-y-4 relative z-10">
                   <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Current_Mentorship_Topic</span>
                   <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter italic leading-tight">
                      The_Economics_of_<br/>
                      <span className="text-primary">Gaze_Friction</span>
                   </h2>
                </div>

                <div className="space-y-8 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-4">
                   <p className="text-xl text-white/80 leading-relaxed italic">
                     "You want your 'Buy' button to fly off the shelf? Don't make it bigger. Make the surrounding geometry **silent**. In #HallbergMaths, we define value as the inverse of visual entropy."
                   </p>
                   <div className="p-8 bg-black/40 rounded-[32px] border border-white/5 space-y-6">
                      <span className="text-[9px] font-black text-obsidian-600 uppercase tracking-widest block">The_Lesson_Algorithm</span>
                      <p className="text-[14px] font-mono text-primary/80 italic leading-relaxed">
                        Profit(P) = ∫(User_Intent) / Σ(UI_Interaction_Nodes) * Delight_Coefficient^2
                      </p>
                   </div>
                   <p className="text-[14px] text-obsidian-500 leading-relaxed font-medium">
                     "Give a man a fish, he eats for a day. Teach him how to optimize a checkout flow using recursive logic, and he can build a plugin that earns CORE royalties while he sleeps."
                   </p>
                </div>

                <div className="mt-auto pt-10 border-t border-white/5 flex gap-6 relative z-10">
                   <button className="flex-1 py-5 bg-primary text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all">Apply_To_Project</button>
                   <button className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white rounded-3xl border border-white/10 text-[11px] font-black uppercase tracking-[0.3em] transition-all">Next_Lesson</button>
                </div>
             </div>
          </div>

          {/* THE PEER-CODE ANALYZER */}
          <div className="w-[500px] flex flex-col gap-10">
             <div className="bg-black/60 border border-white/5 rounded-[48px] p-10 space-y-10 flex-1 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                   <span className="material-symbols-outlined text-[100px] text-cyan-400 font-black">code</span>
                </div>
                
                <div className="space-y-2 relative z-10">
                   <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em]">Auto_Refactor_Engine</span>
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Code_Auditor</h3>
                </div>

                <div className="space-y-6 relative z-10 font-mono text-[12px]">
                   <div className="p-6 bg-black/40 rounded-2xl border-l-4 border-red-500/40 text-obsidian-500">
                      <span className="text-red-400 block mb-2 font-bold uppercase">// DEPRECATED_LOGIC_DETECTION</span>
                      const handleClick = () ={">"} {'{'} ... {'}'};
                   </div>
                   <div className="material-symbols-outlined text-primary text-center w-full animate-bounce">arrow_downward</div>
                   <div className="p-6 bg-cyan-500/5 rounded-2xl border-l-4 border-cyan-500 text-cyan-100/80">
                      <span className="text-cyan-400 block mb-2 font-bold uppercase">// RECURSIVE_YIELD_OPTIMIZED</span>
                      const handleClick = useSovereignEffect((evt) ={">"} {'{'} ... {'}'});
                   </div>
                </div>

                <div className="mt-auto space-y-6 relative z-10">
                   <div className="flex justify-between items-center text-[10px] font-black text-obsidian-500 uppercase tracking-widest">
                      <span>Refactor_Confidence</span>
                      <span className="text-white">98.4%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                      <div className="h-full bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_cyan]" style={{ width: '98.4%' }}></div>
                   </div>
                </div>
             </div>

             <div className="bg-obsidian-100 border border-white/10 rounded-[48px] p-10 flex flex-col items-center text-center gap-6 shadow-xl">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group cursor-pointer hover:scale-110 transition-transform">
                   <span className="material-symbols-outlined text-[40px] font-black group-hover:rotate-12 transition-transform">verified_user</span>
                </div>
                <div className="space-y-2">
                   <span className="text-[12px] font-black text-white uppercase tracking-widest">Industrial_Certification</span>
                   <p className="text-[10px] text-obsidian-600 italic">Pass the Concierge audit to list this shard for CORE credits.</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ConciergeAgent;
