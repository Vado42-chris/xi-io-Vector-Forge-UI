# VectorForge Developer Guide
**For AI Developers, Contributors, and Future Maintainers**

## Purpose

This guide explains VectorForge's architecture, development patterns, and how to continue development if the original developer is unavailable.

**Important:** VectorForge is a **team-based vector tool**. Team collaboration features (task management, sprint planning, Action Center) are **baseline/core features**, not optional. The platform is designed for both solo creators and teams.

## System Architecture

### Core Principles

1. **Modular Service Layer** - Business logic in services, not components
2. **Type Safety First** - TypeScript strict mode, comprehensive types
3. **Component Isolation** - Error boundaries, self-contained components
4. **Security by Default** - Code sandboxing, CSP headers, input validation
5. **Xibalba Design System** - Consistent UI patterns, no inline styles

### Architecture Layers

```
┌─────────────────────────────────────┐
│      React Components (UI)          │
│  - ErrorBoundary isolation          │
│  - Props-based communication        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Service Layer (Logic)          │
│  - Stateless services               │
│  - Singleton pattern                │
│  - localStorage persistence        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Type System                    │
│  - Comprehensive interfaces         │
│  - Type guards                      │
│  - Runtime validation               │
└─────────────────────────────────────┘
```

## Key Services

### Core Services

**`checkpointService.ts`** - Incremental save system
- Prevents work loss
- Browser (IndexedDB) and Node.js (file system) support
- Auto-saves at intervals

**`errorLogger.ts`** - Centralized error tracking
- Global error handlers
- localStorage persistence
- Export functionality

**`errorIntelligence.ts`** - Error analysis
- Pattern detection
- Trend analysis
- Actionable insights

**`workflowLayoutService.ts`** - UI layout management
- Multiple layout presets
- Panel visibility control
- Custom layout creation

**`productRegistry.ts`** - Component catalog
- Tracks all components/services
- Status and dependency tracking
- Search functionality

**`securityService.ts`** - Security validation
- Script validation
- Input sanitization
- URL validation

**`codeSecurityService.ts`** - Code execution sandbox
- Safe code execution
- Timeout management
- API restrictions

**`taskManagementService.ts`** - Team task management (Baseline Feature)
- Task CRUD operations
- Sprint management
- Task assignment and tracking
- Integration with VectorForge items

**`vectorForgeTaskLinkService.ts`** - Link tasks to VectorForge items
- Link tasks to vector layers
- Link tasks to animation keyframes
- Link tasks to scripts
- Bidirectional sync

**`apiService.ts`** - API Black Hole foundation
- Unified API abstraction
- Backend-agnostic architecture
- Foundation for team collaboration APIs

### Feature Services

**`scriptParser.ts`** - Hashtag script parsing
- Plain language command parsing
- Action script generation

**`scriptExecutor.ts`** - Script execution
- Safe script running
- Animation integration

**`localAIService.ts`** - Local AI integration
- GGUF model support
- MCP protocol integration

## Component Patterns

### Standard Component Structure

```typescript
import React, { useState, useEffect, useCallback } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { someService } from '../services/someService';

interface ComponentProps {
  // Props here
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // State
  const [state, setState] = useState<StateType>(initialState);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Callbacks
  const handleAction = useCallback(() => {
    // Action logic
  }, [dependencies]);
  
  return (
    <ErrorBoundary>
      {/* JSX */}
    </ErrorBoundary>
  );
};

export default Component;
```

### Critical Rules

1. **No Inline Styles** - Use CSS classes and custom properties
2. **Error Boundaries** - Wrap risky components
3. **Type Guards** - Validate data at runtime
4. **Service Layer** - Business logic in services, not components
5. **Xibalba Theme** - Use theme variables, not hardcoded colors

## Development Workflow

### Making Changes

1. **Plan First** - Check existing documentation
2. **Create Service** - If new functionality, create service first
3. **Add Types** - Define TypeScript interfaces
4. **Build Component** - Create UI component
5. **Test** - Verify in browser
6. **Document** - Update relevant docs

### Code Standards

- **TypeScript Strict Mode** - All code must type-check
- **No `any` Types** - Use proper types or `unknown`
- **Error Handling** - Always handle errors gracefully
- **Accessibility** - ARIA labels, keyboard navigation
- **Performance** - Use `useCallback`, `useMemo` appropriately

## File Organization

```
components/          # React components
  ├── Core/         # App, Canvas, etc.
  ├── UI/           # Buttons, panels, etc.
  └── Features/     # Feature-specific components

services/            # Business logic
  ├── Core/         # Essential services
  ├── Features/     # Feature services
  └── Integration/  # External integrations

types/               # TypeScript definitions
  ├── api.ts        # API types
  ├── registry.ts   # Registry types
  └── workflow.ts   # Workflow types

styles/              # CSS files
  ├── xibalba-*.css # Theme files
  └── *.css         # Component styles
```

## Testing Strategy

### Current State
- ❌ No automated tests
- ✅ Manual browser testing
- ✅ Error logging for runtime issues

### Recommended Testing

1. **Unit Tests** - Services and utilities
2. **Component Tests** - React Testing Library
3. **Integration Tests** - User workflows
4. **E2E Tests** - Critical paths

## Common Tasks

### Adding a New Feature

1. Define types in `types/`
2. Create service in `services/`
3. Build component in `components/`
4. Integrate into `App.hardened.tsx`
5. Add to product registry
6. Document in relevant docs

### Fixing a Bug

1. Check error logs in Error Dashboard
2. Reproduce in browser
3. Identify root cause
4. Fix in service or component
5. Test thoroughly
6. Update documentation if needed

### Adding a New Service

```typescript
// services/newService.ts
class NewService {
  private state: ServiceState;
  
  async initialize(): Promise<void> {
    // Initialization
  }
  
  // Public methods
  public method(): ReturnType {
    // Implementation
  }
}

export const newService = new NewService();
```

## Debugging

### Error Dashboard
Access via `VIEW_ERROR_DASHBOARD` action or Error Dashboard component.

### Browser DevTools
- React DevTools for component inspection
- Network tab for API calls
- Console for service logs

### Logging
- Services log to `errorLogger`
- Components use `console` for development
- Production logging via error service

## Known Patterns

### State Management
- React `useState` for component state
- `localStorage` for persistence
- Services for shared state

### Data Flow
```
User Action → Component → Service → State Update → Re-render
```

### Error Handling
```
Component Error → ErrorBoundary → errorLogger → Error Dashboard
```

## Continuing Development

### If Original Developer Unavailable

1. **Read This Guide** - Understand architecture
2. **Review Codebase** - Check services and components
3. **Check Documentation** - Review all docs in `docs/`
4. **Start Small** - Fix bugs before adding features
5. **Follow Patterns** - Match existing code style
6. **Test Thoroughly** - Verify in browser
7. **Document Changes** - Update relevant docs

### Priority Order

1. **Critical Bugs** - App crashes, data loss
2. **MVP Features** - Core functionality
3. **Polish** - UI improvements
4. **Advanced Features** - Nice-to-haves

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Xibalba Framework Docs](docs/) (in this repo)
- [SVG Specification](https://www.w3.org/TR/SVG/)

## Questions?

- Check existing documentation first
- Review code comments
- Examine similar implementations
- Test in browser to understand behavior

---

**Remember:** This is a learning tool. Make it educational, accessible, and user-friendly.


