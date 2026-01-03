#!/bin/bash
# Verify Cursor Local AI Bypass Configuration

echo "🔍 Verifying Cursor Local AI Bypass Configuration..."
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

CURSOR_SETTINGS="$HOME/.config/Cursor/User/settings.json"
WORKSPACE_SETTINGS=".vscode/settings.json"

# Check 1: Cursor User Settings
echo -e "${YELLOW}1. Checking Cursor User Settings...${NC}"
if [ -f "$CURSOR_SETTINGS" ]; then
    if command -v jq &> /dev/null; then
        AI_MODEL=$(jq -r '.["cursor.aiModel"] // "not set"' "$CURSOR_SETTINGS")
        LOCAL_MODEL=$(jq -r '.["cursor.localModel"] // "not set"' "$CURSOR_SETTINGS")
        LOCAL_SERVER=$(jq -r '.["cursor.localAIServer"] // "not set"' "$CURSOR_SETTINGS")
        USE_CLOUD=$(jq -r '.["cursor.useCloudAI"] // "not set"' "$CURSOR_SETTINGS")
        OLLAMA_URL=$(jq -r '.["ollama.serverUrl"] // "not set"' "$CURSOR_SETTINGS")
        OLLAMA_MODEL=$(jq -r '.["ollama.model"] // "not set"' "$CURSOR_SETTINGS")
        
        if [ "$AI_MODEL" = "local" ]; then
            echo -e "   ${GREEN}✅ cursor.aiModel: $AI_MODEL${NC}"
        else
            echo -e "   ${RED}❌ cursor.aiModel: $AI_MODEL (should be 'local')${NC}"
        fi
        
        if [ "$LOCAL_MODEL" != "not set" ]; then
            echo -e "   ${GREEN}✅ cursor.localModel: $LOCAL_MODEL${NC}"
        else
            echo -e "   ${RED}❌ cursor.localModel: not set${NC}"
        fi
        
        if [ "$LOCAL_SERVER" = "http://localhost:11434" ]; then
            echo -e "   ${GREEN}✅ cursor.localAIServer: $LOCAL_SERVER${NC}"
        else
            echo -e "   ${YELLOW}⚠️  cursor.localAIServer: $LOCAL_SERVER${NC}"
        fi
        
        if [ "$USE_CLOUD" = "false" ]; then
            echo -e "   ${GREEN}✅ cursor.useCloudAI: $USE_CLOUD${NC}"
        else
            echo -e "   ${RED}❌ cursor.useCloudAI: $USE_CLOUD (should be false)${NC}"
        fi
        
        if [ "$OLLAMA_URL" != "not set" ]; then
            echo -e "   ${GREEN}✅ ollama.serverUrl: $OLLAMA_URL${NC}"
        else
            echo -e "   ${YELLOW}⚠️  ollama.serverUrl: not set${NC}"
        fi
        
        if [ "$OLLAMA_MODEL" != "not set" ]; then
            echo -e "   ${GREEN}✅ ollama.model: $OLLAMA_MODEL${NC}"
        else
            echo -e "   ${YELLOW}⚠️  ollama.model: not set${NC}"
        fi
    else
        # Fallback without jq
        if grep -q '"cursor.aiModel": "local"' "$CURSOR_SETTINGS"; then
            echo -e "   ${GREEN}✅ cursor.aiModel: local${NC}"
        else
            echo -e "   ${RED}❌ cursor.aiModel: not set to 'local'${NC}"
        fi
        
        if grep -q '"cursor.useCloudAI": false' "$CURSOR_SETTINGS"; then
            echo -e "   ${GREEN}✅ cursor.useCloudAI: false${NC}"
        else
            echo -e "   ${RED}❌ cursor.useCloudAI: not set to false${NC}"
        fi
    fi
else
    echo -e "   ${RED}❌ Settings file not found: $CURSOR_SETTINGS${NC}"
fi
echo ""

# Check 2: Workspace Settings
echo -e "${YELLOW}2. Checking Workspace Settings...${NC}"
if [ -f "$WORKSPACE_SETTINGS" ]; then
    if command -v jq &> /dev/null; then
        WS_AI_MODEL=$(jq -r '.["cursor.aiModel"] // "not set"' "$WORKSPACE_SETTINGS")
        WS_USE_CLOUD=$(jq -r '.["cursor.useCloudAI"] // "not set"' "$WORKSPACE_SETTINGS")
        
        if [ "$WS_AI_MODEL" = "local" ]; then
            echo -e "   ${GREEN}✅ cursor.aiModel: $WS_AI_MODEL${NC}"
        else
            echo -e "   ${YELLOW}⚠️  cursor.aiModel: $WS_AI_MODEL (workspace override)${NC}"
        fi
        
        if [ "$WS_USE_CLOUD" = "false" ]; then
            echo -e "   ${GREEN}✅ cursor.useCloudAI: $WS_USE_CLOUD${NC}"
        else
            echo -e "   ${YELLOW}⚠️  cursor.useCloudAI: $WS_USE_CLOUD${NC}"
        fi
    else
        if grep -q '"cursor.aiModel": "local"' "$WORKSPACE_SETTINGS"; then
            echo -e "   ${GREEN}✅ Workspace settings configured for local AI${NC}"
        else
            echo -e "   ${YELLOW}⚠️  Workspace settings may not be configured${NC}"
        fi
    fi
else
    echo -e "   ${YELLOW}⚠️  Workspace settings not found (optional)${NC}"
fi
echo ""

# Check 3: Ollama Status
echo -e "${YELLOW}3. Checking Ollama Status...${NC}"
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Ollama is running on http://localhost:11434${NC}"
    MODELS=$(curl -s http://localhost:11434/api/tags 2>/dev/null | jq -r '.models[].name' 2>/dev/null | head -3 || echo "unknown")
    echo "   Available models:"
    echo "$MODELS" | sed 's/^/      - /'
else
    echo -e "   ${RED}❌ Ollama is not running${NC}"
    echo "   Start it with: ollama serve"
fi
echo ""

# Check 4: Cursor Process
echo -e "${YELLOW}4. Checking Cursor Process...${NC}"
if pgrep -f "Cursor" > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Cursor is running${NC}"
    CURSOR_PID=$(pgrep -f "Cursor" | head -1)
    echo "   PID: $CURSOR_PID"
else
    echo -e "   ${YELLOW}⚠️  Cursor process not found (may have different name)${NC}"
fi
echo ""

# Check 5: Network Connections
echo -e "${YELLOW}5. Checking Network Connections...${NC}"
if command -v ss &> /dev/null; then
    OLLAMA_CONN=$(ss -tuln 2>/dev/null | grep ":11434" || echo "")
    if [ -n "$OLLAMA_CONN" ]; then
        echo -e "   ${GREEN}✅ Port 11434 (Ollama) is listening${NC}"
    else
        echo -e "   ${YELLOW}⚠️  Port 11434 not found in listening ports${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  Cannot check network connections (ss not available)${NC}"
fi
echo ""

# Summary
echo -e "${YELLOW}Summary:${NC}"
echo ""

# Count checks
PASSED=0
FAILED=0
WARNINGS=0

if [ "$AI_MODEL" = "local" ] 2>/dev/null; then PASSED=$((PASSED+1)); else FAILED=$((FAILED+1)); fi
if [ "$USE_CLOUD" = "false" ] 2>/dev/null; then PASSED=$((PASSED+1)); else FAILED=$((FAILED+1)); fi
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then PASSED=$((PASSED+1)); else FAILED=$((FAILED+1)); fi

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All critical checks passed!${NC}"
    echo ""
    echo "Cursor is configured to use local AI (Ollama)."
    echo "No credits should be consumed when using AI features."
    echo ""
    echo "To verify in Cursor:"
    echo "1. Open DevTools (Help → Toggle Developer Tools)"
    echo "2. Go to Network tab"
    echo "3. Use Cursor AI features"
    echo "4. Should see requests to localhost:11434 (not Cursor cloud)"
else
    echo -e "${YELLOW}⚠️  Some checks failed. Review the output above.${NC}"
fi

echo ""

