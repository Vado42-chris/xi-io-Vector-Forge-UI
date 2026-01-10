
import React, { useState } from 'react';

interface FileBarProps {
  onAction: (action: string) => void;
  isProjectOpen: boolean;
  visiblePanels: string[];
}

const FileBar: React.FC<FileBarProps> = ({ onAction, isProjectOpen, visiblePanels }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeTelemetry, setActiveTelemetry] = useState<'latency' | 'version' | null>(null);

  const menus = [
    {
      label: 'File',
      items: [
        { label: 'New Project...', action: 'MODAL_NEW_PROJECT', key: 'Ctrl+N', icon: 'add' },
        { label: 'Open Protocol...', action: 'FILE_OPEN', key: 'Ctrl+O', icon: 'folder_open' },
        { divider: true },
        ...(isProjectOpen ? [
          { label: 'Sync State', action: 'FILE_SAVE', key: 'Ctrl+S', icon: 'sync' },
          { label: 'Clone Kernel...', action: 'FILE_SAVE_AS', icon: 'content_copy' },
          { divider: true },
          { 
            label: 'Export Manifest', 
            icon: 'output',
            flyout: [
              { label: 'Vector (.svg)', action: 'EXP_SVG' },
              { label: 'Raster (.png)', action: 'EXP_PNG' },
              { label: 'Geometry (.obj)', action: 'EXP_OBJ' },
              { label: 'Logic (.json)', action: 'EXP_JSON' }
            ]
          },
          { divider: true },
          { label: 'Project Manifest Settings...', action: 'MODAL_PROJECT_SETTINGS', icon: 'settings_suggest' },
          { label: 'Terminate Kernel', action: 'FILE_CLOSE', icon: 'power_settings_new' },
        ] : [])
      ]
    },
    {
      label: 'Edit',
      disabled: !isProjectOpen,
      items: [
        { label: 'Undo Synthesis', action: 'EDIT_UNDO', key: 'Ctrl+Z', icon: 'undo' },
        { label: 'Redo Synthesis', action: 'EDIT_REDO', key: 'Ctrl+Y', icon: 'redo' },
        { divider: true },
        { label: 'Cut Entity', action: 'EDIT_CUT', key: 'Ctrl+X', icon: 'content_cut' },
        { label: 'Copy Entity', action: 'EDIT_COPY', key: 'Ctrl+C', icon: 'content_copy' },
        { label: 'Paste Dispatch', action: 'EDIT_PASTE', key: 'Ctrl+V', icon: 'content_paste' },
        { divider: true },
        { label: 'Engine Preferences...', action: 'MODAL_PREFERENCES', icon: 'tune' },
      ]
    },
    {
      label: 'Window',
      items: [
        { label: 'Property Inspector', action: 'PANEL_INSPECTOR', checked: visiblePanels.includes('inspector'), icon: 'deployed_code' },
        { label: 'Layer Stack', action: 'PANEL_LAYERS', checked: visiblePanels.includes('layers'), icon: 'layers' },
        { label: 'Kernel Terminal', action: 'PANEL_TERMINAL', checked: visiblePanels.includes('terminal'), key: '`', icon: 'terminal' },
        { label: 'Asset Library', action: 'PANEL_ASSETS', checked: visiblePanels.includes('assets'), icon: 'category' },
        { divider: true },
        { label: 'Xibalba Ledger', action: 'PANEL_LEDGER', icon: 'account_balance_wallet' },
        { divider: true },
        { label: 'Reset UI Grid', action: 'LAYOUT_RESET', icon: 'grid_view' },
      ]
    },
    {
      label: 'Engine',
      disabled: !isProjectOpen,
      items: [
        { label: 'Re-sync Neural Kernel', action: 'ENG_RESYNC', icon: 'bolt' },
        { label: 'Purge GPU Cache', action: 'ENG_FLUSH', icon: 'mop' },
        { divider: true },
        { label: 'Diagnostics Report', action: 'ENG_DIAG', icon: 'analytics' },
        { label: 'Hardware Acceleration', checked: true, action: 'ENG_HW' },
      ]
    }
  ];

  return (
    <div className="h-8 bg-obsidian-200 border-b border-white/5 flex items-center px-4 z-[900] select-none shadow-xl relative text-xs">
      {menus.map(menu => (
        <div 
          key={menu.label} 
          className="relative h-full"
          onMouseEnter={() => !menu.disabled && setActiveMenu(menu.label)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <button 
            className={`px-4 h-full text-[9px] font-black uppercase tracking-[0.2em] transition-all 
            ${menu.disabled ? 'opacity-20 cursor-not-allowed' : (activeMenu === menu.label ? 'bg-primary text-white' : 'text-obsidian-500 hover:text-white hover:bg-white/5')}`}
          >
            {menu.label}
          </button>
          
          {activeMenu === menu.label && (
            <div className="absolute top-8 left-0 min-w-[260px] bg-obsidian-100 border border-white/10 rounded-b-xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] py-2 z-[910] animate-in fade-in zoom-in-95 duration-150 backdrop-blur-3xl">
              {menu.items.map((item: any, idx) => (
                item.divider ? <div key={idx} className="h-px bg-white/5 my-2 mx-3" /> : (
                  <div key={item.label} className="relative group/item">
                    <button 
                      onClick={() => { if (!item.flyout) { onAction(item.action!); setActiveMenu(null); } }} 
                      className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-black uppercase tracking-tight text-obsidian-400 hover:bg-primary hover:text-white transition-all group/btn text-left"
                    >
                      <div className="flex items-center gap-4">
                        {item.checked !== undefined ? (
                          <span className="material-symbols-outlined text-[18px] text-primary group-hover/btn:text-white">{item.checked ? 'check_box' : 'check_box_outline_blank'}</span>
                        ) : (
                          <span className="material-symbols-outlined text-[18px] opacity-30 group-hover/btn:opacity-100">{item.icon || 'circle'}</span>
                        )}
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         {item.key && <span className="opacity-30 font-mono text-[8px] group-hover/btn:opacity-100">{item.key}</span>}
                         {item.flyout && <span className="material-symbols-outlined text-[16px] opacity-40">chevron_right</span>}
                      </div>
                    </button>
                    
                    {item.flyout && (
                      <div className="absolute left-full top-0 ml-0.5 min-w-[200px] bg-obsidian-100 border border-white/10 rounded-xl shadow-2xl py-2 hidden group-hover/item:block animate-in fade-in slide-in-from-left-2 backdrop-blur-3xl">
                        {item.flyout.map((sub: any) => (
                          <button 
                            key={sub.label} 
                            onClick={() => { onAction(sub.action); setActiveMenu(null); }}
                            className="w-full text-left px-5 py-2 text-[10px] font-black uppercase tracking-tight text-obsidian-400 hover:bg-primary hover:text-white transition-all"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      ))}
      
      {/* RIGHT SIDE UTILITIES */}
      <div className="ml-auto flex items-center gap-6 px-4">
         <div 
           className="relative h-full flex items-center group cursor-help"
           onMouseEnter={() => setActiveTelemetry('latency')}
           onMouseLeave={() => setActiveTelemetry(null)}
         >
            <div className="flex items-center gap-3">
               <span className="text-[8px] font-black text-obsidian-500 uppercase tracking-widest group-hover:text-white transition-colors">Latency</span>
               <div className="flex gap-0.5">
                  <div className="w-0.5 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)] transition-all"></div>
                  <div className="w-0.5 h-3 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)] transition-all"></div>
                  <div className="w-0.5 h-2 bg-obsidian-500 rounded-full transition-all"></div>
               </div>
            </div>
         </div>
         <div className="h-4 w-px bg-white/5"></div>
         <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em] italic">V_0.8.4_SOVEREIGN</span>
      </div>
    </div>
  );
};

export default FileBar;
