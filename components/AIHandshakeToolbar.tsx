
import React, { useState } from 'react';
import { AIProvider } from '../types';

interface AIHandshakeToolbarProps {
  currentProvider: AIProvider;
  onProviderChange: (p: AIProvider) => void;
  onEndpointSync: () => void;
}

const AIHandshakeToolbar: React.FC<AIHandshakeToolbarProps> = ({ currentProvider, onProviderChange, onEndpointSync }) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [handshakeStep, setHandshakeStep] = useState(0);

  const triggerHandshake = () => {
    setIsExpanding(true);
    setHandshakeStep(1);
    onEndpointSync();
    setTimeout(() => setHandshakeStep(2), 800);
    setTimeout(() => setHandshakeStep(3), 1600);
    setTimeout(() => {
      setHandshakeStep(4);
      setTimeout(() => {
        setIsExpanding(false);
        setHandshakeStep(0);
      }, 1000);
    }, 2400);
  };

  return (
    <div className="h-10 bg-obsidian-300 border-b border-white/10 flex items-center px-6 justify-between z-[600] select-none relative group">
      <div className="flex items-center gap-8">
        <div 
          onClick={triggerHandshake}
          className="flex items-center gap-3 cursor-pointer group/link hover:scale-105 transition-transform"
        >
           <div className={`size-2 rounded-full ${isExpanding ? 'bg-amber-500 animate-ping' : 'bg-cyan-500 animate-pulse shadow-[0_0_10px_cyan]'}`}></div>
           <span className={`text-[9px] font-black uppercase tracking-[0.3em] transition-colors ${isExpanding ? 'text-amber-500' : 'text-white group-hover/link:text-cyan-400'}`}>
             {isExpanding ? 'Handshaking_0x...' : 'API_Black_Hole // Handshake_Active'}
           </span>
        </div>
        
        <div className="h-4 w-px bg-white/10"></div>

        <div className="flex items-center gap-4">
           <span className="text-[8px] font-mono text-obsidian-600 uppercase tracking-widest italic">Power_Source:</span>
           <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5">
              {[AIProvider.GEMINI_PRO, AIProvider.GEMINI_FLASH, 'LOCAL_HOST', 'CUSTOM_RPC'].map(p => (
                <button 
                  key={p} 
                  onClick={() => onProviderChange(p as any)}
                  className={`px-4 py-1.5 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${currentProvider === p ? 'bg-primary text-white shadow-lg' : 'text-obsidian-500 hover:text-white hover:bg-white/5'}`}
                >
                  {p.replace('_', ' ')}
                </button>
              ))}
           </div>
        </div>
      </div>

      {isExpanding && (
        <div className="absolute top-10 left-12 bg-obsidian-100 border border-white/10 rounded-2xl p-6 shadow-2xl z-[1000] flex gap-8 animate-in slide-in-from-top-2 duration-300 backdrop-blur-3xl">
           {[
             { label: 'Tunnel', step: 1, icon: 'vpn_lock' },
             { label: 'Identity', step: 2, icon: 'fingerprint' },
             { label: 'Math_Check', step: 3, icon: 'functions' },
             { label: 'Bridge', step: 4, icon: 'sync_alt' }
           ].map(s => (
             <div key={s.step} className={`flex flex-col items-center gap-2 transition-all duration-500 ${handshakeStep >= s.step ? 'text-cyan-400 scale-110' : 'text-obsidian-700'}`}>
                <span className={`material-symbols-outlined text-lg ${handshakeStep === s.step ? 'animate-bounce' : ''}`}>{s.icon}</span>
                <span className="text-[7px] font-black uppercase tracking-widest">{s.label}</span>
             </div>
           ))}
        </div>
      )}

      <div className="flex items-center gap-10">
         <div className="flex flex-col items-end">
            <span className="text-[7px] font-mono text-obsidian-600 uppercase tracking-widest">Throughput</span>
            <span className="text-[10px] font-black text-cyan-400 italic tabular-nums">42.8 K-Tok/s</span>
         </div>
         <button 
           onClick={triggerHandshake}
           className="px-6 h-7 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-obsidian-500 uppercase tracking-widest hover:text-white hover:border-primary/40 transition-all flex items-center gap-3 group/btn"
         >
            <span className="material-symbols-outlined text-[14px] group-hover/btn:rotate-180 transition-transform duration-1000">sync_alt</span>
            Refresh_Handshake
         </button>
      </div>

      {/* MATH HUMOR TOOLTIP */}
      {!isExpanding && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 px-6 py-2 bg-obsidian-100 border border-white/10 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[1000]">
           <span className="text-[9px] font-mono text-primary italic">"Rounding up your cognitive potential to the nearest industrial scale."</span>
        </div>
      )}
    </div>
  );
};

export default AIHandshakeToolbar;
