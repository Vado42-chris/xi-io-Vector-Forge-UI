/**
 * Animation Studio Integration
 * Import/export animations from Xibalba Animation Studio
 */

import { AnimationKeyframe, FrameState, VectorLayer } from '../types';

export interface StudioAnimation {
  id: string;
  name: string;
  frames: number;
  fps: number;
  keyframes: AnimationKeyframe[];
  layers: string[]; // Layer IDs
  metadata: {
    created: number;
    modified: number;
    version: string;
  };
}

export const importFromAnimationStudio = async (file: File): Promise<{
  keyframes: AnimationKeyframe[];
  frameState: Partial<FrameState>;
  layers: VectorLayer[];
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as StudioAnimation;
        
        resolve({
          keyframes: data.keyframes,
          frameState: {
            totalFrames: data.frames,
            fps: data.fps
          },
          layers: [] // Will be populated from layer IDs
        });
      } catch (error) {
        reject(new Error('Invalid animation file format'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const exportToAnimationStudio = (keyframes: AnimationKeyframe[], frameState: FrameState, layers: VectorLayer[]): StudioAnimation => {
  return {
    id: `animation-${Date.now()}`,
    name: `Animation ${new Date().toLocaleString()}`,
    frames: frameState.totalFrames,
    fps: frameState.fps,
    keyframes,
    layers: layers.map(l => l.id),
    metadata: {
      created: Date.now(),
      modified: Date.now(),
      version: '1.0.0'
    }
  };
};

export const downloadAnimation = (animation: StudioAnimation) => {
  const blob = new Blob([JSON.stringify(animation, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${animation.name}.xibalba-animation.json`;
  a.click();
  URL.revokeObjectURL(url);
};

