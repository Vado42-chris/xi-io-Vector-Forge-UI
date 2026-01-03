#!/bin/bash
# Configure Cursor IDE to use Local AI (Ollama) - Free of Usage Limits
# This makes Cursor work like a "dumb terminal" using local AI

set -e

echo "🔌 Configuring Cursor IDE for Local AI (Free of Usage Limits)..."
echo ""

CURSOR_SETTINGS="$HOME/.config/Cursor/User/settings.json"
BACKUP_FILE="${CURSOR_SETTINGS}.backup.$(date +%Y%m%d_%H%M%S)"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Step 1: Backup existing settings
echo -e "${YELLOW}Step 1: Backing up existing settings...${NC}"
if [ -f "$CURSOR_SETTINGS" ]; then
    cp "$CURSOR_SETTINGS" "$BACKUP_FILE"
    echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"
else
    echo "Creating new settings file..."
    mkdir -p "$(dirname "$CURSOR_SETTINGS")"
    echo "{}" > "$CURSOR_SETTINGS"
fi
echo ""

# Step 2: Check if Ollama is running
echo -e "${YELLOW}Step 2: Checking Ollama...${NC}"
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Ollama is running on http://localhost:11434${NC}"
    MODELS=$(curl -s http://localhost:11434/api/tags 2>/dev/null | jq -r '.models[].name' 2>/dev/null | head -1 || echo "codellama:latest")
    echo "   Available model: $MODELS"
    DEFAULT_MODEL="$MODELS"
else
    echo -e "${YELLOW}⚠️  Ollama not running${NC}"
    echo "   Start it with: ollama serve"
    DEFAULT_MODEL="codellama:latest"
fi
echo ""

# Step 3: Add local AI configuration to Cursor settings
echo -e "${YELLOW}Step 3: Configuring Cursor for local AI...${NC}"

# Check if jq is available for JSON manipulation
if command -v jq &> /dev/null; then
    # Use jq to merge settings
    jq '. + {
        "cursor.aiModel": "local",
        "cursor.localModel": "'"$DEFAULT_MODEL"'",
        "cursor.localAIServer": "http://localhost:11434",
        "cursor.useCloudAI": false,
        "cursor.requireInternet": false,
        "cursor.telemetry": false,
        "cursor.usageTracking": false,
        "ollama.serverUrl": "http://localhost:11434",
        "ollama.model": "'"$DEFAULT_MODEL"'",
        "continue.models": [
            {
                "title": "Local Ollama",
                "provider": "ollama",
                "model": "'"$DEFAULT_MODEL"'",
                "apiBase": "http://localhost:11434"
            }
        ]
    }' "$CURSOR_SETTINGS" > "${CURSOR_SETTINGS}.tmp" && mv "${CURSOR_SETTINGS}.tmp" "$CURSOR_SETTINGS"
    echo -e "${GREEN}✅ Cursor settings updated with local AI configuration${NC}"
else
    echo -e "${YELLOW}⚠️  jq not installed - manually adding configuration${NC}"
    echo ""
    echo "Add this to ~/.config/Cursor/User/settings.json:"
    echo ""
    cat << 'EOF'
{
  "cursor.aiModel": "local",
  "cursor.localModel": "codellama:latest",
  "cursor.localAIServer": "http://localhost:11434",
  "cursor.useCloudAI": false,
  "cursor.requireInternet": false,
  "ollama.serverUrl": "http://localhost:11434",
  "ollama.model": "codellama:latest"
}
EOF
    echo ""
    echo "⚠️  Please add these settings manually to your Cursor settings.json"
fi
echo ""

# Step 4: Check for Continue extension
echo -e "${YELLOW}Step 4: Checking for Continue extension...${NC}"
if [ -d "$HOME/.config/Cursor/extensions" ]; then
    CONTINUE_FOUND=$(find "$HOME/.config/Cursor/extensions" -maxdepth 1 -type d -iname "*continue*" 2>/dev/null | head -1)
    if [ -n "$CONTINUE_FOUND" ]; then
        echo -e "${GREEN}✅ Continue extension found${NC}"
    else
        echo -e "${YELLOW}⚠️  Continue extension not found${NC}"
        echo "   Install it in Cursor: Extensions → Search 'Continue' → Install"
        echo "   Or: cursor --install-extension continue.continue"
    fi
else
    echo -e "${YELLOW}⚠️  Extensions directory not found${NC}"
fi
echo ""

# Step 5: Create workspace settings (project-specific)
echo -e "${YELLOW}Step 5: Creating workspace settings...${NC}"
mkdir -p .vscode
WORKSPACE_SETTINGS=".vscode/settings.json"

if [ -f "$WORKSPACE_SETTINGS" ]; then
    echo "Workspace settings already exist"
    if command -v jq &> /dev/null; then
        jq '. + {
            "cursor.aiModel": "local",
            "cursor.localModel": "'"$DEFAULT_MODEL"'",
            "cursor.localAIServer": "http://localhost:11434",
            "cursor.useCloudAI": false
        }' "$WORKSPACE_SETTINGS" > "${WORKSPACE_SETTINGS}.tmp" && mv "${WORKSPACE_SETTINGS}.tmp" "$WORKSPACE_SETTINGS"
        echo -e "${GREEN}✅ Workspace settings updated${NC}"
    fi
else
    cat > "$WORKSPACE_SETTINGS" << EOF
{
  "cursor.aiModel": "local",
  "cursor.localModel": "$DEFAULT_MODEL",
  "cursor.localAIServer": "http://localhost:11434",
  "cursor.useCloudAI": false,
  "cursor.requireInternet": false
}
EOF
    echo -e "${GREEN}✅ Created workspace settings${NC}"
fi
echo ""

# Step 6: Verify configuration
echo -e "${YELLOW}Step 6: Verifying configuration...${NC}"

if [ -f "$CURSOR_SETTINGS" ]; then
    if grep -q "cursor.localAIServer" "$CURSOR_SETTINGS" 2>/dev/null || grep -q "ollama.serverUrl" "$CURSOR_SETTINGS" 2>/dev/null; then
        echo -e "${GREEN}✅ Cursor settings configured for local AI${NC}"
    else
        echo -e "${YELLOW}⚠️  Settings may need manual configuration${NC}"
    fi
else
    echo -e "${RED}❌ Settings file not found${NC}"
fi

if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Ollama is accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Ollama not running - start it with: ollama serve${NC}"
fi
echo ""

echo -e "${GREEN}🎉 Cursor local AI configuration complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Restart Cursor IDE"
echo "2. Verify Ollama is running: ollama serve"
echo "3. Test AI features in Cursor (should use local Ollama)"
echo "4. Check that no credits are consumed"
echo ""
echo "Configuration files:"
echo "  - ~/.config/Cursor/User/settings.json (global settings)"
echo "  - .vscode/settings.json (workspace settings)"
echo "  - Backup: $BACKUP_FILE"
echo ""

