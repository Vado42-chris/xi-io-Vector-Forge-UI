
import React, { useState } from 'react';
import { AppState, Directive, Agent, DirectiveStatus, ReasoningStep } from '../types';
import { translate } from '../services/lexiconService';

interface ProjectNexusProps {
  state: AppState;
  onSelectDirective: (id: string | null) => void;
  onSelectAgent: (id: string | null) => void;
  onCreateDirective: () => void;
  onApplyDirective: (d: Directive) => void;
  verboseMode: boolean;
}

const ProjectNexus: React.FC<ProjectNexusProps> = ({ state, onSelectDirective, onSelectAgent, onCreateDirective, onApplyDirective, verboseMode }) => {
  const [activeTab, setActiveTab] = useState<'DIRECTIVES' | 'AGENTS' | 'TRAJECTORY'>('DIRECTIVES');

  const COLUMNS: { id: DirectiveStatus; labelKey: string }[] = [
    { id: 'BACKLOG', labelKey: 'BACKLOG' },
    { id: 'ASSEMBLY', labelKey: 'ASSEMBLY' },
    { id: 'TESTING', labelKey: 'TESTING' },
    { id: 'DEPLOYED', labelKey: 'DEPLOYED' },
  ];

  const selectedDirective = state.directives.find(d => d.id === state.selectedDirectiveId);

  const renderDirectiveCard = (d: Directive) => {
    const isSelected = state.selectedDirectiveId === d.id;
    return (
      <div 
        key={d.id} 
        onClick={() => onSelectDirective(d.id)}
        className={`group border rounded-xi p-5 space-y-4 transition-all cursor-pointer relative overflow-hidden grain-layer grain-5 ${isSelected ? 'bg-primary/10 border-primary/40 shadow-xl' : 'bg-obsidian-700 border-white/[0.01] hover:bg-obsidian-600 hover:border-white/[0.03]'}`}
      >
        <div className="flex justify-between items-start relative z-10">
           <div className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border ${d.priority === 'CRITICAL' ? 'bg-red-950/40 border-red-500/20 text-red-400' : 'bg-primary/10 border-primary/20 text-primary'}`}>
              {d.priority}
           </div>
           <button 
            onClick={(e) => { e.stopPropagation(); onApplyDirective(d); }}
            className="px-3 py-1 bg-primary text-black rounded text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
           >
              APPLY
           </button>
        </div>
        <div className="space-y-1 relative z-10">
           <h4 className="text-[11px] font-black text-obsidian-100 uppercase tracking-tight group-hover:text-white transition-colors">{d.title}</h4>
           <p className="text-[9px] text-obsidian-300 italic line-clamp-2">"{d.description}"</p>
        </div>
        <div className="pt-3 border-t border-white/[0.01] flex justify-between items-center opacity-40 relative z-10">
           <span className="text-[7px] font-mono text-obsidian-200">{verboseMode ? 'ID' : 'DIR_ID'}: {d.id.split('-')[0]}</span>
           <span className="text-[8px] font-mono text-primary font-bold">{d.progress}%</span>
        </div>
      </div>
    );
  };

  const renderTrajectoryStep = (step: ReasoningStep, index: number, total: number) => (
    <div key={step.id} className="relative flex flex-col items-center">
       <div className={`size-12 rounded-full border-2 flex items-center justify-center transition-all duration-700 relative z-20 shadow-2xl ${step.status === 'RESOLVED' ? 'bg-primary text-black border-primary' : 'bg-obsidian-900 border-white/10 text-obsidian-600'}`}>
          <span className="text-[12px] font-black italic">{index + 1}</span>
          {step.status === 'RESOLVED' && <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full animate-pulse"></div>}
       </div>
       
       <div className="mt-6 flex flex-col items-center text-center gap-2 max-w-[1800px]">
          <span className="text-[10px] font-black text-white uppercase italic tracking-widest">{step.label}</span>
          <div className="p-3 bg-black/40 border border-white/5 rounded-lg">
             <p className="text-[9px] text-obsidian-50 leading-relaxed italic line-clamp-3">"{step.logic}"</p>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[7px] font-black text-obsidian-600 uppercase italic">{verboseMode ? 'Efficiency' : 'Friction'}:</span>
             <span className="text-[8px] font-mono text-primary font-bold italic">{step.impact}μ</span>
          </div>
       </div>

       {index < total - 1 && (
         <div className="absolute top-6 left-12 w-[calc(100%+24px)] h-0.5 bg-white/5 z-10">
            <div className={`h-full transition-all duration-1000 ${step.status === 'RESOLVED' ? 'bg-primary shadow-[0_0_10px_var(--xi-accent)] w-full' : 'w-0'}`}></div>
         </div>
       )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-obsidian-950 overflow-hidden animate-in fade-in duration-500 grain-layer grain-1">
      <div className="h-14 shrink-0 border-b border-white/[0.01] bg-obsidian-900 flex items-center justify-between px-8 grain-layer grain-2">
        <div className="flex items-center gap-10">
           <div className="flex bg-obsidian-950/60 rounded-lg p-1 border border-white/[0.01]">
              {[
                { id: 'DIRECTIVES', label: translate('DIRECTIVE', verboseMode) + 's' },
                { id: 'AGENTS', label: verboseMode ? 'AI Agents' : 'AGENTS' },
                { id: 'TRAJECTORY', label: translate('TRAJECTORY', verboseMode) }
              ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-obsidian-600 text-obsidian-100 border border-white/[0.03] shadow-inner' : 'text-obsidian-300 hover:text-obsidian-100'}`}
                >
                  {tab.label}
                </button>
              ))}
           </div>
           {activeTab === 'TRAJECTORY' && selectedDirective && (
             <div className="flex items-center gap-4 text-obsidian-400">
                <span className="text-[9px] font-black uppercase tracking-widest italic">{verboseMode ? 'Monitoring' : 'Tracking'}:</span>
                <span className="text-[11px] font-black text-white italic truncate max-w-[200px]">{selectedDirective.title}</span>
             </div>
           )}
        </div>
        <button onClick={onCreateDirective} className="px-6 h-9 bg-primary/10 border border-primary/20 text-primary rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all active:scale-95 shadow-lg">
          {verboseMode ? 'Create New Task' : 'Inject_Directive'}
        </button>
      </div>

      <div className="flex-1 p-8 overflow-hidden relative">
        {activeTab === 'DIRECTIVES' && (
          <div className="h-full grid grid-cols-4 gap-8">
            {COLUMNS.map(col => (
              <div key={col.id} className="flex flex-col gap-6 h-full min-w-0">
                <div className="flex items-center justify-between px-4 py-3 bg-obsidian-900/40 rounded-xl border border-white/[0.01] shadow-inner">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest italic leading-none mb-1">
                        {translate(col.labelKey, verboseMode)}
                      </span>
                      <span className="text-[7px] text-obsidian-600 uppercase font-bold italic">
                        {verboseMode ? 'Status Column' : 'Section_Module'}
                      </span>
                   </div>
                   <span className="text-[11px] font-mono text-primary font-black tabular-nums">{state.directives.filter(d => d.status === col.id).length}</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1 pb-16">
                  {state.directives.filter(d => d.status === col.id).map(d => renderDirectiveCard(d))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'AGENTS' && (
          <div className="grid grid-cols-4 gap-8 overflow-y-auto custom-scrollbar h-full pr-4 pb-20">
            {state.agents.map(agent => (
              <div key={agent.id} className="bg-obsidian-850 border border-white/[0.01] p-10 rounded-xi flex flex-col items-center gap-8 group hover:border-primary/20 transition-all grain-layer grain-3 shadow-2xl cursor-default">
                 <div className="relative">
                    <div className="size-28 rounded-full border-2 border-white/[0.05] p-1 bg-obsidian-950/40 shadow-inner group-hover:border-primary/40 transition-colors">
                       <img src={agent.avatarUrl} alt={agent.name} className={`size-full rounded-full transition-all duration-700 ${agent.isIdle ? 'grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100' : 'shadow-[0_0_20px_rgba(184,134,11,0.2)]'}`} />
                    </div>
                    {!agent.isIdle && <div className="absolute bottom-1 right-1 size-4 bg-green-500 rounded-full border-4 border-obsidian-850 animate-pulse shadow-[0_0_10px_green]"></div>}
                 </div>
                 <div className="text-center space-y-1">
                    <span className="text-[14px] font-black text-white uppercase tracking-tighter italic leading-none group-hover:text-primary transition-colors block">{agent.name}</span>
                    <span className="text-[9px] font-mono text-obsidian-500 uppercase tracking-[0.4em] italic">{agent.specialization}</span>
                 </div>
                 <div className="w-full space-y-3">
                    <div className="flex justify-between items-center text-[7px] font-black text-obsidian-600 uppercase italic">
                       <span>{verboseMode ? 'AI Processor Load' : 'Logic_Load_Σ'}</span>
                       <span className="text-primary">{agent.load}%</span>
                    </div>
                    <div className="w-full h-1 bg-obsidian-950 rounded-full overflow-hidden relative shadow-inner">
                       <div className="h-full bg-primary/40 shadow-[0_0_10px_rgba(184,134,11,0.5)] transition-all duration-1000" style={{ width: `${agent.load}%` }}></div>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'TRAJECTORY' && (
           <div className="h-full flex flex-col items-center justify-center p-12 relative animate-in zoom-in-95 duration-700">
              <div className="absolute inset-0 canvas-grid opacity-0.03 pointer-events-none"></div>
              
              {selectedDirective?.trajectory ? (
                <div className="flex flex-col items-center gap-16 relative z-10 w-full overflow-x-auto custom-scrollbar pb-20">
                   <div className="flex items-center justify-center gap-32 min-w-max px-20">
                      {selectedDirective.trajectory.steps.map((step, i) => renderTrajectoryStep(step, i, selectedDirective.trajectory!.steps.length))}
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center opacity-30 gap-6 animate-pulse">
                   <span className="material-symbols-outlined text-[80px] font-black">timeline</span>
                   <div className="text-center space-y-2">
                      <span className="text-[12px] font-black text-white uppercase tracking-[0.6em] italic">
                        {verboseMode ? 'No Task Selected' : 'No_Trajectory_Active'}
                      </span>
                   </div>
                </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
};

export default ProjectNexus;
