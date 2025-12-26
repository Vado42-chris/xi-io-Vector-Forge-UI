
import React, { useState } from 'react';
import { VectorLayer, AppState } from '../types';

interface RightSidebarProps {
  layers: VectorLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onUpdateProperty: (id: string, property: string, value: any) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onReorderLayer: (id: string, direction: 'up' | 'down') => void;
  onRenameLayer: (id: string, newName: string) => void;
  snapshots: { id: string; name: string; svg: string; timestamp: number }[];
  onRestoreSnapshot: (svg: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  layers, selectedLayerId, onSelectLayer, onToggleVisibility, onToggleLock, onUpdateProperty, onDeleteLayer, onRenameLayer, snapshots, onRestoreSnapshot
}) => {
  const selectedLayer = layers.find(l => l.id === selectedLayerId);
  const [activeRightTab, setActiveRightTab] = useState<'inspector' | 'checkpoints'>('inspector');

  return (
    <aside className="w-[380px] shrink-0 flex flex-col border-l border-white/5 bg-obsidian-100 relative z-20">
      <div className="flex bg-obsidian-200/50 h-14 border-b border-white/5">
        {[
          { id: 'inspector', label: 'Object', icon: 'deployed_code' },
          { id: 'checkpoints', label: 'History', icon: 'history' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveRightTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative ${
              activeRightTab === tab.id ? 'text-primary' : 'text-obsidian-500 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] opacity-70">{tab.icon}</span>
            {tab.label}
            {activeRightTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary xi-popping-glow"></div>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-obsidian-200/20">
        {activeRightTab === 'inspector' ? (
          <div className="space-y-10 animate-in slide-in-from-right-4">
            {selectedLayer ? (
              <>
                <div className="flex items-center justify-between">
                   <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-primary font-black uppercase tracking-[0.3em]">Node Address</span>
                      <input 
                        className="bg-transparent border-none text-base font-bold text-white focus:ring-0 p-0 w-full tracking-tight"
                        value={selectedLayer.name}
                        onChange={(e) => onRenameLayer(selectedLayer.id, e.target.value)}
                      />
                   </div>
                   <button onClick={() => onDeleteLayer(selectedLayer.id)} className="size-11 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl active:scale-90">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                   </button>
                </div>
                
                <div className="space-y-8">
                  <div className="xi-card p-6 rounded-2xl space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="relative size-16 rounded-2xl overflow-hidden xi-inset ring-2 ring-white/5 group cursor-crosshair">
                        <input 
                          type="color" value={selectedLayer.color}
                          onChange={(e) => onUpdateProperty(selectedLayer.id, 'color', e.target.value)}
                          className="absolute inset-0 size-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 flex-1">
                        <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-widest">Tint Spectrum</span>
                        <div className="flex items-center gap-2">
                           <span className="text-sm text-white font-mono font-black">{selectedLayer.color.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 pt-2">
                       <div className="flex flex-col gap-5">
                          <div className="flex justify-between items-center text-[10px] font-black text-obsidian-500 uppercase tracking-widest">
                            <span>Stroke Magnitude</span>
                            <span className="text-primary font-mono">{selectedLayer.strokeWidth}px</span>
                          </div>
                          <div className="relative xi-inset h-3 rounded-full flex items-center px-1">
                            <input 
                              type="range" min="0" max="100" value={selectedLayer.strokeWidth}
                              onChange={(e) => onUpdateProperty(selectedLayer.id, 'strokeWidth', parseInt(e.target.value))}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="h-1.5 bg-primary rounded-full" style={{ width: `${selectedLayer.strokeWidth}%` }}></div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Kinetic Rigging Module */}
                  <div className="xi-card p-6 rounded-2xl">
                     <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Kinetic Rigging</span>
                        <div className={`px-2 py-0.5 rounded text-[8px] font-mono ${selectedLayer.nodes.some(n => n.isKinetic) ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white/40'}`}>
                           {selectedLayer.nodes.some(n => n.isKinetic) ? 'ARMED' : 'STATIC'}
                        </div>
                     </div>
                     <p className="text-[10px] text-obsidian-500 mb-6 leading-relaxed">Assign kinetic properties to specific path nodes to enable template-based physics interpolation.</p>
                     <div className="grid grid-cols-2 gap-4">
                        <button className="flex flex-col items-center gap-2 p-4 rounded-xl xi-inset border border-white/5 hover:border-primary group transition-all">
                           <span className="material-symbols-outlined text-obsidian-500 group-hover:text-primary">bolt</span>
                           <span className="text-[8px] font-black uppercase text-white">Auto-Rig</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-4 rounded-xl xi-inset border border-white/5 hover:border-primary group transition-all">
                           <span className="material-symbols-outlined text-obsidian-500 group-hover:text-primary">lock</span>
                           <span className="text-[8px] font-black uppercase text-white">Freeze All</span>
                        </button>
                     </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-center px-10 opacity-30 select-none">
                <div className="size-28 rounded-full bg-obsidian-200 xi-inset flex items-center justify-center mb-10 shadow-inner group">
                  <span className="material-symbols-outlined text-5xl text-primary animate-pulse">construction</span>
                </div>
                <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-white mb-3">Idle Registry</h4>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 animate-in slide-in-from-left-4">
             {snapshots.map(snap => (
               <div key={snap.id} onClick={() => onRestoreSnapshot(snap.svg)} className="group flex items-center justify-between p-5 rounded-2xl xi-inset hover:border-primary/50 transition-all cursor-pointer">
                  <div className="flex-1 truncate pr-4">
                     <span className="text-[13px] font-bold text-white group-hover:text-primary">{snap.name}</span>
                     <span className="block text-[9px] font-mono text-obsidian-500">{new Date(snap.timestamp).toLocaleString()}</span>
                  </div>
                  <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100">restore</span>
               </div>
             ))}
          </div>
        )}
      </div>

      <div className="h-[360px] shrink-0 flex flex-col bg-obsidian-200 border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.4)]">
        <div className="h-14 flex items-center justify-between px-6 border-b border-white/5">
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Geometrical Layers</span>
          <span className="px-3 py-1 bg-obsidian-300 rounded text-primary text-[10px] font-black mono">{layers.length} UNT</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {layers.map(layer => (
            <div 
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${selectedLayerId === layer.id ? 'bg-primary/5 border-primary/40' : 'border-transparent hover:bg-white/[0.04]'}`}
            >
              <div className="flex flex-col gap-2.5 opacity-30 group-hover:opacity-100">
                <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }} className={`material-symbols-outlined text-[18px] ${layer.visible ? 'text-primary' : 'text-white'}`}>{layer.visible ? 'visibility' : 'visibility_off'}</button>
              </div>
              <div className="flex-1 truncate">
                 <span className={`text-[12px] font-bold block truncate ${selectedLayerId === layer.id ? 'text-primary' : 'text-white'}`}>{layer.name}</span>
                 <span className="text-[9px] font-mono text-obsidian-500 uppercase">{layer.nodes.length} Nodes</span>
              </div>
              <div className="size-7 rounded-lg shadow-inner ring-2 ring-black/20" style={{ backgroundColor: layer.color }} />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
