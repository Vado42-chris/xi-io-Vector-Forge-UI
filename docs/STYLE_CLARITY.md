# Style Clarity - VectorForge Product

**Date:** January 27, 2025  
**Status:** ✅ **CLARIFIED**

---

## Branding Hierarchy

1. **Xibalba** = Parent company (design system principles)
   - Greys, spacing, typography
   - Design tokens and patterns
   - NOT product-specific

2. **xi-io** = Product line moniker
   - All products use this prefix
   - Shared infrastructure

3. **VectorForge** = This specific product
   - Feature Color: **Orange (#ff9800) ONLY**
   - Product-specific styling
   - Interactive elements use Orange

---

## Feature Color Rules

### ✅ ALLOWED
- `--vectorforge-accent: #ff9800` (Orange)
- `--vectorforge-accent-hover: #ff6f00` (Orange hover)
- Orange for interactive elements only

### ❌ NOT ALLOWED
- Green, red, yellow, blue as feature colors
- Multiple feature colors
- Hardcoded colors in components
- Inline styles (use CSS custom properties)

---

## Naming Conventions

- **CSS Variables:**
  - `--vectorforge-accent` = VectorForge feature color
  - `--xibalba-accent` = Maps to `--vectorforge-accent` (legacy support)
  - `--xibalba-grey-*` = Design system greys
  - `--xibalba-text-*` = Design system text colors

- **Components:**
  - Use `var(--vectorforge-accent)` for interactive elements
  - Use `var(--xibalba-grey-*)` for backgrounds
  - Use `var(--xibalba-text-*)` for text

---

## Status Colors

**Before:** Green/Red/Yellow for status  
**After:** Orange variants for all status indicators
- Ready: `bg-[var(--vectorforge-accent)]`
- Processing: `bg-[var(--xibalba-bg-tertiary)] animate-pulse`
- Error: `bg-[var(--vectorforge-accent)] opacity-50`
- Warning: `bg-[var(--vectorforge-accent)] opacity-75`

---

## Files Modified

1. `index.html` - Added `--vectorforge-accent` variable
2. `styles/xibalba-design-language.css` - Added clarity comments
3. `components/shared/StatusIndicator.tsx` - Replaced green/red/yellow with Orange
4. `components/RightSidebar.tsx` - Replaced `text-red-400` with Orange

---

## Result

**VectorForge = Orange (#ff9800) ONLY**

