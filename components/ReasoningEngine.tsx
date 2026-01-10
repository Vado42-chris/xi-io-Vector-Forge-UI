
import React, { useState, useEffect } from 'react';

const ReasoningEngine: React.FC = () => {
  const [nodes, setNodes] = useState<{ id: string, label: string, active: boolean, impact: number }[]>([]);

  useEffect(() => {
    setNodes([
      { id: '1', label: 'USER_FRICTION', active: true, impact: 84 },
      { id: '2', label: 'GPU_BUDGET', active: true, impact: 42 },
      { id: '3', label: 'CONVERSION_LIFT', active: false, impact: 91 },
      { id: '4', label: 'NETWORK_LATENCY', active: true, impact: 12 },
      { id: '5', label: 'ACCESSIBILITY_AA', active: true, impact: 100 },
      { id: '6', label: 'REVENUE_TARGETS', active: false, impact: 65 },
    ]);
  }, []);

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-700">
      <div className="h-12 border-b border-white/5 bg-obsidian-100 flex items-center justify-between px-6">
         <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-sm animate-spin">hub</span>
            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Reasoning_Kernel_0x // 10-Body_Pre_Computation</span>
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-20 relative">
         <div className="absolute inset-0 canvas-grid opacity-10"></div>
         
         <div className="relative size-[600px] flex items-center justify-center">
            {/* CENTRAL REASONING CORE */}
            <div className="size-48 rounded-[60px] bg-primary/10 border border-primary/30 flex items-center justify-center shadow-2xl relative z-20 overflow-hidden group">
               <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
               <span className="material-symbols-outlined text-[80px] text-primary relative z-10 font-black">psychology</span>
            </div>

            {/* ORBITING CONSTRAINTS */}
            {nodes.map((n, i) => (
              <div 
                key={n.id}
                className="absolute transition-all duration-1000"
                style={{ 
                  transform: `rotate(${i * (360 / nodes.length)}deg) translateY(-240px) rotate(-${i * (360 / nodes.length)}deg)` 
                }}
              >
                 <div className={`p-6 rounded-[32px] border bg-obsidian-100 shadow-2xl flex flex-col gap-4 items-center text-center transition-all hover:scale-110 ${n.active ? 'border-primary shadow-primary/10' : 'border-white/5 opacity-40'}`}>
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">{n.label}</span>
                    <div className="size-12 flex items-center justify-center relative">
                       <svg className="size-full -rotate-90">
                          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                          <circle cx="24" cy="24" r="20" fill="none" stroke="#FF9800" strokeWidth="4" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * n.impact) / 100} strokeLinecap="round" />
                       </svg>
                       <span className="absolute text-[10px] font-black text-primary mono">{n.impact}%</span>
                    </div>
                 </div>
              </div>
            ))}

            {/* CONNECTOR LINES */}
            <svg className="absolute inset-0 size-full pointer-events-none z-10">
               {nodes.map((n, i) => (
                 <line 
                   key={i} 
                   x1="300" y1="300" 
                   x2={300 + Math.cos((i * (360 / nodes.length) - 90) * Math.PI / 180) * 180} 
                   y2={300 + Math.sin((i * (360 / nodes.length) - 90) * Math.PI / 180) * 180} 
                   stroke="rgba(255,152,0,0.2)" 
                   strokeWidth="1" 
                   strokeDasharray="5 5"
                 />
               ))}
            </svg>
         </div>

         <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center space-y-4 max-w-2xl">
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Thinking_Before_Forging</h3>
            <p className="text-lg text-obsidian-500 font-medium italic">
              "The AI is currently simulating 14,200 interaction scenarios. We solve the 10-body problem of design constraints so you don't have to."
            </p>
         </div>
      </div>
    </div>
  );
};

export default ReasoningEngine;
