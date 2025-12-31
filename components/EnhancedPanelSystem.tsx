/**
 * Enhanced Panel System
 * Supports nested docking: Panels can contain Palettes, Palettes can contain Tools
 * Visual grouping indicators for nested structures
 * Production-quality interaction hardening
 */

import React, { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { DockingZone, PalettePosition, DraggablePalette } from './PaletteDockingSystem';

export interface PanelConfig {
  id: string;
  title: string;
  type: 'panel' | 'palette' | 'tool';
  parentId?: string; // For nested structures
  children?: PanelConfig[];
  content: ReactNode;
  defaultZone?: DockingZone;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
  collapsible?: boolean;
  isCollapsed?: boolean;
}

export interface PanelGroup {
  id: string;
  title: string;
  panels: PanelConfig[];
  zone: DockingZone;
  visualIndicator?: 'border' | 'background' | 'shadow' | 'all';
}

interface EnhancedPanelSystemProps {
  panels: PanelConfig[];
  onPanelMove?: (id: string, position: PalettePosition) => void;
  onPanelGroup?: (panelIds: string[], groupId: string) => void;
  onPanelUngroup?: (groupId: string) => void;
}

/**
 * Visual Grouping Indicator
 * Shows distinct visual hardening when panels/palettes are grouped
 */
const GroupingIndicator: React.FC<{
  type: 'panel' | 'palette' | 'tool';
  level: number; // Nesting level
  indicator?: 'border' | 'background' | 'shadow' | 'all';
  isGrouped: boolean;
  children: ReactNode;
}> = ({ type, level, indicator = 'all', isGrouped, children }) => {
  // FIXED: Convert style function to CSS classes with data attributes
  const getGroupingClasses = () => {
    if (!isGrouped) return '';
    
    const classes: string[] = [];
    if (indicator === 'border' || indicator === 'all') {
      classes.push('panel-group-border');
    }
    if (indicator === 'background' || indicator === 'all') {
      classes.push('panel-group-bg');
    }
    if (indicator === 'shadow' || indicator === 'all') {
      classes.push('panel-group-shadow');
    }
    
    return classes.join(' ');
  };

  return (
    <div
      className={`xibalba-panel-grouping-indicator ${isGrouped ? 'is-grouped' : ''} ${getGroupingClasses()}`}
      data-type={type}
      data-level={level}
    >
      {children}
    </div>
  );
};

/**
 * Enhanced Panel Component
 * Can contain palettes, which can contain tools
 */
export const EnhancedPanel: React.FC<PanelConfig & {
  position: PalettePosition;
  onPositionChange: (position: PalettePosition) => void;
  zIndex: number;
  level?: number;
  isGrouped?: boolean;
  groupingIndicator?: 'border' | 'background' | 'shadow' | 'all';
}> = ({
  id,
  title,
  type,
  parentId,
  children: childPanels,
  content,
  position,
  onPositionChange,
  zIndex,
  defaultWidth = 300,
  defaultHeight = 400,
  minWidth = 200,
  minHeight = 200,
  resizable = true,
  collapsible = false,
  isCollapsed = false,
  level = 0,
  isGrouped = false,
  groupingIndicator = 'all'
}) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [nestedPanels, setNestedPanels] = useState<Map<string, PalettePosition>>(new Map());

  const handleNestedPanelMove = useCallback((nestedId: string, nestedPosition: PalettePosition) => {
    setNestedPanels(prev => {
      const next = new Map(prev);
      next.set(nestedId, nestedPosition);
      return next;
    });
  }, []);

  return (
    <GroupingIndicator
      type={type}
      level={level}
      indicator={groupingIndicator}
      isGrouped={isGrouped}
    >
      <DraggablePalette
        id={id}
        title={title}
        position={position}
        onPositionChange={onPositionChange}
        zIndex={zIndex + level}
        defaultWidth={defaultWidth}
        defaultHeight={defaultHeight}
        minWidth={minWidth}
        minHeight={minHeight}
        resizable={resizable}
      >
        {collapsible && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute top-2 right-2 xibalba-toolbar-button-professional size-6 z-10"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <span className="material-symbols-outlined text-[14px]">
              {collapsed ? 'expand_more' : 'expand_less'}
            </span>
          </button>
        )}
        
        {!collapsed && (
          <div className="xibalba-panel-content space-y-2">
            {/* Main Content */}
            <div className="xibalba-panel-main-content">
              {content}
            </div>
            
            {/* Nested Panels/Palettes */}
            {childPanels && childPanels.length > 0 && (
              <div className="xibalba-panel-nested-container space-y-1 border-t border-white/10 pt-2 mt-2">
                {childPanels.map((childPanel, idx) => {
                  const childPosition = nestedPanels.get(childPanel.id) || {
                    zone: 'floating' as DockingZone,
                    x: 0,
                    y: 0,
                    width: childPanel.defaultWidth || 250,
                    height: childPanel.defaultHeight || 300,
                    order: idx
                  };
                  
                  return (
                    <EnhancedPanel
                      key={childPanel.id}
                      {...childPanel}
                      position={childPosition}
                      onPositionChange={(pos) => handleNestedPanelMove(childPanel.id, pos)}
                      zIndex={zIndex + level + idx + 1}
                      level={level + 1}
                      isGrouped={true}
                      groupingIndicator={groupingIndicator}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </DraggablePalette>
    </GroupingIndicator>
  );
};

/**
 * Panel Group Manager
 * Manages groups of panels with visual indicators
 */
export const PanelGroupManager: React.FC<{
  groups: PanelGroup[];
  onGroupUpdate?: (groupId: string, updates: Partial<PanelGroup>) => void;
}> = ({ groups, onGroupUpdate }) => {
  return (
    <>
      {groups.map(group => (
        <div
          key={group.id}
          className={`xibalba-panel-group group-${group.zone}`}
          data-group-id={group.id}
          data-zone={group.zone}
        >
          {/* Group Header */}
          <div className="xibalba-panel-group-header flex items-center justify-between px-3 py-2 bg-[var(--xibalba-grey-100)] border-b border-white/10">
            <span className="xibalba-text-subheading text-xs font-black uppercase tracking-widest">
              {group.title}
            </span>
            <span className="xibalba-text-caption text-xs text-[var(--xibalba-text-100)]">
              {group.panels.length} {group.panels.length === 1 ? 'panel' : 'panels'}
            </span>
          </div>
          
          {/* Grouped Panels */}
          <div className="xibalba-panel-group-content">
            {group.panels.map((panel, idx) => {
              const defaultPosition: PalettePosition = {
                zone: group.zone,
                x: 0,
                y: 0,
                width: panel.defaultWidth || 300,
                height: panel.defaultHeight || 400,
                order: idx
              };
              
              return (
                <EnhancedPanel
                  key={panel.id}
                  {...panel}
                  position={defaultPosition}
                  onPositionChange={(pos) => {
                    // Update panel position within group
                    onGroupUpdate?.(group.id, {
                      panels: group.panels.map(p => 
                        p.id === panel.id ? { ...p, defaultWidth: pos.width, defaultHeight: pos.height } : p
                      )
                    });
                  }}
                  zIndex={1000 + idx}
                  level={0}
                  isGrouped={true}
                  groupingIndicator={group.visualIndicator || 'all'}
                />
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

/**
 * Main Enhanced Panel System
 */
export const EnhancedPanelSystem: React.FC<EnhancedPanelSystemProps> = ({
  panels,
  onPanelMove,
  onPanelGroup,
  onPanelUngroup
}) => {
  const [panelPositions, setPanelPositions] = useState<Map<string, PalettePosition>>(new Map());
  const [panelGroups, setPanelGroups] = useState<Map<string, PanelGroup>>(new Map());

  useEffect(() => {
    // Initialize panel positions
    const positions = new Map<string, PalettePosition>();
    panels.forEach((panel, index) => {
      const defaultZone = panel.defaultZone || 'floating';
      positions.set(panel.id, {
        zone: defaultZone,
        x: defaultZone === 'left' ? 0 : defaultZone === 'right' ? window.innerWidth - (panel.defaultWidth || 300) : 100 + index * 20,
        y: defaultZone === 'top' ? 56 : defaultZone === 'bottom' ? window.innerHeight - (panel.defaultHeight || 400) - 48 : 100 + index * 20,
        width: panel.defaultWidth,
        height: panel.defaultHeight,
        order: index
      });
    });
    setPanelPositions(positions);
  }, [panels]);

  const handlePositionChange = useCallback((id: string, position: PalettePosition) => {
    setPanelPositions(prev => {
      const next = new Map(prev);
      next.set(id, position);
      return next;
    });
    onPanelMove?.(id, position);
  }, [onPanelMove]);

  const handleGroupPanels = useCallback((panelIds: string[], groupId: string) => {
    const panelsToGroup = panels.filter(p => panelIds.includes(p.id));
    if (panelsToGroup.length < 2) return;
    
    const newGroup: PanelGroup = {
      id: groupId,
      title: `Group ${groupId}`,
      panels: panelsToGroup,
      zone: panelsToGroup[0]?.defaultZone || 'floating',
      visualIndicator: 'all'
    };
    
    setPanelGroups(prev => {
      const next = new Map(prev);
      next.set(groupId, newGroup);
      return next;
    });
    
    onPanelGroup?.(panelIds, groupId);
  }, [panels, onPanelGroup]);

  return (
    <>
      {/* Render grouped panels */}
      {Array.from(panelGroups.values()).map(group => (
        <PanelGroupManager
          key={group.id}
          groups={[group]}
          onGroupUpdate={(groupId, updates) => {
            setPanelGroups(prev => {
              const next = new Map(prev);
              const existing = next.get(groupId);
              if (existing) {
                next.set(groupId, { ...existing, ...updates });
              }
              return next;
            });
          }}
        />
      ))}
      
      {/* Render ungrouped panels */}
      {panels
        .filter(p => !Array.from(panelGroups.values()).some(g => g.panels.some(gp => gp.id === p.id)))
        .map((panel, index) => {
          const position = panelPositions.get(panel.id);
          if (!position) return null;
          
          return (
            <EnhancedPanel
              key={panel.id}
              {...panel}
              position={position}
              onPositionChange={(pos) => handlePositionChange(panel.id, pos)}
              zIndex={1000 + index}
              level={0}
              isGrouped={false}
            />
          );
        })}
    </>
  );
};

export default EnhancedPanelSystem;

