# Loki-PC Framework Investigation Guide

## 🎯 Target Framework

**Path**: `/home/chrishallberg/drives/hdd1/Xibalba-Projects/Xibalba-Framework-V61/xibalba-intranet/`

This is the **correct framework** where the "cursor fix" is implemented.

## 📋 Known Structure (From User Info)

Based on the user's information:

```
/home/chrishallberg/drives/hdd1/Xibalba-Projects/Xibalba-Framework-V61/
└── xibalba-intranet/          ← Framework root
    ├── core/                  ← Core managers
    ├── static/                ← Static assets
    ├── data/                  ← Data storage
    ├── CALENDAR_*.md          ← Calendar documentation (16 files)
    └── WARGAME_*.md           ← Wargame templates
```

## 🚀 Quick Start

### Option 1: Run Documentation Script (Recommended)

1. **SSH into Loki-PC**:
   ```bash
   ssh user@internal.xi-io.com
   ```

2. **Copy the script to Loki-PC**:
   ```bash
   # From Aries-PC
   scp LOKI_PC_FRAMEWORK_DOCUMENTATION_SCRIPT.sh user@internal.xi-io.com:~/
   ```

3. **Run the script on Loki-PC**:
   ```bash
   # On Loki-PC
   cd ~
   chmod +x LOKI_PC_FRAMEWORK_DOCUMENTATION_SCRIPT.sh
   ./LOKI_PC_FRAMEWORK_DOCUMENTATION_SCRIPT.sh
   ```

4. **Copy results back to Aries-PC**:
   ```bash
   # From Aries-PC
   scp -r user@internal.xi-io.com:~/loki-framework-docs ./
   scp user@internal.xi-io.com:~/loki-framework-docs-*.tar.gz ./
   ```

### Option 2: Manual Investigation

If you prefer to investigate manually, follow these steps:

```bash
# 1. SSH into Loki-PC
ssh user@internal.xi-io.com

# 2. Navigate to framework
cd /home/chrishallberg/drives/hdd1/Xibalba-Projects/Xibalba-Framework-V61/xibalba-intranet

# 3. Document structure
find . -type d -maxdepth 3 | sort > ~/loki-structure.txt
ls -la > ~/loki-files.txt
cat package.json > ~/loki-package.json

# 4. Document core directory
ls -la core/ > ~/loki-core.txt
find core -type f | head -30 > ~/loki-core-files.txt

# 5. Document services
find . -path "*/services/*" -type f | head -30 > ~/loki-services.txt

# 6. Document components
find . -path "*/components/*" -type f | head -30 > ~/loki-components.txt

# 7. Document cursor fix
grep -r "cursor\|local.*ai\|ollama" . --include="*.ts" --include="*.tsx" -i | head -30 > ~/loki-cursor-fix.txt

# 8. Copy back to Aries-PC
# From Aries-PC:
scp user@internal.xi-io.com:~/loki-* ./
```

## 🔍 What We're Looking For

### 1. Framework Architecture
- Directory structure
- Entry points (index.tsx, app.tsx, server.js)
- Build system (vite.config.ts, webpack, etc.)
- Module organization

### 2. Cursor Fix Implementation
- How local AI is configured
- Ollama integration
- "Cut the cord" features
- Configuration files
- Environment setup

### 3. Core Managers
- What's in the `core/` directory
- Manager classes/services
- Core functionality

### 4. Server Management
- Server management module
- Virtualmin integration
- nginx management
- Domain management

### 5. dotProject Integration
- How dotProject is integrated
- API/iframe/database approach
- Integration code

### 6. Module System
- How modules are loaded
- Module registry
- Module loader implementation

### 7. Role-Based Provisioning
- Role system implementation
- Permission management
- Provisioning logic

### 8. Static & Data
- What's in `static/` directory
- What's in `data/` directory
- Asset organization

## 📊 Comparison Points

Once we have the documentation, we'll compare:

| Feature | Loki-PC | Aries-PC | Notes |
|---------|---------|----------|-------|
| Framework Structure | ? | ✅ Documented | |
| Cursor Fix | ✅ Implemented | ⚠️ Needs fix | |
| Server Management | ✅ Implemented | ❌ Missing | |
| dotProject | ✅ Integrated | ❌ Missing | |
| Module System | ? | ✅ Services | |
| Role Provisioning | ? | ❌ Missing | |
| Offline Capability | ✅ Yes | ⚠️ Partial | |

## 🎯 Next Steps After Documentation

1. **Analyze Differences**
   - Compare directory structures
   - Compare service implementations
   - Compare component patterns

2. **Identify Unique Features**
   - What Loki-PC has that Aries-PC doesn't
   - What Aries-PC has that Loki-PC doesn't
   - Complementary strengths

3. **Plan Integration**
   - How to merge server management
   - How to integrate dotProject
   - How to port cursor fix
   - How to unify module systems

4. **Design Hub Framework**
   - Unified architecture
   - Module loader
   - Role-based provisioning
   - Integration layer

## 📝 Documentation Output

The script will generate:

1. `00_SUMMARY.md` - Overview and stats
2. `01_directory_structure.md` - Full directory tree
3. `02_key_files.md` - package.json, README, etc.
4. `03_core_directory.md` - Core managers analysis
5. `04_services.md` - Services list and structure
6. `05_components.md` - Components list and structure
7. `06_static_data.md` - Static and data directories
8. `07_cursor_local_ai.md` - Cursor fix implementation
9. `08_server_management.md` - Server management module
10. `09_dotproject.md` - dotProject integration
11. `10_module_system.md` - Module system
12. `11_role_provisioning.md` - Role-based provisioning
13. `12_configuration.md` - Configuration files
14. `13_entry_points.md` - Entry points and main files
15. `14_build_system.md` - Build configuration

## ✅ Success Criteria

Documentation is complete when we have:
- ✅ Full directory structure
- ✅ All key files documented
- ✅ Cursor fix implementation details
- ✅ Server management module details
- ✅ dotProject integration details
- ✅ Module system architecture
- ✅ Role provisioning implementation
- ✅ Configuration files
- ✅ Entry points identified

---

**Status**: Ready to investigate. Run the script on Loki-PC or follow manual steps.
