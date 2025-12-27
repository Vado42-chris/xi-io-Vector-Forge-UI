/**
 * Product Registry Service
 * Catalogs all components, services, tools, and panels in VectorForge
 * Provides search, filtering, and dependency tracking
 */

import type {
  RegistryEntry,
  RegistryCategory,
  RegistryStatus,
  RegistryFilters,
  RegistrySearchResult,
  IRegistryService,
} from '../types/registry';
import { checkpointService } from './checkpointService';

class ProductRegistryService implements IRegistryService {
  private entries: Map<string, RegistryEntry> = new Map();
  private initialized: boolean = false;

  /**
   * Initialize registry from data file
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Load from data file (will be created in next checkpoint)
      const response = await fetch('/data/productRegistry.json');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.entries)) {
          data.entries.forEach((entry: RegistryEntry) => {
            this.entries.set(entry.id, entry);
          });
        }
      }
    } catch (error) {
      console.warn('Could not load product registry from file, starting empty');
    }

    this.initialized = true;

    // Create checkpoint (non-blocking)
    createCheckpoint(
      'registry-initialized',
      'Product registry initialized',
      [],
      { entryCount: this.entries.size }
    );
  }

  /**
   * Register a component/service/tool
   */
  register(entry: RegistryEntry): void {
    // Validate entry
    if (!entry.id || !entry.name || !entry.category) {
      throw new Error('Invalid registry entry: missing required fields');
    }

    // Update lastUpdated if not provided
    if (!entry.lastUpdated) {
      entry.lastUpdated = new Date().toISOString();
    }

    this.entries.set(entry.id, entry);

    // Create checkpoint for registration
    checkpointService.createCheckpoint(
      `registry-register-${entry.id}`,
      `Registered: ${entry.name}`,
      [],
      { entry }
    ).catch(console.error);
  }

  /**
   * Get entry by ID
   */
  get(id: string): RegistryEntry | null {
    return this.entries.get(id) || null;
  }

  /**
   * Search entries with filters
   */
  search(filters: RegistryFilters): RegistrySearchResult {
    let results = Array.from(this.entries.values());

    // Filter by category
    if (filters.category) {
      const categories = Array.isArray(filters.category) 
        ? filters.category 
        : [filters.category];
      results = results.filter(e => categories.includes(e.category));
    }

    // Filter by status
    if (filters.status) {
      const statuses = Array.isArray(filters.status) 
        ? filters.status 
        : [filters.status];
      results = results.filter(e => statuses.includes(e.status));
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(e => 
        filters.tags!.some(tag => e.tags.includes(tag))
      );
    }

    // Text search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(e => 
        e.name.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower) ||
        e.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return {
      entries: results,
      total: results.length,
      filters,
    };
  }

  /**
   * Get all entries
   */
  getAll(): RegistryEntry[] {
    return Array.from(this.entries.values());
  }

  /**
   * Get entries by category
   */
  getByCategory(category: RegistryCategory): RegistryEntry[] {
    return Array.from(this.entries.values()).filter(e => e.category === category);
  }

  /**
   * Get entries by status
   */
  getByStatus(status: RegistryStatus): RegistryEntry[] {
    return Array.from(this.entries.values()).filter(e => e.status === status);
  }

  /**
   * Get dependency graph for an entry
   */
  getDependencyGraph(id: string): RegistryEntry[] {
    const entry = this.get(id);
    if (!entry) return [];

    const graph: RegistryEntry[] = [];
    const visited = new Set<string>();

    const traverse = (entryId: string) => {
      if (visited.has(entryId)) return;
      visited.add(entryId);

      const e = this.get(entryId);
      if (!e) return;

      graph.push(e);

      // Recursively get dependencies
      e.dependencies.forEach(depId => {
        traverse(depId);
      });
    };

    traverse(id);
    return graph;
  }

  /**
   * Get dependents (entries that depend on this one)
   */
  getDependents(id: string): RegistryEntry[] {
    return Array.from(this.entries.values()).filter(e => 
      e.dependencies.includes(id)
    );
  }

  /**
   * Update entry
   */
  update(id: string, updates: Partial<RegistryEntry>): void {
    const entry = this.get(id);
    if (!entry) {
      throw new Error(`Entry not found: ${id}`);
    }

    const updated = {
      ...entry,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    this.entries.set(id, updated);

    // Create checkpoint
    checkpointService.createCheckpoint(
      `registry-update-${id}`,
      `Updated: ${entry.name}`,
      [],
      { id, updates }
    ).catch(console.error);
  }

  /**
   * Remove entry
   */
  remove(id: string): void {
    const entry = this.get(id);
    if (entry) {
      this.entries.delete(id);

      // Create checkpoint
      checkpointService.createCheckpoint(
        `registry-remove-${id}`,
        `Removed: ${entry.name}`,
        [],
        { id, entry }
      ).catch(console.error);
    }
  }

  /**
   * Export registry to JSON
   */
  export(): string {
    return JSON.stringify({
      version: '1.0.0',
      exported: new Date().toISOString(),
      entries: Array.from(this.entries.values()),
    }, null, 2);
  }

  /**
   * Import registry from JSON
   */
  import(data: string): void {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed.entries)) {
        parsed.entries.forEach((entry: RegistryEntry) => {
          this.register(entry);
        });
      }
    } catch (error) {
      throw new Error(`Failed to import registry: ${error}`);
    }
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    total: number;
    byCategory: Record<RegistryCategory, number>;
    byStatus: Record<RegistryStatus, number>;
  } {
    const stats = {
      total: this.entries.size,
      byCategory: {} as Record<RegistryCategory, number>,
      byStatus: {} as Record<RegistryStatus, number>,
    };

    this.entries.forEach(entry => {
      stats.byCategory[entry.category] = (stats.byCategory[entry.category] || 0) + 1;
      stats.byStatus[entry.status] = (stats.byStatus[entry.status] || 0) + 1;
    });

    return stats;
  }
}

// Singleton instance - lazy initialization to avoid circular dependencies
let _productRegistryInstance: ProductRegistryService | null = null;

export const productRegistry = (() => {
  if (!_productRegistryInstance) {
    _productRegistryInstance = new ProductRegistryService();
  }
  return _productRegistryInstance;
})();

// Auto-initialize - defer to avoid initialization order issues
if (typeof window !== 'undefined') {
  // Use setTimeout to defer initialization after module load
  setTimeout(() => {
    productRegistry.initialize().catch(console.error);
  }, 0);
}

export default productRegistry;

