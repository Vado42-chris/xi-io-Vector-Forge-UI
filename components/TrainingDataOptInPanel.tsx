
import React from 'react';
import { AppState, TrainingConfig } from '../types';
import { XI_Button, XI_ProgressGauge } from './IndustrialPrimitives';

interface TrainingDataOptInPanelProps {
  config: TrainingConfig;
  onUpdate: (patch: Partial<TrainingConfig>) => void;
  verboseMode?: boolean;
}

const TrainingDataOptInPanel: React.FC<TrainingDataOptInPanelProps> = ({ config, onUpdate, verboseMode = false }) => {
  const tiers = [
    { label: 'PROTECTED', depth: 0, benefit: 0, desc: 'Maximum privacy. Full subscription fee apply.' },
    { label: 'ANONYMIZED', depth: 40, benefit: 25, desc: 'Shared patterns help train basic layout kernels.' },
    { label: 'SOVEREIGN_SEED', depth: 80, benefit: 75, desc: 'Direct uplink to model training. 75% fee reduction.' },
    { label: 'FULL_SWARM', depth: 100, benefit: 100, desc: 'Total data transparency. AI Access is free.' }
  ];

  return (
    <div className="flex-1 bg-obsidian-900 p-10 flex flex-col gap-10 animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      <div className="space-y-4">
         <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">Training_Uplink_Configuration</span>
            <div className={`px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[9px] font-black text-primary uppercase`}>
               Tier: {tiers.find(t => config.optInDepth <= t.depth)?.label}
            </div>
         </div>
         <div className="p-8 bg-black/40 border border-white/5 rounded-[40px] space-y-12 shadow-2xl">
            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                     <span className="text-[13px] font-black text-white uppercase italic tracking-tight">{verboseMode ? 'Data Sharing Level' : 'Heuristic_Transmission_Depth'}</span>
                     <p className="text-[9px] text-obsidian-500 font-bold uppercase mt-1 italic tracking-widest">{config.optInDepth}% Opt-In Rate</p>
                  </div>
                  <span className="text-4xl font-black text-primary italic tabular-nums leading-none tracking-tighter">-{config.benefitLevel}% <span className="text-xs uppercase opacity-40">Fee</span></span>
               </div>
               <div className="relative h-12 flex items-center px-4">
                  <div className="absolute inset-x-4 h-1.5 bg-obsidian-850 rounded-full border border-white/5"></div>
                  <input 
                    type="range" min="0" max="100" step="20" value={config.optInDepth} 
                    onChange={(e) => onUpdate({ optInDepth: parseInt(e.target.value), benefitLevel: parseInt(e.target.value) * 1 })}
                    className="w-full h-full absolute inset-0 appearance-none bg-transparent accent-primary cursor-pointer z-10"
                  />
                  {tiers.map(t => (
                    <div key={t.depth} className="absolute size-2 rounded-full bg-obsidian-700 pointer-events-none" style={{ left: `calc(${t.depth}% - 4px)` }}></div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-4 p-6 bg-black/20 rounded-3xl border border-white/5 shadow-inner">
                  <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-widest block">{verboseMode ? 'Training Commitment' : 'Minimum_Uplink_Hours'}</span>
                  <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-black text-white italic tabular-nums">14.2</span>
                     <span className="text-[10px] font-mono text-primary uppercase">Hrs / Week</span>
                  </div>
               </div>
               <div className="space-y-4 p-6 bg-black/20 rounded-3xl border border-white/5 shadow-inner">
                  <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-widest block">{verboseMode ? 'Economic Yield' : 'Estimated_Market_Bonus'}</span>
                  <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-black text-green-500 italic tabular-nums">+12.4%</span>
                     <span className="text-[10px] font-mono text-obsidian-600 uppercase">Yield Boost</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-8 flex-1">
         <div className="bg-obsidian-850 border border-white/5 rounded-[40px] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-[140px] text-white">security</span>
            </div>
            <span className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.4em] italic leading-none block border-b border-cyan-500/20 pb-6">{verboseMode ? 'Privacy Manifest' : 'Sovereignty_Guarantee'}</span>
            <p className="text-[14px] text-obsidian-300 italic leading-relaxed">
               "Even at 100% opt-in, your identity remains encrypted behind your **Dotfile-0x84**. We extract only high-level geometric patterns to refine our global inference engine."
            </p>
            <div className="flex items-center gap-3 pt-6 border-t border-white/5">
               <span className="material-symbols-outlined text-cyan-400 text-[18px]">verified</span>
               <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Audited by Xibalba Protocol</span>
            </div>
         </div>

         <div className="bg-primary/5 border border-primary/20 rounded-[40px] p-10 flex flex-col gap-10 shadow-inner">
            <div className="flex items-center gap-5">
               <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-black shadow-2xl">
                  <span className="material-symbols-outlined font-black">hub</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[14px] font-black text-white uppercase italic tracking-tight">{verboseMode ? 'AI Access Tier' : 'Kernel_Reasoning_Depth'}</span>
                  <span className="text-[8px] font-mono text-primary/80 uppercase font-bold tracking-[0.2em]">MAX_INFERENCE_UNLOCKED</span>
               </div>
            </div>
            <div className="space-y-4">
               <XI_ProgressGauge label="RECURSIVE_THINKING_BUDGET" value={98} color="var(--xi-accent)" />
               <XI_ProgressGauge label="NETWORK_PRIORITY_SIG" value={100} color="#06b6d4" />
            </div>
            <p className="text-[11px] text-obsidian-500 italic mt-auto leading-relaxed">
               "Your opt-in level grants you top-tier placement in the compute queue. Shards materialize 4x faster."
            </p>
         </div>
      </div>

      <div className="mt-auto p-8 border-t border-white/5 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
         <span className="text-[9px] font-mono text-obsidian-700 uppercase italic">Contract_ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}</span>
         <button className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-primary/40 pb-1">Review Terms of Service</button>
      </div>
    </div>
  );
};

export default TrainingDataOptInPanel;
