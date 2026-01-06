# Pull Request

## 5Ws Validation

- **WHO:** Who is affected by this change?
- **WHAT:** What are we changing and why?
- **WHEN:** When should this be done?
- **WHERE:** Where in the codebase?
- **WHY:** Why is this the right approach?
- **HOW:** How will we implement and validate?

---

## Description

<!-- Describe your changes clearly and concisely -->

## Related Documentation

<!-- Link to relevant documentation -->

- [ ] Follows [Best Practices](docs/BEST_PRACTICES.md)
- [ ] Complies with [Enforcement Mechanisms](docs/ENFORCEMENT_MECHANISMS.md)
- [ ] Updates documentation if needed

## Type of Change

<!-- Mark the relevant option with an 'x' -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] UI Improvement (Inline Styles, CSS Compatibility, Form Labels, ARIA)
- [ ] Performance Optimization
- [ ] Accessibility Improvement

## Sprint Information

<!-- Optional: Include sprint details if applicable -->

- **Sprint:** <!-- e.g., Sprint 2.1: Inline Styles -->
- **Estimated Time:** <!-- e.g., 30 minutes -->
- **Visible Impact:** <!-- High / Medium / Low / None -->

---

## Before/After

### Before

<!-- Screenshot or description of UI before changes -->

### After

<!-- Screenshot or description of UI after changes -->

---

## Checklist

<!-- Mark completed items with an 'x'. All items must be checked for PR to be merged. -->

### Code Quality

- [ ] No inline styles used (uses CSS classes only)
- [ ] ErrorBoundary wrapper present (if component)
- [ ] TypeScript types defined for all new code
- [ ] Service layer pattern followed (business logic in services)
- [ ] No `any` types used (use `unknown` if needed)
- [ ] Code follows existing patterns

### Accessibility

- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation supported
- [ ] Focus indicators visible
- [ ] Screen reader friendly
- [ ] Passes accessibility checks (axe-core)

### Testing

- [ ] Unit tests added/updated (if applicable)
- [ ] Integration tests added/updated (if applicable)
- [ ] Manual testing completed
- [ ] All tests pass locally
- [ ] Visual regression testing passed
- [ ] Cross-browser testing completed
- [ ] Performance testing passed

### Documentation

- [ ] README updated (if needed)
- [ ] Developer guide updated (if needed)
- [ ] User guide updated (if user-facing)
- [ ] Code comments added (JSDoc)
- [ ] Hashtags included for searchability

### Team Collaboration

- [ ] Works for both solo and team workflows
- [ ] Integrates with task management (if relevant)
- [ ] Action Center compatible (if relevant)
- [ ] API Black Hole patterns followed (if relevant)

## Metrics Impact

### Click Tracking

- [ ] Click patterns tracked
- [ ] Interaction types recorded
- [ ] Component names identified

### Calculations Per Minute

- [ ] Performance maintained
- [ ] No regressions detected
- [ ] Optimization applied (if applicable)

### Error Tracking

- [ ] Errors reported via errorReportingService
- [ ] Fix status updated
- [ ] Fix time recorded

### Heuristic Compliance

- [ ] Heuristic violations checked
- [ ] Compliance verified
- [ ] Violations fixed (if applicable)

## Error Tracking

### Errors Found

<!-- List any errors found during this work -->

- Error ID: <!-- e.g., ERR-1234567890-1 -->
- Category: <!-- ui / performance / accessibility / heuristic -->
- Status: <!-- open / in-progress / fixed / verified -->

### Errors Fixed

<!-- List errors fixed in this PR -->

- Error ID: <!-- e.g., ERR-1234567890-1 -->
- Fix Time: <!-- e.g., 15 minutes -->
- Fix Commit: <!-- Git commit hash -->

## Heuristic Compliance

### Violations Found

<!-- List any heuristic violations found -->

- Violation ID: <!-- e.g., HEUR-1234567890-1 -->
- Heuristic: <!-- e.g., design-system-compliance -->
- Status: <!-- open / in-progress / fixed / verified -->

### Violations Fixed

<!-- List violations fixed in this PR -->

- Violation ID: <!-- e.g., HEUR-1234567890-1 -->
- Fix Time: <!-- e.g., 10 minutes -->
- Fix Commit: <!-- Git commit hash -->

## Hallberg Maths Compliance

- [ ] PHI-based spacing used
- [ ] PHI-based typography used
- [ ] E-based transitions used (if applicable)
- [ ] Pi-based calculations used (if applicable)

## Testing Instructions

<!-- Describe how reviewers can test your changes -->

## Screenshots/Videos

<!-- If UI changes, include screenshots or videos -->

## Related Issues

<!-- Link to related issues using #issue-number -->

- Closes #<!-- issue number -->
- Related to #<!-- issue number -->

## Next Sprint Planning

<!-- Plan next sprint before completing this one -->

- **Next Sprint:** <!-- e.g., Sprint 2.2: CSS Compatibility -->
- **Dependencies:** <!-- Any dependencies for next sprint -->
- **Estimated Time:** <!-- Estimated time for next sprint -->

## Additional Notes

<!-- Any additional information for reviewers -->

---

**By submitting this PR, I confirm:**

- [ ] I have read and followed [Best Practices](docs/BEST_PRACTICES.md)
- [ ] I have run `npm run enforce` locally and all checks pass
- [ ] My code follows the project's coding standards
- [ ] I have updated documentation as needed
