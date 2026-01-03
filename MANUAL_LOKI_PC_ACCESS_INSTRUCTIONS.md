# Manual Loki-PC Access Instructions

## 🎯 Goal

Since SSH requires password authentication, you'll need to manually access Loki-PC and provide the framework information.

## 📋 Step-by-Step Instructions

### Step 1: SSH into Loki-PC

```bash
# From your terminal
ssh user@internal.xi-io.com

# Enter password when prompted
```

### Step 2: Find Framework Directory

Once connected to Loki-PC, find the framework directory:

```bash
# Search for framework directories
find /home -name "*xibalba*" -type d 2>/dev/null
find /home -name "*framework*" -type d 2>/dev/null
find /var/www -name "*xibalba*" -type d 2>/dev/null
find /opt -name "*xibalba*" -type d 2>/dev/null

# Or check common locations
ls -la ~/
ls -la /var/www/
ls -la /opt/
```

### Step 3: Document Framework Structure

Once you find the framework directory, run these commands and save the output:

```bash
# Navigate to framework directory
cd /path/to/framework

# Document directory structure
tree -L 3 -d > ~/loki-framework-structure.txt
# OR if tree not available:
find . -type d -maxdepth 3 | sort > ~/loki-framework-structure.txt

# Document file list
ls -la > ~/loki-framework-files.txt
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" | head -50 > ~/loki-framework-codefiles.txt

# Document key files
cat package.json > ~/loki-package.json
cat README.md > ~/loki-readme.md 2>/dev/null || echo "No README"
cat .env.local > ~/loki-env.local 2>/dev/null || echo "No .env.local"
cat config/xibalba.config.json > ~/loki-xibalba-config.json 2>/dev/null || echo "No config"

# Document services
ls -la services/ > ~/loki-services.txt 2>/dev/null || echo "No services directory"
ls -la components/ > ~/loki-components.txt 2>/dev/null || echo "No components directory"

# Document server management module
find . -name "*server*" -o -name "*infrastructure*" > ~/loki-server-modules.txt
grep -r "virtualmin\|nginx\|domain.*management" . --include="*.ts" --include="*.tsx" | head -20 > ~/loki-server-code.txt

# Document dotProject integration
find . -name "*dotproject*" -o -name "*project*" > ~/loki-dotproject-files.txt
grep -r "dotproject\|dotProject" . --include="*.ts" --include="*.tsx" | head -20 > ~/loki-dotproject-code.txt

# Document module system
find . -name "*module*" > ~/loki-modules.txt
grep -r "ModuleLoader\|module.*system" . --include="*.ts" --include="*.tsx" | head -20 > ~/loki-module-code.txt

# Document role-based provisioning
find . -name "*role*" -o -name "*permission*" > ~/loki-roles.txt
grep -r "role.*provision\|RoleProvider" . --include="*.ts" --include="*.tsx" | head -20 > ~/loki-role-code.txt
```

### Step 4: Copy Files to Aries-PC

```bash
# From Loki-PC, copy documentation files
scp ~/loki-*.txt user@aries-pc:/home/chrishallberg/xi-io-Vector-Forge-UI/
scp ~/loki-*.json user@aries-pc:/home/chrishallberg/xi-io-Vector-Forge-UI/ 2>/dev/null || true
scp ~/loki-*.md user@aries-pc:/home/chrishallberg/xi-io-Vector-Forge-UI/ 2>/dev/null || true

# OR manually copy/paste the content
```

### Step 5: Alternative - Web Access

If the framework is served via web, you can also:

```bash
# Check if framework is accessible
curl http://internal.xi-io.com:3000
curl http://internal.xi-io.com:8000

# Check for API endpoints
curl http://internal.xi-io.com:3000/api/health
curl http://internal.xi-io.com:3000/api/status
```

## 📝 What to Provide

Once you've accessed Loki-PC, provide:

1. **Framework Location**
   - Full path to framework directory

2. **Directory Structure**
   - Output of `tree` or `find` command
   - List of main directories

3. **Key Files**
   - `package.json` content
   - `README.md` content (if exists)
   - `.env.local` content (if exists)
   - `config/xibalba.config.json` content

4. **Services List**
   - List of services in `services/` directory
   - Key service files

5. **Components List**
   - List of components in `components/` directory
   - Key component files

6. **Server Management Module**
   - Files related to server management
   - Code snippets showing implementation

7. **dotProject Integration**
   - Files related to dotProject
   - Code snippets showing integration

8. **Module System**
   - How modules are loaded
   - Module registry/loader code

9. **Role-Based Provisioning**
   - How roles are implemented
   - Role provider code

## 🚀 Quick Command Set

Copy and paste this entire block into Loki-PC terminal:

```bash
#!/bin/bash
# Quick documentation script for Loki-PC framework

FRAMEWORK_DIR=$(find /home /var/www /opt -name "*xibalba*" -type d 2>/dev/null | head -1)
if [ -z "$FRAMEWORK_DIR" ]; then
    FRAMEWORK_DIR=$(find /home /var/www /opt -name "*framework*" -type d 2>/dev/null | head -1)
fi

if [ -z "$FRAMEWORK_DIR" ]; then
    echo "Framework directory not found. Please provide path manually."
    exit 1
fi

cd "$FRAMEWORK_DIR"
echo "Framework directory: $FRAMEWORK_DIR" > ~/loki-framework-info.txt
echo "" >> ~/loki-framework-info.txt

echo "=== Directory Structure ===" >> ~/loki-framework-info.txt
find . -type d -maxdepth 3 | sort >> ~/loki-framework-info.txt
echo "" >> ~/loki-framework-info.txt

echo "=== Key Files ===" >> ~/loki-framework-info.txt
ls -la >> ~/loki-framework-info.txt
echo "" >> ~/loki-framework-info.txt

echo "=== Package.json ===" >> ~/loki-framework-info.txt
cat package.json >> ~/loki-framework-info.txt 2>/dev/null || echo "No package.json"
echo "" >> ~/loki-framework-info.txt

echo "=== Services ===" >> ~/loki-framework-info.txt
ls -la services/ >> ~/loki-framework-info.txt 2>/dev/null || echo "No services directory"
echo "" >> ~/loki-framework-info.txt

echo "=== Components ===" >> ~/loki-framework-info.txt
ls -la components/ >> ~/loki-framework-info.txt 2>/dev/null || echo "No components directory"
echo "" >> ~/loki-framework-info.txt

echo "Documentation saved to: ~/loki-framework-info.txt"
cat ~/loki-framework-info.txt
```

---

**Status**: Ready for manual access. Run the commands above on Loki-PC and provide the output.

