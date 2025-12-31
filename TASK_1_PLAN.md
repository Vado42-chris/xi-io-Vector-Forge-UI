# Task T1: Implementation Plan

## Current State Analysis

### ✅ What Exists
1. **SignButton.tsx** - Already calls API endpoints directly:
   - `/api/proof/sign`
   - `/api/proof/append`
   - `/api/proof/bundle`
   - Has canonicalization logic
   - Shows status messages

2. **App.hardened.tsx** - Already wires SignButton:
   - Passes `state.currentSvg` to SignButton
   - Has toast notifications for success/error

3. **DraftsmanCanvas.tsx** - Receives `svgContent` as prop
   - Canvas component that renders layers
   - SVG content comes from parent (App.hardened.tsx)

4. **API endpoints** - All exist in `api/proof.js`:
   - POST `/api/proof/sign`
   - POST `/api/proof/append`
   - POST `/api/proof/bundle`

### ⚠️ What's Missing
1. **components/actions/signAndAppend.ts** - Helper function (doesn't exist)
   - Should wrap the API calls
   - Should handle canonicalization
   - Should return structured result

2. **DraftsmanCanvas export method** - May need explicit export function
   - Currently receives SVG as prop
   - May need method to generate SVG from layers

---

## Implementation Plan

### Step 1: Create `components/actions/signAndAppend.ts`
**Purpose:** Extract signing logic from SignButton into reusable helper

**Function signature:**
```typescript
export async function signAndAppend(
  svgContent: string,
  options?: { onProgress?: (step: string) => void }
): Promise<{
  success: boolean;
  eventId?: string;
  bundlePath?: string;
  error?: string;
}>
```

**Implementation:**
- Canonicalize SVG
- Call `/api/proof/sign`
- Call `/api/proof/append`
- Call `/api/proof/bundle`
- Return structured result

### Step 2: Refactor SignButton.tsx
**Changes:**
- Import `signAndAppend` helper
- Replace inline API calls with helper call
- Keep UI state management (signing, success, error)
- Keep status messages

**Minimal change:** Extract logic, keep UI intact

### Step 3: Ensure DraftsmanCanvas can export SVG
**Check:**
- Does `state.currentSvg` in App.hardened.tsx generate SVG from layers?
- If yes, no change needed
- If no, add export method to DraftsmanCanvas

**Likely:** No change needed - App.hardened.tsx already generates SVG

### Step 4: Update App.hardened.tsx (if needed)
**Check:**
- Is `state.currentSvg` properly generated from layers?
- Is it passed correctly to SignButton?

**Likely:** Already working, may just need verification

---

## Files to Modify

1. **CREATE:** `components/actions/signAndAppend.ts`
   - New file, helper function

2. **MODIFY:** `components/SignButton.tsx`
   - Replace inline API calls with `signAndAppend()` call
   - Keep all UI logic

3. **VERIFY:** `components/DraftsmanCanvas.tsx`
   - Check if export method needed (likely not)

4. **VERIFY:** `App.hardened.tsx`
   - Check `state.currentSvg` generation (likely already works)

---

## Risk Assessment

**Low Risk:**
- SignButton already works
- Just extracting logic into helper
- All API endpoints exist
- Minimal changes to working code

**Potential Issues:**
- If `state.currentSvg` doesn't generate properly, need to fix that
- Helper function needs proper error handling
- Need to ensure canonicalization matches existing logic

---

## Test Plan

1. **Unit test helper:**
   - Mock API calls
   - Test canonicalization
   - Test error handling

2. **Integration test:**
   - Draw on canvas
   - Click Sign button
   - Verify LEDGER.ndjson updated
   - Verify bundle created

3. **Manual test:**
   - Start dev server
   - Draw with Pencil
   - Click Sign & Append
   - Check toast message
   - Check LEDGER.ndjson
   - Run demo_flow.sh

---

## Deliverable

**Git patch will include:**
1. New file: `components/actions/signAndAppend.ts`
2. Modified: `components/SignButton.tsx` (refactored to use helper)
3. Test instructions
4. Example test log

**Size:** Small, focused changes
**Reversible:** Yes, can revert easily

---

**Status:** Plan ready, proceeding to generate patch


