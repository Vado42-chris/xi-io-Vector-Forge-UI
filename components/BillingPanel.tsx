/**
 * @module BillingPanel
 * @description
 * Billing and subscription management panel.
 * P1 - Accessible via Account > Billing & Subscription.
 * 
 * Server Timestamp: 1737955680000
 * Date: December 27, 2025
 * Patent Tracking ID: VF-BILLING-2025-12-27-001
 * Work Tracking ID: WT-BILLING-1737955680000
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 */

import React, { useState, useEffect } from 'react';
import { subscriptionService, Subscription, BillingHistory } from '../services/subscriptionService';
import ErrorBoundary from './ErrorBoundary';

interface BillingPanelProps {
  onClose?: () => void;
  onUpgradeClick?: () => void;
}

export default function BillingPanel({ onClose, onUpgradeClick }: BillingPanelProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'usage'>('overview');

  useEffect(() => {
    const sub = subscriptionService.getSubscription();
    setSubscription(sub);
    
    const unsubscribe = subscriptionService.subscribe((sub) => {
      setSubscription(sub);
    });
    
    // TODO: Load billing history from API
    setBillingHistory([]);
    
    return unsubscribe;
  }, []);

  // Always render - service should always return a subscription
  const displaySubscription = subscription || subscriptionService.getSubscription();
  if (!displaySubscription) {
    return (
      <div className="xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg p-6">
        <p className="text-[var(--xibalba-text-200)]">Loading subscription...</p>
      </div>
    );
  }

  const isActive = subscriptionService.isActive();
  const daysUntilRenewal = subscriptionService.getDaysUntilRenewal();
  const canUpgrade = subscriptionService.canUpgrade();
  const storageUsage = subscriptionService.getUsagePercentage('storage');
  const apiUsage = subscriptionService.getUsagePercentage('apiCalls');
  
  // Use displaySubscription for all references
  const subscription = displaySubscription;

  const formatPrice = (cents: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(cents / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ErrorBoundary>
      <div className="xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--xibalba-text-000)]">Billing & Subscription</h2>
            <p className="text-sm text-[var(--xibalba-text-200)] mt-1">
              Manage your subscription and billing
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-200)]">close</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-[var(--xibalba-accent)] border-b-2 border-[var(--xibalba-accent)]'
                : 'text-[var(--xibalba-text-200)] hover:text-[var(--xibalba-text-000)]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'billing'
                ? 'text-[var(--xibalba-accent)] border-b-2 border-[var(--xibalba-accent)]'
                : 'text-[var(--xibalba-text-200)] hover:text-[var(--xibalba-text-000)]'
            }`}
          >
            Billing History
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'usage'
                ? 'text-[var(--xibalba-accent)] border-b-2 border-[var(--xibalba-accent)]'
                : 'text-[var(--xibalba-text-200)] hover:text-[var(--xibalba-text-000)]'
            }`}
          >
            Usage
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="xibalba-panel-professional p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--xibalba-text-000)] capitalize">
                    {subscription.tier} Plan
                  </h3>
                  <p className="text-sm text-[var(--xibalba-text-200)] mt-1">
                    {formatPrice(subscription.price, subscription.currency)} / {subscription.billingCycle}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded text-xs font-semibold ${
                  isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {subscription.status === 'active' ? 'Active' :
                   subscription.status === 'trial' ? 'Trial' :
                   subscription.status === 'cancelled' ? 'Cancelled' :
                   'Inactive'}
                </div>
              </div>

              {isActive && daysUntilRenewal > 0 && (
                <div className="text-sm text-[var(--xibalba-text-200)]">
                  Renews on {formatDate(subscription.currentPeriodEnd)}
                </div>
              )}

              {subscription.cancelAtPeriodEnd && (
                <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-sm text-yellow-400">
                  Subscription will cancel on {formatDate(subscription.currentPeriodEnd)}
                </div>
              )}

              <div className="mt-4 flex gap-3">
                {canUpgrade && (
                  <button
                    onClick={onUpgradeClick}
                    className="xibalba-button-primary px-4 py-2 text-sm"
                  >
                    Upgrade Plan
                  </button>
                )}
                {isActive && (
                  <button
                    onClick={async () => {
                      if (confirm('Cancel subscription? You will retain access until the end of your billing period.')) {
                        await subscriptionService.cancelSubscription(true);
                      }
                    }}
                    className="xibalba-interactive px-4 py-2 text-sm text-[var(--xibalba-text-200)] hover:text-[var(--xibalba-text-000)] border border-white/10 rounded transition-colors"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>

            {/* Payment Method */}
            {subscription.paymentMethod && (
              <div className="xibalba-panel-professional p-4">
                <h3 className="text-sm font-semibold text-[var(--xibalba-text-000)] mb-3">
                  Payment Method
                </h3>
                <div className="text-sm text-[var(--xibalba-text-200)]">
                  {subscription.paymentMethod === 'credit_card' && 'Credit Card'}
                  {subscription.paymentMethod === 'paypal' && 'PayPal'}
                  {subscription.paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                  {subscription.paymentMethod === 'cryptocurrency' && 'Cryptocurrency'}
                </div>
                <button className="mt-3 text-sm text-[var(--xibalba-accent)] hover:underline">
                  Update Payment Method
                </button>
              </div>
            )}
          </div>
        )}

        {/* Billing History Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-4">
            {billingHistory.length === 0 ? (
              <div className="text-center py-12 text-[var(--xibalba-text-200)]">
                <span className="material-symbols-outlined text-4xl mb-3 block">receipt_long</span>
                <p>No billing history yet</p>
              </div>
            ) : (
              billingHistory.map((bill) => (
                <div key={bill.id} className="xibalba-panel-professional p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-[var(--xibalba-text-000)]">
                      {formatDate(bill.date)}
                    </div>
                    <div className="text-xs text-[var(--xibalba-text-200)] mt-1">
                      {formatPrice(bill.amount, bill.currency)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      bill.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                      bill.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      bill.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {bill.status}
                    </span>
                    {bill.receiptUrl && (
                      <a
                        href={bill.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--xibalba-accent)] hover:underline"
                      >
                        Receipt
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <div className="space-y-6">
            {/* Storage Usage */}
            <div className="xibalba-panel-professional p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[var(--xibalba-text-000)]">Storage</h3>
                <span className="text-xs text-[var(--xibalba-text-200)]">
                  {Math.round(subscription.usage.storage)} / {subscription.usage.storageLimit} MB
                </span>
              </div>
              <div 
                className="usage-progress-bar"
                style={{ '--progress-width': `${storageUsage}%` } as React.CSSProperties}
              >
                <div className="usage-progress-fill" />
              </div>
              {storageUsage > 80 && (
                <p className="text-xs text-yellow-400 mt-2">
                  Storage usage is high. Consider upgrading your plan.
                </p>
              )}
            </div>

            {/* API Calls Usage */}
            <div className="xibalba-panel-professional p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[var(--xibalba-text-000)]">API Calls</h3>
                <span className="text-xs text-[var(--xibalba-text-200)]">
                  {subscription.usage.apiCalls} / {subscription.usage.apiCallLimit}
                </span>
              </div>
              <div 
                className="usage-progress-bar"
                style={{ '--progress-width': `${apiUsage}%` } as React.CSSProperties}
              >
                <div className="usage-progress-fill" />
              </div>
              {apiUsage > 80 && (
                <p className="text-xs text-yellow-400 mt-2">
                  API call usage is high. Consider upgrading your plan.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

