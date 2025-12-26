
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
    <header className="h-12 shrink-0 bg-obsidian-200 border-b border-white/5 flex items-center justify-between px-4 z-[100] select-none shadow-2xl">
      <div className="flex items-center gap-6">
        {/* Popping Vector Identity Block */}
        <div className="flex items-center gap-3 pr-6 border-r border-white/5 group cursor-pointer">
          <div className="size-6 rounded bg-gradient-to-br from-primary to-[#E65100] flex items-center justify-center xi-popping-glow shadow-lg transition-transform group-hover:scale-105 active:scale-95">
            <span className="material-symbols-outlined text-white text-[16px] font-bold">polyline</span>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-[10px] font-black tracking-[0.2em] text-white">XIBALBA</span>
            <span className="text-[12px] font-bold text-primary tracking-tighter">VECTORFORGE</span>
          </div>
        </div>

        <nav className="flex items-center h-full">
          {menus.map(menu => (
            <div 
              key={menu.label} 
              className="relative h-full"
              onMouseEnter={() => setActiveMenu(menu.label)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className={`px-5 h-full text-[10px] font-black uppercase tracking-widest transition-all ${activeMenu === menu.label ? 'bg-white/5 text-primary' : 'text-obsidian-500 hover:text-white'}`}>
                {menu.label}
              </button>
              
              {activeMenu === menu.label && (
                <div className="absolute top-12 left-0 w-52 bg-obsidian-100 border border-white/10 rounded-b-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] py-2 z-[110] animate-in fade-in slide-in-from-top-2">
                  {menu.items.map(item => (
                    <button 
                      key={item.label}
                      onClick={() => { onAction(item.action); setActiveMenu(null); }}
                      className="w-full text-left px-5 py-2.5 text-[9px] font-black uppercase tracking-widest text-obsidian-500 hover:bg-primary hover:text-white transition-all flex items-center gap-4"
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
         <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 xi-inset">
            <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--xi-vector-glow)]"></div>
            <span className="text-[9px] font-black text-primary uppercase tracking-widest mono">{credits.toLocaleString()} CORE_LIBS</span>
         </div>
         <div className="flex items-center gap-3 pl-6 border-l border-white/5">
            <div className="flex flex-col items-end -space-y-1 mr-1">
               <span className="text-[9px] font-bold text-white uppercase opacity-80">Execution Layer</span>
               <span className="text-[8px] font-mono text-primary uppercase">Active_Session</span>
            </div>
            <div className="size-8 rounded-full bg-obsidian-300 border border-white/10 overflow-hidden shadow-inner xi-inset">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=IllustrationPro" alt="User" />
            </div>
         </div>
      </div>
    </header>
  );
};

export default Header;
