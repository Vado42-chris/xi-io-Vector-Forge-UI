
import React, { useRef, useState, useEffect } from 'react';
import { TabType, DesignStyle, AppState, AIProvider } from '../types';

interface LeftSidebarProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onGenerate: () => void;
  onRefine: () => void;
  onChat: (msg: string) => void;
  onTerminalCommand: (cmd: string) => void;
  onVisionScan: (file: File) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  state, setState, onGenerate, onRefine, onChat, onTerminalCommand, onVisionScan
}) => {
  const [chatInput, setChatInput] = useState('');
  const [terminalInput, setTerminalInput] = useState('');

  const tabs: {id: TabType, label: string, icon: string}[] = [
    { id: 'text', label: 'Forge', icon: 'auto_awesome' },
    { id: 'chat', label: 'Co-Pilot', icon: 'forum' },
    { id: 'terminal', label: 'Logs', icon: 'terminal' },
    { id: 'settings', label: 'Engine', icon: 'settings_input_component' }
  ];

  return (
    <aside className="w-[340px] shrink-0 flex flex-col border-r border-white/5 bg-obsidian-panel relative z-20">
      <div className="flex border-b border-white/5 bg-obsidian-dark">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setState(prev => ({ ...prev, activeTab: tab.id }))}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all border-b-2 ${state.activeTab === tab.id ? 'text-primary border-primary bg-primary/5' : 'text-text-muted border-transparent hover:text-white hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span className="text-[8px] font-bold uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {state.activeTab === 'text' && (
          <div className="space-y-6">
            <section className="space-y-3">
              <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">psychology</span> Synthesis Prompt
              </label>
              <textarea 
                value={state.prompt}
                onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
                disabled={state.isGenerating}
                className="w-full h-32 bg-obsidian-dark border border-white/5 rounded p-3 text-xs font-medium text-white placeholder-text-muted/20 focus:ring-1 focus:ring-primary focus:border-primary resize-none transition-all" 
                placeholder="Describe geometrical intent..."
              />
              <div className="grid grid-cols-2 gap-2">
                <button onClick={onGenerate} disabled={state.isGenerating || !state.prompt.trim()} className="py-3 px-2 rounded bg-primary text-white font-bold text-[9px] uppercase tracking-widest hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all">
                   Synthesize
                </button>
                <button onClick={onRefine} disabled={state.isGenerating || !state.prompt.trim()} className="py-3 px-2 rounded bg-obsidian-dark border border-white/5 text-text-muted font-bold text-[9px] uppercase tracking-widest hover:text-white transition-all">
                   Refine
                </button>
              </div>
            </section>

            <section className="space-y-3">
               <label className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Aesthetic Channel</label>
               <div className="grid grid-cols-2 gap-1.5">
                 {Object.values(DesignStyle).map(s => (
                   <button key={s} onClick={() => setState(prev => ({ ...prev, style: s }))} className={`p-2 rounded text-[8px] font-bold uppercase transition-all border ${state.style === s ? 'bg-primary/10 border-primary text-primary' : 'bg-obsidian-dark border-white/5 text-text-muted hover:border-white/20'}`}>{s}</button>
                 ))}
               </div>
            </section>
          </div>
        )}

        {state.activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 space-y-4 mb-4">
              {state.chatHistory.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[90%] p-3 rounded text-[11px] leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-obsidian-dark border border-white/5 text-text-muted mono'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <input 
              type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') { onChat(chatInput); setChatInput(''); }}}
              placeholder="System dialogue..."
              className="w-full bg-obsidian-dark border border-white/5 rounded py-2.5 px-3 text-xs text-white focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        )}

        {state.activeTab === 'terminal' && (
          <div className="flex flex-col h-full mono text-[9px]">
            <div className="flex-1 space-y-1 overflow-y-auto">
               {state.terminalLogs.map(log => (
                 <div key={log.id} className="flex gap-2">
                    <span className="text-text-muted opacity-30 select-none">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                    <span className={log.type === 'error' ? 'text-error' : log.type === 'success' ? 'text-primary' : 'text-white'}>{log.text}</span>
                 </div>
               ))}
            </div>
            <input 
              type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') { onTerminalCommand(terminalInput); setTerminalInput(''); }}}
              className="w-full bg-obsidian-dark border border-white/5 rounded py-1.5 px-2 mt-4 text-[9px] text-primary focus:outline-none"
              placeholder="root@xibalba:~$ "
            />
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/5 bg-obsidian-dark flex items-center justify-between text-[8px] font-bold text-text-muted uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,152,0,0.6)]"></span>
          <span>Sovereign Link Ready</span>
        </div>
        <span>XI_OS: 2.0.4</span>
      </div>
    </aside>
  );
};

export default LeftSidebar;
