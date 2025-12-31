/**
 * Panel Registry Service
 * VS Code-inspired modular panel system
 * 
 * #hashtag: panel-registry modular vs-code-inspired
 */

import type { Activity } from '../types/activity';

export interface Panel {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  defaultPosition: 'left' | 'right' | 'bottom' | 'floating';
  canDock: boolean;
  canResize: boolean;
  minSize: { width: number; height: number };
  maxSize: { width: number; height: number };
  activities: Activity[]; // Which activities show this panel
  icon?: string;
  category?: string;
  order?: number; // Display order
}

class PanelRegistry {
  private panels: Map<string, Panel> = new Map();

  /**
   * Register a panel
   */
  register(panel: Panel): void {
    this.panels.set(panel.id, panel);
    console.log(`PanelRegistry: Registered panel ${panel.id}`);
  }

  /**
   * Get a panel by ID
   */
  getPanel(id: string): Panel | undefined {
    return this.panels.get(id);
  }

  /**
   * Get all panels
   */
  getAllPanels(): Panel[] {
    return Array.from(this.panels.values());
  }

  /**
   * Get panels for a specific activity
   */
  getPanelsForActivity(activity: Activity): Panel[] {
    return this.getAllPanels()
      .filter(p => p.activities.includes(activity))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * Get panels by category
   */
  getPanelsByCategory(category: string): Panel[] {
    return this.getAllPanels()
      .filter(p => p.category === category)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * Unregister a panel
   */
  unregister(id: string): void {
    this.panels.delete(id);
    console.log(`PanelRegistry: Unregistered panel ${id}`);
  }
}

export const panelRegistry = new PanelRegistry();

