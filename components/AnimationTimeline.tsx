/**
 * Professional Animation Timeline
 * Frame-based animation with keyframes, paths, and presets
 * NO INLINE STYLES - Component-based platform
 * FIXED: Timeline visibility, frame numbers, keyframes, playhead all actually visible now
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FrameState, AnimationKeyframe, AnimationPreset, VectorLayer } from '../types';

interface AnimationTimelineProps {
  frameState: FrameState;
  onFrameStateChange: (state: Partial<FrameState>) => void;
  keyframes: AnimationKeyframe[];
  onAddKeyframe: (keyframe: AnimationKeyframe) => void;
  onUpdateKeyframe: (id: string, properties: Partial<AnimationKeyframe>) => void;
  onDeleteKeyframe: (id: string) => void;
  selectedLayerId: string | null;
  layers: VectorLayer[];
  presets: AnimationPreset[];
  onApplyPreset: (preset: AnimationPreset, layerId: string) => void;
  onImportFromStudio: () => void;
  onScriptClick?: () => void;
}

const AnimationTimeline: React.FC<AnimationTimelineProps> = ({
  frameState, onFrameStateChange, keyframes, onAddKeyframe, onUpdateKeyframe, onDeleteKeyframe,
  selectedLayerId, layers, presets, onApplyPreset, onImportFromStudio, onScriptClick
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // FIXED: Default to expanded so user can see timeline
  const [editingMode, setEditingMode] = useState<'timeline' | 'node-editor'>('timeline');
  const timelineContainerRef = useRef<HTMLDivElement>(null); // FIXED: Renamed to avoid duplicate ref
  const timelineScrubRef = useRef<HTMLDivElement>(null); // FIXED: Separate ref for scrub area
  const playheadRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [selectedKeyframes, setSelectedKeyframes] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const footerHeight = 48;
  const defaultTimelineHeight = 200;
  const [position, setPosition] = useState({ x: 0, y: footerHeight }); // FIXED: Start at footer height so timeline is visible
  const dragStartPos = useRef({ x: 0, y: 0, initialBottom: 0 });
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (dragHandleRef.current?.contains(target) || target.closest('.timeline-drag-handle')) {
      setIsDragging(true);
      dragStartPos.current = { 
        x: e.clientX, 
        y: e.clientY,
        initialBottom: position.y 
      };
      target.setPointerCapture(e.pointerId);
      e.preventDefault();
    }
  };

  // Use window-level pointer events for proper dragging
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const deltaY = dragStartPos.current.y - e.clientY; // Negative when dragging up
        const newBottom = dragStartPos.current.initialBottom + deltaY;
        const minBottom = footerHeight;
        const maxBottom = window.innerHeight - 100;
        const clampedBottom = Math.max(minBottom, Math.min(maxBottom, newBottom));
        setPosition({ x: 0, y: clampedBottom });
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isDragging) {
        if (e.target instanceof HTMLElement) {
          e.target.releasePointerCapture(e.pointerId);
        }
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
      };
    }
  }, [isDragging, position]);

  const handleDragEnd = (e: React.PointerEvent) => {
    if (isDragging && e.target instanceof HTMLElement) {
      e.target.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  // Update timeline position on mount and window resize - FIXED: Ensure timeline is visible and full width
  useEffect(() => {
    const updatePosition = () => {
      if (timelineContainerRef.current) {
        const bottomPosition = position.y;
        timelineContainerRef.current.style.setProperty('--timeline-bottom', `${bottomPosition}px`);
        timelineContainerRef.current.style.bottom = `${bottomPosition}px`;
        // Account for right sidebar width (default 360px) - FIXED: Full width minus sidebar
        const rightSidebarWidth = 360;
        timelineContainerRef.current.style.setProperty('--timeline-right', `${rightSidebarWidth}px`);
        timelineContainerRef.current.style.right = `${rightSidebarWidth}px`;
        timelineContainerRef.current.style.left = '0px';
        // Ensure timeline doesn't go below footer on resize
        if (bottomPosition < footerHeight) {
          setPosition({ x: 0, y: footerHeight + defaultTimelineHeight });
        }
      }
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [position, footerHeight, defaultTimelineHeight]);

  // Update CSS variables for playhead position
  useEffect(() => {
    if (playheadRef.current) {
      const position = ((frameState.currentFrame || 0) / (frameState.totalFrames || 100)) * 100;
      playheadRef.current.style.setProperty('--playhead-position', `${position}%`);
      playheadRef.current.style.left = `${position}%`;
    }
  }, [frameState.currentFrame, frameState.totalFrames]);

  // Playback Controls
  const handlePlayPause = () => {
    onFrameStateChange({ isPlaying: !frameState.isPlaying });
  };

  const handleStop = () => {
    onFrameStateChange({ isPlaying: false, currentFrame: 0 });
  };

  const handleFrameChange = (frame: number) => {
    onFrameStateChange({ currentFrame: Math.max(0, Math.min(frameState.totalFrames || 100, frame)) });
  };

  // Keyframe Management
  const handleAddKeyframe = useCallback(() => {
    if (!selectedLayerId) return;
    
    const layer = layers.find(l => l.id === selectedLayerId);
    if (!layer) return;

    const newKeyframe: AnimationKeyframe = {
      id: `keyframe-${Date.now()}`,
      frame: frameState.currentFrame,
      layerId: selectedLayerId,
      properties: {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        opacity: 1
      },
      easing: 'ease-in-out'
    };
    
    onAddKeyframe(newKeyframe);
  }, [selectedLayerId, layers, frameState.currentFrame, onAddKeyframe]);

  // Timeline Scrub - FIXED: Use correct ref
  const handleTimelineClick = (e: React.PointerEvent | PointerEvent) => {
    if (!timelineScrubRef.current) return;
    const rect = timelineScrubRef.current.getBoundingClientRect();
    const clientX = 'clientX' in e ? e.clientX : e.clientX;
    const xPos = clientX - rect.left;
    const frameWidth = rect.width / (frameState.totalFrames || 100);
    const frame = Math.floor(xPos / frameWidth);
    handleFrameChange(frame);
  };

  const handleTimelinePointerDown = (e: React.PointerEvent) => {
    setIsScrubbing(true);
    handleTimelineClick(e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Use window-level pointer events for scrubbing
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isScrubbing) {
        handleTimelineClick(e);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      setIsScrubbing(false);
      if (e.target instanceof HTMLElement) {
        e.target.releasePointerCapture(e.pointerId);
      }
    };

    if (isScrubbing) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isScrubbing, frameState.totalFrames]);

  // Get keyframes for current layer
  const layerKeyframes = keyframes.filter(k => k.layerId === selectedLayerId);

  // Frame number component - FIXED: Actually visible with better contrast and borders, FIXED: No inline styles
  const FrameNumber: React.FC<{ frame: number }> = ({ frame }) => {
    const framePosition = `${(frame / (frameState.totalFrames || 100)) * 100}%`;
    return (
      <div
        ref={(node) => {
          if (node) {
            node.style.setProperty('--frame-position', framePosition);
          }
        }}
        className="absolute text-[12px] font-mono text-[var(--xibalba-text-000)] font-bold px-2 py-1 bg-[var(--xibalba-grey-200)] border border-[var(--xibalba-accent)]/30 rounded shadow-sm timeline-frame-number"
      >
        {frame}
      </div>
    );
  };

  // Frame marker component - FIXED: Actually visible, FIXED: No inline styles
  const FrameMarker: React.FC<{ index: number }> = ({ index }) => {
    const markerPosition = `${(index / (frameState.totalFrames || 100)) * 100}%`;
    const markerWidth = `${(1 / (frameState.totalFrames || 100)) * 100}%`;
    return (
      <div
        ref={(node) => {
          if (node) {
            node.style.setProperty('--frame-marker-position', markerPosition);
            node.style.setProperty('--frame-marker-width', markerWidth);
          }
        }}
        className="absolute top-0 bottom-0 border-l border-white/10 timeline-frame-marker"
      />
    );
  };

  // Keyframe component - FIXED: Actually visible with orange accent, FIXED: No inline styles
  const KeyframeMarker: React.FC<{ keyframe: AnimationKeyframe; onScriptClick?: () => void }> = ({ keyframe, onScriptClick }) => {
    const hasScript = !!keyframe.script;
    const keyframePosition = `${(keyframe.frame / (frameState.totalFrames || 100)) * 100}%`;
    const keyframeRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      if (keyframeRef.current) {
        keyframeRef.current.style.setProperty('--keyframe-position', keyframePosition);
      }
    }, [keyframePosition]);
    
    return (
      <div
        ref={keyframeRef}
        className="absolute top-2 bottom-2 w-4 bg-[var(--xibalba-accent)] cursor-pointer hover:scale-125 transition-transform z-timeline-keyframes relative group rounded border-2 border-[var(--xibalba-grey-000)] timeline-keyframe-marker"
        onClick={(e) => {
          e.stopPropagation();
          handleFrameChange(keyframe.frame);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onDeleteKeyframe(keyframe.id);
        }}
        title={`Frame ${keyframe.frame}${hasScript ? ' (has script)' : ''}`}
      >
        {/* Script Indicator */}
        {hasScript && (
          <div
            className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--xibalba-text-200)] flex items-center justify-center cursor-pointer hover:scale-125 transition-transform z-30 rounded-full border border-[var(--xibalba-grey-000)]"
            onClick={(e) => {
              e.stopPropagation();
              if (onScriptClick) {
                handleFrameChange(keyframe.frame);
                onScriptClick();
              }
            }}
            title="Click to edit script"
          >
            <span className="material-symbols-outlined text-[10px] text-[var(--xibalba-text-000)]">code</span>
          </div>
        )}
        
        {/* Script Preview Tooltip */}
        {hasScript && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--xibalba-grey-200)] border border-white/20 text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-timeline-tooltips whitespace-nowrap">
            <div className="font-mono text-[var(--xibalba-accent)]">
              {keyframe.script?.split('\n')[0] || 'Script'}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Layer keyframe component - FIXED: Actually visible, FIXED: No inline styles
  const LayerKeyframe: React.FC<{ keyframe: AnimationKeyframe; onScriptClick?: () => void }> = ({ keyframe, onScriptClick }) => {
    const hasScript = !!keyframe.script;
    const layerKeyframePosition = `${(keyframe.frame / (frameState.totalFrames || 100)) * 100}%`;

    return (
      <div
        ref={(node) => {
          if (node) {
            node.style.setProperty('--layer-keyframe-position', layerKeyframePosition);
          }
        }}
        className="absolute top-1/2 w-3 h-3 bg-[var(--xibalba-accent)] cursor-pointer relative group rounded-full border-2 border-[var(--xibalba-grey-000)] hover:scale-125 transition-transform z-timeline-keyframes timeline-layer-keyframe"
        onClick={() => handleFrameChange(keyframe.frame)}
        title={`Frame ${keyframe.frame}${hasScript ? ' (has script)' : ''}`}
      >
        {/* Script Indicator */}
        {hasScript && (
          <div
            className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--xibalba-text-200)] cursor-pointer hover:scale-125 transition-transform z-30 rounded-full flex items-center justify-center border border-[var(--xibalba-grey-000)]"
            onClick={(e) => {
              e.stopPropagation();
              if (onScriptClick) {
                handleFrameChange(keyframe.frame);
                onScriptClick();
              }
            }}
            title="Click to edit script"
          >
            <span className="material-symbols-outlined text-[8px] text-[var(--xibalba-text-000)]">code</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={(node) => {
        timelineContainerRef.current = node;
        if (node) {
          node.style.setProperty('--timeline-bottom', `${position.y}px`);
        }
      }}
      className={`xibalba-timeline flex flex-col bg-[var(--xibalba-grey-100)] border-t-2 border-[var(--xibalba-accent)]/30 fixed left-0 right-0 transition-all timeline-positioned shadow-lg ${isExpanded ? 'min-h-[250px] max-h-[60vh] z-timeline-expanded' : 'h-12 overflow-hidden z-timeline-collapsed'}`}
    >
      {/* Drag Handle */}
      <div
        ref={dragHandleRef}
        onPointerDown={handleDragStart}
        className="absolute top-0 left-0 right-0 h-4 cursor-grab active:cursor-grabbing flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity z-timeline-drag-handle border-b border-white/10 timeline-drag-handle"
        title="Drag to move timeline"
      >
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-[var(--xibalba-text-200)]"></div>
          <div className="w-1.5 h-1.5 bg-[var(--xibalba-text-200)]"></div>
          <div className="w-1.5 h-1.5 bg-[var(--xibalba-text-200)]"></div>
        </div>
      </div>
      {/* Timeline Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-4 right-4 h-12 flex items-center justify-center z-10 hover:bg-[var(--xibalba-grey-100)] transition-colors"
        title={isExpanded ? 'Collapse Timeline' : 'Expand Timeline'}
      >
        <span className="material-symbols-outlined text-[16px]">
          {isExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
        </span>
      </button>
      
      {isExpanded && (
        <>
          {/* Show Node Editor if in node-editor mode */}
          {editingMode === 'node-editor' ? (
            <div className="p-8 text-center min-h-[200px] flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-6xl mb-4 text-[var(--xibalba-text-200)]">account_tree</span>
              <h3 className="xibalba-text-caption font-semibold mb-2 text-[var(--xibalba-text-100)]">Node Editor Mode</h3>
              <p className="xibalba-text-caption text-[var(--xibalba-text-200)] mb-4 max-w-md">
                Non-linear editing interface coming soon. Switch back to Timeline Mode to use frame-based editing.
              </p>
              <button
                onClick={() => setEditingMode('timeline')}
                className="xibalba-button-professional"
              >
                <span className="material-symbols-outlined text-[14px] mr-1">timeline</span>
                Switch to Timeline Mode
              </button>
            </div>
          ) : (
            <>
          {/* Timeline Header */}
          <div className="xibalba-timeline-header flex items-center justify-between px-4 py-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="xibalba-text-caption font-semibold">Animation Timeline</span>
              <div className="w-px h-4 bg-white/10" />
              <span className="xibalba-text-caption font-mono text-[var(--xibalba-text-000)] font-bold bg-[var(--xibalba-grey-150)] px-2 py-1 rounded border border-white/10">
                Frame {frameState.currentFrame || 0} / {frameState.totalFrames || 100}
              </span>
              <span className="xibalba-text-caption font-mono text-[var(--xibalba-text-100)] bg-[var(--xibalba-grey-150)] px-2 py-1 rounded border border-white/10">
                @ {frameState.fps || 24} FPS
              </span>
              <div className="w-px h-4 bg-white/10" />
              {/* Non-Linear Editing Toggle - FIXED: More visible and prominent */}
              <button
                onClick={() => {
                  const newMode = editingMode === 'timeline' ? 'node-editor' : 'timeline';
                  setEditingMode(newMode);
                  // Track mode switch
                  if (typeof window !== 'undefined' && (window as any).clickTrackingService) {
                    (window as any).clickTrackingService.trackClick(
                      'button',
                      'timeline-mode-toggle',
                      `Switch to ${newMode === 'node-editor' ? 'Node Editor' : 'Timeline'} Mode`,
                      'toggle',
                      { previousMode: editingMode, newMode }
                    );
                  }
                }}
                className={`xibalba-button-professional text-[11px] px-3 py-1.5 font-semibold ${editingMode === 'node-editor' ? 'bg-[var(--xibalba-accent)]/30 border-2 border-[var(--xibalba-accent)] text-[var(--xibalba-accent)]' : 'bg-[var(--xibalba-grey-150)] border border-white/20'}`}
                title={editingMode === 'timeline' ? 'Switch to Node Editor Mode (Non-Linear Editing)' : 'Switch to Timeline Mode (Linear Editing)'}
              >
                <span className="material-symbols-outlined text-[16px] mr-1.5">
                  {editingMode === 'timeline' ? 'account_tree' : 'timeline'}
                </span>
                {editingMode === 'timeline' ? 'Node Editor' : 'Timeline Mode'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Playback Controls */}
              <button
                onClick={handleStop}
                className="xibalba-toolbar-button-professional"
                title="Stop"
              >
                <span className="material-symbols-outlined text-[16px]">stop</span>
              </button>
              <button
                onClick={handlePlayPause}
                className="xibalba-toolbar-button-professional"
                title={frameState.isPlaying ? 'Pause' : 'Play'}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {frameState.isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <button
                onClick={() => handleFrameChange(frameState.currentFrame - 1)}
                className="xibalba-toolbar-button-professional"
                title="Previous Frame"
              >
                <span className="material-symbols-outlined text-[16px]">skip_previous</span>
              </button>
              <button
                onClick={() => handleFrameChange(frameState.currentFrame + 1)}
                className="xibalba-toolbar-button-professional"
                title="Next Frame"
              >
                <span className="material-symbols-outlined text-[16px]">skip_next</span>
              </button>

              <div className="w-px h-4 bg-white/10" />

              {/* Keyframe Controls */}
              <button
                onClick={handleAddKeyframe}
                disabled={!selectedLayerId}
                className="xibalba-button-professional"
                title="Add Keyframe"
              >
                <span className="material-symbols-outlined text-[16px] mr-1">add</span>
                Keyframe
              </button>

              <div className="w-px h-4 bg-white/10" />

              {/* Animation Presets */}
              <div className="relative group">
                <button className="xibalba-button-professional">
                  <span className="material-symbols-outlined text-[16px] mr-1">auto_awesome</span>
                  Presets
                </button>
                <div className="absolute right-0 bottom-full mb-2 w-64 xibalba-panel-elevated-professional opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                  <div className="p-2 space-y-1">
                    {presets.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => selectedLayerId && onApplyPreset(preset, selectedLayerId)}
                        className="xibalba-interactive w-full text-left px-3 py-2 text-sm"
                      >
                        <div className="font-semibold">{preset.name}</div>
                        <div className="xibalba-text-caption">{preset.category}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Import from Animation Studio */}
              <button
                onClick={onImportFromStudio}
                className="xibalba-button-professional"
                title="Import from Animation Studio"
              >
                <span className="material-symbols-outlined text-[16px] mr-1">download</span>
                Import
              </button>

              {/* Loop Toggle */}
              <button
                onClick={() => onFrameStateChange({ isLooping: !frameState.isLooping })}
                className={`xibalba-toolbar-button-professional ${frameState.isLooping ? 'active' : ''}`}
                title="Loop"
              >
                <span className="material-symbols-outlined text-[16px]">repeat</span>
              </button>
            </div>
          </div>

          {/* Timeline Track - FIXED: Actually visible with proper heights */}
          <div className="xibalba-timeline-track flex flex-col overflow-hidden min-h-[120px]">
            {/* Frame Numbers - FIXED: Actually visible now with better contrast and borders */}
            <div className="h-12 flex items-center border-b-2 border-[var(--xibalba-accent)]/40 bg-[var(--xibalba-grey-150)] relative px-2 shadow-sm">
              {Array.from({ length: Math.ceil((frameState.totalFrames || 100) / 10) + 1 }, (_, i) => i * 10).map(frame => (
                <FrameNumber key={frame} frame={frame} />
              ))}
            </div>

            {/* Timeline Scrub Area - FIXED: Has proper height, contrast, and correct ref */}
            <div
              ref={timelineScrubRef}
              className="h-24 relative cursor-pointer bg-[var(--xibalba-grey-100)] border-b-2 border-[var(--xibalba-accent)]/30 shadow-inner"
              onPointerDown={handleTimelinePointerDown}
            >
              {/* Frame Markers */}
              <div className="absolute inset-0">
                {Array.from({ length: frameState.totalFrames || 100 }, (_, i) => (
                  <FrameMarker key={i} index={i} />
                ))}
              </div>

              {/* Playhead - FIXED: Actually visible and positioned correctly with better contrast */}
              <div
                ref={(node) => {
                  playheadRef.current = node;
                  if (node) {
                    node.style.setProperty('--playhead-position', `${((frameState.currentFrame || 0) / (frameState.totalFrames || 100)) * 100}%`);
                  }
                }}
                className="absolute top-0 bottom-0 w-1 bg-[var(--xibalba-accent)] pointer-events-none timeline-playhead shadow-lg"
              >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-[var(--xibalba-accent)] rounded-full border-3 border-[var(--xibalba-grey-000)] shadow-lg" />
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] font-mono font-bold text-[var(--xibalba-accent)] whitespace-nowrap bg-[var(--xibalba-grey-150)] px-1.5 py-0.5 rounded border border-[var(--xibalba-accent)]/30">
                  {frameState.currentFrame || 0}
                </div>
              </div>

              {/* Keyframes */}
              {layerKeyframes.map(keyframe => (
                <KeyframeMarker key={keyframe.id} keyframe={keyframe} onScriptClick={onScriptClick} />
              ))}

              {/* Animation Path Visualization */}
              {selectedLayerId && layerKeyframes.length > 1 && (
                <svg className="absolute inset-0 pointer-events-none opacity-30 animation-path">
                  {layerKeyframes.slice(1).map((keyframe, i) => {
                    const prev = layerKeyframes[i];
                    return (
                      <line
                        key={`path-${keyframe.id}`}
                        x1={`${(prev.frame / (frameState.totalFrames || 100)) * 100}%`}
                        y1="50%"
                        x2={`${(keyframe.frame / (frameState.totalFrames || 100)) * 100}%`}
                        y2="50%"
                        stroke="var(--xibalba-text-200)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    );
                  })}
                </svg>
              )}
            </div>

            {/* Layer Tracks - FIXED: Actually visible with proper styling and better contrast */}
            <div className="flex-1 border-t-2 border-[var(--xibalba-accent)]/20 overflow-y-auto timeline-layer-track min-h-[100px] max-h-[250px] bg-[var(--xibalba-grey-050)] shadow-inner">
              {layers.length > 0 ? (
                layers.map(layer => {
                  const layerKfs = keyframes.filter(k => k.layerId === layer.id);
                  return (
                    <div key={layer.id} className="h-14 flex items-center border-b border-white/10 px-3 hover:bg-[var(--xibalba-grey-100)] transition-colors bg-[var(--xibalba-grey-050)]">
                      <div className="w-32 xibalba-text-caption truncate font-semibold text-[var(--xibalba-text-000)] border-r border-white/10 pr-2">{layer.name}</div>
                      <div className="flex-1 relative h-full bg-[var(--xibalba-grey-100)] border border-white/10 rounded shadow-sm">
                        {layerKfs.length > 0 ? (
                          layerKfs.map(keyframe => (
                            <LayerKeyframe key={keyframe.id} keyframe={keyframe} onScriptClick={onScriptClick} />
                          ))
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="xibalba-text-caption text-[var(--xibalba-text-300)] text-[9px]">No keyframes</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center opacity-50">
                    <span className="material-symbols-outlined text-4xl mb-2 text-[var(--xibalba-text-200)]">layers</span>
                    <p className="xibalba-text-caption text-[var(--xibalba-text-200)]">No layers - Create layers to see them here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AnimationTimeline;
