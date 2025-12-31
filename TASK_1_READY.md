# Task T1: Wire SignButton - Ready to Execute

**Status:** ✅ Kanban saved, Task 1 prompt ready

---

## Task Details

- **ID:** T1
- **Title:** Wire SignButton to real canvas export (UI patch)
- **Estimate:** 1.5 hours
- **Priority:** 1 (highest)
- **Risk:** Low

---

## Files to Check

**Expected files:**
- `components/SignButton.tsx` ✅ (exists)
- `components/actions/signAndAppend.ts` ⚠️ (need to check)
- `components/DraftsmanCanvas.tsx` ✅ (exists)
- `scripts/make_proof_bundle.sh` ⚠️ (need to check)

**Note:** Some files may need to be created or paths adjusted.

---

## Task 1 Prompt (Copy This)

```
Task: Wire SignButton to real canvas export (UI patch)

Scope:
- Add wiring so the existing Sign & Append UI (components/SignButton.tsx) pulls the live canvas export from components/DraftsmanCanvas.tsx (SVG or canonical JSON), then runs the signAndAppend helper (components/actions/signAndAppend.ts) with the current private key path.
- Show user-facing status messages: "Signing...", "Signed and appended", or "Error: <message>".
- The change must be minimal: add an IPC or fetch path if Electron not used; fallback to saving canonical to temp file and calling script.

Files to modify:
- components/SignButton.tsx
- components/actions/signAndAppend.ts (create if needed)
- components/DraftsmanCanvas.tsx (small export hook)
- Optional: add tests or a demo script invocation in scripts/demo_flow.sh

Deliverable:
- A git patch (unified diff) that implements the wiring and updates SignButton to call the helper.
- Unit/integration test instructions: how to simulate click & verify LEDGER.ndjson appended.

Constraints:
- Keep changes reversible and minimal.
- Do NOT create or commit private keys.
- Tools allowed: node, jq, openssl, curl for POST.

Test steps (must be returned with the patch):
1. Start dev server (npm run dev).
2. Open app, draw with Pencil tool, click Sign & Append.
3. Verify message "Signed and appended" appears.
4. Verify LEDGER.ndjson contains a new event (tail -n 10 LEDGER.ndjson).
5. Run ./scripts/demo_flow.sh to ensure bundle generation still passes.

Risk statement:
- Low: UI wiring only. If LEDGER format mismatches, the demo flow will show hash/signature mismatch which is reversible by reverting the patch.

Return format:
- Provide a unified git patch as the output (patch.diff).
- Provide a short test log example showing success or failure.

Do not apply the patch automatically — provide it for human review and git apply.
```

---

## Execution Steps

### Step 1: Open DevChatbot
1. Navigate to: `http://localhost:3000`
2. Press `Ctrl+K` OR click "💬 Dev Chat" tab in right sidebar
3. Verify DevChatbot loads

### Step 2: Paste Task 1 Prompt
1. Copy the prompt above (entire block)
2. Paste into DevChatbot input
3. Press Enter or click Send

### Step 3: Review Generated Patch
1. DevChatbot will generate a git patch
2. Review the diff carefully
3. Check that it:
   - Modifies only the files listed
   - Doesn't create private keys
   - Is minimal and reversible

### Step 4: Apply Patch
```bash
# Save patch to file
# (copy from DevChatbot output)

# Review diff
git apply --check patch.diff

# Apply if OK
git apply patch.diff

# Test
npm test
npx tsc --noEmit
```

### Step 5: Manual Test
1. Start dev server: `npm run dev`
2. Open app in browser
3. Draw with Pencil tool
4. Click "Sign & Append" button
5. Verify message appears
6. Check LEDGER.ndjson: `tail -n 10 LEDGER.ndjson`

### Step 6: Commit if Good
```bash
git add .
git commit -m "Task T1: Wire SignButton to canvas export"
```

### Step 7: Update Kanban
```bash
# Edit kanban.json, change T1 status to "done"
```

---

## If DevChatbot Doesn't Work

**Check:**
1. Is server running? `npm run dev:server`
2. Can DevChatbot read files? Type: `read package.json`
3. Can DevChatbot execute commands? Type: `run git status`

**If APIs fail:**
- Check `server.js` has fileSystem routes registered
- Check `api/filesystem.js` exists
- Check `api/terminal/execute` endpoint exists

---

## Next Task

After T1 is done:
- Copy T2 prompt from `kanban.json`
- Paste to DevChatbot
- Repeat process

---

**Status:** ✅ Ready to execute Task 1

**Next:** Open DevChatbot and paste the prompt above

---

**#this-is-the-way #task-1-ready #kanban-execution**


