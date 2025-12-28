/**
 * Workflow Layout Service
 * Manages UI layouts and panel arrangements
 * Part of Patch 3: Workflow Layouts
 */

import type { WorkflowLayout, PanelConfig, LayoutPreset } from '../types/workflow';

class WorkflowLayoutService {
  private layouts: Map<string, WorkflowLayout> = new Map();
  private currentLayoutId: string | null = null;
  private initialized = false;

  /**
   * Initialize layout service from data file
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Load layout data
      const response = await fetch('/data/workflowLayouts.json');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.layouts)) {
          data.layouts.forEach((layout: WorkflowLayout) => {
            this.layouts.set(layout.id, layout);
          });
        }
        // Set default layout
        if (data.defaultLayout) {
          this.currentLayoutId = data.defaultLayout;
        }
      }
    } catch (error) {
      console.warn('Failed to load workflow layouts:', error);
      // Continue with default layout
      this.createDefaultLayout();
    }

    this.initialized = true;
  }

  /**
   * Create default layout
   */
  private createDefaultLayout(): void {
    const defaultLayout: WorkflowLayout = {
      id: 'default',
      name: 'Default Layout',
      description: 'Standard layout with all panels visible',
      category: 'default',
      panels: [
        { id: 'left-sidebar', type: 'sidebar', position: 'left', width: 320, visible: true, order: 1 },
        { id: 'right-sidebar', type: 'sidebar', position: 'right', width: 320, visible: true, order: 2 },
        { id: 'toolbar', type: 'toolbar', position: 'top', height: 64, visible: true, order: 3 },
        { id: 'canvas', type: 'canvas', position: 'center', visible: true, order: 4 },
        { id: 'timeline', type: 'timeline', position: 'bottom', height: 200, visible: true, order: 5 },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.layouts.set('default', defaultLayout);
    this.currentLayoutId = 'default';
  }

  /**
   * Get current layout
   */
  getCurrentLayout(): WorkflowLayout | null {
    if (!this.currentLayoutId) {
      return null;
    }
    return this.layouts.get(this.currentLayoutId) || null;
  }

  /**
   * Set current layout
   */
  setCurrentLayout(layoutId: string): boolean {
    if (this.layouts.has(layoutId)) {
      this.currentLayoutId = layoutId;
      this.saveCurrentLayout();
      return true;
    }
    return false;
  }

  /**
   * Get layout by ID
   */
  getLayout(layoutId: string): WorkflowLayout | undefined {
    return this.layouts.get(layoutId);
  }

  /**
   * Get all layouts
   */
  getAllLayouts(): WorkflowLayout[] {
    return Array.from(this.layouts.values()).sort((a, b) => 
      (a.updatedAt || 0) - (b.updatedAt || 0)
    );
  }

  /**
   * Create new layout
   */
  createLayout(name: string, description: string, panels: PanelConfig[]): string {
    const layoutId = `layout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const layout: WorkflowLayout = {
      id: layoutId,
      name,
      description,
      category: 'custom',
      panels,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.layouts.set(layoutId, layout);
    this.saveLayouts();
    return layoutId;
  }

  /**
   * Update layout
   */
  updateLayout(layoutId: string, updates: Partial<WorkflowLayout>): boolean {
    const layout = this.layouts.get(layoutId);
    if (!layout) {
      return false;
    }

    const updated: WorkflowLayout = {
      ...layout,
      ...updates,
      updatedAt: Date.now(),
    };

    this.layouts.set(layoutId, updated);
    this.saveLayouts();
    return true;
  }

  /**
   * Delete layout
   */
  deleteLayout(layoutId: string): boolean {
    if (layoutId === 'default') {
      return false; // Cannot delete default layout
    }

    if (this.layouts.has(layoutId)) {
      this.layouts.delete(layoutId);
      if (this.currentLayoutId === layoutId) {
        this.currentLayoutId = 'default';
      }
      this.saveLayouts();
      return true;
    }
    return false;
  }

  /**
   * Get panel config for current layout
   */
  getPanelConfig(panelId: string): PanelConfig | null {
    const layout = this.getCurrentLayout();
    if (!layout) {
      return null;
    }
    return layout.panels.find(p => p.id === panelId) || null;
  }

  /**
   * Update panel config
   */
  updatePanelConfig(panelId: string, config: Partial<PanelConfig>): boolean {
    const layout = this.getCurrentLayout();
    if (!layout) {
      return false;
    }

    const panelIndex = layout.panels.findIndex(p => p.id === panelId);
    if (panelIndex === -1) {
      return false;
    }

    layout.panels[panelIndex] = {
      ...layout.panels[panelIndex],
      ...config,
    };

    layout.updatedAt = Date.now();
    this.layouts.set(layout.id, layout);
    this.saveLayouts();
    return true;
  }

  /**
   * Save layouts to localStorage
   */
  private saveLayouts(): void {
    if (typeof window !== 'undefined') {
      try {
        const layouts = Array.from(this.layouts.values());
        localStorage.setItem('workflowLayouts', JSON.stringify({ layouts }));
      } catch (error) {
        console.error('Failed to save layouts:', error);
      }
    }
  }

  /**
   * Load layouts from localStorage
   */
  private loadLayouts(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('workflowLayouts');
        if (stored) {
          const data = JSON.parse(stored);
          if (Array.isArray(data.layouts)) {
            data.layouts.forEach((layout: WorkflowLayout) => {
              this.layouts.set(layout.id, layout);
            });
          }
        }
      } catch (error) {
        console.error('Failed to load layouts:', error);
      }
    }
  }

  /**
   * Save current layout ID
   */
  private saveCurrentLayout(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('currentWorkflowLayout', this.currentLayoutId || '');
      } catch (error) {
        console.error('Failed to save current layout:', error);
      }
    }
  }

  /**
   * Load current layout ID
   */
  private loadCurrentLayout(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('currentWorkflowLayout');
        if (stored && this.layouts.has(stored)) {
          this.currentLayoutId = stored;
        }
      } catch (error) {
        console.error('Failed to load current layout:', error);
      }
    }
  }
}

// Singleton instance
export const workflowLayoutService = new WorkflowLayoutService();

// Auto-initialize
if (typeof window !== 'undefined') {
  workflowLayoutService.initialize().catch(console.error);
  workflowLayoutService.loadLayouts();
  workflowLayoutService.loadCurrentLayout();
}

export default workflowLayoutService;
