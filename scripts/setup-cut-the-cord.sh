#!/bin/bash
# Setup "Cut the Cord" Features - Replicate Loki-PC Configuration
# This script configures VectorForge for offline/standalone operation

set -e

echo "🔌 Setting up 'Cut the Cord' features for VectorForge..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Configure internal.xi-io.com in hosts file
echo -e "${YELLOW}Step 1: Configuring internal.xi-io.com...${NC}"
if grep -q "internal.xi-io.com" /etc/hosts 2>/dev/null; then
    echo -e "${GREEN}✅ internal.xi-io.com already configured in /etc/hosts${NC}"
else
    echo "Adding internal.xi-io.com to /etc/hosts..."
    echo "127.0.0.1    internal.xi-io.com" | sudo tee -a /etc/hosts > /dev/null
    echo -e "${GREEN}✅ Added internal.xi-io.com to /etc/hosts${NC}"
fi
echo ""

# Step 2: Check/Install Ollama
echo -e "${YELLOW}Step 2: Checking Ollama installation...${NC}"
if command -v ollama &> /dev/null; then
    echo -e "${GREEN}✅ Ollama is installed${NC}"
    OLLAMA_VERSION=$(ollama --version 2>&1 | head -1 || echo "unknown")
    echo "   Version: $OLLAMA_VERSION"
    
    # Check if Ollama is running
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Ollama is running on http://localhost:11434${NC}"
        echo "   Available models:"
        ollama list 2>/dev/null | tail -n +2 | awk '{print "   - " $1}' || echo "   (No models installed)"
    else
        echo -e "${YELLOW}⚠️  Ollama is installed but not running${NC}"
        echo "   Start it with: ollama serve"
    fi
else
    echo -e "${YELLOW}⚠️  Ollama is not installed${NC}"
    echo "   Install with: curl -fsSL https://ollama.com/install.sh | sh"
    echo "   Or visit: https://ollama.com"
fi
echo ""

# Step 3: Check MCP Server
echo -e "${YELLOW}Step 3: Checking MCP server...${NC}"
if curl -s http://localhost:8000/health > /dev/null 2>&1 || curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MCP server is running on http://localhost:8000${NC}"
else
    echo -e "${YELLOW}⚠️  MCP server not detected on http://localhost:8000${NC}"
    echo "   This is optional - VectorForge will use Ollama directly if MCP is unavailable"
fi
echo ""

# Step 4: Create/Update .env.local
echo -e "${YELLOW}Step 4: Configuring environment variables...${NC}"
ENV_FILE=".env.local"

if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}✅ .env.local already exists${NC}"
    echo "   Current configuration:"
    grep -E "XIBALBA|MCP|OLLAMA|LOCAL" "$ENV_FILE" 2>/dev/null || echo "   (No Xibalba config found)"
else
    echo "Creating .env.local..."
    cat > "$ENV_FILE" << 'EOF'
# VectorForge - Cut the Cord Configuration
# Offline/Standalone Operation

# Xibalba MCP Server (Local)
VITE_XIBALBA_MCP_URL=http://localhost:8000
VITE_XIBALBA_API_KEY=
VITE_XIBALBA_MODEL=xibalba-local
VITE_XIBALBA_ENDPOINT=/api/v1/chat/completions

# Local AI (Ollama)
VITE_LOCAL_AI_URL=http://localhost:11434
VITE_LOCAL_AI_MODEL=codellama:latest

# Offline Mode
VITE_OFFLINE_MODE=true
VITE_STANDALONE_MODE=true
EOF
    echo -e "${GREEN}✅ Created .env.local with offline configuration${NC}"
fi
echo ""

# Step 5: Update xibalba.config.json
echo -e "${YELLOW}Step 5: Updating Xibalba configuration...${NC}"
CONFIG_FILE="config/xibalba.config.json"

if [ -f "$CONFIG_FILE" ]; then
    # Check if already configured for offline
    if grep -q '"requiresInternet": false' "$CONFIG_FILE"; then
        echo -e "${GREEN}✅ Configuration already set for offline mode${NC}"
    else
        echo "Updating configuration for offline mode..."
        # Use jq if available, otherwise use sed
        if command -v jq &> /dev/null; then
            jq '.installation.requiresInternet = false | .installation.localAIOnly = true' "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"
            echo -e "${GREEN}✅ Updated configuration for offline mode${NC}"
        else
            echo -e "${YELLOW}⚠️  jq not installed - manually update config/xibalba.config.json${NC}"
            echo "   Set: \"requiresInternet\": false"
            echo "   Set: \"localAIOnly\": true"
        fi
    fi
else
    echo -e "${RED}❌ Configuration file not found: $CONFIG_FILE${NC}"
fi
echo ""

# Step 6: Verify configuration
echo -e "${YELLOW}Step 6: Verifying configuration...${NC}"

# Check hosts file
if grep -q "internal.xi-io.com" /etc/hosts 2>/dev/null; then
    echo -e "${GREEN}✅ internal.xi-io.com configured${NC}"
else
    echo -e "${RED}❌ internal.xi-io.com not in /etc/hosts${NC}"
fi

# Check .env.local
if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}✅ .env.local exists${NC}"
else
    echo -e "${RED}❌ .env.local not found${NC}"
fi

# Check Ollama
if command -v ollama &> /dev/null; then
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Ollama is running${NC}"
    else
        echo -e "${YELLOW}⚠️  Ollama installed but not running${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Ollama not installed${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Cut the Cord setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Start Ollama (if not running): ollama serve"
echo "2. Pull a model: ollama pull codellama:latest"
echo "3. Start VectorForge: npm run dev"
echo "4. Access at: http://internal.xi-io.com:3000 (or http://localhost:3000)"
echo ""
echo "Configuration files:"
echo "  - .env.local (environment variables)"
echo "  - config/xibalba.config.json (Xibalba config)"
echo "  - /etc/hosts (internal.xi-io.com mapping)"
echo ""

