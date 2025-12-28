# VectorForge Architecture Explained

## The Problem You're Experiencing

**Why you can't see the UI:**
1. The React app loads but may have module resolution issues
2. **No backend server** - AI features require a backend
3. The app tries to call Xibalba AI but there's no server to handle requests

## Open Source Vector Graphics Tools (Reference)

### 1. **Inkscape** (Most Popular Linux Vector Editor)
- **What it is**: Full-featured SVG editor (like Adobe Illustrator)
- **Backend**: GTK+ desktop app, not web-based
- **Use Case**: Reference for how vector editing should work
- **Install**: `sudo apt install inkscape`

### 2. **SVG.js** (JavaScript Library)
- **What it is**: JavaScript library for SVG manipulation
- **Backend**: Runs in browser, no server needed
- **Use Case**: Could integrate for client-side SVG editing
- **Install**: `npm install @svgdotjs/svg.js`

### 3. **Paper.js** (Vector Graphics Framework)
- **What it is**: Vector graphics framework
- **Backend**: Client-side rendering on HTML5 canvas
- **Use Case**: Canvas-based vector editing
- **Install**: `npm install paper`

## Current VectorForge Architecture

```
┌─────────────────────────────────────────┐
│   Browser (Frontend Only)               │
│   - React UI                            │
│   - SVG Canvas                          │
│   - Layer Management                    │
│   ❌ Tries to call /api/* but no server │
└─────────────────────────────────────────┘
```

**Problem**: Frontend tries to use AI features but there's no backend server!

## Solution: Add Backend Server

I've created `server.js` that:

1. **Serves the React app** (in production)
2. **Provides API endpoints** for AI features:
   - `/api/ai/generate` - Generate SVG from prompt
   - `/api/ai/suggestions` - Get AI suggestions
   - `/api/ai/image-to-vector` - Convert image to SVG
3. **Connects to Xibalba MCP** for AI processing
4. **Handles SVG processing** on the server

## How to Run with Backend

### Development Mode (Frontend + Backend)

```bash
# Terminal 1: Start Vite dev server (frontend)
npm run dev

# Terminal 2: Start Express server (backend)
npm run dev:server
```

Then open: `http://localhost:3000`

### Production Mode

```bash
# Build frontend
npm run build

# Start server (serves both frontend and API)
npm start
```

## Architecture with Backend

```
┌─────────────────────────────────────────┐
│   Browser                                │
│   - React UI                             │
│   - SVG Canvas                           │
└──────────────┬───────────────────────────┘
               │ HTTP
               ▼
┌─────────────────────────────────────────┐
│   Express Server (server.js)            │
│   - Serves React app                     │
│   - /api/ai/* endpoints                  │
│   - SVG processing                       │
└──────────────┬───────────────────────────┘
               │ HTTP/MCP
               ▼
┌─────────────────────────────────────────┐
│   Xibalba AI (MCP Server)               │
│   - AI generation                        │
│   - Vector processing                    │
└─────────────────────────────────────────┘
```

## Next Steps

1. **Install backend dependencies:**
   ```bash
   npm install
   ```

2. **Start the backend server:**
   ```bash
   npm run dev:server
   ```

3. **In another terminal, start frontend:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

The backend server will:
- ✅ Serve the React app
- ✅ Handle AI API requests
- ✅ Connect to Xibalba MCP
- ✅ Process SVG files

This should fix the visibility issue and enable all AI features!

