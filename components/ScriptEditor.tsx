
import React, { useState } from 'react';
import { FileShard } from '../types';

interface ScriptEditorProps {
  activeShard?: FileShard;
  onSave: (content: string) => void;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ activeShard, onSave }) => {
  const [content, setContent] = useState<string>(`INT. NEURAL_VOICE_HUB - NIGHT\n\nThe OPERATOR stares into the glowing chassis of the VectorForge. \n\nOPERATOR\n(whispering)\nWe need to forge a new path. \n\nAI_KERNEL\nSynthesis protocol engaged. Awaiting directive.`);

  return (
    <div className="flex-1 flex flex-col bg-obsidian-950 animate-in fade-in duration-700 overflow-hidden">
      <div className="h-14 border-b border-white/5 bg-obsidian-900/50 flex items-center justify-between px-8">
         <div className="flex flex-col">
            <span className="text-[7px] font-black text-obsidian-500 uppercase tracking-widest leading-none mb-1">SCRIPT_KERNEL</span>
            <span className="text-[12px] font-black text-obsidian-300 uppercase tracking-tight italic leading-none">{activeShard?.name || 'MANIFEST_BUFFER'}</span>
         </div>
         <div className="flex items-center gap-4">
            <button className="px-6 py-2 bg-obsidian-800 border border-white/5 text-primary text-[9px] font-black uppercase rounded-xi hover:bg-primary/20 transition-all">AI_Complete</button>
            <button onClick={() => onSave(content)} className="px-6 py-2 bg-primary/20 border border-primary/40 text-primary text-[9px] font-black uppercase rounded-xi shadow-xl">Save_Shard</button>
         </div>
      </div>

      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-black/40 flex justify-center">
         <div className="w-full max-w-3xl bg-obsidian-900 text-obsidian-300 p-20 shadow-[0_50px_150px_rgba(0,0,0,1)] border border-white/5 min-h-[1000px] font-mono text-[14px] leading-relaxed relative rounded-xi-lg">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/10"></div>
            <textarea 
               value={content}
               onChange={(e) => setContent(e.target.value)}
               className="w-full h-full bg-transparent border-none outline-none resize-none overflow-hidden text-obsidian-300 placeholder-obsidian-700 font-mono"
               style={{ lineHeight: '1.6' }}
               spellCheck={false}
            />
            
            <div className="mt-16 p-8 border-l-2 border-primary/40 bg-primary/5 rounded-r-xi italic text-obsidian-500 text-[12px] leading-relaxed">
               <span className="text-[9px] font-black text-primary uppercase block mb-2 tracking-widest">[CONDUCTOR_SUGGESTION]</span>
               Inject a recursive sequence where the VectorForge chassis exhibits 0.12μ luminance fluctuations as the Operator performs the final handshake.
            </div>
         </div>
      </div>
    </div>
  );
};

export default ScriptEditor;
