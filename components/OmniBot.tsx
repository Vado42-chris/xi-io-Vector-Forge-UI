
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { AppState, ChatMessage, AIProvider } from '../types';

interface ResponseBlock {
  type: 'text' | 'code' | 'formula' | 'vector';
  content: string;
}

interface ExtendedChatMessage extends ChatMessage {
  id: string;
  model?: AIProvider;
  status: 'queued' | 'streaming' | 'complete' | 'error';
  timestamp: number;
  blocks: ResponseBlock[];
  telemetry?: { tokens: number; latency: number };
}

interface Thread {
  id: string;
  name: string;
  activeModel: AIProvider;
  messages: ExtendedChatMessage[];
  isThinking: boolean;
}

interface OmniBotProps {
  state: AppState;
  onClose: () => void;
  onExecuteTool: (tool: string, args: any) => void;
  onClone?: () => void;
  initialMessages?: ChatMessage[];
  style?: React.CSSProperties;
  isEmbedded?: boolean;
}

const OmniBot: React.FC<OmniBotProps> = ({ state, onClose, onExecuteTool, style, isEmbedded }) => {
  const [threads, setThreads] = useState<Thread[]>(() => {
    const welcome = 'Conductor Online. Sync active. Orchestrating 10-Body reasoning.';
    const initialMsgs: ExtendedChatMessage[] = [{
      id: 'welcome',
      role: 'model',
      text: welcome,
      status: 'complete',
      timestamp: Date.now(),
      model: AIProvider.GEMINI_PRO,
      blocks: [{ type: 'text', content: welcome }]
    }];

    return [{
      id: 'conductor',
      name: 'CONDUCTOR_CORE',
      activeModel: AIProvider.GEMINI_PRO,
      messages: initialMsgs,
      isThinking: false
    }];
  });

  const [input, setInput] = useState('');
  const [swarmMode, setSwarmMode] = useState(false);
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus input on mount and when threads change
    inputRef.current?.focus();
  }, [threads.length]);

  const parseBlocks = (text: string): ResponseBlock[] => {
    const blocks: ResponseBlock[] = [];
    const codeRegex = /```([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    while ((match = codeRegex.exec(text)) !== null) {
      if (match.index > lastIndex) blocks.push({ type: 'text', content: text.substring(lastIndex, match.index).trim() });
      blocks.push({ type: match[1].includes('<svg') ? 'vector' : 'code', content: match[1].trim() });
      lastIndex = codeRegex.lastIndex;
    }
    if (lastIndex < text.length) blocks.push({ type: 'text', content: text.substring(lastIndex).trim() });
    return blocks.length > 0 ? blocks : [{ type: 'text', content: text }];
  };

  const spawnBranch = (parentThread: Thread) => {
    if (threads.length >= 11) return; // Conductor + 10 Bodies
    const bodyIndex = threads.length;
    const newThread: Thread = {
      id: `body-${bodyIndex}-${Date.now()}`,
      name: `BODY_${bodyIndex.toString().padStart(2, '0')}`,
      activeModel: parentThread.activeModel,
      messages: [...parentThread.messages],
      isThinking: false
    };
    setThreads([...threads, newThread]);
  };

  const handleDispatch = async (targetThreadIds: string[]) => {
    if (!input.trim()) return;
    const prompt = input;
    setInput('');

    setThreads(prev => prev.map(t => targetThreadIds.includes(t.id) ? {
      ...t,
      isThinking: true,
      messages: [...t.messages, {
        id: `user-${Date.now()}`,
        role: 'user',
        text: prompt,
        status: 'complete',
        timestamp: Date.now(),
        blocks: [{ type: 'text', content: prompt }]
      }]
    } : t));

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    targetThreadIds.forEach(async (id) => {
      const thread = threads.find(t => t.id === id);
      if (!thread) return;

      const startTime = Date.now();
      try {
        const response = await ai.models.generateContent({
          model: thread.activeModel === AIProvider.SWARM ? AIProvider.GEMINI_PRO : thread.activeModel,
          contents: [...thread.messages, { role: 'user', text: prompt } as any].map(m => ({
            role: (m.role === 'model' ? 'model' : 'user') as 'model' | 'user',
            parts: [{ text: m.text }]
          })),
          config: { systemInstruction: `Sovereign Body ${thread.name}. Solve design constraints via recursive logic.` }
        });

        const content = response.text || "Synced.";
        setThreads(prev => prev.map(t => t.id === id ? {
          ...t,
          isThinking: false,
          messages: [...t.messages, {
            id: `resp-${Date.now()}`,
            role: 'model',
            text: content,
            model: t.activeModel,
            status: 'complete',
            timestamp: Date.now(),
            blocks: parseBlocks(content),
            telemetry: { tokens: content.length / 4, latency: Date.now() - startTime }
          }]
        } : t));
      } catch (e) {
        setThreads(prev => prev.map(t => t.id === id ? { ...t, isThinking: false } : t));
      }
    });
  };

  return (
    <div 
      style={style} 
      className={`bg-obsidian-950 border border-white/10 flex flex-col overflow-hidden animate-in fade-in duration-500 shadow-[0_60px_150px_rgba(0,0,0,1)] ${isEmbedded ? 'w-full h-full' : 'fixed inset-x-10 bottom-10 top-20 rounded-2xl z-[3100]'}`}
    >
      {/* GLOBAL HUB HEADER */}
      <div className="h-16 bg-obsidian-850 border-b border-white/10 flex items-center justify-between px-6 shrink-0 relative z-50">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
               <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-black shadow-[0_0_20px_rgba(184,134,11,0.4)]">
                  <span className="material-symbols-outlined font-black">hub</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[14px] font-black text-white uppercase italic tracking-tighter leading-none">Swarm_Orchestrator</span>
                  <span className="text-[8px] font-mono text-primary uppercase tracking-[0.4em] mt-1 font-bold">10-Body_Equilibrium_Enabled</span>
               </div>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-obsidian-400 uppercase tracking-widest">Active_Bodies:</span>
               <div className="flex gap-1.5">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i} className={`size-2 rounded-full transition-all duration-500 ${i < threads.length ? 'bg-primary shadow-[0_0_8px_var(--xi-accent)]' : 'bg-obsidian-700 opacity-30'}`}></div>
                  ))}
               </div>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <button 
              onClick={() => setSwarmMode(!swarmMode)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${swarmMode ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-obsidian-900 text-obsidian-400 border-white/10 hover:border-primary/40'}`}
            >
               {swarmMode ? 'Broadcast_Locked' : 'Single_Channel'}
            </button>
            <button onClick={onClose} className="size-10 rounded-xl hover:bg-red-900/40 flex items-center justify-center text-obsidian-400 hover:text-white transition-all border border-white/5">
               <span className="material-symbols-outlined">close</span>
            </button>
         </div>
      </div>

      {/* SWARM MANIFOLD: HORIZONTAL THREADS */}
      <div className="flex-1 flex overflow-x-auto custom-scrollbar bg-black/20 p-4 gap-4 items-stretch group/manifold">
         {threads.map((thread, tIdx) => (
           <div 
             key={thread.id} 
             className={`flex flex-col min-w-[420px] max-w-[500px] bg-obsidian-800 border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/30 shadow-2xl relative ${thread.isThinking ? 'ring-1 ring-primary/20' : ''}`}
           >
              {/* THREAD TELEMETRY */}
              <div className="h-12 border-b border-white/5 bg-black/40 flex items-center justify-between px-5 shrink-0">
                 <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black italic tracking-widest ${tIdx === 0 ? 'text-primary' : 'text-cyan-400'}`}>{thread.name}</span>
                    <div className={`size-1.5 rounded-full ${thread.isThinking ? 'bg-primary animate-pulse' : 'bg-green-500 opacity-40'}`}></div>
                 </div>
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => spawnBranch(thread)}
                      className="size-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-obsidian-500 hover:text-primary transition-all"
                      title="Branch Body from Context"
                    >
                       <span className="material-symbols-outlined text-[20px]">call_split</span>
                    </button>
                    {tIdx > 0 && (
                      <button 
                        onClick={() => setThreads(prev => prev.filter(t => t.id !== thread.id))}
                        className="size-8 rounded-lg hover:bg-red-900/20 flex items-center justify-center text-obsidian-600 hover:text-red-400 transition-all"
                      >
                         <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                      </button>
                    )}
                 </div>
              </div>

              {/* MESSAGE STREAM */}
              <div 
                ref={el => scrollRefs.current[thread.id] = el}
                className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-obsidian-900/40"
              >
                 {thread.messages.map((m) => (
                   <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                      <div className={`max-w-[92%] p-5 rounded-2xl border transition-all ${m.role === 'user' ? 'bg-primary text-black border-primary/20 shadow-lg' : 'bg-obsidian-800 border-white/5 text-obsidian-50 shadow-xl'}`}>
                         {m.blocks.map((block, bIdx) => (
                           <div key={bIdx} className="mb-4 last:mb-0">
                              {block.type === 'text' && <p className={`text-[12px] leading-relaxed ${m.role === 'model' ? 'italic font-medium' : 'font-bold uppercase tracking-tight'}`}>{block.content}</p>}
                              {block.type !== 'text' && (
                                <div className="rounded-xl bg-black/60 border border-white/10 overflow-hidden my-4">
                                   <div className="px-4 py-2 border-b border-white/5 bg-black/40 flex justify-between items-center text-[8px] font-black text-obsidian-500 uppercase tracking-widest">
                                      <span>{block.type === 'vector' ? 'Geometry' : 'Logic'}</span>
                                      <button onClick={() => navigator.clipboard.writeText(block.content)} className="text-primary hover:text-white transition-colors">Copy_0x</button>
                                   </div>
                                   <pre className="p-4 text-[10px] font-mono text-cyan-400/90 overflow-x-auto custom-scrollbar leading-relaxed">
                                      {block.content}
                                   </pre>
                                </div>
                              )}
                           </div>
                         ))}
                         {m.role === 'model' && (
                           <div className="mt-6 pt-3 border-t border-white/5 flex justify-between items-center opacity-30">
                              <span className="text-[7px] font-mono text-obsidian-400 uppercase tracking-widest">{thread.activeModel.replace('gemini-3-', 'G3_')}</span>
                              <span className="text-[7px] font-mono text-obsidian-400 tabular-nums">{m.telemetry?.latency}ms</span>
                           </div>
                         )}
                      </div>
                   </div>
                 ))}
                 {thread.isThinking && (
                   <div className="flex flex-col items-start gap-3">
                      <div className="bg-obsidian-800 px-6 py-4 rounded-2xl border border-white/10 flex gap-2">
                         <div className="size-1.5 rounded-full bg-primary animate-bounce"></div>
                         <div className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                         <div className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                      </div>
                   </div>
                 )}
              </div>
           </div>
         ))}
         
         {/* ADD BODY PLACEHOLDER */}
         {threads.length < 11 && (
           <button 
             onClick={() => spawnBranch(threads[0])}
             className="min-w-[420px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 bg-black/10 rounded-2xl group hover:border-primary/20 transition-all opacity-40 hover:opacity-100"
           >
              <div className="size-16 rounded-full bg-obsidian-900 border border-white/10 flex items-center justify-center text-obsidian-600 group-hover:bg-primary group-hover:text-black transition-all mb-6">
                 <span className="material-symbols-outlined text-[32px]">add</span>
              </div>
              <span className="text-[12px] font-black text-obsidian-500 uppercase tracking-[0.4em] italic group-hover:text-primary">Branch_Body_{threads.length.toString().padStart(2, '0')}</span>
              <p className="text-[9px] text-obsidian-700 italic mt-2 uppercase tracking-widest">Clone context for recursive reasoning</p>
           </button>
         )}
      </div>

      {/* INPUT CONTROL HUB */}
      <div className="p-8 bg-obsidian-850 border-t border-white/10 flex flex-col gap-6 shrink-0 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
         <div className="bg-obsidian-950 border border-white/10 rounded-xl p-5 shadow-inner focus-within:border-primary/40 transition-all relative group">
            <textarea 
               ref={inputRef}
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleDispatch(swarmMode ? threads.map(t => t.id) : [threads[threads.length-1].id]); } }}
               placeholder={swarmMode ? "Issue SWARM DIRECTIVE to all bodies..." : "Issue body directive..."}
               className="w-full bg-transparent border-none text-[15px] font-bold text-obsidian-50 outline-none resize-none h-24 leading-relaxed placeholder:text-obsidian-800 placeholder:italic scrollbar-hide relative z-10"
            />
            <div className="absolute top-0 right-0 p-4 opacity-5 group-focus-within:opacity-20 transition-opacity">
               <span className="material-symbols-outlined text-[64px] text-primary rotate-12">{swarmMode ? 'hub' : 'polyline'}</span>
            </div>
            <div className="flex justify-between items-center mt-3 opacity-30 group-focus-within:opacity-80 transition-opacity relative z-10">
               <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-widest italic">Signal: {swarmMode ? 'SWARM_PARALLEL' : 'DIRECT_THREAD'}</span>
               <span className="text-[9px] font-mono text-primary uppercase italic font-bold">Shift+Enter for multi-line logic</span>
            </div>
         </div>
         
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button 
                  onClick={() => handleDispatch(swarmMode ? threads.map(t => t.id) : [threads[threads.length-1].id])} 
                  disabled={!input.trim() || threads.some(t => t.isThinking)} 
                  className={`px-16 h-14 rounded-2xl font-black uppercase text-[12px] tracking-[0.3em] shadow-2xl transition-all active:scale-95 relative overflow-hidden group ${swarmMode ? 'bg-amber-500 text-black' : 'bg-primary text-black'}`}
               >
                  <span className="relative z-10 flex items-center gap-4">
                     <span className="material-symbols-outlined">{swarmMode ? 'broadcast_on_home' : 'bolt'}</span>
                     {swarmMode ? 'Broadcast' : 'Dispatch'}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
               </button>
               <button 
                  onClick={() => spawnBranch(threads[threads.length-1])}
                  title="Branch Context"
                  className="size-14 rounded-2xl bg-obsidian-950 border border-white/10 flex items-center justify-center text-obsidian-500 hover:text-primary hover:border-primary/40 transition-all shadow-xl"
               >
                  <span className="material-symbols-outlined text-[28px]">call_split</span>
               </button>
            </div>
            
            <div className="flex flex-col items-end gap-1.5 opacity-60">
               <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-green-500 shadow-[0_0_10px_green]"></div>
                  <span className="text-[12px] font-mono text-primary italic font-bold tracking-tight">{state.credits.toLocaleString()} CORE_YIELD</span>
               </div>
               <span className="text-[8px] font-black uppercase tracking-[0.5em] text-obsidian-500">Sovereign_Swarm_Manifold_v1.0</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OmniBot;
