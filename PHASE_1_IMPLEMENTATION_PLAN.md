# Phase 1 Implementation Plan - Design System Foundation
## Xibalba Git: MAI Framework + Tooltips + Progressive Disclosure

**Start Date:** January 6, 2025  
**Timeline:** 2 weeks  
**Goal:** Build reusable design system components, prove patterns work, fix VectorForge UX

---

## 🎯 Phase 1 Objectives

1. **Build MAI Framework** (Most Actionable Item) - Reusable ActionCenter component
2. **Build Tooltip System** - Reusable Tooltip component with contextual help
3. **Build Progressive Disclosure** - AdvancedSection component pattern
4. **Prove Patterns Work** - Basic Xibalba Git UI using all patterns
5. **Backport to VectorForge** - Apply patterns to fix UX issues
6. **Document Design System** - Component library and integration guide

---

## 📋 Week 1: Core Framework Components

### **Day 1-2: MAI Framework (ActionCenter)**

**Component:** `components/design-system/ActionCenter.tsx`

**Features:**
- Contextual primary action (dynamic based on state)
- Top-right fixed position
- Orange accent (#ff9800) for high-priority actions
- Tooltip explaining action
- Keyboard shortcut support
- Disabled state during operations

**Props:**
```typescript
interface ActionCenterProps {
  primaryAction: {
    id: string;
    label: string;
    tooltip: string;
    onClick: () => void;
    disabled?: boolean;
    keyboardShortcut?: string;
  };
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  accentColor?: string;
}
```

**Usage Example (Xibalba Git):**
```tsx
<ActionCenter
  primaryAction={{
    id: 'commit',
    label: hasStagedChanges ? 'Commit Changes' : 'All Caught Up',
    tooltip: hasStagedChanges 
      ? 'Commit all staged changes to local repository'
      : 'No changes to commit',
    onClick: handleCommit,
    disabled: !hasStagedChanges,
    keyboardShortcut: 'Ctrl+Enter'
  }}
/>
```

**Usage Example (VectorForge):**
```tsx
<ActionCenter
  primaryAction={{
    id: 'generate',
    label: hasPrompt ? 'Generate Vector' : 'Enter a prompt to start',
    tooltip: hasPrompt
      ? 'Generate a vector graphic from your prompt'
      : 'Enter a prompt in the AI panel to begin',
    onClick: handleGenerate,
    disabled: !hasPrompt || isGenerating,
    keyboardShortcut: 'Ctrl+G'
  }}
/>
```

---

### **Day 3-4: Tooltip System**

**Component:** `components/design-system/Tooltip.tsx`

**Features:**
- Hover tooltip (appears on hover)
- Click tooltip (appears on click, for mobile)
- Position variants (top, bottom, left, right, auto)
- Rich content support (text, links, keyboard shortcuts)
- Accessible (ARIA labels, keyboard navigation)
- Delay configuration

**Props:**
```typescript
interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  delay?: number;
  disabled?: boolean;
  variant?: 'hover' | 'click' | 'focus';
  maxWidth?: number;
}
```

**Usage Example:**
```tsx
<Tooltip 
  content="Commit all staged changes to local repository"
  position="top"
  variant="hover"
>
  <Button>Commit</Button>
</Tooltip>
```

**Advanced Usage (with keyboard shortcut):**
```tsx
<Tooltip 
  content={
    <>
      Generate a vector graphic from your prompt
      <br />
      <kbd>Ctrl+G</kbd>
    </>
  }
  position="top"
>
  <Button>Generate Vector</Button>
</Tooltip>
```

---

### **Day 5: Progressive Disclosure**

**Component:** `components/design-system/AdvancedSection.tsx`

**Features:**
- Collapsible advanced section
- Smooth expand/collapse animation
- "Show Advanced" / "Hide Advanced" toggle
- Remembers user preference (localStorage)
- Icon indicator (chevron)
- Accessible (keyboard navigation, ARIA)

**Props:**
```typescript
interface AdvancedSectionProps {
  children: React.ReactNode;
  title?: string;
  defaultCollapsed?: boolean;
  rememberState?: boolean;
  storageKey?: string;
  onToggle?: (collapsed: boolean) => void;
}
```

**Usage Example:**
```tsx
<AdvancedSection
  title="Advanced Git Operations"
  defaultCollapsed={true}
  rememberState={true}
  storageKey="git-advanced-section"
>
  <RebaseButton />
  <CherryPickButton />
  <SubmoduleButton />
</AdvancedSection>
```

---

### **Day 6-7: Basic Xibalba Git UI**

**Goal:** Prove all patterns work together

**Components to Build:**
1. `components/xibalba-git/RepoList.tsx` - List of repos with status
2. `components/xibalba-git/RepoCard.tsx` - Individual repo card
3. `components/xibalba-git/GitOperations.tsx` - Git operation buttons
4. `pages/XibalbaGit.tsx` - Main page using all patterns

**Patterns to Prove:**
- ✅ MAI ActionCenter shows contextual action
- ✅ All buttons have tooltips
- ✅ Advanced features in collapsible section
- ✅ Clear labels (no "Button" fallbacks)
- ✅ Progressive disclosure reduces cognitive load

---

## 📋 Week 2: Integration + Documentation

### **Day 8-9: Apply Patterns to VectorForge**

**Files to Update:**
1. `components/ActionCenter.tsx` - Replace with new MAI Framework
2. `components/Button.tsx` - Add Tooltip wrapper
3. `components/PowerUserToolbar.tsx` - Add tooltips to all buttons
4. `components/LeftSidebar.tsx` - Add tooltips, progressive disclosure
5. `components/RightSidebar.tsx` - Add tooltips, progressive disclosure
6. `components/AnimationTimeline.tsx` - Add tooltips to all buttons

**Fixes:**
- ✅ Replace "Button" labels with descriptive text
- ✅ Add tooltips to all icon-only buttons
- ✅ Implement MAI ActionCenter (top-right, orange accent)
- ✅ Add progressive disclosure for advanced features
- ✅ Fix "hi tory" → "History", "kip_previou" → "Previous", etc.

---

### **Day 10-11: Design System Documentation**

**Create:**
1. `docs/DESIGN_SYSTEM.md` - Design system overview
2. `docs/COMPONENT_LIBRARY.md` - Component API documentation
3. `docs/INTEGRATION_GUIDE.md` - How to use patterns in new products
4. `docs/MAI_FRAMEWORK.md` - MAI Framework usage guide
5. `docs/TOOLTIP_SYSTEM.md` - Tooltip system usage guide
6. `docs/PROGRESSIVE_DISCLOSURE.md` - Progressive disclosure pattern guide

---

### **Day 12-14: Testing + Refinement**

**Tasks:**
1. Test all components in Xibalba Git
2. Test all components in VectorForge
3. Fix any integration issues
4. Refine component APIs based on usage
5. Update documentation
6. Create example implementations

---

## 🏗️ Project Structure

```
xi-io-Vector-Forge-UI/
├── components/
│   ├── design-system/          # NEW: Reusable design system components
│   │   ├── ActionCenter.tsx    # MAI Framework
│   │   ├── Tooltip.tsx         # Tooltip system
│   │   ├── AdvancedSection.tsx # Progressive disclosure
│   │   └── index.ts            # Exports
│   ├── xibalba-git/            # NEW: Xibalba Git components
│   │   ├── RepoList.tsx
│   │   ├── RepoCard.tsx
│   │   ├── GitOperations.tsx
│   │   └── index.ts
│   └── ...                     # Existing VectorForge components
├── pages/
│   └── XibalbaGit.tsx         # NEW: Xibalba Git main page
├── docs/
│   ├── DESIGN_SYSTEM.md        # NEW: Design system docs
│   ├── COMPONENT_LIBRARY.md    # NEW: Component API docs
│   └── INTEGRATION_GUIDE.md    # NEW: Integration guide
└── ...
```

---

## ✅ Success Criteria

### **Week 1:**
- [ ] MAI ActionCenter component working
- [ ] Tooltip system working
- [ ] Progressive disclosure working
- [ ] Basic Xibalba Git UI using all patterns
- [ ] All patterns proven to work

### **Week 2:**
- [ ] Patterns applied to VectorForge
- [ ] VectorForge UX issues fixed:
  - [ ] No more "Button" labels
  - [ ] All buttons have tooltips
  - [ ] MAI ActionCenter implemented
  - [ ] Progressive disclosure added
  - [ ] Broken labels fixed
- [ ] Design system documented
- [ ] Integration guide complete

---

## 🚀 Next Steps

**Start with:** MAI Framework (ActionCenter component)

**Why first:**
- Highest impact (fixes VectorForge's #1 UX issue)
- Simplest to implement
- Proves the pattern works
- Immediate reusability

**Ready to start?** Say "Start Phase 1" and I'll begin building the MAI Framework component.

