
import React from 'react';
import { ProjectFile } from '../types';

interface TimelineSequencerProps {
  currentFrame: number;
  totalFrames: number;
  shards: ProjectFile[];
  onSeek: (frame: number) => void;
}

const TimelineSequencer: React.FC<TimelineSequencerProps> = ({ currentFrame, totalFrames, shards, onSeek }) => {
  const tracks = [
    { id: 't1', name: 'V_CHASSIS', icon: 'polyline', color: '#b8860b' },
    { id: 't2', name: 'M_FLUX', icon: 'flare', color: '#06b6d4' },
    { id: 't3', name: 'K_LOGIC', icon: 'code', color: '#a855f7' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-obsidian-950 overflow-hidden select-none">
      {/* HEADERBAR */}
      <div className="h-10 border-b border-white/5 bg-black/40 flex items-center justify-between px-6 shrink-0">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary text-sm animate-pulse">schedule</span>
               <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Temporal_Sequencer_v8.4</span>
            </div>
            <div className="h-4 w-px bg-white/10 mx-2"></div>
            <div className="flex items-center gap-2">
               <span className="text-[8px] font-mono text-obsidian-600 uppercase">FPS:</span>
               <span className="text-[10px] font-mono text-white font-bold">24.00</span>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <button className="px-4 py-1 bg-black/40 border border-white/10 rounded text-[8px] font-black text-obsidian-500 uppercase tracking-widest hover:text-white transition-all">Add_Track</button>
            <button className="px-4 py-1 bg-primary/10 border border-primary/20 rounded text-[8px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-black transition-all">Bake_Manifest</button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* TRACK LIST RAIL */}
         <div className="w-64 border-r border-white/5 bg-black/20 flex flex-col shrink-0 overflow-y-auto no-scrollbar">
            {tracks.map(track => (
              <div key={track.id} className="h-14 border-b border-white/5 flex items-center px-6 gap-4 group hover:bg-white/[0.02] cursor-pointer">
                 <div className="size-8 rounded-lg flex items-center justify-center border border-white/5 bg-black shadow-inner group-hover:border-primary/40 transition-all">
                    <span className="material-symbols-outlined text-[16px]" style={{ color: track.color }}>{track.icon}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">{track.name}</span>
                    <span className="text-[7px] font-mono text-obsidian-600 uppercase italic">Kernel_Active</span>
                 </div>
              </div>
            ))}
         </div>

         {/* GRID STAGE */}
         <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* FRAME RULER */}
            <div 
              className="h-8 border-b border-white/5 bg-obsidian-950 relative cursor-crosshair group overflow-hidden shrink-0"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                onSeek(Math.round(((e.clientX - rect.left) / rect.width) * totalFrames));
              }}
            >
               <div className="absolute inset-0 canvas-grid opacity-[0.05]"></div>
               {Array.from({ length: 13 }).map((_, i) => (
                 <div key={i} className="absolute h-full flex flex-col items-center" style={{ left: `${(i * 20 / totalFrames) * 100}%` }}>
                    <div className="h-3 w-px bg-white/20"></div>
                    <span className="text-[7px] font-mono text-obsidian-600 mt-0.5">{i * 20}</span>
                 </div>
               ))}
            </div>

            {/* TRACK CONTENT SLOTS */}
            <div className="flex-1 overflow-y-auto no-scrollbar bg-black/40 divide-y divide-white/5 relative">
               {tracks.map(track => (
                 <div key={track.id} className="h-14 w-full relative group hover:bg-white/[0.01]">
                    {/* KEYFRAMES MOCKED */}
                    <div className="absolute top-1/2 left-20 size-3 bg-primary rotate-45 -translate-y-1/2 border border-white/20 shadow-[0_0_10px_var(--xi-accent)] cursor-move"></div>
                    <div className="absolute top-1/2 left-[60%] size-3 bg-primary rotate-45 -translate-y-1/2 border border-white/20 opacity-40"></div>
                    {track.id === 't2' && (
                      <div className="absolute top-1/2 left-80 size-3 bg-cyan-500 rotate-45 -translate-y-1/2 border border-white/20 shadow-[0_0_10px_cyan]"></div>
                    )}
                 </div>
               ))}

               {/* PLAYHEAD */}
               <div 
                 className="absolute top-0 bottom-0 w-px bg-primary z-50 pointer-events-none shadow-[0_0_20px_orange]"
                 style={{ left: `${(currentFrame / totalFrames) * 100}%` }}
               >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 size-3 bg-primary rotate-45 border border-obsidian-950 flex items-center justify-center">
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TimelineSequencer;
