
import React, { useState } from 'react';
import { AppState, WorkspaceRole, VectorLayer, ToolType } from '../types';

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
  onTaskLink?: () => void;
}

const Accordion: React.FC<{ label: string, icon: string, children: React.ReactNode, defaultOpen?: boolean }> = ({ label, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/[0.03] bg-obsidian-950">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full h-11 px-6 flex items-center justify-between text-obsidian-400 hover:text-white transition-colors">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[18px] opacity-40">{icon}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{label}</span>
        </div>
        <span className={`material-symbols-outlined text-[16px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
      {isOpen && <div className="px-6 pb-6 pt-2 space-y-5 animate-in slide-in-from-top-1">{children}</div>}
    </div>
  );
};

const PropertyGroup: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-3">
    <span className="text-[7px] font-black text-obsidian-600 uppercase tracking-widest block">{label}</span>
    <div className="grid grid-cols-2 gap-2">{children}</div>
  </div>
);

const MicroInput: React.FC<{ label: string, value: any, unit?: string, onChange?: (v: string) => void }> = ({ label, value, unit, onChange }) => (
  <div className="bg-black/40 border border-white/5 rounded p-2 flex flex-col gap-0.5 group hover:border-primary/20 transition-all">
     <span className="text-[6px] font-mono text-obsidian-600 uppercase tracking-widest">{label}</span>
     <div className="flex items-baseline justify-between">
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-transparent border-none p-0 text-[11px] font-mono text-primary font-bold group-hover:text-white transition-colors focus:ring-0 outline-none" 
        />
        {unit && <span className="text-[7px] text-obsidian-700 font-bold ml-1">{unit}</span>}
     </div>
  </div>
);

const RightSidebar: React.FC<RightSidebarProps> = ({ state, role, onUpdateProperty, onSelectLayer, verboseMode = false }) => {
  const selectedLayer = state.layers.find(l => l.id === state.selectedLayerId);
  const tool = state.activeTool;

  const renderContextualProperties = () => {
    if (!selectedLayer) return null;

    // 1. RIGGING ROLE PROPERTIES
    if (role === WorkspaceRole.SKELETON_RIG || tool === 'bone') {
      return (
        <Accordion label={verboseMode ? "Kinematic Rig" : "Joint_Registry"} icon="hub" defaultOpen={true}>
           <PropertyGroup label="Inverse_Kinematics">
              <MicroInput label="STIFFNESS" value="0.4" />
              <MicroInput label="DAMPING" value="0.92" />
           </PropertyGroup>
        </Accordion>
      );
    }

    // 2. VFX / FLUX PROPERTIES
    if (role === WorkspaceRole.VFX_FLUX || tool === 'emitter') {
      return (
        <Accordion label={verboseMode ? "Particle Physics" : "Flux_Manifold"} icon="flare" defaultOpen={true}>
           <PropertyGroup label="Emission_Physics">
              <MicroInput label="RATE" value="450" unit="P/S" />
              <MicroInput label="LIFESPAN" value="2.4" unit="S" />
           </PropertyGroup>
        </Accordion>
      );
    }

    // 3. VECTOR PROPERTIES
    return (
      <Accordion label={verboseMode ? "Path Settings" : "Topology_Audit"} icon="draw" defaultOpen={true}>
         <PropertyGroup label="Stroke_Manifest">
            <MicroInput 
              label="WIDTH" value={selectedLayer.strokeWidth} unit="PX" 
              onChange={(v) => onUpdateProperty(selectedLayer.id, 'strokeWidth', parseFloat(v) || 0)}
            />
            <MicroInput label="OPACITY" value={selectedLayer.opacity} onChange={(v) => onUpdateProperty(selectedLayer.id, 'opacity', parseFloat(v) || 0)} />
         </PropertyGroup>
         <PropertyGroup label="Color_Engine">
            <div className="col-span-2 p-3 bg-black/60 rounded border border-white/10 flex items-center gap-4 group cursor-pointer hover:border-primary/40 transition-all">
               <div className="size-6 rounded bg-primary shadow-[0_0_10px_var(--xi-accent)] group-active:scale-90 transition-transform"></div>
               <input 
                  type="text" 
                  value={selectedLayer.color} 
                  onChange={(e) => onUpdateProperty(selectedLayer.id, 'color', e.target.value)}
                  className="bg-transparent border-none p-0 text-[11px] font-mono text-white focus:ring-0 outline-none w-full" 
               />
            </div>
         </PropertyGroup>
      </Accordion>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-obsidian-950 border-l border-white/5 overflow-y-auto custom-scrollbar">
      <Accordion label={verboseMode ? "Layer Hierarchy" : "Manifest_Stack"} icon="layers" defaultOpen={true}>
         <div className="space-y-1">
            {state.layers.map(layer => (
              <div 
                key={layer.id} 
                onClick={() => onSelectLayer(layer.id)}
                className={`p-3 rounded border flex items-center justify-between cursor-pointer transition-all ${state.selectedLayerId === layer.id ? 'bg-primary/10 border-primary/40' : 'border-transparent text-obsidian-600 hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                   <div className="size-2 rounded-full" style={{ backgroundColor: layer.color }}></div>
                   <span className="text-[10px] font-black uppercase tracking-widest italic">{layer.name}</span>
                </div>
                <span className="material-symbols-outlined text-[14px] opacity-20">visibility</span>
              </div>
            ))}
         </div>
      </Accordion>

      {renderContextualProperties()}

      {selectedLayer && (
        <Accordion label={verboseMode ? "Transformation" : "Spatial_Context"} icon="transform" defaultOpen={true}>
           <PropertyGroup label="Coordinate_Space">
              <MicroInput label="TRANS_X" value={selectedLayer.position?.x || 0} unit="PX" onChange={(v) => onUpdateProperty(selectedLayer.id, 'TRANS_X', v)} />
              <MicroInput label="TRANS_Y" value={selectedLayer.position?.y || 0} unit="PX" onChange={(v) => onUpdateProperty(selectedLayer.id, 'TRANS_Y', v)} />
              <MicroInput label="SCALE" value="1.0" />
              <MicroInput label="ROTATION" value="0" unit="DEG" />
           </PropertyGroup>
        </Accordion>
      )}

      <div className="mt-auto p-6 border-t border-white/[0.03] bg-black/20">
         <div className="p-4 bg-obsidian-900 border border-white/5 rounded-xi text-center space-y-2">
            <span className="text-[7px] font-black text-primary/40 uppercase tracking-[0.6em] italic block">Temporal_Node_0x82</span>
            <div className="text-[9px] text-obsidian-600 font-mono tracking-widest uppercase italic">Active_Ops: {state.layers.length * 4}</div>
         </div>
      </div>
    </div>
  );
};

export default RightSidebar;
