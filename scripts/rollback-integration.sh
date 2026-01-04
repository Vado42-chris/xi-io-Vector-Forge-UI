#!/bin/bash
# Rollback Integration
# Purpose: Revert integration if something breaks

set -e

echo "🔄 Rolling back integration..."
echo ""

# 1. Check if we're in a git repo
if [ ! -d ".git" ]; then
  echo "❌ Not a git repository!"
  exit 1
fi

# 2. Get last commit
LAST_COMMIT=$(git log -1 --oneline)
echo "Last commit: $LAST_COMMIT"
echo ""

# 3. Ask for confirmation
read -p "Are you sure you want to rollback? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
  echo "Rollback cancelled."
  exit 0
fi

# 4. Restore from baseline if available
BASELINE_DIR=$(ls -t baseline/ | head -1)
if [ -n "$BASELINE_DIR" ] && [ -d "baseline/$BASELINE_DIR" ]; then
  echo "Restoring from baseline: $BASELINE_DIR"
  
  # Restore capability catalog
  if [ -f "baseline/$BASELINE_DIR/capability-registry.json" ]; then
    cp "baseline/$BASELINE_DIR/capability-registry.json" capability-catalog/capability-registry.json
    echo "✅ Restored capability catalog"
  fi
  
  # Restore package.json
  if [ -f "baseline/$BASELINE_DIR/package.json" ]; then
    cp "baseline/$BASELINE_DIR/package.json" package.json
    echo "✅ Restored package.json"
  fi
  
  # Restore configuration files
  if [ -f "baseline/$BASELINE_DIR/vite.config.ts" ]; then
    cp "baseline/$BASELINE_DIR/vite.config.ts" vite.config.ts
    echo "✅ Restored vite.config.ts"
  fi
  
  if [ -f "baseline/$BASELINE_DIR/tsconfig.json" ]; then
    cp "baseline/$BASELINE_DIR/tsconfig.json" tsconfig.json
    echo "✅ Restored tsconfig.json"
  fi
fi

# 5. Git rollback
echo ""
echo "Rolling back git changes..."
git reset --hard HEAD~1 2>/dev/null || echo "⚠️  Could not rollback git (no commits to rollback)"

# 6. Reinstall dependencies
echo ""
echo "Reinstalling dependencies..."
npm install

# 7. Verify rollback
echo ""
echo "Verifying rollback..."
npm test -- --run 2>&1 | head -20

echo ""
echo "✅ Rollback complete!"
echo ""
echo "Next steps:"
echo "1. Review what went wrong"
echo "2. Fix the issue"
echo "3. Test again"
echo "4. Re-integrate when ready"

