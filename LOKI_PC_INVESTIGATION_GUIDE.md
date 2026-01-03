# Loki-PC Investigation Guide - Cut the Cord Features & Internal Intranet

## 🎯 What We're Investigating

**On Loki-PC:**
1. **Internal Intranet** at `internal.xi-io.com`
2. **"Cut the Cord" Features** - Offline/standalone capabilities that are working
3. **Local AI Setup** - How it's configured and working
4. **Network Configuration** - How internal.xi-io.com is set up

## 📋 Investigation Checklist for Loki-PC

### Step 1: Check Internal Intranet Setup

```bash
# On Loki-PC, check:
# 1. Hosts file configuration
cat /etc/hosts | grep -i "internal.xi-io.com"
cat /etc/hosts | grep -i "xi-io"

# 2. DNS configuration
cat /etc/resolv.conf
systemd-resolve --status 2>/dev/null || resolvectl status

# 3. Network interfaces
ip addr show
ifconfig

# 4. Local web server (if internal.xi-io.com is local)
lsof -i :80
lsof -i :443
lsof -i :3000
lsof -i :8000

# 5. Check if there's a local web server serving internal.xi-io.com
curl -I http://internal.xi-io.com
curl -I https://internal.xi-io.com
```

### Step 2: Check "Cut the Cord" Features

```bash
# On Loki-PC, check:
# 1. Environment variables for offline mode
cat .env 2>/dev/null | grep -i "offline\|local\|standalone"
cat .env.local 2>/dev/null | grep -i "offline\|local\|standalone"
env | grep -i "OFFLINE\|LOCAL\|STANDALONE"

# 2. Configuration files
cat config/xibalba.config.json | grep -i "offline\|local\|standalone"
cat config/mcpConfig.ts | grep -i "localhost\|127.0.0.1"

# 3. Service configuration
systemctl list-units | grep -i "xibalba\|vectorforge\|mcp"
ps aux | grep -E "xibalba|mcp|ollama" | grep -v grep

# 4. Check for local-only services
netstat -tulpn | grep -E ":8000|:11434|:3000"
ss -tulpn | grep -E ":8000|:11434|:3000"
```

### Step 3: Check Local AI Setup

```bash
# On Loki-PC, check:
# 1. Ollama status
curl http://localhost:11434/api/tags
ollama list

# 2. MCP server status
curl http://localhost:8000/health 2>/dev/null
curl http://localhost:8000/api/health 2>/dev/null

# 3. Environment variables
env | grep -i "OLLAMA\|MCP\|XIBALBA"
cat .env 2>/dev/null | grep -i "OLLAMA\|MCP\|XIBALBA"
cat .env.local 2>/dev/null | grep -i "OLLAMA\|MCP\|XIBALBA"

# 4. Configuration files
cat config/mcpConfig.ts
cat config/xibalba.config.json
```

### Step 4: Check Network Configuration

```bash
# On Loki-PC, check:
# 1. Network routes
ip route show
route -n

# 2. Firewall rules (if any)
sudo iptables -L -n 2>/dev/null || sudo ufw status 2>/dev/null

# 3. Proxy configuration (if any)
env | grep -i "PROXY\|HTTP_PROXY\|HTTPS_PROXY"
cat ~/.bashrc | grep -i "proxy"
cat ~/.zshrc | grep -i "proxy"

# 4. Browser configuration
# Check Chrome/Edge settings for:
# - Proxy settings
# - Local network access
# - Security settings
```

### Step 5: Check Application Configuration

```bash
# On Loki-PC, check VectorForge configuration:
# 1. Vite config
cat vite.config.ts | grep -i "host\|port\|proxy"

# 2. Server config
cat server.js | grep -i "host\|port\|listen"

# 3. Package.json scripts
cat package.json | grep -A 5 "scripts"

# 4. Check if there's a specific config for internal.xi-io.com
find . -name "*.config.*" -o -name "*internal*" -o -name "*intranet*" | head -20
```

## 🔍 What "Cut the Cord" Features Exist in This Codebase

### ✅ Already Implemented

1. **Offline AI Processing**
   - **Location**: `services/xibalbaService.ts`, `services/localAIService.ts`
   - **Features**:
     - MCP protocol for local AI
     - Ollama integration (localhost:11434)
     - HTTP API fallback
     - localStorage configuration (no .env needed)
     - **No internet required** once configured

2. **Portable Configuration**
   - **Location**: `config/xibalba.config.json`, `config/mcpConfig.ts`
   - **Features**:
     - localStorage fallback
     - Environment variable support
     - Default values for offline operation
     - USB deployment ready

3. **Standalone File Operations**
   - **Location**: `services/fileSystemService.ts`, `api/filesystem.js`
   - **Features**:
     - Local file system access
     - No external dependencies
     - Works offline

4. **Local Terminal Execution**
   - **Location**: `services/terminalService.ts`, `api/terminal/execute`
   - **Features**:
     - Execute commands locally
     - No external API calls
     - Works offline

5. **Self-Contained Development Environment**
   - **Location**: `components/DevChatbot.tsx`
   - **Features**:
     - File browser (via API)
     - Terminal access (via API)
     - AI chatbot (local AI)
     - **All in one UI, no external tools needed**

### 📝 Configuration Files to Check on Loki-PC

1. **`.env` or `.env.local`**
   ```bash
   cat .env.local | grep -E "XIBALBA|MCP|OLLAMA|OFFLINE|LOCAL"
   ```

2. **`config/xibalba.config.json`**
   ```bash
   cat config/xibalba.config.json
   ```

3. **`config/mcpConfig.ts`**
   ```bash
   cat config/mcpConfig.ts | grep -A 20 "DEFAULT_MCP_CONFIG"
   ```

4. **`vite.config.ts`**
   ```bash
   cat vite.config.ts | grep -A 10 "server:"
   ```

5. **`server.js`**
   ```bash
   cat server.js | grep -A 5 "PORT\|listen\|host"
   ```

## 🌐 Internal.xi-io.com Setup Investigation

### Possible Configurations

1. **Local Hosts File Entry**
   ```bash
   # Check if internal.xi-io.com points to localhost
   cat /etc/hosts | grep "internal.xi-io.com"
   # Should show something like:
   # 127.0.0.1    internal.xi-io.com
   # or
   # 192.168.x.x  internal.xi-io.com
   ```

2. **Local Web Server**
   ```bash
   # Check if there's a web server running
   lsof -i :80 -i :443 -i :3000 -i :8000
   
   # Check nginx/apache config
   ls -la /etc/nginx/sites-enabled/ | grep -i "xi-io"
   ls -la /etc/apache2/sites-enabled/ | grep -i "xi-io"
   ```

3. **Docker/Container Setup**
   ```bash
   # Check if running in containers
   docker ps | grep -i "xi-io\|xibalba"
   docker-compose ps
   ```

4. **Reverse Proxy Setup**
   ```bash
   # Check nginx reverse proxy
   cat /etc/nginx/sites-enabled/* | grep -A 10 "internal.xi-io.com"
   ```

## 🔧 What to Document from Loki-PC

### Critical Information to Capture

1. **Network Configuration**
   - [ ] Hosts file entries
   - [ ] DNS configuration
   - [ ] Local IP addresses
   - [ ] Port mappings

2. **Service Configuration**
   - [ ] Ollama setup (models, port, config)
   - [ ] MCP server setup (port, URL, config)
   - [ ] Web server setup (if separate)
   - [ ] Environment variables

3. **Application Configuration**
   - [ ] `.env` or `.env.local` contents
   - [ ] `config/xibalba.config.json` contents
   - [ ] `vite.config.ts` server settings
   - [ ] `server.js` configuration

4. **"Cut the Cord" Features**
   - [ ] Which features are enabled
   - [ ] How offline mode is configured
   - [ ] Local AI setup details
   - [ ] Any custom offline features

## 📊 Comparison Checklist

### On Loki-PC (Working):
- [ ] Internal.xi-io.com resolves to: _______________
- [ ] Local AI running on: _______________
- [ ] MCP server running on: _______________
- [ ] Offline mode enabled: Yes/No
- [ ] Configuration method: .env/localStorage/defaults
- [ ] Custom features: _______________

### On This Machine (Current):
- [ ] Internal.xi-io.com: Not configured
- [ ] Local AI: Needs setup
- [ ] MCP server: Not running
- [ ] Offline mode: Code exists, needs configuration
- [ ] Configuration: Defaults only

## 🚀 Replication Steps (After Investigation)

Once you've documented Loki-PC setup:

1. **Replicate Network Setup**
   ```bash
   # Add to /etc/hosts (if needed)
   sudo echo "127.0.0.1    internal.xi-io.com" >> /etc/hosts
   ```

2. **Replicate Service Configuration**
   ```bash
   # Copy .env.local from Loki-PC
   # Copy config files
   # Set up same services
   ```

3. **Replicate Application Configuration**
   ```bash
   # Copy configuration files
   # Set up same environment variables
   # Configure same ports
   ```

## 💡 Key Questions to Answer

1. **How is internal.xi-io.com configured?**
   - Hosts file? DNS? Local web server?

2. **What "cut the cord" features are working?**
   - Offline AI? Local file operations? Standalone mode?

3. **How is local AI configured?**
   - Ollama? MCP server? Direct GGUF files?

4. **What makes it work offline?**
   - Configuration? Services? Network setup?

5. **What's different from this machine?**
   - Network config? Service setup? Application config?

## 📝 Documentation Template

Create a file on Loki-PC with this information:

```markdown
# Loki-PC Configuration - Cut the Cord Features

## Network Setup
- Internal.xi-io.com resolves to: _______________
- Hosts file entry: _______________
- Local IP: _______________

## Services
- Ollama: Port ______, Models: _______________
- MCP Server: Port ______, URL: _______________
- Web Server: Port ______, Type: _______________

## Configuration
- .env.local contents: _______________
- config/xibalba.config.json: _______________
- vite.config.ts server settings: _______________

## Cut the Cord Features
- Offline AI: Yes/No
- Local file operations: Yes/No
- Standalone mode: Yes/No
- Custom features: _______________
```

## 🎯 Next Steps

1. **Run investigation commands on Loki-PC** (use the checklist above)
2. **Document findings** (use the template above)
3. **Compare with this machine** (see what's different)
4. **Replicate working setup** (copy configuration)
5. **Test "cut the cord" features** (verify offline operation)

---

**Status**: Ready for investigation on Loki-PC. Run the commands above and document the results.

