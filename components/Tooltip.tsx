/**
 * Tooltip Component
 * Reusable tooltip for UI elements
 */

import React, { useState, useRef, useEffect } from 'react';
import '../styles/tooltip.css';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(position);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTooltip = () => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      adjustPosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const adjustPosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return;

    const tooltip = tooltipRef.current;
    const trigger = triggerRef.current;
    const rect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newPosition = position;

    // Adjust position based on viewport boundaries
    if (position === 'top' && rect.top - tooltipRect.height < 0) {
      newPosition = 'bottom';
    } else if (position === 'bottom' && rect.bottom + tooltipRect.height > viewportHeight) {
      newPosition = 'top';
    } else if (position === 'left' && rect.left - tooltipRect.width < 0) {
      newPosition = 'right';
    } else if (position === 'right' && rect.right + tooltipRect.width > viewportWidth) {
      newPosition = 'left';
    }

    setTooltipPosition(newPosition);
  };

  const clonedChild = React.cloneElement(children as React.ReactElement<any>, {
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      const childRef = (children as any).ref;
      if (typeof childRef === 'function') {
        childRef(node);
      } else if (childRef) {
        (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      if (React.isValidElement(children) && children.props && typeof children.props === 'object' && children.props !== null && 'onMouseEnter' in children.props && typeof children.props.onMouseEnter === 'function') {
        children.props.onMouseEnter(e);
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hideTooltip();
      if (React.isValidElement(children) && children.props && typeof children.props === 'object' && children.props !== null && 'onMouseLeave' in children.props && typeof children.props.onMouseLeave === 'function') {
        children.props.onMouseLeave(e);
      }
    },
    onFocus: (e: React.FocusEvent) => {
      showTooltip();
      if (React.isValidElement(children) && children.props && typeof children.props === 'object' && children.props !== null && 'onFocus' in children.props && typeof children.props.onFocus === 'function') {
        children.props.onFocus(e);
      }
    },
    onBlur: (e: React.FocusEvent) => {
      hideTooltip();
      if (React.isValidElement(children) && children.props && typeof children.props === 'object' && children.props !== null && 'onBlur' in children.props && typeof children.props.onBlur === 'function') {
        children.props.onBlur(e);
      }
    },
  });

  return (
    <>
      {clonedChild}
      {isVisible && content && (
        <div
          ref={tooltipRef}
          className={`tooltip tooltip-${tooltipPosition}`}
          role="tooltip"
          aria-live="polite"
        >
          {content}
        </div>
      )}
    </>
  );
};

export default Tooltip;

