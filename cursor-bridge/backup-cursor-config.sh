#!/bin/bash
# Backup Cursor Configuration - Critical for recovery when out of usage
# Can be run from terminal, Zed, or any environment

set -e

BACKUP_DIR="$HOME/.cursor-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CURSOR_SETTINGS="$HOME/.config/Cursor/User/settings.json"
CURSOR_WORKSPACE=".vscode/settings.json"

echo "🔒 Backing up Cursor configuration..."
echo ""

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup user settings
if [ -f "$CURSOR_SETTINGS" ]; then
    cp "$CURSOR_SETTINGS" "$BACKUP_DIR/settings.json.$TIMESTAMP"
    echo "✅ Backed up: $CURSOR_SETTINGS"
else
    echo "⚠️  Settings file not found: $CURSOR_SETTINGS"
fi

# Backup workspace settings
if [ -f "$CURSOR_WORKSPACE" ]; then
    cp "$CURSOR_WORKSPACE" "$BACKUP_DIR/workspace-settings.json.$TIMESTAMP"
    echo "✅ Backed up: $CURSOR_WORKSPACE"
fi

# Create latest symlinks for easy access
if [ -f "$CURSOR_SETTINGS" ]; then
    ln -sf "$BACKUP_DIR/settings.json.$TIMESTAMP" "$BACKUP_DIR/settings.json.latest"
fi

# Create a summary file
cat > "$BACKUP_DIR/backup-summary.$TIMESTAMP.txt" << EOF
Cursor Configuration Backup
===========================
Timestamp: $(date)
Backup Location: $BACKUP_DIR

Files Backed Up:
- User Settings: $CURSOR_SETTINGS
- Workspace Settings: $CURSOR_WORKSPACE

To Restore:
./restore-cursor-config.sh $TIMESTAMP

Or manually:
cp $BACKUP_DIR/settings.json.$TIMESTAMP $CURSOR_SETTINGS
EOF

echo ""
echo "✅ Backup complete!"
echo "📁 Location: $BACKUP_DIR"
echo "📄 Summary: $BACKUP_DIR/backup-summary.$TIMESTAMP.txt"
echo ""
echo "Latest backup: $BACKUP_DIR/settings.json.latest"

