/**
 * Achievement Panel Component
 * Displays all achievements with progress and filters
 *
 * #hashtag: gamification achievement-panel component
 */

import React, { useState, useMemo } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { achievementService, Achievement } from '../services/achievementService';
import AchievementBadge from './AchievementBadge';
import ProgressBarFill from './ProgressBarFill';

interface AchievementPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AchievementPanel: React.FC<AchievementPanelProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked' | Achievement['category']>(
    'all'
  );
  const [rarityFilter, setRarityFilter] = useState<'all' | Achievement['rarity']>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const achievements = achievementService.getAllAchievements();
  const stats = achievementService.getStatistics();

  const filteredAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'unlocked' && achievement.unlocked) ||
        (filter === 'locked' && !achievement.unlocked) ||
        achievement.category === filter;

      const matchesRarity = rarityFilter === 'all' || achievement.rarity === rarityFilter;

      return matchesFilter && matchesRarity;
    });
  }, [achievements, filter, rarityFilter]);

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 zstack-modal-backdrop flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievement-panel-title"
      >
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] rounded-lg w-[90vw] max-w-5xl h-[85vh] max-h-[700px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]"
                aria-hidden="true"
              >
                stars
              </span>
              <h2
                id="achievement-panel-title"
                className="text-xl font-bold text-[var(--xibalba-text-000)]"
              >
                Achievements
              </h2>
              <span className="text-sm text-[var(--xibalba-text-100)]">
                ({stats.unlocked}/{stats.total})
              </span>
            </div>
            <button
              onClick={onClose}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Close achievement panel"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-100)]">
                close
              </span>
            </button>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] ${
                  filter === 'all'
                    ? 'bg-[var(--xibalba-accent)] text-white'
                    : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-100)] hover:bg-[var(--xibalba-grey-200)]'
                }`}
                aria-pressed={filter === 'all'}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unlocked')}
                className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] ${
                  filter === 'unlocked'
                    ? 'bg-[var(--xibalba-accent)] text-white'
                    : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-100)] hover:bg-[var(--xibalba-grey-200)]'
                }`}
                aria-pressed={filter === 'unlocked'}
              >
                Unlocked ({stats.unlocked})
              </button>
              <button
                onClick={() => setFilter('locked')}
                className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] ${
                  filter === 'locked'
                    ? 'bg-[var(--xibalba-accent)] text-white'
                    : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-100)] hover:bg-[var(--xibalba-grey-200)]'
                }`}
                aria-pressed={filter === 'locked'}
              >
                Locked ({stats.locked})
              </button>
              {(['action', 'creation', 'social', 'mastery', 'special'] as const).map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] capitalize ${
                    filter === category
                      ? 'bg-[var(--xibalba-accent)] text-white'
                      : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-100)] hover:bg-[var(--xibalba-grey-200)]'
                  }`}
                  aria-pressed={filter === category}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-[var(--xibalba-text-100)] flex items-center">
                Rarity:
              </span>
              {(['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map(rarity => (
                <button
                  key={rarity}
                  onClick={() => setRarityFilter(rarity)}
                  className={`px-3 py-1 rounded-lg transition-colors text-sm min-h-[36px] capitalize ${
                    rarityFilter === rarity
                      ? 'bg-[var(--xibalba-accent)] text-white'
                      : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-100)] hover:bg-[var(--xibalba-grey-200)]'
                  }`}
                  aria-pressed={rarityFilter === rarity}
                >
                  {rarity}
                </button>
              ))}
            </div>
          </div>

          {/* Achievement Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`
                    p-4 border-2 rounded-lg transition-all flex flex-col items-center gap-3
                    ${
                      selectedAchievement?.id === achievement.id
                        ? 'border-[var(--xibalba-accent)] bg-[var(--xibalba-grey-100)]'
                        : 'border-[var(--xibalba-grey-100)] hover:border-[var(--xibalba-accent)]'
                    }
                    ${achievement.unlocked ? '' : 'opacity-75'}
                  `}
                  onClick={() => setSelectedAchievement(achievement)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Achievement: ${achievement.name}`}
                >
                  <div className={achievement.unlocked && achievement.unlockedAt && Date.now() - achievement.unlockedAt < 1000 ? 'achievement-unlock' : ''}>
                    <AchievementBadge
                      achievement={achievement}
                      size="medium"
                      showProgress={!achievement.unlocked}
                      onClick={() => setSelectedAchievement(achievement)}
                    />
                  </div>
                  <div className="text-center">
                    <div
                      className={`font-semibold text-sm ${achievement.unlocked ? 'text-[var(--xibalba-text-000)]' : 'text-[var(--xibalba-text-100)]'}`}
                    >
                      {achievement.name}
                    </div>
                    <div className="text-xs text-[var(--xibalba-text-100)] mt-1">
                      {achievement.description}
                    </div>
                    {!achievement.unlocked && (
                      <div className="text-xs text-[var(--xibalba-text-100)] mt-1">
                        {achievement.progress}/{achievement.target}
                      </div>
                    )}
                    <div
                      className={`text-xs mt-1 capitalize ${
                        achievement.rarity === 'legendary'
                          ? 'text-[var(--vectorforge-accent)]'
                          : achievement.rarity === 'epic'
                            ? 'text-[var(--xibalba-text-000)]'
                            : achievement.rarity === 'rare'
                              ? 'text-[var(--xibalba-accent)]'
                              : achievement.rarity === 'uncommon'
                                ? 'text-[var(--vectorforge-accent)]'
                                : 'text-[var(--xibalba-text-100)]'
                      }`}
                    >
                      {achievement.rarity}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAchievements.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[var(--xibalba-text-100)]">No achievements found</p>
                <p className="text-sm text-[var(--xibalba-text-100)] mt-2">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>

          {/* Selected Achievement Details */}
          {selectedAchievement && (
            <div className="p-6 bg-[var(--xibalba-grey-100)]">
              <div className="flex items-start gap-4">
                <AchievementBadge achievement={selectedAchievement} size="large" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[var(--xibalba-text-000)] mb-1">
                    {selectedAchievement.name}
                  </h3>
                  <p className="text-sm text-[var(--xibalba-text-100)] mb-3">
                    {selectedAchievement.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span
                      className={`capitalize ${
                        selectedAchievement.rarity === 'legendary'
                          ? 'text-[var(--vectorforge-accent)]'
                          : selectedAchievement.rarity === 'epic'
                            ? 'text-[var(--xibalba-text-000)]'
                            : selectedAchievement.rarity === 'rare'
                              ? 'text-[var(--xibalba-accent)]'
                              : selectedAchievement.rarity === 'uncommon'
                                ? 'text-[var(--vectorforge-accent)]'
                                : 'text-[var(--xibalba-text-100)]'
                      }`}
                    >
                      {selectedAchievement.rarity}
                    </span>
                    <span className="text-[var(--xibalba-text-100)] capitalize">
                      {selectedAchievement.category}
                    </span>
                    {selectedAchievement.unlocked && selectedAchievement.unlockedAt && (
                      <span className="text-[var(--xibalba-text-100)]">
                        Unlocked: {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {!selectedAchievement.unlocked && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[var(--xibalba-text-100)]">Progress</span>
                        <span className="text-xs font-semibold text-[var(--xibalba-text-000)]">
                          {selectedAchievement.progress}/{selectedAchievement.target}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[var(--xibalba-grey-200)] rounded-full overflow-hidden">
                        <ProgressBarFill
                          progress={(selectedAchievement.progress / selectedAchievement.target) * 100}
                          className="h-full bg-[var(--xibalba-accent)] transition-all"
                          ariaLabel={`Achievement progress: ${Math.round((selectedAchievement.progress / selectedAchievement.target) * 100)}%`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AchievementPanel;
