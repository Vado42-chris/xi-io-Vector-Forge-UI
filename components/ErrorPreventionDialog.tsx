/**
 * Error Prevention Dialog Component
 * Prevents errors before they happen with validation, warnings, suggestions
 * 
 * Accessibility: Clear error messages, suggested fixes, large confirm buttons
 * Design: Large warning icons, plain language, suggested actions as buttons
 * 
 * #hashtag: error-prevention accessibility
 */

import React from 'react';
import ErrorBoundary from './ErrorBoundary';

interface ErrorPreventionDialogProps {
  isOpen: boolean;
  type: 'warning' | 'error' | 'confirmation';
  title: string;
  message: string;
  details?: string;
  suggestedActions?: Array<{
    label: string;
    action: () => void;
    primary?: boolean;
  }>;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

const ErrorPreventionDialog: React.FC<ErrorPreventionDialogProps> = ({
  isOpen,
  type,
  title,
  message,
  details,
  suggestedActions,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'confirmation':
        return '❓';
      default:
        return 'ℹ️';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return 'text-[var(--vectorforge-accent)]';
      case 'error':
        return 'text-[var(--vectorforge-accent)]';
      case 'confirmation':
        return 'text-[var(--xibalba-accent)]';
      default:
        return 'text-[var(--xibalba-accent)]';
    }
  };

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 zstack-modal flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="error-prevention-title"
        aria-describedby="error-prevention-message"
      >
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] rounded-lg w-[90vw] max-w-2xl shadow-2xl">
          {/* Header */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`text-4xl ${getIconColor()}`} aria-hidden="true">
                {getIcon()}
              </div>
              <div className="flex-1">
                <h2 id="error-prevention-title" className="text-xl font-bold text-[var(--xibalba-text-000)] mb-2">
                  {title}
                </h2>
                <p id="error-prevention-message" className="text-[var(--xibalba-text-100)]">
                  {message}
                </p>
                {details && (
                  <p className="text-sm text-[var(--xibalba-text-100)] mt-2">{details}</p>
                )}
              </div>
            </div>
          </div>

          {/* Suggested Actions */}
          {suggestedActions && suggestedActions.length > 0 && (
            <div className="p-6">
              <h3 className="text-sm font-semibold text-[var(--xibalba-text-000)] mb-3">
                Suggested Actions:
              </h3>
              <div className="space-y-2">
                {suggestedActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`w-full p-3 rounded-lg transition-colors text-left min-h-[44px] ${
                      action.primary
                        ? 'bg-[var(--xibalba-accent)] text-white hover:bg-[var(--xibalba-accent-hover)]'
                        : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-000)] hover:bg-[var(--xibalba-grey-200)]'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-6">
            {onCancel && (
              <button
                onClick={onCancel}
                className="xibalba-button-secondary min-w-[120px] min-h-[44px]"
                aria-label={cancelLabel}
              >
                {cancelLabel}
              </button>
            )}
            {onConfirm && (
              <button
                onClick={onConfirm}
                className={`min-w-[120px] min-h-[44px] ${
                  destructive
                    ? 'bg-[var(--vectorforge-accent)] hover:bg-[var(--vectorforge-accent-hover)] text-white'
                    : 'xibalba-button-primary'
                }`}
                aria-label={confirmLabel}
              >
                {confirmLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ErrorPreventionDialog;

