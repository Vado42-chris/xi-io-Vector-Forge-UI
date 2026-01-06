# Persona-Based User Journey Tests

## Overview

These tests simulate real user journeys based on defined personas, adapted from v61 backend testing patterns for front-end UX design.

## Personas

### 1. Alex Animator (Advanced)

- **Role:** Motion Graphics Designer
- **Focus:** Timeline, Layers, Keyframes, Animation
- **Tests:** `animator-journey.spec.ts`

### 2. Sam Designer (Intermediate)

- **Role:** Vector Illustrator
- **Focus:** Symbols, Library, AI Generation, Tools
- **Tests:** `designer-journey.spec.ts`

### 3. Dev Developer (Expert)

- **Role:** Interactive Developer
- **Focus:** Actions Panel, Hashtag System, Scripts
- **Tests:** `developer-journey.spec.ts`

### 4. New User (Beginner)

- **Role:** First-time User
- **Focus:** Empty States, AI Panel, Help, Guidance
- **Tests:** `beginner-journey.spec.ts`

## Testing Methodology

### Adapted from v61 Patterns

- **Backend:** Tested API endpoints with persona-based request patterns
- **Frontend:** Test user journeys and workflows with persona-based interactions

### Key Differences for UX Testing

1. **Visual Validation:** Check UI elements are visible and accessible
2. **Workflow Testing:** Test complete user journeys, not just API calls
3. **Interaction Patterns:** Simulate clicks, typing, navigation
4. **Accessibility:** Verify elements are findable and usable

## Running Tests

```bash
# Run all persona tests
npm run test:playwright -- tests/playwright/personas

# Run specific persona
npm run test:playwright -- tests/playwright/personas/animator-journey.spec.ts
```

## Acceptance Criteria

Each persona test validates:

- ✅ Key features are accessible
- ✅ Workflows can be completed
- ✅ Pain points are addressed
- ✅ Goals can be achieved
