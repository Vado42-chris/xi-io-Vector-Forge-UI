/**
 * Toast Notification Container
 * Displays toast notifications from the app state
 */

import React from 'react';
import '../styles/toast-container.css';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

interface ToastContainerProps {
  toasts: Toast[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} xibalba-animate-in`}
          role="alert"
          aria-live="polite"
        >
          <div className="toast-icon">
            {toast.type === 'success' && <span className="material-symbols-outlined">check_circle</span>}
            {toast.type === 'error' && <span className="material-symbols-outlined">error</span>}
            {toast.type === 'warning' && <span className="material-symbols-outlined">warning</span>}
            {toast.type === 'info' && <span className="material-symbols-outlined">info</span>}
          </div>
          <div className="toast-message">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

