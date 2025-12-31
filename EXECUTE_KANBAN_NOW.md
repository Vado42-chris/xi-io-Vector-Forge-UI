# Execute Kanban - Ready to Start

**Status:** ✅ Kanban saved, Task 1 prompt ready, files verified

---

## ✅ What's Ready

1. **Kanban JSON** - `kanban.json` (8 tasks, prioritized)
2. **SignButton Component** - `components/SignButton.tsx` (exists, uses API endpoints)
3. **Proof API** - `api/proof.js` (sign, append, bundle endpoints exist)
4. **DevChatbot** - Integrated in Right Sidebar → Dev Chat tab
5. **Task 1 Prompt** - Ready to paste (see below)

---

## ⚠️ Files That Need Creation

**Task 1 mentions these files that don't exist yet:**
- `components/actions/signAndAppend.ts` - **Needs to be created** (helper function)
- `scripts/make_proof_bundle.sh` - **May need creation** (check if demo_flow.sh covers this)

**Note:** DevChatbot can create these files when executing Task 1.

---

## 🚀 Execute Task 1 Now

### Step 1: Open DevChatbot
1. Open `http://localhost:3000`
2. Press `Ctrl+K` OR click "💬 Dev Chat" tab in right sidebar
3. Verify it loads (type "test" to check)

### Step 2: Paste This Prompt

```
Task: Wire SignButton to real canvas export (UI patch)

Scope:
- Add wiring so the existing Sign & Append UI (components/SignButton.tsx) pulls the live canvas export from components/DraftsmanCanvas.tsx (SVG or canonical JSON), then runs the signAndAppend helper (components/actions/signAndAppend.ts) with the current private key path.
- Show user-facing status messages: "Signing...", "Signed and appended", or "Error: <message>".
- The change must be minimal: add an IPC or fetch path if Electron not used; fallback to saving canonical to temp file and calling script.

Files to modify:
- components/SignButton.tsx
- components/actions/signAndAppend.ts (create if needed - wrapper for /api/proof/* endpoints)
- components/DraftsmanCanvas.tsx (small export hook)
- Optional: add tests or a demo script invocation in scripts/demo_flow.sh

Deliverable:
- A git patch (unified diff) that implements the wiring and updates SignButton to call the helper.
- Unit/integration test instructions: how to simulate click & verify LEDGER.ndjson appended.

Constraints:
- Keep changes reversible and minimal.
- Do NOT create or commit private keys.
- Tools allowed: node, jq, openssl, curl for POST.
- Use existing API endpoints in api/proof.js (sign, append, bundle)

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

### Step 3: Review Generated Patch
- DevChatbot will generate a git patch
- Review the diff
- Check it's minimal and reversible

### Step 4: Apply & Test
```bash
# Save patch from DevChatbot output to patch.diff

# Check patch
git apply --check patch.diff

# Apply
git apply patch.diff

# Test
npm test
npx tsc --noEmit

# Manual test
npm run dev
# Draw, click Sign, verify LEDGER.ndjson updated
```

### Step 5: Commit if Good
```bash
git add .
git commit -m "Task T1: Wire SignButton to canvas export"
```

---

## 📊 Current File Status

**Exists:**
- ✅ `components/SignButton.tsx` - Uses API endpoints
- ✅ `api/proof.js` - Has sign, append, bundle endpoints
- ✅ `components/DraftsmanCanvas.tsx` - Canvas component
- ✅ `scripts/demo_flow.sh` - Demo script

**Needs Creation:**
- ⚠️ `components/actions/signAndAppend.ts` - Helper wrapper (DevChatbot can create)
- ⚠️ `scripts/make_proof_bundle.sh` - May be covered by demo_flow.sh

**Note:** DevChatbot will create missing files when executing Task 1.

---

## 💡 Credit Conservation

**This approach uses ~1 credit per task:**
- DevChatbot generates patch (uses local AI/Ollama = 0 credits)
- You review patch (1 credit)
- Apply and test (manual, 0 credits)

**Total for 8 tasks:** ~8 credits (vs 80+ if I do all work)

---

## ✅ Success Criteria

**Task 1 is done when:**
- ✅ SignButton calls signAndAppend helper
- ✅ Helper uses existing API endpoints
- ✅ Clicking Sign button creates ledger entry
- ✅ UI shows success message
- ✅ Tests pass

---

## Next Steps

1. **Now:** Open DevChatbot, paste Task 1 prompt
2. **Review:** Check generated patch
3. **Apply:** git apply if good
4. **Test:** Follow test steps
5. **Commit:** If tests pass
6. **Next:** Move to Task 2

---

**Status:** ✅ Ready to execute

**Action:** Open DevChatbot and paste the prompt above

---

**#this-is-the-way #kanban-execution #task-1-ready**


