/**
 * #hashtag: natural-language-translator
 * #purpose: Translate natural language to hashtag commands for VectorForge
 * #provides: AI-powered translation from plain English to hashtag syntax
 * #usage: Import and use in AI chatbot to convert user requests to executable hashtag commands
 * #related: scriptParser, scriptExecutor, mcpScriptService, localAIService
 * 
 * Natural Language → Hashtag Command Translator
 * Makes VectorForge accessible through plain English conversation
 * Follows Xibalba standards: TypeScript strict, error handling, local-first
 */

import { parseScript, getAllCommands } from './scriptParser';
import { callLocalAI, LocalAIConfig, detectLocalAIProvider } from './localAIService';
import { loadMCPConfig } from '../config/mcpConfig';

export interface TranslationRequest {
  userMessage: string;
  context: {
    frame: number;
    layerId: string | null;
    layers: Array<{ id: string; name: string }>;
    currentScript?: string;
  };
}

export interface TranslationResult {
  hashtagScript: string;
  explanation: string;
  confidence: number; // 0-1
  alternativeTranslations?: string[];
  errors?: string[];
}

/**
 * Translate natural language to hashtag commands
 * Uses AI to understand user intent and convert to executable hashtag syntax
 */
export async function translateToHashtags(request: TranslationRequest): Promise<TranslationResult> {
  const config = loadMCPConfig();
  
  // Get all available commands for context
  const allCommands = getAllCommands();
  const commandLexicon = allCommands.map(cmd => ({
    name: cmd.name,
    category: cmd.category,
    syntax: cmd.syntax,
    description: `#${cmd.name} - ${cmd.syntax}`
  }));

  // Build comprehensive prompt for AI
  const systemPrompt = buildSystemPrompt(commandLexicon);
  const userPrompt = buildUserPrompt(request, commandLexicon);

  // Use local AI if enabled
  if (config.useLocalAI && config.localAIModelName) {
    return await translateWithLocalAI(request, systemPrompt, userPrompt, config);
  }

  // Fallback to MCP server (if available)
  // TODO: Connect to MCP server for translation
  return await translateWithFallback(request, commandLexicon);
}

/**
 * Build system prompt for AI translation
 */
function buildSystemPrompt(commandLexicon: Array<{ name: string; category: string; syntax: string; description: string }>): string {
  return `You are a VectorForge natural language translator. Your job is to convert plain English requests into hashtag-based animation commands.

HASHTAG COMMAND SYNTAX:
- Commands start with # followed by the command name
- Format: #command [target] [param:value] [param:value]
- Multiple commands can be on separate lines
- Comments use //

AVAILABLE COMMANDS:
${commandLexicon.map(cmd => `- ${cmd.description}`).join('\n')}

TRANSLATION RULES:
1. Understand the user's intent (move, rotate, animate, interact, etc.)
2. Map intent to the closest hashtag command
3. Extract parameters from natural language (numbers, directions, durations)
4. Use layer names/IDs from context when provided
5. If user mentions "layer1" or a specific layer, use that as the target
6. If no target specified but context has selectedLayerId, use that
7. Convert time references to frames (e.g., "1 second" = 30 frames at 30fps)
8. Convert directions to coordinates when needed (e.g., "right" = positive x)

EXAMPLES:
User: "Move the circle to the right 100 pixels"
Translation: #move circle x:100

User: "Rotate the button 45 degrees over 1 second"
Translation: #rotate button angle:45 duration:30

User: "Make the logo fade out slowly"
Translation: #fade logo opacity:0 duration:60

User: "When I click the button, hide the menu"
Translation: #onclick button action:#hide menu

User: "If the score is greater than 10, show the win message"
Translation: #if score > 10 then:#show winMessage

User: "Animate the character bouncing up and down 3 times"
Translation: #bounce character height:50 count:3

Return ONLY the hashtag commands, one per line. Be precise and concise.`;
}

/**
 * Build user prompt with context
 */
function buildUserPrompt(
  request: TranslationRequest,
  commandLexicon: Array<{ name: string; category: string; syntax: string; description: string }>
): string {
  const { userMessage, context } = request;
  
  let prompt = `Translate this user request to hashtag commands:\n"${userMessage}"\n\n`;
  
  // Add context
  prompt += `CONTEXT:\n`;
  prompt += `- Current Frame: ${context.frame}\n`;
  prompt += `- Selected Layer: ${context.layerId || 'none'}\n`;
  prompt += `- Available Layers: ${context.layers.map(l => `${l.name} (${l.id})`).join(', ') || 'none'}\n`;
  
  if (context.currentScript) {
    prompt += `- Current Script:\n${context.currentScript}\n`;
  }
  
  prompt += `\nTranslate the user's request into hashtag commands. Return only the hashtag script, no explanations.`;
  
  return prompt;
}

/**
 * Translate using local AI (GGUF models)
 */
async function translateWithLocalAI(
  request: TranslationRequest,
  systemPrompt: string,
  userPrompt: string,
  config: any
): Promise<TranslationResult> {
  const localAIConfig: LocalAIConfig = {
    provider: config.localAIProvider,
    serverUrl: config.localAIServerUrl,
    modelName: config.localAIModelName,
    ggufPath: config.ggufPath,
    temperature: 0.4, // Moderate temperature for creative but accurate translation
    topP: 0.9,
    topK: 40
  };

  try {
    const response = await callLocalAI(userPrompt, systemPrompt, localAIConfig);
    const hashtagScript = extractHashtagScript(response.content);
    
    // Validate the translation
    const parsed = parseScript(hashtagScript);
    const errors = parsed.errors.map(e => e.message);
    
    // Calculate confidence based on validation
    const confidence = errors.length === 0 ? 0.9 : Math.max(0.3, 0.9 - (errors.length * 0.2));
    
    return {
      hashtagScript,
      explanation: generateExplanation(request.userMessage, hashtagScript),
      confidence,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error('Local AI translation error:', error);
    return {
      hashtagScript: '',
      explanation: 'Translation failed. Please try rephrasing your request.',
      confidence: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

/**
 * Fallback translation (rule-based)
 */
async function translateWithFallback(
  request: TranslationRequest,
  commandLexicon: Array<{ name: string; category: string; syntax: string; description: string }>
): Promise<TranslationResult> {
  const { userMessage, context } = request;
  const lowerMessage = userMessage.toLowerCase();
  
  // Simple pattern matching for common requests
  const translations: string[] = [];
  
  // Movement patterns
  if (lowerMessage.includes('move') || lowerMessage.includes('slide')) {
    const target = extractTarget(userMessage, context);
    const x = extractNumber(userMessage, /x[:\s]*(\d+)/i) || extractNumber(userMessage, /right[:\s]*(\d+)/i) || (lowerMessage.includes('right') ? 100 : undefined);
    const y = extractNumber(userMessage, /y[:\s]*(\d+)/i) || extractNumber(userMessage, /down[:\s]*(\d+)/i) || (lowerMessage.includes('down') ? 100 : undefined);
    
    if (target && (x !== undefined || y !== undefined)) {
      const params: string[] = [];
      if (x !== undefined) params.push(`x:${x}`);
      if (y !== undefined) params.push(`y:${y}`);
      translations.push(`#move ${target} ${params.join(' ')}`);
    }
  }
  
  // Rotation patterns
  if (lowerMessage.includes('rotate') || lowerMessage.includes('turn')) {
    const target = extractTarget(userMessage, context);
    const angle = extractNumber(userMessage, /(\d+)\s*degrees?/i) || extractNumber(userMessage, /rotate[:\s]*(\d+)/i);
    
    if (target && angle !== undefined) {
      translations.push(`#rotate ${target} angle:${angle}`);
    }
  }
  
  // Fade patterns
  if (lowerMessage.includes('fade') || lowerMessage.includes('opacity')) {
    const target = extractTarget(userMessage, context);
    const opacity = extractNumber(userMessage, /opacity[:\s]*([\d.]+)/i) || (lowerMessage.includes('out') || lowerMessage.includes('hide') ? 0 : undefined);
    
    if (target && opacity !== undefined) {
      translations.push(`#fade ${target} opacity:${opacity}`);
    }
  }
  
  // Show/hide patterns
  if (lowerMessage.includes('show') || lowerMessage.includes('display')) {
    const target = extractTarget(userMessage, context);
    if (target) translations.push(`#show ${target}`);
  }
  
  if (lowerMessage.includes('hide') || lowerMessage.includes('hide')) {
    const target = extractTarget(userMessage, context);
    if (target) translations.push(`#hide ${target}`);
  }
  
  const hashtagScript = translations.join('\n') || `// Could not translate: "${userMessage}"`;
  
  return {
    hashtagScript,
    explanation: generateExplanation(request.userMessage, hashtagScript),
    confidence: translations.length > 0 ? 0.6 : 0.2,
    errors: translations.length === 0 ? ['Could not understand request. Try using specific commands like "move", "rotate", "fade".'] : undefined
  };
}

/**
 * Extract hashtag script from AI response
 */
function extractHashtagScript(response: string): string {
  // Remove markdown code blocks if present
  let script = response.replace(/```[\w]*\n?/g, '').trim();
  
  // Extract lines that start with #
  const lines = script.split('\n').filter(line => line.trim().startsWith('#') || line.trim().startsWith('//'));
  
  return lines.join('\n') || script;
}

/**
 * Extract target layer from message
 */
function extractTarget(message: string, context: TranslationRequest['context']): string | null {
  // Look for layer names/IDs in message
  for (const layer of context.layers) {
    if (message.toLowerCase().includes(layer.name.toLowerCase()) || message.includes(layer.id)) {
      return layer.name;
    }
  }
  
  // Use selected layer if available
  if (context.layerId) {
    const selectedLayer = context.layers.find(l => l.id === context.layerId);
    if (selectedLayer) return selectedLayer.name;
  }
  
  // Try to extract from message (e.g., "the circle", "button1")
  const targetMatch = message.match(/(?:the\s+)?(\w+)/i);
  if (targetMatch) {
    return targetMatch[1];
  }
  
  return null;
}

/**
 * Extract number from message
 */
function extractNumber(message: string, pattern: RegExp): number | undefined {
  const match = message.match(pattern);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * Generate explanation for translation
 */
function generateExplanation(userMessage: string, hashtagScript: string): string {
  if (!hashtagScript || hashtagScript.startsWith('//')) {
    return `I couldn't understand "${userMessage}". Try using specific action words like "move", "rotate", "fade", or "show".`;
  }
  
  const commandCount = hashtagScript.split('\n').filter(l => l.trim().startsWith('#')).length;
  
  if (commandCount === 1) {
    return `I translated your request into: ${hashtagScript}`;
  }
  
  return `I translated your request into ${commandCount} commands:\n${hashtagScript}`;
}

/**
 * Get natural language examples for commands
 * Helps users understand how to phrase requests
 */
export function getNaturalLanguageExamples(): Array<{ example: string; hashtag: string; category: string }> {
  return [
    // Animation - Movement
    { example: "Move the circle to the right 100 pixels", hashtag: "#move circle x:100", category: "Animation" },
    { example: "Slide the button down 50 pixels", hashtag: "#slide button direction:down distance:50", category: "Animation" },
    { example: "Make the logo bounce up and down 3 times", hashtag: "#bounce logo height:50 count:3", category: "Animation" },
    
    // Animation - Transformation
    { example: "Rotate the icon 45 degrees", hashtag: "#rotate icon angle:45", category: "Animation" },
    { example: "Scale the image to double size", hashtag: "#scale image x:2 y:2", category: "Animation" },
    { example: "Flip the card horizontally", hashtag: "#flip card axis:horizontal", category: "Animation" },
    
    // Animation - Appearance
    { example: "Fade out the menu over 1 second", hashtag: "#fade menu opacity:0 duration:30", category: "Animation" },
    { example: "Change the text color to blue", hashtag: "#color text fill:#0000ff", category: "Animation" },
    { example: "Add a glow effect to the button", hashtag: "#glow button color:#ffff00 intensity:10", category: "Animation" },
    
    // Interaction
    { example: "When I click the button, hide the menu", hashtag: "#onclick button action:#hide menu", category: "Interaction" },
    { example: "When I hover over the link, change its color", hashtag: "#onhover link action:#color link fill:#ff0000", category: "Interaction" },
    { example: "When I press the spacebar, play the animation", hashtag: "#onkey Space action:#play animation", category: "Interaction" },
    
    // Logic
    { example: "If the score is greater than 10, show the win message", hashtag: "#if score > 10 then:#show winMessage", category: "Logic" },
    { example: "Wait 2 seconds before showing the next slide", hashtag: "#wait duration:60", category: "Logic" },
    { example: "Repeat the bounce animation 5 times", hashtag: "#loop count:5 commands:#bounce logo height:50", category: "Logic" }
  ];
}

