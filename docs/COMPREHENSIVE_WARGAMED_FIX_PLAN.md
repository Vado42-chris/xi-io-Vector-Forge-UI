# Comprehensive Wargamed Fix Plan for Inline Style Removal
**Date:** 2025-12-27  
**Work Tracking ID:** WT-2025-01-27-036  
**Patent Tracking ID:** P-2025-01-27-033  
**Blockchain Seed:** seed001

## Executive Summary

This plan addresses:
1. **Component breakage on other pages** after inline style fixes
2. **Change tracking and registration** system
3. **Dependency mapping** across all pages/components
4. **Wargamed outcomes** with risk mitigation
5. **Testing strategy** for all affected components

## Critical Questions Addressed

> "what are you going to do about all the components that break on other pages after you update them with the new fixes we are making here too?"

> "How will you keep track of everything and make sure it is registered correctly?"

> "how do we proceed in the best way possible given all considerations and outcomes? what is our wargamed plan?"

## Phase 1: Dependency Mapping & Impact Analysis

### 1.1 Component Dependency Graph

**Goal**: Map all components that use the 6 affected components

**Affected Components**:
1. `App.hardened.tsx` - Root application component
2. `DraftsmanCanvas.tsx` - Canvas rendering component
3. `PowerUserToolbar.tsx` - Floating toolbar
4. `XibalbaLogomark.tsx` - Logo component
5. `PaletteDockingSystem.tsx` - Palette docking system
6. `EnhancedPanelSystem.tsx` - Panel system
7. `SprintBoard.tsx` - Sprint board (drag-and-drop)

**Dependency Discovery Process**:
```bash
# Find all files importing affected components
find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "DraftsmanCanvas\|PowerUserToolbar\|XibalbaLogomark\|PaletteDockingSystem\|EnhancedPanelSystem\|SprintBoard"

# Find all files importing from components directory
find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "from.*components"

# Map component usage patterns
grep -r "import.*from.*components" --include="*.tsx" --include="*.ts"
```

**Deliverable**: `docs/COMPONENT_DEPENDENCY_MAP.md`

### 1.2 Page/Route Analysis

**Goal**: Identify all pages/routes that use affected components

**Discovery**:
- Check all `App*.tsx` files (App.hardened.tsx, App.tsx, App.working.tsx, etc.)
- Check routing configuration
- Check template files
- Check plugin system usage

**Deliverable**: `docs/PAGE_IMPACT_ANALYSIS.md`

### 1.3 Template System Impact

**Goal**: Understand template frame dependencies

**Discovery**:
- `CustomPaletteBuilder.tsx` - Uses `PaletteDockingSystem`
- Template frame attachment system
- Custom palette rendering

**Deliverable**: `docs/TEMPLATE_IMPACT_ANALYSIS.md`

## Phase 2: Change Tracking & Registration System

### 2.1 Change Registry

**Goal**: Track every change with full context

**Registry Format**:
```typescript
interface ChangeRecord {
  id: string;                    // Unique change ID
  timestamp: string;             // ISO timestamp
  component: string;              // Component name
  file: string;                  // File path
  line: number;                  // Line number
  changeType: 'inline-style-removal' | 'css-class-addition' | 'css-variable-addition';
  before: string;                 // Before code
  after: string;                 // After code
  reason: string;                // Why this change was made
  dependencies: string[];         // Components that depend on this
  affectedPages: string[];       // Pages/routes affected
  testCases: string[];           // Test cases to verify
  rollbackPlan: string;          // How to rollback if needed
  workTrackingId: string;        // WT-2025-01-27-XXX
  patentTrackingId: string;       // P-2025-01-27-XXX
  blockchainSeed: string;         // seed001
}
```

**Implementation**: `docs/CHANGE_REGISTRY.json`

### 2.2 Component Version Tracking

**Goal**: Track component versions and changes

**System**:
- Each component gets a version number
- Changes increment version
- Version history in component file header
- Change log in `docs/CHANGELOG.md`

**Format**:
```typescript
/**
 * Component: DraftsmanCanvas
 * Version: 2.1.0
 * Last Modified: 2025-12-27
 * Changes:
 *   - v2.1.0: Removed inline styles, added CSS classes
 *   - v2.0.0: Added recursive layer rendering
 */
```

### 2.3 Dependency Impact Matrix

**Goal**: Visual matrix showing what breaks if component changes

**Format**: `docs/DEPENDENCY_IMPACT_MATRIX.md`

| Component | Affected Pages | Affected Components | Risk Level | Test Required |
|-----------|---------------|---------------------|------------|---------------|
| DraftsmanCanvas | App.hardened.tsx | None | HIGH | ✅ Yes |
| PowerUserToolbar | App.hardened.tsx | None | MEDIUM | ✅ Yes |
| XibalbaLogomark | All pages | Header, Footer | LOW | ✅ Yes |
| PaletteDockingSystem | CustomPaletteBuilder | Templates | CRITICAL | ✅ Yes |
| EnhancedPanelSystem | Multiple | Panel users | HIGH | ✅ Yes |
| SprintBoard | SprintBoard page | Drag library | MEDIUM | ✅ Yes |

## Phase 3: Wargamed Outcomes & Risk Mitigation

### 3.1 Scenario Planning

#### Scenario 1: Single Component Breakage
**Outcome**: One component breaks on one page
**Probability**: Medium
**Impact**: Low-Medium
**Mitigation**: 
- Isolated fix in separate commit
- Immediate rollback capability
- Component-level testing

#### Scenario 2: Cascade Breakage
**Outcome**: Fix breaks multiple dependent components
**Probability**: Low
**Impact**: High
**Mitigation**:
- Dependency mapping before fixes
- Staged rollout (one component at a time)
- Integration testing after each fix

#### Scenario 3: Template System Breakage
**Outcome**: Template frames stop working
**Probability**: Medium
**Impact**: Critical
**Mitigation**:
- Template-specific CSS classes
- Template testing before/after
- Template override system

#### Scenario 4: Library Dependency Breakage
**Outcome**: Drag-and-drop library stops working
**Probability**: Low
**Impact**: High
**Mitigation**:
- Check library documentation
- Test library compatibility
- Fallback to library's required patterns

#### Scenario 5: CSS Cascade Issues
**Outcome**: CSS classes conflict or override incorrectly
**Probability**: Medium
**Impact**: Medium
**Mitigation**:
- Use CSS custom properties
- Namespace all classes
- Test CSS specificity

### 3.2 Risk Matrix

| Risk | Probability | Impact | Mitigation Priority |
|------|------------|--------|-------------------|
| Template breakage | Medium | Critical | P0 |
| Cascade breakage | Low | High | P1 |
| Library incompatibility | Low | High | P1 |
| CSS conflicts | Medium | Medium | P2 |
| Single component breakage | Medium | Low-Medium | P2 |

### 3.3 Rollback Strategy

**Per-Component Rollback**:
- Each fix in separate Git commit
- Commit message includes: `[ROLLBACK-READY]`
- Tag each commit: `inline-style-fix-<component>-<version>`
- Rollback command documented in commit message

**Full Rollback**:
- Git revert all commits in batch
- Restore from backup branch
- Component version downgrade

## Phase 4: Testing Strategy

### 4.1 Component-Level Testing

**For Each Component**:
1. **Standalone Test**: Component works in isolation
2. **Props Test**: All props work correctly
3. **CSS Test**: Styles render correctly
4. **Interaction Test**: User interactions work
5. **Template Test**: Works in template context

**Test Checklist**:
```markdown
- [ ] Component renders without errors
- [ ] All props accepted and used correctly
- [ ] CSS classes applied correctly
- [ ] CSS custom properties set correctly
- [ ] No inline styles remain
- [ ] Component works standalone
- [ ] Component works in parent context
- [ ] Component works in template context
- [ ] All interactions functional
- [ ] Visual appearance correct
```

### 4.2 Integration Testing

**Page-Level Testing**:
- Test each page that uses affected components
- Verify no visual regressions
- Verify no functional regressions
- Verify template compatibility

**Cross-Component Testing**:
- Test components that depend on each other
- Verify no cascade breakage
- Verify CSS doesn't conflict

### 4.3 Template Testing

**Template-Specific Tests**:
- Template frame attachment
- Custom palette rendering
- Template frame styling
- Template override system

### 4.4 Browser Testing

**Test Matrix**:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if applicable)
- Different screen sizes
- Different zoom levels

## Phase 5: Implementation Plan

### 5.1 Pre-Implementation Checklist

- [ ] Dependency map created
- [ ] Impact analysis complete
- [ ] Change registry system ready
- [ ] Test cases written
- [ ] Rollback plan documented
- [ ] Approval from Master Chris

### 5.2 Implementation Order

**Priority Order** (Lowest Risk First):

1. **XibalbaLogomark.tsx** (Lowest Risk)
   - Simple cursor/style fixes
   - Used in header/footer
   - Easy to test
   - Low dependency count

2. **DraftsmanCanvas.tsx** (Medium Risk)
   - Single inline style (pointerEvents)
   - Used in main app only
   - Easy to test visually

3. **PowerUserToolbar.tsx** (Medium Risk)
   - Position styles
   - Used in main app only
   - Has CSS class already

4. **App.hardened.tsx** (High Risk)
   - Root container styles
   - Affects entire app
   - Must test all pages

5. **SprintBoard.tsx** (Medium-High Risk)
   - Library dependency
   - May require library investigation
   - Used in specific page

6. **PaletteDockingSystem.tsx** (Critical Risk)
   - Multiple inline styles
   - Template dependencies
   - Used by CustomPaletteBuilder
   - Requires template testing

7. **EnhancedPanelSystem.tsx** (High Risk)
   - Style function
   - Used by multiple components
   - Requires integration testing

### 5.3 Implementation Process

**For Each Component**:

1. **Pre-Fix**:
   - Document current state
   - Create test cases
   - Document dependencies
   - Create rollback plan

2. **Fix**:
   - Remove inline styles
   - Add CSS classes/variables
   - Update component version
   - Add change record

3. **Test**:
   - Component-level tests
   - Integration tests
   - Template tests (if applicable)
   - Browser tests

4. **Verify**:
   - No regressions
   - All tests pass
   - Visual appearance correct
   - Functionality intact

5. **Commit**:
   - Separate commit per component
   - Detailed commit message
   - Tag with version
   - Update change registry

6. **Monitor**:
   - Watch for cascade issues
   - Monitor error logs
   - User feedback (if applicable)

## Phase 6: Change Registry Implementation

### 6.1 Registry Structure

**File**: `docs/CHANGE_REGISTRY.json`

```json
{
  "version": "1.0.0",
  "lastUpdated": "2025-12-27T00:00:00Z",
  "changes": [
    {
      "id": "CHG-2025-12-27-001",
      "timestamp": "2025-12-27T00:00:00Z",
      "component": "XibalbaLogomark",
      "file": "components/XibalbaLogomark.tsx",
      "line": 43,
      "changeType": "inline-style-removal",
      "before": "style={{ cursor: onClick ? 'pointer' : 'default' }}",
      "after": "className={onClick ? 'cursor-pointer' : 'cursor-default'}", 
      "reason": "Remove inline style to comply with component system",
      "dependencies": [],
      "affectedPages": ["All pages with header/footer"],
      "testCases": ["XIBALBA-LOGOMARK-001", "XIBALBA-LOGOMARK-002"],
      "rollbackPlan": "Revert commit CHG-2025-12-27-001",
      "workTrackingId": "WT-2025-01-27-036",
      "patentTrackingId": "P-2025-01-27-033",
      "blockchainSeed": "seed001",
      "status": "pending"
    }
  ]
}
```

### 6.2 Registry Maintenance

**Automated**:
- Script to generate change records
- Script to validate registry
- Script to generate reports

**Manual**:
- Review before each commit
- Update after each fix
- Verify completeness

## Phase 7: Communication & Documentation

### 7.1 Documentation Updates

**Required Documents**:
1. `docs/COMPONENT_DEPENDENCY_MAP.md` - Dependency graph
2. `docs/PAGE_IMPACT_ANALYSIS.md` - Page-level impacts
3. `docs/TEMPLATE_IMPACT_ANALYSIS.md` - Template impacts
4. `docs/CHANGE_REGISTRY.json` - Change tracking
5. `docs/DEPENDENCY_IMPACT_MATRIX.md` - Impact matrix
6. `docs/CHANGELOG.md` - Version history
7. `docs/ROLLBACK_PROCEDURES.md` - Rollback instructions

### 7.2 Status Reporting

**Daily Status**:
- Components fixed
- Components tested
- Issues found
- Rollbacks needed
- Next steps

## Phase 8: Success Criteria

### 8.1 Completion Criteria

- [ ] All 6 components fixed
- [ ] All dependencies tested
- [ ] All pages tested
- [ ] All templates tested
- [ ] Change registry complete
- [ ] Documentation updated
- [ ] No regressions found
- [ ] All tests passing
- [ ] Master Chris approval

### 8.2 Quality Criteria

- Zero inline styles (except CSS custom properties)
- All components work standalone
- All components work in templates
- All pages render correctly
- No visual regressions
- No functional regressions
- Change tracking complete
- Rollback plan documented

## Timeline Estimate

- **Phase 1**: Dependency Mapping - 1 hour
- **Phase 2**: Change Registry Setup - 30 minutes
- **Phase 3**: Wargaming & Risk Analysis - 1 hour
- **Phase 4**: Test Case Creation - 1 hour
- **Phase 5**: Implementation (7 components) - 3 hours
- **Phase 6**: Registry Maintenance - 30 minutes
- **Phase 7**: Documentation - 1 hour
- **Phase 8**: Final Testing - 1 hour

**Total**: ~9 hours

## Next Steps

1. ⏳ **Get Approval**: Master Chris reviews this plan
2. ⏳ **Phase 1**: Create dependency maps
3. ⏳ **Phase 2**: Set up change registry
4. ⏳ **Phase 3**: Complete wargaming analysis
5. ⏳ **Phase 4**: Write test cases
6. ⏳ **Phase 5**: Implement fixes (one at a time)
7. ⏳ **Phase 6**: Maintain registry
8. ⏳ **Phase 7**: Update documentation
9. ⏳ **Phase 8**: Final verification

## Questions for Master Chris

1. **Approval**: Does this plan address your concerns?
2. **Priority**: Which components should be fixed first?
3. **Testing**: What testing resources are available?
4. **Templates**: Are templates currently in production use?
5. **Timeline**: What is the acceptable timeline?
6. **Risk Tolerance**: What level of risk is acceptable?

