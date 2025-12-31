# Template System - Quick Fix Guide
**Date:** January 27, 2025  
**Purpose:** Step-by-step fixes to make template system functional

---

## Critical Fixes (Do These First)

### Fix #1: Add TemplateFrameContainer to App

**File:** `App.hardened.tsx`

**Step 1:** Add import (around line 30, with other component imports):
```tsx
import TemplateFrameContainer from './components/TemplateFrameContainer';
```

**Step 2:** Add render (around line 2311, after XP Display, before closing main div):
```tsx
{/* Template Frame Container */}
<ErrorBoundary>
  <TemplateFrameContainer />
</ErrorBoundary>
```

**Verification:**
- Build should still succeed
- No TypeScript errors
- Component is now in render tree

---

### Fix #2: Initialize Default Template Frames

**File:** `App.hardened.tsx`

**Step 1:** Add import (with other service imports, around line 18):
```tsx
import { templateFrameService } from './services/templateFrameService';
```

**Step 2:** Add initialization useEffect (in the App component, after state initialization):
```tsx
// Initialize default template frames
useEffect(() => {
  const existingFrames = templateFrameService.getAllFrames();
  if (existingFrames.length === 0) {
    // Create a default template frame
    templateFrameService.registerFrame({
      id: 'default-template-frame',
      name: 'Default Template Frame',
      containerId: 'template-frame-default',
      position: {
        x: 100,
        y: 100,
        width: 400,
        height: 300,
      },
      zIndex: 1000,
      visible: true,
      attachedComponents: [],
    });
  }
}, []);
```

**Verification:**
- Build should still succeed
- Check browser console - should see frame registered
- Frame should appear in UI (after Fix #1)

---

## Medium Priority Fixes

### Fix #3: Add Error Handling to CustomPaletteRenderer

**File:** `components/CustomPaletteBuilder.tsx`

**Replace lines 177-188 with:**
```tsx
// Template frame attachment handling
useEffect(() => {
  if (palette.attachedToFrame) {
    const frameId = palette.attachedToFrame;
    
    if (templateFrameService.frameExists(frameId)) {
      const success = templateFrameService.attachComponent(frameId, palette.id);
      if (!success) {
        console.warn(
          `Failed to attach palette ${palette.id} to frame ${frameId}`
        );
      }
      
      return () => {
        // Cleanup: detach on unmount
        if (templateFrameService.frameExists(frameId)) {
          templateFrameService.detachComponent(frameId, palette.id);
        }
      };
    } else {
      console.warn(
        `Template frame ${frameId} does not exist for palette ${palette.id}`
      );
    }
  }
}, [palette.id, palette.attachedToFrame]);
```

**Verification:**
- Build should still succeed
- No TypeScript errors
- Console warnings if frames don't exist (instead of silent failure)

---

### Fix #4: Fix Template Frame CSS Positioning

**File:** `components/TemplateFrameContainer.tsx`

**Replace line 47-49:**
```tsx
const frameStyle: React.CSSProperties = {
  ...style,
  zIndex: frame.zIndex || 1000,
  position: 'absolute', // Changed from 'relative'
};
```

**And update TemplateFrameContainer render (line 101):**
```tsx
return (
  <div 
    className={`template-frame-container ${className}`}
    style={{ position: 'relative' }} // Add this
  >
    {frames.map(frame => (
      <TemplateFrameComponent
        key={frame.id}
        frameId={frame.id}
      />
    ))}
  </div>
);
```

**Verification:**
- Build should still succeed
- Frames should position correctly
- No layout conflicts

---

## Testing After Fixes

### Test 1: Frame Appears
1. Start app
2. Check browser console - should see frame registered
3. Look for template frame in UI
4. Frame should be visible at position (100, 100)

### Test 2: Frame Attachment
1. Create a custom palette with `attachedToFrame: 'default-template-frame'`
2. Check console - should see attachment message
3. Palette should have `template-frame-attached` class
4. Frame should show palette in attached components

### Test 3: Error Handling
1. Try attaching to non-existent frame
2. Check console - should see warning (not error)
3. App should continue working

---

## Expected Results

### After Critical Fixes:
- ✅ Template frames visible in app
- ✅ Default frame created on startup
- ✅ System functional (basic)

### After Medium Fixes:
- ✅ Error handling prevents crashes
- ✅ Frames position correctly
- ✅ System robust

---

## Rollback Plan

If fixes cause issues:

1. **Revert Fix #1:** Remove `TemplateFrameContainer` import and render
2. **Revert Fix #2:** Remove frame initialization useEffect
3. **Revert Fix #3:** Restore original useEffect code
4. **Revert Fix #4:** Change position back to 'relative'

All fixes are isolated and can be reverted independently.

---

**Patent:** VF-TEMPLATE-QUICK-FIX-001  
**Blockchain Seed:** seed001  
**Work Tracking ID:** WT-2025-01-27-031

