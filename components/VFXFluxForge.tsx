
import React, { useState, useEffect } from 'react';
import { XI_Button, XI_ProgressGauge, XI_Telemetry } from './IndustrialPrimitives';

const VFXFluxForge: React.FC = () => {
  const [emissionRate, setEmissionRate] = useState(50);
  const [turbulence, setTurbulence] = useState(20);
  const [isBaking, setIsBaking] = useState(false);
  const [collisionMode, setCollisionMode] = useState<'ADHESION' | 'BOUNCE'>('ADHESION');
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, delay: number, normal: number }[]>([]);

  useEffect(() => {
    // Generate particles mapped to NURBS 2.0 normals
    const newParticles = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      normal: Math.random() * 360
    }));
    setParticles(newParticles);
  }, []);

  const handleBake = () => {
    setIsBaking(true);
    setTimeout(() => setIsBaking(false), 2000);
  };

  return (
    <div className="flex-1 bg-obsidian-950 flex flex-col overflow-hidden animate-in fade-in duration-700">
      <div className="flex-1 flex">
        {/* SIMULATION AREA */}
        <div className="flex-1 p-12 flex flex-col items-center justify-center relative bg-black/60 overflow-hidden">
           <div className="absolute top-6 left-6 z-10 flex gap-4">
              <div className="px-6 py-3 bg-black/80 border border-white/10 rounded-2xl backdrop-blur-md flex items-center gap-4">
                 <span className="material-symbols-outlined text-primary text-xl animate-spin">flare</span>
                 <div className="flex flex-col">
                    <span className="text-[11px] font-black text-white uppercase tracking-widest leading-none">Flux_Manifold_v61</span>
                    <span className="text-[8px] font-mono text-obsidian-600 uppercase mt-1 italic">
                       NURBS_Collision: {collisionMode} // RADIOSITY: 0x84
                    </span>
                 </div>
              </div>
           </div>

           {/* EMITTER VISUALIZATION */}
           <div className="relative w-full max-w-5xl aspect-video bg-obsidian-900 rounded-[40px] border-2 border-white/5 shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden group">
              <div className="absolute inset-0 canvas-grid opacity-10"></div>
              
              {/* PARTICLE LAYER (NURBS MAPPED) */}
              <div className="absolute inset-0 pointer-events-none">
                 {particles.map(p => (
                   <div 
                     key={p.id}
                     className={`absolute rounded-full shadow-[0_0_15px_rgba(184,134,11,0.5)] transition-all duration-1000 ${collisionMode === 'ADHESION' ? 'size-0.5 bg-cyan-400' : 'size-1 bg-primary'}`}
                     style={{
                       left: `${p.x}%`,
                       top: `${p.y}%`,
                       opacity: (emissionRate / 100),
                       animation: `scanning ${3 - (turbulence / 50)}s linear infinite`,
                       animationDelay: `${p.delay}s`,
                       transform: `rotate(${p.normal}deg) translateX(${collisionMode === 'ADHESION' ? '0px' : '40px'})`
                     }}
                   ></div>
                 ))}
                 
                 {/* NURBS 2.0 GUIDE WIREFRAME (MOCKED) */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <svg className="w-full h-full">
                       <path d="M 100 400 Q 500 100 900 400" stroke="#b8860b" strokeWidth="1" fill="none" strokeDasharray="5 5" />
                       <path d="M 100 300 Q 500 0 900 300" stroke="#06b6d4" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
                    </svg>
                 </div>

                 {/* RADIOSITY CORE */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-48 bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-6 bg-primary rounded-full shadow-[0_0_60px_var(--xi-accent)]"></div>
              </div>

              {isBaking && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl z-20">
                   <div className="size-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                   <div className="mt-8 flex flex-col items-center gap-3 text-center">
                      <span className="text-3xl font-black text-white uppercase italic tracking-tighter">Baking_NURBS_Flux</span>
                      <span className="text-[10px] font-mono text-primary animate-pulse uppercase tracking-[0.4em]">Compiling_Physics_Handshake_0x84</span>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* PARAMETER SIDEBAR */}
        <div className="w-[420px] bg-obsidian-900 border-l border-white/5 p-12 flex flex-col gap-12 shadow-2xl overflow-y-auto custom-scrollbar">
           <div className="space-y-6">
              <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-[0.4em] italic">v61_NURBS_Orchestration</span>
              <div className="space-y-10 p-8 bg-black/40 rounded-[32px] border border-white/5 shadow-inner">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[9px] font-black text-white uppercase tracking-widest">
                       <span>Emission_Rate</span>
                       <span className="text-primary font-mono">{emissionRate}%</span>
                    </div>
                    <input 
                      type="range" value={emissionRate} onChange={(e) => setEmissionRate(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/5 rounded-full appearance-none accent-primary" 
                    />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[9px] font-black text-white uppercase tracking-widest">
                       <span>NURBS_Turbulence</span>
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
              <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-[0.4em] italic">Collision_Logic</span>
              <div className="grid grid-cols-2 gap-4">
                 <button 
                  onClick={() => setCollisionMode('ADHESION')}
                  className={`p-6 rounded-[24px] border text-center transition-all ${collisionMode === 'ADHESION' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-obsidian-200 border-white/5 text-obsidian-500 hover:text-white'}`}
                 >
                    <span className="text-[9px] font-black uppercase tracking-widest">NURBS_Adhesion</span>
                 </button>
                 <button 
                  onClick={() => setCollisionMode('BOUNCE')}
                  className={`p-6 rounded-[24px] border text-center transition-all ${collisionMode === 'BOUNCE' ? 'bg-primary/10 border-primary text-primary' : 'bg-obsidian-200 border-white/5 text-obsidian-500 hover:text-white'}`}
                 >
                    <span className="text-[9px] font-black uppercase tracking-widest">Surface_Bounce</span>
                 </button>
              </div>
           </div>

           <div className="mt-auto space-y-8">
              <div className="p-8 bg-primary/5 border-2 border-primary/20 rounded-[40px] space-y-4 shadow-inner">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-black shadow-2xl">
                       <span className="material-symbols-outlined font-black">radiocheck</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[14px] font-black text-white uppercase italic tracking-tight leading-none">Photoreal_Sync</span>
                       <span className="text-[8px] font-mono text-primary uppercase mt-1 italic font-bold">RADIOSITY_ACTIVE</span>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <XI_ProgressGauge label="NORMAL_ALIGNMENT_PARITY" value={98} color="#06b6d4" />
                    <XI_ProgressGauge label="FLUX_DENSITY_STABILITY" value={92} color="#b8860b" />
                 </div>
                 <p className="text-[10px] text-obsidian-500 italic leading-relaxed">
                   "Particles will adhere to the NURBS manifold normals at 0.12μ friction. Ready for photorealistic bake."
                 </p>
              </div>
              
              <div className="flex gap-4">
                 <XI_Button 
                   label="Execute_GI_Bake" 
                   variant="primary" 
                   icon="bolt" 
                   className="flex-1 h-20 rounded-[32px]" 
                   onClick={handleBake}
                 />
                 <button className="size-20 rounded-[32px] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all">
                    <span className="material-symbols-outlined">settings_overscan</span>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VFXFluxForge;
