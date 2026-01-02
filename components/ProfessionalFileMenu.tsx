/**
 * Professional File Menu - Real Product File Bar
 * Complete file operations like any professional application
 * NO BUTTON BORDERS - Real menu appearance
 */

import React, { useState } from 'react';
import XibalbaLogomark from './XibalbaLogomark';
import LayoutSwitcher from './LayoutSwitcher';
import Tooltip from './Tooltip';
import { Button } from './shared/templates/Button';

// Submenu definitions
type MenuItem =
  | {
      label: string;
      action: string;
      icon?: string;
      description?: string;
      disabled?: boolean;
      divider?: never;
    }
  | {
      divider: true;
      label?: never;
      action?: never;
      icon?: never;
      description?: never;
      disabled?: never;
    };

const getSubmenuItems = (action: string): MenuItem[] => {
  // Load recent files from localStorage
  const recentFiles = (() => {
    try {
      const stored = localStorage.getItem('vforge_recent_files');
      if (stored) {
        const files = JSON.parse(stored);
        return files.slice(0, 10).map((f: any, i: number) => ({
          label: f.name || `Document ${i + 1}.vf`,
          action: `FILE_OPEN_RECENT_${i + 1}`,
          icon: 'description',
        }));
      }
    } catch (e) {
      console.error('Failed to load recent files:', e);
    }
    return [];
  })();

  const submenus: Record<string, MenuItem[]> = {
    FILE_OPEN_RECENT:
      recentFiles.length > 0
        ? recentFiles
        : [
            {
              label: 'No recent files',
              action: 'FILE_OPEN_RECENT_1',
              icon: 'description',
              disabled: true,
            },
          ],
    FILE_EXPORT: [
      { label: 'Export as SVG...', action: 'FILE_EXPORT_SVG', icon: 'code' },
      { label: 'Export as PNG...', action: 'FILE_EXPORT_PNG', icon: 'image' },
      { label: 'Export as PDF...', action: 'FILE_EXPORT_PDF', icon: 'picture_as_pdf' },
      { label: 'Export as EPS...', action: 'FILE_EXPORT_EPS', icon: 'description' },
      { label: 'Export for Animation Studio...', action: 'FILE_EXPORT_ANIMATION', icon: 'movie' },
    ],
    FILE_COLOR_MODE: [
      { label: 'RGB', action: 'FILE_COLOR_MODE_RGB', icon: 'palette' },
      { label: 'CMYK', action: 'FILE_COLOR_MODE_CMYK', icon: 'palette' },
      { label: 'Grayscale', action: 'FILE_COLOR_MODE_GRAYSCALE', icon: 'palette' },
    ],
    EDIT_PREFERENCES: [
      { label: 'General...', action: 'EDIT_PREFERENCES_GENERAL', icon: 'settings' },
      { label: 'Interface...', action: 'EDIT_PREFERENCES_INTERFACE', icon: 'dashboard' },
      { label: 'Performance...', action: 'EDIT_PREFERENCES_PERFORMANCE', icon: 'speed' },
      {
        label: 'Accessibility...',
        action: 'EDIT_PREFERENCES_ACCESSIBILITY',
        icon: 'accessibility',
      },
      { label: 'AI Settings...', action: 'EDIT_PREFERENCES_AI', icon: 'smart_toy' },
    ],
    OBJECT_TRANSFORM: [
      { label: 'Move...', action: 'OBJECT_TRANSFORM_MOVE', icon: 'open_with' },
      { label: 'Rotate...', action: 'OBJECT_TRANSFORM_ROTATE', icon: 'rotate_right' },
      { label: 'Reflect...', action: 'OBJECT_TRANSFORM_REFLECT', icon: 'flip' },
      { label: 'Scale...', action: 'OBJECT_TRANSFORM_SCALE', icon: 'aspect_ratio' },
      { label: 'Shear...', action: 'OBJECT_TRANSFORM_SHEAR', icon: 'transform' },
      { label: 'Transform Each...', action: 'OBJECT_TRANSFORM_EACH', icon: 'auto_awesome' },
    ],
    OBJECT_ARRANGE: [
      { label: 'Bring to Front', action: 'OBJECT_ARRANGE_FRONT', icon: 'vertical_align_top' },
      { label: 'Bring Forward', action: 'OBJECT_ARRANGE_FORWARD', icon: 'keyboard_arrow_up' },
      { label: 'Send Backward', action: 'OBJECT_ARRANGE_BACKWARD', icon: 'keyboard_arrow_down' },
      { label: 'Send to Back', action: 'OBJECT_ARRANGE_BACK', icon: 'vertical_align_bottom' },
    ],
    OBJECT_PATH: [
      { label: 'Join', action: 'OBJECT_PATH_JOIN', icon: 'call_merge' },
      { label: 'Average...', action: 'OBJECT_PATH_AVERAGE', icon: 'center_focus_strong' },
      { label: 'Outline Stroke', action: 'OBJECT_PATH_OUTLINE', icon: 'format_shapes' },
      { label: 'Offset Path...', action: 'OBJECT_PATH_OFFSET', icon: 'open_in_full' },
      { label: 'Simplify...', action: 'OBJECT_PATH_SIMPLIFY', icon: 'tune' },
      { label: 'Add Anchor Points', action: 'OBJECT_PATH_ADD_ANCHOR', icon: 'add_circle' },
      { label: 'Remove Anchor Points', action: 'OBJECT_PATH_REMOVE_ANCHOR', icon: 'remove_circle' },
      { label: 'Divide Objects Below', action: 'OBJECT_PATH_DIVIDE', icon: 'call_split' },
      { label: 'Split Into Grid...', action: 'OBJECT_PATH_SPLIT_GRID', icon: 'grid_on' },
    ],
    OBJECT_BLEND: [
      { label: 'Make', action: 'OBJECT_BLEND_MAKE', icon: 'blur_on' },
      { label: 'Release', action: 'OBJECT_BLEND_RELEASE', icon: 'close' },
      { label: 'Blend Options...', action: 'OBJECT_BLEND_OPTIONS', icon: 'settings' },
      { label: 'Expand', action: 'OBJECT_BLEND_EXPAND', icon: 'expand' },
      { label: 'Replace Spine', action: 'OBJECT_BLEND_REPLACE_SPINE', icon: 'swap_horiz' },
      { label: 'Reverse Spine', action: 'OBJECT_BLEND_REVERSE_SPINE', icon: 'swap_vert' },
    ],
    OBJECT_ENVELOPE: [
      { label: 'Make with Warp...', action: 'OBJECT_ENVELOPE_WARP', icon: 'waves' },
      { label: 'Make with Mesh...', action: 'OBJECT_ENVELOPE_MESH', icon: 'grid_4x4' },
      { label: 'Make with Top Object', action: 'OBJECT_ENVELOPE_TOP', icon: 'vertical_align_top' },
      { label: 'Release', action: 'OBJECT_ENVELOPE_RELEASE', icon: 'close' },
      { label: 'Envelope Options...', action: 'OBJECT_ENVELOPE_OPTIONS', icon: 'settings' },
    ],
    OBJECT_COMPOUND_PATH: [
      { label: 'Make', action: 'OBJECT_COMPOUND_PATH_MAKE', icon: 'call_merge' },
      { label: 'Release', action: 'OBJECT_COMPOUND_PATH_RELEASE', icon: 'close' },
    ],
    OBJECT_GRAPH: [
      { label: 'Type...', action: 'OBJECT_GRAPH_TYPE', icon: 'bar_chart' },
      { label: 'Data...', action: 'OBJECT_GRAPH_DATA', icon: 'table_chart' },
      { label: 'Design...', action: 'OBJECT_GRAPH_DESIGN', icon: 'palette' },
      { label: 'Column...', action: 'OBJECT_GRAPH_COLUMN', icon: 'view_column' },
    ],
    TYPE_FONT: [
      { label: 'Arial', action: 'TYPE_FONT_ARIAL', icon: 'text_fields' },
      { label: 'Helvetica', action: 'TYPE_FONT_HELVETICA', icon: 'text_fields' },
      { label: 'Times New Roman', action: 'TYPE_FONT_TIMES', icon: 'text_fields' },
      { label: 'Courier New', action: 'TYPE_FONT_COURIER', icon: 'text_fields' },
      { label: 'More Fonts...', action: 'TYPE_FONT_MORE', icon: 'add' },
    ],
    TYPE_SIZE: [
      { label: '6pt', action: 'TYPE_SIZE_6', icon: 'format_size' },
      { label: '8pt', action: 'TYPE_SIZE_8', icon: 'format_size' },
      { label: '10pt', action: 'TYPE_SIZE_10', icon: 'format_size' },
      { label: '12pt', action: 'TYPE_SIZE_12', icon: 'format_size' },
      { label: '14pt', action: 'TYPE_SIZE_14', icon: 'format_size' },
      { label: '18pt', action: 'TYPE_SIZE_18', icon: 'format_size' },
      { label: '24pt', action: 'TYPE_SIZE_24', icon: 'format_size' },
      { label: '36pt', action: 'TYPE_SIZE_36', icon: 'format_size' },
      { label: '48pt', action: 'TYPE_SIZE_48', icon: 'format_size' },
      { label: 'Other...', action: 'TYPE_SIZE_OTHER', icon: 'more_horiz' },
    ],
    TYPE_THREADED_TEXT: [
      { label: 'Create', action: 'TYPE_THREADED_TEXT_CREATE', icon: 'link' },
      { label: 'Release Selection', action: 'TYPE_THREADED_TEXT_RELEASE', icon: 'link_off' },
      { label: 'Remove Threading', action: 'TYPE_THREADED_TEXT_REMOVE', icon: 'close' },
    ],
    SELECT_SAME: [
      { label: 'Blending Mode', action: 'SELECT_SAME_BLEND', icon: 'blur_on' },
      { label: 'Fill & Stroke', action: 'SELECT_SAME_FILL_STROKE', icon: 'palette' },
      { label: 'Fill Color', action: 'SELECT_SAME_FILL', icon: 'format_color_fill' },
      { label: 'Opacity', action: 'SELECT_SAME_OPACITY', icon: 'opacity' },
      { label: 'Stroke Color', action: 'SELECT_SAME_STROKE', icon: 'format_color_text' },
      { label: 'Stroke Weight', action: 'SELECT_SAME_STROKE_WEIGHT', icon: 'show_chart' },
      { label: 'Style', action: 'SELECT_SAME_STYLE', icon: 'auto_awesome' },
      { label: 'Symbol Instance', action: 'SELECT_SAME_SYMBOL', icon: 'bookmark' },
    ],
    SELECT_OBJECT: [
      { label: 'All on Same Layer', action: 'SELECT_OBJECT_SAME_LAYER', icon: 'layers' },
      { label: 'Direction Handles', action: 'SELECT_OBJECT_HANDLES', icon: 'open_with' },
      { label: 'Brush Strokes', action: 'SELECT_OBJECT_BRUSH', icon: 'brush' },
      { label: 'Clipping Masks', action: 'SELECT_OBJECT_CLIPPING', icon: 'crop' },
      { label: 'Stray Points', action: 'SELECT_OBJECT_STRAY', icon: 'adjust' },
      { label: 'Text Objects', action: 'SELECT_OBJECT_TEXT', icon: 'text_fields' },
    ],
    EFFECT_3D: [
      { label: 'Extrude & Bevel...', action: 'EFFECT_3D_EXTRUDE', icon: 'view_in_ar' },
      { label: 'Revolve...', action: 'EFFECT_3D_REVOLVE', icon: '360' },
      { label: 'Rotate...', action: 'EFFECT_3D_ROTATE', icon: 'rotate_3d' },
    ],
    EFFECT_SVG_FILTERS: [
      { label: 'Apply SVG Filter...', action: 'EFFECT_SVG_APPLY', icon: 'filter_alt' },
      { label: 'Import SVG Filter...', action: 'EFFECT_SVG_IMPORT', icon: 'upload' },
    ],
    EFFECT_DISTORT: [
      { label: 'Free Distort...', action: 'EFFECT_DISTORT_FREE', icon: 'transform' },
      { label: 'Pucker & Bloat...', action: 'EFFECT_DISTORT_PUCKER', icon: 'compress' },
      { label: 'Roughen...', action: 'EFFECT_DISTORT_ROUGHEN', icon: 'texture' },
      { label: 'Scribble...', action: 'EFFECT_DISTORT_SCRIBBLE', icon: 'gesture' },
      { label: 'Tweak...', action: 'EFFECT_DISTORT_TWEAK', icon: 'tune' },
      { label: 'Twist...', action: 'EFFECT_DISTORT_TWIST', icon: 'rotate_right' },
      { label: 'Zig Zag...', action: 'EFFECT_DISTORT_ZIGZAG', icon: 'timeline' },
    ],
    EFFECT_PATH: [
      { label: 'Offset Path...', action: 'EFFECT_PATH_OFFSET', icon: 'open_in_full' },
      { label: 'Outline Object', action: 'EFFECT_PATH_OUTLINE', icon: 'format_shapes' },
      { label: 'Outline Stroke', action: 'EFFECT_PATH_OUTLINE_STROKE', icon: 'show_chart' },
    ],
    EFFECT_PATHFINDER: [
      { label: 'Add', action: 'EFFECT_PATHFINDER_ADD', icon: 'add' },
      { label: 'Intersect', action: 'EFFECT_PATHFINDER_INTERSECT', icon: 'call_merge' },
      { label: 'Exclude', action: 'EFFECT_PATHFINDER_EXCLUDE', icon: 'remove' },
      { label: 'Subtract', action: 'EFFECT_PATHFINDER_SUBTRACT', icon: 'remove_circle' },
      { label: 'Minus Back', action: 'EFFECT_PATHFINDER_MINUS_BACK', icon: 'arrow_back' },
      { label: 'Divide', action: 'EFFECT_PATHFINDER_DIVIDE', icon: 'call_split' },
      { label: 'Trim', action: 'EFFECT_PATHFINDER_TRIM', icon: 'content_cut' },
      { label: 'Merge', action: 'EFFECT_PATHFINDER_MERGE', icon: 'merge' },
      { label: 'Crop', action: 'EFFECT_PATHFINDER_CROP', icon: 'crop' },
      { label: 'Outline', action: 'EFFECT_PATHFINDER_OUTLINE', icon: 'format_shapes' },
      { label: 'Minus Front', action: 'EFFECT_PATHFINDER_MINUS_FRONT', icon: 'arrow_forward' },
    ],
    EFFECT_STYLIZE: [
      { label: 'Drop Shadow...', action: 'EFFECT_STYLIZE_DROP_SHADOW', icon: 'shadow' },
      { label: 'Feather...', action: 'EFFECT_STYLIZE_FEATHER', icon: 'blur' },
      { label: 'Inner Glow...', action: 'EFFECT_STYLIZE_INNER_GLOW', icon: 'light_mode' },
      { label: 'Outer Glow...', action: 'EFFECT_STYLIZE_OUTER_GLOW', icon: 'flare' },
      { label: 'Round Corners...', action: 'EFFECT_STYLIZE_ROUND_CORNERS', icon: 'rounded_corner' },
      { label: 'Scribble...', action: 'EFFECT_STYLIZE_SCRIBBLE', icon: 'gesture' },
    ],
    WINDOW_WORKSPACE: [
      { label: 'Default', action: 'WINDOW_WORKSPACE_DEFAULT', icon: 'dashboard' },
      { label: 'Essentials', action: 'WINDOW_WORKSPACE_ESSENTIALS', icon: 'star' },
      { label: 'Animation', action: 'WINDOW_WORKSPACE_ANIMATION', icon: 'movie' },
      { label: 'Typography', action: 'WINDOW_WORKSPACE_TYPOGRAPHY', icon: 'text_fields' },
      { label: 'Web', action: 'WINDOW_WORKSPACE_WEB', icon: 'web' },
      { label: 'New Workspace...', action: 'WINDOW_WORKSPACE_NEW', icon: 'add' },
      { label: 'Manage Workspaces...', action: 'WINDOW_WORKSPACE_MANAGE', icon: 'settings' },
    ],
    WINDOW_TYPE: [
      { label: 'Character', action: 'WINDOW_TYPE_CHARACTER', icon: 'text_fields' },
      { label: 'Paragraph', action: 'WINDOW_TYPE_PARAGRAPH', icon: 'format_align_left' },
      { label: 'OpenType', action: 'WINDOW_TYPE_OPENTYPE', icon: 'font_download' },
      { label: 'Glyphs', action: 'WINDOW_TYPE_GLYPHS', icon: 'abc' },
      { label: 'Character Styles', action: 'WINDOW_TYPE_CHAR_STYLES', icon: 'style' },
      { label: 'Paragraph Styles', action: 'WINDOW_TYPE_PARA_STYLES', icon: 'format_paragraph' },
    ],
    WINDOW_BRUSH_LIBRARIES: [
      { label: 'Arrows', action: 'WINDOW_BRUSH_LIB_ARROWS', icon: 'arrow_forward' },
      { label: 'Artistic', action: 'WINDOW_BRUSH_LIB_ARTISTIC', icon: 'palette' },
      { label: 'Borders', action: 'WINDOW_BRUSH_LIB_BORDERS', icon: 'border_style' },
      { label: 'Decorative', action: 'WINDOW_BRUSH_LIB_DECORATIVE', icon: 'auto_awesome' },
      { label: 'More Libraries...', action: 'WINDOW_BRUSH_LIB_MORE', icon: 'library_books' },
    ],
    WINDOW_SYMBOL_LIBRARIES: [
      { label: '3D Symbols', action: 'WINDOW_SYMBOL_LIB_3D', icon: 'view_in_ar' },
      { label: 'Charts', action: 'WINDOW_SYMBOL_LIB_CHARTS', icon: 'bar_chart' },
      { label: 'Maps', action: 'WINDOW_SYMBOL_LIB_MAPS', icon: 'map' },
      { label: 'More Libraries...', action: 'WINDOW_SYMBOL_LIB_MORE', icon: 'library_books' },
    ],
    WINDOW_SWATCH_LIBRARIES: [
      { label: 'ANPA Colors', action: 'WINDOW_SWATCH_LIB_ANPA', icon: 'palette' },
      { label: 'DIC Color Guide', action: 'WINDOW_SWATCH_LIB_DIC', icon: 'palette' },
      { label: 'HKS Colors', action: 'WINDOW_SWATCH_LIB_HKS', icon: 'palette' },
      { label: 'PANTONE', action: 'WINDOW_SWATCH_LIB_PANTONE', icon: 'palette' },
      { label: 'System (Macintosh)', action: 'WINDOW_SWATCH_LIB_MAC', icon: 'palette' },
      { label: 'System (Windows)', action: 'WINDOW_SWATCH_LIB_WIN', icon: 'palette' },
      { label: 'Toyo Color Finder', action: 'WINDOW_SWATCH_LIB_TOYO', icon: 'palette' },
      { label: 'Trumatch', action: 'WINDOW_SWATCH_LIB_TRUMATCH', icon: 'palette' },
      { label: 'Web', action: 'WINDOW_SWATCH_LIB_WEB', icon: 'web' },
      { label: 'More Libraries...', action: 'WINDOW_SWATCH_LIB_MORE', icon: 'library_books' },
    ],
    WINDOW_PALETTES: [
      {
        label: 'Fonts',
        action: 'WINDOW_PALETTE_FONTS',
        icon: 'font_download',
        description: 'Font selection and management',
      },
      {
        label: 'Character',
        action: 'WINDOW_PALETTE_CHARACTER',
        icon: 'text_fields',
        description: 'Character formatting options',
      },
      {
        label: 'Paragraph',
        action: 'WINDOW_PALETTE_PARAGRAPH',
        icon: 'format_align_left',
        description: 'Paragraph formatting options',
      },
      {
        label: 'Character Styles',
        action: 'WINDOW_PALETTE_CHAR_STYLES',
        icon: 'style',
        description: 'Character style presets',
      },
      {
        label: 'Paragraph Styles',
        action: 'WINDOW_PALETTE_PARA_STYLES',
        icon: 'format_paragraph',
        description: 'Paragraph style presets',
      },
      { divider: true },
      {
        label: 'Rigging',
        action: 'WINDOW_PALETTE_RIGGING',
        icon: 'account_tree',
        description: 'Animation rigging tools',
      },
      {
        label: 'Node Optimization',
        action: 'WINDOW_PALETTE_NODE_OPT',
        icon: 'tune',
        description: 'Spline and path node optimization',
      },
      {
        label: 'Path Tools',
        action: 'WINDOW_PALETTE_PATH_TOOLS',
        icon: 'polyline',
        description: 'Advanced path editing tools',
      },
      { divider: true },
      {
        label: 'Brushes',
        action: 'WINDOW_PALETTE_BRUSHES',
        icon: 'brush',
        description: 'Brush presets and libraries',
      },
      {
        label: 'Swatches',
        action: 'WINDOW_PALETTE_SWATCHES',
        icon: 'colorize',
        description: 'Color swatches and palettes',
      },
      {
        label: 'Symbols',
        action: 'WINDOW_PALETTE_SYMBOLS',
        icon: 'bookmark',
        description: 'Symbol libraries and management',
      },
      { divider: true },
      {
        label: 'Transform Tools',
        action: 'WINDOW_PALETTE_TRANSFORM',
        icon: 'transform',
        description: 'Transform and alignment tools',
      },
      {
        label: 'Effects',
        action: 'WINDOW_PALETTE_EFFECTS',
        icon: 'auto_awesome',
        description: 'Visual effects and filters',
      },
      { divider: true },
      {
        label: 'New Custom Palette...',
        action: 'WINDOW_PALETTE_NEW',
        icon: 'add',
        description: 'Create a custom tool palette',
      },
      {
        label: 'Manage Palettes...',
        action: 'WINDOW_PALETTE_MANAGE',
        icon: 'settings',
        description: 'Edit and organize palettes',
      },
    ],
  };
  return submenus[action] || [];
};

// Tooltip content helper
const getMenuTooltip = (action: string): string => {
  const tooltips: Record<string, string> = {
    FILE_NEW: 'Create a new document',
    FILE_OPEN: 'Open an existing document',
    FILE_SAVE: 'Save the current document',
    FILE_SAVE_AS: 'Save the document with a new name',
    FILE_SAVE_COPY: 'Save a copy of the document',
    FILE_CLOSE: 'Close the current document',
    FILE_EXPORT: 'Export document in various formats',
    FILE_PLACE: 'Place an image or file into the document',
    FILE_IMPORT: 'Import layers from another file',
    FILE_REVERT: 'Revert to last saved version',
    FILE_EXIT: 'Exit VectorForge',
    EDIT_UNDO: 'Undo last action',
    EDIT_REDO: 'Redo last undone action',
    EDIT_CUT: 'Cut selection to clipboard',
    EDIT_COPY: 'Copy selection to clipboard',
    EDIT_PASTE: 'Paste from clipboard',
    OBJECT_GROUP: 'Group selected objects',
    OBJECT_UNGROUP: 'Ungroup selected group',
    OBJECT_LOCK: 'Lock selected object',
    OBJECT_UNLOCK: 'Unlock all objects',
    VIEW_ZOOM_IN: 'Zoom in',
    VIEW_ZOOM_OUT: 'Zoom out',
    VIEW_FIT: 'Fit document to window',
    VIEW_ACTUAL: 'View at 100% size',
  };
  return tooltips[action] || 'Menu action';
};

interface ProfessionalFileMenuProps {
  onAction: (action: string) => void;
  onLayoutChange?: (layout: any) => void;
  fileOperationLoading?: {
    type: 'save' | 'save-as' | 'open' | 'export-svg' | 'export-png' | null;
    progress?: number;
  };
}

const ProfessionalFileMenu: React.FC<ProfessionalFileMenuProps> = ({
  onAction,
  onLayoutChange,
  fileOperationLoading,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const menuTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const submenuTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
    };
  }, []);

  const menus = [
    {
      label: 'File',
      items: [
        { label: 'New', action: 'FILE_NEW', shortcut: 'Ctrl+N', icon: 'add' },
        {
          label: 'New from Template...',
          action: 'FILE_NEW_TEMPLATE',
          shortcut: '',
          icon: 'description',
        },
        { divider: true },
        { label: 'Open...', action: 'FILE_OPEN', shortcut: 'Ctrl+O', icon: 'folder_open' },
        {
          label: 'Open Recent',
          action: 'FILE_OPEN_RECENT',
          shortcut: '',
          icon: 'history',
          submenu: true,
        },
        { divider: true },
        { label: 'Close', action: 'FILE_CLOSE', shortcut: 'Ctrl+W', icon: 'close' },
        { label: 'Save', action: 'FILE_SAVE', shortcut: 'Ctrl+S', icon: 'save' },
        { label: 'Save As...', action: 'FILE_SAVE_AS', shortcut: 'Ctrl+Shift+S', icon: 'save_as' },
        { label: 'Save a Copy...', action: 'FILE_SAVE_COPY', shortcut: '', icon: 'content_copy' },
        {
          label: 'Save for Web...',
          action: 'FILE_SAVE_WEB',
          shortcut: 'Ctrl+Alt+Shift+S',
          icon: 'web',
        },
        { divider: true },
        { label: 'Revert', action: 'FILE_REVERT', shortcut: '', icon: 'undo' },
        { divider: true },
        { label: 'Place...', action: 'FILE_PLACE', shortcut: '', icon: 'insert_photo' },
        { label: 'Import...', action: 'FILE_IMPORT', shortcut: '', icon: 'upload' },
        { label: 'Export', action: 'FILE_EXPORT', shortcut: '', icon: 'download', submenu: true },
        { divider: true },
        {
          label: 'Document Setup...',
          action: 'FILE_DOCUMENT_SETUP',
          shortcut: '',
          icon: 'settings',
        },
        {
          label: 'Document Color Mode',
          action: 'FILE_COLOR_MODE',
          shortcut: '',
          icon: 'palette',
          submenu: true,
        },
        { divider: true },
        { label: 'Exit', action: 'FILE_EXIT', shortcut: 'Ctrl+Q', icon: 'exit_to_app' },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', action: 'EDIT_UNDO', shortcut: 'Ctrl+Z', icon: 'undo' },
        { label: 'Redo', action: 'EDIT_REDO', shortcut: 'Ctrl+Shift+Z', icon: 'redo' },
        { divider: true },
        { label: 'Cut', action: 'EDIT_CUT', shortcut: 'Ctrl+X', icon: 'content_cut' },
        { label: 'Copy', action: 'EDIT_COPY', shortcut: 'Ctrl+C', icon: 'content_copy' },
        { label: 'Paste', action: 'EDIT_PASTE', shortcut: 'Ctrl+V', icon: 'content_paste' },
        {
          label: 'Paste in Front',
          action: 'EDIT_PASTE_FRONT',
          shortcut: 'Ctrl+F',
          icon: 'front_hand',
        },
        {
          label: 'Paste in Back',
          action: 'EDIT_PASTE_BACK',
          shortcut: 'Ctrl+B',
          icon: 'back_hand',
        },
        { divider: true },
        {
          label: 'Paste Special...',
          action: 'EDIT_PASTE_SPECIAL',
          shortcut: '',
          icon: 'more_horiz',
        },
        { divider: true },
        { label: 'Clear', action: 'EDIT_CLEAR', shortcut: 'Delete', icon: 'clear' },
        { divider: true },
        { label: 'Find and Replace...', action: 'EDIT_FIND', shortcut: 'Ctrl+F', icon: 'search' },
        { label: 'Find Next', action: 'EDIT_FIND_NEXT', shortcut: 'F3', icon: 'skip_next' },
        { divider: true },
        { label: 'Check Spelling...', action: 'EDIT_SPELLING', shortcut: '', icon: 'spellcheck' },
        { divider: true },
        {
          label: 'Color Settings...',
          action: 'EDIT_COLOR_SETTINGS',
          shortcut: '',
          icon: 'palette',
        },
        {
          label: 'Keyboard Shortcuts...',
          action: 'EDIT_SHORTCUTS',
          shortcut: '',
          icon: 'keyboard',
        },
        {
          label: 'Preferences',
          action: 'EDIT_PREFERENCES',
          shortcut: '',
          icon: 'settings',
          submenu: true,
        },
      ],
    },
    {
      label: 'Object',
      items: [
        {
          label: 'Transform',
          action: 'OBJECT_TRANSFORM',
          shortcut: '',
          icon: 'transform',
          submenu: true,
        },
        { label: 'Arrange', action: 'OBJECT_ARRANGE', shortcut: '', icon: 'layers', submenu: true },
        { divider: true },
        { label: 'Group', action: 'OBJECT_GROUP', shortcut: 'Ctrl+G', icon: 'group' },
        { label: 'Ungroup', action: 'OBJECT_UNGROUP', shortcut: 'Ctrl+Shift+G', icon: 'ungroup' },
        { label: 'Lock', action: 'OBJECT_LOCK', shortcut: 'Ctrl+2', icon: 'lock' },
        { label: 'Unlock All', action: 'OBJECT_UNLOCK', shortcut: 'Ctrl+Alt+2', icon: 'lock_open' },
        { divider: true },
        { label: 'Hide', action: 'OBJECT_HIDE', shortcut: 'Ctrl+3', icon: 'visibility_off' },
        { label: 'Show All', action: 'OBJECT_SHOW', shortcut: 'Ctrl+Alt+3', icon: 'visibility' },
        { divider: true },
        { label: 'Expand', action: 'OBJECT_EXPAND', shortcut: '', icon: 'expand' },
        {
          label: 'Expand Appearance',
          action: 'OBJECT_EXPAND_APPEARANCE',
          shortcut: '',
          icon: 'expand_circle_down',
        },
        { divider: true },
        { label: 'Rasterize...', action: 'OBJECT_RASTERIZE', shortcut: '', icon: 'image' },
        {
          label: 'Create Gradient Mesh...',
          action: 'OBJECT_GRADIENT_MESH',
          shortcut: '',
          icon: 'gradient',
        },
        { divider: true },
        { label: 'Path', action: 'OBJECT_PATH', shortcut: '', icon: 'polyline', submenu: true },
        { label: 'Blend', action: 'OBJECT_BLEND', shortcut: '', icon: 'blur_on', submenu: true },
        {
          label: 'Envelope Distort',
          action: 'OBJECT_ENVELOPE',
          shortcut: '',
          icon: 'waves',
          submenu: true,
        },
        { divider: true },
        {
          label: 'Clipping Mask',
          action: 'OBJECT_CLIPPING_MASK',
          shortcut: 'Ctrl+7',
          icon: 'crop',
        },
        { label: 'Make', action: 'OBJECT_CLIPPING_MASK_MAKE', shortcut: '', icon: 'check' },
        {
          label: 'Release',
          action: 'OBJECT_CLIPPING_MASK_RELEASE',
          shortcut: 'Ctrl+Alt+7',
          icon: 'close',
        },
        { divider: true },
        {
          label: 'Compound Path',
          action: 'OBJECT_COMPOUND_PATH',
          shortcut: 'Ctrl+8',
          icon: 'call_merge',
          submenu: true,
        },
        { label: 'Graph', action: 'OBJECT_GRAPH', shortcut: '', icon: 'bar_chart', submenu: true },
      ],
    },
    {
      label: 'Type',
      items: [
        { label: 'Font', action: 'TYPE_FONT', shortcut: '', icon: 'text_fields', submenu: true },
        { label: 'Size', action: 'TYPE_SIZE', shortcut: '', icon: 'format_size', submenu: true },
        { divider: true },
        {
          label: 'Create Outlines',
          action: 'TYPE_CREATE_OUTLINES',
          shortcut: 'Ctrl+Shift+O',
          icon: 'format_shapes',
        },
        { divider: true },
        { label: 'Find Font...', action: 'TYPE_FIND_FONT', shortcut: '', icon: 'search' },
        { label: 'Change Case...', action: 'TYPE_CHANGE_CASE', shortcut: '', icon: 'text_fields' },
        { divider: true },
        {
          label: 'Smart Punctuation...',
          action: 'TYPE_SMART_PUNCTUATION',
          shortcut: '',
          icon: 'auto_fix_high',
        },
        {
          label: 'Optical Margin Alignment',
          action: 'TYPE_OPTICAL_MARGIN',
          shortcut: '',
          icon: 'format_align_left',
        },
        { divider: true },
        {
          label: 'Threaded Text',
          action: 'TYPE_THREADED_TEXT',
          shortcut: '',
          icon: 'link',
          submenu: true,
        },
        {
          label: 'Convert to Area Type',
          action: 'TYPE_AREA_TYPE',
          shortcut: '',
          icon: 'text_fields',
        },
        {
          label: 'Convert to Point Type',
          action: 'TYPE_POINT_TYPE',
          shortcut: '',
          icon: 'text_fields',
        },
      ],
    },
    {
      label: 'Select',
      items: [
        { label: 'All', action: 'SELECT_ALL', shortcut: 'Ctrl+A', icon: 'select_all' },
        {
          label: 'Deselect',
          action: 'SELECT_DESELECT',
          shortcut: 'Ctrl+Shift+A',
          icon: 'deselect',
        },
        { divider: true },
        { label: 'Same', action: 'SELECT_SAME', shortcut: '', icon: 'compare', submenu: true },
        { label: 'Object', action: 'SELECT_OBJECT', shortcut: '', icon: 'category', submenu: true },
        { divider: true },
        { label: 'Save Selection', action: 'SELECT_SAVE', shortcut: '', icon: 'bookmark' },
        { label: 'Edit Selection...', action: 'SELECT_EDIT', shortcut: '', icon: 'edit' },
      ],
    },
    {
      label: 'Effect',
      items: [
        {
          label: 'Apply Last Effect',
          action: 'EFFECT_APPLY_LAST',
          shortcut: 'Ctrl+Shift+E',
          icon: 'redo',
        },
        {
          label: 'Last Effect...',
          action: 'EFFECT_LAST',
          shortcut: 'Ctrl+Alt+Shift+E',
          icon: 'settings',
        },
        { divider: true },
        { label: '3D', action: 'EFFECT_3D', shortcut: '', icon: 'view_in_ar', submenu: true },
        {
          label: 'SVG Filters',
          action: 'EFFECT_SVG_FILTERS',
          shortcut: '',
          icon: 'filter_alt',
          submenu: true,
        },
        {
          label: 'Distort & Transform',
          action: 'EFFECT_DISTORT',
          shortcut: '',
          icon: 'transform',
          submenu: true,
        },
        { label: 'Path', action: 'EFFECT_PATH', shortcut: '', icon: 'polyline', submenu: true },
        {
          label: 'Pathfinder',
          action: 'EFFECT_PATHFINDER',
          shortcut: '',
          icon: 'call_merge',
          submenu: true,
        },
        { label: 'Rasterize...', action: 'EFFECT_RASTERIZE', shortcut: '', icon: 'image' },
        {
          label: 'Stylize',
          action: 'EFFECT_STYLIZE',
          shortcut: '',
          icon: 'auto_awesome',
          submenu: true,
        },
        { divider: true },
        {
          label: 'Document Raster Effects Settings...',
          action: 'EFFECT_RASTER_SETTINGS',
          shortcut: '',
          icon: 'settings',
        },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Outline', action: 'VIEW_OUTLINE', shortcut: 'Ctrl+Y', icon: 'polyline' },
        {
          label: 'Overprint Preview',
          action: 'VIEW_OVERPRINT',
          shortcut: 'Ctrl+Alt+Shift+Y',
          icon: 'preview',
        },
        { divider: true },
        { label: 'Zoom In', action: 'VIEW_ZOOM_IN', shortcut: 'Ctrl++', icon: 'zoom_in' },
        { label: 'Zoom Out', action: 'VIEW_ZOOM_OUT', shortcut: 'Ctrl+-', icon: 'zoom_out' },
        { label: 'Fit in Window', action: 'VIEW_FIT', shortcut: 'Ctrl+0', icon: 'fit_screen' },
        { label: 'Actual Size', action: 'VIEW_ACTUAL', shortcut: 'Ctrl+1', icon: 'fullscreen' },
        { divider: true },
        {
          label: 'Hide Edges',
          action: 'VIEW_HIDE_EDGES',
          shortcut: 'Ctrl+H',
          icon: 'visibility_off',
        },
        {
          label: 'Hide Artboards',
          action: 'VIEW_HIDE_ARTBOARDS',
          shortcut: 'Ctrl+Shift+H',
          icon: 'crop_free',
        },
        { divider: true },
        {
          label: 'Show Rulers',
          action: 'VIEW_SHOW_RULERS',
          shortcut: 'Ctrl+R',
          icon: 'straighten',
        },
        { label: 'Show Grid', action: 'VIEW_SHOW_GRID', shortcut: "Ctrl+'", icon: 'grid_on' },
        { divider: true },
        {
          label: '💬 Dev Chat',
          action: 'VIEW_DEV_CHAT',
          shortcut: 'Ctrl+K',
          icon: 'chat',
          description: 'Open Dev Chat - Self-Modifying AI',
        },
        {
          label: 'Show Guides',
          action: 'VIEW_SHOW_GUIDES',
          shortcut: 'Ctrl+;',
          icon: 'drag_indicator',
        },
        {
          label: 'Smart Guides',
          action: 'VIEW_SMART_GUIDES',
          shortcut: 'Ctrl+U',
          icon: 'auto_awesome',
        },
        { label: 'Show Rulers', action: 'VIEW_SHOW_RULERS', shortcut: 'Ctrl+R', icon: 'straighten' },
        { label: 'Show Grid', action: 'VIEW_SHOW_GRID', shortcut: 'Ctrl+\'', icon: 'grid_on' },
        { divider: true },
        { label: '💬 Dev Chat', action: 'VIEW_DEV_CHAT', shortcut: 'Ctrl+K', icon: 'chat', description: 'Open Dev Chat - Self-Modifying AI' },
        { label: 'Show Guides', action: 'VIEW_SHOW_GUIDES', shortcut: 'Ctrl+;', icon: 'drag_indicator' },
        { label: 'Smart Guides', action: 'VIEW_SMART_GUIDES', shortcut: 'Ctrl+U', icon: 'auto_awesome' },
        { divider: true },
        { label: 'New View...', action: 'VIEW_NEW', shortcut: '', icon: 'add' },
        { label: 'Edit Views...', action: 'VIEW_EDIT', shortcut: '', icon: 'edit' },
      ],
    },
    {
      label: 'Window',
      items: [
        { label: 'New Window', action: 'WINDOW_NEW', shortcut: '', icon: 'open_in_new' },
        { divider: true },
        {
          label: 'Workspace',
          action: 'WINDOW_WORKSPACE',
          shortcut: '',
          icon: 'dashboard',
          submenu: true,
        },
        { divider: true },
        { label: 'Actions', action: 'WINDOW_ACTIONS', shortcut: 'Alt+F9', icon: 'play_arrow' },
        {
          label: 'Align',
          action: 'WINDOW_ALIGN',
          shortcut: 'Shift+F7',
          icon: 'align_horizontal_center',
        },
        { label: 'Appearance', action: 'WINDOW_APPEARANCE', shortcut: 'Shift+F6', icon: 'palette' },
        { label: 'Artboards', action: 'WINDOW_ARTBOARDS', shortcut: 'Shift+F5', icon: 'crop_free' },
        { label: 'Attributes', action: 'WINDOW_ATTRIBUTES', shortcut: 'Ctrl+F11', icon: 'tune' },
        { label: 'Brushes', action: 'WINDOW_BRUSHES', shortcut: 'F5', icon: 'brush' },
        { label: 'Color', action: 'WINDOW_COLOR', shortcut: 'F6', icon: 'palette' },
        {
          label: 'Color Guide',
          action: 'WINDOW_COLOR_GUIDE',
          shortcut: 'Shift+F3',
          icon: 'color_lens',
        },
        { label: 'Gradient', action: 'WINDOW_GRADIENT', shortcut: 'Ctrl+F9', icon: 'gradient' },
        { label: 'Info', action: 'WINDOW_INFO', shortcut: 'F8', icon: 'info' },
        { label: 'Layers', action: 'WINDOW_LAYERS', shortcut: 'F7', icon: 'layers' },
        {
          label: 'Pathfinder',
          action: 'WINDOW_PATHFINDER',
          shortcut: 'Shift+Ctrl+F9',
          icon: 'call_merge',
        },
        { label: 'Stroke', action: 'WINDOW_STROKE', shortcut: 'Ctrl+F10', icon: 'show_chart' },
        { label: 'Swatches', action: 'WINDOW_SWATCHES', shortcut: '', icon: 'colorize' },
        {
          label: 'Symbols',
          action: 'WINDOW_SYMBOLS',
          shortcut: 'Shift+Ctrl+F11',
          icon: 'bookmark',
        },
        { label: 'Transform', action: 'WINDOW_TRANSFORM', shortcut: 'Shift+F8', icon: 'transform' },
        {
          label: 'Transparency',
          action: 'WINDOW_TRANSPARENCY',
          shortcut: 'Shift+Ctrl+F10',
          icon: 'layers',
        },
        { label: 'Type', action: 'WINDOW_TYPE', shortcut: '', icon: 'text_fields', submenu: true },
        { divider: true },
        {
          label: '💬 Dev Chat',
          action: 'VIEW_DEV_CHAT',
          shortcut: 'Ctrl+K',
          icon: 'chat',
          description: 'Self-Modifying AI Assistant',
        },
        { label: '💬 Dev Chat', action: 'VIEW_DEV_CHAT', shortcut: 'Ctrl+K', icon: 'chat', description: 'Self-Modifying AI Assistant' },
        { divider: true },
        { label: 'Bug Reporter', action: 'WINDOW_BUG_REPORTER', shortcut: '', icon: 'bug_report' },
        {
          label: 'Feature Request',
          action: 'WINDOW_FEATURE_REQUEST',
          shortcut: '',
          icon: 'lightbulb',
        },
        { divider: true },
        {
          label: 'Brush Libraries',
          action: 'WINDOW_BRUSH_LIBRARIES',
          shortcut: '',
          icon: 'library_books',
          submenu: true,
        },
        {
          label: 'Symbol Libraries',
          action: 'WINDOW_SYMBOL_LIBRARIES',
          shortcut: '',
          icon: 'bookmark',
          submenu: true,
        },
        {
          label: 'Swatch Libraries',
          action: 'WINDOW_SWATCH_LIBRARIES',
          shortcut: '',
          icon: 'palette',
          submenu: true,
        },
        { divider: true },
        {
          label: 'Palettes',
          action: 'WINDOW_PALETTES',
          shortcut: '',
          icon: 'palette',
          submenu: true,
        },
        { divider: true },
        {
          label: 'Marketplace Publisher',
          action: 'WINDOW_MARKETPLACE_PUBLISHER',
          shortcut: '',
          icon: 'store',
        },
        {
          label: 'Marketplace Analytics',
          action: 'WINDOW_MARKETPLACE_ANALYTICS',
          shortcut: '',
          icon: 'analytics',
        },
        { divider: true },
        {
          label: 'Workspace Customizer...',
          action: 'WINDOW_WORKSPACE_CUSTOMIZER',
          shortcut: '',
          icon: 'dashboard',
        },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'VectorForge Help', action: 'HELP_HELP', shortcut: 'F1', icon: 'help' },
        { label: 'Keyboard Shortcuts', action: 'HELP_SHORTCUTS', shortcut: '', icon: 'keyboard' },
        { divider: true },
        { label: 'System Info...', action: 'HELP_SYSTEM_INFO', shortcut: '', icon: 'info' },
        { label: 'About VectorForge', action: 'HELP_ABOUT', shortcut: '', icon: 'info' },
      ],
    },
  ];

  return (
    <header className="xibalba-header shrink-0 flex items-center justify-between zstack-menu select-none">
      <div className="flex items-center gap-6 xibalba-header-right">
        {/* Xibalba Brand Identity Block */}
        <div className="flex items-center gap-4 pr-6">
          {/* Xibalba Logomark - Mask on Colored Rectangle */}
          <XibalbaLogomark
            backgroundColor="var(--xibalba-accent)"
            size={40}
            padding={8}
            onClick={() => onAction('HELP_ABOUT')}
            className="xibalba-interactive"
          />

          {/* Product Name Mark */}
          <div className="flex flex-col -space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-mono font-medium text-[var(--xibalba-text-100)] tracking-wider">
                xi-io:
              </span>
              <span className="text-[13px] font-black tracking-[0.15em] text-[var(--xibalba-text-000)] uppercase">
                VectorFORGE
              </span>
            </div>
            <span className="text-xs font-mono font-light text-[var(--xibalba-text-100)] tracking-widest">
              XIBALBA OS
            </span>
          </div>
        </div>

        {/* Professional Menu Bar - NO BUTTON BORDERS */}
        <nav className="flex items-center xibalba-header-nav">
          {menus.map(menu => (
            <div key={menu.label} className="menu-container relative xibalba-header-menu-button">
              <button
            <div 
              key={menu.label}
              className="menu-container relative xibalba-header-menu-button"
            >
              <button 
                className={`xibalba-header-menu-label px-5 text-sm font-black uppercase tracking-widest bg-transparent border-none hover:bg-[var(--xibalba-bg-hover)] transition-colors ${activeMenu === menu.label ? 'bg-[var(--xibalba-bg-tertiary)]' : ''}`}
                onMouseEnter={() => {
                  if (menuTimeoutRef.current) {
                    clearTimeout(menuTimeoutRef.current);
                    menuTimeoutRef.current = null;
                  }
                  setActiveMenu(menu.label);
                }}
                onMouseLeave={() => {
                  // Delay closing to allow movement to dropdown
                  menuTimeoutRef.current = setTimeout(() => {
                    setActiveMenu(null);
                  }, 150);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveMenu(activeMenu === menu.label ? null : menu.label);
                  } else if (e.key === 'Escape') {
                    setActiveMenu(null);
                  } else if (e.key === 'ArrowDown' && !activeMenu) {
                    e.preventDefault();
                    setActiveMenu(menu.label);
                  }
                }}
                aria-haspopup="true"
                aria-expanded={activeMenu === menu.label}
                tabIndex={0}
              >
                {menu.label}
              </button>

              {activeMenu === menu.label && (
                <div
                  className="xibalba-card menu-dropdown absolute top-full left-0 mt-1 w-64 py-0 zstack-dropdown xibalba-animate-in max-h-[80vh] overflow-hidden relative"
                  onMouseEnter={() => {
                    if (menuTimeoutRef.current) {
                      clearTimeout(menuTimeoutRef.current);
                      menuTimeoutRef.current = null;
                    }
                    setActiveMenu(menu.label);
                  }}
                  onMouseLeave={() => {
                    menuTimeoutRef.current = setTimeout(() => {
                      setActiveMenu(null);
                    }, 150);
                  }}
                >
                  {/* Construction Paper Intermediary Layer for Text Readability */}
                  <div className="construction-paper-layer-menu" />

                  {/* Scrollable content area - only shows scrollbar when needed */}
                  <div className="menu-items-container max-h-[80vh] overflow-y-auto relative z-10">
                    {menu.items.map((item, idx) => {
                      if ('divider' in item) {
                        return (
                          <div
                            key={idx}
                            className="h-px bg-[var(--xibalba-grey-200)] opacity-20 my-1 mx-2"
                          />
                        );
                      }
                      const submenuId = `${menu.label}-${item.label}`;
                      const hasSubmenu = item.submenu;
                      const submenuItems = hasSubmenu ? getSubmenuItems(item.action) : [];

                      // // const tooltipContent = item.shortcut ? `${item.label} (${item.shortcut}) - ${getMenuTooltip(item.action)}` : `${item.label} - ${getMenuTooltip(item.action)}`;
                      return (
                        <div key={item.label} className="relative">
                          <Button
                            icon={item.icon}
                            label={item.label}
                            shortcut={item.shortcut}
                            onClick={() => {
                              if (!hasSubmenu) {
                                onAction(item.action);
                                setActiveMenu(null);
                              }
                            }}
                            onMouseEnter={() => {
                              if (hasSubmenu) {
                                if (submenuTimeoutRef.current) {
                                  clearTimeout(submenuTimeoutRef.current);
                                  submenuTimeoutRef.current = null;
                                }
                                setActiveSubmenu(submenuId);
                              }
                            }}
                            onMouseLeave={() => {
                              if (hasSubmenu) {
                                submenuTimeoutRef.current = setTimeout(() => {
                                  setActiveSubmenu(null);
                                }, 200);
                              }
                            }}
                            loading={
                              (item.action === 'FILE_SAVE' &&
                                fileOperationLoading?.type === 'save') ||
                              (item.action === 'FILE_SAVE_AS' &&
                                fileOperationLoading?.type === 'save-as') ||
                              (item.action === 'FILE_OPEN' &&
                                fileOperationLoading?.type === 'open') ||
                              (item.action === 'FILE_EXPORT_SVG' &&
                                fileOperationLoading?.type === 'export-svg') ||
                              (item.action === 'FILE_EXPORT_PNG' &&
                                fileOperationLoading?.type === 'export-png')
                            }
                            disabled={
                              (item.action === 'FILE_SAVE' &&
                                fileOperationLoading?.type === 'save') ||
                              (item.action === 'FILE_SAVE_AS' &&
                                fileOperationLoading?.type === 'save-as') ||
                              (item.action === 'FILE_OPEN' &&
                                fileOperationLoading?.type === 'open') ||
                              (item.action === 'FILE_EXPORT_SVG' &&
                                fileOperationLoading?.type === 'export-svg') ||
                              (item.action === 'FILE_EXPORT_PNG' &&
                                fileOperationLoading?.type === 'export-png')
                            }
                            variant="menu"
                            size="sm"
                            className="w-full text-left justify-start group"
                          >
                            {hasSubmenu && (
                              <span className="material-symbols-outlined text-[14px] opacity-50 ml-auto">
                                chevron_right
                              </span>
                            )}
                          </Button>
                          {hasSubmenu && activeSubmenu === submenuId && submenuItems.length > 0 && (
                            <div
                              className="xibalba-card menu-dropdown absolute left-full top-0 ml-1 w-56 py-0 zstack-submenu xibalba-animate-in relative"
                              onMouseEnter={() => {
                                if (submenuTimeoutRef.current) {
                                  clearTimeout(submenuTimeoutRef.current);
                                  submenuTimeoutRef.current = null;
                                }
                                setActiveSubmenu(submenuId);
                              }}
                              onMouseLeave={() => {
                                submenuTimeoutRef.current = setTimeout(() => {
                                  setActiveSubmenu(null);
                                }, 150);
                              }}
                            >
                              {/* Construction Paper Intermediary Layer for Text Readability */}
                              <div className="construction-paper-layer-menu" />

                              {submenuItems.map((subItem, subIdx) => (
                                <Button
                                  key={subIdx}
                                  icon={subItem.icon || 'circle'}
                                  label={subItem.label}
                                  onClick={() => {
                                    if (subItem.action) {
                                      onAction(subItem.action);
                                    }
                                    setActiveMenu(null);
                                    setActiveSubmenu(null);
                                  }}
                                  disabled={subItem.disabled}
                                  variant="menu"
                                  size="sm"
                                  className="w-full text-left justify-start"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6 xibalba-header-right">
        {/* Credits */}
        <div className="flex items-center gap-3 xibalba-header-credits">
          <LayoutSwitcher onLayoutChange={onLayoutChange} />
          <div className="xibalba-panel-elevated flex items-center gap-3 px-4 py-1.5">
            <div className="size-2 bg-[var(--xibalba-bg-tertiary)] animate-pulse"></div>
            <span className="text-sm font-black text-[var(--xibalba-text-100)] uppercase tracking-widest mono">
              25,000 CORE_LIBS
            </span>
          </div>
        </div>
        {/* Execution Status */}
        <div className="flex items-center gap-3 pl-6 xibalba-header-status">
          <div className="flex flex-col items-end -space-y-1 mr-2">
            <span className="text-xs font-bold text-[var(--xibalba-text-100)] uppercase">
              Execution Layer
            </span>
            <span className="text-xs font-mono text-[var(--xibalba-text-100)] uppercase">
              Active_Session
            </span>
          </div>
          <div className="size-9 bg-[var(--xibalba-bg-tertiary)] overflow-hidden cursor-pointer xibalba-interactive">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=IllustrationPro"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfessionalFileMenu;
