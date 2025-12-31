/**
 * Standalone Dev Chat Test Page
 * Direct route: /devchat
 * Makes it easy to test and verify Dev Chat is working
 */

import React from 'react';
import DevChatbot from '../components/DevChatbot';

export const DevChatTest: React.FC = () => {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'var(--xibalba-grey-000, #1a1a1a)',
      color: 'var(--xibalba-text-primary, #ffffff)'
    }}>
      <div style={{ 
        padding: '20px', 
        background: 'var(--xibalba-grey-050, #252525)',
        borderBottom: '1px solid var(--xibalba-grey-200, #333)'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          💬 Dev Chat - Self-Modifying AI
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.7 }}>
          Test page for Dev Chat functionality. This should always be visible.
        </p>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <DevChatbot 
          onFileSelect={(path) => console.log('File selected:', path)}
          onShowHistory={() => console.log('Show history')}
        />
      </div>
    </div>
  );
};

export default DevChatTest;

