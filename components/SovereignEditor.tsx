
import React, { useState } from 'react';

const SovereignEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('APP.TSX');

  return (
    <div className="flex-1 bg-obsidian-950 flex overflow-hidden animate-in fade-in duration-500 relative">
      
      {/* ACTIVITY RAIL */}
      <div className="w-12 bg-obsidian-900 border-r border-white/5 flex flex-col items-center py-6 gap-6 shrink-0">
        {['description', 'search', 'account_tree', 'bug_report'].map((icon, i) => (
          <span key={i} className={`material-symbols-outlined !text-[20px] cursor-pointer xi-transition ${i === 0 ? 'text-primary/60' : 'text-obsidian-500 hover:text-obsidian-200'}`}>{icon}</span>
        ))}
      </div>

      {/* EXPLORER */}
      <div className="w-64 bg-obsidian-900/50 border-r border-white/5 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/5 text-[9px] font-black text-obsidian-500 uppercase tracking-widest italic">Explorer // Root</div>
        <div className="p-4 space-y-3">
           {['manifest.json', 'App.tsx', 'Rosetta.ts', 'Physics.tsx'].map(f => (
             <div key={f} onClick={() => setActiveTab(f.toUpperCase())} className={`text-[10px] cursor-pointer xi-transition px-2 py-1 rounded ${activeTab === f.toUpperCase() ? 'text-primary bg-primary/5' : 'text-obsidian-400 hover:text-obsidian-100'}`}>
                {f}
             </div>
           ))}
        </div>
      </div>

      {/* CODE SURFACE */}
      <div className="flex-1 flex flex-col bg-obsidian-950/40">
        <div className="h-10 border-b border-white/5 bg-obsidian-900 flex items-center px-1 gap-px">
           {['APP.TSX', 'ROSETTA.TS'].map(tab => (
             <div key={tab} onClick={() => setActiveTab(tab)} className={`px-6 h-full flex items-center gap-4 cursor-pointer xi-transition text-[10px] font-black tracking-widest ${activeTab === tab ? 'bg-obsidian-950 text-obsidian-100 border-t-2 border-primary/40' : 'text-obsidian-500 hover:bg-white/5'}`}>
                {tab}
             </div>
           ))}
        </div>

        <div className="flex-1 flex overflow-hidden font-mono text-[13px] leading-relaxed">
           <div className="w-12 py-8 flex flex-col items-end pr-4 text-obsidian-800 border-r border-white/5 select-none">
              {Array.from({ length: 30 }).map((_, i) => <div key={i}>{i + 1}</div>)}
           </div>
           <div className="flex-1 p-8 overflow-y-auto custom-scrollbar text-obsidian-300">
              <div className="opacity-50"><span className="text-amber-600/80 italic">import</span> React <span className="text-amber-600/80 italic">from</span> <span className="text-green-800/80">'react'</span>;</div>
              <div className="opacity-50"><span className="text-amber-600/80 italic">import</span> {'{'} #HallbergMaths {'}'} <span className="text-amber-600/80 italic">from</span> <span className="text-green-800/80">'@xibalba/core'</span>;</div>
              <br/>
              <div><span className="text-amber-600/80 italic">export const</span> <span className="text-obsidian-100">ForgeInterface</span> = () ={">"} {'{'}</div>
              <div className="pl-6 text-obsidian-400">  const [friction, setFriction] = useState(0.12);</div>
              <br/>
              <div className="pl-6 text-obsidian-400">  return (</div>
              <div className="pl-12 text-obsidian-200">    {'<'}div className="industrial-chassis"{'>'}</div>
              <div className="pl-18 text-obsidian-200">      {'<'}<span className="text-obsidian-100">EventOrchestrator</span> {'/'}{'>'}</div>
              <div className="pl-12 text-obsidian-200">    {'<'}{'/'}div{'>'}</div>
              <div className="pl-6 text-obsidian-400">  );</div>
              <div>{'}'};</div>
           </div>
        </div>

        {/* STATUS HUD */}
        <div className="h-8 bg-obsidian-900 border-t border-white/5 flex items-center justify-between px-6 text-[9px] font-black text-obsidian-500 uppercase tracking-widest">
           <div className="flex gap-10">
              <span className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-green-900 animate-pulse"></div> Link_Solid</span>
              <span>Logic_Clean</span>
           </div>
           <div className="flex gap-8 italic">
              <span>Ln: 142, Col: 42</span>
              <span>UTF-8</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SovereignEditor;
