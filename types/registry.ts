/**
 * Product Registry Type Definitions
 * Defines types for the component registry system
 */

/**
 * Registry Entry Status
 */
export type RegistryStatus = 'active' | 'deprecated' | 'planned' | 'experimental';

/**
 * Registry Entry Category
 */
export type RegistryCategory = 
  | 'component' 
  | 'service' 
  | 'tool' 
  | 'panel' 
  | 'workflow'
  | 'type'
  | 'hook'
  | 'utility';

/**
 * Registry Entry
 */
export interface RegistryEntry {
  id: string;
  name: string;
  category: RegistryCategory;
  version: string;
  description: string;
  tags: string[];
  dependencies: string[]; // IDs of other registry entries
  api: {
    exports: string[]; // Exported functions/components
    imports: string[]; // Imported dependencies
    props?: Record<string, any>; // Component props (if component)
  };
  location: {
    file: string;
    line?: number;
  };
  status: RegistryStatus;
  maintainer?: string;
  lastUpdated: Date | string;
  documentation: string;
}

/**
 * Registry Search Filters
 */
export interface RegistryFilters {
  category?: RegistryCategory | RegistryCategory[];
  status?: RegistryStatus | RegistryStatus[];
  tags?: string[];
  search?: string; // Text search in name, description, tags
}

/**
 * Registry Search Result
 */
export interface RegistrySearchResult {
  entries: RegistryEntry[];
  total: number;
  filters: RegistryFilters;
}

/**
 * Registry Service Interface
 */
export interface IRegistryService {
  /**
   * Register a component/service/tool
   */
  register(entry: RegistryEntry): void;

  /**
   * Get entry by ID
   */
  get(id: string): RegistryEntry | null;

  /**
   * Search entries with filters
   */
  search(filters: RegistryFilters): RegistrySearchResult;

  /**
   * Get all entries
   */
  getAll(): RegistryEntry[];

  /**
   * Get entries by category
   */
  getByCategory(category: RegistryCategory): RegistryEntry[];

  /**
   * Get entries by status
   */
  getByStatus(status: RegistryStatus): RegistryEntry[];

  /**
   * Get dependency graph for an entry
   */
  getDependencyGraph(id: string): RegistryEntry[];

  /**
   * Get dependents (entries that depend on this one)
   */
  getDependents(id: string): RegistryEntry[];

  /**
   * Update entry
   */
  update(id: string, updates: Partial<RegistryEntry>): void;

  /**
   * Remove entry
   */
  remove(id: string): void;

  /**
   * Export registry to JSON
   */
  export(): string;

  /**
   * Import registry from JSON
   */
  import(data: string): void;
}

