# Panel-by-Panel UX Audit - Disability & Accessibility Perspective

## Overall Layout Failures

### 1. **Z-Stack Conflicts**
- **Problem**: Multiple layers with same z-index (sidebars at 100, panels at 100)
- **Impact**: Elements overlap, preventing clicks
- **User Frustration**: Clicking on something that doesn't respond
- **Fix**: Ensure proper z-index hierarchy, test all clickable elements

### 2. **Pointer Events Blocked**
- **Problem**: `pointer-events: none` on parent containers blocking child interactions
- **Impact**: Buttons/tools appear clickable but don't respond
- **User Frustration**: "Why isn't this working?"
- **Fix**: Ensure interactive elements have `pointer-events: auto`

### 3. **Material Icons as Text**
- **Problem**: Icons showing as "keyboard_arrow_down" text
- **Impact**: Screen readers read icon names, visual users see text
- **User Frustration**: Unprofessional, confusing interface
- **Fix**: Ensure Material Symbols font loads correctly

---

## Panel 1: Left Sidebar (Tools Panel)

### Component Failures:
1. **Tool Buttons**
   - **Issue**: May have `pointer-events: none` from parent
   - **Impact**: Tools don't respond to clicks
   - **Fix**: Ensure `pointer-events: auto` on all tool buttons

2. **Tool Categories**
   - **Issue**: No clear visual hierarchy
   - **Impact**: Hard to find tools
   - **Fix**: Better spacing, headers, grouping

3. **Collapse/Expand**
   - **Issue**: Button may be hidden or unclickable
   - **Impact**: Can't resize sidebar
   - **Fix**: Ensure button is visible and clickable

### Z-Stack Issues:
- Sidebar at `--z-sidebar-left: 100`
- Resize handle at `--z-sidebar-resize-handle: 30` (TOO LOW!)
- **Fix**: Resize handle should be higher than sidebar

---

## Panel 2: Right Sidebar (Properties/Dev Chat)

### Component Failures:
1. **Tab System**
   - **Issue**: Tabs may overlap or be unclickable
   - **Impact**: Can't switch between panels
   - **Fix**: Ensure tabs have proper z-index and are clickable

2. **Dev Chat Input**
   - **Issue**: Input field may be hidden or have height: 0
   - **Impact**: Can't type messages
   - **Fix**: Ensure container has height, input is visible

3. **Form Inputs**
   - **Issue**: Inputs may be hidden or unclickable
   - **Impact**: Can't edit properties
   - **Fix**: Ensure all inputs are visible and clickable

4. **Resize Handle**
   - **Issue**: Same as left sidebar - z-index too low
   - **Impact**: Can't resize sidebar
   - **Fix**: Increase z-index above sidebar

### Z-Stack Issues:
- Sidebar at `--z-sidebar-right: 100`
- Resize handle at `--z-sidebar-resize-handle: 30` (TOO LOW!)
- Tabs may be behind other elements

---

## Panel 3: Canvas Area

### Component Failures:
1. **Drawing Tools**
   - **Issue**: Canvas may have `pointer-events: none` on overlay
   - **Impact**: Can't draw or interact with canvas
   - **Fix**: Ensure canvas has `pointer-events: auto`

2. **PowerUserToolbar**
   - **Issue**: Floating toolbar may be behind other elements
   - **Impact**: Can't access canvas settings
   - **Fix**: Ensure toolbar has proper z-index (`--z-power-toolbar: 50`)

3. **Rulers**
   - **Issue**: Rulers may overlap interactive elements
   - **Impact**: Can't click on canvas near edges
   - **Fix**: Ensure rulers have `pointer-events: none`

### Z-Stack Issues:
- Canvas at `--z-canvas: 10` (TOO LOW!)
- Power toolbar at `--z-power-toolbar: 50` (may be behind sidebars at 100)
- Rulers at `--z-rulers: 50` (may block interactions)

---

## Panel 4: Header/File Menu

### Component Failures:
1. **Menu Items**
   - **Issue**: Dropdowns may be behind other elements
   - **Impact**: Can't access menu options
   - **Fix**: Ensure menus have proper z-index (`--z-menu: 400`)

2. **Material Icons**
   - **Issue**: Icons showing as text
   - **Impact**: Unprofessional appearance
   - **Fix**: Ensure Material Symbols font loads

### Z-Stack Issues:
- Menu at `--z-menu: 400` (should be fine)
- Dropdowns at `--z-dropdown: 500` (should be fine)

---

## Panel 5: Footer

### Component Failures:
1. **Status Information**
   - **Issue**: Text may be too small or low contrast
   - **Impact**: Hard to read for low vision users
   - **Fix**: Increase font size, improve contrast

2. **Material Icons**
   - **Issue**: Icons showing as text
   - **Impact**: Unprofessional appearance
   - **Fix**: Ensure Material Symbols font loads

### Z-Stack Issues:
- Footer at `z-40` (may be behind other elements)
- **Fix**: Ensure footer has proper z-index

---

## Panel 6: Animation Timeline (if visible)

### Component Failures:
1. **Timeline Controls**
   - **Issue**: Buttons may be unclickable
   - **Impact**: Can't control animation
   - **Fix**: Ensure all controls have `pointer-events: auto`

2. **Frame Numbers**
   - **Issue**: May be too small or low contrast
   - **Impact**: Hard to read
   - **Fix**: Increase font size, improve contrast

### Z-Stack Issues:
- Timeline at `--z-timeline-expanded: 100` (may conflict with sidebars)

---

## Biggest User Frustrations (Priority Order)

1. **"I can't click on things"** - Z-stack and pointer-events issues
2. **"Icons are showing as text"** - Material Symbols font not loading
3. **"I can't resize panels"** - Resize handles have wrong z-index
4. **"I can't type in the chat"** - Input field hidden or has no height
5. **"Everything looks the same"** - No visual hierarchy
6. **"I don't know what's clickable"** - No clear affordances

---

## Immediate Fixes Needed

1. **Fix z-index hierarchy** - Resize handles must be above sidebars
2. **Fix pointer-events** - Ensure all interactive elements are clickable
3. **Fix Material Icons font** - Ensure font loads correctly
4. **Fix input visibility** - Ensure all inputs are visible and functional
5. **Add focus indicators** - Clear keyboard navigation
6. **Improve visual hierarchy** - Clear primary/secondary actions

