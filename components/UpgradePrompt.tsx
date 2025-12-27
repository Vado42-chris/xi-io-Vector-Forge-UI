/**
 * @module UpgradePrompt
 * @description
 * Upgrade prompt component for feature-locked actions.
 * P1 - Contextual, appears when user tries to access locked feature.
 * 
 * Server Timestamp: 1737955680000
 * Date: December 27, 2025
 * Patent Tracking ID: VF-UPGRADE-2025-12-27-001
 * Work Tracking ID: WT-UPGRADE-1737955680000
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 */

import React, { useState, useEffect } from 'react';
import { subscriptionService, SubscriptionTier } from '../services/subscriptionService';
import ErrorBoundary from './ErrorBoundary';

interface UpgradePromptProps {
  featureId: string;
  featureName: string;
  requiredTier?: SubscriptionTier;
  onUpgrade?: (tier: SubscriptionTier) => void;
  onDismiss?: () => void;
  variant?: 'dialog' | 'inline' | 'toast';
}

const TIER_FEATURES: Record<SubscriptionTier, string[]> = {
  free: ['Basic editing', 'Basic export', 'Community support'],
  pro: [
    'Advanced editing',
    'Animation tools',
    'Scripting',
    'Priority support',
    'Cloud storage',
    'Marketplace access',
  ],
  enterprise: [
    'All Pro features',
    'Team collaboration',
    'Custom integrations',
    'Dedicated support',
    'SLA',
  ],
  custom: ['All features', 'Custom limits', 'Custom integrations'],
};

const TIER_PRICES: Record<SubscriptionTier, { monthly: number; annual: number }> = {
  free: { monthly: 0, annual: 0 },
  pro: { monthly: 1999, annual: 19999 }, // $19.99/month, $199.99/year
  enterprise: { monthly: 9999, annual: 99999 }, // $99.99/month, $999.99/year
  custom: { monthly: 0, annual: 0 },
};

export default function UpgradePrompt({
  featureId,
  featureName,
  requiredTier = 'pro',
  onUpgrade,
  onDismiss,
  variant = 'dialog',
}: UpgradePromptProps) {
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>('free');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(requiredTier);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    setCurrentTier(subscriptionService.getTier());
    
    const unsubscribe = subscriptionService.subscribe((sub) => {
      if (sub) setCurrentTier(sub.tier);
    });
    
    return unsubscribe;
  }, []);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const handleUpgrade = async () => {
    if (onUpgrade) {
      onUpgrade(selectedTier);
    } else {
      await subscriptionService.upgradeToTier(selectedTier);
    }
    onDismiss?.();
  };

  if (variant === 'toast') {
    return (
      <ErrorBoundary>
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg p-4 shadow-2xl max-w-sm">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[var(--xibalba-accent)] text-2xl">
              lock
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[var(--xibalba-text-000)] mb-1">
                {featureName} requires {requiredTier} plan
              </h3>
              <p className="text-xs text-[var(--xibalba-text-200)] mb-3">
                Upgrade to unlock this feature and more.
              </p>
              <button
                onClick={handleUpgrade}
                className="xibalba-button-primary px-4 py-2 text-xs"
              >
                Upgrade Now
              </button>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="xibalba-interactive p-1 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors"
                aria-label="Dismiss"
              >
                <span className="material-symbols-outlined text-sm text-[var(--xibalba-text-200)]">close</span>
              </button>
            )}
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (variant === 'inline') {
    return (
      <ErrorBoundary>
        <div className="xibalba-panel-professional p-4 border border-[var(--xibalba-accent)]/30">
          <div className="flex items-start gap-3 mb-3">
            <span className="material-symbols-outlined text-[var(--xibalba-accent)] text-xl">
              lock
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[var(--xibalba-text-000)] mb-1">
                {featureName} is locked
              </h3>
              <p className="text-xs text-[var(--xibalba-text-200)]">
                Upgrade to {requiredTier} plan to unlock this feature.
              </p>
            </div>
          </div>
          <button
            onClick={handleUpgrade}
            className="xibalba-button-primary px-4 py-2 text-sm"
          >
            Upgrade to {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
          </button>
        </div>
      </ErrorBoundary>
    );
  }

  // Dialog variant (default)
  return (
    <ErrorBoundary>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]">lock</span>
              <div>
                <h2 className="text-xl font-bold text-[var(--xibalba-text-000)]">Upgrade Required</h2>
                <p className="text-sm text-[var(--xibalba-text-200)] mt-1">
                  {featureName} requires {requiredTier} plan
                </p>
              </div>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[var(--xibalba-text-200)]">close</span>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-[var(--xibalba-accent)] text-white'
                    : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-200)] hover:text-[var(--xibalba-text-000)]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  billingCycle === 'annual'
                    ? 'bg-[var(--xibalba-accent)] text-white'
                    : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-200)] hover:text-[var(--xibalba-text-000)]'
                }`}
              >
                Annual <span className="text-xs opacity-75">(Save 17%)</span>
              </button>
            </div>

            {/* Tier Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {(['pro', 'enterprise'] as SubscriptionTier[]).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`xibalba-panel-professional p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTier === tier
                      ? 'border-[var(--xibalba-accent)] bg-[var(--xibalba-accent)]/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[var(--xibalba-text-000)] capitalize">
                      {tier}
                    </h3>
                    {selectedTier === tier && (
                      <span className="material-symbols-outlined text-[var(--xibalba-accent)]">
                        check_circle
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-[var(--xibalba-text-000)] mb-2">
                    {formatPrice(TIER_PRICES[tier][billingCycle])}
                    <span className="text-sm font-normal text-[var(--xibalba-text-200)]">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  <ul className="text-xs text-[var(--xibalba-text-200)] space-y-1 mt-3">
                    {TIER_FEATURES[tier].slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-green-400">check</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            {/* Action */}
            <button
              onClick={handleUpgrade}
              className="w-full xibalba-button-primary py-3 text-sm font-semibold"
            >
              Upgrade to {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

