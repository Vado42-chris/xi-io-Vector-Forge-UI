
import React, { useState, useEffect } from 'react';

const ConstraintPhysicsSim: React.FC = () => {
  const [bodies, setBodies] = useState<{ id: number, label: string, mass: number, x: number, y: number, orbit: number, friction: number }[]>([]);
  const [isSolving, setIsSolving] = useState(false);

  useEffect(() => {
    // Initializing the 10-Body UI Problem
    setBodies([
      { id: 1, label: 'CTA_PRIMARY', mass: 100, x: 50, y: 50, orbit: 180, friction: 0.12 },
      { id: 2, label: 'BRAND_VOICE', mass: 80, x: 30, y: 30, orbit: 240, friction: 0.08 },
      { id: 3, label: 'INPUT_LATENCY', mass: 40, x: 70, y: 30, orbit: 120, friction: 0.95 },
      { id: 4, label: 'GPU_OVERHEAD', mass: 60, x: 50, y: 80, orbit: 280, friction: 0.42 },
      { id: 5, label: 'AA_COMPLIANCE', mass: 90, x: 20, y: 70, orbit: 320, friction: 0.02 },
      { id: 6, label: 'COGNITIVE_WAIT', mass: 70, x: 80, y: 70, orbit: 60, friction: 0.65 },
      { id: 7, label: 'VRAM_BUDGET', mass: 50, x: 40, y: 20, orbit: 15, friction: 0.15 },
      { id: 8, label: 'API_ROUNDTRIP', mass: 30, x: 60, y: 20, orbit: 95, friction: 0.50 },
      { id: 9, label: 'DATA_FIDELITY', mass: 85, x: 40, y: 40, orbit: 200, friction: 0.05 },
      { id: 10, label: 'MOBILE_SCALING', mass: 75, x: 60, y: 60, orbit: 345, friction: 0.22 },
    ]);
  }, []);

  const solveEquilibrium = () => {
    setIsSolving(true);
    setTimeout(() => {
      setBodies(prev => prev.map(b => ({ ...b, orbit: (b.orbit + (Math.random() * 40 + 20)) % 360 })));
      setIsSolving(false);
    }, 2500);
  };

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-700">
       <div className="h-16 border-b border-white/5 bg-obsidian-100 flex items-center justify-between px-12 shrink-0 shadow-2xl relative z-10">
          <div className="flex items-center gap-8">
             <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-inner group">
                <span className="material-symbols-outlined text-[32px] animate-spin-slow group-hover:animate-spin transition-all">hub</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[16px] font-black text-white uppercase tracking-[0.3em] italic leading-tight">UX_Constraint_Solver</span>
                <span className="text-[9px] font-mono text-obsidian-600 uppercase tracking-widest italic font-bold">Solving_10_Body_Equilibrium // #HallbergMaths</span>
             </div>
          </div>
          <div className="flex items-center gap-12">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-obsidian-600 uppercase tracking-widest leading-none mb-1.5">System_Entropy</span>
                <span className="text-[20px] font-black text-amber-500 italic tabular-nums leading-none">0.142μ</span>
             </div>
             <button 
               onClick={solveEquilibrium}
               disabled={isSolving}
               className="h-12 px-12 bg-primary text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.5em] shadow-[0_20px_60px_rgba(255,152,0,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-6 group overflow-hidden relative"
             >
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms]"></div>
                <span className={`material-symbols-outlined text-[24px] ${isSolving ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-1000'}`}>sync</span>
                <span className="relative z-10">{isSolving ? 'Solving_Vectors...' : 'Re-Balance_Attention'}</span>
             </button>
          </div>
       </div>

       <div className="flex-1 p-24 relative flex items-center justify-center overflow-hidden bg-black/70 group">
          <div className="absolute inset-0 canvas-grid opacity-[0.15] pointer-events-none transition-opacity group-hover:opacity-[0.25] duration-1000"></div>
          
          {/* THE GAZE ORBITS */}
          <div className="absolute size-[1000px] border border-white/5 rounded-full pointer-events-none group-hover:border-primary/5 transition-colors duration-1000 animate-pulse"></div>
          <div className="absolute size-[800px] border border-white/5 rounded-full pointer-events-none group-hover:border-primary/10 transition-colors duration-1000"></div>
          <div className="absolute size-[600px] border border-white/10 rounded-full pointer-events-none group-hover:border-primary/20 transition-colors duration-1000"></div>

          <div className="relative size-[900px] flex items-center justify-center">
             {/* THE USER CENTROID (THE SUN) */}
             <div className="size-80 rounded-full bg-primary/5 border-2 border-primary/20 flex items-center justify-center shadow-[0_0_250px_rgba(255,152,0,0.15)] relative z-20 overflow-hidden group/center cursor-help transition-all hover:scale-105">
                <div className="absolute inset-0 bg-primary/10 animate-ping duration-[3s]"></div>
                <div className="flex flex-col items-center gap-6 relative z-10">
                   <span className="material-symbols-outlined text-primary text-[100px] font-black group-hover/center:scale-110 transition-transform duration-1000">visibility</span>
                   <div className="flex flex-col items-center">
                      <span className="text-[12px] font-mono text-primary font-bold uppercase tracking-[0.6em]">Gaze_Centroid</span>
                      <span className="text-[9px] font-mono text-obsidian-600 uppercase tracking-widest mt-2">Mass: Limitless</span>
                   </div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover/center:opacity-100 transition-opacity bg-black/40 backdrop-blur-md flex items-center justify-center p-8 text-center text-[11px] font-mono italic text-white leading-relaxed">
                   "We define the interface around the human gaze, not the other way around. This is the first rule of the Forge."
                </div>
             </div>

             {/* THE 10 CONSTRAINT BODIES (PLANETS) */}
             {bodies.map((b, i) => (
               <div 
                 key={b.id}
                 className={`absolute group/body transition-all duration-[2500ms] ease-[cubic-bezier(0.95,0.05,0.1,0.95)] ${isSolving ? 'blur-xl scale-90 opacity-20' : ''}`}
                 style={{ 
                   transform: `rotate(${b.orbit}deg) translateY(-380px) rotate(-${b.orbit}deg)`,
                 }}
               >
                  <div className="flex flex-col items-center gap-10 hover:scale-110 transition-transform cursor-grab active:cursor-grabbing relative">
                     {/* RADIUS OF ATTENTION */}
                     <div className="absolute -inset-20 rounded-full border border-primary/5 group-hover/body:border-primary/30 transition-all duration-1000 pointer-events-none group-hover/body:bg-primary/5"></div>
                     
                     <div 
                        className="rounded-[60px] border-2 border-white/10 bg-obsidian-100 p-12 shadow-[0_60px_100px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center gap-6 relative overflow-hidden"
                        style={{ width: b.mass * 2, height: b.mass * 2 }}
                     >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent"></div>
                        <span className="text-[24px] font-black text-white italic relative z-10 tabular-nums">{b.mass}%</span>
                        <div className="h-2 rounded-full relative z-10 w-24 bg-white/5 overflow-hidden">
                           <div className={`h-full transition-all duration-1000 ${b.friction > 0.6 ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-primary/60 shadow-[0_0_15px_orange]'}`} style={{ width: `${b.friction * 100}%` }}></div>
                        </div>
                     </div>
                     <div className="px-8 py-4 bg-black/95 rounded-3xl backdrop-blur-3xl border-2 border-white/10 shadow-2xl flex flex-col items-center gap-2 transition-all group-hover/body:border-primary/60">
                        <span className="text-[13px] font-black text-white uppercase tracking-[0.4em] whitespace-nowrap italic">{b.label}</span>
                        <span className="text-[10px] font-mono text-obsidian-500 uppercase font-bold tracking-widest italic">Friction: {b.friction}μ</span>
                     </div>
                  </div>
               </div>
             ))}

             {/* GRAVITY LOGIC FILAMENTS */}
             <svg className="absolute inset-0 size-full pointer-events-none z-10 opacity-[0.2] group-hover:opacity-[0.4] transition-opacity duration-1000">
                {bodies.map((b, i) => (
                   <line 
                      key={i} 
                      x1="450" y1="450" 
                      x2={450 + Math.cos((b.orbit - 90) * Math.PI / 180) * 380} 
                      y2={450 + Math.sin((b.orbit - 90) * Math.PI / 180) * 380} 
                      stroke="#FF9800" 
                      strokeWidth="2.5" 
                      strokeDasharray="15 15" 
                      className={isSolving ? 'animate-[scanning_2s_linear_infinite]' : ''}
                   />
                ))}
             </svg>
          </div>

          {/* SIMULATION TELEMETRY DOCK */}
          <div className="absolute bottom-16 left-16 p-14 bg-obsidian-100/95 backdrop-blur-3xl border border-white/10 rounded-[80px] shadow-[0_80px_200px_rgba(0,0,0,1)] flex gap-24 items-center transition-all hover:border-primary/30 hover:bg-obsidian-100">
             <div className="flex flex-col gap-6">
                <span className="text-[13px] font-black text-primary uppercase tracking-[0.6em] italic">Equilibrium_Manifest</span>
                <div className="flex items-center gap-6">
                   <div className="size-5 rounded-full bg-green-500 shadow-[0_0_25px_green] animate-pulse"></div>
                   <span className="text-5xl font-black text-white uppercase tracking-tighter italic tabular-nums">98.84%_VALID</span>
                </div>
             </div>
             <div className="w-px h-24 bg-white/10"></div>
             <div className="flex flex-col gap-6">
                <span className="text-[13px] font-black text-obsidian-600 uppercase tracking-[0.6em] italic">Interaction_Pulse_Σ</span>
                <div className="flex gap-3 items-end h-16">
                   {[40, 90, 30, 100, 60, 100, 75, 55, 95, 35, 70, 50, 85, 40].map((h, i) => (
                      <div key={i} className="w-3 bg-primary/20 rounded-full hover:bg-primary transition-all duration-300 cursor-pointer shadow-[0_0_15px_transparent] hover:shadow-primary/40" style={{ height: `${h}%` }}></div>
                   ))}
                </div>
             </div>
          </div>

          <div className="absolute bottom-16 right-16 text-right max-w-xl">
             <h3 className="text-8xl font-black text-white uppercase italic tracking-tighter opacity-[0.05] leading-none select-none pointer-events-none">FORGING_GRAVITY...</h3>
             <p className="text-[14px] font-mono text-obsidian-600 uppercase mt-12 italic leading-relaxed font-bold tracking-[0.3em]">
               "Most interfaces are static. Ours is a planetary system where every pixel orbits the user's intent. Solve the math, solve the product."
             </p>
          </div>
       </div>
    </div>
  );
};

export default ConstraintPhysicsSim;
