// services/workTrackingService.ts

/**
 * @module WorkTrackingService
 * @description
 * Tracks all work performed on VectorForge project for seed001 Blockchain records.
 * Includes work sessions, time spent, calculations per minute, and activity logs.
 * 
 * Date: December 27, 2025
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 * Location: Saskatoon, Saskatchewan, Canada, S7J 3E8
 */

export interface WorkSession {
  id: string;
  startTime: number; // Server timestamp (ms)
  endTime?: number; // Server timestamp (ms)
  duration: number; // Duration in milliseconds
  userId?: string;
  component: string; // Component being worked on
  task?: string; // Related task ID
  activity: string; // Activity description
  calculations: number; // Number of calculations performed
  calculationsPerMinute: number; // Calculated rate
  metadata?: Record<string, any>;
}

export interface WorkReport {
  date: string; // ISO date string
  serverTimestamp: number; // Server timestamp for validation
  totalSessions: number;
  totalDuration: number; // Total milliseconds
  totalCalculations: number;
  averageCalculationsPerMinute: number;
  sessions: WorkSession[];
  byComponent: Record<string, { sessions: number; duration: number; calculations: number }>;
  byActivity: Record<string, { sessions: number; duration: number; calculations: number }>;
}

const WORK_STORAGE_KEY = 'vectorforge_work_sessions';
const MAX_STORED_SESSIONS = 10000;

export class WorkTrackingService {
  private sessions: WorkSession[] = [];
  private currentSession: WorkSession | null = null;
  private calculationCount: number = 0;
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(WORK_STORAGE_KEY);
      if (stored) {
        try {
          this.sessions = JSON.parse(stored);
          if (this.sessions.length > MAX_STORED_SESSIONS) {
            this.sessions = this.sessions.slice(-MAX_STORED_SESSIONS);
          }
          console.log(`WorkTrackingService: Loaded ${this.sessions.length} work sessions.`);
        } catch (error) {
          console.error('WorkTrackingService: Failed to parse stored sessions:', error);
          this.sessions = [];
        }
      }
    }
    this.initialized = true;
  }

  /**
   * Gets current server timestamp for validation.
   * In production, this would call a server endpoint.
   */
  private getServerTimestamp(): number {
    // For now, use client time with offset calculation
    // In production, this should be fetched from server
    return Date.now();
  }

  /**
   * Starts a new work session.
   * @param component Component being worked on.
   * @param activity Activity description.
   * @param taskId Optional related task ID.
   * @param userId Optional user ID.
   */
  public startSession(
    component: string,
    activity: string,
    taskId?: string,
    userId?: string
  ): string {
    if (!this.initialized) {
      console.warn('WorkTrackingService: Not initialized. Cannot start session.');
      throw new Error('WorkTrackingService not initialized.');
    }

    // End current session if exists
    if (this.currentSession) {
      this.endSession();
    }

    const sessionId = `work-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const serverTimestamp = this.getServerTimestamp();

    this.currentSession = {
      id: sessionId,
      startTime: serverTimestamp,
      duration: 0,
      userId,
      component,
      task: taskId,
      activity,
      calculations: 0,
      calculationsPerMinute: 0,
    };

    this.calculationCount = 0;
    console.log(`WorkTrackingService: Started session ${sessionId} for ${component}.${activity}`);
    return sessionId;
  }

  /**
   * Ends the current work session.
   */
  public endSession(): void {
    if (!this.currentSession) {
      return;
    }

    const serverTimestamp = this.getServerTimestamp();
    const duration = serverTimestamp - this.currentSession.startTime;
    const minutes = duration / 60000;
    const calculationsPerMinute = minutes > 0 ? this.calculationCount / minutes : 0;

    this.currentSession.endTime = serverTimestamp;
    this.currentSession.duration = duration;
    this.currentSession.calculations = this.calculationCount;
    this.currentSession.calculationsPerMinute = calculationsPerMinute;

    this.sessions.push({ ...this.currentSession });
    this.persistSessions();

    console.log(
      `WorkTrackingService: Ended session ${this.currentSession.id}. ` +
      `Duration: ${(duration / 1000).toFixed(2)}s, ` +
      `Calculations: ${this.calculationCount}, ` +
      `CPM: ${calculationsPerMinute.toFixed(2)}`
    );

    this.currentSession = null;
    this.calculationCount = 0;
  }

  /**
   * Records a calculation during the current session.
   */
  public recordCalculation(description?: string): void {
    if (this.currentSession) {
      this.calculationCount++;
      // Update calculations per minute in real-time
      const duration = Date.now() - this.currentSession.startTime;
      const minutes = duration / 60000;
      if (minutes > 0) {
        this.currentSession.calculationsPerMinute = this.calculationCount / minutes;
      }
    }
  }

  /**
   * Gets all work sessions, optionally filtered.
   */
  public getSessions(filters?: {
    component?: string;
    activity?: string;
    userId?: string;
    startTime?: number;
    endTime?: number;
  }): WorkSession[] {
    let filtered = [...this.sessions];

    if (filters?.component) {
      filtered = filtered.filter(s => s.component === filters.component);
    }
    if (filters?.activity) {
      filtered = filtered.filter(s => s.activity === filters.activity);
    }
    if (filters?.userId) {
      filtered = filtered.filter(s => s.userId === filters.userId);
    }
    if (filters?.startTime) {
      filtered = filtered.filter(s => s.startTime >= filters.startTime!);
    }
    if (filters?.endTime) {
      filtered = filtered.filter(s => (s.endTime || s.startTime) <= filters.endTime!);
    }

    return filtered.sort((a, b) => b.startTime - a.startTime);
  }

  /**
   * Generates a comprehensive work report for seed001 Blockchain records.
   * @param timeRange Optional time range (defaults to all time).
   * @returns Work report with all tracking data.
   */
  public generateWorkReport(timeRange?: { start: number; end: number }): WorkReport {
    const sessions = timeRange
      ? this.getSessions({ startTime: timeRange.start, endTime: timeRange.end })
      : this.sessions;

    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
    const totalCalculations = sessions.reduce((sum, s) => sum + s.calculations, 0);
    const totalMinutes = totalDuration / 60000;
    const averageCalculationsPerMinute = totalMinutes > 0 ? totalCalculations / totalMinutes : 0;

    const byComponent: Record<string, { sessions: number; duration: number; calculations: number }> = {};
    const byActivity: Record<string, { sessions: number; duration: number; calculations: number }> = {};

    sessions.forEach(session => {
      // By component
      if (!byComponent[session.component]) {
        byComponent[session.component] = { sessions: 0, duration: 0, calculations: 0 };
      }
      byComponent[session.component].sessions++;
      byComponent[session.component].duration += session.duration;
      byComponent[session.component].calculations += session.calculations;

      // By activity
      if (!byActivity[session.activity]) {
        byActivity[session.activity] = { sessions: 0, duration: 0, calculations: 0 };
      }
      byActivity[session.activity].sessions++;
      byActivity[session.activity].duration += session.duration;
      byActivity[session.activity].calculations += session.calculations;
    });

    return {
      date: new Date().toISOString(),
      serverTimestamp: this.getServerTimestamp(),
      totalSessions: sessions.length,
      totalDuration,
      totalCalculations,
      averageCalculationsPerMinute,
      sessions,
      byComponent,
      byActivity,
    };
  }

  /**
   * Generates a work tracking report string for inclusion in project reports.
   * @returns Formatted work tracking report.
   */
  public generateWorkReportString(): string {
    const report = this.generateWorkReport();
    const totalHours = (report.totalDuration / 3600000).toFixed(2);
    const totalMinutes = (report.totalDuration / 60000).toFixed(2);

    return `
=== WORK TRACKING REPORT (seed001 Blockchain) ===
Date: ${new Date(report.date).toLocaleString()}
Server Timestamp: ${new Date(report.serverTimestamp).toISOString()}
Server Timestamp (ms): ${report.serverTimestamp}

Total Sessions: ${report.totalSessions}
Total Duration: ${totalHours} hours (${totalMinutes} minutes)
Total Calculations: ${report.totalCalculations.toLocaleString()}
Average Calculations Per Minute: ${report.averageCalculationsPerMinute.toFixed(2)}

Work by Component:
${Object.entries(report.byComponent)
  .map(([component, stats]) => {
    const hours = (stats.duration / 3600000).toFixed(2);
    const cpm = stats.duration > 0 ? (stats.calculations / (stats.duration / 60000)).toFixed(2) : '0.00';
    return `  ${component}: ${stats.sessions} sessions, ${hours}h, ${stats.calculations} calc, ${cpm} CPM`;
  })
  .join('\n')}

Work by Activity:
${Object.entries(report.byActivity)
  .map(([activity, stats]) => {
    const hours = (stats.duration / 3600000).toFixed(2);
    const cpm = stats.duration > 0 ? (stats.calculations / (stats.duration / 60000)).toFixed(2) : '0.00';
    return `  ${activity}: ${stats.sessions} sessions, ${hours}h, ${stats.calculations} calc, ${cpm} CPM`;
  })
  .join('\n')}

Recent Sessions (last 10):
${report.sessions.slice(0, 10).map(s => {
  const duration = (s.duration / 1000).toFixed(2);
  return `  [${new Date(s.startTime).toLocaleTimeString()}] ${s.component}.${s.activity}: ${duration}s, ${s.calculations} calc, ${s.calculationsPerMinute.toFixed(2)} CPM`;
}).join('\n')}

=== END WORK TRACKING REPORT ===
    `.trim();
  }

  private persistSessions(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        // Trim to max if needed
        if (this.sessions.length > MAX_STORED_SESSIONS) {
          this.sessions = this.sessions.slice(-MAX_STORED_SESSIONS);
        }
        localStorage.setItem(WORK_STORAGE_KEY, JSON.stringify(this.sessions));
      } catch (error) {
        console.error('WorkTrackingService: Failed to persist sessions:', error);
      }
    }
  }

  /**
   * Clears all work sessions (use with caution).
   */
  public clearSessions(): void {
    this.sessions = [];
    this.persistSessions();
    console.log('WorkTrackingService: All sessions cleared.');
  }
}

export const workTrackingService = new WorkTrackingService();

