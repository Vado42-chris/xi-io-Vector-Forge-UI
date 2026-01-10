
import React, { useState } from 'react';
import { Manifest } from '../types';

interface HangarDashboardProps {
  onNewProject: () => void;
  onOpenRecent: (manifest: Manifest) => void;
  onCloudSync: () => void;
  recentManifests: Manifest[];
  verboseMode: boolean;
}

const HangarDashboard: React.FC<HangarDashboardProps> = ({ onNewProject, onOpenRecent, onCloudSync, recentManifests, verboseMode }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-obsidian-950 relative overflow-hidden grain-layer grain-1">
      <div className="absolute inset-0 canvas-grid opacity-[0.03] pointer-events-none"></div>
      
      <div className="w-full max-w-5xl z-10 space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-4 px-6 py-2 bg-obsidian-900 border border-white/[0.03] rounded-lg mb-4 grain-layer grain-2 shadow-xl">
            <div className={`size-2 rounded-full ${isSyncing ? 'bg-primary animate-pulse shadow-[0_0_15px_var(--xi-accent)]' : 'bg-primary/40'}`}></div>
            <span className="text-[9px] font-black text-obsidian-200 uppercase tracking-[0.6em] italic font-bold">
              Foundry_Standby_Node_0x84
            </span>
          </div>
          <h1 className="text-7xl font-black text-obsidian-100 uppercase tracking-tighter italic leading-none">
            {verboseMode ? 'The Foundry' : 'Hangar_v0.8_S'}
          </h1>
          <p className="text-xl text-obsidian-300 font-medium italic opacity-60 max-w-2xl mx-auto">
            Awaiting Operator Input. Neural engine calibrated to reference standards.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <button 
            onClick={onNewProject}
            className="group p-12 bg-obsidian-900 border border-white/[0.02] hover:bg-obsidian-850 hover:border-primary/40 transition-all text-left flex flex-col gap-14 rounded-xi grain-layer grain-2 shadow-2xl active:scale-[0.98]"
          >
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30 group-hover:bg-primary transition-all shadow-inner">
              <span className="material-symbols-outlined text-primary group-hover:text-obsidian-950 text-[32px] font-black">add</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-obsidian-100 uppercase tracking-tight italic">
                {verboseMode ? 'New Workspace' : 'Initialize_01'}
              </h3>
              <p className="text-[11px] text-obsidian-300 uppercase font-black tracking-widest leading-relaxed opacity-50 italic">
                Construct a fresh archetypal manifest.
              </p>
            </div>
          </button>

          <div className="p-12 bg-obsidian-850 border border-white/[0.04] flex flex-col gap-10 rounded-xi grain-layer grain-3 shadow-2xl overflow-hidden relative group">
            <div className="flex items-center justify-between border-b border-white/[0.01] pb-6">
              <h3 className="text-[10px] font-black text-obsidian-300 uppercase tracking-[0.5em] italic font-bold">Recent_Logs</h3>
              <span className="material-symbols-outlined text-obsidian-300/40 text-[20px] group-hover:rotate-[-90deg] transition-transform">history</span>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[180px] pr-2 custom-scrollbar">
              {recentManifests.length === 0 ? (
                <div className="py-14 text-center text-[10px] text-obsidian-300 uppercase font-black tracking-[0.3em] italic opacity-30">Standby_Buffer_Empty</div>
              ) : (
                recentManifests.map(m => (
                  <button key={m.id} onClick={() => onOpenRecent(m)} className="w-full text-left p-4 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all">
                     <span className="text-[12px] font-black text-obsidian-100 uppercase block italic mb-1">{m.name}</span>
                     <span className="text-[8px] text-obsidian-300 uppercase opacity-50 font-mono tracking-widest font-bold">{m.role} // HASH_0x{m.id.slice(0,4)}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={() => { setIsSyncing(true); onCloudSync(); setTimeout(() => setIsSyncing(false), 2000); }}
            className="group p-12 bg-obsidian-900 border border-white/[0.02] hover:bg-obsidian-850 hover:border-primary/40 transition-all text-left flex flex-col gap-14 rounded-xi grain-layer grain-2 shadow-2xl active:scale-[0.98]"
          >
            <div className={`size-14 rounded-xl bg-obsidian-950 flex items-center justify-center border border-white/[0.05] transition-all ${isSyncing ? 'animate-pulse border-primary shadow-[0_0_20px_rgba(184,134,11,0.3)]' : ''}`}>
              <span className={`material-symbols-outlined text-obsidian-300 text-[32px] font-black transition-colors ${isSyncing ? 'text-primary' : 'group-hover:text-primary'}`}>sync</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-obsidian-100 uppercase tracking-tight italic">
                {verboseMode ? 'Cloud Exchange' : 'Nexus_Sync'}
              </h3>
              <p className="text-[11px] text-obsidian-300 uppercase font-black tracking-widest leading-relaxed opacity-50 italic">
                Ingest remote shards from mainnet.
              </p>
            </div>
          </button>
        </div>

        <div className="pt-12 border-t border-white/[0.03] flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.8em] text-obsidian-300 opacity-20 italic font-bold">
          <span>XIBALBA_FOUNDRY_CORE // SPEC_0.8.4_S</span>
          <span className="flex items-center gap-4">
             <div className="size-1.5 rounded-full bg-obsidian-300 animate-pulse"></div>
             Sovereign_Protocol_Validated
          </span>
        </div>
      </div>
    </div>
  );
};

export default HangarDashboard;
