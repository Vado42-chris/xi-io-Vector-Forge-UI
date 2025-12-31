/**
 * Marketplace Analytics Service
 * Tracks sales, views, ratings, and revenue for marketplace items
 * 
 * #hashtag: marketplace analytics service
 */

import { marketplacePublisherService, MarketplaceItem } from './marketplacePublisherService';

export interface AnalyticsData {
  itemId: string;
  date: string; // ISO date string
  views: number;
  downloads: number;
  purchases: number;
  revenue: number;
  ratings: number[];
  reviews: number;
}

export interface SalesReport {
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  startDate: number;
  endDate: number;
  totalRevenue: number;
  totalSales: number;
  items: {
    itemId: string;
    title: string;
    sales: number;
    revenue: number;
  }[];
}

export interface CreatorStats {
  totalItems: number;
  totalViews: number;
  totalDownloads: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  topItems: {
    itemId: string;
    title: string;
    sales: number;
    revenue: number;
  }[];
}

class MarketplaceAnalyticsService {
  private storageKey = 'vectorforge-marketplace-analytics';
  private analytics: Map<string, AnalyticsData[]> = new Map();

  constructor() {
    this.loadAnalytics();
  }

  /**
   * Load analytics data from storage
   */
  private loadAnalytics(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const data = JSON.parse(stored) as Record<string, AnalyticsData[]>;
          Object.entries(data).forEach(([itemId, analytics]) => {
            this.analytics.set(itemId, analytics);
          });
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
      }
    }
  }

  /**
   * Save analytics data to storage
   */
  private saveAnalytics(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const data: Record<string, AnalyticsData[]> = {};
        this.analytics.forEach((analytics, itemId) => {
          data[itemId] = analytics;
        });
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save analytics:', error);
      }
    }
  }

  /**
   * Record a view
   */
  recordView(itemId: string): void {
    const today = new Date().toISOString().split('T')[0];
    const itemAnalytics = this.analytics.get(itemId) || [];
    let todayData = itemAnalytics.find(a => a.date === today);

    if (!todayData) {
      todayData = {
        itemId,
        date: today,
        views: 0,
        downloads: 0,
        purchases: 0,
        revenue: 0,
        ratings: [],
        reviews: 0,
      };
      itemAnalytics.push(todayData);
    }

    todayData.views++;
    this.analytics.set(itemId, itemAnalytics);
    this.saveAnalytics();

    // Update item stats
    const item = marketplacePublisherService.getItem(itemId);
    if (item) {
      item.stats.views++;
      // Note: In a real implementation, this would update the item in the database
    }
  }

  /**
   * Record a download
   */
  recordDownload(itemId: string): void {
    const today = new Date().toISOString().split('T')[0];
    const itemAnalytics = this.analytics.get(itemId) || [];
    let todayData = itemAnalytics.find(a => a.date === today);

    if (!todayData) {
      todayData = {
        itemId,
        date: today,
        views: 0,
        downloads: 0,
        purchases: 0,
        revenue: 0,
        ratings: [],
        reviews: 0,
      };
      itemAnalytics.push(todayData);
    }

    todayData.downloads++;
    this.analytics.set(itemId, itemAnalytics);
    this.saveAnalytics();

    // Update item stats
    const item = marketplacePublisherService.getItem(itemId);
    if (item) {
      item.stats.downloads++;
    }
  }

  /**
   * Record a purchase
   */
  recordPurchase(itemId: string, price: number): void {
    const today = new Date().toISOString().split('T')[0];
    const itemAnalytics = this.analytics.get(itemId) || [];
    let todayData = itemAnalytics.find(a => a.date === today);

    if (!todayData) {
      todayData = {
        itemId,
        date: today,
        views: 0,
        downloads: 0,
        purchases: 0,
        revenue: 0,
        ratings: [],
        reviews: 0,
      };
      itemAnalytics.push(todayData);
    }

    todayData.purchases++;
    todayData.revenue += price;
    this.analytics.set(itemId, itemAnalytics);
    this.saveAnalytics();

    // Update item stats
    const item = marketplacePublisherService.getItem(itemId);
    if (item) {
      item.stats.purchases++;
      item.stats.revenue += price;
    }
  }

  /**
   * Record a rating
   */
  recordRating(itemId: string, rating: number): void {
    const today = new Date().toISOString().split('T')[0];
    const itemAnalytics = this.analytics.get(itemId) || [];
    let todayData = itemAnalytics.find(a => a.date === today);

    if (!todayData) {
      todayData = {
        itemId,
        date: today,
        views: 0,
        downloads: 0,
        purchases: 0,
        revenue: 0,
        ratings: [],
        reviews: 0,
      };
      itemAnalytics.push(todayData);
    }

    todayData.ratings.push(rating);
    this.analytics.set(itemId, itemAnalytics);
    this.saveAnalytics();

    // Update item stats
    const item = marketplacePublisherService.getItem(itemId);
    if (item) {
      const allRatings = itemAnalytics.flatMap(a => a.ratings);
      item.stats.rating = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;
    }
  }

  /**
   * Record a review
   */
  recordReview(itemId: string): void {
    const today = new Date().toISOString().split('T')[0];
    const itemAnalytics = this.analytics.get(itemId) || [];
    let todayData = itemAnalytics.find(a => a.date === today);

    if (!todayData) {
      todayData = {
        itemId,
        date: today,
        views: 0,
        downloads: 0,
        purchases: 0,
        revenue: 0,
        ratings: [],
        reviews: 0,
      };
      itemAnalytics.push(todayData);
    }

    todayData.reviews++;
    this.analytics.set(itemId, itemAnalytics);
    this.saveAnalytics();

    // Update item stats
    const item = marketplacePublisherService.getItem(itemId);
    if (item) {
      item.stats.reviewCount++;
    }
  }

  /**
   * Get analytics for an item
   */
  getItemAnalytics(itemId: string, days: number = 30): AnalyticsData[] {
    const itemAnalytics = this.analytics.get(itemId) || [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateString = cutoffDate.toISOString().split('T')[0];

    return itemAnalytics.filter(a => a.date >= cutoffDateString);
  }

  /**
   * Get sales report for a creator
   */
  getSalesReport(period: 'daily' | 'weekly' | 'monthly' | 'all-time'): SalesReport {
    const now = Date.now();
    let startDate: number;
    const endDate = now;

    switch (period) {
      case 'daily':
        startDate = now - 24 * 60 * 60 * 1000;
        break;
      case 'weekly':
        startDate = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case 'monthly':
        startDate = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case 'all-time':
        startDate = 0;
        break;
    }

    const userItems = marketplacePublisherService.getUserItems();
    const items: { itemId: string; title: string; sales: number; revenue: number }[] = [];

    let totalRevenue = 0;
    let totalSales = 0;

    for (const item of userItems) {
      const analytics = this.getItemAnalytics(item.id, 365);
      const periodAnalytics = analytics.filter(a => {
        const date = new Date(a.date).getTime();
        return date >= startDate && date <= endDate;
      });

      const sales = periodAnalytics.reduce((sum, a) => sum + a.purchases, 0);
      const revenue = periodAnalytics.reduce((sum, a) => sum + a.revenue, 0);

      if (sales > 0 || revenue > 0) {
        items.push({
          itemId: item.id,
          title: item.title,
          sales,
          revenue,
        });
        totalSales += sales;
        totalRevenue += revenue;
      }
    }

    // Sort by revenue descending
    items.sort((a, b) => b.revenue - a.revenue);

    return {
      period,
      startDate,
      endDate,
      totalRevenue,
      totalSales,
      items,
    };
  }

  /**
   * Get creator statistics
   */
  getCreatorStats(): CreatorStats {
    const userItems = marketplacePublisherService.getUserItems();
    const allAnalytics = userItems.map(item => this.getItemAnalytics(item.id, 365));

    const totalViews = allAnalytics.reduce((sum, analytics) => {
      return sum + analytics.reduce((s, a) => s + a.views, 0);
    }, 0);

    const totalDownloads = allAnalytics.reduce((sum, analytics) => {
      return sum + analytics.reduce((s, a) => s + a.downloads, 0);
    }, 0);

    const totalSales = allAnalytics.reduce((sum, analytics) => {
      return sum + analytics.reduce((s, a) => s + a.purchases, 0);
    }, 0);

    const totalRevenue = allAnalytics.reduce((sum, analytics) => {
      return sum + analytics.reduce((s, a) => s + a.revenue, 0);
    }, 0);

    const allRatings = allAnalytics.flatMap(analytics => analytics.flatMap(a => a.ratings));
    const averageRating = allRatings.length > 0
      ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
      : 0;

    const totalReviews = allAnalytics.reduce((sum, analytics) => {
      return sum + analytics.reduce((s, a) => s + a.reviews, 0);
    }, 0);

    // Get top items by revenue
    const topItems = userItems
      .map(item => {
        const analytics = this.getItemAnalytics(item.id, 365);
        const revenue = analytics.reduce((sum, a) => sum + a.revenue, 0);
        const sales = analytics.reduce((sum, a) => sum + a.purchases, 0);
        return {
          itemId: item.id,
          title: item.title,
          sales,
          revenue,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalItems: userItems.length,
      totalViews,
      totalDownloads,
      totalSales,
      totalRevenue,
      averageRating,
      totalReviews,
      topItems,
    };
  }

  /**
   * Get trending items
   */
  getTrendingItems(limit: number = 10): MarketplaceItem[] {
    const allItems = marketplacePublisherService.getAllPublishedItems();
    
    return allItems
      .map(item => {
        const analytics = this.getItemAnalytics(item.id, 7); // Last 7 days
        const recentViews = analytics.reduce((sum, a) => sum + a.views, 0);
        const recentPurchases = analytics.reduce((sum, a) => sum + a.purchases, 0);
        
        // Trending score: views + (purchases * 10)
        const trendingScore = recentViews + (recentPurchases * 10);
        
        return { item, trendingScore };
      })
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit)
      .map(({ item }) => item);
  }
}

export const marketplaceAnalyticsService = new MarketplaceAnalyticsService();

