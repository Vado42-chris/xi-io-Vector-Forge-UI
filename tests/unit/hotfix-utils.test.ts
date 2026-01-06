/**
 * Fast unit tests for hotfix utilities
 * These run in milliseconds, not seconds
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { saveProject, loadProject } from '../../utils/projectStorage';
import { exportSVG } from '../../utils/exportSvg';

describe('Hotfix: projectStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should save project state to localStorage', () => {
    const testState = { layers: [], currentSvg: '<svg></svg>', zoom: 100 };
    const result = saveProject(testState);
    
    expect(result).toBe(true);
    const saved = localStorage.getItem('vectorforge:project');
    expect(saved).toBeTruthy();
    expect(JSON.parse(saved!)).toEqual(testState);
  });

  it('should load project state from localStorage', () => {
    const testState = { layers: [], currentSvg: '<svg></svg>', zoom: 100 };
    localStorage.setItem('vectorforge:project', JSON.stringify(testState));
    
    const loaded = loadProject();
    expect(loaded).toEqual(testState);
  });

  it('should return null if no saved project', () => {
    const loaded = loadProject();
    expect(loaded).toBeNull();
  });

  it('should handle invalid JSON gracefully', () => {
    localStorage.setItem('vectorforge:project', 'invalid json');
    const loaded = loadProject();
    expect(loaded).toBeNull();
  });
});

describe('Hotfix: exportSVG', () => {
  beforeEach(() => {
    // Create a mock SVG element
    document.body.innerHTML = '<svg id="test-svg"><rect width="100" height="100"/></svg>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should find SVG element in DOM', () => {
    const svg = document.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should serialize SVG to string', () => {
    const svg = document.querySelector('svg');
    if (svg) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      expect(svgString).toContain('<svg');
      expect(svgString).toContain('<rect');
    }
  });
});

