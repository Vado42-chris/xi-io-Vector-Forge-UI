/**
 * Replication Panel
 * UI for managing multiple chatbot instances
 * Shows the "save both" capability in action
 */

import React, { useState, useEffect } from 'react';
import { replicationService, ChatbotInstance, ReplicationRequest } from '../services/replicationService';

interface ReplicationPanelProps {
  onInstanceSelect?: (instanceId: string) => void;
}

export const ReplicationPanel: React.FC<ReplicationPanelProps> = ({ onInstanceSelect }) => {
  const [instances, setInstances] = useState<ChatbotInstance[]>([]);
  const [isReplicating, setIsReplicating] = useState(false);
  const [task, setTask] = useState('');
  const [numInstances, setNumInstances] = useState(2);

  useEffect(() => {
    // Refresh instances periodically
    const interval = setInterval(() => {
      setInstances(replicationService.getAllInstances());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleReplicate = async () => {
    if (!task.trim()) return;

    setIsReplicating(true);
    try {
      const request: ReplicationRequest = {
        task: task.trim(),
        numInstances,
        strategy: 'parallel',
        mergeStrategy: 'best',
      };

      const result = await replicationService.replicateAndExecute(request);
      
      // Refresh instances
      setInstances(replicationService.getAllInstances());
      
      // Show result
      alert(`Replication complete! ${result.instances.length} instances executed. Best: ${result.bestInstance}`);
    } catch (error) {
      console.error('Replication failed:', error);
      alert(`Replication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsReplicating(false);
    }
  };

  const getStateColor = (state: ChatbotInstance['state']): string => {
    switch (state) {
      case 'idle': return 'text-gray-400';
      case 'thinking': return 'text-yellow-400';
      case 'executing': return 'text-blue-400';
      case 'completed': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStateIcon = (state: ChatbotInstance['state']): string => {
    switch (state) {
      case 'idle': return 'pause';
      case 'thinking': return 'psychology';
      case 'executing': return 'sync';
      case 'completed': return 'check_circle';
      case 'error': return 'error';
      default: return 'help';
    }
  };

  return (
    <div className="replication-panel p-4 bg-[var(--xibalba-grey-050)] text-[var(--xibalba-text-primary)]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">🔄 Replication System</h2>
        <p className="text-sm text-[var(--xibalba-text-200)] mb-4">
          Create multiple instances to explore different solutions. Like saving both people on the railroad tracks.
        </p>
      </div>

      {/* Replication Controls */}
      <div className="mb-4 space-y-3">
        <div>
          <label className="block text-sm mb-1">Task:</label>
          <textarea
            className="xibalba-input-professional w-full"
            rows={3}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task for multiple instances to solve..."
            disabled={isReplicating}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Number of Instances:</label>
          <input
            type="number"
            min={2}
            max={10}
            value={numInstances}
            onChange={(e) => setNumInstances(parseInt(e.target.value) || 2)}
            className="xibalba-input-professional w-20"
            disabled={isReplicating}
          />
          <span className="text-sm text-[var(--xibalba-text-200)] ml-2">
            (Default: 2 - "save both")
          </span>
        </div>

        <button
          onClick={handleReplicate}
          disabled={!task.trim() || isReplicating}
          className="xibalba-button-professional primary w-full"
        >
          {isReplicating ? (
            <>
              <span className="material-symbols-outlined animate-spin mr-2">sync</span>
              Replicating...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined mr-2">content_copy</span>
              Replicate & Execute
            </>
          )}
        </button>
      </div>

      {/* Instances List */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2">Active Instances ({instances.length})</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {instances.length === 0 ? (
            <p className="text-sm text-[var(--xibalba-text-200)] text-center py-4">
              No instances yet. Create one to start.
            </p>
          ) : (
            instances.map((instance) => (
              <div
                key={instance.id}
                className="p-3 bg-[var(--xibalba-grey-100)] rounded border border-[var(--xibalba-grey-200)] cursor-pointer hover:bg-[var(--xibalba-grey-150)] transition-colors"
                onClick={() => onInstanceSelect?.(instance.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined ${getStateColor(instance.state)}`}>
                      {getStateIcon(instance.state)}
                    </span>
                    <span className="font-medium">{instance.name}</span>
                  </div>
                  <span className="text-xs text-[var(--xibalba-text-200)]">
                    {instance.createdAt.toLocaleTimeString()}
                  </span>
                </div>

                {instance.currentTask && (
                  <p className="text-sm text-[var(--xibalba-text-200)] mb-1">
                    Task: {instance.currentTask}
                  </p>
                )}

                {instance.error && (
                  <p className="text-sm text-red-400 mt-1">Error: {instance.error}</p>
                )}

                {instance.result && (
                  <div className="mt-2 p-2 bg-[var(--xibalba-grey-050)] rounded text-xs">
                    <strong>Result:</strong> {JSON.stringify(instance.result, null, 2).substring(0, 100)}...
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Philosophy Note */}
      <div className="mt-4 p-3 bg-[var(--xibalba-accent-050)] rounded border border-[var(--xibalba-accent-200)]">
        <p className="text-xs text-[var(--xibalba-text-200)]">
          <strong>💡 The Human Dilemma:</strong> Humans face binary choices (save one or the other).
          AI can replicate itself to explore both paths simultaneously, then merge the best outcomes.
          This is the fundamental advantage of AI replication.
        </p>
      </div>
    </div>
  );
};

export default ReplicationPanel;

