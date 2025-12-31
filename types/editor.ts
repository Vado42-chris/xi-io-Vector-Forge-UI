/**
 * Editor Types
 * Multi-file support inspired by VS Code
 * 
 * #hashtag: multi-file editor-groups vs-code-inspired
 */

export interface CanvasViewState {
  zoom: number;
  pan: { x: number; y: number };
  selectedLayerId: string | null;
  showRulers: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
}

export interface OpenFile {
  id: string;
  name: string;
  path: string;
  content: string; // SVG content
  layers: any[]; // VectorLayer[]
  modified: boolean;
  viewState: CanvasViewState;
  createdAt: number;
  modifiedAt: number;
}

export interface EditorGroup {
  id: string;
  files: OpenFile[];
  activeFileId: string;
  layout: 'horizontal' | 'vertical' | 'grid';
  splitDirection?: 'horizontal' | 'vertical';
}

export interface EditorState {
  groups: EditorGroup[];
  activeGroupId: string;
}

