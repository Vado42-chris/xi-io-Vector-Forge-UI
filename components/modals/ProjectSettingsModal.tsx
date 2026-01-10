
import React from 'react';

interface ProjectSettingsModalProps {
  onClose: () => void;
  name: string;
  onRename: (name: string) => void;
}

const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({ onClose, name, onRename }) => {
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-obsidian-100 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.9)] flex flex-col">
        <div className="p-8 border-b border-white/5">
          <h2 className="text-xl font-black text-white tracking-widest uppercase">Project_Manifest</h2>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-obsidian-500 uppercase tracking-widest">Project Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => onRename(e.target.value)}
              className="w-full bg-obsidian-200 border border-white/10 rounded-xl px-4 py-3 text-[12px] font-bold outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-obsidian-200 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[8px] font-black text-obsidian-500 uppercase">Artboard Size</span>
                <div className="text-[12px] font-mono text-primary">512 x 512 PX</div>
             </div>
             <div className="p-4 bg-obsidian-200 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[8px] font-black text-obsidian-500 uppercase">Render Engine</span>
                <div className="text-[12px] font-bold text-white uppercase">SVG_V1_STABLE</div>
             </div>
          </div>
        </div>

        <div className="p-8 bg-obsidian-300 flex justify-end gap-4">
           <button onClick={onClose} className="px-10 py-3 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/10 transition-all">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsModal;
