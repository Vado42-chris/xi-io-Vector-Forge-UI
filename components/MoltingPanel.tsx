
import React, { useState } from 'react';
import { XI_Button, XI_Telemetry } from './IndustrialPrimitives';

const MoltingPanel: React.FC = () => {
  const [isMolting, setIsMolting] = useState(false);
  const [logs, setLogs] = useState([
    { id: 'm1', timestamp: '14:20:01', action: 'CORE_MUTATION_INIT', status: 'SUCCESS' },
    { id: 'm2', timestamp: '14:25:42', action: 'Z_STACK_REFACTOR', status: 'SUCCESS' }
  ]);

  const handleMolt = () => {
    setIsMolting(true);
    setTimeout(() => {
      setLogs([{ id: Date.now().toString(), timestamp: new Date().toLocaleTimeString(), action: 'RECURSIVE_SHELL_EVOLUTION', status: 'SUCCESS' }, ...logs]);
      setIsMolting(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="p-5 bg-primary/5 border border-primary/20 rounded-xi space-y-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-sm animate-pulse">cached</span>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">MOLTING_SERVICE_v8</span>
        </div>
        <p className="text-[11px] text-obsidian-400 italic leading-relaxed">
          Initiate a self-modification cycle. The engine will refactor its own UI Chassis logic based on active usage patterns.
        </p>
        <XI_Button 
          label={isMolting ? "Evolving_Source..." : "Trigger_Mutation"} 
          variant="primary" 
          onClick={handleMolt} 
          loading={isMolting}
          className="w-full h-11"
        />
      </div>

      <div className="space-y-3">
        <span className="text-[8px] font-black text-obsidian-600 uppercase tracking-widest px-1">Mutation_History</span>
        <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-2">
          {logs.map(log => (
            <div key={log.id} className="p-3 bg-black/40 border border-white/5 rounded flex justify-between items-center group hover:border-primary/20 transition-all">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-obsidian-200 uppercase">{log.action}</span>
                <span className="text-[7px] font-mono text-obsidian-600 uppercase italic">{log.timestamp}</span>
              </div>
              <span className="text-[8px] font-black text-green-500/60 uppercase">{log.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
         <div className="p-4 bg-obsidian-900 border border-white/5 rounded-xi text-center">
            <span className="text-[7px] font-black text-obsidian-600 uppercase block mb-1">Code_Drift</span>
            <span className="text-[14px] font-black text-primary italic tabular-nums">0.02%</span>
         </div>
         <div className="p-4 bg-obsidian-900 border border-white/5 rounded-xi text-center">
            <span className="text-[7px] font-black text-obsidian-600 uppercase block mb-1">Stability</span>
            <span className="text-[14px] font-black text-green-500 italic tabular-nums">99.8%</span>
         </div>
      </div>
    </div>
  );
};

export default MoltingPanel;
