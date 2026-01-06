# Phase 1: VectorForge Integration Plan
## Applying MAI Framework to Fix UX Issues

**Status:** Ready to implement  
**Goal:** Replace existing ActionCenter with new MAI Framework

---

## Current State

**Existing ActionCenter Usage:**
```tsx
<ActionCenter
  hasPrompt={!!state.prompt && state.prompt.trim().length > 0}
  prompt={state.prompt}
  onGenerateVector={handleGenerate}
  isGenerating={state.isGenerating}
  onAction={action => { /* ... */ }}
/>
```

**Location:** `App.hardened.tsx` line 2849

---

## New Implementation

**Using MAI Framework:**
```tsx
import { ActionCenter } from './components/design-system';
import { useMAI } from './components/design-system/hooks/useMAI';

// In App component:
const primaryAction = useMAI({
  state: {
    hasPrompt: !!state.prompt && state.prompt.trim().length > 0,
    prompt: state.prompt,
    isGenerating: state.isGenerating,
    hasSelection: state.selectedLayers.length > 0,
  },
  actions: [
    {
      id: 'generate-vector',
      label: '✨ Generate Vector',
      priority: 100,
      condition: (state) => state.hasPrompt && !state.isGenerating,
      action: () => handleGenerate(),
      tooltip: 'Generate a vector graphic from your prompt',
      keyboardShortcut: 'Ctrl+G',
      urgency: 'high',
      icon: 'auto_awesome',
    },
    {
      id: 'edit-selection',
      label: '✏️ Edit Selection',
      priority: 90,
      condition: (state) => state.hasSelection && !state.isGenerating,
      action: () => {
        // Open edit panel
        setState(prev => ({ ...prev, showPropertiesPanel: true }));
      },
      tooltip: 'Edit selected layers',
      keyboardShortcut: 'Ctrl+E',
      urgency: 'high',
      icon: 'edit',
    },
    {
      id: 'enter-prompt',
      label: '💬 Enter a prompt to start',
      priority: 10,
      condition: (state) => !state.hasPrompt && !state.isGenerating,
      action: () => {
        // Focus prompt input
        const input = document.querySelector('.ai-prompt-input') as HTMLInputElement;
        input?.focus();
      },
      tooltip: 'Start by entering a prompt in the AI panel',
      urgency: 'medium',
      icon: 'edit',
    },
  ],
});

// Replace existing ActionCenter:
<ActionCenter primaryAction={primaryAction} position="top-right" />
```

---

## Files to Update

1. **App.hardened.tsx**
   - Import new ActionCenter and useMAI
   - Replace existing ActionCenter usage
   - Add MAI context detection

2. **components/ActionCenter.tsx** (old)
   - Keep for now (backward compatibility)
   - Will be deprecated after migration

---

## Benefits

✅ **Fixes UX Issues:**
- Clear primary action (no more "All Caught Up" when action available)
- Contextual actions (changes based on state)
- Tooltips explain what actions do
- Keyboard shortcuts visible

✅ **Reusable:**
- Same pattern works for Xibalba Git
- Can be used in any Xibalba product
- Consistent UX across ecosystem

---

## Next Steps

1. Update App.hardened.tsx to use new MAI Framework
2. Test in VectorForge
3. Verify UX improvements
4. Document integration

---

**Ready to implement!**

