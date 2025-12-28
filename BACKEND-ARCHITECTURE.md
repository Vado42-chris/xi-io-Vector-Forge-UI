# VectorForge Backend Architecture

## Current Architecture

VectorForge is a **React frontend** that needs a **backend server** for AI features. Here's the architecture:

```
┌─────────────────────────────────────────┐
│   React Frontend (Browser)              │
│   - UI Components                       │
│   - SVG Canvas                          │
│   - Layer Management                    │
└──────────────┬──────────────────────────┘
               │ HTTP/MCP
               ▼
┌─────────────────────────────────────────┐
│   Backend Server (REQUIRED)             │
│   - Xibalba AI Service                  │
│   - SVG Processing                      │
│   - Vector Generation                   │
└─────────────────────────────────────────┘
```

## The Problem

**Current State:**
- ✅ Frontend works (React + Vite)
- ❌ Backend missing (AI features won't work)
- ❌ No vector processing engine

## Open Source Vector Graphics Tools (Reference)

### 1. **Inkscape** (Most Popular)
- **Type**: Desktop application
- **Format**: Native SVG editor
- **Backend**: GTK+ based, not web-based
- **Use Case**: Reference for SVG manipulation techniques

### 2. **SVG.js** (JavaScript Library)
- **Type**: JavaScript library
- **Format**: SVG manipulation in browser
- **Backend**: Client-side only
- **Use Case**: Could integrate for SVG editing

### 3. **Paper.js** (Vector Graphics)
- **Type**: JavaScript library
- **Format**: Vector graphics framework
- **Backend**: Client-side rendering
- **Use Case**: Canvas-based vector editing

### 4. **Fabric.js** (Canvas Library)
- **Type**: JavaScript library
- **Format**: HTML5 canvas manipulation
- **Backend**: Client-side
- **Use Case**: Object-based canvas editing

## Backend Options for VectorForge

### Option 1: Node.js Backend Server (Recommended)

Create a simple Express server that:
- Serves the React app
- Provides AI API endpoints
- Processes SVG files
- Connects to Xibalba MCP

**Pros:**
- Single language (JavaScript/TypeScript)
- Easy integration
- Can use existing Xibalba service

**Cons:**
- Requires Node.js server running

### Option 2: Python Backend (Using Inkscape Libraries)

Use Python with:
- `cairosvg` for SVG processing
- `svglib` for SVG manipulation
- FastAPI for API server
- Xibalba Python SDK

**Pros:**
- Powerful SVG processing
- Good AI library support
- Can leverage Inkscape's algorithms

**Cons:**
- Two languages (JS frontend, Python backend)
- More complex setup

### Option 3: Standalone Backend Service

Create a separate backend service that:
- Runs independently
- Provides REST API
- Handles all AI/processing
- Frontend connects via HTTP

**Pros:**
- Separation of concerns
- Can scale independently
- Language agnostic

**Cons:**
- More complex deployment
- Network overhead

## Recommended Solution: Node.js Backend

Let's create a simple Express server that:
1. Serves the React app
2. Provides `/api/ai/generate` endpoint
3. Connects to Xibalba MCP
4. Processes SVG requests

This keeps everything in one codebase and language.

## Next Steps

1. **Create Express backend server**
2. **Add API routes for AI features**
3. **Integrate Xibalba service**
4. **Update frontend to use backend API**
5. **Test end-to-end**

Would you like me to create the backend server now?

