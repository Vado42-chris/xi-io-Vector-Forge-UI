# Xibalba Design Language - Enforced

## ✅ Fixed Issues

1. **No Blue Tints** - All blue removed from backgrounds and text. Blue ONLY for focus rings.
2. **Sharp Geometric Only** - All rounded corners removed via CSS enforcement.
3. **Grey-on-Grey Palette** - Subtle grey shifts for panel distinction:
   - `--xibalba-grey-000`: #0a0b0e (Canvas - deepest)
   - `--xibalba-grey-050`: #12141a (Header/Primary panels)
   - `--xibalba-grey-100`: #1a1c22 (Secondary panels)
   - `--xibalba-grey-150`: #1e1e26 (Elevated panels)
   - `--xibalba-grey-200`: #25252a (Nested elements)
   - `--xibalba-grey-250`: #2a2d35 (Hover states)
   - `--xibalba-grey-300`: #343842 (Active states)

4. **Construction Paper Texture** - Added with 15% opacity, visible overlay.

## Design Language Rules

### Colors
- **Backgrounds**: Grey scale only (--xibalba-grey-*)
- **Text**: Grey scale only (--xibalba-text-*)
- **Accent (Blue)**: ONLY for focus rings and active interactive states
- **NO Orange**: Removed from all UI elements

### Shapes
- **ALL corners**: Sharp geometric (border-radius: 0)
- **NO rounded**: Enforced via CSS `!important`

### Texture
- **Construction paper**: Fixed overlay with 15% opacity
- **Visible**: z-index 9999, mix-blend-mode overlay

### Visual Weight (Pattern #211)
- **Header**: 64px (substantial)
- **Utilities**: 38px (compact)
- **Padding Primary**: 16px
- **Padding Utility**: 12px

### Panel Distinction
- Use subtle grey shifts (--xibalba-grey-050 through --xibalba-grey-300)
- Borders: rgba(255, 255, 255, 0.05-0.15)
- Shadows: Dark, not colored

## Enforcement

All design language rules are enforced via:
1. `xibalba-design-language.css` - Base system
2. `xibalba-enforce.css` - Force overrides with `!important`

