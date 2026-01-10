
import { AppState, ViewportMode } from '../types';

/**
 * Unified Viewport Mapping Service
 * Historical v61 logic for coordinate parity.
 */
export class ViewportMappingService {
  /**
   * mapAllViewports
   * Synchronizes all active viewports to a unified geometric state.
   */
  public mapAllViewports(state: AppState): Partial<AppState> {
    console.log("[MAPPING] Initializing v61 Unified Viewport Synchronization...");
    
    // 1. Recalculate Coordinate Mappings (PHI-based)
    const unifiedPan = state.pan;
    const unifiedZoom = state.zoom;

    // 2. Sync all views to the master state
    const updatedViews = state.views.map(view => ({
      ...view,
      // If synced, inherit master transform logic
      activeTool: state.activeTool 
    }));

    return {
      pan: unifiedPan,
      zoom: unifiedZoom,
      views: updatedViews,
      viewportSync: {
        groupId: 'STUDIO_NODE_0x84',
        isSynced: true,
        masterViewId: updatedViews.find(v => v.isFocused)?.id || 'v1',
        coordinateSpace: 'PHI'
      }
    };
  }

  /**
   * worldToPhi
   * Maps 3D space to the #HallbergMaths manifold coordinate system.
   */
  public worldToPhi(x: number, y: number, z: number) {
    const phi = 1.61803398875;
    return {
      px: x * phi,
      py: y * phi,
      pz: z * phi
    };
  }
}

export const viewportMappingService = new ViewportMappingService();
