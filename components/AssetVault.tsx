
import React, { useState } from 'react';
import { FileShard, ShardType } from '../types';

interface AssetVaultProps {
  shards: FileShard[];
  onImport: (type: ShardType) => void;
  onDelete: (id: string) => void;
}

const AssetVault: React.FC<AssetVaultProps> = ({ shards, onImport, onDelete }) => {
  const [filter, setFilter] = useState<string>('ALL');

  return (
    <div className="flex-1 flex flex-col bg-obsidian-950 animate-in fade-in duration-500 overflow-hidden">
      <div className="h-12 border-b border-white/[0.01] bg-obsidian-900 flex items-center justify-between px-6">
        <div className="bg-black/20 border border-white/[0.02] rounded-lg p-1 flex">
           {['ALL', 'vector', 'script', 'audio', 'video'].map(f => (
             <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded text-[8px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white' : 'text-obsidian-600 hover:text-obsidian-300'}`}>
               {f}
             </button>
           ))}
        </div>
        <button onClick={() => onImport('vector')} className="px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded text-[9px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all">Ingest_Shard</button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
         <div className="grid grid-cols-4 gap-6">
            {shards.filter(s => filter === 'ALL' || s.type === filter).map(shard => (
              <div key={shard.id} className="bg-obsidian-900 border border-white/[0.02] p-6 rounded-xi flex flex-col gap-6 group hover:border-primary/20 transition-all relative overflow-hidden">
                 <div className="flex justify-between items-start">
                    <div className="size-10 rounded bg-black/40 border border-white/5 flex items-center justify-center text-primary/40">
                       <span className="material-symbols-outlined text-[18px]">insert_drive_file</span>
                    </div>
                    <span className="text-[7px] font-mono text-obsidian-700 uppercase">{shard.size}</span>
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-[11px] font-black text-obsidian-100 uppercase tracking-tight truncate">{shard.name}</h4>
                    <p className="text-[7px] font-mono text-obsidian-600 uppercase tracking-widest italic">{shard.type}</p>
                 </div>
                 <div className="mt-auto pt-4 border-t border-white/[0.01] flex justify-between">
                    <span className="text-[8px] font-black text-obsidian-600 uppercase cursor-pointer hover:text-primary transition-colors">Inspect</span>
                    <button onClick={() => onDelete(shard.id)} className="material-symbols-outlined text-[14px] text-red-900/40 hover:text-red-500 transition-colors">delete</button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AssetVault;
