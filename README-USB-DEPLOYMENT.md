# VectorForge - USB Deployment Guide

## Standalone Portable Installation

VectorForge is designed to run as a fully standalone, portable application that can be installed from a USB key and runs locally with Xibalba AI integration.

## Quick Start

### 1. Installation from USB

```bash
# Copy the entire VectorForge folder to USB drive
# On target machine, run:
cd /path/to/usb/VectorForge
./scripts/install.sh
```

Or manually:
```bash
npm install
npm run build
```

### 2. Configure Xibalba AI

```bash
# Run the setup script
./scripts/setup-xibalba.sh
```

Or manually edit `.env.local`:
```env
VITE_XIBALBA_MCP_URL=http://localhost:8000
VITE_XIBALBA_API_KEY=your_key_here
VITE_XIBALBA_MODEL=xibalba-local
VITE_XIBALBA_ENDPOINT=/api/v1/chat/completions
```

### 3. Launch

```bash
# Development mode
npm run dev

# Or use launcher
./launch.sh
```

## Architecture

### Local AI Integration

VectorForge uses **Xibalba AI** via MCP (Model Context Protocol) for local AI processing:

- **No Internet Required**: All AI processing happens locally
- **MCP Protocol**: Connects to local Xibalba MCP server
- **Fallback HTTP**: If MCP unavailable, falls back to HTTP API
- **Portable Config**: Configuration stored in localStorage for USB deployment

### Service Layer

The app uses `services/xibalbaService.ts` which:
1. Checks for MCP client connection
2. Falls back to HTTP API if MCP unavailable
3. Uses localStorage config if environment variables not available
4. Fully portable - no hardcoded dependencies

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_XIBALBA_MCP_URL` | `http://localhost:8000` | MCP server URL |
| `VITE_XIBALBA_API_KEY` | (empty) | API key if required |
| `VITE_XIBALBA_MODEL` | `xibalba-local` | AI model name |
| `VITE_XIBALBA_ENDPOINT` | `/api/v1/chat/completions` | API endpoint |

### LocalStorage Configuration

The app can also read configuration from `localStorage.getItem('xibalba_config')`:

```javascript
{
  "mcpServerUrl": "http://localhost:8000",
  "apiKey": "your_key",
  "model": "xibalba-local",
  "endpoint": "/api/v1/chat/completions"
}
```

This makes it fully portable - no `.env` file needed!

## USB Deployment

### Creating USB Package

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Copy to USB:**
   ```bash
   cp -r /path/to/VectorForge /media/usb/
   ```

3. **Include these files:**
   - All source files
   - `node_modules/` (or run `npm install` on target)
   - `package.json` and `package-lock.json`
   - `scripts/install.sh` and `scripts/setup-xibalba.sh`
   - `.env.local` template (optional)

### On Target Machine

1. **Install dependencies:**
   ```bash
   cd /media/usb/VectorForge
   npm install
   ```

2. **Configure Xibalba:**
   ```bash
   ./scripts/setup-xibalba.sh
   ```

3. **Launch:**
   ```bash
   ./launch.sh
   ```

## Requirements

- **Node.js**: 18+ (checked by install script)
- **Xibalba MCP Server**: Running on localhost:8000 (or configured port)
- **Browser**: Modern browser with ES6+ support

## Troubleshooting

### MCP Server Not Found

If you see "MCP server not responding":
1. Ensure Xibalba MCP server is running
2. Check the port in `.env.local`
3. The app will fall back to HTTP API automatically

### Configuration Not Loading

The app checks in this order:
1. Environment variables (`.env.local`)
2. localStorage (`xibalba_config`)
3. Default values

To set localStorage config manually:
```javascript
localStorage.setItem('xibalba_config', JSON.stringify({
  mcpServerUrl: 'http://localhost:8000',
  apiKey: 'your_key',
  model: 'xibalba-local',
  endpoint: '/api/v1/chat/completions'
}));
```

### Port Conflicts

If port 3000 is in use, Vite will automatically use the next available port. Check the console output for the actual URL.

## Production Build

For production deployment:

```bash
npm run build
npm run preview
```

The built files are in `dist/` and can be served by any static file server.

## License

Xibalba OS Sovereign - VectorForge Engine

