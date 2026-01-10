
import React, { useState } from 'react';
import { CloudPackage } from '../types';

const ForgeExchange: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BROWSE' | 'MY_SHARDS' | 'EARNINGS'>('BROWSE');

  const trendingShards: CloudPackage[] = [
    { id: 'sh-1', name: 'GLITCH_INDUSTRIAL_VFX', description: 'Heavy temporal noise patterns for flux-based layouts.', type: 'shader', size: '1.2MB', author: 'Xibalba_Foundry', stability: 'STABLE', category: 'THEME', price: 1200 },
    { id: 'sh-2', name: 'IK_SKELETON_SOLVER_PRO', description: 'Advanced inverse kinematics for 10-body rigs.', type: 'logic_kernel', size: '240KB', author: 'Logic_Lord', stability: 'STABLE', category: 'EXTENSION', price: 4500 },
    { id: 'sh-3', name: 'NEON_PATH_SNIPPER', description: 'One-click conversion of images to math-clean SVGs.', type: 'script', size: '42KB', author: 'Neural_Sniff', stability: 'BETA', category: 'PLUGIN', price: 8200 },
  ];

  return (
    <div className="flex-1 bg-obsidian-200 flex flex-col overflow-hidden animate-in fade-in duration-1000">
       {/* EXCHANGE HEADER */}
       <div className="h-20 border-b border-white/5 bg-obsidian-100 flex items-center px-12 gap-16 shrink-0 shadow-2xl relative z-10">
          <div className="flex items-center gap-8">
             <div className="size-12 rounded-[20px] bg-primary flex items-center justify-center text-white shadow-[0_0_40px_rgba(255,152,0,0.4)] relative group cursor-pointer active:scale-95 transition-all">
                <span className="material-symbols-outlined text-[32px] font-black group-hover:rotate-12 transition-transform">currency_exchange</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[18px] font-black text-white uppercase italic tracking-tighter leading-none">Forge_Exchange</span>
                <span className="text-[8px] font-mono text-obsidian-600 uppercase tracking-[0.4em] mt-1">Sovereign_Economic_Nexus // CORE_Mainnet</span>
             </div>
          </div>

          <div className="flex bg-black/60 p-1 rounded-[20px] border border-white/5 shadow-inner">
             {['BROWSE', 'MY_SHARDS', 'EARNINGS'].map(tab => (
               <button 
                 key={tab} 
                 onClick={() => setActiveTab(tab as any)}
                 className={`px-8 py-2.5 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-obsidian-500 hover:text-white'}`}
               >
                 {tab.replace('_', ' ')}
               </button>
             ))}
          </div>

          <div className="ml-auto flex items-center gap-10">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono text-obsidian-600 uppercase tracking-widest">Active_Yield</span>
                <span className="text-[20px] font-black text-green-500 italic tabular-nums leading-none">+12.4K CORE</span>
             </div>
             <button className="h-12 px-10 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-xl active:scale-95">
                Withdraw_Fiat
             </button>
          </div>
       </div>

       {/* MAIN CONTENT GRID */}
       <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-obsidian-300">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 max-w-[1800px] mx-auto">
             {/* LEFT COLUMN: TRENDING */}
             <div className="xl:col-span-2 space-y-12">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Verified_Manifest_Drops</h3>
                   <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Audit_Protocol: #Hallberg_Maths</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {trendingShards.map(shard => (
                     <div key={shard.id} className="group bg-obsidian-100 border border-white/5 rounded-[48px] p-10 flex flex-col gap-8 hover:border-primary/40 transition-all shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-125 transition-transform duration-[2000ms]">
                           <span className="material-symbols-outlined text-[180px]">{shard.category === 'THEME' ? 'palette' : 'hub'}</span>
                        </div>
                        
                        <div className="flex justify-between items-start relative z-10">
                           <div className="size-16 rounded-[28px] bg-black/40 border border-white/10 flex items-center justify-center text-primary shadow-inner">
                              <span className="material-symbols-outlined text-[32px]">{shard.category === 'PLUGIN' ? 'bolt' : 'inventory_2'}</span>
                           </div>
                           <div className="flex flex-col items-end gap-2">
                              <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                                 <span className="material-symbols-outlined text-[14px] text-green-500">verified</span>
                                 <span className="text-[8px] font-black text-green-500 uppercase">Math_Valid</span>
                              </div>
                              <span className="text-[9px] font-mono text-obsidian-600 uppercase tracking-widest">{shard.size} // {shard.author}</span>
                           </div>
                        </div>

                        <div className="space-y-3 relative z-10">
                           <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors">{shard.name}</h4>
                           <p className="text-[13px] text-obsidian-500 italic leading-relaxed line-clamp-2">"{shard.description}"</p>
                        </div>

                        <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
                           <div className="flex flex-col">
                              <span className="text-[9px] font-black text-obsidian-600 uppercase">License_CORE</span>
                              <span className="text-2xl font-black text-white italic tabular-nums">{shard.price?.toLocaleString()}</span>
                           </div>
                           <button className="px-10 py-4 bg-primary text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                              Inject_to_Kernel
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* RIGHT COLUMN: RECURSIVE REVENUE HUD */}
             <div className="space-y-12">
                <div className="bg-black/40 border-2 border-white/5 rounded-[60px] p-12 space-y-12 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
                      <span className="material-symbols-outlined text-[120px] text-primary">analytics</span>
                   </div>
                   
                   <div className="space-y-2 relative z-10">
                      <span className="text-[11px] font-black text-primary uppercase tracking-[0.5em]">Global_Sales_Telemetry</span>
                      <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Market_Sentiment</h3>
                   </div>

                   <div className="space-y-8 relative z-10">
                      {[
                        { label: 'RECURSIVE_ROYALTIES', val: '4,285 CORE', delta: '+12%' },
                        { label: 'AUDIT_CREDITS', val: '1,200 CORE', delta: '+4%' },
                        { label: 'CONCIERGE_YIELD', val: '8,400 CORE', delta: '+22%' },
                      ].map(stat => (
                        <div key={stat.label} className="flex justify-between items-end group/item">
                           <div className="flex flex-col gap-1">
                              <span className="text-[11px] font-black text-white uppercase tracking-widest group-hover/item:text-primary transition-colors">{stat.label}</span>
                              <span className="text-[18px] font-black italic tabular-nums text-white/40">{stat.val}</span>
                           </div>
                           <span className="text-[10px] font-black text-green-500 uppercase tracking-widest tabular-nums">{stat.delta}</span>
                        </div>
                      ))}
                   </div>

                   <div className="p-8 bg-primary/5 border border-primary/20 rounded-[40px] italic text-[13px] text-obsidian-500 leading-relaxed relative z-10">
                      "Teach a user good UX design and you build a self-sustaining economy where curiosity is the currency."
                   </div>
                </div>

                <div className="bg-obsidian-100 border border-white/10 rounded-[60px] p-12 flex flex-col items-center text-center gap-10 group cursor-pointer hover:bg-obsidian-400 transition-all active:scale-95 shadow-2xl">
                   <div className="size-24 rounded-[32px] bg-white/5 flex items-center justify-center text-obsidian-600 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                      <span className="material-symbols-outlined text-[48px] font-black">add_business</span>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">Forge_New_Revenue</h4>
                      <p className="text-[12px] text-obsidian-500 leading-relaxed font-bold uppercase tracking-widest italic">
                         Convert your Manifest components into sellable shards. Concierge AI will audit your logic for a 2% cut.
                      </p>
                   </div>
                   <button className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[32px] text-[11px] font-black uppercase tracking-[0.5em] text-white transition-all">
                      Start_Listing_0x
                   </button>
                </div>
             </div>
          </div>
       </div>

       {/* MARKET FOOTER */}
       <div className="h-12 border-t border-white/5 bg-obsidian-100 flex items-center justify-between px-12 shrink-0">
          <div className="flex items-center gap-12">
             <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_green]"></div>
                <span className="text-[9px] font-black text-obsidian-600 uppercase tracking-[0.4em]">Settlement_Nodes: 42_ACTIVE</span>
             </div>
             <div className="h-4 w-px bg-white/5"></div>
             <span className="text-[9px] font-mono text-obsidian-700 italic font-bold tracking-widest">Rounding user greed to the nearest valid transaction.</span>
          </div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">XIBALBA_FOUNDRY // GLOBAL_EXCHANGE_V.0.8</p>
       </div>
    </div>
  );
};

export default ForgeExchange;
