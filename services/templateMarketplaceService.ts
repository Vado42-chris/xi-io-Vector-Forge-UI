/**
 * Template Marketplace Service
 * Manages template marketplace features: ratings, reviews, versioning, discovery
 * 
 * #hashtag: template-marketplace service
 */

import { Template, TemplateReview, TemplateVersion } from './templateService';
import { FileSystemClient } from './fileSystemClient';
import { performanceService } from './performanceService';

export interface MarketplaceTemplate extends Template {
  rating: number;
  reviewCount: number;
  downloadCount: number;
  author: string;
  version: string;
  marketplace: true;
}

export interface TemplateSearchFilters {
  category?: Template['category'];
  minRating?: number;
  tags?: string[];
  author?: string;
  sortBy?: 'rating' | 'downloads' | 'recent' | 'name';
}

class TemplateMarketplaceService {
  private fileSystem: FileSystemClient;
  private marketplaceTemplates: MarketplaceTemplate[] = [];
  private reviews: Map<string, TemplateReview[]> = new Map();
  private storageKey = 'vectorforge-template-marketplace';

  constructor() {
    this.fileSystem = new FileSystemClient();
    this.loadMarketplaceData();
  }

  /**
   * Load marketplace data from storage
   */
  private async loadMarketplaceData(): Promise<void> {
    try {
      // Try to load from data/marketplace directory
      const marketplaceDir = 'data/marketplace/templates';
      try {
        const entries = await this.fileSystem.listDirectory(marketplaceDir);
        const templateFiles = entries.filter(
          entry => entry.type === 'file' && entry.name.endsWith('.json')
        );

        for (const file of templateFiles) {
          try {
            const content = await this.fileSystem.readFile(`${marketplaceDir}/${file.name}`);
            const template = JSON.parse(content) as MarketplaceTemplate;
            this.marketplaceTemplates.push(template);
          } catch (error) {
            console.warn(`Failed to load marketplace template from ${file.name}:`, error);
          }
        }
      } catch (error) {
        // Marketplace directory doesn't exist yet, that's fine
        console.log('Marketplace directory not found, starting with empty marketplace');
      }

      // Load reviews
      this.loadReviews();
    } catch (error) {
      console.error('Failed to load marketplace data:', error);
    }
  }

  /**
   * Load reviews from storage
   */
  private loadReviews(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const reviewsStr = localStorage.getItem(`${this.storageKey}-reviews`);
        if (reviewsStr) {
          const reviewsData = JSON.parse(reviewsStr);
          for (const [templateId, reviews] of Object.entries(reviewsData)) {
            this.reviews.set(templateId, reviews as TemplateReview[]);
          }
        }
      } catch (error) {
        console.error('Failed to load reviews:', error);
      }
    }
  }

  /**
   * Save reviews to storage
   */
  private saveReviews(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const reviewsData: Record<string, TemplateReview[]> = {};
        for (const [templateId, reviews] of this.reviews.entries()) {
          reviewsData[templateId] = reviews;
        }
        localStorage.setItem(`${this.storageKey}-reviews`, JSON.stringify(reviewsData));
      } catch (error) {
        console.error('Failed to save reviews:', error);
      }
    }
  }

  /**
   * Search marketplace templates
   */
  async searchTemplates(
    query: string,
    filters?: TemplateSearchFilters
  ): Promise<MarketplaceTemplate[]> {
    const cacheKey = `marketplace-search:${query}:${JSON.stringify(filters || {})}`;
    
    return performanceService.cached(
      cacheKey,
      async () => {
        let results = [...this.marketplaceTemplates];

        // Text search
        if (query) {
          const lowerQuery = query.toLowerCase();
          results = results.filter(t =>
            t.name.toLowerCase().includes(lowerQuery) ||
            t.description.toLowerCase().includes(lowerQuery) ||
            t.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
            t.author?.toLowerCase().includes(lowerQuery)
          );
        }

        // Category filter
        if (filters?.category) {
          results = results.filter(t => t.category === filters.category);
        }

        // Rating filter
        if (filters?.minRating) {
          results = results.filter(t => t.rating >= filters.minRating!);
        }

        // Tags filter
        if (filters?.tags && filters.tags.length > 0) {
          results = results.filter(t =>
            filters.tags!.some(tag => t.tags.includes(tag))
          );
        }

        // Author filter
        if (filters?.author) {
          results = results.filter(t => t.author === filters.author);
        }

        // Sort
        switch (filters?.sortBy) {
          case 'rating':
            results.sort((a, b) => b.rating - a.rating);
            break;
          case 'downloads':
            results.sort((a, b) => b.downloadCount - a.downloadCount);
            break;
          case 'recent':
            results.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
            break;
          case 'name':
          default:
            results.sort((a, b) => a.name.localeCompare(b.name));
            break;
        }

        return results;
      },
      30000 // Cache for 30 seconds
    );
  }

  /**
   * Get template by ID
   */
  async getTemplate(templateId: string): Promise<MarketplaceTemplate | null> {
    return performanceService.cached(
      `marketplace-template:${templateId}`,
      async () => {
        return this.marketplaceTemplates.find(t => t.id === templateId) || null;
      },
      60000 // Cache for 1 minute
    );
  }

  /**
   * Add review to template
   */
  async addReview(templateId: string, review: Omit<TemplateReview, 'id' | 'createdAt'>): Promise<void> {
    const template = await this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const newReview: TemplateReview = {
      ...review,
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };

    const reviews = this.reviews.get(templateId) || [];
    reviews.push(newReview);
    this.reviews.set(templateId, reviews);

    // Update template rating
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    template.rating = averageRating;
    template.reviewCount = reviews.length;

    this.saveReviews();
    performanceService.clearCache(`marketplace-template:${templateId}`);
  }

  /**
   * Get reviews for template
   */
  getReviews(templateId: string): TemplateReview[] {
    return this.reviews.get(templateId) || [];
  }

  /**
   * Mark review as helpful
   */
  markReviewHelpful(templateId: string, reviewId: string): void {
    const reviews = this.reviews.get(templateId);
    if (reviews) {
      const review = reviews.find(r => r.id === reviewId);
      if (review) {
        review.helpful = (review.helpful || 0) + 1;
        this.saveReviews();
      }
    }
  }

  /**
   * Increment download count
   */
  async incrementDownloadCount(templateId: string): Promise<void> {
    const template = await this.getTemplate(templateId);
    if (template) {
      template.downloadCount = (template.downloadCount || 0) + 1;
      performanceService.clearCache(`marketplace-template:${templateId}`);
    }
  }

  /**
   * Publish template to marketplace
   */
  async publishTemplate(template: Template, author: string, authorId: string): Promise<MarketplaceTemplate> {
    const marketplaceTemplate: MarketplaceTemplate = {
      ...template,
      author,
      authorId,
      version: template.version || '1.0.0',
      rating: 0,
      reviewCount: 0,
      downloadCount: 0,
      marketplace: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      versions: template.versions || [{
        version: template.version || '1.0.0',
        createdAt: Date.now(),
      }],
    };

    // Save to marketplace directory
    const marketplaceDir = 'data/marketplace/templates';
    try {
      await this.fileSystem.createDirectory(marketplaceDir);
    } catch (error) {
      // Directory might already exist
    }

    const fileName = `${template.id}.json`;
    const filePath = `${marketplaceDir}/${fileName}`;
    await this.fileSystem.writeFile(filePath, JSON.stringify(marketplaceTemplate, null, 2));

    // Add to in-memory cache
    const existingIndex = this.marketplaceTemplates.findIndex(t => t.id === template.id);
    if (existingIndex >= 0) {
      this.marketplaceTemplates[existingIndex] = marketplaceTemplate;
    } else {
      this.marketplaceTemplates.push(marketplaceTemplate);
    }

    performanceService.clearCache('marketplace-search:');
    return marketplaceTemplate;
  }

  /**
   * Update template version
   */
  async updateTemplateVersion(
    templateId: string,
    newVersion: string,
    changelog?: string
  ): Promise<void> {
    const template = await this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const version: TemplateVersion = {
      version: newVersion,
      createdAt: Date.now(),
      changelog,
    };

    template.versions = template.versions || [];
    template.versions.push(version);
    template.version = newVersion;
    template.updatedAt = Date.now();

    // Save updated template
    const marketplaceDir = 'data/marketplace/templates';
    const fileName = `${templateId}.json`;
    const filePath = `${marketplaceDir}/${fileName}`;
    await this.fileSystem.writeFile(filePath, JSON.stringify(template, null, 2));

    performanceService.clearCache(`marketplace-template:${templateId}`);
  }

  /**
   * Get featured templates
   */
  async getFeaturedTemplates(limit: number = 10): Promise<MarketplaceTemplate[]> {
    return performanceService.cached(
      'marketplace-featured',
      async () => {
        return this.marketplaceTemplates
          .filter(t => t.rating >= 4.0 && t.downloadCount >= 10)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, limit);
      },
      300000 // Cache for 5 minutes
    );
  }

  /**
   * Get trending templates
   */
  async getTrendingTemplates(limit: number = 10): Promise<MarketplaceTemplate[]> {
    return performanceService.cached(
      'marketplace-trending',
      async () => {
        // Trending = high download count in recent period
        const recentTemplates = this.marketplaceTemplates.filter(
          t => t.updatedAt && (Date.now() - t.updatedAt) < 7 * 24 * 60 * 60 * 1000 // Last 7 days
        );
        return recentTemplates
          .sort((a, b) => b.downloadCount - a.downloadCount)
          .slice(0, limit);
      },
      300000 // Cache for 5 minutes
    );
  }
}

export const templateMarketplaceService = new TemplateMarketplaceService();

