import React from 'react';
import './Timeline.css';
import { VectorLayer, AnimationKeyframe } from '../../types';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  frames: Frame[];
}

interface Frame {
  index: number;
  type: 'empty' | 'keyframe' | 'tween';
  content?: any;
}

interface TimelineProps {
  layers: VectorLayer[];
  keyframes: AnimationKeyframe[];
  currentFrame: number;
  totalFrames: number;
  onFrameChange: (frame: number) => void;
  onLayerToggle: (id: string, prop: 'visible' | 'locked') => void;
  onAddLayer?: () => void;
  onAddFolder?: () => void;
  onAddMask?: () => void;
}

// Adapter: Convert VectorLayer[] + AnimationKeyframe[] to Timeline Layer format
function adaptLayersToTimeline(
  layers: VectorLayer[],
  keyframes: AnimationKeyframe[],
  totalFrames: number
): Layer[] {
  return layers.map(layer => {
    const layerKeyframes = keyframes.filter(kf => kf.layerId === layer.id);
    const frames: Frame[] = Array.from({ length: totalFrames }).map((_, index) => {
      const keyframe = layerKeyframes.find(kf => kf.frame === index);
      if (keyframe) {
        return { index, type: 'keyframe' as const, content: keyframe };
      }
      // Check if this frame is part of a tween (between two keyframes)
      const prevKeyframe = layerKeyframes
        .filter(kf => kf.frame < index)
        .sort((a, b) => b.frame - a.frame)[0];
      const nextKeyframe = layerKeyframes
        .filter(kf => kf.frame > index)
        .sort((a, b) => a.frame - b.frame)[0];
      
      if (prevKeyframe && nextKeyframe) {
        return { index, type: 'tween' as const };
      }
      return { index, type: 'empty' as const };
    });
    
    return {
      id: layer.id,
      name: layer.name || `Layer ${layer.id.slice(0, 8)}`,
      visible: layer.visible !== false,
      locked: layer.locked === true,
      frames,
    };
  });
}

export default function Timeline({ 
  layers: vectorLayers, 
  keyframes,
  currentFrame, 
  totalFrames,
  onFrameChange,
  onLayerToggle,
  onAddLayer,
  onAddFolder,
  onAddMask,
}: TimelineProps) {
  // Convert VectorLayer[] to Timeline Layer format
  const layers = adaptLayersToTimeline(vectorLayers, keyframes, totalFrames);
  
  return (
    <div className="timeline">
      <div className="timeline-header">
        <div className="timeline-controls">
          <button onClick={() => onFrameChange(Math.max(0, currentFrame - 1))}>◄</button>
          <button onClick={() => onFrameChange(Math.min(totalFrames - 1, currentFrame + 1))}>►</button>
          <button>▶</button>
          <span>Frame {currentFrame}/{totalFrames}</span>
        </div>
      </div>
      
      <div className="timeline-layers">
        {layers.map((layer: Layer) => (
          <div key={layer.id} className="timeline-layer">
            <div className="layer-controls">
              <button onClick={() => onLayerToggle(layer.id, 'visible')}>
                {layer.visible ? '👁️' : '🚫'}
              </button>
              <button onClick={() => onLayerToggle(layer.id, 'locked')}>
                {layer.locked ? '🔒' : '🔓'}
              </button>
              <span>{layer.name}</span>
            </div>
            
            <div className="layer-frames">
              {Array.from({ length: totalFrames }).map((_, i) => {
                const frame = layer.frames.find(f => f.index === i);
                return (
                  <div 
                    key={i}
                    className={`frame frame-${frame?.type || 'empty'}`}
                    onClick={() => onFrameChange(i)}
                  >
                    {frame?.type === 'keyframe' && '●'}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="timeline-footer">
        {onAddLayer && <button onClick={onAddLayer}>+ Layer</button>}
        {onAddFolder && <button onClick={onAddFolder}>📁 Folder</button>}
        {onAddMask && <button onClick={onAddMask}>🎭 Mask</button>}
      </div>
    </div>
  );
}

