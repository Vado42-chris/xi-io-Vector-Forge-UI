
import React, { useState, useMemo } from 'react';

interface MarketplaceNexusProps {
  onClose?: () => void;
  onSplit?: () => void;
}

const XibalbaIdentity: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} filter drop-shadow-[0_0_8px_rgba(184,134,11,0.5)]`}
  >
    <path d="M20 40C20 23.4315 33.4315 10 50 10C66.5685 10 80 23.4315 80 40V55C80 60.5228 75.5228 65 70 65H30C24.4772 65 20 60.5228 20 55V40Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2"/>
    <rect x="32" y="38" width="12" height="12" rx="2" fill="currentColor" />
    <rect x="56" y="38" width="12" height="12" rx="2" fill="currentColor" />
    <path d="M35 65V75M45 65V80M55 65V80M65 65V75" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M30 65H70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M50 10V2M10 50H2M90 50H98" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"/>
  </svg>
);

type AssetCategory = 'WIDGETS' | 'THEMES' | 'SCRIPTS' | 'APPS' | '3D' | 'AUDIO' | 'VIDEO' | 'SERVICES';
type ProviderType = 'XIBALBA_OFFICIAL' | 'FEATURED' | 'SPONSORED' | 'COMMUNITY';

interface Asset {
  id: string;
  title: string;
  techName: string;
  priceUSD: number;
  priceCredits: number;
  patentWorth: number;
  category: AssetCategory;
  providerType: ProviderType;
  lastUpdated: string;
  longDescription: string;
  icon: string;
  contributors: { name: string; weight: number; role: string; avatar: string; }[];
  reviews: { user: string; rating: number; comment: string; yieldImpact: string; date: string; }[];
  suggestions: { id: string; user: string; text: string; votes: number; }[];
  discussion: { user: string; text: string; timestamp: string; avatar: string; }[];
  stats: { yieldRate: string; trustScore: number; loadImpact: string; version: string; syncHash: string; };
}

const CATEGORY_MAP: Record<AssetCategory, { color: string, icon: string, label: string, dna: string, desc: string }> = {
  WIDGETS: { color: 'text-primary', icon: 'grid_view', label: 'WIDGET', dna: 'border-primary', desc: 'Modular HUD & UI components' },
  THEMES: { color: 'text-cyan-400', icon: 'palette', label: 'THEME', dna: 'border-cyan-500', desc: 'Visual environment skins' },
  SCRIPTS: { color: 'text-purple-400', icon: 'code', label: 'LOGIC', dna: 'border-purple-500', desc: 'Functional backend kernels' },
  APPS: { color: 'text-green-400', icon: 'apps', label: 'APP', dna: 'border-green-500', desc: 'Full-stack sovereign tools' },
  '3D': { color: 'text-amber-500', icon: 'view_in_ar', label: '3D_MESH', dna: 'border-amber-600', desc: 'Geometric topology models' },
  AUDIO: { color: 'text-pink-400', icon: 'graphic_eq', label: 'AUDIO', dna: 'border-pink-500', desc: 'Sonic shards & haptic pulses' },
  VIDEO: { color: 'text-red-500', icon: 'movie', label: 'VIDEO', dna: 'border-red-600', desc: 'Temporal & VFX sequences' },
  SERVICES: { color: 'text-slate-400', icon: 'support_agent', label: 'SERVICE', dna: 'border-slate-500', desc: 'Peer-to-peer industrial aid' }
};

const PROVIDER_UI: Record<ProviderType, { label: string, color: string, badgeIcon: string, border: string, aura: string, bg: string }> = {
  XIBALBA_OFFICIAL: { label: 'ROOT_SEED', color: 'text-primary', badgeIcon: 'verified', border: 'border-primary/40', aura: 'shadow-[0_0_50px_rgba(184,134,11,0.25)]', bg: 'bg-primary/5' },
  FEATURED: { label: 'FEATURED', color: 'text-cyan-400', badgeIcon: 'star', border: 'border-cyan-400/40', aura: 'shadow-[0_0_30px_rgba(34,211,238,0.15)]', bg: 'bg-cyan-400/5' },
  SPONSORED: { label: 'SPONSORED', color: 'text-amber-500', badgeIcon: 'bolt', border: 'border-amber-500/20', aura: '', bg: 'bg-amber-500/5' },
  COMMUNITY: { label: 'COMMUNITY_SHARD', color: 'text-emerald-400', badgeIcon: 'group', border: 'border-emerald-500/20', aura: 'shadow-[0_0_30px_rgba(16,185,129,0.1)]', bg: 'bg-emerald-500/5' }
};

const generateMarketPopulation = (): Asset[] => {
  const population: Asset[] = [];
  const categories: AssetCategory[] = ['WIDGETS', 'THEMES', 'SCRIPTS', 'APPS', '3D', 'AUDIO', 'VIDEO', 'SERVICES'];
  categories.forEach(cat => {
    for (let i = 0; i < 12; i++) {
      const isOfficial = i < 3;
      population.push({
        id: `${cat.slice(0,3)}-${i}`,
        title: `${cat} Shard 0x${i.toString(16).toUpperCase()}`,
        techName: `${cat}_KERNEL_0x${i}`,
        priceUSD: 89.00 + (i * 20),
        priceCredits: 8000 + (i * 1000),
        patentWorth: 1500000 + (Math.random() * 500000),
        category: cat,
        providerType: isOfficial ? 'XIBALBA_OFFICIAL' : (i >= 8 ? 'COMMUNITY' : 'FEATURED'),
        lastUpdated: '2024.05.20',
        longDescription: `This functional shard implements a non-destructive logic stack specifically engineered for the Xibalba Foundry. By decoupling the visual layer from the underlying vertex manifest, we achieve peak performance while maintaining 100% geometric parity. Compatible with Mainnet recursive yield protocols and #HallbergMaths standards.`,
        icon: CATEGORY_MAP[cat].icon,
        contributors: [
          { name: isOfficial ? 'XIBALBA_ARCHON' : 'OPERATOR_0x82', weight: 85, role: 'Lead Architect', avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${i}` },
          { name: 'FOUNDRY_DAO', weight: 15, role: 'Auditor', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=DAO' }
        ],
        reviews: [
          { user: 'Sovereign_Dev', rating: 5, comment: 'Standard-setting logic. Increased my component yield by 14%.', yieldImpact: '+14% CORE', date: '2d ago' },
          { user: 'Vector_Pro', rating: 4, comment: 'Solid build, optimized vertex count.', yieldImpact: 'Nominal', date: '1w ago' }
        ],
        suggestions: [
          { id: 's1', user: 'Point_God', text: 'Add auto-quantization for mobile viewports.', votes: 42 },
          { id: 's2', user: 'Heuristic_A1', text: 'Optimization for recursive nesting.', votes: 12 }
        ],
        discussion: [
          { user: 'Forge_Peer', text: 'Does this handle normalization out of the box?', timestamp: '1h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
          { user: 'Author_0x', text: 'Yes, version 2.4.2 includes the #Hallberg kernel.', timestamp: '45m ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' }
        ],
        stats: { 
          yieldRate: '+14.2%', trustScore: 0.9842, loadImpact: '0.12μ', version: '8.4.2', 
          syncHash: `0x${Math.random().toString(16).slice(2, 8).toUpperCase()}` 
        }
      });
    }
  });
  return population;
};

const MarketplaceNexus: React.FC<MarketplaceNexusProps> = ({ onClose, onSplit }) => {
  const [activeCategory, setActiveCategory] = useState<AssetCategory | 'ALL'>('ALL');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const assets = useMemo(() => generateMarketPopulation(), []);
  const selectedAsset = assets.find(a => a.id === selectedAssetId);
  const filteredAssets = useMemo(() => assets.filter(a => activeCategory === 'ALL' || a.category === activeCategory), [assets, activeCategory]);
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: assets.length };
    assets.forEach(a => { counts[a.category] = (counts[a.category] || 0) + 1; });
    return counts;
  }, [assets]);

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => setIsWithdrawing(false), 2000);
  };

  return (
    <div className="flex-1 bg-obsidian-950 flex flex-col h-full overflow-hidden animate-in fade-in duration-500 relative">
      
      {/* 1. MACHINED HEADER - AS PER REFERENCE SCREENSHOT */}
      <div className="shrink-0 flex flex-col z-[100] bg-[#0c0e10]">
        {/* Top Interaction Row: Close and Split icons positioned exactly as per screenshot */}
        <div className="h-10 flex justify-end items-center px-4 gap-4 bg-[#08090a]">
           <button onClick={() => onSplit?.()} className="size-8 flex items-center justify-center text-obsidian-600 hover:text-primary transition-all">
              <span className="material-symbols-outlined !text-[18px]">vertical_split</span>
           </button>
           <button onClick={() => onClose?.()} className="size-8 flex items-center justify-center text-obsidian-600 hover:text-red-500 transition-all">
              <span className="material-symbols-outlined !text-[20px]">close</span>
           </button>
        </div>

        {/* Action Row: Primary Yield Telemetry and Button */}
        <div className="h-24 border-t border-primary/20 flex items-center justify-between px-10">
          <div className="flex items-center gap-10">
            <div className="flex flex-col group cursor-pointer" onClick={() => setSelectedAssetId(null)}>
              <span className="text-[20px] font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">Forge_Exchange</span>
              <span className="text-[8px] font-mono text-primary uppercase tracking-[0.4em] mt-2 font-bold italic leading-none">SOVEREIGN_ECONOMIC_NEXUS</span>
            </div>
            <div className="h-10 w-px bg-white/10 mx-2"></div>
            <div className="relative group max-w-sm">
               <input type="text" placeholder="Search industrial manifests..." className="w-80 bg-black/40 border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-[12px] font-mono text-white placeholder-obsidian-700 outline-none focus:border-primary/40 transition-all" />
               <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-700 text-sm">search</span>
            </div>
          </div>

          {/* YIELD TELEMETRY & WITHDRAW ACTION */}
          <div className="flex items-center">
             <div className="flex flex-col items-end pr-10 group cursor-help">
                <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-widest leading-none mb-1.5 opacity-60">Current_Yield</span>
                <span className="text-[24px] font-black text-primary italic tabular-nums leading-none tracking-tighter">142,850.12 CORE</span>
             </div>
             <div className="w-px h-12 bg-white/10"></div>
             <div className="pl-10">
                <button 
                  onClick={handleWithdraw}
                  className={`h-16 px-14 rounded-[16px] text-[13px] font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center gap-4 relative overflow-hidden group ${isWithdrawing ? 'bg-white text-black shadow-primary/40' : 'bg-primary text-black hover:shadow-primary/20'}`}
                >
                   {isWithdrawing && <div className="absolute inset-0 bg-primary/20 animate-ping"></div>}
                   <span className="relative z-10">{isWithdrawing ? 'SETTLING_0x...' : 'WITHDRAW_YIELD'}</span>
                   {!isWithdrawing && <span className="material-symbols-outlined !text-[20px] group-hover:translate-x-1 transition-transform">bolt</span>}
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 2. SIDEBAR - REGISTRY SORT */}
        <div className="w-80 border-r border-obsidian-800 bg-obsidian-900/30 flex flex-col shrink-0 z-40 overflow-y-auto custom-scrollbar">
          <div className="p-8 space-y-12">
            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-obsidian-400 uppercase tracking-[0.3em]">Registry_Sort</h3>
              <div className="space-y-1.5">
                {['ALL', 'WIDGETS', 'THEMES', 'SCRIPTS', 'APPS', '3D', 'AUDIO', 'VIDEO', 'SERVICES'].map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat as any)} className={`w-full text-left px-5 py-3.5 rounded-[8px] text-[10px] font-bold uppercase tracking-tight transition-all border flex justify-between items-center ${activeCategory === cat ? 'bg-primary/10 border-primary/20 text-primary' : 'text-obsidian-400 hover:text-white border-transparent hover:bg-obsidian-800'}`}>
                    <span>{cat.replace('_', ' ')}</span>
                    <span className="text-[9px] font-mono opacity-50">({categoryCounts[cat] || 0})</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary text-sm">menu_book</span>
                 <h3 className="text-[10px] font-black text-obsidian-200 uppercase tracking-[0.3em]">Marketplace_Legend</h3>
              </div>
              <div className="space-y-8">
                 <div className="space-y-4">
                    <span className="text-[8px] font-mono text-obsidian-500 uppercase tracking-widest block">Root_Hierarchy</span>
                    <div className="space-y-4">
                       <div className="flex items-start gap-4">
                          <div className="size-10 rounded-lg bg-primary/10 border border-primary/40 flex items-center justify-center shrink-0">
                             <XibalbaIdentity size={24} className="text-primary" />
                          </div>
                          <div className="flex flex-col gap-1">
                             <span className="text-[9px] font-black text-primary uppercase tracking-widest">ROOT_SEED</span>
                             <p className="text-[8px] text-obsidian-500 italic leading-snug">Original Xibalba Foundry components. 99.9% Trust.</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </section>
          </div>
        </div>

        {/* 3. MAIN MARKET VIEWPORT */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 relative z-30">
          {selectedAsset ? (
            /* DETAILED PRODUCT DOSSIER RESTORATION */
            <div className="p-12 pb-48 animate-in slide-in-from-right-10 duration-500 max-w-7xl mx-auto space-y-20">
               <button onClick={() => setSelectedAssetId(null)} className="flex items-center gap-3 text-[11px] font-black text-obsidian-400 hover:text-primary transition-colors mb-14 uppercase tracking-widest group">
                 <span className="material-symbols-outlined text-lg group-hover:-translate-x-2 transition-transform">arrow_back</span>
                 RETURN_TO_REGISTRY
               </button>

               <div className="flex justify-between items-start gap-12">
                  <div className="flex gap-12 items-center">
                     <div className={`size-48 rounded-[32px] bg-obsidian-900 border-2 ${PROVIDER_UI[selectedAsset.providerType].border} ${PROVIDER_UI[selectedAsset.providerType].aura} flex items-center justify-center ${CATEGORY_MAP[selectedAsset.category].color} shadow-2xl relative overflow-hidden group`}>
                        <div className={`absolute inset-0 opacity-10 bg-current`}></div>
                        {selectedAsset.providerType === 'XIBALBA_OFFICIAL' ? (
                          <XibalbaIdentity size={100} className="relative z-10 transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <span className="material-symbols-outlined text-[96px] relative z-10 group-hover:scale-110 transition-transform duration-700">{selectedAsset.icon}</span>
                        )}
                     </div>
                     <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <span className={`px-4 py-1.5 bg-white/5 border-l-2 ${CATEGORY_MAP[selectedAsset.category].dna} rounded-[4px] text-[10px] font-black ${CATEGORY_MAP[selectedAsset.category].color} uppercase italic`}>{selectedAsset.category}</span>
                           <div className={`flex items-center gap-2 px-3 py-1 bg-black/40 rounded-[4px] border ${PROVIDER_UI[selectedAsset.providerType].border} ${PROVIDER_UI[selectedAsset.providerType].color}`}>
                              <span className="material-symbols-outlined !text-[12px]">{PROVIDER_UI[selectedAsset.providerType].badgeIcon}</span>
                              <span className="text-[10px] font-black uppercase tracking-widest">{PROVIDER_UI[selectedAsset.providerType].label}</span>
                           </div>
                        </div>
                        <h2 className="text-8xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedAsset.title}</h2>
                        <div className="flex items-center gap-10 opacity-60">
                           <span className="text-[12px] font-mono text-obsidian-300 uppercase">SYNC_HASH: {selectedAsset.stats.syncHash}</span>
                           <span className="text-[12px] font-mono text-obsidian-300 uppercase tracking-widest">UPDATED: {selectedAsset.lastUpdated}</span>
                        </div>
                     </div>
                  </div>
                  <div className="p-10 bg-obsidian-900 border border-white/5 rounded-xi flex flex-col items-end gap-1 shadow-2xl">
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic opacity-80 leading-none">Full_License_Protocol</span>
                     <div className="text-7xl font-black text-white italic tabular-nums leading-none tracking-tighter">${selectedAsset.priceUSD.toFixed(2)}</div>
                  </div>
               </div>

               {/* DETAILED GRIDS */}
               <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-4 space-y-10">
                    <div className="bg-obsidian-900 border border-white/5 rounded-[24px] p-10 space-y-10">
                       <span className="text-[11px] font-black text-obsidian-300 uppercase tracking-[0.3em] border-b border-white/5 pb-5 block">IP_Contributor_Cap_Table</span>
                       <div className="space-y-6">
                          {selectedAsset.contributors.map(c => (
                            <div key={c.name} className="flex items-center justify-between group">
                               <div className="flex flex-col">
                                  <span className="text-[12px] font-black text-white uppercase italic leading-none">{c.name}</span>
                                  <span className="text-[9px] text-obsidian-500 uppercase font-bold tracking-widest mt-1">{c.role}</span>
                               </div>
                               <span className="text-[14px] font-black text-primary italic tabular-nums">{c.weight}%</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="col-span-5 space-y-10">
                    <div className="bg-obsidian-900 border border-white/5 rounded-[24px] p-12 space-y-10 relative overflow-hidden">
                       <span className="text-[11px] font-black text-primary uppercase tracking-[0.5em] border-b border-primary/20 pb-5 block">Functional_Logic_Dossier</span>
                       <p className="text-2xl text-white/80 leading-relaxed italic font-medium">"{selectedAsset.longDescription}"</p>
                    </div>
                  </div>

                  <div className="col-span-3 space-y-10">
                    <div className="bg-obsidian-900 border border-white/5 rounded-[24px] p-10 flex flex-col gap-10 shadow-xl">
                       <span className="text-[11px] font-black text-obsidian-300 uppercase tracking-[0.3em] border-b border-white/5 pb-5 block leading-none">Verified_Reviews</span>
                       <div className="space-y-10 overflow-y-auto custom-scrollbar pr-4 max-h-[400px]">
                          {selectedAsset.reviews.map((r, idx) => (
                            <div key={idx} className="space-y-4 border-b border-white/5 pb-6 last:border-none">
                               <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-black text-white uppercase italic">{r.user}</span>
                                  <span className="text-[9px] font-black text-green-500 uppercase">{r.yieldImpact}</span>
                               </div>
                               <p className="text-[12px] text-obsidian-400 italic leading-relaxed">"{r.comment}"</p>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          ) : (
            /* MAIN MARKET LIST STREAM */
            <div className="p-12 pb-48 max-w-[1700px] mx-auto space-y-16">
               <div className="flex justify-between items-end border-b border-obsidian-800 pb-10">
                 <div className="space-y-4">
                   <span className="text-[18px] font-black text-primary uppercase tracking-[0.8em] italic leading-none">Exchange_Mainnet_Stream</span>
                   <p className="text-[13px] text-obsidian-400 uppercase italic font-bold leading-none">Displaying {filteredAssets.length} industrial seeds // Status: Online</p>
                 </div>
                 <select className="bg-obsidian-900 border border-white/10 rounded-lg px-8 py-3.5 text-primary italic outline-none cursor-pointer font-black min-w-[320px] shadow-2xl">
                    <option>HIGHEST RECURSIVE YIELD</option>
                    <option>NEWEST FOUNDRY RELEASES</option>
                 </select>
               </div>

               <div className="bg-obsidian-900 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
                 <div className="grid grid-cols-12 px-12 py-8 bg-obsidian-850 border-b border-white/5 text-[11px] font-black text-obsidian-300 uppercase tracking-widest italic">
                   <div className="col-span-5">Identity_Manifest // Origin</div>
                   <div className="col-span-2 text-center">Class</div>
                   <div className="col-span-2 text-center">Price (CORE)</div>
                   <div className="col-span-1 text-center">Trust</div>
                   <div className="col-span-2 text-right">Action</div>
                 </div>
                 <div className="divide-y divide-white/5">
                   {filteredAssets.map(asset => (
                     <div key={asset.id} onClick={() => setSelectedAssetId(asset.id)} className={`grid grid-cols-12 px-12 py-12 items-center hover:bg-white/[0.04] transition-all cursor-pointer group relative border-l-[6px] ${CATEGORY_MAP[asset.category].dna}`}>
                       <div className="col-span-5 flex items-center gap-12">
                         <div className={`size-24 rounded-[20px] bg-obsidian-850 border-2 ${PROVIDER_UI[asset.providerType].border} flex items-center justify-center ${CATEGORY_MAP[asset.category].color} group-hover:scale-105 transition-all shadow-xl relative overflow-hidden`}>
                            {asset.providerType === 'XIBALBA_OFFICIAL' ? <XibalbaIdentity size={54} /> : <span className="material-symbols-outlined text-[48px]">{asset.icon}</span>}
                         </div>
                         <div className="flex flex-col gap-2">
                           <span className="text-[26px] font-black text-white uppercase italic group-hover:text-primary transition-colors tracking-tighter leading-none">{asset.title}</span>
                           <span className="text-[12px] font-mono text-obsidian-600 uppercase tracking-tighter italic font-bold">{asset.techName} // {PROVIDER_UI[asset.providerType].label}</span>
                         </div>
                       </div>
                       <div className="col-span-2 text-center">
                          <span className={`px-6 py-2 bg-obsidian-800 rounded-[8px] text-[10px] font-black uppercase border border-white/5 ${CATEGORY_MAP[asset.category].color}`}>{asset.category}</span>
                       </div>
                       <div className="col-span-2 text-center">
                          <span className="text-[28px] font-black text-white italic tabular-nums leading-none tracking-tighter">{asset.priceCredits.toLocaleString()} <span className="text-xs opacity-40 uppercase">Core</span></span>
                       </div>
                       <div className="col-span-1 text-center">
                          <span className="text-[14px] font-black italic tabular-nums text-green-500">{(asset.stats.trustScore * 100).toFixed(1)}%</span>
                       </div>
                       <div className="col-span-2 text-right">
                          <button className="px-12 py-4 bg-obsidian-800 border border-white/10 rounded-xl text-[11px] font-black text-white hover:bg-primary hover:text-black transition-all uppercase tracking-widest whitespace-nowrap">
                             VIEW_DOSSIER
                          </button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER - ECONOMIC TELEMETRY */}
      <div className="h-10 shrink-0 bg-obsidian-950 border-t border-obsidian-800 px-10 flex items-center justify-between z-50">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="size-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_green]"></div>
            <span className="text-[9px] font-black text-obsidian-600 uppercase tracking-[0.4em] leading-none">Mainnet_Stability: NOMINAL</span>
          </div>
          <div className="h-4 w-px bg-obsidian-800"></div>
          <span className="text-[9px] font-mono text-obsidian-700 italic font-bold tracking-widest uppercase italic leading-none">The Foundry solves the math, you solve the product.</span>
        </div>
        <span className="text-[9px] font-black text-primary uppercase tracking-[0.5em] italic leading-none">V_Financial_v0.8.4_S</span>
      </div>
    </div>
  );
};

export default MarketplaceNexus;
