
import React, { useState } from 'react';
import { AppState, ProjectFile } from '../types';
import { XI_Button, XI_Telemetry, XI_StatusBadge } from './IndustrialPrimitives';

interface ProjectExplorerProps {
  state: AppState;
  verboseMode?: boolean;
}

const ProjectExplorer: React.FC<ProjectExplorerProps> = ({ state, verboseMode = false }) => {
  const [activePath, setActivePath] = useState('/root');

  const studioFiles: ProjectFile[] = [
    { id: 'f1', name: 'Main_Manifest.forge', type: 'logic_kernel', path: '/root', hashtags: ['#Root_Sig'], lastModified: Date.now(), authorId: 'ARCHON', isIsolated: true },
    { id: 'f2', name: 'Chassis_v2_Manifold.nurbs', type: 'nurbs_manifold', path: '/root/geometry', hashtags: ['#v61_Precision'], lastModified: Date.now(), authorId: 'DESIGN_LEAD', isIsolated: true },
    { id: 'f3', name: 'UI_Overlay.tsx', type: 'react_component', path: '/root/src', hashtags: ['#Alpha_HUD'], lastModified: Date.now(), authorId: 'DEV_8', isIsolated: true },
    { id: 'f4', name: 'Intro_Sequence.mp4', type: 'alpha_movie', path: '/root/media', hashtags: ['#Render_01'], lastModified: Date.now(), authorId: 'MOTION_LEAD', isIsolated: true },
  ];

  return (
    <div className="flex-1 bg-obsidian-950 flex flex-col h-full overflow-hidden animate-in fade-in duration-500 select-none">
       <div className="h-24 shrink-0 border-b border-white/5 bg-obsidian-950 flex items-center justify-between px-10 relative z-20 shadow-2xl">
          <div className="flex items-center gap-10">
             <div className="flex flex-col">
                <span className="text-[22px] font-black text-white uppercase italic tracking-tighter leading-none">Studio_Vault</span>
                <span className="text-[10px] font-mono text-primary uppercase tracking-[0.4em] mt-2 font-bold italic leading-none">
                  ISO_MANIFEST: {state.projectName}
                </span>
             </div>
             <div className="h-12 w-px bg-white/10 mx-4"></div>
             <div className="flex items-center gap-6 px-10 h-14 bg-black/60 border border-white/10 rounded-2xl shadow-inner relative group cursor-pointer">
                <span className="text-[12px] font-mono text-obsidian-400 uppercase italic relative z-10">{activePath}</span>
                <span className="material-symbols-outlined text-[18px] text-obsidian-600 relative z-10">expand_more</span>
             </div>
          </div>
          
          <div className="flex items-center gap-10">
             <XI_Telemetry label="ZERO_BLEED_PASS" value="STABLE" />
             <div className="w-px h-8 bg-white/5"></div>
             <XI_Button label="NEW_SHARD" variant="primary" icon="add" size="sm" className="h-12 !rounded-xl" />
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden">
          {/* NAVIGATION RAIL */}
          <div className="w-80 border-r border-white/5 bg-obsidian-950 flex flex-col p-10 gap-12">
             <div className="space-y-8">
                <span className="text-[11px] font-black text-obsidian-500 uppercase tracking-widest italic block">Project_Tree</span>
                <div className="space-y-2">
                   {['root', 'geometry', 'assets', 'src', 'media'].map(folder => (
                     <button 
                      key={folder}
                      onClick={() => setActivePath(`/root/${folder}`)}
                      className={`w-full text-left px-6 py-4 rounded-xl text-[12px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-6 border ${activePath.includes(folder) ? 'bg-primary/10 text-primary border-primary/20 shadow-inner' : 'text-obsidian-500 hover:text-white hover:bg-white/5 border-transparent'}`}
                     >
                        <span className="material-symbols-outlined text-[20px]">{activePath.includes(folder) ? 'folder_open' : 'folder'}</span>
                        {folder}
                     </button>
                   ))}
                </div>
             </div>

             <div className="mt-auto p-8 bg-black/40 border border-white/5 rounded-[40px] space-y-6 shadow-2xl relative overflow-hidden group">
                <div className="flex items-center gap-5 relative z-10">
                   <div className="size-11 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 shadow-inner border border-green-500/20">
                      <span className="material-symbols-outlined text-xl font-black">security</span>
                   </div>
                   <span className="text-[12px] font-black text-white uppercase italic">Vault_Active</span>
                </div>
                <p className="text-[10px] text-obsidian-500 italic leading-relaxed uppercase font-bold tracking-tight relative z-10">
                  Hardware-level isolation active. Zero file bleed protocols enforced for current manifest.
                </p>
             </div>
          </div>

          {/* GRID VIEWPORT */}
          <div className="flex-1 p-16 overflow-y-auto custom-scrollbar bg-obsidian-900/40">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-[1800px] mx-auto pb-48">
                {studioFiles.map(file => (
                  <div key={file.id} className="group bg-obsidian-950 border border-white/5 rounded-[48px] p-10 flex flex-col gap-10 hover:border-primary/40 transition-all shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden active:scale-[0.98] cursor-pointer">
                     <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-125 transition-all duration-[3000ms]">
                        <span className="material-symbols-outlined text-[180px]">{file.type === 'nurbs_manifold' ? 'view_in_ar' : 'description'}</span>
                     </div>
                     
                     <div className="flex justify-between items-start relative z-10">
                        <div className={`size-16 rounded-[28px] bg-black/60 border border-white/10 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-black shadow-2xl`}>
                           <span className="material-symbols-outlined text-[32px]">{file.type === 'alpha_movie' ? 'movie' : file.type === 'nurbs_manifold' ? 'architecture' : 'description'}</span>
                        </div>
                        <div className="px-4 py-1.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                           <span className="text-[10px] font-black text-obsidian-400 uppercase tracking-widest">{file.type.replace('_', ' ')}</span>
                        </div>
                     </div>

                     <div className="space-y-3 relative z-10">
                        <h4 className="text-[22px] font-black text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-none">{file.name}</h4>
                        <div className="flex items-center gap-2 pt-2">
                           <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_green]"></div>
                           <span className="text-[9px] font-mono text-obsidian-600 uppercase font-bold">AUTHENTICATED_SHARD</span>
                        </div>
                     </div>

                     <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black text-obsidian-700 uppercase tracking-widest leading-none mb-1">AUTHOR</span>
                           <span className="text-[13px] font-black text-white italic tracking-tight">{file.authorId}</span>
                        </div>
                        <button className="px-10 py-4 bg-white/5 hover:bg-primary hover:text-black rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border border-white/10 hover:border-primary shadow-xl">
                           EDIT
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

export default ProjectExplorer;
