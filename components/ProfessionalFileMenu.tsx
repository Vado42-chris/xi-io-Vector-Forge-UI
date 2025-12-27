/**
 * Professional File Menu - Real Product File Bar
 * Complete file operations like any professional application
 * NO BUTTON BORDERS - Real menu appearance
 */

import React, { useState } from 'react';
import XibalbaLogomark from './XibalbaLogomark';
import LayoutSwitcher from './LayoutSwitcher';

interface ProfessionalFileMenuProps {
  onAction: (action: string) => void;
  onLayoutChange?: (layout: any) => void;
}

const ProfessionalFileMenu: React.FC<ProfessionalFileMenuProps> = ({ onAction, onLayoutChange }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = [
    {
      label: 'File',
      items: [
        { label: 'New', action: 'FILE_NEW', shortcut: 'Ctrl+N', icon: 'add' },
        { label: 'New from Template...', action: 'FILE_NEW_TEMPLATE', shortcut: '', icon: 'description' },
        { divider: true },
        { label: 'Open...', action: 'FILE_OPEN', shortcut: 'Ctrl+O', icon: 'folder_open' },
        { label: 'Open Recent', action: 'FILE_OPEN_RECENT', shortcut: '', icon: 'history', submenu: true },
        { divider: true },
        { label: 'Close', action: 'FILE_CLOSE', shortcut: 'Ctrl+W', icon: 'close' },
        { label: 'Save', action: 'FILE_SAVE', shortcut: 'Ctrl+S', icon: 'save' },
        { label: 'Save As...', action: 'FILE_SAVE_AS', shortcut: 'Ctrl+Shift+S', icon: 'save_as' },
        { label: 'Save a Copy...', action: 'FILE_SAVE_COPY', shortcut: '', icon: 'content_copy' },
        { label: 'Save for Web...', action: 'FILE_SAVE_WEB', shortcut: 'Ctrl+Alt+Shift+S', icon: 'web' },
        { divider: true },
        { label: 'Revert', action: 'FILE_REVERT', shortcut: '', icon: 'undo' },
        { divider: true },
        { label: 'Place...', action: 'FILE_PLACE', shortcut: '', icon: 'insert_photo' },
        { label: 'Import...', action: 'FILE_IMPORT', shortcut: '', icon: 'upload' },
        { label: 'Export', action: 'FILE_EXPORT', shortcut: '', icon: 'download', submenu: true },
        { divider: true },
        { label: 'Document Setup...', action: 'FILE_DOCUMENT_SETUP', shortcut: '', icon: 'settings' },
        { label: 'Document Color Mode', action: 'FILE_COLOR_MODE', shortcut: '', icon: 'palette', submenu: true },
        { divider: true },
        { label: 'Exit', action: 'FILE_EXIT', shortcut: 'Ctrl+Q', icon: 'exit_to_app' },
      ]
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
        { label: 'Paste in Front', action: 'EDIT_PASTE_FRONT', shortcut: 'Ctrl+F', icon: 'front_hand' },
        { label: 'Paste in Back', action: 'EDIT_PASTE_BACK', shortcut: 'Ctrl+B', icon: 'back_hand' },
        { divider: true },
        { label: 'Paste Special...', action: 'EDIT_PASTE_SPECIAL', shortcut: '', icon: 'more_horiz' },
        { divider: true },
        { label: 'Clear', action: 'EDIT_CLEAR', shortcut: 'Delete', icon: 'clear' },
        { divider: true },
        { label: 'Find and Replace...', action: 'EDIT_FIND', shortcut: 'Ctrl+F', icon: 'search' },
        { label: 'Find Next', action: 'EDIT_FIND_NEXT', shortcut: 'F3', icon: 'skip_next' },
        { divider: true },
        { label: 'Check Spelling...', action: 'EDIT_SPELLING', shortcut: '', icon: 'spellcheck' },
        { divider: true },
        { label: 'Color Settings...', action: 'EDIT_COLOR_SETTINGS', shortcut: '', icon: 'palette' },
        { label: 'Keyboard Shortcuts...', action: 'EDIT_SHORTCUTS', shortcut: '', icon: 'keyboard' },
        { label: 'Preferences', action: 'EDIT_PREFERENCES', shortcut: '', icon: 'settings', submenu: true },
      ]
    },
    {
      label: 'Object',
      items: [
        { label: 'Transform', action: 'OBJECT_TRANSFORM', shortcut: '', icon: 'transform', submenu: true },
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
        { label: 'Expand Appearance', action: 'OBJECT_EXPAND_APPEARANCE', shortcut: '', icon: 'expand_circle_down' },
        { divider: true },
        { label: 'Rasterize...', action: 'OBJECT_RASTERIZE', shortcut: '', icon: 'image' },
        { label: 'Create Gradient Mesh...', action: 'OBJECT_GRADIENT_MESH', shortcut: '', icon: 'gradient' },
        { divider: true },
        { label: 'Path', action: 'OBJECT_PATH', shortcut: '', icon: 'polyline', submenu: true },
        { label: 'Blend', action: 'OBJECT_BLEND', shortcut: '', icon: 'blur_on', submenu: true },
        { label: 'Envelope Distort', action: 'OBJECT_ENVELOPE', shortcut: '', icon: 'waves', submenu: true },
        { divider: true },
        { label: 'Clipping Mask', action: 'OBJECT_CLIPPING_MASK', shortcut: 'Ctrl+7', icon: 'crop' },
        { label: 'Make', action: 'OBJECT_CLIPPING_MASK_MAKE', shortcut: '', icon: 'check' },
        { label: 'Release', action: 'OBJECT_CLIPPING_MASK_RELEASE', shortcut: 'Ctrl+Alt+7', icon: 'close' },
        { divider: true },
        { label: 'Compound Path', action: 'OBJECT_COMPOUND_PATH', shortcut: 'Ctrl+8', icon: 'call_merge', submenu: true },
        { label: 'Graph', action: 'OBJECT_GRAPH', shortcut: '', icon: 'bar_chart', submenu: true },
      ]
    },
    {
      label: 'Type',
      items: [
        { label: 'Font', action: 'TYPE_FONT', shortcut: '', icon: 'text_fields', submenu: true },
        { label: 'Size', action: 'TYPE_SIZE', shortcut: '', icon: 'format_size', submenu: true },
        { divider: true },
        { label: 'Create Outlines', action: 'TYPE_CREATE_OUTLINES', shortcut: 'Ctrl+Shift+O', icon: 'format_shapes' },
        { divider: true },
        { label: 'Find Font...', action: 'TYPE_FIND_FONT', shortcut: '', icon: 'search' },
        { label: 'Change Case...', action: 'TYPE_CHANGE_CASE', shortcut: '', icon: 'text_fields' },
        { divider: true },
        { label: 'Smart Punctuation...', action: 'TYPE_SMART_PUNCTUATION', shortcut: '', icon: 'auto_fix_high' },
        { label: 'Optical Margin Alignment', action: 'TYPE_OPTICAL_MARGIN', shortcut: '', icon: 'format_align_left' },
        { divider: true },
        { label: 'Threaded Text', action: 'TYPE_THREADED_TEXT', shortcut: '', icon: 'link', submenu: true },
        { label: 'Convert to Area Type', action: 'TYPE_AREA_TYPE', shortcut: '', icon: 'text_fields' },
        { label: 'Convert to Point Type', action: 'TYPE_POINT_TYPE', shortcut: '', icon: 'text_fields' },
      ]
    },
    {
      label: 'Select',
      items: [
        { label: 'All', action: 'SELECT_ALL', shortcut: 'Ctrl+A', icon: 'select_all' },
        { label: 'Deselect', action: 'SELECT_DESELECT', shortcut: 'Ctrl+Shift+A', icon: 'deselect' },
        { divider: true },
        { label: 'Same', action: 'SELECT_SAME', shortcut: '', icon: 'compare', submenu: true },
        { label: 'Object', action: 'SELECT_OBJECT', shortcut: '', icon: 'category', submenu: true },
        { divider: true },
        { label: 'Save Selection', action: 'SELECT_SAVE', shortcut: '', icon: 'bookmark' },
        { label: 'Edit Selection...', action: 'SELECT_EDIT', shortcut: '', icon: 'edit' },
      ]
    },
    {
      label: 'Effect',
      items: [
        { label: 'Apply Last Effect', action: 'EFFECT_APPLY_LAST', shortcut: 'Ctrl+Shift+E', icon: 'redo' },
        { label: 'Last Effect...', action: 'EFFECT_LAST', shortcut: 'Ctrl+Alt+Shift+E', icon: 'settings' },
        { divider: true },
        { label: '3D', action: 'EFFECT_3D', shortcut: '', icon: 'view_in_ar', submenu: true },
        { label: 'SVG Filters', action: 'EFFECT_SVG_FILTERS', shortcut: '', icon: 'filter_alt', submenu: true },
        { label: 'Distort & Transform', action: 'EFFECT_DISTORT', shortcut: '', icon: 'transform', submenu: true },
        { label: 'Path', action: 'EFFECT_PATH', shortcut: '', icon: 'polyline', submenu: true },
        { label: 'Pathfinder', action: 'EFFECT_PATHFINDER', shortcut: '', icon: 'call_merge', submenu: true },
        { label: 'Rasterize...', action: 'EFFECT_RASTERIZE', shortcut: '', icon: 'image' },
        { label: 'Stylize', action: 'EFFECT_STYLIZE', shortcut: '', icon: 'auto_awesome', submenu: true },
        { divider: true },
        { label: 'Document Raster Effects Settings...', action: 'EFFECT_RASTER_SETTINGS', shortcut: '', icon: 'settings' },
      ]
    },
    {
      label: 'View',
      items: [
        { label: 'Outline', action: 'VIEW_OUTLINE', shortcut: 'Ctrl+Y', icon: 'polyline' },
        { label: 'Overprint Preview', action: 'VIEW_OVERPRINT', shortcut: 'Ctrl+Alt+Shift+Y', icon: 'preview' },
        { divider: true },
        { label: 'Zoom In', action: 'VIEW_ZOOM_IN', shortcut: 'Ctrl++', icon: 'zoom_in' },
        { label: 'Zoom Out', action: 'VIEW_ZOOM_OUT', shortcut: 'Ctrl+-', icon: 'zoom_out' },
        { label: 'Fit in Window', action: 'VIEW_FIT', shortcut: 'Ctrl+0', icon: 'fit_screen' },
        { label: 'Actual Size', action: 'VIEW_ACTUAL', shortcut: 'Ctrl+1', icon: 'fullscreen' },
        { divider: true },
        { label: 'Hide Edges', action: 'VIEW_HIDE_EDGES', shortcut: 'Ctrl+H', icon: 'visibility_off' },
        { label: 'Hide Artboards', action: 'VIEW_HIDE_ARTBOARDS', shortcut: 'Ctrl+Shift+H', icon: 'crop_free' },
        { divider: true },
        { label: 'Show Rulers', action: 'VIEW_SHOW_RULERS', shortcut: 'Ctrl+R', icon: 'straighten' },
        { label: 'Show Grid', action: 'VIEW_SHOW_GRID', shortcut: 'Ctrl+\'', icon: 'grid_on' },
        { label: 'Show Guides', action: 'VIEW_SHOW_GUIDES', shortcut: 'Ctrl+;', icon: 'drag_indicator' },
        { label: 'Smart Guides', action: 'VIEW_SMART_GUIDES', shortcut: 'Ctrl+U', icon: 'auto_awesome' },
        { divider: true },
        { label: 'New View...', action: 'VIEW_NEW', shortcut: '', icon: 'add' },
        { label: 'Edit Views...', action: 'VIEW_EDIT', shortcut: '', icon: 'edit' },
      ]
    },
    {
      label: 'Window',
      items: [
        { label: 'New Window', action: 'WINDOW_NEW', shortcut: '', icon: 'open_in_new' },
        { divider: true },
        { label: 'Workspace', action: 'WINDOW_WORKSPACE', shortcut: '', icon: 'dashboard', submenu: true },
        { divider: true },
        { label: 'Actions', action: 'WINDOW_ACTIONS', shortcut: 'Alt+F9', icon: 'play_arrow' },
        { label: 'Align', action: 'WINDOW_ALIGN', shortcut: 'Shift+F7', icon: 'align_horizontal_center' },
        { label: 'Appearance', action: 'WINDOW_APPEARANCE', shortcut: 'Shift+F6', icon: 'palette' },
        { label: 'Artboards', action: 'WINDOW_ARTBOARDS', shortcut: 'Shift+F5', icon: 'crop_free' },
        { label: 'Attributes', action: 'WINDOW_ATTRIBUTES', shortcut: 'Ctrl+F11', icon: 'tune' },
        { label: 'Brushes', action: 'WINDOW_BRUSHES', shortcut: 'F5', icon: 'brush' },
        { label: 'Color', action: 'WINDOW_COLOR', shortcut: 'F6', icon: 'palette' },
        { label: 'Color Guide', action: 'WINDOW_COLOR_GUIDE', shortcut: 'Shift+F3', icon: 'color_lens' },
        { label: 'Gradient', action: 'WINDOW_GRADIENT', shortcut: 'Ctrl+F9', icon: 'gradient' },
        { label: 'Info', action: 'WINDOW_INFO', shortcut: 'F8', icon: 'info' },
        { label: 'Layers', action: 'WINDOW_LAYERS', shortcut: 'F7', icon: 'layers' },
        { label: 'Pathfinder', action: 'WINDOW_PATHFINDER', shortcut: 'Shift+Ctrl+F9', icon: 'call_merge' },
        { label: 'Stroke', action: 'WINDOW_STROKE', shortcut: 'Ctrl+F10', icon: 'show_chart' },
        { label: 'Swatches', action: 'WINDOW_SWATCHES', shortcut: '', icon: 'colorize' },
        { label: 'Symbols', action: 'WINDOW_SYMBOLS', shortcut: 'Shift+Ctrl+F11', icon: 'bookmark' },
        { label: 'Transform', action: 'WINDOW_TRANSFORM', shortcut: 'Shift+F8', icon: 'transform' },
        { label: 'Transparency', action: 'WINDOW_TRANSPARENCY', shortcut: 'Shift+Ctrl+F10', icon: 'layers' },
        { label: 'Type', action: 'WINDOW_TYPE', shortcut: '', icon: 'text_fields', submenu: true },
        { divider: true },
        { label: 'Brush Libraries', action: 'WINDOW_BRUSH_LIBRARIES', shortcut: '', icon: 'library_books', submenu: true },
        { label: 'Symbol Libraries', action: 'WINDOW_SYMBOL_LIBRARIES', shortcut: '', icon: 'bookmark', submenu: true },
        { label: 'Swatch Libraries', action: 'WINDOW_SWATCH_LIBRARIES', shortcut: '', icon: 'palette', submenu: true },
      ]
    },
    {
      label: 'Help',
      items: [
        { label: 'VectorForge Help', action: 'HELP_HELP', shortcut: 'F1', icon: 'help' },
        { label: 'Keyboard Shortcuts', action: 'HELP_SHORTCUTS', shortcut: '', icon: 'keyboard' },
        { divider: true },
        { label: 'System Info...', action: 'HELP_SYSTEM_INFO', shortcut: '', icon: 'info' },
        { label: 'About VectorForge', action: 'HELP_ABOUT', shortcut: '', icon: 'info' },
      ]
    },
  ];

  return (
    <header className="xibalba-header shrink-0 flex items-center justify-between z-[100] select-none">
      <div className="flex items-center gap-6">
        {/* Xibalba Brand Identity Block */}
        <div className="flex items-center gap-4 pr-6 border-r border-white/10">
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
              <span className="text-[10px] font-mono font-medium text-[var(--xibalba-text-200)] tracking-wider">xi-io:</span>
              <span className="text-[13px] font-black tracking-[0.15em] text-[var(--xibalba-text-000)] uppercase">VectorFORGE</span>
            </div>
            <span className="text-[9px] font-mono font-light text-[var(--xibalba-text-300)] tracking-widest">XIBALBA OS</span>
          </div>
        </div>

        {/* Professional Menu Bar - NO BUTTON BORDERS */}
        <nav className="flex items-center h-full">
          {menus.map(menu => (
            <div 
              key={menu.label} 
              className="relative h-full"
            >
              <button 
                className={`px-5 h-full text-[11px] font-black uppercase tracking-widest bg-transparent border-none hover:bg-[var(--xibalba-grey-150)] transition-colors ${activeMenu === menu.label ? 'bg-[var(--xibalba-grey-200)]' : ''}`}
                onMouseEnter={() => setActiveMenu(menu.label)}
                onMouseLeave={(e) => {
                  // Don't close if moving to submenu
                  if (!(e.relatedTarget as HTMLElement)?.closest('.xibalba-card')) {
                    setActiveMenu(null);
                  }
                }}
              >
                {menu.label}
              </button>
              
              {activeMenu === menu.label && (
                <div 
                  className="xibalba-card absolute top-full left-0 mt-1 w-64 py-2 z-[110] xibalba-animate-in max-h-[80vh] overflow-y-auto xibalba-scrollbar shadow-lg border border-white/10"
                  onMouseEnter={() => setActiveMenu(menu.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {menu.items.map((item, idx) => {
                    if ('divider' in item) {
                      return <div key={idx} className="h-px bg-white/10 my-1 mx-2" />;
                    }
                    return (
                      <button 
                        key={item.label}
                        onClick={() => { onAction(item.action); setActiveMenu(null); }}
                        className="w-full text-left px-5 py-2 text-[10px] font-medium text-[var(--xibalba-text-100)] hover:text-[var(--xibalba-text-000)] hover:bg-[var(--xibalba-grey-150)] flex items-center gap-4 group bg-transparent border-none cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] opacity-70">{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                        {item.shortcut && (
                          <span className="xibalba-text-xs font-mono text-[var(--xibalba-text-200)] opacity-0 group-hover:opacity-100">
                            {item.shortcut}
                          </span>
                        )}
                        {item.submenu && (
                          <span className="material-symbols-outlined text-[14px] opacity-50">chevron_right</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
         {/* Credits */}
         <div className="flex items-center gap-3">
            <LayoutSwitcher onLayoutChange={onLayoutChange} />
            <div className="xibalba-panel-elevated flex items-center gap-3 px-4 py-1.5 border border-white/10">
               <div className="size-2 bg-[var(--xibalba-grey-200)] animate-pulse"></div>
               <span className="text-[10px] font-black text-[var(--xibalba-text-100)] uppercase tracking-widest mono">25,000 CORE_LIBS</span>
            </div>
         </div>
         {/* Execution Status */}
         <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="flex flex-col items-end -space-y-1 mr-2">
               <span className="text-[9px] font-bold text-[var(--xibalba-text-100)] uppercase">Execution Layer</span>
               <span className="text-[8px] font-mono text-[var(--xibalba-text-200)] uppercase">Active_Session</span>
            </div>
            <div className="size-9 bg-[var(--xibalba-grey-150)] border border-white/10 overflow-hidden cursor-pointer xibalba-interactive">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=IllustrationPro" alt="User" className="w-full h-full object-cover" />
            </div>
         </div>
      </div>
    </header>
  );
};

export default ProfessionalFileMenu;
