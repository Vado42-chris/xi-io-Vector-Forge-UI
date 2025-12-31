# Xibalba Design System Bible
**Source:** Historic ChatGPT conversations + VectorForge-specific adaptations  
**Status:** Authoritative design principles for all Xibalba products

---

## Core Principle: Grey-on-Grey Foundation

**Everything defaults to grey-on-grey.**

- **Backgrounds:** Neutral greys only
- **Containers:** Neutral greys only  
- **Text:** White/near-white (primary), mid-grey (secondary), low-contrast grey (disabled)
- **No color unless it has semantic purpose**

---

## The No-Borders Philosophy

### "Borders Restrain"

**Rule:** We use subtle background color differences instead of explicit borders.

**Why:** Borders restrain. They create visual barriers. We convey separation through:
- Subtle background color differences
- Luminance variations
- Soft shadows (not colored)
- Glow effects (for interactivity)

### Background Brightness Rule

**The brightest grey used in backgrounds must never be brighter than the border color of content containers.**

This ensures:
- Containers always read as objects, not wallpaper
- Depth is perceptual, not decorative
- Borders define the maximum "light" in the environment

**Implementation:**
- Background greys live below container borders in luminance
- Borders define the upper luminance bound
- No exceptions

---

## Selected States & Interactivity

### Interaction = Glow, Not Color Fill

**Interactive containers get a subtle glow using the site's accent color.**

**Details (locked):**
- **Glow size:** 1–2px
- **Opacity:** Very low (≈ 8–15%)
- **Placement:** Behind the container (not overlay)
- **Only visible on:** hover, focus, active, selected

**This is affordance, not decoration.**

If it looks like a neon sign, it's wrong.

### Selected States Use Background Colors

**Selected states are typically background colors, not borders.**

- Use subtle background color changes
- Add subtle glow (accent color, low opacity)
- Never use border color for selection
- Never use color fill for selection

---

## Color Usage Rules

### Where Color is Allowed (Purpose Only)

Color is permitted only in these cases:

1. **Semantic titles/labels**
   - Use 5W(+H) color derived from: `category_hue + semantic_offset`
   - Titles, tags, chips, metadata
   - **Never paragraphs**

2. **Links**
   - Use the base category anchor color
   - No rainbow links
   - No per-link semantics

3. **Interactive glow**
   - Accent color only
   - Never applied as a fill
   - Never applied to text

**That's it.** If color is doing anything else, it's violating the system.

---

## Product-Specific Accent Colors

### Web Applications
- **Accent:** #007acc (Cursor blue)
- **Use:** Focus rings, interactive glow, links

### VectorForge (Desktop Application)
- **Accent:** #ff9800 (Orange)
- **Use:** Focus rings, interactive glow, selected state backgrounds (subtle tint)

---

## Visual Weight System (Pattern #211)

**Primary Navigation (Header):** 64px height - SUBSTANTIAL  
**Utility Elements (Search/Inputs):** 38px height - COMPACT  
**Padding Primary:** 16px  
**Padding Utility:** 12px

---

## Design Principles

### Pattern #209: 5 Feet Back Test
Clear hierarchy from distance. Primary elements stand out.

### Pattern #210: Fewer Boxes
Combine related elements. Reduce unnecessary containers.

### Pattern #211: Proportional Weight Balance
Size matches importance. Primary elements are substantial, utilities are compact.

---

## Implementation Checklist

### ✅ DO
- Use grey-on-grey backgrounds
- Use subtle background color differences for separation
- Use glow (not fill) for interactivity
- Use background colors for selected states
- Keep glow subtle (1-2px, 8-15% opacity)
- Use accent color only for glow, focus rings, links
- Ensure backgrounds are darker than container borders

### ❌ DON'T
- Use explicit borders (except where absolutely necessary for accessibility)
- Use color fills for selected states
- Use bright colors for backgrounds
- Use borders for selection indication
- Make glow visible in screenshots (it should be subtle)
- Use color in body text
- Use multiple accent colors

---

## Perceptual Stack (Top → Bottom)

1. **Glow** → "this does something"
2. **Border** → "this is an object" (subtle, defines luminance ceiling)
3. **Container fill** → "this is content"
4. **Background** → "this is space"

This aligns with how the visual cortex parses interfaces.

---

## Why This Works

- ✅ Feels calm
- ✅ Scales to dense dashboards
- ✅ Doesn't fatigue users
- ✅ Immediate recognition of interactive vs static content
- ✅ No need for buttons to look like buttons
- ✅ Cleaner compound components
- ✅ Lower cognitive load
- ✅ Stronger "tool, not toy" feel

---

## VectorForge-Specific Adaptations

1. **Orange accent** (#ff9800) instead of blue
2. **Desktop application** paradigm (not web app)
3. **Adobe-level polish** required
4. **Construction paper texture** overlay (15% opacity)
5. **Sharp geometric shapes only** (no rounded corners)

---

## Hallberg Maths Integration

### Mathematical Foundation

VectorForge uses **Hallberg Maths** - a mathematical framework based on the Unified 4D Theory Formula for spacing, proportions, and visual balance.

**Key Mathematical Constants:**

- **Golden Ratio (φ):** φ = (1 + √5)/2 ≈ 1.618033988749895
- **Euler's Number (e):** e ≈ 2.718281828459045
- **Conical Geometry Parameter (β):** β = cos(α) ≈ 0.8660254 (for α = 30°)

### Spacing System

**Primary Spacing (Golden Ratio Based):**
- Base unit: 4px
- Scale: 4px × φ^n where n = 0, 1, 2, 3...
- Common values:
  - 4px (φ^0 × 4)
  - 6.5px ≈ 6px (φ^1 × 4)
  - 10.5px ≈ 10px (φ^2 × 4)
  - 17px (φ^3 × 4)
  - 27px ≈ 28px (φ^4 × 4)

**Secondary Spacing (Euler's Number Based):**
- Used for exponential scaling in animations and transitions
- Natural growth patterns for component sizing

### Proportional Relationships

**Component Heights:**
- Header: 64px (substantial, Pattern #211)
- Utilities: 38px (compact, Pattern #211)
- Ratio: 64/38 ≈ 1.684 ≈ φ (golden ratio relationship)

**Padding System:**
- Primary: 16px (4 × φ^2)
- Utility: 12px (4 × φ^1.5)
- Tight: 8px (4 × φ^1)
- Relaxed: 24px (4 × φ^2.5)

### Visual Balance

The golden ratio ensures:
- Natural visual harmony
- Proportional relationships between elements
- Balanced spacing that feels "right" to the eye
- Consistent scaling across all UI components

**Implementation:**
- All spacing uses multiples of 4px scaled by golden ratio
- Component proportions follow φ relationships
- Animation timing uses Euler's number for natural curves

---

**This is the foundation. All UI must follow these principles.**

