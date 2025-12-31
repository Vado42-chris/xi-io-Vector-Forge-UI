# Batch 3: Floating Promise Errors - Analysis

**Date:** January 27, 2025  
**Status:** 🔍 ANALYZED - Many False Positives Identified

## Summary

ESLint reports 15 `@typescript-eslint/no-floating-promises` errors. Analysis shows many are **false positives** - functions that don't return promises are being flagged.

## Error Analysis

### False Positives (Functions Don't Return Promises)

| Line | Function | Type | Status |
|------|----------|------|--------|
| 218 | `setShowProjectWizard(true)` | React state setter | ❌ False Positive |
| 227 | `setShowTemplateLibrary(true)` | React state setter | ❌ False Positive |
| 943 | `showToast('File closed', 'success')` | Returns `void` | ❌ False Positive |
| 947 | `announceToScreenReader('File closed')` | Returns `void` | ❌ False Positive |
| 952 | `showToast('File closed', 'success')` | Returns `void` | ❌ False Positive |
| 954 | `announceToScreenReader('File closed')` | Returns `void` | ❌ False Positive |
| 960 | `showToast('File closed', 'success')` | Returns `void` | ❌ False Positive |
| 962 | `announceToScreenReader('File closed')` | Returns `void` | ❌ False Positive |
| 967 | `showToast('File closed', 'success')` | Returns `void` | ❌ False Positive |
| 438 | `userProfileService.updateProfile(...)` | Returns `void` | ❌ False Positive |

### Need Investigation

| Line | Code | Status |
|------|------|--------|
| 733 | Inside try block in `FILE_SAVE_AS` case | ⏳ Need to check |
| 745 | Inside catch block in `FILE_SAVE_AS` case | ⏳ Need to check |
| 153 | Need to check context | ⏳ Need to check |
| 39-40 | Need to check context | ⏳ Need to check |

## Function Signatures Verified

### `showToast`
```typescript
const showToast = useCallback(
  (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    // ... sets state, returns void
  },
  []
);
```
**Returns:** `void` ✅

### `announceToScreenReader`
```typescript
const announceToScreenReader = useCallback(
  (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // ... sets state, returns void
  },
  []
);
```
**Returns:** `void` ✅

### `userProfileService.updateProfile`
```typescript
updateProfile(updates: Partial<UserProfile>): void {
  // ... updates profile, returns void
}
```
**Returns:** `void` ✅

## Next Steps

1. ✅ Document false positives
2. ⏳ Investigate lines 733, 745, 153, 39-40
3. ⏳ Fix real floating promise errors (if any)
4. ⏳ Consider ESLint configuration adjustment for false positives

## Recommendation

Since many of these are false positives, we should:
1. Add comments to suppress false positives where appropriate
2. Fix any real floating promise errors
3. Consider adjusting ESLint configuration if false positives persist

