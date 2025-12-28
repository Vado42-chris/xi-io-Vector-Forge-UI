/**
 * Focus Manager
 * Keeps AI agents on target and tracks progress
 * Part of Patch 1: Foundation & Architecture
 */

export interface FocusState {
  currentCheckpoint: string;
  currentTask: string;
  blockers: string[];
  nextSteps: string[];
  onTarget: boolean;
  lastUpdate: number;
}

export interface Task {
  id: string;
  checkpoint: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  blockers?: string[];
  dependencies?: string[];
}

class FocusManager {
  private focusState: FocusState = {
    currentCheckpoint: '',
    currentTask: '',
    blockers: [],
    nextSteps: [],
    onTarget: true,
    lastUpdate: Date.now(),
  };

  private tasks: Task[] = [];
  private taskHistory: Task[] = [];

  /**
   * Set current checkpoint
   */
  setCheckpoint(checkpoint: string): void {
    this.focusState.currentCheckpoint = checkpoint;
    this.focusState.lastUpdate = Date.now();
    this.saveState();
  }

  /**
   * Set current task
   */
  setTask(taskId: string, description: string): void {
    this.focusState.currentTask = taskId;
    
    // Update or create task
    const existingTask = this.tasks.find(t => t.id === taskId);
    if (existingTask) {
      existingTask.status = 'in_progress';
      existingTask.description = description;
    } else {
      this.tasks.push({
        id: taskId,
        checkpoint: this.focusState.currentCheckpoint,
        description,
        status: 'in_progress',
      });
    }

    this.focusState.lastUpdate = Date.now();
    this.saveState();
  }

  /**
   * Mark task as completed
   */
  completeTask(taskId: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'completed';
      this.taskHistory.push({ ...task });
      this.tasks = this.tasks.filter(t => t.id !== taskId);
    }
    this.focusState.lastUpdate = Date.now();
    this.saveState();
  }

  /**
   * Add blocker
   */
  addBlocker(blocker: string): void {
    if (!this.focusState.blockers.includes(blocker)) {
      this.focusState.blockers.push(blocker);
      this.focusState.onTarget = false;
      
      // Mark current task as blocked
      const currentTask = this.tasks.find(t => t.id === this.focusState.currentTask);
      if (currentTask) {
        currentTask.status = 'blocked';
        if (!currentTask.blockers) {
          currentTask.blockers = [];
        }
        currentTask.blockers.push(blocker);
      }
    }
    this.focusState.lastUpdate = Date.now();
    this.saveState();
  }

  /**
   * Resolve blocker
   */
  resolveBlocker(blocker: string): void {
    this.focusState.blockers = this.focusState.blockers.filter(b => b !== blocker);
    
    // Update task blockers
    this.tasks.forEach(task => {
      if (task.blockers) {
        task.blockers = task.blockers.filter(b => b !== blocker);
        if (task.blockers.length === 0 && task.status === 'blocked') {
          task.status = 'in_progress';
        }
      }
    });

    // Check if we're back on target
    if (this.focusState.blockers.length === 0) {
      this.focusState.onTarget = true;
    }

    this.focusState.lastUpdate = Date.now();
    this.saveState();
  }

  /**
   * Set next steps
   */
  setNextSteps(steps: string[]): void {
    this.focusState.nextSteps = steps;
    this.focusState.lastUpdate = Date.now();
    this.saveState();
  }

  /**
   * Validate if we're on target
   */
  validateOnTarget(): boolean {
    const isOnTarget = 
      this.focusState.currentCheckpoint !== '' &&
      this.focusState.currentTask !== '' &&
      this.focusState.blockers.length === 0;

    this.focusState.onTarget = isOnTarget;
    this.saveState();
    return isOnTarget;
  }

  /**
   * Get current focus state
   */
  getFocusState(): FocusState {
    return { ...this.focusState };
  }

  /**
   * Get current tasks
   */
  getTasks(): Task[] {
    return [...this.tasks];
  }

  /**
   * Get task history
   */
  getTaskHistory(): Task[] {
    return [...this.taskHistory];
  }

  /**
   * Save state to localStorage
   */
  private saveState(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('focusManager_state', JSON.stringify(this.focusState));
        localStorage.setItem('focusManager_tasks', JSON.stringify(this.tasks));
        localStorage.setItem('focusManager_history', JSON.stringify(this.taskHistory));
      } catch (error) {
        console.error('Failed to save focus state:', error);
      }
    }
  }

  /**
   * Load state from localStorage
   */
  loadState(): void {
    if (typeof window !== 'undefined') {
      try {
        const stateStr = localStorage.getItem('focusManager_state');
        const tasksStr = localStorage.getItem('focusManager_tasks');
        const historyStr = localStorage.getItem('focusManager_history');

        if (stateStr) {
          this.focusState = JSON.parse(stateStr);
        }
        if (tasksStr) {
          this.tasks = JSON.parse(tasksStr);
        }
        if (historyStr) {
          this.taskHistory = JSON.parse(historyStr);
        }
      } catch (error) {
        console.error('Failed to load focus state:', error);
      }
    }
  }

  /**
   * Clear all state
   */
  clear(): void {
    this.focusState = {
      currentCheckpoint: '',
      currentTask: '',
      blockers: [],
      nextSteps: [],
      onTarget: true,
      lastUpdate: Date.now(),
    };
    this.tasks = [];
    this.taskHistory = [];
    this.saveState();
  }
}

// Singleton instance
export const focusManager = new FocusManager();

// Load state on initialization
if (typeof window !== 'undefined') {
  focusManager.loadState();
}

export default focusManager;
