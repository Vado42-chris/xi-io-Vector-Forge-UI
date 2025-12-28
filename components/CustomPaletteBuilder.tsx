/**
 * Custom Palette Builder
 * Allows users to create custom palettes by dragging tools/components
 * Power users can build their own workspace layouts
 */

import React, { useState, useRef, useCallback } from 'react';
import { DraggablePalette, PalettePosition } from './PaletteDockingSystem';

export interface PaletteItem {
  id: string;
  type: 'tool' | 'component' | 'group';
  label: string;
  icon: string;
  component?: React.ReactNode;
  action?: () => void;
}

export interface CustomPalette {
  id: string;
  name: string;
  items: PaletteItem[];
  position: PalettePosition;
  attachedToFrame?: string; // Template frame ID if attached
}

interface CustomPaletteBuilderProps {
  customPalettes: CustomPalette[];
  onPaletteCreate: (palette: CustomPalette) => void;
  onPaletteUpdate: (id: string, palette: Partial<CustomPalette>) => void;
  onPaletteDelete: (id: string) => void;
  availableItems: PaletteItem[]; // All available tools/components to add
}

export const CustomPaletteBuilder: React.FC<CustomPaletteBuilderProps> = ({
  customPalettes,
  onPaletteCreate,
  onPaletteUpdate,
  onPaletteDelete,
  availableItems
}) => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState('');
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);

  const handleCreatePalette = () => {
    if (!newPaletteName.trim()) return;
    
    const newPalette: CustomPalette = {
      id: `custom-palette-${Date.now()}`,
      name: newPaletteName,
      items: [],
      position: {
        zone: 'floating',
        x: 100,
        y: 100,
        width: 250,
        height: 400,
        order: customPalettes.length
      }
    };
    
    onPaletteCreate(newPalette);
    setNewPaletteName('');
    setIsBuilding(false);
    setSelectedPalette(newPalette.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="xibalba-text-subheading">Custom Palettes</h3>
        <button
          onClick={() => setIsBuilding(!isBuilding)}
          className="xibalba-button-professional"
        >
          <span className="material-symbols-outlined text-[16px] mr-2">add</span>
          New Palette
        </button>
      </div>

      {isBuilding && (
        <div className="xibalba-panel-professional p-4 space-y-3">
          <input
            type="text"
            value={newPaletteName}
            onChange={(e) => setNewPaletteName(e.target.value)}
            placeholder="Palette name..."
            className="xibalba-input-professional w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreatePalette();
              if (e.key === 'Escape') setIsBuilding(false);
            }}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreatePalette}
              className="xibalba-button-professional flex-1"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsBuilding(false);
                setNewPaletteName('');
              }}
              className="xibalba-button-professional"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {customPalettes.map(palette => (
          <div
            key={palette.id}
            className="xibalba-panel-professional p-3 flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="xibalba-text-subheading">{palette.name}</div>
              <div className="xibalba-text-caption">
                {palette.items.length} items
                {palette.attachedToFrame && ` • Attached to frame`}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPalette(palette.id)}
                className="xibalba-toolbar-button-professional"
                title="Edit"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
              <button
                onClick={() => onPaletteDelete(palette.id)}
                className="xibalba-toolbar-button-professional"
                title="Delete"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Custom Palette Renderer
 * Renders a user-created custom palette
 */
export const CustomPaletteRenderer: React.FC<{
  palette: CustomPalette;
  onPositionChange: (position: PalettePosition) => void;
  onItemAdd: (item: PaletteItem) => void;
  onItemRemove: (itemId: string) => void;
  onItemReorder: (oldIndex: number, newIndex: number) => void;
  availableItems: PaletteItem[];
  zIndex: number;
}> = ({
  palette,
  onPositionChange,
  onItemAdd,
  onItemRemove,
  onItemReorder,
  availableItems,
  zIndex
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleItemDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleItemDrop = (targetIndex: number) => {
    if (draggedItem) {
      const oldIndex = palette.items.findIndex(i => i.id === draggedItem);
      if (oldIndex !== -1) {
        onItemReorder(oldIndex, targetIndex);
      }
      setDraggedItem(null);
    }
  };

  return (
    <DraggablePalette
      id={palette.id}
      title={palette.name}
      position={palette.position}
      onPositionChange={onPositionChange}
      zIndex={zIndex}
      defaultWidth={palette.position.width || 250}
      defaultHeight={palette.position.height || 400}
      resizable={true}
    >
      <div className="p-3 space-y-2">
        {/* Edit Mode Toggle */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <span className="xibalba-text-caption text-[8px] uppercase">
            {palette.items.length} items
          </span>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="xibalba-toolbar-button-professional size-6"
            title={isEditing ? 'Done Editing' : 'Edit Palette'}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isEditing ? 'check' : 'edit'}
            </span>
          </button>
        </div>

        {/* Palette Items */}
        <div className="space-y-1">
          {palette.items.map((item, index) => (
            <div
              key={item.id}
              draggable={isEditing}
              onDragStart={() => handleItemDragStart(item.id)}
              onDragOver={(e) => {
                if (isEditing) {
                  e.preventDefault();
                }
              }}
              onDrop={() => handleItemDrop(index)}
              className={`
                flex items-center gap-2 p-2 rounded
                ${isEditing ? 'cursor-move hover:bg-[var(--xibalba-grey-150)]' : ''}
              `}
            >
              <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
              <span className="xibalba-text-xs flex-1">{item.label}</span>
              {isEditing && (
                <button
                  onClick={() => onItemRemove(item.id)}
                  className="xibalba-toolbar-button-professional size-5 opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-[12px]">close</span>
                </button>
              )}
              {!isEditing && item.action && (
                <button
                  onClick={item.action}
                  className="xibalba-toolbar-button-professional size-6"
                >
                  <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Items (Edit Mode) */}
        {isEditing && (
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="xibalba-text-caption text-[8px] uppercase mb-2">
              Add Items
            </div>
            <div className="max-h-48 overflow-y-auto xibalba-scrollbar space-y-1">
              {availableItems
                .filter(item => !palette.items.find(i => i.id === item.id))
                .map(item => (
                  <button
                    key={item.id}
                    onClick={() => onItemAdd(item)}
                    className="w-full flex items-center gap-2 p-2 hover:bg-[var(--xibalba-grey-150)] text-left"
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    <span className="xibalba-text-xs flex-1">{item.label}</span>
                    <span className="material-symbols-outlined text-[14px] opacity-50">add</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </DraggablePalette>
  );
};

