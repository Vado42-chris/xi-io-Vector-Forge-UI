/**
 * Code Security Service
 * Sandboxes and validates user-generated scripts (hashtag-based action scripts)
 * Prevents malicious code execution while allowing safe script operations
 */

import { securityService } from './securityService';
import { checkpointService } from './checkpointService';

/**
 * Allowed hashtag commands (whitelist approach)
 */
const ALLOWED_COMMANDS = new Set([
  // Layer operations
  'move', 'rotate', 'scale', 'skew', 'transform',
  'set-color', 'set-fill', 'set-stroke', 'set-opacity',
  'set-visible', 'set-locked', 'set-name',
  
  // Animation operations
  'animate', 'keyframe', 'ease', 'tween',
  'play', 'pause', 'stop', 'loop',
  
  // Path operations
  'path-move', 'path-line', 'path-curve', 'path-close',
  'path-union', 'path-intersect', 'path-subtract',
  
  // Math operations
  'add', 'subtract', 'multiply', 'divide', 'mod',
  'sin', 'cos', 'tan', 'abs', 'floor', 'ceil', 'round',
  
  // Control flow
  'if', 'else', 'for', 'while', 'repeat',
  
  // Variables
  'set-var', 'get-var', 'inc-var', 'dec-var',
  
  // Events
  'on-click', 'on-hover', 'on-load', 'on-frame',
  
  // Safe utilities
  'log', 'warn', 'error', 'debug',
]);

/**
 * Dangerous patterns to block
 */
const DANGEROUS_PATTERNS: RegExp[] = [
  // JavaScript code injection
  /<script[^>]*>/gi,
  /javascript:/gi,
  /eval\s*\(/gi,
  /Function\s*\(/gi,
  /setTimeout\s*\(/gi,
  /setInterval\s*\(/gi,
  
  // DOM manipulation (dangerous)
  /document\./gi,
  /window\./gi,
  /globalThis\./gi,
  
  // Network requests
  /fetch\s*\(/gi,
  /XMLHttpRequest/gi,
  /\.send\s*\(/gi,
  
  // File system access
  /FileReader/gi,
  /Blob/gi,
  /FileSystem/gi,
  
  // Storage manipulation
  /localStorage\.setItem/gi,
  /sessionStorage\.setItem/gi,
  /IndexedDB/gi,
  
  // Crypto (could be used maliciously)
  /crypto\./gi,
  /WebCrypto/gi,
];

/**
 * Code Security Service Interface
 */
export interface ICodeSecurityService {
  /**
   * Validate script syntax and security
   */
  validateScript(script: string): { valid: boolean; errors: string[]; warnings: string[] };

  /**
   * Sanitize script content
   */
  sanitizeScript(script: string): string;

  /**
   * Check if script contains dangerous patterns
   */
  detectDangerousCode(script: string): boolean;

  /**
   * Extract allowed commands from script
   */
  extractCommands(script: string): string[];

  /**
   * Check if command is allowed
   */
  isCommandAllowed(command: string): boolean;

  /**
   * Create sandboxed execution context
   */
  createSandboxContext(): Record<string, any>;
}

class CodeSecurityService implements ICodeSecurityService {
  /**
   * Validate script syntax and security
   */
  validateScript(script: string): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!script || typeof script !== 'string') {
      errors.push('Script is empty or invalid');
      return { valid: false, errors, warnings };
    }

    // Check for dangerous patterns
    if (this.detectDangerousCode(script)) {
      errors.push('Script contains potentially dangerous code patterns');
    }

    // Extract and validate commands
    const commands = this.extractCommands(script);
    const invalidCommands = commands.filter(cmd => !this.isCommandAllowed(cmd));
    
    if (invalidCommands.length > 0) {
      errors.push(`Invalid commands detected: ${invalidCommands.join(', ')}`);
    }

    // Check script length (prevent DoS)
    const maxScriptLength = 100000; // 100KB
    if (script.length > maxScriptLength) {
      errors.push(`Script exceeds maximum length of ${maxScriptLength} characters`);
    }

    // Check for nested loops (prevent infinite loops)
    const loopCount = (script.match(/#(for|while|repeat)/gi) || []).length;
    if (loopCount > 10) {
      warnings.push('Script contains many loops - may cause performance issues');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Sanitize script content
   */
  sanitizeScript(script: string): string {
    if (!script || typeof script !== 'string') {
      return '';
    }

    let sanitized = script;

    // Remove dangerous patterns
    DANGEROUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Remove control characters (except newlines and tabs)
    sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

    return sanitized;
  }

  /**
   * Check if script contains dangerous patterns
   */
  detectDangerousCode(script: string): boolean {
    if (!script || typeof script !== 'string') {
      return false;
    }

    return DANGEROUS_PATTERNS.some(pattern => pattern.test(script));
  }

  /**
   * Extract allowed commands from script
   */
  extractCommands(script: string): string[] {
    if (!script || typeof script !== 'string') {
      return [];
    }

    // Extract hashtag commands (#command)
    const commandPattern = /#(\w+)/g;
    const commands: string[] = [];
    let match;

    while ((match = commandPattern.exec(script)) !== null) {
      commands.push(match[1].toLowerCase());
    }

    return [...new Set(commands)]; // Remove duplicates
  }

  /**
   * Check if command is allowed
   */
  isCommandAllowed(command: string): boolean {
    if (!command || typeof command !== 'string') {
      return false;
    }

    return ALLOWED_COMMANDS.has(command.toLowerCase());
  }

  /**
   * Create sandboxed execution context
   */
  createSandboxContext(): Record<string, any> {
    // Create a safe execution context with only allowed functions
    return {
      // Math functions
      Math: {
        abs: Math.abs,
        floor: Math.floor,
        ceil: Math.ceil,
        round: Math.round,
        max: Math.max,
        min: Math.min,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        PI: Math.PI,
        E: Math.E,
      },
      
      // Safe console (limited)
      console: {
        log: (...args: any[]) => {
          if (typeof window !== 'undefined' && window.console) {
            console.log('[Script]', ...args);
          }
        },
        warn: (...args: any[]) => {
          if (typeof window !== 'undefined' && window.console) {
            console.warn('[Script]', ...args);
          }
        },
      },
      
      // Safe string functions
      String: {
        fromCharCode: String.fromCharCode,
      },
      
      // Safe array functions
      Array: {
        isArray: Array.isArray,
      },
      
      // Safe object functions
      Object: {
        keys: Object.keys,
        values: Object.values,
        entries: Object.entries,
      },
      
      // Prevent access to dangerous globals
      // (These will be undefined in the sandbox)
      document: undefined,
      window: undefined,
      globalThis: undefined,
      eval: undefined,
      Function: undefined,
      setTimeout: undefined,
      setInterval: undefined,
      fetch: undefined,
      XMLHttpRequest: undefined,
    };
  }

  /**
   * Create security checkpoint for script execution
   */
  async createSecurityCheckpoint(script: string, validationResult: { valid: boolean; errors: string[]; warnings: string[] }): Promise<void> {
    await checkpointService.createCheckpoint(
      'code-security-validation',
      'Script security validation',
      [],
      {
        scriptLength: script.length,
        valid: validationResult.valid,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
        commands: this.extractCommands(script),
      }
    );
  }
}

// Singleton instance
export const codeSecurityService = new CodeSecurityService();

export default codeSecurityService;

