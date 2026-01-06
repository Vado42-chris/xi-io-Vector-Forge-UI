# Black Square Artifact Diagnosis

## Root Cause Identified

**Location:** `App.hardened.tsx` line 2614-2640

**Problem:** The Library component is being rendered OUTSIDE the LeftSidebar, as a separate element in the flex row layout. This creates a layout conflict where:

1. **LeftSidebar** (320px) - Line 2281
2. **Center Stack** (flex-1) - Line 2292  
3. **Library** (240px) - Line 2614 ⚠️ **PROBLEM HERE**
4. **RightSidebar** (360px) - Line 2643

The Library component has a dark background (`background: var(--xibalba-grey-100, #1a1a1a)`) and is being rendered as a separate flex item, which is causing:
- Layout overflow
- Black square artifact (Library's dark background)
- Overlapping UI elements

## Solution

The Library should be INSIDE the LeftSidebar component, not as a separate element. The current structure creates a 4-column layout when it should be 3-column (LeftSidebar + Center + RightSidebar).

## Files to Fix

1. **App.hardened.tsx** - Move Library inside LeftSidebar OR fix flex layout
2. **components/LeftSidebar.tsx** - Add Library as a tab/panel inside LeftSidebar

## Quick Fix Options

### Option A: Move Library Inside LeftSidebar (Recommended)
- Add Library as a tab/panel inside LeftSidebar component
- Remove Library from App.hardened.tsx line 2614-2640

### Option B: Fix Flex Layout
- Ensure Library is properly positioned in flex row
- Add proper width constraints and overflow handling
- Fix z-index stacking

## Status

🔍 **DIAGNOSED** - Ready for fix

