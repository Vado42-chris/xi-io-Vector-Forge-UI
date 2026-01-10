
import React, { useEffect, useState } from 'react';

interface Point { x: number; y: number; z: number }

const EventBusOverlay: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [pulses, setPulses] = useState<number[]>([]);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setPulses(prev => [...prev, Date.now()].slice(-10));
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[8000] preserve-3d overflow-visible animate-in fade-in duration-1000">
      <svg className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="bus-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9800" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF9800" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF9800" stopOpacity="0" />
          </linearGradient>
          <filter id="neon-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* WIRING FILAMENTS: IDE -> CANVAS */}
        <path 
          d="M 100,200 Q 500,100 900,450" 
          fill="none" 
          stroke="rgba(255,152,0,0.15)" 
          strokeWidth="2" 
          strokeDasharray="10 10" 
          filter="url(#neon-glow)"
        />

        {/* WIRING FILAMENTS: CANVAS -> LEDGER */}
        <path 
          d="M 900,450 Q 1200,800 1600,500" 
          fill="none" 
          stroke="rgba(0,188,212,0.15)" 
          strokeWidth="2" 
          strokeDasharray="10 10"
        />

        {/* ACTIVE DATA PULSES */}
        {pulses.map(p => (
          <circle key={p} r="4" fill="#FF9800" filter="url(#neon-glow)">
            <animateMotion 
              dur="2s" 
              repeatCount="indefinite" 
              path="M 100,200 Q 500,100 900,450" 
            />
          </circle>
        ))}
        
        {pulses.map(p => (
          <circle key={p + 'cyan'} r="3" fill="#00BCD4" filter="url(#neon-glow)">
            <animateMotion 
              dur="1.5s" 
              repeatCount="indefinite" 
              path="M 900,450 Q 1200,800 1600,500" 
            />
          </circle>
        ))}
      </svg>

      {/* METADATA TAGS AT NODES */}
      <div className="absolute top-[200px] left-[100px] px-4 py-2 bg-black/80 border border-primary/40 rounded-xl backdrop-blur-xl animate-bounce">
         <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">IDE_EVENT_OUT_0x84</span>
      </div>

      <div className="absolute bottom-[400px] right-[400px] px-4 py-2 bg-black/80 border border-cyan-500/40 rounded-xl backdrop-blur-xl animate-pulse">
         <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.3em]">LEDGER_SETTLEMENT_BUS</span>
      </div>
    </div>
  );
};

export default EventBusOverlay;
