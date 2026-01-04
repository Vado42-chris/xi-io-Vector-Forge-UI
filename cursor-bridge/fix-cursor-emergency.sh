#!/bin/bash
# Emergency Cursor Fix - When Cursor is broken and you're out of usage
# Can be run from terminal, Zed, or any environment
# This script fixes Cursor configuration without needing Cursor to be running

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🚨 Emergency Cursor Fix"
echo "========================"
echo ""
echo "This script will:"
echo "1. Restore Cursor settings from backup (or create new)"
echo "2. Ensure local AI is configured"
echo "3. Start the Cursor bridge"
echo "4. Verify everything is working"
echo ""

CURSOR_SETTINGS="$HOME/.config/Cursor/User/settings.json"
CURSOR_DIR="$(dirname "$CURSOR_SETTINGS")"
BACKUP_DIR="$HOME/.cursor-backups"

# Step 1: Restore from backup if available
echo -e "${BLUE}Step 1: Checking for backups...${NC}"
LATEST_BACKUP="$BACKUP_DIR/settings.json.latest"
if [ -f "$LATEST_BACKUP" ]; then
    echo -e "${GREEN}✅ Found backup, restoring...${NC}"
    mkdir -p "$CURSOR_DIR"
    cp "$LATEST_BACKUP" "$CURSOR_SETTINGS"
    echo -e "${GREEN}✅ Restored from backup${NC}"
else
    echo -e "${YELLOW}⚠️  No backup found, creating new configuration...${NC}"
    mkdir -p "$CURSOR_DIR"
    
    # Create minimal working configuration
    cat > "$CURSOR_SETTINGS" << 'EOF'
{
  "cursor.aiModel": "local",
  "cursor.localModel": "codellama:latest",
  "cursor.localAIServer": "http://localhost:11434",
  "cursor.useCloudAI": false,
  "cursor.requireInternet": false,
  "cursor.telemetry": false,
  "cursor.usageTracking": false,
  "ollama.serverUrl": "http://localhost:11434",
  "ollama.model": "codellama:latest"
}
EOF
    echo -e "${GREEN}✅ Created new configuration${NC}"
fi
echo ""

# Step 2: Ensure bridge is running
echo -e "${BLUE}Step 2: Starting Cursor bridge...${NC}"
cd "$(dirname "$0")"
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Bridge already running${NC}"
else
    echo "Starting bridge..."
    ./start_cursor_bridge.sh
    sleep 3
    if curl -s http://localhost:8080/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Bridge started${NC}"
    else
        echo -e "${RED}❌ Bridge failed to start${NC}"
        echo "Check logs: cursor-bridge/cursor_bridge.log"
    fi
fi
echo ""

# Step 3: Ensure Ollama is running
echo -e "${BLUE}Step 3: Checking Ollama...${NC}"
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Ollama is running${NC}"
else
    echo -e "${YELLOW}⚠️  Ollama not running${NC}"
    echo "Start it with: ollama serve"
    echo "Or in background: nohup ollama serve > /tmp/ollama.log 2>&1 &"
fi
echo ""

# Step 4: Verify configuration
echo -e "${BLUE}Step 4: Verifying configuration...${NC}"
if [ -f "$CURSOR_SETTINGS" ]; then
    if grep -q '"cursor.aiModel": "local"' "$CURSOR_SETTINGS"; then
        echo -e "${GREEN}✅ Local AI configured${NC}"
    else
        echo -e "${RED}❌ Local AI not configured${NC}"
    fi
    
    if grep -q '"cursor.useCloudAI": false' "$CURSOR_SETTINGS"; then
        echo -e "${GREEN}✅ Cloud AI disabled${NC}"
    else
        echo -e "${RED}❌ Cloud AI not disabled${NC}"
    fi
else
    echo -e "${RED}❌ Settings file not found${NC}"
fi
echo ""

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Emergency Fix Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Restart Cursor completely"
echo "2. Verify it's using local AI (check settings)"
echo "3. Test AI features (should use Ollama, no credits)"
echo ""
echo "If Cursor still doesn't work:"
echo "- Check logs: cursor-bridge/cursor_bridge.log"
echo "- Verify Ollama: curl http://localhost:11434/api/tags"
echo "- Check bridge: curl http://localhost:8080/health"
echo ""

