/**
 * Screen Quadrant Service
 * Manages the four canonical screen quadrants for consistent UI placement
 * 
 * #hashtag: quadrant service
 */

export type Quadrant = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface QuadrantConfig {
  id: Quadrant;
  name: string;
  description: string;
  defaultPanels: string[];
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface PanelQuadrantAssignment {
  panelId: string;
  quadrant: Quadrant;
  order: number;
}

class QuadrantService {
  private quadrantConfigs: Map<Quadrant, QuadrantConfig> = new Map();

  constructor() {
    this.initializeQuadrants();
  }

  /**
   * Initialize quadrant definitions
   */
  private initializeQuadrants(): void {
    const quadrants: QuadrantConfig[] = [
      {
        id: 'top-left',
        name: 'Toolbox & Palette',
        description: 'Primary tools and tool palettes',
        defaultPanels: ['tools', 'palettes'],
        bounds: {
          x: 0,
          y: 0,
          width: 0.5,
          height: 0.5,
        },
      },
      {
        id: 'top-right',
        name: 'Inspector & Properties',
        description: 'Object properties and inspector panels',
        defaultPanels: ['inspector', 'properties'],
        bounds: {
          x: 0.5,
          y: 0,
          width: 0.5,
          height: 0.5,
        },
      },
      {
        id: 'bottom-left',
        name: 'Project Navigator',
        description: 'File browser, layers, and project structure',
        defaultPanels: ['layers', 'file-browser', 'project-navigator'],
        bounds: {
          x: 0,
          y: 0.5,
          width: 0.5,
          height: 0.5,
        },
      },
      {
        id: 'bottom-right',
        name: 'Timeline & Action Center',
        description: 'Animation timeline, action center, and activity panels',
        defaultPanels: ['timeline', 'action-center', 'console'],
        bounds: {
          x: 0.5,
          y: 0.5,
          width: 0.5,
          height: 0.5,
        },
      },
    ];

    quadrants.forEach(quadrant => {
      this.quadrantConfigs.set(quadrant.id, quadrant);
    });
  }

  /**
   * Get quadrant configuration
   */
  getQuadrantConfig(quadrant: Quadrant): QuadrantConfig | undefined {
    return this.quadrantConfigs.get(quadrant);
  }

  /**
   * Get all quadrant configurations
   */
  getAllQuadrants(): QuadrantConfig[] {
    return Array.from(this.quadrantConfigs.values());
  }

  /**
   * Determine quadrant from screen coordinates
   */
  getQuadrantFromPosition(x: number, y: number): Quadrant {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    if (x < centerX && y < centerY) return 'top-left';
    if (x >= centerX && y < centerY) return 'top-right';
    if (x < centerX && y >= centerY) return 'bottom-left';
    return 'bottom-right';
  }

  /**
   * Get quadrant bounds in pixels
   */
  getQuadrantBounds(quadrant: Quadrant): { x: number; y: number; width: number; height: number } {
    const config = this.quadrantConfigs.get(quadrant);
    if (!config) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    return {
      x: config.bounds.x * window.innerWidth,
      y: config.bounds.y * window.innerHeight,
      width: config.bounds.width * window.innerWidth,
      height: config.bounds.height * window.innerHeight,
    };
  }

  /**
   * Get recommended quadrant for a panel type
   */
  getRecommendedQuadrant(panelType: string): Quadrant | null {
    for (const [quadrant, config] of this.quadrantConfigs.entries()) {
      if (config.defaultPanels.includes(panelType)) {
        return quadrant;
      }
    }
    return null;
  }

  /**
   * Check if position is within quadrant bounds
   */
  isPositionInQuadrant(x: number, y: number, quadrant: Quadrant): boolean {
    const bounds = this.getQuadrantBounds(quadrant);
    return (
      x >= bounds.x &&
      x < bounds.x + bounds.width &&
      y >= bounds.y &&
      y < bounds.y + bounds.height
    );
  }

  /**
   * Get panels assigned to a quadrant
   */
  getPanelsInQuadrant(quadrant: Quadrant, panelAssignments: PanelQuadrantAssignment[]): string[] {
    return panelAssignments
      .filter(assignment => assignment.quadrant === quadrant)
      .sort((a, b) => a.order - b.order)
      .map(assignment => assignment.panelId);
  }

  /**
   * Assign panel to quadrant
   */
  assignPanelToQuadrant(panelId: string, quadrant: Quadrant, order: number = 0): PanelQuadrantAssignment {
    return {
      panelId,
      quadrant,
      order,
    };
  }
}

export const quadrantService = new QuadrantService();

