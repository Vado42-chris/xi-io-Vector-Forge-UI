
import React from 'react';
import { ToolType, WorkspaceRole, VectorLayer, DeploymentCycle } from '../types';
import { translate } from '../services/lexiconService';
import LexiconTooltip from './LexiconTooltip';

interface ContextBarProps {
  activeTool: ToolType;
  role: WorkspaceRole;
  selectedLayerId: string | null;
  layers: VectorLayer[];
  cycles?: DeploymentCycle[];
  verboseMode?: boolean;
}

const ContextBar: React.FC<ContextBarProps> = ({ role, selectedLayerId, layers, cycles, verboseMode = false }) => {
  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  const renderNexusControls = () => (
    <div className="flex-1 flex items-center gap-10 h-full animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center gap-4">
        <LexiconTooltip lexiconKey="DIRECTIVE" position="bottom" disabled={verboseMode}>
          <span className="text-[8px] font-black text-obsidian-300 uppercase tracking-widest">{verboseMode ? 'Current Schedule' : 'ACTIVE_CYCLE'}</span>
        </LexiconTooltip>
        <div className="flex bg-obsidian-950/60 rounded-lg p-1 border border-white/[0.01]">
           {cycles?.map(c => (
             <button key={c.id} className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${c.isCurrent ? 'bg-obsidian-600 text-obsidian-100 border border-white/[0.03]' : 'text-obsidian-300 hover:text-obsidian-100'}`}>
                {c.name}
             </button>
           ))}
        </div>
      </div>

      <div className="h-6 w-px bg-white/[0.02]"></div>

      <div className="flex items-center gap-4">
        <span className="text-[8px] font-black text-obsidian-300 uppercase tracking-widest">{verboseMode ? 'Search Work' : 'QUERY_MANIFEST'}</span>
        <div className="relative group">
           <input 
             type="text" 
             placeholder={verboseMode ? "Filter Tasks..." : "Filter Directives..."} 
             className="bg-obsidian-900 border border-white/[0.02] rounded-lg px-10 py-2.5 text-[10px] font-mono text-obsidian-100 placeholder-obsidian-300/20 w-64 outline-none focus:ring-1 focus:ring-primary/40 transition-all shadow-inner"
           />
           <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-obsidian-300/40">search</span>
        </div>
      </div>
    </div>
  );

  const renderVectorControls = () => (
    <div className="flex-1 flex items-center h-full gap-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
         <span className="text-[6px] font-black text-obsidian-300 uppercase tracking-widest px-1">{verboseMode ? 'Shape Combination' : 'BOOLEAN_FORGE'}</span>
         <div className="flex items-center bg-obsidian-950/60 rounded-lg p-1 border border-white/[0.01]">
            {['join_full', 'join_left', 'join_inner', 'join_right'].map((icon, i) => (
               <button key={i} className={`size-9 rounded flex items-center justify-center transition-all ${i === 0 ? 'bg-primary/20 text-primary border border-primary/20' : 'text-obsidian-300 hover:text-obsidian-100'}`}>
                  <span className="material-symbols-outlined !text-[16px]">{icon}</span>
               </button>
            ))}
         </div>
      </div>
      
      <div className="h-6 w-px bg-white/[0.02]"></div>
      
      <div className="flex flex-col gap-1">
         <span className="text-[6px] font-black text-obsidian-300 uppercase tracking-widest px-1">{verboseMode ? 'Object Alignment' : 'SPATIAL_SYNC'}</span>
         <div className="flex items-center gap-1 bg-obsidian-950/60 p-1 rounded-lg border border-white/[0.01]">
            {['align_horizontal_left', 'align_horizontal_center', 'align_horizontal_right', 'align_vertical_top', 'align_vertical_center', 'align_vertical_bottom'].map((icon, i) => (
            <button key={i} className="size-8 rounded flex items-center justify-center text-obsidian-300 hover:text-obsidian-100 transition-all">
               <span className="material-symbols-outlined !text-[16px]">{icon}</span>
            </button>
            ))}
         </div>
      </div>
    </div>
  );

  return (
    <div className="h-14 bg-obsidian-850 border-b border-white/[0.02] flex items-center z-[300] select-none relative grain-layer grain-3">
      <div className="w-16 h-full flex items-center justify-center border-r border-white/[0.01] group cursor-default">
         <div className="size-8 rounded bg-obsidian-900 flex items-center justify-center border border-white/[0.02] group-hover:border-primary/40 transition-all shadow-inner">
            <span className="material-symbols-outlined text-primary !text-[18px]">
               {role === WorkspaceRole.PROJECT_NEXUS ? 'account_tree' : 'polyline'}
            </span>
         </div>
      </div>
      
      <div className="flex-1 h-full flex items-center px-10 overflow-hidden">
        <div className="flex flex-col mr-12 shrink-0">
            <span className="text-[6px] font-mono text-obsidian-300 uppercase tracking-widest italic opacity-40">{verboseMode ? 'Active Mode' : 'WORKSPACE_CORE'}</span>
            <span className="text-[12px] font-black text-obsidian-100 uppercase tracking-[0.2em] italic leading-tight">
              {role === WorkspaceRole.PROJECT_NEXUS ? translate('PROJECT_NEXUS', verboseMode) : role}
            </span>
        </div>
        {role === WorkspaceRole.PROJECT_NEXUS ? renderNexusControls() : renderVectorControls()}
      </div>

      {(role !== WorkspaceRole.PROJECT_NEXUS && selectedLayerId) && (
        <div className="flex items-center gap-8 border-l border-white/[0.01] px-10 h-full animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="flex flex-col items-end gap-1">
              <span className="text-[6px] font-black text-obsidian-300 uppercase tracking-widest opacity-40 italic">{verboseMode ? 'Selected Object' : 'ENTITY_SIG'}</span>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-obsidian-100 uppercase tracking-tight truncate max-w-[120px]">{selectedLayer?.name}</span>
                 <div className="h-2 w-px bg-white/[0.05]"></div>
                 <span className="text-[9px] font-mono text-primary font-bold tabular-nums italic">{selectedLayer?.nodes.length} {verboseMode ? 'Points' : 'PTS'}</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ContextBar;
