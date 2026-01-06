# Cursor Git Sync Issue - Root Cause & Solution

## Problem
Cursor can't send files to GitHub and files are getting overwritten or stashed.

## Root Cause Identified

**The issue:** Multiple worktrees with uncommitted changes are causing Cursor to sync from the wrong location, overwriting files in the main repository.

**Worktrees with uncommitted changes:**
- `/home/chrishallberg/.cursor/worktrees/xi-io-Vector-Forge-UI/qwu` - Has changes to App.hardened.tsx, App.staged.tsx, App.tsx
- `/home/chrishallberg/.cursor/worktrees/xi-io-Vector-Forge-UI/asg` - Has changes to services/aiCodeEditor.ts
- Multiple other worktrees in detached HEAD state

**Main repo:** `/home/chrishallberg/xi-io-Vector-Forge-UI` (clean, all changes committed and pushed)

## Solution

### ✅ Step 1: Main Repo Fixed
- All changes committed: `1e87a9e`
- All changes pushed to GitHub: `origin/enforcement/ourmaths-phase1`
- Working tree is clean

### 🔧 Step 2: Fix Worktree Conflicts

**Option A: Remove Unused Worktrees (Recommended)**
```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI

# Remove worktrees you're not actively using
git worktree remove /home/chrishallberg/.cursor/worktrees/xi-io-Vector-Forge-UI/qwu
git worktree remove /home/chrishallberg/.cursor/worktrees/xi-io-Vector-Forge-UI/asg
# Only remove if you're not using them
```

**Option B: Commit Worktree Changes First**
If you need to keep the worktrees, commit their changes:
```bash
cd /home/chrishallberg/.cursor/worktrees/xi-io-Vector-Forge-UI/qwu
git add -A
git commit -m "Worktree changes"
# Then merge or cherry-pick into main repo
```

### 🔧 Step 3: Configure Cursor to Use Main Repo

1. **Close Cursor completely**
2. **Reopen Cursor**
3. **Open the main repository directly:**
   - File → Open Folder
   - Navigate to: `/home/chrishallberg/xi-io-Vector-Forge-UI`
   - **NOT** a worktree path

4. **Verify Cursor is using main repo:**
   - Check bottom status bar - should show branch `enforcement/ourmaths-phase1`
   - Check git status - should be clean

### 🔧 Step 4: Disable Worktree Sync (If Needed)

If Cursor keeps trying to sync from worktrees:

1. **Cursor Settings → Git**
2. Look for "Worktree" or "Sync" settings
3. Disable automatic worktree sync if available
4. Or configure it to only sync from main repo

## Prevention

1. **Work in main repo** - Use `/home/chrishallberg/xi-io-Vector-Forge-UI` directly
2. **Clean worktrees** - Remove unused worktrees regularly
3. **Commit frequently** - Don't leave uncommitted changes in worktrees
4. **Push regularly** - Keep GitHub in sync

## Current Status

- ✅ **Main repo:** Clean, all changes committed and pushed
- ⚠️ **Worktrees:** Have uncommitted changes that may conflict
- ✅ **GitHub:** Up to date with commit `1e87a9e`

## Next Steps

1. **Restart Cursor** and open main repo directly
2. **Remove unused worktrees** if you're not using them
3. **If files still get overwritten:** Check which worktree Cursor is syncing from and remove it

---

**The main issue was uncommitted changes blocking git operations. That's now fixed. If Cursor still overwrites files, it's because it's syncing from a worktree instead of the main repo.**



