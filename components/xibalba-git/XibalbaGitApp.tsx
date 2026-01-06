/**
 * Xibalba Git - Main Application
 *
 * Proves MAI Framework and Tooltip patterns work in a simpler product.
 * This will be backported to VectorForge to fix UX issues.
 */

import React from 'react';
import { ActionCenter, useMAI } from '@xibalba/design-system';

// Mock Git state hook (will be replaced with real Git operations)
const useGitState = () => {
  const [state, setState] = React.useState({
    hasConflicts: false,
    hasUncommittedChanges: true,
    hasPendingPush: false,
    hasRemoteUpdates: false,
  });

  return state;
};

export const XibalbaGitApp: React.FC = () => {
  const gitState = useGitState();

  const primaryAction = useMAI({
    state: gitState,
    actions: [
      {
        id: 'resolve-conflicts',
        label: '⚠️ Resolve Conflicts',
        priority: 100, // Highest priority
        condition: state => state.hasConflicts,
        action: () => console.log('Open conflict resolver'),
        tooltip: 'Resolve merge conflicts before continuing',
        urgency: 'critical',
        icon: 'warning',
      },
      {
        id: 'commit-changes',
        label: '💾 Commit Changes',
        priority: 90,
        condition: state => state.hasUncommittedChanges && !state.hasConflicts,
        action: () => console.log('Open commit dialog'),
        tooltip: 'Commit all staged changes to local repository',
        keyboardShortcut: 'Ctrl+Enter',
        urgency: 'high',
        icon: 'save',
      },
      {
        id: 'push-commits',
        label: '⬆️ Push to Remote',
        priority: 80,
        condition: state => state.hasPendingPush && !state.hasUncommittedChanges,
        action: () => console.log('Push to remote'),
        tooltip: 'Push local commits to remote repository',
        keyboardShortcut: 'Ctrl+Shift+P',
        urgency: 'high',
        icon: 'upload',
      },
      {
        id: 'pull-updates',
        label: '⬇️ Pull Updates',
        priority: 70,
        condition: state => state.hasRemoteUpdates && !state.hasUncommittedChanges,
        action: () => console.log('Pull from remote'),
        tooltip: 'Pull latest changes from remote repository',
        keyboardShortcut: 'Ctrl+Shift+U',
        urgency: 'medium',
        icon: 'download',
      },
    ],
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--xibalba-grey-050, #010101)' }}>
      <ActionCenter primaryAction={primaryAction} position="top-right" />

      <div style={{ padding: '24px' }}>
        <h1 style={{ color: 'var(--xibalba-text-100, #fff)', marginBottom: '24px' }}>
          Xibalba Git
        </h1>

        <div
          style={{
            background: 'var(--xibalba-grey-100, #0f0f0f)',
            padding: '16px',
            borderRadius: '8px',
            color: 'var(--xibalba-text-200, #ccc)',
          }}
        >
          <p>Git State:</p>
          <ul>
            <li>Has Conflicts: {gitState.hasConflicts ? 'Yes' : 'No'}</li>
            <li>Has Uncommitted Changes: {gitState.hasUncommittedChanges ? 'Yes' : 'No'}</li>
            <li>Has Pending Push: {gitState.hasPendingPush ? 'Yes' : 'No'}</li>
            <li>Has Remote Updates: {gitState.hasRemoteUpdates ? 'Yes' : 'No'}</li>
          </ul>

          <p style={{ marginTop: '16px' }}>
            <strong>MAI Action:</strong> {primaryAction?.label || 'All Caught Up'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default XibalbaGitApp;
