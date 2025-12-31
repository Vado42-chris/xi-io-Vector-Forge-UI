/**
 * Layout Persistence Service
 * Manages saving and loading workspace layouts
 * 
 * #hashtag: layout-persistence service
 */

import { WorkflowLayout, PanelConfig } from '../types/workflow';

export interface SavedLayout {
  id: string;
  name: string;
  description?: string;
  layout: WorkflowLayout;
  createdAt: number;
  updatedAt: number;
  isDefault?: boolean;
}

export interface LayoutSnapshot {
  panels: Array<{
    id: string;
    position: 'left' | 'right' | 'top' | 'bottom' | 'floating';
    quadrant?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    size: { width: number; height: number };
    visible: boolean;
    order: number;
  }>;
  workspaceLayout: string;
}

class LayoutPersistenceService {
  private storageKey = 'vectorforge-saved-layouts';
  private currentLayoutKey = 'vectorforge-current-layout';
  private savedLayouts: Map<string, SavedLayout> = new Map();

  constructor() {
    this.loadSavedLayouts();
  }

  /**
   * Load saved layouts from storage
   */
  private loadSavedLayouts(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const layouts = JSON.parse(stored) as SavedLayout[];
          layouts.forEach(layout => {
            this.savedLayouts.set(layout.id, layout);
          });
        }
      } catch (error) {
        console.error('Failed to load saved layouts:', error);
      }
    }
  }

  /**
   * Save layouts to storage
   */
  private saveLayouts(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const layouts = Array.from(this.savedLayouts.values());
        localStorage.setItem(this.storageKey, JSON.stringify(layouts));
      } catch (error) {
        console.error('Failed to save layouts:', error);
      }
    }
  }

  /**
   * Save current layout
   */
  saveLayout(name: string, description?: string, isDefault: boolean = false): string {
    const layoutId = `layout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Get current layout from workflowLayoutService
    // This would integrate with the actual layout system
    const currentLayout: WorkflowLayout = {
      id: layoutId,
      name,
      description: description || '',
      category: 'custom',
      panels: [], // Would be populated from actual panel state
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const savedLayout: SavedLayout = {
      id: layoutId,
      name,
      description,
      layout: currentLayout,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDefault,
    };

    this.savedLayouts.set(layoutId, savedLayout);
    this.saveLayouts();

    if (isDefault) {
      this.setDefaultLayout(layoutId);
    }

    return layoutId;
  }

  /**
   * Load a saved layout
   */
  loadLayout(layoutId: string): SavedLayout | null {
    return this.savedLayouts.get(layoutId) || null;
  }

  /**
   * Get all saved layouts
   */
  getAllLayouts(): SavedLayout[] {
    return Array.from(this.savedLayouts.values()).sort((a, b) => 
      b.updatedAt - a.updatedAt
    );
  }

  /**
   * Delete a saved layout
   */
  deleteLayout(layoutId: string): boolean {
    if (this.savedLayouts.has(layoutId)) {
      this.savedLayouts.delete(layoutId);
      this.saveLayouts();
      return true;
    }
    return false;
  }

  /**
   * Update a saved layout
   */
  updateLayout(layoutId: string, updates: Partial<SavedLayout>): boolean {
    const layout = this.savedLayouts.get(layoutId);
    if (!layout) return false;

    const updated: SavedLayout = {
      ...layout,
      ...updates,
      updatedAt: Date.now(),
    };

    this.savedLayouts.set(layoutId, updated);
    this.saveLayouts();
    return true;
  }

  /**
   * Save current layout snapshot
   */
  saveSnapshot(snapshot: LayoutSnapshot): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.currentLayoutKey, JSON.stringify(snapshot));
      } catch (error) {
        console.error('Failed to save layout snapshot:', error);
      }
    }
  }

  /**
   * Load current layout snapshot
   */
  loadSnapshot(): LayoutSnapshot | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.currentLayoutKey);
        if (stored) {
          return JSON.parse(stored) as LayoutSnapshot;
        }
      } catch (error) {
        console.error('Failed to load layout snapshot:', error);
      }
    }
    return null;
  }

  /**
   * Set default layout
   */
  setDefaultLayout(layoutId: string): void {
    // Unset other defaults
    this.savedLayouts.forEach((layout, id) => {
      if (id !== layoutId && layout.isDefault) {
        layout.isDefault = false;
      }
    });
    
    const layout = this.savedLayouts.get(layoutId);
    if (layout) {
      layout.isDefault = true;
      this.saveLayouts();
    }
  }

  /**
   * Get default layout
   */
  getDefaultLayout(): SavedLayout | null {
    for (const layout of this.savedLayouts.values()) {
      if (layout.isDefault) {
        return layout;
      }
    }
    return null;
  }

  /**
   * Export layout as JSON
   */
  exportLayout(layoutId: string): string | null {
    const layout = this.savedLayouts.get(layoutId);
    if (!layout) return null;
    
    return JSON.stringify(layout, null, 2);
  }

  /**
   * Import layout from JSON
   */
  importLayout(json: string): string | null {
    try {
      const layout = JSON.parse(json) as SavedLayout;
      const layoutId = `layout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const imported: SavedLayout = {
        ...layout,
        id: layoutId,
        updatedAt: Date.now(),
      };

      this.savedLayouts.set(layoutId, imported);
      this.saveLayouts();
      return layoutId;
    } catch (error) {
      console.error('Failed to import layout:', error);
      return null;
    }
  }
}

export const layoutPersistenceService = new LayoutPersistenceService();

