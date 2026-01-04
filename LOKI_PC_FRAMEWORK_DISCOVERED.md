# Loki-PC Framework Discovery

## ✅ SSH Connection Successful!

**Connection**: `chrishallberg@192.168.4.120` ✅  
**Hostname**: `loki`  
**Framework Path**: `/home/chrishallberg/drives/hdd1/Xibalba-Projects/Xibalba-Framework-V61/xibalba-intranet/`

## 🔍 Framework Structure Discovered

### Architecture: **Python-Based** (Flask/Django)

This is a **different tech stack** from Aries-PC:
- **Loki-PC**: Python (Flask/Django) - Server-side framework
- **Aries-PC**: React/TypeScript - Client-side framework

### Directory Structure

```
xibalba-intranet/
├── core/                    # Core managers (Python)
│   ├── agent_registry.py
│   ├── analytics_manager.py
│   ├── branding.py
│   ├── calendar_*.py        # Calendar management
│   ├── components.py
│   └── ... (many managers)
├── static/                  # Static assets
│   ├── css/
│   └── js/
├── templates/               # HTML templates
│   └── branding/
├── data/                    # Data storage
│   ├── agents/
│   ├── analytics/
│   ├── calendar/
│   ├── content/
│   ├── docket/
│   ├── knowledge_base/
│   ├── knowledge_graph/
│   ├── roadmap/
│   ├── sites/
│   ├── tasks/
│   ├── users/
│   └── work/
├── scripts/                 # Utility scripts
├── logs/                    # Log files
└── ... (many other directories)
```

### Key Findings

1. **Python Framework**
   - Core managers in `core/` directory
   - Template-based rendering (likely Flask)
   - Static file serving

2. **Calendar System**
   - Multiple calendar-related modules
   - `calendar_forge.py` - Main calendar system
   - `calendar_manager.py` - Calendar management
   - `calendar_integration.py` - Integration layer

3. **Data Storage**
   - Organized by feature (agents, analytics, calendar, etc.)
   - Knowledge base and knowledge graph
   - User and task management

4. **Ollama Running**
   - Port 11434 listening (local AI)
   - Same as Aries-PC setup

5. **No Active Web Server**
   - Port 3000 not active
   - May need to start the server

## 🔍 What to Investigate Next

### 1. Main Application File
- Find `app.py`, `main.py`, or `server.py`
- Understand how the Flask/Django app starts
- Check routing and endpoints

### 2. Cursor Bypass Implementation
- Check Cursor settings on Loki-PC
- Look for VPN/proxy configurations
- Check for network-level bypass

### 3. Intranet Site Configuration
- How is the site served?
- Nginx configuration?
- Systemd service?
- Port configuration

### 4. Server Management Module
- Look for server management code
- Virtualmin integration
- Domain management

### 5. dotProject Integration
- Search for dotProject references
- Integration method (API/iframe/database)

## 📊 Comparison: Loki-PC vs Aries-PC

| Feature | Loki-PC | Aries-PC |
|---------|---------|----------|
| **Tech Stack** | Python (Flask/Django) | React/TypeScript |
| **Architecture** | Server-side rendering | Client-side rendering |
| **Entry Point** | `app.py`/`main.py` | `index.tsx` |
| **Components** | Python classes | React components |
| **Services** | Python modules | TypeScript services |
| **Templates** | HTML templates | JSX components |
| **Static Files** | `static/` directory | `public/` directory |
| **Data Storage** | File-based (`data/`) | Services + API |

## 🎯 Key Differences

1. **Loki-PC is Server-Side**
   - Python backend framework
   - Template rendering
   - Server-managed state

2. **Aries-PC is Client-Side**
   - React frontend
   - API-based communication
   - Client-managed state

3. **Different Approaches**
   - Loki-PC: Traditional web app (server renders pages)
   - Aries-PC: Modern SPA (client renders pages)

## 🚀 Next Steps

1. **Find Main App File**
   - Locate entry point
   - Understand startup process

2. **Document Cursor Bypass**
   - Check Cursor settings
   - Document VPN/proxy setup

3. **Start Intranet Site**
   - Find how to start the server
   - Check for systemd service
   - Document startup process

4. **Compare Implementations**
   - Server management
   - dotProject integration
   - Module system

---

**Status**: ✅ Connected to Loki-PC. Framework structure discovered. Python-based framework (different from Aries-PC React/TypeScript).

