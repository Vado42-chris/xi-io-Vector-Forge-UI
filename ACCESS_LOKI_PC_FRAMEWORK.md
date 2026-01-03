# Accessing Loki-PC Framework Work

## 🎯 Goal

Access and compare the **Loki-PC version** of the framework to understand:
- How it differs from current (Aries-PC) version
- What unique features it has
- How it integrates with dotProject
- Server management implementation
- Offline/standalone capabilities

## ✅ Current Access Status

- ✅ `internal.xi-io.com` resolves to `127.0.0.1` (localhost)
- ✅ SSH server is accessible
- ✅ Host key added to known_hosts (no more hanging)
- ✅ Web server running on port 3000
- ⚠️ SSH requires password authentication

## 🔧 Access Methods

### Method 1: SSH Direct Access (Recommended)

```bash
# SSH into Loki-PC
ssh user@internal.xi-io.com

# Once connected, find framework directory
find / -name "*xibalba*" -type d 2>/dev/null | head -10
find / -name "*framework*" -type d 2>/dev/null | head -10
find /home -name "*.json" -path "*/package.json" 2>/dev/null | head -10

# Navigate to framework
cd /path/to/framework

# List structure
ls -la
tree -L 3  # if available

# Compare key files
cat package.json
cat README.md
cat .env.local 2>/dev/null
cat config/xibalba.config.json
```

### Method 2: Copy Files for Comparison

```bash
# From Aries-PC (this machine)
# Create comparison directory
mkdir -p ~/loki-framework-comparison

# Copy framework files from Loki-PC
scp -r user@internal.xi-io.com:/path/to/framework/* ~/loki-framework-comparison/

# Compare structures
diff -r ~/loki-framework-comparison ./current-framework
```

### Method 3: Web Access (If Framework is Served)

```bash
# Check if framework is accessible via web
curl http://internal.xi-io.com:3000
curl http://internal.xi-io.com:8000
curl http://internal.xi-io.com

# Check for API endpoints
curl http://internal.xi-io.com:3000/api/health
curl http://internal.xi-io.com:3000/api/status
```

### Method 4: Git Repository (If Shared)

```bash
# Check for Loki-PC branch
git fetch origin
git branch -r | grep -i loki

# Or check for shared repo
git remote -v

# If branch exists, compare
git diff main loki-pc-version
```

## 📋 What to Document from Loki-PC

### 1. Framework Structure
```bash
# On Loki-PC
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" | head -50
find . -type d -name "services" -o -name "components" -o -name "modules" | head -20
ls -la
```

### 2. Server Management Module
```bash
# Look for server management code
grep -r "server.*management\|virtualmin\|nginx" . --include="*.ts" --include="*.tsx" | head -20
find . -name "*server*" -o -name "*infrastructure*" | head -20
```

### 3. dotProject Integration
```bash
# Look for dotProject integration
grep -r "dotproject\|dotProject\|dot-project" . --include="*.ts" --include="*.tsx" | head -20
find . -name "*dotproject*" -o -name "*project*" | head -20
```

### 4. Module System
```bash
# Look for module system
grep -r "module.*system\|ModuleLoader\|module.*registry" . --include="*.ts" --include="*.tsx" | head -20
find . -name "*module*" | head -20
```

### 5. Role-Based Provisioning
```bash
# Look for role system
grep -r "role.*provision\|RoleProvider\|role.*based" . --include="*.ts" --include="*.tsx" | head -20
find . -name "*role*" -o -name "*permission*" | head -20
```

### 6. Offline/Standalone Features
```bash
# Look for offline capabilities
grep -r "offline\|standalone\|cut.*cord" . --include="*.ts" --include="*.tsx" | head -20
cat .env.local 2>/dev/null | grep -i "offline\|local\|standalone"
```

## 🔍 Comparison Checklist

### Architecture
- [ ] File structure differences
- [ ] Service organization
- [ ] Component patterns
- [ ] Module system design
- [ ] Integration approach

### Features
- [ ] Server management implementation
- [ ] dotProject integration method
- [ ] Role-based provisioning
- [ ] Multi-tenant architecture
- [ ] Offline capabilities

### Configuration
- [ ] Environment setup
- [ ] Service configurations
- [ ] Database schemas
- [ ] API endpoints
- [ ] Module loading

## 📝 Documentation Template

Create `LOKI_PC_FRAMEWORK_ANALYSIS.md`:

```markdown
# Loki-PC Framework Analysis

## Structure
- Framework location: `/path/to/framework`
- Main entry point: `index.tsx` or `app.tsx`
- Build system: Vite/Webpack/Other

## Unique Features
1. Server management module
2. dotProject integration
3. Offline capabilities
4. ...

## Architecture Differences
- Current (Aries): Web-first, React components
- Loki-PC: Server-first, offline-capable
- Differences: ...

## Integration Points
- dotProject: API/iframe/database
- Server management: CLI/API/direct
- Modules: How modules are loaded
- ...

## Merge Considerations
- What to keep from Loki-PC
- What to keep from Aries
- What to combine
- ...
```

## 🚀 Next Steps

1. **SSH into Loki-PC**
   ```bash
   ssh user@internal.xi-io.com
   ```

2. **Find Framework Directory**
   ```bash
   find / -name "*xibalba*" -type d 2>/dev/null
   ```

3. **Document Structure**
   - List files/directories
   - Read key files
   - Document unique features

4. **Compare with Current**
   - Create comparison document
   - Identify differences
   - Plan merge strategy

---

**Status**: Ready to access Loki-PC. SSH connection configured. Need to find framework directory and document differences.

