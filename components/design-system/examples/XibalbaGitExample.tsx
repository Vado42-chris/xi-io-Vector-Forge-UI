/**
 * Xibalba Git Example
 * 
 * Demonstrates how to use MAI Framework and Tooltips in Xibalba Git.
 * This proves the patterns work before applying to VectorForge.
 */

import React from 'react';
import { ActionCenter, Tooltip, useMAI } from '../index';

// Mock Git state hook
const useGitState = () => {
  return {
    hasConflicts: false,
    hasUncommittedChanges: true,
    hasPendingPush: false,
    hasRemoteUpdates: false,
  };
};

export const XibalbaGitExample: React.FC = () => {
  const gitState = useGitState();

  const primaryAction = useMAI({
    state: gitState,
    actions: [
      {
        id: 'resolve-conflicts',
        label: '⚠️ Resolve Conflicts',
        priority: 100, // Highest priority
        condition: (state) => state.hasConflicts,
        action: () => console.log('Open conflict resolver'),
      },
      {
        id: 'commit-changes',
        label: '💾 Commit Changes',
        priority: 90,
        condition: (state) => state.hasUncommittedChanges,
        action: () => console.log('Open commit dialog'),
      },
      {
        id: 'push-commits',
        label: '⬆️ Push to Remote',
        priority: 80,
        condition: (state) => state.hasPendingPush,
        action: () => console.log('Push to remote'),
      },
      {
        id: 'pull-updates',
        label: '⬇️ Pull Updates',
        priority: 70,
        condition: (state) => state.hasRemoteUpdates,
        action: () => console.log('Pull from remote'),
      },
    ],
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Xibalba Git</h1>
      
      {/* MAI Action Center */}
      <ActionCenter primaryAction={primaryAction} position="top-right" />

      {/* Git Operations with Tooltips */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '60px' }}>
        <Tooltip content="Stage all changes for commit" shortcut="Ctrl+S">
          <button>Stage All</button>
        </Tooltip>

        <Tooltip content="Commit staged changes" shortcut="Ctrl+Enter">
          <button>Commit</button>
        </Tooltip>

        <Tooltip content="Push commits to remote repository" shortcut="Ctrl+P">
          <button>Push</button>
        </Tooltip>

        <Tooltip content="Pull latest changes from remote" shortcut="Ctrl+U">
          <button>Pull</button>
        </Tooltip>
      </div>

      {/* Repository List */}
      <div style={{ marginTop: '40px' }}>
        <h2>Repositories</h2>
        <Tooltip content="View repository details and history">
          <button>vectorforge-ui</button>
        </Tooltip>
      </div>
    </div>
  );
};

export default XibalbaGitExample;

