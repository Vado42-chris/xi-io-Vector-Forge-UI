
import React from 'react';

interface FooterProps {
  nodeCount: number;
  fillInfo: string;
  isRendering: boolean;
}

const Footer: React.FC<FooterProps> = ({ nodeCount, fillInfo, isRendering }) => {
  return (
    <footer className="h-10 shrink-0 bg-obsidian-100 border-t border-white/10 flex items-center justify-between px-6 text-[10px] font-black select-none z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 group cursor-help">
          <span className="material-symbols-outlined text-[16px] text-primary group-hover:rotate-12 transition-transform">architecture</span>
          <span className="tracking-[0.15em] uppercase text-obsidian-500">Entities: <span className="text-white mono">{nodeCount}</span></span>
        </div>
        <div className="w-px h-4 bg-white/5"></div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[16px] text-primary/40">data_object</span>
          <span className="tracking-[0.15em] uppercase text-obsidian-500">Targeting: <span className="text-primary truncate max-w-[120px]">{fillInfo}</span></span>
        </div>
      </div>
      
      <div className="flex items-center gap-8 mono text-obsidian-500">
        <div className="flex items-center gap-4 text-[9px] opacity-70">
          <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-green-500/50"></span>LAT: 8.4ms</span>
          <span className="px-3 border-l border-white/5">ALLOC: 242MB</span>
        </div>
        <div className="w-px h-4 bg-white/5"></div>
        <div className={`flex items-center gap-3 transition-all ${isRendering ? 'text-primary' : 'text-primary/60'}`}>
          <span className={`material-symbols-outlined text-[16px] ${isRendering ? 'animate-spin' : ''}`}>{isRendering ? 'cached' : 'check_circle'}</span>
          <span className="uppercase tracking-[0.2em]">{isRendering ? 'Kernel_Busy' : 'xi_link::stable'}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
