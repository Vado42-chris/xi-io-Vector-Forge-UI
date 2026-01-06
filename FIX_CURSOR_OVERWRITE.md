# Fix: Cursor Overwriting Files - IMMEDIATE SOLUTION

## The Problem

Cursor is syncing from a **worktree** (`/home/chrishallberg/.cursor/worktrees/xi-io-Vector-Forge-UI/qwu`) that is:
- **On old commit:** `5896a2e` (behind main repo)
- **Has uncommitted changes:** Many files modified
- **Overwriting main repo:** Which is on newer commit `1e87a9e` with all your fixes

## The Fix

### ✅ Step 1: Main Repo is Fixed
- All changes committed: `1e87a9e`
- All changes pushed to GitHub
- Main repo is clean

### 🔧 Step 2: Make Cursor Use Main Repo (NOT Worktree)

**CRITICAL:** Cursor must open the **main repository**, not a worktree.

1. **Close Cursor completely** (not just the window)
2. **Reopen Cursor**
3. **File → Open Folder**
4. **Navigate to:** `/home/chrishallberg/xi-io-Vector-Forge-UI`
   - **NOT:** `/home/chrishallberg/.cursor/worktrees/xi-io-Vector-Forge-UI/qwu`
   - **NOT:** Any path with `.cursor/worktrees` in it

5. **Verify you're in main repo:**
   - Bottom status bar should show: `enforcement/ourmaths-phase1`
   - Run: `git status` → Should say "working tree clean"
   - Run: `git log -1` → Should show commit `1e87a9e`

### 🔧 Step 3: Remove Conflicting Worktree (Optional)

If you're not using the `qwu` worktree, remove it to prevent conflicts:

```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
git worktree remove /home/chrishallberg/.cursor/worktrees/xi-io-Vector-Forge-UI/qwu
```

**Only do this if you're not actively using that worktree.**

### 🔧 Step 4: If Cursor Still Overwrites

1. **Check Cursor workspace path:**
   - Cursor → Settings → Workspace
   - Should be: `/home/chrishallberg/xi-io-Vector-Forge-UI`
   - NOT a worktree path

2. **Clear Cursor cache** (close Cursor first):
   ```bash
   rm -rf ~/.cursor/cache/* 2>/dev/null || true
   ```

3. **Disable worktree sync** in Cursor settings (if available)

## Why This Happens

Cursor's worktree sync is trying to sync from `/home/chrishallberg/.cursor/worktrees/xi-io-Vector-Forge-UI/qwu` which:
- Is on an old commit (`5896a2e`)
- Has uncommitted changes
- When Cursor syncs, it overwrites the main repo with old/uncommitted changes

## Prevention

1. **Always open main repo:** `/home/chrishallberg/xi-io-Vector-Forge-UI`
2. **Never open worktrees directly** in Cursor
3. **Remove unused worktrees** regularly
4. **Commit and push frequently** to keep GitHub in sync

---

**Status:** ✅ Main repo fixed and pushed to GitHub  
**Action Required:** Restart Cursor and open main repo directly (not worktree)



