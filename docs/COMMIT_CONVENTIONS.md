# Commit Conventions - VectorFORGE

**Date:** January 27, 2025  
**Status:** ✅ **ACTIVE**

---

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

---

## Types

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: UI/styling changes (CSS, design system)
- `ui`: UI improvements (inline styles, CSS compatibility, form labels, ARIA)
- `docs`: Documentation
- `test`: Testing
- `chore`: Maintenance
- `perf`: Performance improvements
- `accessibility`: Accessibility improvements

---

## Scopes

- Component name (e.g., `LeftSidebar`, `ToolPropertiesPanel`)
- Service name (e.g., `uiMetricsService`, `errorReportingService`)
- File type (e.g., `css`, `types`, `hooks`)

---

## Subject

- Use imperative mood ("Remove" not "Removed")
- First letter lowercase
- No period at end
- Max 72 characters

---

## Body (Optional)

- Explain **what** and **why** (not **how**)
- Reference issues/PRs
- Include metrics impact

---

## Footer (Optional)

- `Fixes #123` - Closes issue
- `Related to #456` - Related issue
- `Sprint: 2.1` - Sprint identifier

---

## Examples

### UI Improvement
```
ui(LeftSidebar): remove inline style for z-index

Convert style={{ zIndex: 1000 }} to CSS class
Add .zstack-sidebar-resize-handle class
Use CSS variable --z-sidebar-resize-handle

Fixes #123
Sprint: 2.1
```

### CSS Compatibility
```
style(xibalba-design-language): add webkit prefixes

Add -webkit-backdrop-filter alongside backdrop-filter
Add -webkit-user-select alongside user-select
Add fallback for color-mix() in older browsers

Sprint: 2.2
```

### Form Labels
```
accessibility(ToolPropertiesPanel): add form labels

Add htmlFor and id attributes to all form elements
Add aria-label where appropriate
Improve WCAG 2.1 AA compliance

Sprint: 2.3
```

### ARIA Expressions
```
fix(AchievementPanel): convert ARIA expressions to string literals

Convert aria-pressed={isActive} to aria-pressed={isActive ? 'true' : 'false'}
Fix ESLint validation errors
No visual change

Sprint: 2.4
```

---

## Branch Naming

**Format:** `<type>/sprint-<X.Y>-<description>`

**Examples:**
- `feature/sprint-2.1-inline-styles`
- `feature/sprint-2.2-css-compatibility`
- `feature/sprint-2.3-form-labels`
- `feature/sprint-2.4-aria-expressions`

---

## PR Requirements

1. **Description** - Complete PR template
2. **Before/After** - Screenshots for UI changes
3. **Metrics** - Click tracking, calculations per minute impact
4. **Testing** - Testing checklist completed
5. **Error Tracking** - Errors found/fixed documented
6. **Heuristic Compliance** - Violations found/fixed documented
7. **Hallberg Maths** - Compliance verified
8. **Next Sprint** - Next sprint planned

---

## Best Practices

- ✅ One logical change per commit
- ✅ Commit often, push regularly
- ✅ Write clear commit messages
- ✅ Reference issues/PRs
- ✅ Include metrics impact
- ✅ Document error tracking
- ✅ Verify heuristic compliance

---

## Enforcement

- Branch protection rules require:
  - PR reviews
  - Status checks passing
  - Up-to-date branches
  - Commit message validation (if configured)

---

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Best Practices](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
- [VectorFORGE UI Improvement Plan](./COMPREHENSIVE_UI_IMPROVEMENT_PLAN.md)

