#!/bin/bash
# Comprehensive documentation script for Loki-PC framework
# Run this on Loki-PC: /home/chrishallberg/drives/hdd1/Xibalba-Projects/Xibalba-Framework-V61/xibalba-intranet/

set -e

FRAMEWORK_DIR="/home/chrishallberg/drives/hdd1/Xibalba-Projects/Xibalba-Framework-V61/xibalba-intranet"
OUTPUT_DIR="$HOME/loki-framework-docs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🔍 Loki-PC Framework Documentation Script"
echo "=========================================="
echo "Framework: $FRAMEWORK_DIR"
echo "Output: $OUTPUT_DIR"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

cd "$FRAMEWORK_DIR" || {
    echo "❌ Error: Cannot access framework directory: $FRAMEWORK_DIR"
    exit 1
}

echo "✅ Framework directory found"
echo ""

# 1. Directory Structure
echo "📁 Documenting directory structure..."
{
    echo "# Loki-PC Framework Structure"
    echo "Generated: $(date)"
    echo "Framework Path: $FRAMEWORK_DIR"
    echo ""
    echo "## Directory Tree (depth 4)"
    echo '```'
    find . -type d -maxdepth 4 | sort
    echo '```'
    echo ""
    echo "## File Count by Type"
    echo '```'
    echo "TypeScript files: $(find . -name "*.ts" -o -name "*.tsx" | wc -l)"
    echo "JavaScript files: $(find . -name "*.js" -o -name "*.jsx" | wc -l)"
    echo "JSON files: $(find . -name "*.json" | wc -l)"
    echo "CSS files: $(find . -name "*.css" | wc -l)"
    echo "Markdown files: $(find . -name "*.md" | wc -l)"
    echo "Python files: $(find . -name "*.py" | wc -l)"
    echo '```'
} > "$OUTPUT_DIR/01_directory_structure.md"

# 2. Key Files
echo "📄 Documenting key files..."
{
    echo "# Key Files"
    echo ""
    echo "## Root Directory Files"
    echo '```'
    ls -lah | grep -v "^d"
    echo '```'
    echo ""
    echo "## package.json"
    echo '```json'
    cat package.json 2>/dev/null || echo "No package.json found"
    echo '```'
    echo ""
    echo "## README.md"
    echo '```'
    head -100 README.md 2>/dev/null || echo "No README.md found"
    echo '```'
    echo ""
    echo "## .env.local (sanitized)"
    echo '```'
    cat .env.local 2>/dev/null | sed 's/=.*/=***/' || echo "No .env.local found"
    echo '```'
} > "$OUTPUT_DIR/02_key_files.md"

# 3. Core Directory
echo "🔧 Documenting core directory..."
{
    echo "# Core Directory Analysis"
    echo ""
    if [ -d "core" ]; then
        echo "## Core Directory Structure"
        echo '```'
        find core -type f | head -50
        echo '```'
        echo ""
        echo "## Core Files List"
        echo '```'
        ls -lah core/
        echo '```'
        echo ""
        echo "## Core Managers"
        echo '```'
        find core -name "*manager*" -o -name "*Manager*" | head -20
        echo '```'
    else
        echo "No core directory found"
    fi
} > "$OUTPUT_DIR/03_core_directory.md"

# 4. Services
echo "⚙️ Documenting services..."
{
    echo "# Services Analysis"
    echo ""
    if [ -d "services" ]; then
        echo "## Services List"
        echo '```'
        ls -lah services/
        echo '```'
        echo ""
        echo "## Service Files"
        echo '```'
        find services -name "*.ts" -o -name "*.js" | sort
        echo '```'
    else
        echo "No services directory found"
        echo ""
        echo "Searching for service files..."
        find . -path "*/services/*" -name "*.ts" -o -path "*/services/*" -name "*.js" | head -30
    fi
} > "$OUTPUT_DIR/04_services.md"

# 5. Components
echo "🧩 Documenting components..."
{
    echo "# Components Analysis"
    echo ""
    if [ -d "components" ]; then
        echo "## Components List"
        echo '```'
        ls -lah components/
        echo '```'
        echo ""
        echo "## Component Files"
        echo '```'
        find components -name "*.tsx" -o -name "*.jsx" | sort
        echo '```'
    else
        echo "No components directory found"
        echo ""
        echo "Searching for component files..."
        find . -path "*/components/*" -name "*.tsx" -o -path "*/components/*" -name "*.jsx" | head -30
    fi
} > "$OUTPUT_DIR/05_components.md"

# 6. Static & Data Directories
echo "📦 Documenting static and data directories..."
{
    echo "# Static & Data Directories"
    echo ""
    echo "## Static Directory"
    if [ -d "static" ]; then
        echo '```'
        ls -lah static/ | head -30
        echo '```'
        echo ""
        echo "## Static Files Count"
        echo "- Total files: $(find static -type f | wc -l)"
    else
        echo "No static directory found"
    fi
    echo ""
    echo "## Data Directory"
    if [ -d "data" ]; then
        echo '```'
        ls -lah data/ | head -30
        echo '```'
        echo ""
        echo "## Data Files"
        find data -type f | head -30
    else
        echo "No data directory found"
    fi
} > "$OUTPUT_DIR/06_static_data.md"

# 7. Cursor Fix / Local AI
echo "🤖 Documenting cursor fix and local AI..."
{
    echo "# Cursor Fix & Local AI Implementation"
    echo ""
    echo "## Files Related to Cursor/Local AI"
    echo '```'
    find . -name "*cursor*" -o -name "*local*ai*" -o -name "*ollama*" | head -20
    echo '```'
    echo ""
    echo "## Code References"
    echo "### Cursor"
    echo '```'
    grep -r "cursor" . --include="*.ts" --include="*.tsx" --include="*.js" -i | head -20
    echo '```'
    echo ""
    echo "### Local AI / Ollama"
    echo '```'
    grep -r "local.*ai\|ollama\|cut.*cord" . --include="*.ts" --include="*.tsx" --include="*.js" -i | head -20
    echo '```'
    echo ""
    echo "### Configuration"
    echo '```'
    find . -name "*.config.*" -o -name "*.json" | xargs grep -l "cursor\|ollama\|local.*ai" 2>/dev/null | head -10
    echo '```'
} > "$OUTPUT_DIR/07_cursor_local_ai.md"

# 8. Server Management
echo "🖥️ Documenting server management..."
{
    echo "# Server Management Module"
    echo ""
    echo "## Server Management Files"
    echo '```'
    find . -name "*server*" -o -name "*infrastructure*" -o -name "*virtualmin*" | head -20
    echo '```'
    echo ""
    echo "## Code References"
    echo '```'
    grep -r "server.*management\|virtualmin\|nginx\|domain.*management" . --include="*.ts" --include="*.tsx" --include="*.js" -i | head -30
    echo '```'
} > "$OUTPUT_DIR/08_server_management.md"

# 9. dotProject Integration
echo "📊 Documenting dotProject integration..."
{
    echo "# dotProject Integration"
    echo ""
    echo "## dotProject Files"
    echo '```'
    find . -name "*dotproject*" -o -name "*dotProject*" -o -name "*dot-project*" | head -20
    echo '```'
    echo ""
    echo "## Code References"
    echo '```'
    grep -r "dotproject\|dotProject" . --include="*.ts" --include="*.tsx" --include="*.js" -i | head -30
    echo '```'
} > "$OUTPUT_DIR/09_dotproject.md"

# 10. Module System
echo "🔌 Documenting module system..."
{
    echo "# Module System"
    echo ""
    echo "## Module Files"
    echo '```'
    find . -name "*module*" -o -name "*loader*" | head -20
    echo '```'
    echo ""
    echo "## Code References"
    echo '```'
    grep -r "ModuleLoader\|module.*system\|loadModule\|registerModule" . --include="*.ts" --include="*.tsx" --include="*.js" -i | head -30
    echo '```'
} > "$OUTPUT_DIR/10_module_system.md"

# 11. Role-Based Provisioning
echo "👥 Documenting role-based provisioning..."
{
    echo "# Role-Based Provisioning"
    echo ""
    echo "## Role Files"
    echo '```'
    find . -name "*role*" -o -name "*permission*" -o -name "*provision*" | head -20
    echo '```'
    echo ""
    echo "## Code References"
    echo '```'
    grep -r "role.*provision\|RoleProvider\|permission\|role.*based" . --include="*.ts" --include="*.tsx" --include="*.js" -i | head -30
    echo '```'
} > "$OUTPUT_DIR/11_role_provisioning.md"

# 12. Configuration Files
echo "⚙️ Documenting configuration files..."
{
    echo "# Configuration Files"
    echo ""
    echo "## Config Files"
    echo '```'
    find . -name "*.config.*" -o -name "config.*" | head -30
    echo '```'
    echo ""
    echo "## JSON Config Files"
    echo '```'
    find . -name "*.json" | grep -E "(config|settings|config)" | head -20
    echo '```'
    echo ""
    echo "## xibalba.config.json"
    if [ -f "config/xibalba.config.json" ]; then
        echo '```json'
        cat config/xibalba.config.json
        echo '```'
    else
        echo "Not found in config/, searching..."
        find . -name "xibalba.config.json" -exec cat {} \;
    fi
} > "$OUTPUT_DIR/12_configuration.md"

# 13. Entry Points
echo "🚪 Documenting entry points..."
{
    echo "# Entry Points"
    echo ""
    echo "## Main Entry Files"
    echo '```'
    find . -maxdepth 2 -name "index.*" -o -name "main.*" -o -name "app.*" -o -name "server.*" | head -20
    echo '```'
    echo ""
    echo "## index.ts/tsx"
    if [ -f "index.ts" ]; then
        echo '```typescript'
        head -50 index.ts
        echo '```'
    elif [ -f "index.tsx" ]; then
        echo '```typescript'
        head -50 index.tsx
        echo '```'
    fi
    echo ""
    echo "## app.tsx"
    if [ -f "app.tsx" ]; then
        echo '```typescript'
        head -50 app.tsx
        echo '```'
    fi
    echo ""
    echo "## server.js/ts"
    if [ -f "server.js" ]; then
        echo '```javascript'
        head -50 server.js
        echo '```'
    elif [ -f "server.ts" ]; then
        echo '```typescript'
        head -50 server.ts
        echo '```'
    fi
} > "$OUTPUT_DIR/13_entry_points.md"

# 14. Build System
echo "🔨 Documenting build system..."
{
    echo "# Build System"
    echo ""
    echo "## Build Configuration Files"
    echo '```'
    find . -maxdepth 2 -name "vite.config.*" -o -name "webpack.config.*" -o -name "tsconfig.*" -o -name ".eslintrc.*" | head -20
    echo '```'
    echo ""
    echo "## package.json Scripts"
    if [ -f "package.json" ]; then
        echo '```json'
        cat package.json | grep -A 20 '"scripts"'
        echo '```'
    fi
} > "$OUTPUT_DIR/14_build_system.md"

# 15. Summary
echo "📋 Creating summary..."
{
    echo "# Loki-PC Framework Summary"
    echo ""
    echo "Generated: $(date)"
    echo "Framework Path: $FRAMEWORK_DIR"
    echo ""
    echo "## Quick Stats"
    echo "- TypeScript files: $(find . -name "*.ts" -o -name "*.tsx" | wc -l)"
    echo "- JavaScript files: $(find . -name "*.js" -o -name "*.jsx" | wc -l)"
    echo "- Services: $(find . -path "*/services/*" -name "*.ts" -o -path "*/services/*" -name "*.js" | wc -l)"
    echo "- Components: $(find . -path "*/components/*" -name "*.tsx" -o -path "*/components/*" -name "*.jsx" | wc -l)"
    echo "- Core files: $(find core -type f 2>/dev/null | wc -l)"
    echo ""
    echo "## Key Directories"
    echo "- core/: $(ls core/ 2>/dev/null | wc -l) files"
    echo "- static/: $(find static -type f 2>/dev/null | wc -l) files"
    echo "- data/: $(find data -type f 2>/dev/null | wc -l) files"
    echo ""
    echo "## Documentation Files Generated"
    echo "1. Directory Structure"
    echo "2. Key Files"
    echo "3. Core Directory"
    echo "4. Services"
    echo "5. Components"
    echo "6. Static & Data"
    echo "7. Cursor Fix / Local AI"
    echo "8. Server Management"
    echo "9. dotProject Integration"
    echo "10. Module System"
    echo "11. Role-Based Provisioning"
    echo "12. Configuration"
    echo "13. Entry Points"
    echo "14. Build System"
    echo ""
    echo "All documentation saved to: $OUTPUT_DIR"
} > "$OUTPUT_DIR/00_SUMMARY.md"

# Create archive
echo ""
echo "📦 Creating archive..."
cd "$OUTPUT_DIR"
tar -czf "../loki-framework-docs-$TIMESTAMP.tar.gz" .
cd - > /dev/null

echo ""
echo "✅ Documentation complete!"
echo "📁 Output directory: $OUTPUT_DIR"
echo "📦 Archive: $HOME/loki-framework-docs-$TIMESTAMP.tar.gz"
echo ""
echo "Files generated:"
ls -1 "$OUTPUT_DIR"/*.md | wc -l
echo ""
echo "To copy to Aries-PC:"
echo "  scp -r $OUTPUT_DIR user@aries-pc:/home/chrishallberg/xi-io-Vector-Forge-UI/"
echo "  scp $HOME/loki-framework-docs-$TIMESTAMP.tar.gz user@aries-pc:/home/chrishallberg/xi-io-Vector-Forge-UI/"

