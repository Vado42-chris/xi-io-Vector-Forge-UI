
import React, { useState, useMemo } from 'react';
import { AssetCategory } from '../types';
import { XI_Button, XI_Telemetry, XI_StatusBadge } from './IndustrialPrimitives';
import { translate } from '../services/lexiconService';
import ShardManifestPage from './ShardManifestPage';

interface MarketplaceNexusProps {
  onInject: (shard: any) => void;
  verboseMode?: boolean;
  credits: number;
}

const CATEGORY_MAP: Record<AssetCategory, { color: string, icon: string, labelKey: string }> = {
  WIDGETS: { color: 'text-primary', icon: 'grid_view', labelKey: 'WIDGETS' },
  THEMES: { color: 'text-cyan-400', icon: 'palette', labelKey: 'THEMES' },
  SCRIPTS: { color: 'text-purple-400', icon: 'code', labelKey: 'SCRIPTS' },
  APPS: { color: 'text-green-400', icon: 'apps', labelKey: 'APPS' },
  '3D': { color: 'text-amber-500', icon: 'view_in_ar', labelKey: '3D' },
  AUDIO: { color: 'text-pink-400', icon: 'graphic_eq', labelKey: 'AUDIO' },
  VIDEO: { color: 'text-red-500', icon: 'movie', labelKey: 'VIDEO' },
  SERVICES: { color: 'text-slate-400', icon: 'support_agent', labelKey: 'SERVICES' }
};

const ASSET_PREVIEWS = [
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop',
];

const MarketplaceNexus: React.FC<MarketplaceNexusProps> = ({ onInject, verboseMode = false, credits }) => {
  const [activeCategory, setActiveCategory] = useState<AssetCategory | 'ALL'>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isImmersive, setIsImmersive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const assets = useMemo(() => {
    const population: any[] = [];
    const cats: AssetCategory[] = ['WIDGETS', 'THEMES', 'SCRIPTS', 'APPS', '3D', 'AUDIO', 'VIDEO', 'SERVICES'];
    cats.forEach((cat, cIdx) => {
      for (let i = 0; i < 6; i++) {
        population.push({
          id: `${cat}-${i}`,
          name: `${cat}_SHARD_0x${i}A`,
          plainName: `${cat} Component v${i+1}`,
          price: 8000 + (i * 1250.42),
          category: cat,
          author: i === 0 ? 'XIBALBA_ARCHON' : `OPERATOR_0x${i}F`,
          icon: CATEGORY_MAP[cat].icon,
          previewUrl: ASSET_PREVIEWS[(cIdx + i) % ASSET_PREVIEWS.length],
          stats: {
            nurbsComplexity: 1420 * (i + 1),
            logicWeight: (0.12 * (i + 1)).toFixed(2),
            latency: 4 + i,
            rating: 4.85 + (i * 0.02),
            reviews: 12 + (i * 42)
          },
          hashtags: [`#${cat}_Core`, '#v8_6', '#HallbergMaths'],
          stability: 0.992 + (i * 0.002),
          description: `High-fidelity ${cat} component engineered for recursive industrial yields. Verified for zero-latency injection.`,
          theory: `This component utilizes lim(δ→0) logic to minimize gaze friction across the Z-axis manifold.`
        });
      }
    });
    return population;
  }, []);

  const filteredAssets = assets.filter(a => {
    const matchesCat = activeCategory === 'ALL' || a.category === activeCategory;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.plainName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const selectedAsset = assets.find(a => a.id === selectedId);

  const formatValue = (val: number) => {
    return verboseMode ? Math.round(val).toLocaleString() : val.toFixed(2).toLocaleString();
  };

  if (isImmersive && selectedAsset) {
    return (
      <ShardManifestPage 
        asset={selectedAsset} 
        onClose={() => setIsImmersive(false)} 
        onInject={() => { onInject(selectedAsset); setIsImmersive(false); setSelectedId(null); }}
        verboseMode={verboseMode}
        formatValue={formatValue}
      />
    );
  }

  return (
    <div className="flex-1 bg-obsidian-950 flex flex-col h-full overflow-hidden animate-in fade-in duration-500 select-none paper-layer grain-coarse">
      {/* EXCHANGE HEADER */}
      <div className="h-20 shrink-0 bg-obsidian-850 border-b border-white/5 flex items-center justify-between px-10 z-[100] shadow-2xl paper-layer grain-fine">
        <div className="flex items-center gap-10 flex-1">
          <div className="flex flex-col shrink-0">
            <span className="text-[20px] font-black text-white uppercase italic tracking-tighter leading-none">
              {translate('FORGE_EXCHANGE', verboseMode)}
            </span>
            <span className="text-[8px] font-mono text-primary uppercase tracking-[0.4em] mt-2 font-bold italic opacity-60">
              {verboseMode ? 'SOVEREIGN GLOBAL MARKETPLACE' : 'SOVEREIGN_MARKET_NODE // CORE_UPLINK'}
            </span>
          </div>
          <div className="h-10 w-px bg-white/10"></div>
          <div className="max-w-md w-full relative group">
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder={verboseMode ? "SEARCH ITEMS..." : "SEARCH_ASSETS_0x..."}
               className="w-full bg-black/40 border border-white/10 rounded-xi px-10 py-3 text-[10px] font-mono text-primary uppercase tracking-widest placeholder:text-obsidian-700 outline-none focus:ring-1 focus:ring-primary/40 shadow-inner"
             />
             <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-600 group-focus-within:text-primary transition-colors text-[18px]">search</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-obsidian-600 uppercase tracking-widest leading-none mb-1 italic">
                {translate('CORE_YIELD', verboseMode)}
              </span>
              <span className="text-[22px] font-black text-primary italic tabular-nums leading-none tracking-tighter">
                {formatValue(credits)} CORE
              </span>
           </div>
           <XI_Button label={verboseMode ? "LIST ITEM" : "LIST_SHARD"} icon="add_business" variant="obsidian" size="sm" className="h-10" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* REGISTRY SORT SIDEBAR */}
        <aside className="w-56 shrink-0 bg-obsidian-900 border-r border-white/5 flex flex-col p-6 gap-8 paper-layer grain-fine overflow-y-auto no-scrollbar">
           <div className="space-y-4">
              <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.4em] italic">Registry_Sort</span>
              <nav className="space-y-1">
                 <button 
                  onClick={() => setActiveCategory('ALL')}
                  className={`w-full text-left px-4 py-2.5 rounded-xi text-[9px] font-black uppercase tracking-widest transition-all border ${activeCategory === 'ALL' ? 'bg-primary text-black border-primary shadow-xl' : 'text-obsidian-500 hover:text-white border-transparent hover:bg-white/5'}`}
                 >
                    ALL_SHARDS
                 </button>
                 {(Object.keys(CATEGORY_MAP) as AssetCategory[]).map(cat => (
                   <button 
                     key={cat} 
                     onClick={() => setActiveCategory(cat)}
                     className={`w-full text-left px-4 py-2.5 rounded-xi text-[9px] font-black uppercase tracking-widest transition-all border flex items-center justify-between group ${activeCategory === cat ? 'bg-primary text-black border-primary shadow-xl' : 'text-obsidian-500 hover:text-white border-transparent hover:bg-white/5'}`}
                   >
                      <span>{cat}</span>
                      <div className={`size-1 rounded-full ${activeCategory === cat ? 'bg-black shadow-[0_0_5px_black]' : 'bg-obsidian-800'}`}></div>
                   </button>
                 ))}
              </nav>
           </div>
           <div className="mt-auto p-5 bg-primary/5 border border-primary/20 rounded-xi space-y-3 shadow-inner">
              <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] block italic">Education_Bridge</span>
              <p className="text-[10px] text-obsidian-500 italic leading-relaxed">
                 Explore the **#HallbergMaths** behind top shards. Teaching curiosity is the highest ROI.
              </p>
           </div>
        </aside>

        {/* CONTENT AREA */}
        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#08090a]/40 p-10">
            <div className="grid gap-8 pb-32 grid-cols-[repeat(auto-fill,minmax(280px,1fr))] items-start">
              {filteredAssets.map(asset => (
                <div 
                  key={asset.id} 
                  onClick={() => setSelectedId(asset.id)}
                  className={`group bg-obsidian-900 border rounded-xi p-6 flex flex-col gap-5 transition-all relative overflow-hidden cursor-pointer shadow-2xl paper-layer grain-medium hover:translate-y-[-2px] active:scale-[0.99] ${selectedId === asset.id ? 'border-primary ring-1 ring-primary/20 shadow-[0_0_40px_var(--xi-accent-glow)]' : 'border-white/5 hover:border-white/20'}`}
                >
                  <div className="aspect-square bg-black/80 rounded-xi border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:xi-backlit transition-all duration-700">
                     <div className="absolute inset-0 canvas-grid opacity-10"></div>
                     <img src={asset.previewUrl} alt="Preview" className="absolute inset-0 size-full object-cover grayscale opacity-30 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000" />
                     <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent"></div>
                     <span className="material-symbols-outlined text-[48px] text-obsidian-700 group-hover:text-primary group-hover:scale-110 transition-all duration-500 relative z-10">{CATEGORY_MAP[asset.category as AssetCategory].icon}</span>
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-[15px] font-black text-white uppercase italic tracking-tighter truncate group-hover:text-primary transition-colors leading-none">{verboseMode ? asset.plainName : asset.name}</h4>
                     <div className="flex justify-between items-center opacity-60">
                        <p className="text-[8px] font-mono text-obsidian-500 uppercase tracking-widest leading-none">BY {asset.author}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[10px] text-primary">star</span>
                          <span className="text-[9px] font-black text-primary italic leading-none">{asset.stats.rating.toFixed(1)}</span>
                        </div>
                     </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-[7px] font-black text-obsidian-700 uppercase tracking-widest">PRICE_CORE</span>
                        <span className="text-[16px] font-black text-primary italic tabular-nums leading-none mt-1">{formatValue(asset.price)}</span>
                     </div>
                     <button className="size-9 rounded-xi bg-white/5 hover:bg-primary hover:text-black flex items-center justify-center transition-all border border-white/5 shadow-xl group/btn">
                        <span className="material-symbols-outlined text-[16px] group-hover/btn:scale-110 transition-transform">visibility</span>
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HARDENED TIER 2 DRAWER (FIXED-WIDTH SIBLING) */}
          {selectedAsset && (
            <aside className="w-[540px] shrink-0 bg-obsidian-850 border-l border-white/10 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.8)] animate-in slide-in-from-right-10 duration-500 paper-layer grain-fine z-[150]">
               <div className="h-16 shrink-0 border-b border-white/5 flex items-center justify-between px-8 bg-black/20">
                  <div className="flex items-center gap-4">
                     <div className="size-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_orange]"></div>
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">
                        {verboseMode ? 'Shard Technical Dossier' : `Shard_Dossier_0x${selectedAsset.id.slice(0,2)}`}
                     </span>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="size-9 rounded-xi hover:bg-white/5 flex items-center justify-center text-obsidian-600 hover:text-white transition-all border border-white/5">
                     <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
                  <div className="aspect-video bg-obsidian-900 rounded-xi border border-white/10 flex items-center justify-center relative overflow-hidden group/prev xi-backlit paper-layer grain-medium cursor-pointer" onClick={() => setIsImmersive(true)}>
                     <div className="absolute inset-0 canvas-grid opacity-20"></div>
                     <img src={selectedAsset.previewUrl} alt="Hero" className="absolute inset-0 size-full object-cover transition-transform duration-1000 group-hover/prev:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent"></div>
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/prev:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic border border-white/20 px-8 py-3 rounded-xi">Explore_Full_Manifest</span>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="flex justify-between items-start">
                        <div className="space-y-3">
                           <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight truncate max-w-[340px]">{verboseMode ? selectedAsset.plainName : selectedAsset.name}</h3>
                           <div className="flex flex-wrap gap-2">
                              {selectedAsset.hashtags.map((t: string) => (
                                <span key={t} className="text-[8px] font-mono text-primary italic font-black uppercase bg-primary/5 px-2.5 py-1 rounded-xi border border-primary/10">{t}</span>
                              ))}
                           </div>
                        </div>
                        <div className="p-3 bg-black/60 border border-white/10 rounded-xi flex flex-col items-center">
                           <span className="text-[7px] text-obsidian-600 uppercase font-black leading-none mb-1">STABILITY</span>
                           <span className="text-[16px] text-green-500 font-black leading-none">{(selectedAsset.stability * 100).toFixed(1)}%</span>
                        </div>
                     </div>
                     <div className="space-y-6">
                        <p className="text-[14px] text-obsidian-400 italic leading-relaxed">"{selectedAsset.description}"</p>
                        <div className="p-6 bg-primary/10 border border-primary/20 rounded-xi space-y-4 shadow-inner">
                           <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-primary text-[18px]">school</span>
                              <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] italic">Theory_of_Operation</span>
                           </div>
                           <p className="text-[12px] text-obsidian-100 italic leading-relaxed">"{selectedAsset.theory}"</p>
                           <button onClick={() => setIsImmersive(true)} className="text-[8px] font-black text-primary uppercase underline underline-offset-4 decoration-2 tracking-widest hover:text-white transition-colors">Open_Full_Portal</button>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 bg-black/40 rounded-xi border border-white/5 space-y-2 shadow-inner group hover:border-primary/20 transition-all">
                        <span className="text-[8px] font-black text-obsidian-600 uppercase tracking-[0.3em] italic block">{verboseMode ? 'Topology' : 'Topology_Sig'}</span>
                        <div className="text-[18px] font-black text-white italic tracking-tighter uppercase">{selectedAsset.stats.nurbsComplexity.toLocaleString()} NURBS</div>
                     </div>
                     <div className="p-6 bg-black/40 rounded-xi border border-white/5 space-y-2 shadow-inner group hover:border-primary/20 transition-all">
                        <span className="text-[8px] font-black text-obsidian-600 uppercase tracking-[0.3em] italic block">{verboseMode ? 'Logic Weight' : 'Logic_Overhead'}</span>
                        <div className="text-[18px] font-black text-primary italic tabular-nums leading-none">{selectedAsset.stats.logicWeight}μ</div>
                     </div>
                  </div>
               </div>

               <div className="p-10 border-t border-white/10 bg-black/40 flex flex-col gap-6 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                  <div className="flex justify-between items-end">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-obsidian-600 uppercase tracking-widest italic">{verboseMode ? 'PURCHASE FEE' : 'SETTLEMENT_LICENSE_FEE'}</span>
                        <span className="text-4xl font-black text-white italic tabular-nums leading-none tracking-tighter mt-2">{formatValue(selectedAsset.price)} CORE</span>
                     </div>
                     <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-black text-green-500 uppercase italic underline underline-offset-4 decoration-2">Audit_Stable</span>
                        <span className="text-[7px] font-mono text-obsidian-700 italic">SIG: 0x84_AUTH</span>
                     </div>
                  </div>
                  <XI_Button 
                     label={verboseMode ? "PURCHASE AND IMPORT" : "Execute_Injection_Protocol"} 
                     variant="primary" 
                     icon="bolt" 
                     className="w-full h-16 !rounded-xi text-[13px] shadow-primary/20" 
                     onClick={() => { onInject(selectedAsset); setSelectedId(null); }}
                  />
               </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceNexus;
