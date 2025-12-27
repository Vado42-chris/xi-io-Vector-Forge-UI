// services/patentTrackingService.ts

/**
 * @module PatentTrackingService
 * @description
 * Tracks all patentable innovations and features in VectorForge.
 * All reports must include patent tracking data.
 * 
 * Date: December 27, 2025
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 */

export interface PatentableFeature {
  id: string;
  name: string;
  description: string;
  category: 'ui' | 'algorithm' | 'system' | 'integration' | 'workflow';
  patentStatus: 'identified' | 'documented' | 'filed' | 'pending' | 'granted' | 'rejected';
  dateIdentified: string; // ISO date string
  dateFiled?: string; // ISO date string
  patentNumber?: string;
  inventors: string[];
  relatedComponents: string[]; // Component IDs from product registry
  novelty: string; // What makes this patentable
  priorArt?: string; // Known prior art
  notes?: string;
}

const PATENT_STORAGE_KEY = 'vectorforge_patents';

export class PatentTrackingService {
  private patents: PatentableFeature[] = [];
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(PATENT_STORAGE_KEY);
      if (stored) {
        try {
          this.patents = JSON.parse(stored);
          console.log(`PatentTrackingService: Loaded ${this.patents.length} patentable features.`);
        } catch (error) {
          console.error('PatentTrackingService: Failed to parse stored patents:', error);
          this.patents = [];
        }
      }
    }
    this.initialized = true;
  }

  /**
   * Identifies a new patentable feature.
   * @param feature The patentable feature to track.
   */
  public identifyPatentableFeature(feature: Omit<PatentableFeature, 'id' | 'dateIdentified'>): PatentableFeature {
    if (!this.initialized) {
      console.warn('PatentTrackingService: Not initialized. Cannot identify feature.');
      throw new Error('PatentTrackingService not initialized.');
    }

    const newFeature: PatentableFeature = {
      id: `patent-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      dateIdentified: new Date().toISOString(),
      ...feature,
    };

    this.patents.push(newFeature);
    this.persistPatents();
    console.log(`PatentTrackingService: Identified patentable feature: ${newFeature.name}`);
    return newFeature;
  }

  /**
   * Updates the status of a patentable feature.
   * @param patentId The ID of the patentable feature.
   * @param updates Updates to apply.
   */
  public updatePatentStatus(patentId: string, updates: Partial<PatentableFeature>): PatentableFeature | undefined {
    const index = this.patents.findIndex(p => p.id === patentId);
    if (index === -1) {
      console.warn(`PatentTrackingService: Patent ${patentId} not found.`);
      return undefined;
    }

    this.patents[index] = {
      ...this.patents[index],
      ...updates,
    };
    this.persistPatents();
    return this.patents[index];
  }

  /**
   * Gets all patentable features, optionally filtered.
   * @param filters Optional filters.
   * @returns Array of patentable features.
   */
  public getPatents(filters?: {
    category?: PatentableFeature['category'];
    status?: PatentableFeature['patentStatus'];
  }): PatentableFeature[] {
    let filtered = [...this.patents];

    if (filters?.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters?.status) {
      filtered = filtered.filter(p => p.patentStatus === filters.status);
    }

    return filtered.sort((a, b) => 
      new Date(b.dateIdentified).getTime() - new Date(a.dateIdentified).getTime()
    );
  }

  /**
   * Gets a patentable feature by ID.
   * @param patentId The ID of the patentable feature.
   * @returns The patentable feature or undefined.
   */
  public getPatentById(patentId: string): PatentableFeature | undefined {
    return this.patents.find(p => p.id === patentId);
  }

  /**
   * Generates a patent report for inclusion in project reports.
   * @returns Formatted patent report string.
   */
  public generatePatentReport(): string {
    const allPatents = this.getPatents();
    const byStatus = allPatents.reduce((acc, patent) => {
      acc[patent.patentStatus] = (acc[patent.patentStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return `
=== PATENT TRACKING REPORT ===
Date: ${new Date().toISOString()}
Total Patentable Features: ${allPatents.length}

By Status:
${Object.entries(byStatus).map(([status, count]) => `  ${status}: ${count}`).join('\n')}

Recent Identifications:
${allPatents.slice(0, 10).map(p => `  - ${p.name} (${p.category}, ${p.patentStatus})`).join('\n')}

=== END PATENT REPORT ===
    `.trim();
  }

  private persistPatents(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(PATENT_STORAGE_KEY, JSON.stringify(this.patents));
      } catch (error) {
        console.error('PatentTrackingService: Failed to persist patents:', error);
      }
    }
  }
}

export const patentTrackingService = new PatentTrackingService();

