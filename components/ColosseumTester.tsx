
import React, { useState, useEffect } from 'react';

const ColosseumTester: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [agentCount, setAgentCount] = useState(0);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setAgentCount(prev => (prev < 10000 ? prev + 580 : 10000));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAgentCount(0);
    }
  }, [isRunning]);

  const metrics = [
    { label: 'CONVERSION_PROBABILITY', val: '98%', desc: 'How likely simulated users are to complete the transaction.', score: 98, status: 'EXCELLENT' },
    { label: 'EYE_FRICTION_COEFF', val: '0.12μ', desc: 'Visual cognitive weight based on Hallberg contrast standards.', score: 82, status: 'NOMINAL' },
    { label: 'ESTIMATED_REVENUE_LIFT', val: '+14.2%', desc: 'Predicted CORE yield increase versus baseline designs.', score: 94, status: 'FAST' },
    { label: 'REFERRAL_POTENTIAL', val: 'HIGH', desc: 'Likelihood of a user generating secondary derivation revenue.', score: 88, status: 'YIELDING' },
  ];

  return (
    <div className="flex-1 bg-obsidian-950 flex flex-col h-full overflow-hidden animate-in fade-in duration-700">
       {/* 1. ARENA HEADER (NON-SCROLLING) */}
       <div className="h-24 shrink-0 border-b border-white/5 bg-obsidian-850 flex items-center justify-between px-12 z-50 shadow-2xl relative">
          <div className="flex items-center gap-12">
             <div className="size-16 rounded-[24px] bg-red-600 flex items-center justify-center text-white shadow-[0_0_40px_rgba(220,38,38,0.4)] animate-pulse">
                <span className="material-symbols-outlined text-[40px] font-black">biotech</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[22px] font-black text-white uppercase italic tracking-tighter leading-none">Simulation_Arena</span>
                <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest italic font-bold mt-2">Wargaming Design Yield vs Machine Intent</span>
             </div>
          </div>

          <div className="flex items-center gap-20">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-widest mb-1.5">Synthetic_User_Pool</span>
                <span className="text-[32px] font-black text-primary italic tabular-nums leading-none tracking-tighter">{agentCount.toLocaleString()} / 10,000</span>
             </div>
             <button 
               onClick={() => setIsRunning(!isRunning)}
               className={`h-16 px-16 rounded-[20px] text-[14px] font-black uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 flex items-center gap-8 group overflow-hidden relative ${isRunning ? 'bg-red-600 text-white border-red-500' : 'bg-primary text-black border-primary hover:bg-white'}`}
             >
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className={`material-symbols-outlined text-[28px] ${isRunning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`}>
                   {isRunning ? 'stop' : 'play_arrow'}
                </span>
                <span className="relative z-10">{isRunning ? 'TERMINATE_SIM' : 'START_WARGAME'}</span>
             </button>
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden p-12 gap-12 bg-black/40">
          {/* 2. SIMULATION VIEWPORT (SCROLLABLE) */}
          <div className="flex-1 bg-obsidian-900 border-2 border-white/5 rounded-[64px] relative overflow-hidden group shadow-[inset_0_0_200px_rgba(0,0,0,0.9)] flex flex-col">
             <div className="absolute inset-0 canvas-grid opacity-[0.05] pointer-events-none"></div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar p-24 relative z-10">
                <div className="min-h-[1200px] w-full flex flex-col items-center justify-start gap-24">
                   <div className="px-24 py-16 bg-obsidian-800/90 border-2 border-white/10 rounded-[80px] backdrop-blur-3xl flex flex-col items-center text-center shadow-[0_80px_200px_rgba(0,0,0,1)] relative overflow-hidden max-w-3xl group/hud">
                      <div className="absolute inset-0 bg-red-600/5 animate-pulse"></div>
                      <span className="text-[28px] font-black text-white uppercase tracking-[0.5em] italic leading-none relative z-10">Scan_Protocol</span>
                      <div className="h-px w-32 bg-primary/40 my-10 relative z-10"></div>
                      <p className="text-[16px] font-mono text-obsidian-400 uppercase tracking-widest leading-relaxed relative z-10 italic">
                         Simulating thousands of high-intent users navigating your current forked components.
                      </p>
                      {isRunning && (
                        <div className="mt-14 flex items-center gap-5 animate-bounce text-primary font-black uppercase text-[12px] tracking-[0.5em] relative z-10">
                          <span className="material-symbols-outlined text-[20px]">analytics</span>
                          De-compiling Intent Shards...
                        </div>
                      )}
                   </div>

                   {/* SIMULATED LAYOUT NODES */}
                   <div className="grid grid-cols-2 gap-12 w-full opacity-20 grayscale pointer-events-none transition-all duration-1000 group-hover:opacity-40">
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="h-64 rounded-[48px] border-2 border-dashed border-white/20 flex items-center justify-center">
                           <span className="text-[12px] font-black uppercase italic tracking-[0.5em]">Logic_Node_0x{i}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* 3. FIXED HUD FOOTER */}
             <div className="absolute bottom-16 right-16 z-20 flex gap-10">
                <div className="p-12 bg-black/95 rounded-[40px] border border-white/10 space-y-6 shadow-2xl backdrop-blur-3xl group/yield hover:border-primary/40 transition-all">
                   <span className="text-[12px] font-black text-primary uppercase tracking-[0.5em] block opacity-60">Estimated_Revenue_Lift</span>
                   <span className="text-6xl font-black text-white italic tabular-nums leading-none tracking-tighter group-hover:scale-105 transition-transform block">+14.2% <span className="text-sm uppercase">(EST)</span></span>
                </div>
             </div>
          </div>

          {/* 4. TELEMETRY SIDEBAR (SCROLLABLE) */}
          <div className="w-[580px] flex flex-col gap-12 h-full overflow-hidden">
             <div className="bg-obsidian-850 border border-white/10 rounded-[64px] p-14 flex flex-col flex-1 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-14 opacity-[0.03] group-hover:scale-125 transition-transform duration-[6000ms]">
                   <span className="material-symbols-outlined text-[350px] text-white font-black">monitoring</span>
                </div>
                
                <div className="space-y-4 relative z-10 mb-12">
                   <span className="text-[12px] font-black text-primary uppercase tracking-[0.7em] italic">Business_Intelligence_Report</span>
                   <h3 className="text-6xl font-black text-obsidian-50 uppercase italic tracking-tighter leading-none">Yield_Audit</h3>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-8 space-y-14 relative z-10 pb-10">
                   {metrics.map(m => (
                     <div key={m.label} className="space-y-6 group/stat">
                        <div className="flex justify-between items-end">
                           <div className="flex flex-col gap-2">
                              <span className="text-[16px] font-black text-white uppercase tracking-widest group-hover/stat:text-primary transition-colors">{m.label}</span>
                              <p className="text-[11px] text-obsidian-500 italic max-w-[240px] leading-relaxed uppercase font-bold">{m.desc}</p>
                           </div>
                           <span className="text-6xl font-black italic tabular-nums text-obsidian-700 group-hover/stat:text-primary transition-colors">{isRunning ? Math.round(Math.random() * 20 + 80) : m.score}</span>
                        </div>
                        <div className="h-5 w-full bg-black rounded-full overflow-hidden p-1 shadow-inner border border-white/5">
                           <div 
                            className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_30px_var(--xi-accent)] ${m.score > 90 ? 'bg-primary' : 'bg-red-600'}`} 
                            style={{ width: `${isRunning ? (Math.random() * 25 + 75) : m.score}%` }}
                           ></div>
                        </div>
                     </div>
                   ))}

                   <div className="p-12 bg-obsidian-950/80 rounded-[48px] border-2 border-white/5 italic text-[17px] text-obsidian-400 leading-relaxed shadow-2xl group-hover:text-obsidian-50 transition-colors">
                      "Simulator Conclusion: Your current Gaze Friction in Sector 03 is spiking. Injecting a 'Silent Geometry' shard from the Marketplace is predicted to increase conversion yield by +4.2% CORE."
                   </div>
                </div>
             </div>

             <div className="bg-primary p-14 rounded-[64px] shadow-[0_60px_150px_rgba(184,134,11,0.25)] flex flex-col items-center text-center gap-10 shrink-0 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer border-2 border-primary/40">
                <div className="absolute inset-0 bg-white/25 -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms]"></div>
                <span className="material-symbols-outlined text-[100px] text-black font-black">verified_user</span>
                <div className="space-y-3">
                   <span className="text-[28px] font-black text-black uppercase tracking-[0.5em] italic leading-none">Validate_Market_Fit</span>
                   <p className="text-[14px] font-bold text-black/50 uppercase italic tracking-widest leading-none mt-2">Confidence_Audit: 98.42%_SECURE</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default ColosseumTester;
