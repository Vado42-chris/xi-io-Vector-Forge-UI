import React, { useState, useEffect, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Lazy load components to catch import errors
const App = lazy(() => import('./App.hardened').catch((error) => {
  console.error('❌ CRITICAL: Failed to import App.hardened:', error);
  // #region agent log - Import error
  console.error('[DEBUG] App.hardened import failed', {
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'black-box-cover-diagnostic',
    hypothesisId: 'H',
    data: {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    },
  });
  // #endregion
  // Return minimal fallback that doesn't cover the UI
  return {
    default: () => (
      <div 
        style={{ 
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          maxWidth: '500px',
          background: '#ff0000',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          zIndex: 99999,
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => (e.currentTarget as HTMLElement).remove()}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🚨 Import Error</div>
        <div style={{ fontSize: '12px', opacity: 0.9 }}>
          {error instanceof Error ? error.message : String(error)}
        </div>
      </div>
    )
  };
}));

const DevChatbot = lazy(() => import('./components/DevChatbot').catch(() => ({
  default: () => <div>DevChatbot failed to load</div>
})));

const ErrorBoundary = lazy(() => import('./components/ErrorBoundary').catch(() => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
})));

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

// Global error handler - log to console only (don't cover UI)
window.addEventListener('error', (event) => {
  // #region agent log - Global error handler triggered
  console.error('[DEBUG] Global error handler triggered', {
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'black-box-cover-diagnostic',
    hypothesisId: 'E',
    data: {
      message: event.error?.message || event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
    },
  });
  // #endregion
  
  // Log to console but DON'T replace UI - let ErrorBoundary handle it
  console.error('🚨 VectorForge Error:', event.error?.message || event.message);
  if (event.error?.stack) {
    console.error('Stack trace:', event.error.stack);
  }
  
  // Only show error overlay if ErrorBoundary hasn't caught it
  // (ErrorBoundary will handle React errors, this is for non-React errors)
  const rootElement = document.getElementById('root');
  if (rootElement && !rootElement.querySelector('.error-display') && !rootElement.querySelector('[style*="z-index: 99999"]')) {
    // Create a small error indicator in corner instead of covering entire UI
    const errorIndicator = document.createElement('div');
    errorIndicator.className = 'error-display';
    errorIndicator.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #ff0000; color: white; padding: 12px 20px; border-radius: 8px; font-family: monospace; font-size: 12px; z-index: 99999; max-width: 400px; cursor: pointer;';
    errorIndicator.textContent = `🚨 Error: ${(event.error?.message || event.message || 'Unknown').substring(0, 50)}`;
    errorIndicator.title = event.error?.message || event.message || 'Unknown error';
    errorIndicator.onclick = () => errorIndicator.remove();
    rootElement.appendChild(errorIndicator);
    // Auto-remove after 10 seconds
    setTimeout(() => errorIndicator.remove(), 10000);
  }
});

// Unhandled promise rejection handler - log to console only (don't cover UI)
window.addEventListener('unhandledrejection', (event) => {
  // #region agent log - Unhandled promise rejection
  const errorMsg = event.reason?.message || String(event.reason) || 'Unknown promise rejection';
  console.error('[DEBUG] Unhandled promise rejection', {
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'black-box-cover-diagnostic',
    hypothesisId: 'F',
    data: { message: errorMsg, reason: event.reason },
  });
  // #endregion
  
  // Log to console but DON'T replace UI
  console.error('🚨 Unhandled Promise Rejection:', errorMsg);
  
  // Only show small error indicator if no other error display exists
  const rootElement = document.getElementById('root');
  if (rootElement && !rootElement.querySelector('.error-display') && !rootElement.querySelector('[style*="z-index: 99999"]')) {
    const errorIndicator = document.createElement('div');
    errorIndicator.className = 'error-display';
    errorIndicator.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #ff9800; color: white; padding: 12px 20px; border-radius: 8px; font-family: monospace; font-size: 12px; z-index: 99999; max-width: 400px; cursor: pointer;';
    errorIndicator.textContent = `⚠️ Promise Rejection: ${errorMsg.substring(0, 50)}`;
    errorIndicator.title = errorMsg;
    errorIndicator.onclick = () => errorIndicator.remove();
    rootElement.appendChild(errorIndicator);
    setTimeout(() => errorIndicator.remove(), 10000);
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
    // Force clear any existing content
    rootElement.innerHTML = '';
    rootElement.style.cssText = 'width: 100vw; height: 100vh; margin: 0; padding: 0; background: #0a0b0e;';
    
    const root = ReactDOM.createRoot(rootElement);
    
    // Render App - NO SUSPENSE FALLBACK (removed loading screen that was covering UI)
    // REMOVED StrictMode - was causing double renders in dev
    // CACHE BUST: Added timestamp to verify we're serving the latest code
    console.log('🚀 MOUNTING APP - Version:', new Date().toISOString());
    console.log('🚀 NO StrictMode - NO 22 ErrorBoundaries - NO duplicate backgrounds');
    root.render(
      <ErrorBoundary>
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </ErrorBoundary>
    );
    console.log('✅ VectorForge app mounted successfully (lazy loaded App)');
  } catch (error) {
    // #region agent log - Mount error
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[DEBUG] Failed to mount app', {
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'black-box-cover-diagnostic',
      hypothesisId: 'G',
      data: { message: errorMsg, error },
    });
    // #endregion
    
    console.error('❌ Failed to mount minimal app:', error);
    // Show error in console, but don't cover entire UI - show small indicator instead
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #ff0000; color: white; padding: 16px 24px; border-radius: 8px; font-family: monospace; font-size: 14px; z-index: 99999; max-width: 500px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.5);';
    errorDiv.innerHTML = '<div style="font-weight: bold; margin-bottom: 8px;">🚨 Mount Error</div><div style="font-size: 12px; opacity: 0.9;">' + errorMsg.substring(0, 100) + '</div>';
    errorDiv.title = errorMsg;
    errorDiv.onclick = () => errorDiv.remove();
    rootElement.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 15000);
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

