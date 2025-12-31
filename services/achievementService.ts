/**
 * Achievement Service
 * Tracks and awards achievements based on user actions
 * 
 * #hashtag: gamification achievements service
 */

import { xpService } from './xpService';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'action' | 'creation' | 'social' | 'mastery' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  target: number;
}

export interface AchievementProgress {
  achievementId: string;
  current: number;
  target: number;
  completed: boolean;
}

class AchievementService {
  private storageKey = 'vectorforge-achievements';
  private achievements: Achievement[] = [];
  private progress: Map<string, number> = new Map();

  constructor() {
    this.initializeAchievements();
    // Lazy initialization - defer localStorage access to prevent blocking
    if (typeof window !== 'undefined') {
      try {
        this.loadAchievementData();
      } catch (error) {
        console.error('Achievement Service: Failed to initialize, using defaults:', error);
        // Use defaults already set in initializeAchievements()
      }
    }
  }

  /**
   * Initialize default achievements
   */
  private initializeAchievements(): void {
    this.achievements = [
      {
        id: 'first-project',
        name: 'First Steps',
        description: 'Create your first project',
        icon: 'rocket_launch',
        category: 'action',
        rarity: 'common',
        unlocked: false,
        progress: 0,
        target: 1,
      },
      {
        id: 'first-export',
        name: 'Sharing is Caring',
        description: 'Export your first file',
        icon: 'file_download',
        category: 'action',
        rarity: 'common',
        unlocked: false,
        progress: 0,
        target: 1,
      },
      {
        id: 'template-user',
        name: 'Template Explorer',
        description: 'Use 5 templates',
        icon: 'library_books',
        category: 'action',
        rarity: 'uncommon',
        unlocked: false,
        progress: 0,
        target: 5,
      },
      {
        id: 'template-creator',
        name: 'Template Master',
        description: 'Create 10 templates',
        icon: 'auto_awesome',
        category: 'creation',
        rarity: 'rare',
        unlocked: false,
        progress: 0,
        target: 10,
      },
      {
        id: 'marketplace-publisher',
        name: 'Marketplace Debut',
        description: 'Publish your first template to the marketplace',
        icon: 'store',
        category: 'social',
        rarity: 'uncommon',
        unlocked: false,
        progress: 0,
        target: 1,
      },
      {
        id: 'level-5',
        name: 'Expert Status',
        description: 'Reach level 5',
        icon: 'star',
        category: 'mastery',
        rarity: 'rare',
        unlocked: false,
        progress: 0,
        target: 5,
      },
      {
        id: 'level-10',
        name: 'Master Status',
        description: 'Reach level 10',
        icon: 'stars',
        category: 'mastery',
        rarity: 'epic',
        unlocked: false,
        progress: 0,
        target: 10,
      },
      {
        id: 'perfect-score',
        name: 'Perfectionist',
        description: 'Get a 5-star rating on a template',
        icon: 'verified',
        category: 'social',
        rarity: 'rare',
        unlocked: false,
        progress: 0,
        target: 1,
      },
      {
        id: 'early-adopter',
        name: 'Early Adopter',
        description: 'Join during beta phase',
        icon: 'new_releases',
        category: 'special',
        rarity: 'legendary',
        unlocked: false,
        progress: 0,
        target: 1,
      },
    ];
  }

  /**
   * Load achievement data from storage
   */
  private loadAchievementData(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const data = JSON.parse(stored) as { achievements: Achievement[]; progress: Record<string, number> };
          this.achievements = data.achievements || this.achievements;
          this.progress = new Map(Object.entries(data.progress || {}));
        }
      } catch (error) {
        console.error('Failed to load achievement data:', error);
      }
    }
  }

  /**
   * Save achievement data to storage
   */
  private saveAchievementData(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const data = {
          achievements: this.achievements,
          progress: Object.fromEntries(this.progress),
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save achievement data:', error);
      }
    }
  }

  /**
   * Record progress for an achievement
   */
  recordProgress(achievementId: string, amount: number = 1): Achievement | null {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) {
      return null;
    }

    const currentProgress = this.progress.get(achievementId) || 0;
    const newProgress = Math.min(currentProgress + amount, achievement.target);
    this.progress.set(achievementId, newProgress);
    achievement.progress = newProgress;

    // Check if achievement is unlocked
    if (newProgress >= achievement.target && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = Date.now();
      
      // Award XP for unlocking achievement
      const xpReward = this.getXPReward(achievement.rarity);
      xpService.awardXP(
        `achievement-${achievementId}`,
        'achievement',
        xpReward,
        `Unlocked achievement: ${achievement.name}`
      );

      this.saveAchievementData();
      return achievement;
    }

    this.saveAchievementData();
    return null;
  }

  /**
   * Get XP reward for achievement rarity
   */
  private getXPReward(rarity: Achievement['rarity']): number {
    const rewards: Record<Achievement['rarity'], number> = {
      common: 25,
      uncommon: 50,
      rare: 100,
      epic: 200,
      legendary: 500,
    };
    return rewards[rarity];
  }

  /**
   * Get all achievements
   */
  getAllAchievements(): Achievement[] {
    return [...this.achievements];
  }

  /**
   * Get unlocked achievements
   */
  getUnlockedAchievements(): Achievement[] {
    return this.achievements.filter(a => a.unlocked);
  }

  /**
   * Get achievement by ID
   */
  getAchievement(id: string): Achievement | undefined {
    return this.achievements.find(a => a.id === id);
  }

  /**
   * Get achievements by category
   */
  getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return this.achievements.filter(a => a.category === category);
  }

  /**
   * Get achievements by rarity
   */
  getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
    return this.achievements.filter(a => a.rarity === rarity);
  }

  /**
   * Get achievement progress
   */
  getAchievementProgress(achievementId: string): AchievementProgress | null {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement) {
      return null;
    }

    return {
      achievementId,
      current: achievement.progress,
      target: achievement.target,
      completed: achievement.unlocked,
    };
  }

  /**
   * Get statistics
   */
  getStatistics(): {
    total: number;
    unlocked: number;
    locked: number;
    byCategory: Record<string, number>;
    byRarity: Record<string, number>;
  } {
    const byCategory: Record<string, number> = {};
    const byRarity: Record<string, number> = {};

    for (const achievement of this.achievements) {
      byCategory[achievement.category] = (byCategory[achievement.category] || 0) + 1;
      byRarity[achievement.rarity] = (byRarity[achievement.rarity] || 0) + 1;
    }

    return {
      total: this.achievements.length,
      unlocked: this.getUnlockedAchievements().length,
      locked: this.achievements.length - this.getUnlockedAchievements().length,
      byCategory,
      byRarity,
    };
  }

  /**
   * Check and update level-based achievements
   */
  checkLevelAchievements(currentLevel: number): Achievement[] {
    const unlocked: Achievement[] = [];

    // Check level achievements
    const levelAchievements = this.achievements.filter(a => 
      a.id.startsWith('level-') && !a.unlocked
    );

    for (const achievement of levelAchievements) {
      const targetLevel = achievement.target;
      if (currentLevel >= targetLevel) {
        const result = this.recordProgress(achievement.id, targetLevel);
        if (result) {
          unlocked.push(result);
        }
      }
    }

    return unlocked;
  }

  /**
   * Reset achievements (for testing)
   */
  resetAchievements(): void {
    for (const achievement of this.achievements) {
      achievement.unlocked = false;
      achievement.unlockedAt = undefined;
      achievement.progress = 0;
    }
    this.progress.clear();
    this.saveAchievementData();
  }
}

export const achievementService = new AchievementService();

