# Phase 1: Quick Reference Guide

**Quick access to Phase 1 features and documentation**

---

## 🚀 Quick Start

### Create a Project
```
Action Center → "Set Up Project"
OR
File Menu → New Project
```

### Generate Tests
```
Action Center → "Generate Tests"
OR
Tools Menu → Test Generator
```

### Create Schema
```
Action Center → "Create Schema"
OR
Tools Menu → Schema Builder
```

### Batch File Operations
```
Action Center → "Batch Create Files"
OR
Tools Menu → Batch Operations
```

### Browse Templates
```
Action Center → "Browse Templates"
OR
File Menu → Templates
```

### Audit Menu Actions
```
Action Center → "Fix Menu Actions"
OR
Tools Menu → Action Center Audit
```

---

## 📁 File Locations

### Services
- `services/fileSystemService.ts` - Core file operations
- `services/fileSystemClient.ts` - Frontend client
- `services/projectWizardService.ts` - Project creation
- `services/batchOperationService.ts` - Batch operations
- `services/testGeneratorService.ts` - Test generation
- `services/schemaBuilderService.ts` - Schema export
- `services/templateService.ts` - Template management
- `services/menuActionAuditService.ts` - Menu auditing

### API Routes
- `api/filesystem.js` - File system API

### Components
- `components/ProjectWizard.tsx` - Project wizard
- `components/BatchOperationsPanel.tsx` - Batch operations
- `components/TestGeneratorPanel.tsx` - Test generator
- `components/SchemaBuilder.tsx` - Schema builder
- `components/TemplateLibrary.tsx` - Template library
- `components/ActionCenterAudit.tsx` - Menu audit

---

## 🔧 API Usage

### Create Directory
```typescript
import { FileSystemClient } from './services/fileSystemClient';
const fs = new FileSystemClient();
await fs.createDirectory('projects/my-project');
```

### Write File
```typescript
await fs.writeFile('projects/my-project/README.md', '# My Project');
```

### Delete File
```typescript
await fs.deleteFile('projects/my-project/temp.txt');
```

### Move File
```typescript
await fs.moveFile('source.txt', 'destination.txt');
```

---

## 🎯 Common Tasks

### Create a React Project
1. Open ProjectWizard
2. Enter project name
3. Select "React" type
4. Add features (TypeScript, Testing)
5. Click "Create Project"

### Generate Tests for a File
1. Open TestGenerator
2. Navigate to source file
3. Select file
4. Choose test type (Unit/Integration/E2E)
5. Configure options
6. Click "Generate Tests"

### Export Schema
1. Open SchemaBuilder
2. Build schema visually
3. Choose export format (JSON Schema/TypeScript/Zod)
4. Enter file path
5. Click "Export Schema"

### Batch Create Files
1. Open BatchOperations
2. Navigate to directory
3. Select files (or create new)
4. Choose "Create" operation
5. Click "Execute Operation"

---

## 🔒 Security Notes

- All operations restricted to allowed paths
- Path validation prevents directory traversal
- Critical files protected from deletion
- Error handling prevents crashes

**Allowed Paths:**
- `projects/`
- `test-projects/`
- `tmp/`
- `data/`
- `var/`

---

## 📚 Documentation

- **User Guide:** `PHASE_1_READY_FOR_USE.md`
- **Complete Summary:** `PHASE_1_COMPLETE.md`
- **Testing:** `PHASE_1_TESTING_CHECKLIST.md`
- **Handoff:** `PHASE_1_MASTER_HANDOFF.md`

---

## 🐛 Troubleshooting

### "Path not allowed" Error
- Check that path starts with allowed directory
- Use `projects/`, `test-projects/`, `tmp/`, `data/`, or `var/`

### "File not found" Error
- Verify file path is correct
- Check file exists in allowed directory
- Ensure path is relative to project root

### "Operation failed" Error
- Check file permissions
- Verify directory exists
- Check disk space
- Review error message for details

---

## ✅ Status Check

**Phase 1:** ✅ 100% Complete
- All services: ✅ Working
- All components: ✅ Functional
- All APIs: ✅ Operational
- Security: ✅ In place
- Documentation: ✅ Complete

---

**Quick Reference: Ready!** 🚀

