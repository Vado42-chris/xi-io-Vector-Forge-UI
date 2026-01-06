import React from 'react';

export interface ActionCenterProps {
  primaryAction: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  } | null;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({
  primaryAction,
  position = 'top-right',
  className = '',
}) => {
  const baseStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 1100,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const posStyle: Record<string, React.CSSProperties> = {
    'top-right': { top: 16, right: 16 },
    'top-left': { top: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
  };

  if (!primaryAction) {
    return (
      <div
        className={`action-center action-center--${position} ${className}`}
        style={{
          ...baseStyle,
          ...posStyle[position],
          background: 'var(--color-surface-secondary, #111827)',
          color: 'var(--color-text-secondary, #d1d5db)',
          padding: '12px 16px',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
        }}
        aria-live="polite"
      >
        ✅ All Caught Up
      </div>
    );
  }

  return (
    <div style={{ ...baseStyle, ...posStyle[position] }} className={className} aria-live="polite">
      <button
        onClick={primaryAction.onClick}
        disabled={primaryAction.disabled || primaryAction.loading}
        title={primaryAction.label}
        aria-label={primaryAction.label}
        style={{
          background: 'var(--accent-orange, #ff6b35)',
          color: '#fff',
          padding: '10px 18px',
          borderRadius: 8,
          border: 'none',
          cursor: primaryAction.disabled ? 'not-allowed' : 'pointer',
          fontSize: 15,
          fontWeight: 700,
          boxShadow: '0 6px 16px rgba(255,107,53,0.18)',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={e => {
          if (!primaryAction.disabled)
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        {primaryAction.loading ? '⏳ Processing...' : primaryAction.label}
      </button>
    </div>
  );
};

export default ActionCenter;
