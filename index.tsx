import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.hardened';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Wrap in try-catch and use setTimeout to defer initialization
setTimeout(() => {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render app:', error);
    rootElement.className = 'error-fallback';
    rootElement.innerHTML = `
      <div class="error-container">
        <h1>VectorForge Error</h1>
        <p>Failed to load application:</p>
        <pre class="error-message">${error instanceof Error ? error.message : String(error)}</pre>
        <p>Check browser console for details.</p>
      </div>
    `;
  }
}, 0);
