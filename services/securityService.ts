/**
 * Security Service
 * Handles security validation and code sandboxing
 * Part of Patch 4: Security Foundation
 */

export interface SecurityPolicy {
  allowInlineScripts: boolean;
  allowEval: boolean;
  allowExternalResources: boolean;
  allowedDomains: string[];
  maxScriptSize: number;
  maxExecutionTime: number;
}

export interface SecurityViolation {
  type: 'script' | 'eval' | 'external' | 'size' | 'timeout' | 'sandbox';
  message: string;
  timestamp: number;
  context?: string;
}

class SecurityService {
  private policy: SecurityPolicy = {
    allowInlineScripts: false,
    allowEval: false,
    allowExternalResources: false,
    allowedDomains: [],
    maxScriptSize: 100000, // 100KB
    maxExecutionTime: 5000, // 5 seconds
  };

  private violations: SecurityViolation[] = [];
  private maxViolations = 100;

  /**
   * Initialize security service
   */
  initialize(policy?: Partial<SecurityPolicy>): void {
    if (policy) {
      this.policy = { ...this.policy, ...policy };
    }
  }

  /**
   * Validate script content
   */
  validateScript(script: string, context?: string): { valid: boolean; violation?: SecurityViolation } {
    // Check script size
    if (script.length > this.policy.maxScriptSize) {
      const violation: SecurityViolation = {
        type: 'size',
        message: `Script exceeds maximum size of ${this.policy.maxScriptSize} bytes`,
        timestamp: Date.now(),
        context,
      };
      this.recordViolation(violation);
      return { valid: false, violation };
    }

    // Check for eval usage
    if (!this.policy.allowEval) {
      const evalPattern = /\beval\s*\(|\bFunction\s*\(|new\s+Function\s*\(/i;
      if (evalPattern.test(script)) {
        const violation: SecurityViolation = {
          type: 'eval',
          message: 'Script contains eval or Function constructor (not allowed)',
          timestamp: Date.now(),
          context,
        };
        this.recordViolation(violation);
        return { valid: false, violation };
      }
    }

    // Check for external resource access
    if (!this.policy.allowExternalResources) {
      const externalPattern = /(fetch|XMLHttpRequest|import\s*\(|require\s*\()/i;
      if (externalPattern.test(script)) {
        const violation: SecurityViolation = {
          type: 'external',
          message: 'Script attempts external resource access (not allowed)',
          timestamp: Date.now(),
          context,
        };
        this.recordViolation(violation);
        return { valid: false, violation };
      }
    }

    return { valid: true };
  }

  /**
   * Sanitize user input
   */
  sanitizeInput(input: string): string {
    // Remove potentially dangerous characters and patterns
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/eval\s*\(/gi, '')
      .replace(/Function\s*\(/gi, '');
  }

  /**
   * Validate URL
   */
  validateUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      
      // Check if domain is allowed
      if (this.policy.allowedDomains.length > 0) {
        const domain = parsed.hostname;
        const isAllowed = this.policy.allowedDomains.some(allowed => 
          domain === allowed || domain.endsWith(`.${allowed}`)
        );
        if (!isAllowed) {
          return false;
        }
      }

      // Only allow http/https
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Record security violation
   */
  private recordViolation(violation: SecurityViolation): void {
    this.violations.push(violation);
    
    // Limit violations array size
    if (this.violations.length > this.maxViolations) {
      this.violations.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Security violation:', violation);
    }
  }

  /**
   * Get security violations
   */
  getViolations(): SecurityViolation[] {
    return [...this.violations];
  }

  /**
   * Clear violations
   */
  clearViolations(): void {
    this.violations = [];
  }

  /**
   * Get current security policy
   */
  getPolicy(): SecurityPolicy {
    return { ...this.policy };
  }

  /**
   * Update security policy
   */
  updatePolicy(updates: Partial<SecurityPolicy>): void {
    this.policy = { ...this.policy, ...updates };
  }
}

// Singleton instance
export const securityService = new SecurityService();

// Initialize with default policy
securityService.initialize();

export default securityService;
