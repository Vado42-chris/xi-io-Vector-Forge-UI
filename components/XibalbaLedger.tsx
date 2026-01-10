
import React from 'react';

const XibalbaLedger: React.FC = () => {
  return (
    <div className="flex-1 bg-obsidian-950 p-12 overflow-y-auto custom-scrollbar animate-in fade-in duration-700 select-none">
      <div className="max-w-6xl mx-auto space-y-12 pb-24">
        {/* LEDGER HEADER */}
        <div className="flex justify-between items-end">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                 <div className="size-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                 <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Marketplace_Settlement_Active</span>
              </div>
              <h1 className="text-6xl font-black text-white uppercase tracking-tighter italic leading-none">Sovereign_Ledger</h1>
              <p className="text-obsidian-500 font-medium italic text-lg">Tracking historic cuts and recursive royalty maths for Seed001.</p>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-obsidian-600 uppercase tracking-widest mb-2">Cumulative_Earnings</span>
              <span className="text-5xl font-black text-primary mono tabular-nums tracking-tighter">42,850.12 CORE</span>
           </div>
        </div>

        {/* MATHS BREAKDOWN CARDS - REMOVED WHITE THEME */}
        <div className="grid grid-cols-3 gap-8">
           <div className="bg-obsidian-900/60 border border-white/5 backdrop-blur-xl rounded-[40px] p-10 space-y-8 shadow-2xl transition-all hover:border-primary/40 hover:translate-y-[-4px] duration-500">
              <span className="text-[11px] font-black text-obsidian-400 uppercase tracking-widest block border-b border-white/5 pb-4">Direct_Sales</span>
              <div className="text-4xl font-black text-obsidian-100 italic tracking-tighter">12.4K CORE</div>
              <div className="h-1.5 bg-obsidian-950 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-primary/40 w-[70%] shadow-[0_0_10px_var(--xi-accent)]"></div>
              </div>
              <p className="text-[11px] text-obsidian-500 font-medium italic leading-relaxed">Net revenue from your original manifests.</p>
           </div>

           <div className="bg-obsidian-900/60 border border-white/5 backdrop-blur-xl rounded-[40px] p-10 space-y-8 shadow-2xl transition-all hover:border-primary/40 hover:translate-y-[-4px] duration-500">
              <span className="text-[11px] font-black text-obsidian-400 uppercase tracking-widest block border-b border-white/5 pb-4">Recursive_Royalty</span>
              <div className="text-4xl font-black text-primary italic tracking-tighter">5.2K CORE</div>
              <div className="h-1.5 bg-obsidian-950 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-primary w-[30%] shadow-[0_0_10px_var(--xi-accent)]"></div>
              </div>
              <p className="text-[11px] text-obsidian-500 font-medium italic leading-relaxed">Earnings from users building on top of your open shards.</p>
           </div>

           <div className="bg-obsidian-900/60 border border-white/5 backdrop-blur-xl rounded-[40px] p-10 space-y-8 shadow-2xl transition-all hover:border-primary/40 hover:translate-y-[-4px] duration-500">
              <span className="text-[11px] font-black text-obsidian-400 uppercase tracking-widest block border-b border-white/5 pb-4">Seed001_Cut</span>
              <div className="text-4xl font-black text-obsidian-100 italic tracking-tighter">2.1K CORE</div>
              <div className="h-1.5 bg-obsidian-950 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-white/20 w-[15%]"></div>
              </div>
              <p className="text-[11px] text-obsidian-500 font-medium italic leading-relaxed">System contribution to Xibalba core nodes.</p>
           </div>
        </div>

        {/* TRANSACTION STREAM - REMOVED WHITE THEME */}
        <div className="bg-obsidian-900/40 border border-white/5 rounded-[60px] overflow-hidden shadow-2xl backdrop-blur-md">
           <div className="p-12 border-b border-white/5 flex justify-between items-center bg-black/20">
              <h3 className="text-[14px] font-black text-obsidian-300 uppercase tracking-[0.4em] italic">Historic_Flow_0x</h3>
              <button className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest underline decoration-2 underline-offset-4">Export_CSV</button>
           </div>
           <div className="divide-y divide-white/5">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="px-12 py-10 flex items-center justify-between hover:bg-white/[0.03] transition-all group">
                   <div className="flex items-center gap-8">
                      <div className="size-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-primary shadow-xl group-hover:scale-110 transition-transform">
                         <span className="material-symbols-outlined text-[28px]">receipt_long</span>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[13px] font-black text-obsidian-100 uppercase italic tracking-tight group-hover:text-primary transition-colors">Manifest_Purchase: AURORA_V2</span>
                         <span className="text-[10px] font-mono text-obsidian-500 uppercase font-bold tracking-widest opacity-60">Derivation from Root_Seed_001</span>
                      </div>
                   </div>
                   <div className="text-right flex flex-col gap-1">
                      <div className="text-[18px] font-black text-green-500 tabular-nums">+ 124.00 CORE</div>
                      <span className="text-[9px] font-mono text-obsidian-700 uppercase font-bold">0x82...{i}2A</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default XibalbaLedger;
