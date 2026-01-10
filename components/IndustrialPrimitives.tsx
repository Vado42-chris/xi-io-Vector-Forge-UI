
import React from 'react';

export const XI_Button: React.FC<{
  label?: string;
  icon?: string;
  variant?: 'primary' | 'obsidian' | 'ghost';
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}> = ({ label, icon, variant = 'obsidian', onClick, className = '', loading, size = 'md', disabled }) => {
  const variants = {
    primary: 'bg-primary text-black border-primary/50 hover:bg-white shadow-[0_0_40px_-10px_rgba(184,134,11,0.3)] font-black',
    obsidian: 'bg-obsidian-850 text-obsidian-50 border-white/[0.05] hover:bg-obsidian-800 hover:border-white/[0.1] shadow-2xl grain-layer grain-2',
    ghost: 'bg-transparent text-obsidian-300 border-transparent hover:text-obsidian-50 hover:bg-white/[0.02]'
  };

  const sizes = {
    sm: 'px-4 py-2 text-[9px] gap-2 rounded-xi min-w-[80px]',
    md: 'px-8 py-3.5 text-[10px] gap-3 rounded-xi min-w-[140px]',
    lg: 'px-12 py-5 text-[13px] gap-4 rounded-xi min-w-[200px]'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        border transition-all active:translate-y-px active:scale-[0.98] uppercase tracking-[0.2em] font-black
        flex items-center justify-center relative overflow-hidden disabled:opacity-20 disabled:grayscale
        ${variants[variant]} ${sizes[size]} ${className} whitespace-nowrap
      `}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      {icon && <span className={`material-symbols-outlined !text-[18px] relative z-10 shrink-0 notranslate ${loading ? 'animate-spin' : ''}`}>{loading ? 'cached' : icon}</span>}
      {label && <span className="relative z-10 truncate">{label}</span>}
    </button>
  );
};

export const XI_Telemetry: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => (
  <div className="flex flex-col items-end gap-1 shrink-0 select-none group">
    <span className="text-[7px] font-mono text-obsidian-400 uppercase tracking-[0.4em] leading-none opacity-60 font-bold group-hover:text-primary transition-all italic">{label}</span>
    <span className="text-[14px] font-black text-obsidian-50 mono tabular-nums leading-none tracking-tighter italic whitespace-nowrap">{value}</span>
  </div>
);

export const XI_StatusBadge: React.FC<{
  status: 'STABLE' | 'WARNING' | 'CRITICAL' | 'STANDBY';
  label: string;
}> = ({ status, label }) => {
  const colors = {
    STABLE: 'bg-green-500/10 border-green-500/30 text-green-500',
    WARNING: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
    CRITICAL: 'bg-red-500/10 border-red-500/30 text-red-500',
    STANDBY: 'bg-obsidian-800/40 border-white/5 text-obsidian-500'
  };

  return (
    <div className={`px-2.5 py-1 rounded-xi border flex items-center gap-2 ${colors[status]} shadow-inner`}>
      <div className={`size-1 rounded-full ${status === 'STABLE' ? '' : 'animate-pulse'} bg-current`}></div>
      <span className="text-[7px] font-black uppercase tracking-widest leading-none">{label}</span>
    </div>
  );
};

export const XI_ProgressGauge: React.FC<{
  value: number;
  label: string;
  color?: string;
}> = ({ value, label, color = 'var(--xi-accent)' }) => (
  <div className="space-y-1.5 w-full">
    <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest opacity-40 italic leading-none">
      <span className="truncate pr-2">{label}</span>
      <span className="font-mono">{value}%</span>
    </div>
    <div className="h-1 bg-obsidian-950 rounded-full overflow-hidden p-0.5 border border-white/5">
      <div 
        className="h-full rounded-full transition-all duration-1000" 
        style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
      ></div>
    </div>
  </div>
);
