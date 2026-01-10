
import React, { useState } from 'react';
import { Manifest } from '../types';
import { translate } from '../services/lexiconService';

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
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-obsidian-900 relative overflow-hidden paper-layer grain-medium">
      <div className="absolute inset-0 canvas-grid opacity-[0.03] pointer-events-none"></div>
      
      <div className="w-full max-w-5xl z-10 space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-4 px-6 py-2 bg-black/40 border border-white/5 rounded-lg mb-4 shadow-inner">
            <div className={`size-2 rounded-full ${isSyncing ? 'bg-primary animate-pulse shadow-[0_0_15px_var(--xi-accent)]' : 'bg-primary/40'}`}></div>
            <span className="text-[9px] font-black text-obsidian-400 uppercase tracking-[0.6em] italic font-bold">
              {verboseMode ? 'System Standby' : 'Foundry_Standby_Node_0x84'}
            </span>
          </div>
          <h1 className="text-7xl font-black text-obsidian-100 uppercase tracking-tighter italic leading-none">
            {verboseMode ? 'Design Center' : 'Hangar_v0.8_S'}
          </h1>
          <p className="text-xl text-obsidian-400 font-medium italic opacity-60 max-w-2xl mx-auto">
            {verboseMode ? 'Ready to start. Choose a task or open a recent file to begin.' : 'Awaiting Operator Input. Neural engine calibrated to reference standards.'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <button 
            onClick={onNewProject}
            className="group p-12 bg-obsidian-850 hover:bg-obsidian-800 transition-all text-left flex flex-col gap-14 rounded-xl xi-paper-sheet paper-layer grain-fine active:scale-[0.98] border border-white/5 hover:xi-backlit"
          >
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/30 group-hover:bg-primary transition-all shadow-inner">
              <span className="material-symbols-outlined text-primary group-hover:text-obsidian-950 text-[32px] font-black">add</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">
                {translate('INITIALIZE_01', verboseMode)}
              </h3>
              <p className="text-[11px] text-obsidian-500 uppercase font-black tracking-widest leading-relaxed opacity-50 italic">
                {verboseMode ? 'Start a fresh design project.' : 'Construct a fresh archetypal manifest.'}
              </p>
            </div>
          </button>

          <div className="p-12 bg-obsidian-850 flex flex-col gap-10 rounded-xl xi-paper-sheet paper-layer grain-fine border border-white/5">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-6">
              <h3 className="text-[10px] font-black text-obsidian-400 uppercase tracking-[0.5em] italic font-bold">
                {verboseMode ? 'Recent Files' : 'Recent_Logs'}
              </h3>
              <span className="material-symbols-outlined text-obsidian-600 text-[20px] group-hover:rotate-[-90deg] transition-transform">history</span>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[180px] pr-2 custom-scrollbar">
              {recentManifests.length === 0 ? (
                <div className="py-14 text-center text-[10px] text-obsidian-600 uppercase font-black tracking-[0.3em] italic opacity-30">
                  {verboseMode ? 'No Recent Files' : 'Standby_Buffer_Empty'}
                </div>
              ) : (
                recentManifests.map(m => (
                  <button key={m.id} onClick={() => onOpenRecent(m)} className="w-full text-left p-4 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all">
                     <span className="text-[12px] font-black text-obsidian-100 uppercase block italic mb-1">{m.name}</span>
                     <span className="text-[8px] text-obsidian-400 uppercase opacity-50 font-mono tracking-widest font-bold">{m.role} // HASH_0x{m.id.slice(0,4)}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={() => { setIsSyncing(true); onCloudSync(); setTimeout(() => setIsSyncing(false), 2000); }}
            className="group p-12 bg-obsidian-850 hover:bg-obsidian-800 transition-all text-left flex flex-col gap-14 rounded-xl xi-paper-sheet paper-layer grain-fine active:scale-[0.98] border border-white/5 hover:xi-backlit"
          >
            <div className={`size-14 rounded-xl bg-obsidian-950 flex items-center justify-center border border-white/[0.05] transition-all ${isSyncing ? 'animate-pulse border-primary shadow-[0_0_20px_rgba(184,134,11,0.3)]' : ''}`}>
              <span className={`material-symbols-outlined text-obsidian-500 text-[32px] font-black transition-colors ${isSyncing ? 'text-primary' : 'group-hover:text-primary'}`}>sync</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">
                {translate('NEXUS_SYNC', verboseMode)}
              </h3>
              <p className="text-[11px] text-obsidian-500 uppercase font-black tracking-widest leading-relaxed opacity-50 italic">
                {verboseMode ? 'Update your library from the cloud.' : 'Ingest remote shards from mainnet.'}
              </p>
            </div>
          </button>
        </div>

        <div className="pt-12 border-t border-white/[0.05] flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.8em] text-obsidian-600 opacity-20 italic font-bold">
          <span>{verboseMode ? 'CORE SYSTEM v0.8.4' : 'XIBALBA_FOUNDRY_CORE // SPEC_0.8.4_S'}</span>
          <span className="flex items-center gap-4">
             <div className="size-1.5 rounded-full bg-obsidian-600 animate-pulse"></div>
             {verboseMode ? 'System Authenticated' : 'Sovereign_Protocol_Validated'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HangarDashboard;
