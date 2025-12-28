# Pull Request

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

## Testing Instructions
<!-- Describe how reviewers can test your changes -->

## Screenshots/Videos
<!-- If UI changes, include screenshots or videos -->

## Related Issues
<!-- Link to related issues using #issue-number -->
Closes #
Related to #

## Additional Notes
<!-- Any additional information for reviewers -->

---

**By submitting this PR, I confirm:**
- [ ] I have read and followed [Best Practices](docs/BEST_PRACTICES.md)
- [ ] I have run `npm run enforce` locally and all checks pass
- [ ] My code follows the project's coding standards
- [ ] I have updated documentation as needed

