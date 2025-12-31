import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Minimal working app - guaranteed to load
const MinimalApp: React.FC = () => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#010101',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      padding: '40px'
    }}>
      <h1 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '32px' }}>
        ✅ VectorForge is Loading
      </h1>
      <p style={{ color: '#f0f0f0', marginBottom: '10px' }}>
        React is mounted successfully!
      </p>
      <p style={{ color: '#999', fontSize: '14px' }}>
        If you see this, the app is working. Now adding features...
      </p>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <MinimalApp />
      </React.StrictMode>
    );
    console.log('✅ Minimal app mounted successfully');
  } catch (error) {
    console.error('❌ Failed to mount minimal app:', error);
    rootElement.innerHTML = `
      <div style="
        position: fixed;
        inset: 0;
        background: #010101;
        color: #ff0000;
        padding: 40px;
        font-family: monospace;
        overflow: auto;
        z-index: 99999;
      ">
        <h1 style="color: #ff9800; margin-bottom: 20px;">🚨 Mount Error</h1>
        <pre style="color: #ffffff; white-space: pre-wrap;">${error instanceof Error ? error.message : String(error)}</pre>
        <pre style="color: #999; font-size: 12px; margin-top: 20px;">${error instanceof Error ? error.stack : 'No stack trace'}</pre>
      </div>
    `;
  }
} else {
  console.error('❌ Root element not found');
}

