/**
 * SprintBoard Component
 * Kanban board for sprint management with drag-and-drop.
 * 
 * Date: December 27, 2025
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 * Location: Saskatoon, Saskatchewan, Canada, S7J 3E8
 * 
 * Patent Tracking: Kanban board with real-time task prioritization pattern
 * Work Tracking: All interactions tracked for seed001 Blockchain records
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import { taskManagementService } from '../services/taskManagementService';
import { clickTrackingService } from '../services/clickTrackingService';
import { workTrackingService } from '../services/workTrackingService';
import TaskCard from './TaskCard';

interface SprintBoardProps {
  sprintId?: string;
  projectId?: string;
  filters?: {
    assignee?: string;
    priority?: TaskPriority | TaskPriority[];
    tags?: string[];
  };
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void;
  onTaskSelect?: (task: Task) => void;
  onTaskCreate?: (column: string) => void;
}

interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

const COLUMNS: Column[] = [
  { id: 'backlog', title: 'Backlog', color: '#666' },
  { id: 'planning', title: 'Planning', color: '#ff9800' }, // VectorFORGE Orange
  { id: 'in_progress', title: 'In Progress', color: '#ff9800' }, // VectorFORGE Orange
  { id: 'review', title: 'Review', color: '#ff9800' }, // VectorFORGE Orange
  { id: 'done', title: 'Done', color: '#ff9800' }, // VectorFORGE Orange
  { id: 'blocked', title: 'Blocked', color: '#ff9800' }, // VectorFORGE Orange
];

const SortableTaskCard: React.FC<{
  task: Task;
  onSelect: (task: Task) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onAssign: (taskId: string, userId: string) => void;
  onSolveBlocker: (taskId: string) => void;
}> = ({ task, onSelect, onUpdate, onAssign, onSolveBlocker }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  // FIXED: Convert library transform to CSS custom properties
  const transformValue = CSS.Transform.toString(transform);
  const transformRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (transformRef.current && transformValue) {
      transformRef.current.style.setProperty('--dnd-transform', transformValue);
    }
    if (transformRef.current && transition) {
      transformRef.current.style.setProperty('--dnd-transition', transition);
    }
  }, [transformValue, transition]);

  return (
    <div ref={(node) => {
      setNodeRef(node);
      if (node) transformRef.current = node;
    }} className="dnd-sortable-item" {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onSelect={onSelect}
        onUpdate={onUpdate}
        onAssign={onAssign}
        onSolveBlocker={onSolveBlocker}
        isDragging={isDragging}
      />
    </div>
  );
};

const SprintBoard: React.FC<SprintBoardProps> = ({
  sprintId,
  projectId,
  filters,
  onTaskMove,
  onTaskSelect,
  onTaskCreate,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<TaskStatus | null>(null);
  const sessionId = React.useRef<string | null>(null);

  useEffect(() => {
    sessionId.current = workTrackingService.startSession('SprintBoard', 'load', sprintId || 'all');
    workTrackingService.recordCalculation();
    loadTasks();
    return () => {
      if (sessionId.current) {
        workTrackingService.endSession();
      }
    };
  }, [sprintId, projectId, filters]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      workTrackingService.recordCalculation();
      const loadedTasks = await taskManagementService.getTasks({
        sprintId,
        projectId,
        assignee: filters?.assignee,
        priority: filters?.priority,
        tags: filters?.tags,
      });
      setTasks(loadedTasks);
      
      clickTrackingService.trackClick('SprintBoard', 'load-tasks', 'Load Tasks', 'hover', {
        taskCount: loadedTasks.length,
        sprintId,
        projectId,
      });
    } catch (error) {
      console.error('SprintBoard: Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
      clickTrackingService.trackClick('SprintBoard', 'drag-start', 'Drag Start', 'drag', {
        taskId: task.id,
        currentStatus: task.status,
      });
      workTrackingService.recordCalculation();
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      workTrackingService.recordCalculation();
      await taskManagementService.updateTask(taskId, { status: newStatus });
      
      setTasks(prevTasks =>
        prevTasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
      );

      clickTrackingService.trackClick('SprintBoard', 'drag-end', 'Drag End', 'drag', {
        taskId,
        oldStatus: task.status,
        newStatus,
      });

      if (onTaskMove) {
        onTaskMove(taskId, newStatus);
      }
    } catch (error) {
      console.error('SprintBoard: Error moving task:', error);
    }
  };

  const handleTaskSelect = (task: Task) => {
    clickTrackingService.trackClick('SprintBoard', 'select-task', 'Select Task', 'click', {
      taskId: task.id,
    });
    workTrackingService.recordCalculation();
    if (onTaskSelect) {
      onTaskSelect(task);
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      workTrackingService.recordCalculation();
      await taskManagementService.updateTask(taskId, updates);
      await loadTasks();
    } catch (error) {
      console.error('SprintBoard: Error updating task:', error);
    }
  };

  const handleTaskAssign = async (taskId: string, userId: string) => {
    try {
      workTrackingService.recordCalculation();
      await taskManagementService.assignTask(taskId, userId);
      await loadTasks();
    } catch (error) {
      console.error('SprintBoard: Error assigning task:', error);
    }
  };

  const handleSolveBlocker = async (taskId: string) => {
    try {
      workTrackingService.recordCalculation();
      await taskManagementService.updateTask(taskId, { status: 'in_progress' });
      await loadTasks();
    } catch (error) {
      console.error('SprintBoard: Error solving blocker:', error);
    }
  };

  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter(task => task.status === status);
  };

  const getTaskCount = (status: TaskStatus): number => {
    return getTasksByStatus(status).length;
  };

  if (loading) {
    return (
      <div className="xibalba-sprintboard-loading">
        <div className="xibalba-action-center-spinner"></div>
        <span>Loading sprint board...</span>
      </div>
    );
  }

  return (
    <div className="xibalba-sprintboard">
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="xibalba-sprintboard-container">
          {COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            const taskCount = columnTasks.length;

            return (
              <div
                key={column.id}
                className={`xibalba-sprintboard-column ${
                  selectedColumn === column.id ? 'xibalba-sprintboard-column-selected' : ''
                }`}
                onClick={() => {
                  setSelectedColumn(column.id);
                  if (onTaskCreate) {
                    onTaskCreate(column.id);
                  }
                }}
                onMouseEnter={() => {
                  clickTrackingService.trackClick('SprintBoard', 'hover-column', 'Hover Column', 'hover', {
                    columnId: column.id,
                    taskCount,
                  });
                }}
              >
                <div className="xibalba-sprintboard-column-header">
                  <h3 className="xibalba-sprintboard-column-title">{column.title}</h3>
                  <span className="xibalba-sprintboard-column-count">{taskCount}</span>
                </div>
                <div className="xibalba-sprintboard-column-content">
                  <SortableContext
                    items={columnTasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {columnTasks.map((task) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        onSelect={handleTaskSelect}
                        onUpdate={handleTaskUpdate}
                        onAssign={handleTaskAssign}
                        onSolveBlocker={handleSolveBlocker}
                      />
                    ))}
                  </SortableContext>
                  {taskCount === 0 && (
                    <div className="xibalba-sprintboard-column-empty">
                      <span className="material-icons">add</span>
                      <span>Drop tasks here or click to add</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="opacity-80">
              <TaskCard
                task={activeTask}
                onSelect={() => {}}
                onUpdate={() => {}}
                onAssign={() => {}}
                onSolveBlocker={() => {}}
                isDragging={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default SprintBoard;

