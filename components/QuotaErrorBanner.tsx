import React from 'react';

type Props = {
  message?: string;
  onClose?: () => void;
};

export default function QuotaErrorBanner({ message = 'You have exceeded your quota.', onClose }: Props) {
  return (
    <div style={{
      background: '#f8d7da',
      color: '#842029',
      border: '1px solid #f5c2c7',
      padding: '8px 12px',
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    }}>
      <div>
        <strong>Quota exceeded</strong>
        <div style={{ fontSize: 13 }}>{message}</div>
      </div>
      {onClose ? (
        <button onClick={onClose} style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#842029',
          fontWeight: 'bold'
        }}>
          ×
        </button>
      ) : null}
    </div>
  );
}
