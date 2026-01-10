
import React, { useState } from 'react';
import { XI_Button, XI_Telemetry } from './IndustrialPrimitives';
import { requestBTCSettlement } from '../services/kernelBridge';

const WalletNexus: React.FC = () => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState(0);
  const [showStatement, setShowStatement] = useState(false);
  const [btcMode, setBtcMode] = useState(false);
  const [btcAddress, setBtcAddress] = useState('');
  const [settlementResult, setSettlementResult] = useState<any>(null);
  const [activeDossierTab, setActiveDossierTab] = useState<'LEDGER' | 'PROVIDENCE' | 'MARKET_SALES'>('LEDGER');

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setWithdrawStep(step);
      if (step >= 4) {
        clearInterval(interval);
        setTimeout(() => {
          setIsWithdrawing(false);
          setShowStatement(true);
        }, 800);
      }
    }, 800);
  };

  return (
    <div className="flex-1 bg-obsidian-950 p-12 overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-16 pb-48">
        
        {/* HEADER AREA */}
        <div className="flex justify-between items-end">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-1 bg-green-500/5 border border-green-500/20 rounded-full">
                 <div className="size-1.5 rounded-full bg-green-500/40"></div>
                 <span className="text-[9px] font-black text-green-500/60 uppercase tracking-widest">Nodes_Verified</span>
              </div>
              <h1 className="text-6xl font-black text-obsidian-50 uppercase italic tracking-tighter leading-none">Wallet_Nexus</h1>
              <p className="text-obsidian-300 font-medium italic max-w-xl text-lg">
                Settling recursive design yields. All transactions are logged to the Xibalba Core Ledger via #Hallberg signatures.
              </p>
           </div>
           
           <div className="p-12 bg-obsidian-900 border border-white/5 rounded-[40px] flex flex-col items-end gap-6 shadow-2xl">
              <XI_Telemetry label="TOTAL_YIELD" value="142,850.12 CORE" />
              <div className="flex gap-4">
                 <button 
                  onClick={() => setBtcMode(!btcMode)}
                  className={`h-14 px-8 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${btcMode ? 'bg-amber-500 text-black border-amber-400 shadow-xl' : 'bg-obsidian-850 text-obsidian-400 border-white/10 hover:border-amber-500/40'}`}
                 >
                   <span className="flex items-center gap-4">
                     <span className="material-symbols-outlined text-[24px]">currency_bitcoin</span>
                     Bitcoin_Bridge
                   </span>
                 </button>
                 <XI_Button label="Withdraw_to_Vault" icon="account_balance" variant="primary" size="md" onClick={handleWithdraw} disabled={isWithdrawing} className="h-14 !rounded-2xl" />
              </div>
           </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex bg-obsidian-900/50 p-1.5 rounded-2xl border border-white/5 w-fit shadow-inner">
           {(['LEDGER', 'PROVIDENCE', 'MARKET_SALES'] as const).map(tab => (
              <button 
                 key={tab} 
                 onClick={() => setActiveDossierTab(tab)}
                 className={`px-12 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeDossierTab === tab ? 'bg-primary text-black shadow-xl' : 'text-obsidian-400 hover:text-white'}`}
              >
                 {tab === 'PROVIDENCE' ? 'Providence_Tree' : tab === 'MARKET_SALES' ? 'Exchange_History' : 'Settlement_Ledger'}
              </button>
           ))}
        </div>

        {activeDossierTab === 'PROVIDENCE' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-500">
             <div className="bg-obsidian-900 border border-white/5 rounded-[60px] p-16 space-y-16 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-16 opacity-[0.03]">
                   <span className="material-symbols-outlined text-[350px] text-white">account_tree</span>
                </div>
                
                <div className="space-y-6 relative z-10">
                   <span className="text-[12px] font-black text-primary uppercase tracking-[0.6em] italic border-b border-primary/20 pb-6 block">Providence_Derivation_Heritage</span>
                   <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">The_Hashtag_Tree</h3>
                   <p className="text-xl text-obsidian-400 max-w-3xl italic">"Tracing the genetics of your current Project Manifest. Every forked shard carries the #Signature of its root architect."</p>
                </div>

                <div className="relative h-[400px] flex items-center justify-center z-10">
                   <svg className="absolute inset-0 size-full pointer-events-none opacity-20">
                      <path d="M 500,50 L 500,150 M 500,150 L 300,250 M 500,150 L 700,250" stroke="#b8860b" strokeWidth="2.5" fill="none" strokeDasharray="10 5" />
                   </svg>
                   <div className="flex flex-col items-center gap-20">
                      <div className="p-8 bg-primary/20 border-2 border-primary rounded-[32px] text-center shadow-xl group hover:scale-105 transition-all">
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">ROOT_ORIGIN</span>
                         <span className="text-2xl font-black text-white uppercase italic tracking-tighter">#Hallberg_Core_v8</span>
                      </div>
                      <div className="flex gap-40">
                         <div className="p-6 bg-cyan-500/10 border-2 border-cyan-500/40 rounded-[24px] text-center shadow-2xl group hover:scale-105 transition-all">
                            <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest block mb-2">DERIVATION_01</span>
                            <span className="text-[16px] font-black text-white uppercase italic">#Kinetic_Melt_0x</span>
                         </div>
                         <div className="p-6 bg-obsidian-100 border-2 border-white/10 rounded-[24px] text-center shadow-2xl group hover:scale-105 transition-all">
                            <span className="text-[8px] font-black text-obsidian-400 uppercase tracking-widest block mb-2">LOCAL_MODIFICATION</span>
                            <span className="text-[16px] font-black text-white uppercase italic">#Your_Studio_ZR1</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeDossierTab === 'MARKET_SALES' && (
           <div className="bg-obsidian-900 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl animate-in fade-in duration-300">
              <div className="p-12 border-b border-white/10 flex justify-between items-center bg-black/20">
                 <h3 className="text-2xl font-black text-white uppercase italic italic">Forge_Exchange_Sales</h3>
                 <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-widest italic">SETTLEMENT_STATUS: NOMINAL</span>
              </div>
              <div className="divide-y divide-white/5">
                 {[
                   { name: 'Aurora_Shader_v2', type: 'SALE', yield: '+1,200', date: '2h ago', buyer: 'OPERATOR_0x82' },
                   { name: 'Kernel_Automata', type: 'ROYALTY', yield: '+42', date: '4h ago', buyer: 'DERIVATION_X' },
                   { name: 'Chassis_Mesh', type: 'SALE', yield: '+8,000', date: '1d ago', buyer: 'STUDIO_PEER' },
                 ].map((sale, i) => (
                   <div key={i} className="p-10 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                      <div className="flex items-center gap-8">
                         <div className="size-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                            <span className="material-symbols-outlined text-[28px]">{sale.type === 'SALE' ? 'shopping_cart' : 'auto_fix_high'}</span>
                         </div>
                         <div className="flex flex-col gap-1">
                            <span className="text-[18px] font-black text-white uppercase italic">{sale.name}</span>
                            <span className="text-[8px] font-mono text-obsidian-600 uppercase font-bold tracking-widest">{sale.type} // FROM: {sale.buyer}</span>
                         </div>
                      </div>
                      <div className="text-right flex flex-col gap-1">
                         <span className="text-[24px] font-black text-green-500 tabular-nums italic">{sale.yield} CORE</span>
                         <span className="text-[8px] font-mono text-obsidian-700 uppercase">{sale.date}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {activeDossierTab === 'LEDGER' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in">
               <div className="bg-obsidian-900 border border-white/5 rounded-[40px] p-12 space-y-8 shadow-2xl">
                  <span className="text-[11px] font-black text-primary/60 uppercase tracking-[0.4em] italic border-b border-white/5 pb-6 block">Yield_Telemetry</span>
                  {[
                    { label: 'Recursive_Cut', val: '4.2K CORE', status: '+12%' },
                    { label: 'Audit_Credits', val: '0.8K CORE', status: '+2%' },
                    { label: 'Mining_Uplink_Revenue', val: '2.4K CORE', status: '+8%' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-end border-b border-white/5 pb-8 group">
                       <div className="flex flex-col gap-1">
                          <span className="text-[14px] font-black text-obsidian-100 uppercase tracking-tight group-hover:text-primary transition-colors">{item.label}</span>
                          <span className="text-[20px] font-black text-obsidian-400 italic tabular-nums">{item.val}</span>
                       </div>
                       <span className="text-[11px] font-black text-green-500/60 tabular-nums">{item.status}</span>
                    </div>
                  ))}
               </div>
               
               <div className="bg-obsidian-900 border border-white/5 rounded-[40px] p-12 flex flex-col items-center justify-center text-center gap-10 shadow-2xl">
                  <div className="size-24 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                     <span className="material-symbols-outlined !text-[64px]">school</span>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-3xl font-black text-obsidian-200 uppercase italic tracking-tighter">Sovereign_Scholar_Yield</h4>
                     <p className="text-[13px] text-obsidian-500 leading-relaxed italic px-12 uppercase font-bold tracking-tight">
                        You have earned **2.4K CORE** this session by teaching #HallbergMaths logic shards to the swarm.
                     </p>
                  </div>
                  <button className="h-14 px-12 bg-white/5 hover:bg-primary hover:text-black border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all">
                    MANAGE_LESSONS
                  </button>
               </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default WalletNexus;
