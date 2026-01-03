# Universal Business Hub Vision - Xibalba Intranet

## 🎯 The Vision

**Xibalba Intranet = The Operating System for Running a Business**

Not just an intranet. A **universal hub** that unifies all business operations into ONE interface.

## 📋 What It Manages

### Core Modules:
1. **Server Infrastructure** (replacing Virtualmin/cPanel)
   - Domain management
   - SSL certificates
   - Server monitoring (CPU/RAM/disk)
   - Service management
   - Backup/restore

2. **Business Operations** (integrating dotProject)
   - Project management
   - Task tracking
   - Team collaboration
   - Resource allocation
   - Time tracking

3. **Websites** (nginx/SSL/domains)
   - Website deployment
   - Domain configuration
   - SSL certificate management
   - Content management
   - Analytics

4. **Products/Services** (Forge apps)
   - Product catalog
   - Service management
   - Client portals
   - Billing/invoicing
   - Service provisioning

5. **Employees/Teams** (HR/role management)
   - Employee directory
   - Role-based access
   - Team management
   - Department organization
   - Permissions

6. **Files/Documents** (document management)
   - File storage
   - Document sharing
   - Version control
   - Collaboration
   - Search

7. **Communication** (team chat/email)
   - Internal messaging
   - Team chat
   - Email integration
   - Notifications
   - Announcements

8. **Everything Else**
   - Custom modules
   - Third-party integrations
   - Forge apps
   - Future expansions

## 🎭 Role-Based Provisioning

### Owner Role (Sees Everything)
```
Dashboard:
├─ Server Status (CPU, RAM, disk, services)
├─ Active Projects (from dotProject)
├─ Websites (all domains, SSL status)
├─ Team Members (all employees)
├─ Finances (accounting, invoices)
├─ Products/Services (all offerings)
├─ Files (all documents)
└─ Everything
```

### Manager Role (Sees Department)
```
Dashboard:
├─ My Team's Projects
├─ Team Members (my department)
├─ Department Resources
├─ Reports (department metrics)
└─ Department Files
```

### Employee Role (Sees Their Work)
```
Dashboard:
├─ My Tasks
├─ My Projects
├─ My Files
├─ Team Chat
└─ My Calendar
```

### Client Role (Sees Their Portal)
```
Dashboard:
├─ My Projects
├─ My Invoices
├─ My Files
├─ Support Tickets
└─ Service Status
```

## 🏗️ Architecture

### Hub Framework (The Shell)
```
Xibalba Hub
├─ Authentication (login/roles)
├─ Dashboard (unified view)
├─ Navigation (access to modules)
├─ Role-based provisioning (different views)
└─ Module loader (pluggable modules)
```

### Module System (Pluggable)
```
Modules:
├─ ServerModule (server management)
├─ ProjectModule (dotProject integration)
├─ WebsiteModule (nginx/SSL)
├─ TeamModule (HR/employees)
├─ FileModule (document management)
├─ CommunicationModule (chat/email)
└─ CustomModule (future Forge apps)
```

### Integration Layer (Backend)
```
Backend:
├─ dotProject API
├─ nginx API
├─ PostgreSQL
├─ File system
├─ Email server
├─ Custom integrations
└─ Future Forge apps
```

## 🔄 Integration Strategy

### Phase 1: Hub Framework (Now)
- Build the shell
- Authentication/roles
- Dashboard framework
- Module loader
- Basic navigation

### Phase 2: First Module - dotProject (Next)
- Integrate dotProject
- Show projects on dashboard
- Embed or API integration
- Role-based project views
- Prove integration pattern

### Phase 3: Server Management (Then)
- Server stats (CPU/RAM/disk)
- Domain management
- SSL certificate management
- Service management
- Replace Virtualmin functionality

### Phase 4: Additional Modules (Incremental)
- File management
- Team management
- Communication
- Website management
- Custom modules

## 🎯 "Between-the-Lines" Principle

**Every system must have a human-facing UI.**

This means:
- ✅ Server management → Web UI (not just CLI)
- ✅ dotProject integration → Visual interface (not just API)
- ✅ Agent workflows → Dashboard showing status
- ✅ Module management → UI to enable/disable
- ✅ Role provisioning → Visual role editor

**Why**:
- Visual understanding (dyslexia/autism-friendly)
- Trust through visibility
- Professional appearance
- Human control

## 🚀 Implementation Approach

### Modular Integration (Not Building Everything)
1. **Hub** = The shell (what you're building)
2. **Modules** = Integrations with existing tools
3. **Incremental** = Add modules as needed

### Example: dotProject Integration
```
Option A: Embed (iframe)
- Embed dotProject in Xibalba UI
- Show projects on dashboard
- Click project → opens in iframe

Option B: API Integration
- Connect to dotProject database
- Show projects in Xibalba UI
- Full control over presentation

Option C: Hybrid
- Show projects on dashboard (API)
- Click project → opens dotProject (iframe)
- Best of both worlds
```

## 📊 Current Status

### What Exists:
- ✅ Hub framework (in development)
- ✅ dotProject (to be integrated)
- ✅ Server infrastructure (DomainsAtCost)
- ✅ Three parallel versions (Loki/Zed/Aries)

### What's Needed:
- ⚠️ Module system architecture
- ⚠️ dotProject integration
- ⚠️ Server management module
- ⚠️ Role-based provisioning
- ⚠️ Multi-tenant architecture

## 🎯 Next Steps

1. **Build Hub Framework**
   - Authentication/roles
   - Dashboard shell
   - Module loader
   - Navigation

2. **Integrate First Module (dotProject)**
   - Choose integration method
   - Connect to dotProject
   - Show on dashboard
   - Test role-based views

3. **Add Server Management**
   - Server stats
   - Domain management
   - SSL certificates
   - Service management

4. **Plan Module System**
   - Module API
   - Module registry
   - Module loading
   - Module communication

---

**Status**: Vision defined. Ready to build Hub framework and integrate first module.

