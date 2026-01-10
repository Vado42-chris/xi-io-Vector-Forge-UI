
import React, { useState } from 'react';

const CodeKernel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('App.tsx');

  return (
    <div className="flex-1 bg-obsidian-950 flex overflow-hidden animate-in fade-in duration-500">
      <div className="w-12 bg-obsidian-900 border-r border-white/[0.01] flex flex-col items-center py-6 gap-8 shrink-0">
        {['description', 'search', 'account_tree', 'bug_report'].map((icon, i) => (
          <span key={i} className={`material-symbols-outlined !text-[18px] cursor-pointer xi-transition ${i === 0 ? 'text-primary/80' : 'text-obsidian-700 hover:text-obsidian-300'}`}>{icon}</span>
        ))}
      </div>

      <div className="w-64 bg-obsidian-900/40 border-r border-white/[0.01] flex flex-col shrink-0">
        <div className="p-4 border-b border-white/[0.01] text-[8px] font-black text-obsidian-600 uppercase tracking-[0.4em] italic">Source_Explorer</div>
        <div className="p-4 space-y-1">
           {['App.tsx', 'Rosetta.ts', 'Physics.tsx', 'Layout.css'].map(f => (
             <div 
               key={f} 
               onClick={() => setActiveTab(f)}
               className={`px-4 py-1.5 rounded text-[10px] cursor-pointer xi-transition ${f === activeTab ? 'bg-primary/5 text-primary' : 'text-obsidian-500 hover:text-obsidian-200'}`}
             >
                {f}
             </div>
           ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden bg-black/40">
        <div className="h-10 border-b border-white/[0.01] bg-obsidian-900 flex items-center px-1 gap-px">
           <div className="px-6 h-full flex items-center gap-4 bg-obsidian-950 border-t border-primary/40 text-[9px] font-black text-obsidian-100 uppercase tracking-widest cursor-default">
              {activeTab.toUpperCase()}
           </div>
        </div>
        
        <div className="flex-1 p-8 font-mono text-[13px] leading-relaxed overflow-y-auto custom-scrollbar">
           <div className="flex gap-8">
              <div className="flex flex-col text-obsidian-800 text-right select-none pr-4 border-r border-white/[0.01]">
                 {Array.from({ length: 20 }).map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <div className="flex-1 space-y-0.5">
                 <div className="opacity-40"><span className="text-primary/60 italic">import</span> React <span className="text-primary/60 italic">from</span> <span className="text-green-900/80">'react'</span>;</div>
                 <div className="opacity-40"><span className="text-primary/60 italic">import</span> {'{'} ForgeCore {'}'} <span className="text-primary/60 italic">from</span> <span className="text-green-900/80">'@xibalba/sdk'</span>;</div>
                 <br/>
                 <div><span className="text-primary/60 italic">export const</span> <span className="text-obsidian-200">MainTerminal</span> = () ={">"} {'{'}</div>
                 <div className="pl-6 text-obsidian-400">  const protocol = <span className="text-primary/80">useSovereign()</span>;</div>
                 <div className="pl-6 text-obsidian-400">  return <span className="text-obsidian-200">protocol.dispatch()</span>;</div>
                 <div>{'}'};</div>
              </div>
           </div>
        </div>

        <div className="h-7 bg-obsidian-900 border-t border-white/[0.01] flex items-center justify-between px-6 opacity-40">
           <div className="flex gap-10 text-[8px] font-black uppercase tracking-widest">
              <span className="text-green-900">Kernel_Stable</span>
              <span className="text-obsidian-600">UTF-8</span>
           </div>
           <span className="text-[8px] font-mono italic">Ln: 14, Col: 42</span>
        </div>
      </div>
    </div>
  );
};

export default CodeKernel;
