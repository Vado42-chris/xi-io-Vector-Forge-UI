/**
 * ID Generator Utility
 * Generates unique IDs with collision detection
 * Patent: VF-UI-003
 * Server Timestamp: 1738000000000
 */

let idCounter = 0;
const usedIds = new Set<string>();

/**
 * Generate a unique ID with optional prefix
 * Uses timestamp + counter + random for uniqueness
 */
export function generateUniqueId(prefix: string = 'id'): string {
  const timestamp = Date.now();
  const counter = ++idCounter;
  const random = Math.random().toString(36).substr(2, 9);
  const id = `${prefix}_${timestamp}_${counter}_${random}`;
  
  // Collision detection (should never happen, but safety check)
  if (usedIds.has(id)) {
    // If collision, add more randomness
    return generateUniqueId(prefix);
  }
  
  usedIds.add(id);
  
  // Cleanup old IDs (keep last 10000)
  if (usedIds.size > 10000) {
    const idsArray = Array.from(usedIds);
    idsArray.slice(0, idsArray.length - 10000).forEach(oldId => usedIds.delete(oldId));
  }
  
  return id;
}

/**
 * Generate layer ID
 */
export function generateLayerId(): string {
  return generateUniqueId('layer');
}

/**
 * Generate sublayer ID
 */
export function generateSublayerId(): string {
  return generateUniqueId('sublayer');
}

/**
 * Generate group ID
 */
export function generateGroupId(): string {
  return generateUniqueId('group');
}

/**
 * Generate node ID
 */
export function generateNodeId(): string {
  return generateUniqueId('node');
}

/**
 * Generate keyframe ID
 */
export function generateKeyframeId(): string {
  return generateUniqueId('kf');
}

/**
 * Generate snapshot ID
 */
export function generateSnapshotId(): string {
  return generateUniqueId('snapshot');
}

/**
 * Validate ID format
 */
export function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length > 0 && /^[a-z]+_[0-9]+_[0-9]+_[a-z0-9]+$/i.test(id);
}

