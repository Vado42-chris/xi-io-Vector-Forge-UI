#!/bin/bash
# VectorForge Installer Builder
# Creates packaged installers for multiple platforms

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_DIR/dist-installer"
VERSION=$(node -p "require('$PROJECT_DIR/package.json').version || '1.0.0'")
APP_NAME="vectorforge"
FULL_NAME="VectorForge"

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     VectorForge Installer Builder                         ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📦 Building installer for: $FULL_NAME v$VERSION"
echo ""

# Clean previous builds
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Build the application first
echo "🔨 Building production application..."
cd "$PROJECT_DIR"
if ! npm run build; then
    echo "❌ Build failed"
    exit 1
fi

if [ ! -d "$PROJECT_DIR/dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✓ Production build complete"
echo ""

# Function definitions (must be before use)
create_linux_installer() {
    # Create self-extracting installer
    echo "📦 Creating self-extracting installer..."
    
    INSTALLER_SCRIPT="$BUILD_DIR/install-$APP_NAME.sh"
    
    cat > "$INSTALLER_SCRIPT" << 'INSTALLER_HEADER'
#!/bin/bash
# VectorForge Self-Extracting Installer
# This installer packages VectorForge for easy installation

set -e

INSTALL_DIR="${INSTALL_DIR:-$HOME/.local/share/vectorforge}"
BIN_DIR="${BIN_DIR:-$HOME/.local/bin}"
DESKTOP_DIR="${DESKTOP_DIR:-$HOME/.local/share/applications}"

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     VectorForge Installer                                ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Found: $(node -v)"
    exit 1
fi

echo "✓ Node.js $(node -v) detected"
echo ""

# Extract embedded files
TEMP_DIR=$(mktemp -d)
ARCHIVE_LINE=$(awk '/^__ARCHIVE_BELOW__/ {print NR + 1; exit 0; }' "$0")

echo "📦 Extracting files..."
tail -n +$ARCHIVE_LINE "$0" | tar -xz -C "$TEMP_DIR" 2>/dev/null || {
    echo "❌ Extraction failed"
    rm -rf "$TEMP_DIR"
    exit 1
}

# Create directories
mkdir -p "$INSTALL_DIR"
mkdir -p "$BIN_DIR"
mkdir -p "$DESKTOP_DIR"

# Copy files
echo "📋 Installing to: $INSTALL_DIR"
cp -r "$TEMP_DIR"/* "$INSTALL_DIR/"
rm -rf "$TEMP_DIR"

# Create launcher script
echo "🚀 Creating launcher..."
cat > "$BIN_DIR/vectorforge" << 'LAUNCHER_EOF'
#!/bin/bash
APP_DIR="$HOME/.local/share/vectorforge"
cd "$APP_DIR" || exit 1

# Check for serve
if ! command -v serve &> /dev/null; then
    echo "Installing serve (one-time setup)..."
    npm install -g serve
fi

# Start server
PORT=${PORT:-3000}
echo "Starting VectorForge on http://localhost:$PORT"
serve -s dist -l $PORT &
SERVER_PID=$!

# Wait and open browser
sleep 2
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:$PORT" 2>/dev/null &
elif command -v open &> /dev/null; then
    open "http://localhost:$PORT" 2>/dev/null &
fi

# Wait for server
wait $SERVER_PID
LAUNCHER_EOF

chmod +x "$BIN_DIR/vectorforge"

# Create desktop entry
echo "🖥️  Creating desktop entry..."
cat > "$DESKTOP_DIR/vectorforge.desktop" << DESKTOP_EOF
[Desktop Entry]
Name=VectorForge
Comment=Xibalba OS Vector Design Studio
Exec=vectorforge
Icon=application-x-executable
Terminal=false
Type=Application
Categories=Graphics;Design;Development;
MimeType=image/svg+xml;
DESKTOP_EOF

chmod +x "$DESKTOP_DIR/vectorforge.desktop"

# Update desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
fi

# Create Xibalba config if needed
if [ ! -f "$INSTALL_DIR/.env.local" ]; then
    echo "📝 Creating Xibalba configuration template..."
    cat > "$INSTALL_DIR/.env.local" << ENV_EOF
# Xibalba AI Configuration
VITE_XIBALBA_MCP_URL=http://localhost:8000
VITE_XIBALBA_API_KEY=
VITE_XIBALBA_MODEL=xibalba-local
VITE_XIBALBA_ENDPOINT=/api/v1/chat/completions
ENV_EOF
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║              Installation Complete!                       ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Installed to: $INSTALL_DIR"
echo "🚀 Launch with: vectorforge"
echo ""
echo "💡 Configure Xibalba AI:"
echo "   Edit: $INSTALL_DIR/.env.local"
echo ""

exit 0

__ARCHIVE_BELOW__
INSTALLER_HEADER

    # Create tarball of app files
    TEMP_PACKAGE=$(mktemp -d)
    mkdir -p "$TEMP_PACKAGE"
    
    cp -r "$PROJECT_DIR/dist" "$TEMP_PACKAGE/"
    cp -r "$PROJECT_DIR/config" "$TEMP_PACKAGE/" 2>/dev/null || true
    cp "$PROJECT_DIR/package.json" "$TEMP_PACKAGE/"
    cp "$PROJECT_DIR/README-USB-DEPLOYMENT.md" "$TEMP_PACKAGE/README.md" 2>/dev/null || true
    
    # Create tarball
    cd "$TEMP_PACKAGE"
    tar -czf /tmp/$APP_NAME.tar.gz .
    cd - > /dev/null
    rm -rf "$TEMP_PACKAGE"
    
    # Append archive to installer
    cat /tmp/$APP_NAME.tar.gz >> "$INSTALLER_SCRIPT"
    chmod +x "$INSTALLER_SCRIPT"
    rm -f /tmp/$APP_NAME.tar.gz
    
    echo "✓ Created: install-$APP_NAME.sh"
    
    # Create .deb package if dpkg-deb is available
    if command -v dpkg-deb &> /dev/null; then
        echo "📦 Creating .deb package..."
        create_deb_package
    else
        echo "⚠️  dpkg-deb not found, skipping .deb package"
    fi
    
    # Create portable tarball
    echo "📦 Creating portable tarball..."
    PORTABLE_DIR="$BUILD_DIR/${APP_NAME}-portable"
    mkdir -p "$PORTABLE_DIR"
    cp -r "$PROJECT_DIR/dist" "$PORTABLE_DIR/"
    cp -r "$PROJECT_DIR/config" "$PORTABLE_DIR/" 2>/dev/null || true
    cp "$PROJECT_DIR/package.json" "$PORTABLE_DIR/"
    cp "$PROJECT_DIR/scripts/install.sh" "$PORTABLE_DIR/" 2>/dev/null || true
    cp "$PROJECT_DIR/scripts/setup-xibalba.sh" "$PORTABLE_DIR/" 2>/dev/null || true
    
    cat > "$PORTABLE_DIR/launch.sh" << 'PORTABLE_LAUNCHER'
#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install Node.js 18+"
    exit 1
fi
if ! command -v serve &> /dev/null; then
    npm install -g serve
fi
serve -s dist -l 3000
PORTABLE_LAUNCHER

    chmod +x "$PORTABLE_DIR/launch.sh"
    
    cd "$BUILD_DIR"
    tar -czf "${APP_NAME}-portable-${VERSION}.tar.gz" "${APP_NAME}-portable"
    rm -rf "${APP_NAME}-portable"
    echo "✓ Created: ${APP_NAME}-portable-${VERSION}.tar.gz"
}

create_deb_package() {
    DEB_DIR="$BUILD_DIR/deb"
    rm -rf "$DEB_DIR"
    mkdir -p "$DEB_DIR/DEBIAN"
    mkdir -p "$DEB_DIR/usr/bin"
    mkdir -p "$DEB_DIR/usr/share/applications"
    mkdir -p "$DEB_DIR/usr/share/$APP_NAME"
    
    # Convert architecture for .deb
    DEB_ARCH=$ARCH
    case "$ARCH" in
        x86_64) DEB_ARCH="amd64" ;;
        aarch64) DEB_ARCH="arm64" ;;
        armv7l) DEB_ARCH="armhf" ;;
    esac
    
    # Copy application files
    cp -r "$PROJECT_DIR/dist"/* "$DEB_DIR/usr/share/$APP_NAME/"
    cp -r "$PROJECT_DIR/config" "$DEB_DIR/usr/share/$APP_NAME/" 2>/dev/null || true
    
    # Create launcher
    cat > "$DEB_DIR/usr/bin/$APP_NAME" << 'DEB_LAUNCHER'
#!/bin/bash
APP_DIR="/usr/share/vectorforge"
cd "$APP_DIR" || exit 1

if ! command -v serve &> /dev/null; then
    npm install -g serve
fi

PORT=${PORT:-3000}
serve -s dist -l $PORT &
SERVER_PID=$!

sleep 2
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:$PORT" 2>/dev/null &
fi

wait $SERVER_PID
DEB_LAUNCHER

    chmod +x "$DEB_DIR/usr/bin/$APP_NAME"
    
    # Create desktop entry
    cat > "$DEB_DIR/usr/share/applications/$APP_NAME.desktop" << DESKTOP_EOF
[Desktop Entry]
Name=VectorForge
Comment=Xibalba OS Vector Design Studio
Exec=$APP_NAME
Icon=application-x-executable
Terminal=false
Type=Application
Categories=Graphics;Design;Development;
MimeType=image/svg+xml;
DESKTOP_EOF

    # Create control file
    cat > "$DEB_DIR/DEBIAN/control" << CONTROL_EOF
Package: $APP_NAME
Version: $VERSION
Section: graphics
Priority: optional
Architecture: $DEB_ARCH
Maintainer: Xibalba OS <xibalba@localhost>
Description: Xibalba OS Vector Design Studio
 VectorForge - Professional vector design tool with local AI integration
Depends: nodejs (>= 18.0.0)
Installed-Size: $(du -sk "$DEB_DIR/usr" | cut -f1)
CONTROL_EOF

    # Create postinst script
    cat > "$DEB_DIR/DEBIAN/postinst" << POSTINST_EOF
#!/bin/bash
set -e
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database /usr/share/applications 2>/dev/null || true
fi
POSTINST_EOF

    chmod +x "$DEB_DIR/DEBIAN/postinst"
    
    # Build .deb
    dpkg-deb --build "$DEB_DIR" "$BUILD_DIR/${APP_NAME}_${VERSION}_${DEB_ARCH}.deb"
    rm -rf "$DEB_DIR"
    echo "✓ Created: ${APP_NAME}_${VERSION}_${ARCH}.deb"
}

create_macos_installer() {
    echo "📦 macOS installer creation not yet implemented"
    echo "   Creating generic installer instead..."
    create_generic_installer
}

create_generic_installer() {
    # Create portable package
    PORTABLE_DIR="$BUILD_DIR/${APP_NAME}-portable"
    mkdir -p "$PORTABLE_DIR"
    
    echo "📋 Creating portable package..."
    cp -r "$PROJECT_DIR/dist" "$PORTABLE_DIR/"
    cp -r "$PROJECT_DIR/config" "$PORTABLE_DIR/" 2>/dev/null || true
    cp "$PROJECT_DIR/package.json" "$PORTABLE_DIR/"
    cp "$PROJECT_DIR/scripts/install.sh" "$PORTABLE_DIR/" 2>/dev/null || true
    cp "$PROJECT_DIR/scripts/setup-xibalba.sh" "$PORTABLE_DIR/" 2>/dev/null || true
    cp "$PROJECT_DIR/README-USB-DEPLOYMENT.md" "$PORTABLE_DIR/README.md" 2>/dev/null || true
    
    # Create launcher
    cat > "$PORTABLE_DIR/launch.sh" << 'LAUNCHER_EOF'
#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install Node.js 18+"
    exit 1
fi
if ! command -v serve &> /dev/null; then
    npm install -g serve
fi
serve -s dist -l 3000
LAUNCHER_EOF

    cat > "$PORTABLE_DIR/launch.bat" << 'BAT_LAUNCHER'
@echo off
cd /d "%~dp0"
if not exist node.exe (
    echo Node.js not found. Please install Node.js 18+
    pause
    exit 1
)
npx serve -s dist -l 3000
BAT_LAUNCHER

    chmod +x "$PORTABLE_DIR/launch.sh"
    
    # Create tarball
    cd "$BUILD_DIR"
    tar -czf "${APP_NAME}-portable-${VERSION}.tar.gz" "${APP_NAME}-portable"
    echo "✓ Created: ${APP_NAME}-portable-${VERSION}.tar.gz"
}

# Detect platform
PLATFORM=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
# Convert architecture for .deb packages
DEB_ARCH=$ARCH
case "$ARCH" in
    x86_64) DEB_ARCH="amd64" ;;
    aarch64) DEB_ARCH="arm64" ;;
    armv7l) DEB_ARCH="armhf" ;;
esac

echo "🖥️  Platform: $PLATFORM ($ARCH)"
echo ""

# Create installer based on platform
case "$PLATFORM" in
    linux*)
        echo "📦 Creating Linux installer..."
        create_linux_installer
        ;;
    darwin*)
        echo "📦 Creating macOS installer..."
        create_macos_installer
        ;;
    *)
        echo "⚠️  Platform $PLATFORM not fully supported"
        echo "📦 Creating generic installer..."
        create_generic_installer
        ;;
esac

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║              Installer Build Complete!                    ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Installer location: $BUILD_DIR"
ls -lh "$BUILD_DIR" | tail -n +2
echo ""

create_linux_installer() {
    # Create self-extracting installer
    echo "📦 Creating self-extracting installer..."
    
    INSTALLER_SCRIPT="$BUILD_DIR/install-$APP_NAME.sh"
    
    cat > "$INSTALLER_SCRIPT" << 'INSTALLER_HEADER'
#!/bin/bash
# VectorForge Self-Extracting Installer
# This installer packages VectorForge for easy installation

set -e

INSTALL_DIR="${INSTALL_DIR:-$HOME/.local/share/vectorforge}"
BIN_DIR="${BIN_DIR:-$HOME/.local/bin}"
DESKTOP_DIR="${DESKTOP_DIR:-$HOME/.local/share/applications}"

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     VectorForge Installer                                ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Found: $(node -v)"
    exit 1
fi

echo "✓ Node.js $(node -v) detected"
echo ""

# Extract embedded files
TEMP_DIR=$(mktemp -d)
ARCHIVE_LINE=$(awk '/^__ARCHIVE_BELOW__/ {print NR + 1; exit 0; }' "$0")

echo "📦 Extracting files..."
tail -n +$ARCHIVE_LINE "$0" | tar -xz -C "$TEMP_DIR" 2>/dev/null || {
    echo "❌ Extraction failed"
    rm -rf "$TEMP_DIR"
    exit 1
}

# Create directories
mkdir -p "$INSTALL_DIR"
mkdir -p "$BIN_DIR"
mkdir -p "$DESKTOP_DIR"

# Copy files
echo "📋 Installing to: $INSTALL_DIR"
cp -r "$TEMP_DIR"/* "$INSTALL_DIR/"
rm -rf "$TEMP_DIR"

# Create launcher script
echo "🚀 Creating launcher..."
cat > "$BIN_DIR/$APP_NAME" << 'LAUNCHER_EOF'
#!/bin/bash
APP_DIR="$HOME/.local/share/vectorforge"
cd "$APP_DIR" || exit 1

# Check for serve
if ! command -v serve &> /dev/null; then
    echo "Installing serve (one-time setup)..."
    npm install -g serve
fi

# Start server
PORT=${PORT:-3000}
echo "Starting VectorForge on http://localhost:$PORT"
serve -s dist -l $PORT &
SERVER_PID=$!

# Wait and open browser
sleep 2
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:$PORT" 2>/dev/null &
elif command -v open &> /dev/null; then
    open "http://localhost:$PORT" 2>/dev/null &
fi

# Wait for server
wait $SERVER_PID
LAUNCHER_EOF

chmod +x "$BIN_DIR/$APP_NAME"

# Create desktop entry
echo "🖥️  Creating desktop entry..."
cat > "$DESKTOP_DIR/$APP_NAME.desktop" << DESKTOP_EOF
[Desktop Entry]
Name=VectorForge
Comment=Xibalba OS Vector Design Studio
Exec=$APP_NAME
Icon=application-x-executable
Terminal=false
Type=Application
Categories=Graphics;Design;Development;
MimeType=image/svg+xml;
DESKTOP_EOF

chmod +x "$DESKTOP_DIR/$APP_NAME.desktop"

# Update desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
fi

# Create Xibalba config if needed
if [ ! -f "$INSTALL_DIR/.env.local" ]; then
    echo "📝 Creating Xibalba configuration template..."
    cat > "$INSTALL_DIR/.env.local" << ENV_EOF
# Xibalba AI Configuration
VITE_XIBALBA_MCP_URL=http://localhost:8000
VITE_XIBALBA_API_KEY=
VITE_XIBALBA_MODEL=xibalba-local
VITE_XIBALBA_ENDPOINT=/api/v1/chat/completions
ENV_EOF
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║              Installation Complete!                       ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Installed to: $INSTALL_DIR"
echo "🚀 Launch with: $APP_NAME"
echo ""
echo "💡 Configure Xibalba AI:"
echo "   Edit: $INSTALL_DIR/.env.local"
echo ""

exit 0

__ARCHIVE_BELOW__
INSTALLER_HEADER

    # Replace APP_NAME variable in the script
    sed -i "s/\$APP_NAME/$APP_NAME/g" "$INSTALLER_SCRIPT"
    
    # Create tarball of app files
    TEMP_PACKAGE=$(mktemp -d)
    mkdir -p "$TEMP_PACKAGE"
    
    cp -r "$PROJECT_DIR/dist" "$TEMP_PACKAGE/"
    cp -r "$PROJECT_DIR/config" "$TEMP_PACKAGE/" 2>/dev/null || true
    cp "$PROJECT_DIR/package.json" "$TEMP_PACKAGE/"
    cp "$PROJECT_DIR/README-USB-DEPLOYMENT.md" "$TEMP_PACKAGE/README.md" 2>/dev/null || true
    
    # Create tarball
    cd "$TEMP_PACKAGE"
    tar -czf /tmp/$APP_NAME.tar.gz .
    cd - > /dev/null
    rm -rf "$TEMP_PACKAGE"
    
    # Append archive to installer
    cat /tmp/$APP_NAME.tar.gz >> "$INSTALLER_SCRIPT"
    chmod +x "$INSTALLER_SCRIPT"
    rm -f /tmp/$APP_NAME.tar.gz
    
    echo "✓ Created: install-$APP_NAME.sh"
    
    # Create .deb package if dpkg-deb is available
    if command -v dpkg-deb &> /dev/null; then
        echo "📦 Creating .deb package..."
        create_deb_package
    else
        echo "⚠️  dpkg-deb not found, skipping .deb package"
    fi
    
    # Create portable tarball
    echo "📦 Creating portable tarball..."
    PORTABLE_DIR="$BUILD_DIR/${APP_NAME}-portable"
    mkdir -p "$PORTABLE_DIR"
    cp -r "$PROJECT_DIR/dist" "$PORTABLE_DIR/"
    cp -r "$PROJECT_DIR/config" "$PORTABLE_DIR/" 2>/dev/null || true
    cp "$PROJECT_DIR/package.json" "$PORTABLE_DIR/"
    cp "$PROJECT_DIR/scripts/install.sh" "$PORTABLE_DIR/" 2>/dev/null || true
    cp "$PROJECT_DIR/scripts/setup-xibalba.sh" "$PORTABLE_DIR/" 2>/dev/null || true
    
    cat > "$PORTABLE_DIR/launch.sh" << 'PORTABLE_LAUNCHER'
#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install Node.js 18+"
    exit 1
fi
if ! command -v serve &> /dev/null; then
    npm install -g serve
fi
serve -s dist -l 3000
PORTABLE_LAUNCHER

    chmod +x "$PORTABLE_DIR/launch.sh"
    
    cd "$BUILD_DIR"
    tar -czf "${APP_NAME}-portable-${VERSION}.tar.gz" "${APP_NAME}-portable"
    rm -rf "${APP_NAME}-portable"
    echo "✓ Created: ${APP_NAME}-portable-${VERSION}.tar.gz"
}

create_deb_package() {
    DEB_DIR="$BUILD_DIR/deb"
    rm -rf "$DEB_DIR"
    mkdir -p "$DEB_DIR/DEBIAN"
    mkdir -p "$DEB_DIR/usr/bin"
    mkdir -p "$DEB_DIR/usr/share/applications"
    mkdir -p "$DEB_DIR/usr/share/$APP_NAME"
    
    # Convert architecture for .deb
    DEB_ARCH=$ARCH
    case "$ARCH" in
        x86_64) DEB_ARCH="amd64" ;;
        aarch64) DEB_ARCH="arm64" ;;
        armv7l) DEB_ARCH="armhf" ;;
    esac
    
    # Copy application files
    cp -r "$PROJECT_DIR/dist"/* "$DEB_DIR/usr/share/$APP_NAME/"
    cp -r "$PROJECT_DIR/config" "$DEB_DIR/usr/share/$APP_NAME/" 2>/dev/null || true
    
    # Create launcher
    cat > "$DEB_DIR/usr/bin/$APP_NAME" << 'DEB_LAUNCHER'
#!/bin/bash
APP_DIR="/usr/share/vectorforge"
cd "$APP_DIR" || exit 1

if ! command -v serve &> /dev/null; then
    npm install -g serve
fi

PORT=${PORT:-3000}
serve -s dist -l $PORT &
SERVER_PID=$!

sleep 2
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:$PORT" 2>/dev/null &
fi

wait $SERVER_PID
DEB_LAUNCHER

    chmod +x "$DEB_DIR/usr/bin/$APP_NAME"
    
    # Create desktop entry
    cat > "$DEB_DIR/usr/share/applications/$APP_NAME.desktop" << DESKTOP_EOF
[Desktop Entry]
Name=VectorForge
Comment=Xibalba OS Vector Design Studio
Exec=$APP_NAME
Icon=application-x-executable
Terminal=false
Type=Application
Categories=Graphics;Design;Development;
MimeType=image/svg+xml;
DESKTOP_EOF

    # Create control file
    cat > "$DEB_DIR/DEBIAN/control" << CONTROL_EOF
Package: $APP_NAME
Version: $VERSION
Section: graphics
Priority: optional
Architecture: $DEB_ARCH
Maintainer: Xibalba OS <xibalba@localhost>
Description: Xibalba OS Vector Design Studio
 VectorForge - Professional vector design tool with local AI integration
Depends: nodejs (>= 18.0.0)
Installed-Size: $(du -sk "$DEB_DIR/usr" | cut -f1)
CONTROL_EOF

    # Create postinst script
    cat > "$DEB_DIR/DEBIAN/postinst" << POSTINST_EOF
#!/bin/bash
set -e
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database /usr/share/applications 2>/dev/null || true
fi
POSTINST_EOF

    chmod +x "$DEB_DIR/DEBIAN/postinst"
    
    # Build .deb
    dpkg-deb --build "$DEB_DIR" "$BUILD_DIR/${APP_NAME}_${VERSION}_${DEB_ARCH}.deb"
    rm -rf "$DEB_DIR"
    echo "✓ Created: ${APP_NAME}_${VERSION}_${ARCH}.deb"
}

create_macos_installer() {
    echo "📦 macOS installer creation not yet implemented"
    echo "   Creating generic installer instead..."
    create_generic_installer
}

create_generic_installer() {
    # Create portable package
    PORTABLE_DIR="$BUILD_DIR/${APP_NAME}-portable"
    mkdir -p "$PORTABLE_DIR"
    
    echo "📋 Creating portable package..."
    cp -r "$PROJECT_DIR/dist" "$PORTABLE_DIR/"
    cp -r "$PROJECT_DIR/config" "$PORTABLE_DIR/" 2>/dev/null || true
    cp "$PROJECT_DIR/package.json" "$PORTABLE_DIR/"
    cp "$PROJECT_DIR/scripts/install.sh" "$PORTABLE_DIR/" 2>/dev/null || true
    cp "$PROJECT_DIR/scripts/setup-xibalba.sh" "$PORTABLE_DIR/" 2>/dev/null || true
    cp "$PROJECT_DIR/README-USB-DEPLOYMENT.md" "$PORTABLE_DIR/README.md" 2>/dev/null || true
    
    # Create launcher
    cat > "$PORTABLE_DIR/launch.sh" << 'LAUNCHER_EOF'
#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install Node.js 18+"
    exit 1
fi
if ! command -v serve &> /dev/null; then
    npm install -g serve
fi
serve -s dist -l 3000
LAUNCHER_EOF

    cat > "$PORTABLE_DIR/launch.bat" << 'BAT_LAUNCHER'
@echo off
cd /d "%~dp0"
if not exist node.exe (
    echo Node.js not found. Please install Node.js 18+
    pause
    exit 1
)
npx serve -s dist -l 3000
BAT_LAUNCHER

    chmod +x "$PORTABLE_DIR/launch.sh"
    
    # Create tarball
    cd "$BUILD_DIR"
    tar -czf "${APP_NAME}-portable-${VERSION}.tar.gz" "${APP_NAME}-portable"
    echo "✓ Created: ${APP_NAME}-portable-${VERSION}.tar.gz"
}
