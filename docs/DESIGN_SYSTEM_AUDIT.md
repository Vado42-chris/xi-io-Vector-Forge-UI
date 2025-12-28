# Design System Audit — Initial Mappings
**Date:** January 27, 2025  
**Purpose:** Map common inline style patterns to canonical classes / tokens  
**Status:** Template - Fill in during Phase 0.6

---

## Purpose

Map common inline style patterns to canonical CSS classes and design tokens from the Xibalba design system.

---

## Files Inspected

### Design System Files
- ✅ `styles/xibalba-design-language.css` - Design language classes
- ✅ `styles/xibalba-theme.css` - Theme variables and tokens

### Key Findings (To Be Filled In)

**Available CSS Variables:**
- `--xibalba-bg-primary`, `--xibalba-bg-secondary`, `--xibalba-bg-tertiary`
- `--xibalba-text-primary`, `--xibalba-text-secondary`, `--xibalba-text-muted`
- `--xibalba-accent`, `--xibalba-accent-hover`
- `--spacing-tight`, `--spacing-normal`, `--spacing-relaxed`
- `--transition-fast`, `--transition-normal`, `--transition-slow`

**Available CSS Classes:**
- `.xibalba-card` - Card component
- `.xibalba-button-professional` - Button component
- `.canvas-content` - Canvas container
- `.flex`, `.flex-1` - Flexbox utilities (if Tailwind available)

---

## Token Mapping Examples

### Spacing
- `marginLeft: '200px'` → `className="ml-[200px]"` (Tailwind) OR CSS variable `--spacing-*`
- `marginTop: '10px'` → `className="mt-2"` (Tailwind) OR `--spacing-tight`
- `padding: '20px'` → `className="p-5"` (Tailwind) OR `--spacing-normal`

### Colors
- `color: '#fff'` → `className="text-[var(--xibalba-text-primary)]"`
- `backgroundColor: '#1e1e1e'` → `className="bg-[var(--xibalba-bg-primary)]"`

### Typography
- `fontSize: '14px'` → `className="text-sm"` (Tailwind) OR CSS variable
- `fontWeight: 'bold'` → `className="font-bold"` (Tailwind)

### Transitions
- `transition: 'margin-left 0.2s ease'` → `className="transition-[margin-left] duration-200 ease-out"` (Tailwind) OR use `--transition-fast`

---

## Inline Style → Suggested Replacement Patterns

### Static Values
```tsx
// ❌ BEFORE
<div style={{ marginLeft: '200px', transition: 'margin-left 0.2s ease' }}>

// ✅ AFTER (Option 1: Tailwind)
<div className="ml-[200px] transition-[margin-left] duration-200 ease-out">

// ✅ AFTER (Option 2: CSS Variable)
<div className="canvas-container" style={{ marginLeft: 'var(--spacing-xxl)' }}>
```

### Dynamic Values
```tsx
// ❌ BEFORE
<div style={{ marginLeft: `${toolPalettePosition.width || 200}px` }}>

// ✅ AFTER (CSS Variable + Class)
<div 
  className="canvas-container"
  style={{ 
    marginLeft: `var(--palette-width, ${toolPalettePosition.width || 200}px)` 
  }}
>

// OR create a CSS class with CSS variable
// In CSS: .canvas-container { margin-left: var(--palette-width, 200px); }
```

---

## Per-File Remediation Table

### Files with Inline Styles (9 violations)

1. **`App.tsx:1044`**
   - **Inline style:** `style={{ marginLeft: toolPalettePosition.zone === 'left' ? `${toolPalettePosition.width || 200}px` : '0', transition: 'margin-left 0.2s ease' }}`
   - **Suggested replacement:** 
     - Create CSS class `.canvas-container` with CSS variable
     - Use `className="canvas-container"` with `style={{ marginLeft: 'var(--palette-width, 200px)' }}`
     - OR use Tailwind: `className="transition-[margin-left] duration-200 ease-out"` with dynamic style

2. **`App.working.tsx:36`**
   - **Inline style:** (To be filled during audit)
   - **Suggested replacement:** (To be filled)

3. **`App.working.tsx:45`**
   - **Inline style:** (To be filled during audit)
   - **Suggested replacement:** (To be filled)

4. **`App.working.tsx:54`**
   - **Inline style:** (To be filled during audit)
   - **Suggested replacement:** (To be filled)

5. **`App.working.tsx:64`**
   - **Inline style:** `style={{ flex: 1 }}`
   - **Suggested replacement:** `className="flex-1"` (Tailwind) or `.flex-1` class

6. **`App.staged.tsx:33`**
   - **Inline style:** (To be filled during audit)
   - **Suggested replacement:** (To be filled)

7. **`App.staged.tsx:42`**
   - **Inline style:** `style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}`
   - **Suggested replacement:** `className="p-5 border-b border-white/10"` (Tailwind) or create CSS class

8. **`App.staged.tsx:47`**
   - **Inline style:** `style={{ flex: 1, padding: '20px' }}`
   - **Suggested replacement:** `className="flex-1 p-5"` (Tailwind)

9. **`App.minimal.tsx:5`**
   - **Inline style:** (To be filled during audit)
   - **Suggested replacement:** (To be filled)

---

## Notes

- **Perform manual fixes only** - No automated `--fix` for inline styles
- **For dynamic inline values** (e.g., `marginLeft: variable`):
  - Prefer CSS variables: `style={{ marginLeft: 'var(--dynamic-value)' }}`
  - OR create small CSS-in-JS helper function
  - OR use CSS class with CSS custom property
- **Check if Tailwind is available** - If yes, use Tailwind utilities
- **If Tailwind not available** - Use Xibalba CSS classes and variables

---

## Next Steps

1. **Read design system files** - Understand available classes and variables
2. **Fill in per-file table** - Document exact replacements for each violation
3. **Create CSS classes if needed** - Add to `styles/xibalba-design-language.css`
4. **Manual fixes** - Apply replacements one file at a time

---

**Last Updated:** January 27, 2025  
**Status:** Template created, ready for Phase 0.6 completion

