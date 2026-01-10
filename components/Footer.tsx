
import React, { useState, useEffect } from 'react';
import { XI_Telemetry, XI_StatusBadge, XI_ProgressGauge } from './IndustrialPrimitives';
import { translate } from '../services/lexiconService';

interface FooterProps {
  nodeCount: number;
  isRendering: boolean;
  currentFrame: number;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  setCurrentFrame: (f: number) => void;
  verboseMode?: boolean;
  isTimelineExpanded?: boolean;
  onToggleTimeline?: () => void;
  latency?: number;
}

const Footer: React.FC<FooterProps> = ({ 
  nodeCount, isRendering, currentFrame, isPlaying, setIsPlaying, 
  setCurrentFrame, verboseMode = false, isTimelineExpanded = false, onToggleTimeline, latency = 42 
}) => {
  const [vramUsage, setVramUsage] = useState(0);

  useEffect(() => {
    const load = Math.min(100, Math.round((nodeCount / 500) * 100));
    setVramUsage(Math.min(100, Math.round(load * 0.8)));
  }, [nodeCount]);

  return (
    <footer className="h-12 bg-obsidian-950 border-t border-white/[0.05] flex items-center px-4 select-none relative z-[700] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {/* PLAYBACK CONTROLS */}
      <div className="flex items-center gap-2 border-r border-white/5 pr-6 h-8">
        <button onClick={() => setCurrentFrame(0)} className="size-8 rounded flex items-center justify-center text-obsidian-500 hover:text-primary transition-all">
          <span className="material-symbols-outlined !text-[18px]">first_page</span>
        </button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`size-8 rounded flex items-center justify-center border transition-all ${isPlaying ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(184,134,11,0.2)]' : 'bg-obsidian-900 border-white/5 text-obsidian-400 hover:text-white'}`}
        >
          <span className="material-symbols-outlined !text-[20px]">{isPlaying ? 'pause' : 'play_arrow'}</span>
        </button>
        <button onClick={() => setCurrentFrame(250)} className="size-8 rounded flex items-center justify-center text-obsidian-500 hover:text-primary transition-all">
          <span className="material-symbols-outlined !text-[18px]">last_page</span>
        </button>
      </div>

      {/* SCRUBBER AREA */}
      <div className="flex-1 h-8 flex flex-col justify-center gap-1.5 px-8 bg-black/40 rounded border border-white/[0.02] mx-4 shadow-inner relative group">
        <div className="flex justify-between items-center text-[7px] font-black text-obsidian-600 uppercase tracking-[0.4em] px-1">
           <span className="italic">{verboseMode ? 'START' : 'FRAME_000'}</span>
           <button 
              onClick={onToggleTimeline}
              className={`flex items-center gap-3 px-3 py-0.5 rounded border transition-all cursor-pointer ${isTimelineExpanded ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-obsidian-400 hover:text-white'}`}
            >
              <span className="font-bold italic">{verboseMode ? `Frame: ${currentFrame}` : `T_${currentFrame.toString().padStart(3, '0')}`}</span>
              <span className={`material-symbols-outlined !text-[10px] transition-transform ${isTimelineExpanded ? 'rotate-180' : ''}`}>expand_less</span>
           </button>
           <span className="italic">{verboseMode ? 'END' : 'FRAME_250'}</span>
        </div>
        <div className="relative h-1 flex items-center">
          <input 
            type="range" min="0" max="250" value={currentFrame}
            onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full appearance-none bg-obsidian-800 rounded-full cursor-pointer z-20 accent-primary"
          />
        </div>
      </div>

      {/* TELEMETRY */}
      <div className="flex items-center gap-8 border-l border-white/5 pl-8 pr-4 h-8">
         <div className="w-24">
            <XI_ProgressGauge label={translate('VRAM_ALLOCATION', verboseMode)} value={vramUsage} color={vramUsage > 85 ? '#ef4444' : 'var(--xi-accent)'} />
         </div>
         
         <div className="flex gap-6 items-center">
           <div className="flex flex-col items-end">
              <span className="text-[7px] font-black text-obsidian-600 uppercase tracking-widest leading-none mb-1 opacity-60">
                {translate('CIRCUIT_STABILITY', verboseMode)}
              </span>
              <span className={`text-[11px] font-mono font-bold italic ${latency > 100 ? 'text-amber-500' : 'text-green-500'}`}>
                {latency}ms
              </span>
           </div>
           <XI_StatusBadge status={isRendering ? 'STANDBY' : 'STABLE'} label={verboseMode ? "Audit Clear" : "PARITY_SIG"} />
           <XI_Telemetry label={verboseMode ? "VERSION" : "BUILD"} value="0.8.4_S" />
         </div>
      </div>
    </footer>
  );
};

export default Footer;
