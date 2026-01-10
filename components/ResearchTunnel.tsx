
import React, { useState, useEffect } from 'react';

const ResearchTunnel: React.FC = () => {
  const [url, setUrl] = useState('https://xibalba.foundry/research');
  const [isSniffing, setIsSniffing] = useState(false);
  const [activeLogic, setActiveLogic] = useState('');
  const [packets, setPackets] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPackets(prev => [...prev, Math.random() * 100].slice(-30));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleSniff = () => {
    setIsSniffing(true);
    let count = 0;
    const codes = ["Friction(μ) = 0.12", "Density(Σ) = 42.8", "Entropy(S) = 0.142", "Gaze_Wait = 0.84ms"];
    const interval = setInterval(() => {
      setActiveLogic(codes[count % codes.length]);
      count++;
      if (count > 20) {
        clearInterval(interval);
        setIsSniffing(false);
        setActiveLogic('SNIFF_COMPLETE: Hallberg_Ready');
      }
    }, 150);
  };

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-1000">
       {/* BROWSER CHROME */}
       <div className="h-20 border-b border-white/5 bg-obsidian-100 flex items-center px-12 gap-12 shrink-0 shadow-2xl relative z-10">
          <div className="flex items-center gap-4 shrink-0">
             <div className="size-4 rounded-full bg-red-500/20 hover:bg-red-500 transition-all cursor-pointer"></div>
             <div className="size-4 rounded-full bg-amber-500/20 hover:bg-amber-500 transition-all cursor-pointer"></div>
             <div className="size-4 rounded-full bg-green-500/20 hover:bg-green-500 transition-all cursor-pointer"></div>
          </div>

          <div className="flex-1 bg-black/60 border-2 border-white/5 rounded-2xl h-12 flex items-center px-6 gap-6 focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-inner group">
             <span className="material-symbols-outlined text-obsidian-700 group-focus-within:text-primary transition-colors">vpn_lock</span>
             <input 
               type="text" 
               value={url} 
               onChange={(e) => setUrl(e.target.value)}
               className="flex-1 bg-transparent border-none text-[15px] font-mono text-white/80 outline-none italic tracking-tight"
               placeholder="Search Global Design Pattern Archive..."
             />
             <span className="material-symbols-outlined text-obsidian-700 hover:text-white cursor-pointer transition-all">star</span>
             <span className="material-symbols-outlined text-obsidian-700 hover:text-white cursor-pointer transition-all">refresh</span>
          </div>

          <button 
            onClick={handleSniff}
            disabled={isSniffing}
            className="h-12 px-10 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(255,152,0,0.3)] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-4 group overflow-hidden relative shrink-0"
          >
             <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
             <span className={`material-symbols-outlined text-[20px] ${isSniffing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`}>biotech</span>
             <span className="relative z-10">{isSniffing ? 'SNIFFING_DNA...' : 'SNIFF_DESIGN_PATTERNS'}</span>
          </button>
       </div>

       {/* BROWSER VIEWPORT */}
       <div className="flex-1 bg-obsidian-300 relative overflow-hidden flex items-center justify-center p-24 group">
          <div className="absolute inset-0 canvas-grid opacity-[0.1] pointer-events-none transition-opacity group-hover:opacity-[0.2]"></div>
          
          <div className="text-center space-y-16 max-w-4xl relative z-10 animate-in zoom-in-95 duration-1000">
             <div className="relative group mx-auto w-fit">
                <div className="absolute -inset-24 bg-primary/10 blur-[150px] rounded-full animate-pulse group-hover:bg-primary/20 transition-all duration-1000"></div>
                <div className="size-64 rounded-[80px] border-4 border-white/5 bg-black/40 flex items-center justify-center relative z-10 shadow-inner group-hover:rotate-6 transition-transform duration-1000 group-hover:border-primary/20">
                   <span className="material-symbols-outlined text-[160px] text-white/5 group-hover:text-primary/20 transition-all duration-1000 font-black">public</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                   <span className="material-symbols-outlined text-[64px] text-primary animate-pulse font-black opacity-60">search</span>
                </div>
             </div>
             
             {isSniffing ? (
               <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  <span className="text-[12px] font-mono text-primary uppercase tracking-[0.8em] animate-pulse">De-Compiling_External_Spec</span>
                  <p className="text-5xl font-mono text-white font-black italic">{activeLogic}</p>
               </div>
             ) : (
               <div className="space-y-6">
                  <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-tight">Tunnel_Active</h3>
                  <p className="text-2xl text-obsidian-600 font-medium italic leading-relaxed max-w-3xl mx-auto">
                     "Point the tunnel at any URL to ingest its design DNA. We pattern-match components against #HallbergMaths signatures."
                  </p>
               </div>
             )}

             <div className="flex gap-8 justify-center">
                {['Pattern_Scraper_V8', 'Logic_Sniffer', 'CSS_DNA_Extract', 'Asset_Bridge'].map(t => (
                  <button key={t} className="px-8 py-4 bg-black/60 border border-white/5 rounded-2xl text-[10px] font-black text-obsidian-500 uppercase tracking-widest hover:border-primary/40 hover:text-white transition-all shadow-xl hover:bg-primary/5 active:scale-95 group">
                     <span className="group-hover:text-primary transition-colors">{t}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* PACKET HUD */}
          <div className="absolute top-12 right-12 p-10 bg-obsidian-100/60 backdrop-blur-3xl rounded-[48px] border border-white/10 shadow-2xl space-y-8 w-80 group hover:bg-obsidian-100 transition-all">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Ingress_Stream</span>
                <div className="size-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_green]"></div>
             </div>
             <div className="h-20 flex items-end gap-1 px-1">
                {packets.map((p, i) => (
                   <div key={i} className="flex-1 bg-primary/20 rounded-full hover:bg-primary transition-all duration-500" style={{ height: `${p}%` }}></div>
                ))}
             </div>
             <div className="flex justify-between text-[7px] font-mono text-obsidian-600 uppercase tracking-widest italic font-bold">
                <span>Load: 42.8 MB/s</span>
                <span>Latency: 0x84ms</span>
             </div>
          </div>
       </div>

       {/* BROWSER FOOTER */}
       <div className="h-12 border-t border-white/5 bg-obsidian-100 flex items-center justify-between px-12 shrink-0">
          <div className="flex items-center gap-12">
             <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_cyan]"></div>
                <span className="text-[9px] font-black text-obsidian-600 uppercase tracking-[0.4em]">Tunnel_Protocol: SECURE_AES_256</span>
             </div>
          </div>
          <p className="text-[10px] font-black text-obsidian-700 uppercase tracking-[0.5em] italic font-bold">Rounding the internet's chaos to the nearest industrial manifest.</p>
       </div>
    </div>
  );
};

export default ResearchTunnel;
