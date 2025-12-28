/**
 * Self-Contained Tool Properties Panel
 * Isolated, responsive component with error boundary
 */

import React, { useState, useCallback, useMemo } from 'react';
import { ToolType, ToolProperties } from '../types';
import ErrorBoundary from './ErrorBoundary';
import '../styles/tool-properties.css';

interface ToolPropertiesPanelProps {
  activeTool: ToolType;
  toolProperties: ToolProperties;
  onPropertiesChange: (properties: Partial<ToolProperties>) => void;
  className?: string;
}

const ToolPropertiesPanel: React.FC<ToolPropertiesPanelProps> = ({
  activeTool, toolProperties, onPropertiesChange, className = ''
}) => {
  const [localState, setLocalState] = useState<Record<string, any>>({});

  const handlePropertyChange = useCallback((key: string, value: any) => {
    setLocalState(prev => ({ ...prev, [key]: value }));
    // Immediate update - no debounce for better responsiveness
    const updates: Partial<ToolProperties> = {};
      if (activeTool === 'pen') {
        updates.pen = { ...toolProperties.pen, [key]: value };
      } else if (activeTool === 'pencil') {
        updates.pencil = { ...toolProperties.pencil, [key]: value };
      } else if (activeTool === 'brush') {
        updates.brush = { ...toolProperties.brush, [key]: value };
      } else if (activeTool === 'text') {
        updates.text = { ...toolProperties.text, [key]: value };
      } else if (activeTool === 'rectangle') {
        updates.rectangle = { ...toolProperties.rectangle, [key]: value };
      } else if (activeTool === 'ellipse') {
        updates.ellipse = { ...toolProperties.ellipse, [key]: value };
      } else if (activeTool === 'polygon') {
        updates.polygon = { ...toolProperties.polygon, [key]: value };
      } else if (activeTool === 'rotate') {
        updates.rotate = { ...toolProperties.rotate, [key]: value };
      } else if (activeTool === 'scale') {
        updates.scale = { ...toolProperties.scale, [key]: value };
      } else if (activeTool === 'gradient') {
        updates.gradient = { ...toolProperties.gradient, [key]: value };
      } else if (activeTool === 'line') {
        updates.line = { ...toolProperties.line, [key]: value };
      } else if (activeTool === 'star') {
        updates.star = { ...toolProperties.star, [key]: value };
      } else if (activeTool === 'spiral') {
        updates.spiral = { ...toolProperties.spiral, [key]: value };
      } else if (activeTool === 'text-on-path') {
        updates['text-on-path'] = { ...toolProperties['text-on-path'], [key]: value };
      } else if (activeTool === 'free-transform') {
        updates['free-transform'] = { ...toolProperties['free-transform'], [key]: value };
      } else if (activeTool === 'reflect') {
        updates.reflect = { ...toolProperties.reflect, [key]: value };
      } else if (activeTool === 'mesh') {
        updates.mesh = { ...toolProperties.mesh, [key]: value };
      } else if (activeTool === 'eyedropper') {
        updates.eyedropper = { ...toolProperties.eyedropper, [key]: value };
      } else if (activeTool === 'zoom' || activeTool === 'pan') {
        updates.zoom = { ...toolProperties.zoom, [key]: value };
      }
      onPropertiesChange(updates);
  }, [activeTool, toolProperties, onPropertiesChange]);

  const renderToolProperties = useMemo(() => {
    try {
      switch (activeTool) {
        case 'pen':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Fill</label>
                <input
                  type="checkbox"
                  checked={toolProperties.pen?.fill ?? true}
                  onChange={(e) => handlePropertyChange('fill', e.target.checked)}
                  className="xibalba-focus-professional"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Stroke</label>
                <input
                  type="checkbox"
                  checked={toolProperties.pen?.stroke ?? true}
                  onChange={(e) => handlePropertyChange('stroke', e.target.checked)}
                  className="xibalba-focus-professional"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Close Path</label>
                <input
                  type="checkbox"
                  checked={toolProperties.pen?.closePath ?? false}
                  onChange={(e) => handlePropertyChange('closePath', e.target.checked)}
                  className="xibalba-focus-professional"
                />
              </div>
            </div>
          );

        case 'pencil':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Fidelity</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={toolProperties.pencil?.fidelity ?? 50}
                  onChange={(e) => handlePropertyChange('fidelity', parseInt(e.target.value))}
                  className="xibalba-slider-professional w-full"
                />
                <span className="xibalba-text-caption">{toolProperties.pencil?.fidelity ?? 50}%</span>
              </div>
              <div>
                <label className="xibalba-label-professional">Smoothness</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={toolProperties.pencil?.smoothness ?? 50}
                  onChange={(e) => handlePropertyChange('smoothness', parseInt(e.target.value))}
                  className="xibalba-slider-professional w-full"
                />
                <span className="xibalba-text-caption">{toolProperties.pencil?.smoothness ?? 50}%</span>
              </div>
              <div>
                <label className="xibalba-label-professional">Fill New Paths</label>
                <input
                  type="checkbox"
                  checked={toolProperties.pencil?.fillNewPaths ?? false}
                  onChange={(e) => handlePropertyChange('fillNewPaths', e.target.checked)}
                  className="xibalba-focus-professional"
                />
              </div>
            </div>
          );

        case 'brush':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Brush Type</label>
                <select
                  value={toolProperties.brush?.brushType ?? 'calligraphic'}
                  onChange={(e) => handlePropertyChange('brushType', e.target.value)}
                  className="xibalba-input-professional w-full"
                >
                  <option value="calligraphic">Calligraphic</option>
                  <option value="scatter">Scatter</option>
                  <option value="art">Art</option>
                  <option value="pattern">Pattern</option>
                  <option value="bristle">Bristle</option>
                </select>
              </div>
              <div>
                <label className="xibalba-label-professional">Size</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={toolProperties.brush?.size ?? 5}
                  onChange={(e) => handlePropertyChange('size', parseFloat(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Angle</label>
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={toolProperties.brush?.angle ?? 0}
                  onChange={(e) => handlePropertyChange('angle', parseFloat(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Roundness</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={toolProperties.brush?.roundness ?? 100}
                  onChange={(e) => handlePropertyChange('roundness', parseInt(e.target.value))}
                  className="xibalba-slider-professional w-full"
                />
                <span className="xibalba-text-caption">{toolProperties.brush?.roundness ?? 100}%</span>
              </div>
            </div>
          );

        case 'text':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Font Family</label>
                <select
                  value={toolProperties.text?.fontFamily ?? 'Inter'}
                  onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
                  className="xibalba-input-professional w-full"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
              <div>
                <label className="xibalba-label-professional">Font Size</label>
                <input
                  type="number"
                  min="6"
                  max="200"
                  value={toolProperties.text?.fontSize ?? 12}
                  onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Font Weight</label>
                <select
                  value={toolProperties.text?.fontWeight ?? 400}
                  onChange={(e) => handlePropertyChange('fontWeight', parseInt(e.target.value))}
                  className="xibalba-input-professional w-full"
                >
                  <option value="100">Thin</option>
                  <option value="300">Light</option>
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="600">Semi Bold</option>
                  <option value="700">Bold</option>
                  <option value="900">Black</option>
                </select>
              </div>
              <div>
                <label className="xibalba-label-professional">Alignment</label>
                <select
                  value={toolProperties.text?.alignment ?? 'left'}
                  onChange={(e) => handlePropertyChange('alignment', e.target.value)}
                  className="xibalba-input-professional w-full"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>
              <div>
                <label className="xibalba-label-professional">Tracking</label>
                <input
                  type="number"
                  value={toolProperties.text?.tracking ?? 0}
                  onChange={(e) => handlePropertyChange('tracking', parseFloat(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Leading</label>
                <input
                  type="number"
                  value={toolProperties.text?.leading ?? 0}
                  onChange={(e) => handlePropertyChange('leading', parseFloat(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
            </div>
          );

        case 'rectangle':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Corner Radius</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={toolProperties.rectangle?.cornerRadius ?? 0}
                  onChange={(e) => handlePropertyChange('cornerRadius', parseFloat(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
            </div>
          );

        case 'ellipse':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Start Angle</label>
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={toolProperties.ellipse?.startAngle ?? 0}
                  onChange={(e) => handlePropertyChange('startAngle', parseFloat(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">End Angle</label>
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={toolProperties.ellipse?.endAngle ?? 360}
                  onChange={(e) => handlePropertyChange('endAngle', parseFloat(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
            </div>
          );

        case 'polygon':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Sides</label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={toolProperties.polygon?.sides ?? 6}
                  onChange={(e) => handlePropertyChange('sides', parseInt(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Star Points</label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={toolProperties.polygon?.starPoints ?? 5}
                  onChange={(e) => handlePropertyChange('starPoints', parseInt(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Inner Radius</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={toolProperties.polygon?.innerRadius ?? 50}
                  onChange={(e) => handlePropertyChange('innerRadius', parseFloat(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
            </div>
          );

        case 'rotate':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Angle</label>
                <input
                  type="number"
                  min="-360"
                  max="360"
                  value={toolProperties.rotate?.angle ?? 0}
                  onChange={(e) => handlePropertyChange('angle', parseFloat(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Reference Point</label>
                <select
                  value={toolProperties.rotate?.referencePoint ?? 'center'}
                  onChange={(e) => handlePropertyChange('referencePoint', e.target.value)}
                  className="xibalba-input-professional w-full"
                >
                  <option value="center">Center</option>
                  <option value="top-left">Top-Left</option>
                  <option value="top-right">Top-Right</option>
                  <option value="bottom-left">Bottom-Left</option>
                  <option value="bottom-right">Bottom-Right</option>
                </select>
              </div>
            </div>
          );

        case 'scale':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Scale X</label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={toolProperties.scale?.x ?? 100}
                  onChange={(e) => handlePropertyChange('x', parseFloat(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Scale Y</label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={toolProperties.scale?.y ?? 100}
                  onChange={(e) => handlePropertyChange('y', parseFloat(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Uniform Scale</label>
                <input
                  type="checkbox"
                  checked={toolProperties.scale?.uniform ?? true}
                  onChange={(e) => handlePropertyChange('uniform', e.target.checked)}
                  className="xibalba-focus-professional"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Reference Point</label>
                <select
                  value={toolProperties.scale?.referencePoint ?? 'center'}
                  onChange={(e) => handlePropertyChange('referencePoint', e.target.value)}
                  className="xibalba-input-professional w-full"
                >
                  <option value="center">Center</option>
                  <option value="top-left">Top-Left</option>
                  <option value="top-right">Top-Right</option>
                  <option value="bottom-left">Bottom-Left</option>
                  <option value="bottom-right">Bottom-Right</option>
                </select>
              </div>
            </div>
          );

        case 'gradient':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Gradient Type</label>
                <select
                  value={toolProperties.gradient?.type ?? 'linear'}
                  onChange={(e) => handlePropertyChange('type', e.target.value)}
                  className="xibalba-input-professional w-full"
                >
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                  <option value="mesh">Mesh</option>
                </select>
              </div>
              <div>
                <label className="xibalba-label-professional">Angle</label>
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={toolProperties.gradient?.angle ?? 0}
                  onChange={(e) => handlePropertyChange('angle', parseFloat(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
            </div>
          );

        case 'line':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Line Cap</label>
                <select
                  value={toolProperties.line?.cap ?? 'butt'}
                  onChange={(e) => handlePropertyChange('cap', e.target.value)}
                  className="xibalba-input-professional w-full"
                >
                  <option value="butt">Butt</option>
                  <option value="round">Round</option>
                  <option value="square">Square</option>
                </select>
              </div>
              <div>
                <label className="xibalba-label-professional">Line Join</label>
                <select
                  value={toolProperties.line?.join ?? 'miter'}
                  onChange={(e) => handlePropertyChange('join', e.target.value)}
                  className="xibalba-input-professional w-full"
                >
                  <option value="miter">Miter</option>
                  <option value="round">Round</option>
                  <option value="bevel">Bevel</option>
                </select>
              </div>
            </div>
          );

        case 'star':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Points</label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={toolProperties.star?.points ?? 5}
                  onChange={(e) => handlePropertyChange('points', parseInt(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Inner Radius</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(toolProperties.star?.innerRadius ?? 50) * 100}
                  onChange={(e) => handlePropertyChange('innerRadius', parseInt(e.target.value) / 100)}
                  className="xibalba-slider-professional w-full"
                />
                <span className="xibalba-text-caption">{Math.round((toolProperties.star?.innerRadius ?? 50) * 100)}%</span>
              </div>
            </div>
          );

        case 'spiral':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Decay</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(toolProperties.spiral?.decay ?? 80) * 100}
                  onChange={(e) => handlePropertyChange('decay', parseInt(e.target.value) / 100)}
                  className="xibalba-slider-professional w-full"
                />
                <span className="xibalba-text-caption">{Math.round((toolProperties.spiral?.decay ?? 80) * 100)}%</span>
              </div>
              <div>
                <label className="xibalba-label-professional">Turns</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={toolProperties.spiral?.turns ?? 3}
                  onChange={(e) => handlePropertyChange('turns', parseInt(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
            </div>
          );

        case 'text-on-path':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Offset</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={toolProperties['text-on-path']?.offset ?? 0}
                  onChange={(e) => handlePropertyChange('offset', parseFloat(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Flip</label>
                <input
                  type="checkbox"
                  checked={toolProperties['text-on-path']?.flip ?? false}
                  onChange={(e) => handlePropertyChange('flip', e.target.checked)}
                  className="xibalba-focus-professional"
                />
              </div>
            </div>
          );

        case 'free-transform':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Constrain Proportions</label>
                <input
                  type="checkbox"
                  checked={toolProperties['free-transform']?.constrain ?? true}
                  onChange={(e) => handlePropertyChange('constrain', e.target.checked)}
                  className="xibalba-focus-professional"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Transform Origin</label>
                <select
                  value={toolProperties['free-transform']?.origin ?? 'center'}
                  onChange={(e) => handlePropertyChange('origin', e.target.value)}
                  className="xibalba-input-professional w-full"
                >
                  <option value="center">Center</option>
                  <option value="top-left">Top-Left</option>
                  <option value="top-right">Top-Right</option>
                  <option value="bottom-left">Bottom-Left</option>
                  <option value="bottom-right">Bottom-Right</option>
                </select>
              </div>
            </div>
          );

        case 'reflect':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Axis</label>
                <select
                  value={toolProperties.reflect?.axis ?? 'vertical'}
                  onChange={(e) => handlePropertyChange('axis', e.target.value)}
                  className="xibalba-input-professional w-full"
                >
                  <option value="vertical">Vertical</option>
                  <option value="horizontal">Horizontal</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="xibalba-label-professional">Copy</label>
                <input
                  type="checkbox"
                  checked={toolProperties.reflect?.copy ?? false}
                  onChange={(e) => handlePropertyChange('copy', e.target.checked)}
                  className="xibalba-focus-professional"
                />
              </div>
            </div>
          );

        case 'mesh':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Rows</label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={toolProperties.mesh?.rows ?? 4}
                  onChange={(e) => handlePropertyChange('rows', parseInt(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
              <div>
                <label className="xibalba-label-professional">Columns</label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={toolProperties.mesh?.columns ?? 4}
                  onChange={(e) => handlePropertyChange('columns', parseInt(e.target.value))}
                  className="xibalba-input-professional w-full"
                />
              </div>
            </div>
          );

        case 'eyedropper':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Sample Size</label>
                <select
                  value={toolProperties.eyedropper?.sampleSize ?? 'point'}
                  onChange={(e) => handlePropertyChange('sampleSize', e.target.value)}
                  className="xibalba-input-professional w-full"
                >
                  <option value="point">Point Sample</option>
                  <option value="3x3">3x3 Average</option>
                  <option value="5x5">5x5 Average</option>
                  <option value="11x11">11x11 Average</option>
                </select>
              </div>
              <div>
                <label className="xibalba-label-professional">Sample All Layers</label>
                <input
                  type="checkbox"
                  checked={toolProperties.eyedropper?.sampleAll ?? false}
                  onChange={(e) => handlePropertyChange('sampleAll', e.target.checked)}
                  className="xibalba-focus-professional"
                />
              </div>
            </div>
          );

        case 'pan':
        case 'zoom':
          return (
            <div className="space-y-4">
              <div>
                <label className="xibalba-label-professional">Zoom Level</label>
                <input
                  type="range"
                  min="25"
                  max="400"
                  value={toolProperties.zoom?.level ?? 100}
                  onChange={(e) => handlePropertyChange('level', parseInt(e.target.value))}
                  className="xibalba-slider-professional w-full"
                />
                <span className="xibalba-text-caption">{toolProperties.zoom?.level ?? 100}%</span>
              </div>
            </div>
          );

        default:
          return (
            <div className="text-center py-8 opacity-50">
              <span className="material-symbols-outlined text-4xl mb-2 text-[var(--xibalba-text-200)]">tune</span>
              <p className="xibalba-text-caption text-[var(--xibalba-text-200)]">Select a tool to configure its properties</p>
              <p className="xibalba-text-xs text-[var(--xibalba-text-300)] mt-2">Tool: {activeTool}</p>
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering tool properties:', error);
      return (
        <div className="text-center py-8 opacity-50">
          <span className="material-symbols-outlined text-4xl mb-2 text-red-400">error</span>
          <p className="xibalba-text-caption text-red-400">Error loading tool properties</p>
        </div>
      );
    }
  }, [activeTool, toolProperties, handlePropertyChange]);

  return (
    <ErrorBoundary
      fallback={
        <div className="xibalba-panel-professional p-4">
          <p className="xibalba-text-caption text-red-400">Tool properties panel error</p>
        </div>
      }
    >
      <div className={`tool-properties-panel ${className}`}>
        {renderToolProperties}
      </div>
    </ErrorBoundary>
  );
};

export default ToolPropertiesPanel;
