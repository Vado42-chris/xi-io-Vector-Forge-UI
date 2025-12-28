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
      if (props.fallback) {
        return props.fallback;
      }
      return (
        <div className="xibalba-panel-professional p-4 border border-red-500/50 bg-red-500/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-red-400">error</span>
            <span className="xibalba-text-caption text-red-400">Component Error</span>
          </div>
          <p className="xibalba-text-xs text-[var(--xibalba-text-300)]">
            {this.state.error?.message || 'An error occurred'}
          </p>
        </div>
      );
    }

    return (this.props as Props).children;
  }
}

export default ErrorBoundary;

