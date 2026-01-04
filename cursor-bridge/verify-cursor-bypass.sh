#!/bin/bash
# Verify Cursor Bypass Status - Standalone script (works without Cursor)
# Can be run from terminal, Zed, or any environment

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔍 Verifying Cursor Bypass Status..."
echo ""

CURSOR_SETTINGS="$HOME/.config/Cursor/User/settings.json"
BRIDGE_URL="http://localhost:8080"

# Check 1: Cursor Settings
echo -e "${BLUE}1. Cursor Settings${NC}"
if [ -f "$CURSOR_SETTINGS" ]; then
    if grep -q '"cursor.aiModel": "local"' "$CURSOR_SETTINGS" 2>/dev/null; then
        echo -e "   ${GREEN}✅ cursor.aiModel: local${NC}"
    else
        echo -e "   ${RED}❌ cursor.aiModel: not set to 'local'${NC}"
    fi
    
    if grep -q '"cursor.useCloudAI": false' "$CURSOR_SETTINGS" 2>/dev/null; then
        echo -e "   ${GREEN}✅ cursor.useCloudAI: false${NC}"
    else
        echo -e "   ${RED}❌ cursor.useCloudAI: not set to false${NC}"
    fi
else
    echo -e "   ${RED}❌ Settings file not found${NC}"
fi
echo ""

# Check 2: Bridge Status
echo -e "${BLUE}2. Cursor Bridge${NC}"
if curl -s "$BRIDGE_URL/health" > /dev/null 2>&1; then
    BRIDGE_STATUS=$(curl -s "$BRIDGE_URL/health" | python3 -c "import sys, json; print(json.load(sys.stdin).get('status', 'unknown'))" 2>/dev/null || echo "healthy")
    echo -e "   ${GREEN}✅ Bridge: Running (port 8080)${NC}"
    echo -e "   ${GREEN}   Status: $BRIDGE_STATUS${NC}"
else
    echo -e "   ${RED}❌ Bridge: Not running${NC}"
    echo -e "   ${YELLOW}   Start with: cd cursor-bridge && ./start_cursor_bridge.sh${NC}"
fi
echo ""

# Check 3: Ollama Status
echo -e "${BLUE}3. Ollama (Local AI)${NC}"
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Ollama: Running (port 11434)${NC}"
    MODELS=$(curl -s http://localhost:11434/api/tags 2>/dev/null | python3 -c "import sys, json; models = json.load(sys.stdin).get('models', []); print(', '.join([m.get('name', '') for m in models[:3]]))" 2>/dev/null || echo "unknown")
    echo -e "   ${GREEN}   Models: $MODELS${NC}"
else
    echo -e "   ${RED}❌ Ollama: Not running${NC}"
    echo -e "   ${YELLOW}   Start with: ollama serve${NC}"
fi
echo ""

# Check 4: Bridge Logs (Cursor requests)
echo -e "${BLUE}4. Bridge Activity${NC}"
if [ -f "cursor-bridge/cursor_bridge.log" ]; then
    CURSOR_REQUESTS=$(grep -c "CURSOR REQUEST DETECTED" cursor-bridge/cursor_bridge.log 2>/dev/null || echo "0")
    if [ "$CURSOR_REQUESTS" -gt 0 ]; then
        echo -e "   ${GREEN}✅ Cursor requests detected: $CURSOR_REQUESTS${NC}"
    else
        echo -e "   ${YELLOW}⚠️  No Cursor requests in logs yet${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  Bridge log not found${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}Summary:${NC}"
echo ""
echo "To view bridge status: curl $BRIDGE_URL/status"
echo "To view bridge logs: tail -f cursor-bridge/cursor_bridge.log"
echo ""

