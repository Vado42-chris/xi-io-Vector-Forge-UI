/**
 * Xibalba Logomark Component
 * Reusable brand identity component for all Xibalba products
 * Mask-shaped logo on colored rectangle background
 * Visual metaphor: The mask IS the brand identity
 */

import React, { useEffect, useRef } from 'react';

export interface XibalbaLogomarkProps {
  /** Background color - matches product accent color */
  backgroundColor?: string;
  /** Size of the logomark container */
  size?: number;
  /** Padding around the logo */
  padding?: number;
  /** Additional className */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Show product name below */
  showProductName?: boolean;
  /** Product name to display */
  productName?: string;
}

const XibalbaLogomark: React.FC<XibalbaLogomarkProps> = ({
  backgroundColor = 'var(--xibalba-accent)',
  size = 40,
  padding = 8,
  className = '',
  onClick,
  showProductName = false,
  productName = 'VectorForge'
}) => {
  const containerSize = size;
  const logoSize = containerSize - (padding * 2);
  const rectangleRef = useRef<HTMLDivElement>(null);

  // FIXED: Set CSS custom properties for dynamic values (correct pattern)
  useEffect(() => {
    if (rectangleRef.current) {
      rectangleRef.current.style.setProperty('--logomark-size', `${containerSize}px`);
      rectangleRef.current.style.setProperty('--logomark-bg-color', backgroundColor);
      rectangleRef.current.style.setProperty('--logomark-padding', `${padding}px`);
    }
  }, [containerSize, backgroundColor, padding]);

  return (
    <div 
      className={`xibalba-logomark-container flex flex-col items-center gap-1 ${onClick ? 'cursor-pointer' : 'cursor-default'} ${className}`}
      onClick={onClick}
    >
      {/* Colored Rectangle with Mask Logo */}
      <div
        ref={rectangleRef}
        className="xibalba-logomark-rectangle flex items-center justify-center border border-white/20 shadow-lg transition-all hover:shadow-xl"
      >
        {/* Mask-shaped Logo - White SVG */}
        <svg
          width={logoSize}
          height={logoSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="xibalba-logomark-mask"
        >
          {/* Mask Shape - Stylized mask silhouette */}
          <path
            d="M 20 30 Q 20 20, 30 20 L 70 20 Q 80 20, 80 30 L 80 50 Q 80 60, 70 60 L 50 60 L 50 80 Q 50 85, 45 85 L 35 85 Q 30 85, 30 80 L 30 60 L 30 60 Q 20 60, 20 50 Z"
            fill="white"
            fillOpacity="0.95"
          />
          {/* Eye holes */}
          <ellipse cx="40" cy="40" rx="6" ry="8" fill="black" fillOpacity="0.3" />
          <ellipse cx="60" cy="40" rx="6" ry="8" fill="black" fillOpacity="0.3" />
          {/* Decorative lines */}
          <path
            d="M 30 50 Q 50 55, 70 50"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Product Name (optional) */}
      {showProductName && productName && (
        <span className="xibalba-text-caption text-[8px] font-black uppercase tracking-widest text-[var(--xibalba-text-200)]">
          {productName}
        </span>
      )}
    </div>
  );
};

export default XibalbaLogomark;

