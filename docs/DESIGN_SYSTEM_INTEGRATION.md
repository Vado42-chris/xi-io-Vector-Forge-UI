# Xibalba Design System Integration Guide

**Date:** January 5, 2025  
**Status:** ✅ Phase 1 Complete  
**Purpose:** Fix VectorForge UX issues while building reusable design system

---

## Overview

The Xibalba Design System provides reusable components that fix common UX issues across all Xibalba products:

1. **MAI Framework** - Fixes "No Clear Primary Action" issue
2. **Tooltip System** - Fixes "No Contextual Help" issue  
3. **Progressive Disclosure** - Fixes "High Cognitive Load" issue

---

## Components

### 1. MAI Framework (Most Actionable Item)

**Fixes:** "No Clear Primary Action" UX issue

**Usage in VectorForge:**
```tsx
import { MAIFramework, type MAIAction } from './components/design-system';

const actions: MAIAction[] = [
  {
    id: 'generate-vector',
    label: 'Generate Vector',
    description: 'Create vector from your prompt',
    urgency: 'high',
    context: 'Click to generate',
    icon: 'auto_awesome',
    action: () => handleGenerate(),
  },
  {
    id: 'enter-prompt',
    label: 'Enter a Prompt',
    description: 'Describe the vector you want',
    urgency: 'medium',
    context: 'Start by entering a prompt',
    icon: 'edit',
    action: () => focusPromptInput(),
  },
];

<MAIFramework
  actions={actions}
  position="top-right"
  onAction={(action) => console.log('Action:', action.id)}
/>
```

**Usage in Xibalba Git:**
```tsx
const actions: MAIAction[] = [
  {
    id: 'commit',
    label: 'Commit Changes',
    urgency: 'high',
    action: () => handleCommit(),
  },
  {
    id: 'push',
    label: 'Push to Remote',
    urgency: 'medium',
    action: () => handlePush(),
  },
];

<MAIFramework actions={actions} position="top-right" />
```

---

### 2. Tooltip System

**Fixes:** "No Contextual Help" UX issue

**Usage:**
```tsx
import { Tooltip } from './components/design-system';

<Tooltip content="Generate a vector graphic from your prompt" position="top">
  <button>Generate Vector</button>
</Tooltip>
```

**Features:**
- Automatic position adjustment (top/bottom/left/right)
- 300ms delay (configurable)
- Viewport boundary detection
- Keyboard accessible

---

### 3. Progressive Disclosure

**Fixes:** "High Cognitive Load" UX issue

**Usage:**
```tsx
import { ProgressiveDisclosure } from './components/design-system';

<ProgressiveDisclosure
  label="Advanced Settings"
  defaultCollapsed={true}
  icon="settings"
>
  <AdvancedSettings />
</ProgressiveDisclosure>
```

**Features:**
- Hide advanced features by default
- Smooth expand/collapse animation
- Accessible (ARIA attributes)
- Customizable styling

---

## Integration Steps

### Step 1: Import Design System Components

```tsx
import { 
  MAIFramework, 
  ProgressiveDisclosure, 
  Tooltip 
} from './components/design-system';
```

### Step 2: Replace Existing Components

**Before (VectorForge ActionCenter):**
```tsx
<ActionCenter
  hasPrompt={!!state.prompt}
  prompt={state.prompt}
  onGenerateVector={handleGenerate}
/>
```

**After (MAI Framework):**
```tsx
<MAIFramework
  actions={[
    {
      id: 'generate',
      label: 'Generate Vector',
      urgency: 'high',
      action: handleGenerate,
    },
  ]}
  position="top-right"
/>
```

### Step 3: Add Tooltips to All Buttons

```tsx
<Tooltip content="Generate vector from prompt">
  <button onClick={handleGenerate}>
    Generate Vector
  </button>
</Tooltip>
```

### Step 4: Hide Advanced Features

```tsx
<ProgressiveDisclosure label="Advanced Tools" defaultCollapsed={true}>
  <AdvancedToolPanel />
</ProgressiveDisclosure>
```

---

## Benefits

### For VectorForge
- ✅ Fixed "No Clear Primary Action" (MAI Framework)
- ✅ Fixed "No Contextual Help" (Tooltips)
- ✅ Fixed "High Cognitive Load" (Progressive Disclosure)
- ✅ Consistent UX across all features

### For Xibalba Ecosystem
- ✅ Reusable components (write once, use everywhere)
- ✅ Consistent UX patterns (users learn once)
- ✅ Faster development (components already built)
- ✅ Easier maintenance (fix once, all products benefit)

---

## Next Steps

1. **Apply to VectorForge** (Week 1-2)
   - Replace ActionCenter with MAIFramework
   - Add tooltips to all buttons
   - Hide advanced features with ProgressiveDisclosure

2. **Build Xibalba Git** (Week 3-4)
   - Use MAIFramework for Git actions
   - Add tooltips to Git operations
   - Use ProgressiveDisclosure for advanced Git features

3. **Document Patterns** (Week 5)
   - Create pattern library
   - Write integration guides
   - Add examples for each component

---

## Files

- `components/design-system/MAIFramework.tsx` - MAI Framework component
- `components/design-system/ProgressiveDisclosure.tsx` - Progressive Disclosure component
- `components/Tooltip.tsx` - Tooltip component (existing)
- `docs/DESIGN_SYSTEM_INTEGRATION.md` - This file

---

## Questions?

See `PRODUCT_DESIGN_XIBALBA_GIT.md` for full product design and strategy.

