/**
 * @module SubscriptionStatusIndicator
 * @description
 * Subscription status indicator for header.
 * Shows current tier, status, and quick access to account.
 * P0 - Always visible when subscription active.
 * 
 * Server Timestamp: 1737955680000
 * Date: December 27, 2025
 * Patent Tracking ID: VF-SUB-STATUS-2025-12-27-001
 * Work Tracking ID: WT-SUB-STATUS-1737955680000
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 */

import React, { useState, useEffect } from 'react';
import { subscriptionService, Subscription, SubscriptionTier } from '../services/subscriptionService';
import ErrorBoundary from './ErrorBoundary';

interface SubscriptionStatusIndicatorProps {
  onAccountClick?: () => void;
  onUpgradeClick?: () => void;
}

const TIER_COLORS: Record<SubscriptionTier, string> = {
  free: 'var(--xibalba-text-300)',
  pro: 'var(--xibalba-accent)',
  enterprise: '#9d4edd',
  custom: '#ffd60a',
};

const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise',
  custom: 'Custom',
};

export default function SubscriptionStatusIndicator({
  onAccountClick,
  onUpgradeClick,
}: SubscriptionStatusIndicatorProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setSubscription(subscriptionService.getSubscription());
    
    const unsubscribe = subscriptionService.subscribe((sub) => {
      setSubscription(sub);
    });
    
    return unsubscribe;
  }, []);

  if (!subscription) return null;

  const tierLabel = TIER_LABELS[subscription.tier];
  const isActive = subscriptionService.isActive();
  const daysUntilRenewal = subscriptionService.getDaysUntilRenewal();
  const canUpgrade = subscriptionService.canUpgrade();

  return (
    <ErrorBoundary>
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-1.5 rounded transition-colors hover:bg-[var(--xibalba-grey-100)] group"
          aria-label="Subscription status"
        >
          <div
            className={`w-2 h-2 rounded-full subscription-tier-${subscription.tier}`}
            title={`${tierLabel} Tier`}
          />
          <span className="text-xs font-semibold text-[var(--xibalba-text-200)] group-hover:text-[var(--xibalba-text-000)]">
            {tierLabel}
          </span>
          {!isActive && (
            <span className="text-xs text-red-400" title="Subscription inactive">
              ⚠
            </span>
          )}
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-[100]"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute top-full right-0 mt-2 w-64 xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg shadow-2xl z-[101] p-4">
              <div className="space-y-3">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--xibalba-text-200)]">Status</span>
                  <span
                    className={`text-xs font-semibold ${
                      isActive ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {subscription.status === 'active' ? 'Active' :
                     subscription.status === 'trial' ? 'Trial' :
                     subscription.status === 'cancelled' ? 'Cancelled' :
                     subscription.status === 'expired' ? 'Expired' :
                     'Past Due'}
                  </span>
                </div>

                {/* Renewal */}
                {isActive && daysUntilRenewal > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--xibalba-text-200)]">Renews in</span>
                    <span className="text-xs text-[var(--xibalba-text-000)]">
                      {daysUntilRenewal} {daysUntilRenewal === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                )}

                {/* Usage */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--xibalba-text-200)]">Storage</span>
                    <span className="text-xs text-[var(--xibalba-text-000)]">
                      {Math.round(subscription.usage.storage)} / {subscription.usage.storageLimit} MB
                    </span>
                  </div>
                  <div className="usage-progress-bar">
                    <div
                      className="usage-progress-fill"
                      data-width={Math.round(subscriptionService.getUsagePercentage('storage'))}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onAccountClick?.();
                    }}
                    className="w-full text-left px-3 py-2 text-xs xibalba-interactive hover:bg-[var(--xibalba-grey-100)] rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm mr-2 align-middle">account_circle</span>
                    Account Settings
                  </button>
                  {canUpgrade && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onUpgradeClick?.();
                      }}
                      className="w-full text-left px-3 py-2 text-xs xibalba-interactive hover:bg-[var(--xibalba-grey-100)] rounded transition-colors text-[var(--xibalba-accent)]"
                    >
                      <span className="material-symbols-outlined text-sm mr-2 align-middle">trending_up</span>
                      Upgrade Plan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

