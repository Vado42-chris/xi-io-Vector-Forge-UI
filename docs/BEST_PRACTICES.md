# VectorForge Development Best Practices
**Last Updated:** January 27, 2025  
**Status:** Living Document - Updated as we learn

---

## Purpose

This document captures **everything we've learned** building VectorForge. It's our guide for maintaining quality, consistency, and preventing mistakes. **All developers (AI and human) must follow these practices.**

---

## Core Principles (What We've Learned)

### 1. Team-Based Architecture
**Lesson:** VectorForge is a **team-based vector tool**, not just a vector editor.

**Practice:**
- ✅ Team collaboration features (task management, sprint planning, Action Center) are **baseline/core**, not optional
- ✅ Always consider both solo and team use cases
- ✅ Integrate with task management when relevant
- ✅ Use API Black Hole patterns for external services

**Enforcement:** Documentation review, code review checklist

---

### 2. No Inline Styles
**Lesson:** Inline styles break the Xibalba design system and make maintenance impossible.

**Practice:**
- ✅ **NEVER** use inline styles (`style={{...}}`)
- ✅ Always use CSS classes from Xibalba design system
- ✅ Use CSS custom properties (`var(--xibalba-*)`)
- ✅ Define new classes in `styles/xibalba-design-language.css`

**Enforcement:** ESLint rule `react/no-inline-styles`, pre-commit hook

**Example:**
```tsx
// ❌ WRONG
<div style={{ backgroundColor: '#1e1e1e', padding: '10px' }}>

// ✅ CORRECT
<div className="xibalba-card p-2">
```

---

### 3. Error Boundaries Everywhere
**Lesson:** One component crash shouldn't kill the entire app.

**Practice:**
- ✅ Wrap all major components in `ErrorBoundary`
- ✅ Use `ErrorBoundary` from `components/ErrorBoundary.tsx`
- ✅ Log errors to `errorLogger` service
- ✅ Show user-friendly error messages

**Enforcement:** Component review checklist, automated testing

**Example:**
```tsx
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

---

### 4. Service Layer Pattern
**Lesson:** Business logic belongs in services, not components.

**Practice:**
- ✅ All business logic in `services/` directory
- ✅ Services are stateless singletons
- ✅ Components call services, services handle logic
- ✅ Services use TypeScript strict mode

**Enforcement:** Code review, architecture review

**Example:**
```tsx
// ❌ WRONG - Logic in component
const MyComponent = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
};

// ✅ CORRECT - Logic in service
import { dataService } from '../services/dataService';
const MyComponent = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    dataService.getData().then(setData);
  }, []);
};
```

---

### 5. Type Safety First
**Lesson:** TypeScript catches bugs before runtime.

**Practice:**
- ✅ Use TypeScript strict mode
- ✅ Define types in `types/` directory
- ✅ Use type guards for runtime validation
- ✅ Never use `any` (use `unknown` if needed)

**Enforcement:** TypeScript compiler, strict mode enabled

---

### 6. Accessibility from Start
**Lesson:** Accessibility is harder to add later.

**Practice:**
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators visible
- ✅ Screen reader friendly
- ✅ WCAG 2.1 AA compliance

**Enforcement:** axe-core automated checks, manual testing

---

### 7. Progressive Patching
**Lesson:** Small, incremental changes are safer and easier to review.

**Practice:**
- ✅ Small patches (2-5 files per patch)
- ✅ MVP checkpoints for validation
- ✅ Browser testing at each checkpoint
- ✅ Git commits after each patch
- ✅ GitHub sync after each patch

**Enforcement:** Git workflow, PR size limits

---

### 8. Documentation as Code
**Lesson:** Documentation that's separate from code gets outdated.

**Practice:**
- ✅ Document in code (JSDoc comments)
- ✅ Update docs when code changes
- ✅ Use hashtags for searchability (`#hashtag: purpose`)
- ✅ Keep README and docs/ in sync

**Enforcement:** Documentation review in PRs

---

### 9. Construction Paper Layer
**Lesson:** Text readability over busy backgrounds requires intermediary layer.

**Practice:**
- ✅ Use `.construction-paper-layer-menu` for menus over busy backgrounds
- ✅ Semi-transparent grey background with noise texture
- ✅ Ensures text contrast and readability

**Enforcement:** Visual review, accessibility checks

---

### 10. Menu Stability
**Lesson:** Flakey menus that disappear on hover are unusable.

**Practice:**
- ✅ Use `setTimeout`/`clearTimeout` for hover delays (150ms)
- ✅ Prevent premature closing
- ✅ Allow mouse movement to dropdown without closing

**Enforcement:** Interaction testing, user testing

---

## Component Standards

### Component Structure
```tsx
/**
 * Component Name
 * Purpose: What this component does
 * #hashtag: component-purpose
 */

import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { someService } from '../services/someService';

interface ComponentProps {
  // Props with JSDoc
  /** Description of prop */
  propName: string;
}

const Component: React.FC<ComponentProps> = ({ propName }) => {
  // State
  const [state, setState] = useState<string>('');
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Handlers
  const handleAction = () => {
    // Handler logic
  };
  
  // Render
  return (
    <ErrorBoundary>
      <div className="xibalba-card">
        {/* Component content */}
      </div>
    </ErrorBoundary>
  );
};

export default Component;
```

### Required Elements
- ✅ ErrorBoundary wrapper
- ✅ TypeScript interface for props
- ✅ JSDoc comments
- ✅ Hashtags for searchability
- ✅ CSS classes (no inline styles)

---

## Service Standards

### Service Structure
```typescript
/**
 * Service Name
 * Purpose: What this service does
 * #hashtag: service-purpose
 */

class ServiceName {
  private static instance: ServiceName;
  
  private constructor() {
    // Private constructor for singleton
  }
  
  static getInstance(): ServiceName {
    if (!ServiceName.instance) {
      ServiceName.instance = new ServiceName();
    }
    return ServiceName.instance;
  }
  
  async methodName(params: ParamType): Promise<ReturnType> {
    try {
      // Service logic
      return result;
    } catch (error) {
      console.error('ServiceName.methodName error:', error);
      throw error;
    }
  }
}

export const serviceName = ServiceName.getInstance();
```

### Required Elements
- ✅ Singleton pattern
- ✅ TypeScript strict types
- ✅ Error handling
- ✅ JSDoc comments
- ✅ Hashtags

---

## File Naming Conventions

### Components
- PascalCase: `MyComponent.tsx`
- Descriptive names: `ToolPropertiesPanel.tsx` not `Panel.tsx`

### Services
- camelCase: `myService.ts`
- Descriptive names: `taskManagementService.ts`

### Types
- camelCase: `myTypes.ts`
- Descriptive names: `plugin.ts`, `task.ts`

### Styles
- kebab-case: `xibalba-design-language.css`
- Descriptive names

---

## Git Workflow

### Commit Messages
```
type(scope): description

body (optional)

#hashtag: relevant-tag
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

**Example:**
```
feat(menu): add construction paper layer for readability

Added .construction-paper-layer-menu class to improve text
readability over busy backgrounds in menu dropdowns.

#hashtag: menu-ui accessibility
```

### Branch Naming
- `feature/feature-name`
- `fix/bug-description`
- `docs/documentation-update`

---

## Testing Standards

### Unit Tests
- ✅ Test services independently
- ✅ Test utility functions
- ✅ Mock external dependencies
- ✅ Test error cases

### Integration Tests
- ✅ Test component + service integration
- ✅ Test user workflows
- ✅ Test error boundaries

### Accessibility Tests
- ✅ axe-core automated checks
- ✅ Keyboard navigation
- ✅ Screen reader testing

---

## Performance Standards

### Code Splitting
- ✅ Lazy load heavy components
- ✅ Code split by route
- ✅ Dynamic imports for plugins

### Optimization
- ✅ Memoize expensive computations
- ✅ Debounce/throttle user input
- ✅ Virtualize long lists

---

## Security Standards

### Input Validation
- ✅ Validate all user input
- ✅ Sanitize before rendering
- ✅ Use `securityService` for validation

### Code Execution
- ✅ Sandbox plugin execution
- ✅ Use `codeSecurityService` for safe execution
- ✅ Limit permissions

---

## What We're Failing At (Areas Needing Improvement)

### 1. Test Coverage
**Status:** ❌ No test suite exists  
**Impact:** High risk of regressions  
**Action:** Create test suite, aim for >60% coverage

### 2. Performance Monitoring
**Status:** ⚠️ No performance metrics  
**Impact:** Don't know where bottlenecks are  
**Action:** Add performance monitoring, profiling

### 3. Documentation Completeness
**Status:** ⚠️ Some features undocumented  
**Impact:** Hard for new developers  
**Action:** Document all features, keep updated

### 4. Plugin System Implementation
**Status:** ⚠️ Architecture exists, not implemented  
**Impact:** Can't extend functionality  
**Action:** Implement plugin system per architecture

### 5. Tool Standardization
**Status:** ⚠️ Tools not fully standardized  
**Impact:** Inconsistent tool behavior  
**Action:** Standardize tool palettes, panes, properties, automations

---

## Enforcement Mechanisms

### Automated Checks
1. **ESLint** - Code quality, no inline styles
2. **TypeScript** - Type safety, strict mode
3. **Prettier** - Code formatting
4. **axe-core** - Accessibility checks
5. **Pre-commit hooks** - Run checks before commit

### Code Review Checklist
- [ ] No inline styles
- [ ] ErrorBoundary wrapper
- [ ] TypeScript types defined
- [ ] Service layer pattern followed
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Documentation updated
- [ ] Tests added/updated

### CI/CD Pipeline
- [ ] Lint passes
- [ ] TypeScript compiles
- [ ] Tests pass
- [ ] Accessibility checks pass
- [ ] Build succeeds

---

## Learning Log

### What We've Learned (Chronological)

1. **Menu Stability** - Need timeout delays for hover
2. **Construction Paper Layer** - Required for text readability
3. **Team-Based Architecture** - Core feature, not optional
4. **No Inline Styles** - Breaks design system
5. **Error Boundaries** - Prevent app crashes
6. **Service Layer** - Separates concerns
7. **Progressive Patching** - Safer incremental changes

---

**Last Updated:** January 27, 2025  
**Next Review:** After each major feature completion

