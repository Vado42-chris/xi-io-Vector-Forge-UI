
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
    sm: 'px-6 py-2.5 text-[9px] gap-3 rounded-[4px] min-w-[100px]',
    md: 'px-10 py-4 text-[11px] gap-4 rounded-[6px] min-w-[160px]',
    lg: 'px-16 py-6 text-[14px] gap-6 rounded-[8px] min-w-[240px]'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        border transition-all active:translate-y-px active:scale-[0.97] uppercase tracking-[0.2em]
        flex items-center justify-center relative overflow-hidden disabled:opacity-20 disabled:grayscale
        ${variants[variant]} ${sizes[size]} ${className} whitespace-nowrap
      `}
    >
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      {icon && <span className={`material-symbols-outlined !text-[20px] relative z-10 shrink-0 notranslate ${loading ? 'animate-spin' : ''}`}>{loading ? 'cached' : icon}</span>}
      {label && <span className="relative z-10 font-black truncate">{label}</span>}
    </button>
  );
};

export const XI_Telemetry: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => (
  <div className="flex flex-col items-end gap-1 shrink-0 select-none group">
    <span className="text-[8px] font-mono text-obsidian-300 uppercase tracking-[0.3em] leading-none opacity-60 font-bold group-hover:text-primary transition-all">{label}</span>
    <span className="text-[15px] font-black text-obsidian-50 mono tabular-nums leading-none tracking-tighter italic whitespace-nowrap">{value}</span>
  </div>
);
