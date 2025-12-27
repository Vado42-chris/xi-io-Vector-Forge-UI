/**
 * Workflow Layout Type Definitions
 * Defines types for workflow-based layout system
 */

/**
 * Panel Position
 */
export interface PanelPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  docked?: boolean;
  dockZone?: 'left' | 'right' | 'top' | 'bottom' | 'center';
}

/**
 * Panel Configuration
 */
export interface PanelConfig {
  id: string;
  type: 'canvas' | 'timeline' | 'tools' | 'layers' | 'properties' | 'preview' | 'code' | 'chat' | 'registry' | 'terminal';
  visible: boolean;
  position: PanelPosition;
  tabs?: string[]; // For tabbed panels
  activeTab?: string;
}

/**
 * Workflow Layout
 */
export interface WorkflowLayout {
  id: string;
  name: string;
  description: string;
  panels: PanelConfig[];
  default?: boolean;
}

/**
 * Layout Service Interface
 */
export interface ILayoutService {
  /**
   * Get all available layouts
   */
  getLayouts(): WorkflowLayout[];

  /**
   * Get layout by ID
   */
  getLayout(id: string): WorkflowLayout | null;

  /**
   * Get current layout
   */
  getCurrentLayout(): WorkflowLayout | null;

  /**
   * Set current layout
   */
  setCurrentLayout(id: string): void;

  /**
   * Save layout
   */
  saveLayout(layout: WorkflowLayout): void;

  /**
   * Delete layout
   */
  deleteLayout(id: string): void;

  /**
   * Export layout
   */
  exportLayout(id: string): string;

  /**
   * Import layout
   */
  importLayout(data: string): WorkflowLayout;

  /**
   * Reset to default layout
   */
  resetToDefault(): void;
}

