
import React, { useState, useEffect } from 'react';

const GlobalBrowser: React.FC = () => {
  const [url, setUrl] = useState('https://xibalba.forge/research/industrial-patterns');
  const [isScraping, setIsScraping] = useState(false);
  const [packets, setPackets] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPackets(prev => [...prev, Math.random() * 100].slice(-32));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const startScrape = () => {
    setIsScraping(true);
    setTimeout(() => setIsScraping(false), 3000);
  };

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-1000">
       {/* RESEARCH TUNNEL CHROME */}
       <div className="h-24 border-b border-white/5 bg-obsidian-100 flex items-center px-12 gap-16 shrink-0 shadow-2xl relative z-10">
          <div className="flex items-center gap-4">
             <div className="size-5 rounded-full bg-red-500/20 hover:bg-red-500 transition-all cursor-pointer shadow-inner"></div>
             <div className="size-5 rounded-full bg-amber-500/20 hover:bg-amber-500 transition-all cursor-pointer shadow-inner"></div>
             <div className="size-5 rounded-full bg-green-500/20 hover:bg-green-500 transition-all cursor-pointer shadow-inner"></div>
          </div>
          
          <div className="flex-1 bg-black/60 border-2 border-white/5 rounded-3xl h-14 flex items-center px-8 gap-8 group focus-within:ring-4 focus-within:ring-primary/20 transition-all shadow-inner relative overflow-hidden">
             <div className="absolute inset-0 bg-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
             <span className="material-symbols-outlined text-obsidian-600 text-[28px] group-hover:text-primary transition-colors animate-pulse relative z-10">vpn_lock</span>
             <input 
                type="text" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-transparent border-none text-[15px] font-mono text-white/90 outline-none tracking-tighter relative z-10"
             />
             <div className="flex gap-8 items-center relative z-10">
                <div className="h-8 w-px bg-white/10"></div>
                <span className="material-symbols-outlined text-obsidian-600 text-[24px] hover:text-white cursor-pointer transition-all">star</span>
                <span className="material-symbols-outlined text-obsidian-600 text-[24px] hover:text-white cursor-pointer transition-all">refresh</span>
             </div>
          </div>

          <div className="flex items-center gap-16">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono text-obsidian-600 uppercase tracking-[0.3em] italic">Protocol_Mode</span>
                <span className="text-[16px] font-black text-green-500 uppercase tracking-[0.3em] italic leading-none">Research_Tunnel_V8</span>
             </div>
             <button 
               onClick={startScrape}
               disabled={isScraping}
               className="h-14 px-12 bg-primary text-white rounded-3xl text-[12px] font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(255,152,0,0.3)] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-6 group overflow-hidden relative"
             >
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="material-symbols-outlined text-[24px] group-hover:rotate-180 transition-transform relative z-10">biotech</span>
                <span className="relative z-10">{isScraping ? 'Sniffing_Logic...' : 'Scrape_Component_DNA'}</span>
             </button>
          </div>
       </div>

       {/* BROWSER VIEWPORT (RESEARCH HUB) */}
       <div className="flex-1 bg-obsidian-300 relative overflow-hidden flex items-center justify-center p-24">
          <div className="absolute inset-0 canvas-grid opacity-[0.15] pointer-events-none"></div>
          
          {/* PACKET ANALYZER HUD (TOP RIGHT) */}
          <div className="absolute top-12 right-12 p-10 bg-obsidian-100/60 backdrop-blur-3xl rounded-[48px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] space-y-8 w-96 group hover:bg-obsidian-100 transition-all">
             <div className="flex justify-between items-center">
                <span className="text-[11px] font-black text-primary uppercase tracking-[0.5em]">Packet_Manifest_Live</span>
                <div className="size-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_green]"></div>
             </div>
             <div className="h-24 flex items-end gap-1.5 px-1">
                {packets.map((p, i) => (
                   <div key={i} className="flex-1 bg-primary/20 rounded-full hover:bg-primary transition-all duration-500" style={{ height: `${p}%` }}></div>
                ))}
             </div>
             <div className="flex justify-between text-[8px] font-mono text-obsidian-600 uppercase tracking-widest italic font-bold">
                <span>Ingress: 42.8 MB/s</span>
                <span>Wait: 0x84ms</span>
             </div>
          </div>

          {/* MAIN RESEARCH INTERFACE */}
          <div className="text-center space-y-16 max-w-5xl animate-in zoom-in-95 duration-1000 relative z-10">
             <div className="relative group mx-auto w-fit">
                <div className="absolute -inset-32 bg-primary/10 blur-[180px] rounded-full animate-pulse group-hover:bg-primary/20 transition-all duration-1000"></div>
                <div className="size-72 rounded-[80px] border-4 border-white/5 bg-black/50 flex items-center justify-center relative z-10 shadow-inner group-hover:rotate-12 transition-transform duration-1000 group-hover:border-primary/20">
                   <span className="material-symbols-outlined text-[180px] text-white/5 group-hover:text-primary/40 transition-all duration-1000 font-black">public</span>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[64px] text-primary animate-pulse font-black">search</span>
                   </div>
                </div>
             </div>
             <div className="space-y-8">
                <h3 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-tight">Tunnel_Connection_Active</h3>
                <p className="text-3xl text-obsidian-500 font-medium italic leading-relaxed max-w-3xl mx-auto">
                   "We are pattern-matching external components against #HallbergMaths signatures. DNA extraction is ready."
                </p>
             </div>
             <div className="flex gap-10 justify-center">
                {['Github_Nexus', 'React_Aura_Scraper', 'Tailwind_Grid_Audit', 'AWS_Compute_Bridge'].map(t => (
                  <button key={t} className="px-12 py-6 bg-black/60 border-2 border-white/5 rounded-[40px] text-[12px] font-black text-obsidian-500 uppercase tracking-[0.3em] hover:border-primary/40 hover:text-white transition-all shadow-2xl hover:bg-primary/5 active:scale-95 group">
                     <span className="group-hover:text-primary transition-colors">{t}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* SCRAPING OVERLAY (SCANNING PROTOCOL) */}
          {isScraping && (
             <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl z-[500] flex flex-col items-center justify-center animate-in fade-in duration-500">
                <div className="relative">
                   <div className="size-[400px] rounded-full border-[10px] border-primary/10 border-t-primary animate-spin"></div>
                   <div className="absolute inset-10 rounded-full border-[10px] border-primary/5 border-b-primary animate-[spin_2s_linear_infinite_reverse]"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-4">
                         <span className="material-symbols-outlined text-[100px] text-primary animate-pulse font-black">biotech</span>
                         <span className="text-4xl font-black text-white italic tabular-nums tracking-widest">{Math.round(Math.random()*100)}%</span>
                      </div>
                   </div>
                </div>
                <div className="mt-20 flex flex-col items-center gap-8 text-center">
                   <span className="text-5xl font-black text-white uppercase tracking-[0.5em] italic">De-Compiling_External_DNA</span>
                   <div className="flex items-center gap-6 bg-primary/10 px-10 py-4 rounded-3xl border-2 border-primary/20 shadow-[0_0_50px_rgba(255,152,0,0.2)]">
                      <div className="size-3 rounded-full bg-primary animate-ping shadow-[0_0_15px_orange]"></div>
                      <span className="text-[14px] font-mono text-primary uppercase tracking-[0.6em] font-bold">Logic_Extraction_Mode: ACTIVE</span>
                   </div>
                </div>
                <div className="mt-16 text-obsidian-600 font-mono text-[12px] uppercase italic animate-pulse tracking-[0.3em]">"Identifying #HallbergMaths signatures in open-source manifest..."</div>
             </div>
          )}

          {/* BRIDGING HUD FOOTER */}
          <div className="absolute bottom-12 right-12">
             <div className="p-12 bg-obsidian-100/95 backdrop-blur-3xl rounded-[60px] border border-white/10 shadow-[0_60px_150px_rgba(0,0,0,1)] flex items-center gap-12 group cursor-default transition-all hover:border-primary/20">
                <div className="size-20 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary shadow-inner transition-all group-hover:scale-110 group-hover:rotate-[15deg]">
                   <span className="material-symbols-outlined text-[48px]">network_ping</span>
                </div>
                <div className="flex flex-col gap-3">
                   <span className="text-[15px] font-black text-white uppercase tracking-tight italic leading-none">Tunnel_Latency</span>
                   <span className="text-[10px] font-mono text-obsidian-600 uppercase italic font-bold">0x84ms // Encrypted_Mainnet_Bridge</span>
                </div>
                <div className="w-px h-16 bg-white/5 mx-4"></div>
                <div className="flex gap-1.5 items-end h-12">
                   {[40, 90, 100, 60, 85, 70, 100, 50, 90].map((h, i) => (
                     <div key={i} className="w-2.5 bg-primary/20 rounded-full animate-pulse hover:bg-primary transition-all duration-300" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}></div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default GlobalBrowser;
