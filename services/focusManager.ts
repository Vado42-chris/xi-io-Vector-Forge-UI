/**
 * Focus Manager Service
 * Keeps AI agents on target and prevents context drift
 * Implements observer pattern for multi-agent coordination
 * Uses Hallbergmaths for systematic progress tracking
 */

import { checkpointService } from './checkpointService';

/**
 * Current Focus State
 */
interface FocusState {
  currentCheckpoint: string;
  currentTask: string;
  planFile: string;
  todos: Array<{ id: string; status: string; content: string }>;
  context: {
    what: string;      // What we're building
    why: string;       // Why we're building it
    how: string;       // How we're building it
    where: string;     // Where we are in the plan
  };
  blockers: string[];
  nextSteps: string[];
}

/**
 * Observer Pattern for Multi-Agent Coordination
 */
interface Observer {
  id: string;
  onStateChange: (state: FocusState) => void;
  onCheckpoint: (checkpoint: string) => void;
  onBlocker: (blocker: string) => void;
}

class FocusManager {
  private state: FocusState;
  private observers: Observer[] = [];
  private checkpointHistory: string[] = [];

  constructor() {
    this.state = {
      currentCheckpoint: '',
      currentTask: '',
      planFile: '',
      todos: [],
      context: {
        what: '',
        why: '',
        how: '',
        where: '',
      },
      blockers: [],
      nextSteps: [],
    };
  }

  /**
   * Initialize with plan context
   */
  initialize(planFile: string, currentCheckpoint: string, todos: any[]): void {
    this.state.planFile = planFile;
    this.state.currentCheckpoint = currentCheckpoint;
    this.state.todos = todos;
    this.updateContext();
    this.notifyObservers();
  }

  /**
   * Update context from current state
   */
  private updateContext(): void {
    // WHAT: What we're building
    this.state.context.what = 'VectorForge: Progressive Patching with USB Deployment';
    
    // WHY: Why we're building it
    this.state.context.why = 'Create self-contained modular product with incremental patches, USB installer, error intelligence';
    
    // HOW: How we're building it
    this.state.context.how = 'Progressive patching: 2-5 files per patch, commit after each MVP checkpoint, sync to GitHub, browser test';
    
    // WHERE: Where we are
    const currentTodo = this.state.todos.find(t => t.status === 'in_progress');
    this.state.context.where = currentTodo 
      ? `Checkpoint ${this.state.currentCheckpoint}: ${currentTodo.content}`
      : `Checkpoint ${this.state.currentCheckpoint}`;
  }

  /**
   * Set current checkpoint
   */
  setCheckpoint(checkpoint: string): void {
    this.state.currentCheckpoint = checkpoint;
    this.checkpointHistory.push(checkpoint);
    this.updateContext();
    this.notifyObservers();
    
    // Create checkpoint in checkpoint service
    checkpointService.createCheckpoint(
      `focus-${checkpoint}`,
      `Focus checkpoint: ${checkpoint}`,
      [],
      { focusState: this.state }
    ).catch(console.error);
  }

  /**
   * Set current task
   */
  setTask(task: string): void {
    this.state.currentTask = task;
    this.updateContext();
    this.notifyObservers();
  }

  /**
   * Add blocker
   */
  addBlocker(blocker: string): void {
    this.state.blockers.push(blocker);
    this.notifyObservers();
  }

  /**
   * Clear blocker
   */
  clearBlocker(blocker: string): void {
    this.state.blockers = this.state.blockers.filter(b => b !== blocker);
    this.notifyObservers();
  }

  /**
   * Set next steps
   */
  setNextSteps(steps: string[]): void {
    this.state.nextSteps = steps;
    this.notifyObservers();
  }

  /**
   * Get current focus state
   */
  getState(): FocusState {
    return { ...this.state };
  }

  /**
   * Register observer
   */
  registerObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  /**
   * Unregister observer
   */
  unregisterObserver(observerId: string): void {
    this.observers = this.observers.filter(o => o.id !== observerId);
  }

  /**
   * Notify all observers
   */
  private notifyObservers(): void {
    this.observers.forEach(observer => {
      try {
        observer.onStateChange(this.state);
      } catch (error) {
        console.error(`Observer ${observer.id} error:`, error);
      }
    });
  }

  /**
   * Validate we're on target
   */
  validateOnTarget(): { onTarget: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check if we have a current checkpoint
    if (!this.state.currentCheckpoint) {
      issues.push('No current checkpoint set');
    }

    // Check if we have a current task
    if (!this.state.currentTask) {
      issues.push('No current task set');
    }

    // Check if we have blockers
    if (this.state.blockers.length > 0) {
      issues.push(`Blockers present: ${this.state.blockers.join(', ')}`);
    }

    // Check if we're following the plan
    const inProgressTodos = this.state.todos.filter(t => t.status === 'in_progress');
    if (inProgressTodos.length === 0) {
      issues.push('No tasks in progress');
    } else if (inProgressTodos.length > 1) {
      issues.push('Multiple tasks in progress (should be one at a time)');
    }

    return {
      onTarget: issues.length === 0,
      issues,
    };
  }

  /**
   * Get focus summary for AI agent
   */
  getFocusSummary(): string {
    const validation = this.validateOnTarget();
    const status = validation.onTarget ? '✅ ON TARGET' : '⚠️ OFF TARGET';
    
    return `
FOCUS STATUS: ${status}

CURRENT CHECKPOINT: ${this.state.currentCheckpoint}
CURRENT TASK: ${this.state.currentTask}

CONTEXT:
  WHAT: ${this.state.context.what}
  WHY: ${this.state.context.why}
  HOW: ${this.state.context.how}
  WHERE: ${this.state.context.where}

${validation.issues.length > 0 ? `ISSUES:\n${validation.issues.map(i => `  - ${i}`).join('\n')}\n` : ''}
${this.state.blockers.length > 0 ? `BLOCKERS:\n${this.state.blockers.map(b => `  - ${b}`).join('\n')}\n` : ''}
${this.state.nextSteps.length > 0 ? `NEXT STEPS:\n${this.state.nextSteps.map(s => `  - ${s}`).join('\n')}\n` : ''}
    `.trim();
  }
}

// Singleton instance
export const focusManager = new FocusManager();

// Auto-initialize with current plan
if (typeof window !== 'undefined') {
  // Browser: Load from localStorage or fetch plan
  const savedState = localStorage.getItem('focusManagerState');
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      focusManager.initialize(
        state.planFile || '',
        state.currentCheckpoint || '',
        state.todos || []
      );
    } catch (e) {
      console.error('Failed to load focus state:', e);
    }
  }
}

export default focusManager;

