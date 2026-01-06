# Recovery Plan - Restore from Commit 0465fa2

## Discovery

**Commit Found:** `0465fa2` - "Fix: Remove dev buttons, fix CSP, restore index.html structure, fix App.hardened.tsx"  
**Date:** Wed Dec 31 05:26:17 2025  
**Status:** This commit had many UI fixes in place before recent changes broke things

## What Was Fixed in That Commit

1. **Dev Buttons Removed** ✅
   - FloatingDevChatButton removed from App.hardened.tsx
   - All dev buttons removed from index.html
   - Clean UI with Dev Chat only in Right Sidebar

2. **CSP Fixed** ✅
   - Material Icons font loading fixed
   - Proper CSP directives

3. **Component Structure** ✅
   - DraftsmanCanvas was being used (not ForgeCanvasPlaceholder)
   - Proper imports and structure
   - Many style fixes applied

4. **Files Modified:**
   - App.hardened.tsx (66 lines changed)
   - index.html (cleaned up)
   - Multiple style files added/fixed
   - Components updated (RightSidebar, LeftSidebar, etc.)

## Current Issues vs. That Commit

### Current State (Broken):
- ❌ ForgeCanvasPlaceholder (missing grid, file bounds)
- ❌ StackBar/FileTabsBar missing or broken
- ❌ Material Icons not loading
- ❌ Right Sidebar not using accordions
- ❌ Tool groupings incomplete

### That Commit (Working):
- ✅ DraftsmanCanvas (working canvas)
- ✅ Clean index.html (no dev buttons)
- ✅ Material Icons fixed
- ✅ Proper component structure
- ✅ Many UI fixes documented

## Recovery Options

### Option 1: Restore Specific Files from That Commit
```bash
# Restore App.hardened.tsx from that commit
git show 0465fa2:App.hardened.tsx > App.hardened.tsx.backup
git checkout 0465fa2 -- App.hardened.tsx

# Restore index.html
git checkout 0465fa2 -- index.html

# Restore style files
git checkout 0465fa2 -- styles/
```

### Option 2: Create New Branch from That Commit
```bash
# Create branch from that working state
git checkout -b recovery/from-0465fa2 0465fa2

# Then merge selective changes from current branch
```

### Option 3: Compare and Manually Restore
```bash
# See what changed since then
git diff 0465fa2 HEAD -- App.hardened.tsx

# See what was working
git show 0465fa2:App.hardened.tsx > App.hardened.working.tsx
```

## Recommended Approach

1. **First, backup current state:**
   ```bash
   git stash
   git branch backup/before-recovery-$(date +%s)
   ```

2. **Restore key files from working commit:**
   ```bash
   git checkout 0465fa2 -- App.hardened.tsx
   git checkout 0465fa2 -- index.html
   git checkout 0465fa2 -- styles/
   ```

3. **Test and verify:**
   - Check if UI loads correctly
   - Verify Material Icons work
   - Check if canvas renders
   - Verify Right Sidebar works

4. **Selectively re-apply needed changes:**
   - Keep any new features that were added
   - Keep any bug fixes that are still valid
   - Avoid re-introducing broken components

## Next Steps

Would you like me to:
1. Create a backup branch first?
2. Restore files from commit 0465fa2?
3. Show you a diff of what changed since then?
4. Create a hybrid approach (restore structure, keep new features)?


