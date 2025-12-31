// MINIMAL TEST - Verify React can mount
import React from 'react';
import ReactDOM from 'react-dom/client';

const TestApp = () => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0a0b0e',
      color: '#ff9800',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      fontSize: '32px',
      fontWeight: 'bold'
    }}>
      ✅ React Works! If you see this, React can mount.
      <br />
      <div style={{ fontSize: '16px', marginTop: '20px', color: '#ffffff' }}>
        The issue is with App.hardened.tsx imports
      </div>
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  try {
    ReactDOM.createRoot(root).render(<TestApp />);
    console.log('✅ React mounted successfully');
  } catch (error) {
    console.error('❌ React mount failed:', error);
    root.innerHTML = `
      <div style="
        position: fixed;
        inset: 0;
        background: #0a0b0e;
        color: #ff0000;
        padding: 40px;
        font-family: monospace;
      ">
        <h1>React Mount Error</h1>
        <pre>${error instanceof Error ? error.message : String(error)}</pre>
        <pre>${error instanceof Error ? error.stack : ''}</pre>
      </div>
    `;
  }
} else {
  console.error('❌ Root element not found');
}

