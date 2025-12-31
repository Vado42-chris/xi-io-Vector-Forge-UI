/**
 * Simple Dev Chat Test Component
 * This is a minimal version to verify the UI is working
 * Shows visible feedback immediately
 */

import React, { useState } from 'react';

export const DevChatTestSimple: React.FC = () => {
  const [message, setMessage] = useState('Ready to test!');
  const [input, setInput] = useState('');

  const handleTest = () => {
    setMessage('✅ Test successful! Dev Chat is working!');
    setTimeout(() => {
      setMessage('Type a message and click Send to test further');
    }, 2000);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessage(`You said: "${input}"\n\n✅ Input received! Dev Chat is functional!`);
    setInput('');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#1a1a1a',
      color: '#ffffff',
      padding: '20px',
    }}>
      {/* Header - Always Visible */}
      <div style={{
        padding: '16px',
        background: '#252525',
        borderRadius: '8px',
        marginBottom: '16px',
        border: '2px solid #ff9800', // Orange border to make it obvious
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#ff9800' }}>
          💬 Dev Chat - TEST MODE
        </h2>
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
          If you can see this, the component is rendering!
        </p>
      </div>

      {/* Status Message - Always Visible */}
      <div style={{
        padding: '16px',
        background: '#2a2a2a',
        borderRadius: '8px',
        marginBottom: '16px',
        minHeight: '100px',
        border: '1px solid #444',
      }}>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '14px' }}>
          {message}
        </p>
      </div>

      {/* Test Button - Always Visible */}
      <button
        onClick={handleTest}
        style={{
          padding: '12px 24px',
          background: '#ff9800',
          color: '#000',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '16px',
        }}
      >
        🧪 Click to Test
      </button>

      {/* Input Area - Always Visible */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '16px',
        borderTop: '1px solid #444',
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message here..."
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '12px',
            background: '#2a2a2a',
            color: '#fff',
            border: '1px solid #444',
            borderRadius: '6px',
            fontSize: '14px',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            marginTop: '8px',
            padding: '10px 20px',
            background: input.trim() ? '#ff9800' : '#555',
            color: input.trim() ? '#000' : '#999',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            width: '100%',
          }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default DevChatTestSimple;

