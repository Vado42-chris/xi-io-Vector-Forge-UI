/**
 * Click Tracking Service
 * Tracks user interactions for pattern analysis and UX improvement
 * Patent: VF-UI-002
 * Server Timestamp: 1737955680000
 */

interface ClickEvent {
  id: string;
  timestamp: number;
  elementType: string; // 'button' | 'menu' | 'tool' | 'panel' | 'canvas' | 'keyboard'
  elementId: string;
  elementLabel: string;
  action: string;
  context: {
    activeTool?: string;
    selectedLayerId?: string | null;
    activeTab?: string;
    [key: string]: any;
  };
  sessionId: string;
}

interface UserPattern {
  elementId: string;
  elementLabel: string;
  clickCount: number;
  lastUsed: number;
  averageTimeBetweenClicks: number;
  commonContexts: Record<string, number>;
}

class ClickTrackingService {
  private events: ClickEvent[] = [];
  private sessionId: string;
  private readonly STORAGE_KEY = 'vforge_click_tracking';
  private readonly MAX_EVENTS = 10000; // Keep last 10k events
  private readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadEvents();
    this.cleanupOldSessions();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadEvents(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          this.events = JSON.parse(stored);
          // Keep only recent events
          const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
          this.events = this.events.filter(e => e.timestamp > cutoff);
        }
      }
    } catch (error) {
      console.error('Failed to load click tracking events:', error);
      this.events = [];
    }
  }

  private saveEvents(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        // Keep only last MAX_EVENTS
        const eventsToSave = this.events.slice(-this.MAX_EVENTS);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(eventsToSave));
      }
    } catch (error) {
      console.error('Failed to save click tracking events:', error);
    }
  }

  private cleanupOldSessions(): void {
    const cutoff = Date.now() - this.SESSION_DURATION;
    // Remove events from old sessions (optional - can keep for analysis)
  }

  /**
   * Track a click/interaction event
   */
  trackClick(
    elementType: ClickEvent['elementType'],
    elementId: string,
    elementLabel: string,
    action: string,
    context: ClickEvent['context'] = {}
  ): void {
    const event: ClickEvent = {
      id: `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      elementType,
      elementId,
      elementLabel,
      action,
      context,
      sessionId: this.sessionId
    };

    this.events.push(event);
    this.saveEvents();

    // Log for debugging (can be removed in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Click Tracking]', elementType, elementLabel, action, context);
    }
  }

  /**
   * Get user patterns - most clicked elements
   */
  getUserPatterns(limit: number = 20): UserPattern[] {
    const patterns = new Map<string, {
      elementId: string;
      elementLabel: string;
      clicks: ClickEvent[];
    }>();

    this.events.forEach(event => {
      const key = `${event.elementType}:${event.elementId}`;
      if (!patterns.has(key)) {
        patterns.set(key, {
          elementId: event.elementId,
          elementLabel: event.elementLabel,
          clicks: []
        });
      }
      patterns.get(key)!.clicks.push(event);
    });

    const userPatterns: UserPattern[] = Array.from(patterns.values()).map(pattern => {
      const clicks = pattern.clicks;
      const sortedClicks = clicks.sort((a, b) => a.timestamp - b.timestamp);
      
      // Calculate average time between clicks
      let totalTimeBetween = 0;
      for (let i = 1; i < sortedClicks.length; i++) {
        totalTimeBetween += sortedClicks[i].timestamp - sortedClicks[i - 1].timestamp;
      }
      const avgTimeBetween = sortedClicks.length > 1 
        ? totalTimeBetween / (sortedClicks.length - 1) 
        : 0;

      // Count common contexts
      const contexts: Record<string, number> = {};
      clicks.forEach(click => {
        Object.entries(click.context).forEach(([key, value]) => {
          const contextKey = `${key}:${value}`;
          contexts[contextKey] = (contexts[contextKey] || 0) + 1;
        });
      });

      return {
        elementId: pattern.elementId,
        elementLabel: pattern.elementLabel,
        clickCount: clicks.length,
        lastUsed: Math.max(...clicks.map(c => c.timestamp)),
        averageTimeBetweenClicks: avgTimeBetween,
        commonContexts: contexts
      };
    });

    // Sort by click count, return top N
    return userPatterns
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, limit);
  }

  /**
   * Get click count for specific element
   */
  getClickCount(elementId: string): number {
    return this.events.filter(e => e.elementId === elementId).length;
  }

  /**
   * Get events for analysis
   */
  getEvents(filter?: Partial<ClickEvent>): ClickEvent[] {
    if (!filter) return [...this.events];
    
    return this.events.filter(event => {
      return Object.entries(filter).every(([key, value]) => {
        return (event as any)[key] === value;
      });
    });
  }

  /**
   * Clear all tracking data
   */
  clear(): void {
    this.events = [];
    this.saveEvents();
  }

  /**
   * Export data for analysis
   */
  exportData(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      totalEvents: this.events.length,
      events: this.events,
      patterns: this.getUserPatterns(),
      exportedAt: Date.now()
    }, null, 2);
  }
}

// Singleton instance
let _clickTrackingServiceInstance: ClickTrackingService | null = null;

export const clickTrackingService = (() => {
  if (!_clickTrackingServiceInstance) {
    _clickTrackingServiceInstance = new ClickTrackingService();
  }
  return _clickTrackingServiceInstance;
})();

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  (window as any).clickTrackingService = clickTrackingService;
}
