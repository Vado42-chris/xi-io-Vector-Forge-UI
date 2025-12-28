#!/bin/bash
# VectorForge USB Installation Script
# Installs VectorForge as a standalone, portable application

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
INSTALL_DIR="${1:-$HOME/VectorForge}"

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     VectorForge - Xibalba OS Installation               ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Found: $(node -v)"
    exit 1
fi

echo "✓ Node.js $(node -v) detected"

# Create installation directory
echo "📦 Installing to: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"

# Copy project files
echo "📋 Copying project files..."
cp -r "$PROJECT_DIR"/* "$INSTALL_DIR"/ 2>/dev/null || true
cp -r "$PROJECT_DIR"/.gitignore "$INSTALL_DIR"/ 2>/dev/null || true

# Remove node_modules if exists (will reinstall)
if [ -d "$INSTALL_DIR/node_modules" ]; then
    echo "🧹 Cleaning old dependencies..."
    rm -rf "$INSTALL_DIR/node_modules"
fi

# Install dependencies
echo "📥 Installing dependencies..."
cd "$INSTALL_DIR"
npm install --production=false

# Create environment file template
if [ ! -f "$INSTALL_DIR/.env.local" ]; then
    echo "📝 Creating environment configuration..."
    cat > "$INSTALL_DIR/.env.local" << EOF
# Xibalba AI Configuration
# Set these to connect to your local Xibalba AI server

VITE_XIBALBA_MCP_URL=http://localhost:8000
VITE_XIBALBA_API_KEY=
VITE_XIBALBA_MODEL=xibalba-local
VITE_XIBALBA_ENDPOINT=/api/v1/chat/completions

# If using MCP server, ensure it's running on the configured port
# Default: http://localhost:8000
EOF
    echo "✓ Created .env.local template"
fi

# Create launcher script
echo "🚀 Creating launcher scripts..."
cat > "$INSTALL_DIR/launch.sh" << 'LAUNCH_EOF'
#!/bin/bash
# VectorForge Launcher
cd "$(dirname "$0")"
npm run dev
LAUNCH_EOF

cat > "$INSTALL_DIR/launch.bat" << 'LAUNCH_EOF'
@echo off
cd /d "%~dp0"
npm run dev
LAUNCH_EOF

chmod +x "$INSTALL_DIR/launch.sh"
chmod +x "$INSTALL_DIR/launch.bat" 2>/dev/null || true

# Create desktop entry (Linux)
if [ -d "$HOME/.local/share/applications" ]; then
    echo "🖥️  Creating desktop entry..."
    cat > "$HOME/.local/share/applications/vectorforge.desktop" << DESKTOP_EOF
[Desktop Entry]
Name=VectorForge
Comment=Xibalba OS Vector Design Studio
Exec=$INSTALL_DIR/launch.sh
Icon=application-x-executable
Terminal=false
Type=Application
Categories=Graphics;Design;
DESKTOP_EOF
    chmod +x "$HOME/.local/share/applications/vectorforge.desktop"
fi

# Build production version
echo "🔨 Building production version..."
npm run build

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║              Installation Complete!                      ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Installed to: $INSTALL_DIR"
echo ""
echo "🚀 To run VectorForge:"
echo "   cd $INSTALL_DIR"
echo "   ./launch.sh"
echo ""
echo "📋 Next steps:"
echo "   1. Configure Xibalba AI in .env.local"
echo "   2. Ensure Xibalba MCP server is running"
echo "   3. Launch with: ./launch.sh"
echo ""
echo "💡 For USB deployment, copy the entire $INSTALL_DIR folder"
echo "   to your USB drive. It's fully portable!"
echo ""

