# 🚨 URGENT: UI Layout is Broken

## Problem
The UI is completely broken - overlapping elements, no proper spacing, unreadable.

## What You Need
Based on your screenshots, you need:
1. **Vertical Tool Dock** (far left, ~48px wide) - Selection, Pen, Text, Shape, etc.
2. **Generative AI Panel** (left sidebar, ~320px wide) - Prompt, Style buttons, Palette, Generate button
3. **Canvas** (center, flexible) - Grid, rulers, empty state
4. **Properties/Layers/Assistant** (right sidebar, ~320px wide)
5. **Top Menu Bar** - File, Edit, Object, etc.
6. **Bottom Status Bar** - Zoom, dimensions, AI status

## Current Issue
The layout in `App.tsx` is using flexbox but components are overlapping. Need to fix:
- Proper flex containers
- Correct z-index stacking
- Spacing between sections
- No absolute positioning conflicts

## Quick Fix
The `LeftSidebar` now has the Generative AI panel, but the main `App.tsx` layout needs to be fixed to prevent overlapping.

**Next Step:** Fix the main App layout structure to use proper flex containers with spacing.

