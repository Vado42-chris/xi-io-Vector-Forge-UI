# Loki-PC Framework Investigation

## 🎯 Target Location

**Framework Path**: `/home/chrishallberg/drives/hdd1/Xibalba-Projects/Xibalba-Framework-V61/xibalba-intranet/`

This is the correct framework where the "cursor fix" is implemented.

## 📋 Investigation Plan

### Step 1: Directory Structure
```bash
cd /home/chrishallberg/drives/hdd1/Xibalba-Projects/Xibalba-Framework-V61/xibalba-intranet
find . -type d -maxdepth 3 | sort
tree -L 3 -d  # if available
```

### Step 2: Key Files
```bash
# Main files
ls -la
cat package.json 2>/dev/null
cat README.md 2>/dev/null
cat .env.local 2>/dev/null
cat config/xibalba.config.json 2>/dev/null

# Framework structure
ls -la core/
ls -la static/
ls -la data/
```

### Step 3: Services & Components
```bash
# Services
find . -path "*/services/*" -name "*.ts" -o -path "*/services/*" -name "*.js" | head -30
ls -la services/ 2>/dev/null

# Components
find . -path "*/components/*" -name "*.tsx" -o -path "*/components/*" -name "*.jsx" | head -30
ls -la components/ 2>/dev/null
```

### Step 4: Cursor Fix Implementation
```bash
# Search for cursor-related fixes
grep -r "cursor" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -i | head -20
grep -r "local.*ai\|ollama\|cut.*cord" . --include="*.ts" --include="*.tsx" -i | head -20
find . -name "*cursor*" -o -name "*local*ai*" -o -name "*ollama*"
```

### Step 5: Server Management Module
```bash
# Server management
find . -name "*server*" -o -name "*infrastructure*" -o -name "*virtualmin*"
grep -r "server.*management\|virtualmin\|nginx\|domain" . --include="*.ts" --include="*.tsx" -i | head -20
```

### Step 6: dotProject Integration
```bash
# dotProject integration
find . -name "*dotproject*" -o -name "*project*"
grep -r "dotproject\|dotProject" . --include="*.ts" --include="*.tsx" -i | head -20
```

### Step 7: Module System
```bash
# Module loader/system
find . -name "*module*" -o -name "*loader*"
grep -r "ModuleLoader\|module.*system\|loadModule" . --include="*.ts" --include="*.tsx" -i | head -20
```

### Step 8: Role-Based Provisioning
```bash
# Role system
find . -name "*role*" -o -name "*permission*" -o -name "*provision*"
grep -r "role.*provision\|RoleProvider\|permission" . --include="*.ts" --include="*.tsx" -i | head -20
```

### Step 9: Configuration Files
```bash
# All config files
find . -name "*.config.*" -o -name "*.json" | grep -E "(config|settings)" | head -20
cat config/*.json 2>/dev/null
cat config/*.ts 2>/dev/null
```

### Step 10: Entry Points
```bash
# Main entry points
find . -name "index.*" -o -name "main.*" -o -name "app.*" | head -20
cat index.ts 2>/dev/null
cat index.tsx 2>/dev/null
cat app.tsx 2>/dev/null
cat server.js 2>/dev/null
```

## 🔍 What to Document

1. **Directory Structure**
   - Full tree view
   - Key directories
   - File organization

2. **Framework Architecture**
   - Entry points
   - Module system
   - Service layer
   - Component structure

3. **Cursor Fix Implementation**
   - How local AI is configured
   - Ollama integration
   - "Cut the cord" features
   - Configuration files

4. **Unique Features**
   - Server management
   - dotProject integration
   - Offline capabilities
   - Role-based provisioning

5. **Configuration**
   - Environment setup
   - Service configurations
   - Module loading
   - Integration points

## 📝 Quick Documentation Script

```bash
#!/bin/bash
# Quick documentation script for Loki-PC framework

FRAMEWORK_DIR="/home/chrishallberg/drives/hdd1/Xibalba-Projects/Xibalba-Framework-V61/xibalba-intranet"
cd "$FRAMEWORK_DIR"

echo "=== Framework Location ===" > ~/loki-framework-doc.txt
echo "$FRAMEWORK_DIR" >> ~/loki-framework-doc.txt
echo "" >> ~/loki-framework-doc.txt

echo "=== Directory Structure ===" >> ~/loki-framework-doc.txt
find . -type d -maxdepth 3 | sort >> ~/loki-framework-doc.txt
echo "" >> ~/loki-framework-doc.txt

echo "=== Key Files ===" >> ~/loki-framework-doc.txt
ls -la >> ~/loki-framework-doc.txt
echo "" >> ~/loki-framework-doc.txt

echo "=== Package.json ===" >> ~/loki-framework-doc.txt
cat package.json >> ~/loki-framework-doc.txt 2>/dev/null || echo "No package.json"
echo "" >> ~/loki-framework-doc.txt

echo "=== Core Directory ===" >> ~/loki-framework-doc.txt
ls -la core/ >> ~/loki-framework-doc.txt 2>/dev/null || echo "No core directory"
echo "" >> ~/loki-framework-doc.txt

echo "=== Services ===" >> ~/loki-framework-doc.txt
find . -path "*/services/*" -type f | head -30 >> ~/loki-framework-doc.txt
echo "" >> ~/loki-framework-doc.txt

echo "=== Components ===" >> ~/loki-framework-doc.txt
find . -path "*/components/*" -type f | head -30 >> ~/loki-framework-doc.txt
echo "" >> ~/loki-framework-doc.txt

echo "=== Cursor Fix (Local AI) ===" >> ~/loki-framework-doc.txt
grep -r "cursor\|local.*ai\|ollama\|cut.*cord" . --include="*.ts" --include="*.tsx" -i | head -20 >> ~/loki-framework-doc.txt
echo "" >> ~/loki-framework-doc.txt

echo "=== Server Management ===" >> ~/loki-framework-doc.txt
grep -r "server.*management\|virtualmin\|nginx" . --include="*.ts" --include="*.tsx" -i | head -20 >> ~/loki-framework-doc.txt
echo "" >> ~/loki-framework-doc.txt

echo "=== dotProject Integration ===" >> ~/loki-framework-doc.txt
grep -r "dotproject\|dotProject" . --include="*.ts" --include="*.tsx" -i | head -20 >> ~/loki-framework-doc.txt
echo "" >> ~/loki-framework-doc.txt

echo "Documentation saved to: ~/loki-framework-doc.txt"
cat ~/loki-framework-doc.txt
```

---

**Status**: Ready to investigate. Run the script above on Loki-PC or provide manual access.

