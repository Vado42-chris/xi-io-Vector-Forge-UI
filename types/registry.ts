/**
 * Product Registry Type Definitions
 * Part of Patch 2: Product Registry
 */

export interface ComponentMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  type: 'component' | 'service' | 'utility' | 'layout' | 'other';
  category: string;
  tags: string[];
  dependencies: string[];
  filePath: string;
  exports: string[];
  props?: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

export interface ServiceMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  type: 'service';
  category: string;
  tags: string[];
  dependencies: string[];
  filePath: string;
  exports: string[];
  methods: string[];
  createdAt: number;
  updatedAt: number;
}

export interface RegistryEntry {
  id: string;
  name: string;
  description: string;
  version: string;
  type: ComponentMetadata['type'] | ServiceMetadata['type'];
  category: string;
  tags: string[];
  dependencies: string[];
  filePath: string;
  exports: string[];
  metadata: ComponentMetadata | ServiceMetadata;
  createdAt: number;
  updatedAt: number;
}

export interface RegistrySearchOptions {
  query?: string;
  type?: RegistryEntry['type'];
  category?: string;
  tags?: string[];
  dependencies?: string[];
  limit?: number;
  offset?: number;
}

export interface RegistrySearchResult {
  entries: RegistryEntry[];
  total: number;
  limit: number;
  offset: number;
}
