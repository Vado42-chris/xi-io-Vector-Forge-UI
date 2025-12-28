/**
 * Workspace Layout Hook
 * Manages all columns, grids, toolbars, and palettes
 * Provides layout definitions and customization
 */

import { useState, useCallback, useEffect } from 'react';
import { PalettePosition, DockingZone } from '../components/PaletteDockingSystem';

export interface LayoutColumn {
  id: string;
  name: string;
  type: 'sidebar' | 'toolbar' | 'palette' | 'custom';
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  position: 'left' | 'right' | 'top' | 'bottom' | 'floating';
  resizable: boolean;
  collapsible: boolean;
  visible: boolean;
}

export interface LayoutGrid {
  id: string;
  name: string;
  columns: LayoutColumn[];
  rows?: number;
  gap?: number;
}

export interface ToolbarDefinition {
  id: string;
  name: string;
  items: string[]; // Tool IDs or component IDs
  position: 'top' | 'bottom' | 'left' | 'right' | 'floating';
  visible: boolean;
}

export interface WorkspaceLayout {
  columns: LayoutColumn[];
  grids: LayoutGrid[];
  toolbars: ToolbarDefinition[];
  customPalettes: string[]; // Custom palette IDs
}

export const useWorkspaceLayout = () => {
  const [layout, setLayout] = useState<WorkspaceLayout>({
    columns: [
      {
        id: 'left-sidebar',
        name: 'Left Sidebar',
        type: 'sidebar',
        width: 320,
        minWidth: 200,
        maxWidth: 600,
        position: 'left',
        resizable: true,
        collapsible: true,
        visible: true
      },
      {
        id: 'right-sidebar',
        name: 'Right Sidebar',
        type: 'sidebar',
        width: 360,
        minWidth: 200,
        maxWidth: 600,
        position: 'right',
        resizable: true,
        collapsible: true,
        visible: true
      },
      {
        id: 'tool-palette',
        name: 'Tool Palette',
        type: 'palette',
        width: 200,
        minWidth: 180,
        maxWidth: 400,
        position: 'left',
        resizable: true,
        collapsible: false,
        visible: true
      }
    ],
    grids: [],
    toolbars: [
      {
        id: 'top-toolbar',
        name: 'Top Toolbar',
        items: [],
        position: 'top',
        visible: true
      },
      {
        id: 'power-toolbar',
        name: 'Power User Toolbar',
        items: [],
        position: 'top',
        visible: true
      }
    ],
    customPalettes: []
  });

  const updateColumn = useCallback((id: string, updates: Partial<LayoutColumn>) => {
    setLayout(prev => ({
      ...prev,
      columns: prev.columns.map(col => 
        col.id === id ? { ...col, ...updates } : col
      )
    }));
  }, []);

  const addCustomPalette = useCallback((paletteId: string) => {
    setLayout(prev => ({
      ...prev,
      customPalettes: [...prev.customPalettes, paletteId]
    }));
  }, []);

  const removeCustomPalette = useCallback((paletteId: string) => {
    setLayout(prev => ({
      ...prev,
      customPalettes: prev.customPalettes.filter(id => id !== paletteId)
    }));
  }, []);

  const toggleColumnVisibility = useCallback((id: string) => {
    updateColumn(id, { visible: !layout.columns.find(c => c.id === id)?.visible });
  }, [layout.columns, updateColumn]);

  const resetLayout = useCallback(() => {
    setLayout({
      columns: [
        {
          id: 'left-sidebar',
          name: 'Left Sidebar',
          type: 'sidebar',
          width: 320,
          minWidth: 200,
          maxWidth: 600,
          position: 'left',
          resizable: true,
          collapsible: true,
          visible: true
        },
        {
          id: 'right-sidebar',
          name: 'Right Sidebar',
          type: 'sidebar',
          width: 360,
          minWidth: 200,
          maxWidth: 600,
          position: 'right',
          resizable: true,
          collapsible: true,
          visible: true
        },
        {
          id: 'tool-palette',
          name: 'Tool Palette',
          type: 'palette',
          width: 200,
          minWidth: 180,
          maxWidth: 400,
          position: 'left',
          resizable: true,
          collapsible: false,
          visible: true
        }
      ],
      grids: [],
      toolbars: [
        {
          id: 'top-toolbar',
          name: 'Top Toolbar',
          items: [],
          position: 'top',
          visible: true
        },
        {
          id: 'power-toolbar',
          name: 'Power User Toolbar',
          items: [],
          position: 'top',
          visible: true
        }
      ],
      customPalettes: []
    });
  }, []);

  // Calculate layout bounds based on visible columns
  const getLayoutBounds = useCallback(() => {
    const leftColumns = layout.columns.filter(c => c.position === 'left' && c.visible);
    const rightColumns = layout.columns.filter(c => c.position === 'right' && c.visible);
    const topToolbars = layout.toolbars.filter(t => t.position === 'top' && t.visible);
    const bottomToolbars = layout.toolbars.filter(t => t.position === 'bottom' && t.visible);

    const leftWidth = leftColumns.reduce((sum, col) => sum + (col.width || 0), 0);
    const rightWidth = rightColumns.reduce((sum, col) => sum + (col.width || 0), 0);
    const topHeight = topToolbars.length * 48; // Approximate toolbar height
    const bottomHeight = bottomToolbars.length * 48;

    return {
      left: leftWidth,
      right: rightWidth,
      top: topHeight,
      bottom: bottomHeight,
      contentWidth: window.innerWidth - leftWidth - rightWidth,
      contentHeight: window.innerHeight - topHeight - bottomHeight
    };
  }, [layout]);

  return {
    layout,
    updateColumn,
    addCustomPalette,
    removeCustomPalette,
    toggleColumnVisibility,
    resetLayout,
    getLayoutBounds
  };
};

