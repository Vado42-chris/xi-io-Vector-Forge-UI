/**
 * AI Code Editor Service
 * Uses local Ollama or remote AI to generate code edits
 * 
 * Follows the biological pattern: AI "grows" new code like nature grows new structures
 * 
 * #hashtag: ai-code-editor code-generation ollama
 */

import { loadMCPConfig } from '../config/mcpConfig';

export interface CodeEditRequest {
  filePath: string;
  currentCode: string;
  userRequest: string;
  context?: string; // Additional context about the file/project
}

export class AICodeEditor {
  /**
   * Generate code edit using AI
   * Like nature growing a new structure based on instructions
   */
  async generateCodeEdit(request: CodeEditRequest): Promise<string> {
    const { filePath, currentCode, userRequest, context } = request;

    // Build prompt that mirrors natural growth patterns
    const prompt = this.buildPrompt(filePath, currentCode, userRequest, context);

    try {
      // Load MCP config
      const mcpConfig = loadMCPConfig();
      
      // Try local Ollama first (like using local resources)
      if (mcpConfig.useLocalAI && mcpConfig.localAIProvider === 'ollama') {
        try {
          return await this.callOllama(prompt, mcpConfig);
        } catch (ollamaError) {
          // If Ollama fails, provide helpful error
          const errorMsg = ollamaError instanceof Error ? ollamaError.message : 'Unknown error';
          if (errorMsg.includes('fetch') || errorMsg.includes('connect')) {
            throw new Error(`Cannot connect to Ollama at ${mcpConfig.localAIServerUrl}. Is it running? Try: ollama serve`);
          }
          throw ollamaError;
        }
      }

      // Fallback: Return error message
      throw new Error('AI not configured. Please set up Ollama (ollama serve) or configure API key.');
    } catch (error) {
      throw new Error(`Failed to generate code edit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build prompt that guides AI to generate code
   * Like giving nature the blueprint for growth
   */
  private buildPrompt(
    filePath: string,
    currentCode: string,
    userRequest: string,
    context?: string
  ): string {
    const fileExtension = filePath.split('.').pop() || '';
    const isReact = filePath.endsWith('.tsx') || filePath.endsWith('.jsx');
    const isTypeScript = filePath.endsWith('.ts') || filePath.endsWith('.tsx');

    return `You are an expert TypeScript/React code editor. You understand code like nature understands growth patterns.

TASK: Modify this file based on the user's request.

FILE: ${filePath}
FILE TYPE: ${isReact ? 'React Component' : isTypeScript ? 'TypeScript' : 'JavaScript'}

CURRENT CODE:
\`\`\`${fileExtension}
${currentCode}
\`\`\`

${context ? `CONTEXT:\n${context}\n` : ''}

USER REQUEST:
${userRequest}

REQUIREMENTS:
1. Generate the COMPLETE updated file with all changes applied
2. Maintain valid ${isTypeScript ? 'TypeScript' : 'JavaScript'} syntax
3. ${isReact ? 'Maintain valid React/JSX syntax' : ''}
4. Keep all existing imports unless explicitly asked to change them
5. Preserve existing functionality unless explicitly asked to change it
6. Follow the existing code style and patterns
7. Ensure all braces, parentheses, and brackets are balanced
8. Ensure all strings are properly closed
9. Export the component/function if it was exported before

OUTPUT FORMAT:
Return ONLY the complete file code. Do not include explanations, markdown, or code fences.
Start directly with the first line of code (usually imports or comments).

BEGIN CODE:`;
  }

  /**
   * Call Ollama local AI
   * Like consulting local knowledge before acting
   */
  private async callOllama(prompt: string, mcpConfig: ReturnType<typeof loadMCPConfig>): Promise<string> {
    const serverUrl = mcpConfig.localAIServerUrl || 'http://localhost:11434';
    const model = mcpConfig.localAIModelName || 'codellama:latest';

    // Debug: Log Ollama API call
    console.log('[DEBUG] Ollama API call:', { serverUrl, model, promptLength: prompt.length });

    try {
      const response = await fetch(`${serverUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          options: {
            temperature: 0.3, // Lower temperature for more consistent code
            top_p: 0.9,
            num_predict: 4000, // Allow longer responses for code files
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Debug: Log Ollama response
      console.log('[DEBUG] Ollama response received:', { 
        hasResponse: !!data.response, 
        responseLength: data.response?.length || 0 
      });
      
      if (!data.response) {
        throw new Error('Ollama returned empty response');
      }

      // Clean up the response - remove any markdown code fences if present
      let code = data.response.trim();
      
      // Remove markdown code fences if present
      if (code.startsWith('```')) {
        const lines = code.split('\n');
        // Remove first line (```language)
        lines.shift();
        // Remove last line (```)
        if (lines[lines.length - 1].trim() === '```') {
          lines.pop();
        }
        code = lines.join('\n');
      }

      return code.trim();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to Ollama. Is it running? Start with: ollama serve');
      }
      throw error;
    }
  }

  /**
   * Validate that generated code looks reasonable
   * Like nature checking if a new structure is viable
   */
  validateGeneratedCode(code: string, originalCode: string): {
    valid: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];

    // Check if code is suspiciously short (might be incomplete)
    if (code.length < originalCode.length * 0.1) {
      warnings.push('Generated code is much shorter than original - may be incomplete');
    }

    // Check if code is suspiciously long (might have duplicated)
    if (code.length > originalCode.length * 3) {
      warnings.push('Generated code is much longer than original - may have duplicated content');
    }

    // Basic syntax checks
    const braceBalance = (code.match(/{/g) || []).length === (code.match(/}/g) || []).length;
    if (!braceBalance) {
      warnings.push('Unbalanced braces detected');
    }

    return {
      valid: warnings.length === 0,
      warnings
    };
  }
}

