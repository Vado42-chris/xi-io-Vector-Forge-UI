# Wireframe Component Tests

## Overview

Tests for all wireframe components documented in COMPREHENSIVE_UI_WIREFRAMES.md

## Test Suites

### 1. Header Components (`header-components.spec.ts`)

- FileMenu
- Save/Load buttons
- Export SVG
- Sign & Create Proof
- Generate with AI
- Menu items (File, Edit, Object, etc.)

### 2. Floating Components (`floating-components.spec.ts`)

- XP Display
- Toast notifications
- Advanced Mode button
- ActionCenter (removed/validated)

### 3. Tool Panels (`tool-panels.spec.ts`)

- Tool Properties
- Canvas Settings
- Rulers
- Guides
- Grid

## Coverage

All wireframe components from:

- Main Layout
- Header
- Left Sidebar
- Center Stack
- Right Sidebar
- Footer/Timeline
- Floating Components
- Modal Dialogs
- Tool Panels

## Running Tests

```bash
# Run all wireframe tests
npm run test:playwright -- tests/playwright/wireframes

# Run specific suite
npm run test:playwright -- tests/playwright/wireframes/header-components.spec.ts
```
