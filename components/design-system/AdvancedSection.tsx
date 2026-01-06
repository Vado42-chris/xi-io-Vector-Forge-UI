import React, { useState, useEffect } from 'react';

export const AdvancedSection: React.FC<{
  collapsed?: boolean;
  summary?: React.ReactNode;
  id?: string;
  onToggle?: (collapsed: boolean) => void;
  children?: React.ReactNode;
}> = ({ collapsed = true, summary, id, onToggle, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  const toggle = () => {
    setIsCollapsed((s) => {
      const next = !s;
      onToggle && onToggle(next);
      return next;
    });
  };

  return (
    <section aria-labelledby={id ? `${id}-label` : undefined}>
      {summary && (
        <div id={id ? `${id}-label` : undefined} style={{ marginBottom: 8 }}>
          {summary}
        </div>
      )}

      <div style={{ display: isCollapsed ? 'none' : 'block' }}>{children}</div>

      <button
        onClick={toggle}
        aria-expanded={!isCollapsed}
        title={isCollapsed ? 'Show advanced options' : 'Hide advanced options'}
        style={{ marginTop: 8, fontSize: 13 }}
      >
        {isCollapsed ? 'Show Advanced' : 'Hide Advanced'}
      </button>
    </section>
  );
};

export default AdvancedSection;
