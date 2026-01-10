
import React, { useState, useEffect } from 'react';
import { AppState, PeerNode, MiningState } from '../types';
import { XI_Button, XI_ProgressGauge, XI_StatusBadge } from './IndustrialPrimitives';
import { translate } from '../services/lexiconService';

interface ComputeNexusProps {
  state: AppState;
  onToggleMining: () => void;
  verboseMode?: boolean;
}

const ComputeNexus: React.FC<ComputeNexusProps> = ({ state, onToggleMining, verboseMode = false }) => {
  const [swarmRotation, setSwarmRotation] = useState(0);
  const [packets, setPackets] = useState<{ id: number, from: number, to: number, start: number }[]>([]);

  useEffect(() => {
    if (state.miningState.isMining) {
      const interval = setInterval(() => {
        setSwarmRotation(prev => (prev + 1) % 360);
        
        // Spawn simulated P2P data packets
        if (Math.random() > 0.7 && state.peers.length > 0) {
          const from = -1; // Central Node
          const to = Math.floor(Math.random() * state.peers.length);
          setPackets(prev => [...prev.slice(-10), { id: Date.now(), from, to, start: Date.now() }]);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [state.miningState.isMining, state.peers.length]);

  return (
    <div className="flex-1 bg-obsidian-950 flex flex-col h-full overflow-hidden animate-in fade-in duration-700">
      <div className="flex-1 flex overflow-hidden">
        {/* SWARM VISUALIZER (TORRENT STYLE) */}
        <div className="flex-1 p-12 flex flex-col relative bg-black/40 overflow-hidden border-r border-white/5">
           <div className="absolute top-8 left-8 z-20 flex flex-col gap-4">
              <div className="px-6 py-3 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-md flex items-center gap-4">
                 <span className="material-symbols-outlined text-amber-500 text-xl animate-pulse">hub</span>
                 <div className="flex flex-col">
                    <span className="text-[11px] font-black text-white uppercase tracking-widest leading-none">
                      {translate('PEER_GRID', verboseMode)}
                    </span>
                    <span className="text-[8px] font-mono text-obsidian-600 uppercase mt-1 italic">
                      {state.peers.length} ACTIVE_NODES // PROTOCOL: 0x84
                    </span>
                 </div>
              </div>
           </div>

           <div className="flex-1 flex items-center justify-center relative">
              {/* ORBITS */}
              <div className="absolute size-[600px] border border-white/5 rounded-full opacity-40"></div>
              <div className="absolute size-[450px] border border-white/5 rounded-full opacity-20"></div>
              
              {/* DATA FILAMENTS (SVG LAYER) */}
              <svg className="absolute inset-0 size-full pointer-events-none z-10 overflow-visible opacity-40">
                 {state.peers.map((peer, i) => (
                   <line 
                      key={peer.id}
                      x1="50%" y1="50%"
                      x2={`${50 + Math.cos((i * (360 / state.peers.length) + swarmRotation) * Math.PI / 180) * 25}%`}
                      y2={`${50 + Math.sin((i * (360 / state.peers.length) + swarmRotation) * Math.PI / 180) * 25}%`}
                      stroke="rgba(184,134,11,0.1)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                   />
                 ))}
                 {/* ANIMATED PACKETS */}
                 {packets.map(p => {
                    const angle = (p.to * (360 / state.peers.length) + swarmRotation);
                    return (
                      <circle 
                        key={p.id} r="3" fill="#b8860b" 
                        className="animate-pulse shadow-[0_0_10px_orange]"
                      >
                         <animateMotion 
                           dur="1s" repeatCount="indefinite"
                           path={`M 450,450 L ${450 + Math.cos(angle * Math.PI / 180) * 250},${450 + Math.sin(angle * Math.PI / 180) * 250}`} 
                         />
                      </circle>
                    );
                 })}
              </svg>

              {/* CENTRAL CORE */}
              <div className="relative z-20 flex flex-col items-center">
                 <div className={`size-40 rounded-[48px] bg-primary/10 border-2 border-primary/40 flex items-center justify-center shadow-[0_0_80px_rgba(184,134,11,0.2)] transition-all duration-1000 ${state.miningState.isMining ? 'scale-110' : 'grayscale opacity-40'}`}>
                    <span className={`material-symbols-outlined text-[80px] text-primary ${state.miningState.isMining ? 'animate-spin-slow' : ''}`}>polyline</span>
                 </div>
                 <div className="mt-10 text-center space-y-3">
                    <span className="text-[14px] font-black text-white uppercase tracking-[0.5em] italic">Operator_Node</span>
                    <div className="flex items-center gap-3 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                       <div className={`size-2 rounded-full ${state.miningState.isMining ? 'bg-amber-500 animate-ping' : 'bg-obsidian-700'}`}></div>
                       <span className="text-[10px] font-mono text-primary font-bold">{state.miningState.hashRate} MH/s</span>
                    </div>
                 </div>
              </div>

              {/* PEERS SWARM */}
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 pointer-events-none" style={{ transform: `rotate(${swarmRotation}deg)` }}>
                 {state.peers.map((peer, i) => (
                   <div 
                     key={peer.id}
                     className="absolute pointer-events-auto"
                     style={{ 
                       transform: `rotate(${i * (360 / state.peers.length)}deg) translateY(-250px) rotate(-${i * (360 / state.peers.length) + swarmRotation}deg)` 
                     }}
                   >
                      <div className="flex flex-col items-center gap-2 group">
                         <div className={`size-10 rounded-xl bg-obsidian-800 border-2 transition-all duration-500 flex items-center justify-center shadow-2xl group-hover:scale-125 ${peer.status === 'ACTIVE' ? 'border-primary/60 text-primary' : 'border-white/10 text-obsidian-600'}`}>
                            <span className="material-symbols-outlined text-sm">dns</span>
                         </div>
                         <div className="px-3 py-1 bg-black/80 rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[8px] font-mono text-white whitespace-nowrap">{peer.id} // {peer.latency}ms</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* NETWORK LOAD HUD */}
           <div className="absolute bottom-8 left-8 right-8 grid grid-cols-4 gap-8 z-20">
              {[
                { label: 'GLOBAL_DIFFICULTY', val: '0.142μ', color: 'text-primary' },
                { label: 'TOTAL_NETWORK_HASH', val: '84.2 GH/s', color: 'text-amber-500' },
                { label: 'ACTIVE_SHARD_REPLICAS', val: '14,285', color: 'text-cyan-400' },
                { label: 'MAINNET_STABILITY', val: '99.98%', color: 'text-green-500' },
              ].map(stat => (
                <div key={stat.label} className="p-6 bg-black/40 border border-white/10 rounded-2xl space-y-2 shadow-2xl backdrop-blur-md">
                   <span className="text-[8px] font-black text-obsidian-600 uppercase tracking-widest">{stat.label}</span>
                   <div className="text-[18px] font-black text-white italic tracking-tighter tabular-nums">{stat.val}</div>
                </div>
              ))}
           </div>
        </div>

        {/* MINING CONTROL SIDEBAR */}
        <div className="w-[420px] bg-obsidian-900 flex flex-col gap-10 p-12 overflow-y-auto custom-scrollbar shadow-2xl z-30">
           <div className="space-y-4">
              <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-[0.4em] italic">Session_Mining_Control</span>
              <div className="bg-black/40 border-2 border-white/10 rounded-[40px] p-10 flex flex-col items-center gap-10 shadow-inner">
                 <div className="relative">
                    <svg className="size-48 -rotate-90">
                       <circle cx="96" cy="96" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                       <circle 
                         cx="96" cy="96" r="90" fill="none" stroke="#b8860b" strokeWidth="8" 
                         strokeDasharray={565.48} strokeDashoffset={565.48 - (565.48 * (state.miningState.totalContributed / 1000)) % 565.48}
                         className="transition-all duration-1000 shadow-[0_0_20px_rgba(184,134,11,0.5)]"
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-4xl font-black text-white italic tabular-nums leading-none">{state.miningState.sessionYield.toFixed(2)}</span>
                       <span className="text-[9px] font-mono text-primary uppercase mt-2 font-bold tracking-widest">Yield_Earned</span>
                    </div>
                 </div>
                 
                 <XI_Button 
                   label={state.miningState.isMining ? "TERMINATE_HASHING" : "INITIATE_COMPUTE_UPLINK"}
                   variant={state.miningState.isMining ? "obsidian" : "primary"}
                   onClick={onToggleMining}
                   className="w-full h-16 rounded-2xl"
                   icon={state.miningState.isMining ? "power_settings_new" : "bolt"}
                 />
              </div>
           </div>

           <div className="space-y-8">
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-[9px] font-black text-obsidian-500 uppercase tracking-widest">
                    <span>{translate('TRAINING_UPLINK', verboseMode)}</span>
                    <span className="text-primary">OPT-IN_ACTIVE</span>
                 </div>
                 <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl italic text-[11px] text-obsidian-400 leading-relaxed shadow-inner">
                    "Training contribution is currently at **Max Depth**. This entitles you to a **0% Marketplace Listing Fee** for the next 24 hours."
                 </div>
              </div>

              <div className="space-y-6">
                 <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-[0.4em] italic">Economic_Impact</span>
                 <div className="space-y-4">
                    <XI_ProgressGauge label="RECURSIVE_ROYALTY_BONUS" value={82} color="var(--xi-accent)" />
                    <XI_ProgressGauge label="AI_REASONING_PRECISION" value={98} color="#06b6d4" />
                 </div>
              </div>
           </div>

           <div className="mt-auto p-8 bg-obsidian-850 rounded-[32px] border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary text-sm">verified</span>
                 <span className="text-[10px] font-black text-white uppercase italic tracking-widest leading-none">
                    {translate('SOVEREIGN_RIGHT', verboseMode)}
                 </span>
              </div>
              <p className="text-[9px] text-obsidian-600 leading-relaxed font-bold uppercase tracking-tight">
                 Your node is fully production-authenticated on xi-io.com. All modified shards are eligible for derivation royalties.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ComputeNexus;
