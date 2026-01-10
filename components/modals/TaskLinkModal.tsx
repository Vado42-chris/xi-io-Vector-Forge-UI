
import React, { useState } from 'react';
// Fix: Import XI_Button from IndustrialPrimitives and Directive from types.ts
import { XI_Button } from '../IndustrialPrimitives';
import { Directive } from '../../types';

interface TaskLinkModalProps {
  onClose: () => void;
  // Fix: Use Directive interface instead of any
  directives: Directive[];
  onLink: (directiveId: string) => void;
  entityName: string;
}

const TaskLinkModal: React.FC<TaskLinkModalProps> = ({ onClose, directives, onLink, entityName }) => {
  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-obsidian-950 rounded-xi border border-white/10 overflow-hidden shadow-2xl flex flex-col">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
           <div className="space-y-1">
              <h2 className="text-xl font-black text-white tracking-widest uppercase italic">Inject_Task_Tether</h2>
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em] italic">Linking Entity: {entityName}</p>
           </div>
           <button onClick={onClose} className="size-10 rounded hover:bg-white/5 flex items-center justify-center transition-all">
              <span className="material-symbols-outlined text-obsidian-400">close</span>
           </button>
        </div>

        <div className="p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar bg-obsidian-900/50 min-h-[400px]">
           <span className="text-[8px] font-black text-obsidian-500 uppercase tracking-widest px-1">Available_Directives</span>
           <div className="space-y-3">
              {directives.length === 0 ? (
                <div className="py-20 text-center text-[10px] text-obsidian-700 uppercase italic">Buffer_Empty // No_Directives_Found</div>
              ) : (
                // Fix: Typed parameter as Directive
                directives.map((d: Directive) => (
                  <button 
                    key={d.id}
                    onClick={() => onLink(d.id)}
                    className="w-full p-5 bg-obsidian-950 border border-white/5 rounded-xl text-left hover:border-primary/40 transition-all group flex justify-between items-center"
                  >
                    <div className="flex flex-col gap-1">
                       <span className="text-[12px] font-black text-white uppercase italic group-hover:text-primary transition-colors">{d.title}</span>
                       <span className="text-[8px] font-mono text-obsidian-600 uppercase font-bold tracking-widest">{d.id} // {d.status}</span>
                    </div>
                    <span className="material-symbols-outlined text-obsidian-800 group-hover:text-primary transition-colors">add_link</span>
                  </button>
                ))
              )}
           </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-obsidian-950 flex justify-end gap-6">
           <button onClick={onClose} className="text-[10px] font-black text-obsidian-600 hover:text-white uppercase tracking-widest transition-colors">Abort_Handshake</button>
           <XI_Button label="Create_New_Directive" variant="obsidian" size="sm" className="!rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default TaskLinkModal;
