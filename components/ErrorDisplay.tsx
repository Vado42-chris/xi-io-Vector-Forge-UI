/**
 * Error Display Component
 * Shows errors on screen so we can see them without DevTools
 * 
 * #hashtag: error-reporting debugging
 */

import React, { useState, useEffect } from 'react';

interface ErrorInfo {
  message: string;
  stack?: string;
  source?: string;
  line?: number;
  column?: number;
  timestamp: number;
}

const ErrorDisplay: React.FC = () => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for errors
    const handleError = (event: ErrorEvent) => {
      setErrors(prev => [{
        message: event.message || 'Unknown error',
        stack: event.error?.stack,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: Date.now()
      }, ...prev].slice(0, 10)); // Keep last 10 errors
      setIsVisible(true);
    };

    // Listen for promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      setErrors(prev => [{
        message: event.reason?.message || String(event.reason) || 'Unknown promise rejection',
        stack: event.reason?.stack,
        timestamp: Date.now()
      }, ...prev].slice(0, 10));
      setIsVisible(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  if (!isVisible || errors.length === 0) {
    return null;
  }

  return (
    <div className="error-display-container">
      <div className="error-display-header">
        <h2 className="error-display-title">🚨 Errors ({errors.length})</h2>
        <button
          onClick={() => setIsVisible(false)}
          className="error-display-close"
        >
          ×
        </button>
      </div>
      <div className="error-display-list">
        {errors.map((error, idx) => (
          <div key={idx} className="error-display-item">
            <div className="error-display-message">
              {error.message}
            </div>
            {error.source && (
              <div className="error-display-source">
                {error.source}:{error.line}:{error.column}
              </div>
            )}
            {error.stack && (
              <details className="error-display-details">
                <summary className="error-display-summary">
                  Stack Trace
                </summary>
                <pre className="error-display-stack">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => setErrors([])}
        className="error-display-clear"
      >
        Clear Errors
      </button>
    </div>
  );
};

export default ErrorDisplay;

