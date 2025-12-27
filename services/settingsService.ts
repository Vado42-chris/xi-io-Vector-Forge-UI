/**
 * @module SettingsService
 * @description
 * Centralized settings management service with persistence.
 * Handles all user preferences, settings, and configurations.
 * 
 * Server Timestamp: 1737955680000
 * Date: December 27, 2025
 * Patent Tracking ID: VF-SETTINGS-2025-12-27-001
 * Work Tracking ID: WT-SETTINGS-1737955680000
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 */

export type Theme = 'dark' | 'light' | 'auto';
export type UIDensity = 'compact' | 'comfortable' | 'spacious';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';
export type MeasurementUnit = 'px' | 'pt' | 'mm' | 'cm' | 'in';

export interface VisualPreferences {
  theme: Theme;
  uiDensity: UIDensity;
  fontSize: number; // Base font size in pixels
  fontFamily: string;
  accentColor: string; // Xibalba orange by default
  showAnimations: boolean;
  reduceMotion: boolean; // Accessibility
}

export interface FunctionalPreferences {
  defaultTool: string;
  snapToGrid: boolean;
  snapToGuides: boolean;
  showGuides: boolean;
  gridSize: number;
  measurementUnit: MeasurementUnit;
  autoSave: boolean;
  autoSaveInterval: number; // seconds
  showTooltips: boolean;
  showKeyboardShortcuts: boolean;
}

export interface PerformancePreferences {
  gpuAcceleration: boolean;
  cacheSize: number; // MB
  memoryLimit: number; // MB
  maxUndoHistory: number;
  enableWebWorkers: boolean;
  enableOffscreenCanvas: boolean;
}

export interface AccessibilityPreferences {
  screenReader: boolean;
  highContrast: boolean;
  keyboardNavigation: boolean;
  voiceCommands: boolean;
  switchControl: boolean;
  reducedMotion: boolean;
  fontSize: number; // Override base font size
}

export interface IntegrationPreferences {
  mcpEnabled: boolean;
  mcpServerUrl: string;
  mcpApiKey: string;
  githubEnabled: boolean;
  githubToken: string;
  githubOrganization: string;
  thirdPartyAddonsEnabled: boolean;
}

export interface UserSettings {
  visual: VisualPreferences;
  functional: FunctionalPreferences;
  performance: PerformancePreferences;
  accessibility: AccessibilityPreferences;
  integrations: IntegrationPreferences;
  version: string; // Settings schema version
  lastUpdated: number; // Timestamp
}

const SETTINGS_STORAGE_KEY = 'vectorforge_settings';
const SETTINGS_VERSION = '1.0.0';

const DEFAULT_SETTINGS: UserSettings = {
  visual: {
    theme: 'dark',
    uiDensity: 'comfortable',
    fontSize: 14,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    accentColor: '#ff6b35', // Xibalba orange
    showAnimations: true,
    reduceMotion: false,
  },
  functional: {
    defaultTool: 'select',
    snapToGrid: true,
    snapToGuides: true,
    showGuides: true,
    gridSize: 10,
    measurementUnit: 'px',
    autoSave: true,
    autoSaveInterval: 60,
    showTooltips: true,
    showKeyboardShortcuts: true,
  },
  performance: {
    gpuAcceleration: true,
    cacheSize: 512,
    memoryLimit: 2048,
    maxUndoHistory: 50,
    enableWebWorkers: true,
    enableOffscreenCanvas: true,
  },
  accessibility: {
    screenReader: false,
    highContrast: false,
    keyboardNavigation: true,
    voiceCommands: false,
    switchControl: false,
    reducedMotion: false,
    fontSize: 14,
  },
  integrations: {
    mcpEnabled: false,
    mcpServerUrl: 'http://localhost:8000',
    mcpApiKey: '',
    githubEnabled: false,
    githubToken: '',
    githubOrganization: '',
    thirdPartyAddonsEnabled: true,
  },
  version: SETTINGS_VERSION,
  lastUpdated: Date.now(),
};

class SettingsService {
  private settings: UserSettings = DEFAULT_SETTINGS;
  private listeners: Set<(settings: UserSettings) => void> = new Set();

  constructor() {
    this.loadSettings();
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle schema changes
        this.settings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          visual: { ...DEFAULT_SETTINGS.visual, ...parsed.visual },
          functional: { ...DEFAULT_SETTINGS.functional, ...parsed.functional },
          performance: { ...DEFAULT_SETTINGS.performance, ...parsed.performance },
          accessibility: { ...DEFAULT_SETTINGS.accessibility, ...parsed.accessibility },
          integrations: { ...DEFAULT_SETTINGS.integrations, ...parsed.integrations },
        };
        this.settings.version = SETTINGS_VERSION;
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.settings = DEFAULT_SETTINGS;
    }
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      this.settings.lastUpdated = Date.now();
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  /**
   * Get all settings
   */
  getSettings(): UserSettings {
    return { ...this.settings };
  }

  /**
   * Get visual preferences
   */
  getVisualPreferences(): VisualPreferences {
    return { ...this.settings.visual };
  }

  /**
   * Get functional preferences
   */
  getFunctionalPreferences(): FunctionalPreferences {
    return { ...this.settings.functional };
  }

  /**
   * Get performance preferences
   */
  getPerformancePreferences(): PerformancePreferences {
    return { ...this.settings.performance };
  }

  /**
   * Get accessibility preferences
   */
  getAccessibilityPreferences(): AccessibilityPreferences {
    return { ...this.settings.accessibility };
  }

  /**
   * Get integration preferences
   */
  getIntegrationPreferences(): IntegrationPreferences {
    return { ...this.settings.integrations };
  }

  /**
   * Update visual preferences
   */
  updateVisualPreferences(preferences: Partial<VisualPreferences>): void {
    this.settings.visual = { ...this.settings.visual, ...preferences };
    this.saveSettings();
  }

  /**
   * Update functional preferences
   */
  updateFunctionalPreferences(preferences: Partial<FunctionalPreferences>): void {
    this.settings.functional = { ...this.settings.functional, ...preferences };
    this.saveSettings();
  }

  /**
   * Update performance preferences
   */
  updatePerformancePreferences(preferences: Partial<PerformancePreferences>): void {
    this.settings.performance = { ...this.settings.performance, ...preferences };
    this.saveSettings();
  }

  /**
   * Update accessibility preferences
   */
  updateAccessibilityPreferences(preferences: Partial<AccessibilityPreferences>): void {
    this.settings.accessibility = { ...this.settings.accessibility, ...preferences };
    this.saveSettings();
  }

  /**
   * Update integration preferences
   */
  updateIntegrationPreferences(preferences: Partial<IntegrationPreferences>): void {
    this.settings.integrations = { ...this.settings.integrations, ...preferences };
    this.saveSettings();
  }

  /**
   * Reset settings to defaults
   */
  resetSettings(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
  }

  /**
   * Export settings as JSON
   */
  exportSettings(): string {
    return JSON.stringify(this.settings, null, 2);
  }

  /**
   * Import settings from JSON
   */
  importSettings(json: string): void {
    try {
      const imported = JSON.parse(json);
      this.settings = {
        ...DEFAULT_SETTINGS,
        ...imported,
        version: SETTINGS_VERSION,
        lastUpdated: Date.now(),
      };
      this.saveSettings();
    } catch (error) {
      console.error('Failed to import settings:', error);
      throw new Error('Invalid settings format');
    }
  }

  /**
   * Subscribe to settings changes
   */
  subscribe(listener: (settings: UserSettings) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of settings changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getSettings());
      } catch (error) {
        console.error('Settings listener error:', error);
      }
    });
  }
}

// Singleton instance
export const settingsService = new SettingsService();

