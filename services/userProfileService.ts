/**
 * User Profile Service
 * Manages user profile data including XP, level, achievements, and preferences
 * 
 * #hashtag: gamification user-profile service
 */

import { xpService, XPAction } from './xpService';
import { achievementService, Achievement } from './achievementService';

export interface UserProfile {
  userId: string;
  username: string;
  email?: string;
  avatar?: string;
  createdAt: number;
  lastActive: number;
  xp: number;
  level: number;
  achievements: string[]; // Achievement IDs
  unlockedFeatures: string[];
  stats: {
    projectsCreated: number;
    filesSaved: number;
    templatesUsed: number;
    templatesCreated: number;
    marketplaceItems: number;
    tutorialsCompleted: number;
    guidedWorkflowsCompleted: number;
  };
  preferences: {
    showXPNotifications: boolean;
    showAchievementNotifications: boolean;
    showLevelUpAnimations: boolean;
  };
}

class UserProfileService {
  private storageKey = 'vectorforge-user-profile';
  private currentProfile: UserProfile | null = null;

  constructor() {
    // Lazy initialization - defer localStorage access to prevent blocking
    if (typeof window !== 'undefined') {
      try {
        this.loadProfile();
      } catch (error) {
        console.error('UserProfile Service: Failed to initialize, using defaults:', error);
        // Use defaults - profile will be created on first use
      }
    }
  }

  /**
   * Load user profile from storage
   */
  private loadProfile(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.currentProfile = JSON.parse(stored) as UserProfile;
        } else {
          // Create default profile
          this.currentProfile = this.createDefaultProfile();
          this.saveProfile();
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
        this.currentProfile = this.createDefaultProfile();
      }
    } else {
      this.currentProfile = this.createDefaultProfile();
    }
  }

  /**
   * Save user profile to storage
   */
  private saveProfile(): void {
    if (typeof window !== 'undefined' && window.localStorage && this.currentProfile) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.currentProfile));
      } catch (error) {
        console.error('Failed to save user profile:', error);
      }
    }
  }

  /**
   * Create default profile
   */
  private createDefaultProfile(): UserProfile {
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      userId,
      username: 'New User',
      createdAt: Date.now(),
      lastActive: Date.now(),
      xp: 0,
      level: 1,
      achievements: [],
      unlockedFeatures: ['Basic tools', 'Tutorial access'],
      stats: {
        projectsCreated: 0,
        filesSaved: 0,
        templatesUsed: 0,
        templatesCreated: 0,
        marketplaceItems: 0,
        tutorialsCompleted: 0,
        guidedWorkflowsCompleted: 0,
      },
      preferences: {
        showXPNotifications: true,
        showAchievementNotifications: true,
        showLevelUpAnimations: true,
      },
    };
  }

  /**
   * Get current user profile
   */
  getProfile(): UserProfile {
    if (!this.currentProfile) {
      this.currentProfile = this.createDefaultProfile();
      this.saveProfile();
    }
    return { ...this.currentProfile };
  }

  /**
   * Update profile
   */
  updateProfile(updates: Partial<UserProfile>): void {
    if (!this.currentProfile) {
      this.currentProfile = this.createDefaultProfile();
    }
    this.currentProfile = { ...this.currentProfile, ...updates };
    this.currentProfile.lastActive = Date.now();
    this.saveProfile();
  }

  /**
   * Award XP and update profile
   */
  awardXP(
    actionId: string,
    category: XPAction['category'],
    points: number,
    description: string
  ): {
    newXP: number;
    newLevel: number;
    leveledUp: boolean;
    levelInfo?: any;
  } {
    const result = xpService.awardXP(actionId, category, points, description);
    
    // Update profile
    if (this.currentProfile) {
      this.currentProfile.xp = result.newXP;
      this.currentProfile.level = result.newLevel;
      
      // Update unlocked features
      if (result.leveledUp) {
        this.currentProfile.unlockedFeatures = xpService.getUnlockedFeatures();
        
        // Check level-based achievements
        achievementService.checkLevelAchievements(result.newLevel);
      }
      
      this.saveProfile();
    }
    
    return result;
  }

  /**
   * Unlock achievement
   */
  unlockAchievement(achievementId: string): Achievement | null {
    const achievement = achievementService.getAchievement(achievementId);
    if (!achievement || achievement.unlocked) {
      return null;
    }

    const result = achievementService.recordProgress(achievementId, achievement.target);
    
    if (result && this.currentProfile) {
      if (!this.currentProfile.achievements.includes(achievementId)) {
        this.currentProfile.achievements.push(achievementId);
        this.saveProfile();
      }
    }
    
    return result;
  }

  /**
   * Update statistics
   */
  updateStat(statName: keyof UserProfile['stats'], increment: number = 1): void {
    if (this.currentProfile) {
      this.currentProfile.stats[statName] = (this.currentProfile.stats[statName] || 0) + increment;
      this.currentProfile.lastActive = Date.now();
      this.saveProfile();
    }
  }

  /**
   * Get profile statistics
   */
  getStatistics(): {
    totalXP: number;
    currentLevel: number;
    xpToNextLevel: number;
    levelProgress: number;
    achievementsUnlocked: number;
    achievementsTotal: number;
    unlockedFeatures: string[];
    stats: UserProfile['stats'];
  } {
    const xpData = xpService.getCurrentXP();
    const achievementStats = achievementService.getStatistics();
    
    return {
      totalXP: xpData.totalXP,
      currentLevel: xpData.currentLevel,
      xpToNextLevel: xpData.xpToNextLevel,
      levelProgress: xpData.levelProgress,
      achievementsUnlocked: achievementStats.unlocked,
      achievementsTotal: achievementStats.total,
      unlockedFeatures: this.currentProfile?.unlockedFeatures || [],
      stats: this.currentProfile?.stats || {
        projectsCreated: 0,
        filesSaved: 0,
        templatesUsed: 0,
        templatesCreated: 0,
        marketplaceItems: 0,
        tutorialsCompleted: 0,
        guidedWorkflowsCompleted: 0,
      },
    };
  }

  /**
   * Update preferences
   */
  updatePreferences(preferences: Partial<UserProfile['preferences']>): void {
    if (this.currentProfile) {
      this.currentProfile.preferences = {
        ...this.currentProfile.preferences,
        ...preferences,
      };
      this.saveProfile();
    }
  }

  /**
   * Get preferences
   */
  getPreferences(): UserProfile['preferences'] {
    return this.currentProfile?.preferences || {
      showXPNotifications: true,
      showAchievementNotifications: true,
      showLevelUpAnimations: true,
    };
  }

  /**
   * Check if feature is unlocked
   */
  isFeatureUnlocked(feature: string): boolean {
    return this.currentProfile?.unlockedFeatures.includes(feature) || false;
  }

  /**
   * Reset profile (for testing)
   */
  resetProfile(): void {
    this.currentProfile = this.createDefaultProfile();
    xpService.resetXP();
    achievementService.resetAchievements();
    this.saveProfile();
  }
}

export const userProfileService = new UserProfileService();

