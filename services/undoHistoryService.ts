/**
 * Undo History Service
 * Manages undo history for batch operations by storing file content
 * 
 * #hashtag: undo-history service
 */

import { BatchOperation } from './batchOperationService';

export interface UndoEntry {
  id: string;
  timestamp: number;
  operation: 'create' | 'delete' | 'move' | 'copy';
  files: Array<{
    path: string;
    originalPath?: string; // For move operations
    content?: string; // File content (for delete/move)
    originalContent?: string; // For move operations
  }>;
  destination?: string;
}

class UndoHistoryService {
  private history: UndoEntry[] = [];
  private maxHistorySize = 50; // Keep last 50 operations
  private storageKey = 'vectorforge-undo-history';

  constructor() {
    this.loadHistory();
  }

  /**
   * Add an undo entry before performing an operation
   */
  async addUndoEntry(
    operation: 'create' | 'delete' | 'move' | 'copy',
    files: string[],
    destination?: string,
    fileContents?: Map<string, string> // Optional: pre-read file contents
  ): Promise<string> {
    const entryId = `undo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // If file contents not provided, we'll need to read them
    // For now, we'll store what we have
    const fileEntries = files.map(path => ({
      path,
      content: fileContents?.get(path),
    }));

    const entry: UndoEntry = {
      id: entryId,
      timestamp: Date.now(),
      operation,
      files: fileEntries,
      destination,
    };

    this.history.push(entry);
    
    // Trim history if too large
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
    }

    this.saveHistory();
    return entryId;
  }

  /**
   * Get the most recent undo entry
   */
  getLastEntry(): UndoEntry | null {
    return this.history.length > 0 ? this.history[this.history.length - 1] : null;
  }

  /**
   * Get undo entry by ID
   */
  getEntry(id: string): UndoEntry | null {
    return this.history.find(entry => entry.id === id) || null;
  }

  /**
   * Remove an undo entry (after successful undo)
   */
  removeEntry(id: string): void {
    this.history = this.history.filter(entry => entry.id !== id);
    this.saveHistory();
  }

  /**
   * Clear all undo history
   */
  clearHistory(): void {
    this.history = [];
    this.saveHistory();
  }

  /**
   * Get all undo entries
   */
  getAllEntries(): UndoEntry[] {
    return [...this.history];
  }

  /**
   * Get undo entries count
   */
  getHistoryCount(): number {
    return this.history.length;
  }

  /**
   * Replay an operation from history
   * Returns the operation details for execution
   */
  getReplayOperation(entryId: string): BatchOperation | null {
    const entry = this.getEntry(entryId);
    if (!entry) {
      return null;
    }

    return {
      type: entry.operation,
      files: entry.files.map(f => f.path),
      destination: entry.destination,
    };
  }

  /**
   * Get formatted history for display
   */
  getFormattedHistory(): Array<{
    id: string;
    timestamp: number;
    operation: string;
    fileCount: number;
    destination?: string;
    canReplay: boolean;
  }> {
    return this.history.map(entry => ({
      id: entry.id,
      timestamp: entry.timestamp,
      operation: entry.operation,
      fileCount: entry.files.length,
      destination: entry.destination,
      canReplay: entry.operation === 'create' || entry.operation === 'copy', // Can replay create/copy operations
    }));
  }

  /**
   * Save history to localStorage
   */
  private saveHistory(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        // Only save essential data (file contents can be large)
        // For now, we'll save everything but in production you might want to limit content size
        const historyToSave = this.history.map(entry => ({
          ...entry,
          // Limit content size to prevent localStorage overflow
          files: entry.files.map(file => ({
            ...file,
            content: file.content && file.content.length > 100000 
              ? file.content.substring(0, 100000) + '...[truncated]' 
              : file.content,
          })),
        }));
        localStorage.setItem(this.storageKey, JSON.stringify(historyToSave));
      } catch (error) {
        console.error('UndoHistoryService: Failed to save history:', error);
        // If storage is full, try to clear old entries
        if (error instanceof DOMException && error.code === 22) {
          this.history = this.history.slice(-10); // Keep only last 10
          try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.history));
          } catch (e) {
            console.error('UndoHistoryService: Failed to save after cleanup:', e);
          }
        }
      }
    }
  }

  /**
   * Load history from localStorage
   */
  private loadHistory(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const historyStr = localStorage.getItem(this.storageKey);
        if (historyStr) {
          this.history = JSON.parse(historyStr);
        }
      } catch (error) {
        console.error('UndoHistoryService: Failed to load history:', error);
        this.history = [];
      }
    }
  }
}

export const undoHistoryService = new UndoHistoryService();

