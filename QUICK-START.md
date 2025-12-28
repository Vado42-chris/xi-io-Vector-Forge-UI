# VectorForge Quick Start Guide

## The Problem

You can't see the UI because:
1. **React app loads but needs a backend** for AI features
2. **No server running** to handle API requests
3. Frontend tries to call Xibalba AI but there's no backend endpoint

## Open Source Vector Graphics Tools (Reference)

### Inkscape (Most Popular)
- **What**: Full-featured SVG editor (like Adobe Illustrator)
- **Install**: `sudo apt install inkscape`
- **Use**: Reference for vector editing patterns

### SVG.js / Paper.js / Fabric.js
- JavaScript libraries for SVG/canvas manipulation
- Could integrate for client-side editing

## Solution: Backend Server

I've created a **Node.js Express server** (`server.js`) that:
- ✅ Serves the React app
- ✅ Provides `/api/ai/*` endpoints
- ✅ Connects to Xibalba MCP
- ✅ Handles SVG processing

## How to Run

### Option 1: Development (Recommended)

**Terminal 1 - Backend Server:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend (Vite):**
```bash
npm run dev
```

**Open Browser:**
```
http://localhost:3000
```

### Option 2: Production

```bash
npm run build
npm start
```

Then open: `http://localhost:3000`

## Architecture

```
Browser → Express Server → Xibalba AI (MCP)
   ↓            ↓
React UI    API Endpoints
```

## What the Backend Does

1. **Serves React App** - Makes the UI accessible
2. **API Endpoints**:
   - `POST /api/ai/generate` - Generate SVG from text
   - `POST /api/ai/suggestions` - Get AI suggestions
   - `POST /api/ai/image-to-vector` - Convert image to SVG
3. **Connects to Xibalba** - Uses your local MCP server
4. **Processes Requests** - Handles all AI operations

## Next Steps

1. **Start the backend:**
   ```bash
   npm run dev:server
   ```

2. **In another terminal, start frontend:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   ```
   http://localhost:3000
   ```

The backend server will make the UI fully functional with AI features!

## Troubleshooting

**UI still not visible?**
- Check browser console for errors
- Ensure both servers are running
- Try `http://localhost:5173` (Vite default port)

**AI features not working?**
- Ensure Xibalba MCP server is running on port 8000
- Check `.env.local` configuration
- Backend will fall back to HTTP API if MCP unavailable

