/**
 * InspectorPanel Component
 * Detailed metadata inspector for tasks, timeline items, and VectorForge items.
 * 
 * Date: December 27, 2025
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 * Location: Saskatoon, Saskatchewan, Canada, S7J 3E8
 * 
 * Patent Tracking: Context-aware metadata inspector with bidirectional linking pattern
 * Work Tracking: All interactions tracked for seed001 Blockchain records
 */

import React, { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { clickTrackingService } from '../services/clickTrackingService';
import { workTrackingService } from '../services/workTrackingService';
import { vectorForgeTaskLinkService } from '../services/vectorForgeTaskLinkService';

interface InspectorPanelProps {
  item: Task | VectorForgeItem | TimelineItem | null;
  onUpdate?: (updates: Partial<Task>) => void;
  onLink?: (item: Task | VectorForgeItem | TimelineItem, target: Task | VectorForgeItem | TimelineItem) => void;
  onClose?: () => void;
}

interface VectorForgeItem {
  id: string;
  type: 'layer' | 'keyframe' | 'canvas';
  name: string;
  properties?: Record<string, any>;
}

interface TimelineItem {
  id: string;
  frame: number;
  layerId?: string;
  properties?: Record<string, any>;
}

type TabType = 'details' | 'timeline' | 'vectorforge' | 'comments' | 'attachments' | 'history';

const InspectorPanel: React.FC<InspectorPanelProps> = ({
  item,
  onUpdate,
  onLink,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [linkedTasks, setLinkedTasks] = useState<Task[]>([]);
  const [linkedVectorForgeItems, setLinkedVectorForgeItems] = useState<VectorForgeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const sessionId = React.useRef<string | null>(null);

  useEffect(() => {
    if (item) {
      sessionId.current = workTrackingService.startSession('InspectorPanel', 'view', item.id);
      workTrackingService.recordCalculation();
      loadLinkedItems();
    }
    return () => {
      if (sessionId.current) {
        workTrackingService.endSession();
      }
    };
  }, [item]);

  const loadLinkedItems = async () => {
    if (!item) return;
    
    setLoading(true);
    try {
      workTrackingService.recordCalculation();
      
      // Load linked tasks if this is a VectorForge item
      if ('type' in item && (item.type === 'layer' || item.type === 'keyframe' || item.type === 'canvas')) {
        // TODO: Implement getTasksLinkedToAsset method
        // const tasks = await vectorForgeTaskLinkService.getTasksLinkedToAsset(item.id, item.type);
        setLinkedTasks([]);
      }
      
      // Load linked VectorForge items if this is a task
      if ('status' in item) {
        const task = item;
        if (task.metadata?.relatedVectorForgeItems) {
          // TODO: Load VectorForge items from IDs
          setLinkedVectorForgeItems([]);
        }
      }
    } catch (error) {
      console.error('InspectorPanel: Error loading linked items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    clickTrackingService.trackClick('InspectorPanel', 'switch-tab', `Switch to ${tab}`, 'click', {
      itemId: item?.id,
      tab,
    });
    workTrackingService.recordCalculation();
    setActiveTab(tab);
  };

  const handleLink = async (targetId: string, targetType: 'task' | 'vectorforge' | 'timeline') => {
    if (!item) return;
    
    clickTrackingService.trackClick('InspectorPanel', 'link-item', 'Link Item', 'click', {
      sourceId: item.id,
      targetId,
      targetType,
    });
    workTrackingService.recordCalculation();
    
    // TODO: Implement linking logic
    if (onLink) {
      // onLink(item, target);
    }
  };

  const handleUpdate = (updates: Partial<Task>) => {
    if (!item || !('status' in item)) return;
    
    clickTrackingService.trackClick('InspectorPanel', 'update-item', 'Update Item', 'click', {
      updates,
    });
    workTrackingService.recordCalculation();
    
    if (onUpdate) {
      onUpdate(updates);
    }
  };

  if (!item) {
    return (
      <div className="xibalba-inspector-panel-empty">
        <span className="material-icons">info</span>
        <p>Select an item to view details</p>
      </div>
    );
  }

  const isTask = 'status' in item;
  const task = isTask ? (item) : null;

  const tabs: { id: string; label: string; icon: string }[] = [
    { id: 'details', label: 'Details', icon: 'info' },
    ...(isTask ? [
      { id: 'timeline', label: 'Timeline', icon: 'timeline' },
      { id: 'vectorforge', label: 'VectorForge', icon: 'layers' },
      { id: 'comments', label: 'Comments', icon: 'comment' },
      { id: 'attachments', label: 'Attachments', icon: 'attach_file' },
    ] : []),
    { id: 'history', label: 'History', icon: 'history' },
  ];

  return (
    <div className="xibalba-inspector-panel">
      {/* Header */}
      <div className="xibalba-inspector-panel-header">
        <div className="flex items-center justify-between">
          <h2 className="xibalba-inspector-panel-title">
            {isTask ? task!.title : ('name' in item ? item.name : 'Item')}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="xibalba-inspector-panel-close"
              aria-label="Close inspector"
            >
              <span className="material-icons">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="xibalba-inspector-panel-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`xibalba-inspector-panel-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id as TabType)}
            aria-label={tab.label}
          >
            <span className="material-icons text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="xibalba-inspector-panel-content">
        {loading && (
          <div className="xibalba-inspector-panel-loading">
            <div className="xibalba-action-center-spinner"></div>
            <span>Loading...</span>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="xibalba-inspector-panel-section">
            {isTask && task && (
              <>
                <div className="xibalba-inspector-panel-field">
                  <label>Status</label>
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdate({ status: e.target.value as Task['status'] })}
                    className="xibalba-input-professional"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>

                <div className="xibalba-inspector-panel-field">
                  <label>Priority</label>
                  <select
                    value={task.priority}
                    onChange={(e) => handleUpdate({ priority: e.target.value as Task['priority'] })}
                    className="xibalba-input-professional"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="xibalba-inspector-panel-field">
                  <label>Assignee</label>
                  <div className="flex items-center gap-2">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
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
                        <span>{task.assignee.username}</span>
                      </div>
                    ) : (
                      <button className="xibalba-button-secondary-professional">
                        Assign
                      </button>
                    )}
                  </div>
                </div>

                <div className="xibalba-inspector-panel-field">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleUpdate({ dueDate: e.target.value })}
                    className="xibalba-input-professional"
                  />
                </div>

                <div className="xibalba-inspector-panel-field">
                  <label>Description</label>
                  <textarea
                    value={task.description || ''}
                    onChange={(e) => handleUpdate({ description: e.target.value })}
                    className="xibalba-input-professional"
                    rows={4}
                  />
                </div>

                <div className="xibalba-inspector-panel-field">
                  <label>Tags</label>
                  <div className="xibalba-task-card-tags">
                    {task.tags.map((tag) => (
                      <span key={tag} className="xibalba-task-card-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!isTask && (
              <div className="xibalba-inspector-panel-field">
                <label>Type</label>
                <span>{'type' in item ? item.type : 'timeline'}</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && isTask && (
          <div className="xibalba-inspector-panel-section">
            <p className="xibalba-text-caption">Timeline mapping for this task</p>
            {/* TODO: Timeline visualization */}
          </div>
        )}

        {activeTab === 'vectorforge' && isTask && (
          <div className="xibalba-inspector-panel-section">
            <div className="xibalba-inspector-panel-linked-items">
              <h3>Linked VectorForge Items</h3>
              {linkedVectorForgeItems.length === 0 ? (
                <p className="xibalba-text-caption">No linked VectorForge items</p>
              ) : (
                <ul>
                  {linkedVectorForgeItems.map((vfItem) => (
                    <li key={vfItem.id}>
                      <button
                        onClick={() => handleLink(vfItem.id, 'vectorforge')}
                        className="xibalba-button-link"
                      >
                        {vfItem.name} ({vfItem.type})
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {activeTab === 'comments' && isTask && (
          <div className="xibalba-inspector-panel-section">
            <div className="xibalba-inspector-panel-comments">
              {task!.comments && task!.comments.length > 0 ? (
                <ul>
                  {task!.comments.map((comment) => (
                    <li key={comment.id} className="xibalba-inspector-panel-comment">
                      <div className="xibalba-inspector-panel-comment-header">
                        <span>{comment.author?.id || comment.author?.username || 'Unknown'}</span>
                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p>{comment.content}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="xibalba-text-caption">No comments yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'attachments' && isTask && (
          <div className="xibalba-inspector-panel-section">
            <div className="xibalba-inspector-panel-attachments">
              {task!.attachments && task!.attachments.length > 0 ? (
                <ul>
                  {task!.attachments.map((attachment) => (
                    <li key={attachment.id} className="xibalba-inspector-panel-attachment">
                      <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                        {attachment.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="xibalba-text-caption">No attachments</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="xibalba-inspector-panel-section">
            <p className="xibalba-text-caption">History tracking coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectorPanel;

