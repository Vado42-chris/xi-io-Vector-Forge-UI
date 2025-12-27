/**
 * Task Management Type Definitions
 * Core types for task, sprint, and project management
 */

/**
 * Task Status
 */
export type TaskStatus = 'backlog' | 'planning' | 'in_progress' | 'review' | 'done' | 'blocked';

/**
 * Task Priority
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Media Type
 */
export type MediaType = 'vector' | 'animation' | 'code' | 'documentation' | 'asset';

/**
 * Vocation Type
 */
export type VocationType = 'design' | 'development' | 'qa' | 'marketing' | 'management';

/**
 * Task Entity
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | string;
  assignee?: User;
  reporter: User;
  tags: string[];
  dependencies: string[]; // Task IDs
  subtasks: Task[];
  attachments: Attachment[];
  comments: Comment[];
  timeTracking: {
    estimated: number; // hours
    logged: number; // hours
  };
  metadata: {
    mediaType?: MediaType;
    vocation?: VocationType;
    relatedVectorForgeItems?: string[]; // Layer IDs, keyframe IDs, etc.
  };
  sprintId?: string;
  projectId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * User Entity
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  roles: string[];
  departments: string[];
  status: 'active' | 'away' | 'offline';
}

/**
 * Sprint Entity
 */
export interface Sprint {
  id: string;
  name: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  status: 'planning' | 'active' | 'review' | 'completed';
  tasks: string[]; // Task IDs
  goals: string[];
  velocity: {
    planned: number;
    completed: number;
  };
  team: User[];
  departmentId?: string;
  projectId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Project Entity
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
  owner: User;
  team: User[];
  departments: string[];
  sprints: string[]; // Sprint IDs
  milestones: Milestone[];
  clientId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Attachment
 */
export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: User;
  uploadedAt: Date | string;
}

/**
 * Comment
 */
export interface Comment {
  id: string;
  content: string;
  author: User;
  mentions: string[]; // User IDs
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Milestone
 */
export interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: Date | string;
  completed: boolean;
  completedAt?: Date | string;
}

/**
 * Task Filters
 */
export interface TaskFilters {
  status?: TaskStatus | TaskStatus[];
  assignee?: string;
  priority?: TaskPriority | TaskPriority[];
  tags?: string[];
  sprintId?: string;
  projectId?: string;
  dueDate?: {
    from?: Date | string;
    to?: Date | string;
  };
  search?: string;
}

/**
 * Sprint Filters
 */
export interface SprintFilters {
  status?: Sprint['status'] | Sprint['status'][];
  projectId?: string;
  departmentId?: string;
  team?: string[];
}

/**
 * Project Filters
 */
export interface ProjectFilters {
  status?: Project['status'] | Project['status'][];
  owner?: string;
  team?: string[];
  departmentId?: string;
}

