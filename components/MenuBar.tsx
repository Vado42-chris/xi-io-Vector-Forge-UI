
import React, { useState } from 'react';
import { WorkspaceRole } from '../types';

interface MenuBarProps {
  onAction: (action: string) => void;
  credits: number;
  activeRole: WorkspaceRole;
  visiblePanels: string[];
  isProjectOpen: boolean;
  projectName: string;
}

const MenuBar: React.FC<MenuBarProps> = ({ onAction, credits, isProjectOpen, projectName }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = [
    {
      label: 'File',
      items: [
        { label: 'New Project', action: 'MODAL_NEW_PROJECT', icon: 'add_circle' },
        ...(isProjectOpen ? [
          { label: 'Sync State', action: 'FILE_SAVE', icon: 'sync' },
          { divider: true },
          { label: 'Terminate Kernel', action: 'FILE_CLOSE', icon: 'power_settings_new' },
        ] : [])
      ]
    },
    {
      label: 'Engine',
      items: [
        { label: 'Diagnostics', action: 'ENG_DIAG', icon: 'analytics' },
        { label: 'Flush GPU', action: 'ENG_FLUSH', icon: 'cleaning_services' },
      ]
    }
  ];

  return (
    <div className="h-8 bg-obsidian-950 border-b border-white/[0.01] flex items-center justify-between px-2 z-[300] relative select-none">
      <div className="flex items-center h-full">
        <div 
           onClick={() => onAction('MODAL_NEW_PROJECT')}
           className="flex items-center gap-3 px-4 mr-4 group cursor-pointer border-r border-white/[0.02] hover:bg-white/[0.01] transition-all h-full"
        >
           <div className="size-4 rounded bg-primary/20 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-[12px] text-primary">bolt</span>
           </div>
           <span className="text-[9px] font-black tracking-widest text-obsidian-200 uppercase italic">{isProjectOpen ? projectName : 'STANDBY'}</span>
        </div>

        {menus.map(menu => (
          <div 
            key={menu.label} 
            className="relative h-full" 
            onMouseEnter={() => setActiveMenu(menu.label)} 
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button className={`px-4 h-full text-[8px] font-black uppercase tracking-[0.2em] transition-all ${activeMenu === menu.label ? 'bg-white/[0.02] text-obsidian-100' : 'text-obsidian-500 hover:text-obsidian-200'}`}>
              {menu.label}
            </button>
            {activeMenu === menu.label && (
              <div className="absolute top-8 left-0 min-w-[220px] bg-obsidian-900 border border-white/[0.03] rounded-b-xi shadow-[0_40px_80px_rgba(0,0,0,1)] py-2 z-[310] animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                {menu.items.map((item: any, idx) => (
                  item.divider ? <div key={idx} className="h-px bg-white/[0.02] my-2 mx-3" /> : (
                    <button 
                      key={item.label}
                      onClick={() => { onAction(item.action!); setActiveMenu(null); }} 
                      className="w-full flex items-center gap-4 px-4 py-2 text-[9px] font-black text-obsidian-400 hover:bg-primary/10 hover:text-primary transition-all uppercase tracking-widest"
                    >
                      <span className="material-symbols-outlined text-[16px] opacity-30">{item.icon}</span>
                      {item.label}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 px-4 h-full border-l border-white/[0.02]">
        <div className="flex items-center gap-3">
           <div className="size-1 rounded-full bg-green-900/60 shadow-[0_0_5px_green]"></div>
           <span className="text-[8px] font-black text-primary/40 uppercase tracking-[0.3em] tabular-nums italic">{credits.toLocaleString()} CORE</span>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
