
import React, { useState, useEffect } from 'react';
import { XI_Telemetry } from './IndustrialPrimitives';

interface FooterProps {
  nodeCount: number;
  isRendering: boolean;
  currentFrame: number;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  setCurrentFrame: (f: number) => void;
  isExpertMode?: boolean;
  onExpandTimeline?: () => void;
}

const Footer: React.FC<FooterProps> = ({ nodeCount, isRendering, currentFrame, isPlaying, setIsPlaying, setCurrentFrame, isExpertMode, onExpandTimeline }) => {
  const [joke, setJoke] = useState("Initializing_Heuristics...");

  const jokes = [
    "Rounding human logic down to 0.12μ friction.",
    "Solving the 10-body UX problem...",
    "Baking delight into the temporal manifold.",
    "Normalizing cognitive load to industrially acceptable levels.",
    "Refactoring soul.exe... Industrial standards met."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setJoke(jokes[Math.floor(Math.random() * jokes.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="h-full shrink-0 bg-obsidian-950 border-t border-white/[0.02] flex items-center px-4 select-none relative">
      <div className="flex items-center gap-2 border-r border-white/5 pr-6 h-8">
        <button onClick={() => setCurrentFrame(0)} className="size-8 rounded-xi flex items-center justify-center text-obsidian-500 hover:bg-white/5 hover:text-primary transition-all">
          <span className="material-symbols-outlined !text-[18px]">first_page</span>
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`size-10 rounded-xi flex items-center justify-center border transition-all ${isPlaying ? 'bg-primary/20 border-primary text-primary shadow-2xl shadow-primary/10' : 'bg-obsidian-900 border-white/5 text-obsidian-400 hover:text-white'}`}
        >
          <span className="material-symbols-outlined !text-[24px]">{isPlaying ? 'pause' : 'play_arrow'}</span>
        </button>
        <button onClick={() => setCurrentFrame(250)} className="size-8 rounded-xi flex items-center justify-center text-obsidian-500 hover:bg-white/5 hover:text-primary transition-all">
          <span className="material-symbols-outlined !text-[18px]">last_page</span>
        </button>
      </div>

      <div className="flex-1 h-10 flex flex-col justify-center gap-2 px-8 bg-black/40 rounded-xi border border-white/[0.02] mx-4 shadow-inner relative group">
        <div className="flex justify-between items-center text-[7px] font-black text-obsidian-600 uppercase tracking-[0.4em] z-10 px-1">
           <span className="italic">FRAME_000</span>
           <button 
              onClick={onExpandTimeline}
              className="flex items-center gap-3 bg-primary/5 px-3 py-0.5 rounded border border-primary/10 hover:bg-primary/20 transition-all cursor-pointer"
            >
              <span className="text-primary font-bold italic">T_{currentFrame.toString().padStart(3, '0')}</span>
              <span className="material-symbols-outlined !text-[10px] text-primary/40">expand_less</span>
           </button>
           <span className="italic">FRAME_250</span>
        </div>
        <div className="relative h-1 flex items-center">
          <input 
            type="range" min="0" max="250" value={currentFrame}
            onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full appearance-none bg-obsidian-800 rounded-full cursor-pointer z-20 accent-primary"
          />
          <div 
            className="absolute h-3 w-1 bg-primary z-10 rounded shadow-[0_0_10px_var(--xi-accent)] pointer-events-none" 
            style={{ left: `calc(${(currentFrame / 250) * 100}% - 2px)` }}
          ></div>
        </div>
      </div>

      <div className="h-full flex items-center border-l border-white/5 pl-8 gap-12 relative z-10">
         <div className="flex flex-col items-end gap-1 min-w-[220px]">
            <span className="text-[7px] font-mono text-primary uppercase tracking-[0.3em] italic font-bold opacity-60">{joke}</span>
            <div className="flex items-baseline gap-2 leading-none">
               <span className="text-[14px] font-black text-obsidian-300 mono tabular-nums">{nodeCount.toString().padStart(4, '0')}</span>
               <span className="text-[8px] text-obsidian-600 font-black uppercase tracking-widest italic">Event_Nodes</span>
            </div>
         </div>
         
         <div className="flex gap-8 items-center">
           <XI_Telemetry label="KERNEL" value="V8.4" />
           <div className={`px-4 py-1.5 rounded border flex items-center gap-3 ${isRendering ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-green-500/5 border-green-500/20 text-green-500/60'}`}>
              <div className={`size-1.5 rounded-full ${isRendering ? 'bg-primary animate-pulse' : 'bg-green-500/40'}`}></div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">{isRendering ? 'BAKING' : 'STABLE'}</span>
           </div>
         </div>
      </div>
    </footer>
  );
};

export default Footer;
