
import React, { useState } from 'react';
import { AppState, Directive, Agent, DirectiveStatus } from '../types';

interface ProjectNexusProps {
  state: AppState;
  onSelectDirective: (id: string | null) => void;
  onSelectAgent: (id: string | null) => void;
  onCreateDirective: () => void;
  verboseMode: boolean;
}

const ProjectNexus: React.FC<ProjectNexusProps> = ({ state, onSelectDirective, onSelectAgent, onCreateDirective, verboseMode }) => {
  const [activeTab, setActiveTab] = useState<'DIRECTIVES' | 'AGENTS' | 'TRAJECTORY'>('DIRECTIVES');

  const COLUMNS: { id: DirectiveStatus; label: string; desc: string }[] = [
    { id: 'BACKLOG', label: 'Backlog', desc: 'Awaiting Initiation' },
    { id: 'ASSEMBLY', label: 'Assembly', desc: 'Active Neural Forging' },
    { id: 'TESTING', label: 'Testing', desc: 'Kernel Integrity Check' },
    { id: 'DEPLOYED', label: 'Deployed', desc: 'Sovereign Manifest Final' },
  ];

  const renderDirectiveCard = (d: Directive) => {
    const isSelected = state.selectedDirectiveId === d.id;
    return (
      <div 
        key={d.id} 
        onClick={() => onSelectDirective(d.id)}
        className={`group border rounded-xi p-5 space-y-4 transition-all cursor-pointer relative overflow-hidden grain-layer grain-5 ${isSelected ? 'bg-primary/10 border-primary/40' : 'bg-obsidian-700 border-white/[0.01] hover:bg-obsidian-600 hover:border-white/[0.03]'}`}
      >
        <div className="flex justify-between items-start relative z-10">
           <div className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border ${d.priority === 'CRITICAL' ? 'bg-red-950/40 border-red-500/20 text-red-400' : 'bg-primary/10 border-primary/20 text-primary'}`}>
              {d.priority}
           </div>
        </div>
        <div className="space-y-1 relative z-10">
           <h4 className="text-[11px] font-black text-obsidian-100 uppercase tracking-tight">{d.title}</h4>
           <p className="text-[9px] text-obsidian-300 italic line-clamp-2">"{d.description}"</p>
        </div>
        <div className="pt-3 border-t border-white/[0.01] flex justify-between items-center opacity-40 relative z-10">
           <span className="text-[7px] font-mono text-obsidian-200">DIR_ID: {d.id.split('-')[0]}</span>
           <span className="text-[8px] font-mono text-primary font-bold">{d.progress}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-obsidian-950 overflow-hidden animate-in fade-in duration-500 grain-layer grain-1">
      <div className="h-12 shrink-0 border-b border-white/[0.01] bg-obsidian-900 flex items-center justify-between px-6 grain-layer grain-2">
        <div className="flex bg-obsidian-950/60 rounded-lg p-1 border border-white/[0.01]">
           {['DIRECTIVES', 'AGENTS', 'TRAJECTORY'].map(tab => (
             <button 
               key={tab} 
               onClick={() => setActiveTab(tab as any)}
               className={`px-6 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-obsidian-600 text-obsidian-100 border border-white/[0.03]' : 'text-obsidian-300 hover:text-obsidian-100'}`}
             >
               {tab}
             </button>
           ))}
        </div>
        <button onClick={onCreateDirective} className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-md text-[9px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all">
          {verboseMode ? 'New_Order' : 'Inject_Directive'}
        </button>
      </div>

      <div className="flex-1 p-6 overflow-hidden">
        {activeTab === 'DIRECTIVES' && (
          <div className="h-full grid grid-cols-4 gap-6">
            {COLUMNS.map(col => (
              <div key={col.id} className="flex flex-col gap-4 h-full min-w-0">
                <div className="flex items-center justify-between px-3 py-2 bg-obsidian-900/40 rounded border border-white/[0.01]">
                   <span className="text-[9px] font-black text-obsidian-300 uppercase tracking-widest italic">{col.label}</span>
                   <span className="text-[9px] font-mono text-primary font-bold">{state.directives.filter(d => d.status === col.id).length}</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1 pb-10">
                  {state.directives.filter(d => d.status === col.id).map(d => renderDirectiveCard(d))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'AGENTS' && (
          <div className="grid grid-cols-4 gap-6">
            {state.agents.map(agent => (
              <div key={agent.id} className="bg-obsidian-850 border border-white/[0.01] p-8 rounded-xi flex flex-col items-center gap-6 group hover:border-primary/20 transition-all grain-layer grain-3">
                 <div className="size-24 rounded-full border border-white/[0.02] p-1 bg-obsidian-950/40">
                    <img src={agent.avatarUrl} alt={agent.name} className="size-full rounded-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                 </div>
                 <div className="text-center relative z-10">
                    <span className="text-[12px] font-black text-obsidian-100 uppercase tracking-widest block">{agent.name}</span>
                    <span className="text-[8px] font-mono text-obsidian-300 uppercase tracking-[0.4em]">{agent.type}</span>
                 </div>
                 <div className="w-full h-0.5 bg-obsidian-950 rounded-full overflow-hidden relative z-10">
                    <div className="h-full bg-primary/40 shadow-[0_0_10px_rgba(184,134,11,0.5)]" style={{ width: `${agent.load}%` }}></div>
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'TRAJECTORY' && (
           <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
              <span className="material-symbols-outlined text-[64px] mb-4 text-obsidian-100">timeline</span>
              <span className="text-[10px] font-black text-obsidian-100 uppercase tracking-[0.5em]">Temporal_Mapping_Offline</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default ProjectNexus;
