/**
 * XP (Experience Points) Service
 * Tracks user actions and awards experience points
 * 
 * #hashtag: gamification xp-service
 */

export interface XPAction {
  id: string;
  category: 'action' | 'tutorial' | 'achievement' | 'social' | 'creation';
  points: number;
  description: string;
  timestamp: number;
}

export interface XPHistory {
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  actions: XPAction[];
  lastUpdated: number;
}

export interface LevelDefinition {
  level: number;
  xpRequired: number;
  unlocks: string[];
  title: string;
  description: string;
}

class XPService {
  private storageKey = 'vectorforge-xp';
  private currentXP: number = 0;
  private currentLevel: number = 1;
  private actionHistory: XPAction[] = [];
  private levelDefinitions: LevelDefinition[] = [];

  constructor() {
    this.initializeLevelDefinitions();
    // Lazy initialization - defer localStorage access to prevent blocking
    if (typeof window !== 'undefined') {
      try {
        this.loadXPData();
      } catch (error) {
        console.error('XP Service: Failed to initialize, using defaults:', error);
        // Use defaults already set in class properties
      }
    }
  }

  /**
   * Initialize level definitions
   */
  private initializeLevelDefinitions(): void {
    this.levelDefinitions = [
      {
        level: 1,
        xpRequired: 0,
        unlocks: ['Basic tools', 'Tutorial access'],
        title: 'Novice',
        description: 'Welcome to VectorForge!',
      },
      {
        level: 2,
        xpRequired: 100,
        unlocks: ['Advanced tools', 'Template library'],
        title: 'Apprentice',
        description: 'You\'re getting the hang of it!',
      },
      {
        level: 3,
        xpRequired: 300,
        unlocks: ['Custom palettes', 'Workspace customization'],
        title: 'Journeyman',
        description: 'You\'re becoming proficient!',
      },
      {
        level: 4,
        xpRequired: 600,
        unlocks: ['Marketplace access', 'Template creation'],
        title: 'Artisan',
        description: 'You\'re creating great work!',
      },
      {
        level: 5,
        xpRequired: 1000,
        unlocks: ['Marketplace publishing', 'Advanced features'],
        title: 'Expert',
        description: 'You\'re a VectorForge expert!',
      },
      {
        level: 6,
        xpRequired: 1500,
        unlocks: ['Beta features', 'Community moderation'],
        title: 'Master',
        description: 'You\'ve mastered the basics!',
      },
      {
        level: 7,
        xpRequired: 2200,
        unlocks: ['Plugin development', 'API access'],
        title: 'Grandmaster',
        description: 'You\'re a true master!',
      },
      {
        level: 8,
        xpRequired: 3000,
        unlocks: ['Early access', 'Roadmap voting'],
        title: 'Legend',
        description: 'You\'re a VectorForge legend!',
      },
    ];
  }

  /**
   * Load XP data from storage
   */
  private loadXPData(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const data = JSON.parse(stored) as XPHistory;
          this.currentXP = data.totalXP || 0;
          this.currentLevel = data.currentLevel || 1;
          this.actionHistory = data.actions || [];
        }
      } catch (error) {
        console.error('Failed to load XP data:', error);
      }
    }
  }

  /**
   * Save XP data to storage
   */
  private saveXPData(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const data: XPHistory = {
          totalXP: this.currentXP,
          currentLevel: this.currentLevel,
          xpToNextLevel: this.getXPToNextLevel(),
          actions: this.actionHistory,
          lastUpdated: Date.now(),
        };
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save XP data:', error);
      }
    }
  }

  /**
   * Award XP for an action
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
    levelInfo?: LevelDefinition;
  } {
    const action: XPAction = {
      id: actionId,
      category,
      points,
      description,
      timestamp: Date.now(),
    };

    this.actionHistory.push(action);
    this.currentXP += points;

    const oldLevel = this.currentLevel;
    this.currentLevel = this.calculateLevel(this.currentXP);
    const leveledUp = this.currentLevel > oldLevel;

    this.saveXPData();

    return {
      newXP: this.currentXP,
      newLevel: this.currentLevel,
      leveledUp,
      levelInfo: leveledUp ? this.getLevelDefinition(this.currentLevel) : undefined,
    };
  }

  /**
   * Calculate level from total XP
   */
  private calculateLevel(totalXP: number): number {
    for (let i = this.levelDefinitions.length - 1; i >= 0; i--) {
      if (totalXP >= this.levelDefinitions[i].xpRequired) {
        return this.levelDefinitions[i].level;
      }
    }
    return 1;
  }

  /**
   * Get XP required for next level
   */
  getXPToNextLevel(): number {
    const nextLevel = this.currentLevel + 1;
    const nextLevelDef = this.levelDefinitions.find(def => def.level === nextLevel);
    if (nextLevelDef) {
      return nextLevelDef.xpRequired - this.currentXP;
    }
    return 0; // Max level
  }

  /**
   * Get level definition
   */
  getLevelDefinition(level: number): LevelDefinition | undefined {
    return this.levelDefinitions.find(def => def.level === level);
  }

  /**
   * Get current XP data
   */
  getCurrentXP(): {
    totalXP: number;
    currentLevel: number;
    xpToNextLevel: number;
    levelProgress: number; // 0-100
    levelInfo: LevelDefinition | undefined;
  } {
    const levelInfo = this.getLevelDefinition(this.currentLevel);
    const nextLevelDef = this.levelDefinitions.find(def => def.level === this.currentLevel + 1);
    
    let levelProgress = 0;
    if (nextLevelDef && levelInfo) {
      const currentLevelXP = levelInfo.xpRequired;
      const nextLevelXP = nextLevelDef.xpRequired;
      const progressXP = this.currentXP - currentLevelXP;
      const levelRange = nextLevelXP - currentLevelXP;
      levelProgress = levelRange > 0 ? (progressXP / levelRange) * 100 : 100;
    } else {
      levelProgress = 100; // Max level
    }

    return {
      totalXP: this.currentXP,
      currentLevel: this.currentLevel,
      xpToNextLevel: this.getXPToNextLevel(),
      levelProgress: Math.min(100, Math.max(0, levelProgress)),
      levelInfo,
    };
  }

  /**
   * Get action history
   */
  getActionHistory(limit?: number): XPAction[] {
    if (limit) {
      return this.actionHistory.slice(-limit).reverse();
    }
    return [...this.actionHistory].reverse();
  }

  /**
   * Get XP by category
   */
  getXPByCategory(): Record<string, number> {
    const categoryXP: Record<string, number> = {};
    
    for (const action of this.actionHistory) {
      categoryXP[action.category] = (categoryXP[action.category] || 0) + action.points;
    }
    
    return categoryXP;
  }

  /**
   * Get all level definitions
   */
  getAllLevelDefinitions(): LevelDefinition[] {
    return [...this.levelDefinitions];
  }

  /**
   * Get unlocked features for current level
   */
  getUnlockedFeatures(): string[] {
    const unlocked: string[] = [];
    
    for (const levelDef of this.levelDefinitions) {
      if (this.currentLevel >= levelDef.level) {
        unlocked.push(...levelDef.unlocks);
      }
    }
    
    return [...new Set(unlocked)]; // Remove duplicates
  }

  /**
   * Check if feature is unlocked
   */
  isFeatureUnlocked(feature: string): boolean {
    return this.getUnlockedFeatures().includes(feature);
  }

  /**
   * Reset XP (for testing or account reset)
   */
  resetXP(): void {
    this.currentXP = 0;
    this.currentLevel = 1;
    this.actionHistory = [];
    this.saveXPData();
  }
}

export const xpService = new XPService();

// Predefined XP actions
export const XP_ACTIONS = {
  // Actions
  CREATE_PROJECT: { points: 50, category: 'action' as const, description: 'Created a new project' },
  SAVE_FILE: { points: 5, category: 'action' as const, description: 'Saved a file' },
  EXPORT_SVG: { points: 25, category: 'action' as const, description: 'Exported as SVG' },
  USE_TEMPLATE: { points: 10, category: 'action' as const, description: 'Used a template' },
  CREATE_TEMPLATE: { points: 100, category: 'creation' as const, description: 'Created a template' },
  
  // Tutorials
  COMPLETE_TUTORIAL: { points: 50, category: 'tutorial' as const, description: 'Completed a tutorial' },
  COMPLETE_GUIDED_WORKFLOW: { points: 75, category: 'tutorial' as const, description: 'Completed a guided workflow' },
  
  // Achievements
  FIRST_PROJECT: { points: 100, category: 'achievement' as const, description: 'Created your first project' },
  FIRST_EXPORT: { points: 50, category: 'achievement' as const, description: 'Exported your first file' },
  TEMPLATE_MASTER: { points: 200, category: 'achievement' as const, description: 'Created 10 templates' },
  
  // Social
  PUBLISH_TEMPLATE: { points: 150, category: 'social' as const, description: 'Published a template to marketplace' },
  RECEIVE_REVIEW: { points: 25, category: 'social' as const, description: 'Received a review on your template' },
};

