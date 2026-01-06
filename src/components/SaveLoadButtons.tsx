import React from 'react';
import { saveProject, loadProject } from '../utils/projectStorage';

export default function SaveLoadButtons({ state, setState }: any) {
  return (
    <div style={{ display: 'flex', gap: '8px', padding: '8px' }}>
      <button
        onClick={() => {
          if (saveProject(state)) alert('✅ Project saved');
        }}
        style={{
          padding: '8px 16px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
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
          padding: '8px 16px',
          background: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        📂 Load
      </button>
    </div>
  );
}

