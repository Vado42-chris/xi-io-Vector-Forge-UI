
import React, { useMemo } from 'react';
import { FileShard } from '../types';

interface TimelineSequencerProps {
  currentFrame: number;
  totalFrames: number;
  shards: FileShard[];
  onSeek: (frame: number) => void;
}

const TimelineSequencer: React.FC<TimelineSequencerProps> = ({ currentFrame, totalFrames, shards, onSeek }) => {
  const tracks = useMemo(() => [
    { id: 't-vec', label: 'Vector_Manifests', icon: 'polyline', color: 'primary' },
    { id: 't-mot', label: 'Motion_Kernels', icon: 'movie', color: 'amber-500' },
    { id: 't-vfx', label: 'Flux_Emitters', icon: 'flare', color: 'cyan-400' },
    { id: 't-aud', label: 'Sonic_Shards', icon: 'audio_file', color: 'purple-500' },
  ], []);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const frame = Math.round((x / rect.width) * totalFrames);
    onSeek(Math.max(0, Math.min(totalFrames, frame)));
  };

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-700">
      {/* TIMELINE TOOLBAR */}
      <div className="h-12 border-b border-white/5 bg-obsidian-100 flex items-center justify-between px-6 shrink-0">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary text-sm animate-pulse">schedule</span>
               <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Temporal_Orchestrator_v1.2</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="flex items-center gap-2">
               <span className="text-[8px] font-mono text-obsidian-600 uppercase">FPS:</span>
               <span className="text-[10px] font-mono text-white font-bold">24.00</span>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <button className="px-4 py-1 bg-black/40 border border-white/10 rounded-lg text-[8px] font-black text-obsidian-500 uppercase tracking-widest hover:text-white transition-all">Add_Track</button>
            <button className="px-4 py-1 bg-primary/10 border border-primary/40 rounded-lg text-[8px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Bake_All</button>
         </div>
      </div>

      {/* TRACK AREA */}
      <div className="flex-1 flex overflow-hidden">
         {/* TRACK LABELS */}
         <div className="w-64 border-r border-white/5 bg-black/10 flex flex-col overflow-hidden">
            <div className="h-10 border-b border-white/5 flex items-center px-6">
               <span className="text-[8px] font-black text-obsidian-700 uppercase tracking-widest italic">Track_Identity</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/5">
               {tracks.map(track => (
                 <div key={track.id} className="h-20 flex items-center gap-4 px-6 group hover:bg-white/5 transition-all">
                    <div className={`size-10 rounded-xl bg-${track.color}/10 border border-${track.color}/20 flex items-center justify-center text-${track.color}`}>
                       <span className="material-symbols-outlined text-[20px]">{track.icon}</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-white uppercase tracking-tight">{track.label}</span>
                       <span className="text-[7px] font-mono text-obsidian-600 uppercase tracking-widest italic">Active_Kernel_0x</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* SEQUENCER GRID */}
         <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* TIME RULER */}
            <div 
              className="h-10 border-b border-white/5 bg-obsidian-100 relative cursor-pointer group"
              onClick={handleTimelineClick}
            >
               <div className="absolute inset-0 canvas-grid opacity-20"></div>
               {Array.from({ length: 11 }).map((_, i) => (
                 <div 
                   key={i} 
                   className="absolute h-full flex flex-col items-center" 
                   style={{ left: `${i * 10}%` }}
                 >
                    <div className="h-3 w-px bg-white/20"></div>
                    <span className="text-[7px] font-mono text-obsidian-600 mt-0.5">{Math.round((i * totalFrames) / 10)}</span>
                 </div>
               ))}
            </div>

            {/* TRACK SLOTS */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-black/20 divide-y divide-white/5">
               {tracks.map(track => (
                 <div key={track.id} className="h-20 w-full relative group transition-colors hover:bg-white/5">
                    {/* MOCKED SHARD BLOCKS */}
                    <div 
                      className={`absolute top-4 h-12 rounded-xl border border-${track.color}/40 bg-${track.color}/10 flex items-center px-4 cursor-move transition-all hover:scale-[1.01]`}
                      style={{ left: '15%', width: '30%' }}
                    >
                       <span className={`text-[8px] font-black text-${track.color} uppercase tracking-widest truncate`}>SHARD_ALPHA_PRIME</span>
                    </div>
                    {track.id === 't-vfx' && (
                      <div 
                        className={`absolute top-4 h-12 rounded-xl border border-${track.color}/40 bg-${track.color}/10 flex items-center px-4 cursor-move transition-all hover:scale-[1.01]`}
                        style={{ left: '60%', width: '20%' }}
                      >
                         <span className={`text-[8px] font-black text-${track.color} uppercase tracking-widest truncate`}>FLUX_BLAST_01</span>
                      </div>
                    )}
                 </div>
               ))}

               {/* PLAYHEAD */}
               <div 
                 className="absolute top-0 bottom-0 w-px bg-primary z-50 pointer-events-none shadow-[0_0_15px_rgba(255,152,0,0.5)]"
                 style={{ left: `${(currentFrame / totalFrames) * 100}%` }}
               >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 size-3 bg-primary rotate-45 border border-white/20"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-2 py-1 bg-primary text-[8px] font-black text-white rounded-md whitespace-nowrap shadow-xl translate-y-full mt-2 uppercase">
                    FRAME_{currentFrame}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TimelineSequencer;
