/**
 * Fast component tests using React Testing Library
 * Tests component rendering without browser
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SaveLoadButtons from '../../components/SaveLoadButtons';
import ExportButton from '../../components/ExportButton';

describe('Hotfix: SaveLoadButtons component', () => {
  it('should render Save and Load buttons', () => {
    const mockState = { layers: [], currentSvg: '<svg></svg>' };
    const mockSetState = vi.fn();
    
    render(<SaveLoadButtons state={mockState} setState={mockSetState} />);
    
    expect(screen.getByText(/💾 Save|Save/i)).toBeInTheDocument();
    expect(screen.getByText(/📂 Load|Load/i)).toBeInTheDocument();
  });

  it('should call saveProject when Save is clicked', () => {
    const mockState = { layers: [], currentSvg: '<svg></svg>' };
    const mockSetState = vi.fn();
    
    render(<SaveLoadButtons state={mockState} setState={mockSetState} />);
    
    const saveButton = screen.getByText(/💾 Save|Save/i);
    saveButton.click();
    
    // Check localStorage was updated
    const saved = localStorage.getItem('vectorforge:project');
    expect(saved).toBeTruthy();
  });
});

describe('Hotfix: ExportButton component', () => {
  it('should render Export button', () => {
    render(<ExportButton />);
    expect(screen.getByText(/📥 Export SVG|Export/i)).toBeInTheDocument();
  });
});

