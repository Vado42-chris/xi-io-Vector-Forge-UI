/**
 * #hashtag: local-ai-service
 * #purpose: Local GGUF model integration for VectorForge MCP script editor
 * #provides: Connection to local GGUF models via Ollama, llama-cpp-python, or custom inference
 * #usage: Used by mcpScriptService to power AI features with local models
 * #related: mcpScriptService, mcpConfig, xibalbaService
 * 
 * Local AI Service - GGUF Model Integration
 * Supports: Ollama, llama-cpp-python, text-generation-webui, custom inference servers
 * Follows Xibalba standards: TypeScript strict, error handling, local-first
 */

import { loadMCPConfig } from '../config/mcpConfig';

export interface LocalAIConfig {
  provider: 'ollama' | 'llama-cpp' | 'text-generation-webui' | 'custom';
  serverUrl: string;
  modelName: string;
  ggufPath?: string; // Path to GGUF file (for custom setups)
  contextSize?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
}

export interface LocalAIResponse {
  content: string;
  model: string;
  done: boolean;
  error?: string;
}

/**
 * Detect which local AI provider is available
 */
export async function detectLocalAIProvider(): Promise<LocalAIConfig['provider'] | null> {
  const providers = [
    { name: 'ollama', url: 'http://localhost:11434' },
    { name: 'llama-cpp', url: 'http://localhost:8080' },
    { name: 'text-generation-webui', url: 'http://localhost:7860' }
  ];

  for (const provider of providers) {
    try {
      const response = await fetch(`${provider.url}/api/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(2000)
      });
      if (response.ok) {
        return provider.name as LocalAIConfig['provider'];
      }
    } catch (e) {
      // Provider not available, try next
      continue;
    }
  }

  return null;
}

/**
 * Get available models from local AI provider
 */
export async function getAvailableModels(provider: LocalAIConfig['provider'], serverUrl: string): Promise<string[]> {
  try {
    switch (provider) {
      case 'ollama':
        const ollamaResponse = await fetch(`${serverUrl}/api/tags`);
        if (ollamaResponse.ok) {
          const data = await ollamaResponse.json();
          return data.models?.map((m: any) => m.name) || [];
        }
        break;

      case 'llama-cpp':
        const llamaResponse = await fetch(`${serverUrl}/v1/models`);
        if (llamaResponse.ok) {
          const data = await llamaResponse.json();
          return data.data?.map((m: any) => m.id) || [];
        }
        break;

      case 'text-generation-webui':
        const webuiResponse = await fetch(`${serverUrl}/api/v1/models`);
        if (webuiResponse.ok) {
          const data = await webuiResponse.json();
          return data || [];
        }
        break;
    }
  } catch (error) {
    console.error(`Error fetching models from ${provider}:`, error);
  }

  return [];
}

/**
 * Call local AI model for script completion
 */
export async function callLocalAI(
  prompt: string,
  systemPrompt: string,
  config: LocalAIConfig
): Promise<LocalAIResponse> {
  const { provider, serverUrl, modelName, temperature = 0.7, topP = 0.9, topK = 40 } = config;

  try {
    switch (provider) {
      case 'ollama':
        return await callOllama(serverUrl, modelName, prompt, systemPrompt, temperature, topP, topK);

      case 'llama-cpp':
        return await callLlamaCpp(serverUrl, modelName, prompt, systemPrompt, temperature, topP, topK);

      case 'text-generation-webui':
        return await callTextGenWebUI(serverUrl, modelName, prompt, systemPrompt, temperature, topP, topK);

      case 'custom':
        return await callCustomInference(serverUrl, modelName, prompt, systemPrompt, config);

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error('Local AI call failed:', error);
    throw error;
  }
}

/**
 * Call Ollama API
 */
async function callOllama(
  serverUrl: string,
  modelName: string,
  prompt: string,
  systemPrompt: string,
  temperature: number,
  topP: number,
  topK: number
): Promise<LocalAIResponse> {
  const response = await fetch(`${serverUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelName,
      prompt: `${systemPrompt}\n\n${prompt}`,
      stream: false,
      options: {
        temperature,
        top_p: topP,
        top_k: topK
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.response || '',
    model: modelName,
    done: true
  };
}

/**
 * Call llama-cpp-python API (OpenAI-compatible)
 */
async function callLlamaCpp(
  serverUrl: string,
  modelName: string,
  prompt: string,
  systemPrompt: string,
  temperature: number,
  topP: number,
  topK: number
): Promise<LocalAIResponse> {
  const response = await fetch(`${serverUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature,
      top_p: topP,
      top_k: topK,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`llama-cpp request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.choices?.[0]?.message?.content || '',
    model: modelName,
    done: true
  };
}

/**
 * Call text-generation-webui API
 */
async function callTextGenWebUI(
  serverUrl: string,
  modelName: string,
  prompt: string,
  systemPrompt: string,
  temperature: number,
  topP: number,
  topK: number
): Promise<LocalAIResponse> {
  const response = await fetch(`${serverUrl}/api/v1/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: `${systemPrompt}\n\n${prompt}`,
      max_new_tokens: 512,
      temperature,
      top_p: topP,
      top_k: topK,
      do_sample: true
    })
  });

  if (!response.ok) {
    throw new Error(`text-generation-webui request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.results?.[0]?.text || '',
    model: modelName,
    done: true
  };
}

/**
 * Call custom inference server
 * Supports custom endpoints that follow OpenAI-compatible or simple POST format
 */
async function callCustomInference(
  serverUrl: string,
  modelName: string,
  prompt: string,
  systemPrompt: string,
  config: LocalAIConfig
): Promise<LocalAIResponse> {
  // Try OpenAI-compatible format first
  try {
    const response = await fetch(`${serverUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: config.temperature || 0.7
      })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        content: data.choices?.[0]?.message?.content || '',
        model: modelName,
        done: true
      };
    }
  } catch (e) {
    // Try simple POST format
  }

  // Fallback to simple POST format
  const response = await fetch(serverUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelName,
      prompt: `${systemPrompt}\n\n${prompt}`,
      temperature: config.temperature || 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`Custom inference request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.response || data.content || data.text || '',
    model: modelName,
    done: true
  };
}

/**
 * Test connection to local AI provider
 */
export async function testLocalAIConnection(config: LocalAIConfig): Promise<{ success: boolean; message: string; models?: string[] }> {
  try {
    // Test basic connection
    const testResponse = await callLocalAI(
      'Test',
      'You are a helpful assistant.',
      config
    );

    // Get available models
    const models = await getAvailableModels(config.provider, config.serverUrl);

    return {
      success: true,
      message: `Connected to ${config.provider} at ${config.serverUrl}`,
      models
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Connection failed'
    };
  }
}

