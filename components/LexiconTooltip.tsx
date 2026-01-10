
import React from 'react';
import { getDefinition } from '../services/lexiconService';

interface LexiconTooltipProps {
  lexiconKey: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
}

const LexiconTooltip: React.FC<LexiconTooltipProps> = ({ lexiconKey, children, position = 'bottom', disabled = false }) => {
  if (disabled) return <>{children}</>;

  const posClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3'
  };

  return (
    <div className="relative group/lexicon inline-block">
      {children}
      <div className={`
        absolute z-[9999] px-4 py-3 bg-obsidian-900 border border-primary/20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]
        w-64 opacity-0 group-hover/lexicon:opacity-100 pointer-events-none transition-all duration-200 scale-95 group-hover/lexicon:scale-100
        ${posClasses[position]}
      `}>
        <div className="space-y-1.5">
           <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em] block italic">Definition_Protocol</span>
           <p className="text-[10px] text-obsidian-100 font-medium leading-relaxed">
             {getDefinition(lexiconKey)}
           </p>
        </div>
        {/* Pointer Arrow */}
        <div className={`absolute size-2 bg-obsidian-900 border-primary/20 rotate-45 ${
          position === 'bottom' ? '-top-1 border-t border-l left-1/2 -translate-x-1/2' : 
          position === 'top' ? '-bottom-1 border-b border-r left-1/2 -translate-x-1/2' : ''
        }`}></div>
      </div>
    </div>
  );
};

export default LexiconTooltip;
