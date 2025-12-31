/**
 * Error Reporting Service
 * Tracks errors as we find them, categorizes by severity, links to fixes
 * 
 * #hashtag: error-reporting tracking fixes
 */

export type ErrorCategory = 'ui' | 'performance' | 'accessibility' | 'heuristic' | 'build' | 'runtime';
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FixStatus = 'open' | 'in-progress' | 'fixed' | 'verified' | 'wont-fix';

export interface ErrorReport {
  errorId: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  component: string;
  description: string;
  fixStatus: FixStatus;
  foundAt: number;
  fixedAt?: number;
  fixTime?: number; // Time to fix in minutes
  fixCommit?: string; // Git commit hash
  fixPR?: string; // PR number
  relatedIssues?: string[]; // Related issue IDs
  notes?: string;
}

class ErrorReportingService {
  private errors: Map<string, ErrorReport> = new Map();
  private storageKey = 'vectorforge-error-reports';
  private nextErrorId = 1;

  constructor() {
    this.loadErrors();
  }

  /**
   * Report an error
   */
  reportError(
    category: ErrorCategory,
    severity: ErrorSeverity,
    component: string,
    description: string,
    relatedIssues?: string[]
  ): string {
    const errorId = `ERR-${Date.now()}-${this.nextErrorId++}`;
    const error: ErrorReport = {
      errorId,
      category,
      severity,
      component,
      description,
      fixStatus: 'open',
      foundAt: Date.now(),
      relatedIssues,
    };

    this.errors.set(errorId, error);
    this.saveErrors();

    console.log(`ErrorReportingService: Reported ${errorId} - ${category}/${severity} in ${component}`);
    return errorId;
  }

  /**
   * Update error status
   */
  updateErrorStatus(
    errorId: string,
    status: FixStatus,
    notes?: string,
    fixCommit?: string,
    fixPR?: string
  ): boolean {
    const error = this.errors.get(errorId);
    if (!error) {
      console.warn(`ErrorReportingService: Error ${errorId} not found`);
      return false;
    }

    const wasFixed = error.fixStatus !== 'fixed' && status === 'fixed';
    const now = Date.now();

    error.fixStatus = status;
    if (notes) error.notes = notes;
    if (fixCommit) error.fixCommit = fixCommit;
    if (fixPR) error.fixPR = fixPR;

    if (wasFixed) {
      error.fixedAt = now;
      error.fixTime = Math.round((now - error.foundAt) / 60000); // Minutes
    }

    this.errors.set(errorId, error);
    this.saveErrors();

    return true;
  }

  /**
   * Get error by ID
   */
  getError(errorId: string): ErrorReport | undefined {
    return this.errors.get(errorId);
  }

  /**
   * Get all errors
   */
  getAllErrors(): ErrorReport[] {
    return Array.from(this.errors.values());
  }

  /**
   * Get errors by status
   */
  getErrorsByStatus(status: FixStatus): ErrorReport[] {
    return Array.from(this.errors.values()).filter(e => e.fixStatus === status);
  }

  /**
   * Get errors by category
   */
  getErrorsByCategory(category: ErrorCategory): ErrorReport[] {
    return Array.from(this.errors.values()).filter(e => e.category === category);
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): ErrorReport[] {
    return Array.from(this.errors.values()).filter(e => e.severity === severity);
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    byStatus: Record<FixStatus, number>;
    byCategory: Record<ErrorCategory, number>;
    bySeverity: Record<ErrorSeverity, number>;
    averageFixTime: number;
    totalFixTime: number;
  } {
    const errors = Array.from(this.errors.values());
    const byStatus: Record<FixStatus, number> = {
      'open': 0,
      'in-progress': 0,
      'fixed': 0,
      'verified': 0,
      'wont-fix': 0,
    };
    const byCategory: Record<ErrorCategory, number> = {
      'ui': 0,
      'performance': 0,
      'accessibility': 0,
      'heuristic': 0,
      'build': 0,
      'runtime': 0,
    };
    const bySeverity: Record<ErrorSeverity, number> = {
      'low': 0,
      'medium': 0,
      'high': 0,
      'critical': 0,
    };

    let totalFixTime = 0;
    let fixedCount = 0;

    errors.forEach(error => {
      byStatus[error.fixStatus]++;
      byCategory[error.category]++;
      bySeverity[error.severity]++;

      if (error.fixTime) {
        totalFixTime += error.fixTime;
        fixedCount++;
      }
    });

    return {
      total: errors.length,
      byStatus,
      byCategory,
      bySeverity,
      averageFixTime: fixedCount > 0 ? totalFixTime / fixedCount : 0,
      totalFixTime,
    };
  }

  /**
   * Save errors to localStorage
   */
  private saveErrors(): void {
    try {
      const errors = Array.from(this.errors.values());
      localStorage.setItem(this.storageKey, JSON.stringify(errors));
    } catch (error) {
      console.warn('ErrorReportingService: Failed to save errors:', error);
    }
  }

  /**
   * Load errors from localStorage
   */
  private loadErrors(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const errors: ErrorReport[] = JSON.parse(data);
        errors.forEach(error => {
          this.errors.set(error.errorId, error);
        });
      }
    } catch (error) {
      console.warn('ErrorReportingService: Failed to load errors:', error);
    }
  }

  /**
   * Clear all errors (for testing/reset)
   */
  clearErrors(): void {
    this.errors.clear();
    localStorage.removeItem(this.storageKey);
  }
}

export const errorReportingService = new ErrorReportingService();

