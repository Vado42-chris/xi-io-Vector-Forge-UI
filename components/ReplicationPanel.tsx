
import React from 'react';

const ReplicationPanel: React.FC = () => {
  const instances = [
    { id: 'i-84', label: 'PRIMARY_SHELL', type: 'CORE', load: 12 },
    { id: 'i-91', label: 'VFX_DETACHED_01', type: 'SHARD', load: 45 },
    { id: 'i-02', label: 'ROSETTA_BRIDGE', type: 'LOGIC', load: 8 }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-1">
         <span className="text-[10px] font-black text-obsidian-400 uppercase tracking-widest">Active_Instances</span>
         <span className="text-[9px] font-mono text-primary font-bold">0x03_LOADED</span>
      </div>

      <div className="space-y-2">
        {instances.map(inst => (
          <div key={inst.id} className="p-4 bg-obsidian-900 border border-white/5 rounded-xi group hover:border-primary/30 transition-all cursor-default">
             <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                   <span className="text-[11px] font-black text-white uppercase italic tracking-tight group-hover:text-primary transition-colors">{inst.label}</span>
                   <span className="text-[7px] font-mono text-obsidian-600 uppercase tracking-widest">{inst.id} // {inst.type}</span>
                </div>
                <div className="size-2 rounded-full bg-green-500 shadow-[0_0_10px_green]"></div>
             </div>
             <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[7px] font-black text-obsidian-500">
                   <span>RESOURCE_UTILIZATION</span>
                   <span>{inst.load}%</span>
                </div>
                <div className="h-1 bg-black rounded-full overflow-hidden">
                   <div className="h-full bg-primary/40 transition-all duration-1000" style={{ width: `${inst.load}%` }}></div>
                </div>
             </div>
          </div>
        ))}
      </div>

      <button className="w-full py-4 border border-dashed border-white/10 rounded-xi text-[9px] font-black text-obsidian-500 uppercase tracking-widest hover:border-primary/40 hover:text-white transition-all bg-black/20">
        Clone_Kernel_Protocol
      </button>
    </div>
  );
};

export default ReplicationPanel;
