/**
 * Task Management Service
 * Unified service for task, sprint, and project management
 * Uses API Black Hole pattern for backend abstraction
 */

import { apiService } from './apiService';
import { checkpointService } from './checkpointService';
import type {
  Task,
  Sprint,
  Project,
  TaskFilters,
  SprintFilters,
  ProjectFilters,
  User,
} from '../types/task';

/**
 * Task Management Service Interface
 */
export interface ITaskManagementService {
  // Task Operations
  getTasks(filters?: TaskFilters): Promise<Task[]>;
  getTask(id: string): Promise<Task | null>;
  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  assignTask(taskId: string, userId: string): Promise<Task>;
  
  // Sprint Operations
  getSprints(filters?: SprintFilters): Promise<Sprint[]>;
  getSprint(id: string): Promise<Sprint | null>;
  createSprint(sprint: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sprint>;
  updateSprint(id: string, updates: Partial<Sprint>): Promise<Sprint>;
  deleteSprint(id: string): Promise<void>;
  getSprintTasks(sprintId: string): Promise<Task[]>;
  
  // Project Operations
  getProjects(filters?: ProjectFilters): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;
  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  getProjectTasks(projectId: string): Promise<Task[]>;
  getProjectSprints(projectId: string): Promise<Sprint[]>;
}

class TaskManagementService implements ITaskManagementService {
  private initialized: boolean = false;

  /**
   * Initialize service
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Service is ready - API Black Hole will handle backend abstraction
    this.initialized = true;

    await checkpointService.createCheckpoint(
      'task-management-initialized',
      'Task management service initialized',
      [],
      { timestamp: Date.now() }
    );
  }

  // ==================== Task Operations ====================

  /**
   * Get tasks with optional filters
   */
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    try {
      const params: Record<string, any> = {};
      if (filters) {
        if (filters.status) params.status = Array.isArray(filters.status) ? filters.status.join(',') : filters.status;
        if (filters.assignee) params.assignee = filters.assignee;
        if (filters.priority) params.priority = Array.isArray(filters.priority) ? filters.priority.join(',') : filters.priority;
        if (filters.tags) params.tags = filters.tags.join(',');
        if (filters.sprintId) params.sprintId = filters.sprintId;
        if (filters.projectId) params.projectId = filters.projectId;
        if (filters.search) params.search = filters.search;
      }

      const response = await apiService.get<Task[]>('/api/tasks', params);
      return response.data || [];
    } catch (error) {
      console.error('Failed to get tasks:', error);
      return [];
    }
  }

  /**
   * Get single task by ID
   */
  async getTask(id: string): Promise<Task | null> {
    try {
      const response = await apiService.get<Task>(`/api/tasks/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Failed to get task ${id}:`, error);
      return null;
    }
  }

  /**
   * Create new task
   */
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    try {
      const response = await apiService.post<Task>('/api/tasks', task);
      const newTask = response.data;
      
      await checkpointService.createCheckpoint(
        `task-created-${newTask.id}`,
        `Task created: ${newTask.title}`,
        [],
        { task: newTask }
      );

      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  }

  /**
   * Update existing task
   */
  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      const response = await apiService.post<Task>(`/api/tasks/${id}`, updates);
      const updatedTask = response.data;
      
      await checkpointService.createCheckpoint(
        `task-updated-${id}`,
        `Task updated: ${updatedTask.title}`,
        [],
        { id, updates }
      );

      return updatedTask;
    } catch (error) {
      console.error(`Failed to update task ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<void> {
    try {
      await apiService.post(`/api/tasks/${id}/delete`, {});
      
      await checkpointService.createCheckpoint(
        `task-deleted-${id}`,
        `Task deleted: ${id}`,
        [],
        { id }
      );
    } catch (error) {
      console.error(`Failed to delete task ${id}:`, error);
      throw error;
    }
  }

  /**
   * Assign task to user
   */
  async assignTask(taskId: string, userId: string): Promise<Task> {
    try {
      const task = await this.updateTask(taskId, { assignee: { id: userId } as User });
      return task;
    } catch (error) {
      console.error(`Failed to assign task ${taskId} to user ${userId}:`, error);
      throw error;
    }
  }

  // ==================== Sprint Operations ====================

  /**
   * Get sprints with optional filters
   */
  async getSprints(filters?: SprintFilters): Promise<Sprint[]> {
    try {
      const params: Record<string, any> = {};
      if (filters) {
        if (filters.status) params.status = Array.isArray(filters.status) ? filters.status.join(',') : filters.status;
        if (filters.projectId) params.projectId = filters.projectId;
        if (filters.departmentId) params.departmentId = filters.departmentId;
      }

      const response = await apiService.get<Sprint[]>('/api/sprints', params);
      return response.data || [];
    } catch (error) {
      console.error('Failed to get sprints:', error);
      return [];
    }
  }

  /**
   * Get single sprint by ID
   */
  async getSprint(id: string): Promise<Sprint | null> {
    try {
      const response = await apiService.get<Sprint>(`/api/sprints/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Failed to get sprint ${id}:`, error);
      return null;
    }
  }

  /**
   * Create new sprint
   */
  async createSprint(sprint: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sprint> {
    try {
      const response = await apiService.post<Sprint>('/api/sprints', sprint);
      const newSprint = response.data;
      
      await checkpointService.createCheckpoint(
        `sprint-created-${newSprint.id}`,
        `Sprint created: ${newSprint.name}`,
        [],
        { sprint: newSprint }
      );

      return newSprint;
    } catch (error) {
      console.error('Failed to create sprint:', error);
      throw error;
    }
  }

  /**
   * Update existing sprint
   */
  async updateSprint(id: string, updates: Partial<Sprint>): Promise<Sprint> {
    try {
      const response = await apiService.post<Sprint>(`/api/sprints/${id}`, updates);
      const updatedSprint = response.data;
      
      await checkpointService.createCheckpoint(
        `sprint-updated-${id}`,
        `Sprint updated: ${updatedSprint.name}`,
        [],
        { id, updates }
      );

      return updatedSprint;
    } catch (error) {
      console.error(`Failed to update sprint ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete sprint
   */
  async deleteSprint(id: string): Promise<void> {
    try {
      await apiService.post(`/api/sprints/${id}/delete`, {});
      
      await checkpointService.createCheckpoint(
        `sprint-deleted-${id}`,
        `Sprint deleted: ${id}`,
        [],
        { id }
      );
    } catch (error) {
      console.error(`Failed to delete sprint ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get tasks for a sprint
   */
  async getSprintTasks(sprintId: string): Promise<Task[]> {
    try {
      const response = await apiService.get<Task[]>(`/api/sprints/${sprintId}/tasks`);
      return response.data || [];
    } catch (error) {
      console.error(`Failed to get sprint tasks for ${sprintId}:`, error);
      return [];
    }
  }

  // ==================== Project Operations ====================

  /**
   * Get projects with optional filters
   */
  async getProjects(filters?: ProjectFilters): Promise<Project[]> {
    try {
      const params: Record<string, any> = {};
      if (filters) {
        if (filters.status) params.status = Array.isArray(filters.status) ? filters.status.join(',') : filters.status;
        if (filters.owner) params.owner = filters.owner;
        if (filters.departmentId) params.departmentId = filters.departmentId;
      }

      const response = await apiService.get<Project[]>('/api/projects', params);
      return response.data || [];
    } catch (error) {
      console.error('Failed to get projects:', error);
      return [];
    }
  }

  /**
   * Get single project by ID
   */
  async getProject(id: string): Promise<Project | null> {
    try {
      const response = await apiService.get<Project>(`/api/projects/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Failed to get project ${id}:`, error);
      return null;
    }
  }

  /**
   * Create new project
   */
  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    try {
      const response = await apiService.post<Project>('/api/projects', project);
      const newProject = response.data;
      
      await checkpointService.createCheckpoint(
        `project-created-${newProject.id}`,
        `Project created: ${newProject.name}`,
        [],
        { project: newProject }
      );

      return newProject;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  }

  /**
   * Update existing project
   */
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const response = await apiService.post<Project>(`/api/projects/${id}`, updates);
      const updatedProject = response.data;
      
      await checkpointService.createCheckpoint(
        `project-updated-${id}`,
        `Project updated: ${updatedProject.name}`,
        [],
        { id, updates }
      );

      return updatedProject;
    } catch (error) {
      console.error(`Failed to update project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<void> {
    try {
      await apiService.post(`/api/projects/${id}/delete`, {});
      
      await checkpointService.createCheckpoint(
        `project-deleted-${id}`,
        `Project deleted: ${id}`,
        [],
        { id }
      );
    } catch (error) {
      console.error(`Failed to delete project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get tasks for a project
   */
  async getProjectTasks(projectId: string): Promise<Task[]> {
    return this.getTasks({ projectId });
  }

  /**
   * Get sprints for a project
   */
  async getProjectSprints(projectId: string): Promise<Sprint[]> {
    return this.getSprints({ projectId });
  }
}

// Singleton instance
export const taskManagementService = new TaskManagementService();

// Auto-initialize
if (typeof window !== 'undefined') {
  taskManagementService.initialize().catch(console.error);
}

export default taskManagementService;

