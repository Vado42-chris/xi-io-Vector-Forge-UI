/**
 * @module PreferencesDialog
 * @description
 * Comprehensive preferences dialog with all settings categories.
 * Implements MAI framework for settings surfacing.
 * 
 * Server Timestamp: 1737955680000
 * Date: December 27, 2025
 * Patent Tracking ID: VF-PREFS-2025-12-27-001
 * Work Tracking ID: WT-PREFS-1737955680000
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 */

import React, { useState, useEffect } from 'react';
import { settingsService, UserSettings } from '../services/settingsService';
import ErrorBoundary from './ErrorBoundary';

interface PreferencesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: 'visual' | 'functional' | 'performance' | 'accessibility' | 'integrations';
}

type SettingsCategory = 'visual' | 'functional' | 'performance' | 'accessibility' | 'integrations';

export default function PreferencesDialog({
  isOpen,
  onClose,
  initialCategory = 'visual',
}: PreferencesDialogProps) {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>(initialCategory);
  const [settings, setSettings] = useState<UserSettings>(settingsService.getSettings());
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(settingsService.getSettings());
      setActiveCategory(initialCategory);
      setHasChanges(false);
    }
  }, [isOpen, initialCategory]);

  // Subscribe to settings changes
  useEffect(() => {
    const unsubscribe = settingsService.subscribe((newSettings) => {
      setSettings(newSettings);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    // Settings are saved automatically via service
    setHasChanges(false);
    onClose();
  };

  const handleCancel = () => {
    // Reload settings to discard changes
    setSettings(settingsService.getSettings());
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    if (confirm('Reset all settings to defaults? This cannot be undone.')) {
      settingsService.resetSettings();
      setSettings(settingsService.getSettings());
      setHasChanges(false);
    }
  };

  const categories: { id: SettingsCategory; label: string; icon: string }[] = [
    { id: 'visual', label: 'Appearance', icon: 'palette' },
    { id: 'functional', label: 'General', icon: 'settings' },
    { id: 'performance', label: 'Performance', icon: 'speed' },
    { id: 'accessibility', label: 'Accessibility', icon: 'accessibility' },
    { id: 'integrations', label: 'Integrations', icon: 'link' },
  ];

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg w-[90vw] max-w-4xl h-[85vh] max-h-[800px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]">settings</span>
              <h2 className="text-xl font-bold text-[var(--xibalba-text-000)]">Preferences</h2>
            </div>
            <button
              onClick={handleCancel}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-200)]">close</span>
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-48 border-r border-white/10 bg-[var(--xibalba-grey-100)] p-4 overflow-y-auto">
              <nav className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded transition-colors flex items-center gap-3 ${
                      activeCategory === category.id
                        ? 'bg-[var(--xibalba-accent)] text-white'
                        : 'text-[var(--xibalba-text-200)] hover:bg-[var(--xibalba-grey-150)] hover:text-[var(--xibalba-text-000)]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{category.icon}</span>
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeCategory === 'visual' && (
                <VisualSettings
                  settings={settings}
                  onChange={(prefs) => {
                    settingsService.updateVisualPreferences(prefs);
                    setHasChanges(true);
                  }}
                />
              )}
              {activeCategory === 'functional' && (
                <FunctionalSettings
                  settings={settings}
                  onChange={(prefs) => {
                    settingsService.updateFunctionalPreferences(prefs);
                    setHasChanges(true);
                  }}
                />
              )}
              {activeCategory === 'performance' && (
                <PerformanceSettings
                  settings={settings}
                  onChange={(prefs) => {
                    settingsService.updatePerformancePreferences(prefs);
                    setHasChanges(true);
                  }}
                />
              )}
              {activeCategory === 'accessibility' && (
                <AccessibilitySettings
                  settings={settings}
                  onChange={(prefs) => {
                    settingsService.updateAccessibilityPreferences(prefs);
                    setHasChanges(true);
                  }}
                />
              )}
              {activeCategory === 'integrations' && (
                <IntegrationSettings
                  settings={settings}
                  onChange={(prefs) => {
                    settingsService.updateIntegrationPreferences(prefs);
                    setHasChanges(true);
                  }}
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10">
            <button
              onClick={handleReset}
              className="xibalba-interactive px-4 py-2 text-sm text-[var(--xibalba-text-200)] hover:text-[var(--xibalba-text-000)] transition-colors"
            >
              Reset to Defaults
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="xibalba-interactive px-6 py-2 text-sm text-[var(--xibalba-text-200)] hover:text-[var(--xibalba-text-000)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="xibalba-button-primary px-6 py-2 text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Visual Settings Component
function VisualSettings({
  settings,
  onChange,
}: {
  settings: UserSettings;
  onChange: (prefs: Partial<typeof settings.visual>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--xibalba-text-000)] mb-4">Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="xibalba-label-professional">Theme</label>
            <select
              value={settings.visual.theme}
              onChange={(e) => onChange({ theme: e.target.value as any })}
              className="xibalba-input-professional w-full"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
          <div>
            <label className="xibalba-label-professional">UI Density</label>
            <select
              value={settings.visual.uiDensity}
              onChange={(e) => onChange({ uiDensity: e.target.value as any })}
              className="xibalba-input-professional w-full"
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
          <div>
            <label className="xibalba-label-professional">Font Size: {settings.visual.fontSize}px</label>
            <input
              type="range"
              min="12"
              max="18"
              value={settings.visual.fontSize}
              onChange={(e) => onChange({ fontSize: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="showAnimations"
              checked={settings.visual.showAnimations}
              onChange={(e) => onChange({ showAnimations: e.target.checked })}
              className="xibalba-checkbox"
            />
            <label htmlFor="showAnimations" className="xibalba-label-professional cursor-pointer">
              Show Animations
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Functional Settings Component
function FunctionalSettings({
  settings,
  onChange,
}: {
  settings: UserSettings;
  onChange: (prefs: Partial<typeof settings.functional>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--xibalba-text-000)] mb-4">General</h3>
        <div className="space-y-4">
          <div>
            <label className="xibalba-label-professional">Default Tool</label>
            <select
              value={settings.functional.defaultTool}
              onChange={(e) => onChange({ defaultTool: e.target.value })}
              className="xibalba-input-professional w-full"
            >
              <option value="select">Selection Tool</option>
              <option value="pen">Pen Tool</option>
              <option value="rectangle">Rectangle Tool</option>
              <option value="ellipse">Ellipse Tool</option>
              <option value="text">Text Tool</option>
            </select>
          </div>
          <div>
            <label className="xibalba-label-professional">Measurement Unit</label>
            <select
              value={settings.functional.measurementUnit}
              onChange={(e) => onChange({ measurementUnit: e.target.value as any })}
              className="xibalba-input-professional w-full"
            >
              <option value="px">Pixels (px)</option>
              <option value="pt">Points (pt)</option>
              <option value="mm">Millimeters (mm)</option>
              <option value="cm">Centimeters (cm)</option>
              <option value="in">Inches (in)</option>
            </select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoSave"
                checked={settings.functional.autoSave}
                onChange={(e) => onChange({ autoSave: e.target.checked })}
                className="xibalba-checkbox"
              />
              <label htmlFor="autoSave" className="xibalba-label-professional cursor-pointer">
                Auto-Save
              </label>
            </div>
            {settings.functional.autoSave && (
              <div className="ml-7">
                <label className="xibalba-label-professional">
                  Auto-Save Interval: {settings.functional.autoSaveInterval}s
                </label>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={settings.functional.autoSaveInterval}
                  onChange={(e) => onChange({ autoSaveInterval: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Performance Settings Component
function PerformanceSettings({
  settings,
  onChange,
}: {
  settings: UserSettings;
  onChange: (prefs: Partial<typeof settings.performance>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--xibalba-text-000)] mb-4">Performance</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="gpuAcceleration"
              checked={settings.performance.gpuAcceleration}
              onChange={(e) => onChange({ gpuAcceleration: e.target.checked })}
              className="xibalba-checkbox"
            />
            <label htmlFor="gpuAcceleration" className="xibalba-label-professional cursor-pointer">
              GPU Acceleration
            </label>
          </div>
          <div>
            <label className="xibalba-label-professional">Cache Size: {settings.performance.cacheSize} MB</label>
            <input
              type="range"
              min="128"
              max="2048"
              step="128"
              value={settings.performance.cacheSize}
              onChange={(e) => onChange({ cacheSize: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="xibalba-label-professional">Max Undo History: {settings.performance.maxUndoHistory}</label>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={settings.performance.maxUndoHistory}
              onChange={(e) => onChange({ maxUndoHistory: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Accessibility Settings Component
function AccessibilitySettings({
  settings,
  onChange,
}: {
  settings: UserSettings;
  onChange: (prefs: Partial<typeof settings.accessibility>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--xibalba-text-000)] mb-4">Accessibility</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="screenReader"
              checked={settings.accessibility.screenReader}
              onChange={(e) => onChange({ screenReader: e.target.checked })}
              className="xibalba-checkbox"
            />
            <label htmlFor="screenReader" className="xibalba-label-professional cursor-pointer">
              Screen Reader Support
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="keyboardNavigation"
              checked={settings.accessibility.keyboardNavigation}
              onChange={(e) => onChange({ keyboardNavigation: e.target.checked })}
              className="xibalba-checkbox"
            />
            <label htmlFor="keyboardNavigation" className="xibalba-label-professional cursor-pointer">
              Enhanced Keyboard Navigation
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="highContrast"
              checked={settings.accessibility.highContrast}
              onChange={(e) => onChange({ highContrast: e.target.checked })}
              className="xibalba-checkbox"
            />
            <label htmlFor="highContrast" className="xibalba-label-professional cursor-pointer">
              High Contrast Mode
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="reducedMotion"
              checked={settings.accessibility.reducedMotion}
              onChange={(e) => onChange({ reducedMotion: e.target.checked })}
              className="xibalba-checkbox"
            />
            <label htmlFor="reducedMotion" className="xibalba-label-professional cursor-pointer">
              Reduce Motion
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Integration Settings Component
function IntegrationSettings({
  settings,
  onChange,
}: {
  settings: UserSettings;
  onChange: (prefs: Partial<typeof settings.integrations>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--xibalba-text-000)] mb-4">Integrations</h3>
        <div className="space-y-6">
          {/* MCP Settings */}
          <div className="xibalba-panel-professional p-4">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="mcpEnabled"
                checked={settings.integrations.mcpEnabled}
                onChange={(e) => onChange({ mcpEnabled: e.target.checked })}
                className="xibalba-checkbox"
              />
              <label htmlFor="mcpEnabled" className="xibalba-label-professional cursor-pointer font-semibold">
                MCP Protocols (Model Context Protocol)
              </label>
            </div>
            {settings.integrations.mcpEnabled && (
              <div className="space-y-3 ml-7">
                <div>
                  <label className="xibalba-label-professional">MCP Server URL</label>
                  <input
                    type="text"
                    value={settings.integrations.mcpServerUrl}
                    onChange={(e) => onChange({ mcpServerUrl: e.target.value })}
                    className="xibalba-input-professional w-full"
                    placeholder="http://localhost:8000"
                  />
                </div>
                <div>
                  <label className="xibalba-label-professional">MCP API Key</label>
                  <input
                    type="password"
                    value={settings.integrations.mcpApiKey}
                    onChange={(e) => onChange({ mcpApiKey: e.target.value })}
                    className="xibalba-input-professional w-full"
                    placeholder="Enter API key"
                  />
                </div>
              </div>
            )}
          </div>

          {/* GitHub Settings */}
          <div className="xibalba-panel-professional p-4">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="githubEnabled"
                checked={settings.integrations.githubEnabled}
                onChange={(e) => onChange({ githubEnabled: e.target.checked })}
                className="xibalba-checkbox"
              />
              <label htmlFor="githubEnabled" className="xibalba-label-professional cursor-pointer font-semibold">
                GitHub Actions
              </label>
            </div>
            {settings.integrations.githubEnabled && (
              <div className="space-y-3 ml-7">
                <div>
                  <label className="xibalba-label-professional">GitHub Token</label>
                  <input
                    type="password"
                    value={settings.integrations.githubToken}
                    onChange={(e) => onChange({ githubToken: e.target.value })}
                    className="xibalba-input-professional w-full"
                    placeholder="Enter GitHub token"
                  />
                </div>
                <div>
                  <label className="xibalba-label-professional">Organization</label>
                  <input
                    type="text"
                    value={settings.integrations.githubOrganization}
                    onChange={(e) => onChange({ githubOrganization: e.target.value })}
                    className="xibalba-input-professional w-full"
                    placeholder="Organization name"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3rd Party Addons */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="thirdPartyAddons"
              checked={settings.integrations.thirdPartyAddonsEnabled}
              onChange={(e) => onChange({ thirdPartyAddonsEnabled: e.target.checked })}
              className="xibalba-checkbox"
            />
            <label htmlFor="thirdPartyAddons" className="xibalba-label-professional cursor-pointer">
              Enable 3rd Party Addons
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

