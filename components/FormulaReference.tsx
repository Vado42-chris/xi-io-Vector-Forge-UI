
import React from 'react';

const FormulaReference: React.FC = () => {
  const formulas = [
    {
      id: 'F-01',
      name: 'UX_FRICTION_COEFFICIENT',
      equation: 'μ = (Σ_Nodes * Entropy) / lim(t→0) [Delight]',
      desc: 'Calculates the cognitive cost of an interaction. Ideal target is < 0.12μ.'
    },
    {
      id: 'F-02',
      name: 'RECURSIVE_YIELD_Σ',
      equation: 'Y = ∫(Original_IP) * (Derivations)^1.5 dt',
      desc: 'Predicts passive CORE earnings from shard derivations on the Mainnet.'
    },
    {
      id: 'F-03',
      name: 'GAZE_DECAY_VELOCITY',
      equation: 'V_g = -k * ln(Visual_Silence / Total_Area)',
      desc: 'Measures how fast a users eye moves toward the primary CTA.'
    },
    {
      id: 'F-04',
      name: 'INDUSTRIAL_HARMONY',
      equation: 'H = (Radius_16px + Stroke_2px) / Geometry_Simplicity',
      desc: 'The golden ratio for Xibalba-compliant industrial UI design.'
    }
  ];

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-1000">
       <div className="h-16 border-b border-white/5 bg-obsidian-100 flex items-center justify-between px-10 shrink-0 shadow-lg">
          <div className="flex items-center gap-6">
             <div className="size-11 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-inner">
                <span className="material-symbols-outlined text-[28px] animate-pulse">menu_book</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[14px] font-black text-white uppercase tracking-[0.2em] italic leading-tight">Formula_Reference_v0.8</span>
                <span className="text-[8px] font-mono text-obsidian-600 uppercase tracking-widest italic">The_Sovereign_Cheat_Sheet</span>
             </div>
          </div>
       </div>

       <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-obsidian-300">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
             {formulas.map(f => (
               <div key={f.id} className="bg-obsidian-100 border border-white/5 rounded-[48px] p-10 flex flex-col gap-8 hover:border-primary/40 transition-all shadow-xl group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[2000ms]">
                     <span className="material-symbols-outlined text-[150px] text-white">functions</span>
                  </div>
                  
                  <div className="flex justify-between items-start relative z-10">
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">{f.id} // LOGIC_NODE</span>
                     <button className="material-symbols-outlined text-obsidian-700 hover:text-white transition-colors">content_copy</button>
                  </div>

                  <div className="space-y-4 relative z-10">
                     <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors">{f.name}</h3>
                     <div className="p-6 bg-black/40 rounded-3xl border border-white/5 shadow-inner">
                        <p className="text-xl font-mono text-cyan-400 font-bold tracking-tight italic">
                           {f.equation}
                        </p>
                     </div>
                     <p className="text-[13px] text-obsidian-500 italic leading-relaxed">
                        "{f.desc}"
                     </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-4 relative z-10">
                     <div className="size-2 rounded-full bg-green-500 shadow-[0_0_10px_green]"></div>
                     <span className="text-[9px] font-black text-obsidian-600 uppercase tracking-widest">Mainnet_Verified_Logic</span>
                  </div>
               </div>
             ))}
          </div>
          
          <div className="mt-20 p-12 bg-black/40 rounded-[60px] border-2 border-dashed border-white/5 text-center space-y-6">
             <span className="material-symbols-outlined text-[64px] text-obsidian-800 italic">psychology</span>
             <p className="text-xl text-obsidian-600 max-w-2xl mx-auto italic font-medium">
                "Memorizing these formulas is not about passing a test. It is about understanding the gravity of the user's eye."
             </p>
          </div>
       </div>
    </div>
  );
};

export default FormulaReference;
