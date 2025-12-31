/**
 * Template Service
 * Template management and retrieval
 * 
 * #hashtag: templates service
 */

import { FileSystemClient } from './fileSystemClient';
import { templateSeedService } from './templateSeedService';

export interface TemplateVariable {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  defaultValue?: string;
  required?: boolean;
  description?: string;
  options?: string[]; // For select type
}

export interface TemplateVersion {
  version: string;
  createdAt: number;
  changelog?: string;
  compatibility?: string[];
}

export interface TemplateReview {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: number;
  helpful?: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'services' | 'components' | 'api-routes' | 'types' | 'tests';
  tags: string[];
  icon: string;
  preview?: string;
  code: string;
  // Marketplace fields
  version?: string;
  author?: string;
  authorId?: string;
  rating?: number; // Average rating 1-5
  reviewCount?: number;
  downloadCount?: number;
  variables?: TemplateVariable[]; // Template variables for substitution
  versions?: TemplateVersion[]; // Version history
  reviews?: TemplateReview[]; // User reviews
  marketplace?: boolean; // Whether template is in marketplace
  createdAt?: number;
  updatedAt?: number;
}

class TemplateService {
  private fileSystem: FileSystemClient;
  private templates: Template[] = [];
  private templatesLoaded: boolean = false;

  constructor() {
    this.fileSystem = new FileSystemClient();
  }

  /**
   * Load templates from data directory
   * Uses seed-based approach: Load seeds first (fast), then reconstruct full templates on demand
   */
  async loadTemplates(): Promise<Template[]> {
    if (this.templatesLoaded) {
      return this.templates;
    }

    try {
      // First, try to load seeds (faster, minimal data)
      const seeds = templateSeedService.getAllSeeds();
      if (seeds.length > 0) {
        // Reconstruct templates from seeds
        const loadedTemplates: Template[] = [];
        for (const seed of seeds) {
          const template = await templateSeedService.reconstructTemplate(seed);
          if (template) {
            loadedTemplates.push(template);
          }
        }
        
        if (loadedTemplates.length > 0) {
          this.templates = loadedTemplates;
          this.templatesLoaded = true;
          return this.templates;
        }
      }

      // Fallback: Try to load from data/templates directory
      const templatesDir = 'data/templates';
      const entries = await this.fileSystem.listDirectory(templatesDir);
      
      const templateFiles = entries.filter(
        entry => entry.type === 'file' && entry.name.endsWith('.json')
      );

      if (templateFiles.length > 0) {
        // Load templates from JSON files
        const loadedTemplates: Template[] = [];
        for (const file of templateFiles) {
          try {
            const content = await this.fileSystem.readFile(`${templatesDir}/${file.name}`);
            const template = JSON.parse(content) as Template;
            loadedTemplates.push(template);
            
            // Create seed for future fast loading
            templateSeedService.updateSeedIfChanged(template);
          } catch (error) {
            console.warn(`Failed to load template from ${file.name}:`, error);
          }
        }
        
        if (loadedTemplates.length > 0) {
          this.templates = loadedTemplates;
          this.templatesLoaded = true;
          return this.templates;
        }
      }
    } catch (error) {
      // If templates directory doesn't exist or can't be read, fall back to defaults
      console.warn('Could not load templates from files, using defaults:', error);
    }

    // Fallback to hardcoded templates
    if (this.templates.length === 0) {
      this.templates = [
        {
          id: 'service-base',
          name: 'Service Base',
          description: 'Base service class with error handling and logging',
          category: 'services',
          tags: ['typescript', 'service', 'base'],
          icon: '⚙️',
          preview: 'class MyService { ... }',
          code: `export class MyService {
  private static instance: MyService;
  
  private constructor() {}
  
  static getInstance(): MyService {
    if (!MyService.instance) {
      MyService.instance = new MyService();
    }
    return MyService.instance;
  }
  
  async performAction(): Promise<void> {
    try {
      // Implementation
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}`,
        },
        {
          id: 'react-component',
          name: 'React Component',
          description: 'React component with TypeScript and error boundary',
          category: 'components',
          tags: ['react', 'typescript', 'component'],
          icon: '⚛️',
          preview: 'const MyComponent: React.FC = () => { ... }',
          code: `import React from 'react';
import ErrorBoundary from './ErrorBoundary';

interface MyComponentProps {
  // Props
}

const MyComponent: React.FC<MyComponentProps> = (props) => {
  return (
    <ErrorBoundary>
      <div className="my-component">
        {/* Component content */}
      </div>
    </ErrorBoundary>
  );
};

export default MyComponent;`,
        },
        {
          id: 'api-route',
          name: 'API Route',
          description: 'Express.js API route with validation',
          category: 'api-routes',
          tags: ['express', 'api', 'node'],
          icon: '🌐',
          preview: 'router.post("/endpoint", async (req, res) => { ... })',
          code: `import express from 'express';

const router = express.Router();

router.post('/endpoint', async (req, res) => {
  try {
    // Validation
    // Business logic
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;`,
        },
        {
          id: 'type-definition',
          name: 'Type Definition',
          description: 'TypeScript interface with JSDoc',
          category: 'types',
          tags: ['typescript', 'types', 'interface'],
          icon: '📘',
          preview: 'interface MyType { ... }',
          code: `/**
 * MyType interface
 * Description of what this type represents
 */
export interface MyType {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
}`,
        },
        {
          id: 'test-suite',
          name: 'Test Suite',
          description: 'Jest test suite with setup and teardown',
          category: 'tests',
          tags: ['jest', 'testing', 'unit'],
          icon: '🧪',
          preview: 'describe("MyFeature", () => { ... })',
          code: `import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('MyFeature', () => {
  beforeEach(() => {
    // Setup
  });
  
  afterEach(() => {
    // Teardown
  });
  
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});`,
        },
      ];
      this.templatesLoaded = true;
    }
    return this.templates;
  }

  /**
   * Save template to file
   */
  async saveTemplate(template: Template, onProgress?: (progress: number, message: string) => void): Promise<void> {
    onProgress?.(10, 'Preparing template...');

    // Ensure templates directory exists
    const templatesDir = 'data/templates';
    try {
      await this.fileSystem.createDirectory(templatesDir);
    } catch (error) {
      // Directory might already exist, that's fine
    }

    onProgress?.(50, `Saving template: ${template.name}...`);

    // Save template as JSON file
    const fileName = `${template.id}.json`;
    const filePath = `${templatesDir}/${fileName}`;
    const content = JSON.stringify(template, null, 2);

    await this.fileSystem.writeFile(filePath, content);

    // Update in-memory cache
    const existingIndex = this.templates.findIndex(t => t.id === template.id);
    if (existingIndex >= 0) {
      this.templates[existingIndex] = template;
    } else {
      this.templates.push(template);
    }

    // Create/update seed (minimal metadata for fast loading)
    await templateSeedService.updateSeedIfChanged(template);

    onProgress?.(100, `Template saved: ${filePath}`);
  }

  /**
   * Delete template file
   */
  async deleteTemplate(templateId: string): Promise<void> {
    const fileName = `${templateId}.json`;
    const filePath = `data/templates/${fileName}`;

    try {
      await this.fileSystem.deleteFile(filePath);
      
      // Remove from in-memory cache
      this.templates = this.templates.filter(t => t.id !== templateId);
    } catch (error) {
      throw new Error(`Failed to delete template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create template from code
   */
  async createTemplate(
    name: string,
    description: string,
    category: Template['category'],
    code: string,
    tags: string[] = [],
    icon: string = '📄'
  ): Promise<Template> {
    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const template: Template = {
      id,
      name,
      description,
      category,
      tags,
      icon,
      code,
      preview: code.substring(0, 100) + '...',
    };

    await this.saveTemplate(template);
    return template;
  }

  /**
   * Get template by ID
   */
  async getTemplate(id: string): Promise<Template | null> {
    const templates = await this.loadTemplates();
    return templates.find(t => t.id === id) || null;
  }

  /**
   * Get templates by category
   */
  async getTemplatesByCategory(category: Template['category']): Promise<Template[]> {
    const templates = await this.loadTemplates();
    return templates.filter(t => t.category === category);
  }

  /**
   * Search templates
   */
  async searchTemplates(query: string): Promise<Template[]> {
    const templates = await this.loadTemplates();
    const lowerQuery = query.toLowerCase();
    return templates.filter(t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Generate code from template
   */
  generateCode(template: Template, variables: Record<string, string>): string {
    let code = template.code;
    Object.entries(variables).forEach(([key, value]) => {
      code = code.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    });
    return code;
  }
}

export const templateService = new TemplateService();

