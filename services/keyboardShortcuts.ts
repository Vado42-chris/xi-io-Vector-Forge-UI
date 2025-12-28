/**
 * Keyboard Shortcuts Service
 * #hashtag: #keyboard-shortcuts #customization #ux
 * 
 * Manages keyboard shortcuts with customization support
 * Standard Photoshop/Illustrator shortcuts by default
 */

export interface KeyboardShortcut {
  id: string;
  action: string;
  keys: string[];
  description: string;
  category: 'file' | 'edit' | 'view' | 'object' | 'tool' | 'custom';
  defaultKeys: string[];
}

export interface KeyboardShortcutConfig {
  shortcuts: Map<string, KeyboardShortcut>;
  customShortcuts: Map<string, string[]>;
}

// Standard Photoshop/Illustrator shortcuts
export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  // File Operations
  { id: 'file_new', action: 'FILE_NEW', keys: ['Ctrl+N', 'Cmd+N'], description: 'New Document', category: 'file', defaultKeys: ['Ctrl+N', 'Cmd+N'] },
  { id: 'file_open', action: 'FILE_OPEN', keys: ['Ctrl+O', 'Cmd+O'], description: 'Open Document', category: 'file', defaultKeys: ['Ctrl+O', 'Cmd+O'] },
  { id: 'file_save', action: 'FILE_SAVE', keys: ['Ctrl+S', 'Cmd+S'], description: 'Save Document', category: 'file', defaultKeys: ['Ctrl+S', 'Cmd+S'] },
  { id: 'file_save_as', action: 'FILE_SAVE_AS', keys: ['Ctrl+Shift+S', 'Cmd+Shift+S'], description: 'Save As', category: 'file', defaultKeys: ['Ctrl+Shift+S', 'Cmd+Shift+S'] },
  { id: 'file_export', action: 'FILE_EXPORT', keys: ['Ctrl+E', 'Cmd+E'], description: 'Export', category: 'file', defaultKeys: ['Ctrl+E', 'Cmd+E'] },
  
  // Edit Operations
  { id: 'edit_undo', action: 'EDIT_UNDO', keys: ['Ctrl+Z', 'Cmd+Z'], description: 'Undo', category: 'edit', defaultKeys: ['Ctrl+Z', 'Cmd+Z'] },
  { id: 'edit_redo', action: 'EDIT_REDO', keys: ['Ctrl+Shift+Z', 'Cmd+Shift+Z'], description: 'Redo', category: 'edit', defaultKeys: ['Ctrl+Shift+Z', 'Cmd+Shift+Z'] },
  { id: 'edit_cut', action: 'EDIT_CUT', keys: ['Ctrl+X', 'Cmd+X'], description: 'Cut', category: 'edit', defaultKeys: ['Ctrl+X', 'Cmd+X'] },
  { id: 'edit_copy', action: 'EDIT_COPY', keys: ['Ctrl+C', 'Cmd+C'], description: 'Copy', category: 'edit', defaultKeys: ['Ctrl+C', 'Cmd+C'] },
  { id: 'edit_paste', action: 'EDIT_PASTE', keys: ['Ctrl+V', 'Cmd+V'], description: 'Paste', category: 'edit', defaultKeys: ['Ctrl+V', 'Cmd+V'] },
  { id: 'edit_paste_in_place', action: 'EDIT_PASTE_IN_PLACE', keys: ['Ctrl+Shift+V', 'Cmd+Shift+V'], description: 'Paste in Place', category: 'edit', defaultKeys: ['Ctrl+Shift+V', 'Cmd+Shift+V'] },
  { id: 'edit_duplicate', action: 'EDIT_DUPLICATE', keys: ['Ctrl+D', 'Cmd+D'], description: 'Duplicate', category: 'edit', defaultKeys: ['Ctrl+D', 'Cmd+D'] },
  { id: 'edit_select_all', action: 'EDIT_SELECT_ALL', keys: ['Ctrl+A', 'Cmd+A'], description: 'Select All', category: 'edit', defaultKeys: ['Ctrl+A', 'Cmd+A'] },
  { id: 'edit_deselect', action: 'EDIT_DESELECT', keys: ['Ctrl+D', 'Cmd+D'], description: 'Deselect', category: 'edit', defaultKeys: ['Ctrl+D', 'Cmd+D'] },
  
  // View Operations
  { id: 'view_zoom_in', action: 'VIEW_ZOOM_IN', keys: ['Ctrl+=', 'Cmd+='], description: 'Zoom In', category: 'view', defaultKeys: ['Ctrl+=', 'Cmd+='] },
  { id: 'view_zoom_out', action: 'VIEW_ZOOM_OUT', keys: ['Ctrl+-', 'Cmd+-'], description: 'Zoom Out', category: 'view', defaultKeys: ['Ctrl+-', 'Cmd+-'] },
  { id: 'view_fit_screen', action: 'VIEW_FIT', keys: ['Ctrl+0', 'Cmd+0'], description: 'Fit to Screen', category: 'view', defaultKeys: ['Ctrl+0', 'Cmd+0'] },
  { id: 'view_actual_size', action: 'VIEW_ACTUAL', keys: ['Ctrl+1', 'Cmd+1'], description: 'Actual Size', category: 'view', defaultKeys: ['Ctrl+1', 'Cmd+1'] },
  { id: 'view_show_grid', action: 'VIEW_SHOW_GRID', keys: ['Ctrl+\'', 'Cmd+\''], description: 'Show Grid', category: 'view', defaultKeys: ['Ctrl+\'', 'Cmd+\''] },
  { id: 'view_show_guides', action: 'VIEW_SHOW_GUIDES', keys: ['Ctrl+;', 'Cmd+;'], description: 'Show Guides', category: 'view', defaultKeys: ['Ctrl+;', 'Cmd+;'] },
  
  // Object Operations
  { id: 'object_group', action: 'OBJECT_GROUP', keys: ['Ctrl+G', 'Cmd+G'], description: 'Group', category: 'object', defaultKeys: ['Ctrl+G', 'Cmd+G'] },
  { id: 'object_ungroup', action: 'OBJECT_UNGROUP', keys: ['Ctrl+Shift+G', 'Cmd+Shift+G'], description: 'Ungroup', category: 'object', defaultKeys: ['Ctrl+Shift+G', 'Cmd+Shift+G'] },
  { id: 'object_lock', action: 'OBJECT_LOCK', keys: ['Ctrl+L', 'Cmd+L'], description: 'Lock', category: 'object', defaultKeys: ['Ctrl+L', 'Cmd+L'] },
  { id: 'object_unlock', action: 'OBJECT_UNLOCK', keys: ['Ctrl+Shift+L', 'Cmd+Shift+L'], description: 'Unlock All', category: 'object', defaultKeys: ['Ctrl+Shift+L', 'Cmd+Shift+L'] },
  { id: 'object_hide', action: 'OBJECT_HIDE', keys: ['Ctrl+3', 'Cmd+3'], description: 'Hide', category: 'object', defaultKeys: ['Ctrl+3', 'Cmd+3'] },
  { id: 'object_show', action: 'OBJECT_SHOW', keys: ['Ctrl+Shift+3', 'Cmd+Shift+3'], description: 'Show All', category: 'object', defaultKeys: ['Ctrl+Shift+3', 'Cmd+Shift+3'] },
  { id: 'object_bring_to_front', action: 'OBJECT_BRING_TO_FRONT', keys: ['Ctrl+Shift+]', 'Cmd+Shift+]'], description: 'Bring to Front', category: 'object', defaultKeys: ['Ctrl+Shift+]', 'Cmd+Shift+]'] },
  { id: 'object_send_to_back', action: 'OBJECT_SEND_TO_BACK', keys: ['Ctrl+Shift+[', 'Cmd+Shift+['], description: 'Send to Back', category: 'object', defaultKeys: ['Ctrl+Shift+[', 'Cmd+Shift+['] },
  
  // Tool Shortcuts (single key)
  { id: 'tool_select', action: 'TOOL_SELECT', keys: ['V'], description: 'Selection Tool', category: 'tool', defaultKeys: ['V'] },
  { id: 'tool_direct_select', action: 'TOOL_DIRECT_SELECT', keys: ['A'], description: 'Direct Selection', category: 'tool', defaultKeys: ['A'] },
  { id: 'tool_pen', action: 'TOOL_PEN', keys: ['P'], description: 'Pen Tool', category: 'tool', defaultKeys: ['P'] },
  { id: 'tool_brush', action: 'TOOL_BRUSH', keys: ['B'], description: 'Brush Tool', category: 'tool', defaultKeys: ['B'] },
  { id: 'tool_pencil', action: 'TOOL_PENCIL', keys: ['N'], description: 'Pencil Tool', category: 'tool', defaultKeys: ['N'] },
  { id: 'tool_text', action: 'TOOL_TEXT', keys: ['T'], description: 'Text Tool', category: 'tool', defaultKeys: ['T'] },
  { id: 'tool_rectangle', action: 'TOOL_RECTANGLE', keys: ['M'], description: 'Rectangle Tool', category: 'tool', defaultKeys: ['M'] },
  { id: 'tool_ellipse', action: 'TOOL_ELLIPSE', keys: ['L'], description: 'Ellipse Tool', category: 'tool', defaultKeys: ['L'] },
  { id: 'tool_hand', action: 'TOOL_HAND', keys: ['H'], description: 'Hand Tool', category: 'tool', defaultKeys: ['H'] },
  { id: 'tool_zoom', action: 'TOOL_ZOOM', keys: ['Z'], description: 'Zoom Tool', category: 'tool', defaultKeys: ['Z'] },
  { id: 'tool_rotate', action: 'TOOL_ROTATE', keys: ['R'], description: 'Rotate Tool', category: 'tool', defaultKeys: ['R'] },
  { id: 'tool_scale', action: 'TOOL_SCALE', keys: ['S'], description: 'Scale Tool', category: 'tool', defaultKeys: ['S'] },
  { id: 'tool_eraser', action: 'TOOL_ERASER', keys: ['E'], description: 'Eraser Tool', category: 'tool', defaultKeys: ['E'] },
  { id: 'tool_gradient', action: 'TOOL_GRADIENT', keys: ['G'], description: 'Gradient Tool', category: 'tool', defaultKeys: ['G'] },
  { id: 'tool_eyedropper', action: 'TOOL_EYEDROPPER', keys: ['I'], description: 'Eyedropper Tool', category: 'tool', defaultKeys: ['I'] },
  
  // Special: Spacebar for temporary hand tool
  { id: 'tool_hand_temp', action: 'TOOL_HAND_TEMP', keys: [' '], description: 'Temporary Hand Tool (Spacebar)', category: 'tool', defaultKeys: [' '] },
];

export class KeyboardShortcutsService {
  private config: KeyboardShortcutConfig;
  private listeners: Map<string, (e: KeyboardEvent) => void> = new Map();

  constructor() {
    this.config = {
      shortcuts: new Map(),
      customShortcuts: new Map()
    };
    
    // Initialize with defaults
    DEFAULT_SHORTCUTS.forEach(shortcut => {
      this.config.shortcuts.set(shortcut.id, shortcut);
    });
    
    // Load custom shortcuts from localStorage
    this.loadCustomShortcuts();
  }

  /**
   * Parse key combination string (e.g., "Ctrl+Shift+S") into normalized format
   */
  private parseKeyCombo(combo: string): { ctrl: boolean; shift: boolean; alt: boolean; meta: boolean; key: string } {
    const parts = combo.split('+').map(s => s.trim());
    return {
      ctrl: parts.includes('Ctrl'),
      shift: parts.includes('Shift'),
      alt: parts.includes('Alt'),
      meta: parts.includes('Cmd'),
      key: parts[parts.length - 1].toLowerCase()
    };
  }

  /**
   * Check if keyboard event matches a key combination
   */
  private matchesCombo(e: KeyboardEvent, combo: string): boolean {
    const parsed = this.parseKeyCombo(combo);
    const key = e.key.toLowerCase();
    
    return (
      key === parsed.key &&
      (e.ctrlKey || e.metaKey) === (parsed.ctrl || parsed.meta) &&
      e.shiftKey === parsed.shift &&
      e.altKey === parsed.alt
    );
  }

  /**
   * Get shortcut for an action
   */
  getShortcut(action: string): KeyboardShortcut | null {
    for (const shortcut of this.config.shortcuts.values()) {
      if (shortcut.action === action) {
        return shortcut;
      }
    }
    return null;
  }

  /**
   * Set custom shortcut for an action
   */
  setCustomShortcut(action: string, keys: string[]): void {
    this.config.customShortcuts.set(action, keys);
    this.saveCustomShortcuts();
  }

  /**
   * Reset shortcut to default
   */
  resetShortcut(action: string): void {
    this.config.customShortcuts.delete(action);
    this.saveCustomShortcuts();
  }

  /**
   * Get all shortcuts by category
   */
  getShortcutsByCategory(category: KeyboardShortcut['category']): KeyboardShortcut[] {
    return Array.from(this.config.shortcuts.values()).filter(s => s.category === category);
  }

  /**
   * Save custom shortcuts to localStorage
   */
  private saveCustomShortcuts(): void {
    const data = Array.from(this.config.customShortcuts.entries()).map(([action, keys]) => ({
      action,
      keys
    }));
    localStorage.setItem('vforge_custom_shortcuts', JSON.stringify(data));
  }

  /**
   * Load custom shortcuts from localStorage
   */
  private loadCustomShortcuts(): void {
    const stored = localStorage.getItem('vforge_custom_shortcuts');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        data.forEach(({ action, keys }: { action: string; keys: string[] }) => {
          this.config.customShortcuts.set(action, keys);
        });
      } catch (e) {
        console.error('Failed to load custom shortcuts:', e);
      }
    }
  }

  /**
   * Format key combination for display
   */
  formatKeyCombo(keys: string[]): string {
    return keys.join(' or ');
  }
}

export const keyboardShortcutsService = new KeyboardShortcutsService();

