# Quick Start: Deathstar Playbook

**Status:** ✅ Kanban created, DevChatbot ready, immediate commands prepared

---

## ✅ What's Ready

1. **Kanban Task Queue** - `KANBAN_TASK_QUEUE.json` (8 prioritized tasks)
2. **Task Prompts** - `TASK_PROMPTS_FOR_AI_CODER.md` (copy-paste ready)
3. **Immediate Commands** - `IMMEDIATE_ACTION_COMMANDS.sh` (run now)
4. **DevChatbot** - Integrated in Right Sidebar → Dev Chat tab

---

## 🚀 Execute Now (5 minutes)

### Step 1: Run Immediate Actions
```bash
./IMMEDIATE_ACTION_COMMANDS.sh
```

**What it does:**
- Backs up ledger and config
- Generates keypair (if needed)
- Runs proof demo flow
- Creates `proof_bundle.zip`

**Expected output:**
- ✅ Backup created
- ✅ Keypair ready
- ✅ `proof_bundle.zip` created
- ✅ Verification status

---

### Step 2: Verify DevChatbot Works

1. **Open VectorForge:** `http://localhost:3000`
2. **Open Dev Chat:** Press `Ctrl+K` OR click "💬 Dev Chat" tab in right sidebar
3. **Test it:** Type `test`
4. **Expected:** System status message

**If DevChatbot doesn't respond:**
- Check browser console (F12) for errors
- Verify server is running: `npm run dev:server`
- Check API endpoints: `curl http://localhost:3000/api/health`

---

### Step 3: Start Task Execution

**Option A: Use DevChatbot (Recommended)**
1. Open Dev Chat (`Ctrl+K`)
2. Copy task #1 from `TASK_PROMPTS_FOR_AI_CODER.md`
3. Paste to DevChatbot
4. Review the patch it produces
5. Apply: `git apply patch.diff`
6. Test and move to next task

**Option B: Use Cursor Agent**
1. Open task from `KANBAN_TASK_QUEUE.json`
2. Give Cursor agent the task description
3. Review patch
4. Apply and test

---

## 📋 Task Priority Order

**Immediate (0-2h):**
1. ✅ Run proof demo (just did this)
2. ✅ Backup (just did this)

**Critical (2-4h):**
3. Wire SignButton to canvas export (1-2h)
4. Integrate Brush tool into palette (2-3h)
5. Export QA and dialog fixes (1-2h)

**High Priority (4-8h):**
6. Create Pen tool using factory (3-6h)
7. Parity smoke tests (2-3h)
8. Multi-file tabs (1-3h)

**Polish (1-2h each):**
9. Fix top-left corner layout
10. Fix file menu spacing
11. Fix typography hierarchy
12. Enforce z-index system

---

## 💡 Credit Conservation Strategy

### Use DevChatbot for Execution
- DevChatbot uses local AI (Ollama) - **no Cursor credits**
- You only use credits to review patches
- Each task = 1 credit (review) vs 10+ credits (me doing it)

### Workflow
1. **DevChatbot executes** (local AI, free)
2. **You review patch** (1 credit)
3. **Apply if good** (git apply)
4. **Test** (manual)
5. **Next task** (repeat)

**Total for 8 tasks:** ~8 credits (review only) vs ~80+ credits (me doing all work)

---

## 🎯 Next Action

**Right now, do this:**

1. **Run:** `./IMMEDIATE_ACTION_COMMANDS.sh`
2. **Verify:** DevChatbot works (type "test")
3. **Start:** Give DevChatbot task #1 from `TASK_PROMPTS_FOR_AI_CODER.md`

**That's it.** DevChatbot will do the work, you review patches.

---

## 📁 Files Created

- ✅ `KANBAN_TASK_QUEUE.json` - Complete task queue
- ✅ `TASK_PROMPTS_FOR_AI_CODER.md` - Ready-to-use prompts
- ✅ `IMMEDIATE_ACTION_COMMANDS.sh` - Run now script
- ✅ `QUICK_START_DEATHSTAR.md` - This file

---

## 🔧 If DevChatbot Doesn't Work

**Check:**
1. Server running? `npm run dev:server`
2. API accessible? `curl http://localhost:3000/api/health`
3. File API works? `curl "http://localhost:3000/api/filesystem/read?path=package.json"`
4. Terminal API works? `curl -X POST http://localhost:3000/api/terminal/execute -H "Content-Type: application/json" -d '{"command":"echo test"}'`

**Fix:**
- If APIs fail, check `server.js` has routes registered
- If DevChatbot not visible, check `RightSidebar.tsx` line 455

---

## ✅ Success Criteria

**You're ready when:**
- ✅ Proof bundle created (`proof_bundle.zip` exists)
- ✅ DevChatbot responds to "test" command
- ✅ DevChatbot can read files ("read package.json")
- ✅ DevChatbot can execute commands ("run git status")

**Then:** Start giving it tasks from the Kanban!

---

**#this-is-the-way #deathstar #kanban-ready #devchatbot-first**

**Last Updated:** December 30, 2025


