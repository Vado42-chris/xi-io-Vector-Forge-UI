// services/clickTrackingService.ts

/**
 * @module ClickTrackingService
 * @description
 * Tracks all user interactions (clicks, hovers, etc.) in VectorForge.
 * All reports must include click tracking data.
 * 
 * Date: December 27, 2025
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 */

export interface ClickEvent {
  id: string;
  timestamp: number;
  type: 'click' | 'hover' | 'focus' | 'keypress' | 'drag' | 'drop';
  target: string; // Element ID or selector
  component: string; // Component name (e.g., 'ActionCenter', 'TaskCard')
  action: string; // Action performed (e.g., 'execute-action', 'open-task')
  context?: Record<string, any>; // Additional context
  sessionId: string;
  userId?: string;
}

export interface ClickAnalytics {
  totalClicks: number;
  clicksByComponent: Record<string, number>;
  clicksByAction: Record<string, number>;
  clicksByType: Record<string, number>;
  topComponents: Array<{ component: string; count: number }>;
  topActions: Array<{ action: string; count: number }>;
  timeRange: { start: number; end: number };
}

const CLICK_STORAGE_KEY = 'vectorforge_clicks';
const MAX_STORED_EVENTS = 10000; // Limit stored events to prevent excessive storage

export class ClickTrackingService {
  private events: ClickEvent[] = [];
  private sessionId: string;
  private initialized: boolean = false;

  constructor() {
    this.sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.initialize();
  }

  private initialize(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(CLICK_STORAGE_KEY);
      if (stored) {
        try {
          this.events = JSON.parse(stored);
          // Trim to max events if needed
          if (this.events.length > MAX_STORED_EVENTS) {
            this.events = this.events.slice(-MAX_STORED_EVENTS);
          }
          console.log(`ClickTrackingService: Loaded ${this.events.length} click events.`);
        } catch (error) {
          console.error('ClickTrackingService: Failed to parse stored clicks:', error);
          this.events = [];
        }
      }
    }
    this.initialized = true;
  }

  /**
   * Tracks a click or interaction event.
   * @param event The event to track.
   */
  public trackEvent(event: Omit<ClickEvent, 'id' | 'timestamp' | 'sessionId'>): void {
    if (!this.initialized) {
      console.warn('ClickTrackingService: Not initialized. Cannot track event.');
      return;
    }

    const newEvent: ClickEvent = {
      id: `click-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      ...event,
    };

    this.events.push(newEvent);

    // Trim if over limit
    if (this.events.length > MAX_STORED_EVENTS) {
      this.events = this.events.slice(-MAX_STORED_EVENTS);
    }

    this.persistEvents();
  }

  /**
   * Tracks a click event (convenience method).
   * @param component Component name.
   * @param action Action performed.
   * @param target Target element.
   * @param context Additional context.
   */
  public trackClick(
    component: string,
    action: string,
    target: string,
    context?: Record<string, any>
  ): void {
    this.trackEvent({
      type: 'click',
      component,
      action,
      target,
      context,
    });
  }

  /**
   * Gets all events, optionally filtered.
   * @param filters Optional filters.
   * @returns Array of events.
   */
  public getEvents(filters?: {
    component?: string;
    action?: string;
    type?: ClickEvent['type'];
    startTime?: number;
    endTime?: number;
  }): ClickEvent[] {
    let filtered = [...this.events];

    if (filters?.component) {
      filtered = filtered.filter(e => e.component === filters.component);
    }
    if (filters?.action) {
      filtered = filtered.filter(e => e.action === filters.action);
    }
    if (filters?.type) {
      filtered = filtered.filter(e => e.type === filters.type);
    }
    if (filters?.startTime) {
      filtered = filtered.filter(e => e.timestamp >= filters.startTime!);
    }
    if (filters?.endTime) {
      filtered = filtered.filter(e => e.timestamp <= filters.endTime!);
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Generates analytics from tracked events.
   * @param timeRange Optional time range (defaults to all time).
   * @returns Analytics object.
   */
  public generateAnalytics(timeRange?: { start: number; end: number }): ClickAnalytics {
    const events = timeRange
      ? this.getEvents({ startTime: timeRange.start, endTime: timeRange.end })
      : this.events;

    const clicksByComponent: Record<string, number> = {};
    const clicksByAction: Record<string, number> = {};
    const clicksByType: Record<string, number> = {};

    events.forEach(event => {
      clicksByComponent[event.component] = (clicksByComponent[event.component] || 0) + 1;
      clicksByAction[event.action] = (clicksByAction[event.action] || 0) + 1;
      clicksByType[event.type] = (clicksByType[event.type] || 0) + 1;
    });

    const topComponents = Object.entries(clicksByComponent)
      .map(([component, count]) => ({ component, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topActions = Object.entries(clicksByAction)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalClicks: events.length,
      clicksByComponent,
      clicksByAction,
      clicksByType,
      topComponents,
      topActions,
      timeRange: timeRange || {
        start: events.length > 0 ? Math.min(...events.map(e => e.timestamp)) : Date.now(),
        end: events.length > 0 ? Math.max(...events.map(e => e.timestamp)) : Date.now(),
      },
    };
  }

  /**
   * Generates a click tracking report for inclusion in project reports.
   * @returns Formatted click tracking report string.
   */
  public generateClickReport(): string {
    const analytics = this.generateAnalytics();
    const recentEvents = this.getEvents().slice(0, 20);

    return `
=== CLICK TRACKING REPORT ===
Date: ${new Date().toISOString()}
Session ID: ${this.sessionId}
Total Events: ${analytics.totalClicks}

Top Components:
${analytics.topComponents.map(c => `  ${c.component}: ${c.count} clicks`).join('\n')}

Top Actions:
${analytics.topActions.map(a => `  ${a.action}: ${a.count} events`).join('\n')}

Events by Type:
${Object.entries(analytics.clicksByType).map(([type, count]) => `  ${type}: ${count}`).join('\n')}

Recent Events (last 20):
${recentEvents.map(e => `  [${new Date(e.timestamp).toLocaleTimeString()}] ${e.component}.${e.action} (${e.type})`).join('\n')}

=== END CLICK REPORT ===
    `.trim();
  }

  private persistEvents(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(CLICK_STORAGE_KEY, JSON.stringify(this.events));
      } catch (error) {
        console.error('ClickTrackingService: Failed to persist clicks:', error);
      }
    }
  }

  /**
   * Clears all tracked events (use with caution).
   */
  public clearEvents(): void {
    this.events = [];
    this.persistEvents();
    console.log('ClickTrackingService: All events cleared.');
  }
}

export const clickTrackingService = new ClickTrackingService();

