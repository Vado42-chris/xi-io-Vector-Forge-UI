/**
 * Usability Heuristics Service
 * Tracks Nielsen's 10 heuristics + VectorFORGE custom heuristics
 * 
 * #hashtag: usability heuristics nielsen tracking
 */

export type NielsenHeuristic =
  | 'visibility-of-system-status'
  | 'match-between-system-and-real-world'
  | 'user-control-and-freedom'
  | 'consistency-and-standards'
  | 'error-prevention'
  | 'recognition-rather-than-recall'
  | 'flexibility-and-efficiency-of-use'
  | 'aesthetic-and-minimalist-design'
  | 'help-users-recognize-diagnose-and-recover-from-errors'
  | 'help-and-documentation';

export type VectorFORGEHeuristic =
  | 'design-system-compliance'
  | 'hallberg-maths-proportions'
  | 'patent-safe-tracking'
  | 'accessibility-compliance'
  | 'performance-optimization';

export type HeuristicType = NielsenHeuristic | VectorFORGEHeuristic;
export type HeuristicSeverity = 'low' | 'medium' | 'high';
export type HeuristicStatus = 'open' | 'in-progress' | 'fixed' | 'verified';

export interface HeuristicViolation {
  violationId: string;
  heuristicId: HeuristicType;
  component: string;
  severity: HeuristicSeverity;
  description: string;
  status: HeuristicStatus;
  foundAt: number;
  fixedAt?: number;
  fixTime?: number; // Time to fix in minutes
  fixCommit?: string;
  fixPR?: string;
  notes?: string;
}

class UsabilityHeuristicsService {
  private violations: Map<string, HeuristicViolation> = new Map();
  private storageKey = 'vectorforge-heuristic-violations';
  private nextViolationId = 1;

  // Nielsen's 10 Heuristics
  private readonly nielsenHeuristics: Record<NielsenHeuristic, string> = {
    'visibility-of-system-status': 'Visibility of System Status - System should always keep users informed about what is going on',
    'match-between-system-and-real-world': 'Match Between System and Real World - System should speak users\' language',
    'user-control-and-freedom': 'User Control and Freedom - Users need clearly marked emergency exits',
    'consistency-and-standards': 'Consistency and Standards - Users should not have to wonder if different words, situations, or actions mean the same thing',
    'error-prevention': 'Error Prevention - Better than good error messages is a careful design which prevents a problem from occurring',
    'recognition-rather-than-recall': 'Recognition Rather Than Recall - Minimize user\'s memory load',
    'flexibility-and-efficiency-of-use': 'Flexibility and Efficiency of Use - Accelerators may speed up interaction',
    'aesthetic-and-minimalist-design': 'Aesthetic and Minimalist Design - Dialogues should not contain information which is irrelevant',
    'help-users-recognize-diagnose-and-recover-from-errors': 'Help Users Recognize, Diagnose, and Recover from Errors - Error messages should be expressed in plain language',
    'help-and-documentation': 'Help and Documentation - Even though it is better if the system can be used without documentation',
  };

  // VectorFORGE Custom Heuristics
  private readonly vectorforgeHeuristics: Record<VectorFORGEHeuristic, string> = {
    'design-system-compliance': 'Design System Compliance - All styling via CSS classes, no inline styles',
    'hallberg-maths-proportions': 'Hallberg Maths Proportions - Use PHI, E, Pi for spacing and proportions',
    'patent-safe-tracking': 'Patent-Safe Tracking - No personal identifiers, aggregate patterns only',
    'accessibility-compliance': 'Accessibility Compliance - WCAG 2.1 AA compliance, screen reader support',
    'performance-optimization': 'Performance Optimization - Maintain calculations per minute, optimize render cycles',
  };

  constructor() {
    this.loadViolations();
  }

  /**
   * Report a heuristic violation
   */
  reportViolation(
    heuristicId: HeuristicType,
    component: string,
    severity: HeuristicSeverity,
    description: string
  ): string {
    const violationId = `HEUR-${Date.now()}-${this.nextViolationId++}`;
    const violation: HeuristicViolation = {
      violationId,
      heuristicId,
      component,
      severity,
      description,
      status: 'open',
      foundAt: Date.now(),
    };

    this.violations.set(violationId, violation);
    this.saveViolations();

    console.log(`UsabilityHeuristicsService: Reported ${violationId} - ${heuristicId} in ${component}`);
    return violationId;
  }

  /**
   * Update violation status
   */
  updateViolationStatus(
    violationId: string,
    status: HeuristicStatus,
    notes?: string,
    fixCommit?: string,
    fixPR?: string
  ): boolean {
    const violation = this.violations.get(violationId);
    if (!violation) {
      console.warn(`UsabilityHeuristicsService: Violation ${violationId} not found`);
      return false;
    }

    const wasFixed = violation.status !== 'fixed' && status === 'fixed';
    const now = Date.now();

    violation.status = status;
    if (notes) violation.notes = notes;
    if (fixCommit) violation.fixCommit = fixCommit;
    if (fixPR) violation.fixPR = fixPR;

    if (wasFixed) {
      violation.fixedAt = now;
      violation.fixTime = Math.round((now - violation.foundAt) / 60000); // Minutes
    }

    this.violations.set(violationId, violation);
    this.saveViolations();

    return true;
  }

  /**
   * Get violation by ID
   */
  getViolation(violationId: string): HeuristicViolation | undefined {
    return this.violations.get(violationId);
  }

  /**
   * Get all violations
   */
  getAllViolations(): HeuristicViolation[] {
    return Array.from(this.violations.values());
  }

  /**
   * Get violations by heuristic
   */
  getViolationsByHeuristic(heuristicId: HeuristicType): HeuristicViolation[] {
    return Array.from(this.violations.values()).filter(v => v.heuristicId === heuristicId);
  }

  /**
   * Get violations by status
   */
  getViolationsByStatus(status: HeuristicStatus): HeuristicViolation[] {
    return Array.from(this.violations.values()).filter(v => v.status === status);
  }

  /**
   * Get violations by severity
   */
  getViolationsBySeverity(severity: HeuristicSeverity): HeuristicViolation[] {
    return Array.from(this.violations.values()).filter(v => v.severity === severity);
  }

  /**
   * Get heuristic description
   */
  getHeuristicDescription(heuristicId: HeuristicType): string {
    if (heuristicId in this.nielsenHeuristics) {
      return this.nielsenHeuristics[heuristicId as NielsenHeuristic];
    }
    if (heuristicId in this.vectorforgeHeuristics) {
      return this.vectorforgeHeuristics[heuristicId as VectorFORGEHeuristic];
    }
    return 'Unknown heuristic';
  }

  /**
   * Get all heuristic IDs
   */
  getAllHeuristicIds(): HeuristicType[] {
    return [
      ...Object.keys(this.nielsenHeuristics) as NielsenHeuristic[],
      ...Object.keys(this.vectorforgeHeuristics) as VectorFORGEHeuristic[],
    ];
  }

  /**
   * Get violation statistics
   */
  getViolationStats(): {
    total: number;
    byStatus: Record<HeuristicStatus, number>;
    byHeuristic: Record<HeuristicType, number>;
    bySeverity: Record<HeuristicSeverity, number>;
    averageFixTime: number;
    totalFixTime: number;
  } {
    const violations = Array.from(this.violations.values());
    const byStatus: Record<HeuristicStatus, number> = {
      'open': 0,
      'in-progress': 0,
      'fixed': 0,
      'verified': 0,
    };
    const byHeuristic: Partial<Record<HeuristicType, number>> = {};
    const bySeverity: Record<HeuristicSeverity, number> = {
      'low': 0,
      'medium': 0,
      'high': 0,
    };

    let totalFixTime = 0;
    let fixedCount = 0;

    violations.forEach(violation => {
      byStatus[violation.status]++;
      byHeuristic[violation.heuristicId] = (byHeuristic[violation.heuristicId] || 0) + 1;
      bySeverity[violation.severity]++;

      if (violation.fixTime) {
        totalFixTime += violation.fixTime;
        fixedCount++;
      }
    });

    return {
      total: violations.length,
      byStatus,
      byHeuristic: byHeuristic as Record<HeuristicType, number>,
      bySeverity,
      averageFixTime: fixedCount > 0 ? totalFixTime / fixedCount : 0,
      totalFixTime,
    };
  }

  /**
   * Save violations to localStorage
   */
  private saveViolations(): void {
    try {
      const violations = Array.from(this.violations.values());
      localStorage.setItem(this.storageKey, JSON.stringify(violations));
    } catch (error) {
      console.warn('UsabilityHeuristicsService: Failed to save violations:', error);
    }
  }

  /**
   * Load violations from localStorage
   */
  private loadViolations(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const violations: HeuristicViolation[] = JSON.parse(data);
        violations.forEach(violation => {
          this.violations.set(violation.violationId, violation);
        });
      }
    } catch (error) {
      console.warn('UsabilityHeuristicsService: Failed to load violations:', error);
    }
  }

  /**
   * Clear all violations (for testing/reset)
   */
  clearViolations(): void {
    this.violations.clear();
    localStorage.removeItem(this.storageKey);
  }
}

export const usabilityHeuristicsService = new UsabilityHeuristicsService();

