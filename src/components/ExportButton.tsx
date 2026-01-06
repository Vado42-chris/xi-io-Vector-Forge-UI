import React from 'react';
import { exportSVG } from '../utils/exportSvg';

export default function ExportButton() {
  return (
    <button
      onClick={() => exportSVG()}
      style={{
        padding: '8px 16px',
        background: '#FF6B35',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      📥 Export SVG
    </button>
  );
}

