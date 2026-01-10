
import React, { useState } from 'react';

interface ExportManifestModalProps {
  onClose: () => void;
  projectName: string;
}

const ExportManifestModal: React.FC<ExportManifestModalProps> = ({ onClose, projectName }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const startExport = () => {
    setIsExporting(true);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 40);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
      <div className="w-full max-w-4xl xi-card rounded-[60px] border border-white/10 overflow-hidden shadow-[0_80px_200px_rgba(0,0,0,0.95)] flex flex-col relative">
        <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none rotate-12 scale-150">
           <span className="material-symbols-outlined text-[500px] text-primary">rocket_launch</span>
        </div>

        <div className="p-12 border-b border-white/5 flex justify-between items-start relative z-10">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Sovereign_Manifest</h2>
            <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Ready_For_Distribution // Node: 0x88...F07</p>
          </div>
          <button onClick={onClose} className="size-14 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all group">
            <span className="material-symbols-outlined text-white group-hover:rotate-90 transition-transform">close</span>
          </button>
        </div>

        <div className="p-16 grid grid-cols-2 gap-20 relative z-10">
           {/* Manifest Preview Card */}
           <div className="relative">
              <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full animate-pulse"></div>
              <div className="bg-obsidian-300 border border-white/10 rounded-[40px] p-10 shadow-2xl relative z-10 overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[100px] text-white">qr_code_2</span>
                 </div>
                 <div className="mb-10 flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                       <span className="material-symbols-outlined text-white text-[28px]">token</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[14px] font-black text-white uppercase">{projectName}</span>
                       <span className="text-[9px] font-bold text-obsidian-500 uppercase tracking-widest font-mono">HASH: 0x92JKS...902</span>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="h-px w-full bg-white/5"></div>
                    <div className="grid grid-cols-2 gap-6 text-[10px] font-black uppercase tracking-widest text-obsidian-400">
                       <div>Size: <span className="text-white">14.2 KB</span></div>
                       <div>Nodes: <span className="text-white">128</span></div>
                       <div>Latency: <span className="text-white">4ms</span></div>
                       <div>Safety: <span className="text-white text-green-500">SECURE</span></div>
                    </div>
                 </div>
                 <div className="mt-12 p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
                    <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center">
                       <span className="material-symbols-outlined text-green-500 text-[20px]">verified</span>
                    </div>
                    <span className="text-[10px] font-bold text-green-500/70 uppercase italic">Manifest digitally signed by VectorForge_v0.8</span>
                 </div>
              </div>
           </div>

           {/* Export Progress / What's Next */}
           <div className="flex flex-col justify-center">
              {!isExporting ? (
                 <div className="space-y-12">
                    <div className="space-y-4">
                       <h3 className="text-[11px] font-black text-obsidian-500 uppercase tracking-[0.4em]">Final_Bundle_Protocol</h3>
                       <p className="text-[16px] text-white/70 font-medium leading-relaxed italic">
                         "The deployment engine will now bundle the vector assets, kinetic rigs, and node signatures into a single sovereign manifest."
                       </p>
                    </div>
                    <button 
                      onClick={startExport}
                      className="w-full py-6 bg-primary text-white text-[14px] font-black uppercase tracking-[0.5em] rounded-[32px] xi-popping-glow hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-4"
                    >
                       <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
                       Execute_Deployment
                    </button>
                 </div>
              ) : (
                 <div className="space-y-10 animate-in fade-in zoom-in-95">
                    <div className="flex justify-between items-end mb-4">
                       <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">{progress < 100 ? 'Packaging_Manifest...' : 'Deployment_Stable'}</span>
                       <span className="text-[24px] font-mono font-black text-white">{progress}%</span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                       <div className="h-full bg-primary transition-all duration-75 shadow-[0_0_20px_var(--xi-vector-glow)]" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className={`text-[9px] font-black uppercase tracking-widest p-4 rounded-2xl border transition-all ${progress > 30 ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-white/5 border-white/5 text-obsidian-600'}`}>01 // Build_Bundle</div>
                       <div className={`text-[9px] font-black uppercase tracking-widest p-4 rounded-2xl border transition-all ${progress > 60 ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-white/5 border-white/5 text-obsidian-600'}`}>02 // Hash_Manifest</div>
                       <div className={`text-[9px] font-black uppercase tracking-widest p-4 rounded-2xl border transition-all ${progress > 85 ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-white/5 border-white/5 text-obsidian-600'}`}>03 // Node_Sign</div>
                       <div className={`text-[9px] font-black uppercase tracking-widest p-4 rounded-2xl border transition-all ${progress === 100 ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-white/5 border-white/5 text-obsidian-600'}`}>04 // Cloud_Broadcast</div>
                    </div>
                    {progress === 100 && (
                       <button onClick={onClose} className="w-full py-5 bg-white/5 hover:bg-white/10 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[32px] border border-white/10 transition-all">
                          Finalize_Handshake
                       </button>
                    )}
                 </div>
              )}
           </div>
        </div>

        <div className="bg-obsidian-300 p-10 border-t border-white/5 text-center flex items-center justify-center gap-10">
           <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-green-500 shadow-[0_0_10px_green]"></span>
              <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-widest">Sovereign_Protocol: STABLE</span>
           </div>
           <div className="h-px w-20 bg-white/5"></div>
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-widest">Encryption: XIBALBA_RSA_4096</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExportManifestModal;
