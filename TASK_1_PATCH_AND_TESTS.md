# Task T1: Git Patch and Test Instructions

## Patch Summary

**Files Modified:**
1. **NEW:** `components/actions/signAndAppend.ts` - Helper function wrapping proof API calls
2. **MODIFIED:** `components/SignButton.tsx` - Refactored to use `signAndAppend()` helper

**Changes:**
- Extracted signing logic from SignButton into reusable helper
- SignButton now calls `signAndAppend()` instead of inline API calls
- Helper provides structured result with success/error status
- Helper includes progress callback support

**Size:** Small, focused refactoring
**Risk:** Low - minimal changes to working code

---

## Test Instructions

### Prerequisites
1. Dev server running: `npm run dev`
2. Backend server running: `npm run dev:server` (or server.js handles both)
3. Keypair exists: `~/.local/share/vectorforge/private_key.pem`

### Test Steps

#### 1. Start Dev Server
```bash
npm run dev
```

#### 2. Open App in Browser
- Navigate to: `http://localhost:3000`
- Wait for app to load

#### 3. Draw on Canvas
- Select Pencil tool (or any drawing tool)
- Draw something on the canvas
- Verify drawing appears

#### 4. Click Sign & Append Button
- Locate "Sign & Create Proof" button in header
- Click the button
- Observe status changes:
  - Button text changes to "Signing..."
  - Then changes to "✓ Signed!" on success
  - Or "Error - Try Again" on failure

#### 5. Verify Success Message
- Check for toast notification: "✅ Proof bundle created: [path]"
- Button should show "✓ Signed!" briefly

#### 6. Verify LEDGER.ndjson Updated
```bash
tail -n 10 LEDGER.ndjson
```

**Expected:** New entry with:
- `id`: Event ID (e.g., `proof_1234567890`)
- `type`: `"proof_event"`
- `timestamp`: ISO timestamp
- `canonicalSvg`: Base64 encoded SVG
- `signature`: Base64 signature
- `publicKey`: Base64 public key

#### 7. Verify Bundle Created
```bash
ls -lh proof_bundle_*.zip
```

**Expected:** File exists (e.g., `proof_bundle_proof_1234567890.zip`)

#### 8. Run Demo Flow Script
```bash
./scripts/demo_flow.sh
```

**Expected:** Script completes successfully, verification passes

---

## Example Test Log

### Successful Test Run

```
$ npm run dev
> vectorforge@1.0.0 dev
> vite

  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose

[Browser] Opened http://localhost:3000
[Browser] Selected Pencil tool
[Browser] Drew a simple line on canvas
[Browser] Clicked "Sign & Create Proof" button
[Browser] Button text changed to "Signing..."
[Browser] Toast appeared: "✅ Proof bundle created: proof_bundle_proof_1734567890.zip"
[Browser] Button text changed to "✓ Signed!" then back to "Sign & Create Proof"

$ tail -n 1 LEDGER.ndjson
{"id":"proof_1734567890","type":"proof_event","timestamp":"2025-12-30T18:50:00.000Z","canonicalSvg":"PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0gMTAwIDEwMCBMIDIwMCAyMDAiLz48L3N2Zz4=","signature":"MEUCIQD...","publicKey":"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE..."}

$ ls -lh proof_bundle_*.zip
-rw-r--r-- 1 user user 2.5K Dec 30 18:50 proof_bundle_proof_1734567890.zip

$ ./scripts/demo_flow.sh
✅ Canonical SVG created
✅ Signed successfully
✅ Appended to ledger
✅ Bundle created: proof_bundle_proof_1734567890.zip
✅ Verification passed
```

### Failed Test Run (Example)

```
[Browser] Clicked "Sign & Create Proof" button
[Browser] Button text changed to "Error - Try Again"
[Browser] Toast appeared: "❌ Signing failed: Network error"

$ tail -n 1 LEDGER.ndjson
(No new entry - previous entry still last)

$ ls -lh proof_bundle_*.zip
ls: cannot access 'proof_bundle_*.zip': No such file or directory
```

**Troubleshooting:**
- Check server is running: `curl http://localhost:3000/api/health`
- Check keypair exists: `ls ~/.local/share/vectorforge/private_key.pem`
- Check browser console for errors (F12)

---

## Unit Test Instructions

### Test Helper Function Directly

Create test file: `tests/signAndAppend.test.ts`

```typescript
import { signAndAppend } from '../components/actions/signAndAppend';

describe('signAndAppend', () => {
  it('should return error for empty SVG', async () => {
    const result = await signAndAppend('');
    expect(result.success).toBe(false);
    expect(result.error).toContain('No drawing to sign');
  });

  it('should sign and append valid SVG', async () => {
    const svg = '<svg><path d="M 10 10 L 20 20"/></svg>';
    const result = await signAndAppend(svg);
    expect(result.success).toBe(true);
    expect(result.eventId).toBeDefined();
    expect(result.bundlePath).toBeDefined();
  });
});
```

Run: `npm test -- signAndAppend`

---

## Integration Test Instructions

### Simulate Click and Verify Ledger

```typescript
// In browser console or test
const button = document.querySelector('[aria-label="Sign & Create Proof"]');
const initialLedgerSize = await fetch('/api/filesystem/read?path=LEDGER.ndjson')
  .then(r => r.json())
  .then(d => d.content.split('\n').filter(Boolean).length);

button.click();

// Wait for signing to complete
await new Promise(resolve => setTimeout(resolve, 5000));

const newLedgerSize = await fetch('/api/filesystem/read?path=LEDGER.ndjson')
  .then(r => r.json())
  .then(d => d.content.split('\n').filter(Boolean).length);

console.assert(newLedgerSize > initialLedgerSize, 'Ledger should have new entry');
```

---

## Rollback Instructions

If patch causes issues:

```bash
# Revert SignButton changes
git checkout HEAD -- components/SignButton.tsx

# Remove helper file
rm components/actions/signAndAppend.ts

# Verify app still works
npm run dev
```

---

## Risk Statement

**Low Risk:**
- Only refactoring existing working code
- No API changes
- No breaking changes to SignButton interface
- Helper function is pure (no side effects except API calls)
- Easy to revert if issues occur

**Potential Issues:**
- If `state.currentSvg` in App.hardened.tsx doesn't generate properly, SignButton won't work (but this is pre-existing, not caused by patch)
- Helper function error handling matches original SignButton behavior

---

## Deliverable Summary

✅ **Git patch:** `patch.diff` (unified diff format)
✅ **Test instructions:** Manual and automated
✅ **Example test log:** Success and failure cases
✅ **Rollback plan:** Easy revert steps

**Status:** Ready for review and application

---

**#task-1-complete #patch-ready #test-instructions**


