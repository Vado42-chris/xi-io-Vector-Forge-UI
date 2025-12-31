# Go Live Checklist

## Pre-Launch Requirements

### Critical (P0) - Must Have

- [x] Intent parsing fixed (distinguishes questions from commands)
- [ ] Rate limiting implemented (prevents runaway self-modification)
- [ ] AST-based code understanding (precise code analysis)

### Safety (P1) - Should Have

- [ ] User confirmation dialogs for self-modification
- [ ] Code diff preview before swap
- [ ] Improved rollback + reload tracking + post-reload health check
- [x] File-level concurrency protection
- [x] Backup validation + security + cleanup

### Architecture (P2) - Nice to Have

- [ ] Connect to xibalbaService
- [ ] Rosetta Stone service (protocol translation)
- [ ] VPN Blackhole service (unified API)
- [ ] Handshaking service (discovery/negotiation)

- [ ] Enhanced RAG with semantic search

## Testing Checklist

- [ ] Dev server starts correctly
- [ ] Ollama integration works (no canned responses)
- [ ] Self-modification works end-to-end
- [ ] Rollback works correctly
- [ ] Backup cleanup works
- [ ] Security validation catches dangerous code

- [ ] File operations work (read, write, execute)
- [ ] Intent parsing correctly identifies questions vs commands

## Deployment Checklist

- [ ] All dependencies installed
- [ ] Build succeeds (`npm run build`)
- [ ] Production server tested
- [ ] USB key deployment tested

- [ ] Local AI (Ollama) setup documented

- [ ] Error handling verified
- [ ] Logging configured

## Status

**Current Progress:** 2/15 tasks complete (13%)

- ✅ P0 #1: Intent parsing fix
- ✅ P1 #7c: Backup validation + security + cleanup

**Next Steps:**

1. File-level concurrency protection (P1 #7b)
2. Rate limiting (P0 #2)
3. User confirmation dialogs (P1 #4)
