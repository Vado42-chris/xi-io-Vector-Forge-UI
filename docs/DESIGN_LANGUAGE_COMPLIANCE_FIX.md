# Design Language Compliance Fix

## Issues Identified

1. ❌ **Blue tones instead of grey** - Found in `styles/accessibility.css` (#007acc)
2. ❌ **Missing AnimationTimeline** - Imported but not rendered in App.hardened.tsx
3. ❌ **Button gradients** - Need to audit and remove
4. ❌ **Missing orange accents** - Need to ensure orange (#ff9800) is used consistently
5. ❌ **Typography inconsistency** - Font sizes and styles not standardized
6. ❌ **Missing interaction polish** - Hover states, transitions need enhancement

## Fixes Applied

### 1. Replaced Blue with Orange in Accessibility CSS
**File**: `styles/accessibility.css`
- Changed `#007acc` to `#ff9800` (orange)
- Updated all focus indicators to use orange
- Updated skip link to use orange

### 2. Added AnimationTimeline
**File**: `App.hardened.tsx`
- Added AnimationTimeline component rendering before Footer
- Includes all required props: frameState, keyframes, layers, etc.

## Pending Fixes

### 3. Remove Button Gradients
- Need to audit all button styles
- Replace any gradients with flat grey backgrounds
- Ensure orange accents on hover/active states only

### 4. Typography Consistency
- Standardize font sizes across components
- Ensure consistent line heights
- Apply consistent font weights

### 5. Interaction Polish
- Add smooth transitions to all interactive elements
- Enhance hover states with orange glow
- Add active/pressed states
- Add focus states for accessibility

### 6. Orange Accent Enforcement
- Audit all components for blue color usage
- Replace with orange (#ff9800) where appropriate
- Ensure orange is ONLY used for interactive elements

## Design Language Rules (VectorForge)

- **Feature Color**: Orange (#ff9800) ONLY
- **Backgrounds**: Grey scale only (--xibalba-grey-*)
- **No Gradients**: Flat backgrounds only
- **No Blue**: Grey + Orange only
- **Typography**: Consistent sizes, Inter font family
- **Interactions**: Smooth transitions, orange glow on hover

