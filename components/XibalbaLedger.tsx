
import React from 'react';

const XibalbaLedger: React.FC = () => {
  return (
    <div className="flex-1 bg-obsidian-200 p-12 overflow-y-auto custom-scrollbar animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* LEDGER HEADER */}
        <div className="flex justify-between items-end">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                 <div className="size-1.5 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Marketplace_Settlement_Active</span>
              </div>
              <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">Sovereign_Ledger</h1>
              <p className="text-obsidian-500 font-medium italic">Tracking historic cuts and recursive royalty maths for Seed001.</p>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-obsidian-600 uppercase tracking-widest mb-2">Cumulative_Earnings</span>
              <span className="text-4xl font-black text-primary mono tabular-nums">42,850.12 CORE</span>
           </div>
        </div>

        {/* MATHS BREAKDOWN CARDS */}
        <div className="grid grid-cols-3 gap-8">
           <div className="bg-obsidian-100 border border-white/5 rounded-[32px] p-8 space-y-6 shadow-2xl">
              <span className="text-[10px] font-black text-obsidian-600 uppercase tracking-widest">Direct_Sales</span>
              <div className="text-3xl font-black text-white italic">12.4K CORE</div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-primary w-[70%]"></div>
              </div>
              <p className="text-[9px] text-obsidian-500 italic">Net revenue from your original manifests.</p>
           </div>
           <div className="bg-obsidian-100 border border-white/5 rounded-[32px] p-8 space-y-6 shadow-2xl">
              <span className="text-[10px] font-black text-obsidian-600 uppercase tracking-widest">Recursive_Royalty</span>
              <div className="text-3xl font-black text-amber-500 italic">5.2K CORE</div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-amber-500 w-[30%]"></div>
              </div>
              <p className="text-[9px] text-obsidian-500 italic">Earnings from users building on top of your open shards.</p>
           </div>
           <div className="bg-obsidian-100 border border-white/5 rounded-[32px] p-8 space-y-6 shadow-2xl">
              <span className="text-[10px] font-black text-obsidian-600 uppercase tracking-widest">Seed001_Cut</span>
              <div className="text-3xl font-black text-obsidian-700 italic">2.1K CORE</div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-obsidian-700 w-[15%]"></div>
              </div>
              <p className="text-[9px] text-obsidian-500 italic">System contribution to Xibalba core nodes.</p>
           </div>
        </div>

        {/* TRANSACTION STREAM */}
        <div className="bg-obsidian-100 border border-white/10 rounded-[32px] overflow-hidden">
           <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-[12px] font-black text-white uppercase tracking-[0.3em]">Historic_Flow_0x</h3>
              <button className="text-[9px] font-black text-primary uppercase">Export_CSV</button>
           </div>
           <div className="divide-y divide-white/5">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="size-10 rounded-xl bg-black flex items-center justify-center text-primary border border-white/5">
                         <span className="material-symbols-outlined">receipt_long</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[11px] font-black text-white uppercase tracking-tight italic">Manifest_Purchase: AURORA_V2</span>
                         <span className="text-[8px] font-mono text-obsidian-600 uppercase">Derivation from Root_Seed_001</span>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-[12px] font-black text-green-500 tabular-nums">+ 124.00 CORE</div>
                      <span className="text-[7px] font-mono text-obsidian-700">0x82...{i}2A</span>
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
