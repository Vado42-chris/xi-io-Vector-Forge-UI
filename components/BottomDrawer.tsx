/**
 * Bottom Drawer Component
 * Slides up from bottom with tabs for Timeline and Non-Linear View
 * NO INLINE STYLES - Component-based platform
 */

import React, { useState, useRef, useEffect } from 'react';
import { FrameState, AnimationKeyframe, AnimationPreset, VectorLayer } from '../types';
import AnimationTimeline from './AnimationTimeline';
import NodeEditor from './NodeEditor';

interface BottomDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
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
  selectedNodeId?: string | null;
  onNodeSelect?: (nodeId: string | null) => void;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  isOpen,
  onToggle,
  frameState,
  onFrameStateChange,
  keyframes,
  onAddKeyframe,
  onUpdateKeyframe,
  onDeleteKeyframe,
  selectedLayerId,
  layers,
  presets,
  onApplyPreset,
  onImportFromStudio,
  onScriptClick,
  selectedNodeId,
  onNodeSelect,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'non-linear'>('timeline');
  const [drawerHeight, setDrawerHeight] = useState(300);
  const drawerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);

  // Handle vertical resize
  useEffect(() => {
    if (!isResizingRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!drawerRef.current) return;
      const newHeight = window.innerHeight - e.clientY;
      const minHeight = 200;
      const maxHeight = window.innerHeight - 56 - 40; // Header + handle
      setDrawerHeight(Math.max(minHeight, Math.min(maxHeight, newHeight)));
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingRef.current]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
  };

  return (
    <div
      ref={el => {
        drawerRef.current = el;
        // #region agent log
        if (el) {
          setTimeout(() => {
            const computedStyle = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            fetch('http://127.0.0.1:7242/ingest/9192f36e-3223-469d-8e1d-e9ca20bc6049', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                location: 'BottomDrawer.tsx:52',
                message: 'Bottom drawer rendered - checking position',
                data: {
                  className: el.className,
                  isOpen,
                  computedDisplay: computedStyle.display,
                  computedPosition: computedStyle.position,
                  computedBottom: computedStyle.bottom,
                  computedRight: computedStyle.right,
                  computedLeft: computedStyle.left,
                  computedWidth: computedStyle.width,
                  computedHeight: computedStyle.height,
                  computedZIndex: computedStyle.zIndex,
                  rectTop: rect.top,
                  rectLeft: rect.left,
                  rectRight: rect.right,
                  rectBottom: rect.bottom,
                  rectWidth: rect.width,
                  rectHeight: rect.height,
                },
                timestamp: Date.now(),
                sessionId: 'debug-session',
                runId: 'run1',
                hypothesisId: 'C',
              }),
            }).catch(() => {});
          }, 100);
        }
        // #endregion
      }}
      className={`bottom-drawer ${isOpen ? 'bottom-drawer-open' : 'bottom-drawer-closed'}`}
      role="complementary"
      aria-label="Bottom drawer with timeline and non-linear view"
      style={{ '--drawer-height': `${drawerHeight}px` } as React.CSSProperties}
    >
      {/* Resize Handle - Top of drawer */}
      {isOpen && (
        <div
          ref={resizeHandleRef}
          className="bottom-drawer-resize-handle"
          onMouseDown={handleResizeStart}
          aria-label="Resize drawer"
        >
          <span className="material-symbols-outlined">drag_handle</span>
        </div>
      )}

      {/* Drawer Handle - Toggle */}
      <button
        className="bottom-drawer-handle"
        onClick={onToggle}
        aria-label={isOpen ? 'Close drawer' : 'Open drawer'}
      >
        <span className="material-symbols-outlined">
          {isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
        </span>
      </button>

      {/* Drawer Content */}
      {isOpen && (
        <div className="bottom-drawer-content">
          {/* Tabs */}
          <div className="bottom-drawer-tabs">
            <button
              className={`bottom-drawer-tab ${activeTab === 'timeline' ? 'bottom-drawer-tab-active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              <span className="material-symbols-outlined">timeline</span>
              Timeline
            </button>
            <button
              className={`bottom-drawer-tab ${activeTab === 'non-linear' ? 'bottom-drawer-tab-active' : ''}`}
              onClick={() => setActiveTab('non-linear')}
            >
              <span className="material-symbols-outlined">account_tree</span>
              Non-Linear
            </button>
          </div>

          {/* Tab Content */}
          <div className="bottom-drawer-tab-content">
            {activeTab === 'timeline' && (
              <AnimationTimeline
                frameState={frameState}
                onFrameStateChange={onFrameStateChange}
                keyframes={keyframes}
                onAddKeyframe={onAddKeyframe}
                onUpdateKeyframe={onUpdateKeyframe}
                onDeleteKeyframe={onDeleteKeyframe}
                selectedLayerId={selectedLayerId}
                layers={layers}
                presets={presets}
                onApplyPreset={onApplyPreset}
                onImportFromStudio={onImportFromStudio}
                onScriptClick={onScriptClick}
              />
            )}
            {activeTab === 'non-linear' && (
              <div className="non-linear-view-container">
                {selectedNodeId ? (
                  <NodeEditor nodeId={selectedNodeId} onNodeSelect={onNodeSelect} />
                ) : (
                  <div className="non-linear-view-empty">
                    <span className="material-symbols-outlined">account_tree</span>
                    <p>Select a node to edit non-linearly</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomDrawer;
