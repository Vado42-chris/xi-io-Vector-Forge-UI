# URGENT UI FIX

**Status:** Fixing white sidebar and ensuring all components visible

## Fixed:
1. ✅ Left sidebar background changed to `bg-[var(--xibalba-grey-100)]`
2. ✅ Added inline style as backup: `backgroundColor: 'var(--xibalba-grey-100)'`
3. ✅ All sidebar sections use dark grey

## Canvas, Header, Footer:
- Canvas is rendered at line 1626 (DraftsmanCanvas)
- Header is rendered at line 1580 (ProfessionalFileMenu)
- Footer is rendered at line 2024 (Footer component)

## Next:
Refresh browser to see dark sidebar. If still white, CSS variables may not be loading.

