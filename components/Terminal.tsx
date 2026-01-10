
import React, { useEffect, useRef, useState } from 'react';

interface TerminalProps {
  logs: { msg: string, type: 'info' | 'warn' | 'error' | 'ai' }[];
  onCommand?: (cmd: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ logs, onCommand }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onCommand?.(input.trim());
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-hidden relative bg-obsidian-900 grain-layer grain-2">
      <div className="absolute top-0 left-0 w-full h-px bg-primary/10 animate-pulse z-10"></div>
      
      <div className="flex items-center justify-between mb-6 border-b border-white/[0.01] pb-3 opacity-60 relative z-10">
        <div className="flex items-center gap-3">
           <div className="size-1.5 rounded-full bg-obsidian-500 animate-pulse"></div>
           <span className="text-[8px] font-black text-obsidian-100 uppercase tracking-[0.4em] italic">Sovereign_Shell</span>
        </div>
        <span className="text-[7px] font-mono text-obsidian-300">KERNEL_0x84_STABLE</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar space-y-2 text-[11px] pr-2 font-mono leading-relaxed relative z-10"
      >
        {logs.map((log, i) => (
          <div key={i} className="flex gap-4 group animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-obsidian-300 shrink-0 font-mono tracking-tighter italic opacity-40">
              {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className={`
              ${log.type === 'ai' ? 'text-primary' : ''}
              ${log.type === 'error' ? 'text-red-400/80' : ''}
              ${log.type === 'warn' ? 'text-amber-400/80' : ''}
              ${log.type === 'info' ? 'text-obsidian-100' : ''}
              break-all
            `}>
              <span className="opacity-20 mr-2">❯</span>
              {log.msg}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="h-10 flex items-center gap-4 border-t border-white/[0.01] mt-4 pt-4 group relative z-20">
        <span className="text-primary text-[11px] font-black opacity-80">❯_</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="DISPATCH_DIRECTIVE..."
          className="flex-1 bg-obsidian-950 border-none outline-none text-[11px] text-obsidian-100 font-mono placeholder-obsidian-300/20 px-3 py-1.5 rounded"
          autoFocus
        />
        <div className="flex items-center gap-3 opacity-20 group-focus-within:opacity-40 transition-opacity">
           <span className="text-[7px] font-mono text-obsidian-300 uppercase italic">Input_Active</span>
           <div className="size-1 bg-primary rounded-full animate-ping"></div>
        </div>
      </form>
    </div>
  );
};

export default Terminal;
