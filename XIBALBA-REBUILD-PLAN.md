# Xibalba Brand Identity Rebuild Plan

## Issues Identified

1. ❌ **Wrong Colors**: Using orange (#FF9800) instead of Xibalba blue (#007acc)
2. ❌ **Visual Weight Imbalance**: Header too small, utilities too large (Pattern #211 violation)
3. ❌ **Too Many Boxes**: Separate containers for everything (Pattern #210 violation)
4. ❌ **Static UI**: No micro-interactions, components don't respond
5. ❌ **No Functionality**: Frames are static, inline components not working
6. ❌ **Poor Hierarchy**: Doesn't pass 5 Feet Back Test (Pattern #209 violation)

## Xibalba Brand Standards (From Memory)

### Colors
- **Backgrounds**: #1e1e1e, #252526, #2d2d2d (dark greys)
- **Text**: #ffffff, #cccccc, #999999 (light greys)
- **Accent**: #007acc (Cursor blue) - NOT orange
- **Hover**: #3e3e42

### Visual Weight System (Pattern #211)
- **Primary Navigation (Header)**: 64px height - SUBSTANTIAL
- **Utility Elements (Search/Inputs)**: 38px height - COMPACT
- **Padding Primary**: 16px
- **Padding Utility**: 12px

### Design Principles
- **Pattern #209**: 5 Feet Back Test - Clear hierarchy from distance
- **Pattern #210**: Fewer Boxes - Combine related elements
- **Pattern #211**: Proportional Weight Balance - Size matches importance

## Rebuild Strategy

### Phase 1: Theme & Colors ✅ (Started)
- [x] Create xibalba-theme.css
- [x] Replace orange with blue (#007acc)
- [x] Update CSS variables
- [ ] Apply to all components

### Phase 2: Visual Weight Balance
- [ ] Header: 64px height (currently 48px)
- [ ] Search/Inputs: 38px height
- [ ] Reduce padding on utilities
- [ ] Increase padding on primary elements

### Phase 3: Reduce Boxes (Pattern #210)
- [ ] Combine header + search into unified bar
- [ ] Merge nav/search/filters into one experience
- [ ] Group related properties together
- [ ] Remove unnecessary containers

### Phase 4: Micro-Interactions
- [ ] Add hover states to all buttons
- [ ] Add active/pressed states
- [ ] Add focus states (accessibility)
- [ ] Add transition animations
- [ ] Add loading states
- [ ] Add feedback on actions

### Phase 5: Functionality
- [ ] Make all buttons actually work
- [ ] Add keyboard shortcuts
- [ ] Add drag & drop
- [ ] Add canvas interactions
- [ ] Add layer management
- [ ] Add property editing

### Phase 6: 5 Feet Back Test
- [ ] Verify hierarchy from distance
- [ ] Ensure primary elements stand out
- [ ] Check visual weight balance
- [ ] Test with reduced vision

## Implementation Order

1. **Theme System** (xibalba-theme.css) ✅
2. **Header Component** - Fix height, colors, interactions
3. **Sidebars** - Combine elements, reduce boxes
4. **Canvas** - Add interactions, micro-animations
5. **Footer** - Simplify, proper weight
6. **Global** - Apply theme everywhere

## Success Criteria

✅ All orange replaced with blue (#007acc)
✅ Header is 64px (substantial)
✅ Utilities are 38px (compact)
✅ Related elements combined (fewer boxes)
✅ All buttons have hover/active states
✅ All components are functional
✅ Clear hierarchy from 5 feet away

