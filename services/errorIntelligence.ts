/**
 * Error Intelligence Service
 * Analyzes errors and provides actionable insights
 * Part of Patch 5: Error Logging & Intelligence
 */

import { errorLogger, ErrorLog } from './errorLogger';

export interface ErrorPattern {
  id: string;
  pattern: string | RegExp;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestedFix?: string;
  frequency: number;
  firstSeen: number;
  lastSeen: number;
}

export interface ErrorInsight {
  type: 'pattern' | 'trend' | 'recommendation' | 'warning';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1
  suggestedActions: string[];
  relatedErrors: string[];
}

class ErrorIntelligence {
  private patterns: Map<string, ErrorPattern> = new Map();
  private knownPatterns: ErrorPattern[] = [
    {
      id: 'network-error',
      pattern: /(fetch|XMLHttpRequest|network|connection|timeout)/i,
      category: 'network',
      severity: 'medium',
      description: 'Network-related error',
      suggestedFix: 'Check network connection and API endpoints',
      frequency: 0,
      firstSeen: 0,
      lastSeen: 0,
    },
    {
      id: 'type-error',
      pattern: /(TypeError|Cannot read property|undefined is not)/i,
      category: 'runtime',
      severity: 'high',
      description: 'Type error - accessing undefined/null properties',
      suggestedFix: 'Add null checks and type guards',
      frequency: 0,
      firstSeen: 0,
      lastSeen: 0,
    },
    {
      id: 'reference-error',
      pattern: /(ReferenceError|is not defined)/i,
      category: 'runtime',
      severity: 'high',
      description: 'Reference error - undefined variable or function',
      suggestedFix: 'Check variable declarations and imports',
      frequency: 0,
      firstSeen: 0,
      lastSeen: 0,
    },
    {
      id: 'syntax-error',
      pattern: /(SyntaxError|Unexpected token|Parse error)/i,
      category: 'syntax',
      severity: 'critical',
      description: 'Syntax error in code',
      suggestedFix: 'Review code syntax and check for missing brackets/quotes',
      frequency: 0,
      firstSeen: 0,
      lastSeen: 0,
    },
    {
      id: 'security-violation',
      pattern: /(security|violation|CSP|Content Security Policy)/i,
      category: 'security',
      severity: 'high',
      description: 'Security policy violation',
      suggestedFix: 'Review security policies and allowed resources',
      frequency: 0,
      firstSeen: 0,
      lastSeen: 0,
    },
  ];

  /**
   * Analyze error logs and generate insights
   */
  analyzeErrors(): ErrorInsight[] {
    const logs = errorLogger.getLogs();
    const insights: ErrorInsight[] = [];

    // Detect patterns
    const patternInsights = this.detectPatterns(logs);
    insights.push(...patternInsights);

    // Detect trends
    const trendInsights = this.detectTrends(logs);
    insights.push(...trendInsights);

    // Generate recommendations
    const recommendationInsights = this.generateRecommendations(logs);
    insights.push(...recommendationInsights);

    return insights.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  /**
   * Detect error patterns
   */
  private detectPatterns(logs: ErrorLog[]): ErrorInsight[] {
    const insights: ErrorInsight[] = [];
    const patternCounts: Map<string, number> = new Map();

    // Count pattern matches
    logs.forEach(log => {
      this.knownPatterns.forEach(pattern => {
        const patternMatch = typeof pattern.pattern === 'string'
          ? log.message.includes(pattern.pattern)
          : pattern.pattern.test(log.message);

        if (patternMatch) {
          patternCounts.set(pattern.id, (patternCounts.get(pattern.id) || 0) + 1);
          
          // Update pattern metadata
          if (!this.patterns.has(pattern.id)) {
            this.patterns.set(pattern.id, {
              ...pattern,
              frequency: 0,
              firstSeen: log.timestamp,
              lastSeen: log.timestamp,
            });
          }

          const storedPattern = this.patterns.get(pattern.id)!;
          storedPattern.frequency++;
          storedPattern.lastSeen = Math.max(storedPattern.lastSeen, log.timestamp);
          storedPattern.firstSeen = Math.min(storedPattern.firstSeen, log.timestamp);
        }
      });
    });

    // Generate insights for frequent patterns
    patternCounts.forEach((count, patternId) => {
      if (count >= 3) {
        const pattern = this.patterns.get(patternId) || this.knownPatterns.find(p => p.id === patternId)!;
        insights.push({
          type: 'pattern',
          title: `Recurring ${pattern.category} error detected`,
          description: `${pattern.description}. Occurred ${count} times.`,
          severity: pattern.severity,
          confidence: Math.min(1, count / 10),
          suggestedActions: pattern.suggestedFix ? [pattern.suggestedFix] : [],
          relatedErrors: logs
            .filter(log => {
              const match = typeof pattern.pattern === 'string'
                ? log.message.includes(pattern.pattern)
                : pattern.pattern.test(log.message);
              return match;
            })
            .slice(0, 5)
            .map(log => log.id),
        });
      }
    });

    return insights;
  }

  /**
   * Detect error trends
   */
  private detectTrends(logs: ErrorLog[]): ErrorInsight[] {
    const insights: ErrorInsight[] = [];

    if (logs.length < 5) {
      return insights;
    }

    // Group by hour
    const hourlyCounts: Map<number, number> = new Map();
    logs.forEach(log => {
      const hour = Math.floor(log.timestamp / (60 * 60 * 1000));
      hourlyCounts.set(hour, (hourlyCounts.get(hour) || 0) + 1);
    });

    // Detect increasing trend
    const recentHours = Array.from(hourlyCounts.keys()).sort((a, b) => b - a).slice(0, 3);
    if (recentHours.length >= 2) {
      const counts = recentHours.map(h => hourlyCounts.get(h) || 0);
      const isIncreasing = counts.every((count, i) => i === 0 || count >= counts[i - 1] * 0.8);

      if (isIncreasing && counts[0] > 5) {
        insights.push({
          type: 'trend',
          title: 'Increasing error rate detected',
          description: `Error frequency has increased to ${counts[0]} errors per hour`,
          severity: counts[0] > 20 ? 'high' : 'medium',
          confidence: 0.7,
          suggestedActions: [
            'Review recent code changes',
            'Check system resources',
            'Monitor error patterns',
          ],
          relatedErrors: logs.slice(-10).map(log => log.id),
        });
      }
    }

    return insights;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(logs: ErrorLog[]): ErrorInsight[] {
    const insights: ErrorInsight[] = [];

    // Check for unhandled errors
    const unhandledErrors = logs.filter(log => !log.context?.handled);
    if (unhandledErrors.length > 0) {
      insights.push({
        type: 'recommendation',
        title: 'Unhandled errors detected',
        description: `${unhandledErrors.length} errors were not properly handled`,
        severity: 'medium',
        confidence: 0.8,
        suggestedActions: [
          'Add error boundaries to React components',
          'Implement try-catch blocks for async operations',
          'Add error handling to user-facing features',
        ],
        relatedErrors: unhandledErrors.slice(0, 5).map(log => log.id),
      });
    }

    // Check for repeated errors
    const errorMessages = new Map<string, number>();
    logs.forEach(log => {
      errorMessages.set(log.message, (errorMessages.get(log.message) || 0) + 1);
    });

    const repeatedErrors = Array.from(errorMessages.entries())
      .filter(([_, count]) => count >= 5)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3);

    if (repeatedErrors.length > 0) {
      repeatedErrors.forEach(([message, count]) => {
        insights.push({
          type: 'recommendation',
          title: `Frequently occurring error: "${message.substring(0, 50)}..."`,
          description: `This error has occurred ${count} times`,
          severity: count > 20 ? 'high' : 'medium',
          confidence: 0.9,
          suggestedActions: [
            'Investigate root cause',
            'Add preventive measures',
            'Consider user-facing error messages',
          ],
          relatedErrors: logs
            .filter(log => log.message === message)
            .slice(0, 5)
            .map(log => log.id),
        });
      });
    }

    return insights;
  }

  /**
   * Get error patterns
   */
  getPatterns(): ErrorPattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Get pattern by ID
   */
  getPattern(id: string): ErrorPattern | undefined {
    return this.patterns.get(id);
  }
}

// Singleton instance
export const errorIntelligence = new ErrorIntelligence();

export default errorIntelligence;

