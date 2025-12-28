# File Menu 5Ws Comprehensive Analysis
## Complete User Journey & Interaction Design for Every Menu Item

**Date:** 2025-01-27  
**Purpose:** Define proper UX for every menu item - what it does, how users interact, what UI it needs

---

## Analysis Framework

For each menu item, we analyze:
- **WHO:** Which user types need this?
- **WHAT:** What does it do? What's the action?
- **WHEN:** When in workflow is it used?
- **WHERE:** Where does the UI appear? (Palette, Tab, Dialog, Simple Click)
- **WHY:** Why does the user need this?
- **HOW:** How is it validated? What's the interaction pattern?

---

## FILE MENU

### FILE_NEW
- **WHO:** All users (first action)
- **WHAT:** Creates new blank document
- **WHEN:** Start of workflow, beginning of session
- **WHERE:** **Simple Click** → Opens dialog with document presets (size, color mode, template)
- **WHY:** Start new project
- **HOW:** Dialog with presets (Web, Print, Mobile, Custom), then creates canvas
- **UI Pattern:** Modal dialog with preset cards

### FILE_NEW_TEMPLATE
- **WHO:** Users wanting quick starts
- **WHAT:** Create from template library
- **WHEN:** Start of workflow with specific use case
- **WHERE:** **Dialog** → Template browser with categories
- **WHY:** Faster start with pre-configured setups
- **HOW:** Browse templates, preview, select, opens new doc
- **UI Pattern:** Full-screen template browser modal

### FILE_OPEN
- **WHO:** All users
- **WHAT:** Open existing .xibalba or SVG file
- **WHEN:** Resume work, open existing project
- **WHERE:** **Simple Click** → System file picker dialog
- **WHY:** Access saved work
- **HOW:** Standard file dialog, validates format, loads document
- **UI Pattern:** Native file picker

### FILE_OPEN_RECENT
- **WHO:** Frequent users
- **WHAT:** Quick access to recently opened files
- **WHEN:** Resume recent work
- **WHERE:** **Submenu** → List of recent files (max 10)
- **WHY:** Faster access than browsing
- **HOW:** Click file name, opens immediately
- **UI Pattern:** Submenu list with file names and paths

### FILE_CLOSE
- **WHO:** All users
- **WHAT:** Close current document (prompts save if unsaved)
- **WHEN:** End of session, switching documents
- **WHERE:** **Simple Click** → Confirmation if unsaved
- **WHY:** Close current work
- **HOW:** Checks for unsaved changes, prompts if needed
- **UI Pattern:** Simple action with optional confirmation

### FILE_SAVE
- **WHO:** All users
- **WHAT:** Save current document
- **WHEN:** During work, before closing
- **WHERE:** **Simple Click** → Saves to current location or prompts for location
- **WHY:** Preserve work
- **HOW:** Saves to localStorage + downloads .xibalba file
- **UI Pattern:** Simple action, toast notification

### FILE_SAVE_AS
- **WHO:** All users
- **WHAT:** Save with new name/location
- **WHEN:** Creating copy, first save, exporting variant
- **WHERE:** **Simple Click** → File save dialog
- **WHY:** Save copy or rename
- **HOW:** File picker for location/name
- **UI Pattern:** Native file save dialog

### FILE_SAVE_COPY
- **WHO:** Users creating variants
- **WHAT:** Save copy without changing current file
- **WHEN:** Creating backup or variant
- **WHERE:** **Simple Click** → File save dialog
- **WHY:** Keep original, create variant
- **HOW:** Same as Save As but doesn't change current file reference
- **UI Pattern:** Native file save dialog

### FILE_SAVE_WEB
- **WHO:** Web developers, designers
- **WHAT:** Optimize and save for web (SVG/PNG with web settings)
- **WHEN:** Exporting for web use
- **WHERE:** **Dialog** → Web optimization settings (format, quality, size)
- **WHY:** Web-optimized output
- **HOW:** Dialog with format options, optimization presets
- **UI Pattern:** Settings dialog with preview

### FILE_REVERT
- **WHO:** Users who made mistakes
- **WHAT:** Revert to last saved version
- **WHEN:** After making unwanted changes
- **WHERE:** **Simple Click** → Confirmation dialog
- **WHY:** Undo all unsaved changes
- **HOW:** Confirms, loads last saved state
- **UI Pattern:** Confirmation dialog

### FILE_PLACE
- **WHO:** Users importing assets
- **WHAT:** Import image/SVG into document
- **WHEN:** Adding external assets
- **WHERE:** **Simple Click** → File picker, then places on canvas
- **WHY:** Add external images/assets
- **HOW:** File picker → places at cursor or center
- **UI Pattern:** File picker + canvas placement

### FILE_IMPORT
- **WHO:** Users importing vector data
- **WHAT:** Import layers/objects from another file
- **WHEN:** Combining projects, importing assets
- **WHERE:** **Dialog** → File picker + import options (which layers, merge mode)
- **WHY:** Combine work from multiple files
- **HOW:** File picker → layer selection dialog → imports
- **UI Pattern:** Multi-step dialog

### FILE_EXPORT (Submenu)
- **WHO:** All users (different formats for different needs)
- **WHAT:** Export in various formats
- **WHEN:** Finalizing work for different uses
- **WHERE:** **Submenu** → Format options, then format-specific dialog
- **WHY:** Output for different purposes (print, web, animation)
- **HOW:** Submenu → format selection → format-specific export dialog
- **UI Pattern:** Submenu → Format dialogs

#### FILE_EXPORT_SVG
- **UI Pattern:** Dialog with SVG options (optimize, embed fonts, viewBox settings)

#### FILE_EXPORT_PNG
- **UI Pattern:** Dialog with resolution, DPI, transparency, background color

#### FILE_EXPORT_PDF
- **UI Pattern:** Dialog with page size, compression, color mode, layers

#### FILE_EXPORT_EPS
- **UI Pattern:** Dialog with EPS version, preview, compatibility

#### FILE_EXPORT_ANIMATION
- **UI Pattern:** Dialog linking to Animation Studio export pipeline

### FILE_DOCUMENT_SETUP
- **WHO:** All users (document configuration)
- **WHAT:** Configure document properties (size, color mode, units)
- **WHEN:** New document, changing document settings
- **WHERE:** **Dialog** → Document settings panel
- **WHY:** Configure document for specific output
- **HOW:** Modal dialog with tabs (Size, Color, Units, Grid)
- **UI Pattern:** Settings dialog with tabs

### FILE_COLOR_MODE (Submenu)
- **WHO:** Print/web designers
- **WHAT:** Set document color mode
- **WHEN:** Setting up for specific output (print vs web)
- **WHERE:** **Submenu** → RGB/CMYK/Grayscale selection
- **WHY:** Match output requirements
- **HOW:** Submenu selection → updates document color space
- **UI Pattern:** Simple submenu selection

---

## EDIT MENU

### EDIT_UNDO / EDIT_REDO
- **WHO:** All users
- **WHAT:** Undo/redo last action
- **WHEN:** After mistakes, exploring options
- **WHERE:** **Simple Click** → Immediate action
- **WHY:** Correct mistakes, explore alternatives
- **HOW:** Keyboard shortcut or click, updates canvas immediately
- **UI Pattern:** Simple action, visual feedback

### EDIT_CUT / EDIT_COPY / EDIT_PASTE
- **WHO:** All users
- **WHAT:** Clipboard operations
- **WHEN:** Moving/copying objects between layers or documents
- **WHERE:** **Simple Click** → Immediate action
- **WHY:** Standard clipboard operations
- **HOW:** Standard OS clipboard integration
- **UI Pattern:** Simple actions

### EDIT_PASTE_IN_PLACE / EDIT_PASTE_IN_FRONT / EDIT_PASTE_IN_BACK
- **WHO:** Power users, precise positioning
- **WHAT:** Paste with specific positioning
- **WHEN:** Precise layer placement
- **WHERE:** **Simple Click** → Immediate action
- **WHY:** Precise layer management
- **HOW:** Paste with calculated position
- **UI Pattern:** Simple actions

### EDIT_CLEAR
- **WHO:** All users
- **WHAT:** Delete selected objects
- **WHEN:** Removing unwanted objects
- **WHERE:** **Simple Click** → Immediate action (with undo)
- **WHY:** Remove objects
- **HOW:** Deletes selection, updates canvas
- **UI Pattern:** Simple action

### EDIT_FIND_AND_REPLACE
- **WHO:** Users working with text
- **WHAT:** Find/replace text in document
- **WHEN:** Editing text content
- **WHERE:** **Dialog** → Find/replace panel
- **WHY:** Bulk text editing
- **HOW:** Dialog with search/replace fields, preview
- **UI Pattern:** Search dialog with results list

### EDIT_CHECK_SPELLING
- **WHO:** Users creating text content
- **WHAT:** Spell check text objects
- **WHEN:** Before finalizing text
- **WHERE:** **Dialog** → Spell check panel
- **WHY:** Correct spelling errors
- **HOW:** Scans text, shows suggestions dialog
- **UI Pattern:** Spell check dialog with suggestions

### EDIT_PREFERENCES (Submenu)
- **WHO:** All users (customization)
- **WHAT:** Application preferences
- **WHEN:** Setting up workspace, customizing
- **WHERE:** **Submenu** → Preference category, then settings dialog
- **WHY:** Customize application behavior
- **HOW:** Submenu → category → settings dialog with tabs
- **UI Pattern:** Submenu → Settings dialog

---

## OBJECT MENU

### OBJECT_TRANSFORM (Submenu)
- **WHO:** All users (object manipulation)
- **WHAT:** Transform objects (move, rotate, scale, etc.)
- **WHEN:** Positioning and adjusting objects
- **WHERE:** **Submenu** → Transform type → Transform dialog/palette
- **WHY:** Precise object manipulation
- **HOW:** Submenu → opens transform palette or dialog with numeric inputs
- **UI Pattern:** Submenu → Transform palette (docked or floating)

### OBJECT_ARRANGE (Submenu)
- **WHO:** All users (layer management)
- **WHAT:** Change layer stacking order
- **WHEN:** Adjusting visual hierarchy
- **WHERE:** **Submenu** → Immediate action (bring to front, etc.)
- **WHY:** Control what appears on top
- **HOW:** Simple submenu actions, immediate layer reordering
- **UI Pattern:** Simple submenu actions

### OBJECT_GROUP / OBJECT_UNGROUP
- **WHO:** All users
- **WHAT:** Group/ungroup objects
- **WHEN:** Organizing related objects
- **WHERE:** **Simple Click** → Immediate action
- **WHY:** Organize and manipulate multiple objects together
- **HOW:** Groups selected objects, updates layers panel
- **UI Pattern:** Simple actions

### OBJECT_LOCK / OBJECT_UNLOCK
- **WHO:** All users
- **WHAT:** Lock/unlock objects from editing
- **WHEN:** Protecting objects from accidental changes
- **WHERE:** **Simple Click** → Immediate action
- **WHY:** Prevent accidental edits
- **HOW:** Toggles lock state, visual indicator in layers
- **UI Pattern:** Simple actions

### OBJECT_HIDE / OBJECT_SHOW
- **WHO:** All users
- **WHAT:** Hide/show objects
- **WHEN:** Temporarily hiding objects while working
- **WHERE:** **Simple Click** → Immediate action
- **WHY:** Reduce visual clutter
- **HOW:** Toggles visibility, updates layers panel
- **UI Pattern:** Simple actions

### OBJECT_PATH (Submenu)
- **WHO:** Power users (path editing)
- **WHAT:** Path manipulation operations
- **WHEN:** Advanced path editing
- **WHERE:** **Submenu** → Path operation → Dialog or immediate action
- **WHY:** Advanced path manipulation
- **HOW:** Submenu → operation → dialog for options or immediate action
- **UI Pattern:** Submenu → Operation dialogs

### OBJECT_BLEND (Submenu)
- **WHO:** Advanced users (blending)
- **WHAT:** Create and manage blends
- **WHEN:** Creating smooth transitions
- **WHERE:** **Submenu** → Blend operation → Blend palette
- **WHY:** Create smooth color/shape transitions
- **HOW:** Submenu → opens blend palette with options
- **UI Pattern:** Submenu → Blend palette

### OBJECT_ENVELOPE (Submenu)
- **WHO:** Advanced users (distortion)
- **WHAT:** Apply envelope distortions
- **WHEN:** Warping/distorting objects
- **WHERE:** **Submenu** → Envelope type → Envelope editor
- **WHY:** Warp objects with mesh or warp
- **HOW:** Submenu → opens envelope editor with mesh controls
- **UI Pattern:** Submenu → Envelope editor palette

### OBJECT_COMPOUND_PATH (Submenu)
- **WHO:** Power users
- **WHAT:** Create/release compound paths
- **WHEN:** Creating complex shapes with holes
- **WHERE:** **Simple Click** → Immediate action
- **WHY:** Create shapes with cutouts
- **HOW:** Makes compound path from selected objects
- **UI Pattern:** Simple actions

### OBJECT_GRAPH (Submenu)
- **WHO:** Data visualization users
- **WHAT:** Create and edit graphs/charts
- **WHEN:** Creating data visualizations
- **WHERE:** **Submenu** → Graph type → Graph editor dialog
- **WHY:** Create charts and graphs
- **HOW:** Submenu → graph type dialog → graph editor palette
- **UI Pattern:** Submenu → Graph editor palette

### OBJECT_IMAGE_TRACE
- **WHO:** Users converting raster to vector
- **WHAT:** Trace bitmap images to vector
- **WHEN:** Converting photos/rasters to vectors
- **WHERE:** **Dialog** → Image trace settings palette
- **WHY:** Convert raster to vector
- **HOW:** Dialog with trace presets and settings, preview
- **UI Pattern:** Image trace palette with preview

### OBJECT_TEXT_WRAP
- **WHO:** Layout designers
- **WHAT:** Wrap text around objects
- **WHEN:** Creating text layouts
- **WHERE:** **Submenu** → Wrap type → Wrap settings
- **WHY:** Professional text layouts
- **HOW:** Submenu → wrap options dialog
- **UI Pattern:** Submenu → Wrap settings dialog

### OBJECT_CLIPPING_MASK
- **WHO:** All users
- **WHAT:** Create/release clipping masks
- **WHEN:** Masking objects to shapes
- **WHERE:** **Simple Click** → Immediate action
- **WHY:** Mask content to shape
- **HOW:** Creates mask from selection, updates layers
- **UI Pattern:** Simple actions

### OBJECT_COMPOUND_SHAPE
- **WHO:** Power users
- **WHAT:** Create/release compound shapes (pathfinder operations)
- **WHEN:** Combining shapes with boolean operations
- **WHERE:** **Submenu** → Pathfinder operation → Immediate action
- **WHY:** Complex shape creation
- **HOW:** Submenu → applies pathfinder operation
- **UI Pattern:** Submenu → Immediate actions

---

## TYPE MENU

### TYPE_FONT (Submenu)
- **WHO:** All users working with text
- **WHAT:** Select font family
- **WHEN:** Setting text appearance
- **WHERE:** **Submenu** → Font list → Font palette opens
- **WHY:** Choose typography
- **HOW:** Submenu → opens font palette with search and preview
- **UI Pattern:** Submenu → Font palette (docked or floating)

### TYPE_SIZE (Submenu)
- **WHO:** All users working with text
- **WHAT:** Set font size
- **WHEN:** Adjusting text size
- **WHERE:** **Submenu** → Size presets or custom → Updates in right panel
- **WHY:** Control text size
- **HOW:** Submenu → size selection → updates right panel Type tab
- **UI Pattern:** Submenu → Right panel Type tab updates

### TYPE_CREATE_OUTLINES
- **WHO:** Users converting text to paths
- **WHAT:** Convert text to vector paths
- **WHEN:** Finalizing text, creating custom shapes
- **WHERE:** **Simple Click** → Immediate action
- **WHY:** Convert text to editable paths
- **HOW:** Converts text objects to path objects
- **UI Pattern:** Simple action

### TYPE_FIND_FONT
- **WHO:** Users managing fonts
- **WHAT:** Find and replace fonts in document
- **WHEN:** Changing fonts across document
- **WHERE:** **Dialog** → Font find/replace panel
- **WHY:** Bulk font replacement
- **HOW:** Dialog with font list, replace options
- **UI Pattern:** Font find/replace dialog

### TYPE_CHANGE_CASE
- **WHO:** Text editors
- **WHAT:** Change text case (upper, lower, title)
- **WHEN:** Formatting text
- **WHERE:** **Submenu** → Case type → Immediate action
- **WHY:** Format text case
- **HOW:** Submenu → applies case change
- **UI Pattern:** Simple submenu actions

---

## SELECT MENU

### SELECT_ALL / SELECT_DESELECT
- **WHO:** All users
- **WHAT:** Select/deselect all objects
- **WHEN:** Bulk operations
- **WHERE:** **Simple Click** → Immediate action
- **WHY:** Select everything or clear selection
- **HOW:** Updates selection state
- **UI Pattern:** Simple actions

### SELECT_SAME (Submenu)
- **WHO:** Power users
- **WHAT:** Select objects with same attributes
- **WHEN:** Finding similar objects
- **WHERE:** **Submenu** → Attribute type → Immediate action
- **WHY:** Select similar objects quickly
- **HOW:** Submenu → attribute → selects matching objects
- **UI Pattern:** Simple submenu actions

### SELECT_OBJECT (Submenu)
- **WHO:** Power users
- **WHAT:** Select specific object types
- **WHEN:** Selecting by type
- **WHERE:** **Submenu** → Object type → Immediate action
- **WHY:** Select by object category
- **HOW:** Submenu → selects all of that type
- **UI Pattern:** Simple submenu actions

### SELECT_SAVE_SELECTION
- **WHO:** Power users
- **WHAT:** Save current selection for later
- **WHEN:** Reusing complex selections
- **WHERE:** **Dialog** → Name selection → Saves to selection library
- **WHY:** Reuse complex selections
- **HOW:** Dialog to name selection, saves to library
- **UI Pattern:** Simple dialog

### SELECT_EDIT_SELECTION
- **WHO:** Power users
- **WHAT:** Edit saved selections
- **WHEN:** Managing saved selections
- **WHERE:** **Dialog** → Selection manager
- **WHY:** Manage saved selections
- **HOW:** Dialog with list of saved selections, edit/delete
- **UI Pattern:** Selection manager dialog

---

## EFFECT MENU

### EFFECT_3D (Submenu)
- **WHO:** 3D effect users
- **WHAT:** Apply 3D effects to objects
- **WHEN:** Creating 3D appearances
- **WHERE:** **Submenu** → 3D effect type → 3D effect palette
- **WHY:** Add 3D appearance
- **HOW:** Submenu → opens 3D effect palette with controls
- **UI Pattern:** Submenu → 3D effect palette

### EFFECT_SVG_FILTERS (Submenu)
- **WHO:** Advanced users
- **WHAT:** Apply SVG filters
- **WHEN:** Adding visual effects
- **WHERE:** **Submenu** → Filter type → Filter palette
- **WHY:** Apply SVG filter effects
- **HOW:** Submenu → opens filter palette
- **UI Pattern:** Submenu → Filter palette

### EFFECT_DISTORT (Submenu)
- **WHO:** Advanced users
- **WHAT:** Distort and transform effects
- **WHEN:** Creating distortions
- **WHERE:** **Submenu** → Distort type → Distort palette
- **WHY:** Apply distortion effects
- **HOW:** Submenu → opens distort palette
- **UI Pattern:** Submenu → Distort palette

### EFFECT_PATH (Submenu)
- **WHO:** Power users
- **WHAT:** Path-based effects
- **WHEN:** Path manipulation effects
- **WHERE:** **Submenu** → Path effect → Effect palette
- **WHY:** Apply path effects
- **HOW:** Submenu → opens effect palette
- **UI Pattern:** Submenu → Effect palette

### EFFECT_PATHFINDER (Submenu)
- **WHO:** Power users
- **WHAT:** Pathfinder effect operations
- **WHEN:** Combining shapes with effects
- **WHERE:** **Submenu** → Pathfinder operation → Immediate action
- **WHY:** Apply pathfinder as effect (non-destructive)
- **HOW:** Submenu → applies effect
- **UI Pattern:** Simple submenu actions

### EFFECT_RASTERIZE
- **WHO:** Users converting to raster
- **WHAT:** Rasterize vector objects
- **WHEN:** Converting vectors to raster
- **WHERE:** **Dialog** → Rasterize settings
- **WHY:** Convert to raster for specific effects
- **HOW:** Dialog with resolution and settings
- **UI Pattern:** Rasterize dialog

### EFFECT_STYLIZE (Submenu)
- **WHO:** All users
- **WHAT:** Stylistic effects
- **WHEN:** Adding visual style
- **WHERE:** **Submenu** → Stylize type → Effect palette
- **WHY:** Add stylistic effects
- **HOW:** Submenu → opens stylize palette
- **UI Pattern:** Submenu → Stylize palette

---

## VIEW MENU

### VIEW_OUTLINE / VIEW_OVERPRINT_PREVIEW
- **WHO:** All users
- **WHAT:** Toggle view modes
- **WHEN:** Different viewing needs
- **WHERE:** **Simple Click** → Toggles view mode
- **WHY:** See structure vs appearance
- **HOW:** Toggles canvas view mode
- **UI Pattern:** Simple toggle actions

### VIEW_ZOOM_IN / VIEW_ZOOM_OUT / VIEW_FIT / VIEW_ACTUAL
- **WHO:** All users
- **WHAT:** Zoom controls
- **WHEN:** Navigating canvas
- **WHERE:** **Simple Click** → Updates zoom
- **WHY:** Navigate and view details
- **HOW:** Updates canvas zoom level
- **UI Pattern:** Simple actions

### VIEW_HIDE_EDGES / VIEW_HIDE_ARTBOARDS
- **WHO:** All users
- **WHAT:** Toggle UI element visibility
- **WHEN:** Cleaner view
- **WHERE:** **Simple Click** → Toggles visibility
- **WHY:** Reduce visual clutter
- **HOW:** Toggles UI element visibility
- **UI Pattern:** Simple toggle actions

### VIEW_SHOW_RULERS / VIEW_SHOW_GRID / VIEW_SHOW_GUIDES / VIEW_SMART_GUIDES
- **WHO:** All users
- **WHAT:** Toggle guide/ruler visibility
- **WHEN:** Precision work
- **WHERE:** **Simple Click** → Toggles visibility
- **WHY:** Show/hide guides for precision
- **HOW:** Toggles guide visibility
- **UI Pattern:** Simple toggle actions

### VIEW_NEW_VIEW / VIEW_EDIT_VIEWS
- **WHO:** Power users
- **WHAT:** Manage saved views
- **WHEN:** Saving/restoring view positions
- **WHERE:** **Dialog** → View manager
- **WHY:** Save and restore view positions
- **HOW:** Dialog to save/restore named views
- **UI Pattern:** View manager dialog

---

## WINDOW MENU

### WINDOW_NEW
- **WHO:** Power users
- **WHAT:** Open document in new window
- **WHEN:** Multi-window workflow
- **WHERE:** **Simple Click** → Opens new window
- **WHY:** Multi-monitor or multi-window workflow
- **HOW:** Opens current document in new window
- **UI Pattern:** Simple action

### WINDOW_WORKSPACE (Submenu)
- **WHO:** All users
- **WHAT:** Switch workspace layouts
- **WHEN:** Different workflow needs
- **WHERE:** **Submenu** → Workspace preset → Updates layout
- **WHY:** Optimize layout for task
- **HOW:** Submenu → applies workspace preset
- **UI Pattern:** Simple submenu actions

### WINDOW_ACTIONS / WINDOW_ALIGN / WINDOW_APPEARANCE / etc.
- **WHO:** All users
- **WHAT:** Toggle panel visibility
- **WHEN:** Showing/hiding panels
- **WHERE:** **Simple Click** → Toggles panel (opens in right sidebar or floating)
- **WHY:** Show/hide specific panels
- **HOW:** Toggles panel visibility, opens in appropriate location
- **UI Pattern:** Simple toggle → Panel appears in right sidebar or as floating palette

### WINDOW_TYPE (Submenu)
- **WHO:** Typography users
- **WHAT:** Open type-related panels
- **WHEN:** Working with text
- **WHERE:** **Submenu** → Type panel → Opens in right sidebar Type tab
- **WHY:** Access type controls
- **HOW:** Submenu → switches to Type tab in right sidebar
- **UI Pattern:** Submenu → Right sidebar tab switch

### WINDOW_BRUSH_LIBRARIES / WINDOW_SYMBOL_LIBRARIES / WINDOW_SWATCH_LIBRARIES (Submenus)
- **WHO:** Asset users
- **WHAT:** Open library panels
- **WHEN:** Accessing asset libraries
- **WHERE:** **Submenu** → Library → Opens library palette
- **WHY:** Access asset libraries
- **HOW:** Submenu → opens library palette (floating or dockable)
- **UI Pattern:** Submenu → Library palette

### WINDOW_PALETTES (Submenu)
- **WHO:** All users
- **WHAT:** Open tool palettes
- **WHEN:** Accessing specialized tools
- **WHERE:** **Submenu** → Palette type → Opens ToolPalette component (draggable, pinnable)
- **WHY:** Access specialized tool sets
- **HOW:** Submenu → creates ToolPalette instance → user can drag, pin to left panel
- **UI Pattern:** Submenu → ToolPalette component (floating, draggable, pinnable)

---

## HELP MENU

### HELP_HELP / HELP_SHORTCUTS
- **WHO:** All users
- **WHAT:** Access help documentation
- **WHEN:** Learning, troubleshooting
- **WHERE:** **Dialog** → Help browser
- **WHY:** Get help and learn
- **HOW:** Opens help dialog with documentation
- **UI Pattern:** Help dialog/browser

### HELP_SYSTEM_INFO
- **WHO:** Support, troubleshooting
- **WHAT:** Show system information
- **WHEN:** Troubleshooting, support requests
- **WHERE:** **Dialog** → System info panel
- **WHY:** Debugging and support
- **HOW:** Dialog with system details
- **UI Pattern:** System info dialog

### HELP_ABOUT
- **WHO:** All users
- **WHAT:** Show application info
- **WHEN:** Checking version, credits
- **WHERE:** **Dialog** → About dialog
- **WHY:** Version info, credits
- **HOW:** Simple about dialog
- **UI Pattern:** About dialog

---

## Summary: UI Pattern Distribution

### Simple Click (Immediate Action)
- Most Edit menu items
- Most Object menu items (group, lock, hide)
- Most View menu items
- Most Select menu items

### Submenu → Simple Action
- Color mode selection
- Arrange operations
- Case changes
- Selection by type

### Submenu → Dialog
- Export formats
- Preferences categories
- Transform operations (with options)

### Submenu → Palette (Floating/Dockable)
- Transform palette
- Blend palette
- Envelope editor
- 3D effects
- Type panels
- **Tool Palettes** (from WINDOW_PALETTES)

### Submenu → Right Sidebar Tab
- Type panels (Character, Paragraph)
- Some window panels (can open in right sidebar)

### Dialog Only
- File operations (Open, Save As)
- Document setup
- Image trace
- Find/replace
- Spell check

### Palette Only (No Menu)
- Tool properties (right sidebar)
- Layers (right sidebar)
- Object inspector (right sidebar)

---

## Implementation Priority

1. **P0 (Critical):** Simple click actions, basic dialogs
2. **P1 (High):** Submenu functionality, right sidebar tabs
3. **P2 (Medium):** Floating palettes, drag/drop
4. **P3 (Low):** Advanced palettes, complex dialogs

---

**Next Steps:**
1. Implement submenu rendering fix
2. Create dialog components for file operations
3. Integrate ToolPalette with WINDOW_PALETTES menu
4. Wire up right sidebar tabs for type panels
5. Create transform/blend/effect palettes

