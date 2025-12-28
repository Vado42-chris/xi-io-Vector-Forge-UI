# VectorForge Environment Setup - Complete Guide

## ✅ Environment Verification Complete

Your VectorForge environment has been configured for **standalone, portable operation** with Xibalba AI integration.

## What Was Configured

### 1. ✅ Xibalba AI Service
- **Created**: `services/xibalbaService.ts`
- **Replaces**: Google Gemini API with local Xibalba MCP
- **Features**:
  - MCP protocol support
  - HTTP API fallback
  - localStorage configuration (fully portable)
  - No internet required

### 2. ✅ Installation Scripts
- **`scripts/install.sh`**: Full installation from USB
- **`scripts/setup-xibalba.sh`**: Xibalba AI configuration
- **`scripts/verify-setup.sh`**: Environment verification

### 3. ✅ Configuration Files
- **`.env.local`**: Environment variables (auto-generated)
- **`config/xibalba.config.json`**: Default configuration
- **localStorage fallback**: Works without .env file

### 4. ✅ Updated Application
- **App.tsx**: Now uses `xibalbaService` instead of `geminiService`
- **vite.config.ts**: Supports Xibalba environment variables
- **Portable**: No hardcoded dependencies

## Current Status

```
✓ Node.js v24.11.1 (OK)
✓ npm 11.6.2 (OK)
✓ Dependencies installed
✓ Xibalba service configured
✓ Installation scripts ready
⚠️  MCP server not running (expected if not started yet)
⚠️  Production build not created (optional)
```

## Next Steps

### 1. Configure Xibalba AI (if not done)

```bash
./scripts/setup-xibalba.sh
```

This will:
- Detect Xibalba infrastructure
- Create `.env.local` with proper configuration
- Set up MCP connection

### 2. Start MCP Server (if needed)

Ensure your Xibalba MCP server is running:
```bash
# Your MCP server should be on http://localhost:8000
# Or update VITE_XIBALBA_MCP_URL in .env.local
```

### 3. Launch VectorForge

```bash
npm run dev
```

The app will:
- Try MCP connection first
- Fall back to HTTP API if MCP unavailable
- Use localStorage config if .env.local missing
- Work fully offline once configured

## USB Deployment

### Creating USB Package

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Copy to USB:**
   ```bash
   cp -r ~/xi-io-Vector-Forge-UI /media/usb/VectorForge
   ```

3. **On target machine:**
   ```bash
   cd /media/usb/VectorForge
   ./scripts/install.sh
   ./scripts/setup-xibalba.sh
   ./launch.sh
   ```

### Portable Configuration

The app supports **three configuration methods** (in order of priority):

1. **Environment Variables** (`.env.local`)
   ```env
   VITE_XIBALBA_MCP_URL=http://localhost:8000
   VITE_XIBALBA_API_KEY=your_key
   ```

2. **localStorage** (browser storage)
   ```javascript
   localStorage.setItem('xibalba_config', JSON.stringify({
     mcpServerUrl: 'http://localhost:8000',
     apiKey: 'your_key',
     model: 'xibalba-local'
   }));
   ```

3. **Default Values** (fallback)
   - MCP URL: `http://localhost:8000`
   - Model: `xibalba-local`
   - Endpoint: `/api/v1/chat/completions`

## Architecture

```
┌─────────────────────────────────────────┐
│         VectorForge App                 │
│  (React + TypeScript + Vite)            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      xibalbaService.ts                  │
│  • MCP Client (primary)                 │
│  • HTTP API (fallback)                  │
│  • localStorage config                  │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│ MCP Server │  │ HTTP API     │
│ (port 8000)│  │ (fallback)   │
└────────────┘  └──────────────┘
       │
       ▼
┌─────────────────────────┐
│   Xibalba AI Engine     │
│   (Local Processing)     │
└─────────────────────────┘
```

## Verification

Run the verification script anytime:

```bash
./scripts/verify-setup.sh
```

This checks:
- ✅ Node.js version
- ✅ Dependencies
- ✅ Xibalba service
- ✅ Configuration files
- ✅ MCP server connection
- ✅ Installation scripts

## Troubleshooting

### MCP Server Not Found
- **Solution**: The app automatically falls back to HTTP API
- **Check**: Ensure Xibalba MCP server is running on configured port
- **Config**: Update `VITE_XIBALBA_MCP_URL` in `.env.local`

### Configuration Not Loading
- **Priority**: .env.local → localStorage → defaults
- **Manual**: Set localStorage config in browser console
- **Verify**: Check browser console for configuration logs

### Port Conflicts
- **Dev**: Vite auto-selects next available port
- **Production**: Configure in `vite.config.ts`

## Production Build

For production deployment:

```bash
npm run build
npm run preview
```

Built files in `dist/` can be served by any static file server.

## Summary

✅ **Fully Standalone**: No internet required  
✅ **Portable**: Works from USB drive  
✅ **Local AI**: Uses Xibalba MCP for processing  
✅ **Flexible Config**: Environment, localStorage, or defaults  
✅ **Auto-Fallback**: MCP → HTTP → Offline mode  

Your VectorForge environment is ready for standalone, portable deployment! 🚀

