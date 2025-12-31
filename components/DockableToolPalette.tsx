/**
 * Dockable Tool Palette
 * Professional tool palette that docks to left by default
 * Can be dragged and docked like Photoshop/Illustrator
 */

import React, { useMemo, useState, useCallback } from 'react';
import { ToolType } from '../types';
import { DraggablePalette, PalettePosition } from './PaletteDockingSystem';
import ToolLockingSystem, { useToolLock, ToolLockIndicator } from './ToolLockingSystem';
import { HoverFeedback, RippleEffect } from './ProductionQualityInteractions';
import { ToolButton } from './shared/ToolButton';

interface DockableToolPaletteProps {
  activeTool: ToolType;
  setTool: (tool: ToolType) => void;
  onSmartMagic: () => void;
  position: PalettePosition;
  onPositionChange: (position: PalettePosition) => void;
  zIndex: number;
}

const DockableToolPalette: React.FC<DockableToolPaletteProps> = ({
  activeTool, setTool, onSmartMagic, position, onPositionChange, zIndex
}) => {
  const { lockState, toggleLock, unlockTool } = useToolLock();
  const [toolLocked, setToolLocked] = useState(false);
  // Professional tool palette - all tools in order, grouped visually
  const tools = useMemo(() => [
    // Selection
    { id: 'select' as ToolType, icon: 'near_me', label: 'Selection', shortcut: 'V' },
    { id: 'direct-select' as ToolType, icon: 'ads_click', label: 'Direct Selection', shortcut: 'A' },
    { id: 'group-select' as ToolType, icon: 'group', label: 'Group Selection', shortcut: '' },
    // Drawing
    { id: 'pen' as ToolType, icon: 'edit', label: 'Pen', shortcut: 'P' },
    { id: 'pencil' as ToolType, icon: 'draw', label: 'Pencil', shortcut: 'N' },
    { id: 'brush' as ToolType, icon: 'brush', label: 'Brush', shortcut: 'B' },
    { id: 'line' as ToolType, icon: 'show_chart', label: 'Line', shortcut: '\\' },
    // Shapes
    { id: 'rectangle' as ToolType, icon: 'crop_square', label: 'Rectangle', shortcut: 'M' },
    { id: 'ellipse' as ToolType, icon: 'radio_button_unchecked', label: 'Ellipse', shortcut: 'L' },
    { id: 'polygon' as ToolType, icon: 'change_history', label: 'Polygon', shortcut: '' },
    { id: 'star' as ToolType, icon: 'star', label: 'Star', shortcut: '' },
    { id: 'spiral' as ToolType, icon: 'sync', label: 'Spiral', shortcut: '' },
    // Text
    { id: 'text' as ToolType, icon: 'text_fields', label: 'Type', shortcut: 'T' },
    { id: 'text-on-path' as ToolType, icon: 'text_rotate_vertical', label: 'Text on Path', shortcut: '' },
    // Transform
    { id: 'rotate' as ToolType, icon: 'rotate_right', label: 'Rotate', shortcut: 'R' },
    { id: 'scale' as ToolType, icon: 'open_with', label: 'Scale', shortcut: 'S' },
    { id: 'free-transform' as ToolType, icon: 'transform', label: 'Free Transform', shortcut: 'E' },
    { id: 'reflect' as ToolType, icon: 'flip', label: 'Reflect', shortcut: 'O' },
    // Utility
    { id: 'eyedropper' as ToolType, icon: 'colorize', label: 'Eyedropper', shortcut: 'I' },
    { id: 'gradient' as ToolType, icon: 'gradient', label: 'Gradient', shortcut: 'G' },
    { id: 'mesh' as ToolType, icon: 'grid_on', label: 'Mesh', shortcut: '' },
    // Navigation
    { id: 'pan' as ToolType, icon: 'pan_tool', label: 'Hand', shortcut: 'H' },
    { id: 'zoom' as ToolType, icon: 'zoom_in', label: 'Zoom', shortcut: 'Z' },
  ], []);

  const toolGroups = useMemo(() => {
    return [
      { name: 'Selection', tools: tools.slice(0, 3) },
      { name: 'Drawing', tools: tools.slice(3, 7) },
      { name: 'Shapes', tools: tools.slice(7, 12) },
      { name: 'Text', tools: tools.slice(12, 14) },
      { name: 'Transform', tools: tools.slice(14, 18) },
      { name: 'Utility', tools: tools.slice(18, 21) },
      { name: 'Navigation', tools: tools.slice(21) },
    ];
  }, [tools]);

  return (
    <DraggablePalette
      id="tool-palette"
      title="Tools"
      position={position}
      onPositionChange={onPositionChange}
      zIndex={zIndex}
      defaultZone="left"
      defaultWidth={200}
      defaultHeight={window.innerHeight - 200}
      minWidth={180}
      minHeight={400}
      resizable={true}
    >
      <div className="p-2 space-y-1">
        {toolGroups.map((group, groupIdx) => (
          <div key={group.name} className={groupIdx > 0 ? 'mt-4 pt-4 border-t border-white/10' : ''}>
            <div className="px-2 mb-2">
              <span className="xibalba-text-caption text-xs font-black uppercase tracking-widest text-[var(--xibalba-text-100)]">
                {group.name}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {group.tools.map(tool => {
                const isLocked = lockState.isLocked && lockState.lockedTool === tool.id;
                const isDisabled = lockState.isLocked && !isLocked;
                
                return (
                  <RippleEffect key={tool.id}>
                    <HoverFeedback
                      className="w-full"
                      hoverClassName=""
                    >
                      <div
                        onContextMenu={(e) => {
                          e.preventDefault();
                          toggleLock(tool.id, `Locked: ${tool.label}`);
                        }}
                        className={`relative ${isLocked ? 'ring-2 ring-[var(--xibalba-accent)] ring-opacity-50' : ''}`}
                      >
                        <ToolButton
                          tool={tool}
                          activeTool={activeTool}
                          onClick={(id) => {
                            if (lockState.isLocked && lockState.lockedTool !== id) {
                              return; // Tool is locked to another tool
                            }
                            setTool(id);
                          }}
                          disabled={isDisabled}
                          variant="compact"
                          tooltip={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}${isLocked ? ' [LOCKED]' : ''} - Right-click to lock`}
                        />
                        {isLocked && (
                          <span className="material-symbols-outlined text-[12px] text-[var(--xibalba-accent)] absolute right-2 top-2 pointer-events-none">
                            lock
                          </span>
                        )}
                      </div>
                    </HoverFeedback>
                  </RippleEffect>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* Smart Magic Button */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <RippleEffect>
            <HoverFeedback
              hoverClassName="scale-105"
            >
              <button
                onClick={onSmartMagic}
                className="w-full xibalba-button-professional bg-[var(--xibalba-accent)] text-white p-3 flex items-center justify-center gap-2 transition-all duration-200 ease-out hover:shadow-lg"
                title="Smart Magic AI"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span className="xibalba-text-xs font-black uppercase tracking-widest">Smart Magic</span>
              </button>
            </HoverFeedback>
          </RippleEffect>
        </div>
        
        {/* Tool Lock Indicator */}
        {lockState.isLocked && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between px-2 py-1 bg-[var(--xibalba-grey-100)] rounded">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-[var(--xibalba-accent)]">
                  lock
                </span>
                <span className="xibalba-text-caption text-xs text-[var(--xibalba-text-100)]">
                  {lockState.lockedTool} locked
                </span>
              </div>
              <button
                onClick={() => unlockTool()}
                className="xibalba-toolbar-button-professional size-5"
                title="Unlock Tool"
              >
                <span className="material-symbols-outlined text-[12px]">lock_open</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </DraggablePalette>
  );
};

export default DockableToolPalette;

