
import React, { useState } from 'react';

const HallbergSimulab: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  
  const simMetrics = [
    { label: 'VISUAL_SEARCH_TIME', val: '0.84s', score: 92 },
    { label: 'COGNITIVE_FRICTION', val: '0.12μ', score: 88 },
    { label: 'DECISION_UNCERTAINTY', val: '14%', score: 95 },
    { label: 'USER_DELIGHT_COEFF', val: '0.98', score: 100 }
  ];

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-700">
       <div className="h-14 border-b border-white/5 bg-obsidian-100 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
             <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-sm">biotech</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[11px] font-black text-white uppercase tracking-tight italic">Hallberg_Simulab_v2</span>
                <span className="text-[7px] font-mono text-obsidian-600 uppercase">Virtual_UX_Testing_Kernel</span>
             </div>
          </div>
          <button 
            onClick={() => { setIsRunning(true); setTimeout(() => setIsRunning(false), 3000); }}
            className={`px-8 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isRunning ? 'bg-obsidian-300 text-obsidian-500' : 'bg-primary text-white shadow-xl shadow-primary/20'}`}
          >
             {isRunning ? 'Running_Sim_Recursive...' : 'Initiate_UX_Simulation'}
          </button>
       </div>

       <div className="flex-1 flex overflow-hidden p-12 gap-12">
          {/* SIMULATION VIEWPORT */}
          <div className="flex-1 bg-black/40 border border-white/5 rounded-[60px] relative overflow-hidden group">
             <div className="absolute inset-0 canvas-grid opacity-10"></div>
             
             {/* SIMULATED USER CURSOR */}
             <div className={`absolute size-8 border-2 border-primary/40 rounded-full flex items-center justify-center transition-all duration-[2000ms] ease-in-out ${isRunning ? 'translate-x-[400px] translate-y-[200px]' : 'translate-x-1/2 translate-y-1/2'}`}>
                <div className="size-1 bg-primary rounded-full animate-ping shadow-[0_0_15px_orange]"></div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 rounded-md text-[7px] font-mono text-primary uppercase whitespace-nowrap">SIM_AGENT_01_GAZE</div>
             </div>

             {/* FRICTION HEATMAPS (MOCKED) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-6">
                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter opacity-10 select-none">#Hallberg_Maths_Lab</h3>
                {isRunning && (
                  <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center gap-4">
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] animate-pulse">Calculating_Experience_Delta...</span>
                     <div className="size-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                  </div>
                )}
             </div>

             <div className="absolute bottom-10 left-10 p-6 bg-obsidian-100 rounded-3xl border border-white/10 shadow-2xl">
                <span className="text-[8px] font-black text-obsidian-600 uppercase tracking-widest block mb-4">Gaze_Tracking_Manifest</span>
                <div className="space-y-2">
                   <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary w-4/5"></div></div>
                   <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary w-2/5"></div></div>
                   <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary w-3/5"></div></div>
                </div>
             </div>
          </div>

          {/* HEURISTIC SIDEBAR */}
          <div className="w-[440px] space-y-8">
             <div className="bg-obsidian-100 border border-white/5 rounded-[40px] p-10 space-y-12">
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.5em]">Quantitative_UX_Analysis</span>
                
                <div className="space-y-10">
                   {simMetrics.map(m => (
                     <div key={m.label} className="space-y-4 group">
                        <div className="flex justify-between items-end">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{m.label}</span>
                              <span className="text-[8px] font-mono text-obsidian-600 uppercase">{m.val}</span>
                           </div>
                           <span className="text-2xl font-black italic tabular-nums text-white/40 group-hover:text-primary transition-colors">{m.score}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                           <div className="h-full bg-primary rounded-full shadow-[0_0_10px_orange] transition-all duration-1000" style={{ width: `${m.score}%` }}></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="p-8 bg-primary text-black rounded-[40px] shadow-2xl shadow-primary/20 flex flex-col items-center text-center gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="material-symbols-outlined text-[48px] font-black">verified_user</span>
                <div className="space-y-1">
                   <span className="text-[14px] font-black uppercase tracking-[0.3em]">Pass_Heuristic_Check</span>
                   <p className="text-[9px] font-bold uppercase opacity-60 italic">Product_Market_Fit_Score: 9.8/10</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default HallbergSimulab;
