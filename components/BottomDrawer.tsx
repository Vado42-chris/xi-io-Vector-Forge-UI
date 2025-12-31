/**
 * Bottom Drawer Component
 * Slides up from bottom with tabs for Timeline and Non-Linear View
 * NO INLINE STYLES - Component-based platform
 */

import React, { useState } from 'react';
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

  return (
    <div className={`bottom-drawer ${isOpen ? 'bottom-drawer-open' : 'bottom-drawer-closed'}`} role="complementary" aria-label="Bottom drawer with timeline and non-linear view">
      {/* Drawer Handle */}
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
                  <NodeEditor
                    nodeId={selectedNodeId}
                    onNodeSelect={onNodeSelect}
                  />
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

