# Current Framework Structure (Aries-PC/Cursor Version)

## 📁 Directory Structure

```
xi-io-Vector-Forge-UI/
├── components/          # React components
├── services/            # Business logic services
├── lib/                 # Libraries and utilities
├── styles/              # CSS/styling
├── config/             # Configuration files
├── api/                 # API routes (Express)
├── data/                # Data files/templates
├── docs/                # Documentation
├── scripts/             # Build/utility scripts
├── tests/               # Test files
├── App.tsx              # Main app component
├── index.tsx            # Entry point
├── server.js            # Express server
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies
```

## 🏗️ Architecture

### Frontend (React/TypeScript)
- **Entry**: `index.tsx`
- **Main App**: `App.tsx`
- **Components**: `components/`
- **Services**: `services/`
- **Styling**: `styles/` (Tailwind + Custom CSS)

### Backend (Node.js/Express)
- **Server**: `server.js`
- **API Routes**: `api/`
- **Services**: `services/`

### Key Services
- `moltingService.ts` - Self-modification system
- `replicationService.ts` - Replication system
- `localAIService.ts` - Local AI integration
- `xibalbaService.ts` - MCP client
- `fileSystemClient.ts` - File operations
- `terminalService.ts` - Terminal execution

### Key Components
- `DevChatbot.tsx` - Self-modifying chatbot
- `LeftSidebar.tsx` - Tool dock + AI panel
- `RightSidebar.tsx` - Properties, layers, etc.
- `DraftsmanCanvas.tsx` - Main canvas

## 🎯 Current Focus

- Web-based architecture
- React/TypeScript stack
- Browser-based UI
- Cursor AI integration
- VectorForge application

## 📋 What to Compare with Loki-PC

1. **Framework Structure**
   - Directory organization
   - File naming conventions
   - Module system

2. **Architecture Patterns**
   - Service layer design
   - Component structure
   - Integration approach

3. **Unique Features**
   - Server management (Loki-PC)
   - dotProject integration (Loki-PC)
   - Offline capabilities (Loki-PC)
   - Web framework (Aries-PC)

4. **Configuration**
   - Environment setup
   - Service configurations
   - Module loading

