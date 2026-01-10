
import React, { useState } from 'react';

const MCPRegistry: React.FC = () => {
  const [servers, setServers] = useState([
    { id: 'srv-1', label: 'Local File System', name: 'FS_BRIDGE_01', status: 'connected', type: 'LOCAL', multiplier: '1.2x', desc: 'Secure direct access to your local SVG assets and design manifest files.' },
    { id: 'srv-2', label: 'Web Knowledge Base', name: 'GOOGLE_GROUNDING_V4', status: 'connected', type: 'REMOTE', multiplier: '2.5x', desc: 'Connects the AI to real-time search data so it understands current market design trends.' },
    { id: 'srv-3', label: 'Terminal Automation', name: 'SHELL_TUNNEL_0x', status: 'standby', type: 'LOCAL', multiplier: '4.0x', desc: 'Allows the AI to execute terminal commands, run build scripts, and deploy to staging.' },
    { id: 'srv-4', label: 'Mainnet Market Sync', name: 'CORE_SETTLEMENT_BUS', status: 'connected', type: 'PROTOCOL', multiplier: '1.8x', desc: 'Syncs your licensing revenue and credit balances from the global Forge exchange.' },
    { id: 'srv-5', label: 'Asset Cloud Sniffer', name: 'GITHUB_NEXUS_SYNC', status: 'standby', type: 'REMOTE', multiplier: '0.8x', desc: 'Monitors external repositories for relevant design components to suggest in the forge.' },
  ]);

  return (
    <div className="flex-1 bg-obsidian-950 flex flex-col h-full overflow-hidden animate-in fade-in duration-700">
       {/* REGISTRY HEADER */}
       <div className="h-20 border-b border-white/10 bg-obsidian-850 flex items-center justify-between px-10 shrink-0 shadow-lg relative z-50">
          <div className="flex items-center gap-8">
             <div className="size-14 rounded-2xl bg-cyan-500 flex items-center justify-center text-black shadow-[0_0_25px_rgba(6,182,212,0.4)] animate-pulse">
                <span className="material-symbols-outlined text-[32px] font-black">settings_input_antenna</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[20px] font-black text-white uppercase tracking-[0.3em] italic leading-tight">AI_Intelligence_Sources</span>
                <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest italic font-bold mt-2">Managing Low-Latency Connections to External Intelligence</span>
             </div>
          </div>
          <button className="h-12 px-12 bg-obsidian-950 border border-white/10 rounded-xl text-[11px] font-black text-obsidian-400 hover:text-white hover:border-cyan-500/40 transition-all flex items-center gap-6 group shadow-inner">
             <span className="material-symbols-outlined text-[24px] text-cyan-400 group-hover:rotate-180 transition-transform duration-700">add_link</span>
             CONNECT_NEW_SOURCE
          </button>
       </div>

       {/* SERVER LISTING (SCROLLABLE) */}
       <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-obsidian-950/40 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 max-w-[1800px] mx-auto">
             {servers.map(srv => (
               <div key={srv.id} className="group bg-obsidian-850 border border-white/5 rounded-[48px] p-12 flex flex-col gap-10 hover:border-cyan-500/30 transition-all shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[1500ms] pointer-events-none">
                     <span className="material-symbols-outlined text-[180px] text-white">dns</span>
                  </div>
                  
                  <div className="flex justify-between items-start relative z-10">
                     <div className={`size-20 rounded-[32px] flex items-center justify-center shadow-inner transition-all duration-500 ${srv.status === 'connected' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 group-hover:bg-cyan-500 group-hover:text-black' : 'bg-obsidian-900 text-obsidian-600 border border-white/10'}`}>
                        <span className="material-symbols-outlined text-[40px]">{srv.type === 'LOCAL' ? 'terminal' : srv.type === 'REMOTE' ? 'public' : 'account_balance'}</span>
                     </div>
                     <div className="flex flex-col items-end gap-3">
                        <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-xl flex items-center gap-3 ${srv.status === 'connected' ? 'bg-green-500/10 text-green-500 border-green-500/30 animate-pulse' : 'bg-obsidian-900 text-obsidian-700 border-white/10'}`}>
                           <div className="flex gap-0.5 items-end h-3">
                              <div className="w-0.5 h-1.5 bg-current"></div>
                              <div className="w-0.5 h-2 bg-current"></div>
                              <div className={`w-0.5 h-2.5 ${srv.status === 'connected' ? 'bg-current' : 'bg-white/10'}`}></div>
                              <div className={`w-0.5 h-3 ${srv.status === 'connected' ? 'bg-current' : 'bg-white/10'}`}></div>
                           </div>
                           {srv.status === 'connected' ? 'LINK_SOLID' : 'STANDBY'}
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-[7px] font-mono text-obsidian-600 uppercase tracking-widest leading-none mb-1">Intelligence Multiplier</span>
                           <span className="text-[18px] font-black text-cyan-400 italic tabular-nums leading-none">{srv.multiplier}</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                     <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter group-hover:text-cyan-400 transition-colors leading-none">{srv.label}</h3>
                     <p className="text-[10px] font-mono text-cyan-500/40 uppercase font-bold tracking-widest italic">{srv.name} // SOURCE_0x</p>
                     <p className="text-[14px] text-obsidian-400 font-medium italic leading-relaxed line-clamp-3 border-l-2 border-white/5 pl-4">
                       {srv.desc}
                     </p>
                  </div>

                  <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
                     <div className="flex items-center gap-4">
                        <div className="size-2.5 rounded-full bg-green-500 shadow-[0_0_15px_green]"></div>
                        <span className="text-[11px] font-black text-obsidian-500 uppercase tracking-widest italic">Signal Strength: 100%</span>
                     </div>
                     <button className="px-10 py-4 bg-black/60 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-obsidian-400 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all shadow-xl">CONFIGURE</button>
                  </div>
               </div>
             ))}

             {/* INFRASTRUCTURE TEMPLATE CARD */}
             <div className="border-4 border-dashed border-white/10 rounded-[48px] flex flex-col items-center justify-center p-16 text-center gap-10 group hover:border-cyan-500/20 transition-all bg-black/10 cursor-pointer shadow-2xl">
                <div className="size-28 rounded-[40px] bg-obsidian-900 border border-white/5 flex items-center justify-center text-obsidian-700 group-hover:bg-cyan-500 group-hover:text-black transition-all shadow-inner">
                   <span className="material-symbols-outlined text-[56px] font-black">cloud_download</span>
                </div>
                <div className="space-y-3">
                   <span className="text-2xl font-black text-obsidian-400 uppercase italic tracking-widest group-hover:text-white transition-colors">Download_Skills</span>
                   <p className="text-[11px] text-obsidian-700 italic uppercase leading-none font-bold">Connect your Forge AI to more external API universes.</p>
                </div>
             </div>
          </div>
       </div>

       <div className="h-12 border-t border-white/10 bg-obsidian-850 flex items-center justify-center shrink-0 shadow-2xl">
          <p className="text-[11px] font-black text-obsidian-600 uppercase tracking-[0.7em] italic font-bold">
            Connections enable your AI to reason with the real-world design economy.
          </p>
       </div>
    </div>
  );
};

export default MCPRegistry;
