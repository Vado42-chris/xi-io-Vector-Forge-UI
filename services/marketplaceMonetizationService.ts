/**
 * Marketplace Monetization Service
 * Handles payment processing, revenue sharing, and credit management
 * 
 * #hashtag: marketplace monetization service
 */

import { subscriptionService } from './subscriptionService';
import { marketplacePublisherService, MarketplaceItem } from './marketplacePublisherService';
import { marketplaceAnalyticsService } from './marketplaceAnalyticsService';
import { userProfileService } from './userProfileService';

export interface PaymentTransaction {
  id: string;
  itemId: string;
  buyerId: string;
  sellerId: string;
  amount: number; // Total amount in credits
  platformFee: number; // Platform fee (30% or 20% for subscribers)
  sellerRevenue: number; // Amount seller receives (70% or 80%)
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: number;
  completedAt?: number;
}

export interface CreditBalance {
  userId: string;
  balance: number; // Credits balance
  pending: number; // Pending credits (from sales)
  totalEarned: number; // Total credits earned
  totalSpent: number; // Total credits spent
}

export interface RevenueShare {
  sellerPercentage: number; // 70% or 80% depending on subscription
  platformPercentage: number; // 30% or 20%
}

class MarketplaceMonetizationService {
  private storageKey = 'vectorforge-marketplace-transactions';
  private creditKey = 'vectorforge-credit-balances';
  private transactions: Map<string, PaymentTransaction> = new Map();
  private creditBalances: Map<string, CreditBalance> = new Map();

  constructor() {
    this.loadData();
  }

  /**
   * Load data from storage
   */
  private loadData(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const transactionsStr = localStorage.getItem(this.storageKey);
        if (transactionsStr) {
          const transactions = JSON.parse(transactionsStr) as PaymentTransaction[];
          transactions.forEach(t => this.transactions.set(t.id, t));
        }

        const creditsStr = localStorage.getItem(this.creditKey);
        if (creditsStr) {
          const balances = JSON.parse(creditsStr) as Record<string, CreditBalance>;
          Object.entries(balances).forEach(([userId, balance]) => {
            this.creditBalances.set(userId, balance);
          });
        }
      } catch (error) {
        console.error('Failed to load monetization data:', error);
      }
    }
  }

  /**
   * Save data to storage
   */
  private saveData(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const transactions = Array.from(this.transactions.values());
        localStorage.setItem(this.storageKey, JSON.stringify(transactions));

        const balances: Record<string, CreditBalance> = {};
        this.creditBalances.forEach((balance, userId) => {
          balances[userId] = balance;
        });
        localStorage.setItem(this.creditKey, JSON.stringify(balances));
      } catch (error) {
        console.error('Failed to save monetization data:', error);
      }
    }
  }

  /**
   * Get revenue share percentages based on subscription
   */
  private getRevenueShare(sellerId: string): RevenueShare {
    const subscription = subscriptionService.getSubscription();
    const isSubscriber = subscription && subscription.tier !== 'free' && subscription.status === 'active';

    // Subscribers get 80%, non-subscribers get 70%
    if (isSubscriber) {
      return {
        sellerPercentage: 80,
        platformPercentage: 20,
      };
    }

    return {
      sellerPercentage: 70,
      platformPercentage: 30,
    };
  }

  /**
   * Process purchase
   */
  async processPurchase(itemId: string, buyerId: string): Promise<PaymentTransaction> {
    const item = marketplacePublisherService.getItem(itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    if (item.status !== 'published') {
      throw new Error('Item is not available for purchase');
    }

    if (item.price <= 0) {
      throw new Error('Item is free, use download instead');
    }

    // Check buyer balance
    const buyerBalance = this.getCreditBalance(buyerId);
    if (buyerBalance.balance < item.price) {
      throw new Error('Insufficient credits');
    }

    // Calculate revenue share
    const revenueShare = this.getRevenueShare(item.authorId);
    const platformFee = (item.price * revenueShare.platformPercentage) / 100;
    const sellerRevenue = (item.price * revenueShare.sellerPercentage) / 100;

    // Create transaction
    const transaction: PaymentTransaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itemId,
      buyerId,
      sellerId: item.authorId,
      amount: item.price,
      platformFee,
      sellerRevenue,
      status: 'pending',
      createdAt: Date.now(),
    };

    // Deduct from buyer
    this.deductCredits(buyerId, item.price);

    // Add to seller (pending until transaction completes)
    this.addPendingCredits(item.authorId, sellerRevenue);

    // Complete transaction
    transaction.status = 'completed';
    transaction.completedAt = Date.now();
    this.transactions.set(transaction.id, transaction);

    // Move pending to balance
    this.completePendingCredits(item.authorId, sellerRevenue);

    // Record analytics
    marketplaceAnalyticsService.recordPurchase(itemId, item.price);

    // Award XP to seller
    userProfileService.awardXP(
      `sale-${itemId}`,
      'social',
      100, // XP for making a sale
      `Sold ${item.title}`
    );

    // Check for first sale achievement
    const profile = userProfileService.getProfile();
    if (profile.stats.marketplaceItems === 0) {
      // This would be tracked separately, but for now we'll check sales count
      const sellerBalance = this.getCreditBalance(item.authorId);
      if (sellerBalance.totalEarned > 0) {
        // First sale achieved
        // Achievement tracking would happen here
      }
    }

    this.saveData();

    return transaction;
  }

  /**
   * Get credit balance for user
   */
  getCreditBalance(userId: string): CreditBalance {
    if (!this.creditBalances.has(userId)) {
      this.creditBalances.set(userId, {
        userId,
        balance: 0,
        pending: 0,
        totalEarned: 0,
        totalSpent: 0,
      });
    }
    return this.creditBalances.get(userId)!;
  }

  /**
   * Add credits to user balance
   */
  addCredits(userId: string, amount: number): void {
    const balance = this.getCreditBalance(userId);
    balance.balance += amount;
    balance.totalEarned += amount;
    this.creditBalances.set(userId, balance);
    this.saveData();
  }

  /**
   * Deduct credits from user balance
   */
  deductCredits(userId: string, amount: number): void {
    const balance = this.getCreditBalance(userId);
    if (balance.balance < amount) {
      throw new Error('Insufficient credits');
    }
    balance.balance -= amount;
    balance.totalSpent += amount;
    this.creditBalances.set(userId, balance);
    this.saveData();
  }

  /**
   * Add pending credits (from sales, before completion)
   */
  private addPendingCredits(userId: string, amount: number): void {
    const balance = this.getCreditBalance(userId);
    balance.pending += amount;
    this.creditBalances.set(userId, balance);
    this.saveData();
  }

  /**
   * Complete pending credits (move to balance)
   */
  private completePendingCredits(userId: string, amount: number): void {
    const balance = this.getCreditBalance(userId);
    balance.pending -= amount;
    balance.balance += amount;
    balance.totalEarned += amount;
    this.creditBalances.set(userId, balance);
    this.saveData();
  }

  /**
   * Get transaction history
   */
  getTransactionHistory(userId: string, limit?: number): PaymentTransaction[] {
    const transactions = Array.from(this.transactions.values())
      .filter(t => t.buyerId === userId || t.sellerId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);

    return limit ? transactions.slice(0, limit) : transactions;
  }

  /**
   * Get sales history for seller
   */
  getSalesHistory(sellerId: string, limit?: number): PaymentTransaction[] {
    const transactions = Array.from(this.transactions.values())
      .filter(t => t.sellerId === sellerId && t.status === 'completed')
      .sort((a, b) => b.createdAt - a.createdAt);

    return limit ? transactions.slice(0, limit) : transactions;
  }

  /**
   * Get purchase history for buyer
   */
  getPurchaseHistory(buyerId: string, limit?: number): PaymentTransaction[] {
    const transactions = Array.from(this.transactions.values())
      .filter(t => t.buyerId === buyerId && t.status === 'completed')
      .sort((a, b) => b.createdAt - a.createdAt);

    return limit ? transactions.slice(0, limit) : transactions;
  }

  /**
   * Refund transaction
   */
  async refundTransaction(transactionId: string): Promise<void> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'completed') {
      throw new Error('Transaction is not completed');
    }

    // Refund buyer
    this.addCredits(transaction.buyerId, transaction.amount);

    // Deduct from seller
    const sellerBalance = this.getCreditBalance(transaction.sellerId);
    sellerBalance.balance -= transaction.sellerRevenue;
    sellerBalance.totalEarned -= transaction.sellerRevenue;
    this.creditBalances.set(transaction.sellerId, sellerBalance);

    // Update transaction
    transaction.status = 'refunded';
    this.transactions.set(transactionId, transaction);

    this.saveData();
  }
}

export const marketplaceMonetizationService = new MarketplaceMonetizationService();

