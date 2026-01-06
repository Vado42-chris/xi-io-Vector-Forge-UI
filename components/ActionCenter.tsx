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
import { workTrackingService } from '../services/workTrackingService';
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
  // VectorForge-specific props
  hasPrompt?: boolean;
  prompt?: string;
  onGenerateVector?: () => void;
  isGenerating?: boolean;
}

const ActionCenter: React.FC<ActionCenterProps> = ({ userId, onAction, hasPrompt, prompt, onGenerateVector, isGenerating }) => {
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
    const sessionId = workTrackingService.startSession('ActionCenter', 'determine-action');
    workTrackingService.recordCalculation();

    try {
      const actions: Action[] = [];

      // VECTORFORGE PRIORITY #1: Check for prompt FIRST (before tasks)
      // This ensures VectorForge actions take precedence over task management
      if (hasPrompt && prompt && prompt.trim() && onGenerateVector) {
        actions.push({
          id: 'generate-vector',
          label: isGenerating ? 'Generating...' : 'Generate Vector',
          description: `Generate vector from: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`,
          action: () => {
            if (!isGenerating && onGenerateVector) {
              clickTrackingService.trackClick('ActionCenter', 'generate-vector', 'Generate Vector', 'click', {
                promptLength: prompt.length,
              });
              onGenerateVector();
            }
          },
          urgency: 'high',
          context: 'Click to generate your vector',
          icon: 'auto_awesome',
        });
      } else if (!hasPrompt || !prompt || !prompt.trim()) {
        // If no prompt, suggest entering one
        actions.push({
          id: 'enter-prompt',
          label: 'Enter a Prompt',
          description: 'Describe the vector you want to create',
          action: () => {
            clickTrackingService.trackClick('ActionCenter', 'focus-prompt', 'Enter Prompt', 'click', {});
            // Focus the prompt input - this would be handled by parent
            if (onAction) {
              onAction({
                id: 'enter-prompt',
                label: 'Enter a Prompt',
                description: '',
                action: () => {},
                urgency: 'medium',
                context: '',
              });
            }
          },
          urgency: 'medium',
          context: 'Start by entering a prompt',
          icon: 'edit',
        });
      }

      // TASK MANAGEMENT PRIORITY #2: Only check tasks if no VectorForge action exists
      // Get user's tasks
      const userTasks = userId
        ? await taskManagementService.getTasks({ assignee: userId })
        : await taskManagementService.getTasks();

      // Priority order (only if no VectorForge action):
      // 1. Blocked tasks you own
      // 2. Tasks requiring approval
      // 3. Review requests
      // 4. Tasks due today/tomorrow
      // 5. Newly assigned tasks
      // 6. AI suggestions

      const blockedTasks = userTasks.filter(
        task => task.status === 'blocked' && (task.assignee?.id === userId || task.assignee === userId)
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

      // Priority 1: Blocked tasks
      if (blockedTasks.length > 0) {
        const task = blockedTasks[0];
        actions.push({
          id: `resolve-blocker-${task.id}`,
          label: 'Resolve Blocker',
          description: `Task "${task.title}" is blocked`,
          action: () => {
            clickTrackingService.trackClick('ActionCenter', 'resolve-blocker', 'Resolve Blocker', 'click', {
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
            clickTrackingService.trackClick('ActionCenter', 'complete-due-task', 'Complete Task', 'click', {
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
            clickTrackingService.trackClick('ActionCenter', 'review-task', 'Review Task', 'click', {
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
            clickTrackingService.trackClick('ActionCenter', 'continue-task', 'Continue Task', 'click', {
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

      // VectorForge-specific: If user has a prompt, show "Generate Vector" as primary action
      if (hasPrompt && prompt && prompt.trim().length > 0 && onGenerateVector) {
        actions.unshift({
          id: 'generate-vector',
          label: isGenerating ? 'Generating...' : 'Generate Vector',
          description: `Create vector from: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`,
          action: () => {
            clickTrackingService.trackClick('ActionCenter', 'generate-vector', 'Generate Vector', 'click', {
              promptLength: prompt.length,
            });
            onGenerateVector();
          },
          urgency: 'high',
          context: 'Click to generate your vector',
          icon: 'auto_awesome',
        });
      }

      // Default: No urgent actions
      if (actions.length === 0) {
        actions.push({
          id: 'no-urgent-actions',
          label: hasPrompt && prompt && prompt.trim().length > 0 ? 'Enter a prompt to start' : 'All Caught Up',
          description: hasPrompt && prompt && prompt.trim().length > 0 ? 'Type a description in the AI panel to generate vectors' : 'No urgent actions at this time',
          action: () => {
            clickTrackingService.trackClick('ActionCenter', 'view-all-tasks', 'View All Tasks', 'click', {});
            setIsExpanded(true);
          },
          urgency: 'low',
          context: hasPrompt && prompt && prompt.trim().length > 0 ? 'Enter a prompt in the AI panel' : "You're all caught up!",
          icon: hasPrompt && prompt && prompt.trim().length > 0 ? 'edit' : 'check_circle',
        });
      }

      // Add UI automation actions if no urgent tasks
      if (actions.length === 0 || actions[0].id === 'no-urgent-actions') {
        actions.push({
          id: 'setup-project',
          label: 'Set Up Project',
          description: 'Open Project Wizard to create a new project',
          action: () => {
            clickTrackingService.trackClick(
              'ActionCenter',
              'open-project-wizard',
              'Set Up Project',
              'click',
              {}
            );
            // Trigger ProjectWizard - this would be handled by parent component
            if (onAction) {
              onAction({
                id: 'setup-project',
                label: 'Set Up Project',
                description: '',
                action: () => {},
                urgency: 'low',
                context: '',
              });
            }
          },
          urgency: 'low',
          context: 'Create a new project',
          icon: 'folder',
        });
        actions.push({
          id: 'browse-templates',
          label: 'Browse Templates',
          description: 'Open Template Library to browse code templates',
          action: () => {
            clickTrackingService.trackClick(
              'ActionCenter',
              'open-template-library',
              'Browse Templates',
              'click',
              {}
            );
            if (onAction) {
              onAction({
                id: 'browse-templates',
                label: 'Browse Templates',
                description: '',
                action: () => {},
                urgency: 'low',
                context: '',
              });
            }
          },
          urgency: 'low',
          context: 'Browse code templates',
          icon: 'library_books',
        });
        actions.push({
          id: 'generate-tests',
          label: 'Generate Tests',
          description: 'Open Test Generator to create test files',
          action: () => {
            clickTrackingService.trackClick(
              'ActionCenter',
              'open-test-generator',
              'Generate Tests',
              'click',
              {}
            );
            if (onAction) {
              onAction({
                id: 'generate-tests',
                label: 'Generate Tests',
                description: '',
                action: () => {},
                urgency: 'low',
                context: '',
              });
            }
          },
          urgency: 'low',
          context: 'Generate test files',
          icon: 'science',
        });
        actions.push({
          id: 'fix-menu-actions',
          label: 'Fix Menu Actions',
          description: 'Open Action Center Audit to fix missing menu handlers',
          action: () => {
            clickTrackingService.trackClick(
              'ActionCenter',
              'open-action-audit',
              'Fix Menu Actions',
              'click',
              {}
            );
            if (onAction) {
              onAction({
                id: 'fix-menu-actions',
                label: 'Fix Menu Actions',
                description: '',
                action: () => {},
                urgency: 'low',
                context: '',
              });
            }
          },
          urgency: 'low',
          context: 'Audit and fix menu actions',
          icon: 'checklist',
        });
        actions.push({
          id: 'create-schema',
          label: 'Create Schema',
          description: 'Open Schema Builder to create JSON schemas',
          action: () => {
            clickTrackingService.trackClick(
              'ActionCenter',
              'open-schema-builder',
              'Create Schema',
              'click',
              {}
            );
            if (onAction) {
              onAction({
                id: 'create-schema',
                label: 'Create Schema',
                description: '',
                action: () => {},
                urgency: 'low',
                context: '',
              });
            }
          },
          urgency: 'low',
          context: 'Create JSON schema',
          icon: 'schema',
        });
        actions.push({
          id: 'batch-operations',
          label: 'Batch Create Files',
          description: 'Open Batch Operations Panel for file operations',
          action: () => {
            clickTrackingService.trackClick(
              'ActionCenter',
              'open-batch-operations',
              'Batch Create Files',
              'click',
              {}
            );
            if (onAction) {
              onAction({
                id: 'batch-operations',
                label: 'Batch Create Files',
                description: '',
                action: () => {},
                urgency: 'low',
                context: '',
              });
            }
          },
          urgency: 'low',
          context: 'Batch file operations',
          icon: 'folder_managed',
        });
        actions.push({
          id: 'marketplace-publisher',
          label: 'Publish to Marketplace',
          description: 'Open Publisher Dashboard to create and publish items',
          action: () => {
            clickTrackingService.trackClick(
              'ActionCenter',
              'open-marketplace-publisher',
              'Publish to Marketplace',
              'click',
              {}
            );
            if (onAction) {
              onAction({
                id: 'marketplace-publisher',
                label: 'Publish to Marketplace',
                description: '',
                action: () => {},
                urgency: 'low',
                context: '',
              });
            }
          },
          urgency: 'low',
          context: 'Publish templates, plugins, or assets',
          icon: 'store',
        });
        actions.push({
          id: 'marketplace-analytics',
          label: 'View Analytics',
          description: 'Open Analytics Dashboard to view sales and performance',
          action: () => {
            clickTrackingService.trackClick(
              'ActionCenter',
              'open-marketplace-analytics',
              'View Analytics',
              'click',
              {}
            );
            if (onAction) {
              onAction({
                id: 'marketplace-analytics',
                label: 'View Analytics',
                description: '',
                action: () => {},
                urgency: 'low',
                context: '',
              });
            }
          },
          urgency: 'low',
          context: 'View marketplace performance',
          icon: 'analytics',
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
      clickTrackingService.trackClick('panel', 'action-center', 'Action Center', 'view', {
        primaryAction: actions[0].id,
        actionCount: actions.length,
        notificationCount: count,
      });

      workTrackingService.recordCalculation();
      workTrackingService.endSession();
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
      workTrackingService.endSession();
    } finally {
      setLoading(false);
    }
  }, [userId, onAction, hasPrompt, prompt, isGenerating, onGenerateVector]);

  useEffect(() => {
    determineAction();
    // Refresh every 30 seconds
    const interval = setInterval(determineAction, 30000);
    return () => clearInterval(interval);
  }, [determineAction, hasPrompt, prompt, isGenerating]);

  const handlePrimaryAction = () => {
    if (primaryAction) {
      clickTrackingService.trackClick('ActionCenter', 'execute-primary-action', primaryAction.label, 'click', {
        actionId: primaryAction.id,
        actionLabel: primaryAction.label,
        urgency: primaryAction.urgency,
      });
      primaryAction.action();
    }
  };

  const handleExpand = () => {
    clickTrackingService.trackClick('ActionCenter', 'expand', 'Action Center', 'click', {});
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
    <div 
      className="xibalba-action-center-container"
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 1000,
      }}
    >
      <button
        className={`xibalba-action-center ${urgencyClass} ${hasNotifications ? 'xibalba-action-center-has-notifications' : ''}`}
        onClick={handlePrimaryAction}
        disabled={isGenerating && primaryAction.id === 'generate-vector'}
        onMouseEnter={() => {
          clickTrackingService.trackClick(
            'panel',
            'action-center-primary',
            'Action Center Primary',
            'hover',
            { actionId: primaryAction.id }
          );
        }}
        aria-label={`Action Center: ${primaryAction.label}. ${primaryAction.context}`}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePrimaryAction();
          }
        }}
        style={{
          background: primaryAction.urgency === 'high' || primaryAction.urgency === 'critical' 
            ? 'var(--vectorforge-accent, #ff9800)' 
            : 'var(--xibalba-grey-150, #2a2a2a)',
          color: primaryAction.urgency === 'high' || primaryAction.urgency === 'critical' 
            ? '#ffffff' 
            : 'var(--xibalba-text-000, #ffffff)',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          borderRadius: '8px',
          cursor: (isGenerating && primaryAction.id === 'generate-vector') ? 'wait' : 'pointer',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.2s ease',
          opacity: (isGenerating && primaryAction.id === 'generate-vector') ? 0.7 : 1,
        }}
      >
        <div className="xibalba-action-center-content">
          <span className="xibalba-action-center-icon">
            {primaryAction.icon && <span className="material-icons">{primaryAction.icon}</span>}
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
          <span className="material-icons">{isExpanded ? 'expand_less' : 'expand_more'}</span>
        </button>
      )}

      {isExpanded && secondaryActions.length > 0 && (
        <div className="xibalba-action-center-dropdown">
          {secondaryActions.map(action => (
            <button
              key={action.id}
              className="xibalba-action-center-secondary"
              onClick={() => {
                clickTrackingService.trackClick(
                  'ActionCenter',
                  'execute-secondary-action',
                  action.label,
                  'click',
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
