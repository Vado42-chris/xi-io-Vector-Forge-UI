# Design Guide Compliance - Critical Fixes

## Current Issues vs Design Guide

### ❌ CRITICAL GAPS

1. **AI Panel** - Permanent in center stack (should be modal/floating)
2. **Library** - Fixed overlay (should be in LeftSidebar)
3. **Actions** - Fixed overlay (should be in Inspector/RightSidebar)
4. **Stage** - No artboard boundaries (should have visible stage)

### ✅ COMPLIANT

- Timeline (40% height, always visible) ✅
- Keyboard shortcuts (F9, F11) ✅

## Priority Fixes

### P0: Move AI Panel to Floating

- Remove from center stack
- Add header button
- Create floating panel

### P0: Integrate Library into LeftSidebar

- Move to LeftSidebar component
- Below tools section

### P0: Move Actions to Inspector

- Add "Code" tab to RightSidebar
- Show hashtag editor there

### P0: Add Stage Boundaries

- Artboard component
- Pasteboard area
- Stage size controls
