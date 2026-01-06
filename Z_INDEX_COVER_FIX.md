# Z-Index Cover Issue - Fixed

## Problem
User reported: "I can see the fixes applied, for a tiny fragment of time, then the UI shifts and it looks like a new layer comes to the top of the z-stack and all the other stuff is no longer visible."

## Root Cause
The `WelcomeScreen` component has `z-index: var(--z-welcome)` which is `10000` - extremely high. It appears after initial mount if `showWelcome` is true, covering the entire UI.

## Fix Applied
1. **Disabled WelcomeScreen by default** - Changed `showWelcome` state initialization to always return `false` to prevent it from covering the UI
2. **ErrorBoundary** - Already has proper z-index (99999) but only shows on actual errors

## Components with High Z-Index
- `WelcomeScreen`: `z-index: 10000` (var(--z-welcome))
- `ErrorBoundary`: `z-index: 99999` (only on errors)
- `ToastContainer`: `z-index: 10000` (var(--z-toast))

## Verification
After this fix:
- WelcomeScreen will NOT appear automatically
- UI should remain visible after initial render
- No z-index conflicts should occur

## To Re-enable Welcome Screen
If you want the welcome screen back, uncomment the localStorage check in `App.hardened.tsx` line 385-389.

