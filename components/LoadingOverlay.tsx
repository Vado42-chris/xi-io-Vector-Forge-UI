
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
    <div className="fixed inset-0 z-[10000] bg-obsidian-200/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-500">
       <div className="relative mb-20 group">
          <div className="absolute -inset-24 bg-primary/20 blur-[150px] rounded-full animate-pulse group-hover:bg-primary/30 transition-all duration-1000"></div>
          <div className="size-48 rounded-[48px] border-4 border-white/5 bg-black/50 flex items-center justify-center relative z-10 shadow-inner group-hover:rotate-12 transition-transform duration-1000 group-hover:border-primary/20">
             <div className="size-32 rounded-full border-[6px] border-primary/10 border-t-primary animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-[64px] text-primary animate-pulse font-black">
                   {type === 'SYNTHESIS' ? 'bolt' : type === 'BAKING' ? 'local_fire_department' : type === 'HANDSHAKE' ? 'sync_alt' : 'fact_check'}
                </span>
             </div>
          </div>
       </div>

       <div className="text-center space-y-8 max-w-2xl animate-in slide-in-from-bottom-8 duration-700">
          <div className="space-y-4">
             <span className="text-[12px] font-black text-primary uppercase tracking-[0.8em] italic">{type}_IN_PROGRESS</span>
             <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">
                {joke}
             </h3>
          </div>
          
          <div className="flex flex-col items-center gap-6">
             <div className="w-80 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
                <div className="h-full bg-primary rounded-full animate-[scanning_2s_linear_infinite] shadow-[0_0_20px_var(--xi-vector-500)]"></div>
             </div>
             <p className="text-[10px] font-mono text-obsidian-600 uppercase tracking-[0.5em] italic">
                System_Sovereignty: UNCOMPROMISED // SEED_001
             </p>
          </div>
       </div>

       <div className="absolute bottom-16 flex items-center gap-10 opacity-40">
          <div className="flex items-center gap-3">
             <div className="size-2 rounded-sm bg-primary animate-pulse"></div>
             <span className="text-[8px] font-black text-white uppercase tracking-widest italic">Curiosity_v8.4</span>
          </div>
          <div className="h-px w-20 bg-white/10"></div>
          <div className="flex items-center gap-3">
             <div className="size-2 rounded-sm bg-green-500 animate-pulse"></div>
             <span className="text-[8px] font-black text-white uppercase tracking-widest italic">Growth_Protocol_Active</span>
          </div>
       </div>
    </div>
  );
};

export default LoadingOverlay;
