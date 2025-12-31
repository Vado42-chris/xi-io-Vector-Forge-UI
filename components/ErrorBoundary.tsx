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
    
    // Capture error globally so we can inspect it in the browser for debugging
    try {
      (window as any).__lastReactError = { message: error?.message, stack: error?.stack, info: errorInfo };
    } catch (e) {}
    // Also push to window captured array
    try {
      (window as any).__capturedReactErrors = (window as any).__capturedReactErrors || [];
      (window as any).__capturedReactErrors.push({ when: new Date().toISOString(), message: error?.message, stack: error?.stack, info: errorInfo });
    } catch (e) {}
    
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
      if (props.fallback) {
        return props.fallback;
      }
      // Render visible banner with error summary for immediate validation
      return (
        <div style={{ background: '#ffebee', color: '#b00020', padding: 12, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999999 }}>
          <strong>App error detected:</strong> {String(this.state.error?.message || 'unknown')}. Check console or window.__lastReactError for full stack.
        </div>
      );
    }

    return (this.props as Props).children;
  }
}

export default ErrorBoundary;

