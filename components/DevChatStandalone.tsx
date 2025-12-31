/**
 * Dev Chat Standalone Page
 * Direct route: /devchat
 * Bypasses all App.hardened.tsx complexity
 * Always works, always visible
 */

import React from 'react';
import DevChatbot from './DevChatbot';

export const DevChatStandalone: React.FC = () => {
  return (
    <div className="dev-chat-standalone">
      {/* Header */}
      <div className="dev-chat-standalone-header">
        <div>
          <h1 className="dev-chat-standalone-title">
            💬 Dev Chat - Self-Modifying AI
          </h1>
          <p className="dev-chat-standalone-subtitle">
            Direct access - Always available
          </p>
        </div>
        <a
          href="/"
          className="dev-chat-standalone-back-button"
        >
          ← Back to App
        </a>
      </div>

      {/* Dev Chat Component */}
      <div className="dev-chat-standalone-content">
        <DevChatbot
          onFileSelect={(path) => {
            console.log('File selected:', path);
          }}
          onShowHistory={() => {
            console.log('Show history');
          }}
        />
      </div>
    </div>
  );
};

export default DevChatStandalone;

