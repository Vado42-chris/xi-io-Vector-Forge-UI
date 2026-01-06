/**
 * VectorForge Integration Example
 * 
 * Shows how to use the design system components in VectorForge
 * to fix UX issues.
 */

import React from 'react';
import { MAIFramework, ProgressiveDisclosure, Tooltip, type MAIAction } from './index';

interface VectorForgeExampleProps {
  hasPrompt: boolean;
  prompt: string;
  isGenerating: boolean;
  onGenerate: () => void;
  onFocusPrompt: () => void;
}

const VectorForgeExample: React.FC<VectorForgeExampleProps> = ({
  hasPrompt,
  prompt,
  isGenerating,
  onGenerate,
  onFocusPrompt,
}) => {
  // Build actions based on VectorForge state
  const actions: MAIAction[] = [];

  // Priority 1: Generate Vector (if prompt exists)
  if (hasPrompt && prompt.trim()) {
    actions.push({
      id: 'generate-vector',
      label: isGenerating ? 'Generating...' : 'Generate Vector',
      description: `Generate vector from: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`,
      urgency: 'high',
      context: 'Click to generate your vector',
      icon: 'auto_awesome',
      action: onGenerate,
      disabled: isGenerating,
    });
  } else {
    // Priority 2: Enter Prompt (if no prompt)
    actions.push({
      id: 'enter-prompt',
      label: 'Enter a Prompt',
      description: 'Describe the vector you want to create',
      urgency: 'medium',
      context: 'Start by entering a prompt',
      icon: 'edit',
      action: onFocusPrompt,
    });
  }

  return (
    <>
      {/* MAI Framework - Fixes "No Clear Primary Action" */}
      <MAIFramework
        actions={actions}
        position="top-right"
        onAction={(action) => {
          console.log('Action executed:', action.id);
        }}
      />

      {/* Progressive Disclosure - Fixes "High Cognitive Load" */}
      <div style={{ padding: '16px' }}>
        <ProgressiveDisclosure
          label="Advanced Vector Tools"
          defaultCollapsed={true}
          icon="tune"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Tooltip content="Apply advanced vector effects">
              <button>Apply Effects</button>
            </Tooltip>
            <Tooltip content="Export in multiple formats">
              <button>Export Options</button>
            </Tooltip>
            <Tooltip content="Configure vector settings">
              <button>Vector Settings</button>
            </Tooltip>
          </div>
        </ProgressiveDisclosure>
      </div>

      {/* Tooltips - Fixes "No Contextual Help" */}
      <div style={{ padding: '16px' }}>
        <Tooltip content="Generate a vector graphic from your prompt">
          <button onClick={onGenerate} disabled={isGenerating}>
            Generate Vector
          </button>
        </Tooltip>

        <Tooltip content="Select and move objects on the canvas">
          <button>Select Tool</button>
        </Tooltip>

        <Tooltip content="Draw custom paths and shapes">
          <button>Pen Tool</button>
        </Tooltip>
      </div>
    </>
  );
};

export default VectorForgeExample;

