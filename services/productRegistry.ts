/**
 * Product Registry Service
 * Catalogs all components and their relationships
 * Part of Patch 2: Product Registry
 */

import type { RegistryEntry, RegistrySearchOptions, RegistrySearchResult } from '../types/registry';

class ProductRegistry {
  private registry: Map<string, RegistryEntry> = new Map();
  private initialized = false;

  /**
   * Initialize registry from data file
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Load registry data
      const response = await fetch('/data/productRegistry.json');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.entries)) {
          data.entries.forEach((entry: RegistryEntry) => {
            this.registry.set(entry.id, entry);
          });
        }
      }
    } catch (error) {
      console.warn('Failed to load product registry data:', error);
      // Continue with empty registry
    }

    this.initialized = true;
  }

  /**
   * Register a component or service
   */
  register(entry: RegistryEntry): void {
    entry.updatedAt = Date.now();
    this.registry.set(entry.id, entry);
    this.saveRegistry();
  }

  /**
   * Get entry by ID
   */
  get(id: string): RegistryEntry | undefined {
    return this.registry.get(id);
  }

  /**
   * Get all entries
   */
  getAll(): RegistryEntry[] {
    return Array.from(this.registry.values());
  }

  /**
   * Search registry
   */
  search(options: RegistrySearchOptions = {}): RegistrySearchResult {
    let results = Array.from(this.registry.values());

    // Filter by query
    if (options.query) {
      const query = options.query.toLowerCase();
      results = results.filter(entry =>
        entry.name.toLowerCase().includes(query) ||
        entry.description.toLowerCase().includes(query) ||
        entry.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by type
    if (options.type) {
      results = results.filter(entry => entry.type === options.type);
    }

    // Filter by category
    if (options.category) {
      results = results.filter(entry => entry.category === options.category);
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter(entry =>
        options.tags!.some(tag => entry.tags.includes(tag))
      );
    }

    // Filter by dependencies
    if (options.dependencies && options.dependencies.length > 0) {
      results = results.filter(entry =>
        options.dependencies!.some(dep => entry.dependencies.includes(dep))
      );
    }

    const total = results.length;
    const offset = options.offset || 0;
    const limit = options.limit || 50;

    // Sort by updatedAt (newest first)
    results.sort((a, b) => b.updatedAt - a.updatedAt);

    // Apply pagination
    const paginatedResults = results.slice(offset, offset + limit);

    return {
      entries: paginatedResults,
      total,
      limit,
      offset,
    };
  }

  /**
   * Get entries by category
   */
  getByCategory(category: string): RegistryEntry[] {
    return Array.from(this.registry.values())
      .filter(entry => entry.category === category)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * Get entries by type
   */
  getByType(type: RegistryEntry['type']): RegistryEntry[] {
    return Array.from(this.registry.values())
      .filter(entry => entry.type === type)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * Get entries with dependency
   */
  getByDependency(dependencyId: string): RegistryEntry[] {
    return Array.from(this.registry.values())
      .filter(entry => entry.dependencies.includes(dependencyId))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.registry.forEach(entry => {
      categories.add(entry.category);
    });
    return Array.from(categories).sort();
  }

  /**
   * Get all tags
   */
  getTags(): string[] {
    const tags = new Set<string>();
    this.registry.forEach(entry => {
      entry.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  /**
   * Save registry to localStorage (for runtime additions)
   */
  private saveRegistry(): void {
    if (typeof window !== 'undefined') {
      try {
        const entries = Array.from(this.registry.values());
        localStorage.setItem('productRegistry', JSON.stringify({ entries }));
      } catch (error) {
        console.error('Failed to save registry:', error);
      }
    }
  }

  /**
   * Load registry from localStorage
   */
  public loadRegistry(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('productRegistry');
        if (stored) {
          const data = JSON.parse(stored);
          if (Array.isArray(data.entries)) {
            data.entries.forEach((entry: RegistryEntry) => {
              this.registry.set(entry.id, entry);
            });
          }
        }
      } catch (error) {
        console.error('Failed to load registry:', error);
      }
    }
  }

  /**
   * Clear registry
   */
  clear(): void {
    this.registry.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('productRegistry');
    }
  }
}

// Singleton instance
export const productRegistry = new ProductRegistry();

// Auto-initialize
if (typeof window !== 'undefined') {
  productRegistry.initialize().catch(console.error);
  productRegistry.loadRegistry();
}

export default productRegistry;
