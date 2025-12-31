import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/header-fix.css'; // Header visibility hot-fix
// Using App.hardened - full featured version with all components
import App from './App.hardened';
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

// Global error handler - LOG ONLY, NO UI DISPLAY
window.addEventListener('error', (event) => {
  console.error('VectorForge Error:', {
    message: event.error?.message || event.message,
    stack: event.error?.stack,
    file: `${event.filename || 'Unknown'}:${event.lineno || '?'}:${event.colno || '?'}`
  });
});

// Unhandled promise rejection handler - LOG ONLY, NO UI DISPLAY
window.addEventListener('unhandledrejection', (event) => {
  console.error('VectorForge Promise Rejection:', {
    message: event.reason?.message || String(event.reason),
    stack: event.reason?.stack
  });
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
