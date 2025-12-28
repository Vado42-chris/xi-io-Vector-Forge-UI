# Timeline Scripting System - UI Design Specifications

## Visual Design Mockups & Component Specifications

### 1. Script Editor Panel

**Location**: Right Sidebar → "Scripts" Tab (new tab after "History")

**Layout**:
```
┌─────────────────────────────────┐
│ Scripts                    [×]  │
├─────────────────────────────────┤
│ Frame: 30                       │
│ Layer: layer1                   │
├─────────────────────────────────┤
│ #move layer1 x:100 y:50        │
│ #rotate layer1 angle:45        │
│ #fade layer1 opacity:0.5       │
│                                 │
│ [Command Palette] [Test] [Save] │
└─────────────────────────────────┘
```

**Features**:
- Text editor with syntax highlighting
- Line numbers
- Auto-complete dropdown
- Error highlighting (red underline)
- Frame selector dropdown
- Layer selector dropdown
- Command palette button (opens palette)
- Test button (runs script)
- Save button (saves to keyframe)
- Line-by-line execution indicator

**Syntax Highlighting**:
- Hashtags: `#command` - Blue
- Targets: `layer1` - Green
- Parameters: `x:100` - Yellow
- Errors: Red underline

**Auto-complete**:
- Triggers on `#` - shows command list
- Triggers on `:` - shows parameter suggestions
- Shows syntax hints

---

### 2. Command Palette

**Location**: Floating panel (draggable) or modal overlay

**Layout**:
```
┌─────────────────────────────────────────┐
│ Command Palette                    [×]  │
├─────────────────────────────────────────┤
│ [🔍 Search commands...]                │
├─────────────────────────────────────────┤
│ [Animation] [Interaction] [Logic] [Media]│
├─────────────────────────────────────────┤
│ Animation Commands                      │
│ ┌─────────────────────────────────────┐ │
│ │ #move [target] x:[n] y:[n]          │ │
│ │ Move object to position              │ │
│ │ [Add to Script] [Example]           │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ #rotate [target] angle:[n]          │ │
│ │ Rotate object by angle              │ │
│ │ [Add to Script] [Example]           │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ #fade [target] opacity:[0-1]       │ │
│ │ Fade object opacity                 │ │
│ │ [Add to Script] [Example]           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Recent] [Favorites] [All]             │
└─────────────────────────────────────────┘
```

**Features**:
- Search bar (filters commands)
- Category tabs (Animation, Interaction, Logic, Media, etc.)
- Command cards with:
  - Command syntax
  - Description
  - "Add to Script" button
  - "Example" button (shows example)
- Recent commands section
- Favorites section
- Drag-and-drop to timeline

**Interaction**:
- Click "Add to Script" → inserts into script editor
- Click "Example" → shows example dialog
- Drag command → drop on timeline keyframe
- Double-click → adds to script editor

---

### 3. Timeline Script Visualization

**Enhancement**: Add script indicators to timeline

**Visual**:
```
Timeline:
┌─────────────────────────────────────────────┐
│ Frame: 0  10  20  30  40  50  60  70  80   │
├─────────────────────────────────────────────┤
│ layer1: [●]────[●]────[●]────[●]            │
│          │      │      │      │             │
│          📜     📜     📜     📜            │
│         #show  #move  #rotate #fade         │
└─────────────────────────────────────────────┘
```

**Features**:
- Script icon (📜) on keyframes with scripts
- Hover shows script preview
- Click opens script editor
- Color coding by command type
- Script flow visualization (arrows between keyframes)

**Script Preview Tooltip**:
```
┌─────────────────────────┐
│ Frame 30 - layer1        │
├─────────────────────────┤
│ #move layer1 x:100 y:50 │
│ #rotate layer1 angle:45 │
└─────────────────────────┘
```

---

### 4. Help/Lexicon Panel

**Location**: Help menu → "Command Reference" or dedicated panel

**Layout**:
```
┌─────────────────────────────────────────┐
│ Command Reference                  [×]  │
├─────────────────────────────────────────┤
│ [🔍 Search...]                          │
├─────────────────────────────────────────┤
│ #move                                   │
│ ─────────────────────────────────────── │
│ Syntax: #move [target] x:[n] y:[n]      │
│                                         │
│ Moves a layer or object to a new       │
│ position over a specified duration.     │
│                                         │
│ Parameters:                             │
│ • target: Layer ID or name             │
│ • x: X coordinate (number)              │
│ • y: Y coordinate (number)              │
│ • duration: Frames (optional, default:0) │
│                                         │
│ Examples:                               │
│ #move layer1 x:100 y:50                 │
│ #move button1 x:200 y:100 duration:30  │
│                                         │
│ Related: #slide, #bounce, #shake        │
│                                         │
│ [Copy] [Add to Script] [Video Tutorial]│
└─────────────────────────────────────────┘
```

**Features**:
- Complete command dictionary
- Syntax documentation
- Parameter descriptions
- Examples for each command
- Related commands
- Copy button
- Add to script button
- Video tutorial links
- Search functionality
- Category navigation

---

### 5. Script Builder (Visual Command Builder)

**Location**: Command Palette → "Builder" tab

**Layout**:
```
┌─────────────────────────────────────────┐
│ Visual Script Builder              [×]  │
├─────────────────────────────────────────┤
│ Command: [move ▼]                      │
│ Target:  [layer1 ▼]                     │
│                                         │
│ Parameters:                             │
│ X: [100] ────────────────○              │
│ Y: [50]  ────────────────○              │
│ Duration: [30] frames                   │
│                                         │
│ Preview:                                │
│ #move layer1 x:100 y:50 duration:30    │
│                                         │
│ [Add to Script] [Test] [Clear]         │
└─────────────────────────────────────────┘
```

**Features**:
- Dropdown command selector
- Target selector (layers)
- Visual parameter controls (sliders, inputs)
- Live preview of command
- Test button (previews action)
- Add to script button
- Clear button

**Use Case**: For users who prefer visual building over typing

---

### 6. Script Debugger

**Location**: Script Editor → "Debug" mode toggle

**Visual**:
```
┌─────────────────────────────────────────┐
│ Scripts (Debug Mode)               [×]  │
├─────────────────────────────────────────┤
│ Frame: 30                               │
│ Layer: layer1                           │
├─────────────────────────────────────────┤
│ > #move layer1 x:100 y:50              │
│   ✓ Executed (frame 30)                │
│   → layer1.x = 100, layer1.y = 50      │
│                                         │
│ > #rotate layer1 angle:45              │
│   ⏸ Paused at breakpoint               │
│   → layer1.rotation = 45               │
│                                         │
│ [▶ Continue] [⏸ Pause] [⏹ Stop]        │
└─────────────────────────────────────────┘
```

**Features**:
- Step-by-step execution
- Breakpoints (click line number)
- Variable inspection
- Execution log
- Continue/Pause/Stop controls
- Frame-by-frame execution

---

### 7. Command Auto-Complete

**Visual**:
```
Script Editor:
┌─────────────────────────────────────────┐
│ #m                                      │
│ ┌─────────────────────────────────────┐ │
│ │ #move [target] x:[n] y:[n]         │ │
│ │ #moveTo [target] x:[n] y:[n]       │ │
│ │ #multiply [target] factor:[n]      │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Features**:
- Triggers on `#` - shows all commands
- Filters as you type
- Shows syntax hints
- Arrow keys to navigate
- Enter to select
- Tab to complete

---

### 8. Script Library

**Location**: File menu → "Script Library" or dedicated panel

**Layout**:
```
┌─────────────────────────────────────────┐
│ Script Library                     [×]  │
├─────────────────────────────────────────┤
│ [🔍 Search scripts...]                  │
├─────────────────────────────────────────┤
│ Categories: [All] [Animation] [UI] [Game]│
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Button Click Animation              │ │
│ │ #fade button opacity:0.5            │ │
│ │ #scale button x:1.1 y:1.1          │ │
│ │ [Use] [Edit] [Share]                │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Character Movement                 │ │
│ │ #onkey ArrowRight action:#move... │ │
│ │ [Use] [Edit] [Share]                │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Features**:
- Community scripts
- Search functionality
- Categories
- Use button (imports to project)
- Edit button (opens in editor)
- Share button (exports script)
- Rating system
- Tags

---

## Integration Points

### Timeline Integration
- Scripts stored in keyframe metadata
- Visual indicators on timeline
- Click keyframe → opens script editor
- Script execution during playback

### Layer Integration
- Scripts can target layers by ID or name
- Layer selector in script editor
- Visual feedback when script affects layer
- Layer properties accessible in scripts

### React Component Integration
- Scripts can manipulate React components
- Component state accessible
- Event handlers can trigger scripts
- Scripts can trigger React events

---

## Color Scheme (Xibalba Brand)

**Background**: `var(--xibalba-grey-050)`
**Panel**: `var(--xibalba-grey-100)`
**Text**: `var(--xibalba-text-100)`
**Accent**: `var(--xibalba-accent)` (blue)
**Syntax Highlighting**:
- Commands: `#007acc` (blue)
- Targets: `#4caf50` (green)
- Parameters: `#ffc107` (yellow)
- Errors: `#f44336` (red)

---

## Responsive Design

**Desktop**: Full panels, side-by-side layout
**Tablet**: Collapsible panels, stacked layout
**Mobile**: Modal overlays, simplified UI

---

## Accessibility

- Keyboard navigation (Tab, Enter, Arrow keys)
- Screen reader support
- High contrast mode
- Font size scaling
- Focus indicators

---

## Animation & Transitions

- Smooth panel transitions (fade in/out)
- Command palette slide-in animation
- Script execution visual feedback
- Timeline script indicator animations

---

## Next Steps

1. **Create Figma Mockups** - Visual design validation
2. **Build React Components** - Implement UI components
3. **Integrate with Timeline** - Connect scripts to keyframes
4. **Build Parser** - Command parsing logic
5. **Build Executor** - Command execution engine
6. **User Testing** - Validate UX and iterate

---

**This UI design makes scripting accessible and powerful!**

