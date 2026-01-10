
import React, { useState } from 'react';

interface MarketBrowserProps {
  onClose: () => void;
  credits: number;
}

const MarketBrowser: React.FC<MarketBrowserProps> = ({ onClose, credits }) => {
  const [filter, setFilter] = useState('ALL_ASSETS');

  const assets = [
    { id: 'S1', name: 'NEON_CORE_SVG', price: 1200, category: 'VECTOR', type: 'High-Fidelity' },
    { id: 'S2', name: 'FLUX_PARTICLE_EMITTER', price: 4500, category: 'LOGIC', type: 'Physics' },
    { id: 'S3', name: 'CYBER_FONT_MANIFOLD', price: 800, category: 'GLYPH', type: 'Dynamic' },
    { id: 'S4', name: 'GRAVITY_RIG_V2', price: 3200, category: 'SKELETON', type: 'Rigging' },
    { id: 'S5', name: 'LUX_VOLUMETRIC_PACK', price: 2100, category: 'LIGHT', type: 'Lighting' },
    { id: 'S6', name: 'NOISE_DISPLACER_HUB', price: 1500, category: 'MODIFIER', type: 'Generator' },
  ];

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-obsidian-100 border border-white/10 rounded-[40px] shadow-[0_80px_200px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden h-[80vh]">
        
        {/* MARKET HEADER */}
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
           <div className="flex items-center gap-8">
              <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                 <span className="material-symbols-outlined text-primary text-[40px]">shopping_bag</span>
              </div>
              <div className="space-y-1">
                 <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">Asset_Inventory_Market</h2>
                 <p className="text-[10px] font-mono text-obsidian-500 uppercase tracking-[0.4em]">Browsing Archive: Sovereign_Global_Net</p>
              </div>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="px-8 py-3 bg-black/40 rounded-2xl border border-white/10 flex flex-col items-end">
                 <span className="text-[7px] font-mono text-obsidian-600 uppercase tracking-widest">SOVEREIGN_WALLET</span>
                 <span className="text-xl font-black text-primary mono tabular-nums">{credits.toLocaleString()} <span className="text-[9px] opacity-40 italic">CORE</span></span>
              </div>
              <button onClick={onClose} className="size-12 rounded-full hover:bg-white/10 flex items-center justify-center transition-all border border-white/10">
                 <span className="material-symbols-outlined text-obsidian-400">close</span>
              </button>
           </div>
        </div>

        {/* MARKET CONTENT */}
        <div className="flex-1 flex overflow-hidden">
           {/* CATEGORIES SIDEBAR */}
           <div className="w-64 border-r border-white/5 p-6 space-y-2 bg-black/10">
              {['ALL_ASSETS', 'VECTOR', 'LOGIC', 'GLYPH', 'SKELETON', 'MODIFIERS'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`w-full text-left px-5 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-primary text-white shadow-xl' : 'text-obsidian-500 hover:text-white hover:bg-white/5'}`}
                >
                  {cat}
                </button>
              ))}
           </div>

           {/* ASSET GRID */}
           <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-obsidian-200">
              <div className="grid grid-cols-3 gap-6">
                 {assets.map(asset => (
                   <div key={asset.id} className="group p-6 bg-obsidian-100 rounded-[32px] border border-white/5 hover:border-primary/40 transition-all flex flex-col gap-8 relative overflow-hidden shadow-lg hover:shadow-primary/5">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                         <span className="material-symbols-outlined text-[100px] text-white font-black">{asset.category === 'VECTOR' ? 'polyline' : 'hub'}</span>
                      </div>
                      
                      <div className="flex justify-between items-start relative z-10">
                         <div className="size-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">{asset.category === 'VECTOR' ? 'polyline' : asset.category === 'LOGIC' ? 'code_blocks' : 'extension'}</span>
                         </div>
                         <div className="px-3 py-1 bg-white/5 rounded-md text-[7px] font-mono text-obsidian-500 uppercase tracking-widest border border-white/5">
                            {asset.type}
                         </div>
                      </div>

                      <div className="space-y-1 relative z-10">
                         <h4 className="text-[13px] font-black text-white uppercase tracking-tight">{asset.name}</h4>
                         <p className="text-[9px] font-mono text-obsidian-600 uppercase tracking-widest">{asset.id} // SECURE_SHARD</p>
                      </div>

                      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                         <div className="flex flex-col">
                            <span className="text-[7px] font-mono text-obsidian-600 uppercase">PRICE_KERN</span>
                            <span className="text-[14px] font-black text-primary mono">{asset.price.toLocaleString()}</span>
                         </div>
                         <button className="px-6 py-2.5 bg-white/5 hover:bg-primary text-obsidian-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/10 hover:border-primary">
                            Inject_Shard
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* MARKET FOOTER */}
        <div className="p-8 border-t border-white/5 bg-obsidian-300 flex justify-between items-center">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_green]"></div>
                 <span className="text-[9px] font-black text-obsidian-500 uppercase tracking-[0.2em]">Connection_Stable</span>
              </div>
              <div className="h-4 w-px bg-white/5"></div>
              <span className="text-[9px] font-mono text-obsidian-600 italic">"Injecting shards will immediately update your local Project Manifest."</span>
           </div>
           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Forge_Nexus_Marketplace_v0.8</p>
        </div>
      </div>
    </div>
  );
};

export default MarketBrowser;
