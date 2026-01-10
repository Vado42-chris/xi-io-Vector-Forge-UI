
import React from 'react';
import { ProjectTemplate } from '../../types';
import { XI_Button } from '../IndustrialPrimitives';

interface NewProjectModalProps {
  onClose: () => void;
  onCreate: (template: ProjectTemplate) => void;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ onClose, onCreate }) => {
  const templates = [
    { id: ProjectTemplate.BLANK_CANVAS, icon: 'polyline', desc: 'High-fidelity SVG and branding synthesis.' },
    { id: ProjectTemplate.ANIMATION_TIMELINE, icon: 'movie', desc: 'Temporal rigging and keyframe orchestration.' },
    { id: ProjectTemplate.PARTICLE_SYSTEM, icon: 'flare', desc: 'Flux-based VFX and physics emitters.' },
    { id: ProjectTemplate.TASK_BOARD, icon: 'view_kanban', desc: 'Resource tracking and AI dispatch logs.' },
  ];

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-obsidian-950 rounded-xi border border-white/5 overflow-hidden shadow-[0_60px_180px_rgba(0,0,0,1)] flex flex-col">
        <div className="p-10 border-b border-white/[0.03] flex justify-between items-center bg-black/40">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-obsidian-200 tracking-tighter uppercase italic leading-none">Initialize_Kernel</h2>
            <p className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.4em] italic">Select workspace archetype</p>
          </div>
          <XI_Button label="" icon="close" variant="ghost" onClick={onClose} className="px-3" />
        </div>
        
        <div className="p-10 grid grid-cols-2 gap-4 flex-1 bg-obsidian-900/50">
          {templates.map(t => (
            <button 
              key={t.id}
              onClick={() => onCreate(t.id)}
              className="group p-8 rounded-xi bg-obsidian-900 border border-white/[0.02] hover:border-primary/40 hover:bg-obsidian-800 transition-all text-left flex flex-col gap-8 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[80px] text-primary">{t.icon}</span>
              </div>
              <div className="size-12 rounded-xi bg-black/40 border border-white/10 flex items-center justify-center transition-all group-hover:bg-primary/20 group-hover:border-primary/40 shadow-inner">
                <span className="material-symbols-outlined text-[24px] text-obsidian-600 group-hover:text-primary transition-colors">{t.icon}</span>
              </div>
              <div className="space-y-2 relative z-10">
                <div className="text-[12px] font-black text-obsidian-300 uppercase tracking-widest">{t.id}</div>
                <div className="text-[9px] text-obsidian-600 leading-relaxed italic font-bold uppercase tracking-tight">{t.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-10 bg-obsidian-950 flex justify-end items-center gap-8 border-t border-white/[0.03]">
           <button onClick={onClose} className="text-[10px] font-black uppercase tracking-[0.2em] text-obsidian-600 hover:text-obsidian-300 transition-colors">Cancel_Protocol</button>
           <XI_Button label="Execute_Custom_Setup" variant="primary" className="px-10 py-4 h-12 rounded-xi" />
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;
