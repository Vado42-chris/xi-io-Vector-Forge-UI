/**
 * Template Seed Service
 * Seed-based template storage and reconstruction
 * 
 * Uses seed approach: Store minimal metadata, reconstruct full template on demand
 * 
 * #hashtag: templates seed-based reconstruction
 */

import { Template, templateService } from './templateService';

export interface TemplateSeed {
  id: string;
  name: string;
  description: string;
  category: Template['category'];
  tags: string[];
  icon: string;
  // Seed data - minimal info needed to reconstruct
  codeHash: string; // SHA-256 hash of code
  codeLength: number;
  variableCount: number;
  // Reconstruction metadata
  sourcePath?: string; // Path to full template file
  createdAt: number;
  updatedAt: number;
}

export interface TemplateSeedMetadata {
  seed: TemplateSeed;
  // Full template (loaded on demand)
  fullTemplate?: Template;
}

class TemplateSeedService {
  private storageKey = 'vectorforge-template-seeds';
  private seeds: Map<string, TemplateSeed> = new Map();

  constructor() {
    // Defer localStorage access to prevent blocking render
    if (typeof window !== 'undefined') {
      try {
        this.loadSeeds();
      } catch (error) {
        console.error('TemplateSeedService: Failed to load seeds, using defaults:', error);
        this.seeds = new Map();
      }
    }
  }

  /**
   * Create a seed from a full template
   */
  createSeed(template: Template): TemplateSeed {
    // Generate code hash
    const codeHash = this.hashCode(template.code);

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      tags: template.tags,
      icon: template.icon,
      codeHash,
      codeLength: template.code.length,
      variableCount: template.variables?.length || 0,
      sourcePath: `data/templates/${template.id}.json`,
      createdAt: template.createdAt || Date.now(),
      updatedAt: template.updatedAt || Date.now()
    };
  }

  /**
   * Save a seed (stores minimal metadata only)
   */
  saveSeed(seed: TemplateSeed): void {
    try {
      this.seeds.set(seed.id, seed);
      this.saveSeeds();
    } catch (error) {
      console.error('Failed to save template seed:', error);
    }
  }

  /**
   * Reconstruct full template from seed
   */
  async reconstructTemplate(seed: TemplateSeed): Promise<Template | null> {
    try {
      // Try to load from source path first
      if (seed.sourcePath) {
        const fullTemplate = await templateService.getTemplate(seed.id);
        if (fullTemplate) {
          // Verify hash matches
          const currentHash = this.hashCode(fullTemplate.code);
          if (currentHash === seed.codeHash) {
            return fullTemplate;
          }
        }
      }

      // If source doesn't exist or hash doesn't match, return null
      // User will need to regenerate or update the seed
      return null;
    } catch (error) {
      console.error('Failed to reconstruct template:', error);
      return null;
    }
  }

  /**
   * Get all seeds (for listing/browsing)
   */
  getAllSeeds(): TemplateSeed[] {
    return Array.from(this.seeds.values());
  }

  /**
   * Get seed by ID
   */
  getSeed(id: string): TemplateSeed | null {
    return this.seeds.get(id) || null;
  }

  /**
   * Search seeds
   */
  searchSeeds(query: string): TemplateSeed[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.seeds.values()).filter(seed =>
      seed.name.toLowerCase().includes(lowerQuery) ||
      seed.description.toLowerCase().includes(lowerQuery) ||
      seed.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Delete seed
   */
  deleteSeed(id: string): void {
    this.seeds.delete(id);
    this.saveSeeds();
  }

  /**
   * Batch create seeds from templates
   */
  async createSeedsFromTemplates(templates: Template[]): Promise<TemplateSeed[]> {
    const seeds: TemplateSeed[] = [];
    for (const template of templates) {
      const seed = this.createSeed(template);
      this.saveSeed(seed);
      seeds.push(seed);
    }
    return seeds;
  }

  /**
   * Verify seed integrity (check if hash still matches)
   */
  async verifySeed(seed: TemplateSeed): Promise<boolean> {
    const template = await this.reconstructTemplate(seed);
    if (!template) return false;

    const currentHash = this.hashCode(template.code);
    return currentHash === seed.codeHash;
  }

  /**
   * Update seed if template changed
   */
  async updateSeedIfChanged(template: Template): Promise<TemplateSeed | null> {
    const existingSeed = this.getSeed(template.id);
    if (!existingSeed) {
      // Create new seed
      const seed = this.createSeed(template);
      this.saveSeed(seed);
      return seed;
    }

    // Check if template changed
    const currentHash = this.hashCode(template.code);
    if (currentHash !== existingSeed.codeHash) {
      // Template changed, update seed
      const updatedSeed: TemplateSeed = {
        ...existingSeed,
        codeHash: currentHash,
        codeLength: template.code.length,
        variableCount: template.variables?.length || 0,
        updatedAt: Date.now()
      };
      this.saveSeed(updatedSeed);
      return updatedSeed;
    }

    return existingSeed;
  }

  /**
   * Simple hash function (SHA-256 would be better, but this works for now)
   */
  private hashCode(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Load seeds from storage
   */
  private loadSeeds(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const seedArray = JSON.parse(stored) as TemplateSeed[];
        seedArray.forEach(seed => {
          this.seeds.set(seed.id, seed);
        });
      }
    } catch (error) {
      console.error('Failed to load template seeds:', error);
      this.seeds = new Map();
    }
  }

  /**
   * Save seeds to storage
   */
  private saveSeeds(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      const seedArray = Array.from(this.seeds.values());
      localStorage.setItem(this.storageKey, JSON.stringify(seedArray));
    } catch (error) {
      console.error('Failed to save template seeds:', error);
    }
  }
}

export const templateSeedService = new TemplateSeedService();

