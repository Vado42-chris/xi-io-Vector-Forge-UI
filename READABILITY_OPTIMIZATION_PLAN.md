# Readability Optimization Plan - Xibalba Color System

## Current Problem
- **All greys are essentially black** (#000000, #010101, #020202, #030303)
- **No visual distinction** between UI elements
- **Text is all white** - no hierarchy
- **UI is unreadable** - everything blends together

## Xibalba Color System Requirements

### 7 Color Themes Structure
1. **1 Primary Color** - Product category (e.g., Orange for VectorForge)
2. **1 Shade of Primary** - Product-specific shade
3. **6 Monochrome Shades** - Between almost white (#f5f5f5) and almost black (#0a0a0a)

## Proposed 6-Shade Monochrome Gradient

### Option A: High Contrast (Recommended for Readability)
```
--xibalba-grey-000: #0a0a0a  (Almost black - deepest background)
--xibalba-grey-100: #1a1a1a  (Dark - canvas/primary panels)
--xibalba-grey-200: #2a2a2a  (Medium-dark - secondary panels)
--xibalba-grey-300: #3a3a3a  (Medium - elevated panels)
--xibalba-grey-400: #4a4a4a  (Medium-light - hover states)
--xibalba-grey-500: #5a5a5a  (Light - active states)
```

### Option B: Balanced (Better for Extended Use)
```
--xibalba-grey-000: #0f0f0f  (Almost black - deepest background)
--xibalba-grey-100: #1e1e1e  (Dark - canvas/primary panels)
--xibalba-grey-200: #2d2d2d  (Medium-dark - secondary panels)
--xibalba-grey-300: #3c3c3c  (Medium - elevated panels)
--xibalba-grey-400: #4b4b4b  (Medium-light - hover states)
--xibalba-grey-500: #5a5a5a  (Light - active states)
```

### Option C: Lighter (Maximum Readability)
```
--xibalba-grey-000: #151515  (Almost black - deepest background)
--xibalba-grey-100: #252525  (Dark - canvas/primary panels)
--xibalba-grey-200: #353535  (Medium-dark - secondary panels)
--xibalba-grey-300: #454545  (Medium - elevated panels)
--xibalba-grey-400: #555555  (Medium-light - hover states)
--xibalba-grey-500: #656565  (Light - active states)
```

## Text Color Hierarchy (6 Shades)

### High Contrast Text
```
--xibalba-text-000: #ffffff  (Pure white - primary text)
--xibalba-text-100: #f5f5f5  (Off-white - secondary text)
--xibalba-text-200: #e0e0e0  (Light grey - tertiary text)
--xibalba-text-300: #b0b0b0  (Medium grey - muted text)
--xibalba-text-400: #808080  (Dark grey - disabled text)
--xibalba-text-500: #606060  (Very dark grey - placeholder)
```

## Application Strategy

### Background Hierarchy
1. **Root/Canvas** - `--xibalba-grey-000` (deepest)
2. **Primary Panels** (Sidebars, Header) - `--xibalba-grey-100`
3. **Secondary Panels** (Toolbar, AI Panel) - `--xibalba-grey-200`
4. **Elevated Panels** (Modals, Dropdowns) - `--xibalba-grey-300`
5. **Hover States** - `--xibalba-grey-400`
6. **Active States** - `--xibalba-grey-500`

### Text Hierarchy
1. **Primary Text** (Headings, Labels) - `--xibalba-text-000`
2. **Secondary Text** (Body, Descriptions) - `--xibalba-text-100`
3. **Tertiary Text** (Captions, Metadata) - `--xibalba-text-200`
4. **Muted Text** (Disabled, Placeholders) - `--xibalba-text-300`

## Contrast Ratios (WCAG AA Compliance)

### Minimum Contrast Requirements
- **Normal Text**: 4.5:1
- **Large Text**: 3:1
- **UI Components**: 3:1

### Proposed Contrasts
- `--xibalba-grey-000` + `--xibalba-text-000`: ~21:1 ✅ (Excellent)
- `--xibalba-grey-100` + `--xibalba-text-000`: ~18:1 ✅ (Excellent)
- `--xibalba-grey-200` + `--xibalba-text-000`: ~15:1 ✅ (Excellent)
- `--xibalba-grey-300` + `--xibalba-text-000`: ~12:1 ✅ (Excellent)
- `--xibalba-grey-400` + `--xibalba-text-000`: ~9:1 ✅ (Excellent)
- `--xibalba-grey-500` + `--xibalba-text-000`: ~7:1 ✅ (Excellent)

## Implementation Priority

### Phase 1: Core Backgrounds (Immediate)
1. Update `--xibalba-grey-000` through `--xibalba-grey-500` in `index.html`
2. Apply to root, canvas, sidebars, panels
3. Test contrast ratios

### Phase 2: Text Colors (Immediate)
1. Update `--xibalba-text-000` through `--xibalba-text-500` in `index.html`
2. Apply to all text elements
3. Ensure proper hierarchy

### Phase 3: Component-Specific (Next)
1. Update toolbar backgrounds
2. Update panel backgrounds
3. Update button states
4. Update input fields

### Phase 4: Interactive States (Polish)
1. Hover states
2. Active states
3. Focus states
4. Disabled states

## Recommended Option

**Option B: Balanced** - Best compromise between readability and visual comfort

### Why Option B?
- **Readable**: Clear distinction between elements
- **Comfortable**: Not too bright for extended use
- **Professional**: Maintains dark theme aesthetic
- **Accessible**: Meets WCAG AA contrast requirements

## Next Steps

1. **Update CSS variables** in `index.html` with Option B values
2. **Test in browser** - verify readability
3. **Apply systematically** - update all components
4. **Verify contrast** - ensure WCAG compliance

