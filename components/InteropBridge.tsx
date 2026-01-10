
import React, { useState, useEffect } from 'react';

const InteropBridge: React.FC = () => {
  const [activeNodes, setActiveNodes] = useState(4);
  const [packets, setPackets] = useState<number[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPackets(prev => [...prev, Math.random() * 100].slice(-20));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const protocols = [
    { id: 'p1', name: 'XIBALBA_MAINNET', status: 'connected', latency: '12ms', type: 'ECONOMY' },
    { id: 'p2', name: 'GITHUB_NEXUS', status: 'connected', latency: '45ms', type: 'VERSION' },
    { id: 'p3', name: 'AWS_COMPUTE_NODE', status: 'standby', latency: '--', type: 'RENDER' },
    { id: 'p4', name: 'GOOGLE_CLOUDSYNC', status: 'error', latency: '--', type: 'STORAGE' },
  ];

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-700">
      <div className="flex-1 flex overflow-hidden">
        {/* NETWORK VISUALIZER */}
        <div className="flex-1 p-12 flex flex-col relative bg-black/40 overflow-hidden">
           <div className="absolute top-6 left-6 z-10 flex gap-4">
              <div className="px-4 py-2 bg-black/60 border border-white/10 rounded-xl backdrop-blur-md flex items-center gap-3">
                 <span className="material-symbols-outlined text-cyan-400 text-sm animate-pulse">settings_input_antenna</span>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Interop_Bridge_V4</span>
              </div>
           </div>

           {/* CENTRAL HUB VISUAL */}
           <div className="flex-1 flex items-center justify-center relative">
              <div className="absolute size-[500px] border border-cyan-500/10 rounded-full animate-[spin_30s_linear_infinite]"></div>
              <div className="absolute size-[400px] border border-cyan-500/5 rounded-full animate-[spin_20s_linear_reverse_infinite]"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                 <div className="size-32 rounded-3xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.2)] animate-pulse">
                    <span className="material-symbols-outlined text-[64px] text-cyan-400">hub</span>
                 </div>
                 <div className="mt-8 text-center space-y-2">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em]">Central_Forge_Node</span>
                    <p className="text-[8px] font-mono text-obsidian-600 uppercase">IP: 192.168.0.84 // TTY_0</p>
                 </div>
              </div>

              {/* FLOATING NODES (MOCKED) */}
              {protocols.filter(p => p.status === 'connected').map((p, i) => (
                <div 
                  key={p.id}
                  className="absolute animate-in zoom-in duration-1000"
                  style={{ 
                    transform: `rotate(${i * 120}deg) translateY(-220px) rotate(-${i * 120}deg)` 
                  }}
                >
                   <div className="flex flex-col items-center gap-3">
                      <div className="size-12 rounded-xl bg-obsidian-100 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-xl">
                         <span className="material-symbols-outlined text-sm">cloud</span>
                      </div>
                      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{p.name}</span>
                   </div>
                </div>
              ))}
           </div>

           {/* PACKET THROUGHPUT GRAPH */}
           <div className="absolute bottom-12 left-12 right-12 h-24 bg-black/40 border border-white/5 rounded-2xl p-6 flex items-end gap-1">
              {packets.map((p, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-cyan-500/20 border-t border-cyan-500/40 rounded-t-sm transition-all"
                  style={{ height: `${p}%` }}
                ></div>
              ))}
              <div className="absolute top-4 right-6 text-[8px] font-black text-cyan-400 uppercase tracking-widest italic">Live_Throughput_MB/s</div>
           </div>
        </div>

        {/* PROTOCOL SIDEBAR */}
        <div className="w-96 bg-obsidian-100 border-l border-white/5 p-8 flex flex-col gap-10 shadow-2xl overflow-y-auto custom-scrollbar">
           <div className="space-y-6">
              <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.3em]">External_Kernels</span>
              <div className="space-y-3">
                 {protocols.map(p => (
                   <div key={p.id} className="flex items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl group cursor-pointer hover:border-cyan-500/40 transition-all">
                      <div className={`size-2 rounded-full ${p.status === 'connected' ? 'bg-green-500 shadow-[0_0_8px_green]' : p.status === 'error' ? 'bg-red-500 animate-pulse' : 'bg-obsidian-700'}`}></div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-white uppercase tracking-tight">{p.name}</span>
                         <span className="text-[7px] font-mono text-obsidian-600 uppercase">{p.type} // {p.latency}</span>
                      </div>
                      <span className="material-symbols-outlined text-obsidian-700 text-sm ml-auto group-hover:text-white">settings</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.3em]">Active_Handshakes</span>
              <div className="p-6 bg-black/20 rounded-[32px] border border-white/5 space-y-4 font-mono">
                 <div className="flex gap-4 text-[8px]">
                    <span className="text-cyan-500">14:20:12</span>
                    <span className="text-white/40">SENT_SYNC_PACKET_0x82...</span>
                 </div>
                 <div className="flex gap-4 text-[8px]">
                    <span className="text-cyan-500">14:20:13</span>
                    <span className="text-green-500 italic">ACK_RECEIVED_FROM_XIBALBA</span>
                 </div>
                 <div className="flex gap-4 text-[8px]">
                    <span className="text-cyan-500">14:20:15</span>
                    <span className="text-white/40">BUFFERING_ASSET_SHARD_A1...</span>
                 </div>
              </div>
           </div>

           <div className="mt-auto space-y-6">
              <button 
                onClick={() => { setIsSyncing(true); setTimeout(() => setIsSyncing(false), 2000); }}
                className="w-full py-6 bg-cyan-600 text-white rounded-[32px] text-[12px] font-black uppercase tracking-[0.5em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                 <span className="material-symbols-outlined text-[24px]">sync_alt</span>
                 {isSyncing ? 'Syncing_Nodes...' : 'Refresh_Bridge'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InteropBridge;
