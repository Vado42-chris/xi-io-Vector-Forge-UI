
import React, { useState } from 'react';
import { AppState, ProjectManifest } from '../types';
import { XI_Button, XI_Telemetry, XI_ProgressGauge } from './IndustrialPrimitives';

interface CompositingNexusProps {
  state: AppState;
  verboseMode?: boolean;
}

const CompositingNexus: React.FC<CompositingNexusProps> = ({ state, verboseMode = false }) => {
  const [selectedCompLayer, setSelectedCompLayer] = useState<string | null>(null);

  // Mocked studio layers for the ZR1 update
  const compLayers = [
    { id: 'l1', name: 'HUD_Overlay_React', type: 'REACT', opacity: 0.9, hashtags: ['#HUD_V8', '#Alpha_UI'] },
    { id: 'l2', name: 'Character_Anim_Alpha', type: 'MOVIE', opacity: 1.0, hashtags: ['#Kinetic_Root', '#Alpha_Movie'] },
    { id: 'l3', name: 'Background_Environment', type: 'UNREAL', opacity: 1.0, hashtags: ['#Environment_0x'] },
  ];

  return (
    <div className="flex-1 bg-obsidian-950 flex flex-col h-full overflow-hidden animate-in fade-in duration-700">
      <div className="flex-1 flex overflow-hidden">
        {/* COMPOSITING STAGE */}
        <div className="flex-1 p-12 flex flex-col relative bg-black/60 overflow-hidden border-r border-white/5">
           <div className="absolute top-8 left-8 z-50 flex flex-col gap-4">
              <div className="px-6 py-3 bg-black/80 border border-primary/20 rounded-2xl backdrop-blur-md flex items-center gap-4">
                 <span className="material-symbols-outlined text-primary text-xl animate-pulse">layers</span>
                 <div className="flex flex-col">
                    <span className="text-[11px] font-black text-white uppercase tracking-widest leading-none">Compositing_Stage</span>
                    <span className="text-[8px] font-mono text-obsidian-600 uppercase mt-1 italic">
                       Alpha_Composite_v8.4 // MODE: PRODUCTION
                    </span>
                 </div>
              </div>
           </div>

           {/* VIRTUAL VIEWPORT (PREVIEW) */}
           <div className="flex-1 flex items-center justify-center relative">
              <div className="w-full max-w-5xl aspect-video bg-obsidian-900 border-2 border-white/5 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,1)] relative overflow-hidden group">
                 <div className="absolute inset-0 canvas-grid opacity-10"></div>
                 
                 {/* COMPOSITED LAYERS SIMULATION */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    {/* Layer 3: Environment */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"></div>
                    
                    {/* Layer 2: Character (SVG Representation) */}
                    <div className="relative z-20 scale-150 animate-bounce duration-[2s]">
                       <span className="material-symbols-outlined text-[200px] text-primary/40 filter drop-shadow-[0_0_30px_rgba(184,134,11,0.3)]">person</span>
                    </div>

                    {/* Layer 1: React HUD */}
                    <div className="absolute inset-10 border-2 border-cyan-500/20 rounded-[32px] pointer-events-none z-30">
                       <div className="absolute top-8 left-8 flex gap-3">
                          <div className="size-2 rounded-full bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
                          <div className="w-20 h-1 bg-cyan-500/40 rounded-full"></div>
                       </div>
                       <div className="absolute bottom-8 right-8 text-right">
                          <span className="text-[10px] font-mono text-cyan-500 font-black italic tracking-widest">REACT_HUD_v0.8</span>
                       </div>
                    </div>
                 </div>

                 {/* INTERACTIVE SCANNER (UNREAL SYNC) */}
                 <div className="absolute inset-0 z-40 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(184,134,11,0.05)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
              </div>
           </div>

           {/* RENDERING HUD */}
           <div className="absolute bottom-8 left-8 right-8 grid grid-cols-4 gap-8 z-50">
              <div className="p-6 bg-black/60 border border-white/10 rounded-2xl space-y-2 backdrop-blur-xl">
                 <span className="text-[8px] font-black text-primary uppercase tracking-widest italic">ALPHA_PARITY</span>
                 <div className="text-[18px] font-black text-white italic tabular-nums leading-none">99.82%_CLEAN</div>
              </div>
              <div className="p-6 bg-black/60 border border-white/10 rounded-2xl space-y-2 backdrop-blur-xl">
                 <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest italic">UI_BRIDGE_SYNC</span>
                 <div className="text-[18px] font-black text-white italic tabular-nums leading-none">12ms_LATENCY</div>
              </div>
              <div className="col-span-2 p-6 bg-black/60 border border-white/10 rounded-2xl flex items-center justify-between backdrop-blur-xl">
                 <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black text-obsidian-500 uppercase tracking-widest italic">UNREAL_ENGINE_LINK</span>
                    <span className="text-[12px] font-black text-green-500 uppercase tracking-widest">MAINNET_CONNECTED</span>
                 </div>
                 <button className="px-6 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all">
                    Initialize_Pipe
                 </button>
              </div>
           </div>
        </div>

        {/* COMPOSITION SIDEBAR */}
        <div className="w-[420px] bg-obsidian-900 flex flex-col gap-10 p-12 overflow-y-auto custom-scrollbar shadow-2xl z-[60]">
           <div className="space-y-4">
              <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-[0.4em] italic">Compositing_Layers</span>
              <div className="space-y-3">
                 {compLayers.map(layer => (
                   <div 
                    key={layer.id} 
                    onClick={() => setSelectedCompLayer(layer.id)}
                    className={`p-6 rounded-[32px] border transition-all cursor-pointer group ${selectedCompLayer === layer.id ? 'bg-primary/5 border-primary/40 shadow-2xl' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                   >
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex flex-col">
                            <span className="text-[13px] font-black text-white uppercase italic tracking-tight group-hover:text-primary transition-colors">{layer.name}</span>
                            <span className="text-[8px] font-mono text-obsidian-600 uppercase mt-1 italic">{layer.type} // {layer.hashtags[0]}</span>
                         </div>
                         <div className={`size-2 rounded-full ${selectedCompLayer === layer.id ? 'bg-primary animate-pulse shadow-[0_0_10px_orange]' : 'bg-obsidian-800'}`}></div>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-[7px] font-black text-obsidian-500 uppercase tracking-widest italic">
                            <span>Layer_Opacity</span>
                            <span>{Math.round(layer.opacity * 100)}%</span>
                         </div>
                         <div className="h-1 bg-black rounded-full overflow-hidden">
                            <div className="h-full bg-primary/40" style={{ width: `${layer.opacity * 100}%` }}></div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="mt-auto space-y-8">
              <div className="p-8 bg-obsidian-850 border border-white/5 rounded-[40px] space-y-6 shadow-inner">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-black shadow-2xl">
                       <span className="material-symbols-outlined font-black">movie_filter</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[14px] font-black text-white uppercase italic tracking-tight leading-none">Studio_Render_Pipeline</span>
                       <span className="text-[8px] font-mono text-primary uppercase mt-1 italic font-bold">EXPORT_READY</span>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <XI_ProgressGauge label="RECURSIVE_ALPHA_SAMPLING" value={92} color="#06b6d4" />
                    <XI_ProgressGauge label="UI_REACT_INJECTION" value={100} color="#b8860b" />
                 </div>
                 <p className="text-[10px] text-obsidian-500 italic leading-relaxed">
                   "Compiling the current manifest for **Unreal Engine 5.4**. Alpha transparency for characters is verified at 0.12μ friction."
                 </p>
              </div>

              <XI_Button 
                label="Execute_Final_Bake" 
                variant="primary" 
                icon="rocket_launch" 
                className="w-full h-20 rounded-[32px]" 
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default CompositingNexus;
