#!/bin/bash
# Fix Dev Server - Increase File Watcher Limit
# Professional development infrastructure setup
# #hashtag: #dev-server #infrastructure #professional

echo "=== FIXING DEV SERVER ==="
echo "Server Timestamp (UTC): $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
echo "Work Tracking ID: WT-2025-01-27-038"
echo "Patent Tracking ID: P-2025-01-27-035"
echo "Blockchain Seed: seed001"
echo "---"

# Check current limit
CURRENT_LIMIT=$(cat /proc/sys/fs/inotify/max_user_watches 2>/dev/null || echo "unknown")
echo "Current file watcher limit: $CURRENT_LIMIT"

# Target limit (8x current, standard for large projects)
TARGET_LIMIT=524288

if [ "$CURRENT_LIMIT" -lt "$TARGET_LIMIT" ] 2>/dev/null; then
    echo "---"
    echo "Increasing file watcher limit to $TARGET_LIMIT..."
    
    # Temporary increase (until reboot)
    if sudo sysctl fs.inotify.max_user_watches=$TARGET_LIMIT 2>/dev/null; then
        echo "✅ Temporary limit increased (until reboot)"
    else
        echo "⚠️  Could not increase limit (may need sudo access)"
        echo "   Run manually: sudo sysctl fs.inotify.max_user_watches=$TARGET_LIMIT"
    fi
    
    # Permanent increase (survives reboot)
    if echo "fs.inotify.max_user_watches=$TARGET_LIMIT" | sudo tee -a /etc/sysctl.conf >/dev/null 2>&1; then
        echo "✅ Permanent limit configured (survives reboot)"
        echo "   Applied on next reboot, or run: sudo sysctl -p"
    else
        echo "⚠️  Could not configure permanent limit (may need sudo access)"
        echo "   Run manually: echo 'fs.inotify.max_user_watches=$TARGET_LIMIT' | sudo tee -a /etc/sysctl.conf"
    fi
else
    echo "✅ Limit already sufficient ($CURRENT_LIMIT >= $TARGET_LIMIT)"
fi

echo "---"
echo "Verifying new limit..."
NEW_LIMIT=$(cat /proc/sys/fs/inotify/max_user_watches 2>/dev/null || echo "unknown")
echo "New file watcher limit: $NEW_LIMIT"

if [ "$NEW_LIMIT" -ge "$TARGET_LIMIT" ] 2>/dev/null; then
    echo "✅ Dev server should now work properly"
    echo "---"
    echo "Next: Start dev server with 'npm run dev'"
else
    echo "⚠️  Limit not increased - dev server may still fail"
    echo "   Consider using polling mode in vite.config.ts as fallback"
fi

