# Phase 1: Backend Integration Plan
**Connecting UI components to file system APIs**

---

## Overview

Phase 1 focuses on connecting the UI automation components to actual file system operations, enabling real functionality instead of simulated operations.

**Goal:** Make all UI components functional with real file operations.

**Timeline:** 2-3 weeks

---

## Priority 1: ProjectWizard Backend Integration

### Current State
- ✅ UI component complete
- ✅ Service skeleton created
- ❌ No file system operations

### Tasks

#### 1.1 Connect to File System API
- [ ] Update `projectWizardService.ts` to use `fileSystemClient`
- [ ] Implement `createProject()` method
- [ ] Create project directory structure
- [ ] Generate initial files (README, package.json, etc.)
- [ ] Handle errors gracefully

#### 1.2 Project Structure Generation
- [ ] Define project templates in `data/projectTemplates/`
- [ ] Support React, Node.js, TypeScript, Vanilla, Custom
- [ ] Generate appropriate file structure per type
- [ ] Add configuration files (tsconfig.json, .gitignore, etc.)

#### 1.3 Progress Tracking
- [ ] Add progress callbacks to `createProject()`
- [ ] Update UI with progress (0-100%)
- [ ] Show current operation (e.g., "Creating src/ directory")
- [ ] Handle cancellation

#### 1.4 Error Handling
- [ ] Validate project name (no invalid characters)
- [ ] Check if directory already exists
- [ ] Handle permission errors
- [ ] Provide rollback on failure
- [ ] Show clear error messages

### Implementation Example

```typescript
// services/projectWizardService.ts
import { fileSystemClient } from './fileSystemClient';

async createProject(
  details: ProjectDetails,
  features: string[],
  onProgress?: (progress: number, message: string) => void
): Promise<string> {
  const projectPath = `${details.location}/${details.name}`;
  
  // Create project directory
  await fileSystemClient.createDirectory(projectPath);
  onProgress?.(10, 'Created project directory');
  
  // Create subdirectories
  await fileSystemClient.createDirectory(`${projectPath}/src`);
  onProgress?.(20, 'Created src directory');
  
  // Generate files based on project type
  if (details.type === 'react') {
    await this.generateReactFiles(projectPath, features);
  }
  
  // ... more operations
  
  onProgress?.(100, 'Project created successfully');
  return projectPath;
}
```

---

## Priority 2: BatchOperations Backend Integration

### Current State
- ✅ UI component complete
- ✅ Service skeleton created
- ❌ Simulated operations only

### Tasks

#### 2.1 Connect to File System API
- [ ] Update `batchOperationService.ts` to use `fileSystemClient`
- [ ] Implement `batchCreate()`, `batchDelete()`, `batchMove()` methods
- [ ] Support file and directory operations
- [ ] Handle errors per file

#### 2.2 Progress Tracking
- [ ] Track progress per file (0-100%)
- [ ] Show current file being processed
- [ ] Show total files processed
- [ ] Handle cancellation

#### 2.3 Dry-Run Preview
- [ ] Add `previewOperation()` method
- [ ] Show what will happen before execution
- [ ] Display file list that will be affected
- [ ] Show estimated time
- [ ] Allow cancellation

#### 2.4 Undo Functionality
- [ ] Track operations in `lastOperation`
- [ ] Implement `undoOperation()` method
- [ ] Reverse create → delete
- [ ] Reverse delete → restore (if possible)
- [ ] Reverse move → move back

### Implementation Example

```typescript
// services/batchOperationService.ts
import { fileSystemClient } from './fileSystemClient';

async batchCreate(
  files: string[],
  onProgress?: (progress: number, currentFile: string) => void
): Promise<void> {
  const total = files.length;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      await fileSystemClient.createFile(file, '');
      onProgress?.(((i + 1) / total) * 100, file);
    } catch (error) {
      // Log error but continue with other files
      console.error(`Failed to create ${file}:`, error);
    }
  }
}
```

---

## Priority 3: TestGenerator Backend Integration

### Current State
- ✅ UI component complete
- ✅ Service skeleton created
- ❌ No test file generation

### Tasks

#### 3.1 Connect to File System API
- [ ] Update test generator to use `fileSystemClient`
- [ ] Implement `generateTestFile()` method
- [ ] Support Jest, Playwright, Vitest
- [ ] Generate appropriate test structure

#### 3.2 Code Analysis
- [ ] Analyze source file to understand structure
- [ ] Extract function/component names
- [ ] Generate appropriate test cases
- [ ] Add imports and setup

#### 3.3 Test Templates
- [ ] Create test templates in `data/templates/tests/`
- [ ] Support unit tests, integration tests, E2E tests
- [ ] Support different frameworks
- [ ] Add variable substitution

### Implementation Example

```typescript
// services/testGeneratorService.ts
import { fileSystemClient } from './fileSystemClient';

async generateTestFile(
  sourceFile: string,
  testType: 'unit' | 'integration' | 'e2e',
  framework: 'jest' | 'playwright' | 'vitest'
): Promise<string> {
  // Analyze source file
  const analysis = await this.analyzeSourceFile(sourceFile);
  
  // Generate test content
  const testContent = this.generateTestContent(analysis, testType, framework);
  
  // Create test file
  const testFilePath = this.getTestFilePath(sourceFile, testType);
  await fileSystemClient.createFile(testFilePath, testContent);
  
  return testFilePath;
}
```

---

## Priority 4: SchemaBuilder Backend Integration

### Current State
- ✅ UI component complete
- ✅ Service skeleton created
- ❌ No schema export

### Tasks

#### 4.1 Schema Export
- [ ] Implement `exportSchema()` method
- [ ] Support JSON Schema format
- [ ] Support TypeScript types
- [ ] Support Zod schemas
- [ ] Validate schema before export

#### 4.2 Schema Validation
- [ ] Add schema validation testing
- [ ] Test with sample data
- [ ] Show validation results
- [ ] Highlight errors

### Implementation Example

```typescript
// services/schemaBuilderService.ts
import { fileSystemClient } from './fileSystemClient';

async exportSchema(
  schema: JSONSchema,
  format: 'json-schema' | 'typescript' | 'zod',
  outputPath: string
): Promise<string> {
  let content: string;
  
  switch (format) {
    case 'json-schema':
      content = JSON.stringify(schema, null, 2);
      break;
    case 'typescript':
      content = this.convertToTypeScript(schema);
      break;
    case 'zod':
      content = this.convertToZod(schema);
      break;
  }
  
  await fileSystemClient.createFile(outputPath, content);
  return outputPath;
}
```

---

## Priority 5: Template System Enhancement

### Current State
- ✅ UI component complete
- ✅ Service with 5 hardcoded templates
- ❌ No file-based template loading

### Tasks

#### 5.1 File-Based Template Loading
- [ ] Load templates from `data/templates/` directory
- [ ] Support JSON template files
- [ ] Support template categories
- [ ] Add template metadata (version, author, etc.)

#### 5.2 Template Variable Substitution
- [ ] Support `{{variable}}` syntax
- [ ] Add variable validation
- [ ] Show variable preview
- [ ] Support default values

#### 5.3 Template Marketplace (Future)
- [ ] Load templates from remote source
- [ ] Support template ratings/reviews
- [ ] Support template search
- [ ] Support template updates

### Implementation Example

```typescript
// services/templateService.ts
async loadTemplates(): Promise<Template[]> {
  // Load from data/templates/ directory
  const categories = ['services', 'components', 'api-routes', 'types', 'tests'];
  const templates: Template[] = [];
  
  for (const category of categories) {
    const files = await fileSystemClient.listDirectory(`data/templates/${category}`);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fileSystemClient.readFile(`data/templates/${category}/${file}`);
        const template = JSON.parse(content);
        templates.push({ ...template, category });
      }
    }
  }
  
  return templates;
}
```

---

## Priority 6: Menu Action Audit Enhancement

### Current State
- ✅ UI component complete
- ✅ Shows sample data
- ❌ No actual menu parsing

### Tasks

#### 6.1 Menu Parsing
- [ ] Parse `ProfessionalFileMenu.tsx` for menu structure
- [ ] Extract menu items and actions
- [ ] Identify submenus
- [ ] Map actions to handlers

#### 6.2 Handler Detection
- [ ] Parse `App.hardened.tsx` for handler functions
- [ ] Match actions to handlers
- [ ] Identify missing handlers
- [ ] Identify incomplete handlers

#### 6.3 Code Generation
- [ ] Generate handler function stubs
- [ ] Generate API routes if needed
- [ ] Generate UI components if needed
- [ ] Add one-click fix functionality

### Implementation Example

```typescript
// services/menuActionAuditService.ts
async auditMenuActions(): Promise<MenuAction[]> {
  // Parse ProfessionalFileMenu.tsx
  const menuContent = await fileSystemClient.readFile('components/ProfessionalFileMenu.tsx');
  const menuItems = this.parseMenuItems(menuContent);
  
  // Parse App.hardened.tsx for handlers
  const appContent = await fileSystemClient.readFile('App.hardened.tsx');
  const handlers = this.parseHandlers(appContent);
  
  // Match actions to handlers
  const actions: MenuAction[] = menuItems.map(item => ({
    id: item.action,
    label: item.label,
    status: handlers.has(item.action) ? 'done' : 'missing',
    handler: handlers.get(item.action) || null,
  }));
  
  return actions;
}
```

---

## Implementation Order

### Week 1
1. ProjectWizard backend integration
2. BatchOperations backend integration

### Week 2
3. TestGenerator backend integration
4. SchemaBuilder backend integration

### Week 3
5. Template system enhancement
6. Menu action audit enhancement
7. Testing and bug fixes

---

## Testing Strategy

### Unit Tests
- [ ] Test each service method independently
- [ ] Mock file system operations
- [ ] Test error handling
- [ ] Test edge cases

### Integration Tests
- [ ] Test full workflows
- [ ] Test with real file system (temp directory)
- [ ] Test error recovery
- [ ] Test progress tracking

### E2E Tests
- [ ] Test complete user workflows
- [ ] Test with actual UI components
- [ ] Test accessibility
- [ ] Test performance

---

## Success Criteria

### Must Have
- ✅ All components connect to file system API
- ✅ All operations work with real files
- ✅ Error handling is robust
- ✅ Progress tracking works

### Should Have
- ✅ Dry-run preview for batch operations
- ✅ Undo functionality
- ✅ Template variable substitution
- ✅ Menu action code generation

### Nice to Have
- ✅ Template marketplace
- ✅ Advanced code analysis
- ✅ Schema validation testing
- ✅ Performance optimizations

---

## Risks and Mitigation

### Risk: File System Permissions
**Mitigation:** Validate permissions before operations, show clear error messages

### Risk: Large File Operations
**Mitigation:** Add progress tracking, allow cancellation, batch operations

### Risk: Data Loss
**Mitigation:** Add undo functionality, confirm destructive operations, backup before delete

### Risk: Performance Issues
**Mitigation:** Optimize file operations, add progress tracking, batch operations

---

## Documentation Updates

- [ ] Update user guides with real functionality
- [ ] Add API documentation
- [ ] Add troubleshooting guide
- [ ] Update deployment checklist

---

**Ready to start Phase 1!** 🚀

