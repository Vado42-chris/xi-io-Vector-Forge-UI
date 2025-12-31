/**
 * Menu AST Parser Service
 * Parses menu structure from code using AST analysis
 * 
 * #hashtag: menu-ast-parser service
 */

import { FileSystemClient } from './fileSystemClient';

export interface MenuItem {
  id: string;
  label: string;
  action?: string;
  icon?: string;
  shortcut?: string;
  submenu?: MenuItem[];
  category?: string;
}

export interface MenuStructure {
  items: MenuItem[];
  totalActions: number;
  implementedActions: number;
  missingActions: string[];
}

class MenuASTParser {
  private fileSystem: FileSystemClient;

  constructor() {
    this.fileSystem = new FileSystemClient();
  }

  /**
   * Parse menu structure from ProfessionalFileMenu component
   */
  async parseMenuStructure(): Promise<MenuStructure> {
    try {
      const menuContent = await this.fileSystem.readFile('components/ProfessionalFileMenu.tsx');
      const appContent = await this.fileSystem.readFile('App.hardened.tsx');

      // Extract menu items using regex (simplified AST-like parsing)
      const menuItems = this.extractMenuItems(menuContent);
      const implementedActions = this.extractImplementedActions(appContent);

      // Build menu structure
      const structure: MenuStructure = {
        items: menuItems,
        totalActions: this.countTotalActions(menuItems),
        implementedActions: implementedActions.length,
        missingActions: this.findMissingActions(menuItems, implementedActions),
      };

      return structure;
    } catch (error) {
      console.error('Failed to parse menu structure:', error);
      throw error;
    }
  }

  /**
   * Extract menu items from menu component code
   */
  private extractMenuItems(menuContent: string): MenuItem[] {
    const items: MenuItem[] = [];

    // Pattern to match menu items: { label: '...', action: '...', icon: '...' }
    const menuItemPattern = /(?:label|action|icon|shortcut):\s*['"]([^'"]+)['"]/g;
    
    // Pattern to match menu structure (simplified)
    // Look for menu definitions like FILE_MENU, EDIT_MENU, etc.
    const menuSectionPattern = /(FILE|EDIT|VIEW|OBJECT|TYPE|SELECT|EFFECT|WINDOW|HELP)_MENU\s*:\s*\[/g;

    // Extract submenu items
    const submenuPattern = /'(\w+)':\s*\[([^\]]+)\]/g;

    let match;
    const sections = new Map<string, MenuItem[]>();

    // Find menu sections
    while ((match = menuSectionPattern.exec(menuContent)) !== null) {
      const sectionName = match[1];
      const sectionStart = match.index + match[0].length;
      
      // Find the closing bracket for this section
      let bracketCount = 1;
      let sectionEnd = sectionStart;
      for (let i = sectionStart; i < menuContent.length && bracketCount > 0; i++) {
        if (menuContent[i] === '[') bracketCount++;
        if (menuContent[i] === ']') bracketCount--;
        if (bracketCount === 0) sectionEnd = i;
      }

      const sectionContent = menuContent.substring(sectionStart, sectionEnd);
      const sectionItems = this.parseMenuSection(sectionContent, sectionName);
      sections.set(sectionName, sectionItems);
    }

    // Convert sections to menu items
    for (const [sectionName, sectionItems] of sections.entries()) {
      items.push({
        id: sectionName.toLowerCase(),
        label: this.formatSectionName(sectionName),
        category: sectionName.toLowerCase(),
        submenu: sectionItems,
      });
    }

    return items;
  }

  /**
   * Parse a menu section
   */
  private parseMenuSection(sectionContent: string, category: string): MenuItem[] {
    const items: MenuItem[] = [];
    
    // Pattern to match menu item objects
    const itemPattern = /\{\s*(?:label|action|icon|shortcut):\s*['"]([^'"]+)['"](?:,\s*(?:label|action|icon|shortcut):\s*['"]([^'"]+)['"])*\s*\}/g;
    
    let match;
    while ((match = itemPattern.exec(sectionContent)) !== null) {
      const itemContent = match[0];
      const label = this.extractValue(itemContent, 'label');
      const action = this.extractValue(itemContent, 'action');
      const icon = this.extractValue(itemContent, 'icon');
      const shortcut = this.extractValue(itemContent, 'shortcut');

      if (label || action) {
        items.push({
          id: action || (label ? label.toLowerCase().replace(/\s+/g, '_') : ''),
          label: label || action || '',
          action,
          icon,
          shortcut,
          category: category.toLowerCase(),
        });
      }
    }

    return items;
  }

  /**
   * Extract value from object string
   */
  private extractValue(objString: string, key: string): string | undefined {
    const pattern = new RegExp(`${key}:\\s*['"]([^'"]+)['"]`, 'i');
    const match = objString.match(pattern);
    return match ? match[1] : undefined;
  }

  /**
   * Format section name for display
   */
  private formatSectionName(sectionName: string): string {
    return sectionName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Extract implemented actions from App.hardened.tsx
   */
  private extractImplementedActions(appContent: string): string[] {
    const actions: string[] = [];
    
    // Pattern to match case statements: case 'ACTION_NAME':
    const casePattern = /case\s+['"]([A-Z_]+)['"]\s*:/g;
    
    let match;
    while ((match = casePattern.exec(appContent)) !== null) {
      actions.push(match[1]);
    }

    return actions;
  }

  /**
   * Count total actions in menu structure
   */
  private countTotalActions(items: MenuItem[]): number {
    let count = 0;
    
    for (const item of items) {
      if (item.action) {
        count++;
      }
      if (item.submenu) {
        count += this.countTotalActions(item.submenu);
      }
    }

    return count;
  }

  /**
   * Find missing actions
   */
  private findMissingActions(items: MenuItem[], implementedActions: string[]): string[] {
    const missing: string[] = [];
    const implementedSet = new Set(implementedActions);

    const collectActions = (menuItems: MenuItem[]) => {
      for (const item of menuItems) {
        if (item.action && !implementedSet.has(item.action)) {
          missing.push(item.action);
        }
        if (item.submenu) {
          collectActions(item.submenu);
        }
      }
    };

    collectActions(items);
    return missing;
  }

  /**
   * Get action handler code quality metrics
   */
  async analyzeHandlerQuality(actionId: string): Promise<{
    exists: boolean;
    hasErrorHandling: boolean;
    hasLogging: boolean;
    complexity: number;
    suggestions: string[];
  }> {
    try {
      const appContent = await this.fileSystem.readFile('App.hardened.tsx');
      
      // Find the handler for this action
      const casePattern = new RegExp(`case\\s+['"]${actionId}['"]\\s*:([^}]+)`, 's');
      const match = appContent.match(casePattern);

      if (!match) {
        return {
          exists: false,
          hasErrorHandling: false,
          hasLogging: false,
          complexity: 0,
          suggestions: ['Handler does not exist'],
        };
      }

      const handlerCode = match[1];
      const hasErrorHandling = /try\s*\{|catch|error/i.test(handlerCode);
      const hasLogging = /console\.(log|error|warn)|errorLogger/i.test(handlerCode);
      
      // Simple complexity metric: count control flow statements
      const complexity = (
        (handlerCode.match(/\bif\b/g) || []).length +
        (handlerCode.match(/\bfor\b/g) || []).length +
        (handlerCode.match(/\bwhile\b/g) || []).length +
        (handlerCode.match(/\bswitch\b/g) || []).length
      );

      const suggestions: string[] = [];
      if (!hasErrorHandling) {
        suggestions.push('Add error handling (try-catch)');
      }
      if (!hasLogging) {
        suggestions.push('Add logging for debugging');
      }
      if (complexity > 5) {
        suggestions.push('Consider refactoring to reduce complexity');
      }

      return {
        exists: true,
        hasErrorHandling,
        hasLogging,
        complexity,
        suggestions,
      };
    } catch (error) {
      console.error(`Failed to analyze handler for ${actionId}:`, error);
      return {
        exists: false,
        hasErrorHandling: false,
        hasLogging: false,
        complexity: 0,
        suggestions: ['Failed to analyze handler'],
      };
    }
  }

  /**
   * Generate test code for a handler
   */
  async generateHandlerTest(actionId: string): Promise<string> {
    try {
      const appContent = await this.fileSystem.readFile('App.hardened.tsx');
      const casePattern = new RegExp(`case\\s+['"]${actionId}['"]\\s*:([^}]+)`, 's');
      const match = appContent.match(casePattern);

      if (!match) {
        return `// Handler for ${actionId} not found`;
      }

      const handlerCode = match[1];
      
      // Generate basic test structure
      return `import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Menu Action: ${actionId}', () => {
  let appState: AppState;
  let handleAction: (action: string) => Promise<void>;

  beforeEach(() => {
    // Setup test state
    appState = createMockAppState();
    handleAction = createMockHandleAction();
  });

  it('should handle ${actionId} action', async () => {
    await handleAction('${actionId}');
    
    // Add assertions based on handler behavior
    // TODO: Add specific assertions
  });

  it('should handle errors gracefully', async () => {
    // Test error handling
    // TODO: Add error scenario tests
  });
});`;
    } catch (error) {
      console.error(`Failed to generate test for ${actionId}:`, error);
      return `// Failed to generate test for ${actionId}`;
    }
  }
}

export const menuASTParser = new MenuASTParser();

