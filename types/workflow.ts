/**
 * Workflow Layout Type Definitions
 * Part of Patch 3: Workflow Layouts
 */

export interface PanelConfig {
  id: string;
  type: 'sidebar' | 'toolbar' | 'panel' | 'canvas' | 'timeline' | 'palette';
  position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'floating';
  width?: number | string;
  height?: number | string;
  visible: boolean;
  collapsed?: boolean;
  order?: number;
}

export interface WorkflowLayout {
  id: string;
  name: string;
  description: string;
  category: 'default' | 'custom' | 'preset';
  panels: PanelConfig[];
  createdAt: number;
  updatedAt: number;
}

export interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  icon?: string;
  layout: WorkflowLayout;
}
