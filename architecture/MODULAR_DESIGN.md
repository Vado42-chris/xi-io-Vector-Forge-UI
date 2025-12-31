# VectorForge: Modular Design Architecture

## Overview

VectorForge is built on a modular, service-oriented architecture that enables:

- **Progressive patching** - Small, incremental updates
- **Error intelligence** - Automatic error detection and repair
- **USB deployment** - Standalone installation from USB keys
- **Focus management** - AI agent coordination and checkpoint tracking

## Core Principles

### 1. Modular Services

Each service is self-contained and can be updated independently:

- `apiService.ts` - API communication
- `checkpointService.ts` - State checkpointing (prevents information loss)
- `focusManager.ts` - AI agent focus tracking
- `productRegistry.ts` - Component catalog
- `workflowLayoutService.ts` - UI layout management
- `securityService.ts` - Security and validation
- `errorLogger.ts` - Error tracking
- `errorIntelligence.ts` - Error analysis and repair suggestions

### 2. Progressive Patching

- Small patches (2-5 files per patch)
- MVP checkpoints for validation
- Browser testing at each checkpoint
- Git commits after each patch
- GitHub sync after each patch

### 3. Error Intelligence

- Automatic error detection
- Pattern recognition
- Suggested fixes
- Repair automation
- Error reporting and analytics

### 4. USB Deployment

- Standalone installation
- Error tracking on USB
- Repair tools included
- Offline operation
- Update mechanism

## Architecture Layers

### Layer 1: Services

Self-contained business logic modules

### Layer 2: Components

React UI components that consume services

### Layer 3: Data

Configuration and registry data (JSON)

### Layer 4: Infrastructure

Build tools, installers, error tracking

## Service Communication

Services communicate via:

- Direct imports (synchronous)
- Event system (asynchronous)
- State management (shared state)

## Error Handling

All services implement:

- Try/catch error boundaries
- Error logging
- Error reporting
- Graceful degradation

## Testing Strategy

- **Unit tests** - Service-level testing
- **Integration tests** - Service interaction testing
- **Browser tests** - Full UI validation at each checkpoint
- **Error tests** - Error scenario validation

## Deployment Strategy

1. **Development** - Local dev server
2. **Build** - Production build
3. **USB Package** - Create installer package
4. **Installation** - Install from USB
5. **Error Tracking** - Collect and analyze errors

## Next Steps

- Implement services incrementally
- Test at each checkpoint
- Document all changes
- Track all issues
- Sync to GitHub after each patch
