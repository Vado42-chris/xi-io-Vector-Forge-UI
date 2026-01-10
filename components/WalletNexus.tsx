
import React, { useState } from 'react';
import { XI_Button, XI_Telemetry } from './IndustrialPrimitives';

const WalletNexus: React.FC = () => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState(0);
  const [showStatement, setShowStatement] = useState(false);

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
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* HEADER AREA */}
        <div className="flex justify-between items-end">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-1 bg-green-500/5 border border-green-500/20 rounded-full">
                 <div className="size-1.5 rounded-full bg-green-500/40"></div>
                 <span className="text-[9px] font-black text-green-500/60 uppercase tracking-widest">Nodes_Verified</span>
              </div>
              <h1 className="text-5xl font-black text-obsidian-50 uppercase italic tracking-tighter">Wallet_Nexus</h1>
              <p className="text-obsidian-300 font-medium italic max-w-xl">
                Settling recursive design yields. All transactions are logged to the Xibalba Core Ledger.
              </p>
           </div>
           
           <div className="p-10 bg-obsidian-900 border border-white/5 rounded-xi flex flex-col items-end gap-4 shadow-2xl">
              <XI_Telemetry label="TOTAL_YIELD" value="142,850.12 CORE" />
              <XI_Button label="Withdraw_to_Vault" icon="account_balance" variant="primary" onClick={handleWithdraw} disabled={isWithdrawing} />
           </div>
        </div>

        {/* FINANCIAL FLOW - OBSIDIAN GLASS */}
        {isWithdrawing && (
          <div className="bg-obsidian-800/50 border border-white/10 rounded-xi p-12 space-y-8 animate-in zoom-in-95">
             <div className="flex justify-between text-obsidian-300 text-[10px] font-black uppercase tracking-widest">
                <span>Withdrawal_SIG: 0x84FF</span>
                <span className="text-primary italic">{Math.round((withdrawStep/4)*100)}%</span>
             </div>
             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary/60 xi-transition" style={{ width: `${(withdrawStep/4)*100}%` }}></div>
             </div>
          </div>
        )}

        {showStatement && (
          <div className="flex justify-center animate-in slide-in-from-bottom-8">
             <div className="w-96 bg-obsidian-900 border border-white/10 rounded-xi p-8 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                   <span className="text-[10px] font-black text-obsidian-400 uppercase tracking-widest">Vault_Statement</span>
                   <XI_Button label="" icon="close" variant="ghost" onClick={() => setShowStatement(false)} className="!p-1" />
                </div>
                <div className="space-y-1">
                   <span className="text-[8px] font-bold text-obsidian-500 uppercase">Available_Balance</span>
                   <div className="text-3xl font-black text-obsidian-50 italic tracking-tight">$14,285.00</div>
                </div>
                <div className="space-y-4">
                   <span className="text-[7px] font-black text-obsidian-600 uppercase tracking-widest border-b border-white/5 block pb-2">Recent_Activity</span>
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-obsidian-300">Shard_Royalty_V1</span>
                      <span className="text-green-500 font-bold">+$12.40</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-obsidian-300">Mesh_Download_Fee</span>
                      <span className="text-red-500/60">-$4.00</span>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* LEDGER STREAM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-obsidian-900/40 border border-white/5 rounded-xi p-8 space-y-6">
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.4em] italic">Yield_Telemetry</span>
              {[
                { label: 'Recursive_Cut', val: '4.2K CORE', status: '+12%' },
                { label: 'Audit_Credits', val: '0.8K CORE', status: '+2%' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-end border-b border-white/5 pb-4">
                   <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-black text-obsidian-100 uppercase tracking-tight">{item.label}</span>
                      <span className="text-[14px] font-black text-obsidian-400 italic">{item.val}</span>
                   </div>
                   <span className="text-[9px] font-black text-green-500/60">{item.status}</span>
                </div>
              ))}
           </div>
           
           <div className="bg-obsidian-900/40 border border-white/5 rounded-xi p-8 flex flex-col items-center justify-center text-center gap-6">
              <span className="material-symbols-outlined !text-[48px] text-obsidian-700">school</span>
              <div className="space-y-2">
                 <h4 className="text-xl font-black text-obsidian-200 uppercase italic">Sovereign_Scholar</h4>
                 <p className="text-[10px] text-obsidian-500 leading-relaxed italic px-8">
                    Increase your passive yield by sharing your #HallbergMaths logic shards with the community.
                 </p>
              </div>
              <XI_Button label="Manage_Lessons" variant="obsidian" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default WalletNexus;
