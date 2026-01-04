#!/bin/bash
# Restore Cursor Configuration from Backup
# Can be run from terminal, Zed, or any environment (even when Cursor is broken)

set -e

BACKUP_DIR="$HOME/.cursor-backups"
CURSOR_SETTINGS="$HOME/.config/Cursor/User/settings.json"
CURSOR_DIR="$(dirname "$CURSOR_SETTINGS")"

if [ -z "$1" ]; then
    echo "Usage: $0 <backup-timestamp>"
    echo ""
    echo "Available backups:"
    ls -1 "$BACKUP_DIR"/settings.json.* 2>/dev/null | sed 's/.*settings\.json\.//' | grep -v latest || echo "No backups found"
    exit 1
fi

TIMESTAMP="$1"
BACKUP_FILE="$BACKUP_DIR/settings.json.$TIMESTAMP"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup not found: $BACKUP_FILE"
    echo ""
    echo "Available backups:"
    ls -1 "$BACKUP_DIR"/settings.json.* 2>/dev/null | sed 's/.*settings\.json\.//' | grep -v latest || echo "No backups found"
    exit 1
fi

echo "🔄 Restoring Cursor configuration from backup..."
echo "Backup: $BACKUP_FILE"
echo ""

# Create Cursor config directory if it doesn't exist
mkdir -p "$CURSOR_DIR"

# Backup current settings before restoring
if [ -f "$CURSOR_SETTINGS" ]; then
    cp "$CURSOR_SETTINGS" "$CURSOR_SETTINGS.before-restore.$(date +%Y%m%d_%H%M%S)"
    echo "✅ Backed up current settings before restore"
fi

# Restore
cp "$BACKUP_FILE" "$CURSOR_SETTINGS"
echo "✅ Restored: $CURSOR_SETTINGS"
echo ""
echo "⚠️  Restart Cursor for changes to take effect"
echo ""

