# VectorForge Gamification System Design
**Date:** January 27, 2025  
**Status:** 🎮 **DESIGN DOCUMENT**

---

## Overview

VectorForge uses gamification to make learning rewarding, challenging, and engaging. Users earn experience points (XP), level up, unlock features, and can monetize their skills through the marketplace.

---

## Core Systems

### 1. Experience Points (XP) System

#### XP Calculation Service

```typescript
// services/xpService.ts
export interface XPAction {
  id: string;
  type: 'basic' | 'intermediate' | 'advanced' | 'master';
  xp: number;
  description: string;
  category: 'creation' | 'learning' | 'social' | 'marketplace';
}

export class XPService {
  private xpActions: Map<string, XPAction> = new Map();
  
  // Award XP for an action
  awardXP(userId: string, actionId: string): number;
  
  // Get user's total XP
  getTotalXP(userId: string): number;
  
  // Get user's current level
  getLevel(userId: string): number;
  
  // Get XP needed for next level
  getXPForNextLevel(userId: string): number;
}
```

#### XP Action Definitions

**Basic Actions (1-5 XP)**
```typescript
{ id: 'create-shape', type: 'basic', xp: 2, category: 'creation' }
{ id: 'select-object', type: 'basic', xp: 1, category: 'creation' }
{ id: 'save-document', type: 'basic', xp: 3, category: 'creation' }
```

**Intermediate Actions (5-15 XP)**
```typescript
{ id: 'create-layer', type: 'intermediate', xp: 5, category: 'creation' }
{ id: 'apply-transform', type: 'intermediate', xp: 8, category: 'creation' }
{ id: 'first-tool-use', type: 'intermediate', xp: 10, category: 'learning' }
{ id: 'complete-tutorial', type: 'intermediate', xp: 15, category: 'learning' }
```

**Advanced Actions (15-50 XP)**
```typescript
{ id: 'create-animation', type: 'advanced', xp: 25, category: 'creation' }
{ id: 'write-script', type: 'advanced', xp: 30, category: 'creation' }
{ id: 'export-marketplace', type: 'advanced', xp: 40, category: 'marketplace' }
{ id: 'create-palette', type: 'advanced', xp: 20, category: 'creation' }
```

**Master Actions (50-200 XP)**
```typescript
{ id: 'first-sale', type: 'master', xp: 100, category: 'marketplace' }
{ id: 'create-plugin', type: 'master', xp: 150, category: 'creation' }
{ id: 'teach-user', type: 'master', xp: 75, category: 'social' }
{ id: 'complete-advanced-tutorial', type: 'master', xp: 50, category: 'learning' }
```

---

### 2. Level System

#### Level Definitions

```typescript
// types/gamification.ts
export interface Level {
  level: number;
  xpRequired: number;
  unlocks: string[];
  title: string;
  description: string;
  badge?: string;
}

export const LEVELS: Level[] = [
  {
    level: 1,
    xpRequired: 0,
    unlocks: ['basic-tools'],
    title: 'New Creator',
    description: 'Welcome to VectorForge!',
    badge: '🎨'
  },
  {
    level: 2,
    xpRequired: 100,
    unlocks: ['layers', 'properties-panel'],
    title: 'Beginner',
    description: 'You\'re getting the hang of it!',
    badge: '🌟'
  },
  {
    level: 3,
    xpRequired: 300,
    unlocks: ['animation', 'scripts'],
    title: 'Intermediate',
    description: 'You\'re becoming a pro!',
    badge: '⚡'
  },
  {
    level: 4,
    xpRequired: 600,
    unlocks: ['marketplace', 'plugins'],
    title: 'Advanced',
    description: 'You\'re mastering VectorForge!',
    badge: '🏆'
  },
  {
    level: 5,
    xpRequired: 1000,
    unlocks: ['custom-tools', 'api-access'],
    title: 'Expert',
    description: 'You\'re an expert creator!',
    badge: '💎'
  },
  {
    level: 6,
    xpRequired: 1500,
    unlocks: ['teaching', 'mentoring'],
    title: 'Master',
    description: 'You\'re a master creator!',
    badge: '👑'
  },
  {
    level: 7,
    xpRequired: 2500,
    unlocks: ['plugin-development'],
    title: 'Developer',
    description: 'You\'re building the future!',
    badge: '🔧'
  },
  {
    level: 8,
    xpRequired: 4000,
    unlocks: ['marketplace-seller'],
    title: 'Professional',
    description: 'You\'re making it professional!',
    badge: '💼'
  },
  {
    level: 9,
    xpRequired: 6000,
    unlocks: ['concierge-access'],
    title: 'Elite',
    description: 'You\'re elite!',
    badge: '⭐'
  },
  {
    level: 10,
    xpRequired: 10000,
    unlocks: ['voting-rights'],
    title: 'Founder',
    description: 'You\'re shaping the future!',
    badge: '🚀'
  }
];
```

---

### 3. Achievement System

#### Achievement Definitions

```typescript
// types/achievements.ts
export interface Achievement {
  id: string;
  name: string;
  description: string;
  badge: string;
  xpReward: number;
  category: 'creation' | 'learning' | 'social' | 'marketplace' | 'mastery';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: AchievementRequirement[];
}

export interface AchievementRequirement {
  type: 'action-count' | 'level' | 'xp' | 'custom';
  value: number;
  actionId?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-creation',
    name: 'First Creation',
    description: 'Create your first shape',
    badge: '🎨',
    xpReward: 10,
    category: 'creation',
    rarity: 'common',
    requirements: [{ type: 'action-count', value: 1, actionId: 'create-shape' }]
  },
  {
    id: 'tool-master',
    name: 'Tool Master',
    description: 'Use all tools at least once',
    badge: '🏆',
    xpReward: 100,
    category: 'mastery',
    rarity: 'rare',
    requirements: [{ type: 'custom', value: 1 }] // Custom logic: all tools used
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete 10 actions in 1 minute',
    badge: '⚡',
    xpReward: 50,
    category: 'mastery',
    rarity: 'epic',
    requirements: [{ type: 'custom', value: 1 }] // Custom logic: 10 actions in 60s
  },
  {
    id: 'animator',
    name: 'Animator',
    description: 'Create your first animation',
    badge: '🎬',
    xpReward: 75,
    category: 'creation',
    rarity: 'rare',
    requirements: [{ type: 'action-count', value: 1, actionId: 'create-animation' }]
  },
  {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    description: 'Sell your first item in the marketplace',
    badge: '💰',
    xpReward: 200,
    category: 'marketplace',
    rarity: 'epic',
    requirements: [{ type: 'action-count', value: 1, actionId: 'first-sale' }]
  },
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'Help 10 other users',
    badge: '🧠',
    xpReward: 150,
    category: 'social',
    rarity: 'legendary',
    requirements: [{ type: 'action-count', value: 10, actionId: 'teach-user' }]
  }
];
```

---

### 4. Challenge System

#### Daily Challenges

```typescript
// types/challenges.ts
export interface Challenge {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  requirements: ChallengeRequirement[];
  expiresAt: Date;
}

export interface ChallengeRequirement {
  type: 'action-count' | 'create-item' | 'complete-tutorial';
  actionId?: string;
  count: number;
}

export const DAILY_CHALLENGES: Challenge[] = [
  {
    id: 'daily-shapes',
    name: 'Shape Creator',
    description: 'Create 3 shapes using different tools',
    difficulty: 'beginner',
    xpReward: 50,
    requirements: [
      { type: 'action-count', actionId: 'create-shape', count: 3 }
    ],
    expiresAt: new Date() // End of day
  },
  {
    id: 'daily-animate',
    name: 'Animator',
    description: 'Animate a shape across the canvas',
    difficulty: 'intermediate',
    xpReward: 100,
    requirements: [
      { type: 'action-count', actionId: 'create-animation', count: 1 }
    ],
    expiresAt: new Date() // End of day
  }
];
```

---

### 5. User Progress Tracking

#### User Progress State

```typescript
// types/userProgress.ts
export interface UserProgress {
  userId: string;
  totalXP: number;
  currentLevel: number;
  achievements: string[]; // Achievement IDs
  challenges: {
    daily: ChallengeProgress[];
    weekly: ChallengeProgress[];
  };
  stats: {
    shapesCreated: number;
    animationsCreated: number;
    tutorialsCompleted: number;
    marketplaceItemsSold: number;
    usersHelped: number;
  };
  learningStyle?: 'visual' | 'kinesthetic' | 'reading' | 'auditory';
  streak: {
    current: number;
    longest: number;
    lastActiveDate: Date;
  };
}
```

---

## UI Components

### 1. XP Display Component

```typescript
// components/XPDisplay.tsx
interface XPDisplayProps {
  currentXP: number;
  level: number;
  xpForNextLevel: number;
}

// Shows: Level badge, XP bar, progress to next level
```

### 2. Achievement Badge Component

```typescript
// components/AchievementBadge.tsx
interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  progress?: number; // 0-100 for progress to unlock
}
```

### 3. Challenge Card Component

```typescript
// components/ChallengeCard.tsx
interface ChallengeCardProps {
  challenge: Challenge;
  progress: ChallengeProgress;
  onAccept: () => void;
}
```

### 4. Level Up Modal

```typescript
// components/LevelUpModal.tsx
interface LevelUpModalProps {
  newLevel: Level;
  unlocks: string[];
  onClose: () => void;
}
```

---

## Integration Points

### 1. Action Tracking

Every user action should trigger XP calculation:

```typescript
// In component action handlers
const handleCreateShape = () => {
  // ... create shape logic ...
  
  // Award XP
  xpService.awardXP(userId, 'create-shape');
  
  // Check for achievements
  achievementService.checkAchievements(userId);
  
  // Check for challenges
  challengeService.updateProgress(userId, 'daily-shapes');
};
```

### 2. Level Unlocks

When user levels up, unlock features:

```typescript
// In xpService
const levelUp = (userId: string, newLevel: number) => {
  const level = LEVELS.find(l => l.level === newLevel);
  
  // Unlock features
  level?.unlocks.forEach(feature => {
    featureUnlockService.unlock(userId, feature);
  });
  
  // Show level up modal
  showLevelUpModal(level);
};
```

---

## Next Steps

1. **Implement XP Service** - Core XP tracking and calculation
2. **Build Level System** - Level definitions and unlocks
3. **Create Achievement System** - Achievement definitions and tracking
4. **Design Challenge System** - Daily/weekly challenges
5. **Build UI Components** - XP display, badges, modals
6. **Integrate with Actions** - Track all user actions
7. **Add Learning Adaptation** - AI-powered learning style detection

