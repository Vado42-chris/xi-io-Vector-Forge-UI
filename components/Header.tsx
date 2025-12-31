
import React, { useState } from 'react';

interface HeaderProps {
  onAction: (action: string) => void;
  credits: number;
}

const Header: React.FC<HeaderProps> = ({ onAction, credits }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = [
    { 
      label: 'File', 
      items: [
        { label: 'New Workspace', action: 'FILE_NEW', icon: 'add' },
        { label: 'Save Snapshot', action: 'FILE_SNAPSHOT', icon: 'save' },
        { label: 'Export SVG', action: 'FILE_EXPORT', icon: 'download' },
      ] 
    },
    { 
      label: 'Kernel', 
      items: [
        { label: 'Simplify Geometry', action: 'AI_SIMPLIFY', icon: 'architecture' },
        { label: 'Balance Weights', action: 'AI_BALANCE', icon: 'balance' },
        { label: 'Color Sync', action: 'AI_HARMONIZE', icon: 'palette' },
      ] 
    },
  ];

  return (
    <header className="xibalba-header shrink-0 flex items-center justify-between z-[100] select-none">
      <div className="flex items-center gap-6">
        {/* Xibalba Identity Block - Grey-on-Grey, Sharp Geometric */}
        <div className="flex items-center gap-3 pr-6 border-r border-white/10 group cursor-pointer xibalba-interactive">
          <div className="size-8 bg-[var(--xibalba-grey-150)] border border-white/10 flex items-center justify-center shadow-md transition-all group-hover:bg-[var(--xibalba-grey-200)]">
            <span className="material-symbols-outlined text-[var(--xibalba-text-000)] text-[18px] font-bold">polyline</span>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-sm font-black tracking-[0.2em] text-[var(--xibalba-text-000)]">XIBALBA</span>
            <span className="text-[13px] font-bold text-[var(--xibalba-text-100)] tracking-tighter">VECTORFORGE</span>
          </div>
        </div>

        <nav className="flex items-center h-full">
          {menus.map(menu => (
            <div 
              key={menu.label} 
              className="relative h-full"
            >
              <button 
                className={`xibalba-button px-5 h-full text-sm font-black uppercase tracking-widest ${activeMenu === menu.label ? 'xibalba-selected' : ''}`}
                onMouseEnter={() => setActiveMenu(menu.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {menu.label}
              </button>
              
              {activeMenu === menu.label && (
                <div className="xibalba-card absolute top-full left-0 mt-1 w-52 py-2 z-[110] xibalba-animate-in">
                  {menu.items.map(item => (
                    <button 
                      key={item.label}
                      onClick={() => { onAction(item.action); setActiveMenu(null); }}
                      className="xibalba-interactive w-full text-left px-5 py-2.5 text-xs font-black uppercase tracking-widest text-[var(--xibalba-text-100)] hover:text-[var(--xibalba-text-[var(--xibalba-text-100)])] flex items-center gap-4"
                    >
                      <span className="material-symbols-outlined text-[18px] opacity-70">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
         {/* Credits - Pattern #211: Compact Utility - Grey Panel */}
         <div className="xibalba-panel-elevated flex items-center gap-3 px-4 py-1.5 border border-white/10">
            <div className="size-2 bg-[var(--xibalba-grey-200)] animate-pulse"></div>
            <span className="text-sm font-black text-[var(--xibalba-text-100)] uppercase tracking-widest mono">{credits.toLocaleString()} CORE_LIBS</span>
         </div>
         {/* Execution Status - Grey Text */}
         <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="flex flex-col items-end -space-y-1 mr-2">
               <span className="text-xs font-bold text-[var(--xibalba-text-100)] uppercase">Execution Layer</span>
               <span className="text-xs font-mono text-[var(--xibalba-text-100)] uppercase">Active_Session</span>
            </div>
            <div className="size-9 bg-[var(--xibalba-grey-150)] border border-white/10 overflow-hidden cursor-pointer xibalba-interactive">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=IllustrationPro" alt="User" className="w-full h-full object-cover" />
            </div>
         </div>
      </div>
    </header>
  );
};

export default Header;
