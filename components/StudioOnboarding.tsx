
import React, { useState } from 'react';
import { AppState, ActionPacket } from '../types';
import { XI_Button, XI_ProgressGauge } from './IndustrialPrimitives';

interface StudioOnboardingProps {
  state: AppState;
  verboseMode?: boolean;
}

const StudioOnboarding: React.FC<StudioOnboardingProps> = ({ state, verboseMode = false }) => {
  const [activeCourse, setActiveCourse] = useState('STUDIO_PIPELINE_V8');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedActions, setRecordedActions] = useState<ActionPacket[]>([]);

  const curriculum = [
    { id: 'STUDIO_PIPELINE_V8', title: 'Our Industrial Pipeline', duration: '12m', author: 'LEAD_ARCHON', hashtags: ['#Custom_Studio_Process'], status: 'Active' },
    { id: 'ALPHA_MASKING_ZR1', title: 'Compositing for UE 5.4', duration: '24m', author: 'MOTION_LEAD', hashtags: ['#ZR1_Standards'], status: 'Locked' },
    { id: 'HASHTAG_ETIQUETTE', title: 'Serialized Tag Hygiene', duration: '8m', author: 'SYSTEM_BOT', hashtags: ['#Provenance'], status: 'Active' },
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedActions([]);
    // Simulate recording lead intent
    setTimeout(() => {
      setIsRecording(false);
      const mockStandard: ActionPacket = {
        type: 'GEOMETRY_STANDARD',
        payload: { friction: 0.12, normalParity: 1.0 },
        timestamp: Date.now(),
        origin: 'LEAD_ARCHON',
        context: { role: state.activeRole, viewId: 'v1' }
      };
      setRecordedActions([mockStandard]);
    }, 3000);
  };

  return (
    <div className="flex-1 bg-obsidian-950 flex flex-col h-full overflow-hidden animate-in fade-in duration-700">
       <div className="h-24 shrink-0 border-b border-obsidian-800 bg-[#0c0e10] flex items-center justify-between px-12 z-20 shadow-xl">
          <div className="flex items-center gap-10">
             <div className="size-14 rounded-2xl bg-primary/10 border-2 border-primary flex items-center justify-center text-primary shadow-[0_0_30px_rgba(184,134,11,0.2)]">
                <span className="material-symbols-outlined text-[32px] font-black">school</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[20px] font-black text-white uppercase italic tracking-tighter leading-none">Knowledge_Bake_Engine</span>
                <span className="text-[9px] font-mono text-primary uppercase tracking-[0.4em] mt-2 font-bold italic">
                   {verboseMode ? 'Record Studio Standards' : 'HEURISTIC_HANDSHAKE_PROTOCOL_V8'}
                </span>
             </div>
          </div>
          
          <div className="flex items-center gap-8">
             <button 
               onClick={handleStartRecording}
               disabled={isRecording}
               className={`h-14 px-12 rounded-2xl text-[12px] font-black uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 flex items-center gap-6 group overflow-hidden relative ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-obsidian-100 text-white border border-white/10 hover:border-primary/40'}`}
             >
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform relative z-10">{isRecording ? 'radio_button_checked' : 'videocam'}</span>
                <span className="relative z-10">{isRecording ? 'BAKING_KNOWLEDGE...' : 'RECORD_LEAD_STANDARD'}</span>
             </button>
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden p-12 gap-12 bg-black/20">
          <div className="w-[480px] space-y-8 flex flex-col">
             <div className="bg-obsidian-900 border border-white/5 rounded-[40px] p-10 space-y-10 flex-1 shadow-2xl">
                <span className="text-[10px] font-black text-obsidian-500 uppercase tracking-[0.4em] italic border-b border-white/5 pb-6 block">Studio_Standards_Registry</span>
                <div className="space-y-6 overflow-y-auto max-h-[600px] custom-scrollbar pr-4">
                   {curriculum.map(course => (
                     <div 
                      key={course.id} 
                      onClick={() => setActiveCourse(course.id)}
                      className={`p-8 rounded-[32px] border transition-all cursor-pointer group relative overflow-hidden ${activeCourse === course.id ? 'bg-primary/5 border-primary/40 shadow-xl' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                     >
                        <div className="flex justify-between items-start mb-6">
                           <div className={`px-4 py-1 rounded text-[9px] font-black uppercase tracking-widest ${course.status === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-obsidian-800 text-obsidian-600 border border-white/5'}`}>{course.status}</div>
                           <span className="text-[10px] font-mono text-primary font-bold italic tabular-nums">{course.duration}</span>
                        </div>
                        <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-none">{course.title}</h4>
                        <div className="flex flex-wrap gap-2 mt-4">
                           {course.hashtags.map(tag => (
                             <span key={tag} className="text-[8px] font-mono text-obsidian-600 uppercase italic font-bold">{tag}</span>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="p-10 bg-primary/5 border-2 border-primary/20 rounded-[48px] text-center space-y-4 shadow-inner group cursor-help">
                <span className="text-[11px] font-black text-white uppercase italic tracking-widest block leading-none">Studio_Yield_Bonus</span>
                <div className="text-4xl font-black text-primary tabular-nums italic tracking-tighter leading-none">+14.2% CORE</div>
                <p className="text-[10px] text-obsidian-500 leading-relaxed italic uppercase font-bold tracking-tight">
                   {verboseMode ? 'Training others increases your studio royalty share.' : 'Recursive training protocol identified. 14.2% bonus yield applied to all lead-signed shards.'}
                </p>
             </div>
          </div>

          <div className="flex-1 bg-obsidian-900 border-2 border-white/5 rounded-[60px] p-16 flex flex-col gap-12 relative overflow-hidden group shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]">
             <div className="absolute inset-0 canvas-grid opacity-10 pointer-events-none"></div>
             
             <div className="space-y-6 relative z-10">
                <span className="text-[12px] font-black text-primary uppercase tracking-[0.8em] italic border-b border-primary/20 pb-6 block">Training_Module: {activeCourse}</span>
                <h3 className="text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
                   Teaching_to_<br/>
                   <span className="text-primary">Scale_Sovereignty</span>
                </h3>
             </div>

             <div className="flex-1 flex flex-col justify-center max-w-3xl relative z-10">
                <p className="text-3xl text-obsidian-400 leading-relaxed italic font-medium">
                   "Give a man a fish, he eats for a day. Teach him to **Bake industrial standards** into a #Hallberg lesson, and he gives his entire community the power to buy as many god damn fish as they need."
                </p>
                <div className="mt-16 flex gap-10">
                   <button className="px-16 h-20 bg-primary text-black rounded-[32px] text-[14px] font-black uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-primary/20 flex items-center justify-center gap-6 group">
                      <span className="material-symbols-outlined text-[32px] group-hover:rotate-12 transition-transform">handshake</span>
                      INITIATE_HANDSHAKE
                   </button>
                   <button className="px-12 h-20 bg-white/5 hover:bg-white/10 text-white rounded-[32px] text-[12px] font-black uppercase tracking-[0.4em] transition-all border border-white/10 flex items-center justify-center gap-6 group">
                      <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">analytics</span>
                      AUDIT_MATH_PROOF
                   </button>
                </div>
             </div>

             <div className="mt-auto p-12 bg-primary/5 border-2 border-primary/20 rounded-[80px] flex items-center justify-between relative z-10 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-10">
                   <div className="size-20 rounded-[32px] bg-primary flex items-center justify-center text-black shadow-2xl">
                      <span className="material-symbols-outlined text-[40px] font-black">verified</span>
                   </div>
                   <div className="flex flex-col gap-2">
                      <span className="text-[18px] font-black text-white uppercase italic tracking-tight">Standard_Alignment</span>
                      <span className="text-[11px] font-mono text-primary uppercase font-bold tracking-widest italic">LEAD_ARCHON_SIGNED // 0x84_SIG</span>
                   </div>
                </div>
                <div className="text-right">
                   <span className="text-5xl font-black text-white tabular-nums italic leading-none tracking-tighter">98.42%_PASS</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default StudioOnboarding;
