import React from 'react';
import { saveProject, loadProject } from '../utils/projectStorage';

export default function SaveLoadButtons({ state, setState }: any) {
  return (
      <div style={{ display: 'flex', gap: 'var(--spacing-sm, 8px)' }}>
        <button
          onClick={() => {
            if (saveProject(state)) alert('✅ Project saved');
          }}
          style={{
            padding: 'var(--spacing-sm, 8px) var(--spacing-md, 12px)',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
          }}
        >
          💾 Save
        </button>
        <button
          onClick={() => {
            const data = loadProject();
            if (data) {
              setState(data);
              alert('✅ Project loaded');
            } else {
              alert('No saved project');
            }
          }}
          style={{
            padding: 'var(--spacing-sm, 8px) var(--spacing-md, 12px)',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
          }}
        >
          📂 Load
        </button>
      </div>
  );
}

