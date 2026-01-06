import React from 'react';
import { exportSVG } from '../utils/exportSvg';

export default function ExportButton() {
  return (
      <button
        onClick={() => exportSVG()}
        style={{
          padding: 'var(--spacing-sm, 8px) var(--spacing-md, 12px)',
          background: '#FF6B35',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
        }}
      >
        📥 Export SVG
      </button>
  );
}

