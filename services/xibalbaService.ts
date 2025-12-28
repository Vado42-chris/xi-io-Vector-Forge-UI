/**
 * Xibalba AI Service - Local MCP Integration
 * Connects to local Xibalba AI infrastructure via MCP protocol
 * for fully offline, local AI processing
 */

export interface GeneratedVector {
  svg: string;
  layers: {
    id: string;
    name: string;
    color: string;
  }[];
}

export interface SmartSuggestion {
  action: string;
  description: string;
  type: 'style' | 'geometry' | 'cleanup';
}

interface XibalbaConfig {
  mcpServerUrl?: string;
  apiKey?: string;
  model?: string;
  endpoint?: string;
}

/**
 * Gets Xibalba configuration from environment or local config
 */
const getXibalbaConfig = (): XibalbaConfig => {
  // Check for environment variables first
  const config: XibalbaConfig = {
    mcpServerUrl: import.meta.env.VITE_XIBALBA_MCP_URL || 'http://localhost:8000',
    apiKey: import.meta.env.VITE_XIBALBA_API_KEY || '',
    model: import.meta.env.VITE_XIBALBA_MODEL || 'xibalba-local',
    endpoint: import.meta.env.VITE_XIBALBA_ENDPOINT || '/api/v1/chat/completions'
  };

  // Try to load from local config file if available
  try {
    const localConfig = localStorage.getItem('xibalba_config');
    if (localConfig) {
      const parsed = JSON.parse(localConfig);
      return { ...config, ...parsed };
    }
  } catch (e) {
    console.warn('Could not load local Xibalba config:', e);
  }

  return config;
};

/**
 * Calls Xibalba AI via MCP or direct HTTP
 */
const callXibalbaAI = async (prompt: string, systemPrompt: string, responseSchema?: any): Promise<any> => {
  const config = getXibalbaConfig();
  
  // Try MCP connection first
  if (config.mcpServerUrl && window.mcpClient) {
    try {
      const response = await window.mcpClient.call({
        method: 'ai/generate',
        params: {
          model: config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          response_format: responseSchema ? { type: 'json_schema', schema: responseSchema } : undefined
        }
      });
      return response;
    } catch (e) {
      console.warn('MCP call failed, falling back to HTTP:', e);
    }
  }

  // Fallback to HTTP API
  const apiUrl = `${config.mcpServerUrl}${config.endpoint}`;
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': config.apiKey ? `Bearer ${config.apiKey}` : '',
      'X-Xibalba-Model': config.model || 'xibalba-local'
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      response_format: responseSchema ? { type: 'json_schema', schema: responseSchema } : undefined,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`Xibalba AI request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || data.content || data;
};

/**
 * Generates or refines an SVG based on a text prompt using Xibalba AI
 */
export const generateVectorData = async (
  prompt: string, 
  style: string, 
  currentSvg?: string
): Promise<GeneratedVector | null> => {
  try {
    const systemPrompt = `You are a professional SVG design engine integrated with Xibalba OS.
    ${currentSvg ? 'Refine and modify the provided SVG based on the user request. Maintain existing IDs where possible.' : 'Create a brand new high-quality SVG illustration.'}
    Style: ${style}.
    Technical: ViewBox "0 0 512 512", optimized paths, semantic grouping.
    Return valid JSON with 'svg' (string) and 'layers' (array of {id, name, color}) properties.`;

    const userPrompt = currentSvg 
      ? `Original SVG: ${currentSvg}\n\nModification Request: ${prompt}`
      : `Create an illustration of: ${prompt}`;

    const responseSchema = {
      type: 'object',
      properties: {
        svg: { type: 'string' },
        layers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              color: { type: 'string' }
            },
            required: ['id', 'name', 'color']
          }
        }
      },
      required: ['svg', 'layers']
    };

    const response = await callXibalbaAI(userPrompt, systemPrompt, responseSchema);
    
    // Parse response - handle both JSON string and object
    let parsed: GeneratedVector;
    if (typeof response === 'string') {
      parsed = JSON.parse(response);
    } else if (response.content) {
      parsed = typeof response.content === 'string' ? JSON.parse(response.content) : response.content;
    } else {
      parsed = response;
    }

    return parsed;
  } catch (error) {
    console.error("Xibalba Vector Generation Error:", error);
    return null;
  }
};

/**
 * Analyzes a specific selection and suggests AI-driven improvements
 */
export const getSmartSuggestions = async (
  svg: string, 
  selectedId: string
): Promise<SmartSuggestion[]> => {
  try {
    const systemPrompt = `You are an SVG optimization assistant. Analyze SVG elements and suggest creative improvements.`;
    const userPrompt = `Analyze element with ID "${selectedId}" in this SVG: ${svg}. Suggest 3 specific creative improvements.`;

    const responseSchema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          action: { type: 'string', description: 'Short imperative command' },
          description: { type: 'string' },
          type: { type: 'string', enum: ['style', 'geometry', 'cleanup'] }
        },
        required: ['action', 'description', 'type']
      }
    };

    const response = await callXibalbaAI(userPrompt, systemPrompt, responseSchema);
    
    let parsed: SmartSuggestion[];
    if (typeof response === 'string') {
      parsed = JSON.parse(response);
    } else if (response.content) {
      parsed = typeof response.content === 'string' ? JSON.parse(response.content) : response.content;
    } else {
      parsed = Array.isArray(response) ? response : [];
    }

    return parsed;
  } catch (e) {
    console.error('Xibalba suggestions error:', e);
    return [];
  }
};

/**
 * Converts an image base64 into vector data using Xibalba vision capabilities
 */
export const imageToVectorData = async (
  imageB64: string, 
  prompt: string
): Promise<GeneratedVector | null> => {
  try {
    const systemPrompt = `You are an SVG reconstruction engine. Convert images to professional SVG vector graphics.`;
    const userPrompt = `Reconstruct this image as a professional SVG. ${prompt}\n\nImage data: ${imageB64.substring(0, 100)}...`;

    const responseSchema = {
      type: 'object',
      properties: {
        svg: { type: 'string' },
        layers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              color: { type: 'string' }
            },
            required: ['id', 'name', 'color']
          }
        }
      },
      required: ['svg', 'layers']
    };

    const response = await callXibalbaAI(userPrompt, systemPrompt, responseSchema);
    
    let parsed: GeneratedVector;
    if (typeof response === 'string') {
      parsed = JSON.parse(response);
    } else if (response.content) {
      parsed = typeof response.content === 'string' ? JSON.parse(response.content) : response.content;
    } else {
      parsed = response;
    }

    return parsed;
  } catch (error) {
    console.error('Xibalba image-to-vector error:', error);
    return null;
  }
};

// Extend Window interface for MCP client
declare global {
  interface Window {
    mcpClient?: {
      call: (params: any) => Promise<any>;
    };
  }
}

