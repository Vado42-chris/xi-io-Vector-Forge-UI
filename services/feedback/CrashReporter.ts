/**
 * Crash Reporter Service
 * 
 * Captures and reports crashes to backend
 * Privacy-first: Opt-in, anonymized, user-friendly
 * 
 * Philosophy: Plain language first, teaching with humility and humor
 */

import configService from '../config/ConfigService';
import { loggingService } from '../logging/LoggingService';
import notificationService from '../notification/NotificationService';
import authService from '../auth/AuthService';

export interface CrashReport {
  id: string;
  timestamp: number;
  error: {
    message: string;
    stack: string;
    type: string;
  };
  context: {
    userAgent: string;
    url: string;
    viewport: { width: number; height: number };
    state?: Record<string, unknown>; // Optional, user consent required
  };
  userActions: string[]; // Last 10 actions before crash
  version: string;
  build: string;
  optIn: boolean;
}

class CrashReporter {
  private enabled: boolean = false;
  private crashQueue: CrashReport[] = [];
  private userActions: string[] = [];
  private maxUserActions: number = 10;
  private version: string = '1.0.0-alpha.1';
  private build: string = new Date().toISOString().split('T')[0].replace(/-/g, '');

  constructor() {
    // Check if crash reporting is enabled (from localStorage)
    this.loadSettings();
    
    // Only initialize if enabled
    if (this.enabled) {
      this.initialize();
    }
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      const stored = localStorage.getItem('xibalba_crash_reporting_enabled');
      this.enabled = stored === 'true';
    } catch (error) {
      // localStorage not available, default to disabled
      this.enabled = false;
    }
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('xibalba_crash_reporting_enabled', String(this.enabled));
    } catch (error) {
      loggingService.warn('Failed to save crash reporting settings', { error });
    }
  }

  /**
   * Initialize crash reporting
   */
  private initialize(): void {
    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      this.captureUnhandledError(event.error, event.message, event.filename, event.lineno);
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureUnhandledRejection(event.reason);
    });

    loggingService.info('Crash reporting initialized');
  }

  /**
   * Enable crash reporting
   */
  enable(): void {
    if (this.enabled) {
      return;
    }

    this.enabled = true;
    this.saveSettings();
    this.initialize();
    
    loggingService.info('Crash reporting enabled');
    notificationService.info(
      'Crash Reporting Enabled',
      'We\'ll help improve VectorFORGE by reporting crashes. Your privacy is protected.',
      3000
    );
  }

  /**
   * Disable crash reporting
   */
  disable(): void {
    this.enabled = false;
    this.saveSettings();
    
    loggingService.info('Crash reporting disabled');
    notificationService.info(
      'Crash Reporting Disabled',
      'Crash reporting has been turned off.',
      2000
    );
  }

  /**
   * Check if crash reporting is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Track user action (for crash context)
   */
  trackAction(action: string): void {
    if (!this.enabled) {
      return;
    }

    this.userActions.push(`${new Date().toISOString()}: ${action}`);
    
    // Keep only last N actions
    if (this.userActions.length > this.maxUserActions) {
      this.userActions.shift();
    }
  }

  /**
   * Capture unhandled error
   */
  private captureUnhandledError(
    error: Error | null,
    message?: string,
    filename?: string,
    lineno?: number
  ): void {
    if (!this.enabled) {
      return;
    }

    const crashReport: CrashReport = {
      id: `crash-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      error: {
        message: error?.message || message || 'Unknown error',
        stack: error?.stack || `at ${filename}:${lineno}`,
        type: error?.name || 'Error'
      },
      context: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
        // state: omitted for privacy (requires explicit user consent)
      },
      userActions: [...this.userActions],
      version: this.version,
      build: this.build,
      optIn: true
    };

    this.queueCrashReport(crashReport);
  }

  /**
   * Capture unhandled promise rejection
   */
  private captureUnhandledRejection(reason: unknown): void {
    if (!this.enabled) {
      return;
    }

    const error = reason instanceof Error 
      ? reason 
      : new Error(String(reason));

    const crashReport: CrashReport = {
      id: `crash-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      error: {
        message: error.message || 'Unhandled promise rejection',
        stack: error.stack || 'No stack trace available',
        type: 'UnhandledRejection'
      },
      context: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      userActions: [...this.userActions],
      version: this.version,
      build: this.build,
      optIn: true
    };

    this.queueCrashReport(crashReport);
  }

  /**
   * Capture React error (called from Error Boundary)
   */
  captureReactError(error: Error, errorInfo: React.ErrorInfo): void {
    if (!this.enabled) {
      return;
    }

    const crashReport: CrashReport = {
      id: `crash-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      error: {
        message: error.message,
        stack: error.stack || errorInfo.componentStack || 'No stack trace available',
        type: 'ReactError'
      },
      context: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      userActions: [...this.userActions],
      version: this.version,
      build: this.build,
      optIn: true
    };

    this.queueCrashReport(crashReport);
  }

  /**
   * Queue crash report (for offline support)
   */
  private queueCrashReport(crashReport: CrashReport): void {
    this.crashQueue.push(crashReport);
    
    // Try to send immediately
    this.sendCrashReport(crashReport).catch(() => {
      // If send fails, it's already in queue, will retry later
      loggingService.warn('Crash report queued for later sending', { crashId: crashReport.id });
    });
  }

  /**
   * Send crash report to backend
   */
  async sendCrashReport(crashReport: CrashReport): Promise<void> {
    try {
      const backendUrl = configService.getBackendApiUrl('feedback/crash');
      const authHeader = authService.getAuthHeader();
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), configService.getApiRequestTimeout());

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify(crashReport),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to send crash report: ${response.statusText}`);
      }

      // Remove from queue on success
      this.crashQueue = this.crashQueue.filter(cr => cr.id !== crashReport.id);
      
      loggingService.info('Crash report sent successfully', { crashId: crashReport.id });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      loggingService.error('Failed to send crash report', err, { crashId: crashReport.id });
      
      // Keep in queue for retry
      throw err;
    }
  }

  /**
   * Retry sending queued crash reports
   */
  async retryQueuedReports(): Promise<void> {
    if (this.crashQueue.length === 0) {
      return;
    }

    loggingService.info('Retrying queued crash reports', { count: this.crashQueue.length });

    const reports = [...this.crashQueue];
    for (const report of reports) {
      try {
        await this.sendCrashReport(report);
      } catch (error) {
        // Keep in queue if still failing
        loggingService.warn('Failed to retry crash report', { crashId: report.id });
      }
    }
  }
}

// Export singleton instance
export const crashReporter = new CrashReporter();
export default crashReporter;

