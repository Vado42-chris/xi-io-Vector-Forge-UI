/**
 * Activity Types
 * VS Code-inspired activity system
 * 
 * #hashtag: activity-system vs-code-inspired
 */

export enum Activity {
  DESIGN = 'design',    // Tools, Layers, Properties
  CODE = 'code',        // Scripts, Terminal, Console
  PREVIEW = 'preview',  // Preview, Export, Share
  SETTINGS = 'settings' // Preferences, Extensions
}

export interface ActivityConfig {
  id: Activity;
  icon: string;
  label: string;
  description?: string;
}

export const ACTIVITY_CONFIGS: Record<Activity, ActivityConfig> = {
  [Activity.DESIGN]: {
    id: Activity.DESIGN,
    icon: 'edit',
    label: 'Design',
    description: 'Vector editing and design tools',
  },
  [Activity.CODE]: {
    id: Activity.CODE,
    icon: 'code',
    label: 'Code',
    description: 'Scripts, terminal, and development tools',
  },
  [Activity.PREVIEW]: {
    id: Activity.PREVIEW,
    icon: 'preview',
    label: 'Preview',
    description: 'Preview and export your work',
  },
  [Activity.SETTINGS]: {
    id: Activity.SETTINGS,
    icon: 'settings',
    label: 'Settings',
    description: 'Preferences and configuration',
  },
};

