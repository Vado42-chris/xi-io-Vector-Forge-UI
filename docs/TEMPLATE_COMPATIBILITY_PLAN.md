# Template Compatibility Plan for Inline Style Removal
**Date:** 2025-12-27  
**Work Tracking ID:** WT-2025-01-27-035  
**Patent Tracking ID:** P-2025-01-27-032  
**Blockchain Seed:** seed001

## Critical Question from Master Chris

> "what are you going to do about all the templates you break when you change these inline styles? what is your plan for that?"

## Template System Analysis

### Current Understanding

1. **Template Frames**: Components can be attached to template frames via `attachedToFrame` property
2. **Custom Palettes**: `CustomPaletteBuilder.tsx` references template frames
3. **Palette Docking**: `PaletteDockingSystem.tsx` uses inline styles that may affect template rendering
4. **Component Reusability**: Components must work in both standalone and template contexts

### Template-Related Components Found

1. **CustomPaletteBuilder.tsx**
   - Has `attachedToFrame?: string; // Template frame ID if attached`
   - May depend on component styling for template integration

2. **PaletteDockingSystem.tsx**
   - Uses inline styles: `style={style}` (from drag library), `style={{ height: ... }}`, `style={{ clipPath: ... }}`
   - These styles may be required for template frame attachment

3. **EnhancedPanelSystem.tsx**
   - Uses `style={getGroupingStyles()}` 
   - May affect template frame rendering

## Risk Assessment

### High Risk Areas

1. **PaletteDockingSystem.tsx:205**
   - `style={style}` from drag-and-drop library
   - **Risk**: If library requires inline styles, removing them breaks drag functionality
   - **Impact**: Templates using draggable palettes will break

2. **PaletteDockingSystem.tsx:234**
   - `style={{ height: calc(100% - 32px) }}`
   - **Risk**: Template frames may depend on this exact height calculation
   - **Impact**: Template layouts may break

3. **PaletteDockingSystem.tsx:244**
   - `style={{ clipPath: 'polygon(...)' }}`
   - **Risk**: Visual indicator for template frame attachment
   - **Impact**: Template frame indicators may not render

4. **EnhancedPanelSystem.tsx:81**
   - `style={getGroupingStyles()}`
   - **Risk**: Template grouping visual indicators
   - **Impact**: Template visual grouping may break

## Template Compatibility Strategy

### Phase 1: Template System Discovery

**Goal**: Understand exactly how templates use these components

**Actions**:
1. ✅ Search for all template-related code
2. ⏳ Document template frame structure
3. ⏳ Identify template-specific styling requirements
4. ⏳ Map component dependencies on inline styles for templates

**Deliverable**: Template system architecture document

### Phase 2: Template-Safe Fixes

**Goal**: Remove inline styles without breaking templates

**Strategy**:
1. **CSS Custom Properties for Dynamic Values**
   - Convert inline styles to CSS custom properties
   - Set via `.style.setProperty()` (already correct pattern)
   - Templates can override via CSS variables

2. **Template-Specific CSS Classes**
   - Create `.template-frame-attached` class variants
   - Create `.template-palette-docked` class variants
   - Templates can apply these classes without inline styles

3. **Template Context Detection**
   - Detect when component is in template frame context
   - Apply template-specific CSS classes
   - Avoid inline styles entirely

### Phase 3: Template Testing

**Goal**: Verify templates still work after fixes

**Test Cases**:
1. Template frame attachment still works
2. Draggable palettes in templates still function
3. Template visual indicators still render
4. Template layouts remain correct
5. Template customization still possible

## Detailed Fix Plan by Component

### Fix 1: PaletteDockingSystem.tsx

#### Issue 1.1: Library `style` prop (Line 205)
**Current:**
```tsx
style={style}  // From drag-and-drop library
```

**Options**:
- **Option A**: Check if library supports `className` prop
- **Option B**: Keep library `style` prop but wrap in component that applies CSS classes
- **Option C**: Use CSS custom property: `style={{ '--drag-transform': style.transform }}`

**Recommendation**: Option C - Extract transform values to CSS custom properties

#### Issue 1.2: Height calculation (Line 234)
**Current:**
```tsx
style={{ height: `calc(100% - 32px)` }}
```

**Fix:**
```tsx
className="palette-content-height"
```

**CSS:**
```css
.palette-content-height {
  height: calc(100% - var(--palette-header-height, 32px));
}
```

**Template Compatibility**: Templates can override `--palette-header-height` variable

#### Issue 1.3: ClipPath (Line 244)
**Current:**
```tsx
style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
```

**Fix:**
```tsx
className="palette-clip-corner"
```

**CSS:**
```css
.palette-clip-corner {
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
}
```

**Template Compatibility**: Templates can override with `.template-palette-clip-corner` variant

### Fix 2: EnhancedPanelSystem.tsx

#### Issue 2.1: Grouping styles (Line 81)
**Current:**
```tsx
style={getGroupingStyles()}
```

**Fix:**
```tsx
className={getGroupingClasses(type, level, indicator)}
```

**Implementation:**
```tsx
const getGroupingClasses = (type, level, indicator) => {
  const classes = [`panel-group-${type}`, `panel-level-${level}`];
  if (indicator === 'border' || indicator === 'all') classes.push('panel-group-border');
  if (indicator === 'background' || indicator === 'all') classes.push('panel-group-bg');
  if (indicator === 'shadow' || indicator === 'all') classes.push('panel-group-shadow');
  return classes.join(' ');
};
```

**Template Compatibility**: Templates can add `.template-panel-group` variants

### Fix 3: XibalbaLogomark.tsx

#### Issue 3.1: Cursor (Line 43)
**Current:**
```tsx
style={{ cursor: onClick ? 'pointer' : 'default' }}
```

**Fix:**
```tsx
className={onClick ? 'cursor-pointer' : 'cursor-default'}
```

**Template Compatibility**: ✅ No impact - cursor is standard Tailwind class

#### Issue 3.2: Size (Line 48)
**Current:**
```tsx
style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
```

**Fix:**
```tsx
className="logomark-size"
// In useEffect:
useEffect(() => {
  if (logomarkRef.current) {
    logomarkRef.current.style.setProperty('--logomark-size', `${containerSize}px`);
  }
}, [containerSize]);
```

**CSS:**
```css
.logomark-size {
  width: var(--logomark-size, 48px);
  height: var(--logomark-size, 48px);
}
```

**Template Compatibility**: Templates can override `--logomark-size` variable

## Template-Specific CSS Variables

Create template override system:

```css
/* Template frame context */
.template-frame {
  --palette-header-height: 32px;
  --logomark-size: 48px;
  --panel-group-border-width: 2px;
}

/* Template palette variants */
.template-palette-docked {
  /* Override palette styles for template context */
}

.template-palette-floating {
  /* Override palette styles for floating in template */
}
```

## Implementation Phases

### Phase 1: Discovery (Before Any Fixes)
1. Document all template frame usage
2. Identify template-specific styling requirements
3. Map component dependencies
4. Create template test cases

**Time**: 30 minutes

### Phase 2: Template-Safe CSS Conversion
1. Convert inline styles to CSS classes
2. Use CSS custom properties for dynamic values
3. Create template-specific CSS variants
4. Test each fix in template context

**Time**: 45 minutes

### Phase 3: Template Testing
1. Test all template frame attachments
2. Test draggable palettes in templates
3. Test template visual indicators
4. Test template layouts
5. Verify template customization

**Time**: 30 minutes

## Risk Mitigation

### Rollback Plan
- Each fix in separate commit
- Git revert if template breaks
- Feature flag for template-safe mode

### Testing Strategy
1. Unit test: Component works standalone
2. Integration test: Component works in template
3. Visual test: Template renders correctly
4. Interaction test: Template interactions work

## Questions for Master Chris

1. **Template Structure**: What is the exact structure of template frames?
2. **Template Styling**: Do templates have their own CSS files or use component CSS?
3. **Template Overrides**: How do templates override component styles currently?
4. **Template Testing**: What template test cases exist?
5. **Template Priority**: Are templates currently in use, or planned for future?

## Next Steps

1. ⏳ **WAIT FOR CLARIFICATION**: Understand template system fully before fixing
2. ⏳ Document template architecture
3. ⏳ Create template test cases
4. ⏳ Implement template-safe fixes
5. ⏳ Test templates thoroughly
6. ⏳ Document template compatibility

## Status

**Current State**: ⚠️ **BLOCKED** - Need template system clarification before proceeding

**Blocking Questions**:
- How do templates currently use these components?
- What template-specific styling is required?
- Are templates currently in production use?

