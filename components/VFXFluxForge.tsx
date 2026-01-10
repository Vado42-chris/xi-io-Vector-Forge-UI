
import React, { useState, useEffect } from 'react';

const VFXFluxForge: React.FC = () => {
  const [emissionRate, setEmissionRate] = useState(50);
  const [turbulence, setTurbulence] = useState(20);
  const [isBaking, setIsBaking] = useState(false);
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, delay: number }[]>([]);

  useEffect(() => {
    // Generate a pool of particles for the simulation
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  const handleBake = () => {
    setIsBaking(true);
    setTimeout(() => setIsBaking(false), 2000);
  };

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-700">
      <div className="flex-1 flex">
        {/* SIMULATION AREA */}
        <div className="flex-1 p-12 flex flex-col items-center justify-center relative bg-black/40 overflow-hidden">
           <div className="absolute top-6 left-6 z-10 flex gap-4">
              <div className="px-4 py-2 bg-black/60 border border-white/10 rounded-xl backdrop-blur-md flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary text-sm animate-spin">flare</span>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Flux_Emitter_V1</span>
              </div>
           </div>

           {/* EMITTER VISUALIZATION */}
           <div className="relative w-full max-w-4xl aspect-video bg-obsidian-100 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 canvas-grid opacity-10"></div>
              
              {/* PARTICLE LAYER */}
              <div className="absolute inset-0 pointer-events-none">
                 {particles.map(p => (
                   <div 
                     key={p.id}
                     className="absolute size-1 bg-primary rounded-full shadow-[0_0_15px_var(--xi-vector-500)]"
                     style={{
                       left: `${p.x}%`,
                       top: `${p.y}%`,
                       opacity: (emissionRate / 100),
                       animation: `scanning ${3 - (turbulence / 50)}s linear infinite`,
                       animationDelay: `${p.delay}s`
                     }}
                   ></div>
                 ))}
                 {/* CENTRAL EMITTER CORE */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-24 bg-primary/20 blur-3xl rounded-full animate-pulse"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 bg-primary rounded-full shadow-[0_0_40px_var(--xi-vector-500)]"></div>
              </div>

              {isBaking && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl z-20">
                   <div className="size-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                   <div className="mt-8 flex flex-col items-center gap-3">
                      <span className="text-xl font-black text-white uppercase tracking-[0.5em]">Baking_Manifest</span>
                      <span className="text-[9px] font-mono text-primary animate-pulse uppercase tracking-[0.2em]">Writing_Physics_Kernel_0x...</span>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* PARAMETER SIDEBAR */}
        <div className="w-96 bg-obsidian-100 border-l border-white/5 p-8 flex flex-col gap-10 shadow-2xl">
           <div className="space-y-4">
              <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.3em]">Emission_Parameters</span>
              <div className="space-y-8 p-6 bg-black/20 rounded-[32px] border border-white/5">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-white uppercase tracking-widest">
                       <span>Rate</span>
                       <span className="text-primary font-mono">{emissionRate}%</span>
                    </div>
                    <input 
                      type="range" value={emissionRate} onChange={(e) => setEmissionRate(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/5 rounded-full appearance-none accent-primary" 
                    />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-white uppercase tracking-widest">
                       <span>Turbulence</span>
                       <span className="text-primary font-mono">{turbulence}%</span>
                    </div>
                    <input 
                      type="range" value={turbulence} onChange={(e) => setTurbulence(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/5 rounded-full appearance-none accent-primary" 
                    />
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.3em]">Flux_Presets</span>
              <div className="grid grid-cols-2 gap-4">
                 {['NEON_PULSE', 'PLASMA_DRIVE', 'VOID_DRIFT', 'CORE_VENT'].map(p => (
                   <button key={p} className="p-4 bg-obsidian-200 border border-white/5 rounded-2xl text-[8px] font-black text-obsidian-500 uppercase tracking-widest hover:border-primary/40 hover:text-white transition-all text-center">
                      {p}
                   </button>
                 ))}
              </div>
           </div>

           <div className="mt-auto space-y-6">
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-[32px] space-y-3">
                 <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">hub</span>
                    <span className="text-[10px] font-black text-white uppercase">Physics_Handshake</span>
                 </div>
                 <p className="text-[8px] text-obsidian-500 italic leading-relaxed">
                   Compiling these flux parameters into a Logic Shard will cost 250 CORE credits upon marketplace deployment.
                 </p>
              </div>
              <button 
                onClick={handleBake}
                disabled={isBaking}
                className="w-full py-6 bg-primary text-white rounded-[32px] text-[12px] font-black uppercase tracking-[0.5em] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-4"
              >
                 <span className="material-symbols-outlined text-[24px]">save</span>
                 Bake_Flux_Shard
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VFXFluxForge;
