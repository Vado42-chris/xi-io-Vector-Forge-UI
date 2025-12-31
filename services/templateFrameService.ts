/**
 * Template Frame Service
 * Manages template frame registration, lookup, and rendering
 * 
 * Template frames are containers that components can attach to via `attachedToFrame` property.
 * This service provides the registry and lookup system for template frames.
 * 
 * #hashtag: templates template-frames frame-registry
 */

export interface TemplateFrame {
  id: string;
  name: string;
  containerId?: string; // DOM element ID where frame renders
  position?: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  zIndex?: number;
  visible: boolean;
  attachedComponents: string[]; // Component IDs attached to this frame
  metadata?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

class TemplateFrameService {
  private frames: Map<string, TemplateFrame> = new Map();
  private storageKey = 'vectorforge-template-frames';
  private initialized: boolean = false;

  constructor() {
    // Defer localStorage access to prevent blocking render
    if (typeof window !== 'undefined') {
      try {
        this.loadFrames();
        this.initialized = true;
      } catch (error) {
        console.error('TemplateFrameService: Failed to load frames, using defaults:', error);
        this.frames = new Map();
        this.initialized = true;
      }
    } else {
      this.initialized = true;
    }
  }

  /**
   * Register a new template frame
   */
  registerFrame(frame: Omit<TemplateFrame, 'createdAt' | 'updatedAt'>): TemplateFrame {
    const now = Date.now();
    const fullFrame: TemplateFrame = {
      ...frame,
      createdAt: now,
      updatedAt: now,
      attachedComponents: frame.attachedComponents || [],
      visible: frame.visible !== false,
    };

    this.frames.set(frame.id, fullFrame);
    this.saveFrames();
    return fullFrame;
  }

  /**
   * Get a frame by ID
   */
  getFrame(id: string): TemplateFrame | null {
    return this.frames.get(id) || null;
  }

  /**
   * Get all frames
   */
  getAllFrames(): TemplateFrame[] {
    return Array.from(this.frames.values());
  }

  /**
   * Get visible frames
   */
  getVisibleFrames(): TemplateFrame[] {
    return Array.from(this.frames.values()).filter(frame => frame.visible);
  }

  /**
   * Update a frame
   */
  updateFrame(id: string, updates: Partial<Omit<TemplateFrame, 'id' | 'createdAt'>>): TemplateFrame | null {
    const existing = this.frames.get(id);
    if (!existing) {
      return null;
    }

    const updated: TemplateFrame = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    };

    this.frames.set(id, updated);
    this.saveFrames();
    return updated;
  }

  /**
   * Delete a frame
   */
  deleteFrame(id: string): boolean {
    const deleted = this.frames.delete(id);
    if (deleted) {
      this.saveFrames();
    }
    return deleted;
  }

  /**
   * Attach a component to a frame
   */
  attachComponent(frameId: string, componentId: string): boolean {
    const frame = this.frames.get(frameId);
    if (!frame) {
      return false;
    }

    if (!frame.attachedComponents.includes(componentId)) {
      frame.attachedComponents.push(componentId);
      frame.updatedAt = Date.now();
      this.frames.set(frameId, frame);
      this.saveFrames();
    }
    return true;
  }

  /**
   * Detach a component from a frame
   */
  detachComponent(frameId: string, componentId: string): boolean {
    const frame = this.frames.get(frameId);
    if (!frame) {
      return false;
    }

    const index = frame.attachedComponents.indexOf(componentId);
    if (index !== -1) {
      frame.attachedComponents.splice(index, 1);
      frame.updatedAt = Date.now();
      this.frames.set(frameId, frame);
      this.saveFrames();
    }
    return true;
  }

  /**
   * Get components attached to a frame
   */
  getAttachedComponents(frameId: string): string[] {
    const frame = this.frames.get(frameId);
    return frame ? frame.attachedComponents : [];
  }

  /**
   * Check if a component is attached to a frame
   */
  isComponentAttached(frameId: string, componentId: string): boolean {
    const frame = this.frames.get(frameId);
    return frame ? frame.attachedComponents.includes(componentId) : false;
  }

  /**
   * Show a frame
   */
  showFrame(id: string): boolean {
    return this.updateFrame(id, { visible: true }) !== null;
  }

  /**
   * Hide a frame
   */
  hideFrame(id: string): boolean {
    return this.updateFrame(id, { visible: false }) !== null;
  }

  /**
   * Check if frame exists
   */
  frameExists(id: string): boolean {
    return this.frames.has(id);
  }

  /**
   * Load frames from storage
   */
  private loadFrames(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const frameArray = JSON.parse(stored) as TemplateFrame[];
        frameArray.forEach(frame => {
          this.frames.set(frame.id, frame);
        });
      }
    } catch (error) {
      console.error('Failed to load template frames:', error);
      this.frames = new Map();
    }
  }

  /**
   * Save frames to storage
   */
  private saveFrames(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      const frameArray = Array.from(this.frames.values());
      localStorage.setItem(this.storageKey, JSON.stringify(frameArray));
    } catch (error) {
      console.error('Failed to save template frames:', error);
    }
  }
}

export const templateFrameService = new TemplateFrameService();

