/**
 * Achievement Badge Component
 * Displays achievement badge with unlock status and progress
 *
 * #hashtag: gamification achievement-badge component
 */

import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Achievement } from '../services/achievementService';
import ProgressBarFill from './ProgressBarFill';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  onClick?: () => void;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'medium',
  showProgress = false,
  onClick,
}) => {
  const sizeClasses = {
    small: 'w-12 h-12 text-lg',
    medium: 'w-16 h-16 text-2xl',
    large: 'w-24 h-24 text-4xl',
  };

  const rarityColors: Record<Achievement['rarity'], string> = {
    common: 'border-[var(--xibalba-text-300)]',
    uncommon: 'border-[var(--vectorforge-accent)]',
    rare: 'border-[var(--vectorforge-accent)]',
    epic: 'border-[var(--vectorforge-accent)]',
    legendary: 'border-[var(--vectorforge-accent)]',
  };

  const progress = (achievement.progress / achievement.target) * 100;

  return (
    <ErrorBoundary>
      <div
        className={`relative ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={`Achievement: ${achievement.name}${achievement.unlocked ? ' (Unlocked)' : ` (${Math.round(progress)}% complete)`}`}
      >
        <div
          className={`
            ${sizeClasses[size]}
            rounded-full border-2 flex items-center justify-center
            transition-all
            ${
              achievement.unlocked
                ? `${rarityColors[achievement.rarity]} bg-[var(--xibalba-grey-100)]`
                : 'border-[var(--xibalba-grey-300)] bg-[var(--xibalba-grey-200)] opacity-50'
            }
            ${onClick ? 'hover:scale-110 hover:shadow-lg' : ''}
          `}
        >
          <span className={achievement.unlocked ? '' : 'grayscale'}>{achievement.icon}</span>
        </div>

        {!achievement.unlocked && showProgress && (
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[var(--xibalba-grey-300)] rounded-full overflow-hidden progress-bar">
            <ProgressBarFill
              progress={progress}
              className={`progress-bar-fill h-full bg-[var(--xibalba-accent)] transition-all ${progress >= 100 ? 'completing' : ''}`}
              ariaLabel={`Achievement progress: ${Math.round(progress)}%`}
            />
          </div>
        )}

        {achievement.unlocked && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--xibalba-accent)] rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-xs text-white" aria-label="Unlocked">
              check
            </span>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AchievementBadge;
