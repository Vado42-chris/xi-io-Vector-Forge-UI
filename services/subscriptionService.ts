/**
 * @module SubscriptionService
 * @description
 * Subscription and billing management service.
 * Handles subscription tiers, billing, payments, and feature access.
 * 
 * Server Timestamp: 1737955680000
 * Date: December 27, 2025
 * Patent Tracking ID: VF-SUBSCRIPTION-2025-12-27-001
 * Work Tracking ID: WT-SUBSCRIPTION-1737955680000
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 */

export type SubscriptionTier = 'free' | 'pro' | 'enterprise' | 'custom';
export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer' | 'cryptocurrency';
export type BillingCycle = 'monthly' | 'annual' | 'usage_based' | 'custom';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'past_due';
  billingCycle: BillingCycle;
  currentPeriodStart: number; // Timestamp
  currentPeriodEnd: number; // Timestamp
  cancelAtPeriodEnd: boolean;
  paymentMethod?: PaymentMethod;
  price: number; // In cents
  currency: string;
  features: string[]; // Feature IDs user has access to
  usage: {
    storage: number; // MB used
    storageLimit: number; // MB limit
    apiCalls: number; // API calls this month
    apiCallLimit: number; // API call limit
  };
}

export interface PaymentMethodInfo {
  type: PaymentMethod;
  last4?: string; // Last 4 digits of card
  brand?: string; // Card brand
  expiryMonth?: number;
  expiryYear?: number;
  name?: string; // Account holder name
}

export interface BillingHistory {
  id: string;
  date: number; // Timestamp
  amount: number; // In cents
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  invoiceUrl?: string;
  receiptUrl?: string;
}

const SUBSCRIPTION_STORAGE_KEY = 'vectorforge_subscription';

class SubscriptionService {
  private subscription: Subscription | null = null;
  private listeners: Set<(subscription: Subscription | null) => void> = new Set();

  constructor() {
    this.loadSubscription();
  }

  /**
   * Load subscription from localStorage
   */
  private loadSubscription(): void {
    try {
      const stored = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (stored) {
        this.subscription = JSON.parse(stored);
      } else {
        // Default to free tier
        this.subscription = this.createFreeSubscription();
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
      this.subscription = this.createFreeSubscription();
    }
  }

  /**
   * Create default free subscription
   */
  private createFreeSubscription(): Subscription {
    return {
      id: `sub_free_${Date.now()}`,
      userId: 'user-1', // TODO: Get from auth
      tier: 'free',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodStart: Date.now(),
      currentPeriodEnd: Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 year
      cancelAtPeriodEnd: false,
      price: 0,
      currency: 'USD',
      features: ['basic_editing', 'basic_export', 'community_support'],
      usage: {
        storage: 0,
        storageLimit: 100, // 100 MB for free
        apiCalls: 0,
        apiCallLimit: 100, // 100 API calls/month for free
      },
    };
  }

  /**
   * Get current subscription
   */
  getSubscription(): Subscription | null {
    return this.subscription ? { ...this.subscription } : null;
  }

  /**
   * Get subscription tier
   */
  getTier(): SubscriptionTier {
    return this.subscription?.tier || 'free';
  }

  /**
   * Check if user has access to feature
   */
  hasFeature(featureId: string): boolean {
    if (!this.subscription) return false;
    return this.subscription.features.includes(featureId);
  }

  /**
   * Check if subscription is active
   */
  isActive(): boolean {
    return this.subscription?.status === 'active' || this.subscription?.status === 'trial';
  }

  /**
   * Check if user can upgrade
   */
  canUpgrade(): boolean {
    return this.subscription?.tier !== 'enterprise' && this.subscription?.tier !== 'custom';
  }

  /**
   * Get days until renewal
   */
  getDaysUntilRenewal(): number {
    if (!this.subscription) return 0;
    const now = Date.now();
    const end = this.subscription.currentPeriodEnd;
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  }

  /**
   * Get usage percentage
   */
  getUsagePercentage(type: 'storage' | 'apiCalls'): number {
    if (!this.subscription) return 0;
    const used = this.subscription.usage[type];
    const limit = this.subscription.usage[`${type}Limit` as keyof typeof this.subscription.usage] as number;
    if (limit === 0) return 0;
    return Math.min(100, (used / limit) * 100);
  }

  /**
   * Update subscription
   */
  updateSubscription(subscription: Partial<Subscription>): void {
    if (!this.subscription) return;
    this.subscription = { ...this.subscription, ...subscription };
    this.saveSubscription();
  }

  /**
   * Upgrade subscription
   */
  async upgradeToTier(tier: SubscriptionTier): Promise<boolean> {
    // TODO: Implement actual payment processing
    const newSubscription: Subscription = {
      ...this.subscription!,
      tier,
      status: 'active',
      features: this.getFeaturesForTier(tier),
      usage: {
        ...this.subscription!.usage,
        storageLimit: this.getStorageLimitForTier(tier),
        apiCallLimit: this.getApiCallLimitForTier(tier),
      },
    };
    
    this.subscription = newSubscription;
    this.saveSubscription();
    this.notifyListeners();
    return true;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(cancelAtPeriodEnd: boolean = true): Promise<boolean> {
    if (!this.subscription) return false;
    this.subscription.cancelAtPeriodEnd = cancelAtPeriodEnd;
    if (!cancelAtPeriodEnd) {
      this.subscription.status = 'cancelled';
    }
    this.saveSubscription();
    this.notifyListeners();
    return true;
  }

  /**
   * Get features for tier
   */
  private getFeaturesForTier(tier: SubscriptionTier): string[] {
    const baseFeatures = ['basic_editing', 'basic_export', 'community_support'];
    
    switch (tier) {
      case 'free':
        return baseFeatures;
      case 'pro':
        return [
          ...baseFeatures,
          'advanced_editing',
          'animation_tools',
          'scripting',
          'priority_support',
          'cloud_storage',
          'marketplace_access',
        ];
      case 'enterprise':
        return [
          ...baseFeatures,
          'advanced_editing',
          'animation_tools',
          'scripting',
          'priority_support',
          'cloud_storage',
          'marketplace_access',
          'team_collaboration',
          'custom_integrations',
          'dedicated_support',
          'sla',
        ];
      case 'custom':
        return ['all_features'];
      default:
        return baseFeatures;
    }
  }

  /**
   * Get storage limit for tier
   */
  private getStorageLimitForTier(tier: SubscriptionTier): number {
    switch (tier) {
      case 'free':
        return 100; // 100 MB
      case 'pro':
        return 10000; // 10 GB
      case 'enterprise':
        return 100000; // 100 GB
      case 'custom':
        return 1000000; // 1 TB
      default:
        return 100;
    }
  }

  /**
   * Get API call limit for tier
   */
  private getApiCallLimitForTier(tier: SubscriptionTier): number {
    switch (tier) {
      case 'free':
        return 100; // 100/month
      case 'pro':
        return 10000; // 10k/month
      case 'enterprise':
        return 100000; // 100k/month
      case 'custom':
        return 1000000; // 1M/month
      default:
        return 100;
    }
  }

  /**
   * Save subscription to localStorage
   */
  private saveSubscription(): void {
    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(this.subscription));
    } catch (error) {
      console.error('Failed to save subscription:', error);
    }
  }

  /**
   * Subscribe to subscription changes
   */
  subscribe(listener: (subscription: Subscription | null) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getSubscription());
      } catch (error) {
        console.error('Subscription listener error:', error);
      }
    });
  }
}

// Singleton instance
export const subscriptionService = new SubscriptionService();

