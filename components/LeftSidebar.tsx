
import React, { useState } from 'react';
import { WorkspaceRole, ToolType, ViewportType } from '../types';
import { translate } from '../services/lexiconService';
import LexiconTooltip from './LexiconTooltip';

interface LeftSidebarProps {
  activeRole: WorkspaceRole;
  activeViewportType?: ViewportType;
  setRole: (role: WorkspaceRole) => void;
  collapsed: boolean;
  activeTool?: ToolType;
  onToolSelect?: (t: ToolType) => void;
  verboseMode?: boolean;
}

interface ToolDef {
  id: ToolType;
  icon: string;
  label: string;
  lexiconKey: string;
  shortcut?: string;
  subItems?: ToolDef[];
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeRole, activeViewportType, setRole, activeTool, onToolSelect, verboseMode = false }) => {
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  const roles = [
    { id: WorkspaceRole.VECTOR_DESIGN, icon: 'polyline', labelKey: 'ROLE_VECTOR' },
    { id: WorkspaceRole.SKELETON_RIG, icon: 'hub', labelKey: 'ROLE_RIG' },
    { id: WorkspaceRole.ANIMATION, icon: 'movie', labelKey: 'ROLE_ANIM' },
    { id: WorkspaceRole.LUX_STAGE, icon: 'flare', labelKey: 'ROLE_LUX' },
    { id: WorkspaceRole.LOGIC_FORGE, icon: 'terminal', labelKey: 'ROLE_CODE' },
    { id: WorkspaceRole.PROJECT_NEXUS, icon: 'account_tree', labelKey: 'ROLE_NEXUS' },
  ];

  const getToolsForContext = (): ToolDef[] => {
    if (activeRole === WorkspaceRole.PROJECT_NEXUS) {
      return [
        { id: 'select', icon: 'near_me', label: 'Gestalt Select', lexiconKey: 'GESTALT_SELECT', shortcut: 'V' },
        { id: 'directive_add', icon: 'add_task', label: 'Inject Directive', lexiconKey: 'DIRECTIVE' },
        { id: 'agent_dispatch', icon: 'support_agent', label: 'Dispatch Agent', lexiconKey: 'AGENT' }
      ];
    }

    if (activeRole === WorkspaceRole.LUX_STAGE) {
      return [
        { id: 'select', icon: 'near_me', label: 'Object Select', lexiconKey: 'GESTALT_SELECT' },
        { id: 'light_point', icon: 'lightbulb', label: 'Point Light', lexiconKey: 'LIGHT' },
        { id: 'light_spot', icon: 'flare', label: 'Spot Light', lexiconKey: 'LIGHT' },
        { id: 'lux_probe', icon: 'center_focus_weak', label: 'Radiosity Probe', lexiconKey: 'LIGHT' }
      ];
    }

    if (activeRole === WorkspaceRole.SKELETON_RIG) {
      return [
        { id: 'select', icon: 'near_me', label: 'Object Select', lexiconKey: 'GESTALT_SELECT' },
        { id: 'bone', icon: 'hub', label: 'Bone Tool', lexiconKey: 'BONE' },
        { id: 'transform', icon: 'open_with', label: 'Translation', lexiconKey: 'TRANSFORM' }
      ];
    }

    return [
      { id: 'select', icon: 'near_me', label: 'Selection', lexiconKey: 'GESTALT_SELECT', shortcut: 'V' },
      { id: 'pen', icon: 'draw', label: 'Path Forge', lexiconKey: 'PATH_FORGE', shortcut: 'P' },
      { id: 'rect', icon: 'rectangle', label: 'Primitives', lexiconKey: 'PRIMITIVE_BUILDER', shortcut: 'S' },
      { id: 'rotate', icon: 'rotate_right', label: 'Transform', lexiconKey: 'TRANSFORM', shortcut: 'R' },
      { id: 'knife', icon: 'content_cut', label: 'Modification', lexiconKey: 'KNIFE', shortcut: 'C' }
    ];
  };

  const currentTools = getToolsForContext();

  return (
    <div className="w-full flex flex-col h-full bg-obsidian-950 select-none border-r border-white/[0.05] animate-in fade-in duration-500 paper-layer grain-fine">
      <div className="py-4 border-b border-white/[0.05] flex flex-col items-center gap-2">
        <span className="text-[6px] font-mono text-obsidian-600 uppercase tracking-[0.4em] mb-2">Workspaces</span>
        {roles.map(role => (
          <button 
            key={role.id} 
            onClick={() => setRole(role.id)}
            className={`w-12 h-12 rounded-xi flex items-center justify-center transition-all relative group ${activeRole === role.id ? 'bg-primary/10 text-primary border border-primary/20 shadow-2xl scale-105' : 'text-obsidian-500 hover:text-obsidian-200 hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined !text-[20px]">{role.icon}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col py-6 items-center gap-4 relative">
        <div className="text-[6px] font-mono text-obsidian-600 uppercase tracking-[0.4em]">Toolbar</div>
        {currentTools.map(tool => (
          <button 
            key={tool.id}
            onClick={() => onToolSelect?.(tool.id)}
            className={`size-10 rounded-xi flex items-center justify-center transition-all border relative group/tool ${activeTool === tool.id ? 'bg-primary text-black border-primary shadow-2xl scale-110 z-10' : 'border-white/5 text-obsidian-600 hover:text-obsidian-300 hover:bg-white/[0.02]'}`}
          >
            <span className="material-symbols-outlined !text-[18px]">{tool.icon}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/[0.05] bg-black/20">
         <div className="flex justify-center">
            <div className="size-1 rounded-full bg-green-500 shadow-[0_0_10px_green]"></div>
         </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
