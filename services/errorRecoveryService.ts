/**
 * Error Recovery Service
 * Provides intelligent error messages, recovery suggestions, and error history
 * 
 * #hashtag: error-recovery service
 */

export interface ErrorContext {
  operation: string;
  component: string;
  file?: string;
  path?: string;
  errorType: string;
  originalError: Error | string;
  timestamp: number;
}

export interface ErrorRecovery {
  message: string;
  suggestions: string[];
  autoFixable: boolean;
  autoFixAction?: () => Promise<void>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorHistoryEntry {
  id: string;
  context: ErrorContext;
  recovery: ErrorRecovery;
  resolved: boolean;
  resolvedAt?: number;
  resolution?: string;
}

class ErrorRecoveryService {
  private errorHistory: ErrorHistoryEntry[] = [];
  private maxHistorySize = 100;
  private storageKey = 'vectorforge-error-history';

  constructor() {
    this.loadHistory();
  }

  /**
   * Analyze error and provide recovery suggestions
   */
  analyzeError(context: ErrorContext): ErrorRecovery {
    const errorMessage = context.originalError instanceof Error 
      ? context.originalError.message 
      : context.originalError.toString();

    const lowerError = errorMessage.toLowerCase();
    const suggestions: string[] = [];
    let autoFixable = false;
    let severity: ErrorRecovery['severity'] = 'medium';
    let autoFixAction: (() => Promise<void>) | undefined;

    // File system errors
    if (lowerError.includes('enoent') || lowerError.includes('not found') || lowerError.includes('does not exist')) {
      suggestions.push('Check if the file or directory path is correct');
      suggestions.push('Verify the file exists before performing the operation');
      suggestions.push('Check file permissions');
      severity = 'medium';
    }

    if (lowerError.includes('eacces') || lowerError.includes('permission denied') || lowerError.includes('access denied')) {
      suggestions.push('Check file permissions');
      suggestions.push('Verify you have write access to the target directory');
      suggestions.push('Try running with elevated permissions if needed');
      severity = 'high';
    }

    if (lowerError.includes('eexist') || lowerError.includes('already exists')) {
      suggestions.push('The file or directory already exists');
      suggestions.push('Choose a different name or delete the existing file first');
      suggestions.push('Use a different destination path');
      autoFixable = true;
      severity = 'low';
    }

    if (lowerError.includes('enospc') || lowerError.includes('no space')) {
      suggestions.push('Disk space is full');
      suggestions.push('Free up disk space and try again');
      suggestions.push('Check available storage');
      severity = 'high';
    }

    if (lowerError.includes('path traversal') || lowerError.includes('outside project')) {
      suggestions.push('The path is outside the allowed project directory');
      suggestions.push('Use relative paths within the project');
      suggestions.push('Check the path for security restrictions');
      severity = 'high';
    }

    // Network/API errors
    if (lowerError.includes('network') || lowerError.includes('fetch') || lowerError.includes('connection')) {
      suggestions.push('Check your internet connection');
      suggestions.push('Verify the server is running');
      suggestions.push('Try again in a few moments');
      severity = 'medium';
    }

    if (lowerError.includes('timeout')) {
      suggestions.push('The operation took too long');
      suggestions.push('Try with fewer files or a smaller operation');
      suggestions.push('Check system resources');
      severity = 'medium';
    }

    // Validation errors
    if (lowerError.includes('required') || lowerError.includes('missing')) {
      suggestions.push('Fill in all required fields');
      suggestions.push('Check that all necessary information is provided');
      severity = 'low';
    }

    if (lowerError.includes('invalid') || lowerError.includes('malformed')) {
      suggestions.push('Check the input format');
      suggestions.push('Verify the data is correctly formatted');
      severity = 'medium';
    }

    // Generic fallback
    if (suggestions.length === 0) {
      suggestions.push('Check the error message for details');
      suggestions.push('Verify all inputs are correct');
      suggestions.push('Try the operation again');
    }

    // Create user-friendly message
    const message = this.createUserFriendlyMessage(context, errorMessage);

    return {
      message,
      suggestions,
      autoFixable,
      autoFixAction,
      severity,
    };
  }

  /**
   * Create user-friendly error message
   */
  private createUserFriendlyMessage(context: ErrorContext, errorMessage: string): string {
    const lowerError = errorMessage.toLowerCase();

    // File not found
    if (lowerError.includes('enoent') || lowerError.includes('not found')) {
      if (context.file) {
        return `File not found: ${String(context.file)}`;
      }
      if (context.path) {
        return `Path not found: ${String(context.path)}`;
      }
      return 'File or directory not found';
    }

    // Permission denied
    if (lowerError.includes('eacces') || lowerError.includes('permission denied')) {
      return 'Permission denied. You may not have access to this file or directory.';
    }

    // Already exists
    if (lowerError.includes('eexist') || lowerError.includes('already exists')) {
      return 'File or directory already exists';
    }

    // No space
    if (lowerError.includes('enospc') || lowerError.includes('no space')) {
      return 'Not enough disk space available';
    }

    // Path traversal
    if (lowerError.includes('path traversal') || lowerError.includes('outside project')) {
      return 'Invalid path: Cannot access files outside the project directory';
    }

    // Network errors
    if (lowerError.includes('network') || lowerError.includes('fetch')) {
      return 'Network error: Could not connect to the server';
    }

    // Timeout
    if (lowerError.includes('timeout')) {
      return 'Operation timed out. The operation took too long to complete.';
    }

    // Generic
    return `Operation failed: ${errorMessage}`;
  }

  /**
   * Record error in history
   */
  recordError(context: ErrorContext, recovery: ErrorRecovery): string {
    const entryId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const entry: ErrorHistoryEntry = {
      id: entryId,
      context,
      recovery,
      resolved: false,
    };

    this.errorHistory.push(entry);

    // Trim history if too large
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(-this.maxHistorySize);
    }

    this.saveHistory();
    return entryId;
  }

  /**
   * Mark error as resolved
   */
  resolveError(errorId: string, resolution?: string): void {
    const entry = this.errorHistory.find(e => e.id === errorId);
    if (entry) {
      entry.resolved = true;
      entry.resolvedAt = Date.now();
      entry.resolution = resolution;
      this.saveHistory();
    }
  }

  /**
   * Get error history
   */
  getErrorHistory(includeResolved: boolean = false): ErrorHistoryEntry[] {
    if (includeResolved) {
      return [...this.errorHistory];
    }
    return this.errorHistory.filter(e => !e.resolved);
  }

  /**
   * Get error patterns (for analytics)
   */
  getErrorPatterns(): Array<{
    errorType: string;
    count: number;
    lastOccurrence: number;
    severity: string;
  }> {
    const patterns = new Map<string, {
      count: number;
      lastOccurrence: number;
      severity: string;
    }>();

    this.errorHistory.forEach(entry => {
      const key = entry.context.errorType;
      const existing = patterns.get(key);
      
      if (existing) {
        existing.count++;
        if (entry.context.timestamp > existing.lastOccurrence) {
          existing.lastOccurrence = entry.context.timestamp;
        }
      } else {
        patterns.set(key, {
          count: 1,
          lastOccurrence: entry.context.timestamp,
          severity: entry.recovery.severity,
        });
      }
    });

    return Array.from(patterns.entries()).map(([errorType, data]) => ({
      errorType,
      ...data,
    }));
  }

  /**
   * Clear error history
   */
  clearHistory(): void {
    this.errorHistory = [];
    this.saveHistory();
  }

  /**
   * Save history to localStorage
   */
  private saveHistory(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.errorHistory));
      } catch (error) {
        console.error('ErrorRecoveryService: Failed to save history:', error);
      }
    }
  }

  /**
   * Load history from localStorage
   */
  private loadHistory(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const historyStr = localStorage.getItem(this.storageKey);
        if (historyStr) {
          this.errorHistory = JSON.parse(historyStr);
        }
      } catch (error) {
        console.error('ErrorRecoveryService: Failed to load history:', error);
        this.errorHistory = [];
      }
    }
  }
}

export const errorRecoveryService = new ErrorRecoveryService();

