/**
 * Template Library Component
 * Visual browser for code templates with preview
 * 
 * Accessibility: Screen reader support, keyboard navigation, high contrast
 * Design: Grid layout with cards, search, filter chips
 * 
 * #hashtag: templates code-generation accessibility
 */

import React, { useState, useMemo, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { templateService, Template } from '../services/templateService';
import { templateMarketplaceService, MarketplaceTemplate } from '../services/templateMarketplaceService';
import TemplateVariableForm from './TemplateVariableForm';

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate?: (template: Template) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ isOpen, onClose, onSelectTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [marketplaceTemplates, setMarketplaceTemplates] = useState<MarketplaceTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'local' | 'marketplace'>('local');
  const [showVariableForm, setShowVariableForm] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'rating' | 'downloads' | 'recent' | 'name'>('rating');

  useEffect(() => {
    const loadTemplates = async () => {
      const loaded = await templateService.loadTemplates();
      setTemplates(loaded);
    };
    const loadMarketplace = async () => {
      const marketplace = await templateMarketplaceService.searchTemplates('', {
        minRating: minRating > 0 ? minRating : undefined,
        sortBy,
      });
      setMarketplaceTemplates(marketplace);
    };
    if (isOpen) {
      loadTemplates();
      if (activeTab === 'marketplace') {
        loadMarketplace();
      }
    }
  }, [isOpen, activeTab, minRating, sortBy]);

  // Fallback templates if service returns empty
  const defaultTemplates: Template[] = [
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

  const categories = [
    { id: 'all', label: 'All Templates', icon: 'apps' },
    { id: 'services', label: 'Services', icon: 'settings' },
    { id: 'components', label: 'Components', icon: 'widgets' },
    { id: 'api-routes', label: 'API Routes', icon: 'api' },
    { id: 'types', label: 'Types', icon: 'code' },
    { id: 'tests', label: 'Tests', icon: 'science' },
  ];

  // Use templates or defaultTemplates as fallback
  const displayTemplates = useMemo(() => {
    return templates.length > 0 ? templates : defaultTemplates;
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return displayTemplates.filter(template => {
      const matchesSearch = 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, displayTemplates]);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      // Check if template has variables
      if (selectedTemplate.variables && selectedTemplate.variables.length > 0) {
        setShowVariableForm(true);
      } else {
        // Use template directly
        if (onSelectTemplate) {
          onSelectTemplate(selectedTemplate);
        }
        onClose();
      }
    }
  };

  const handleGenerateFromVariables = (code: string) => {
    if (onSelectTemplate && selectedTemplate) {
      // Create a new template with generated code
      const generatedTemplate: Template = {
        ...selectedTemplate,
        code,
      };
      onSelectTemplate(generatedTemplate);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 zstack-modal-backdrop flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-library-title"
      >
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg w-[95vw] max-w-6xl h-[90vh] max-h-[800px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]" aria-hidden="true">
                library_books
              </span>
              <h2 id="template-library-title" className="text-xl font-bold text-[var(--xibalba-text-000)]">
                Template Library
              </h2>
            </div>
            <button
              onClick={onClose}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Close template library"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-100)]">close</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 p-4 border-b border-white/10 bg-[var(--xibalba-grey-050)]">
            <button
              onClick={() => setActiveTab('local')}
              className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] flex items-center gap-2 ${
                activeTab === 'local'
                  ? 'bg-[var(--xibalba-accent)] text-white'
                  : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-000)] hover:bg-[var(--xibalba-grey-200)]'
              }`}
              aria-pressed={activeTab === 'local'}
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">folder</span>
              Local Templates
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] flex items-center gap-2 ${
                activeTab === 'marketplace'
                  ? 'bg-[var(--xibalba-accent)] text-white'
                  : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-000)] hover:bg-[var(--xibalba-grey-200)]'
              }`}
              aria-pressed={activeTab === 'marketplace'}
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">store</span>
              Marketplace
            </button>
            {activeTab === 'marketplace' && (
              <div className="ml-auto flex items-center gap-3">
                <label className="text-sm text-[var(--xibalba-text-100)] flex items-center gap-2">
                  Min Rating:
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="xibalba-input min-h-[36px] text-sm"
                  >
                    <option value={0}>Any</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </label>
                <label className="text-sm text-[var(--xibalba-text-100)] flex items-center gap-2">
                  Sort By:
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="xibalba-input min-h-[36px] text-sm"
                  >
                    <option value="rating">Rating</option>
                    <option value="downloads">Downloads</option>
                    <option value="recent">Recent</option>
                    <option value="name">Name</option>
                  </select>
                </label>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-white/10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--xibalba-text-100)]" aria-hidden="true">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="xibalba-input w-full pl-10 min-h-[44px]"
                  placeholder="Search templates by name, description, or tags..."
                  aria-label="Search templates"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-[var(--xibalba-accent)] text-white'
                      : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-100)] hover:bg-[var(--xibalba-grey-200)]'
                  }`}
                  aria-pressed={selectedCategory === category.id}
                >
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">
                    {category.icon}
                  </span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Left Panel - Template List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4">
                <p className="text-sm text-[var(--xibalba-text-100)]" aria-live="polite">
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className={`p-4 border-2 rounded-lg transition-all text-left min-h-[140px] flex flex-col gap-2 ${
                      selectedTemplate?.id === template.id
                        ? 'border-[var(--xibalba-accent)] bg-[var(--xibalba-grey-100)]'
                        : 'border-[var(--xibalba-grey-100)] hover:border-[var(--xibalba-accent)]'
                    }`}
                    aria-pressed={selectedTemplate?.id === template.id}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl" aria-hidden="true">{template.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-[var(--xibalba-text-000)]">{template.name}</h3>
                          {activeTab === 'marketplace' && 'rating' in template && (
                            <div className="flex items-center gap-1 ml-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`material-symbols-outlined text-xs ${
                                    star <= (template as MarketplaceTemplate).rating
                                      ? 'text-[var(--vectorforge-accent)]'
                                      : 'text-[var(--xibalba-text-100)]'
                                  }`}
                                  aria-hidden="true"
                                >
                                  star
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-[var(--xibalba-text-100)] mt-1">{template.description}</p>
                        {activeTab === 'marketplace' && 'author' in template && (template as MarketplaceTemplate).author && (
                          <p className="text-xs text-[var(--xibalba-text-100)] mt-1">
                            By {(template as MarketplaceTemplate).author}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-[var(--xibalba-grey-200)] text-[var(--xibalba-text-100)] rounded"
                          aria-label={`Tag: ${tag}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-[var(--xibalba-text-100)] font-mono bg-[var(--xibalba-grey-200)] p-2 rounded">
                      {template.preview}
                    </div>
                  </button>
                ))}
              </div>
              
              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[var(--xibalba-text-100)]">No templates found</p>
                  <p className="text-sm text-[var(--xibalba-text-100)] mt-2">Try adjusting your search or filters</p>
                </div>
              )}
            </div>

            {/* Right Panel - Preview */}
            {selectedTemplate && (
              <div className="w-1/2 border-l border-white/10 p-6 overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[var(--xibalba-text-000)] mb-2">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-sm text-[var(--xibalba-text-100)]">{selectedTemplate.description}</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                    Code Preview
                  </label>
                  <pre className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg overflow-x-auto text-sm font-mono text-[var(--xibalba-text-000)]">
                    <code>{selectedTemplate.code}</code>
                  </pre>
                </div>
                
                {/* Template Metadata */}
                {activeTab === 'marketplace' && selectedTemplate && 'rating' in selectedTemplate && (
                  <div className="mb-4 space-y-2 p-3 bg-[var(--xibalba-grey-100)] rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--xibalba-text-100)]">Rating:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`material-symbols-outlined text-sm ${
                              star <= (selectedTemplate as MarketplaceTemplate).rating
                                ? 'text-[var(--vectorforge-accent)]'
                                : 'text-[var(--xibalba-text-100)]'
                            }`}
                            aria-hidden="true"
                          >
                            star
                          </span>
                        ))}
                        <span className="text-sm text-[var(--xibalba-text-100)] ml-2">
                          {(selectedTemplate as MarketplaceTemplate).rating.toFixed(1)} ({(selectedTemplate as MarketplaceTemplate).reviewCount || 0} reviews)
                        </span>
                      </div>
                    </div>
                    {(selectedTemplate as MarketplaceTemplate).author && (
                      <div className="text-sm text-[var(--xibalba-text-100)]">
                        By: <span className="font-semibold text-[var(--xibalba-text-000)]">{(selectedTemplate as MarketplaceTemplate).author}</span>
                      </div>
                    )}
                    {(selectedTemplate as MarketplaceTemplate).version && (
                      <div className="text-sm text-[var(--xibalba-text-100)]">
                        Version: <span className="font-semibold text-[var(--xibalba-text-000)]">{(selectedTemplate as MarketplaceTemplate).version}</span>
                      </div>
                    )}
                    <div className="text-sm text-[var(--xibalba-text-100)]">
                      Downloads: <span className="font-semibold text-[var(--xibalba-text-000)]">{(selectedTemplate as MarketplaceTemplate).downloadCount || 0}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleUseTemplate}
                    className="xibalba-button-primary w-full min-h-[44px]"
                    aria-label={`Use template: ${selectedTemplate.name}`}
                  >
                    <span className="material-symbols-outlined mr-2" aria-hidden="true">add</span>
                    {selectedTemplate.variables && selectedTemplate.variables.length > 0
                      ? 'Configure & Use Template'
                      : 'Use This Template'}
                  </button>
                  
                  <div className="text-sm text-[var(--xibalba-text-100)]">
                    <p className="mb-2">Template will be copied to your clipboard or inserted at cursor position.</p>
                    {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                      <p className="text-xs text-[var(--xibalba-accent)]">
                        This template has {selectedTemplate.variables.length} variable{selectedTemplate.variables.length !== 1 ? 's' : ''} to configure.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Variable Form */}
      {showVariableForm && selectedTemplate && (
        <TemplateVariableForm
          template={selectedTemplate}
          isOpen={showVariableForm}
          onClose={() => setShowVariableForm(false)}
          onGenerate={handleGenerateFromVariables}
        />
      )}
    </ErrorBoundary>
  );
};

export default TemplateLibrary;

