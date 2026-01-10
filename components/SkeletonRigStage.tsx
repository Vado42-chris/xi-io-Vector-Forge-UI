
import React from 'react';

const SkeletonRigStage: React.FC = () => {
  return (
    <div className="flex-1 bg-obsidian-200 relative overflow-hidden animate-in fade-in duration-700 flex">
      <div className="flex-1 relative flex items-center justify-center canvas-grid overflow-hidden">
        {/* X-RAY CANVAS OVERLAY */}
        <div className="relative w-[512px] h-[512px] bg-black/60 rounded-[32px] border border-primary/20 shadow-2xl overflow-hidden group">
           <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <span className="material-symbols-outlined text-[400px] text-white/5 font-black">polyline</span>
           </div>
           
           {/* SIMULATED BONE HIERARCHY */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Spine */}
              <line x1="256" y1="400" x2="256" y2="200" stroke="#FF9800" strokeWidth="4" strokeLinecap="round" className="opacity-80" />
              {/* Arms */}
              <line x1="256" y1="220" x2="150" y2="280" stroke="#FF9800" strokeWidth="4" strokeLinecap="round" className="opacity-80" />
              <line x1="256" y1="220" x2="362" y2="280" stroke="#FF9800" strokeWidth="4" strokeLinecap="round" className="opacity-80" />
              
              {/* JOINTS */}
              <circle cx="256" cy="400" r="6" fill="#08090c" stroke="#FF9800" strokeWidth="2" />
              <circle cx="256" cy="200" r="8" fill="#FF9800" className="animate-pulse" />
              <circle cx="150" cy="280" r="6" fill="#08090c" stroke="#FF9800" strokeWidth="2" />
              <circle cx="362" cy="280" r="6" fill="#08090c" stroke="#FF9800" strokeWidth="2" />
           </svg>

           {/* RIGGING HUD */}
           <div className="absolute top-8 right-8 z-10 flex flex-col gap-4">
              <div className="p-4 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-md space-y-3">
                 <span className="text-[7px] font-mono text-primary uppercase tracking-widest">Kinematic_Status</span>
                 <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-black text-white uppercase">IK_LINK_STABLE</span>
                 </div>
              </div>
           </div>
        </div>

        {/* BOTTOM GIZMO DOCK */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-obsidian-100/80 border border-white/10 rounded-[32px] p-2 backdrop-blur-2xl flex items-center gap-2 shadow-2xl">
           {['near_me', 'hub', 'gesture', 'draw_abstract'].map((icon, i) => (
             <button key={i} className={`size-12 rounded-2xl flex items-center justify-center transition-all ${i === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-obsidian-600 hover:text-white hover:bg-white/5'}`}>
                <span className="material-symbols-outlined text-[22px]">{icon}</span>
             </button>
           ))}
        </div>
      </div>

      {/* HIERARCHY SIDEBAR */}
      <div className="w-80 bg-obsidian-100 border-l border-white/5 p-8 flex flex-col gap-10">
         <div className="space-y-6">
            <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.3em]">Bone_Manifest</span>
            <div className="space-y-3">
               {['ROOT_PELVIS', 'SPINE_01', 'ARM_L', 'ARM_R', 'HEAD_SYNTH'].map((bone, i) => (
                 <div key={bone} className="flex items-center gap-4 p-3 bg-black/20 border border-white/5 rounded-xl hover:border-primary/40 transition-all cursor-pointer group">
                    <div className="size-1.5 rounded-full bg-primary/40 group-hover:bg-primary"></div>
                    <span className="text-[10px] font-black text-obsidian-400 group-hover:text-white uppercase tracking-tight">{bone}</span>
                    <span className="material-symbols-outlined text-sm text-obsidian-700 ml-auto">lock_open</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="mt-auto p-6 bg-primary/5 border border-primary/20 rounded-[32px] space-y-4">
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary text-sm">settings_input_antenna</span>
               <span className="text-[10px] font-black text-white uppercase italic">Marketplace_Ready</span>
            </div>
            <p className="text-[8px] text-obsidian-500 italic leading-relaxed">
              This rig uses standard BoneID-0x naming conventions and is fully compatible with Xibalba Motion Shards.
            </p>
         </div>
      </div>
    </div>
  );
};

export default SkeletonRigStage;
