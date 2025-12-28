/**
 * Professional Rulers with Real Measurements
 * Shows actual units (px, mm, cm, in, pt) with readable markings
 * NO INLINE STYLES - Component-based platform
 */

import React, { useCallback, useRef, useEffect } from 'react';
import { MeasurementUnit } from '../types';

interface ProfessionalRulersProps {
  zoom: number;
  pan: { x: number; y: number };
  unit: MeasurementUnit;
  canvasWidth: number;
  canvasHeight: number;
  onUnitChange: (unit: MeasurementUnit) => void;
}

const ProfessionalRulers: React.FC<ProfessionalRulersProps> = ({
  zoom, pan, unit, canvasWidth, canvasHeight, onUnitChange
}) => {
  const horizontalRulerRef = useRef<HTMLDivElement>(null);
  const verticalRulerRef = useRef<HTMLDivElement>(null);

  // Convert pixels to selected unit
  const convertToUnit = useCallback((px: number): number => {
    switch (unit) {
      case 'px': return px;
      case 'mm': return px * 0.264583;
      case 'cm': return px * 0.0264583;
      case 'in': return px / 96;
      case 'pt': return px * 0.75;
      default: return px;
    }
  }, [unit]);

  // Get readable step based on zoom and unit
  const getStep = useCallback((zoom: number, unit: MeasurementUnit): number => {
    const baseStep = zoom < 50 ? 100 : zoom < 100 ? 50 : zoom < 200 ? 25 : 10;
    switch (unit) {
      case 'px': return baseStep;
      case 'mm': return baseStep * 0.264583;
      case 'cm': return baseStep * 0.0264583;
      case 'in': return baseStep / 96;
      case 'pt': return baseStep * 0.75;
      default: return baseStep;
    }
  }, [unit]);

  // Format number for display
  const formatValue = useCallback((value: number): string => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    if (value >= 100) return value.toFixed(0);
    if (value >= 10) return value.toFixed(1);
    return value.toFixed(2);
  }, []);

  const zoomScale = zoom / 100;
  const step = getStep(zoom, unit);

  // Update CSS variables for dynamic positioning
  useEffect(() => {
    if (horizontalRulerRef.current) {
      horizontalRulerRef.current.style.setProperty('--ruler-pan-x', `${pan.x}px`);
      horizontalRulerRef.current.style.setProperty('--ruler-zoom-scale', `${zoomScale}`);
    }
    if (verticalRulerRef.current) {
      verticalRulerRef.current.style.setProperty('--ruler-pan-y', `${pan.y}px`);
      verticalRulerRef.current.style.setProperty('--ruler-zoom-scale', `${zoomScale}`);
    }
  }, [pan, zoomScale]);

  // Horizontal Ruler
  const horizontalMarkings = [];
  for (let i = 0; i <= canvasWidth; i += step) {
    const value = convertToUnit(i);
    const isMajor = i % (step * 5) === 0;
    horizontalMarkings.push({ position: i, value, isMajor });
  }

  // Vertical Ruler
  const verticalMarkings = [];
  for (let i = 0; i <= canvasHeight; i += step) {
    const value = convertToUnit(i);
    const isMajor = i % (step * 5) === 0;
    verticalMarkings.push({ position: i, value, isMajor });
  }

  // Horizontal marking component with CSS variable
  const HorizontalMarking: React.FC<{ mark: { position: number; value: number; isMajor: boolean }; index: number }> = ({ mark, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (ref.current) {
        const position = (mark.position * zoomScale) + pan.x;
        ref.current.style.setProperty('--ruler-position', `${position}px`);
      }
    }, [mark.position, zoomScale, pan.x]);
    
    return (
      <div
        ref={ref}
        className={`ruler-marking ${mark.isMajor ? 'ruler-marking-major' : 'ruler-marking-minor'}`}
      >
        {mark.isMajor && (
          <span className="ruler-marking-label">
            {formatValue(mark.value)}
          </span>
        )}
      </div>
    );
  };

  // Vertical marking component with CSS variable
  const VerticalMarking: React.FC<{ mark: { position: number; value: number; isMajor: boolean }; index: number }> = ({ mark, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (ref.current) {
        const top = (mark.position * zoomScale) + pan.y;
        ref.current.style.setProperty('--ruler-mark-top', `${top}px`);
      }
    }, [mark.position, zoomScale, pan.y]);
    
    return (
      <div
        ref={ref}
        className={`ruler-marking ruler-marking-positioned ${mark.isMajor ? 'ruler-marking-vertical' : 'ruler-marking-vertical-minor'}`}
      >
        {mark.isMajor && (
          <span className="ruler-marking-label">
            {formatValue(mark.value)}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Unit Selector */}
      <div className="absolute top-0 left-0 w-8 h-8 bg-[var(--xibalba-grey-050)] border-r border-b border-white/10 z-50 flex items-center justify-center">
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value as MeasurementUnit)}
          className="xibalba-input-professional text-[9px] w-full h-full px-1 text-center cursor-pointer ruler-unit-selector"
          aria-label="Measurement unit selector"
          title="Select measurement unit"
        >
          <option value="px">px</option>
          <option value="mm">mm</option>
          <option value="cm">cm</option>
          <option value="in">in</option>
          <option value="pt">pt</option>
        </select>
      </div>

      {/* Horizontal Ruler */}
      <div 
        ref={horizontalRulerRef}
        className="absolute top-0 left-8 right-0 h-8 bg-[var(--xibalba-grey-050)] border-b border-white/10 z-50 ruler-horizontal"
      >
        {horizontalMarkings.map((mark, i) => (
          <HorizontalMarking key={i} mark={mark} index={i} />
        ))}
      </div>

      {/* Vertical Ruler */}
      <div 
        ref={verticalRulerRef}
        className="absolute top-8 left-0 bottom-0 w-8 bg-[var(--xibalba-grey-050)] border-r border-white/10 z-50 ruler-vertical"
      >
        {verticalMarkings.map((mark, i) => (
          <VerticalMarking key={i} mark={mark} index={i} />
        ))}
      </div>
    </>
  );
};

export default ProfessionalRulers;
