# Batch 6: Canvas Component Fixes

**Date:** January 27, 2025  
**Status:** ✅ COMPLETE - 3 Errors Fixed

## Summary

Fixed 3 errors in `components/Canvas.tsx`:
1. Duplicate `className` prop
2. React hooks called inside map callback (2 errors)

## Error Details

### Error 1: Duplicate `className` Prop

- **Line:** 109, 113
- **Issue:** Two `className` props on the same div element
- **Fix:** Merged into a single `className` prop

### Error 2 & 3: React Hooks in Map Callback

- **Lines:** 119, 120
- **Issue:** `useRef` and `useEffect` called inside `guides.map()` callback
- **Fix:** Removed hooks, used inline `style` prop instead

## Changes Made

**File:** `components/Canvas.tsx`

### Change 1: Merged Duplicate className
```typescript
// BEFORE
<div 
  className={`flex-1 relative bg-[var(--xibalba-grey-100)] ...`}
  className="canvas-container-touch"  // ❌ Duplicate
>

// AFTER
<div 
  className={`flex-1 relative bg-[var(--xibalba-grey-100)] ... canvas-container-touch`}  // ✅ Merged
>
```

### Change 2: Removed Hooks from Map Callback
```typescript
// BEFORE
{guides.map((g) => {
  const guideRef = useRef<HTMLDivElement>(null);  // ❌ Hook in callback
  useEffect(() => {  // ❌ Hook in callback
    // ...
  }, [pan, g.pos, zoomScale, g.type]);
  return <div ref={guideRef}>...</div>;
})}

// AFTER
{guides.map((g) => {
  return (
    <div 
      style={  // ✅ Inline style instead
        g.type === 'v'
          ? { left: `calc(50% + ${pan.x + g.pos * zoomScale}px)` }
          : { top: `calc(50% + ${pan.y + g.pos * zoomScale}px)` }
      }
    >...</div>
  );
})}
```

## Results

**BEFORE:**
- Total ESLint errors: 233

**AFTER:**
- Total ESLint errors: 230 ✅
- **Reduction:** 3 errors fixed

## Verification

```bash
npm run lint -- components/Canvas.tsx 2>&1 | grep -E "error" | wc -l
# Result: 0 errors in Canvas.tsx ✅

npm run lint 2>&1 | grep -E "^.*error" | wc -l
# Result: 230 (was 233) ✅
```

## Build Status

✅ **BUILD SUCCEEDS** - No impact on build

## Next Steps

Continue with remaining error batches:
- Remaining errors: 230
- Focus on real errors (not false positives)

