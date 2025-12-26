
import React from 'react';

interface RulersProps {
  zoom: number;
  pan: { x: number, y: number };
  onAddGuide: (type: 'h' | 'v', pos: number) => void;
}

const Rulers: React.FC<RulersProps> = ({ zoom, pan, onAddGuide }) => {
  const step = 50 * (zoom / 100);
  
  return (
    <>
      {/* Horizontal Ruler */}
      <div 
        className="absolute top-0 left-8 right-0 h-8 bg-obsidian-100 border-b border-white/10 z-[60] cursor-ns-resize overflow-hidden"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onAddGuide('v', (e.clientX - rect.left - pan.x) / (zoom / 100));
        }}
      >
        <div className="relative h-full flex items-end px-2" style={{ transform: `translateX(${pan.x}px)` }}>
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="absolute bottom-0 flex flex-col items-center" style={{ left: `${i * step}px` }}>
              <div className={`w-px ${i % 2 === 0 ? 'h-3 bg-primary/40' : 'h-1.5 bg-obsidian-500'}`}></div>
              {i % 2 === 0 && (
                <span className="text-[7px] font-mono text-obsidian-500 absolute -top-4">{i * 50}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vertical Ruler */}
      <div 
        className="absolute top-8 left-0 bottom-0 w-8 bg-obsidian-100 border-r border-white/10 z-[60] cursor-ew-resize overflow-hidden"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onAddGuide('h', (e.clientY - rect.top - pan.y) / (zoom / 100));
        }}
      >
        <div className="relative w-full flex flex-col items-end py-2" style={{ transform: `translateY(${pan.y}px)` }}>
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="absolute right-0 flex items-center" style={{ top: `${i * step}px` }}>
              <div className={`h-px ${i % 2 === 0 ? 'w-3 bg-primary/40' : 'w-1.5 bg-obsidian-500'}`}></div>
              {i % 2 === 0 && (
                <span className="text-[7px] font-mono text-obsidian-500 absolute -left-6 transform -rotate-90">{i * 50}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Zero Point */}
      <div className="absolute top-0 left-0 size-8 bg-obsidian-200 border-r border-b border-white/10 z-[70] flex items-center justify-center">
        <span className="material-symbols-outlined text-[14px] text-primary">straighten</span>
      </div>
    </>
  );
};

export default Rulers;
