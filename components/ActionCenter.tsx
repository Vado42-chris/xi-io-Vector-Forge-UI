/**
 * Action Center Component
 * Surfaces the single most actionable item for the user at any given moment.
 * 
 * Date: December 27, 2025
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 * 
 * Patent Tracking: This component implements the "Single Most Actionable Item" pattern
 * which may be patentable as a UI/UX innovation for reducing cognitive load.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { taskManagementService } from '../services/taskManagementService';
import { clickTrackingService } from '../services/clickTrackingService';
import { Task, TaskStatus } from '../types/task';

interface Action {
  id: string;
  label: string;
  description: string;
  action: () => void;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  context: string;
  icon?: string;
}

interface ActionCenterProps {
  userId?: string;
  onAction?: (action: Action) => void;
}

const ActionCenter: React.FC<ActionCenterProps> = ({ userId, onAction }) => {
  const [primaryAction, setPrimaryAction] = useState<Action | null>(null);
  const [secondaryActions, setSecondaryActions] = useState<Action[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Determines the highest priority action based on user's tasks.
   */
  const determineAction = useCallback(async () => {
    setLoading(true);
    try {
      // Get user's tasks
      const userTasks = userId
        ? await taskManagementService.getTasks({ assignedTo: userId })
        : await taskManagementService.getTasks();

      // Priority order:
      // 1. Blocked tasks you own
      // 2. Tasks requiring approval
      // 3. Review requests
      // 4. Tasks due today/tomorrow
      // 5. Newly assigned tasks
      // 6. AI suggestions

      const blockedTasks = userTasks.filter(
        task => task.status === 'blocked' && task.assignedTo === userId
      );
      const dueToday = userTasks.filter(task => {
        if (!task.dueDate) return false;
        const due = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return due >= today && due < tomorrow;
      });
      const inProgress = userTasks.filter(task => task.status === 'in_progress');
      const pendingReview = userTasks.filter(task => task.status === 'review');

      const actions: Action[] = [];

      // Priority 1: Blocked tasks
      if (blockedTasks.length > 0) {
        const task = blockedTasks[0];
        actions.push({
          id: `resolve-blocker-${task.id}`,
          label: 'Resolve Blocker',
          description: `Task "${task.title}" is blocked`,
          action: () => {
            clickTrackingService.trackClick('ActionCenter', 'resolve-blocker', task.id, {
              taskId: task.id,
              taskTitle: task.title,
            });
            if (onAction) {
              onAction(actions[0]);
            }
            // Navigate to task or open blocker resolution dialog
            console.log('Resolve blocker for task:', task.id);
          },
          urgency: 'critical',
          context: `You have ${blockedTasks.length} blocked task${blockedTasks.length > 1 ? 's' : ''}`,
          icon: 'block',
        });
      }

      // Priority 2: Tasks due today
      if (dueToday.length > 0 && actions.length === 0) {
        const task = dueToday[0];
        actions.push({
          id: `complete-due-${task.id}`,
          label: 'Complete Task',
          description: `Task "${task.title}" is due today`,
          action: () => {
            clickTrackingService.trackClick('ActionCenter', 'complete-due-task', task.id, {
              taskId: task.id,
              taskTitle: task.title,
            });
            if (onAction) {
              onAction(actions[0]);
            }
            console.log('Complete task:', task.id);
          },
          urgency: 'high',
          context: `You have ${dueToday.length} task${dueToday.length > 1 ? 's' : ''} due today`,
          icon: 'schedule',
        });
      }

      // Priority 3: Pending review
      if (pendingReview.length > 0 && actions.length === 0) {
        const task = pendingReview[0];
        actions.push({
          id: `review-${task.id}`,
          label: 'Review & Approve',
          description: `Task "${task.title}" is pending review`,
          action: () => {
            clickTrackingService.trackClick('ActionCenter', 'review-task', task.id, {
              taskId: task.id,
              taskTitle: task.title,
            });
            if (onAction) {
              onAction(actions[0]);
            }
            console.log('Review task:', task.id);
          },
          urgency: 'high',
          context: `You have ${pendingReview.length} task${pendingReview.length > 1 ? 's' : ''} pending review`,
          icon: 'rate_review',
        });
      }

      // Priority 4: In progress tasks
      if (inProgress.length > 0 && actions.length === 0) {
        const task = inProgress[0];
        actions.push({
          id: `continue-${task.id}`,
          label: 'Continue Work',
          description: `Continue working on "${task.title}"`,
          action: () => {
            clickTrackingService.trackClick('ActionCenter', 'continue-task', task.id, {
              taskId: task.id,
              taskTitle: task.title,
            });
            if (onAction) {
              onAction(actions[0]);
            }
            console.log('Continue task:', task.id);
          },
          urgency: 'medium',
          context: `You have ${inProgress.length} task${inProgress.length > 1 ? 's' : ''} in progress`,
          icon: 'play_arrow',
        });
      }

      // Default: No urgent actions
      if (actions.length === 0) {
        actions.push({
          id: 'no-urgent-actions',
          label: 'All Caught Up',
          description: 'No urgent actions at this time',
          action: () => {
            clickTrackingService.trackClick('ActionCenter', 'view-all-tasks', 'no-urgent', {});
            setIsExpanded(true);
          },
          urgency: 'low',
          context: 'You\'re all caught up!',
          icon: 'check_circle',
        });
      }

      // Set primary action (highest priority)
      setPrimaryAction(actions[0]);

      // Set secondary actions (rest)
      setSecondaryActions(actions.slice(1));

      // Calculate notification count
      const count = blockedTasks.length + dueToday.length + pendingReview.length;
      setNotificationCount(count);

      // Track component view
      clickTrackingService.trackEvent({
        type: 'hover',
        component: 'ActionCenter',
        action: 'view',
        target: 'action-center',
        context: {
          primaryAction: actions[0].id,
          actionCount: actions.length,
          notificationCount: count,
        },
      });
    } catch (error) {
      console.error('ActionCenter: Error determining action:', error);
      setPrimaryAction({
        id: 'error',
        label: 'Error Loading Actions',
        description: 'Unable to load actions',
        action: () => {},
        urgency: 'low',
        context: 'Please refresh the page',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [userId, onAction]);

  useEffect(() => {
    determineAction();
    // Refresh every 30 seconds
    const interval = setInterval(determineAction, 30000);
    return () => clearInterval(interval);
  }, [determineAction]);

  const handlePrimaryAction = () => {
    if (primaryAction) {
      clickTrackingService.trackClick(
        'ActionCenter',
        'execute-primary-action',
        primaryAction.id,
        {
          actionId: primaryAction.id,
          actionLabel: primaryAction.label,
          urgency: primaryAction.urgency,
        }
      );
      primaryAction.action();
    }
  };

  const handleExpand = () => {
    clickTrackingService.trackClick('ActionCenter', 'expand', 'action-center', {});
    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return (
      <div className="xibalba-action-center xibalba-action-center-loading">
        <div className="xibalba-action-center-spinner"></div>
      </div>
    );
  }

  if (!primaryAction) {
    return null;
  }

  const urgencyClass = `xibalba-action-center-urgency-${primaryAction.urgency}`;
  const hasNotifications = notificationCount > 0;

  return (
    <div className="xibalba-action-center-container">
      <button
        className={`xibalba-action-center ${urgencyClass} ${hasNotifications ? 'xibalba-action-center-has-notifications' : ''}`}
        onClick={handlePrimaryAction}
        onMouseEnter={() => {
          clickTrackingService.trackEvent({
            type: 'hover',
            component: 'ActionCenter',
            action: 'hover-primary',
            target: 'primary-action',
            context: { actionId: primaryAction.id },
          });
        }}
        aria-label={`Action Center: ${primaryAction.label}. ${primaryAction.context}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePrimaryAction();
          }
        }}
      >
        <div className="xibalba-action-center-content">
          <span className="xibalba-action-center-icon">
            {primaryAction.icon && (
              <span className="material-icons">{primaryAction.icon}</span>
            )}
          </span>
          <div className="xibalba-action-center-text">
            <span className="xibalba-action-center-label">{primaryAction.label}</span>
            <span className="xibalba-action-center-context">{primaryAction.context}</span>
          </div>
          {hasNotifications && (
            <span className="xibalba-action-center-badge">{notificationCount}</span>
          )}
        </div>
      </button>

      {secondaryActions.length > 0 && (
        <button
          className="xibalba-action-center-expand"
          onClick={handleExpand}
          aria-label="Show more actions"
          aria-expanded={isExpanded}
        >
          <span className="material-icons">
            {isExpanded ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      )}

      {isExpanded && secondaryActions.length > 0 && (
        <div className="xibalba-action-center-dropdown">
          {secondaryActions.map((action) => (
            <button
              key={action.id}
              className="xibalba-action-center-secondary"
              onClick={() => {
                clickTrackingService.trackClick(
                  'ActionCenter',
                  'execute-secondary-action',
                  action.id,
                  { actionId: action.id }
                );
                action.action();
                setIsExpanded(false);
              }}
            >
              <span className="material-icons">{action.icon || 'circle'}</span>
              <div>
                <div className="xibalba-action-center-secondary-label">{action.label}</div>
                <div className="xibalba-action-center-secondary-description">
                  {action.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionCenter;

