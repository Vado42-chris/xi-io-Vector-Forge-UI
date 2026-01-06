/**
 * User Persona Definitions
 * Based on VectorForge user types and design specifications
 * Adapted from v61 backend testing patterns for front-end UX design
 */

export interface UserPersona {
  id: string;
  name: string;
  role: string;
  experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  goals: string[];
  painPoints: string[];
  workflows: string[];
  keyFeatures: string[];
}

export const personas: UserPersona[] = [
  {
    id: 'animator',
    name: 'Alex Animator',
    role: 'Motion Graphics Designer',
    experience: 'advanced',
    goals: [
      'Create smooth animations with keyframes',
      'Manage complex layer hierarchies',
      'Use timeline for precise control',
      'Export animations for web/video',
    ],
    painPoints: [
      'Timeline too small or hidden',
      "Can't see all layers at once",
      'Keyframe editing is cumbersome',
      'No onion skinning for smooth motion',
    ],
    workflows: [
      'Create layers → Add keyframes → Animate → Preview → Export',
      'Import assets → Organize in Library → Use in timeline → Animate',
    ],
    keyFeatures: ['Timeline', 'Layers', 'Keyframes', 'Library', 'Export'],
  },
  {
    id: 'designer',
    name: 'Sam Designer',
    role: 'Vector Illustrator',
    experience: 'intermediate',
    goals: [
      'Create clean vector graphics',
      'Use symbols for reusable components',
      'Organize assets in library',
      'Generate variations with AI',
    ],
    painPoints: [
      'No symbol system for reusability',
      'Library hard to find or use',
      'AI panel takes too much space',
      "Can't search assets easily",
    ],
    workflows: [
      'Design → Convert to Symbol → Add to Library → Reuse',
      'AI Generate → Refine → Save → Use in project',
    ],
    keyFeatures: ['Library', 'Symbols', 'AI Panel', 'Canvas', 'Tools'],
  },
  {
    id: 'developer',
    name: 'Dev Developer',
    role: 'Interactive Developer',
    experience: 'expert',
    goals: [
      'Add interactivity with hashtag system',
      'Script complex behaviors',
      'Use Actions panel efficiently',
      'Debug and test interactions',
    ],
    painPoints: [
      'Actions panel hard to find',
      'Hashtag system not prominent',
      'No code snippets or examples',
      "Can't test interactions easily",
    ],
    workflows: [
      'Design → Add Actions → Test → Debug → Deploy',
      'Import → Script → Validate → Export',
    ],
    keyFeatures: ['Actions Panel', 'Hashtag System', 'Scripts', 'Dev Chat'],
  },
  {
    id: 'beginner',
    name: 'New User',
    role: 'First-time User',
    experience: 'beginner',
    goals: [
      'Learn the interface',
      'Create first vector graphic',
      'Understand basic tools',
      'Get help when stuck',
    ],
    painPoints: [
      'Interface overwhelming',
      "Don't know where to start",
      'Too many options',
      'No clear guidance',
    ],
    workflows: [
      'Open app → See empty state → Follow prompt → Create',
      'Explore tools → Try AI generation → Learn features',
    ],
    keyFeatures: ['Empty States', 'Tooltips', 'AI Panel', 'Help', 'Canvas'],
  },
];

export function getPersonaById(id: string): UserPersona | undefined {
  return personas.find(p => p.id === id);
}

export function getPersonasByExperience(level: UserPersona['experience']): UserPersona[] {
  return personas.filter(p => p.experience === level);
}
