# MCP Wrapper Implementation Plan
**Date:** January 27, 2025  
**Status:** 📋 Ready to Implement

---

## Overview

Build MCP (Model Context Protocol) wrapper that exposes FileSystemService to Zed and other local AI agents via WebSocket.

---

## Design Decisions

### ✅ Confirmed
1. **Binding:** `127.0.0.1:8080` (localhost only)
2. **Auth:** Shared token via `MCP_AUTH_TOKEN` env var
3. **Protocol:** JSON-RPC over WebSocket
4. **Rate Limit:** 100 requests/minute per connection
5. **Audit Log:** Log all operations

---

## Implementation

### 1. MCP Server Config

**File:** `config/mcpServerConfig.ts`

```typescript
export interface MCPServerConfig {
  enabled: boolean;
  host: string;
  port: number;
  authToken: string;
  rateLimit: {
    requestsPerMinute: number;
  };
}

export const DEFAULT_MCP_SERVER_CONFIG: MCPServerConfig = {
  enabled: process.env.ENABLE_MCP_SERVER === 'true',
  host: process.env.MCP_HOST || '127.0.0.1',
  port: parseInt(process.env.MCP_PORT || '8080', 10),
  authToken: process.env.MCP_AUTH_TOKEN || '',
  rateLimit: {
    requestsPerMinute: 100
  }
};
```

### 2. MCP Server Implementation

**File:** `services/fileSystemMCPServer.ts`

**Key Features:**
- WebSocket server
- JSON-RPC handler
- Auth validation
- Rate limiting
- Audit logging
- Uses existing FileSystemService

### 3. Integration

**In `server.js`:**
```typescript
// After server starts
if (process.env.ENABLE_MCP_SERVER === 'true') {
  const { startFileSystemMCPServer } = await import('./services/fileSystemMCPServer.js');
  const httpServer = app.listen(PORT);
  await startFileSystemMCPServer(httpServer);
  console.log('✅ File System MCP Server started on ws://127.0.0.1:8080');
}
```

---

## Testing

### Manual Test Script

**File:** `tests/mcp/testClient.js`

```javascript
import WebSocket from 'ws';

const ws = new WebSocket('ws://127.0.0.1:8080/mcp', {
  headers: {
    'Authorization': `Bearer ${process.env.MCP_AUTH_TOKEN}`
  }
});

ws.on('open', () => {
  console.log('Connected to MCP server');
  
  // Test read
  ws.send(JSON.stringify({
    id: 1,
    method: 'fs.read',
    params: { path: 'package.json' }
  }));
});

ws.on('message', (data) => {
  const response = JSON.parse(data.toString());
  console.log('Response:', response);
});
```

---

## Security Checklist

- [x] Path validation (already in FileSystemService)
- [x] Write protection (already in FileSystemService)
- [ ] Token-based auth (to implement)
- [ ] Rate limiting (to implement)
- [ ] Audit logging (to implement)
- [ ] Connection limits (max 10 concurrent)

---

## Next Steps

1. Create `config/mcpServerConfig.ts`
2. Create `services/fileSystemMCPServer.ts`
3. Integrate into `server.js`
4. Create test client
5. Test with Zed

---

**Ready to implement** ✅

