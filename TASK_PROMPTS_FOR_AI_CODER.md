# Task Prompts for AI Coder (DevChatbot/Cursor Agent)

**Format:** Copy-paste these prompts to DevChatbot or Cursor agent

---

## Task 1: Wire SignButton to Canvas Export

```
Task: Wire SignButton to Canvas Export

Scope: Connect SignButton component to export current canvas SVG, call the signAndAppend API endpoint, and create proof bundle. The button should be in the header and when clicked, it should: 1) Export current canvas as SVG, 2) Call /api/proof/sign with canonical SVG, 3) Call /api/proof/append to add to ledger, 4) Call /api/proof/bundle to create proof_bundle.zip, 5) Show success message with download link.

Files to modify:
- components/SignButton.tsx (update handleSign to use canvas export)
- App.hardened.tsx (ensure SignButton gets current SVG content)

Deliverable: 
- One git patch (unified diff)
- Test steps: 1) Draw on canvas 2) Click Sign button 3) Verify proof_bundle.zip created
- Risk statement: Medium - UI integration, may need API endpoint fixes

Constraints:
- Keep changes small and reversible (git apply/patch)
- Run npm test and npx tsc --noEmit before finalizing
- No secret or key creation in code
```

---

## Task 2: Integrate Brush Tool into Palette

```
Task: Integrate Brush Tool into Palette

Scope: Ensure Brush tool appears in tool palette, is selectable via keyboard (B key), and renders variable-width strokes correctly on canvas. The BrushToolComponent already exists and is partially integrated in DraftsmanCanvas.tsx - verify it's complete and add to palette if missing.

Files to modify:
- components/DockableToolPalette.tsx (add Brush tool if missing)
- components/DraftsmanCanvas.tsx (verify BrushToolComponent integration is complete)
- services/keyboardShortcuts.ts (ensure B key selects brush)

Deliverable:
- One git patch (unified diff)
- Test steps: 1) Select Brush tool (B key or palette) 2) Draw on canvas 3) Verify variable-width stroke appears
- Risk statement: Low - code already exists, just needs wiring

Constraints:
- Keep changes small and reversible
- Run npm test and npx tsc --noEmit before finalizing
- No secret or key creation in code
```

---

## Task 3: Export QA and Dialog Fixes

```
Task: Export QA and Dialog Fixes

Scope: Test PNG/PDF/SVG exports end-to-end, fix any dialog issues, ensure exports work correctly. Check that export dialogs appear, file downloads work, and exported files are valid.

Files to modify:
- App.hardened.tsx (export handlers)
- components/ProfessionalFileMenu.tsx (export menu items)

Deliverable:
- One git patch (unified diff)
- Test results: List of tested formats and results
- Risk statement: Medium - export code exists but may have edge cases

Constraints:
- Keep changes small and reversible
- Run npm test and npx tsc --noEmit before finalizing
- Test each export format manually
```

---

## Task 4: Create Pen Tool Using Factory

```
Task: Create Pen Tool Using Factory

Scope: Use the tool factory scaffold to create Pen tool. Run: node scripts/new-tool-scaffold.js --name=pen --shortcut=P. Then implement Bezier curve fitting algorithm for smooth paths. The Pen tool should fit cubic Bezier curves to sampled points for smooth, professional paths.

Files to create/modify:
- lib/tools/pen.ts (implement Bezier fitting)
- components/tools/PenTool.tsx (React adapter)
- tests/pen.test.ts (unit tests)
- docs/PEN_TOOL_README.md (documentation)

Deliverable:
- One git patch (unified diff)
- Test steps: 1) Select Pen tool (P key) 2) Draw path 3) Verify smooth Bezier curves
- Risk statement: Medium - new algorithm implementation

Constraints:
- Use factory scaffold pattern
- Keep changes small and reversible
- Run npm test and npx tsc --noEmit before finalizing
```

---

## Task 5: Fix Top-Left Corner Layout

```
Task: Fix Top-Left Corner Layout

Scope: Fix Dev Chat and Diagnostics button spacing and alignment in top-left corner. Buttons should be properly spaced vertically, not overlapping, and aligned correctly.

Files to modify:
- App.hardened.tsx (top-left corner layout)
- index.html (if buttons are defined there)

Deliverable:
- One git patch (unified diff)
- Test: Visual inspection - buttons properly spaced
- Risk statement: Low - layout fix only

Constraints:
- Keep changes small and reversible
- Use Tailwind classes, no inline styles
- Run npx tsc --noEmit before finalizing
```

---

## Task 6: Fix File Menu Spacing

```
Task: Fix File Menu Spacing

Scope: Add proper spacing between file menu items, separate menu from toolbar. Menu items should have consistent spacing, not bunched up.

Files to modify:
- components/ProfessionalFileMenu.tsx (add spacing classes)

Deliverable:
- One git patch (unified diff)
- Test: Visual inspection - menu items properly spaced
- Risk statement: Low - spacing fix only

Constraints:
- Keep changes small and reversible
- Use Tailwind classes, no inline styles
- Run npx tsc --noEmit before finalizing
```

---

## Task 7: Fix Typography Hierarchy

```
Task: Fix Typography Hierarchy

Scope: Establish consistent font sizes throughout the application. Navigation should be readable (minimum 14px), headers should be properly sized, body text should be consistent. Create typography system CSS file if it doesn't exist.

Files to modify:
- styles/typography-system.css (create or update)
- index.css (import typography system)
- components/**/*.tsx (apply typography classes)

Deliverable:
- One git patch (unified diff)
- Test: Visual inspection - all text readable, consistent sizes
- Risk statement: Low - CSS changes only

Constraints:
- Keep changes small and reversible
- Use CSS custom properties for font sizes
- Run npx tsc --noEmit before finalizing
```

---

## Task 8: Enforce Z-Index System

```
Task: Enforce Z-Index System

Scope: Audit all components for arbitrary z-index values. Replace with z-stack classes from styles/z-index-layers.css. Ensure no z-index conflicts exist.

Files to modify:
- styles/z-index-layers.css (verify system exists)
- components/**/*.tsx (replace arbitrary z-index with classes)

Deliverable:
- One git patch (unified diff)
- Test: Visual inspection - no z-index conflicts
- Risk statement: Medium - may reveal hidden issues

Constraints:
- Keep changes small and reversible
- Use z-stack classes, no arbitrary values
- Run npx tsc --noEmit before finalizing
```

---

## Usage Instructions

1. **Copy a task prompt above**
2. **Paste to DevChatbot** (Right Sidebar → Dev Chat tab)
3. **DevChatbot will:**
   - Read relevant files
   - Generate the patch
   - Provide test steps
   - Show risk statement
4. **You review the patch**
5. **Apply if approved:** `git apply patch.diff`
6. **Test:** Follow test steps
7. **If tests pass:** Commit and move to next task
8. **If tests fail:** Request fix from DevChatbot

---

## Credit Conservation Tips

- **Batch related tasks** (e.g., all UI fixes in one prompt)
- **Use local Ollama** for iterative code generation
- **Reserve Cursor credits** for final review only
- **Keep prompts focused** - one task at a time

---

**#this-is-the-way #kanban #ai-coder #task-queue**


