/**
 * Marketplace Publisher Service
 * Handles user → creator pipeline for publishing templates, plugins, and assets
 * 
 * #hashtag: marketplace publisher service
 */

import { userProfileService } from './userProfileService';

export interface MarketplaceItem {
  id: string;
  type: 'template' | 'plugin' | 'asset' | 'tutorial';
  title: string;
  description: string;
  author: string;
  authorId: string;
  version: string;
  price: number; // In credits or currency
  category: string;
  tags: string[];
  thumbnail?: string;
  files: MarketplaceFile[];
  publishedAt: number;
  updatedAt: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
  rejectionReason?: string;
  stats: {
    views: number;
    downloads: number;
    purchases: number;
    revenue: number;
    rating: number;
    reviewCount: number;
  };
  metadata: {
    license: string;
    compatibility: string[];
    requirements?: string[];
    changelog?: string[];
  };
}

export interface MarketplaceFile {
  name: string;
  path: string;
  type: 'code' | 'asset' | 'documentation' | 'example';
  size: number;
}

export interface PublishingRequest {
  item: Omit<MarketplaceItem, 'id' | 'publishedAt' | 'updatedAt' | 'status' | 'stats'>;
  files: MarketplaceFile[];
}

export interface PublishingResult {
  success: boolean;
  itemId?: string;
  message: string;
  errors?: string[];
}

class MarketplacePublisherService {
  private storageKey = 'vectorforge-marketplace-items';
  private items: Map<string, MarketplaceItem> = new Map();
  private pendingItems: Map<string, MarketplaceItem> = new Map();

  constructor() {
    this.loadItems();
  }

  /**
   * Load marketplace items from storage
   */
  private loadItems(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const data = JSON.parse(stored) as { items: MarketplaceItem[]; pending: MarketplaceItem[] };
          data.items.forEach(item => this.items.set(item.id, item));
          data.pending.forEach(item => this.pendingItems.set(item.id, item));
        }
      } catch (error) {
        console.error('Failed to load marketplace items:', error);
      }
    }
  }

  /**
   * Save marketplace items to storage
   */
  private saveItems(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const data = {
          items: Array.from(this.items.values()),
          pending: Array.from(this.pendingItems.values()),
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save marketplace items:', error);
      }
    }
  }

  /**
   * Check if user can publish (level requirement)
   */
  canPublish(): { allowed: boolean; reason?: string } {
    const profile = userProfileService.getProfile();
    const level = userProfileService.getStatistics().currentLevel;

    // Level 4 required for marketplace publishing
    if (level < 4) {
      return {
        allowed: false,
        reason: `Level 4 required. You are currently level ${level}.`,
      };
    }

    return { allowed: true };
  }

  /**
   * Create a new marketplace item (draft)
   */
  createDraft(request: PublishingRequest): PublishingResult {
    const canPublish = this.canPublish();
    if (!canPublish.allowed) {
      return {
        success: false,
        message: canPublish.reason || 'Cannot publish',
      };
    }

    const profile = userProfileService.getProfile();
    const itemId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const item: MarketplaceItem = {
      ...request.item,
      id: itemId,
      author: profile.username,
      authorId: profile.userId,
      publishedAt: Date.now(),
      updatedAt: Date.now(),
      status: 'draft',
      stats: {
        views: 0,
        downloads: 0,
        purchases: 0,
        revenue: 0,
        rating: 0,
        reviewCount: 0,
      },
    };

    this.pendingItems.set(itemId, item);
    this.saveItems();

    return {
      success: true,
      itemId,
      message: 'Draft created successfully',
    };
  }

  /**
   * Submit item for review
   */
  submitForReview(itemId: string): PublishingResult {
    const item = this.pendingItems.get(itemId);
    if (!item) {
      return {
        success: false,
        message: 'Item not found',
      };
    }

    // Validate item
    const validation = this.validateItem(item);
    if (!validation.valid) {
      return {
        success: false,
        message: 'Item validation failed',
        errors: validation.errors,
      };
    }

    item.status = 'pending';
    item.updatedAt = Date.now();
    this.pendingItems.set(itemId, item);
    this.saveItems();

    return {
      success: true,
      itemId,
      message: 'Item submitted for review',
    };
  }

  /**
   * Validate marketplace item
   */
  private validateItem(item: MarketplaceItem): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!item.title || item.title.length < 3) {
      errors.push('Title must be at least 3 characters');
    }

    if (!item.description || item.description.length < 10) {
      errors.push('Description must be at least 10 characters');
    }

    if (item.files.length === 0) {
      errors.push('At least one file is required');
    }

    if (!item.version || !/^\d+\.\d+\.\d+$/.test(item.version)) {
      errors.push('Version must be in format X.Y.Z (e.g., 1.0.0)');
    }

    if (item.price < 0) {
      errors.push('Price cannot be negative');
    }

    if (item.tags.length === 0) {
      errors.push('At least one tag is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Update draft item
   */
  updateDraft(itemId: string, updates: Partial<MarketplaceItem>): PublishingResult {
    const item = this.pendingItems.get(itemId) || this.items.get(itemId);
    if (!item) {
      return {
        success: false,
        message: 'Item not found',
      };
    }

    if (item.status === 'published') {
      return {
        success: false,
        message: 'Cannot update published item. Create a new version instead.',
      };
    }

    const updatedItem = {
      ...item,
      ...updates,
      updatedAt: Date.now(),
    };

    if (item.status === 'draft') {
      this.pendingItems.set(itemId, updatedItem);
    } else {
      this.items.set(itemId, updatedItem);
    }

    this.saveItems();

    return {
      success: true,
      itemId,
      message: 'Draft updated successfully',
    };
  }

  /**
   * Get user's published items
   */
  getUserItems(userId?: string): MarketplaceItem[] {
    const profile = userProfileService.getProfile();
    const targetUserId = userId || profile.userId;

    return Array.from(this.items.values()).filter(
      item => item.authorId === targetUserId && item.status === 'published'
    );
  }

  /**
   * Get user's drafts
   */
  getUserDrafts(): MarketplaceItem[] {
    const profile = userProfileService.getProfile();
    return Array.from(this.pendingItems.values()).filter(
      item => item.authorId === profile.userId && item.status === 'draft'
    );
  }

  /**
   * Get user's pending items
   */
  getUserPending(): MarketplaceItem[] {
    const profile = userProfileService.getProfile();
    return Array.from(this.pendingItems.values()).filter(
      item => item.authorId === profile.userId && item.status === 'pending'
    );
  }

  /**
   * Delete draft or pending item
   */
  deleteItem(itemId: string): PublishingResult {
    const item = this.pendingItems.get(itemId);
    if (!item) {
      return {
        success: false,
        message: 'Item not found',
      };
    }

    const profile = userProfileService.getProfile();
    if (item.authorId !== profile.userId) {
      return {
        success: false,
        message: 'Not authorized to delete this item',
      };
    }

    if (item.status === 'published') {
      return {
        success: false,
        message: 'Cannot delete published item',
      };
    }

    this.pendingItems.delete(itemId);
    this.saveItems();

    return {
      success: true,
      message: 'Item deleted successfully',
    };
  }

  /**
   * Get item by ID
   */
  getItem(itemId: string): MarketplaceItem | undefined {
    return this.items.get(itemId) || this.pendingItems.get(itemId);
  }

  /**
   * Get all published items
   */
  getAllPublishedItems(): MarketplaceItem[] {
    return Array.from(this.items.values()).filter(item => item.status === 'published');
  }

  /**
   * Get items by category
   */
  getItemsByCategory(category: string): MarketplaceItem[] {
    return this.getAllPublishedItems().filter(item => item.category === category);
  }

  /**
   * Get items by author
   */
  getItemsByAuthor(authorId: string): MarketplaceItem[] {
    return this.getAllPublishedItems().filter(item => item.authorId === authorId);
  }

  /**
   * Search items
   */
  searchItems(query: string): MarketplaceItem[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllPublishedItems().filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        item.author.toLowerCase().includes(lowerQuery)
    );
  }
}

export const marketplacePublisherService = new MarketplacePublisherService();

