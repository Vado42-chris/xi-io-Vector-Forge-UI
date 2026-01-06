/**
 * Power User Toolbar
 * Professional tools for advanced workflows
 */

import React, { useState, useRef, useEffect } from 'react';
import Tooltip from './Tooltip';

interface PowerUserToolbarProps {
  snapToGrid: boolean;
  onSnapToGridChange: (value: boolean) => void;
  snapToGuides: boolean;
  onSnapToGuidesChange: (value: boolean) => void;
  showGuides: boolean;
  onShowGuidesChange: (value: boolean) => void;
  gridSize: number;
  onGridSizeChange: (value: number) => void;
  showOnionSkin: boolean;
  onShowOnionSkinChange: (value: boolean) => void;
  onionSkinFrames: number;
  onOnionSkinFramesChange: (value: number) => void;
}

const PowerUserToolbar: React.FC<PowerUserToolbarProps> = ({
  snapToGrid, onSnapToGridChange,
  snapToGuides, onSnapToGuidesChange,
  showGuides, onShowGuidesChange,
  gridSize, onGridSizeChange,
  showOnionSkin, onShowOnionSkinChange,
  onionSkinFrames, onOnionSkinFramesChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // Default to collapsed - user can expand when needed
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Position relative to canvas container
  const dragStartPos = useRef({ x: 0, y: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.PointerEvent) => {
    if (dragHandleRef.current?.contains(e.target as Node) && toolbarRef.current) {
      setIsDragging(true);
      const container = toolbarRef.current.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        dragStartPos.current = { 
          x: e.clientX - rect.left - position.x, 
          y: e.clientY - rect.top - position.y 
        };
      }
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
    }
  };

  const handleDragMove = (e: React.PointerEvent) => {
    if (isDragging && toolbarRef.current) {
      const container = toolbarRef.current.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        const newX = Math.max(0, Math.min(rect.width - 300, e.clientX - rect.left - dragStartPos.current.x));
        const newY = Math.max(0, Math.min(rect.height - 400, e.clientY - rect.top - dragStartPos.current.y));
        setPosition({ x: newX, y: newY });
      }
    }
  };

  const handleDragEnd = (e: React.PointerEvent) => {
    if (isDragging) {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  useEffect(() => {
    if (toolbarRef.current) {
      if (position.x === 0 && position.y === 0) {
        // Initial position - top right of canvas area
        toolbarRef.current.style.right = '8px';
        toolbarRef.current.style.top = '8px';
      } else {
        toolbarRef.current.style.right = `${position.x}px`;
        toolbarRef.current.style.top = `${position.y}px`;
      }
    }
  }, [position]);

  // #region agent log - PowerUserToolbar render
  useEffect(() => {
    if (typeof window === 'undefined') return; // Skip in SSR
    const parentPos = toolbarRef.current?.parentElement && typeof getComputedStyle !== 'undefined' 
      ? getComputedStyle(toolbarRef.current.parentElement).position 
      : 'N/A';
    console.log('[DEBUG] PowerUserToolbar RENDERED', {
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'verify-deployment',
      hypothesisId: 'H',
      data: {
        position: { x: position.x, y: position.y },
        hasParent: !!toolbarRef.current?.parentElement,
        parentPosition: parentPos,
      },
    });
  }, [position.x, position.y]);
  // #endregion

  return (
    <div 
      ref={toolbarRef}
      className="zstack-power-toolbar bg-[var(--xibalba-grey-100)] border-2 border-[var(--xibalba-accent)]/20 shadow-lg rounded-lg"
      style={{
        position: 'relative', // Changed from absolute to relative for center stack layout
        width: '100%',
        zIndex: 50,
        pointerEvents: 'auto',
        contain: 'layout style paint',
      } as React.CSSProperties}
      data-power-toolbar="true"
    >
      <div className="xibalba-panel-elevated-professional power-toolbar-panel" style={{ width: '100%' }}>
        {/* Toolbar Header - No drag handle needed in center stack layout */}
        <div className="w-full h-6 flex items-center justify-center transition-all mb-1 border-b border-white/10">
          <span className="text-xs text-[var(--xibalba-text-200)] uppercase tracking-wider">Canvas Settings</span>
        </div>
        <Tooltip content="Canvas Settings - Configure grid, guides, and onion skinning" position="left">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="xibalba-button-professional w-full"
            aria-label="Canvas Settings"
            title="Canvas Settings - Configure grid, guides, and onion skinning"
          >
          <span className="material-symbols-outlined text-[16px] mr-2" aria-hidden="true">grid_on</span>
          Canvas Settings
          <span className="material-symbols-outlined text-[14px] ml-auto" aria-hidden="true">
            {isExpanded ? 'expand_less' : 'expand_more'}
          </span>
          </button>
        </Tooltip>

        {isExpanded && (
          <div className="p-4 space-y-4 border-t border-white/10 mt-2">
            {/* Snap Settings */}
            <div className="space-y-2">
              <label className="xibalba-label-professional">Snap Settings</label>
              <Tooltip content="Snap to Grid - Align objects to grid when moving" position="left">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={snapToGrid}
                    onChange={(e) => onSnapToGridChange(e.target.checked)}
                    className="xibalba-focus-professional"
                  />
                  <span className="xibalba-text-body">Snap to Grid</span>
                </div>
              </Tooltip>
              <Tooltip content="Snap to Guides - Align objects to guides when moving" position="left">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={snapToGuides}
                    onChange={(e) => onSnapToGuidesChange(e.target.checked)}
                    className="xibalba-focus-professional"
                  />
                  <span className="xibalba-text-body">Snap to Guides</span>
                </div>
              </Tooltip>
              {snapToGrid && (
                <Tooltip content="Grid Size - Set spacing between grid lines (5-100px)" position="left">
                  <div className="flex items-center gap-2 mt-2">
                    <label className="xibalba-text-caption">Grid Size:</label>
                    <input
                      type="number"
                      value={gridSize}
                      onChange={(e) => onGridSizeChange(parseInt(e.target.value) || 10)}
                      className="xibalba-input-professional w-20"
                      min="5"
                      max="100"
                      step="5"
                    />
                    <span className="xibalba-text-caption">px</span>
                  </div>
                </Tooltip>
              )}
            </div>

            {/* Guide Settings */}
            <div className="space-y-2">
              <label className="xibalba-label-professional">Guides</label>
              <Tooltip content="Show Guides - Toggle guide visibility on canvas" position="left">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showGuides}
                    onChange={(e) => onShowGuidesChange(e.target.checked)}
                    className="xibalba-focus-professional"
                  />
                  <span className="xibalba-text-body">Show Guides</span>
                </div>
              </Tooltip>
            </div>

            {/* Onion Skinning */}
            <div className="space-y-2">
              <label className="xibalba-label-professional">Onion Skinning</label>
              <Tooltip content="Enable Onion Skin - Show previous/next frames for animation reference" position="left">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showOnionSkin}
                    onChange={(e) => onShowOnionSkinChange(e.target.checked)}
                    className="xibalba-focus-professional"
                  />
                  <span className="xibalba-text-body">Enable Onion Skin</span>
                </div>
              </Tooltip>
              {showOnionSkin && (
                <Tooltip content="Onion Skin Frames - Number of previous/next frames to show (1-10)" position="left">
                  <div className="flex items-center gap-2 mt-2">
                    <label className="xibalba-text-caption">Frames:</label>
                    <input
                      type="number"
                      value={onionSkinFrames}
                      onChange={(e) => onOnionSkinFramesChange(parseInt(e.target.value) || 2)}
                      className="xibalba-input-professional w-20"
                      min="1"
                      max="10"
                    />
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerUserToolbar;

