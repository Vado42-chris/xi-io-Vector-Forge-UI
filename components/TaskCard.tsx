/**
 * TaskCard Component
 * Task representation in SprintBoard with essential information and quick actions.
 * 
 * Date: December 27, 2025
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 * Location: Saskatoon, Saskatchewan, Canada, S7J 3E8
 * 
 * Patent Tracking: Task card with contextual quick actions pattern
 * Work Tracking: All interactions tracked for seed001 Blockchain records
 */

import React, { useState } from 'react';
import { Task, TaskPriority } from '../types/task';
import { clickTrackingService } from '../services/clickTrackingService';
import { workTrackingService } from '../services/workTrackingService';

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onAssign: (taskId: string, userId: string) => void;
  onSolveBlocker: (taskId: string) => void;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onSelect,
  onUpdate,
  onAssign,
  onSolveBlocker,
  isDragging = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const sessionId = React.useRef<string | null>(null);

  React.useEffect(() => {
    sessionId.current = workTrackingService.startSession('TaskCard', 'render', task.id);
    workTrackingService.recordCalculation();
    return () => {
      if (sessionId.current) {
        workTrackingService.endSession();
      }
    };
  }, [task.id]);

  const priorityColors: Record<TaskPriority, string> = {
    critical: 'border-l-[var(--vectorforge-accent)] bg-[var(--vectorforge-accent)]/10',
    high: 'border-l-[var(--vectorforge-accent)] bg-[var(--vectorforge-accent)]/10',
    medium: 'border-l-[var(--vectorforge-accent)] bg-[var(--vectorforge-accent)]/10',
    low: 'border-l-gray-500 bg-gray-500/10',
  };

  const priorityIcons: Record<TaskPriority, string> = {
    critical: 'priority_high',
    high: 'arrow_upward',
    medium: 'remove',
    low: 'arrow_downward',
  };

  const isBlocked = task.status === 'blocked';
  const isDueSoon = task.dueDate && new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000);

  const handleClick = () => {
    clickTrackingService.trackClick('TaskCard', 'select', 'Select Task', 'click', {
      taskId: task.id,
      taskTitle: task.title,
      status: task.status,
    });
    workTrackingService.recordCalculation();
    onSelect(task);
  };

  const handleQuickAssign = (e: React.MouseEvent) => {
    e.stopPropagation();
    clickTrackingService.trackClick('TaskCard', 'quick-assign', 'Quick Assign', 'click', {
      taskId: task.id,
    });
    workTrackingService.recordCalculation();
    // TODO: Open assign dialog
    console.log('Quick assign for task:', task.id);
  };

  const handleSolveBlocker = (e: React.MouseEvent) => {
    e.stopPropagation();
    clickTrackingService.trackClick('TaskCard', 'solve-blocker', 'Solve Blocker', 'click', {
      taskId: task.id,
    });
    workTrackingService.recordCalculation();
    onSolveBlocker(task.id);
  };

  const handleStatusChange = (e: React.MouseEvent, newStatus: Task['status']) => {
    e.stopPropagation();
    clickTrackingService.trackClick('TaskCard', 'change-status', 'Change Status', 'click', {
      taskId: task.id,
      oldStatus: task.status,
      newStatus,
    });
    workTrackingService.recordCalculation();
    onUpdate(task.id, { status: newStatus });
  };

  return (
    <div
      className={`xibalba-task-card ${priorityColors[task.priority]} ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${isHovered ? 'shadow-lg' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true);
        clickTrackingService.trackClick('TaskCard', 'hover', 'Hover Task', 'hover', {
          taskId: task.id,
        });
      }}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Task: ${task.title}, ${task.status}, ${task.priority} priority`}
    >
      {/* Header */}
      <div className="xibalba-task-card-header">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="xibalba-task-card-title" title={task.title}>
              {task.title}
            </h3>
            {task.description && (
              <p className="xibalba-task-card-description" title={task.description}>
                {task.description.length > 100
                  ? `${task.description.substring(0, 100)}...`
                  : task.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Priority Badge */}
            <span
              className={`xibalba-task-card-priority xibalba-priority-${task.priority}`}
              title={`Priority: ${task.priority}`}
            >
              <span className="material-icons text-xs">
                {priorityIcons[task.priority]}
              </span>
            </span>
            {/* Blocked Indicator */}
            {isBlocked && (
              <button
                onClick={handleSolveBlocker}
                className="xibalba-task-card-blocked"
                title="Task is blocked - Click to resolve"
                aria-label="Resolve blocker"
              >
                <span className="material-icons text-sm">block</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="xibalba-task-card-body">
        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="xibalba-task-card-tags">
            {task.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="xibalba-task-card-tag">
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="xibalba-task-card-tag-more">+{task.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div className={`xibalba-task-card-due ${isDueSoon ? 'xibalba-task-card-due-soon' : ''}`}>
            <span className="material-icons text-xs">schedule</span>
            <span>
              {new Date(task.dueDate).toLocaleDateString()}
              {isDueSoon && ' (Due Soon)'}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="xibalba-task-card-footer">
        <div className="flex items-center justify-between">
          {/* Assignee */}
          <div className="flex items-center gap-2">
            {task.assignee ? (
              <div className="flex items-center gap-1">
                {task.assignee.avatar ? (
                  <img
                    src={task.assignee.avatar}
                    alt={task.assignee.username}
                    className="xibalba-task-card-avatar"
                  />
                ) : (
                  <div className="xibalba-task-card-avatar-placeholder">
                    {task.assignee.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="xibalba-task-card-assignee">{task.assignee.username}</span>
              </div>
            ) : (
              <button
                onClick={handleQuickAssign}
                className="xibalba-task-card-assign-button"
                title="Assign task"
                aria-label="Assign task"
              >
                <span className="material-icons text-sm">person_add</span>
                <span>Assign</span>
              </button>
            )}
          </div>

          {/* Quick Actions */}
          {isHovered && (
            <div className="flex items-center gap-1">
              {task.status !== 'done' && (
                <button
                  onClick={(e) => handleStatusChange(e, 'done')}
                  className="xibalba-task-card-quick-action"
                  title="Mark as done"
                  aria-label="Mark as done"
                >
                  <span className="material-icons text-sm">check_circle</span>
                </button>
              )}
              {isBlocked && (
                <button
                  onClick={handleSolveBlocker}
                  className="xibalba-task-card-quick-action xibalba-task-card-solve-blocker"
                  title="Solve blocker"
                  aria-label="Solve blocker"
                >
                  <span className="material-icons text-sm">lock_open</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

