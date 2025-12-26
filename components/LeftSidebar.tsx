
import React, { useState, useEffect, useRef } from 'react';
import { TabType, DesignStyle, AppState } from '../types';

interface LeftSidebarProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onSendAiMessage: (message: string) => void;
  onTerminalCommand: (cmd: string) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  state, setState, onSendAiMessage, onTerminalCommand
}) => {
  const [userInput, setUserInput] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const tabs: {id: TabType, label: string, icon: string}[] = [
    { id: 'chat', label: 'Forge', icon: 'auto_awesome' },
    { id: 'terminal', label: 'Console', icon: 'terminal' },
    { id: 'settings', label: 'Engine', icon: 'settings_input_component' }
  ];

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [state.chatHistory]);

  const handleSend = () => {
    if (userInput.trim()) {
      onSendAiMessage(userInput);
      setUserInput('');
    }
  };

  return (
    <aside className="w-[380px] shrink-0 flex flex-col border-r border-white/5 bg-obsidian-100 relative z-20">
      <div className="flex bg-obsidian-200/50 h-14 border-b border-white/5">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setState(prev => ({ ...prev, activeTab: tab.id }))}
            className={`flex-1 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative ${
              state.activeTab === tab.id ? 'text-primary' : 'text-obsidian-500 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] opacity-70">{tab.icon}</span>
            {tab.label}
            {state.activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary xi-popping-glow"></div>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-obsidian-200/20">
        {state.activeTab === 'chat' && (
          <div className="flex flex-col h-full p-6 animate-in slide-in-from-left-4">
            <div ref={chatHistoryRef} className="flex-1 space-y-6 mb-6 overflow-y-auto custom-scrollbar pr-2">
              {state.chatHistory.map((msg, i) => (
                <div key={i} className={`flex flex-col text-sm ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[90%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-black' : 'bg-obsidian-100 text-white'}`}>
                    <p className="font-bold text-[10px] uppercase tracking-widest mb-2">{msg.role === 'user' ? 'You' : 'Forge AI'}</p>
                    <p className="text-[11px] leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                disabled={state.isGenerating}
                placeholder="Describe your vector design..."
                className="w-full h-24 bg-obsidian-100 border-2 border-white/5 rounded-2xl p-4 pr-16 text-xs text-white resize-none focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              />
              <button
                onClick={handleSend}
                disabled={state.isGenerating || !userInput.trim()}
                className="absolute top-4 right-4 size-10 rounded-lg bg-primary text-black flex items-center justify-center hover:bg-primary-hover active:scale-90 disabled:opacity-30 transition-all"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        )}

        {state.activeTab === 'terminal' && (
          <div className="flex flex-col h-full p-6 mono text-[10px] animate-in slide-in-from-left-4">
            <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
               {state.terminalLogs.map(log => (
                 <div key={log.id} className="flex gap-3">
                    <span className="text-obsidian-500 select-none">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                    <span className={log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-primary' : 'text-white/80'}>{log.text}</span>
                 </div>
               ))}
            </div>
            <input 
              type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') { onTerminalCommand(terminalInput); setTerminalInput(''); }}}
              className="w-full bg-obsidian-100 border border-white/10 rounded-lg py-2 px-3 mt-4 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="root@xibalba:~$ "
            />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10 bg-obsidian-100 flex items-center justify-between text-[9px] font-bold text-obsidian-500 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${state.isGenerating ? 'bg-primary animate-pulse' : 'bg-green-400'}`}></div>
          <span>{state.isGenerating ? 'AI SYNTHESIZING' : 'SYSTEM READY'}</span>
        </div>
        <span>CREDITS: {state.credits}</span>
      </div>
    </aside>
  );
};

export default LeftSidebar;
