/**
 * Surface Score Audit Script
 * Analyzes features and determines appropriate UI surface type based on surface score formula
 * 
 * Usage: Run this script to audit all features and generate recommendations
 * 
 * #hashtag: surface-score audit script
 */

interface FeatureAnalysis {
  featureId: string;
  featureName: string;
  numberOfOptions: number;
  frequencyOfUse: 'rare' | 'occasional' | 'frequent';
  needForPersistence: boolean;
  crossesSystems: boolean;
  userComplexity: 'simple' | 'moderate' | 'complex';
  calculatedScore: number;
  recommendedSurface: 'Dockable Panel' | 'Palette' | 'Tab' | 'Modal / Command Palette';
}

interface SurfaceScoreFactors {
  numberOfOptions: number;
  frequencyOfUseScore: number; // 1-3
  needForPersistence: number; // 0 or 2
  complexityPenalty: number; // 0 or 2
  userComplexityPenalty: number; // 0, 1, or 2
}

/**
 * Calculate surface score for a feature
 */
function calculateSurfaceScore(factors: SurfaceScoreFactors): number {
  return (
    factors.numberOfOptions * 0.5 +
    factors.frequencyOfUseScore +
    factors.needForPersistence +
    factors.complexityPenalty +
    factors.userComplexityPenalty
  );
}

/**
 * Determine recommended surface type based on score
 */
function getRecommendedSurface(score: number): 'Dockable Panel' | 'Palette' | 'Tab' | 'Modal / Command Palette' {
  if (score >= 8) return 'Dockable Panel';
  if (score >= 5) return 'Palette';
  if (score >= 2) return 'Tab';
  return 'Modal / Command Palette';
}

/**
 * Analyze a feature and return surface recommendation
 */
function analyzeFeature(
  featureId: string,
  featureName: string,
  numberOfOptions: number,
  frequencyOfUse: 'rare' | 'occasional' | 'frequent',
  needForPersistence: boolean,
  crossesSystems: boolean,
  userComplexity: 'simple' | 'moderate' | 'complex'
): FeatureAnalysis {
  const frequencyScore = frequencyOfUse === 'frequent' ? 3 : frequencyOfUse === 'occasional' ? 2 : 1;
  const persistenceScore = needForPersistence ? 2 : 0;
  const complexityPenalty = crossesSystems ? 2 : 0;
  const userComplexityPenalty = userComplexity === 'complex' ? 2 : userComplexity === 'moderate' ? 1 : 0;

  const factors: SurfaceScoreFactors = {
    numberOfOptions,
    frequencyOfUseScore: frequencyScore,
    needForPersistence: persistenceScore,
    complexityPenalty,
    userComplexityPenalty,
  };

  const score = calculateSurfaceScore(factors);
  const recommendedSurface = getRecommendedSurface(score);

  return {
    featureId,
    featureName,
    numberOfOptions,
    frequencyOfUse,
    needForPersistence,
    crossesSystems,
    userComplexity,
    calculatedScore: score,
    recommendedSurface,
  };
}

/**
 * Predefined feature analyses based on VectorForge features
 */
const featureAnalyses: FeatureAnalysis[] = [
  // Tool Properties
  analyzeFeature(
    'tool-properties',
    'Tool Properties',
    15, // stroke, fill, opacity, etc.
    'frequent',
    true,
    false,
    'moderate'
  ),

  // Layers Panel
  analyzeFeature(
    'layers-panel',
    'Layers Panel',
    8, // visibility, lock, blend mode, etc.
    'frequent',
    true,
    false,
    'simple'
  ),

  // Inspector Panel
  analyzeFeature(
    'inspector-panel',
    'Inspector Panel',
    20, // many properties
    'frequent',
    true,
    true, // crosses object + properties systems
    'moderate'
  ),

  // Animation Timeline
  analyzeFeature(
    'animation-timeline',
    'Animation Timeline',
    12, // keyframes, frames, playback controls
    'occasional',
    true,
    true, // crosses animation + scripting
    'complex'
  ),

  // Scripts Panel
  analyzeFeature(
    'scripts-panel',
    'Scripts Panel',
    10, // script editor, variables, etc.
    'occasional',
    true,
    true, // crosses scripting + animation
    'complex'
  ),

  // Marketplace Publisher
  analyzeFeature(
    'marketplace-publisher',
    'Marketplace Publisher',
    8, // title, description, tags, etc.
    'rare',
    false,
    false,
    'moderate'
  ),

  // Color Palette
  analyzeFeature(
    'color-palette',
    'Color Palette',
    5, // color picker, swatches
    'frequent',
    false,
    false,
    'simple'
  ),

  // Project Wizard
  analyzeFeature(
    'project-wizard',
    'Project Wizard',
    6, // project type, name, features
    'rare',
    false,
    false,
    'simple'
  ),

  // Template Library
  analyzeFeature(
    'template-library',
    'Template Library',
    4, // search, filter, preview
    'occasional',
    false,
    false,
    'simple'
  ),

  // Action Center
  analyzeFeature(
    'action-center',
    'Action Center',
    3, // primary action, context
    'frequent',
    true,
    false,
    'simple'
  ),

  // Preferences
  analyzeFeature(
    'preferences',
    'Preferences',
    25, // many settings
    'rare',
    false,
    true, // crosses multiple systems
    'moderate'
  ),

  // Workspace Customizer
  analyzeFeature(
    'workspace-customizer',
    'Workspace Customizer',
    5, // layout name, description, panels
    'rare',
    false,
    false,
    'simple'
  ),
];

/**
 * Generate audit report
 */
function generateAuditReport(): string {
  const report: string[] = [];
  
  report.push('# Surface Score Audit Report');
  report.push(`Generated: ${new Date().toISOString()}`);
  report.push('');
  report.push('## Summary');
  report.push('');
  
  const bySurface = {
    'Dockable Panel': [] as FeatureAnalysis[],
    'Palette': [] as FeatureAnalysis[],
    'Tab': [] as FeatureAnalysis[],
    'Modal / Command Palette': [] as FeatureAnalysis[],
  };

  featureAnalyses.forEach(analysis => {
    bySurface[analysis.recommendedSurface].push(analysis);
  });

  Object.entries(bySurface).forEach(([surface, features]) => {
    report.push(`### ${surface} (${features.length} features)`);
    features.forEach(feature => {
      report.push(`- **${feature.featureName}** (Score: ${feature.calculatedScore.toFixed(1)})`);
      report.push(`  - Options: ${feature.numberOfOptions}, Frequency: ${feature.frequencyOfUse}, Persistence: ${feature.needForPersistence ? 'Yes' : 'No'}`);
    });
    report.push('');
  });

  report.push('## Detailed Analysis');
  report.push('');
  report.push('| Feature | Options | Frequency | Persistence | Crosses Systems | Complexity | Score | Recommended |');
  report.push('|---------|---------|-----------|-------------|------------------|------------|-------|-------------|');
  
  featureAnalyses.forEach(analysis => {
    report.push(
      `| ${analysis.featureName} | ${analysis.numberOfOptions} | ${analysis.frequencyOfUse} | ${analysis.needForPersistence ? 'Yes' : 'No'} | ${analysis.crossesSystems ? 'Yes' : 'No'} | ${analysis.userComplexity} | ${analysis.calculatedScore.toFixed(1)} | ${analysis.recommendedSurface} |`
    );
  });

  return report.join('\n');
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeFeature,
    calculateSurfaceScore,
    getRecommendedSurface,
    featureAnalyses,
    generateAuditReport,
  };
}

// If running in browser console
if (typeof window !== 'undefined') {
  (window as any).surfaceScoreAudit = {
    analyzeFeature,
    calculateSurfaceScore,
    getRecommendedSurface,
    featureAnalyses,
    generateAuditReport,
  };
}

// Auto-run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  console.log(generateAuditReport());
}

