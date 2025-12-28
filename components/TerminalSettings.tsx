/**
 * #hashtag: terminal-settings
 * #purpose: Terminal/CLI settings UI for Xibalba products
 * #provides: Configuration interface for terminal access, automation, and security
 * #usage: Import and use in Settings tab or Engine panel
 * #related: terminalService, MCPSettings, LeftSidebar
 * 
 * Terminal Settings Component
 * Follows Xibalba standards: NO inline styles, component-based, error boundaries
 */

import React, { useState, useEffect } from 'react';
import { TerminalConfig, getTerminalService, saveTerminalConfig } from '../services/terminalService';
import ErrorBoundary from './ErrorBoundary';
import ProgressBar from './ProgressBar';

interface TerminalSettingsProps {
  onConfigChange?: (config: TerminalConfig) => void;
}

const TerminalSettings: React.FC<TerminalSettingsProps> = ({ onConfigChange }) => {
  const [config, setConfig] = useState<TerminalConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const service = getTerminalService();
      const loadedConfig = service.getConfig();
      setConfig(loadedConfig);
    } catch (error) {
      console.error('Failed to load terminal config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    
    setIsSaving(true);
    try {
      const service = getTerminalService();
      service.updateConfig(config);
      saveTerminalConfig(config);
      if (onConfigChange) {
        onConfigChange(config);
      }
      setTestResult({ success: true, message: 'Configuration saved successfully' });
      setTimeout(() => setTestResult(null), 3000);
    } catch (error) {
      setTestResult({ success: false, message: `Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!config) return;
    
    setTestResult(null);
    try {
      const service = getTerminalService();
      const result = await service.executeCommand({
        id: 'test',
        command: 'echo',
        args: ['Xibalba Terminal Test']
      });
      
      if (result.success) {
        setTestResult({ success: true, message: `Terminal test successful: ${result.stdout.trim()}` });
      } else {
        setTestResult({ success: false, message: `Terminal test failed: ${result.stderr}` });
      }
    } catch (error) {
      setTestResult({ success: false, message: `Test error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  };

  if (isLoading || !config) {
    return (
      <div className="xibalba-panel-elevated-professional p-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[var(--xibalba-accent)] animate-pulse" />
          <span className="xibalba-text-caption">Loading terminal configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="xibalba-panel-elevated-professional p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="xibalba-text-heading mb-1">Terminal & CLI Settings</h3>
            <p className="xibalba-text-caption">Configure terminal access and automation for VectorForge</p>
          </div>
          <button
            onClick={handleTest}
            className="xibalba-button-professional"
          >
            <span className="material-symbols-outlined text-[16px] mr-1">bug_report</span>
            Test Connection
          </button>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`p-3 rounded border ${
            testResult.success 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <span className="xibalba-text-caption">{testResult.message}</span>
          </div>
        )}

        {/* Basic Settings */}
        <div className="space-y-4">
          <h4 className="xibalba-text-subheading">Basic Configuration</h4>
          
          <div className="space-y-2">
            <label className="xibalba-text-body flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="xibalba-checkbox"
              />
              Enable Terminal Service
            </label>
          </div>

          <div className="space-y-2">
            <label className="xibalba-text-caption block">Default Shell</label>
            <select
              value={config.shell}
              onChange={(e) => setConfig({ ...config, shell: e.target.value })}
              className="xibalba-input-professional w-full"
            >
              <option value="/bin/bash">Bash</option>
              <option value="/bin/zsh">Zsh</option>
              <option value="/bin/fish">Fish</option>
              <option value="/bin/sh">Sh</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="xibalba-text-caption block">Working Directory</label>
            <input
              type="text"
              value={config.workingDirectory}
              onChange={(e) => setConfig({ ...config, workingDirectory: e.target.value })}
              className="xibalba-input-professional w-full"
              placeholder="/home/user/vectorforge"
            />
          </div>

          <div className="space-y-2">
            <label className="xibalba-text-caption block">Command Timeout (ms)</label>
            <input
              type="number"
              value={config.timeout}
              onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value, 10) })}
              className="xibalba-input-professional w-full"
              min="1000"
              max="300000"
            />
          </div>
        </div>

        {/* Automation Settings */}
        <div className="space-y-4 border-t border-white/10 pt-4">
          <h4 className="xibalba-text-subheading">Automation</h4>
          
          <div className="space-y-2">
            <label className="xibalba-text-body flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.automation.enabled}
                onChange={(e) => setConfig({ 
                  ...config, 
                  automation: { ...config.automation, enabled: e.target.checked }
                })}
                className="xibalba-checkbox"
              />
              Enable Automation Scripts
            </label>
          </div>

          <div className="space-y-2">
            <label className="xibalba-text-caption block">Script Directory</label>
            <input
              type="text"
              value={config.automation.scriptDirectory}
              onChange={(e) => setConfig({ 
                ...config, 
                automation: { ...config.automation, scriptDirectory: e.target.value }
              })}
              className="xibalba-input-professional w-full"
              placeholder="./scripts"
            />
          </div>

          <div className="space-y-2">
            <label className="xibalba-text-body flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.automation.requireConfirmation}
                onChange={(e) => setConfig({ 
                  ...config, 
                  automation: { ...config.automation, requireConfirmation: e.target.checked }
                })}
                className="xibalba-checkbox"
              />
              Require Confirmation for Dangerous Commands
            </label>
          </div>

          <div className="space-y-2">
            <label className="xibalba-text-caption block">Allowed Commands (whitelist, empty = allow all)</label>
            <textarea
              value={config.automation.allowedCommands.join('\n')}
              onChange={(e) => setConfig({ 
                ...config, 
                automation: { 
                  ...config.automation, 
                  allowedCommands: e.target.value.split('\n').filter(c => c.trim())
                }
              })}
              className="xibalba-input-professional w-full h-24"
              placeholder="echo&#10;ls&#10;git"
            />
            <p className="xibalba-text-caption">One command per line. Leave empty to allow all commands.</p>
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-4 border-t border-white/10 pt-4">
          <h4 className="xibalba-text-subheading">Security</h4>
          
          <div className="space-y-2">
            <label className="xibalba-text-body flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.security.sandboxed}
                onChange={(e) => setConfig({ 
                  ...config, 
                  security: { ...config.security, sandboxed: e.target.checked }
                })}
                className="xibalba-checkbox"
              />
              Run Commands in Sandbox
            </label>
          </div>

          <div className="space-y-2">
            <label className="xibalba-text-body flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.security.blockDangerousCommands}
                onChange={(e) => setConfig({ 
                  ...config, 
                  security: { ...config.security, blockDangerousCommands: e.target.checked }
                })}
                className="xibalba-checkbox"
              />
              Block Dangerous Commands (rm -rf, dd, etc.)
            </label>
          </div>

          <div className="space-y-2">
            <label className="xibalba-text-caption block">Restricted Paths</label>
            <textarea
              value={config.security.restrictedPaths.join('\n')}
              onChange={(e) => setConfig({ 
                ...config, 
                security: { 
                  ...config.security, 
                  restrictedPaths: e.target.value.split('\n').filter(p => p.trim())
                }
              })}
              className="xibalba-input-professional w-full h-24"
              placeholder="/etc&#10;/usr&#10;/bin"
            />
            <p className="xibalba-text-caption">Paths that require special permissions. One per line.</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
          {isSaving && (
            <ProgressBar
              progress={undefined}
              label="Saving..."
              size="sm"
              variant="accent"
            />
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="xibalba-button-professional"
          >
            <span className="material-symbols-outlined text-[16px] mr-1">save</span>
            Save Configuration
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TerminalSettings;

