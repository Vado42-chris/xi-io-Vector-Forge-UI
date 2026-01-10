
import React, { useState, useEffect } from 'react';

interface SovereignEntryProps {
  onInitialize: (username: string) => void;
}

const SovereignEntry: React.FC<SovereignEntryProps> = ({ onInitialize }) => {
  const [bootStep, setBootStep] = useState(0);
  const [username, setUsername] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  const steps = [
    "Establishing_Void_Link...",
    "Verifying_Entropy_Key...",
    "Mounting_Machined_Chassis...",
    "Ready_For_Operator"
  ];

  useEffect(() => {
    if (bootStep < steps.length - 1) {
      const timer = setTimeout(() => setBootStep(prev => prev + 1), 600);
      return () => clearTimeout(timer);
    }
  }, [bootStep]);

  const handleDeploy = () => {
    if (!username.trim() && bootStep === steps.length - 1) return;
    setIsDeploying(true);
    setTimeout(() => onInitialize(username || 'OPERATOR_0x'), 1200);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-obsidian-950 flex items-center justify-center p-8 select-none overflow-hidden grain-layer grain-1">
      <div className="absolute inset-0 canvas-grid opacity-[0.03] pointer-events-none"></div>
      
      <div className="w-full max-w-[420px] space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 px-6">
        <div className="flex flex-col items-center gap-6">
           <div className="size-20 rounded-xi bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(184,134,11,0.2)]">
              <span className="material-symbols-outlined !text-[48px]">polyline</span>
           </div>
           <div className="text-center space-y-2">
              <h1 className="text-4xl font-black uppercase tracking-[0.4em] text-obsidian-100 italic leading-none">VectorForge</h1>
              <p className="text-[9px] font-mono text-obsidian-300 uppercase tracking-[0.6em] italic opacity-60">Sovereign_Reference_v0.8.4_S</p>
           </div>
        </div>

        <div className="space-y-8">
           <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-obsidian-300 uppercase tracking-[0.3em]">Operator_ID</label>
                <span className="text-[8px] font-mono text-primary/60 uppercase">Required</span>
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="USER_TOKEN_0x..."
                className="w-full bg-obsidian-950 border border-white/[0.1] rounded-xi px-8 py-5 text-obsidian-100 font-mono text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-obsidian-300/20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative z-20"
                autoFocus
              />
           </div>

           <div className="p-8 bg-obsidian-900 border border-white/[0.04] rounded-xi space-y-5 grain-layer grain-2 shadow-2xl">
              <div className="flex justify-between items-center text-[9px] font-mono text-obsidian-200 uppercase tracking-widest relative z-10">
                 <span className="italic font-bold">Boot_Sequence</span>
                 <span className="text-primary font-bold">{Math.round((bootStep / (steps.length - 1)) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-obsidian-950 rounded-full overflow-hidden border border-white/[0.05] relative z-10 p-0.5">
                 <div className="h-full bg-primary transition-all duration-700 shadow-[0_0_15px_var(--xi-accent)] rounded-full" style={{ width: `${(bootStep / (steps.length - 1)) * 100}%` }}></div>
              </div>
              <p className="text-[11px] font-mono text-obsidian-300 italic tracking-tight opacity-90 h-4 relative z-10">
                {steps[bootStep]}
              </p>
           </div>

           <button 
             onClick={handleDeploy}
             disabled={isDeploying || bootStep < steps.length - 1}
             className="w-full py-6 bg-primary text-obsidian-950 rounded-xi text-[13px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all disabled:opacity-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-[0.98] relative overflow-hidden group z-10 px-12"
           >
              <span className="relative z-10 truncate block">
                {isDeploying ? 'Establishing...' : 'Operator_Login'}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
           </button>
        </div>

        <div className="text-center opacity-30 pt-4">
           <span className="text-[8px] font-black text-obsidian-300 uppercase tracking-[0.5em] italic">Validated_Encrypted_Link_0x82</span>
        </div>
      </div>
    </div>
  );
};

export default SovereignEntry;
