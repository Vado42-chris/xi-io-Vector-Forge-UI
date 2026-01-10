
import React from 'react';
import { AIProvider } from '../../types';

interface PreferencesModalProps {
  onClose: () => void;
  config: { provider: AIProvider, thinkingBudget: number };
  onUpdate: (key: string, val: any) => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ onClose, config, onUpdate }) => {
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-obsidian-100 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.9)] flex flex-col">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">settings_input_antenna</span> Global_Preferences
          </h2>
          <button onClick={onClose} className="size-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-obsidian-400">close</span>
          </button>
        </div>

        <div className="p-8 space-y-8">
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-obsidian-500 uppercase tracking-[0.2em]">Kernel_Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-white/50 uppercase">Active Provider</label>
                <select 
                  value={config.provider}
                  onChange={(e) => onUpdate('provider', e.target.value)}
                  className="w-full bg-obsidian-200 border border-white/5 rounded-xl px-4 py-2.5 text-[11px] outline-none focus:ring-1 focus:ring-primary transition-all"
                >
                  <option value={AIProvider.GEMINI_PRO}>{AIProvider.GEMINI_PRO}</option>
                  <option value={AIProvider.GEMINI_FLASH}>{AIProvider.GEMINI_FLASH}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-white/50 uppercase">Thinking Budget</label>
                <input 
                  type="number"
                  value={config.thinkingBudget}
                  onChange={(e) => onUpdate('thinkingBudget', parseInt(e.target.value))}
                  className="w-full bg-obsidian-200 border border-white/5 rounded-xl px-4 py-2.5 text-[11px] font-mono outline-none focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-obsidian-500 uppercase tracking-[0.2em]">UI_Environment</h3>
            <div className="flex items-center justify-between p-4 bg-obsidian-200 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-white/70 uppercase">High Performance Mode</span>
              <div className="size-6 bg-primary rounded-md flex items-center justify-center shadow-[0_0_10px_var(--xi-vector-glow)]">
                 <span className="material-symbols-outlined text-white text-sm">check</span>
              </div>
            </div>
          </section>
        </div>

        <div className="p-8 bg-obsidian-300 flex justify-end">
           <button onClick={onClose} className="px-10 py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full xi-popping-glow">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;
