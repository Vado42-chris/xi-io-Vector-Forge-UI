/**
 * XP Display Component
 * Shows user's current XP, level, and progress to next level
 * 
 * #hashtag: gamification xp-display component
 */

import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { xpService } from '../services/xpService';
import { userProfileService } from '../services/userProfileService';
import ProgressBarFill from './ProgressBarFill';

interface XPDisplayProps {
  compact?: boolean;
  showLevel?: boolean;
  showProgress?: boolean;
}

const XPDisplay: React.FC<XPDisplayProps> = ({ 
  compact = false, 
  showLevel = true,
  showProgress = true 
}) => {
  const [xpData, setXPData] = useState(xpService.getCurrentXP());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setXPData(xpService.getCurrentXP());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <ErrorBoundary>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[var(--xibalba-accent)]" aria-hidden="true">
              star
            </span>
            <span className="text-sm font-semibold text-[var(--xibalba-text-000)]">
              L{xpData.currentLevel}
            </span>
          </div>
          {showProgress && (
            <div className="w-20 h-2 bg-[var(--xibalba-grey-200)] rounded-full overflow-hidden">
              <ProgressBarFill
                progress={xpData.levelProgress}
                className="h-full bg-[var(--xibalba-accent)] transition-all progress-bar-fill"
                ariaLabel={`${xpData.levelProgress.toFixed(0)}% to next level`}
              />
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-[var(--xibalba-grey-100)] rounded-lg p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--xibalba-accent)] flex items-center justify-center">
              <span className="text-xl font-bold text-white">{xpData.currentLevel}</span>
            </div>
            <div>
              {xpData.levelInfo && (
                <div className="font-bold text-[var(--xibalba-text-000)]">
                  {xpData.levelInfo.title}
                </div>
              )}
              <div className="text-sm text-[var(--xibalba-text-100)]">
                {xpData.totalXP} XP
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-200)] rounded transition-colors min-w-[32px] min-h-[32px]"
            aria-label={showDetails ? 'Hide details' : 'Show details'}
          >
            <span className="material-symbols-outlined text-sm text-[var(--xibalba-text-100)]">
              {showDetails ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        {showProgress && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[var(--xibalba-text-100)]">Progress to Level {xpData.currentLevel + 1}</span>
              <span className="text-xs font-semibold text-[var(--xibalba-text-000)]">
                {xpData.levelProgress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-3 bg-[var(--xibalba-grey-200)] rounded-full overflow-hidden">
              <ProgressBarFill
                progress={xpData.levelProgress}
                className="h-full bg-gradient-to-r from-[var(--xibalba-accent)] to-[var(--xibalba-accent)]/80 transition-all progress-bar-fill"
                ariaLabel={`${xpData.levelProgress.toFixed(0)}% to next level`}
              />
            </div>
            <div className="text-xs text-[var(--xibalba-text-100)] mt-1">
              {xpData.xpToNextLevel} XP to next level
            </div>
          </div>
        )}

        {showDetails && xpData.levelInfo && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="text-sm text-[var(--xibalba-text-100)] mb-2">
              {xpData.levelInfo.description}
            </div>
            {xpData.levelInfo.unlocks.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-[var(--xibalba-text-000)] mb-1">
                  Unlocked Features:
                </div>
                <div className="flex flex-wrap gap-1">
                  {xpData.levelInfo.unlocks.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-[var(--xibalba-grey-200)] text-[var(--xibalba-text-100)] rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default XPDisplay;

