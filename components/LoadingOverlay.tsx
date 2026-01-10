import React, { useState, useEffect } from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  type: 'SYNTHESIS' | 'BAKING' | 'HANDSHAKE' | 'AUDIT';
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, type }) => {
  const [joke, setJoke] = useState("");

  const jokes = [
    "Rounding user anxiety down to 0.12μ friction...",
    "Teaching the AI to value human curiosity over efficiency...",
    "Dividing your project's soul by its complexity...",
    "Solving the 11th body problem (the client's opinion)...",
    "Baking recursive royalties into the vertex data...",
    "Normalizing cognitive load to industrially acceptable levels...",
    "Extracting design DNA from the ghost in the machine...",
    "Calculating the square root of a pixel's delight...",
    "Rounding up your bank account to the nearest industrial manifest..."
  ];

  useEffect(() => {
    if (isVisible) {
      setJoke(jokes[Math.floor(Math.random() * jokes.length)]);
      const interval = setInterval(() => {
        setJoke(jokes[Math.floor(Math.random() * jokes.length)]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-obsidian-950/98 backdrop-blur-3xl flex flex-col items-center justify-center animate-in fade-in duration-500">
       <div className="relative mb-20 group">
          <div className="absolute -inset-32 bg-primary/10 blur-[150px] rounded-full animate-pulse group-hover:bg-primary/20 transition-all duration-1000"></div>
          <div className="size-56 rounded-[60px] border-4 border-white/5 bg-black/50 flex items-center justify-center relative z-10 shadow-inner group-hover:rotate-12 transition-transform duration-1000 group-hover:border-primary/20">
             <div className="size-40 rounded-full border-[8px] border-primary/5 border-t-primary animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-[80px] text-primary animate-pulse font-black">
                   {type === 'SYNTHESIS' ? 'bolt' : type === 'BAKING' ? 'local_fire_department' : type === 'HANDSHAKE' ? 'sync_alt' : 'fact_check'}
                </span>
             </div>
          </div>
       </div>

       <div className="text-center space-y-10 max-w-3xl animate-in slide-in-from-bottom-12 duration-700">
          <div className="space-y-6">
             <span className="text-[14px] font-black text-primary uppercase tracking-[1em] italic leading-none">{type}_HANDSHAKE_IN_PROGRESS</span>
             <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-tight px-10">
                {joke}
             </h3>
          </div>
          
          <div className="flex flex-col items-center gap-8">
             <div className="w-96 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
                <div className="h-full bg-primary rounded-full animate-[scanning_2s_linear_infinite] shadow-[0_0_30px_var(--xi-accent)]"></div>
             </div>
             <p className="text-[11px] font-mono text-obsidian-600 uppercase tracking-[0.6em] italic font-bold">
                Kernel_Sovereignty: UNCOMPROMISED // SEED_001
             </p>
          </div>
       </div>

       <div className="absolute bottom-16 flex items-center gap-12 opacity-30">
          <div className="flex items-center gap-4">
             <div className="size-2 rounded-full bg-primary animate-pulse"></div>
             <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Curiosity_v8.4.2</span>
          </div>
          <div className="h-px w-24 bg-white/10"></div>
          <div className="flex items-center gap-4">
             <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Industrial_Sync_Stable</span>
          </div>
       </div>
    </div>
  );
};

export default LoadingOverlay;