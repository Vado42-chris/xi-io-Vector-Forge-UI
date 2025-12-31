
import React from 'react';
import ProgressBar from './ProgressBar';

interface FooterProps {
  nodeCount: number;
  fillInfo: string;
  isRendering: boolean;
  renderProgress?: number;  // 0-100 for AI generation progress
}

const Footer: React.FC<FooterProps> = ({ nodeCount, fillInfo, isRendering, renderProgress }) => {
  return (
    <footer className="xibalba-footer fixed bottom-0 left-0 right-0 h-12 flex items-center justify-between font-black select-none z-40 px-6 footer-background">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 group cursor-help">
          <span className="material-symbols-outlined text-[16px] text-[var(--xibalba-text-100)] group-hover:rotate-12 transition-transform">architecture</span>
          <span className="tracking-[0.15em] uppercase text-[var(--xibalba-text-100)]">Entities: <span className="text-white mono">{nodeCount}</span></span>
        </div>
        <div className="w-px h-4 bg-white/5"></div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[16px] text-[var(--xibalba-text-100)]/40">data_object</span>
          <span className="tracking-[0.15em] uppercase text-[var(--xibalba-text-100)]">Targeting: <span className="text-[var(--xibalba-text-100)] truncate max-w-[120px]">{fillInfo}</span></span>
        </div>
      </div>
      
      <div className="flex items-center gap-8 mono text-[var(--xibalba-text-100)]">
        <div className="flex items-center gap-4 text-xs opacity-70">
          <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-none bg-[var(--vectorforge-accent)]/50"></span>LAT: 8.4ms</span>
          <span className="px-3 border-l border-white/5">ALLOC: 242MB</span>
        </div>
        <div className="w-px h-4 bg-white/5"></div>
        <div className="flex items-center gap-4">
          {isRendering && renderProgress !== undefined && (
            <div className="w-32">
              <ProgressBar
                progress={renderProgress}
                size="sm"
                variant="accent"
                showPercentage={true}
              />
            </div>
          )}
          <div className={`flex items-center gap-3 transition-all ${isRendering ? 'text-[var(--xibalba-text-100)]' : 'text-[var(--xibalba-text-100)]/60'}`}>
            <span className={`material-symbols-outlined text-[16px] ${isRendering ? 'animate-spin' : ''}`}>{isRendering ? 'cached' : 'check_circle'}</span>
            <span className="uppercase tracking-[0.2em]">{isRendering ? 'Kernel_Busy' : 'xi_link::stable'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
