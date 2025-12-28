# Contributing to VectorForge

Thank you for contributing to VectorForge! This guide will help you get started.

---

## Quick Start

1. **Read the Documentation**
   - [Best Practices](docs/BEST_PRACTICES.md) - ⭐ **REQUIRED READING**
   - [Developer Guide](docs/DEVELOPER_GUIDE.md)
   - [Enforcement Mechanisms](docs/ENFORCEMENT_MECHANISMS.md)

2. **Set Up Your Environment**
   ```bash
   git clone <repository-url>
   cd xi-io-Vector-Forge-UI
   npm install
   npm run setup  # Sets up git hooks
   ```

3. **Run Local Checks**
   ```bash
   npm run enforce  # Runs all checks locally
   ```

4. **Make Your Changes**
   - Follow best practices
   - Write tests
   - Update documentation

5. **Submit a Pull Request**
   - Use the PR template
   - Ensure all checks pass
   - Get code review approval

---

## Critical Rules

### ⚠️ MUST FOLLOW

1. **NO Inline Styles** - Use CSS classes only
   ```tsx
   // ❌ WRONG
   <div style={{ backgroundColor: '#1e1e1e' }}>
   
   // ✅ CORRECT
   <div className="xibalba-card">
   ```

2. **ErrorBoundary Wrapper** - Wrap all components
   ```tsx
   <ErrorBoundary>
     <MyComponent />
   </ErrorBoundary>
   ```

3. **Service Layer Pattern** - Business logic in services
   ```tsx
   // ❌ WRONG - Logic in component
   const [data, setData] = useState([]);
   useEffect(() => {
     fetch('/api/data').then(r => r.json()).then(setData);
   }, []);
   
   // ✅ CORRECT - Logic in service
   import { dataService } from '../services/dataService';
   const [data, setData] = useState([]);
   useEffect(() => {
     dataService.getData().then(setData);
   }, []);
   ```

4. **TypeScript Strict Mode** - No `any` types
   ```tsx
   // ❌ WRONG
   const data: any = {};
   
   // ✅ CORRECT
   const data: MyType = {};
   // or
   const data: unknown = {};
   ```

5. **Accessibility** - ARIA labels, keyboard nav
   ```tsx
   <button
     aria-label="Close dialog"
     onClick={handleClose}
     onKeyDown={(e) => e.key === 'Enter' && handleClose()}
   >
     Close
   </button>
   ```

---

## Development Workflow

### 1. Before You Start
- [ ] Read [Best Practices](docs/BEST_PRACTICES.md)
- [ ] Check existing patterns in codebase
- [ ] Understand the architecture
- [ ] Set up your environment

### 2. While Developing
- [ ] Run `npm run enforce` frequently
- [ ] Write tests as you go
- [ ] Update documentation
- [ ] Follow naming conventions
- [ ] Use hashtags in comments

### 3. Before Committing
- [ ] Run `npm run enforce` (all checks pass)
- [ ] Write clear commit message
- [ ] Ensure no inline styles
- [ ] Check TypeScript compiles
- [ ] Verify accessibility

### 4. Pull Request
- [ ] Use PR template
- [ ] Link to documentation
- [ ] All CI checks pass
- [ ] Code review approval
- [ ] Documentation updated

---

## Code Standards

### File Naming
- **Components:** PascalCase (`MyComponent.tsx`)
- **Services:** camelCase (`myService.ts`)
- **Types:** camelCase (`myTypes.ts`)
- **Styles:** kebab-case (`xibalba-design-language.css`)

### Component Structure
```tsx
/**
 * Component Name
 * Purpose: What this component does
 * #hashtag: component-purpose
 */

import React, { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { someService } from '../services/someService';

interface ComponentProps {
  /** Description of prop */
  propName: string;
}

const Component: React.FC<ComponentProps> = ({ propName }) => {
  // Component implementation
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

### Commit Messages
```
type(scope): description

body (optional)

#hashtag: relevant-tag
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Testing

### Unit Tests
- Test services independently
- Test utility functions
- Mock external dependencies

### Integration Tests
- Test component + service integration
- Test user workflows
- Test error boundaries

### Accessibility Tests
- Run axe-core checks
- Test keyboard navigation
- Test with screen readers

---

## Team Collaboration

**Important:** VectorForge is a **team-based vector tool**. Team collaboration features are baseline/core, not optional.

When adding features:
- ✅ Consider both solo and team use cases
- ✅ Integrate with task management when relevant
- ✅ Use Action Center to surface important actions
- ✅ Follow API Black Hole patterns for external services

---

## Getting Help

- **Documentation:** Check `docs/` directory
- **Best Practices:** See `docs/BEST_PRACTICES.md`
- **Issues:** Open an issue on GitHub
- **Questions:** Check existing documentation first

---

## Enforcement

All code must pass:
- ✅ ESLint checks
- ✅ TypeScript strict mode
- ✅ Prettier formatting
- ✅ Inline style check
- ✅ Accessibility checks (axe-core)
- ✅ Pre-commit hooks
- ✅ CI/CD pipeline

**PRs will be blocked if any check fails.**

---

## Resources

- [Best Practices](docs/BEST_PRACTICES.md)
- [Developer Guide](docs/DEVELOPER_GUIDE.md)
- [Enforcement Mechanisms](docs/ENFORCEMENT_MECHANISMS.md)
- [Plugin/Addon/Extension Definitions](docs/PLUGIN_ADDON_EXTENSION_DEFINITIONS.md)
- [Tool Standardization](docs/TOOL_STANDARDIZATION.md)

---

**Thank you for contributing to VectorForge!** 🎨

