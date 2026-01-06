import React, { useState, useEffect } from 'react';

export const AdvancedSection: React.FC<{
  collapsed?: boolean;
  summary?: React.ReactNode;
  id?: string;
  onToggle?: (collapsed: boolean) => void;
  children: React.ReactNode;
}> = ({ collapsed = true, summary, id, onToggle, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  const toggle = () => {
    setIsCollapsed((s) => {
      const next = !s;
      if (onToggle) onToggle(next);
      return next;
    });
  };

  return (
    <section aria-labelledby={id ? `${id}-label` : undefined} style={{ marginTop: 16 }}>
      {summary && (
        <div id={id ? `${id}-label` : undefined} style={{ marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
          {summary}
        </div>
      )}

      <div style={{ display: isCollapsed ? 'none' : 'block', marginTop: 8 }} aria-hidden={isCollapsed}>
        {children}
      </div>

      <button
        onClick={toggle}
        aria-expanded={!isCollapsed}
        title={isCollapsed ? 'Show advanced options' : 'Hide advanced options'}
        style={{ marginTop: 8, fontSize: 13, padding: '6px 12px', cursor: 'pointer' }}
      >
        {isCollapsed ? '▶ Show Advanced' : '▼ Hide Advanced'}
      </button>
    </section>
  );
};

export default AdvancedSection;

