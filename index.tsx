import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/header-fix.css'; // Header visibility hot-fix
// TEMP: Using App.simple for salvage - working minimal version
import App from './App.simple';
import DevChatbot from './components/DevChatbot';
import ErrorBoundary from './components/ErrorBoundary';

// Router component - handles routing between App and DevChat standalone
const Router: React.FC = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle /devchat route - redirect to main app (Dev Chat is in Right Sidebar)
  if (path === '/devchat') {
    // Redirect to main app - Dev Chat is accessible via Right Sidebar (Ctrl+K)
    useEffect(() => {
      window.history.replaceState({}, '', '/');
      setPath('/');
    }, []);
    // Show full app while redirecting
    return (
      <ErrorBoundary>
        <App />
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
        <h1 style="color: #ff9800; margin-bottom: 20px;">🚨 VectorForge Promise Rejection</h1>
        <div style="background: #1a1c22; padding: 20px; border-radius: 8px;">
          <h2 style="color: #ff0000;">Error:</h2>
          <pre style="color: #ffffff; white-space: pre-wrap; word-wrap: break-word;">${event.reason?.message || String(event.reason) || 'Unknown promise rejection'}</pre>
        </div>
      </div>
    `;
  }
});

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

// Mount React immediately
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// eslint-disable-next-line no-console
console.log('🚀 Starting React mount...');
console.log('📍 Current path:', window.location.pathname);
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
// eslint-disable-next-line no-console
console.log('✅ Router mounted successfully');
