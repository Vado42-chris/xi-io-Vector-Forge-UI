# UI Automation Guide
**User Guide for VectorForge UI Automation Features**

## Overview

VectorForge includes powerful UI automation tools that let you create projects, generate code, and manage files—all through visual interfaces. No command line required!

---

## Getting Started

All UI automation tools are accessible from the **Action Center** (bottom-right of the screen). When you're all caught up with tasks, you'll see automation actions like:

- **Set Up Project** - Create a new project
- **Browse Templates** - Find code templates
- **Generate Tests** - Create test files
- **Fix Menu Actions** - Audit and fix menu handlers
- **Create Schema** - Build JSON schemas
- **Batch Create Files** - Manage multiple files at once

---

## Project Wizard

**What it does:** Helps you create a new project with the right structure.

**How to use:**
1. Click "Set Up Project" in Action Center
2. **Step 1:** Read the welcome message
3. **Step 2:** Enter project name, choose type (React, Node.js, etc.), set location
4. **Step 3:** Select a template (or skip)
5. **Step 4:** Choose optional features (TypeScript, Testing, Linting, Git)
6. **Step 5:** Review your settings
7. Click "Create Project"

**Tips:**
- Project names can only contain letters, numbers, hyphens, and underscores
- You can always add features later
- Use the "Back" button to change previous steps

---

## Template Library

**What it does:** Browse and use code templates for services, components, API routes, and more.

**How to use:**
1. Click "Browse Templates" in Action Center
2. Use the search bar to find templates
3. Click category buttons to filter (All, Services, Components, etc.)
4. Click a template card to see a preview
5. Click "Use This Template" to generate code

**Tips:**
- Templates include TypeScript, React, Express.js patterns
- Preview shows the actual code before you use it
- Templates are organized by category

---

## Batch Operations Panel

**What it does:** Create, delete, move, or copy multiple files at once.

**How to use:**
1. Click "Batch Create Files" in Action Center
2. Navigate to the directory you want to work with
3. Check the boxes next to files you want to operate on
4. Choose an operation (Create, Delete, Move, Copy)
5. If moving/copying, enter the destination path
6. Review the preview
7. Click the operation button
8. Use "Undo Last Operation" if needed

**Tips:**
- Use the file tree to navigate directories
- Check the preview before confirming operations
- Undo is available for all operations

---

## Schema Builder

**What it does:** Create JSON schemas visually—no JSON writing required!

**How to use:**
1. Click "Create Schema" in Action Center
2. Enter a schema name
3. Click "Add Field" to create fields
4. Select a field to edit:
   - Field name (required)
   - Field type (string, number, boolean, etc.)
   - Description
   - Required checkbox
   - Validation rules (min/max for numbers, patterns for strings)
5. Toggle "JSON Preview" to see the generated schema
6. Click "Generate Schema" when done

**Tips:**
- Drag fields to reorder (coming soon)
- Use the preview to see the JSON as you build
- Validation rules help ensure data quality

---

## Action Center Audit

**What it does:** Shows which menu actions are working and which need handlers.

**How to use:**
1. Click "Fix Menu Actions" in Action Center
2. See the status of all menu actions:
   - ✅ Done - Working correctly
   - ⚠️ Needs Work - Partially implemented
   - ❌ Missing - No handler yet
3. Use filter buttons to see only missing actions
4. Check boxes to select actions to fix
5. Click "Generate Handlers" or "Fix All Missing"
6. Review generated code before applying

**Tips:**
- Start with "Fix All Missing" for quick fixes
- Review generated code before applying
- Status badges show progress at a glance

---

## Test Generator Panel

**What it does:** Automatically generate test files for your code.

**How to use:**
1. Click "Generate Tests" in Action Center
2. Navigate to your code directory
3. Check boxes next to files you want tests for
4. Choose test type:
   - **Unit** - Test individual functions
   - **Integration** - Test component integration
   - **E2E** - Test end-to-end flows
5. Select options:
   - Include mocks
   - Include snapshots
   - Include setup/teardown
6. Preview the test structure
7. Click "Generate Tests"

**Tips:**
- Only TypeScript/JavaScript files are shown
- Preview updates as you change options
- Generated tests follow Jest patterns

---

## Keyboard Shortcuts Panel

**What it does:** Reference for all keyboard shortcuts, with practice mode.

**How to use:**
1. Click "Keyboard Shortcuts" in Action Center (or press `Ctrl+K`)
2. Search for shortcuts by name or key
3. Filter by category (File, Edit, View, Tools, Object)
4. Toggle "Practice Mode" to highlight keys as you press them
5. Customize shortcuts (coming soon)

**Tips:**
- Use search to find specific shortcuts
- Practice mode helps you learn shortcuts
- Categories make it easy to find related shortcuts

---

## Accessibility Features

All UI automation tools are fully accessible:

### Keyboard Navigation
- **Tab** - Move between elements
- **Enter/Space** - Activate buttons
- **Arrow Keys** - Navigate lists and grids
- **Escape** - Close dialogs

### Screen Reader Support
- All buttons have descriptive labels
- Status changes are announced
- Progress is announced
- Error messages are clear

### Visual Accessibility
- High contrast mode support
- Large touch targets (44x44px minimum)
- Clear visual hierarchy
- Icons + text labels (never icons alone)

---

## Troubleshooting

### "Project creation failed"
- Check that the project name is valid (letters, numbers, hyphens, underscores only)
- Ensure the location path exists
- Check file permissions

### "Template not found"
- Try searching with different keywords
- Check different categories
- Templates are case-sensitive in search

### "Batch operation failed"
- Verify file paths are correct
- Check file permissions
- Ensure destination directory exists for move/copy operations

### "Schema validation failed"
- Check that all required fields have names
- Ensure field types match validation rules
- Review the JSON preview for errors

---

## Need Help?

- Check the **Error Dashboard** for detailed error messages
- Use **Keyboard Shortcuts Panel** to learn shortcuts
- All tools include tooltips and help text
- Error messages suggest fixes

---

**Remember:** All these tools are designed to be visual and accessible. If something isn't working, check the error messages—they're written in plain language to help you fix issues quickly!

