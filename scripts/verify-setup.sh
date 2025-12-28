#!/bin/bash
# VectorForge Environment Verification Script
# Verifies that the environment is correctly configured for standalone operation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     VectorForge Environment Verification                 ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

ERRORS=0
WARNINGS=0

# Check Node.js
echo "🔍 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    NODE_MAJOR=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo "✓ Node.js $NODE_VERSION (OK)"
    else
        echo "❌ Node.js version 18+ required. Found: $NODE_VERSION"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "❌ Node.js not found"
    ERRORS=$((ERRORS + 1))
fi

# Check npm
echo "🔍 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✓ npm $NPM_VERSION (OK)"
else
    echo "❌ npm not found"
    ERRORS=$((ERRORS + 1))
fi

# Check dependencies
echo "🔍 Checking dependencies..."
if [ -d "$PROJECT_DIR/node_modules" ]; then
    echo "✓ node_modules directory exists"
    if [ -f "$PROJECT_DIR/node_modules/.package-lock.json" ] || [ -f "$PROJECT_DIR/package-lock.json" ]; then
        echo "✓ Dependencies installed"
    else
        echo "⚠️  Dependencies may not be fully installed"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "⚠️  node_modules not found. Run: npm install"
    WARNINGS=$((WARNINGS + 1))
fi

# Check Xibalba service
echo "🔍 Checking Xibalba service..."
if [ -f "$PROJECT_DIR/services/xibalbaService.ts" ]; then
    echo "✓ Xibalba service file exists"
else
    echo "❌ Xibalba service file missing"
    ERRORS=$((ERRORS + 1))
fi

# Check configuration
echo "🔍 Checking configuration..."
if [ -f "$PROJECT_DIR/.env.local" ]; then
    echo "✓ .env.local file exists"
    if grep -q "VITE_XIBALBA" "$PROJECT_DIR/.env.local"; then
        echo "✓ Xibalba configuration found"
    else
        echo "⚠️  .env.local exists but missing Xibalba config"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "⚠️  .env.local not found. Run: ./scripts/setup-xibalba.sh"
    WARNINGS=$((WARNINGS + 1))
fi

# Check Xibalba directory
echo "🔍 Checking Xibalba infrastructure..."
if [ -d "$HOME/.xibalba" ]; then
    echo "✓ Xibalba directory found at $HOME/.xibalba"
    if [ -f "$HOME/.xibalba/master_registry.json" ]; then
        echo "✓ Xibalba registry found"
    fi
else
    echo "⚠️  Xibalba directory not found (may be OK if using remote MCP)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check MCP server (optional)
echo "🔍 Checking MCP server connection..."
if command -v curl &> /dev/null; then
    if curl -s --connect-timeout 2 "http://localhost:8000/health" > /dev/null 2>&1; then
        echo "✓ MCP server responding on port 8000"
    else
        echo "⚠️  MCP server not responding (may not be running)"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "⚠️  curl not available, skipping MCP check"
    WARNINGS=$((WARNINGS + 1))
fi

# Check build
echo "🔍 Checking build..."
if [ -d "$PROJECT_DIR/dist" ]; then
    echo "✓ Production build exists"
else
    echo "⚠️  No production build. Run: npm run build"
    WARNINGS=$((WARNINGS + 1))
fi

# Check scripts
echo "🔍 Checking installation scripts..."
if [ -f "$PROJECT_DIR/scripts/install.sh" ] && [ -x "$PROJECT_DIR/scripts/install.sh" ]; then
    echo "✓ Install script exists and is executable"
else
    echo "⚠️  Install script missing or not executable"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f "$PROJECT_DIR/scripts/setup-xibalba.sh" ] && [ -x "$PROJECT_DIR/scripts/setup-xibalba.sh" ]; then
    echo "✓ Xibalba setup script exists and is executable"
else
    echo "⚠️  Xibalba setup script missing or not executable"
    WARNINGS=$((WARNINGS + 1))
fi

# Summary
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "║              ✓ All Checks Passed!                       ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    echo "🚀 Ready to launch: npm run dev"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "║          ⚠️  Warnings Found ($WARNINGS)                  ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    echo "⚠️  Some warnings found, but system should work"
    echo "🚀 Ready to launch: npm run dev"
    exit 0
else
    echo "║          ❌ Errors Found ($ERRORS)                        ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    echo "❌ Please fix the errors above before proceeding"
    exit 1
fi

