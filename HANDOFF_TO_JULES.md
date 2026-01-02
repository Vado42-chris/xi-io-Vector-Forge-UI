# Handoff to Jules - VectorForge Project Explanation

## What You're Building: VectorForge

**VectorForge** is a professional, team-based vector graphics editor with AI generation capabilities. It's built with React, TypeScript, and the Xibalba Framework. Think of it as a modern, AI-powered alternative to Adobe Illustrator.

## Project Overview

### Core Features
- **Vector Graphics Editor**: Professional canvas for creating SVG graphics
- **AI Generation**: Generative Vector AI panel for creating vectors from text prompts
- **Animation Timeline**: Frame-based animation system
- **Layer Management**: Professional layers panel with grouping, masking, etc.
- **Tool Dock**: Quick access to drawing tools (pen, rectangle, ellipse, text, etc.)
- **Dev Chat**: Self-modifying AI assistant for development help

### Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom CSS (Xibalba Design System)
- **State Management**: React hooks (useState, useEffect)
- **Build Tool**: Vite

## Current State

### ✅ What Works
- Application builds successfully
- React components render
- Basic structure is in place
- CSS Grid layout code is implemented

### ❌ What's Broken
**CRITICAL ISSUE**: Left sidebar tool dock (48px) and AI panel are **visually overlapping** despite correct DOM structure.

**Root Cause**: CSS specificity conflict between:
- `styles/panel-layout-fixes.css` sets `.xibalba-sidebar { display: flex }`
- `styles/xibalba-design-language.css` sets `.sidebar-two-column-layout { display: grid !important }`

The flex rule may be overriding the grid in some cases.

## Your Vision Concept

Based on the design you provided, the layout should be:

```
┌─────────────────────────────────────────────────────────┐
│ Header (48px) - File menu, tabs, user actions          │
├──────┬──────────────────────────────┬───────────────────┤
│ Tool │                              │                   │
│ Dock │   Main Canvas Area           │  Right Sidebar    │
│ 48px │   (Grid background)          │  (Properties,     │
│      │                              │   Layers, etc.)   │
│ AI   │                              │                   │
│Panel │                              │                   │
│      │                              │                   │
├──────┴──────────────────────────────┴───────────────────┤
│ Footer/Status Bar - Zoom, dimensions, AI status         │
└─────────────────────────────────────────────────────────┘
```

### Key Layout Requirements
1. **Left Sidebar** (320px wide):
   - **Tool Dock** (48px): Vertical strip on far left with icons only (no text labels)
   - **AI Panel** (remaining width): Generative Vector AI controls side-by-side with tool dock
   - **NO OVERLAP** between tool dock and AI panel

2. **Main Canvas**: Large central area with grid background

3. **Right Sidebar** (360px): Properties, Layers, Assistant panels

4. **Header**: Top menu bar (48px)

5. **Footer**: Bottom status bar

## Answers to Your Questions

### 1. Component Structure
**Answer**: The current structure is already modular. The main issue is **CSS layout**, not component structure. Focus on fixing the CSS Grid layout first. The components are:
- `components/LeftSidebar.tsx` - Contains tool dock + AI panel
- `components/RightSidebar.tsx` - Properties, Layers, etc.
- `components/DraftsmanCanvas.tsx` - Main canvas
- `App.tsx` - Main layout container

**Recommendation**: Fix CSS first, then refactor if needed.

### 2. UI Elements
**Answer**: Focus on **fixing the layout and z-stacking** first. The UI elements exist, they're just overlapping. Once layout is fixed, you can add missing elements like the "Assistant" panel if needed.

**Priority**: Layout fix > Missing elements

### 3. Styling
**Answer**: The design system is already in place (Xibalba Design System). The colors, fonts, and spacing are defined in CSS variables. The issue is **layout positioning**, not styling. Match the layout structure from the concept image.

**Key CSS Variables**:
- `--xibalba-grey-050`, `--xibalba-grey-100` - Background colors
- `--xibalba-text-000`, `--xibalba-text-100` - Text colors
- `--vectorforge-accent` - Orange accent color

### 4. Responsiveness
**Answer**: Focus exclusively on **desktop view** for now. The design concept shows a fixed desktop layout. Responsiveness can come later.

### 5. Target File
**Answer**: Work in `App.tsx` (the main file). The layout structure is there, it just needs CSS fixes.

## The Fix Needed

### Step 1: Verify CSS Grid is Applied
1. Open browser DevTools (F12)
2. Navigate to `http://localhost:3000`
3. Inspect `.sidebar-two-column-layout` element
4. Check Computed Styles tab:
   - Is `display: grid` actually applied?
   - Or is `display: flex` winning?

### Step 2: Fix CSS Specificity
If flex is winning, add more specific selector:

```css
/* In styles/xibalba-design-language.css or create new override */
aside.sidebar-fixed-left .sidebar-two-column-layout {
  display: grid !important;
  grid-template-columns: 48px 1fr !important;
  flex-direction: unset !important;
}
```

### Step 3: Ensure Tool Dock is 48px
Verify `.tool-dock-column` has:
- `width: 48px !important`
- `grid-column: 1 / 2`
- `overflow: hidden`

### Step 4: Ensure AI Panel Takes Remaining Space
Verify `.ai-panel-column` has:
- `grid-column: 2 / -1`
- `width: auto`
- `min-width: 0`

## Key Files to Modify

1. **`styles/xibalba-design-language.css`** (lines 850-910)
   - Grid layout CSS rules
   - Add more specific selectors if needed

2. **`styles/panel-layout-fixes.css`** (lines 17-36)
   - Contains conflicting flex rules
   - May need to exclude grid containers from flex rules

3. **`components/LeftSidebar.tsx`** (lines 115-195)
   - Component structure (already correct)
   - Verify inline styles match CSS

## Testing

After each change:
1. Run `npm run build` to verify no build errors
2. Open `http://localhost:3000` in browser
3. Inspect left sidebar in DevTools
4. Verify tool dock (48px) and AI panel are side-by-side
5. Check for visual overlap

## Expected Result

- Tool dock: 48px wide column on left, icons only
- AI panel: Takes remaining space on right, clearly separated
- No visual overlap
- Clean, professional layout matching your concept

## Git Status

- **Repository**: https://github.com/Vado42-chris/xi-io-Vector-Forge-UI
- **Branch**: `repair/backup-before-clean-slate`
- **Status**: All changes committed and pushed
- **Latest commit**: `984bf9b`

## Documentation Files

All handoff documentation is in the repo:
- `README_HANDOFF.md` - Quick start
- `CONTINUE_HERE.md` - Step-by-step guide
- `HANDOFF_DOCUMENTATION.md` - Technical details
- `FINAL_HANDOFF_SUMMARY.md` - Complete status
- `STATUS_FOR_NEXT_AI.md` - Current state

## Quick Start

```bash
cd /home/chrishallberg/xi-io-Vector-Forge-UI
npm run dev
# Open http://localhost:3000
# Inspect left sidebar in DevTools
```

## Summary

You're fixing a **CSS layout issue** where the left sidebar's tool dock and AI panel are overlapping. The DOM structure is correct, but CSS Grid isn't being applied due to specificity conflicts. Fix the CSS, verify in browser, and the layout should match your concept.

The project is well-structured and documented. Focus on the CSS specificity issue first, and the rest should fall into place.

Good luck! 🚀

