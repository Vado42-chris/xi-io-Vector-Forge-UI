import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const Tooltip: React.FC<{
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  shortcut?: string;
  children: React.ReactElement;
}> = ({ content, position = 'top', delay = 400, shortcut, children }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const timeoutRef = useRef<number | undefined>();
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const show = () => {
    timeoutRef.current = window.setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          x: rect.left + rect.width / 2,
          y: position === 'top' ? rect.top : rect.bottom,
        });
        setVisible(true);
      }
    }, delay);
  };

  const hide = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  const child = React.cloneElement(children, {
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      const { ref } = children as any;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    onMouseEnter: (e: any) => {
      show();
      if (children.props.onMouseEnter) children.props.onMouseEnter(e);
    },
    onMouseLeave: (e: any) => {
      hide();
      if (children.props.onMouseLeave) children.props.onMouseLeave(e);
    },
    onFocus: (e: any) => {
      show();
      if (children.props.onFocus) children.props.onFocus(e);
    },
    onBlur: (e: any) => {
      hide();
      if (children.props.onBlur) children.props.onBlur(e);
    },
  });

  const tip = visible ? (
    <div
      role="tooltip"
      style={{
        position: 'fixed',
        left: coords.x,
        top: coords.y,
        transform: position === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
        marginTop: position === 'top' ? -8 : 8,
        background: 'rgba(18,18,18,0.95)',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: 6,
        fontSize: 12,
        pointerEvents: 'none',
        zIndex: 2000,
        whiteSpace: 'nowrap',
      }}
    >
      <span>{content}</span>
      {shortcut && <span style={{ marginLeft: 8, fontFamily: 'monospace', fontSize: 11, opacity: 0.8 }}>{shortcut}</span>}
    </div>
  ) : null;

  return (
    <>
      {child}
      {typeof document !== 'undefined' && visible ? createPortal(tip, document.body) : null}
    </>
  );
};

export default Tooltip;

