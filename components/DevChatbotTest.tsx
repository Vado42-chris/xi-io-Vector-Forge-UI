/**
 * DevChatbot Test Component
 * Simple test to verify DevChatbot is accessible
 */

import React from 'react';
import DevChatbot from './DevChatbot';

export const DevChatbotTest: React.FC = () => {
  return (
    <div style={{ padding: '20px', background: '#1a1a1a', color: '#fff', minHeight: '100vh' }}>
      <h1>DevChatbot Test</h1>
      <p>If you can see this, React is working.</p>
      <p>If you can see the chat below, DevChatbot is working.</p>
      <div style={{ border: '1px solid #333', padding: '10px', marginTop: '20px' }}>
        <DevChatbot />
      </div>
    </div>
  );
};

export default DevChatbotTest;

