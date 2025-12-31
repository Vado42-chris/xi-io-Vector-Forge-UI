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

  return (
    <div 
      ref={toolbarRef}
      className="absolute zstack-power-toolbar xibalba-panel-elevated-professional"
      style={{
        position: 'absolute',
        top: position.y === 0 ? '12px' : `${position.y}px`,
        right: position.x === 0 ? '12px' : `${position.x}px`,
        zIndex: 'var(--z-power-toolbar, 150)', // Must be above sidebars
        pointerEvents: 'auto',
        contain: 'layout style paint',
        minWidth: '200px',
        boxShadow: 'var(--shadow-floating)',
      } as React.CSSProperties}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
      onPointerCancel={handleDragEnd}
    >
      <div className="power-toolbar-panel">
        {/* Drag Handle - More Visible */}
        <Tooltip content="Drag to move toolbar" position="bottom">
          <div
            ref={dragHandleRef}
            onPointerDown={handleDragStart}
            className="power-toolbar-drag-handle w-full h-8 cursor-grab active:cursor-grabbing flex items-center justify-center transition-all border-b border-white/10 bg-[var(--xibalba-grey-100)] hover:bg-[var(--xibalba-grey-150)]"
            style={{ opacity: 0.8 }}
          >
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-[var(--xibalba-text-200)] rounded-sm"></div>
              <div className="w-2 h-2 bg-[var(--xibalba-text-200)] rounded-sm"></div>
              <div className="w-2 h-2 bg-[var(--xibalba-text-200)] rounded-sm"></div>
            </div>
          </div>
        </Tooltip>
        <Tooltip content="Canvas Settings - Configure grid, guides, and onion skinning" position="left">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="xibalba-button-professional w-full text-left justify-between"
            style={{ 
              height: '32px',
              padding: '0 12px',
              background: 'var(--xibalba-grey-150)',
              border: 'none',
            }}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">grid_on</span>
              <span className="text-[11px] font-medium">Canvas Settings</span>
            </span>
            <span className="material-symbols-outlined text-[14px]">
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

