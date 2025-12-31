# Accessibility Guide
**Complete guide to VectorForge accessibility features**

## Overview

VectorForge is designed to be accessible to everyone, including users with:
- **Autism** - Clear structure, predictable patterns, no surprises
- **Dyslexia** - Dyslexia-friendly fonts, adjustable spacing, high contrast
- **Visual impairments** - Screen reader support, high contrast, large text
- **Motor impairments** - Keyboard navigation, large touch targets
- **Cognitive differences** - Plain language, clear error messages, undo everywhere

---

## Accessibility Settings

Open **Preferences** → **Accessibility** to configure:

### Visual Settings

**Dyslexia-Friendly Font**
- Toggle OpenDyslexic font for easier reading
- Falls back to system fonts if not available
- Applied to all text in the application

**Font Size**
- Slider: 12px - 24px
- Adjusts base font size for all text
- Larger text reduces eye strain

**Line Spacing**
- Slider: 1.0 - 2.0
- More spacing makes text easier to read
- Helps with tracking (following lines)

**Letter Spacing**
- Slider: Normal - 0.2em
- Increased spacing helps distinguish letters
- Useful for dyslexia and visual processing

**Color Override**
- High contrast color picker
- Override default text colors
- Use for maximum contrast

### Interaction Settings

**Screen Reader Support**
- Enables ARIA labels and announcements
- Announces UI changes
- Describes interactive elements

**Enhanced Keyboard Navigation**
- Improved Tab order
- Keyboard shortcuts for everything
- Focus indicators always visible

**High Contrast Mode**
- Increases contrast ratios
- WCAG AAA compliant (7:1 minimum)
- Makes text easier to read

**Enhanced Focus Indicators**
- 3px outline on focused elements
- Glow effect for visibility
- Never miss what's focused

**Reduce Motion**
- Disables animations
- Reduces visual distractions
- Helps with motion sensitivity

---

## Keyboard Navigation

### Basic Navigation
- **Tab** - Move forward through elements
- **Shift+Tab** - Move backward
- **Enter/Space** - Activate buttons
- **Escape** - Close dialogs, cancel actions
- **Arrow Keys** - Navigate lists, grids, menus

### Common Shortcuts
- **Ctrl+K** - Open Keyboard Shortcuts panel
- **Ctrl+Z** - Undo
- **Ctrl+Shift+Z** - Redo
- **Ctrl+S** - Save
- **Ctrl+O** - Open file
- **Ctrl+N** - New file

### Dialog Navigation
- **Tab** - Move between fields
- **Enter** - Submit/Confirm
- **Escape** - Cancel/Close
- **Arrow Keys** - Navigate options in dropdowns

---

## Screen Reader Support

### What Gets Announced
- **Page navigation** - "Project Wizard, Step 1 of 5"
- **File operations** - "File saved successfully"
- **Errors** - "Error: Project name is required"
- **Status changes** - "3 files selected"
- **Progress** - "Generating tests, 50% complete"

### Verbosity Levels
- **Brief** - Only essential information
- **Normal** - Standard announcements (default)
- **Verbose** - Detailed descriptions

### ARIA Labels
All interactive elements have descriptive labels:
- Buttons: "Close project wizard"
- Form fields: "Project name, required"
- Status: "3 files selected"

---

## Visual Accessibility

### High Contrast Mode
- **Text contrast:** 7:1 minimum (WCAG AAA)
- **Background contrast:** Maximum separation
- **Border visibility:** All borders visible
- **Icon clarity:** High contrast icons

### Focus Indicators
- **Standard:** 2px outline
- **Enhanced:** 3px outline + glow
- **Color:** Accent color (blue/orange)
- **Always visible:** Never hidden

### Touch Targets
- **Minimum size:** 44x44px
- **Spacing:** Adequate space between targets
- **Visual feedback:** Clear hover/active states

---

## Error Prevention

### Validation
- **Before submission:** All forms validate before sending
- **Real-time:** Errors shown as you type
- **Clear messages:** Plain language, no jargon

### Confirmations
- **Destructive actions:** Always require confirmation
- **Large buttons:** Easy to click correctly
- **Cancel on left:** Standard placement

### Undo
- **Available everywhere:** All actions can be undone
- **Clear feedback:** "Undo Last Operation" button
- **History:** Multiple levels of undo

---

## Dyslexia Support

### Font Options
- **OpenDyslexic:** Specially designed for dyslexia
- **System fallback:** Uses system fonts if not available
- **Easy toggle:** One click in preferences

### Spacing Adjustments
- **Line spacing:** 1.0 - 2.0 (default 1.5)
- **Letter spacing:** Normal - 0.2em
- **Paragraph spacing:** Adequate margins

### Visual Aids
- **High contrast:** Easier to distinguish letters
- **Clear hierarchy:** Headings, sections clearly marked
- **Icons + text:** Never icons alone

---

## Tips for Different Needs

### For Autism
- **Predictable patterns:** UI follows consistent rules
- **Clear structure:** Headings, sections, steps
- **No surprises:** All actions are confirmable
- **Reduced motion:** Toggle in preferences

### For Dyslexia
- **Enable dyslexia font:** Preferences → Accessibility
- **Increase line spacing:** 1.8 - 2.0 recommended
- **Increase letter spacing:** 0.1em - 0.2em
- **Use high contrast:** Makes text clearer

### For Visual Impairments
- **Screen reader:** Enable in preferences
- **High contrast:** Maximum contrast mode
- **Large text:** Increase font size to 18px+
- **Focus indicators:** Enhanced mode recommended

### For Motor Impairments
- **Keyboard only:** Everything accessible via keyboard
- **Large targets:** All buttons 44x44px minimum
- **No time limits:** Take your time
- **Voice commands:** Coming soon

---

## Testing Your Setup

### Keyboard-Only Test
1. Unplug your mouse/trackpad
2. Navigate the entire app using only keyboard
3. All features should be accessible
4. Report any issues via Error Dashboard

### Screen Reader Test
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate through all features
3. Verify all elements are announced
4. Check that descriptions are clear

### High Contrast Test
1. Enable high contrast mode
2. Verify all text is readable
3. Check that borders are visible
4. Ensure icons are clear

---

## Getting Help

### Error Messages
- **Plain language:** No technical jargon
- **Actionable:** Suggests how to fix
- **Contextual:** Shows what went wrong

### Tooltips
- **Hover/Focus:** Appear on hover or focus
- **Keyboard shortcuts:** Shown in tooltips
- **Descriptions:** Explain what things do

### Keyboard Shortcuts Panel
- **Searchable:** Find shortcuts quickly
- **Practice mode:** Learn as you go
- **Categorized:** Organized by function

---

## Compliance

VectorForge meets:
- **WCAG 2.1 Level AAA** - Color contrast, text spacing
- **Section 508** - Federal accessibility standards
- **EN 301 549** - European accessibility standards

---

## Feedback

Found an accessibility issue? Use the **Error Dashboard** to report it. We prioritize accessibility fixes!

---

**Remember:** Accessibility is not optional. If something isn't accessible, it's a bug. Report it, and we'll fix it!

