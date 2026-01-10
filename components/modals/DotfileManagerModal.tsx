
import React, { useState } from 'react';
import { Persona, CognitiveTrace, CognitiveMessage, Interaction } from '../../types';
import { XI_Button, XI_ProgressGauge, XI_Telemetry } from '../IndustrialPrimitives';

interface DotfileManagerModalProps {
  onClose: () => void;
  persona: Persona;
  onUpdatePersona: (patch: Partial<Persona>) => void;
  onRehydrateTrace: (history: CognitiveMessage[]) => void;
}

const DotfileManagerModal: React.FC<DotfileManagerModalProps> = ({ onClose, persona, onUpdatePersona, onRehydrateTrace }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'LOGS' | 'SOCIAL' | 'PERMISSIONS'>('IDENTITY');
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);

  const handleNeuralRescan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1200);
  };

  const selectedTrace = persona.traces.find(t => t.id === selectedTraceId);

  const renderLogs = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-end border-b border-white/5 pb-4 shrink-0">
        <div className="flex flex-col gap-1">
           <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none">Cognitive_Logs_Buffer</span>
           <span className="text-[8px] font-mono text-obsidian-600 uppercase italic">Immutable_Dotfile_History</span>
        </div>
        <span className="text-[12px] font-black text-white italic tabular-nums">{persona.traces.length} RECORDED</span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 pb-10">
        {persona.traces.length === 0 ? (
          <div className="py-20 text-center text-[10px] text-obsidian-700 uppercase italic">Memory_Buffer_Empty</div>
        ) : (
          persona.traces.map(trace => (
            <div 
              key={trace.id} 
              onClick={() => setSelectedTraceId(trace.id)}
              className="p-5 bg-obsidian-900 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-primary/40 hover:bg-obsidian-800 transition-all cursor-pointer active:scale-[0.99] shadow-lg"
            >
              <div className="flex items-center gap-6">
                <div className="text-center w-16 px-2 py-2 bg-black/40 rounded-xl border border-white/10 group-hover:border-primary/20 transition-all shadow-inner">
                  <div className="text-[11px] font-black text-obsidian-50 italic">{trace.timestamp.split(' ')[0].split('-').slice(1).join('/')}</div>
                  <div className="text-[7px] font-mono text-primary uppercase tracking-tighter mt-1 font-bold">{trace.timestamp.split(' ')[1]}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[13px] font-black text-obsidian-50 uppercase tracking-tight group-hover:text-primary transition-colors italic">Session_{trace.id.toUpperCase()}</span>
                  <p className="text-[11px] text-obsidian-400 line-clamp-1 italic opacity-60">"{trace.summary}"</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-obsidian-700 group-hover:text-primary transition-colors">history_edu</span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderTraceDetail = (trace: CognitiveTrace) => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-400 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between pb-6 border-b border-white/5 shrink-0">
         <div className="flex items-center gap-5">
            <button onClick={() => setSelectedTraceId(null)} className="size-10 rounded-xl bg-white/5 hover:bg-primary hover:text-black flex items-center justify-center text-obsidian-300 transition-all border border-white/5 shadow-xl">
               <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="space-y-1">
               <h3 className="text-xl font-black text-obsidian-50 uppercase tracking-tight italic">TRANSCRIPT_{trace.id.toUpperCase()}</h3>
               <span className="text-[9px] font-mono text-primary font-bold uppercase opacity-60 italic">Session_Dossier // Hash_0x{trace.id}</span>
            </div>
         </div>
         <div className="px-4 py-1.5 bg-green-500/5 border border-green-500/20 rounded-full text-[10px] font-black text-green-500 italic shadow-inner">OPTIMAL_REASONING</div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-4 min-h-0 pb-10">
         {trace.history.map((msg, i) => (
           <div key={i} className="space-y-3 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center gap-4 opacity-30">
                 <div className={`size-1.5 rounded-full ${msg.role === 'operator' ? 'bg-primary' : 'bg-cyan-500'}`}></div>
                 <span className={`text-[8px] font-black uppercase tracking-[0.4em] ${msg.role === 'operator' ? 'text-primary' : 'text-cyan-400'}`}>
                   {msg.role === 'operator' ? 'Operator_Intent' : 'Kernel_Logic'}
                 </span>
                 <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <div className={`p-6 rounded-[32px] border font-mono text-[13px] leading-relaxed transition-all shadow-2xl ${msg.role === 'operator' ? 'bg-obsidian-900 border-white/5 text-obsidian-50 rounded-tl-none' : 'bg-black/40 border-primary/10 text-cyan-100/80 italic rounded-tr-none'}`}>
                 {msg.content}
              </div>
           </div>
         ))}
      </div>
    </div>
  );

  const renderSocialStack = () => (
    <div className="space-y-10 animate-in fade-in duration-500 flex flex-col h-full overflow-hidden">
       <div className="grid grid-cols-2 gap-6 shrink-0">
          <div className="p-8 bg-obsidian-900 border border-white/5 rounded-[40px] space-y-4 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[100px] text-primary">diversity_3</span>
             </div>
             <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic block leading-none">Community_Impact_Σ</span>
             <div className="text-5xl font-black text-white italic tabular-nums leading-none tracking-tighter">{persona.communityImpact.toLocaleString()}</div>
             <p className="text-[10px] text-obsidian-600 font-bold uppercase tracking-tight italic">Top 4% of sovereign architects</p>
          </div>
          <div className="p-8 bg-obsidian-900 border border-white/5 rounded-[40px] space-y-4 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[100px] text-cyan-400">handshake</span>
             </div>
             <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] italic block leading-none">Active_Handshakes</span>
             <div className="text-5xl font-black text-white italic tabular-nums leading-none tracking-tighter">{persona.interactions.length}</div>
             <p className="text-[10px] text-obsidian-600 font-bold uppercase tracking-tight italic">Active production bridges</p>
          </div>
       </div>

       <div className="flex-1 flex flex-col min-h-0">
          <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-[0.4em] mb-4 px-2 italic">Interaction_Ledger</span>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2 pb-10">
             {persona.interactions.map(inter => (
               <div key={inter.id} className="p-6 bg-black/40 border border-white/5 rounded-[32px] flex items-center justify-between hover:bg-white/[0.02] transition-all group cursor-default shadow-lg">
                  <div className="flex items-center gap-6">
                     <div className={`size-14 rounded-2xl flex items-center justify-center shadow-inner transition-all ${inter.type === 'MENTORSHIP' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                        <span className="material-symbols-outlined text-[28px]">{inter.type === 'MENTORSHIP' ? 'school' : 'swap_horiz'}</span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-black text-white uppercase italic tracking-tight">{inter.type} // {inter.peerId}</span>
                        <p className="text-[11px] text-obsidian-500 line-clamp-1 max-w-[300px] italic">"{inter.memo}"</p>
                     </div>
                  </div>
                  <div className="text-right flex flex-col gap-1">
                     <span className="text-[18px] font-black text-green-500 italic tabular-nums">+{inter.impact} XP</span>
                     <span className="text-[8px] font-mono text-obsidian-700 uppercase">{new Date(inter.timestamp).toLocaleDateString()}</span>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-8 bg-black/95 backdrop-blur-[40px] animate-in fade-in duration-300">
      <div className="w-full max-w-[1200px] h-[800px] bg-obsidian-950 border-2 border-white/10 rounded-[60px] overflow-hidden shadow-[0_80px_200px_rgba(0,0,0,1)] flex flex-col relative grain-layer grain-1">
        
        {/* MODAL HEADER CHROME */}
        <div className="h-24 px-12 border-b border-obsidian-800 flex justify-between items-center shrink-0 bg-[#0c0e10]/80 backdrop-blur-md relative z-50">
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
               <h2 className="text-[28px] font-black text-obsidian-50 tracking-tighter uppercase italic leading-none">Identity_Manifest</h2>
               <span className="text-[9px] font-mono text-primary uppercase tracking-[0.5em] mt-2 font-bold italic opacity-60">SOVEREIGN_DOTFILE_0x84_S</span>
            </div>
            <div className="h-10 w-px bg-white/10 mx-2"></div>
            <div className="flex bg-black/60 p-1 rounded-2xl border border-white/5 shadow-inner">
               {(['IDENTITY', 'LOGS', 'SOCIAL', 'PERMISSIONS'] as const).map(tab => (
                 <button 
                   key={tab}
                   onClick={() => { setActiveTab(tab); setSelectedTraceId(null); }}
                   className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-black shadow-2xl' : 'text-obsidian-500 hover:text-white'}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
          </div>
          <button onClick={onClose} className="size-14 rounded-full bg-white/5 hover:bg-white/10 hover:rotate-90 flex items-center justify-center transition-all group border border-white/5">
            <span className="material-symbols-outlined text-white text-[28px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-hidden p-12 relative z-10 flex flex-col min-h-0">
           <div className="grid grid-cols-12 gap-12 h-full min-h-0">
              
              {/* LEFT SIDEBAR: PROFILE & GAMIFICATION HUD */}
              <div className="col-span-4 flex flex-col h-full gap-10 shrink-0">
                 <div onClick={handleNeuralRescan} className="w-full aspect-square rounded-[48px] bg-obsidian-900 border-2 border-white/5 p-2 shadow-2xl relative group overflow-hidden cursor-pointer hover:border-primary/40 transition-all active:scale-[0.98]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--xi-accent)_0%,_transparent_70%)] opacity-0 group-hover:opacity-20 transition-opacity duration-1000"></div>
                    <img src={persona.avatarUrl} alt="Operator" className="size-full object-cover rounded-[40px] grayscale transition-all duration-[2000ms] group-hover:grayscale-0 group-hover:scale-105" />
                    <div className="absolute bottom-6 right-6 size-14 rounded-2xl bg-black/95 border border-white/20 flex items-center justify-center text-primary shadow-2xl backdrop-blur-xl group-hover:scale-110 transition-transform">
                        <span className={`material-symbols-outlined text-[32px] ${isScanning ? 'animate-spin' : ''}`}>{isScanning ? 'cached' : 'verified_user'}</span>
                    </div>
                 </div>

                 <div className="space-y-8 flex-1">
                    <div className="space-y-4">
                       <div className="flex justify-between items-end px-2">
                          <span className="text-[10px] font-black text-obsidian-600 uppercase tracking-[0.4em] italic">Operator_XP</span>
                          <span className="text-[12px] font-black text-white italic tabular-nums">{persona.xp} / {persona.xpToNext} <span className="text-[8px] opacity-40">CORE</span></span>
                       </div>
                       <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                          <div className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_15px_orange]" style={{ width: `${(persona.xp / persona.xpToNext) * 100}%` }}></div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-6 bg-obsidian-900 border border-white/5 rounded-[32px] space-y-2 group hover:border-primary/20 transition-all shadow-xl">
                          <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.3em] italic leading-none block">System_Rank</span>
                          <div className="text-2xl font-black text-white italic tracking-tighter leading-none group-hover:text-primary transition-colors">{persona.rank}</div>
                       </div>
                       <div className="p-6 bg-obsidian-900 border border-white/5 rounded-[32px] space-y-2 group hover:border-primary/20 transition-all shadow-xl">
                          <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.3em] italic leading-none block">Forge_Level</span>
                          <div className="text-2xl font-black text-primary italic tabular-nums leading-none">LVL_{persona.level}</div>
                       </div>
                    </div>

                    <div className="p-8 bg-primary/5 border border-primary/20 rounded-[40px] shadow-inner relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <span className="material-symbols-outlined text-6xl">psychology</span>
                       </div>
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic block mb-3">Conductor_Insight</span>
                       <p className="text-[13px] text-obsidian-400 leading-relaxed italic font-medium relative z-10">
                          "You have achieved **98.4% alignment** with the swarm. Your recent mentorship of NOVICE_FORGE_9 earned you +120 impact credits."
                       </p>
                    </div>
                 </div>
              </div>

              {/* RIGHT CONTENT PANEL: DYNAMIC TABS */}
              <div className="col-span-8 flex flex-col h-full min-h-0 overflow-hidden">
                 {activeTab === 'IDENTITY' && (
                    <div className="space-y-10 animate-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                       <div className="space-y-2">
                          <span className="text-[12px] font-black text-primary uppercase tracking-[0.6em] italic block border-b border-primary/20 pb-4 mb-4">Neural_Audit_Profile</span>
                          <div className="bg-black/60 border-2 border-white/5 rounded-[40px] p-10 flex flex-col gap-8 shadow-[inset_0_4px_40px_rgba(0,0,0,0.8)] group hover:border-primary/10 transition-all">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-obsidian-600 uppercase tracking-widest px-1 italic">Operator_Signature</label>
                                <input 
                                  type="text" 
                                  value={persona.username} 
                                  onChange={(e) => onUpdatePersona({ username: e.target.value.toUpperCase() })} 
                                  className="w-full bg-transparent border-none p-0 text-5xl font-black uppercase tracking-tighter italic text-white focus:ring-0 outline-none placeholder:text-obsidian-800" 
                                />
                             </div>
                             <div className="h-px w-full bg-white/5"></div>
                             <p className="text-xl text-obsidian-400 leading-relaxed italic max-w-2xl">
                                "Sovereign Architect registered at Node 0x84. Expert in #Hallberg vertex logic and recursive market derivation. Operating at ROOT_LEVEL privilege since Spec 0.1."
                             </p>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-8 mt-auto">
                          <div className="p-8 bg-obsidian-900 border border-white/5 rounded-[40px] space-y-4 shadow-xl">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-[0.3em]">Deep_Reasoning_Depth</span>
                                <span className="text-2xl font-black text-cyan-400 italic tabular-nums">0x8A4</span>
                             </div>
                             <div className="h-1 w-full bg-black rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500/40 shadow-[0_0_10px_cyan]" style={{ width: '82%' }}></div>
                             </div>
                          </div>
                          <div className="p-8 bg-obsidian-900 border border-white/5 rounded-[40px] space-y-4 shadow-xl">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-[0.3em]">Shard_Yield_Rate</span>
                                <span className="text-2xl font-black text-green-500 italic tabular-nums">+14.2%</span>
                             </div>
                             <div className="h-1 w-full bg-black rounded-full overflow-hidden">
                                <div className="h-full bg-green-500/40 shadow-[0_0_10px_green]" style={{ width: '92%' }}></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'LOGS' && (
                   selectedTraceId && selectedTrace ? renderTraceDetail(selectedTrace) : renderLogs()
                 )}

                 {activeTab === 'SOCIAL' && renderSocialStack()}

                 {activeTab === 'PERMISSIONS' && (
                    <div className="space-y-3 animate-in fade-in duration-300 overflow-y-auto custom-scrollbar pr-2 pb-20">
                       <span className="text-[12px] font-black text-primary uppercase tracking-[0.6em] italic block border-b border-primary/20 pb-4 mb-6">Sovereign_Protocol_Auth</span>
                       {[
                         { key: 'coreMutation', label: 'CORE_MUTATION', desc: 'Direct manipulation of neural path data and low-level engine kernels.', icon: 'bolt' },
                         { key: 'marketInjection', label: 'MARKET_INJECTION', desc: 'Permission to deploy signed shards for recursive CORE revenue.', icon: 'currency_exchange' },
                         { key: 'deepReasoning', label: 'DEEP_REASONING', desc: 'Enable #HallbergMaths simulation kernels and 10-body solvers.', icon: 'psychology' },
                       ].map(perm => (
                         <button 
                            key={perm.key} 
                            onClick={() => onUpdatePersona({ permissions: { ...persona.permissions, [perm.key]: !persona.permissions[perm.key as keyof Persona['permissions']] } })} 
                            className={`w-full p-8 border rounded-[32px] flex items-center justify-between text-left transition-all active:scale-[0.98] group ${persona.permissions[perm.key as keyof Persona['permissions']] ? 'bg-primary/5 border-primary/30 shadow-xl' : 'bg-black/40 border-white/5 opacity-50'}`}
                         >
                            <div className="flex items-center gap-8">
                               <div className={`size-14 rounded-2xl flex items-center justify-center shadow-inner transition-all ${persona.permissions[perm.key as keyof Persona['permissions']] ? 'bg-primary text-black' : 'bg-obsidian-900 text-obsidian-700'}`}>
                                  <span className="material-symbols-outlined text-[28px]">{perm.icon}</span>
                               </div>
                               <div className="space-y-1">
                                  <span className={`text-[16px] font-black uppercase tracking-widest ${persona.permissions[perm.key as keyof Persona['permissions']] ? 'text-white' : 'text-obsidian-600'}`}>{perm.label}</span>
                                  <p className="text-[11px] text-obsidian-500 italic opacity-80 leading-tight">"{perm.desc}"</p>
                               </div>
                            </div>
                            <div className={`size-8 rounded-xl border-2 flex items-center justify-center transition-all ${persona.permissions[perm.key as keyof Persona['permissions']] ? 'border-primary bg-primary text-black shadow-[0_0_15px_orange]' : 'border-obsidian-700'}`}>
                               {persona.permissions[perm.key as keyof Persona['permissions']] && <span className="material-symbols-outlined text-[20px] font-black">check</span>}
                            </div>
                         </button>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* MODAL FOOTER DOCK */}
        <div className="h-24 px-12 bg-[#0c0e10]/80 border-t border-obsidian-800 flex justify-between items-center shrink-0 relative z-50">
           <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-obsidian-700 uppercase tracking-[0.5em] italic">Integrity_Snapshot_v8</span>
              <span className="text-[13px] font-mono text-white italic tabular-nums">0x88F2...A702_STABLE</span>
           </div>
           
           <div className="flex items-center gap-8">
              {selectedTrace ? (
                <>
                  <button onClick={() => setSelectedTraceId(null)} className="px-8 py-3 text-[11px] font-black uppercase text-obsidian-500 hover:text-white transition-colors tracking-widest">Abort_Recall</button>
                  <button 
                    onClick={() => { onRehydrateTrace(selectedTrace.history); onClose(); }} 
                    className="px-12 h-14 bg-primary text-black rounded-[20px] text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-2xl shadow-primary/20 flex items-center gap-4 group"
                  >
                     <span className="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform">bolt</span>
                     Resume_Cognitive_Session
                  </button>
                </>
              ) : (
                <>
                  <button onClick={onClose} className="px-10 py-3 text-[11px] font-black uppercase text-obsidian-500 hover:text-white transition-colors tracking-widest italic">Dismiss_Manifest</button>
                  <button className="px-12 h-14 bg-obsidian-100 text-white border border-white/10 rounded-[20px] text-[12px] font-black uppercase tracking-[0.4em] hover:bg-primary hover:text-black hover:border-primary transition-all shadow-xl flex items-center gap-5 group">
                     <span>Export_Dossier_Hash</span>
                     <span className="material-symbols-outlined text-[22px] group-hover:translate-y-[-2px] transition-transform">file_download</span>
                  </button>
                </>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DotfileManagerModal;
