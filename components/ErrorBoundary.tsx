/**
 * Error Boundary Component
 * Isolates component failures to prevent app-wide crashes
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorLogger } from '../services/errorLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to error logger
    errorLogger.log({
      type: 'error',
      message: error.message || 'Component error',
      stack: error.stack,
      context: {
        componentStack: errorInfo.componentStack,
        handled: true,
      },
    });
    
    const props = this.props as Props;
    if (props.onError) {
      props.onError(error, errorInfo);
    }
  }

  render() {
    const props = this.props as Props;
    if (this.state.hasError) {
      // #region agent log - ErrorBoundary covering UI
      console.log('[DEBUG] ErrorBoundary: ERROR STATE - Covering UI', {
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'z-index-cover-diagnostic',
        hypothesisId: 'A',
        data: {
          hasError: true,
          errorMessage: this.state.error?.message,
          zIndex: 99999,
          position: 'fixed',
          coversFullScreen: true,
        },
      });
      // #endregion
      if (props.fallback) {
        return props.fallback;
      }
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#1a1c22',
          color: '#ffffff',
          padding: '40px',
          zIndex: 99999,
          fontFamily: 'monospace',
          pointerEvents: 'auto',
        }}>
          <h1 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '24px' }}>
            🚨 Component Error
          </h1>
          <div style={{ background: '#0a0b0e', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2 style={{ color: '#ff0000', marginBottom: '10px' }}>Error:</h2>
            <pre style={{ color: '#ffffff', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {this.state.error?.message || 'An error occurred'}
            </pre>
            {this.state.error?.stack && (
              <details style={{ marginTop: '10px' }}>
                <summary style={{ color: '#999', cursor: 'pointer' }}>Stack Trace</summary>
                <pre style={{ color: '#999', fontSize: '12px', marginTop: '10px', whiteSpace: 'pre-wrap' }}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return (this.props as Props).children;
  }
}

export default ErrorBoundary;

