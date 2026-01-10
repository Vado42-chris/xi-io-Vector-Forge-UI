
import React from 'react';
import { WorkspaceRole, ToolType } from '../types';

interface LeftSidebarProps {
  activeRole: WorkspaceRole;
  setRole: (role: WorkspaceRole) => void;
  collapsed: boolean;
  activeTool?: ToolType;
  onToolSelect?: (t: ToolType) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeRole, setRole, activeTool, onToolSelect }) => {
  const roles = [
    { id: WorkspaceRole.VECTOR_DESIGN, icon: 'polyline', label: 'Vector Workspace' },
    { id: WorkspaceRole.PROJECT_NEXUS, icon: 'account_tree', label: 'Project Nexus (Management)' },
    { id: WorkspaceRole.SKELETON_RIG, icon: 'hub', label: 'Skeleton Rigging' },
    { id: WorkspaceRole.LUX_STAGE, icon: 'flare', label: 'Lux Lighting Stage' },
  ];

  const currentTools = [
    { id: 'select' as ToolType, icon: 'near_me', label: 'Selection Tool (V)' },
    { id: 'pen' as ToolType, icon: 'draw', label: 'Path Forge Tool (P)' },
    { id: 'rect' as ToolType, icon: 'rectangle', label: 'Primitive Builder (R)' },
  ];

  return (
    <div className="w-full flex flex-col h-full bg-obsidian-950 select-none border-r border-white/[0.02]">
      <div className="py-2 border-b border-white/[0.03] flex flex-col items-center gap-1">
        {roles.map(role => (
          <button 
            key={role.id}
            onClick={() => setRole(role.id)}
            title={role.label}
            className={`
              w-full h-12 flex items-center justify-center transition-all relative group
              ${activeRole === role.id ? 'text-primary' : 'text-obsidian-500 hover:text-obsidian-200'}
            `}
          >
            {activeRole === role.id && (
              <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary shadow-[0_0_10px_var(--xi-accent)]"></div>
            )}
            <span className="material-symbols-outlined !text-[20px]">{role.icon}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col py-6 items-center gap-4">
        <div className="text-[6px] font-mono text-obsidian-600 uppercase tracking-[0.4em]">Toolbar</div>
        {currentTools.map(tool => (
          <button 
            key={tool.id}
            onClick={() => onToolSelect?.(tool.id)}
            title={tool.label}
            className={`
              size-10 rounded-xi flex items-center justify-center transition-all border
              ${activeTool === tool.id 
                ? 'bg-primary/10 border-primary/30 text-primary shadow-2xl' 
                : 'border-transparent text-obsidian-600 hover:text-obsidian-300 hover:bg-white/[0.02]'}
            `}
          >
            <span className="material-symbols-outlined !text-[18px]">{tool.icon}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/[0.03] bg-black/20">
         <div className="space-y-2">
            <div className="flex justify-between items-center px-0.5">
               <span className="text-[6px] font-mono text-obsidian-600 uppercase">LOAD</span>
               <span className="text-[8px] font-mono text-primary font-bold">12%</span>
            </div>
            <div className="h-0.5 bg-obsidian-800 w-full rounded-full overflow-hidden" title="System Computational Load">
               <div className="h-full bg-primary/40 w-[12%] shadow-[0_0_8px_var(--xi-accent)]"></div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
