# Vault - Complex Components (Temporarily Archived)

**Date:** 2025-12-31  
**Reason:** Complex components not rendering. Salvaging to ship working product.  
**Status:** Preserved for future reintegration

---

## What's Here

### `ProfessionalFileMenu.tsx`

- **What:** Full-featured file menu with all Adobe-style menus
- **Why Moved:** Not rendering despite correct structure
- **Status:** 775 lines, complex state management
- **Reintegration:** When header rendering issue is resolved

### `App.hardened.tsx`

- **What:** Full-featured app with all advanced features
- **Why Moved:** Complex state, many features, hard to debug
- **Status:** 2750+ lines, full feature set
- **Reintegration:** After App.simple is stable

---

## How to Reintegrate

1. **Test App.simple works** - Verify header, canvas, sidebars render
2. **Fix header issue** - Debug why ProfessionalFileMenu doesn't render
3. **Gradually add features** - Move features from App.hardened back one by one
4. **Test each addition** - Ensure nothing breaks

---

## Current Working Version

- **App.simple.tsx** - Minimal working version
- **Header.tsx** - Simple header (100 lines vs 775)
- **Components** - All other components unchanged

---

## Notes

- All code preserved (git mv maintains history)
- No code deleted
- Easy to restore: `git mv vault/ProfessionalFileMenu.tsx components/`
- Branch: `debug/salvage` (can be merged when stable)

---

**Goal:** Ship working product today. Reintegrate complex features later.
