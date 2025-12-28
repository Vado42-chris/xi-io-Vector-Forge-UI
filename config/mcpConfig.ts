/**
 * #hashtag: mcp-config
 * #purpose: MCP protocol configuration for VectorForge script editor
 * #provides: MCP server connection settings, default values, configuration management
 * #usage: Import and use in MCP services and settings components
 * #related: mcpScriptService, xibalbaService, ScriptEditor
 * 
 * MCP Configuration
 * Follows Xibalba standards: TypeScript strict, environment-based config, local-first
 */

export interface MCPConfig {
  enabled: boolean;
  serverUrl: string;
  apiKey: string;
  model: string;
  timeout: number;
  retryAttempts: number;
  // Local AI configuration
  useLocalAI: boolean;
  localAIProvider: 'ollama' | 'llama-cpp' | 'text-generation-webui' | 'custom';
  localAIServerUrl: string;
  localAIModelName: string;
  ggufPath?: string; // Path to GGUF file
  features: {
    completion: boolean;
    validation: boolean;
    documentation: boolean;
    suggestions: boolean;
  };
}

/**
 * Default MCP configuration
 * Uses Xibalba defaults: local-first, offline-capable
 */
export const DEFAULT_MCP_CONFIG: MCPConfig = {
  enabled: true,
  serverUrl: import.meta.env.VITE_XIBALBA_MCP_URL || 'http://localhost:8000',
  apiKey: import.meta.env.VITE_XIBALBA_API_KEY || '',
  model: import.meta.env.VITE_XIBALBA_MODEL || 'xibalba-local',
  timeout: 5000, // 5 seconds
  retryAttempts: 3,
  // Local AI defaults - prioritize local GGUF models
  useLocalAI: true,
  localAIProvider: 'ollama', // Default to Ollama (most common for GGUF)
  localAIServerUrl: import.meta.env.VITE_LOCAL_AI_URL || 'http://localhost:11434',
  localAIModelName: import.meta.env.VITE_LOCAL_AI_MODEL || '',
  ggufPath: import.meta.env.VITE_GGUF_PATH || '',
  features: {
    completion: true,
    validation: true,
    documentation: true,
    suggestions: true
  }
};

/**
 * Load MCP configuration from localStorage or environment
 * Follows Xibalba pattern: local config overrides environment
 */
export function loadMCPConfig(): MCPConfig {
  try {
    const saved = localStorage.getItem('vectorforge_mcp_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_MCP_CONFIG, ...parsed };
    }
  } catch (error) {
    console.warn('Could not load MCP config from localStorage:', error);
  }
  
  return DEFAULT_MCP_CONFIG;
}

/**
 * Save MCP configuration to localStorage
 */
export function saveMCPConfig(config: Partial<MCPConfig>): void {
  try {
    const current = loadMCPConfig();
    const updated = { ...current, ...config };
    localStorage.setItem('vectorforge_mcp_config', JSON.stringify(updated));
  } catch (error) {
    console.error('Could not save MCP config:', error);
  }
}

/**
 * Reset MCP configuration to defaults
 */
export function resetMCPConfig(): MCPConfig {
  const defaultConfig = DEFAULT_MCP_CONFIG;
  saveMCPConfig(defaultConfig);
  return defaultConfig;
}

/**
 * Validate MCP configuration
 */
export function validateMCPConfig(config: MCPConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.enabled) {
    if (!config.serverUrl || !config.serverUrl.startsWith('http')) {
      errors.push('Server URL must be a valid HTTP/HTTPS URL');
    }
    
    if (config.timeout < 1000 || config.timeout > 30000) {
      errors.push('Timeout must be between 1000ms and 30000ms');
    }
    
    if (config.retryAttempts < 0 || config.retryAttempts > 10) {
      errors.push('Retry attempts must be between 0 and 10');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

