/**
 * Reusable Tab System Component
 * REDUCE, REUSE, RECYCLE: Extract tab pattern from RightSidebar
 */

import React from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  tooltip?: string;
  disabled?: boolean;
  category?: string;
}

export interface TabSystemProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'compact';
  grouped?: boolean;
  className?: string;
}

export const TabSystem: React.FC<TabSystemProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  grouped = false,
  className = '',
}) => {
  const groupedTabs = grouped
    ? tabs.reduce((acc, tab) => {
        const category = tab.category || 'default';
        if (!acc[category]) acc[category] = [];
        acc[category].push(tab);
        return acc;
      }, {} as Record<string, Tab[]>)
    : { default: tabs };

  return (
    <div className={`xibalba-tabs-professional ${className}`}>
      {Object.entries(groupedTabs).map(([category, categoryTabs], categoryIdx) => (
        <div 
          key={category}
          className={categoryIdx > 0 ? 'border-t border-white/10' : ''}
        >
          {categoryTabs.map((tab) => {
            // Determine variant based on category for mixed styling
            const tabVariant = category === 'system' || category === 'help' ? 'compact' : variant;
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && onTabChange(tab.id)}
                disabled={tab.disabled}
                className={`xibalba-tab-professional ${
                  tabVariant === 'compact' ? 'text-sm py-1.5' : ''
                } ${activeTab === tab.id ? 'active' : ''} ${
                  tab.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title={tab.tooltip}
                aria-label={tab.label}
              >
                {tab.icon && (
                  <span 
                    className={`material-symbols-outlined ${
                      tabVariant === 'compact' ? 'text-[12px]' : 'text-[14px]'
                    }`}
                    aria-hidden="true"
                    data-icon={tab.icon}
                  />
                )}
                <span className={tabVariant === 'compact' ? 'text-sm' : 'text-sm font-medium'}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

