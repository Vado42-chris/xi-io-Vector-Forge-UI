
import React, { useState, useCallback, useEffect } from 'react';
import { TabType, ToolType, DesignStyle, VectorLayer, VectorNode, AppState, AIProvider, Toast, AnimationKeyframe, FrameState, MeasurementUnit, ToolProperties } from './types';
import ProfessionalFileMenu from './components/ProfessionalFileMenu';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import ProfessionalLayersPanel from './components/ProfessionalLayersPanel';
import DraftsmanCanvas from './components/DraftsmanCanvas';
import AnimationTimeline from './components/AnimationTimeline';
import PowerUserToolbar from './components/PowerUserToolbar';
import Footer from './components/Footer';
import DockableToolPalette from './components/DockableToolPalette';
import { PalettePosition } from './components/PaletteDockingSystem';
import { CustomPalette, CustomPaletteRenderer, PaletteItem } from './components/CustomPaletteBuilder';
import { useWorkspaceLayout } from './hooks/useWorkspaceLayout';
import { generateVectorData, getSmartSuggestions } from './services/xibalbaService';
import { DEFAULT_ANIMATION_PRESETS } from './data/animationPresets';
import { importFromAnimationStudio, exportToAnimationStudio, downloadAnimation } from './services/animationStudio';
import ToolLockingSystem from './components/ToolLockingSystem';
import { workflowLayoutService } from './services/workflowLayoutService';
import type { WorkflowLayout } from './types/workflow';
import BugReporter from './components/BugReporter';
import FeatureRequest from './components/FeatureRequest';
import ActionCenter from './components/ActionCenter';
import SprintBoard from './components/SprintBoard';
import InspectorPanel from './components/InspectorPanel';
import { Task } from './types/task';
import { useContextualUI } from './hooks/useContextualUI';
import ContextualHelpPanel from './components/ContextualHelpPanel';
import PreferencesDialog from './components/PreferencesDialog';
import SubscriptionStatusIndicator from './components/SubscriptionStatusIndicator';
import AccountMenu from './components/AccountMenu';
import BillingPanel from './components/BillingPanel';
import UpgradePrompt from './components/UpgradePrompt';

const INITIAL_SVG = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect id="bg" width="100%" height="100%" fill="#0a0b0e"/>
  <g id="workspace_root">
    <path id="prime_path" d="M 156 156 L 356 156 L 356 356 L 156 356 Z" fill="#2a2d35" fill-opacity="0.3" stroke="#343842" stroke-width="2" />
  </g>
</svg>`;

const parseSvgPath = (d: string): VectorNode[] => {
  const commands = d.match(/[a-df-z][^a-df-z]*/ig) || [];
  return commands.map((cmd, i) => {
    const typeChar = cmd[0].toUpperCase();
    const args = cmd.slice(1).trim().split(/[\s,]+/).map(parseFloat);
    const id = `node_${i}_${Math.random().toString(36).substr(2, 4)}`;
    
    if (typeChar === 'M') return { id, type: 'move', x: args[0], y: args[1] };
    if (typeChar === 'L') return { id, type: 'line', x: args[0], y: args[1] };
    if (typeChar === 'C') return { id, type: 'cubic', cx1: args[0], cy1: args[1], cx2: args[2], cy2: args[3], x: args[4], y: args[5] };
    if (typeChar === 'Z') return { id, type: 'close', x: 0, y: 0 }; // simplified
    return { id, type: 'line', x: args[args.length-2], y: args[args.length-1] };
  });
};

const serializePath = (nodes: VectorNode[]): string => {
  return nodes.map(n => {
    if (n.type === 'move') return `M ${n.x} ${n.y}`;
    if (n.type === 'line') return `L ${n.x} ${n.y}`;
    if (n.type === 'cubic') return `C ${n.cx1} ${n.cy1} ${n.cx2} ${n.cy2} ${n.x} ${n.y}`;
    if (n.type === 'close') return `Z`;
    return '';
  }).join(' ');
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('vforge_xibalba_prime');
    const baseState: AppState = {
      activeTab: 'text',
      activeTool: 'select',
      prompt: '',
      isGenerating: false,
      style: DesignStyle.ABSTRACT,
      complexity: 92,
      credits: 25000,
      layers: [],
      selectedLayerId: null,
      selectedNodeId: null,
      zoom: 100,
      pan: { x: 0, y: 0 },
      currentSvg: INITIAL_SVG,
      history: [INITIAL_SVG],
      redoHistory: [],
      snapshots: [],
      chatHistory: [{ role: 'system', content: 'Xibalba OS Kernel 2.0. Geometrical Logic Active.', timestamp: Date.now() }],
      terminalLogs: [{ id: '1', type: 'info', text: 'XI_OS: Core initialized. Rulers locked to Forge.', timestamp: Date.now() }],
      terminalHistory: [],
      mcpServers: [],
      toasts: [],
      guides: [{ id: 'g1', type: 'v', pos: 256 }, { id: 'g2', type: 'h', pos: 256 }],
      showRulers: true,
      engineConfig: { provider: AIProvider.GEMINI_PRO, apiKey: '', thinkingBudget: 32768 }
    };
    return saved ? { ...baseState, ...JSON.parse(saved), isGenerating: false, toasts: [] } : baseState;
  });

  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  
  // Task Management State
  const [activeView, setActiveView] = useState<'vectorforge' | 'tasks'>('vectorforge');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeSprintId, setActiveSprintId] = useState<string | undefined>(undefined);
  
  // Contextual UI - intelligent UI surfacing based on MAI framework
  const contextualUI = useContextualUI({
    activeTool: state.activeTool,
    selectedObjectId: state.selectedLayerId,
    activeWorkflow: activeView,
    hasError: toasts.some(t => t.type === 'error'),
    isFirstTimeUser: false, // TODO: Get from user profile
    userSkillLevel: 'intermediate', // TODO: Get from user profile
    currentAction: state.isGenerating ? 'generating' : undefined,
  });
  
  // Update contextual UI when state changes
  useEffect(() => {
    contextualUI.updateContext({
      activeTool: state.activeTool,
      selectedObjectId: state.selectedLayerId,
      activeWorkflow: activeView,
      hasError: toasts.some(t => t.type === 'error'),
      currentAction: state.isGenerating ? 'generating' : undefined,
    });
  }, [state.activeTool, state.selectedLayerId, activeView, toasts, state.isGenerating, contextualUI]);
  
  // Animation State
  const [keyframes, setKeyframes] = useState<AnimationKeyframe[]>([]);
  const [frameState, setFrameState] = useState<FrameState>({
    currentFrame: 0,
    totalFrames: 300, // 10 seconds at 30fps
    fps: 30,
    isPlaying: false,
    isLooping: false
  });

  // Animation Playback with Script Execution
  useEffect(() => {
    if (!frameState.isPlaying) return;

    const interval = setInterval(async () => {
      setFrameState(prev => {
        let nextFrame = prev.currentFrame + 1;
        if (nextFrame >= prev.totalFrames) {
          if (prev.isLooping) {
            nextFrame = 0;
          } else {
            return { ...prev, isPlaying: false, currentFrame: prev.totalFrames - 1 };
          }
        }
        
        // Execute scripts for this frame
        const frameKeyframes = keyframes.filter(kf => kf.frame === nextFrame && kf.script);
        if (frameKeyframes.length > 0) {
          frameKeyframes.forEach(async (kf) => {
            if (kf.script) {
              import('./services/scriptExecutor').then(({ executeScript, ExecutionContext }) => {
                const context: ExecutionContext = {
                  frame: nextFrame,
                  layers: state.layers,
                  variables: {},
                  eventHandlers: new Map(),
                  pendingEvents: []
                };
                
                executeScript(kf.script, context).then(result => {
                  if (result.success && result.updatedLayers) {
                    updateSvgFromLayers(result.updatedLayers);
                    setState(p => ({ ...p, layers: result.updatedLayers! }));
                  }
                });
              });
            }
          });
        }
        
        return { ...prev, currentFrame: nextFrame };
      });
    }, 1000 / frameState.fps);

    return () => clearInterval(interval);
  }, [frameState.isPlaying, frameState.fps, frameState.totalFrames, frameState.isLooping, keyframes, state.layers]);
  
  // Power User Settings
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [snapToGuides, setSnapToGuides] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [showOnionSkin, setShowOnionSkin] = useState(false);
  const [onionSkinFrames, setOnionSkinFrames] = useState(2);
  const [measurementUnit, setMeasurementUnit] = useState<MeasurementUnit>('px');
  const [toolProperties, setToolProperties] = useState<ToolProperties>({});
  
  // Tool palette position - docked to left by default
  const [toolPalettePosition, setToolPalettePosition] = useState<PalettePosition>({
    zone: 'left',
    x: 0,
    y: 56, // Below header
    width: 200,
    height: window.innerHeight - 56 - 48, // Full height minus header and footer
    order: 0
  });

  // Custom palettes - user-created palettes
  const [customPalettes, setCustomPalettes] = useState<CustomPalette[]>([]);

  // Workspace layout management
  const workspaceLayout = useWorkspaceLayout();
  
  // Workflow Layout State
  const [currentLayout, setCurrentLayout] = useState<WorkflowLayout | null>(null);
  const [availableLayouts, setAvailableLayouts] = useState<WorkflowLayout[]>([]);
  
  // Bug Reporter State
  const [showBugReporter, setShowBugReporter] = useState(false);
  const [showFeatureRequest, setShowFeatureRequest] = useState(false);
  
  // Preferences Dialog State
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferencesCategory, setPreferencesCategory] = useState<'visual' | 'functional' | 'performance' | 'accessibility' | 'integrations'>('visual');
  
  // Subscription & Account State
  const [showBillingPanel, setShowBillingPanel] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<{ id: string; name: string; tier: string } | null>(null);
  
  // Initialize workflow layouts
  useEffect(() => {
    const initLayouts = async () => {
      await workflowLayoutService.initialize();
      const layouts = workflowLayoutService.getLayouts();
      setAvailableLayouts(layouts);
      
      const current = workflowLayoutService.getCurrentLayout();
      if (current) {
        setCurrentLayout(current);
      } else if (layouts.length > 0) {
        // Set default layout
        const defaultLayout = layouts.find(l => l.default) || layouts[0];
        workflowLayoutService.setCurrentLayout(defaultLayout.id);
        setCurrentLayout(defaultLayout);
      }
    };
    
    initLayouts();
  }, []);
  
  // Handle layout switch
  const handleLayoutSwitch = useCallback((layout: WorkflowLayout) => {
    setCurrentLayout(layout);
    showToast(`Switched to ${layout.name} layout`, 'success');
  }, [showToast]);

  // Available items for custom palettes - all tools and components
  const availablePaletteItems: PaletteItem[] = [
    // Tools
    { id: 'tool-select', type: 'tool', label: 'Selection Tool', icon: 'near_me', action: () => setState(p => ({...p, activeTool: 'select'})) },
    { id: 'tool-pen', type: 'tool', label: 'Pen Tool', icon: 'edit', action: () => setState(p => ({...p, activeTool: 'pen'})) },
    { id: 'tool-rectangle', type: 'tool', label: 'Rectangle Tool', icon: 'crop_square', action: () => setState(p => ({...p, activeTool: 'rectangle'})) },
    { id: 'tool-ellipse', type: 'tool', label: 'Ellipse Tool', icon: 'radio_button_unchecked', action: () => setState(p => ({...p, activeTool: 'ellipse'})) },
    { id: 'tool-text', type: 'tool', label: 'Text Tool', icon: 'text_fields', action: () => setState(p => ({...p, activeTool: 'text'})) },
    // Components
    { id: 'component-layers', type: 'component', label: 'Layers Panel', icon: 'layers' },
    { id: 'component-properties', type: 'component', label: 'Properties Panel', icon: 'tune' },
    { id: 'component-scripts', type: 'component', label: 'Scripts Editor', icon: 'code' },
    { id: 'component-chat', type: 'component', label: 'AI Chat', icon: 'smart_toy' },
  ];

  const syncLayersFromSvg = useCallback((svg: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");
    const paths = Array.from(doc.querySelectorAll('path'));
    
    return paths.map(p => ({
      id: p.id,
      name: p.getAttribute('data-name') || p.id || 'Unnamed Path',
      visible: p.getAttribute('display') !== 'none',
      locked: p.getAttribute('data-locked') === 'true',
      color: p.getAttribute('fill') || '#ffffff',
      stroke: p.getAttribute('stroke') || '#000000',
      strokeWidth: parseFloat(p.getAttribute('stroke-width') || '0'),
      opacity: parseFloat(p.getAttribute('opacity') || '1'),
      shape: {
        type: 'path' as const,
        nodes: parseSvgPath(p.getAttribute('d') || '')
      }
    }));
  }, []);

  const updateSvgFromLayers = useCallback((layers: VectorLayer[]) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(state.currentSvg, "image/svg+xml");
    const workspaceRoot = doc.getElementById('workspace_root') || doc.querySelector('g') || doc.documentElement;
    
    // Get all existing layer IDs
    const existingIds = new Set(Array.from(doc.querySelectorAll('[id]')).map(el => el.id));
    
    layers.forEach(layer => {
      let el = doc.getElementById(layer.id);
      
      // Create element if it doesn't exist
      if (!el) {
        if (layer.shape.type === 'rect') {
          el = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
        } else if (layer.shape.type === 'path') {
          el = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
        } else if (layer.shape.type === 'text') {
          el = doc.createElementNS('http://www.w3.org/2000/svg', 'text');
        } else {
          el = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
        }
        el.setAttribute('id', layer.id);
        el.setAttribute('data-name', layer.name);
        workspaceRoot.appendChild(el);
      }
      
      // Update attributes based on shape type
      if (layer.shape.type === 'rect') {
        el.setAttribute('x', layer.shape.x.toString());
        el.setAttribute('y', layer.shape.y.toString());
        el.setAttribute('width', layer.shape.width.toString());
        el.setAttribute('height', layer.shape.height.toString());
        if (layer.shape.borderRadius) {
          el.setAttribute('rx', layer.shape.borderRadius.toString());
        }
        el.setAttribute('fill', layer.color);
        el.setAttribute('stroke', layer.stroke);
        el.setAttribute('stroke-width', layer.strokeWidth.toString());
        el.setAttribute('opacity', layer.opacity.toString());
        el.setAttribute('display', layer.visible ? 'inline' : 'none');
        el.setAttribute('data-locked', layer.locked.toString());
      } else if (layer.shape.type === 'path') {
        el.setAttribute('d', serializePath(layer.shape.nodes));
        el.setAttribute('fill', layer.color);
        el.setAttribute('stroke', layer.stroke);
        el.setAttribute('stroke-width', layer.strokeWidth.toString());
        el.setAttribute('opacity', layer.opacity.toString());
        el.setAttribute('display', layer.visible ? 'inline' : 'none');
        el.setAttribute('data-locked', layer.locked.toString());
      } else if (layer.shape.type === 'text') {
        el.setAttribute('x', layer.shape.x.toString());
        el.setAttribute('y', layer.shape.y.toString());
        el.textContent = layer.shape.content;
        el.setAttribute('fill', layer.color);
        el.setAttribute('stroke', layer.stroke);
        el.setAttribute('stroke-width', layer.strokeWidth.toString());
        el.setAttribute('opacity', layer.opacity.toString());
        el.setAttribute('display', layer.visible ? 'inline' : 'none');
        el.setAttribute('data-locked', layer.locked.toString());
      }
    });
    
    // Remove layers that no longer exist
    existingIds.forEach(id => {
      if (!layers.find(l => l.id === id) && id !== 'workspace_root' && id !== 'bg') {
        const elToRemove = doc.getElementById(id);
        if (elToRemove) elToRemove.remove();
      }
    });
    
    const newSvg = new XMLSerializer().serializeToString(doc);
    setState(p => ({ ...p, currentSvg: newSvg, layers }));
  }, [state.currentSvg, serializePath]);

  useEffect(() => {
    if (state.layers.length === 0) {
      const parsedLayers = syncLayersFromSvg(state.currentSvg);
      setState(p => ({ ...p, layers: parsedLayers }));
    }
  }, [state.currentSvg, syncLayersFromSvg]);

  useEffect(() => {
    localStorage.setItem('vforge_xibalba_prime', JSON.stringify(state));
  }, [state]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setState(prev => ({ ...prev, toasts: [...prev.toasts, { id, message, type }] }));
    setTimeout(() => { setState(prev => ({ ...prev, toasts: prev.toasts.filter(t => t.id !== id) })); }, 3000);
  }, []);

  const handleAction = useCallback(async (action: string) => {
    switch(action) {
      case 'FILE_NEW':
        if(confirm("Confirm workspace purge?")) {
          const freshSvg = INITIAL_SVG;
          const freshLayers = syncLayersFromSvg(freshSvg);
          setState(p => ({ 
            ...p, 
            currentSvg: freshSvg, 
            layers: freshLayers, 
            selectedLayerId: null, 
            selectedNodeId: null,
            history: [freshSvg],
            redoHistory: [],
            pan: { x: 0, y: 0 },
            zoom: 100
          }));
          updateSvgFromLayers(freshLayers);
          showToast("New file created", "success");
        }
        break;
      case 'FILE_SAVE':
        localStorage.setItem('vforge_xibalba_prime', JSON.stringify({ ...state, currentSvg: state.currentSvg, layers: state.layers }));
        showToast("Project saved", "success");
        break;
      case 'FILE_SAVE_AS':
        const blob = new Blob([JSON.stringify({ svg: state.currentSvg, layers: state.layers, state })], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `xi_vector_project_${Date.now()}.xibalba`; a.click();
        showToast("Project saved as", "success");
        break;
      case 'FILE_OPEN':
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xibalba,application/json';
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            try {
              const text = await file.text();
              const data = JSON.parse(text);
              
              // Validate and load project data
              if (data.svg && data.layers) {
                const loadedLayers = Array.isArray(data.layers) ? data.layers : [];
                const loadedSvg = data.svg;
                
                // Update SVG with loaded layers
                const parser = new DOMParser();
                const doc = parser.parseFromString(loadedSvg, "image/svg+xml");
                const workspaceRoot = doc.getElementById('workspace_root') || doc.querySelector('g');
                if (workspaceRoot) {
                  // Clear existing layers (except bg and workspace_root)
                  Array.from(workspaceRoot.children).forEach(child => {
                    const id = child.getAttribute('id');
                    if (id && id !== 'bg' && id !== 'workspace_root') {
                      child.remove();
                    }
                  });
                  
                  // Add loaded layers to SVG
                  loadedLayers.forEach((layer: VectorLayer) => {
                    let el = doc.getElementById(layer.id);
                    if (!el) {
                      if (layer.shape.type === 'rect') {
                        el = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
                      } else if (layer.shape.type === 'path') {
                        el = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                      } else {
                        el = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
                      }
                      el.setAttribute('id', layer.id);
                      workspaceRoot.appendChild(el);
                    }
                  });
                  
                  const finalSvg = new XMLSerializer().serializeToString(doc);
                  
                  setState(p => ({ 
                    ...p, 
                    currentSvg: finalSvg, 
                    layers: loadedLayers,
                    selectedLayerId: null,
                    history: [finalSvg],
                    redoHistory: [],
                    zoom: data.zoom || p.zoom,
                    pan: data.pan || p.pan
                  }));
                  
                  if (data.frameState) setFrameState(data.frameState);
                  if (data.keyframes) setKeyframes(data.keyframes);
                  
                  showToast("Project opened", "success");
                } else {
                  showToast("Invalid project file", "error");
                }
              } else {
                showToast("Invalid project file format", "error");
              }
            } catch (error) {
              console.error('File open error:', error);
              showToast("Failed to open project", "error");
            }
          }
        };
        input.click();
        break;
      case 'FILE_EXPORT':
        const exportBlob = new Blob([state.currentSvg], { type: 'image/svg+xml' });
        const exportUrl = URL.createObjectURL(exportBlob);
        const exportA = document.createElement('a');
        exportA.href = exportUrl; exportA.download = `xi_vector_${Date.now()}.svg`; exportA.click();
        showToast("SVG Exported", "success");
        break;
      case 'EDIT_PREFERENCES':
        setShowPreferences(true);
        setPreferencesCategory('visual');
        break;
      case 'EDIT_UNDO':
        if (state.history.length > 1) {
          const prevSvg = state.history[state.history.length - 2];
          const newHistory = [...state.history];
          newHistory.pop();
          setState(p => ({ 
            ...p, 
            currentSvg: prevSvg, 
            layers: syncLayersFromSvg(prevSvg),
            history: newHistory,
            redoHistory: [...p.redoHistory, p.currentSvg]
          }));
          showToast("Undone", "success");
        }
        break;
      case 'EDIT_REDO':
        if (state.redoHistory.length > 0) {
          const nextSvg = state.redoHistory[state.redoHistory.length - 1];
          const newRedoHistory = [...state.redoHistory];
          newRedoHistory.pop();
          setState(p => ({ 
            ...p, 
            currentSvg: nextSvg, 
            layers: syncLayersFromSvg(nextSvg),
            history: [...p.history, nextSvg],
            redoHistory: newRedoHistory
          }));
          showToast("Redone", "success");
        }
        break;
      case 'OBJECT_GROUP':
        if (state.selectedLayerId) {
          const selectedLayers = state.layers.filter(l => l.id === state.selectedLayerId);
          if (selectedLayers.length > 0) {
            const groupLayer: VectorLayer = {
              id: `group_${Date.now()}`,
              name: `Group ${state.layers.length + 1}`,
              visible: true,
              locked: false,
              color: '#ffffff',
              stroke: '#000000',
              strokeWidth: 1,
              opacity: 1,
              blendMode: 'normal',
              shape: { type: 'path', nodes: [] },
              children: selectedLayers
            };
            const newLayers = [
              ...state.layers.filter(l => l.id !== state.selectedLayerId),
              groupLayer
            ];
            updateSvgFromLayers(newLayers);
            setState(p => ({ ...p, layers: newLayers, selectedLayerId: groupLayer.id }));
            showToast("Layers grouped", "success");
          }
        }
        break;
      case 'OBJECT_UNGROUP':
        if (state.selectedLayerId) {
          const groupLayer = state.layers.find(l => l.id === state.selectedLayerId);
          if (groupLayer && groupLayer.children && groupLayer.children.length > 0) {
            const newLayers = [
              ...state.layers.filter(l => l.id !== state.selectedLayerId),
              ...groupLayer.children
            ];
            updateSvgFromLayers(newLayers);
            setState(p => ({ ...p, layers: newLayers }));
            showToast("Layers ungrouped", "success");
          }
        }
        break;
      case 'AI_SIMPLIFY':
        if(!state.selectedLayerId) { showToast("Select a path to rig", "warning"); return; }
        setState(p => ({ ...p, isGenerating: true }));
        const res = await generateVectorData(`Mathematically optimize and rig the path ID "${state.selectedLayerId}". Add kinetic joints for animation.`, state.style, state.currentSvg);
        if(res) {
          setState(p => ({ ...p, currentSvg: res.svg, layers: syncLayersFromSvg(res.svg) }));
          showToast("Rigging Calibrated", "success");
        }
        setState(p => ({ ...p, isGenerating: false }));
        break;
      // Edit Menu Actions
      case 'EDIT_CUT':
        if (state.selectedLayerId) {
          const layer = state.layers.find(l => l.id === state.selectedLayerId);
          if (layer) {
            navigator.clipboard.writeText(JSON.stringify(layer));
            const newLayers = state.layers.filter(l => l.id !== state.selectedLayerId);
            updateSvgFromLayers(newLayers);
            setState(p => ({ ...p, layers: newLayers, selectedLayerId: null }));
            showToast("Cut to clipboard", "success");
          }
        }
        break;
      case 'EDIT_COPY':
        if (state.selectedLayerId) {
          const layer = state.layers.find(l => l.id === state.selectedLayerId);
          if (layer) {
            navigator.clipboard.writeText(JSON.stringify(layer));
            showToast("Copied to clipboard", "success");
          }
        }
        break;
      case 'EDIT_PASTE':
        try {
          const text = await navigator.clipboard.readText();
          const layer = JSON.parse(text);
          if (layer && layer.id) {
            const newLayer = { ...layer, id: `layer_${Date.now()}`, name: `${layer.name} Copy` };
            const newLayers = [...state.layers, newLayer];
            updateSvgFromLayers(newLayers);
            setState(p => ({ ...p, layers: newLayers, selectedLayerId: newLayer.id }));
            showToast("Pasted", "success");
          }
        } catch (e) {
          showToast("Nothing to paste", "warning");
        }
        break;
      case 'EDIT_CLEAR':
      case 'SELECT_DESELECT':
        setState(p => ({ ...p, selectedLayerId: null }));
        showToast("Deselected", "info");
        break;
      case 'SELECT_ALL':
        if (state.layers.length > 0) {
          setState(p => ({ ...p, selectedLayerId: state.layers[0].id }));
          showToast("Selected all", "info");
        }
        break;
      // View Menu Actions
      case 'VIEW_ZOOM_IN':
        setState(p => ({ ...p, zoom: Math.min(400, p.zoom + 25) }));
        break;
      case 'VIEW_ZOOM_OUT':
        setState(p => ({ ...p, zoom: Math.max(25, p.zoom - 25) }));
        break;
      case 'VIEW_FIT':
        setState(p => ({ ...p, zoom: 100, pan: { x: 0, y: 0 } }));
        break;
      case 'VIEW_ACTUAL':
        setState(p => ({ ...p, zoom: 100 }));
        break;
      case 'VIEW_SHOW_GRID':
        // Toggle grid via PowerUserToolbar state
        break;
      case 'VIEW_SHOW_GUIDES':
        // Toggle guides via PowerUserToolbar state
        break;
      // Object Menu Actions
      case 'OBJECT_LOCK':
        if (state.selectedLayerId) {
          const newLayers = state.layers.map(l => l.id === state.selectedLayerId ? { ...l, locked: true } : l);
          updateSvgFromLayers(newLayers);
          setState(p => ({ ...p, layers: newLayers }));
          showToast("Locked", "success");
        }
        break;
      case 'OBJECT_UNLOCK':
        const newLayers = state.layers.map(l => ({ ...l, locked: false }));
        updateSvgFromLayers(newLayers);
        setState(p => ({ ...p, layers: newLayers }));
        showToast("Unlocked all", "success");
        break;
      case 'OBJECT_HIDE':
        if (state.selectedLayerId) {
          const newLayers = state.layers.map(l => l.id === state.selectedLayerId ? { ...l, visible: false } : l);
          updateSvgFromLayers(newLayers);
          setState(p => ({ ...p, layers: newLayers }));
          showToast("Hidden", "success");
        }
        break;
      case 'OBJECT_SHOW':
        const visibleLayers = state.layers.map(l => ({ ...l, visible: true }));
        updateSvgFromLayers(visibleLayers);
        setState(p => ({ ...p, layers: visibleLayers }));
        showToast("Shown all", "success");
        break;
      // Path Operations
      case 'OBJECT_PATH_UNION':
      case 'EFFECT_PATHFINDER_UNION':
        if (state.layers.filter(l => state.selectedLayerId === l.id).length >= 2) {
          showToast("Union: Select 2+ objects", "info");
          // TODO: Implement boolean union
        }
        break;
      case 'OBJECT_PATH_INTERSECT':
      case 'EFFECT_PATHFINDER_INTERSECT':
        if (state.layers.filter(l => state.selectedLayerId === l.id).length >= 2) {
          showToast("Intersect: Select 2+ objects", "info");
          // TODO: Implement boolean intersect
        }
        break;
      case 'OBJECT_PATH_SUBTRACT':
      case 'EFFECT_PATHFINDER_SUBTRACT':
        if (state.layers.filter(l => state.selectedLayerId === l.id).length >= 2) {
          showToast("Subtract: Select 2+ objects", "info");
          // TODO: Implement boolean subtract
        }
        break;
      case 'OBJECT_PATH_EXCLUDE':
      case 'EFFECT_PATHFINDER_EXCLUDE':
        if (state.layers.filter(l => state.selectedLayerId === l.id).length >= 2) {
          showToast("Exclude: Select 2+ objects", "info");
          // TODO: Implement boolean exclude
        }
        break;
      case 'OBJECT_EXPAND':
        if (state.selectedLayerId) {
          const layer = state.layers.find(l => l.id === state.selectedLayerId);
          if (layer && layer.shape.type === 'path') {
            // Convert stroke to fill
            showToast("Expand: Convert stroke to fill", "info");
            // TODO: Implement path expansion
          }
        }
        break;
      case 'OBJECT_EXPAND_APPEARANCE':
        if (state.selectedLayerId) {
          showToast("Expand Appearance: Flatten effects", "info");
          // TODO: Implement appearance expansion
        }
        break;
      case 'TYPE_CREATE_OUTLINES':
        if (state.selectedLayerId) {
          const layer = state.layers.find(l => l.id === state.selectedLayerId);
          if (layer && layer.shape.type === 'text') {
            showToast("Create Outlines: Convert text to paths", "info");
            // TODO: Implement text to outlines
          }
        }
        break;
      // Window Menu Actions
      case 'WINDOW_BUG_REPORTER':
        setShowBugReporter(true);
        break;
      case 'WINDOW_FEATURE_REQUEST':
        setShowFeatureRequest(true);
        break;
      default:
        // Don't show toast for unimplemented actions - just silently ignore
        break;
    }
  }, [state, syncLayersFromSvg, updateSvgFromLayers, showToast, generateVectorData]);

  const handleUpdateNode = (layerId: string, nodeId: string, delta: {x: number, y: number}) => {
    const newLayers = state.layers.map(l => {
      if (l.id !== layerId) return l;
      if (l.shape.type !== 'path') return l;
      return {
        ...l,
        shape: {
          ...l.shape,
          nodes: l.shape.nodes.map(n => n.id === nodeId ? { ...n, x: n.x + delta.x, y: n.y + delta.y } : n)
        }
      };
    });
    updateSvgFromLayers(newLayers);
  };

  // Spacebar panning state
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [previousTool, setPreviousTool] = useState<ToolType>('select');

  // Keyboard Shortcuts - Standard Photoshop/Illustrator shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Spacebar for temporary hand tool (panning)
      if (e.key === ' ' && !isInput) {
        e.preventDefault();
        if (!isSpacePressed) {
          setIsSpacePressed(true);
          setPreviousTool(state.activeTool);
          setState(p => ({ ...p, activeTool: 'pan' }));
        }
        return;
      }

      // Ctrl/Cmd combinations
      if (e.ctrlKey || e.metaKey) {
        if (isInput) return; // Don't override input shortcuts
        
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            handleAction('FILE_SAVE');
            break;
          case 'o':
            e.preventDefault();
            handleAction('FILE_OPEN');
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleAction('EDIT_REDO');
            } else {
              handleAction('EDIT_UNDO');
            }
            break;
          case 'g':
            e.preventDefault();
            if (e.shiftKey) {
              handleAction('OBJECT_UNGROUP');
            } else {
              handleAction('OBJECT_GROUP');
            }
            break;
          case 'n':
            e.preventDefault();
            handleAction('FILE_NEW');
            break;
          case 'd':
            e.preventDefault();
            setState(p => ({ ...p, selectedLayerId: null }));
            break;
          case 'a':
            e.preventDefault();
            // Select all layers
            break;
          case 'c':
            e.preventDefault();
            // Copy
            break;
          case 'v':
            e.preventDefault();
            // Paste
            break;
          case 'x':
            e.preventDefault();
            // Cut
            break;
          case '=':
          case '+':
            e.preventDefault();
            setState(p => ({ ...p, zoom: Math.min(400, p.zoom + 25) }));
            break;
          case '-':
            e.preventDefault();
            setState(p => ({ ...p, zoom: Math.max(25, p.zoom - 25) }));
            break;
          case '0':
            e.preventDefault();
            setState(p => ({ ...p, zoom: 100, pan: { x: 0, y: 0 } }));
            break;
          case ',':
            if (e.ctrlKey || e.metaKey) {
              e.preventDefault();
              setShowPreferences(true);
              setPreferencesCategory('visual');
            }
            break;
        }
        return;
      }

      // Tool shortcuts (only when not in input)
      if (!e.ctrlKey && !e.metaKey && !e.altKey && !isInput) {
        switch (e.key.toLowerCase()) {
          case 'v':
            setState(p => ({ ...p, activeTool: 'select' }));
            break;
          case 'a':
            setState(p => ({ ...p, activeTool: 'direct-select' }));
            break;
          case 'p':
            setState(p => ({ ...p, activeTool: 'pen' }));
            break;
          case 'b':
            setState(p => ({ ...p, activeTool: 'brush' }));
            break;
          case 't':
            setState(p => ({ ...p, activeTool: 'text' }));
            break;
          case 'm':
            setState(p => ({ ...p, activeTool: 'rectangle' }));
            break;
          case 'l':
            setState(p => ({ ...p, activeTool: 'ellipse' }));
            break;
          case 'h':
            setState(p => ({ ...p, activeTool: 'pan' }));
            break;
          case 'n':
            setState(p => ({ ...p, activeTool: 'pencil' }));
            break;
          case 'r':
            setState(p => ({ ...p, activeTool: 'rotate' }));
            break;
          case 's':
            setState(p => ({ ...p, activeTool: 'scale' }));
            break;
          case 'e':
            setState(p => ({ ...p, activeTool: 'eraser' }));
            break;
          case 'g':
            setState(p => ({ ...p, activeTool: 'gradient' }));
            break;
          case 'i':
            setState(p => ({ ...p, activeTool: 'eyedropper' }));
            break;
          case 'z':
            setState(p => ({ ...p, activeTool: 'zoom' }));
            break;
          case 'delete':
          case 'backspace':
            if (state.selectedLayerId) {
              const newLayers = state.layers.filter(l => l.id !== state.selectedLayerId);
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers, selectedLayerId: null }));
              showToast("Layer deleted", "success");
            }
            break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Release spacebar - restore previous tool
      if (e.key === ' ' && isSpacePressed) {
        setIsSpacePressed(false);
        setState(p => ({ ...p, activeTool: previousTool }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state, handleAction, updateSvgFromLayers, showToast, isSpacePressed, previousTool]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[var(--xibalba-grey-000)] text-[var(--xibalba-text-000)] antialiased">
      <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[200] pointer-events-none flex flex-col gap-2">
        {state.toasts.map(toast => (
          <div key={toast.id} className="px-5 py-3 border border-white/10 bg-[var(--xibalba-grey-050)]/90 backdrop-blur-xl text-xs font-black uppercase tracking-widest text-[var(--xibalba-accent)] shadow-2xl animate-in slide-in-from-top flex items-center gap-3">
             <span className="material-symbols-outlined text-[18px]">verified</span> {toast.message}
          </div>
        ))}
      </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'relative' }}>
          <ProfessionalFileMenu 
            onAction={(action) => handleAction(action)}
            onLayoutChange={handleLayoutSwitch}
          />
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SubscriptionStatusIndicator
              onAccountClick={() => setShowBillingPanel(true)}
              onUpgradeClick={() => {
                setUpgradeFeature({ id: 'general', name: 'Premium Features', tier: 'pro' });
                setShowUpgradePrompt(true);
              }}
            />
            <ActionCenter 
              userId="user-1" // TODO: Get from auth context
              onAction={(action) => {
                console.log('Action Center action:', action);
                // Handle action (e.g., navigate to task, open dialog)
              }}
            />
            <AccountMenu
              userId="user-1"
              userName="User"
              userEmail="user@example.com"
              onPreferencesClick={() => {
                setShowPreferences(true);
                setPreferencesCategory('visual');
              }}
              onBillingClick={() => setShowBillingPanel(true)}
              onUpgradeClick={() => {
                setUpgradeFeature({ id: 'general', name: 'Premium Features', tier: 'pro' });
                setShowUpgradePrompt(true);
              }}
              onSignOut={() => {
                if (confirm('Sign out?')) {
                  // TODO: Implement sign out
                  console.log('Sign out');
                }
              }}
            />
          </div>
        </div>
      
      {/* Tool Palette - Fixed position, docked to left by default, draggable */}
      {/* Wrapped in ToolLockingSystem for production-quality tool stability */}
      <ToolLockingSystem
        activeTool={state.activeTool}
        onToolChange={(t) => setState(p => ({...p, activeTool: t}))}
        lockConfig={{
          preventChange: true,
          showIndicator: true,
          requireConfirmation: false,
        }}
      >
        <DockableToolPalette
          activeTool={state.activeTool}
          setTool={(t) => setState(p => ({...p, activeTool: t}))}
          onSmartMagic={async () => {
            if(!state.selectedLayerId) { showToast("Select a topological node", "warning"); return; }
            setState(p => ({...p, isGenerating: true}));
            const suggestions = await getSmartSuggestions(state.currentSvg, state.selectedLayerId);
            setAiSuggestions(suggestions);
            setState(p => ({...p, isGenerating: false}));
          }}
          position={toolPalettePosition}
          onPositionChange={(pos) => {
            setToolPalettePosition(pos);
          }}
          zIndex={1000}
        />
      </ToolLockingSystem>
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main content area - adjusts margin for docked tool palette */}
        <div 
          className="flex-1 flex overflow-hidden"
          style={{
            marginLeft: toolPalettePosition.zone === 'left' ? `${toolPalettePosition.width || 200}px` : '0',
            transition: 'margin-left 0.2s ease'
          }}
        >
          <LeftSidebar 
          state={state} setState={setState}
          onGenerate={async () => {
             setState(p => ({ ...p, isGenerating: true }));
             const res = await generateVectorData(state.prompt, state.style);
             if (res) { setState(p => ({ ...p, currentSvg: res.svg, layers: syncLayersFromSvg(res.svg) })); showToast("Logic Synthesized", "success"); }
             setState(p => ({ ...p, isGenerating: false }));
          }}
          onRefine={async () => {
             setState(p => ({ ...p, isGenerating: true }));
             const res = await generateVectorData(state.prompt, state.style, state.currentSvg);
             if (res) { setState(p => ({ ...p, currentSvg: res.svg, layers: syncLayersFromSvg(res.svg) })); showToast("Refined Geometry", "success"); }
             setState(p => ({ ...p, isGenerating: false }));
          }}
          onTerminalCommand={(c) => setState(p => ({ ...p, terminalLogs: [...p.terminalLogs, {id:Date.now().toString(), type:'command', text:c, timestamp:Date.now()}]}))}
          onVisionScan={() => {}}
        />
        
        <main className="flex-1 flex flex-col bg-[var(--xibalba-grey-000)] relative overflow-hidden">
          {/* View Switcher */}
          <div className="flex items-center gap-2 p-2 border-b border-white/10 bg-[var(--xibalba-grey-050)]">
            <button
              onClick={() => setActiveView('vectorforge')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeView === 'vectorforge'
                  ? 'bg-[var(--xibalba-accent)] text-white'
                  : 'bg-transparent text-[var(--xibalba-text-200)] hover:text-[var(--xibalba-text-000)]'
              }`}
            >
              <span className="material-icons text-sm mr-2">edit</span>
              VectorForge
            </button>
            <button
              onClick={() => {
                setActiveView('tasks');
                clickTrackingService.trackClick('App', 'switch-to-tasks', 'view-switcher', {});
                workTrackingService.recordCalculation();
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeView === 'tasks'
                  ? 'bg-[var(--xibalba-accent)] text-white'
                  : 'bg-transparent text-[var(--xibalba-text-200)] hover:text-[var(--xibalba-text-000)]'
              }`}
            >
              <span className="material-icons text-sm mr-2">task</span>
              Tasks
            </button>
          </div>

          {activeView === 'tasks' ? (
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <SprintBoard
                  sprintId={activeSprintId}
                  onTaskSelect={(task) => {
                    setSelectedTask(task);
                    clickTrackingService.trackClick('App', 'select-task', task.id, { taskId: task.id });
                    workTrackingService.recordCalculation();
                  }}
                  onTaskMove={async (taskId, newStatus) => {
                    clickTrackingService.trackClick('App', 'move-task', taskId, { taskId, newStatus });
                    workTrackingService.recordCalculation();
                  }}
                  onTaskCreate={(column) => {
                    clickTrackingService.trackClick('App', 'create-task', column, { column });
                    workTrackingService.recordCalculation();
                    // TODO: Open task creation dialog
                  }}
                />
              </div>
              {selectedTask && (
                <div className="w-[360px] border-l border-white/10 bg-[var(--xibalba-grey-050)]">
                  <InspectorPanel
                    item={selectedTask}
                    onUpdate={async (updates) => {
                      clickTrackingService.trackClick('App', 'update-task', selectedTask.id, { updates });
                      workTrackingService.recordCalculation();
                      // TODO: Update task via service
                    }}
                    onLink={async (item, target) => {
                      clickTrackingService.trackClick('App', 'link-item', item.id, { targetId: target.id });
                      workTrackingService.recordCalculation();
                      // TODO: Implement linking
                    }}
                    onClose={() => {
                      setSelectedTask(null);
                      clickTrackingService.trackClick('App', 'close-inspector', 'inspector', {});
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <PowerUserToolbar
            snapToGrid={snapToGrid}
            onSnapToGridChange={setSnapToGrid}
            snapToGuides={snapToGuides}
            onSnapToGuidesChange={setSnapToGuides}
            showGuides={showGuides}
            onShowGuidesChange={setShowGuides}
            gridSize={gridSize}
            onGridSizeChange={setGridSize}
            showOnionSkin={showOnionSkin}
            onShowOnionSkinChange={setShowOnionSkin}
            onionSkinFrames={onionSkinFrames}
            onOnionSkinFramesChange={setOnionSkinFrames}
          />
          
          <DraftsmanCanvas 
            svgContent={state.currentSvg}
            layers={state.layers}
            activeTool={isSpacePressed ? 'pan' : state.activeTool}
            selectedLayerId={state.selectedLayerId}
            zoom={state.zoom}
            pan={state.pan}
            onPan={(p) => setState(prev => ({ ...prev, pan: p }))}
            onZoom={(z) => setState(prev => ({ ...prev, zoom: z }))}
            onSelectLayer={(id) => { setState(p => ({ ...p, selectedLayerId: id })); setAiSuggestions([]); }}
            onCreateLayer={(layer) => {
              const newLayers = [...state.layers, layer];
              updateSvgFromLayers(newLayers);
              // Add to history for undo/redo
              const newSvg = state.currentSvg; // updateSvgFromLayers updates this
              setState(p => ({ 
                ...p, 
                layers: newLayers, 
                selectedLayerId: layer.id,
                history: [...p.history, newSvg],
                redoHistory: [] // Clear redo when new action
              }));
            }}
            onUpdateLayer={(id, updates) => {
              const newLayers = state.layers.map(l => l.id === id ? { ...l, ...updates } : l);
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers }));
            }}
            frameState={frameState}
            keyframes={keyframes}
            onAddKeyframe={(kf) => setKeyframes(prev => [...prev, kf])}
            onUpdateKeyframe={(id, props) => setKeyframes(prev => prev.map(k => k.id === id ? { ...k, ...props } : k))}
            showGuides={showGuides}
            snapToGrid={snapToGrid}
            snapToGuides={snapToGuides}
            gridSize={gridSize}
            measurementUnit={measurementUnit}
            onUnitChange={setMeasurementUnit}
            toolProperties={toolProperties}
            isSpacebarDown={isSpacePressed}
          />

          {aiSuggestions.length > 0 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[650px] p-5 xi-card shadow-3xl z-[150] flex flex-col gap-5 animate-in slide-in-from-bottom-10 backdrop-blur-3xl">
              <div className="flex items-center justify-between">
                 <span className="text-[11px] font-black text-[var(--xibalba-accent)] tracking-[0.3em] uppercase flex items-center gap-3">
                   <span className="material-symbols-outlined text-sm">psychology</span> Logical Inferences
                 </span>
                 <button onClick={() => setAiSuggestions([])} className="material-symbols-outlined text-[var(--xibalba-text-300)] text-[20px] hover:text-[var(--xibalba-text-000)]">close</button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {aiSuggestions.map((s, i) => (
                  <button key={i} onClick={async () => {
                    setState(p => ({ ...p, isGenerating: true }));
                    const res = await generateVectorData(`Execution: ${s.action} - ${s.description}`, state.style, state.currentSvg);
                    if (res) { setState(p => ({ ...p, currentSvg: res.svg, layers: syncLayersFromSvg(res.svg) })); setAiSuggestions([]); showToast(`Logic Applied`, "success"); }
                    setState(p => ({ ...p, isGenerating: false }));
                  }} className="text-left p-4 xi-inset border border-white/5 hover:border-[var(--xibalba-accent)] transition-all group">
                    <span className="text-[10px] font-black text-[var(--xibalba-text-000)] uppercase block mb-2 group-hover:text-[var(--xibalba-accent)]">{s.action}</span>
                    <p className="text-[9px] text-[var(--xibalba-text-300)] leading-normal opacity-80">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
            </>
          )}
        </main>
        </div>

        <div className="xibalba-property-panel shrink-0 w-[360px] flex flex-col border-l border-white/10 bg-[var(--xibalba-grey-050)] relative z-20">
          <RightSidebar 
            layers={state.layers}
            selectedLayerId={state.selectedLayerId}
            activeTool={state.activeTool}
            toolProperties={toolProperties}
            onToolPropertiesChange={(props) => setToolProperties(prev => ({ ...prev, ...props }))}
            onSelectLayer={(id) => setState(p => ({ ...p, selectedLayerId: id }))}
            onUpdateProperty={(id, prop, val) => {
              const newLayers = state.layers.map(l => l.id === id ? { ...l, [prop]: val } : l);
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers }));
            }}
            onUpdateShapeProperty={(id, prop, val) => {
              const newLayers = state.layers.map(l => {
                if (l.id !== id || l.shape.type !== 'rect') return l;
                return {
                  ...l,
                  shape: { ...l.shape, [prop]: val }
                };
              });
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers }));
            }}
            onToggleVisibility={(id) => {
              const l = state.layers.find(x => x.id === id);
              if(l) {
                 const newLayers = state.layers.map(x => x.id === id ? { ...x, visible: !x.visible } : x);
                 updateSvgFromLayers(newLayers);
              }
            }}
            onDeleteLayer={(id) => {
              const newLayers = state.layers.filter(l => l.id !== id);
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, selectedLayerId: null }));
            }}
            onToggleLock={(id) => setState(p => ({ ...p, layers: p.layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l) }))}
            onRenameLayer={(id, name) => setState(p => ({ ...p, layers: p.layers.map(l => l.id === id ? { ...l, name } : l) }))}
            onDuplicateLayer={(id) => {
              const layer = state.layers.find(l => l.id === id);
              if (layer) {
                const newLayer = { ...layer, id: `${id}_copy_${Date.now()}`, name: `${layer.name} Copy` };
                const newLayers = [...state.layers, newLayer];
                updateSvgFromLayers(newLayers);
                setState(p => ({ ...p, layers: newLayers }));
              }
            }}
            onReorderLayer={(oldIndex, newIndex) => {
              const newLayers = [...state.layers];
              [newLayers[oldIndex], newLayers[newIndex]] = [newLayers[newIndex], newLayers[oldIndex]];
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers }));
            }}
            onUpdateLayer={(id, updates) => {
              const newLayers = state.layers.map(l => l.id === id ? { ...l, ...updates } : l);
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers }));
            }}
            onCreateLayer={() => {
              const newLayer: VectorLayer = {
                id: `layer_${Date.now()}`,
                name: `Layer ${state.layers.length + 1}`,
                visible: true,
                locked: false,
                color: '#ffffff',
                stroke: '#000000',
                strokeWidth: 1,
                opacity: 1,
                blendMode: 'normal',
                shape: { type: 'path', nodes: [] }
              };
              const newLayers = [...state.layers, newLayer];
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers, selectedLayerId: newLayer.id }));
            }}
            onCreateSublayer={(parentId) => {
              const parentLayer = state.layers.find(l => l.id === parentId);
              if (parentLayer) {
                const newLayer: VectorLayer = {
                  id: `layer_${Date.now()}`,
                  name: `Sublayer ${(parentLayer.children?.length || 0) + 1}`,
                  visible: true,
                  locked: false,
                  color: '#ffffff',
                  stroke: '#000000',
                  strokeWidth: 1,
                  opacity: 1,
                  blendMode: 'normal',
                  shape: { type: 'path', nodes: [] }
                };
                const newLayers = state.layers.map(l => 
                  l.id === parentId 
                    ? { ...l, children: [...(l.children || []), newLayer] }
                    : l
                );
                updateSvgFromLayers(newLayers);
                setState(p => ({ ...p, layers: newLayers, selectedLayerId: newLayer.id }));
              }
            }}
            onGroupLayers={(ids) => {
              const layersToGroup = state.layers.filter(l => ids.includes(l.id));
              if (layersToGroup.length < 2) return;
              
              const groupLayer: VectorLayer = {
                id: `group_${Date.now()}`,
                name: `Group ${state.layers.length + 1}`,
                visible: true,
                locked: false,
                color: '#ffffff',
                stroke: '#000000',
                strokeWidth: 1,
                opacity: 1,
                blendMode: 'normal',
                shape: { type: 'path', nodes: [] },
                children: layersToGroup
              };
              
              const newLayers = [
                ...state.layers.filter(l => !ids.includes(l.id)),
                groupLayer
              ];
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers, selectedLayerId: groupLayer.id }));
            }}
            onUngroupLayer={(id) => {
              const groupLayer = state.layers.find(l => l.id === id);
              if (!groupLayer || !groupLayer.children || groupLayer.children.length === 0) return;
              
              const newLayers = [
                ...state.layers.filter(l => l.id !== id),
                ...groupLayer.children
              ];
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers }));
            }}
            onCreateClippingMask={(layerId, maskId) => {
              const newLayers = state.layers.map(l => 
                l.id === layerId ? { ...l, mask: maskId } : l
              );
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers }));
            }}
            onReleaseClippingMask={(layerId) => {
              const newLayers = state.layers.map(l => 
                l.id === layerId ? { ...l, mask: undefined } : l
              );
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers }));
            }}
            onBringToFront={(id) => {
              const index = state.layers.findIndex(l => l.id === id);
              if (index === -1) return;
              const newLayers = [...state.layers];
              const [layer] = newLayers.splice(index, 1);
              newLayers.push(layer);
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers }));
            }}
            onSendToBack={(id) => {
              const index = state.layers.findIndex(l => l.id === id);
              if (index === -1) return;
              const newLayers = [...state.layers];
              const [layer] = newLayers.splice(index, 1);
              newLayers.unshift(layer);
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers }));
            }}
            onBringForward={(id) => {
              const index = state.layers.findIndex(l => l.id === id);
              if (index === -1 || index === state.layers.length - 1) return;
              const newLayers = [...state.layers];
              [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers }));
            }}
            onSendBackward={(id) => {
              const index = state.layers.findIndex(l => l.id === id);
              if (index === -1 || index === 0) return;
              const newLayers = [...state.layers];
              [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
              updateSvgFromLayers(newLayers);
              setState(p => ({ ...p, layers: newLayers }));
            }}
            onExpandAppearance={(id) => {
              const layer = state.layers.find(l => l.id === id);
              if (layer && layer.effects) {
                const newLayers = state.layers.map(l => 
                  l.id === id ? { ...l, effects: undefined } : l
                );
                updateSvgFromLayers(newLayers);
                setState(p => ({ ...p, layers: newLayers }));
                showToast("Appearance expanded", "success");
              }
            }}
            onCreateOutlines={(id) => {
              showToast("Create Outlines - Feature in development", "info");
            }}
            snapshots={state.snapshots}
            onRestoreSnapshot={(svg) => setState(p => ({ ...p, currentSvg: svg, layers: syncLayersFromSvg(svg) }))}
            keyframes={keyframes}
            frameState={frameState}
            onScriptChange={(frame, layerId, script) => {
              // Update or create keyframe with script
              const existingKeyframe = keyframes.find(
                kf => kf.frame === frame && (layerId ? kf.layerId === layerId : true)
              );
              
              if (existingKeyframe) {
                setKeyframes(keyframes.map(kf => 
                  kf.id === existingKeyframe.id 
                    ? { ...kf, script }
                    : kf
                ));
              } else if (layerId) {
                // Create new keyframe with script
                const newKeyframe: AnimationKeyframe = {
                  id: `kf_${Date.now()}`,
                  frame,
                  layerId,
                  properties: {},
                  script
                };
                setKeyframes([...keyframes, newKeyframe]);
              }
            }}
            onScriptExecute={async (script) => {
              // Execute script and update layers
              const { executeScript, ExecutionContext } = await import('./services/scriptExecutor');
              const context: ExecutionContext = {
                frame: frameState.currentFrame,
                layers: state.layers,
                variables: {},
                eventHandlers: new Map(),
                pendingEvents: []
              };
              
              const result = await executeScript(script, context);
              
              if (result.success && result.updatedLayers) {
                updateSvgFromLayers(result.updatedLayers);
                setState(p => ({ ...p, layers: result.updatedLayers! }));
              }
            }}
          />
        </div>
      </div>

      <AnimationTimeline
        frameState={frameState}
        onFrameStateChange={(updates) => setFrameState(prev => ({ ...prev, ...updates }))}
        keyframes={keyframes}
        onAddKeyframe={(kf) => setKeyframes(prev => [...prev, kf])}
        onUpdateKeyframe={(id, props) => setKeyframes(prev => prev.map(k => k.id === id ? { ...k, ...props } : k))}
        onDeleteKeyframe={(id) => setKeyframes(prev => prev.filter(k => k.id !== id))}
        selectedLayerId={state.selectedLayerId}
        layers={state.layers}
        presets={DEFAULT_ANIMATION_PRESETS}
        onApplyPreset={(preset, layerId) => {
          const startKeyframe: AnimationKeyframe = {
            id: `kf-${Date.now()}`,
            frame: frameState.currentFrame,
            layerId,
            properties: preset.properties,
            easing: preset.easing
          };
          const endKeyframe: AnimationKeyframe = {
            id: `kf-${Date.now() + 1}`,
            frame: frameState.currentFrame + preset.duration,
            layerId,
            properties: {},
            easing: preset.easing
          };
          setKeyframes(prev => [...prev, startKeyframe, endKeyframe]);
        }}
        onScriptClick={() => {
          // Switch to Scripts tab in RightSidebar
          if ((window as any).__switchToScriptsTab) {
            (window as any).__switchToScriptsTab();
          }
        }}
        onImportFromStudio={async () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.xibalba-animation.json,application/json';
          input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              try {
                const data = await importFromAnimationStudio(file);
                setKeyframes(data.keyframes);
                setFrameState(prev => ({ ...prev, ...data.frameState }));
                showToast('Animation imported successfully', 'success');
              } catch (error) {
                showToast('Failed to import animation', 'error');
              }
            }
          };
          input.click();
        }}
      />
      
      <Footer 
        nodeCount={state.layers.length} 
        fillInfo={state.selectedLayerId || 'WORKSPACE_ROOT'} 
        isRendering={state.isGenerating}
        renderProgress={state.isGenerating ? undefined : undefined} // TODO: Add actual progress tracking
      />

      {/* Bug Reporter Modal */}
      {showBugReporter && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
          <div className="w-[800px] h-[600px] bg-[var(--xibalba-grey-100)] border border-white/10 shadow-xl">
            <BugReporter
              onClose={() => setShowBugReporter(false)}
              onReportSubmitted={(bugId) => {
                showToast(`Bug report submitted: ${bugId}`, 'success');
              }}
            />
          </div>
        </div>
      )}

      {/* Feature Request Modal */}
      {showFeatureRequest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
          <div className="w-[800px] h-[600px] bg-[var(--xibalba-grey-100)] border border-white/10 shadow-xl">
            <FeatureRequest
              onClose={() => setShowFeatureRequest(false)}
              onRequestSubmitted={(requestId) => {
                showToast(`Feature request submitted: ${requestId}`, 'success');
              }}
            />
          </div>
        </div>
      )}

      {/* Preferences Dialog */}
      <PreferencesDialog
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        initialCategory={preferencesCategory}
      />

      {/* Billing Panel */}
      {showBillingPanel && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <BillingPanel
              onClose={() => setShowBillingPanel(false)}
              onUpgradeClick={() => {
                setShowBillingPanel(false);
                setUpgradeFeature({ id: 'general', name: 'Premium Features', tier: 'pro' });
                setShowUpgradePrompt(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Upgrade Prompt */}
      {showUpgradePrompt && upgradeFeature && (
        <UpgradePrompt
          featureId={upgradeFeature.id}
          featureName={upgradeFeature.name}
          requiredTier={upgradeFeature.tier as any}
          onUpgrade={async (tier) => {
            const { subscriptionService } = await import('./services/subscriptionService');
            await subscriptionService.upgradeToTier(tier);
            setShowUpgradePrompt(false);
            showToast(`Upgraded to ${tier} plan`, 'success');
          }}
          onDismiss={() => setShowUpgradePrompt(false)}
        />
      )}
    </div>
  );
};

export default App;
