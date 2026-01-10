
import React, { useState } from 'react';

const UserTestingMCP: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const startSim = () => {
    setIsRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return p + 2;
      });
    }, 40);
  };

  const metrics = [
    { label: 'COGNITIVE_FRICTION', val: '0.12μ', score: 98, status: 'EXCELLENT' },
    { label: 'VISUAL_SEARCH_Δt', val: '0.84s', score: 92, status: 'STABLE' },
    { label: 'DECISION_UNCERTAINTY', val: '12%', score: 85, status: 'HIGH' },
    { label: 'USER_DELIGHT_INDEX', val: '9.8', score: 100, status: 'MAX_YIELD' },
  ];

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-1000">
       <div className="h-16 border-b border-white/5 bg-obsidian-100 flex items-center justify-between px-10 shrink-0 shadow-lg relative z-10">
          <div className="flex items-center gap-6">
             <div className="size-11 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                <span className="material-symbols-outlined text-[28px] animate-pulse">biotech</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[14px] font-black text-white uppercase tracking-[0.2em] italic leading-tight">Virtual_User_MCP // Seed001</span>
                <span className="text-[8px] font-mono text-obsidian-600 uppercase tracking-widest italic">Simulation_Kernel_Active // #HallbergMaths</span>
             </div>
          </div>
          <button 
            onClick={startSim}
            disabled={isRunning}
            className="px-10 h-11 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-4 group overflow-hidden relative"
          >
             <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
             <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform relative z-10">play_circle</span>
             <span className="relative z-10">{isRunning ? 'Running_Recursive_Sim...' : 'Execute_Synthetic_User_Test'}</span>
          </button>
       </div>

       <div className="flex-1 flex overflow-hidden p-12 gap-12">
          {/* GAZE TRACKING VIEWPORT */}
          <div className="flex-1 bg-obsidian-100 border-2 border-white/5 rounded-[60px] relative overflow-hidden group shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
             <div className="absolute inset-0 canvas-grid opacity-10 pointer-events-none"></div>
             
             {/* SIMULATED HEATMAP CLOUDS */}
             <div className={`absolute top-1/4 left-1/3 size-96 bg-red-500/20 blur-[120px] rounded-full transition-all duration-1000 ${isRunning ? 'animate-pulse scale-125' : 'opacity-40'}`}></div>
             <div className={`absolute bottom-1/4 right-1/4 size-80 bg-amber-500/20 blur-[100px] rounded-full transition-all duration-1000 ${isRunning ? 'animate-pulse delay-700 scale-110' : 'opacity-30'}`}></div>
             
             {/* SYNTHETIC AGENT CURSOR (GAZE) */}
             <div className={`absolute size-10 border-2 border-primary rounded-full flex items-center justify-center transition-all duration-[3000ms] ease-in-out z-50 ${isRunning ? 'translate-x-[500px] translate-y-[300px] rotate-45' : 'translate-x-[200px] translate-y-[200px]'}`}>
                <div className="size-1.5 bg-primary rounded-full animate-ping shadow-[0_0_20px_orange]"></div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/90 border border-white/10 rounded-xl text-[8px] font-mono text-primary uppercase tracking-widest whitespace-nowrap shadow-2xl">
                   AGENT_GAZE_0x8A4
                </div>
             </div>

             {/* UI SCAN HUD */}
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-10">
                <div className="px-10 py-4 bg-black/80 border-2 border-white/10 rounded-[32px] backdrop-blur-3xl flex flex-col items-center text-center shadow-2xl transition-all group-hover:border-primary/20">
                   <span className="text-[13px] font-black text-white uppercase tracking-[0.4em] italic leading-none">UI_Friction_Heatmap</span>
                   <span className="text-[8px] font-mono text-obsidian-600 uppercase tracking-widest mt-2">Scenario: Checkout_Orchestration_V1</span>
                </div>
                {isRunning && (
                  <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500">
                     <div className="size-48 rounded-full border-8 border-primary/10 border-t-primary animate-spin"></div>
                     <span className="text-3xl font-black text-white italic tabular-nums">{progress}%</span>
                  </div>
                )}
             </div>

             {/* WIREFRAME MASK (DECORATIVE) */}
             <div className="absolute inset-24 border-2 border-white/5 rounded-[48px] pointer-events-none border-dashed opacity-40 group-hover:opacity-100 transition-opacity"></div>
          </div>

          {/* RESULTS SIDEBAR */}
          <div className="w-[480px] flex flex-col gap-10">
             <div className="bg-obsidian-100 border-2 border-white/5 rounded-[60px] p-12 space-y-12 flex-1 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                   <span className="material-symbols-outlined text-[200px] text-white">psychology</span>
                </div>
                
                <div className="flex items-center gap-6 relative z-10">
                   <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Hallberg_Heuristic_Audit</span>
                   <div className="h-px flex-1 bg-white/5"></div>
                </div>
                
                <div className="space-y-12 relative z-10">
                   {metrics.map(m => (
                     <div key={m.label} className="space-y-5 group/metric">
                        <div className="flex justify-between items-end">
                           <div className="flex flex-col gap-1">
                              <span className="text-[11px] font-black text-white uppercase tracking-widest group-hover/metric:text-primary transition-colors">{m.label}</span>
                              <span className="text-[9px] font-mono text-obsidian-600 uppercase italic font-bold">{m.val}</span>
                           </div>
                           <div className="flex flex-col items-end gap-1">
                              <span className="text-[8px] font-black text-primary uppercase tracking-widest">{m.status}</span>
                              <span className="text-3xl font-black italic tabular-nums text-white/40 group-hover/metric:text-primary transition-colors">{isRunning ? Math.round(Math.random()*100) : m.score}</span>
                           </div>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                           <div className="h-full bg-primary rounded-full transition-all duration-[1500ms] shadow-[0_0_20px_var(--xi-vector-glow)]" style={{ width: `${isRunning ? progress : m.score}%` }}></div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-auto p-8 bg-black/40 rounded-[40px] border border-white/5 italic text-[13px] text-obsidian-500 leading-relaxed relative z-10 group-hover:text-white/80 transition-colors">
                   "HallbergMaths identifies a potential bottleneck in the code-to-manifest transition. The user's gaze is stalling at the primary CTA for +140ms beyond industrial norms."
                </div>
             </div>

             <div className="bg-primary p-12 rounded-[60px] shadow-[0_40px_100px_rgba(255,152,0,0.3)] flex flex-col items-center text-center gap-6 relative overflow-hidden group active:scale-95 transition-all cursor-pointer">
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="material-symbols-outlined text-[64px] text-black font-black group-hover:scale-110 transition-transform">verified_user</span>
                <div className="space-y-2">
                   <span className="text-[18px] font-black text-black uppercase tracking-[0.4em] italic leading-none">Pass_UX_Audit</span>
                   <p className="text-[11px] font-black text-black/60 uppercase italic tracking-widest">Confidence Score: 98.42%</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default UserTestingMCP;
