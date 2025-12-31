/**
 * Brush Tool Tests
 * Unit tests for brush tool core functionality
 * 
 * #hashtag: testing brush tool
 */

import BrushTool from '../lib/tools/brush';

describe('BrushTool', () => {
  let brushTool: BrushTool;

  beforeEach(() => {
    brushTool = new BrushTool({
      minWidth: 2,
      maxWidth: 20,
      pressureSensitivity: 0.7,
      smoothing: 0.3,
      color: '#ff9800',
      opacity: 1.0,
    });
  });

  describe('startStroke', () => {
    it('should start a new stroke', () => {
      brushTool.startStroke(10, 20, 0.5);
      const currentStroke = brushTool.getCurrentStroke();
      
      expect(currentStroke.length).toBe(1);
      expect(currentStroke[0].x).toBe(10);
      expect(currentStroke[0].y).toBe(20);
      expect(currentStroke[0].pressure).toBe(0.5);
    });

    it('should reset previous stroke', () => {
      brushTool.startStroke(10, 20);
      brushTool.addPoint(20, 30);
      brushTool.startStroke(50, 60);
      
      const currentStroke = brushTool.getCurrentStroke();
      expect(currentStroke.length).toBe(1);
      expect(currentStroke[0].x).toBe(50);
    });
  });

  describe('addPoint', () => {
    it('should add points to current stroke', () => {
      brushTool.startStroke(10, 20);
      brushTool.addPoint(20, 30);
      brushTool.addPoint(30, 40);
      
      const currentStroke = brushTool.getCurrentStroke();
      expect(currentStroke.length).toBe(3);
    });

    it('should simulate pressure from velocity when not provided', () => {
      brushTool.startStroke(10, 20);
      
      // Slow movement (should have higher pressure)
      brushTool.addPoint(11, 21); // Small movement
      const slowPoint = brushTool.getCurrentStroke()[1];
      expect(slowPoint.pressure).toBeGreaterThan(0.5);
      
      // Fast movement (should have lower pressure)
      brushTool.startStroke(10, 20);
      brushTool.addPoint(50, 50); // Large movement
      const fastPoint = brushTool.getCurrentStroke()[1];
      expect(fastPoint.pressure).toBeLessThan(0.5);
    });

    it('should use provided pressure when available', () => {
      brushTool.startStroke(10, 20, 0.8);
      brushTool.addPoint(20, 30, 0.9);
      
      const currentStroke = brushTool.getCurrentStroke();
      expect(currentStroke[1].pressure).toBe(0.9);
    });

    it('should apply smoothing', () => {
      brushTool.startStroke(10, 20);
      brushTool.addPoint(30, 40); // Large jump
      
      const currentStroke = brushTool.getCurrentStroke();
      const smoothedPoint = currentStroke[1];
      
      // Smoothed point should be between start and target
      expect(smoothedPoint.x).toBeGreaterThan(10);
      expect(smoothedPoint.x).toBeLessThan(30);
    });
  });

  describe('endStroke', () => {
    it('should create stroke from current points', () => {
      brushTool.startStroke(10, 20);
      brushTool.addPoint(20, 30);
      brushTool.addPoint(30, 40);
      
      const stroke = brushTool.endStroke();
      expect(stroke).not.toBeNull();
      expect(stroke!.points.length).toBe(3);
      expect(stroke!.id).toContain('brush_');
    });

    it('should return null if stroke has less than 2 points', () => {
      brushTool.startStroke(10, 20);
      const stroke = brushTool.endStroke();
      expect(stroke).toBeNull();
    });

    it('should clear current stroke after ending', () => {
      brushTool.startStroke(10, 20);
      brushTool.addPoint(20, 30);
      brushTool.endStroke();
      
      const currentStroke = brushTool.getCurrentStroke();
      expect(currentStroke.length).toBe(0);
    });
  });

  describe('undo/redo', () => {
    it('should undo last stroke', () => {
      brushTool.startStroke(10, 20);
      brushTool.addPoint(20, 30);
      const stroke1 = brushTool.endStroke();
      
      brushTool.startStroke(50, 60);
      brushTool.addPoint(60, 70);
      const stroke2 = brushTool.endStroke();
      
      expect(brushTool.getStrokes().length).toBe(2);
      
      const undone = brushTool.undo();
      expect(undone).toEqual(stroke2);
      expect(brushTool.getStrokes().length).toBe(1);
    });

    it('should redo last undone stroke', () => {
      brushTool.startStroke(10, 20);
      brushTool.addPoint(20, 30);
      const stroke = brushTool.endStroke();
      
      brushTool.undo();
      expect(brushTool.getStrokes().length).toBe(0);
      
      const redone = brushTool.redo();
      expect(redone).toEqual(stroke);
      expect(brushTool.getStrokes().length).toBe(1);
    });

    it('should clear redo stack on new action', () => {
      brushTool.startStroke(10, 20);
      brushTool.addPoint(20, 30);
      brushTool.endStroke();
      
      brushTool.undo();
      brushTool.startStroke(50, 60);
      brushTool.addPoint(60, 70);
      brushTool.endStroke();
      
      // Redo should return null after new action
      expect(brushTool.redo()).toBeNull();
    });
  });

  describe('strokeToSvgPath', () => {
    it('should convert stroke to SVG path', () => {
      brushTool.startStroke(10, 20, 0.5);
      brushTool.addPoint(20, 30, 0.6);
      brushTool.addPoint(30, 40, 0.7);
      const stroke = brushTool.endStroke();
      
      const pathData = brushTool.strokeToSvgPath(stroke!);
      expect(pathData).toContain('M');
      expect(pathData).toContain('L');
    });

    it('should return empty string for invalid stroke', () => {
      const invalidStroke = {
        id: 'test',
        points: [{ x: 10, y: 20, pressure: 0.5, timestamp: Date.now() }],
        minWidth: 2,
        maxWidth: 20,
        color: '#ff9800',
        opacity: 1.0,
        startTime: Date.now(),
        endTime: Date.now(),
      };
      
      const pathData = brushTool.strokeToSvgPath(invalidStroke);
      expect(pathData).toBe('');
    });
  });

  describe('getStrokeWidth', () => {
    it('should calculate width from pressure', () => {
      const width1 = brushTool.getStrokeWidth(0.0); // Min pressure
      const width2 = brushTool.getStrokeWidth(1.0); // Max pressure
      
      expect(width1).toBe(2); // minWidth
      expect(width2).toBe(20); // maxWidth
    });

    it('should interpolate width for middle pressure', () => {
      const width = brushTool.getStrokeWidth(0.5);
      expect(width).toBeGreaterThan(2);
      expect(width).toBeLessThan(20);
    });
  });

  describe('config', () => {
    it('should update configuration', () => {
      brushTool.updateConfig({ minWidth: 5, maxWidth: 30 });
      const config = brushTool.getConfig();
      
      expect(config.minWidth).toBe(5);
      expect(config.maxWidth).toBe(30);
    });

    it('should preserve existing config when updating', () => {
      const originalConfig = brushTool.getConfig();
      brushTool.updateConfig({ minWidth: 5 });
      const newConfig = brushTool.getConfig();
      
      expect(newConfig.minWidth).toBe(5);
      expect(newConfig.maxWidth).toBe(originalConfig.maxWidth);
    });
  });

  describe('clear', () => {
    it('should clear all strokes and history', () => {
      brushTool.startStroke(10, 20);
      brushTool.addPoint(20, 30);
      brushTool.endStroke();
      
      brushTool.clear();
      
      expect(brushTool.getStrokes().length).toBe(0);
      expect(brushTool.getCurrentStroke().length).toBe(0);
    });
  });
});



