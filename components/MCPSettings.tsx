/**
 * #hashtag: mcp-settings
 * #purpose: MCP protocol configuration panel for VectorForge script editor
 * #provides: UI for configuring MCP server connection and features
 * #usage: Import and use in settings or as standalone panel
 * #related: mcpConfig, mcpScriptService, ScriptEditor
 * 
 * MCP Settings Component
 * Follows Xibalba standards: Error boundaries, loading states, TypeScript strict
 */

import React, { useState, useEffect } from 'react';
import { MCPConfig, loadMCPConfig, saveMCPConfig, resetMCPConfig, validateMCPConfig } from '../config/mcpConfig';
import { detectLocalAIProvider, getAvailableModels, testLocalAIConnection, LocalAIConfig } from '../services/localAIService';
import ErrorBoundary from './ErrorBoundary';

interface MCPSettingsProps {
  onConfigChange?: (config: MCPConfig) => void;
}

const MCPSettings: React.FC<MCPSettingsProps> = ({ onConfigChange }) => {
  const [config, setConfig] = useState<MCPConfig>(loadMCPConfig());
  const [isSaving, setIsSaving] = useState(false);
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[] }>({ valid: true, errors: [] });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const validation = validateMCPConfig(config);
    setValidation(validation);
  }, [config]);

  // AUTO-CONFIGURE OLLAMA ON STARTUP - No user interaction needed
  useEffect(() => {
    // Auto-detect and configure Ollama if not already configured
    if (config.useLocalAI) {
      // If Ollama URL is default, try to auto-connect
      if (config.localAIServerUrl === 'http://localhost:11434' || !config.localAIModelName) {
        detectProvider().then(() => {
          // After detection, load models and auto-select
          setTimeout(() => {
            loadModels();
          }, 500);
        });
      } else {
        // Already configured, just load models
        loadModels();
      }
    }
  }, []);

  // Load available models when provider/server changes
  useEffect(() => {
    if (config.useLocalAI && config.localAIProvider && config.localAIServerUrl) {
      loadModels();
    }
  }, [config.useLocalAI, config.localAIProvider, config.localAIServerUrl]);

  const detectProvider = async () => {
    setIsDetecting(true);
    try {
      const provider = await detectLocalAIProvider();
      if (provider) {
        const defaultUrls: Record<string, string> = {
          'ollama': 'http://localhost:11434',
          'llama-cpp': 'http://localhost:8080',
          'text-generation-webui': 'http://localhost:7860'
        };
        const newConfig = {
          localAIProvider: provider,
          localAIServerUrl: defaultUrls[provider] || config.localAIServerUrl
        };
        handleConfigChange(newConfig);
        // AUTO-SAVE configuration
        saveMCPConfig(newConfig);
      }
    } catch (error) {
      console.error('Provider detection failed:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const loadModels = async () => {
    try {
      const models = await getAvailableModels(config.localAIProvider, config.localAIServerUrl);
      setAvailableModels(models);
      // Auto-select first model if none selected AND AUTO-SAVE
      if (models.length > 0 && !config.localAIModelName) {
        const newConfig = { ...config, localAIModelName: models[0] };
        handleConfigChange({ localAIModelName: models[0] });
        // Auto-save configuration
        saveMCPConfig({ localAIModelName: models[0] });
        if (onConfigChange) {
          onConfigChange(newConfig);
        }
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      setAvailableModels([]);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testLocalAIConnection({
        provider: config.localAIProvider,
        serverUrl: config.localAIServerUrl,
        modelName: config.localAIModelName,
        ggufPath: config.ggufPath
      });
      setTestResult(result);
      if (result.models) {
        setAvailableModels(result.models);
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Test failed'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleConfigChange = (updates: Partial<MCPConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    saveMCPConfig(config);
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const handleReset = () => {
    const defaultConfig = resetMCPConfig();
    setConfig(defaultConfig);
    if (onConfigChange) {
      onConfigChange(defaultConfig);
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6 p-6 bg-[var(--xibalba-grey-050)]">
        <div className="xibalba-section-header-professional">
          <span className="material-symbols-outlined text-[16px] mr-2">settings</span>
          <span>MCP Protocol Settings</span>
        </div>

        {/* Enable/Disable */}
        <div className="xibalba-panel-professional">
          <label className="xibalba-label-professional flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => handleConfigChange({ enabled: e.target.checked })}
              className="xibalba-focus-professional"
            />
            <span>Enable MCP Protocol</span>
          </label>
          <p className="xibalba-text-caption mt-2">
            Enable AI-powered features: code completion, validation, suggestions, documentation
          </p>
        </div>

        {/* Local AI Toggle */}
        <div className="xibalba-panel-professional">
          <label className="xibalba-label-professional flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.useLocalAI}
              onChange={(e) => handleConfigChange({ useLocalAI: e.target.checked })}
              className="xibalba-focus-professional"
            />
            <span>Use Local GGUF Models</span>
          </label>
          <p className="xibalba-text-caption mt-2">
            Use your local GGUF models (Ollama, llama-cpp-python, etc.) instead of remote MCP server
          </p>
        </div>

        {config.enabled && (
          <>
            {/* Local AI Configuration */}
            {config.useLocalAI && (
              <div className="xibalba-panel-professional space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="xibalba-label-professional">Local AI Configuration</div>
                  <button
                    onClick={detectProvider}
                    disabled={isDetecting}
                    className="xibalba-button-professional text-xs"
                  >
                    {isDetecting ? (
                      <>
                        <span className="material-symbols-outlined text-[14px] mr-1 animate-spin">sync</span>
                        Detecting...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[14px] mr-1">search</span>
                        Auto-Detect
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="xibalba-label-professional">AI Provider</label>
                  <select
                    value={config.localAIProvider}
                    onChange={(e) => {
                      const provider = e.target.value as LocalAIConfig['provider'];
                      const defaultUrls: Record<string, string> = {
                        'ollama': 'http://localhost:11434',
                        'llama-cpp': 'http://localhost:8080',
                        'text-generation-webui': 'http://localhost:7860',
                        'custom': config.localAIServerUrl
                      };
                      handleConfigChange({
                        localAIProvider: provider,
                        localAIServerUrl: defaultUrls[provider] || config.localAIServerUrl
                      });
                    }}
                    className="xibalba-input-professional w-full"
                  >
                    <option value="ollama">Ollama</option>
                    <option value="llama-cpp">llama-cpp-python</option>
                    <option value="text-generation-webui">text-generation-webui</option>
                    <option value="custom">Custom Inference Server</option>
                  </select>
                  <p className="xibalba-text-caption mt-1">
                    Select your local AI inference server
                  </p>
                </div>

                <div>
                  <label className="xibalba-label-professional">Server URL</label>
                  <input
                    type="text"
                    value={config.localAIServerUrl}
                    onChange={(e) => handleConfigChange({ localAIServerUrl: e.target.value })}
                    placeholder="http://localhost:11434"
                    className="xibalba-input-professional w-full"
                  />
                  <p className="xibalba-text-caption mt-1">
                    URL of your local AI inference server
                  </p>
                </div>

                <div>
                  <label className="xibalba-label-professional">Model Name</label>
                  <div className="flex gap-2">
                    <select
                      value={config.localAIModelName}
                      onChange={(e) => handleConfigChange({ localAIModelName: e.target.value })}
                      className="xibalba-input-professional flex-1"
                      disabled={availableModels.length === 0}
                    >
                      <option value="">Select a model...</option>
                      {availableModels.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                    <button
                      onClick={loadModels}
                      className="xibalba-button-professional"
                      title="Refresh models"
                    >
                      <span className="material-symbols-outlined text-[16px]">refresh</span>
                    </button>
                    <button
                      onClick={handleTestConnection}
                      disabled={isTesting || !config.localAIModelName}
                      className="xibalba-button-professional"
                      title="Test connection"
                    >
                      {isTesting ? (
                        <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                      ) : (
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      )}
                    </button>
                  </div>
                  {testResult && (
                    <div className={`mt-2 text-xs ${testResult.success ? 'text-[var(--vectorforge-accent)]' : 'text-[var(--vectorforge-accent)]'}`}>
                      {testResult.message}
                    </div>
                  )}
                  <p className="xibalba-text-caption mt-1">
                    Select your GGUF model (must be loaded in your inference server)
                  </p>
                </div>

                {config.localAIProvider === 'custom' && (
                  <div>
                    <label className="xibalba-label-professional">GGUF File Path (Optional)</label>
                    <input
                      type="text"
                      value={config.ggufPath || ''}
                      onChange={(e) => handleConfigChange({ ggufPath: e.target.value })}
                      placeholder="/path/to/model.gguf"
                      className="xibalba-input-professional w-full"
                    />
                    <p className="xibalba-text-caption mt-1">
                      Path to GGUF file (if using custom inference server)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* MCP Server Configuration (if not using local AI) */}
            {!config.useLocalAI && (
              <div className="xibalba-panel-professional space-y-4">
              <div>
                <label className="xibalba-label-professional">MCP Server URL</label>
                <input
                  type="text"
                  value={config.serverUrl}
                  onChange={(e) => handleConfigChange({ serverUrl: e.target.value })}
                  placeholder="http://localhost:8000"
                  className="xibalba-input-professional w-full"
                />
                <p className="xibalba-text-caption mt-1">
                  URL of your local Xibalba MCP server
                </p>
              </div>

              <div>
                <label className="xibalba-label-professional">API Key (Optional)</label>
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => handleConfigChange({ apiKey: e.target.value })}
                  placeholder="Leave empty for local server"
                  className="xibalba-input-professional w-full"
                />
                <p className="xibalba-text-caption mt-1">
                  API key if required by your MCP server
                </p>
              </div>

              <div>
                <label className="xibalba-label-professional">Model</label>
                <input
                  type="text"
                  value={config.model}
                  onChange={(e) => handleConfigChange({ model: e.target.value })}
                  placeholder="xibalba-local"
                  className="xibalba-input-professional w-full"
                />
                  <p className="xibalba-text-caption mt-1">
                    Model identifier for MCP server
                  </p>
                </div>
              </div>
            )}

            {/* Feature Toggles */}
            <div className="xibalba-panel-professional space-y-3">
              <div className="xibalba-label-professional mb-2">Features</div>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.features.completion}
                  onChange={(e) => handleConfigChange({
                    features: { ...config.features, completion: e.target.checked }
                  })}
                  className="xibalba-focus-professional"
                />
                <span className="text-sm">AI-Powered Code Completion</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.features.validation}
                  onChange={(e) => handleConfigChange({
                    features: { ...config.features, validation: e.target.checked }
                  })}
                  className="xibalba-focus-professional"
                />
                <span className="text-sm">Intelligent Validation</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.features.documentation}
                  onChange={(e) => handleConfigChange({
                    features: { ...config.features, documentation: e.target.checked }
                  })}
                  className="xibalba-focus-professional"
                />
                <span className="text-sm">Command Documentation</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.features.suggestions}
                  onChange={(e) => handleConfigChange({
                    features: { ...config.features, suggestions: e.target.checked }
                  })}
                  className="xibalba-focus-professional"
                />
                <span className="text-sm">Code Suggestions</span>
              </label>
            </div>

            {/* Advanced Settings */}
            <div className="xibalba-panel-professional">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="xibalba-button-professional w-full mb-4"
              >
                <span className="material-symbols-outlined text-[16px] mr-2">
                  {showAdvanced ? 'expand_less' : 'expand_more'}
                </span>
                Advanced Settings
              </button>

              {showAdvanced && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div>
                    <label className="xibalba-label-professional">Timeout (ms)</label>
                    <input
                      type="number"
                      min="1000"
                      max="30000"
                      value={config.timeout}
                      onChange={(e) => handleConfigChange({ timeout: parseInt(e.target.value) })}
                      className="xibalba-input-professional w-full"
                    />
                  </div>

                  <div>
                    <label className="xibalba-label-professional">Retry Attempts</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={config.retryAttempts}
                      onChange={(e) => handleConfigChange({ retryAttempts: parseInt(e.target.value) })}
                      className="xibalba-input-professional w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Validation Errors */}
            {!validation.valid && (
              <div className="xibalba-panel-professional bg-[var(--vectorforge-accent)]/10 border border-[var(--vectorforge-accent)]/20">
                <div className="xibalba-label-professional text-[var(--vectorforge-accent)] mb-2">Configuration Errors</div>
                {validation.errors.map((error, idx) => (
                  <div key={idx} className="text-sm text-[var(--vectorforge-accent)]">{error}</div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={!validation.valid || isSaving}
                className="xibalba-button-professional flex-1"
              >
                {isSaving ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] mr-2 animate-spin">sync</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px] mr-2">save</span>
                    Save Configuration
                  </>
                )}
              </button>
              
              <button
                onClick={handleReset}
                className="xibalba-button-professional"
                title="Reset to defaults"
              >
                <span className="material-symbols-outlined text-[16px]">restore</span>
              </button>
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MCPSettings;

