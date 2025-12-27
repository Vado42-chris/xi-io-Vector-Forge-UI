/**
 * VectorForge Task Link Service
 * Links tasks to VectorForge items (layers, keyframes, scripts, etc.)
 * Enables bidirectional sync between task management and VectorForge
 */

import { taskManagementService } from './taskManagementService';
import { checkpointService } from './checkpointService';
import type { Task } from '../types/task';
import type { VectorLayer } from '../types';

/**
 * VectorForge Item Type
 */
export type VectorForgeItemType = 'layer' | 'keyframe' | 'script' | 'animation' | 'project';

/**
 * VectorForge Item Reference
 */
export interface VectorForgeItemRef {
  type: VectorForgeItemType;
  id: string;
  name?: string;
}

/**
 * Task Link
 */
export interface TaskLink {
  id: string;
  taskId: string;
  vectorForgeItem: VectorForgeItemRef;
  relationship: 'created_for' | 'modified_for' | 'reviewed_for' | 'blocked_by' | 'depends_on';
  createdAt: Date | string;
}

/**
 * VectorForge Task Link Service Interface
 */
export interface IVectorForgeTaskLinkService {
  /**
   * Link task to VectorForge item
   */
  linkTaskToItem(taskId: string, item: VectorForgeItemRef, relationship: TaskLink['relationship']): Promise<TaskLink>;

  /**
   * Unlink task from VectorForge item
   */
  unlinkTaskFromItem(taskId: string, itemId: string): Promise<void>;

  /**
   * Get all links for a task
   */
  getTaskLinks(taskId: string): Promise<TaskLink[]>;

  /**
   * Get all tasks linked to a VectorForge item
   */
  getItemTasks(item: VectorForgeItemRef): Promise<Task[]>;

  /**
   * Get VectorForge items for a task
   */
  getTaskItems(taskId: string): Promise<VectorForgeItemRef[]>;

  /**
   * Update task metadata with VectorForge items
   */
  updateTaskMetadata(taskId: string, items: VectorForgeItemRef[]): Promise<Task>;
}

class VectorForgeTaskLinkService implements IVectorForgeTaskLinkService {
  private links: Map<string, TaskLink> = new Map();
  private initialized: boolean = false;

  /**
   * Initialize service
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Load links from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem('vectorforge-task-links');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach((link: TaskLink) => {
              this.links.set(link.id, link);
            });
          }
        }
      } catch (error) {
        console.warn('Could not load task links from storage');
      }
    }

    this.initialized = true;

    await checkpointService.createCheckpoint(
      'task-link-service-initialized',
      'VectorForge task link service initialized',
      [],
      { linkCount: this.links.size }
    );
  }

  /**
   * Link task to VectorForge item
   */
  async linkTaskToItem(
    taskId: string,
    item: VectorForgeItemRef,
    relationship: TaskLink['relationship']
  ): Promise<TaskLink> {
    const link: TaskLink = {
      id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskId,
      vectorForgeItem: item,
      relationship,
      createdAt: new Date().toISOString(),
    };

    this.links.set(link.id, link);

    // Update task metadata
    const task = await taskManagementService.getTask(taskId);
    if (task) {
      const existingItems = task.metadata.relatedVectorForgeItems || [];
      if (!existingItems.includes(item.id)) {
        await this.updateTaskMetadata(taskId, [...existingItems, item.id]);
      }
    }

    // Persist links
    this.persistLinks();

    await checkpointService.createCheckpoint(
      `task-linked-${link.id}`,
      `Task ${taskId} linked to ${item.type} ${item.id}`,
      [],
      { link }
    );

    return link;
  }

  /**
   * Unlink task from VectorForge item
   */
  async unlinkTaskFromItem(taskId: string, itemId: string): Promise<void> {
    const linksToRemove: string[] = [];
    
    this.links.forEach((link, id) => {
      if (link.taskId === taskId && link.vectorForgeItem.id === itemId) {
        linksToRemove.push(id);
      }
    });

    linksToRemove.forEach(id => this.links.delete(id));

    // Update task metadata
    const task = await taskManagementService.getTask(taskId);
    if (task) {
      const existingItems = task.metadata.relatedVectorForgeItems || [];
      const filtered = existingItems.filter(itemId => 
        !linksToRemove.some(linkId => {
          const link = this.links.get(linkId);
          return link?.vectorForgeItem.id === itemId;
        })
      );
      await this.updateTaskMetadata(taskId, filtered);
    }

    // Persist links
    this.persistLinks();

    await checkpointService.createCheckpoint(
      `task-unlinked-${taskId}-${itemId}`,
      `Task ${taskId} unlinked from ${itemId}`,
      [],
      { taskId, itemId }
    );
  }

  /**
   * Get all links for a task
   */
  async getTaskLinks(taskId: string): Promise<TaskLink[]> {
    return Array.from(this.links.values()).filter(link => link.taskId === taskId);
  }

  /**
   * Get all tasks linked to a VectorForge item
   */
  async getItemTasks(item: VectorForgeItemRef): Promise<Task[]> {
    const relevantLinks = Array.from(this.links.values()).filter(
      link => link.vectorForgeItem.type === item.type && link.vectorForgeItem.id === item.id
    );

    const tasks: Task[] = [];
    for (const link of relevantLinks) {
      const task = await taskManagementService.getTask(link.taskId);
      if (task) {
        tasks.push(task);
      }
    }

    return tasks;
  }

  /**
   * Get VectorForge items for a task
   */
  async getTaskItems(taskId: string): Promise<VectorForgeItemRef[]> {
    const links = await this.getTaskLinks(taskId);
    return links.map(link => link.vectorForgeItem);
  }

  /**
   * Update task metadata with VectorForge items
   */
  async updateTaskMetadata(taskId: string, items: string[]): Promise<Task> {
    const task = await taskManagementService.getTask(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const updatedTask = await taskManagementService.updateTask(taskId, {
      metadata: {
        ...task.metadata,
        relatedVectorForgeItems: items,
      },
    });

    return updatedTask;
  }

  /**
   * Persist links to localStorage
   */
  private persistLinks(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const links = Array.from(this.links.values());
        localStorage.setItem('vectorforge-task-links', JSON.stringify(links));
      } catch (error) {
        console.error('Failed to persist task links:', error);
      }
    }
  }

  /**
   * Get link statistics
   */
  getStatistics(): {
    totalLinks: number;
    byType: Record<VectorForgeItemType, number>;
    byRelationship: Record<TaskLink['relationship'], number>;
  } {
    const stats = {
      totalLinks: this.links.size,
      byType: {} as Record<VectorForgeItemType, number>,
      byRelationship: {} as Record<TaskLink['relationship'], number>,
    };

    this.links.forEach(link => {
      stats.byType[link.vectorForgeItem.type] = (stats.byType[link.vectorForgeItem.type] || 0) + 1;
      stats.byRelationship[link.relationship] = (stats.byRelationship[link.relationship] || 0) + 1;
    });

    return stats;
  }
}

// Singleton instance
export const vectorForgeTaskLinkService = new VectorForgeTaskLinkService();

// Auto-initialize
if (typeof window !== 'undefined') {
  vectorForgeTaskLinkService.initialize().catch(console.error);
}

export default vectorForgeTaskLinkService;

