
import React, { useState, useEffect } from 'react';
import { AppState, WorkspaceRole, VectorLayer, VectorNode, Directive, Agent } from '../types';
import { getSmartSuggestions } from '../services/geminiService';

interface RightSidebarProps {
  state: AppState;
  role: WorkspaceRole;
  onUpdateModifier: (id: string, val: number) => void;
  onUpdateProperty: (id: string, prop: string, val: any) => void;
  onDeleteLayer: (id: string) => void;
  onRenameLayer: (id: string, name: string) => void;
  onRestoreSnapshot: (svg: string) => void;
  onExecuteSuggestion: (suggestion: any) => void;
  onSelectLayer: (id: string) => void;
  verboseMode?: boolean;
}

const Accordion: React.FC<{ label: string, icon: string, children: React.ReactNode, defaultOpen?: boolean, badge?: string | number }> = ({ label, icon, children, defaultOpen = false, badge }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/[0.02] transition-all bg-obsidian-950">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full h-11 px-5 flex items-center justify-between text-obsidian-400 hover:text-obsidian-200 group transition-colors">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[18px] group-hover:text-primary transition-colors opacity-40">{icon}</span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
          {badge !== undefined && <span className="px-2 py-0.5 bg-primary/5 rounded-md text-[8px] font-mono border border-primary/10 text-primary/60">{badge}</span>}
        </div>
        <span className={`material-symbols-outlined text-[16px] transition-transform opacity-20 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
      {isOpen && <div className="px-4 pb-6 pt-2 bg-black/20 animate-in fade-in duration-300">{children}</div>}
    </div>
  );
};

const MicroInput: React.FC<{ label: string, value: string | number, unit?: string, onChange?: (val: string) => void }> = ({ label, value, unit, onChange }) => (
  <div className="bg-obsidian-900 p-3 rounded-xi border border-white/[0.01] flex flex-col gap-1 group hover:border-primary/10 transition-all cursor-text">
     <span className="text-[6px] font-mono text-obsidian-500 uppercase group-hover:text-primary/60 transition-colors tracking-widest">{label}</span>
     <div className="flex items-baseline justify-between">
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange?.(e.target.value)}
          className="bg-transparent border-none p-0 text-[10px] font-mono font-bold text-obsidian-200 tracking-tight w-full outline-none"
        />
        {unit && <span className="text-[7px] font-bold text-obsidian-600 uppercase italic">{unit}</span>}
     </div>
  </div>
);

const PropertyGroup: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-4 pt-6 first:pt-2">
    <div className="flex items-center gap-3">
       <span className="text-[7px] font-black text-obsidian-600 uppercase tracking-[0.4em] whitespace-nowrap italic">{label}</span>
       <div className="h-px flex-1 bg-white/[0.01]"></div>
    </div>
    {children}
  </div>
);

const RightSidebar: React.FC<RightSidebarProps> = ({ state, role, onSelectLayer, onExecuteSuggestion, onUpdateProperty, verboseMode }) => {
  const selectedLayer = state.layers.find(l => l.id === state.selectedLayerId);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (selectedLayer) setSuggestions([]);
  }, [selectedLayer?.id]);

  const requestSuggestions = async () => {
    if (!selectedLayer) return;
    setIsAnalyzing(true);
    const results = await getSmartSuggestions("<svg></svg>", selectedLayer.id);
    setSuggestions(results);
    setIsAnalyzing(false);
  };

  const renderVectorInspector = () => (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-obsidian-950">
      <Accordion label={verboseMode ? "Layer_Stack" : "Manifest_Stack"} icon="layers" defaultOpen={true} badge={state.layers.length}>
         <div className="space-y-1">
            {state.layers.map(layer => (
              <div key={layer.id} onClick={() => onSelectLayer(layer.id)} className={`flex items-center justify-between p-3 rounded border transition-all cursor-pointer ${state.selectedLayerId === layer.id ? 'bg-primary/5 border-primary/20 text-obsidian-100' : 'bg-transparent border-transparent text-obsidian-500 hover:text-obsidian-300'}`}>
                 <div className="flex items-center gap-4">
                    <div className="size-2 rounded-full" style={{ backgroundColor: layer.color, opacity: 0.4 }}></div>
                    <span className="text-[9px] font-black uppercase tracking-widest">{layer.name}</span>
                 </div>
                 <span className="material-symbols-outlined text-sm opacity-10">visibility</span>
              </div>
            ))}
         </div>
      </Accordion>

      <Accordion label={verboseMode ? "Operation_Stack" : "Modifier_Stack"} icon="deployed_code" defaultOpen={!!selectedLayer}>
         {selectedLayer ? (
            <div className="space-y-2">
               <div className="p-3 bg-obsidian-900 rounded border border-white/[0.02] flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-primary/40 text-sm">auto_fix_high</span>
                     <span className="text-[9px] font-black text-obsidian-300 uppercase italic">AI_Harmonizer_V1</span>
                  </div>
                  <span className="material-symbols-outlined text-obsidian-700 text-sm group-hover:text-obsidian-400 cursor-pointer">close</span>
               </div>
               <button className="w-full py-2 border border-dashed border-white/[0.05] rounded text-[8px] font-black text-obsidian-600 uppercase tracking-widest hover:border-primary/20 hover:text-obsidian-300 transition-all">Add_Modifier_0x</button>
            </div>
         ) : (
           <div className="py-8 text-center opacity-10 text-[8px] font-black uppercase tracking-widest italic">Buffer_Empty</div>
         )}
      </Accordion>
      
      <Accordion label={verboseMode ? "Neural_Enhancement" : "AI_Refinement"} icon="auto_fix_high" defaultOpen={false}>
         {selectedLayer ? (
            <div className="space-y-4">
               {suggestions.length === 0 ? (
                 <button 
                  onClick={requestSuggestions}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-primary/5 border border-primary/10 rounded text-[9px] font-black text-primary/60 uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                 >
                   {isAnalyzing ? <span className="animate-spin material-symbols-outlined text-sm">cached</span> : <span className="material-symbols-outlined text-sm">psychology</span>}
                   Request_Logic
                 </button>
               ) : (
                 <div className="space-y-2">
                    {suggestions.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => onExecuteSuggestion(s)}
                        className="w-full text-left p-4 bg-obsidian-900 border border-white/[0.01] hover:border-primary/20 group transition-all rounded"
                      >
                         <div className="text-[9px] font-black text-obsidian-200 uppercase group-hover:text-primary transition-colors">{s.action}</div>
                         <div className="text-[8px] text-obsidian-500 italic mt-1 leading-relaxed">{s.description}</div>
                      </button>
                    ))}
                 </div>
               )}
            </div>
         ) : (
           <div className="py-8 text-center opacity-10 text-[8px] font-black uppercase tracking-widest">Select Node</div>
         )}
      </Accordion>

      <Accordion label={verboseMode ? "Object_Properties" : "Property_Inspector"} icon="tune" defaultOpen={true}>
         {selectedLayer ? (
            <div className="space-y-6">
               <PropertyGroup label="Spatial_Context">
                  <div className="grid grid-cols-2 gap-2">
                     <MicroInput label="X_TRANS" value={selectedLayer.position?.x || 0} unit="PX" onChange={(v) => onUpdateProperty(selectedLayer.id, 'position', { ...selectedLayer.position, x: parseFloat(v) || 0 })} />
                     <MicroInput label="Y_TRANS" value={selectedLayer.position?.y || 0} unit="PX" onChange={(v) => onUpdateProperty(selectedLayer.id, 'position', { ...selectedLayer.position, y: parseFloat(v) || 0 })} />
                  </div>
               </PropertyGroup>

               <PropertyGroup label="Color_Manifest">
                  <div className="bg-obsidian-900 p-3 rounded border border-white/[0.01] flex items-center gap-4">
                     <input 
                      type="color" 
                      value={selectedLayer.color} 
                      onChange={(e) => onUpdateProperty(selectedLayer.id, 'color', e.target.value)}
                      className="size-6 bg-transparent border-none cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
                     />
                     <span className="text-[10px] font-mono font-bold text-obsidian-400 tracking-widest uppercase">{selectedLayer.color}</span>
                  </div>
               </PropertyGroup>
            </div>
         ) : (
            <div className="py-8 text-center opacity-10 text-[8px] font-black uppercase tracking-widest italic">Nexus_Idle</div>
         )}
      </Accordion>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-obsidian-950 h-full border-l border-white/[0.02]">
      {renderVectorInspector()}
      
      <div className="mt-auto p-5 border-t border-white/[0.02] bg-black/40">
         <div className="bg-obsidian-900/50 rounded-xi p-4 border border-white/[0.01] text-center space-y-2">
            <div className="text-[7px] font-black text-primary/40 uppercase tracking-[0.6em] italic leading-none">Temporal_Node_0x82</div>
            <div className="text-[8px] text-obsidian-600 uppercase font-mono tracking-widest">Stack_Ops: {state.layers.length * 4}</div>
         </div>
      </div>
    </div>
  );
};

export default RightSidebar;
