/**
 * Change Log Service
 * Tracks changes, updates, and modifications for Xibalba sprint system
 * Generates change logs and maintains history
 */

import { checkpointService } from './checkpointService';

/**
 * Change Type
 */
export type ChangeType = 
  | 'feature' 
  | 'bugfix' 
  | 'enhancement' 
  | 'refactor' 
  | 'security' 
  | 'performance' 
  | 'documentation' 
  | 'breaking';

/**
 * Change Entry
 */
export interface ChangeEntry {
  id: string;
  type: ChangeType;
  category: string; // e.g., 'UI', 'API', 'Security', 'Animation'
  title: string;
  description: string;
  author?: string;
  timestamp: number;
  sprint?: string;
  tags: string[];
  relatedIssues?: string[];
  breaking?: boolean;
  migrationNotes?: string;
}

/**
 * Change Log
 */
export interface ChangeLog {
  version: string;
  date: string;
  entries: ChangeEntry[];
  summary: {
    features: number;
    bugfixes: number;
    enhancements: number;
    security: number;
    breaking: number;
  };
}

/**
 * Change Log Service Interface
 */
export interface IChangeLogService {
  /**
   * Add a change entry
   */
  addChange(change: Omit<ChangeEntry, 'id' | 'timestamp'>): ChangeEntry;

  /**
   * Get all changes
   */
  getChanges(filters?: {
    type?: ChangeType | ChangeType[];
    category?: string;
    sprint?: string;
    since?: number;
  }): ChangeEntry[];

  /**
   * Get change by ID
   */
  getChange(id: string): ChangeEntry | null;

  /**
   * Generate change log for a version
   */
  generateChangeLog(version: string, since?: number): ChangeLog;

  /**
   * Get change log summary
   */
  getSummary(since?: number): ChangeLog['summary'];

  /**
   * Export change log as markdown
   */
  exportMarkdown(version: string, since?: number): string;

  /**
   * Export change log as JSON
   */
  exportJSON(version: string, since?: number): string;
}

class ChangeLogService implements IChangeLogService {
  private changes: Map<string, ChangeEntry> = new Map();
  private initialized: boolean = false;

  /**
   * Initialize service
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Load from localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('vectorforge-changelog');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach((entry: ChangeEntry) => {
              this.changes.set(entry.id, entry);
            });
          }
        }
      }
    } catch (error) {
      console.warn('Could not load change log from storage');
    }

    this.initialized = true;

    // Create checkpoint
    await checkpointService.createCheckpoint(
      'changelog-initialized',
      'Change log service initialized',
      [],
      { changeCount: this.changes.size }
    );
  }

  /**
   * Add a change entry
   */
  addChange(change: Omit<ChangeEntry, 'id' | 'timestamp'>): ChangeEntry {
    const entry: ChangeEntry = {
      ...change,
      id: `chg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    this.changes.set(entry.id, entry);

    // Persist to localStorage
    this.persistChanges();

    // Create checkpoint
    checkpointService.createCheckpoint(
      `changelog-add-${entry.id}`,
      `Change logged: ${entry.title}`,
      [],
      { entry }
    ).catch(console.error);

    return entry;
  }

  /**
   * Get all changes
   */
  getChanges(filters?: {
    type?: ChangeType | ChangeType[];
    category?: string;
    sprint?: string;
    since?: number;
  }): ChangeEntry[] {
    let results = Array.from(this.changes.values());

    // Filter by type
    if (filters?.type) {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type];
      results = results.filter(e => types.includes(e.type));
    }

    // Filter by category
    if (filters?.category) {
      results = results.filter(e => e.category === filters.category);
    }

    // Filter by sprint
    if (filters?.sprint) {
      results = results.filter(e => e.sprint === filters.sprint);
    }

    // Filter by date
    if (filters?.since) {
      results = results.filter(e => e.timestamp >= filters.since!);
    }

    // Sort by timestamp (newest first)
    return results.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get change by ID
   */
  getChange(id: string): ChangeEntry | null {
    return this.changes.get(id) || null;
  }

  /**
   * Generate change log for a version
   */
  generateChangeLog(version: string, since?: number): ChangeLog {
    const entries = this.getChanges({ since });
    
    const summary: ChangeLog['summary'] = {
      features: entries.filter(e => e.type === 'feature').length,
      bugfixes: entries.filter(e => e.type === 'bugfix').length,
      enhancements: entries.filter(e => e.type === 'enhancement').length,
      security: entries.filter(e => e.type === 'security').length,
      breaking: entries.filter(e => e.breaking || e.type === 'breaking').length,
    };

    return {
      version,
      date: new Date().toISOString().split('T')[0],
      entries,
      summary,
    };
  }

  /**
   * Get change log summary
   */
  getSummary(since?: number): ChangeLog['summary'] {
    const entries = this.getChanges({ since });
    
    return {
      features: entries.filter(e => e.type === 'feature').length,
      bugfixes: entries.filter(e => e.type === 'bugfix').length,
      enhancements: entries.filter(e => e.type === 'enhancement').length,
      security: entries.filter(e => e.type === 'security').length,
      breaking: entries.filter(e => e.breaking || e.type === 'breaking').length,
    };
  }

  /**
   * Export change log as markdown
   */
  exportMarkdown(version: string, since?: number): string {
    const changelog = this.generateChangeLog(version, since);
    
    let markdown = `# Changelog - ${changelog.version}\n\n`;
    markdown += `**Date:** ${changelog.date}\n\n`;
    markdown += `## Summary\n\n`;
    markdown += `- 🎉 **${changelog.summary.features}** New Features\n`;
    markdown += `- 🐛 **${changelog.summary.bugfixes}** Bug Fixes\n`;
    markdown += `- ⚡ **${changelog.summary.enhancements}** Enhancements\n`;
    markdown += `- 🔒 **${changelog.summary.security}** Security Updates\n`;
    if (changelog.summary.breaking > 0) {
      markdown += `- ⚠️ **${changelog.summary.breaking}** Breaking Changes\n`;
    }
    markdown += `\n---\n\n`;

    // Group by type
    const byType = new Map<ChangeType, ChangeEntry[]>();
    changelog.entries.forEach(entry => {
      if (!byType.has(entry.type)) {
        byType.set(entry.type, []);
      }
      byType.get(entry.type)!.push(entry);
    });

    // Write sections
    const typeOrder: ChangeType[] = ['feature', 'enhancement', 'bugfix', 'security', 'performance', 'refactor', 'documentation', 'breaking'];
    typeOrder.forEach(type => {
      const entries = byType.get(type);
      if (!entries || entries.length === 0) return;

      const typeLabels: Record<ChangeType, string> = {
        feature: '🎉 New Features',
        enhancement: '⚡ Enhancements',
        bugfix: '🐛 Bug Fixes',
        security: '🔒 Security',
        performance: '⚡ Performance',
        refactor: '🔧 Refactoring',
        documentation: '📚 Documentation',
        breaking: '⚠️ Breaking Changes',
      };

      markdown += `## ${typeLabels[type]}\n\n`;
      
      entries.forEach(entry => {
        markdown += `### ${entry.title}\n\n`;
        if (entry.description) {
          markdown += `${entry.description}\n\n`;
        }
        if (entry.category) {
          markdown += `**Category:** ${entry.category}  \n`;
        }
        if (entry.tags.length > 0) {
          markdown += `**Tags:** ${entry.tags.join(', ')}  \n`;
        }
        if (entry.breaking && entry.migrationNotes) {
          markdown += `\n**⚠️ Migration Required:**\n\n${entry.migrationNotes}\n\n`;
        }
        markdown += `\n`;
      });
    });

    return markdown;
  }

  /**
   * Export change log as JSON
   */
  exportJSON(version: string, since?: number): string {
    const changelog = this.generateChangeLog(version, since);
    return JSON.stringify(changelog, null, 2);
  }

  /**
   * Persist changes to localStorage
   */
  private persistChanges(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const entries = Array.from(this.changes.values());
        localStorage.setItem('vectorforge-changelog', JSON.stringify(entries));
      } catch (error) {
        console.error('Failed to persist change log:', error);
      }
    }
  }
}

// Singleton instance
export const changeLogService = new ChangeLogService();

// Auto-initialize
if (typeof window !== 'undefined') {
  changeLogService.initialize().catch(console.error);
}

export default changeLogService;

