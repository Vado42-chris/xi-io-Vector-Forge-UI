/**
 * @module AccountMenu
 * @description
 * Account menu dropdown for user profile and account management.
 * P1 - Accessible via header user profile icon.
 * 
 * Server Timestamp: 1737955680000
 * Date: December 27, 2025
 * Patent Tracking ID: VF-ACCOUNT-MENU-2025-12-27-001
 * Work Tracking ID: WT-ACCOUNT-MENU-1737955680000
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 */

import React, { useState, useEffect } from 'react';
import { subscriptionService, Subscription } from '../services/subscriptionService';
import ErrorBoundary from './ErrorBoundary';

interface AccountMenuProps {
  userId?: string;
  userName?: string;
  userEmail?: string;
  onPreferencesClick?: () => void;
  onBillingClick?: () => void;
  onUpgradeClick?: () => void;
  onSignOut?: () => void;
}

export default function AccountMenu({
  userId = 'user-1',
  userName = 'User',
  userEmail = 'user@example.com',
  onPreferencesClick,
  onBillingClick,
  onUpgradeClick,
  onSignOut,
}: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const sub = subscriptionService.getSubscription();
    setSubscription(sub);
    
    const unsubscribe = subscriptionService.subscribe((sub) => {
      setSubscription(sub);
    });
    
    return unsubscribe;
  }, []);

  const displaySubscription = subscription || subscriptionService.getSubscription();
  const canUpgrade = subscriptionService.canUpgrade();
  const tier = subscriptionService.getTier();

  return (
    <ErrorBoundary>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded transition-colors hover:bg-[var(--xibalba-grey-100)] group"
          aria-label="Account menu"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--xibalba-accent)] flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-[var(--xibalba-text-200)] group-hover:text-[var(--xibalba-text-000)] hidden md:inline">
            {userName}
          </span>
          <span className="material-symbols-outlined text-sm text-[var(--xibalba-text-300)]">
            expand_more
          </span>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-[100]"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full right-0 mt-2 w-72 xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg shadow-2xl z-[101] overflow-hidden">
              {/* User Info */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[var(--xibalba-accent)] flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--xibalba-text-000)] truncate">
                      {userName}
                    </div>
                    <div className="text-xs text-[var(--xibalba-text-200)] truncate">
                      {userEmail}
                    </div>
                  </div>
                </div>
                {displaySubscription && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--xibalba-text-200)]">Plan</span>
                      <span className="text-xs font-semibold text-[var(--xibalba-text-000)] capitalize">
                        {displaySubscription.tier}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onPreferencesClick?.();
                  }}
                  className="w-full text-left px-4 py-2 text-sm xibalba-interactive hover:bg-[var(--xibalba-grey-100)] transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg text-[var(--xibalba-text-200)]">settings</span>
                  <span>Preferences</span>
                </button>
                
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onBillingClick?.();
                  }}
                  className="w-full text-left px-4 py-2 text-sm xibalba-interactive hover:bg-[var(--xibalba-grey-100)] transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg text-[var(--xibalba-text-200)]">receipt</span>
                  <span>Billing & Subscription</span>
                </button>

                {canUpgrade && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onUpgradeClick?.();
                    }}
                    className="w-full text-left px-4 py-2 text-sm xibalba-interactive hover:bg-[var(--xibalba-grey-100)] transition-colors flex items-center gap-3 text-[var(--xibalba-accent)]"
                  >
                    <span className="material-symbols-outlined text-lg">trending_up</span>
                    <span>Upgrade Plan</span>
                  </button>
                )}

                <div className="my-2 border-t border-white/10" />

                <button
                  onClick={() => {
                    setIsOpen(false);
                    onSignOut?.();
                  }}
                  className="w-full text-left px-4 py-2 text-sm xibalba-interactive hover:bg-[var(--xibalba-grey-100)] transition-colors flex items-center gap-3 text-red-400"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

