/**
 * Generative Vector AI Panel
 * Matches design concept: PROMPT, STYLE & COMPLEXITY, PALETTE sections with GENERATE VECTOR button
 */

import React, { useState } from 'react';
import { DesignStyle } from '../types';

interface GenerativeVectorAIPanelProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  style: DesignStyle | string;
  onStyleChange: (style: DesignStyle | string) => void;
  complexity: number;
  onComplexityChange: (complexity: number) => void;
  palette: string[];
  onPaletteChange: (palette: string[]) => void;
  credits: number;
  onGenerate: () => void;
  onShowHistory?: () => void;
}

const GenerativeVectorAIPanel: React.FC<GenerativeVectorAIPanelProps> = ({
  prompt,
  onPromptChange,
  style,
  onStyleChange,
  complexity,
  onComplexityChange,
  palette,
  onPaletteChange,
  credits,
  onGenerate,
  onShowHistory,
}) => {
  const [showHistory, setShowHistory] = useState(false);

  const styles: { id: DesignStyle | string; label: string }[] = [
    { id: DesignStyle.FLAT, label: 'Flat Icon' },
    { id: DesignStyle.LINE, label: 'Line Art' },
    { id: DesignStyle.ISOMETRIC, label: 'Isometric' },
    { id: DesignStyle.ABSTRACT, label: 'Abstract' },
  ];

  const handleAddColor = () => {
    // Add a new color to palette (default to white)
    onPaletteChange([...palette, '#FFFFFF']);
  };

  const handleRemoveColor = (index: number) => {
    if (palette.length > 1) {
      onPaletteChange(palette.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="generative-vector-ai-panel">
      {/* Header */}
      <div className="generative-ai-header">
        <h2 className="generative-ai-title">GENERATIVE VECTOR AI</h2>
      </div>

      {/* PROMPT Section */}
      <div className="generative-ai-section">
        <div className="generative-ai-section-header">
          <span className="generative-ai-section-label">PROMPT</span>
          {onShowHistory && (
            <button
              className="generative-ai-history-link"
              onClick={() => {
                setShowHistory(!showHistory);
                onShowHistory();
              }}
            >
              History
            </button>
          )}
        </div>
        <div className="generative-ai-prompt-wrapper">
          <textarea
            id="generative-ai-prompt"
            name="generative-ai-prompt"
            className="generative-ai-prompt-textarea"
            placeholder="Describe the vector..."
            value={prompt}
            onChange={e => onPromptChange(e.target.value)}
            rows={4}
          />
          <button
            className="generative-ai-prompt-icon"
            aria-label="Enhance prompt"
            title="Enhance prompt"
          >
            <span className="material-symbols-outlined">auto_awesome</span>
          </button>
        </div>
      </div>

      {/* STYLE & COMPLEXITY Section */}
      <div className="generative-ai-section">
        <div className="generative-ai-section-header">
          <span className="generative-ai-section-label">STYLE & COMPLEXITY</span>
        </div>
        <div className="generative-ai-style-buttons">
          {styles.map(s => (
            <button
              key={s.id}
              className={`generative-ai-style-button ${style === s.id ? 'generative-ai-style-button-active' : ''}`}
              onClick={() => onStyleChange(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="generative-ai-complexity">
          <div className="generative-ai-complexity-labels">
            <span>Minimal</span>
            <span>Detailed</span>
          </div>
          <input
            type="range"
            id="generative-ai-complexity"
            name="generative-ai-complexity"
            className="generative-ai-complexity-slider"
            min="0"
            max="100"
            value={complexity}
            onChange={e => onComplexityChange(Number(e.target.value))}
          />
        </div>
      </div>

      {/* PALETTE Section */}
      <div className="generative-ai-section">
        <div className="generative-ai-section-header">
          <span className="generative-ai-section-label">PALETTE</span>
          <span className="generative-ai-palette-indicator" title="Primary color">
            ●
          </span>
        </div>
        <div className="generative-ai-palette">
          {palette.map((color, index) => (
            <button
              key={index}
              className="generative-ai-palette-swatch"
              style={{ backgroundColor: color }}
              onClick={() => {
                // Set as primary color (first in palette)
                const newPalette = [color, ...palette.filter((_, i) => i !== index)];
                onPaletteChange(newPalette);
              }}
              title={color}
              aria-label={`Color ${color}`}
            />
          ))}
          <button
            className="generative-ai-palette-add"
            onClick={handleAddColor}
            aria-label="Add color"
            title="Add color"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>

      {/* GENERATE VECTOR Button */}
      <div className="generative-ai-generate-section">
        <button
          className="generative-ai-generate-button"
          onClick={onGenerate}
          disabled={!prompt.trim()}
        >
          <span className="material-symbols-outlined">auto_awesome</span>
          <span>GENERATE VECTOR</span>
        </button>
        <div className="generative-ai-credits">
          <span className="material-symbols-outlined">bolt</span>
          <span>{credits} Credits</span>
        </div>
        <button className="generative-ai-buy-more">Buy More</button>
      </div>
    </div>
  );
};

export default GenerativeVectorAIPanel;
