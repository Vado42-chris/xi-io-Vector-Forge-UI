# Cursor Worktree Sync Issue - Permanent Fix

## Problem

Cursor keeps trying to sync `CHATBOT_FIX_COMPLETE.md` to `/xi-io-Vector-Forge-UI/` (root directory), causing permission errors.

**Error:** `Unable to write file '/xi-io-Vector-Forge-UI/CHATBOT_FIX_COMPLETE.md' (NoPermissions)`

## Root Cause

Cursor's worktree sync is misconfigured - it's trying to create a directory at root level based on the repository name instead of using the actual workspace path.

**Workspace:** `/home/chrishallberg/.cursor/worktrees/Untitled__Workspace_/kvp`  
**Wrong Path:** `/xi-io-Vector-Forge-UI/` (root level)

## Solutions Applied

1. ✅ Removed file from git tracking: `git rm --cached CHATBOT_FIX_COMPLETE.md`
2. ✅ Added to .gitignore: `echo "CHATBOT_FIX_COMPLETE.md" >> .gitignore`
3. ✅ Committed changes to finalize removal

## If Error Persists

### Option 1: Restart Cursor
- Close Cursor completely
- Reopen the workspace
- This refreshes worktree state

### Option 2: Check Cursor Workspace Settings
- Cursor → Settings → Workspace
- Verify workspace path is: `/home/chrishallberg/.cursor/worktrees/Untitled__Workspace_/kvp`
- Not: `/xi-io-Vector-Forge-UI/`

### Option 3: Clear Cursor Worktree Cache
```bash
# Close Cursor first, then:
rm -rf ~/.cursor/worktrees/.git/worktrees/*/ 2>/dev/null || true
```

### Option 4: Recreate Worktree (Last Resort)
```bash
# Only if other options fail
cd /home/chrishallberg
git worktree remove .cursor/worktrees/Untitled__Workspace_/kvp
git worktree add .cursor/worktrees/Untitled__Workspace_/kvp
```

## Prevention

- Keep files that cause sync issues in `.gitignore`
- Don't track temporary/local files in git
- Use relative paths in git operations

---

**Status:** Changes committed, restart Cursor to refresh worktree state


