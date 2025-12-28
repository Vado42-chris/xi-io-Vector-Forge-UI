/**
 * Error Logger Service
 * Centralized error logging and tracking
 * Part of Patch 5: Error Logging & Intelligence
 */

export interface ErrorLog {
  id: string;
  timestamp: number;
  type: 'error' | 'warning' | 'info' | 'security';
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
}

export interface ErrorLogFilter {
  type?: ErrorLog['type'];
  startTime?: number;
  endTime?: number;
  userId?: string;
  sessionId?: string;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 1000;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    if (typeof window !== 'undefined') {
      // Unhandled errors
      window.addEventListener('error', (event) => {
        this.log({
          type: 'error',
          message: event.message || 'Unknown error',
          stack: event.error?.stack,
          context: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        });
      });

      // Unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.log({
          type: 'error',
          message: `Unhandled promise rejection: ${event.reason}`,
          stack: event.reason?.stack,
          context: {
            reason: String(event.reason),
          },
        });
      });
    }
  }

  /**
   * Log an error
   */
  log(error: Omit<ErrorLog, 'id' | 'timestamp' | 'sessionId'>): string {
    const logEntry: ErrorLog = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      ...error,
    };

    this.logs.push(logEntry);

    // Limit logs array size
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Persist to localStorage
    this.persistLogs();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorLogger]', logEntry);
    }

    return logEntry.id;
  }

  /**
   * Get error logs
   */
  getLogs(filter?: ErrorLogFilter): ErrorLog[] {
    let filtered = [...this.logs];

    if (filter) {
      if (filter.type) {
        filtered = filtered.filter(log => log.type === filter.type);
      }
      if (filter.startTime) {
        filtered = filtered.filter(log => log.timestamp >= filter.startTime!);
      }
      if (filter.endTime) {
        filtered = filtered.filter(log => log.timestamp <= filter.endTime!);
      }
      if (filter.userId) {
        filtered = filtered.filter(log => log.userId === filter.userId);
      }
      if (filter.sessionId) {
        filtered = filtered.filter(log => log.sessionId === filter.sessionId);
      }
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get error log by ID
   */
  getLog(id: string): ErrorLog | undefined {
    return this.logs.find(log => log.id === id);
  }

  /**
   * Clear error logs
   */
  clearLogs(): void {
    this.logs = [];
    this.persistLogs();
  }

  /**
   * Export error logs
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['id', 'timestamp', 'type', 'message', 'stack', 'context', 'userAgent', 'url'];
      const rows = this.logs.map(log => [
        log.id,
        new Date(log.timestamp).toISOString(),
        log.type,
        log.message,
        log.stack || '',
        JSON.stringify(log.context || {}),
        log.userAgent || '',
        log.url || '',
      ]);
      return [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
    }
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Persist logs to localStorage
   */
  private persistLogs(): void {
    if (typeof window !== 'undefined') {
      try {
        const logsToStore = this.logs.slice(-100); // Store last 100 logs
        localStorage.setItem('errorLogs', JSON.stringify(logsToStore));
        localStorage.setItem('errorLogSessionId', this.sessionId);
      } catch (error) {
        console.warn('Failed to persist error logs:', error);
      }
    }
  }

  /**
   * Load logs from localStorage
   */
  loadLogs(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('errorLogs');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            this.logs = parsed;
          }
        }
        const storedSessionId = localStorage.getItem('errorLogSessionId');
        if (storedSessionId) {
          this.sessionId = storedSessionId;
        }
      } catch (error) {
        console.warn('Failed to load error logs:', error);
      }
    }
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Get error statistics
   */
  getStatistics(): {
    total: number;
    byType: Record<string, number>;
    recent: number;
  } {
    const byType: Record<string, number> = {};
    this.logs.forEach(log => {
      byType[log.type] = (byType[log.type] || 0) + 1;
    });

    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recent = this.logs.filter(log => log.timestamp >= oneHourAgo).length;

    return {
      total: this.logs.length,
      byType,
      recent,
    };
  }
}

// Singleton instance
export const errorLogger = new ErrorLogger();

// Load existing logs on initialization
if (typeof window !== 'undefined') {
  errorLogger.loadLogs();
}

export default errorLogger;

