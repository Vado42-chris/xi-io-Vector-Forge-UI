# Phase 1 Clarified Plan - Option C (Recommended)

**Date:** January 6, 2025  
**Decision:** Option C - Single repo, extract later, fix UX NOW

---

## ✅ Confirmed Structure

**Current Reality:**
```
xi-io-Vector-Forge-UI/
├── package.json (single root)
├── index.tsx (entry point)
├── App.hardened.tsx (main app)
├── components/
│   ├── design-system/  ← Already created!
│   │   ├── ActionCenter.tsx ✅
│   │   ├── Tooltip.tsx ✅
│   │   ├── AdvancedSection.tsx ✅
│   │   └── hooks/
│   │       └── useMAI.ts ✅
│   ├── AnimationTimeline.tsx
│   ├── LeftSidebar.tsx
│   ├── RightSidebar.tsx
│   └── ...
└── ... (all files at root)
```

**NOT a monorepo:**
- ❌ No `packages/` directory
- ❌ No `apps/` directory
- ❌ No `src/` directory
- ✅ Everything at root level

---

## ✅ Decision: Option C

**What This Means:**
1. **Build directly in VectorForge** - No monorepo setup
2. **Use existing `components/design-system/`** - Already created!
3. **Fix UX immediately** - No package management overhead
4. **Extract later** - When patterns are proven

**Approval Process:**
- **Conductor:** Chris Hallberg (you)
- **Process:** You review/approve yourself
- **No PR workflow needed** - Direct commits or you review before merge

---

## 🚀 Revised Day 5-7 Plan

### **What We Already Have:**
- ✅ `components/design-system/ActionCenter.tsx` - MAI Framework
- ✅ `components/design-system/Tooltip.tsx` - Tooltip System
- ✅ `components/design-system/AdvancedSection.tsx` - Progressive Disclosure
- ✅ `components/design-system/hooks/useMAI.ts` - MAI Hook
- ✅ `App.hardened.tsx` - MAI Framework integrated

### **What We Need to Do (Day 5-7):**

**1. Finalize AdvancedSection** (if needed)
- Ensure collapse/expand works
- Add ARIA attributes
- Add keyboard navigation

**2. Apply Progressive Disclosure to VectorForge:**
- `components/LeftSidebar.tsx` - Hide advanced tools
- `components/RightSidebar.tsx` - Hide advanced panels
- AI Generation Panel - Hide advanced options
- Canvas Settings - Hide advanced properties

**3. Add Global Advanced Mode Toggle:**
- In `App.hardened.tsx` - Global toggle button
- Persist to localStorage
- Pass to all panels

**4. Fix Broken Labels:**
- `components/AnimationTimeline.tsx` - Fix "hi tory", "kip_previou", etc.
- `components/PowerUserToolbar.tsx` - Fix "Canva Setting"
- Add tooltips to all icon-only buttons

**5. Playwright Tests:**
- Test progressive disclosure
- Test MAI Framework
- Test tooltips

---

## 📋 Files to Modify (Day 5-7)

### **Design System (Finalize):**
- `components/design-system/AdvancedSection.tsx` - Ensure complete

### **VectorForge Integration:**
- `App.hardened.tsx` - Add global advanced mode toggle
- `components/LeftSidebar.tsx` - Add progressive disclosure
- `components/RightSidebar.tsx` - Add progressive disclosure
- `components/AnimationTimeline.tsx` - Fix labels, add tooltips
- `components/PowerUserToolbar.tsx` - Fix labels, add tooltips

### **Tests:**
- `tests/playwright/progressive-disclosure.spec.ts` - Create if needed

---

## ✅ Ready to Proceed

**No diffs needed - I'll implement directly:**
1. Finalize AdvancedSection
2. Apply to VectorForge components
3. Add global toggle
4. Fix broken labels
5. Add tooltips

**Say "Proceed with Day 5-7" and I'll start implementing now.**

