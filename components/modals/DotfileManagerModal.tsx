
import React, { useState } from 'react';
import { Persona, CognitiveTrace, CognitiveMessage } from '../../types';
import { XI_Button } from '../IndustrialPrimitives';

interface DotfileManagerModalProps {
  onClose: () => void;
  persona: Persona;
  onUpdatePersona: (patch: Partial<Persona>) => void;
  onRehydrateTrace: (history: CognitiveMessage[]) => void;
}

const DotfileManagerModal: React.FC<DotfileManagerModalProps> = ({ onClose, persona, onUpdatePersona, onRehydrateTrace }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'LOGS' | 'PERMISSIONS'>('IDENTITY');
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);

  const handleNeuralRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const seeds = ['Archon', 'Nexus', 'Vector', 'Void', 'Forge', 'Sovereign', 'Cyber', 'Ghost'];
      const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
      onUpdatePersona({ avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}` });
      setIsScanning(false);
    }, 800);
  };

  const selectedTrace = persona.traces.find(t => t.id === selectedTraceId);

  const togglePermission = (key: keyof Persona['permissions']) => {
    onUpdatePersona({
      permissions: { ...persona.permissions, [key]: !persona.permissions[key] }
    });
  };

  const renderLogs = () => (
    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-end border-b border-white/5 pb-2 mb-4">
        <span className="text-[10px] font-black text-obsidian-300 uppercase tracking-widest italic">Cognitive_Logs_Buffer</span>
        <span className="text-[9px] font-mono text-primary font-bold">{persona.traces.length} RECORDED</span>
      </div>
      <div className="space-y-2">
        {persona.traces.map(trace => (
          <div key={trace.id} className="p-4 bg-obsidian-900/50 border border-white/5 rounded-lg flex items-center justify-between group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="text-center w-14 px-2 py-1 bg-black/40 rounded border border-white/5">
                <div className="text-[9px] font-black text-obsidian-50">{trace.timestamp.split(' ')[0]}</div>
                <div className="text-[6px] font-mono text-obsidian-300 uppercase tracking-tighter">{trace.timestamp.split(' ')[1]}</div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-obsidian-50 uppercase tracking-tight">Trace_{trace.id.toUpperCase()}</span>
                <p className="text-[10px] text-obsidian-300 line-clamp-1 italic opacity-60">"{trace.summary}"</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedTraceId(trace.id)}
              className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
            >
              Recall
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTraceDetail = (trace: CognitiveTrace) => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-white/5 shrink-0">
         <div className="flex items-center gap-3">
            <button onClick={() => setSelectedTraceId(null)} className="size-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-obsidian-300 transition-all">
               <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
            <div className="space-y-0.5">
               <h3 className="text-sm font-black text-obsidian-50 uppercase tracking-tight">TRANSCRIPT_{trace.id.toUpperCase()}</h3>
               <span className="text-[8px] font-mono text-primary font-bold uppercase opacity-60">Session_Verified // 0x88f2</span>
            </div>
         </div>
         <div className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded text-[8px] font-black text-green-500">OPTIMAL_0.12μ</div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 min-h-0">
         {trace.history.map((msg, i) => (
           <div key={i} className="space-y-1">
              <div className="flex items-center gap-2 opacity-30">
                 <span className={`text-[7px] font-black uppercase tracking-[0.3em] ${msg.role === 'operator' ? 'text-primary' : 'text-obsidian-300'}`}>
                   {msg.role === 'operator' ? 'Input' : 'Output'}
                 </span>
                 <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <div className={`p-4 rounded border font-mono text-[11px] leading-relaxed transition-all ${msg.role === 'operator' ? 'bg-obsidian-950 border-white/5 text-obsidian-50' : 'bg-black/20 border-primary/10 text-obsidian-200 italic'}`}>
                 {msg.content}
              </div>
           </div>
         ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[85vh] bg-obsidian-950 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col relative grain-layer grain-2">
        
        <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0 bg-obsidian-900/40 relative z-20">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-black text-obsidian-50 tracking-widest uppercase italic">Identity_Manifest</h2>
            <div className="flex bg-obsidian-900 p-0.5 rounded border border-white/5">
               {(['IDENTITY', 'LOGS', 'PERMISSIONS'] as const).map(tab => (
                 <button 
                   key={tab}
                   onClick={() => { setActiveTab(tab); setSelectedTraceId(null); }}
                   className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-black' : 'text-obsidian-300 hover:text-white'}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
          </div>
          <button onClick={onClose} className="size-10 rounded hover:bg-white/5 flex items-center justify-center transition-all group">
            <span className="material-symbols-outlined text-white text-lg">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-hidden p-8 relative z-10 flex flex-col min-h-0">
           <div className="grid grid-cols-12 gap-8 h-full min-h-0">
              
              <div className="col-span-4 space-y-6 shrink-0">
                 <div onClick={handleNeuralRescan} className="aspect-square w-full rounded-lg bg-obsidian-900 border border-white/10 p-1 shadow-inner relative group overflow-hidden cursor-pointer active:scale-[0.98] transition-all">
                    <img src={persona.avatarUrl} alt="Operator" className="size-full object-cover rounded grayscale transition-all duration-700 group-hover:grayscale-0 opacity-80" />
                    <div className="absolute bottom-4 right-4 size-10 rounded bg-black border border-white/20 flex items-center justify-center text-primary">
                        <span className={`material-symbols-outlined text-xl ${isScanning ? 'animate-spin' : ''}`}>{isScanning ? 'cached' : 'verified_user'}</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-1">
                       <span className="text-[8px] font-black text-obsidian-300 uppercase tracking-widest px-1 opacity-50">Operator_ID</span>
                       <div className="bg-obsidian-950 border border-white/5 rounded p-3">
                          <input type="text" value={persona.username} onChange={(e) => onUpdatePersona({ username: e.target.value.toUpperCase() })} className="w-full bg-transparent border-none p-0 text-obsidian-50 font-black uppercase tracking-widest focus:ring-0 outline-none text-[11px]" />
                       </div>
                    </div>
                    <div className="p-4 bg-obsidian-900 border border-white/5 rounded italic text-[11px] text-obsidian-300 leading-relaxed opacity-60">
                       "Operating at ROOT_LEVEL privilege. Identity hash verified via recursive handshake v8."
                    </div>
                 </div>
              </div>

              <div className="col-span-8 flex flex-col h-full min-h-0 overflow-y-auto custom-scrollbar">
                 {activeTab === 'IDENTITY' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 bg-obsidian-900 border border-white/5 rounded-lg space-y-2 group hover:border-primary/20 transition-all">
                             <span className="text-[8px] font-black text-obsidian-300 uppercase tracking-widest opacity-50 italic">Trust_Score</span>
                             <div className="text-3xl font-black text-obsidian-50 tabular-nums italic">{persona.trustScore.toFixed(4)}</div>
                             <div className="h-0.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[98%]"></div></div>
                          </div>
                          <div className="p-6 bg-obsidian-900 border border-white/5 rounded-lg space-y-2 group hover:border-primary/20 transition-all">
                             <span className="text-[8px] font-black text-obsidian-300 uppercase tracking-widest opacity-50 italic">Cognitive_Depth</span>
                             <div className="text-3xl font-black text-primary tabular-nums italic">{persona.cognitiveDepth}%</div>
                             <div className="h-0.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-primary w-[82%]"></div></div>
                          </div>
                       </div>
                       <div className="p-6 bg-black/20 border border-white/5 rounded-xl space-y-3">
                          <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] italic">AI_Conductor_Report</span>
                          <p className="text-[12px] text-obsidian-200 leading-relaxed italic opacity-80">"Operator exhibit stable heuristic alignment. Peak performance indexed across {persona.traces.length} active shards."</p>
                       </div>
                    </div>
                 )}

                 {activeTab === 'LOGS' && (
                   selectedTraceId && selectedTrace ? renderTraceDetail(selectedTrace) : renderLogs()
                 )}

                 {activeTab === 'PERMISSIONS' && (
                    <div className="space-y-2 animate-in fade-in duration-300">
                       {[
                         { key: 'coreMutation', label: 'CORE_MUTATION', desc: 'Direct manipulation of neural path data.' },
                         { key: 'marketInjection', label: 'MARKET_INJECTION', desc: 'Permission to deploy shards for CORE revenue.' },
                         { key: 'deepReasoning', label: 'DEEP_REASONING', desc: 'Enable #HallbergMaths simulation kernels.' },
                       ].map(perm => (
                         <button key={perm.key} onClick={() => togglePermission(perm.key as any)} className={`w-full p-5 border rounded-lg flex items-center justify-between text-left transition-all ${persona.permissions[perm.key as keyof Persona['permissions']] ? 'bg-primary/5 border-primary/20' : 'bg-obsidian-900 border-white/5 opacity-40'}`}>
                            <div className="space-y-1">
                               <span className={`text-[11px] font-black uppercase tracking-widest ${persona.permissions[perm.key as keyof Persona['permissions']] ? 'text-primary' : 'text-obsidian-50'}`}>{perm.label}</span>
                               <p className="text-[9px] text-obsidian-300 italic opacity-60">{perm.desc}</p>
                            </div>
                            <div className={`size-5 rounded border flex items-center justify-center transition-all ${persona.permissions[perm.key as keyof Persona['permissions']] ? 'border-primary bg-primary text-black' : 'border-obsidian-500'}`}>{persona.permissions[perm.key as keyof Persona['permissions']] && <span className="material-symbols-outlined text-[14px] font-black">check</span>}</div>
                         </button>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>

        <div className="p-6 bg-obsidian-900 border-t border-white/5 flex justify-between items-center shrink-0 relative z-20">
           <div className="flex flex-col gap-1">
              <span className="text-[7px] font-black text-obsidian-300 uppercase tracking-widest opacity-40">MANIFEST_HASH_V8</span>
              <span className="text-[10px] font-mono text-obsidian-50 italic">0x88f2...f07a_S</span>
           </div>
           
           <div className="flex items-center gap-4">
              {selectedTrace ? (
                <>
                  <button onClick={() => setSelectedTraceId(null)} className="px-6 py-2 text-[10px] font-black uppercase text-obsidian-300 hover:text-white transition-colors">Return</button>
                  <button onClick={() => onRehydrateTrace(selectedTrace.history)} className="px-8 py-3 bg-primary text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-primary/20 flex items-center gap-3">
                     <span className="material-symbols-outlined text-lg">bolt</span>
                     Resume_Session
                  </button>
                </>
              ) : (
                <>
                  <button onClick={onClose} className="px-6 py-2 text-[10px] font-black uppercase text-obsidian-300 hover:text-white transition-colors">Dismiss</button>
                  <XI_Button label="Export_Manifest" icon="file_download" variant="primary" className="!px-10 !py-3 !rounded-lg" />
                </>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DotfileManagerModal;
