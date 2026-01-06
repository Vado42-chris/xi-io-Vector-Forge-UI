/**
 * VectorForge Integration Example
 * 
 * Shows how to use the design system components in VectorForge
 * to fix UX issues using the useMAI hook.
 */

import React from 'react';
import { ActionCenter, Tooltip, useMAI } from '../index';

interface VectorForgeState {
  prompt: string;
  isGenerating: boolean;
  selectedLayers: string[];
}

interface VectorForgeExampleProps {
  state: VectorForgeState;
  onGenerate: () => void;
  onFocusPrompt: () => void;
  onOpenEditPanel: () => void;
}

export const VectorForgeExample: React.FC<VectorForgeExampleProps> = ({
  state,
  onGenerate,
  onFocusPrompt,
  onOpenEditPanel,
}) => {
  // Use MAI hook to determine primary action
  const primaryAction = useMAI({
    state,
    actions: [
      {
        id: 'generate-vector',
        label: '✨ Generate Vector',
        priority: 100,
        condition: (state) => state.prompt && !state.isGenerating,
        action: onGenerate,
        icon: 'auto_awesome',
      },
      {
        id: 'edit-selection',
        label: '✏️ Edit Selection',
        priority: 90,
        condition: (state) => state.selectedLayers.length > 0,
        action: onOpenEditPanel,
        icon: 'edit',
      },
      {
        id: 'enter-prompt',
        label: '💬 Enter a prompt to start',
        priority: 10,
        condition: (state) => !state.prompt,
        action: onFocusPrompt,
        icon: 'edit',
      },
    ],
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>VectorForge</h1>
      
      {/* MAI Action Center - Fixes "No Clear Primary Action" */}
      <ActionCenter primaryAction={primaryAction} position="top-right" />

      {/* Tools with Tooltips - Fixes "No Contextual Help" */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '60px' }}>
        <Tooltip content="Select and move objects on the canvas" shortcut="V">
          <button>Select Tool</button>
        </Tooltip>

        <Tooltip content="Draw custom paths and shapes" shortcut="P">
          <button>Pen Tool</button>
        </Tooltip>

        <Tooltip content="Draw rectangles" shortcut="M">
          <button>Rectangle Tool</button>
        </Tooltip>

        <Tooltip content="Draw circles and ellipses" shortcut="L">
          <button>Ellipse Tool</button>
        </Tooltip>
      </div>

      {/* Animation Timeline with Tooltips */}
      <div style={{ marginTop: '40px' }}>
        <h2>Animation Timeline</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tooltip content="Go to previous frame" shortcut="←">
            <button>Previous Frame</button>
          </Tooltip>

          <Tooltip content="Go to next frame" shortcut="→">
            <button>Next Frame</button>
          </Tooltip>

          <Tooltip content="Apply animation preset" shortcut="Ctrl+P">
            <button>Preset</button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default VectorForgeExample;

