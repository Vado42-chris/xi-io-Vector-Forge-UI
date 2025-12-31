/**
 * Hook for Achievement Unlock Animations
 * Triggers purposeful animations when achievements are unlocked
 */

import { useEffect, useState } from 'react';
import { Achievement } from '../services/achievementService';

export const useAchievementAnimation = (achievement: Achievement | null) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (achievement && achievement.unlocked) {
      setShouldAnimate(true);
      // Reset after animation completes
      const timer = setTimeout(() => setShouldAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  return {
    shouldAnimate,
    animationClass: shouldAnimate ? 'achievement-unlock' : '',
  };
};

