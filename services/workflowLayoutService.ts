/**
 * Workflow Layout Service
 * Manages workspace layouts for different workflows
 * Supports layout switching, persistence, and customization
 */

import type {
  WorkflowLayout,
  PanelConfig,
  ILayoutService,
} from '../types/workflow';
// Optional checkpoint service - don't block initialization if it fails
const createCheckpoint = async (id: string, description: string, files: string[] = [], metadata: any = {}) => {
  try {
    const { checkpointService } = await import('./checkpointService');
    await checkpointService.createCheckpoint(id, description, files, metadata);
  } catch (error) {
    // Non-blocking - checkpoint failures shouldn't break the app
    console.warn('Checkpoint creation failed:', error);
  }
};

class WorkflowLayoutService implements ILayoutService {
  private layouts: Map<string, WorkflowLayout> = new Map();
  private currentLayoutId: string | null = null;
  private initialized: boolean = false;

  /**
   * Initialize service with default layouts
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Load from data file (will be created in next checkpoint)
      const response = await fetch('/data/workflowLayouts.json');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.layouts)) {
          data.layouts.forEach((layout: WorkflowLayout) => {
            this.layouts.set(layout.id, layout);
            if (layout.default) {
              this.currentLayoutId = layout.id;
            }
          });
        }
      }
    } catch (error) {
      console.warn('Could not load workflow layouts from file, using defaults');
    }

    // If no current layout, use first default or first layout
    if (!this.currentLayoutId) {
      const defaultLayout = Array.from(this.layouts.values()).find(l => l.default);
      this.currentLayoutId = defaultLayout?.id || Array.from(this.layouts.keys())[0] || null;
    }

    this.initialized = true;

    // Create checkpoint (non-blocking)
    createCheckpoint(
      'layout-service-initialized',
      'Workflow layout service initialized',
      [],
      { layoutCount: this.layouts.size, currentLayout: this.currentLayoutId }
    );
  }

  /**
   * Get all available layouts
   */
  getLayouts(): WorkflowLayout[] {
    return Array.from(this.layouts.values());
  }

  /**
   * Get layout by ID
   */
  getLayout(id: string): WorkflowLayout | null {
    return this.layouts.get(id) || null;
  }

  /**
   * Get current layout
   */
  getCurrentLayout(): WorkflowLayout | null {
    if (!this.currentLayoutId) {
      return null;
    }
    return this.getLayout(this.currentLayoutId);
  }

  /**
   * Set current layout
   */
  setCurrentLayout(id: string): void {
    const layout = this.getLayout(id);
    if (!layout) {
      throw new Error(`Layout not found: ${id}`);
    }

    const previousLayoutId = this.currentLayoutId;
    this.currentLayoutId = id;

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('vectorforge-current-layout', id);
    }

    // Create checkpoint
    getCheckpointService().then(cs => cs.createCheckpoint(
      `layout-switch-${id}`,
      `Switched to layout: ${layout.name}`,
      [],
      { previousLayout: previousLayoutId, newLayout: id }
    ).catch(console.error);
  }

  /**
   * Save layout
   */
  saveLayout(layout: WorkflowLayout): void {
    // Validate layout
    if (!layout.id || !layout.name || !layout.panels) {
      throw new Error('Invalid layout: missing required fields');
    }

    this.layouts.set(layout.id, layout);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      const savedLayouts = JSON.parse(
        localStorage.getItem('vectorforge-custom-layouts') || '[]'
      );
      const index = savedLayouts.findIndex((l: WorkflowLayout) => l.id === layout.id);
      if (index >= 0) {
        savedLayouts[index] = layout;
      } else {
        savedLayouts.push(layout);
      }
      localStorage.setItem('vectorforge-custom-layouts', JSON.stringify(savedLayouts));
    }

    // Create checkpoint
    getCheckpointService().then(cs => cs.createCheckpoint(
      `layout-save-${layout.id}`,
      `Saved layout: ${layout.name}`,
      [],
      { layout }
    ).catch(console.error);
  }

  /**
   * Delete layout
   */
  deleteLayout(id: string): void {
    const layout = this.getLayout(id);
    if (!layout) {
      throw new Error(`Layout not found: ${id}`);
    }

    // Don't delete default layouts
    if (layout.default) {
      throw new Error('Cannot delete default layout');
    }

    this.layouts.delete(id);

    // Remove from localStorage
    if (typeof window !== 'undefined') {
      const savedLayouts = JSON.parse(
        localStorage.getItem('vectorforge-custom-layouts') || '[]'
      );
      const filtered = savedLayouts.filter((l: WorkflowLayout) => l.id !== id);
      localStorage.setItem('vectorforge-custom-layouts', JSON.stringify(filtered));
    }

    // If deleted layout was current, switch to default
    if (this.currentLayoutId === id) {
      const defaultLayout = Array.from(this.layouts.values()).find(l => l.default);
      this.currentLayoutId = defaultLayout?.id || Array.from(this.layouts.keys())[0] || null;
    }

    // Create checkpoint
    getCheckpointService().then(cs => cs.createCheckpoint(
      `layout-delete-${id}`,
      `Deleted layout: ${layout.name}`,
      [],
      { id, layout }
    ).catch(console.error);
  }

  /**
   * Export layout
   */
  exportLayout(id: string): string {
    const layout = this.getLayout(id);
    if (!layout) {
      throw new Error(`Layout not found: ${id}`);
    }

    return JSON.stringify(layout, null, 2);
  }

  /**
   * Import layout
   */
  importLayout(data: string): WorkflowLayout {
    try {
      const layout = JSON.parse(data) as WorkflowLayout;
      
      // Validate
      if (!layout.id || !layout.name || !layout.panels) {
        throw new Error('Invalid layout data');
      }

      // Save imported layout
      this.saveLayout(layout);

      return layout;
    } catch (error) {
      throw new Error(`Failed to import layout: ${error}`);
    }
  }

  /**
   * Reset to default layout
   */
  resetToDefault(): void {
    const defaultLayout = Array.from(this.layouts.values()).find(l => l.default);
    if (defaultLayout) {
      this.setCurrentLayout(defaultLayout.id);
    }
  }

  /**
   * Get layout statistics
   */
  getStatistics(): {
    total: number;
    default: number;
    custom: number;
    current: string | null;
  } {
    const layouts = Array.from(this.layouts.values());
    return {
      total: layouts.length,
      default: layouts.filter(l => l.default).length,
      custom: layouts.filter(l => !l.default).length,
      current: this.currentLayoutId,
    };
  }
}

// Singleton instance - lazy initialization to avoid circular dependencies
let _workflowLayoutServiceInstance: WorkflowLayoutService | null = null;

export const workflowLayoutService = (() => {
  if (!_workflowLayoutServiceInstance) {
    _workflowLayoutServiceInstance = new WorkflowLayoutService();
  }
  return _workflowLayoutServiceInstance;
})();

// Auto-initialize - defer to avoid initialization order issues
if (typeof window !== 'undefined') {
  // Use setTimeout to defer initialization after module load
  setTimeout(() => {
    workflowLayoutService.initialize().catch(console.error);
    
    // Load current layout from localStorage
    const savedLayoutId = localStorage.getItem('vectorforge-current-layout');
    if (savedLayoutId) {
      workflowLayoutService.setCurrentLayout(savedLayoutId).catch(() => {
        // If saved layout doesn't exist, use default
        workflowLayoutService.resetToDefault();
      });
    }
  }, 0);
}

export default workflowLayoutService;

