
import React, { useState } from 'react';

const VeoMotionForge: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    setIsGenerating(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setProgress(0);
        }, 1000);
      }
    }, 150);
  };

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-700">
      <div className="flex-1 flex overflow-hidden">
        {/* VIDEO PREVIEW FRAME */}
        <div className="flex-1 p-12 flex flex-col items-center justify-center relative bg-black/40">
           <div className="absolute top-6 left-6 z-10 flex gap-4">
              <div className="px-4 py-2 bg-black/60 border border-white/10 rounded-xl backdrop-blur-md flex items-center gap-3">
                 <span className="material-symbols-outlined text-amber-500 text-sm animate-pulse">movie</span>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Veo_Motion_Synthesizer</span>
              </div>
           </div>

           <div className="w-full max-w-4xl aspect-video bg-obsidian-100 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 canvas-grid opacity-10"></div>
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 bg-black/60 backdrop-blur-md z-20">
                   <div className="size-24 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin"></div>
                   <div className="flex flex-col items-center gap-2">
                      <span className="text-xl font-black text-white uppercase tracking-widest tabular-nums">{progress}%</span>
                      <span className="text-[9px] font-mono text-amber-500 uppercase tracking-[0.5em] animate-pulse italic">Materializing_Temporal_Shard...</span>
                   </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-obsidian-600 space-y-4">
                   <span className="material-symbols-outlined text-[100px] opacity-10">play_circle</span>
                   <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Awaiting_Kinetic_Directive</span>
                </div>
              )}
           </div>

           {/* FOOTER TIMELINE MINI */}
           <div className="w-full max-w-4xl h-1 bg-white/5 rounded-full mt-8 overflow-hidden">
              <div className="h-full bg-amber-500 w-[40%] shadow-[0_0_10px_orange]"></div>
           </div>
        </div>

        {/* CONTROL SIDEBAR */}
        <div className="w-96 bg-obsidian-100 border-l border-white/5 p-8 flex flex-col gap-10 shadow-2xl">
           <div className="space-y-4">
              <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.3em]">Kinetic_Prompt</span>
              <div className="bg-black/40 border border-white/10 rounded-2xl p-5 min-h-[160px] flex flex-col group focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
                 <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe motion trajectory... (e.g., 'Core chassis rotates 360 degrees with neon flux trailing')"
                    className="w-full bg-transparent border-none text-[12px] text-white outline-none resize-none flex-1 font-mono italic leading-relaxed"
                 />
              </div>
           </div>

           <div className="space-y-6">
              <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.3em]">Reference_Manifests</span>
              <div className="grid grid-cols-2 gap-4">
                 <div className="aspect-square bg-black/40 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-obsidian-700 hover:text-white hover:border-white/30 transition-all cursor-pointer">
                    <span className="material-symbols-outlined">image</span>
                    <span className="text-[8px] font-black uppercase">Start_Frame</span>
                 </div>
                 <div className="aspect-square bg-black/40 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-obsidian-700 hover:text-white hover:border-white/30 transition-all cursor-pointer">
                    <span className="material-symbols-outlined">image</span>
                    <span className="text-[8px] font-black uppercase">End_Frame</span>
                 </div>
              </div>
           </div>

           <div className="mt-auto space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-obsidian-500">
                 <span>Resolution</span>
                 <span className="text-white">1080P // 16:9</span>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-6 bg-amber-500 text-white rounded-[32px] text-[12px] font-black uppercase tracking-[0.5em] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-4"
              >
                 <span className="material-symbols-outlined text-[24px]">bolt</span>
                 Materialize_Video
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VeoMotionForge;
