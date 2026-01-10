
import React from 'react';
import { ProjectTemplate } from '../../types';
import { XI_Button } from '../IndustrialPrimitives';

interface NewProjectModalProps {
  onClose: () => void;
  onCreate: (template: ProjectTemplate) => void;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ onClose, onCreate }) => {
  const templates = [
    { 
      id: ProjectTemplate.VECTOR_DESIGN, 
      icon: 'polyline', 
      title: 'VECTOR_SUBSTRATE', 
      desc: 'Precision 2D artboard with #Hallberg coordinate parity and path-forge focus.' 
    },
    { 
      id: ProjectTemplate.SKELETON_RIG, 
      icon: 'hub', 
      title: 'PERSPECTIVE_RIG', 
      desc: 'Rigging-first manifold. Quad-view grid for bone hierarchy and NURBS geometry.' 
    },
    { 
      id: ProjectTemplate.ANIMATION_TIMELINE, 
      icon: 'movie', 
      title: 'KINETIC_SEQUENCER', 
      desc: 'Temporal sequencing for kinetic shards. High-fidelity keyframe orchestration.' 
    },
    { 
      id: ProjectTemplate.CODE_FORGE, 
      icon: 'terminal', 
      title: 'LOGIC_IDE', 
      desc: 'Full-screen development kernel. Edit manifest scripts and forge AI-driven logic.' 
    },
    { 
      id: ProjectTemplate.PROJECT_NEXUS, 
      icon: 'account_tree', 
      title: 'PROJECT_NEXUS', 
      desc: 'Management-first view. AI Agent dispatch, Kanban directives, and studio telemetry.' 
    },
    { 
      id: ProjectTemplate.LUX_COMPOSITING, 
      icon: 'flare', 
      title: 'LUX_STAGE', 
      desc: 'Final stage compositing. Radiosity probes, alpha blending, and UE5 rendering parity.' 
    },
  ];

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-8 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-obsidian-950 rounded-xi border border-white/5 overflow-hidden shadow-[0_60px_180px_rgba(0,0,0,1)] flex flex-col paper-layer grain-fine">
        <div className="p-10 border-b border-white/[0.03] flex justify-between items-center bg-black/40 shrink-0">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">INITIALIZE_KERNEL</h2>
            <p className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.4em] italic mt-2">Select archetypal studio manifold for session 0x84</p>
          </div>
          <button onClick={onClose} className="size-10 rounded-xi hover:bg-white/5 flex items-center justify-center transition-all border border-white/5 text-obsidian-400 hover:text-white">
             <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-8 grid grid-cols-3 gap-4 flex-1 bg-obsidian-900/50 overflow-y-auto custom-scrollbar">
          {templates.map(t => (
            <button 
              key={t.id}
              onClick={() => onCreate(t.id)}
              className="group p-8 rounded-xi bg-obsidian-900 border border-white/[0.05] hover:border-primary/40 hover:bg-obsidian-850 transition-all text-left flex flex-col gap-8 relative overflow-hidden shadow-2xl active:scale-[0.98]"
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-700">
                <span className="material-symbols-outlined text-[140px] text-white font-black">{t.icon}</span>
              </div>
              <div className="size-14 rounded-xi bg-black/40 border border-white/10 flex items-center justify-center transition-all group-hover:bg-primary/20 group-hover:border-primary/40 shadow-inner shrink-0">
                <span className="material-symbols-outlined text-[28px] text-obsidian-600 group-hover:text-primary transition-colors">{t.icon}</span>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="text-[14px] font-black text-white uppercase tracking-[0.1em] italic leading-none group-hover:text-primary transition-colors">{t.title}</div>
                <div className="text-[10px] text-obsidian-500 leading-relaxed font-bold uppercase tracking-tight line-clamp-3">
                  {t.desc}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-10 bg-obsidian-950 flex justify-between items-center border-t border-white/[0.03] shrink-0">
           <div className="flex items-center gap-6 opacity-30">
              <span className="text-[9px] font-mono text-obsidian-500 uppercase italic">Version: 0.8.7_STUDIO</span>
              <div className="w-px h-4 bg-white/10"></div>
              <span className="text-[9px] font-mono text-obsidian-500 uppercase italic">Signature: 0x84_VALID</span>
           </div>
           <div className="flex gap-8 items-center">
             <button onClick={onClose} className="text-[10px] font-black uppercase tracking-[0.2em] text-obsidian-600 hover:text-obsidian-300 transition-colors">Abort_Handshake</button>
             <XI_Button label="EXECUTE_CUSTOM_SETUP" variant="primary" className="px-12 py-4 h-14 !rounded-xi shadow-xl" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;
