# Task T1: Final Unified Patch

## ✅ Patch Generated from Working Tree

**Source:** Current working tree (browser-compatible version)  
**Format:** Unified git diff  
**Files:** 3 files (2 new, 1 modified)

---

## Patch File

**Location:** `patch_T1_clean.diff`

**Contents:**
- `components/actions/signAndAppend.ts` - NEW (123 lines)
- `components/SignButton.tsx` - NEW (107 lines)
- `App.hardened.tsx` - MODIFIED (SignButton integration only)

---

## Apply Patch

```bash
# Review patch
cat patch_T1_clean.diff

# Apply patch
git apply patch_T1_clean.diff

# Verify
git status
```

---

## What the Patch Does

1. **Creates Helper Function** (`signAndAppend.ts`)
   - Browser-compatible (uses `fetch`, not Node.js APIs)
   - Wraps proof API calls (sign, append, bundle)
   - Provides structured result with success/error
   - Supports progress callbacks

2. **Creates SignButton Component** (`SignButton.tsx`)
   - Uses `signAndAppend()` helper
   - Status states: idle, signing, success, error
   - UI feedback with button text changes
   - Toast notifications via callbacks

3. **Integrates SignButton** (`App.hardened.tsx`)
   - Imports SignButton
   - Adds to header (next to file menu)
   - Passes `state.currentSvg` as prop
   - Shows toast on success/error

---

## Test Instructions

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test in browser:**
   - Draw on canvas (Pencil tool)
   - Click "Sign & Create Proof" button
   - Verify toast: "✅ Proof bundle created: [path]"

3. **Verify ledger:**
   ```bash
   tail -n 1 LEDGER.ndjson | jq .
   ```

4. **Verify bundle:**
   ```bash
   ls -lh proof_bundle_*.zip
   ```

5. **Run tests:**
   ```bash
   npm test
   npx tsc --noEmit
   ```

---

## Security Notes

✅ **Browser-compatible:** Uses `fetch` API (no Node.js dependencies)  
✅ **Server-side signing:** Calls `/api/proof/sign` endpoint (private keys stay on server)  
✅ **No key exposure:** Private keys never leave server

**Note:** The implementation correctly uses server-side signing. Private keys are stored in `~/.local/share/vectorforge/private_key.pem` on the server, not in the browser.

---

## Commit Command

```bash
git add components/actions/signAndAppend.ts components/SignButton.tsx App.hardened.tsx
git commit -m "Task T1: Wire SignButton to canvas export (browser-compatible sign+append)"
```

---

## Kanban Update

Update `kanban.json`:
```json
{
  "id": "T1",
  "status": "done"
}
```

---

**Status:** ✅ Patch ready for review and application

**#task-1-complete #patch-ready #browser-compatible**


