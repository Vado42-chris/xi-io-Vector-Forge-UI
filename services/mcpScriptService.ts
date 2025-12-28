/**
 * #hashtag: mcp-script-service
 * #purpose: MCP protocol integration for VectorForge script editor
 * #provides: AI-powered code completion, syntax validation, command suggestions, documentation lookup
 * #usage: Import and use in ScriptEditor component for enhanced editing experience
 * #related: scriptParser, scriptExecutor, xibalbaService, mcpConfig
 * 
 * MCP (Model Context Protocol) integration for hashtag command scripting
 * Provides AI-powered assistance for script editing
 * Follows Xibalba standards: TypeScript strict, error handling, local-first
 */

import { ScriptCommand, parseScript } from './scriptParser';
import { loadMCPConfig, MCPConfig } from '../config/mcpConfig';
import { callLocalAI, LocalAIConfig, detectLocalAIProvider, getAvailableModels, testLocalAIConnection } from './localAIService';

export interface MCPCompletion {
  text: string;
  displayText: string;
  description?: string;
  category: string;
  insertText?: string;
}

export interface MCPSuggestion {
  command: string;
  syntax: string;
  description: string;
  example: string;
  category: string;
}

export interface MCPValidation {
  line: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
}

export interface MCPDocumentation {
  command: string;
  syntax: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: string;
  }>;
  examples: string[];
  related: string[];
}

/**
 * Get AI-powered code completions for current cursor position
 * Uses MCP to analyze context and suggest relevant commands
 */
export async function getMCPCompletions(
  script: string,
  cursorLine: number,
  cursorColumn: number,
  context: {
    frame: number;
    layerId: string | null;
    layers: Array<{ id: string; name: string }>;
  }
): Promise<MCPCompletion[]> {
  const config = loadMCPConfig();
  
  if (!config.enabled || !config.features.completion) {
    return [];
  }
  
  try {
    // Use local AI if enabled
    if (config.useLocalAI && config.localAIModelName) {
      return await getLocalAICompletions(script, cursorLine, cursorColumn, context, config);
    }
    
    // Fallback to MCP server
    // TODO: Connect to actual MCP server
    // const response = await fetch(`${config.serverUrl}/completions`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ script, cursorLine, cursorColumn, context })
    // });
    // return await response.json();
    // Get current line and context
    const lines = script.split('\n');
    const currentLine = lines[cursorLine] || '';
    const beforeCursor = currentLine.substring(0, cursorColumn);
    
    // If typing after #, suggest commands
    if (beforeCursor.includes('#') && !beforeCursor.match(/#\w+$/)) {
      const searchTerm = beforeCursor.split('#').pop()?.toLowerCase() || '';
      
      // Use MCP to get intelligent suggestions based on context
      const suggestions = await getMCPCommandSuggestions(searchTerm, context);
      
      return suggestions.map(s => ({
        text: s.command,
        displayText: `#${s.command}`,
        description: s.description,
        category: s.category,
        insertText: s.syntax
      }));
    }
    
    // If typing parameters, suggest parameter names
    if (beforeCursor.match(/#\w+\s+\w+$/)) {
      const parts = beforeCursor.trim().split(/\s+/);
      const command = parts[0].replace('#', '');
      
      return getParameterCompletions(command);
    }
    
    return [];
  } catch (error) {
    console.error('MCP completion error:', error);
    return [];
  }
}

/**
 * Get intelligent command suggestions using MCP
 * Analyzes context to suggest most relevant commands
 */
async function getMCPCommandSuggestions(
  searchTerm: string,
  context: {
    frame: number;
    layerId: string | null;
    layers: Array<{ id: string; name: string }>;
  }
): Promise<MCPSuggestion[]> {
  // TODO: Connect to actual MCP server for AI-powered suggestions
  // For now, return filtered command list with context awareness
  
  const allCommands = [
    // Animation commands
    { command: 'move', category: 'Animation', syntax: '#move [target] x:[n] y:[n]', description: 'Move object to position', example: '#move layer1 x:100 y:50' },
    { command: 'rotate', category: 'Animation', syntax: '#rotate [target] angle:[deg]', description: 'Rotate object', example: '#rotate layer1 angle:45' },
    { command: 'scale', category: 'Animation', syntax: '#scale [target] x:[n] y:[n]', description: 'Scale object', example: '#scale layer1 x:2 y:2' },
    { command: 'fade', category: 'Animation', syntax: '#fade [target] opacity:[0-1]', description: 'Fade object opacity', example: '#fade layer1 opacity:0.5' },
    { command: 'show', category: 'Animation', syntax: '#show [target]', description: 'Show object', example: '#show layer1' },
    { command: 'hide', category: 'Animation', syntax: '#hide [target]', description: 'Hide object', example: '#hide layer1' },
    
    // Interaction commands
    { command: 'onclick', category: 'Interaction', syntax: '#onclick [target] action:[cmd]', description: 'Register click handler', example: '#onclick button1 action:#fade layer1 opacity:0' },
    { command: 'onhover', category: 'Interaction', syntax: '#onhover [target] action:[cmd]', description: 'Register hover handler', example: '#onhover button1 action:#scale layer1 x:1.1' },
    { command: 'onkey', category: 'Interaction', syntax: '#onkey [key] action:[cmd]', description: 'Register key handler', example: '#onkey ArrowRight action:#move layer1 x:10' },
    
    // Logic commands
    { command: 'if', category: 'Logic', syntax: '#if [condition] then:[cmd] else:[cmd]', description: 'Conditional execution', example: '#if score > 10 then:#show win' },
    { command: 'wait', category: 'Logic', syntax: '#wait duration:[frames]', description: 'Wait for frames', example: '#wait duration:30' },
    { command: 'goto', category: 'Logic', syntax: '#goto frame:[n]', description: 'Jump to frame', example: '#goto frame:60' },
    { command: 'set', category: 'Logic', syntax: '#set variable:[name] value:[val]', description: 'Set variable', example: '#set variable:score value:0' },
  ];
  
  // Filter by search term
  const filtered = searchTerm
    ? allCommands.filter(c => c.command.toLowerCase().startsWith(searchTerm.toLowerCase()))
    : allCommands;
  
  // Context-aware ranking (prioritize based on current context)
  const ranked = filtered.map(cmd => {
    let score = 0;
    
    // If layer is selected, prioritize layer commands
    if (context.layerId && (cmd.command === 'move' || cmd.command === 'rotate' || cmd.command === 'scale')) {
      score += 10;
    }
    
    // Prioritize animation commands in animation context
    if (cmd.category === 'Animation') {
      score += 5;
    }
    
    return { ...cmd, score };
  }).sort((a, b) => b.score - a.score);
  
  return ranked.slice(0, 10); // Return top 10 suggestions
}

/**
 * Get completions using local AI (GGUF models)
 */
async function getLocalAICompletions(
  script: string,
  cursorLine: number,
  cursorColumn: number,
  context: {
    frame: number;
    layerId: string | null;
    layers: Array<{ id: string; name: string }>;
  },
  config: MCPConfig
): Promise<MCPCompletion[]> {
  const localAIConfig: LocalAIConfig = {
    provider: config.localAIProvider,
    serverUrl: config.localAIServerUrl,
    modelName: config.localAIModelName,
    ggufPath: config.ggufPath,
    temperature: 0.3, // Lower temperature for code completion
    topP: 0.9,
    topK: 40
  };

  const systemPrompt = `You are a VectorForge script assistant. Help users write hashtag commands for timeline scripting.
Commands use syntax: #command [target] [param:value]
Available command categories: Animation, Interaction, Logic, Media, Network.
Be concise and suggest the most relevant commands based on context.`;

  const userPrompt = `User is editing a script at line ${cursorLine + 1}, column ${cursorColumn + 1}.
Current script:
${script}

Context:
- Frame: ${context.frame}
- Selected Layer: ${context.layerId || 'none'}
- Available Layers: ${context.layers.map(l => l.name).join(', ')}

Current line: "${script.split('\n')[cursorLine] || ''}"
User is typing after: "${script.split('\n')[cursorLine]?.substring(0, cursorColumn) || ''}"

Suggest the next command or parameter. Return only a JSON array of suggestions with format:
[{"command": "command_name", "syntax": "#command [target] param:value", "description": "brief description", "category": "Animation|Interaction|Logic"}]
Limit to 5 most relevant suggestions.`;

  try {
    const response = await callLocalAI(userPrompt, systemPrompt, localAIConfig);
    
    // Parse AI response
    let suggestions: MCPSuggestion[] = [];
    try {
      const parsed = JSON.parse(response.content);
      if (Array.isArray(parsed)) {
        suggestions = parsed;
      }
    } catch (e) {
      // If not JSON, try to extract suggestions from text
      const lines = response.content.split('\n');
      for (const line of lines) {
        if (line.includes('#')) {
          const match = line.match(/#(\w+)/);
          if (match) {
            suggestions.push({
              command: match[1],
              syntax: line.trim(),
              description: 'AI suggested command',
              category: 'Animation',
              example: line.trim()
            });
          }
        }
      }
    }

    return suggestions.map(s => ({
      text: s.command,
      displayText: `#${s.command}`,
      description: s.description,
      category: s.category,
      insertText: s.syntax
    }));
  } catch (error) {
    console.error('Local AI completion error:', error);
    return [];
  }
}

/**
 * Get parameter completions for a command
 */
function getParameterCompletions(command: string): MCPCompletion[] {
  const paramMap: Record<string, MCPCompletion[]> = {
    move: [
      { text: 'x', displayText: 'x:', category: 'Parameter', insertText: 'x:' },
      { text: 'y', displayText: 'y:', category: 'Parameter', insertText: 'y:' },
      { text: 'duration', displayText: 'duration:', category: 'Parameter', insertText: 'duration:' }
    ],
    rotate: [
      { text: 'angle', displayText: 'angle:', category: 'Parameter', insertText: 'angle:' },
      { text: 'duration', displayText: 'duration:', category: 'Parameter', insertText: 'duration:' }
    ],
    fade: [
      { text: 'opacity', displayText: 'opacity:', category: 'Parameter', insertText: 'opacity:' },
      { text: 'duration', displayText: 'duration:', category: 'Parameter', insertText: 'duration:' }
    ],
    onclick: [
      { text: 'action', displayText: 'action:', category: 'Parameter', insertText: 'action:' }
    ],
    if: [
      { text: 'condition', displayText: 'condition:', category: 'Parameter', insertText: 'condition:' },
      { text: 'then', displayText: 'then:', category: 'Parameter', insertText: 'then:' },
      { text: 'else', displayText: 'else:', category: 'Parameter', insertText: 'else:' }
    ]
  };
  
  return paramMap[command] || [];
}

/**
 * Validate script using MCP
 * Provides intelligent error detection and suggestions
 */
export async function validateWithMCP(script: string): Promise<MCPValidation[]> {
  const config = loadMCPConfig();
  const parsed = parseScript(script);
  const validations: MCPValidation[] = [];
  
  // Basic validation from parser
  parsed.errors.forEach(error => {
    validations.push({
      line: error.line,
      severity: 'error',
      message: error.message,
      suggestion: getSuggestionForError(error.message)
    });
  });
  
  // Local AI-powered additional validations
  if (config.enabled && config.features.validation && config.useLocalAI && config.localAIModelName) {
    try {
      const aiValidations = await getLocalAIValidations(script, config);
      validations.push(...aiValidations);
    } catch (error) {
      console.error('Local AI validation error:', error);
    }
  }
  
  // MCP server validations (if not using local AI)
  if (config.enabled && config.features.validation && !config.useLocalAI) {
    // TODO: Connect to MCP server for advanced validation
    // const response = await fetch(`${config.serverUrl}/validate`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ script })
    // });
    // const mcpValidations = await response.json();
    // validations.push(...mcpValidations);
  }
  
  return validations;
}

/**
 * Get validations using local AI
 */
async function getLocalAIValidations(script: string, config: MCPConfig): Promise<MCPValidation[]> {
  const localAIConfig: LocalAIConfig = {
    provider: config.localAIProvider,
    serverUrl: config.localAIServerUrl,
    modelName: config.localAIModelName,
    ggufPath: config.ggufPath,
    temperature: 0.2, // Low temperature for validation
    topP: 0.9,
    topK: 40
  };

  const systemPrompt = `You are a VectorForge script validator. Analyze scripts for errors, potential issues, and improvements.
Return JSON array of validations with format:
[{"line": 1, "severity": "error|warning|info", "message": "description", "suggestion": "optional fix"}]
Be thorough but concise.`;

  const userPrompt = `Validate this VectorForge script:
${script}

Check for:
- Syntax errors
- Missing parameters
- Invalid command usage
- Potential bugs
- Best practice violations`;

  try {
    const response = await callLocalAI(userPrompt, systemPrompt, localAIConfig);
    
    let validations: MCPValidation[] = [];
    try {
      const parsed = JSON.parse(response.content);
      if (Array.isArray(parsed)) {
        validations = parsed;
      }
    } catch (e) {
      // If not JSON, parse text response
      console.warn('AI validation response not in JSON format');
    }

    return validations;
  } catch (error) {
    console.error('Local AI validation error:', error);
    return [];
  }
}

/**
 * Get suggestion for common errors
 */
function getSuggestionForError(error: string): string | undefined {
  if (error.includes('requires a target')) {
    return 'Add a layer ID or name as the target, e.g., layer1';
  }
  if (error.includes('requires x or y parameter')) {
    return 'Add x:100 or y:50 parameter';
  }
  if (error.includes('requires angle parameter')) {
    return 'Add angle:45 parameter';
  }
  return undefined;
}

/**
 * Get command documentation using MCP
 * Fetches detailed documentation for a command
 */
export async function getMCPDocumentation(command: string): Promise<MCPDocumentation | null> {
  const config = loadMCPConfig();
  
  if (!config.enabled || !config.features.documentation) {
    return null;
  }
  
  // TODO: Connect to MCP server for comprehensive documentation
  // const response = await fetch(`${config.serverUrl}/documentation/${command}`);
  // return await response.json();
  
  // For now, return basic documentation
  
  const docs: Record<string, MCPDocumentation> = {
    move: {
      command: 'move',
      syntax: '#move [target] x:[number] y:[number] duration:[frames]',
      description: 'Moves a layer or object to a new position over a specified duration.',
      parameters: [
        { name: 'target', type: 'string', required: true, description: 'Layer ID or name', example: 'layer1' },
        { name: 'x', type: 'number', required: false, description: 'X coordinate', example: '100' },
        { name: 'y', type: 'number', required: false, description: 'Y coordinate', example: '50' },
        { name: 'duration', type: 'number', required: false, description: 'Duration in frames', example: '30' }
      ],
      examples: [
        '#move layer1 x:100 y:50',
        '#move button1 x:200 y:100 duration:30'
      ],
      related: ['slide', 'bounce', 'shake']
    },
    rotate: {
      command: 'rotate',
      syntax: '#rotate [target] angle:[degrees] duration:[frames]',
      description: 'Rotates a layer or object by a specified angle.',
      parameters: [
        { name: 'target', type: 'string', required: true, description: 'Layer ID or name', example: 'layer1' },
        { name: 'angle', type: 'number', required: true, description: 'Rotation angle in degrees', example: '45' },
        { name: 'duration', type: 'number', required: false, description: 'Duration in frames', example: '30' }
      ],
      examples: [
        '#rotate layer1 angle:45',
        '#rotate button1 angle:90 duration:15'
      ],
      related: ['scale', 'flip', 'skew']
    }
  };
  
  return docs[command] || null;
}

/**
 * Get intelligent code suggestions based on context
 * Uses MCP to analyze script and suggest improvements
 */
export async function getMCPCodeSuggestions(
  script: string,
  context: {
    frame: number;
    layerId: string | null;
    layers: Array<{ id: string; name: string }>;
  }
): Promise<Array<{ line: number; suggestion: string; reason: string }>> {
  // TODO: Connect to MCP server for AI-powered suggestions
  // - Suggest optimizations
  // - Suggest better patterns
  // - Suggest missing commands
  
  const suggestions: Array<{ line: number; suggestion: string; reason: string }> = [];
  
  // Example: Suggest adding duration to move commands
  const lines = script.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('#move') && !line.includes('duration:')) {
      suggestions.push({
        line: index + 1,
        suggestion: 'Add duration parameter for smooth animation',
        reason: 'Move commands without duration execute instantly'
      });
    }
  });
  
  return suggestions;
}

