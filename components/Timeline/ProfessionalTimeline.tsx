/**
 * Professional Timeline Component
 * Flash-style timeline with layers, keyframes, and tweens
 * Matches wireframe spec: 40% screen height, always visible
 */

import React, { useState, useRef, useCallback } from 'react';
import { VectorLayer, AnimationKeyframe, FrameState } from '../../types';
import './ProfessionalTimeline.css';

interface ProfessionalTimelineProps {
  layers: VectorLayer[];
  keyframes: AnimationKeyframe[];
  frameState: FrameState;
  onFrameChange: (frame: number) => void;
  onLayerToggle: (layerId: string, property: 'visible' | 'locked') => void;
  onAddLayer: () => void;
  onAddFolder: () => void;
  onAddMask: () => void;
  onAddKeyframe: (layerId: string, frame: number) => void;
  onDeleteKeyframe: (keyframeId: string) => void;
  onFrameLabel: (frame: number, label: string) => void;
  totalFrames?: number;
  fps?: number;
}

const ProfessionalTimeline: React.FC<ProfessionalTimelineProps> = ({
  layers,
  keyframes,
  frameState,
  onFrameChange,
  onLayerToggle,
  onAddLayer,
  onAddFolder,
  onAddMask,
  onAddKeyframe,
  onDeleteKeyframe,
  onFrameLabel,
  totalFrames = 100,
  fps = 24,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [onionSkinFrames, setOnionSkinFrames] = useState(2);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const currentFrame = frameState.currentFrame || 0;

  // Get keyframes for a specific layer
  const getLayerKeyframes = useCallback((layerId: string) => {
    return keyframes.filter(kf => kf.layerId === layerId);
  }, [keyframes]);

  // Check if frame has keyframe
  const hasKeyframe = useCallback((layerId: string, frame: number) => {
    return keyframes.some(kf => kf.layerId === layerId && kf.frame === frame);
  }, [keyframes]);

  // Get tween span (frames between keyframes)
  const getTweenSpan = useCallback((layerId: string, startFrame: number) => {
    const layerKeyframes = getLayerKeyframes(layerId)
      .filter(kf => kf.frame > startFrame)
      .sort((a, b) => a.frame - b.frame);
    
    if (layerKeyframes.length > 0) {
      return { start: startFrame, end: layerKeyframes[0].frame };
    }
    return { start: startFrame, end: totalFrames };
  }, [getLayerKeyframes, totalFrames]);

  // Handle timeline scrub
  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 200; // Account for layer controls width
    const frameWidth = 20; // 20px per frame
    const clickedFrame = Math.floor(x / frameWidth);
    const clampedFrame = Math.max(0, Math.min(totalFrames - 1, clickedFrame));
    onFrameChange(clampedFrame);
  }, [onFrameChange, totalFrames]);

  // Playback controls
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    // TODO: Implement playback logic
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    // TODO: Implement pause logic
  }, []);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    onFrameChange(0);
  }, [onFrameChange]);

  const handlePrevFrame = useCallback(() => {
    onFrameChange(Math.max(0, currentFrame - 1));
  }, [onFrameChange, currentFrame]);

  const handleNextFrame = useCallback(() => {
    onFrameChange(Math.min(totalFrames - 1, currentFrame + 1));
  }, [onFrameChange, currentFrame, totalFrames]);

  return (
    <div className="professional-timeline" ref={timelineRef}>
      {/* Timeline Header */}
      <div className="timeline-header">
        <div className="timeline-controls">
          <button onClick={handlePrevFrame} title="Previous Frame (,)">
            ◄
          </button>
          <button onClick={handleNextFrame} title="Next Frame (.)">
            ►
          </button>
          {isPlaying ? (
            <button onClick={handlePause} title="Pause">
              ⏸
            </button>
          ) : (
            <button onClick={handlePlay} title="Play (Enter)">
              ▶
            </button>
          )}
          <button onClick={handleStop} title="Stop">
            ⏹
          </button>
          <span className="frame-counter">
            Frame {currentFrame} / {totalFrames} @ {fps} FPS
          </span>
          <div className="onion-skin-controls">
            <span>Onion Skin:</span>
            <button onClick={() => setOnionSkinFrames(Math.max(0, onionSkinFrames - 1))}>
              ◄ {onionSkinFrames}
            </button>
            <span>Current</span>
            <button onClick={() => setOnionSkinFrames(Math.min(10, onionSkinFrames + 1))}>
              {onionSkinFrames} ►
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Layers */}
      <div className="timeline-layers-container">
        <div className="timeline-layers">
          {layers.map((layer) => {
            const layerKeyframes = getLayerKeyframes(layer.id);
            const firstKeyframe = layerKeyframes[0];
            
            return (
              <div key={layer.id} className="timeline-layer">
                {/* Layer Controls */}
                <div className="layer-controls">
                  <button
                    onClick={() => onLayerToggle(layer.id, 'locked')}
                    title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                    className={layer.locked ? 'locked' : ''}
                  >
                    {layer.locked ? '🔒' : '🔓'}
                  </button>
                  <button
                    onClick={() => onLayerToggle(layer.id, 'visible')}
                    title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                    className={!layer.visible ? 'hidden' : ''}
                  >
                    {layer.visible ? '👁️' : '🚫'}
                  </button>
                  <span className="layer-name" title={layer.name}>
                    {layer.name}
                  </span>
                </div>

                {/* Layer Frames */}
                <div className="layer-frames" onClick={handleTimelineClick}>
                  {Array.from({ length: totalFrames }).map((_, frameIndex) => {
                    const hasKeyframeHere = hasKeyframe(layer.id, frameIndex);
                    const isCurrentFrame = frameIndex === currentFrame;
                    const tweenSpan = firstKeyframe && frameIndex > firstKeyframe.frame 
                      ? getTweenSpan(layer.id, firstKeyframe.frame)
                      : null;
                    const inTweenSpan = tweenSpan && frameIndex >= tweenSpan.start && frameIndex < tweenSpan.end;

                    return (
                      <div
                        key={frameIndex}
                        className={`frame ${hasKeyframeHere ? 'frame-keyframe' : ''} ${inTweenSpan ? 'frame-tween' : ''} ${isCurrentFrame ? 'frame-current' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (e.doubleClick) {
                            onAddKeyframe(layer.id, frameIndex);
                          }
                        }}
                        title={`Frame ${frameIndex}${hasKeyframeHere ? ' (Keyframe)' : ''}`}
                      >
                        {hasKeyframeHere && '●'}
                        {isCurrentFrame && <div className="playhead-indicator" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Frame Ruler */}
        <div className="frame-ruler">
          {Array.from({ length: Math.ceil(totalFrames / 5) }).map((_, i) => (
            <div key={i} className="ruler-mark">
              {i * 5}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Footer */}
      <div className="timeline-footer">
        <button onClick={onAddLayer} title="Add Layer (Ctrl+L)">
          + Layer
        </button>
        <button onClick={onAddFolder} title="Add Folder">
          📁 Folder
        </button>
        <button onClick={onAddMask} title="Add Mask">
          🎭 Mask
        </button>
        <button title="Add Guide Layer">
          📏 Guide
        </button>
        <div className="timeline-zoom">
          <button title="Zoom Out">−</button>
          <span>100%</span>
          <button title="Zoom In">+</button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTimeline;

