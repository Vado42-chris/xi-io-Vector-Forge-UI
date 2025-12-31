# VectorForge Dev Environment - Quick Start

**What this is:** A self-contained development environment with browser preview, terminal, and file management - all in one UI.

---

## 🚀 Start Everything (One Command)

```bash
cd /home/chrishallberg/.cursor/worktrees/xi-io-Vector-Forge-UI/asg
chmod +x DEV_ENVIRONMENT_LAUNCHER.sh
./DEV_ENVIRONMENT_LAUNCHER.sh
```

**That's it!** The browser will open automatically at `http://localhost:3000`

---

## 📦 What You Get

### 1. **Browser Preview** ✅
- Full VectorForge UI running at `http://localhost:3000`
- Hot reload on file changes
- React DevTools compatible

### 2. **Terminal** ✅
- Access via: Right Sidebar → **Terminal** tab
- Execute commands safely
- See output in real-time
- Working directory management

### 3. **File Browser** ✅
- Access via: Right Sidebar → **Files** tab
- Browse, read, edit files
- No terminal needed for file operations

### 4. **Dev Chat** ✅
- Access via: Right Sidebar → **Dev Chat** tab
- AI assistant with self-modification
- Can read/write files, execute commands

---

## 🗂️ Codebase Organization

### **Working Code** (Use These)
```
components/          # All React components
services/            # Backend services
hooks/               # React hooks
styles/              # CSS files
App.hardened.tsx     # Main app (currently in use)
index.tsx            # Entry point
vite.config.ts       # Dev server config
server.js            # Backend server
package.json         # Dependencies
```

### **Archived/Reference** (Safe to Ignore)
```
*.md                 # Documentation (keep for reference)
*.sh                 # Scripts (some may be outdated)
App.*.tsx            # Backup versions (App.working.tsx, etc.)
dist/                # Build output
node_modules/        # Dependencies (auto-generated)
```

### **Secure Location** (Important Files)
```
/secure/
  ├── README.md              # Start here!
  ├── QUICK_START_DEV_ENV.md # This file
  ├── DEV_ENVIRONMENT_LAUNCHER.sh
  └── WORKING_STATUS.md      # Current status
```

---

## 🎯 First Time Setup

1. **Navigate to project:**
   ```bash
   cd /home/chrishallberg/.cursor/worktrees/xi-io-Vector-Forge-UI/asg
   ```

2. **Install dependencies (if needed):**
   ```bash
   npm install
   ```

3. **Start dev environment:**
   ```bash
   ./DEV_ENVIRONMENT_LAUNCHER.sh
   ```

4. **Open in browser:**
   - Auto-opens at `http://localhost:3000`
   - Or manually navigate to that URL

5. **Access features:**
   - **Terminal:** Right sidebar → Terminal tab
   - **Files:** Right sidebar → Files tab
   - **Dev Chat:** Right sidebar → Dev Chat tab (default)

---

## 🔧 Troubleshooting

### Port 3000 Already in Use
```bash
lsof -ti:3000 | xargs kill -9
./DEV_ENVIRONMENT_LAUNCHER.sh
```

### Dependencies Missing
```bash
npm install
```

### Browser Not Opening
Manually navigate to: `http://localhost:3000`

---

## 📝 Current Status

- ✅ Dev server: Working
- ✅ Terminal: Integrated in UI
- ✅ File browser: Integrated in UI
- ✅ Dev Chat: Integrated in UI
- ⚠️ File bar: Currently testing Header component (debug branch)

---

## 🎓 How It Works

1. **Vite Dev Server** (`vite.config.ts`)
   - Serves React app on port 3000
   - Hot module replacement
   - File watching

2. **Backend Server** (`server.js`)
   - Terminal API: `/api/terminal/execute`
   - File system API: `/api/filesystem/*`
   - AI endpoints: `/api/ai/*`

3. **UI Components**
   - `Terminal.tsx` - Terminal interface
   - `FileBrowser.tsx` - File management
   - `DevChatbot.tsx` - AI assistant

---

**You're ready to go!** Just run `./DEV_ENVIRONMENT_LAUNCHER.sh` and everything starts.

