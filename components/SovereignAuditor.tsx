
import React, { useState, useEffect } from 'react';
import { VectorLayer } from '../types';

interface SovereignAuditorProps {
  layers: VectorLayer[];
}

const SovereignAuditor: React.FC<SovereignAuditorProps> = ({ layers }) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);

  const startAudit = () => {
    setIsAuditing(true);
    setAuditProgress(0);
    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const metrics = [
    { label: 'Topological_Density', value: 82, color: 'primary' },
    { label: 'Kinetic_Stability', value: 64, color: 'amber-500' },
    { label: 'Neural_Harmony', value: 91, color: 'cyan-400' },
    { label: 'Vertex_Optimization', value: 45, color: 'purple-500' },
  ];

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-700">
      <div className="h-12 border-b border-white/5 bg-obsidian-100 flex items-center justify-between px-6 shrink-0">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary text-sm animate-pulse">fact_check</span>
               <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Sovereign_Auditor_v0.4</span>
            </div>
         </div>
         <button 
           onClick={startAudit}
           disabled={isAuditing}
           className="px-6 py-1 bg-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
         >
           {isAuditing ? 'Auditing_Node...' : 'Initiate_Full_Audit'}
         </button>
      </div>

      <div className="flex-1 flex overflow-hidden p-12 gap-12">
         {/* TELEMETRY GAUGES */}
         <div className="flex-1 grid grid-cols-2 gap-8 h-fit">
            {metrics.map(m => (
              <div key={m.label} className="bg-black/40 border border-white/5 rounded-[40px] p-10 flex flex-col items-center gap-6 relative group overflow-hidden">
                 <div className={`absolute top-0 left-0 w-full h-1 bg-${m.color}/20`}></div>
                 <div className="relative size-32 flex items-center justify-center">
                    <svg className="size-full -rotate-90">
                       <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                       <circle 
                         cx="64" cy="64" r="58" fill="none" 
                         stroke={`currentColor`} 
                         strokeWidth="8" 
                         className={`text-${m.color}`}
                         strokeDasharray={364.4}
                         strokeDashoffset={364.4 - (364.4 * (isAuditing ? auditProgress : m.value)) / 100}
                         strokeLinecap="round"
                         style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                       />
                    </svg>
                    <span className="absolute text-xl font-black text-white italic tabular-nums">{isAuditing ? Math.round(auditProgress) : m.value}%</span>
                 </div>
                 <div className="text-center space-y-1">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{m.label}</span>
                    <p className="text-[7px] font-mono text-obsidian-600 uppercase">SYS_AUDIT_PASS_STABLE</p>
                 </div>
              </div>
            ))}
         </div>

         {/* NEURAL CRITIQUE SIDEBAR */}
         <div className="w-[480px] flex flex-col gap-8">
            <div className="flex-1 bg-obsidian-100 border border-white/5 rounded-[40px] p-8 space-y-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <span className="material-symbols-outlined text-[120px] text-white">psychology</span>
               </div>
               
               <div className="space-y-2 relative z-10">
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Neural_Critique_Kernel</span>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Manifest_Integrity_Report</h3>
               </div>

               <div className="space-y-6 relative z-10 overflow-y-auto custom-scrollbar max-h-[400px] pr-2">
                  <p className="text-[13px] text-white/70 italic leading-relaxed">
                    "The current topological manifest exhibits high visual density with efficient Bezier orchestration. However, the vertex count in the 'Core_Chassis' layer is exceeding recommended deployment budgets for real-time kinetic rigs."
                  </p>
                  <div className="space-y-4">
                     <span className="text-[8px] font-black text-obsidian-500 uppercase tracking-widest block">Optimization_Suggestions</span>
                     <div className="space-y-2">
                        {[
                          'Collapse redundant cubic nodes in manifest_01',
                          'Re-balance vertex weights for Animation_Rig_X',
                          'Audit color harmony across Z-depth layers'
                        ].map((s, i) => (
                          <div key={i} className="flex gap-4 p-4 bg-black/20 rounded-2xl border border-white/5 group hover:border-primary/40 transition-all cursor-pointer">
                             <span className="text-primary font-mono text-[10px] font-bold">0{i+1}</span>
                             <span className="text-[10px] text-obsidian-400 group-hover:text-white uppercase font-black transition-colors">{s}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="mt-auto pt-8 border-t border-white/5 relative z-10">
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-[7px] font-black text-obsidian-600 uppercase">Audit_Hash</span>
                        <span className="text-[9px] font-mono text-white/40">0x82A..F91</span>
                     </div>
                     <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full flex items-center gap-3">
                        <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">READY_FOR_MAINNET</span>
                     </div>
                  </div>
               </div>
            </div>

            <button className="w-full py-6 bg-obsidian-100 border border-white/10 rounded-[32px] text-[12px] font-black text-white uppercase tracking-[0.5em] shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-4 group">
               <span className="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform">auto_fix_high</span>
               Auto_Optimize_All
            </button>
         </div>
      </div>
    </div>
  );
};

export default SovereignAuditor;
