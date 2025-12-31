/**
 * Accessibility Service
 * Accessibility settings management
 * 
 * #hashtag: accessibility service
 */

import { settingsService, AccessibilityPreferences } from './settingsService';

class AccessibilityService {
  /**
   * Apply accessibility settings to document
   */
  applySettings(preferences: AccessibilityPreferences): void {
    const root = document.documentElement;

    // Font size
    if (preferences.fontSize) {
      root.style.setProperty('--accessibility-font-size', `${preferences.fontSize}px`);
    }

    // Line spacing
    if (preferences.lineSpacing) {
      root.style.setProperty('--accessibility-line-height', preferences.lineSpacing.toString());
    }

    // Letter spacing
    if (preferences.letterSpacing) {
      root.style.setProperty('--accessibility-letter-spacing', `${preferences.letterSpacing}em`);
    }

    // Dyslexia font
    if (preferences.dyslexiaFont) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }

    // High contrast
    if (preferences.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Enhanced focus indicators
    if (preferences.enhancedFocusIndicators) {
      document.body.classList.add('enhanced-focus');
    } else {
      document.body.classList.remove('enhanced-focus');
    }

    // Reduced motion
    if (preferences.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    // Color override
    if (preferences.colorOverride) {
      root.style.setProperty('--accessibility-color-override', preferences.colorOverride);
    }
  }

  /**
   * Get current accessibility settings
   */
  getSettings(): AccessibilityPreferences {
    return settingsService.getSettings().accessibility;
  }

  /**
   * Update accessibility settings
   */
  updateSettings(preferences: Partial<AccessibilityPreferences>): void {
    settingsService.updateAccessibilityPreferences(preferences);
    const current = settingsService.getSettings();
    this.applySettings({ ...current.accessibility, ...preferences });
  }

  /**
   * Reset to defaults
   */
  resetToDefaults(): void {
    const defaultSettings = settingsService.getSettings();
    this.applySettings(defaultSettings.accessibility);
  }
}

export const accessibilityService = new AccessibilityService();

