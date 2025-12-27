/**
 * @module ContextualUIService
 * @description
 * Intelligent UI surfacing system based on Most Actionable Item (MAI) framework.
 * Surfaces UI elements based on context, priority, and user workflow.
 * 
 * Server Timestamp: 1737955680000
 * Date: December 27, 2025
 * Patent Tracking ID: VF-UI-CONTEXT-2025-12-27-001
 * Work Tracking ID: WT-UI-CONTEXT-1737955680000
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 */

export type UIPriority = 'P0' | 'P1' | 'P2' | 'P3';

export type UIContext = 
  | 'object-selected'
  | 'tool-active'
  | 'error-occurred'
  | 'workflow-switch'
  | 'first-time-user'
  | 'idle'
  | 'working'
  | 'exporting'
  | 'importing'
  | 'animating';

export interface UIElement {
  id: string;
  name: string;
  priority: UIPriority;
  context: UIContext[];
  component: string; // Component name or path
  location: 'toolbar' | 'sidebar-left' | 'sidebar-right' | 'canvas' | 'menu' | 'dialog' | 'tooltip';
  accessMethod: 'always-visible' | 'contextual' | 'on-demand' | 'advanced';
  keyboardShortcut?: string;
  tooltip?: string;
  helpLink?: string;
}

export interface UIContextState {
  activeTool?: string;
  selectedObjectId?: string;
  activeWorkflow?: 'vectorforge' | 'tasks' | 'animation' | 'scripting';
  hasError?: boolean;
  errorType?: string;
  isFirstTimeUser?: boolean;
  userSkillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  currentAction?: string;
}

class ContextualUIService {
  private uiElements: Map<string, UIElement> = new Map();
  private contextState: UIContextState = {};
  private priorityRules: Map<UIContext, UIPriority[]> = new Map();

  constructor() {
    this.initializePriorityRules();
    this.initializeDefaultElements();
  }

  /**
   * Initialize priority rules for each context
   */
  private initializePriorityRules(): void {
    this.priorityRules.set('object-selected', ['P0', 'P1']);
    this.priorityRules.set('tool-active', ['P0', 'P1']);
    this.priorityRules.set('error-occurred', ['P0', 'P1']);
    this.priorityRules.set('workflow-switch', ['P0', 'P1', 'P2']);
    this.priorityRules.set('first-time-user', ['P0', 'P1', 'P2']);
    this.priorityRules.set('idle', ['P0', 'P1']);
    this.priorityRules.set('working', ['P0', 'P1']);
    this.priorityRules.set('exporting', ['P0', 'P1']);
    this.priorityRules.set('importing', ['P0', 'P1']);
    this.priorityRules.set('animating', ['P0', 'P1']);
  }

  /**
   * Initialize default UI elements
   */
  private initializeDefaultElements(): void {
    // P0 - Critical elements (always visible)
    this.registerElement({
      id: 'save',
      name: 'Save',
      priority: 'P0',
      context: ['idle', 'working', 'exporting'],
      component: 'ProfessionalFileMenu',
      location: 'menu',
      accessMethod: 'always-visible',
      keyboardShortcut: 'Ctrl+S',
      tooltip: 'Save your work (Ctrl+S)',
    });

    this.registerElement({
      id: 'active-tool',
      name: 'Active Tool',
      priority: 'P0',
      context: ['tool-active', 'working'],
      component: 'DockableToolPalette',
      location: 'toolbar',
      accessMethod: 'always-visible',
      tooltip: 'Currently active tool',
    });

    this.registerElement({
      id: 'selected-properties',
      name: 'Selected Object Properties',
      priority: 'P0',
      context: ['object-selected'],
      component: 'ToolPropertiesPanel',
      location: 'sidebar-right',
      accessMethod: 'contextual',
      tooltip: 'Properties of selected object',
    });

    // P1 - High priority elements (contextual/one click away)
    this.registerElement({
      id: 'layers-panel',
      name: 'Layers Panel',
      priority: 'P1',
      context: ['idle', 'working', 'object-selected'],
      component: 'ProfessionalLayersPanel',
      location: 'sidebar-left',
      accessMethod: 'always-visible',
      tooltip: 'Manage layers',
    });

    this.registerElement({
      id: 'undo-redo',
      name: 'Undo/Redo',
      priority: 'P1',
      context: ['working', 'idle'],
      component: 'ProfessionalFileMenu',
      location: 'menu',
      accessMethod: 'on-demand',
      keyboardShortcut: 'Ctrl+Z / Ctrl+Y',
      tooltip: 'Undo or redo last action',
    });

    // P2 - Medium priority elements (two clicks away)
    this.registerElement({
      id: 'preferences',
      name: 'Preferences',
      priority: 'P2',
      context: ['idle'],
      component: 'PreferencesDialog',
      location: 'menu',
      accessMethod: 'on-demand',
      keyboardShortcut: 'Ctrl+,',
      tooltip: 'Open preferences',
    });

    this.registerElement({
      id: 'help',
      name: 'Help',
      priority: 'P2',
      context: ['idle', 'error-occurred', 'first-time-user'],
      component: 'HelpPanel',
      location: 'menu',
      accessMethod: 'on-demand',
      keyboardShortcut: 'F1',
      tooltip: 'Open help documentation',
    });

    // P3 - Low priority elements (hidden/advanced)
    this.registerElement({
      id: 'developer-tools',
      name: 'Developer Tools',
      priority: 'P3',
      context: ['idle'],
      component: 'DeveloperTools',
      location: 'menu',
      accessMethod: 'advanced',
      tooltip: 'Advanced developer tools',
    });
  }

  /**
   * Register a UI element
   */
  registerElement(element: UIElement): void {
    this.uiElements.set(element.id, element);
  }

  /**
   * Update context state
   */
  updateContext(context: Partial<UIContextState>): void {
    this.contextState = { ...this.contextState, ...context };
  }

  /**
   * Get current context
   */
  getCurrentContext(): UIContext[] {
    const contexts: UIContext[] = [];

    if (this.contextState.selectedObjectId) {
      contexts.push('object-selected');
    }

    if (this.contextState.activeTool) {
      contexts.push('tool-active');
    }

    if (this.contextState.hasError) {
      contexts.push('error-occurred');
    }

    if (this.contextState.isFirstTimeUser) {
      contexts.push('first-time-user');
    }

    if (this.contextState.currentAction === 'export') {
      contexts.push('exporting');
    } else if (this.contextState.currentAction === 'import') {
      contexts.push('importing');
    } else if (this.contextState.currentAction === 'animate') {
      contexts.push('animating');
    } else if (this.contextState.currentAction) {
      contexts.push('working');
    } else {
      contexts.push('idle');
    }

    return contexts;
  }

  /**
   * Get UI elements to surface based on current context
   */
  getSurfacedElements(maxPriority: UIPriority = 'P2'): UIElement[] {
    const currentContexts = this.getCurrentContext();
    const priorityOrder: UIPriority[] = ['P0', 'P1', 'P2', 'P3'];
    const maxPriorityIndex = priorityOrder.indexOf(maxPriority);

    const surfaced: UIElement[] = [];

    for (const element of this.uiElements.values()) {
      // Check if element is relevant to current context
      const isRelevant = element.context.some(ctx => currentContexts.includes(ctx));
      
      if (!isRelevant) continue;

      // Check priority
      const priorityIndex = priorityOrder.indexOf(element.priority);
      if (priorityIndex > maxPriorityIndex) continue;

      // Check user skill level
      if (element.priority === 'P3' && this.contextState.userSkillLevel !== 'expert') {
        continue;
      }

      surfaced.push(element);
    }

    // Sort by priority (P0 first, then P1, etc.)
    return surfaced.sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.priority);
      const bIndex = priorityOrder.indexOf(b.priority);
      return aIndex - bIndex;
    });
  }

  /**
   * Get UI elements for a specific location
   */
  getElementsForLocation(location: UIElement['location']): UIElement[] {
    return this.getSurfacedElements().filter(el => el.location === location);
  }

  /**
   * Get contextual help for current context
   */
  getContextualHelp(): { element: UIElement; helpText: string }[] {
    const surfaced = this.getSurfacedElements('P1');
    return surfaced
      .filter(el => el.tooltip || el.helpLink)
      .map(el => ({
        element: el,
        helpText: el.tooltip || `Help available for ${el.name}`,
      }));
  }

  /**
   * Check if element should be visible
   */
  shouldShowElement(elementId: string): boolean {
    const element = this.uiElements.get(elementId);
    if (!element) return false;

    const surfaced = this.getSurfacedElements();
    return surfaced.some(el => el.id === elementId);
  }

  /**
   * Get priority for element in current context
   */
  getElementPriority(elementId: string): UIPriority | null {
    const element = this.uiElements.get(elementId);
    if (!element) return null;

    const currentContexts = this.getCurrentContext();
    const isRelevant = element.context.some(ctx => currentContexts.includes(ctx));
    
    if (!isRelevant) return null;
    return element.priority;
  }
}

// Singleton instance
export const contextualUIService = new ContextualUIService();
