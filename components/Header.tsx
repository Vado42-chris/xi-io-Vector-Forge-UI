
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

      {/* 18.5 Header Status Indicators */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 px-4 h-8 bg-obsidian-300 rounded-full border border-white/5 shadow-inner">
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="size-1.5 rounded-full bg-green-500 shadow-[0_0_5px_green]"></span>
            <span className="text-[8px] font-black text-white/50 group-hover:text-primary transition-colors uppercase tracking-widest">Orch</span>
          </div>
          <div className="w-px h-3 bg-white/10"></div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="size-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_amber]"></span>
            <span className="text-[8px] font-black text-white/50 group-hover:text-primary transition-colors uppercase tracking-widest">Valid</span>
          </div>
          <div className="w-px h-3 bg-white/10"></div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_5px_var(--xi-vector-glow)]"></span>
            <span className="text-[8px] font-black text-white/50 group-hover:text-primary transition-colors uppercase tracking-widest">Market</span>
          </div>
        </div>

         <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 xi-inset">
            <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--xi-vector-glow)]"></div>
            <span className="text-[9px] font-black text-primary uppercase tracking-widest mono">{credits.toLocaleString()} CORE</span>
         </div>
         <div className="flex items-center gap-3 pl-6 border-l border-white/5">
            <div className="size-8 rounded-full bg-obsidian-300 border border-white/10 overflow-hidden shadow-inner xi-inset">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=IllustrationPro" alt="User" />
            </div>
         </div>
      </div>
    </header>
  );
};

export default Header;
