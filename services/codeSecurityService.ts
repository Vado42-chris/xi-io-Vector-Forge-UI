/**
 * Code Security Service
 * Provides code sandboxing and execution safety
 * Part of Patch 4: Security Foundation
 */

import { securityService } from './securityService';

export interface SandboxConfig {
  timeout: number;
  memoryLimit: number;
  allowNetwork: boolean;
  allowFileSystem: boolean;
  allowedAPIs: string[];
}

export interface ExecutionResult {
  success: boolean;
  output?: unknown;
  error?: string;
  executionTime: number;
  memoryUsed?: number;
}

class CodeSecurityService {
  private sandboxConfig: SandboxConfig = {
    timeout: 5000,
    memoryLimit: 50 * 1024 * 1024, // 50MB
    allowNetwork: false,
    allowFileSystem: false,
    allowedAPIs: ['console', 'Math', 'Date', 'Array', 'Object', 'String', 'Number'],
  };

  /**
   * Execute code in sandbox
   */
  async executeInSandbox(code: string, context?: string): Promise<ExecutionResult> {
    const startTime = Date.now();

    // Validate script first
    const validation = securityService.validateScript(code, context);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.violation?.message || 'Script validation failed',
        executionTime: Date.now() - startTime,
      };
    }

    try {
      // Create sandboxed execution context
      const sandbox = this.createSandbox();

      // Execute with timeout
      const result = await Promise.race([
        this.executeCode(code, sandbox),
        this.createTimeout(this.sandboxConfig.timeout),
      ]);

      if (result === 'timeout') {
        return {
          success: false,
          error: 'Execution timeout exceeded',
          executionTime: Date.now() - startTime,
        };
      }

      return {
        success: true,
        output: result,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Create sandboxed execution context
   */
  private createSandbox(): Record<string, unknown> {
    const sandbox: Record<string, unknown> = {};

    // Add allowed APIs
    this.sandboxConfig.allowedAPIs.forEach(apiName => {
      if (apiName === 'console') {
        sandbox.console = {
          log: (...args: unknown[]) => console.log('[SANDBOX]', ...args),
          warn: (...args: unknown[]) => console.warn('[SANDBOX]', ...args),
          error: (...args: unknown[]) => console.error('[SANDBOX]', ...args),
        };
      } else if (typeof (globalThis as any)[apiName] !== 'undefined') {
        sandbox[apiName] = (globalThis as any)[apiName];
      }
    });

    // Block dangerous APIs
    sandbox.eval = undefined;
    sandbox.Function = undefined;
    sandbox.fetch = this.sandboxConfig.allowNetwork ? fetch : undefined;
    sandbox.XMLHttpRequest = this.sandboxConfig.allowNetwork ? XMLHttpRequest : undefined;
    sandbox.import = undefined;
    sandbox.require = undefined;
    sandbox.process = undefined;
    sandbox.global = undefined;
    sandbox.window = undefined;
    sandbox.document = undefined;

    return sandbox;
  }

  /**
   * Execute code in sandbox
   */
  private async executeCode(code: string, sandbox: Record<string, unknown>): Promise<unknown> {
    // Use Function constructor with sandbox (if allowed by policy)
    // Otherwise, use a more restricted approach
    try {
      // Create a function that executes in the sandbox context
      const func = new Function(
        ...Object.keys(sandbox),
        `"use strict"; ${code}`
      );

      return func(...Object.values(sandbox));
    } catch (error) {
      throw new Error(`Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create timeout promise
   */
  private createTimeout(ms: number): Promise<'timeout'> {
    return new Promise(resolve => {
      setTimeout(() => resolve('timeout'), ms);
    });
  }

  /**
   * Validate code before execution
   */
  validateCode(code: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for dangerous patterns
    const dangerousPatterns = [
      { pattern: /\beval\s*\(/i, message: 'eval() is not allowed' },
      { pattern: /\bFunction\s*\(/i, message: 'Function constructor is not allowed' },
      { pattern: /import\s*\(/i, message: 'Dynamic imports are not allowed' },
      { pattern: /require\s*\(/i, message: 'require() is not allowed' },
      { pattern: /process\./i, message: 'process object is not allowed' },
      { pattern: /global\./i, message: 'global object is not allowed' },
      { pattern: /window\./i, message: 'window object is not allowed' },
      { pattern: /document\./i, message: 'document object is not allowed' },
    ];

    dangerousPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(code)) {
        errors.push(message);
      }
    });

    // Validate script size
    if (code.length > this.sandboxConfig.memoryLimit) {
      errors.push(`Code exceeds memory limit of ${this.sandboxConfig.memoryLimit} bytes`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get sandbox configuration
   */
  getConfig(): SandboxConfig {
    return { ...this.sandboxConfig };
  }

  /**
   * Update sandbox configuration
   */
  updateConfig(updates: Partial<SandboxConfig>): void {
    this.sandboxConfig = { ...this.sandboxConfig, ...updates };
  }
}

// Singleton instance
export const codeSecurityService = new CodeSecurityService();

export default codeSecurityService;
