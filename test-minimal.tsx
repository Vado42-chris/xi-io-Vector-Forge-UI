// Minimal test to verify React can mount
import React from 'react';
import ReactDOM from 'react-dom/client';

const TestApp = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: '#0a0b0e',
    color: '#ff9800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'monospace',
    fontSize: '24px'
  }}>
    ✅ React is working! If you see this, React can mount.
  </div>
);

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<TestApp />);
}

