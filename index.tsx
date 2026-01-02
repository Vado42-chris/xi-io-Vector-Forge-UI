import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import DevChatbot from './components/DevChatbot';
import ErrorBoundary from './components/ErrorBoundary';

// #region agent log
console.log('[DEBUG] index.tsx loaded', { react: typeof React, useState: typeof useState, ReactDOM: typeof ReactDOM, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D,E' });
// #endregion

// Router component - handles routing between App and DevChat standalone
const Router: React.FC = () => {
  // #region agent log
  console.log('[DEBUG] Router component rendering', { path: window.location.pathname, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D,E' });
  // #endregion
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle /devchat route - standalone Dev Chat
  if (path === '/devchat') {
    return (
      <ErrorBoundary>
        <div style={{
          width: '100vw',
          height: '100vh',
          background: 'var(--xibalba-grey-000, #000000)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255, 152, 0, 0.2)',
            background: 'var(--xibalba-grey-050, #010101)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h1 style={{ 
              color: 'var(--vectorforge-accent, #ff9800)', 
              margin: 0,
              fontSize: '20px',
              fontWeight: 600
            }}>
              💬 Dev Chat - Self-Modifying AI
            </h1>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setPath('/');
              }}
              style={{
                background: 'var(--vectorforge-accent, #ff9800)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '14px'
              }}
            >
              ← Back to App
            </button>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <DevChatbot />
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Default route - full App
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
};

// Global error handler - shows errors on screen
window.addEventListener('error', (event) => {
  const rootElement = document.getElementById('root');
  if (rootElement && !rootElement.querySelector('.error-display')) {
    rootElement.innerHTML = `
      <div class="error-display" style="
        position: fixed;
        inset: 0;
        background: #0a0b0e;
        color: #ff0000;
        padding: 40px;
        font-family: monospace;
        overflow: auto;
        z-index: 99999;
      ">
        <h1 style="color: #ff9800; margin-bottom: 20px;">🚨 VectorForge Error</h1>
        <div style="background: #1a1c22; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #ff0000;">Error:</h2>
          <pre style="color: #ffffff; white-space: pre-wrap; word-wrap: break-word;">${event.error?.message || event.message || 'Unknown error'}</pre>
        </div>
        <div style="background: #1a1c22; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #ff9800;">Stack Trace:</h2>
          <pre style="color: #999999; white-space: pre-wrap; word-wrap: break-word; font-size: 12px;">${event.error?.stack || 'No stack trace'}</pre>
        </div>
        <div style="background: #1a1c22; padding: 20px; border-radius: 8px;">
          <h2 style="color: #ff9800;">File:</h2>
          <p style="color: #ffffff;">${event.filename || 'Unknown'}:${event.lineno || '?'}:${event.colno || '?'}</p>
        </div>
      </div>
    `;
  }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  const rootElement = document.getElementById('root');
  if (rootElement && !rootElement.querySelector('.error-display')) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-display';
    errorDiv.style.cssText = 'position: fixed; inset: 0; background: #0a0b0e; color: #ff0000; padding: 40px; font-family: monospace; overflow: auto; z-index: 99999;';
    const errorMsg = event.reason?.message || String(event.reason) || 'Unknown promise rejection';
    errorDiv.innerHTML = '<h1 style="color: #ff9800; margin-bottom: 20px;">🚨 Promise Rejection</h1><div style="background: #1a1c22; padding: 20px; border-radius: 8px;"><h2 style="color: #ff0000;">Error:</h2><pre style="color: #ffffff; white-space: pre-wrap; word-wrap: break-word;">' + errorMsg + '</pre></div>';
    rootElement.appendChild(errorDiv);
  }
});

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
        <Router />
      </React.StrictMode>
    );
    console.log('✅ VectorForge app mounted successfully');
  } catch (error) {
    console.error('❌ Failed to mount minimal app:', error);
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position: fixed; inset: 0; background: #010101; color: #ff0000; padding: 40px; font-family: monospace; overflow: auto; z-index: 99999;';
    const errorMsg = error instanceof Error ? error.message : String(error);
    errorDiv.innerHTML = '<h1 style="color: #ff9800; margin-bottom: 20px;">🚨 VectorForge Error</h1><div style="background: #1a1c22; padding: 20px; border-radius: 8px;"><h2 style="color: #ff0000;">Error:</h2><pre style="color: #ffffff; white-space: pre-wrap; word-wrap: break-word;">' + errorMsg + '</pre></div>';
    rootElement.appendChild(errorDiv);
  }
}

// CRITICAL: Block auth redirects at client level - MUST happen before React loads
(function() {
  'use strict';
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  
  // Block any auth redirects immediately
  if (currentPath.startsWith('/api/auth') || currentSearch.includes('error=CredentialsSignin')) {
    console.warn('🚫 Blocked auth redirect at client level - redirecting to home');
    window.history.replaceState({}, '', '/');
    // Force reload to clear any cached redirect state
    if (window.location.pathname.startsWith('/api/auth')) {
      window.location.replace('/');
    }
  }
})();

// Mount React immediately - REMOVED DUPLICATE CODE
// The mount happens above at line 160-176

