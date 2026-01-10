
import React, { useState, useMemo } from 'react';
import { XI_Button, XI_ProgressGauge, XI_StatusBadge } from './IndustrialPrimitives';
import { translate } from '../services/lexiconService';

interface ShardManifestPageProps {
  asset: any;
  onClose: () => void;
  onInject: () => void;
  verboseMode: boolean;
  formatValue: (v: number) => string;
}

const ShardManifestPage: React.FC<ShardManifestPageProps> = ({ asset, onClose, onInject, verboseMode, formatValue }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SPECS' | 'COMMUNITY' | 'DOCS'>('OVERVIEW');

  const relatedAssets = useMemo(() => [
    { id: 'rel-1', name: 'CORE_GLOW_VFX', category: 'SHADERS', rating: 4.9, price: 1200 },
    { id: 'rel-2', name: 'Z_STACK_SCHEDULER', category: 'LOGIC', rating: 4.7, price: 800 },
    { id: 'rel-3', name: 'NURBS_HARDENER', category: 'GEOMETRY', rating: 5.0, price: 2400 },
  ], []);

  return (
    <div className="fixed inset-0 z-[1000] bg-obsidian-950 flex flex-col overflow-hidden animate-in fade-in duration-500 select-none paper-layer grain-coarse">
      {/* IMMERSIVE HEADER CHROME */}
      <div className="h-16 shrink-0 bg-black/60 border-b border-white/10 flex items-center justify-between px-10 z-50 backdrop-blur-3xl shadow-2xl">
        <div className="flex items-center gap-8">
          <button 
            onClick={onClose} 
            className="size-10 rounded-xi bg-white/5 hover:bg-primary hover:text-black flex items-center justify-center transition-all border border-white/10 group shadow-lg"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-[-90deg] transition-transform">arrow_back</span>
          </button>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="flex flex-col">
             <div className="flex items-center gap-3">
                <span className="text-[18px] font-black text-white uppercase italic tracking-tighter leading-none">{asset.name}</span>
                <XI_StatusBadge status="STABLE" label="AUDITED" />
             </div>
             <span className="text-[8px] font-mono text-primary uppercase tracking-[0.5em] mt-1.5 font-bold italic opacity-60 leading-none">
               {verboseMode ? 'FULL PRODUCT MANIFEST' : 'SOVEREIGN_MANIFEST_ENTRY_0x84'}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <nav className="flex bg-black/60 p-1 rounded-xi border border-white/5 shadow-inner">
              {(['OVERVIEW', 'SPECS', 'COMMUNITY', 'DOCS'] as const).map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2 rounded-xi text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-black xi-backlit' : 'text-obsidian-500 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
           </nav>
           <XI_Button label={verboseMode ? "PURCHASE & INJECT" : "EXECUTE_INJECTION"} variant="primary" icon="bolt" onClick={onInject} size="sm" className="h-10 !rounded-xi px-8" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* DEEP SPECIFICATION RAIL (Left) */}
        <aside className="w-80 shrink-0 bg-obsidian-900 border-r border-white/10 flex flex-col p-8 gap-10 paper-layer grain-fine overflow-y-auto no-scrollbar">
           <div className="space-y-8">
              <div className="space-y-3">
                 <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.5em] italic block">Trust_Score</span>
                 <div className="p-6 bg-black/40 border border-primary/20 rounded-xi space-y-4 shadow-inner text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-5xl font-black text-primary italic tabular-nums leading-none tracking-tighter">{(asset.stability * 100).toFixed(1)}%</span>
                    <div className="flex flex-col items-center gap-2">
                       <div className="flex gap-0.5 text-primary">
                          {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-[12px] fill-current">verified</span>)}
                       </div>
                       <span className="text-[7px] font-mono text-obsidian-600 uppercase font-black italic">XIBALBA_VERIFIED_0x84</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.4em] italic block border-b border-white/5 pb-3">Architect_Dossier</span>
                 <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-xi group hover:border-primary/20 transition-all cursor-pointer">
                    <div className="size-11 rounded-xi bg-obsidian-950 border border-white/10 overflow-hidden shadow-2xl p-0.5 group-hover:xi-backlit transition-all">
                       <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${asset.author}`} alt="Author" className="size-full rounded-sm" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[13px] font-black text-white uppercase italic leading-none group-hover:text-primary transition-colors">{asset.author}</span>
                       <span className="text-[7px] font-mono text-obsidian-600 uppercase mt-1.5 font-bold tracking-widest italic leading-none">Core_Lead // Studio_X</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.4em] italic block border-b border-white/5 pb-3">Provenance_Stack</span>
                 <div className="flex flex-wrap gap-1.5">
                    {asset.hashtags.map((t: string) => (
                      <span key={t} className="text-[8px] font-mono text-primary italic font-black uppercase bg-primary/10 px-3 py-1 rounded-xi border border-primary/20 shadow-inner">
                        {t}
                      </span>
                    ))}
                 </div>
              </div>
           </div>
           
           <div className="mt-auto p-8 bg-primary/5 border border-primary/20 rounded-xi space-y-4 shadow-inner relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined text-[80px] text-white">loyalty</span>
              </div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic block leading-none">Developer_Yield</span>
              <p className="text-[12px] text-obsidian-300 italic leading-relaxed font-bold tracking-tight relative z-10">
                 "Participates in Sovereign Yield Protocol: **10% Root Royalties** enforced."
              </p>
           </div>
        </aside>

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#08090a]/60 relative paper-layer grain-medium">
           <div className="max-w-5xl mx-auto p-16 space-y-24">
              
              {/* HERO SECTION */}
              <section className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
                 <div className="relative aspect-video bg-obsidian-900 rounded-xi border border-white/10 overflow-hidden shadow-[0_40px_150px_rgba(0,0,0,0.8)] group">
                    <div className="absolute inset-0 canvas-grid opacity-10"></div>
                    <img src={asset.previewUrl} alt="Hero" className="size-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[3000ms] scale-105 group-hover:scale-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-transparent to-transparent"></div>
                    
                    <div className="absolute bottom-12 left-12 flex items-end gap-10">
                       <div className="size-24 rounded-xi bg-primary/20 border-2 border-primary flex items-center justify-center text-primary shadow-[0_0_60px_rgba(184,134,11,0.4)] group-hover:scale-110 transition-transform duration-700">
                          <span className="material-symbols-outlined text-[56px] font-black">{asset.icon}</span>
                       </div>
                       <div className="space-y-4 pb-2">
                          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-2xl">{asset.name}</h2>
                          <div className="flex gap-8 items-center">
                             <span className="text-[10px] font-mono text-obsidian-400 uppercase tracking-[0.4em] font-black italic">VERSION_8.6.0_BETA</span>
                             <div className="w-px h-3 bg-white/20"></div>
                             <span className="text-[10px] font-black text-green-500 uppercase italic tracking-widest underline decoration-1 underline-offset-4">VERIFIED_INDUSTRIAL_SOURCE</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </section>

              {/* OVERVIEW CONTENT */}
              {activeTab === 'OVERVIEW' && (
                <section className="grid grid-cols-12 gap-16 animate-in fade-in duration-500">
                   <div className="col-span-7 space-y-12">
                      <div className="space-y-6">
                         <span className="text-[14px] font-black text-primary uppercase tracking-[0.5em] italic leading-none block border-b border-primary/20 pb-6">Executive_Summary</span>
                         <p className="text-3xl text-obsidian-200 leading-[1.5] italic font-medium">
                            "{asset.description} Refined for Spec 8.6 with crisp 4px rounding and standardized industrial gutters."
                         </p>
                      </div>
                      <div className="p-12 bg-obsidian-850/80 border border-white/5 rounded-xi space-y-8 shadow-inner relative overflow-hidden group hover:border-primary/20 transition-all">
                         <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-primary text-2xl font-black">school</span>
                            <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em] italic">Theory_of_Operation</span>
                         </div>
                         <p className="text-xl text-obsidian-400 italic leading-relaxed group-hover:text-white transition-colors duration-700">
                            "{asset.theory}"
                         </p>
                      </div>
                   </div>
                   <div className="col-span-5 space-y-10">
                      <div className="bg-obsidian-900 border border-white/10 rounded-xi p-12 space-y-10 shadow-2xl">
                         <span className="text-[11px] font-black text-primary uppercase tracking-[0.5em] italic block border-b border-white/5 pb-4">Core_Telemetry</span>
                         <div className="space-y-10">
                            <div className="flex justify-between items-end">
                               <span className="text-[13px] font-black text-white uppercase italic">Sovereign_Fee</span>
                               <span className="text-5xl font-black text-primary italic tabular-nums leading-none tracking-tighter">{formatValue(asset.price)} CORE</span>
                            </div>
                            <div className="space-y-6">
                               <XI_ProgressGauge label="NETWORK_STABILITY" value={99} color="#22c55e" />
                               <XI_ProgressGauge label="RECURSIVE_POTENTIAL" value={84} color="var(--xi-accent)" />
                               <XI_ProgressGauge label="INDUSTRIAL_FRICTION" value={98} color="#06b6d4" />
                            </div>
                         </div>
                      </div>
                   </div>
                </section>
              )}

              {/* SPECS CONTENT */}
              {activeTab === 'SPECS' && (
                <section className="space-y-12 animate-in slide-in-from-right-8 duration-500">
                   <div className="border-b border-white/10 pb-8">
                      <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter">Technical_Spec_v8.6</h3>
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      {[
                        { label: 'ROUNDING_PROTOCOL', val: '4px (xi)', desc: 'Revised crisp aesthetic compliance.' },
                        { label: 'TOPOLOGY_DENSITY', val: `${asset.stats.nurbsComplexity.toLocaleString()} NURBS`, desc: 'Geometric resolution index.' },
                        { label: 'LOGIC_FRICTION', val: `${asset.stats.logicWeight}μ`, desc: 'Computational drag vs interaction speed.' },
                        { label: 'Z_STACK_PARITY', val: '1:1_VALID', desc: 'Alignment with standard depth manifolds.' },
                      ].map(spec => (
                        <div key={spec.label} className="p-10 bg-black/40 border border-white/5 rounded-xi space-y-4 group hover:border-primary/40 transition-all shadow-xl">
                           <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] italic block opacity-60">{spec.label}</span>
                           <div className="text-3xl font-black text-white italic tabular-nums tracking-tighter leading-none">{spec.val}</div>
                           <p className="text-[12px] text-obsidian-500 italic leading-relaxed font-bold uppercase tracking-tight">{spec.desc}</p>
                        </div>
                      ))}
                   </div>
                </section>
              )}

              {/* COMMUNITY CONTENT */}
              {activeTab === 'COMMUNITY' && (
                <section className="space-y-12 animate-in slide-in-from-left-8 duration-500">
                   <div className="flex justify-between items-end border-b border-white/10 pb-8">
                      <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter">Community_Audits</h3>
                      <XI_Button label="WRITE_REVIEW" variant="obsidian" size="sm" className="!rounded-xi" />
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      {[
                        { user: 'ARCHON_PUPIL', text: 'Rounding 8.6 is perfectly sharp. No more bloat in the corners. Clean injection.', rating: 5, date: '1d ago' },
                        { user: 'STUDIO_FORGE_X', text: 'NURBS data aligns with 0.12μ friction standards. Passed our internal QA.', rating: 5, date: '3d ago' },
                      ].map((rev, i) => (
                        <div key={i} className="p-12 bg-obsidian-900 border border-white/5 rounded-xi space-y-8 shadow-2xl relative overflow-hidden group">
                           <div className="flex justify-between items-center relative z-10">
                              <div className="flex items-center gap-5">
                                 <div className="size-14 rounded-xi bg-white/5 p-0.5 border border-white/10">
                                    <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${rev.user}`} alt="User" className="size-full rounded-sm grayscale group-hover:grayscale-0 transition-all" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[14px] font-black text-white uppercase italic leading-none">{rev.user}</span>
                                    <span className="text-[9px] font-mono text-obsidian-600 uppercase italic mt-1.5 font-bold tracking-widest">{rev.date}</span>
                                 </div>
                              </div>
                              <div className="flex gap-1 bg-primary/10 px-3 py-1.5 rounded-xi border border-primary/20">
                                 {[1,2,3,4,5].map(j => (
                                   <span key={j} className="material-symbols-outlined text-[14px] text-primary fill-current">star</span>
                                 ))}
                              </div>
                           </div>
                           <p className="text-xl text-obsidian-300 italic leading-relaxed group-hover:text-white transition-colors duration-700">
                              "{rev.text}"
                           </p>
                        </div>
                      ))}
                   </div>
                </section>
              )}

              {/* RECURSIVE ECOSYSTEM */}
              <section className="space-y-10 pt-20 border-t border-white/5">
                 <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-obsidian-400 uppercase italic tracking-[0.2em]">Recursive_Ecosystem</h3>
                    <button className="text-[10px] font-black text-primary uppercase underline underline-offset-8 decoration-1 tracking-widest">Browse_All_Compatible</button>
                 </div>
                 <div className="grid grid-cols-3 gap-8">
                    {relatedAssets.map(rel => (
                      <div key={rel.id} className="group p-8 bg-obsidian-900 border border-white/5 rounded-xi flex flex-col gap-6 hover:border-primary/40 transition-all shadow-xl hover:translate-y-[-4px] cursor-pointer">
                         <div className="flex justify-between items-start">
                            <div className="size-10 rounded-xi bg-black/40 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                               <span className="material-symbols-outlined text-[20px]">extension</span>
                            </div>
                            <span className="text-[10px] font-black text-primary tabular-nums">{rel.rating}</span>
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-[14px] font-black text-white uppercase italic group-hover:text-primary transition-colors">{rel.name}</h4>
                            <span className="text-[7px] font-mono text-obsidian-600 uppercase font-bold tracking-widest">{rel.category} // ENTRY</span>
                         </div>
                         <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-end">
                            <span className="text-[16px] font-black text-white italic tabular-nums">{rel.price} CORE</span>
                            <span className="material-symbols-outlined text-obsidian-700 text-[18px]">visibility</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              {/* FOOTER SHIELD */}
              <div className="h-64 flex flex-col items-center justify-center text-center opacity-[0.05] pointer-events-none gap-4">
                 <span className="text-[120px] font-black text-white uppercase italic tracking-[0.5em] leading-none select-none">XIBALBA</span>
                 <p className="text-[12px] font-mono font-black uppercase tracking-[1.5em]">CORE_SYSTEM_VALIDATED_v8.6</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ShardManifestPage;
