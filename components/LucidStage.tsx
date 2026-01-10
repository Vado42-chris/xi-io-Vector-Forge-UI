
import React, { useState } from 'react';

const LucidStage: React.FC = () => {
  const [intensity, setIntensity] = useState(75);
  const [kelvin, setKelvin] = useState(6500);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleGlobalSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2500);
  };

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-700">
      <div className="flex-1 flex overflow-hidden">
        {/* ATMOSPHERIC STAGE AREA */}
        <div className="flex-1 p-12 flex flex-col items-center justify-center relative bg-black/60 overflow-hidden">
           {/* LIGHT GIZMOS MOCKED */}
           <div className="absolute top-1/4 left-1/4 size-10 rounded-full bg-primary/20 border border-primary animate-pulse flex items-center justify-center cursor-move shadow-[0_0_20px_var(--xi-vector-500)]">
              <span className="material-symbols-outlined text-sm text-primary">lightbulb</span>
           </div>
           <div className="absolute bottom-1/3 right-1/4 size-10 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center cursor-move shadow-[0_0_20px_cyan]">
              <span className="material-symbols-outlined text-sm text-cyan-500">flare</span>
           </div>

           {/* ATMOSPHERIC OVERLAYS */}
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_rgba(255,152,0,0.05)_0%,_transparent_50%)]"></div>

           <div className="w-full max-w-5xl aspect-video bg-obsidian-100 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden group flex items-center justify-center">
              <div className="absolute inset-0 canvas-grid opacity-10"></div>
              
              {/* MOCKED SCENE COMPOSITION */}
              <div className="relative preserve-3d transition-transform duration-700 hover:rotate-y-12 flex flex-col items-center">
                 <span className="material-symbols-outlined text-[300px] text-white/5 font-black">polyline</span>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-48 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
                 </div>
              </div>

              {isSyncing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-2xl z-20">
                   <div className="size-32 rounded-full border-2 border-primary/10 border-t-primary animate-spin"></div>
                   <div className="mt-8 flex flex-col items-center gap-3">
                      <span className="text-2xl font-black text-white uppercase tracking-[0.5em]">Syncing_Lux_Kernel</span>
                      <span className="text-[9px] font-mono text-primary uppercase tracking-[0.2em] animate-pulse">Calculating_Radiosity_Manifest_0x...</span>
                   </div>
                </div>
              )}
           </div>

           <div className="absolute top-6 left-6 z-10 flex gap-4">
              <div className="px-4 py-2 bg-black/60 border border-white/10 rounded-xl backdrop-blur-md flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary text-sm animate-pulse">flare</span>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Lucid_Stage_V8</span>
              </div>
           </div>
        </div>

        {/* COMPOSITION SIDEBAR */}
        <div className="w-96 bg-obsidian-100 border-l border-white/5 p-8 flex flex-col gap-10 shadow-2xl overflow-y-auto custom-scrollbar">
           <div className="space-y-6">
              <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.3em]">Lux_Properties</span>
              <div className="space-y-8 p-6 bg-black/20 rounded-[32px] border border-white/5">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-white uppercase tracking-widest">
                       <span>Intensity</span>
                       <span className="text-primary font-mono">{intensity}%</span>
                    </div>
                    <input 
                      type="range" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/5 rounded-full appearance-none accent-primary" 
                    />
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black text-white uppercase tracking-widest">
                       <span>Temp (Kelvin)</span>
                       <span className="text-amber-500 font-mono">{kelvin}K</span>
                    </div>
                    <input 
                      type="range" min="1000" max="12000" step="100" value={kelvin} onChange={(e) => setKelvin(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/5 rounded-full appearance-none accent-amber-500" 
                    />
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.3em]">Atmospheric_Shards</span>
              <div className="grid grid-cols-2 gap-4">
                 {['VOLUMETRIC_FOG', 'GOD_RAYS', 'LENS_FLARE', 'DEPTH_DOF'].map(p => (
                   <button key={p} className="p-4 bg-obsidian-200 border border-white/5 rounded-2xl text-[8px] font-black text-obsidian-500 uppercase tracking-widest hover:border-primary/40 hover:text-white transition-all text-center">
                      {p}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.3em]">PBR_Material_Stack</span>
              <div className="space-y-3">
                 {['CHASSIS_METAL_01', 'GLASS_REFRACT_A', 'NEON_EMISSION_V3'].map(mat => (
                   <div key={mat} className="flex items-center gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl group cursor-pointer hover:border-primary/40 transition-all">
                      <div className="size-8 rounded-lg bg-obsidian-300 border border-white/10 flex items-center justify-center text-primary">
                         <span className="material-symbols-outlined text-sm">texture</span>
                      </div>
                      <span className="text-[10px] font-black text-white uppercase tracking-tight">{mat}</span>
                      <span className="material-symbols-outlined text-obsidian-700 text-sm ml-auto">more_vert</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="mt-auto space-y-6">
              <button 
                onClick={handleGlobalSync}
                disabled={isSyncing}
                className="w-full py-6 bg-primary text-white rounded-[32px] text-[12px] font-black uppercase tracking-[0.5em] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-4"
              >
                 <span className="material-symbols-outlined text-[24px]">sync</span>
                 Global_Scene_Sync
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LucidStage;
