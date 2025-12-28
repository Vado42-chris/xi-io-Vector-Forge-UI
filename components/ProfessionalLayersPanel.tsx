/**
 * Professional Layers Panel - Complete Layer Management
 * All layer options like a real vector editing suite
 */

import React, { useState, useEffect, useRef } from 'react';
import { VectorLayer } from '../types';

interface ProfessionalLayersPanelProps {
  layers: VectorLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<VectorLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onReorderLayer: (id: string, direction: 'up' | 'down') => void;
  onCreateLayer: () => void;
  onCreateSublayer: (parentId: string) => void;
  onGroupLayers: (ids: string[]) => void;
  onUngroupLayer: (id: string) => void;
  onCreateClippingMask: (layerId: string, maskId: string) => void;
  onReleaseClippingMask: (layerId: string) => void;
  onBringToFront?: (id: string) => void;
  onSendToBack?: (id: string) => void;
  onBringForward?: (id: string) => void;
  onSendBackward?: (id: string) => void;
  onExpandAppearance?: (id: string) => void;
  onCreateOutlines?: (id: string) => void;
}

const ProfessionalLayersPanel: React.FC<ProfessionalLayersPanelProps> = ({
  layers, selectedLayerId, onSelectLayer, onUpdateLayer, onDeleteLayer,
  onDuplicateLayer, onReorderLayer, onCreateLayer, onCreateSublayer,
  onGroupLayers, onUngroupLayer, onCreateClippingMask, onReleaseClippingMask,
  onBringToFront, onSendToBack, onBringForward, onSendBackward,
  onExpandAppearance, onCreateOutlines
}) => {
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set());
  const [showOptions, setShowOptions] = useState<string | null>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target as Node)) {
        setShowOptions(null);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showOptions]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLayers(newExpanded);
  };

  const renderLayer = (layer: VectorLayer, depth: number = 0) => {
    const isExpanded = expandedLayers.has(layer.id);
    const isSelected = selectedLayerId === layer.id;
    const hasChildren = (layer.children && layer.children.length > 0) || false;

    return (
      <div key={layer.id} className="select-none">
        <div
          className={`flex items-center gap-2 px-2 py-1.5 hover:bg-[var(--xibalba-grey-150)] cursor-pointer layer-depth-${Math.min(depth, 5)} ${
            isSelected ? 'bg-[var(--xibalba-grey-200)]' : ''
          }`}
          onClick={() => onSelectLayer(layer.id)}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowOptions(showOptions === layer.id ? null : layer.id);
          }}
        >
          {/* Expand/Collapse */}
          {hasChildren && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleExpanded(layer.id); }}
              className="w-4 h-4 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[12px]">
                {isExpanded ? 'expand_more' : 'chevron_right'}
              </span>
            </button>
          )}
          {!hasChildren && <div className="w-4" />}

          {/* Visibility */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateLayer(layer.id, { visible: !layer.visible });
            }}
            className="w-4 h-4 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[14px]">
              {layer.visible ? 'visibility' : 'visibility_off'}
            </span>
          </button>

          {/* Lock */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateLayer(layer.id, { locked: !layer.locked });
            }}
            className="w-4 h-4 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[14px]">
              {layer.locked ? 'lock' : 'lock_open'}
            </span>
          </button>

          {/* Color Swatch */}
          <div
            ref={(node) => {
              if (node) {
                node.style.setProperty('--layer-color', layer.color);
              }
            }}
            className="w-4 h-4 border border-white/20 layer-color-swatch cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              // Trigger color picker by selecting layer and switching to inspector tab
              onSelectLayer(layer.id);
            }}
          />

          {/* Layer Name */}
          <span className="flex-1 text-xs truncate">{layer.name}</span>

          {/* Options Menu */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(showOptions === layer.id ? null : layer.id);
            }}
            className="w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <span className="material-symbols-outlined text-[12px]">more_vert</span>
          </button>
        </div>

        {/* Options Menu */}
        {showOptions === layer.id && (
          <div className="absolute bg-[var(--xibalba-grey-200)] border border-white/20 shadow-lg z-50 options-menu" data-depth={depth}>
            <button 
              onClick={() => { onDuplicateLayer(layer.id); setShowOptions(null); }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              Duplicate
            </button>
            <button 
              onClick={() => { onCreateSublayer(layer.id); setShowOptions(null); }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              New Sublayer
            </button>
            <button 
              onClick={() => { onGroupLayers([layer.id]); setShowOptions(null); }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[14px]">group</span>
              Group
            </button>
            {hasChildren && (
              <button 
                onClick={() => { onUngroupLayer(layer.id); setShowOptions(null); }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[14px]">ungroup</span>
                Ungroup
              </button>
            )}
            <button 
              onClick={() => { onCreateClippingMask(layer.id, `mask_${Date.now()}`); setShowOptions(null); }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[14px]">crop</span>
              Make Clipping Mask
            </button>
            {layer.mask && (
              <button 
                onClick={() => { onReleaseClippingMask(layer.id); setShowOptions(null); }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[14px]">crop_free</span>
                Release Clipping Mask
              </button>
            )}
            {onExpandAppearance && (
              <button 
                onClick={() => { onExpandAppearance(layer.id); setShowOptions(null); }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[14px]">expand</span>
                Expand Appearance
              </button>
            )}
            {onCreateOutlines && (
              <button 
                onClick={() => { onCreateOutlines(layer.id); setShowOptions(null); }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[14px]">format_shapes</span>
                Create Outlines
              </button>
            )}
            <div className="h-px bg-white/10 my-1" />
            {onBringToFront && (
              <button 
                onClick={() => { onBringToFront(layer.id); setShowOptions(null); }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                Bring to Front
              </button>
            )}
            {onSendToBack && (
              <button 
                onClick={() => { onSendToBack(layer.id); setShowOptions(null); }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                Send to Back
              </button>
            )}
            {onBringForward && (
              <button 
                onClick={() => { onBringForward(layer.id); setShowOptions(null); }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[14px]">keyboard_arrow_up</span>
                Bring Forward
              </button>
            )}
            {onSendBackward && (
              <button 
                onClick={() => { onSendBackward(layer.id); setShowOptions(null); }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[14px]">keyboard_arrow_down</span>
                Send Backward
              </button>
            )}
            <div className="h-px bg-white/10 my-1" />
            <button 
              onClick={() => { onDeleteLayer(layer.id); setShowOptions(null); }}
              className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] flex items-center gap-2 text-red-400"
            >
              <span className="material-symbols-outlined text-[14px]">delete</span>
              Delete
            </button>
          </div>
        )}

        {/* Children */}
        {isExpanded && hasChildren && layer.children && (
          <div>
            {layer.children.map(child => renderLayer(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[var(--xibalba-grey-050)]">
      {/* Panel Header */}
      <div className="xibalba-section-header-professional flex items-center justify-between">
        <span>Layers</span>
        <div className="flex items-center gap-1">
          <button
            onClick={onCreateLayer}
            className="xibalba-toolbar-button-professional"
            title="New Layer"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
          </button>
          <button
            className="xibalba-toolbar-button-professional"
            title="Layer Options"
          >
            <span className="material-symbols-outlined text-[14px]">more_vert</span>
          </button>
        </div>
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto xibalba-scrollbar">
        {layers
          .filter(l => !l.mask && !layers.some(parent => parent.children?.some(child => child.id === l.id))) // Top-level layers only
          .map(layer => renderLayer(layer))}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-white/10 p-2 flex items-center gap-2 shrink-0">
        <button
          onClick={() => {
            if (selectedLayerId) {
              const selectedLayer = layers.find(l => l.id === selectedLayerId);
              if (selectedLayer && selectedLayer.children && selectedLayer.children.length > 0) {
                onUngroupLayer(selectedLayerId);
              } else {
                onGroupLayers([selectedLayerId]);
              }
            }
          }}
          className="xibalba-button-professional flex-1 text-xs"
          disabled={!selectedLayerId}
        >
          <span className="material-symbols-outlined text-[14px] mr-1">
            {layers.find(l => l.id === selectedLayerId)?.children ? 'ungroup' : 'group'}
          </span>
          {layers.find(l => l.id === selectedLayerId)?.children ? 'Ungroup' : 'Group'}
        </button>
        <button
          onClick={() => {
            if (selectedLayerId) {
              onDeleteLayer(selectedLayerId);
            }
          }}
          className="xibalba-button-professional flex-1 text-xs delete-button-text"
          disabled={!selectedLayerId}
        >
          <span className="material-symbols-outlined text-[14px] mr-1">delete</span>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProfessionalLayersPanel;

