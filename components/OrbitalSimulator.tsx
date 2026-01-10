
import React, { useState, useEffect } from 'react';

const OrbitalSimulator: React.FC = () => {
  const [bodies, setBodies] = useState<{ id: number, x: number, y: number, r: number, color: string }[]>([]);

  useEffect(() => {
    const newBodies = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: 50 + Math.cos(i * (Math.PI * 2 / 10)) * 30,
      y: 50 + Math.sin(i * (Math.PI * 2 / 10)) * 30,
      r: 2 + Math.random() * 4,
      color: i === 0 ? '#FF9800' : 'rgba(255,255,255,0.2)'
    }));
    setBodies(newBodies);
  }, []);

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-700">
       <div className="h-12 border-b border-white/5 bg-obsidian-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
             <span className="material-symbols-outlined text-primary text-sm animate-spin">hub</span>
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Cognition_Kernel // 10-Body_Sim</span>
          </div>
          <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-md">
             <span className="text-[9px] font-black text-primary uppercase">Reasoning_Depth: 0x8A4</span>
          </div>
       </div>

       <div className="flex-1 p-12 flex flex-col relative items-center justify-center overflow-hidden">
          <div className="absolute inset-0 canvas-grid opacity-10"></div>
          
          <div className="relative size-[600px] flex items-center justify-center">
             {/* ORBITAL PATHS */}
             <svg className="absolute inset-0 size-full pointer-events-none">
                <circle cx="300" cy="300" r="180" fill="none" stroke="rgba(255,152,0,0.05)" strokeWidth="1" strokeDasharray="5 5" />
                <circle cx="300" cy="300" r="120" fill="none" stroke="rgba(255,152,0,0.03)" strokeWidth="1" />
                
                {/* CONNECTOR THREADS (10-BODY LOGIC) */}
                {bodies.map((b, i) => (
                  <line 
                    key={i} 
                    x1="300" y1="300" 
                    x2={`${b.x}%`} y2={`${b.y}%`} 
                    stroke="rgba(255,152,0,0.1)" 
                    strokeWidth="0.5" 
                  />
                ))}
             </svg>

             {/* THE BODIES (CONSTRAINTS) */}
             {bodies.map(b => (
               <div 
                 key={b.id}
                 className="absolute animate-pulse"
                 style={{ 
                   left: `${b.x}%`, 
                   top: `${b.y}%`, 
                   width: b.r * 4, 
                   height: b.r * 4, 
                   backgroundColor: b.color,
                   borderRadius: '50%',
                   boxShadow: `0 0 20px ${b.color === '#FF9800' ? 'rgba(255,152,0,0.4)' : 'transparent'}`
                 }}
               ></div>
             ))}

             <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <div className="size-24 rounded-[32px] bg-primary/10 border border-primary/30 flex items-center justify-center shadow-2xl">
                   <span className="material-symbols-outlined text-[48px] text-primary">psychology</span>
                </div>
                <div className="space-y-1">
                   <span className="text-[12px] font-black text-white uppercase tracking-[0.4em] italic">AI_Inference_Sim</span>
                   <p className="text-[9px] font-mono text-obsidian-600 uppercase">Solving: Manifest_Collision_01</p>
                </div>
             </div>
          </div>

          {/* TELEMETRY OVERLAY */}
          <div className="absolute bottom-12 left-12 right-12 grid grid-cols-4 gap-6">
             {['Velocity', 'Entropy', 'Constraint_Load', 'Neural_Wait'].map(t => (
               <div key={t} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
                  <span className="text-[8px] font-black text-obsidian-600 uppercase tracking-widest">{t}</span>
                  <div className="flex items-end justify-between">
                     <span className="text-xl font-black text-white italic mono tabular-nums">{Math.round(Math.random() * 100)}%</span>
                     <div className="w-12 h-1 bg-primary/20 rounded-full"></div>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default OrbitalSimulator;
