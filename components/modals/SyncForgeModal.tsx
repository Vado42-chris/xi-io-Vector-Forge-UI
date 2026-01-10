
import React, { useState, useEffect } from 'react';
import { CloudPackage, ShardType } from '../../types';

interface SyncForgeModalProps {
  onClose: () => void;
  onMaterialize: (pkg: CloudPackage) => void;
  credits: number;
}

const SYNC_PACKAGES: CloudPackage[] = [
  // Fixed missing 'category' property for each package
  { id: 'cp-1', name: 'AURORA_SHADER_PACK', description: 'Volumetric light rig for cinematic Lux rendering.', type: 'shader', size: '2.4MB', author: 'Xibalba_Foundry', stability: 'STABLE', category: 'THEME' },
  { id: 'cp-2', name: 'KERNEL_AUTOMATA_V3', description: 'Advanced logic scripting for non-destructive stack management.', type: 'logic_kernel', size: '128KB', author: 'Archon_Systems', stability: 'STABLE', category: 'EXTENSION' },
  { id: 'cp-3', name: 'BIO_MIMETIC_VECTORS', description: 'AI-generated organic vector forms and path shaders.', type: 'vector', size: '42KB', author: 'Neural_Labs', stability: 'EXPERIMENTAL', category: 'SNIPPET' },
  { id: 'cp-4', name: 'CHASSIS_PRIME_MESH', description: 'High-poly topology manifest for core engine structures.', type: '3d_mesh', size: '12.4MB', author: 'Sovereign_Core', stability: 'STABLE', category: 'EXTENSION' },
];

const SyncForgeModal: React.FC<SyncForgeModalProps> = ({ onClose, onMaterialize, credits }) => {
  const [activePkg, setActivePkg] = useState<CloudPackage | null>(null);
  const [isMaterializing, setIsMaterializing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleMaterialize = () => {
    if (!activePkg) return;
    setIsMaterializing(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          onMaterialize(activePkg);
          setIsMaterializing(false);
          setProgress(0);
        }, 1000);
      } else {
        setProgress(p);
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-obsidian-200 flex flex-col items-center justify-center p-12 overflow-hidden animate-in fade-in duration-500">
      {/* API BLACKHOLE VISUAL */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
        <div className="size-[800px] bg-[radial-gradient(circle_at_center,_var(--xi-vector-500)_0%,_transparent_70%)] blur-[150px] animate-pulse"></div>
        <div className="absolute inset-0 size-full border-2 border-primary/20 rounded-full animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute inset-10 size-[calc(100%-80px)] border border-white/5 rounded-full animate-[spin_40s_linear_reverse_infinite]"></div>
      </div>

      <div className="w-full max-w-7xl z-10 flex flex-col h-full space-y-12 animate-in zoom-in-95 duration-700">
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-4 px-6 py-2 bg-black/40 border border-white/10 rounded-full">
              <div className="size-2 rounded-full bg-amber-500 animate-ping"></div>
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Establish_API_Handshake</span>
            </div>
            <h1 className="text-6xl font-black text-white uppercase tracking-tighter italic">
              Cloud_Forge_<span className="text-amber-500">Interface</span>
            </h1>
            <p className="text-xl text-obsidian-500 font-medium italic">
              Pull design manifests from the Xibalba Marketplace into your local stack.
            </p>
          </div>
          <div className="flex items-center gap-8">
            <div className="px-8 py-4 bg-obsidian-100 rounded-2xl border border-white/5 flex flex-col items-end shadow-inner">
              <span className="text-[8px] font-mono text-obsidian-600 uppercase tracking-widest">SEED001_WALLET</span>
              <span className="text-2xl font-black text-primary mono tabular-nums">{credits.toLocaleString()} CORE</span>
            </div>
            <button onClick={onClose} className="size-16 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-all">
               <span className="material-symbols-outlined text-white text-3xl">close</span>
            </button>
          </div>
        </div>

        {/* MAIN INTERFACE */}
        <div className="flex-1 flex gap-12 overflow-hidden min-h-0">
          {/* PACKAGE LIST */}
          <div className="w-[500px] flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-4">
            <h3 className="text-[11px] font-black text-obsidian-500 uppercase tracking-[0.4em] mb-4">Available_Synchronizations</h3>
            {SYNC_PACKAGES.map(pkg => (
              <button 
                key={pkg.id}
                onClick={() => setActivePkg(pkg)}
                className={`group p-8 rounded-2xl border text-left transition-all relative overflow-hidden ${activePkg?.id === pkg.id ? 'bg-amber-500/10 border-amber-500 shadow-2xl shadow-amber-500/10' : 'bg-obsidian-100 border-white/5 hover:border-white/20'}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`size-14 rounded-xl flex items-center justify-center transition-all ${activePkg?.id === pkg.id ? 'bg-amber-500 text-white shadow-lg' : 'bg-white/5 text-obsidian-500'}`}>
                    <span className="material-symbols-outlined text-2xl">
                      {pkg.type === 'shader' ? 'flare' : pkg.type === 'logic_kernel' ? 'code_blocks' : pkg.type === 'vector' ? 'polyline' : 'view_in_ar'}
                    </span>
                  </div>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-md border ${pkg.stability === 'STABLE' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                    {pkg.stability}
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-white uppercase italic">{pkg.name}</h4>
                  <p className="text-[11px] text-obsidian-500 uppercase font-bold tracking-widest">{pkg.author} // {pkg.size}</p>
                </div>
              </button>
            ))}
          </div>

          {/* INSPECTOR & BLACKHOLE SEARCH */}
          <div className="flex-1 flex flex-col gap-12 min-w-0">
            {activePkg ? (
              <div className="flex-1 bg-obsidian-100/40 border border-white/10 rounded-2xl p-16 flex flex-col gap-10 animate-in slide-in-from-right-10 duration-500 backdrop-blur-xl shadow-2xl">
                 <div className="flex justify-between items-start border-b border-white/5 pb-10">
                    <div className="space-y-4">
                       <span className="text-[11px] font-black text-amber-500 uppercase tracking-[0.4em]">Manifest_Inspector</span>
                       <h2 className="text-5xl font-black text-white uppercase italic leading-tight">{activePkg.name}</h2>
                       <p className="text-xl text-obsidian-500 max-w-2xl leading-relaxed italic">"{activePkg.description}"</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8">
                    <div className="p-8 bg-black/40 rounded-2xl border border-white/5 space-y-4 shadow-inner">
                       <span className="text-[9px] font-black text-obsidian-600 uppercase tracking-widest">Network_Stability</span>
                       <div className="flex items-center gap-4">
                          <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-green-500 w-[98%] shadow-[0_0_10px_green]"></div>
                          </div>
                          <span className="text-[12px] font-mono text-green-500">98%_UP</span>
                       </div>
                    </div>
                    <div className="p-8 bg-black/40 rounded-2xl border border-white/5 space-y-4 shadow-inner">
                       <span className="text-[9px] font-black text-obsidian-600 uppercase tracking-widest">Marketplace_Tier</span>
                       <div className="text-2xl font-black text-white uppercase tracking-tight italic">COMMERCIAL_SEED_001</div>
                    </div>
                 </div>

                 <div className="mt-auto">
                    {isMaterializing ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-end mb-2 px-4">
                          <span className="text-[12px] font-black text-amber-500 uppercase tracking-[0.3em] animate-pulse">Establishing_Ownership_Record...</span>
                          <span className="text-3xl font-mono font-black text-white">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
                           <div className="h-full bg-amber-500 rounded-full transition-all duration-75 shadow-[0_0_30px_rgba(245,158,11,0.5)]" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={handleMaterialize}
                        className="w-full py-8 bg-amber-500 text-white rounded-2xl text-xl font-black uppercase tracking-[0.5em] shadow-2xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 group border border-white/10"
                      >
                         <span className="material-symbols-outlined text-4xl group-hover:rotate-180 transition-transform">bolt</span>
                         Materialize_Shard
                      </button>
                    )}
                 </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-black/20 border border-dashed border-white/5 rounded-2xl p-20 text-center space-y-10 group transition-all hover:bg-black/30">
                 <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/10 blur-[120px] rounded-full scale-150 animate-pulse"></div>
                    <span className="material-symbols-outlined text-[120px] text-obsidian-700 relative z-10 group-hover:text-amber-500 transition-colors duration-1000">cloud_sync</span>
                 </div>
                 <div className="space-y-4 max-w-md">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Awaiting_Market_Selection</h3>
                    <p className="text-obsidian-600 font-medium italic">Select an asset from the Xibalba Marketplace. OSS users get 10% profit sharing on all recursive derivatives.</p>
                 </div>
                 <div className="w-full max-w-md h-px bg-white/5"></div>
                 <div className="flex gap-10">
                    <div className="flex flex-col items-center">
                       <span className="text-[20px] font-black text-white uppercase italic">12.4GB</span>
                       <span className="text-[8px] font-mono text-obsidian-700 uppercase">Remote_Volume</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="text-[20px] font-black text-white uppercase italic">1.2ms</span>
                       <span className="text-[8px] font-mono text-obsidian-700 uppercase">Node_Handshake</span>
                    </div>
                 </div>
              </div>
            )}

            {/* API BLACKHOLE SEARCH BAR */}
            <div className="bg-obsidian-100 border border-white/10 rounded-2xl p-8 flex items-center gap-8 shadow-inner focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
              <div className="size-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <input 
                type="text" 
                placeholder="Query the Marketplace for specific shards..." 
                className="flex-1 bg-transparent border-none text-xl font-black text-white uppercase tracking-tight italic placeholder-obsidian-800 outline-none"
              />
              <button className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[11px] font-black text-obsidian-500 hover:text-white uppercase tracking-[0.4em] transition-all">Summon_Shard</button>
            </div>
          </div>
        </div>

        {/* FOOTER TELEMETRY */}
        <div className="pt-10 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-obsidian-700 italic">
          <div className="flex items-center gap-10">
             <span className="flex items-center gap-3"><div className="size-2 rounded-full bg-amber-500 shadow-[0_0_10px_orange]"></div> Protocol: XIBALBA_SEED_ACTIVE</span>
             <span className="flex items-center gap-3"><div className="size-2 rounded-full bg-white/10"></div> Origin: Seed001_Mainnet</span>
          </div>
          <span>Handshake_Stable // 0xAF...092A</span>
        </div>
      </div>
    </div>
  );
};

export default SyncForgeModal;
