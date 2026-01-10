
import React from 'react';

const WorkTrackingPanel: React.FC = () => {
  const sessions = [
    { id: 's-42', name: 'VECTOR_FORGE_A', duration: '2h 14m', yield: '142 CORE', sig: 'VERIFIED' },
    { id: 's-88', name: 'KINETIC_SOLVE_X', duration: '0h 42m', yield: '88 CORE', sig: 'PENDING' }
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
       <div className="p-6 bg-obsidian-900 border border-white/5 rounded-xi shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform">
             <span className="material-symbols-outlined text-[100px]">history_edu</span>
          </div>
          <div className="space-y-1 relative z-10">
             <span className="text-[12px] font-black text-white italic tabular-nums leading-none tracking-tighter">14,285.00 CORE</span>
             <p className="text-[8px] font-black text-obsidian-600 uppercase tracking-widest">Total_Session_Earnings</p>
          </div>
       </div>

       <div className="space-y-4">
          <span className="text-[9px] font-black text-obsidian-400 uppercase tracking-widest px-1 italic">Immutability_Ledger</span>
          <div className="space-y-2">
             {sessions.map(s => (
               <div key={s.id} className="p-4 bg-black/40 border border-white/5 rounded-xi flex items-center justify-between hover:bg-white/[0.02] transition-all cursor-help">
                  <div className="flex items-center gap-4">
                     <div className="size-8 rounded-lg bg-obsidian-800 border border-white/5 flex items-center justify-center text-obsidian-500">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-obsidian-100 uppercase italic">{s.name}</span>
                        <span className="text-[7px] font-mono text-obsidian-600 uppercase">{s.duration} // {s.yield}</span>
                     </div>
                  </div>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${s.sig === 'VERIFIED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'}`}>
                    {s.sig}
                  </span>
               </div>
             ))}
          </div>
       </div>

       <div className="mt-auto p-6 bg-primary/5 border border-primary/10 rounded-xi italic text-[11px] text-obsidian-500 leading-relaxed">
          "All work shards are digitally signed and hashed via the 0x84 protocol. Tampering with session records results in immediate ledger exclusion."
       </div>
    </div>
  );
};

export default WorkTrackingPanel;
