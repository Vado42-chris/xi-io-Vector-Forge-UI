# UI Surface Priority Matrix
## Most Actionable Item (MAI) Framework

**Server Timestamp:** 1737955680000  
**Date:** December 27, 2025  
**Patent Tracking ID:** VF-UI-MATRIX-2025-12-27-001  
**Work Tracking ID:** WT-UI-MATRIX-1737955680000  
**Calculations Per Minute:** 0.0 (planning document)  
**Approved By:** Chris Hallberg, CEO, Xibalba Mixed Media Studio

---

## Priority Levels

### P0 - Critical (Always Visible/Immediate Access)
- **Definition:** Essential for current workflow, blocks progress if missing
- **Surface:** Always visible or immediate access (keyboard shortcut)
- **Examples:** Active tool, selected object properties, save button

### P1 - High (Contextual/One Click Away)
- **Definition:** Frequently needed, directly related to current task
- **Surface:** Contextual menu, toolbar, one click away
- **Examples:** Layer panel, tool palette, undo/redo

### P2 - Medium (Two Clicks Away)
- **Definition:** Occasionally needed, supports current task
- **Surface:** Menu, panel, two clicks away
- **Examples:** Preferences, help, export options

### P3 - Low (Hidden/Advanced)
- **Definition:** Rarely needed, advanced features
- **Surface:** Settings, advanced menu, command palette
- **Examples:** Developer tools, API settings, debug options

---

## Workflow-Based Priority Matrix

### Workflow: Vector Editing

| UI Element | Priority | Surface Location | Access Method | Validation |
|------------|----------|------------------|---------------|------------|
| Active Tool | P0 | Left Toolbar | Click | Task completion time |
| Selected Object Properties | P0 | Right Sidebar | Auto-show | Property edit success rate |
| Layers Panel | P1 | Left Sidebar | Always visible | Layer operation frequency |
| Undo/Redo | P1 | Top Toolbar | Ctrl+Z/Ctrl+Y | Undo usage frequency |
| Save | P0 | File Menu | Ctrl+S | Save frequency, error rate |
| Export | P1 | File Menu | File > Export | Export success rate |
| Grid/Guides | P1 | View Menu | View > Show Grid | Usage frequency |
| Zoom/Pan | P1 | Canvas | Mouse wheel, space+drag | Navigation efficiency |
| Tool Properties | P1 | Right Sidebar | Auto-show on tool select | Property edit success |
| Color Picker | P1 | Right Sidebar | Click color swatch | Color selection time |
| Text Editor | P1 | Context Menu | Double-click text | Text edit success rate |
| Path Editor | P1 | Context Menu | Select path, edit | Path edit success rate |
| Boolean Operations | P2 | Tool Menu | Tools > Boolean | Usage frequency |
| Gradient Editor | P2 | Right Sidebar | Click gradient swatch | Gradient edit success |
| Transform Panel | P1 | Right Sidebar | Auto-show on select | Transform operation success |
| Align/Distribute | P2 | Tool Menu | Tools > Align | Usage frequency |
| Preferences | P2 | File Menu | File > Preferences | Preference change frequency |
| Help | P2 | Help Menu | F1 | Help usage, resolution rate |
| Marketplace | P3 | View Menu | View > Marketplace | Marketplace visit frequency |

---

### Workflow: Animation

| UI Element | Priority | Surface Location | Access Method | Validation |
|------------|----------|------------------|---------------|------------|
| Timeline | P0 | Bottom Panel | Always visible | Timeline operation frequency |
| Playback Controls | P0 | Timeline | Always visible | Playback usage |
| Keyframe Editor | P1 | Timeline | Click keyframe | Keyframe edit success |
| Frame Navigator | P1 | Timeline | Always visible | Frame navigation frequency |
| Onion Skin | P1 | View Menu | View > Onion Skin | Usage frequency |
| Animation Properties | P1 | Right Sidebar | Auto-show on keyframe | Property edit success |
| Easing Functions | P2 | Animation Panel | Animation > Easing | Usage frequency |
| Motion Presets | P2 | Animation Panel | Animation > Presets | Preset usage frequency |
| Frame Rate | P1 | Timeline | Timeline settings | Frame rate change frequency |
| Export Animation | P1 | File Menu | File > Export Animation | Export success rate |
| Import from Studio | P2 | File Menu | File > Import | Import success rate |

---

### Workflow: Scripting

| UI Element | Priority | Surface Location | Access Method | Validation |
|------------|----------|------------------|---------------|------------|
| Script Editor | P0 | Right Sidebar | Scripts tab | Script edit success |
| Command Palette | P0 | Global | Ctrl+Shift+P | Command usage frequency |
| Hashtag Lexicon | P1 | Help Panel | Help > Lexicon | Lexicon usage frequency |
| Script Execution | P1 | Script Editor | Run button | Execution success rate |
| Script Library | P1 | Scripts Panel | Scripts > Library | Script usage frequency |
| Error Console | P1 | Bottom Panel | Auto-show on error | Error resolution rate |
| AI Chatbot | P1 | Right Sidebar | Chat tab | Chat usage, resolution rate |
| Code Completion | P1 | Script Editor | Auto-complete | Completion usage |
| Syntax Highlighting | P1 | Script Editor | Always on | Code readability |
| Script Templates | P2 | Scripts Panel | Scripts > Templates | Template usage frequency |

---

### Workflow: Task Management

| UI Element | Priority | Surface Location | Access Method | Validation |
|------------|----------|------------------|---------------|------------|
| SprintBoard | P0 | Main View | View switcher | Task completion rate |
| Task Card | P0 | SprintBoard | Click task | Task interaction frequency |
| Inspector Panel | P1 | Right Sidebar | Auto-show on select | Inspector usage |
| Task Creation | P1 | SprintBoard | + button | Task creation success |
| Task Filtering | P1 | SprintBoard | Filter controls | Filter usage frequency |
| Task Search | P1 | SprintBoard | Search bar | Search usage frequency |
| Action Center | P1 | Header | Always visible | Action usage frequency |
| Task Linking | P2 | Inspector | Link button | Link creation frequency |
| Task History | P2 | Inspector | History tab | History view frequency |
| Task Analytics | P3 | View Menu | View > Analytics | Analytics view frequency |

---

## Context-Based Surface Rules

### Rule 1: Object Selection Context
**When:** Object is selected  
**Surface:**
- P0: Object properties (right sidebar)
- P1: Transform handles (canvas)
- P1: Context menu (right-click)
- P2: Layer info (layers panel)

### Rule 2: Tool Activation Context
**When:** Tool is activated  
**Surface:**
- P0: Tool properties (right sidebar)
- P1: Tool options (toolbar)
- P1: Tool cursor (canvas)
- P2: Tool help (tooltip)

### Rule 3: Error Context
**When:** Error occurs  
**Surface:**
- P0: Error message (toast/notification)
- P1: Error details (error panel)
- P1: Recovery options (error panel)
- P2: Help link (error panel)

### Rule 4: Workflow Switch Context
**When:** User switches workflows  
**Surface:**
- P0: Workflow-specific layout
- P1: Workflow-specific tools
- P1: Workflow-specific panels
- P2: Workflow help (contextual)

### Rule 5: First-Time User Context
**When:** First-time user  
**Surface:**
- P0: Getting started guide
- P1: Tooltips (progressive)
- P1: Sample projects
- P2: Tutorials

---

## Surface Implementation Strategy

### 1. Always Visible (P0)
- **Location:** Main UI (toolbar, sidebar, canvas)
- **Implementation:** React components, always rendered
- **Performance:** Optimize rendering, use memoization
- **Accessibility:** Keyboard accessible, screen reader friendly

### 2. Contextual (P1)
- **Location:** Context menus, auto-show panels
- **Implementation:** Conditional rendering, context-aware
- **Performance:** Lazy load, cache when possible
- **Accessibility:** Keyboard accessible, focus management

### 3. On-Demand (P2)
- **Location:** Menus, panels, dialogs
- **Implementation:** Lazy loading, code splitting
- **Performance:** Load on demand, cache after first load
- **Accessibility:** Keyboard navigation, focus trap

### 4. Advanced (P3)
- **Location:** Settings, advanced menu, command palette
- **Implementation:** Lazy loading, code splitting
- **Performance:** Load on demand, minimal impact
- **Accessibility:** Keyboard accessible, documented

---

## Validation Checklist

### For Each UI Element:

- [ ] **Priority Assigned:** P0, P1, P2, or P3
- [ ] **Surface Location Defined:** Where it appears
- [ ] **Access Method Defined:** How to access it
- [ ] **Context Rules Defined:** When it appears
- [ ] **Keyboard Accessible:** Can be accessed via keyboard
- [ ] **Screen Reader Friendly:** Works with screen readers
- [ ] **Performance Optimized:** Loads efficiently
- [ ] **User Tested:** Validated with real users
- [ ] **Analytics Tracked:** Usage tracked
- [ ] **Help Available:** Help content exists
- [ ] **Error Handling:** Errors handled gracefully

---

## Next Steps

1. **Implement Priority System**
   - Create priority-based rendering system
   - Implement contextual surface rules
   - Add performance optimization

2. **Create Surface Components**
   - Build contextual menu system
   - Create auto-show panel system
   - Implement lazy loading

3. **Validate with Users**
   - Conduct usability testing
   - Measure task completion
   - Collect feedback

4. **Iterate and Improve**
   - Analyze usage data
   - Adjust priorities
   - Refine surface rules

---

**Document Status:** Approved  
**Last Updated:** December 27, 2025  
**Next Review:** January 3, 2026

