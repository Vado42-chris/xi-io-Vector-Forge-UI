/**
 * VectorForge Timeline Scripting System
 * Hashtag-based Plain Language Command Parser
 */

export interface ScriptCommand {
  command: string;
  target?: string;
  parameters: Record<string, string | number | boolean>;
  raw: string;
  lineNumber: number;
}

export interface ParsedScript {
  commands: ScriptCommand[];
  errors: Array<{ line: number; message: string; command: string }>;
  isValid: boolean;
}

/**
 * Parse a hashtag command line
 * Syntax: #command [target] [param:value] [param:value]
 * 
 * Examples:
 * #move layer1 x:100 y:50
 * #rotate layer1 angle:45
 * #fade layer1 opacity:0.5 duration:30
 */
export function parseCommandLine(line: string, lineNumber: number = 0): ScriptCommand | null {
  // Remove comments (everything after //)
  const cleanLine = line.split('//')[0].trim();
  
  if (!cleanLine || !cleanLine.startsWith('#')) {
    return null;
  }

  // Extract command (everything after # until space or :)
  const commandMatch = cleanLine.match(/^#(\w+)/);
  if (!commandMatch) {
    return null;
  }

  const command = commandMatch[1];
  const rest = cleanLine.slice(commandMatch[0].length).trim();

  // Parse target (first word if it doesn't contain :)
  let target: string | undefined;
  let paramsString = rest;

  const parts = rest.split(/\s+/);
  if (parts.length > 0 && !parts[0].includes(':')) {
    target = parts[0];
    paramsString = parts.slice(1).join(' ');
  }

  // Parse parameters (key:value pairs)
  const parameters: Record<string, string | number | boolean> = {};
  
  // Match key:value patterns
  const paramRegex = /(\w+):([^\s]+)/g;
  let match;
  
  while ((match = paramRegex.exec(paramsString)) !== null) {
    const key = match[1];
    const value = match[2];
    
    // Try to parse as number
    if (/^-?\d+\.?\d*$/.test(value)) {
      parameters[key] = parseFloat(value);
    }
    // Try to parse as boolean
    else if (value === 'true' || value === 'false') {
      parameters[key] = value === 'true';
    }
    // Otherwise keep as string
    else {
      parameters[key] = value;
    }
  }

  return {
    command,
    target,
    parameters,
    raw: cleanLine,
    lineNumber
  };
}

/**
 * Parse a complete script (multiple lines)
 */
export function parseScript(script: string): ParsedScript {
  const lines = script.split('\n');
  const commands: ScriptCommand[] = [];
  const errors: Array<{ line: number; message: string; command: string }> = [];

  lines.forEach((line, index) => {
    try {
      const command = parseCommandLine(line, index + 1);
      if (command) {
        commands.push(command);
      }
    } catch (error) {
      errors.push({
        line: index + 1,
        message: error instanceof Error ? error.message : 'Parse error',
        command: line
      });
    }
  });

  return {
    commands,
    errors,
    isValid: errors.length === 0
  };
}

/**
 * Validate command syntax
 */
export function validateCommand(command: ScriptCommand): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if command exists in registry
  const validCommands = [
    'move', 'rotate', 'scale', 'fade', 'show', 'hide', 'toggle',
    'slide', 'bounce', 'shake', 'skew', 'flip', 'color', 'blur', 'glow',
    'onclick', 'onhover', 'ondrag', 'onrelease', 'onkey', 'onkeydown', 'onkeyup',
    'ontouch', 'onswipe', 'onpinch',
    'if', 'wait', 'loop', 'repeat', 'goto', 'set', 'get', 'increment', 'decrement',
    'check', 'compare', 'create', 'delete', 'duplicate', 'rename', 'lock', 'unlock',
    'play', 'stop', 'pause', 'volume', 'load', 'swap', 'fetch', 'post', 'get',
    'connect', 'send', 'onmessage', 'gravity', 'collide', 'capture', 'validate'
  ];

  if (!validCommands.includes(command.command)) {
    errors.push(`Unknown command: #${command.command}`);
  }

  // Command-specific validation
  switch (command.command) {
    case 'move':
    case 'slide':
      if (!command.parameters.x && !command.parameters.y) {
        errors.push(`#${command.command} requires x or y parameter`);
      }
      break;
    
    case 'rotate':
      if (command.parameters.angle === undefined) {
        errors.push('#rotate requires angle parameter');
      }
      break;
    
    case 'fade':
      if (command.parameters.opacity === undefined) {
        errors.push('#fade requires opacity parameter (0-1)');
      }
      break;
    
    case 'onclick':
    case 'onhover':
    case 'ontouch':
      if (!command.target) {
        errors.push(`#${command.command} requires a target`);
      }
      if (!command.parameters.action) {
        errors.push(`#${command.command} requires action parameter`);
      }
      break;
    
    case 'onkey':
    case 'onkeydown':
    case 'onkeyup':
      if (!command.parameters.key) {
        errors.push(`#${command.command} requires key parameter`);
      }
      if (!command.parameters.action) {
        errors.push(`#${command.command} requires action parameter`);
      }
      break;
    
    case 'if':
      if (!command.parameters.condition && !command.parameters.then) {
        errors.push('#if requires condition and then parameters');
      }
      break;
    
    case 'loop':
      if (!command.parameters.count || !command.parameters.commands) {
        errors.push('#loop requires count and commands parameters');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Format command for display
 */
export function formatCommand(command: ScriptCommand): string {
  let result = `#${command.command}`;
  
  if (command.target) {
    result += ` ${command.target}`;
  }
  
  const params = Object.entries(command.parameters)
    .map(([key, value]) => `${key}:${value}`)
    .join(' ');
  
  if (params) {
    result += ` ${params}`;
  }
  
  return result;
}

/**
 * Get command syntax help
 */
export function getCommandSyntax(commandName: string): string | null {
  const syntaxMap: Record<string, string> = {
    move: '#move [target] x:[number] y:[number] duration:[frames]',
    rotate: '#rotate [target] angle:[degrees] center:[point] duration:[frames]',
    scale: '#scale [target] x:[number] y:[number] duration:[frames]',
    fade: '#fade [target] opacity:[0-1] duration:[frames]',
    show: '#show [target]',
    hide: '#hide [target]',
    toggle: '#toggle [target]',
    slide: '#slide [target] direction:[up|down|left|right] distance:[number]',
    bounce: '#bounce [target] height:[number] count:[number]',
    shake: '#shake [target] intensity:[number] duration:[frames]',
    color: '#color [target] fill:[color] stroke:[color] duration:[frames]',
    blur: '#blur [target] amount:[number] duration:[frames]',
    glow: '#glow [target] color:[color] intensity:[number] duration:[frames]',
    onclick: '#onclick [target] action:[command]',
    onhover: '#onhover [target] action:[command]',
    onkey: '#onkey [key] action:[command]',
    if: '#if [condition] then:[command] else:[command]',
    wait: '#wait duration:[frames]',
    loop: '#loop count:[number] commands:[command1,command2]',
    goto: '#goto frame:[number] | label:[label]',
    set: '#set variable:[name] value:[value]',
    get: '#get variable:[name]',
    play: '#play sound:[name] volume:[0-1] loop:[true|false]',
    stop: '#stop sound:[name]',
    fetch: '#fetch url:[url] method:[GET|POST] data:[json] action:[command]'
  };

  return syntaxMap[commandName] || null;
}

/**
 * Get all available commands
 */
export function getAllCommands(): Array<{ name: string; category: string; syntax: string }> {
  return [
    // Animation - Movement
    { name: 'move', category: 'Animation', syntax: '#move [target] x:[n] y:[n] duration:[frames]' },
    { name: 'slide', category: 'Animation', syntax: '#slide [target] direction:[dir] distance:[n]' },
    { name: 'bounce', category: 'Animation', syntax: '#bounce [target] height:[n] count:[n]' },
    { name: 'shake', category: 'Animation', syntax: '#shake [target] intensity:[n] duration:[frames]' },
    
    // Animation - Transformation
    { name: 'rotate', category: 'Animation', syntax: '#rotate [target] angle:[degrees] duration:[frames]' },
    { name: 'scale', category: 'Animation', syntax: '#scale [target] x:[n] y:[n] duration:[frames]' },
    { name: 'skew', category: 'Animation', syntax: '#skew [target] x:[deg] y:[deg] duration:[frames]' },
    { name: 'flip', category: 'Animation', syntax: '#flip [target] axis:[horizontal|vertical]' },
    
    // Animation - Appearance
    { name: 'fade', category: 'Animation', syntax: '#fade [target] opacity:[0-1] duration:[frames]' },
    { name: 'color', category: 'Animation', syntax: '#color [target] fill:[color] stroke:[color]' },
    { name: 'blur', category: 'Animation', syntax: '#blur [target] amount:[n] duration:[frames]' },
    { name: 'glow', category: 'Animation', syntax: '#glow [target] color:[color] intensity:[n]' },
    
    // Animation - Visibility
    { name: 'show', category: 'Animation', syntax: '#show [target]' },
    { name: 'hide', category: 'Animation', syntax: '#hide [target]' },
    { name: 'toggle', category: 'Animation', syntax: '#toggle [target]' },
    
    // Interaction - Mouse
    { name: 'onclick', category: 'Interaction', syntax: '#onclick [target] action:[command]' },
    { name: 'onhover', category: 'Interaction', syntax: '#onhover [target] action:[command]' },
    { name: 'ondrag', category: 'Interaction', syntax: '#ondrag [target] action:[command]' },
    { name: 'onrelease', category: 'Interaction', syntax: '#onrelease [target] action:[command]' },
    
    // Interaction - Keyboard
    { name: 'onkey', category: 'Interaction', syntax: '#onkey [key] action:[command]' },
    { name: 'onkeydown', category: 'Interaction', syntax: '#onkeydown [key] action:[command]' },
    { name: 'onkeyup', category: 'Interaction', syntax: '#onkeyup [key] action:[command]' },
    
    // Interaction - Touch
    { name: 'ontouch', category: 'Interaction', syntax: '#ontouch [target] action:[command]' },
    { name: 'onswipe', category: 'Interaction', syntax: '#onswipe [target] direction:[dir] action:[command]' },
    
    // Logic - Control Flow
    { name: 'if', category: 'Logic', syntax: '#if [condition] then:[command] else:[command]' },
    { name: 'wait', category: 'Logic', syntax: '#wait duration:[frames]' },
    { name: 'loop', category: 'Logic', syntax: '#loop count:[n] commands:[cmd1,cmd2]' },
    { name: 'repeat', category: 'Logic', syntax: '#repeat [command] count:[n]' },
    { name: 'goto', category: 'Logic', syntax: '#goto frame:[n] | label:[name]' },
    
    // Logic - Variables
    { name: 'set', category: 'Logic', syntax: '#set variable:[name] value:[value]' },
    { name: 'get', category: 'Logic', syntax: '#get variable:[name]' },
    { name: 'increment', category: 'Logic', syntax: '#increment variable:[name] amount:[n]' },
    { name: 'decrement', category: 'Logic', syntax: '#decrement variable:[name] amount:[n]' },
    
    // Logic - Conditions
    { name: 'check', category: 'Logic', syntax: '#check [condition] action:[command]' },
    { name: 'compare', category: 'Logic', syntax: '#compare [val1] [op] [val2] action:[command]' },
    
    // Media - Audio
    { name: 'play', category: 'Media', syntax: '#play sound:[name] volume:[0-1] loop:[true|false]' },
    { name: 'stop', category: 'Media', syntax: '#stop sound:[name]' },
    { name: 'pause', category: 'Media', syntax: '#pause sound:[name]' },
    { name: 'volume', category: 'Media', syntax: '#volume sound:[name] level:[0-1]' },
    
    // Network
    { name: 'fetch', category: 'Network', syntax: '#fetch url:[url] method:[GET|POST] data:[json]' },
    { name: 'post', category: 'Network', syntax: '#post url:[url] data:[json]' },
    { name: 'get', category: 'Network', syntax: '#get url:[url]' }
  ];
}

