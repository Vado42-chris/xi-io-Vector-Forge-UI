
import React, { useState } from 'react';

interface FileBarProps {
  onAction: (action: string, payload?: any) => void;
  isProjectOpen: boolean;
  visiblePanels: string[];
}

const FileBar: React.FC<FileBarProps> = ({ onAction, isProjectOpen, visiblePanels }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = [
    {
      label: 'File',
      items: [
        { label: 'New Workspace...', action: 'MODAL_NEW_PROJECT', key: 'Ctrl+N', icon: 'add' },
        { label: 'Open Manifest...', action: 'FILE_OPEN', key: 'Ctrl+O', icon: 'folder_open' },
        { divider: true },
        ...(isProjectOpen ? [
          { label: 'Sync to Vault', action: 'FILE_SAVE', key: 'Ctrl+S', icon: 'sync' },
          { label: 'Export Final Bake', action: 'MODAL_EXPORT', icon: 'rocket_launch' },
          { divider: true },
          { label: 'Terminate Kernel', action: 'FILE_CLOSE', icon: 'power_settings_new' },
        ] : [])
      ]
    },
    {
      label: 'Layout',
      disabled: !isProjectOpen,
      items: [
        { label: 'Save Layout to Dotfile', action: 'LAYOUT_SAVE', icon: 'save' },
        { label: 'Restore Default Manifold', action: 'LAYOUT_RESET', icon: 'settings_backup_restore' },
        { divider: true },
        { label: 'Toggle Viewport Sync', action: 'LAYOUT_SYNC_TOGGLE', icon: 'sync_alt' },
        { label: 'Load Global Quad', action: 'VIEW_LAYOUT_QUAD', icon: 'grid_view' },
      ]
    },
    {
      label: 'Engine',
      items: [
        { label: 'Kernel Diagnostics', action: 'ENG_DIAG', icon: 'analytics' },
        { label: 'Hardware Acceleration', checked: true, action: 'ENG_HW', icon: 'bolt' },
        { label: 'Flush Cognitive Cache', action: 'ENG_FLUSH', icon: 'delete_sweep' },
      ]
    }
  ];

  return (
    <div className="h-8 bg-obsidian-950 border-b border-white/5 flex items-center px-4 z-[900] select-none shadow-xl relative text-xs">
      {menus.map(menu => (
        <div 
          key={menu.label} 
          className="relative h-full"
          onMouseEnter={() => !menu.disabled && setActiveMenu(menu.label)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <button 
            className={`px-4 h-full text-[9px] font-black uppercase tracking-[0.2em] transition-all 
            ${menu.disabled ? 'opacity-20 cursor-not-allowed' : (activeMenu === menu.label ? 'bg-primary text-black' : 'text-obsidian-500 hover:text-white hover:bg-white/5')}`}
          >
            {menu.label}
          </button>
          
          {activeMenu === menu.label && (
            <div className="absolute top-8 left-0 min-w-[260px] bg-obsidian-900 border border-white/10 rounded-b-xi shadow-[0_30px_90px_rgba(0,0,0,0.95)] py-2 z-[910] animate-in fade-in zoom-in-95 duration-150 backdrop-blur-3xl paper-layer grain-fine">
              <span className="px-4 py-2 text-[7px] font-black text-obsidian-600 uppercase tracking-[0.4em] italic block">Registry_Actions</span>
              {menu.items.map((item: any, idx) => (
                item.divider ? <div key={idx} className="h-px bg-white/5 my-2 mx-3" /> : (
                  <button 
                    key={item.label}
                    onClick={() => { onAction(item.action!); setActiveMenu(null); }} 
                    className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-black uppercase tracking-tight text-obsidian-400 hover:bg-primary hover:text-black transition-all group/btn text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-[18px] opacity-30 group-hover/btn:opacity-100">{item.icon || 'circle'}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.key && <span className="text-[8px] opacity-30 group-hover/btn:opacity-60">{item.key}</span>}
                  </button>
                )
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="ml-auto flex items-center gap-4">
         <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em] italic">BUILD_v8.8_STUDIO_HARDENED</span>
      </div>
    </div>
  );
};

export default FileBar;
