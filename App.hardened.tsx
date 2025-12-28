import React, { useState, useCallback, useEffect } from 'react';
import { AppState, ToolType, VectorLayer, VectorNode, ToolProperties } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import ProfessionalFileMenu from './components/ProfessionalFileMenu';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import ProfessionalLayersPanel from './components/ProfessionalLayersPanel';
import DraftsmanCanvas from './components/DraftsmanCanvas';
import PowerUserToolbar from './components/PowerUserToolbar';
import AnimationTimeline from './components/AnimationTimeline';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import WelcomeScreen from './components/WelcomeScreen';
import { clickTrackingService } from './services/clickTrackingService';
import { workflowLayoutService } from './services/workflowLayoutService';
import type { WorkflowLayout } from './types/workflow';
import { errorLogger } from './services/errorLogger';
import ErrorDashboard from './components/ErrorDashboard';

// Initial SVG with workspace root
const INITIAL_SVG = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect id="bg" width="100%" height="100%" fill="var(--xibalba-grey-000, #0a0b0e)"/>
  <g id="workspace_root">
    <path id="prime_path" d="M 156 156 L 356 156 L 356 356 L 156 356 Z" fill="var(--xibalba-grey-250, #2a2d35)" fill-opacity="0.3" stroke="var(--xibalba-grey-300, #343842)" stroke-width="2" />
  </g>
</svg>`;

// Parse SVG path to VectorNode array
// FIXED: Use enhanced SVG path parser with full command support
import { parseSvgPath, serializePath } from './utils/svgPathParser';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('vforge_xibalba_prime');
      const baseState: AppState = {
        activeTab: 'text',
        activeTool: 'select',
        prompt: '',
        isGenerating: false,
        style: 'abstract' as any,
        complexity: 92,
        credits: 25000,
        layers: [],
        selectedLayerId: null,
        selectedNodeId: null,
        zoom: 100,
        pan: { x: 0, y: 0 },
        currentSvg: '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="var(--xibalba-grey-000, #0a0b0e)"/></svg>',
        history: [],
        redoHistory: [],
        snapshots: [],
        chatHistory: [],
        terminalLogs: [],
        terminalHistory: [],
        mcpServers: [],
        toasts: [],
        guides: [],
        showRulers: true,
        engineConfig: { provider: 'gemini-pro' as any, apiKey: '', thinkingBudget: 32768 }
      };
      return saved ? { ...baseState, ...JSON.parse(saved), isGenerating: false, toasts: [] } : baseState;
    } catch (error) {
      console.error('Failed to load state:', error);
      // Return safe default state
      return {
        activeTab: 'text',
        activeTool: 'select',
        prompt: '',
        isGenerating: false,
        style: 'abstract' as any,
        complexity: 92,
        credits: 25000,
        layers: [],
        selectedLayerId: null,
        selectedNodeId: null,
        zoom: 100,
        pan: { x: 0, y: 0 },
        currentSvg: '<svg viewBox="0 0 512 512"></svg>',
        history: [],
        redoHistory: [],
        snapshots: [],
        chatHistory: [],
        terminalLogs: [],
        terminalHistory: [],
        mcpServers: [],
        toasts: [],
        guides: [],
        showRulers: true,
        engineConfig: { provider: 'gemini-pro' as any, apiKey: '', thinkingBudget: 32768 }
      };
    }
  });

  const [keyframes, setKeyframes] = useState<any[]>([]);
  const [frameState, setFrameState] = useState({ currentFrame: 0, totalFrames: 100, fps: 24, isPlaying: false, isLooping: false });
  
  // Canvas settings state
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [snapToGuides, setSnapToGuides] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [showOnionSkin, setShowOnionSkin] = useState(false);
  const [onionSkinFrames, setOnionSkinFrames] = useState(2);
  
  // Workflow layout state
  const [currentLayout, setCurrentLayout] = useState<WorkflowLayout | null>(null);
  const [panelVisibility, setPanelVisibility] = useState<Record<string, boolean>>({
    'left-sidebar': true,
    'right-sidebar': true,
    'toolbar': true,
    'canvas': true,
    'timeline': true,
  });

  // Initialize workflow layout service
  useEffect(() => {
    const initLayout = async () => {
      await workflowLayoutService.initialize();
      const layout = workflowLayoutService.getCurrentLayout();
      if (layout) {
        setCurrentLayout(layout);
        // Apply panel visibility from layout
        const visibility: Record<string, boolean> = {};
        layout.panels.forEach(panel => {
          visibility[panel.id] = panel.visible;
        });
        setPanelVisibility(visibility);
      }
    };
    initLayout();
  }, []);

  // Error dashboard state
  const [showErrorDashboard, setShowErrorDashboard] = useState(false);
  
  // Welcome screen state
  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('vforge_welcome_dismissed');
    }
    return false;
  });
  
  // Tool properties state - updates based on active tool
  const [toolProperties, setToolProperties] = useState<ToolProperties>(() => {
    const saved = localStorage.getItem('vforge_tool_properties');
    return saved ? JSON.parse(saved) : {
      strokeWidth: 1,
      opacity: 1,
      fill: 'var(--xibalba-text-000, #ffffff)',
      stroke: 'var(--xibalba-grey-000, #000000)',
      strokeDasharray: '',
      strokeLinecap: 'butt',
      strokeLinejoin: 'miter',
      fillRule: 'nonzero'
    };
  });

  // Update tool properties when tool changes
  useEffect(() => {
    const defaultProps: Record<ToolType, Partial<ToolProperties>> = {
      select: {},
      pen: { strokeWidth: 2, fill: 'none', stroke: 'var(--xibalba-text-000, #ffffff)' },
      rectangle: { strokeWidth: 1, fill: 'var(--xibalba-text-000, #ffffff)', stroke: 'var(--xibalba-grey-000, #000000)' },
      ellipse: { strokeWidth: 1, fill: 'var(--xibalba-text-000, #ffffff)', stroke: 'var(--xibalba-grey-000, #000000)' },
      text: { fill: 'var(--xibalba-text-000, #ffffff)', fontSize: 16, fontFamily: 'Inter' },
      pan: {},
      zoom: {}
    };
    
    const toolDefaults = defaultProps[state.activeTool] || {};
    setToolProperties(prev => ({ ...prev, ...toolDefaults }));
  }, [state.activeTool]);

  // Save tool properties to localStorage
  useEffect(() => {
    localStorage.setItem('vforge_tool_properties', JSON.stringify(toolProperties));
  }, [toolProperties]);

  // Handle tool properties changes
  const handleToolPropertiesChange = useCallback((properties: Partial<ToolProperties>) => {
    setToolProperties(prev => ({ ...prev, ...properties }));
  }, []);

  // Toast management
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const toast = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now()
    };
    setState(prev => ({ ...prev, toasts: [...prev.toasts, toast] }));
    setTimeout(() => {
      setState(prev => ({ ...prev, toasts: prev.toasts.filter(t => t.id !== toast.id) }));
    }, 3000);
  }, []);

  // Handle layout change - redefined after showToast is available
  const handleLayoutChange = useCallback((layout: WorkflowLayout) => {
    setCurrentLayout(layout);
    // Apply panel visibility from layout
    const visibility: Record<string, boolean> = {};
    layout.panels.forEach(panel => {
      visibility[panel.id] = panel.visible;
    });
    setPanelVisibility(visibility);
    showToast(`Switched to ${layout.name}`, 'success');
  }, [showToast]);

  // Sync layers from SVG
  const syncLayersFromSvg = useCallback((svg: string): VectorLayer[] => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, "image/svg+xml");
      const paths = Array.from(doc.querySelectorAll('path, rect, circle, ellipse, text'));
      
      return paths.map((p, idx) => ({
        id: p.id || `layer_${idx}`,
        name: p.getAttribute('data-name') || p.id || 'Unnamed Layer',
        visible: p.getAttribute('display') !== 'none',
        locked: p.getAttribute('data-locked') === 'true',
        color: p.getAttribute('fill') || 'var(--xibalba-text-000, #ffffff)',
        stroke: p.getAttribute('stroke') || 'var(--xibalba-grey-000, #000000)',
        strokeWidth: parseFloat(p.getAttribute('stroke-width') || '0'),
        opacity: parseFloat(p.getAttribute('opacity') || '1'),
        shape: p.tagName === 'rect' ? {
          type: 'rect' as const,
          x: parseFloat(p.getAttribute('x') || '0'),
          y: parseFloat(p.getAttribute('y') || '0'),
          width: parseFloat(p.getAttribute('width') || '0'),
          height: parseFloat(p.getAttribute('height') || '0'),
          borderRadius: parseFloat(p.getAttribute('rx') || '0')
        } : p.tagName === 'text' ? {
          type: 'text' as const,
          x: parseFloat(p.getAttribute('x') || '0'),
          y: parseFloat(p.getAttribute('y') || '0'),
          content: p.textContent || ''
        } : {
          type: 'path' as const,
          d: p.getAttribute('d') || '',
          nodes: parseSvgPath(p.getAttribute('d') || '')
        }
      }));
    } catch (error) {
      console.error('Failed to sync layers:', error);
      return [];
    }
  }, []);

  // Update SVG from layers - FIXED: Use current SVG from state, ensure sync, add validation
  const updateSvgFromLayers = useCallback((layers: VectorLayer[]) => {
    setState(prev => {
      try {
        // FIXED: Validate layers before processing
        if (!Array.isArray(layers)) {
          console.warn('updateSvgFromLayers: layers is not an array');
          return { ...prev, layers: prev.layers };
        }
        
        const parser = new DOMParser();
        const currentSvg = prev.currentSvg || INITIAL_SVG;
        const doc = parser.parseFromString(currentSvg, "image/svg+xml");
        
        // FIXED: Better workspace root handling
        let workspaceRoot = doc.getElementById('workspace_root');
        if (!workspaceRoot) {
          workspaceRoot = doc.querySelector('g[id="workspace_root"]');
        }
        if (!workspaceRoot) {
          workspaceRoot = doc.querySelector('g');
        }
        if (!workspaceRoot) {
          // Create workspace_root if it doesn't exist
          workspaceRoot = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
          workspaceRoot.setAttribute('id', 'workspace_root');
          const svgRoot = doc.documentElement;
          svgRoot.appendChild(workspaceRoot);
        }
        
        // Clear existing layers (except bg and workspace_root)
        Array.from(workspaceRoot.children).forEach(child => {
          const id = child.getAttribute('id');
          if (id && id !== 'bg' && id !== 'workspace_root' && id !== 'prime_path') {
            child.remove();
          }
        });
        
        // FIXED: Recursive function to add layers and children
        const addLayerToSvg = (layer: VectorLayer, parent: Element) => {
          if (!layer || !layer.id) return;
          
          let el = doc.getElementById(layer.id);
          if (!el) {
            // FIXED: Handle all shape types including ellipse
            if (layer.shape.type === 'rect') {
              el = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
            } else if (layer.shape.type === 'ellipse') {
              el = doc.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            } else if (layer.shape.type === 'text') {
              el = doc.createElementNS('http://www.w3.org/2000/svg', 'text');
            } else if (layer.shape.type === 'path') {
              el = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
            } else {
              // Fallback to path for unknown types
              el = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
            }
            el.setAttribute('id', layer.id);
            el.setAttribute('data-name', layer.name || 'Unnamed Layer');
            parent.appendChild(el);
          }
          
          // Update attributes based on shape type
          if (layer.shape.type === 'rect') {
            el.setAttribute('x', (layer.shape.x || 0).toString());
            el.setAttribute('y', (layer.shape.y || 0).toString());
            el.setAttribute('width', (layer.shape.width || 0).toString());
            el.setAttribute('height', (layer.shape.height || 0).toString());
            if (layer.shape.borderRadius) {
              el.setAttribute('rx', layer.shape.borderRadius.toString());
            }
          } else if (layer.shape.type === 'ellipse') {
            el.setAttribute('cx', (layer.shape.x || 0).toString());
            el.setAttribute('cy', (layer.shape.y || 0).toString());
            el.setAttribute('rx', (layer.shape.radiusX || 0).toString());
            el.setAttribute('ry', (layer.shape.radiusY || 0).toString());
          } else if (layer.shape.type === 'text') {
            el.setAttribute('x', (layer.shape.x || 0).toString());
            el.setAttribute('y', (layer.shape.y || 0).toString());
            el.textContent = layer.shape.content || '';
          } else if (layer.shape.type === 'path') {
            const pathData = layer.shape.d || (layer.shape.nodes && Array.isArray(layer.shape.nodes) ? serializePath(layer.shape.nodes) : '');
            if (pathData) {
              el.setAttribute('d', pathData);
            }
          }
          
          // Common attributes
          el.setAttribute('fill', layer.color || 'none');
          el.setAttribute('stroke', layer.stroke || 'none');
          el.setAttribute('stroke-width', (layer.strokeWidth || 0).toString());
          el.setAttribute('opacity', (layer.opacity !== undefined ? layer.opacity : 1).toString());
          el.setAttribute('display', layer.visible !== false ? 'inline' : 'none');
          el.setAttribute('data-locked', (layer.locked || false).toString());
          
          // FIXED: Add clipping mask if present
          if (layer.mask) {
            el.setAttribute('clip-path', `url(#clip-${layer.id})`);
          }
          
          // FIXED: Recursively add children
          if (layer.children && Array.isArray(layer.children) && layer.children.length > 0) {
            layer.children.forEach(child => {
              addLayerToSvg(child, el);
            });
          }
        };
        
        // Add all layers to SVG
        layers.forEach(layer => {
          addLayerToSvg(layer, workspaceRoot);
        });
        
        const newSvg = new XMLSerializer().serializeToString(doc);
        
        // FIXED: Ensure layers and SVG stay in sync
        return { ...prev, currentSvg: newSvg, layers };
      } catch (error) {
        console.error('Failed to update SVG:', error);
        // FIXED: Return layers even if SVG update fails to maintain state consistency
        return { ...prev, layers };
      }
    });
  }, []);

  // Handle actions from file menu - comprehensive implementation
  // FIXED: Integrated click tracking for all actions
  const handleAction = useCallback(async (action: string) => {
    try {
      // Track action click
      clickTrackingService.trackClick(
        'menu',
        action,
        action.replace(/_/g, ' '),
        'click',
        {
          activeTool: state.activeTool,
          selectedLayerId: state.selectedLayerId,
          layersCount: state.layers.length
        }
      );

      switch (action) {
        case 'FILE_NEW':
          if (confirm("Create new file? Current work will be lost.")) {
            // Start with completely empty layers - INITIAL_SVG only has background/structure
            setState(prev => ({
              ...prev,
              currentSvg: INITIAL_SVG,
              layers: [], // Empty - user will create layers by drawing
              selectedLayerId: null,
              history: [INITIAL_SVG],
              redoHistory: [],
              pan: { x: 0, y: 0 },
              zoom: 100
            }));
            showToast('New file created - Ready to draw!', 'success');
          }
          break;
        case 'FILE_SAVE':
          try {
            localStorage.setItem('vforge_xibalba_prime', JSON.stringify(state));
            showToast('File saved', 'success');
          } catch (error) {
            showToast('Failed to save file', 'error');
          }
          break;
        case 'FILE_SAVE_AS':
          try {
            const blob = new Blob([JSON.stringify({ svg: state.currentSvg, layers: state.layers, state })], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vectorforge_${Date.now()}.xibalba`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('File saved as', 'success');
          } catch (error) {
            showToast('Failed to save file', 'error');
          }
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
                if (data.svg && data.layers) {
                  const openData = {
                    ...data,
                    name: file.name,
                    timestamp: Date.now()
                  };
                  setState(prev => ({
                    ...prev,
                    currentSvg: data.svg,
                    layers: data.layers || [],
                    selectedLayerId: null,
                    zoom: data.zoom || prev.zoom,
                    pan: data.pan || prev.pan
                  }));
                  // Update recent files
                  const recentFiles = JSON.parse(localStorage.getItem('vforge_recent_files') || '[]');
                  recentFiles.unshift(openData);
                  const updatedRecent = recentFiles.slice(0, 10); // Keep last 10
                  localStorage.setItem('vforge_recent_files', JSON.stringify(updatedRecent));
                  showToast('File opened', 'success');
                } else {
                  showToast('Invalid file format', 'error');
                }
              } catch (error) {
                showToast('Failed to open file', 'error');
              }
            }
          };
          input.click();
          break;
        case 'FILE_EXPORT':
        case 'FILE_EXPORT_SVG':
          try {
            const blob = new Blob([state.currentSvg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vectorforge_${Date.now()}.svg`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('SVG exported', 'success');
          } catch (error) {
            showToast('Export failed', 'error');
          }
          break;
        case 'FILE_EXPORT_PNG':
          try {
            // Convert SVG to PNG using canvas
            const img = new Image();
            const svgBlob = new Blob([state.currentSvg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width || 1024;
              canvas.height = img.height || 1024;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                  if (blob) {
                    const pngUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = pngUrl;
                    a.download = `vectorforge_${Date.now()}.png`;
                    a.click();
                    URL.revokeObjectURL(pngUrl);
                    showToast('PNG exported', 'success');
                  }
                }, 'image/png');
              }
              URL.revokeObjectURL(url);
            };
            img.src = url;
          } catch (error) {
            showToast('PNG export failed', 'error');
          }
          break;
        case 'FILE_EXPORT_PDF':
          showToast('PDF export - Coming soon (requires PDF library)', 'info');
          break;
        case 'FILE_EXPORT_EPS':
          showToast('EPS export - Coming soon', 'info');
          break;
        case 'FILE_EXPORT_ANIMATION':
          showToast('Animation export - Coming soon (requires Animation Studio integration)', 'info');
          break;
        case 'FILE_SAVE_COPY':
          try {
            const blob = new Blob([JSON.stringify({ svg: state.currentSvg, layers: state.layers, state })], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vectorforge_copy_${Date.now()}.xibalba`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Copy saved', 'success');
          } catch (error) {
            showToast('Failed to save copy', 'error');
          }
          break;
        case 'FILE_REVERT':
          if (confirm("Revert to last saved version? All unsaved changes will be lost.")) {
            try {
              const saved = localStorage.getItem('vforge_xibalba_prime');
              if (saved) {
                const data = JSON.parse(saved);
                setState(prev => ({
                  ...prev,
                  currentSvg: data.currentSvg || INITIAL_SVG,
                  layers: data.layers || [],
                  selectedLayerId: null,
                  zoom: data.zoom || prev.zoom,
                  pan: data.pan || prev.pan
                }));
                showToast('Reverted to last saved version', 'success');
              } else {
                showToast('No saved version found', 'warning');
              }
            } catch (error) {
              showToast('Failed to revert', 'error');
            }
          }
          break;
        case 'FILE_CLOSE':
          if (confirm("Close current file? Unsaved changes will be lost.")) {
            setState(prev => ({
              ...prev,
              currentSvg: INITIAL_SVG,
              layers: [],
              selectedLayerId: null,
              history: [INITIAL_SVG],
              redoHistory: [],
              pan: { x: 0, y: 0 },
              zoom: 100
            }));
            showToast('File closed', 'success');
          }
          break;
        case 'FILE_PLACE':
          const placeInput = document.createElement('input');
          placeInput.type = 'file';
          placeInput.accept = 'image/*,.svg';
          placeInput.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              try {
                if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
                  const text = await file.text();
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(text, "image/svg+xml");
                  const svgElement = doc.querySelector('svg');
                  if (svgElement) {
                    const placedLayer: VectorLayer = {
                      id: `placed_${Date.now()}`,
                      name: file.name,
                      visible: true,
                      locked: false,
                      color: 'none',
                      stroke: 'none',
                      strokeWidth: 0,
                      opacity: 1,
                      blendMode: 'normal',
                      shape: { type: 'path', d: svgElement.getAttribute('viewBox') ? `M 0 0` : '', nodes: [] }
                    };
                    const newLayers = [...state.layers, placedLayer];
                    updateSvgFromLayers(newLayers);
                    setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: placedLayer.id }));
                    showToast('File placed', 'success');
                  }
                } else {
                  // For raster images, create image layer
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                      const placedLayer: VectorLayer = {
                        id: `placed_${Date.now()}`,
                        name: file.name,
                        visible: true,
                        locked: false,
                        color: 'none',
                        stroke: 'none',
                        strokeWidth: 0,
                        opacity: 1,
                        blendMode: 'normal',
                        shape: { type: 'path', d: `M 0 0 L ${img.width} 0 L ${img.width} ${img.height} Z`, nodes: [] }
                      };
                      const newLayers = [...state.layers, placedLayer];
                      updateSvgFromLayers(newLayers);
                      setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: placedLayer.id }));
                      showToast('Image placed', 'success');
                    };
                    img.src = e.target?.result as string;
                  };
                  reader.readAsDataURL(file);
                }
              } catch (error) {
                showToast('Failed to place file', 'error');
              }
            }
          };
          placeInput.click();
          break;
        case 'FILE_IMPORT':
          const importInput = document.createElement('input');
          importInput.type = 'file';
          importInput.accept = '.xibalba,application/json,.svg';
          importInput.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              try {
                if (file.name.endsWith('.xibalba') || file.type === 'application/json') {
                  const text = await file.text();
                  const data = JSON.parse(text);
                  if (data.layers && Array.isArray(data.layers)) {
                    const importedLayers = data.layers.map((l: VectorLayer) => ({
                      ...l,
                      id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                      name: `${l.name} (imported)`
                    }));
                    const newLayers = [...state.layers, ...importedLayers];
                    updateSvgFromLayers(newLayers);
                    setState(prev => ({ ...prev, layers: newLayers }));
                    showToast(`Imported ${importedLayers.length} layer(s)`, 'success');
                  } else {
                    showToast('Invalid import file', 'error');
                  }
                } else if (file.name.endsWith('.svg')) {
                  const text = await file.text();
                  const importedLayers = syncLayersFromSvg(text);
                  const newLayers = [...state.layers, ...importedLayers.map(l => ({
                    ...l,
                    id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: `${l.name} (imported)`
                  }))];
                  updateSvgFromLayers(newLayers);
                  setState(prev => ({ ...prev, layers: newLayers }));
                  showToast(`Imported ${importedLayers.length} layer(s)`, 'success');
                }
              } catch (error) {
                showToast('Failed to import file', 'error');
              }
            }
          };
          importInput.click();
          break;
        case 'FILE_EXIT':
          if (confirm("Exit VectorForge? Unsaved changes will be lost.")) {
            window.close();
          }
          break;
        case 'EDIT_UNDO':
          if (state.history.length > 1) {
            const prevSvg = state.history[state.history.length - 2];
            const newHistory = [...state.history];
            newHistory.pop();
            setState(prev => ({
              ...prev,
              currentSvg: prevSvg,
              layers: syncLayersFromSvg(prevSvg),
              history: newHistory,
              redoHistory: [...prev.redoHistory, prev.currentSvg]
            }));
            showToast('Undone', 'success');
          }
          break;
        case 'EDIT_REDO':
          if (state.redoHistory.length > 0) {
            const nextSvg = state.redoHistory[state.redoHistory.length - 1];
            const newRedoHistory = [...state.redoHistory];
            newRedoHistory.pop();
            setState(prev => ({
              ...prev,
              currentSvg: nextSvg,
              layers: syncLayersFromSvg(nextSvg),
              history: [...prev.history, nextSvg],
              redoHistory: newRedoHistory
            }));
            showToast('Redone', 'success');
          }
          break;
        case 'EDIT_CUT':
          if (state.selectedLayerId) {
            const layer = state.layers.find(l => l.id === state.selectedLayerId);
            if (layer) {
              navigator.clipboard.writeText(JSON.stringify(layer));
              const newLayers = state.layers.filter(l => l.id !== state.selectedLayerId);
              updateSvgFromLayers(newLayers);
              setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: null }));
              showToast('Cut to clipboard', 'success');
            }
          }
          break;
        case 'EDIT_COPY':
          if (state.selectedLayerId) {
            const layer = state.layers.find(l => l.id === state.selectedLayerId);
            if (layer) {
              navigator.clipboard.writeText(JSON.stringify(layer));
              showToast('Copied to clipboard', 'success');
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
              setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: newLayer.id }));
              showToast('Pasted', 'success');
            }
          } catch (e) {
            showToast('Nothing to paste', 'warning');
          }
          break;
        case 'SELECT_ALL':
          if (state.layers.length > 0) {
            setState(prev => ({ ...prev, selectedLayerId: state.layers[0].id }));
            showToast('Selected', 'info');
          }
          break;
        case 'SELECT_DESELECT':
        case 'EDIT_CLEAR':
          setState(prev => ({ ...prev, selectedLayerId: null }));
          showToast('Deselected', 'info');
          break;
        case 'VIEW_ZOOM_IN':
          setState(prev => ({ ...prev, zoom: Math.min(500, prev.zoom + 25) }));
          break;
        case 'VIEW_ZOOM_OUT':
          setState(prev => ({ ...prev, zoom: Math.max(10, prev.zoom - 25) }));
          break;
        case 'VIEW_FIT':
          setState(prev => ({ ...prev, zoom: 100, pan: { x: 0, y: 0 } }));
          showToast('Fit to window', 'info');
          break;
        case 'VIEW_ACTUAL':
          setState(prev => ({ ...prev, zoom: 100 }));
          showToast('Actual size', 'info');
          break;
        case 'VIEW_SHOW_RULERS':
          setState(prev => ({ ...prev, showRulers: !prev.showRulers }));
          showToast(state.showRulers ? 'Rulers hidden' : 'Rulers shown', 'info');
          break;
        case 'VIEW_ERROR_DASHBOARD':
          setShowErrorDashboard(true);
          break;
        case 'OBJECT_GROUP':
          if (state.selectedLayerId) {
            const selectedLayer = state.layers.find(l => l.id === state.selectedLayerId);
            if (selectedLayer) {
              const groupLayer: VectorLayer = {
                id: `group_${Date.now()}`,
                name: `Group`,
                visible: true,
                locked: false,
                color: selectedLayer.color,
                stroke: selectedLayer.stroke,
                strokeWidth: selectedLayer.strokeWidth,
                opacity: selectedLayer.opacity,
                shape: { type: 'path', d: '', nodes: [] },
                children: [selectedLayer]
              };
              const newLayers = [
                ...state.layers.filter(l => l.id !== state.selectedLayerId),
                groupLayer
              ];
              updateSvgFromLayers(newLayers);
              setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: groupLayer.id }));
              showToast('Grouped', 'success');
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
              setState(prev => ({ ...prev, layers: newLayers }));
              showToast('Ungrouped', 'success');
            }
          }
          break;
        case 'OBJECT_LOCK':
          if (state.selectedLayerId) {
            const newLayers = state.layers.map(l => 
              l.id === state.selectedLayerId ? { ...l, locked: true } : l
            );
            updateSvgFromLayers(newLayers);
            setState(prev => ({ ...prev, layers: newLayers }));
            showToast('Locked', 'success');
          }
          break;
        case 'OBJECT_UNLOCK':
          const unlockedLayers = state.layers.map(l => ({ ...l, locked: false }));
          updateSvgFromLayers(unlockedLayers);
          setState(prev => ({ ...prev, layers: unlockedLayers }));
          showToast('Unlocked all', 'success');
          break;
        case 'OBJECT_HIDE':
          if (state.selectedLayerId) {
            const newLayers = state.layers.map(l => 
              l.id === state.selectedLayerId ? { ...l, visible: false } : l
            );
            updateSvgFromLayers(newLayers);
            setState(prev => ({ ...prev, layers: newLayers }));
            showToast('Hidden', 'success');
          }
          break;
        case 'OBJECT_SHOW':
          const visibleLayers = state.layers.map(l => ({ ...l, visible: true }));
          updateSvgFromLayers(visibleLayers);
          setState(prev => ({ ...prev, layers: visibleLayers }));
          showToast('Shown all', 'success');
          break;
        case 'HELP_HELP':
        case 'HELP_ABOUT':
          showToast('VectorForge v1.0.0 - Xibalba OS', 'info');
          break;
        default:
          // For submenu actions and unimplemented features, show info
          if (action.startsWith('FILE_') || action.startsWith('EDIT_') || action.startsWith('OBJECT_') || 
              action.startsWith('TYPE_') || action.startsWith('SELECT_') || action.startsWith('EFFECT_') ||
              action.startsWith('VIEW_') || action.startsWith('WINDOW_') || action.startsWith('HELP_')) {
            showToast(`${action.replace(/_/g, ' ')} - Coming soon`, 'info');
          }
      }
    } catch (error) {
      console.error('Action error:', error);
      showToast('Action failed', 'error');
    }
  }, [state, showToast, syncLayersFromSvg, updateSvgFromLayers]);

  // Handle tool changes
  // Handle tool changes - FIXED: Integrated click tracking
  const handleToolChange = useCallback((tool: ToolType) => {
    // Track tool selection
    clickTrackingService.trackClick(
      'tool',
      tool,
      tool.charAt(0).toUpperCase() + tool.slice(1).replace(/-/g, ' '),
      'select',
      {
        previousTool: state.activeTool,
        selectedLayerId: state.selectedLayerId,
        layersCount: state.layers.length
      }
    );
    setState(prev => ({ ...prev, activeTool: tool }));
  }, [state.activeTool, state.selectedLayerId, state.layers.length]);

  // Handle layer selection
  const handleLayerSelect = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedLayerId: id }));
  }, []);

  // Handle SVG changes
  const handleSvgChange = useCallback((svg: string) => {
    setState(prev => ({ ...prev, currentSvg: svg }));
  }, []);

  // Keyboard shortcuts - comprehensive implementation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || 
          (e.target as HTMLElement)?.tagName === 'TEXTAREA' ||
          (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      const ctrlOrCmd = e.ctrlKey || e.metaKey;
      
      // File operations
      if (ctrlOrCmd) {
        if (e.key === 's' && !e.shiftKey) {
          e.preventDefault();
          handleAction('FILE_SAVE');
        } else if (e.key === 's' && e.shiftKey) {
          e.preventDefault();
          handleAction('FILE_SAVE_AS');
        } else if (e.key === 'o') {
          e.preventDefault();
          handleAction('FILE_OPEN');
        } else if (e.key === 'n') {
          e.preventDefault();
          handleAction('FILE_NEW');
        } else if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleAction('EDIT_UNDO');
        } else if (e.key === 'z' && e.shiftKey) {
          e.preventDefault();
          handleAction('EDIT_REDO');
        } else if (e.key === 'c') {
          e.preventDefault();
          handleAction('EDIT_COPY');
        } else if (e.key === 'v') {
          e.preventDefault();
          handleAction('EDIT_PASTE');
        } else if (e.key === 'x') {
          e.preventDefault();
          handleAction('EDIT_CUT');
        } else if (e.key === 'a') {
          e.preventDefault();
          handleAction('SELECT_ALL');
        } else if (e.key === 'g' && !e.shiftKey) {
          e.preventDefault();
          handleAction('OBJECT_GROUP');
        } else if (e.key === 'g' && e.shiftKey) {
          e.preventDefault();
          handleAction('OBJECT_UNGROUP');
        } else if (e.key === '0') {
          e.preventDefault();
          handleAction('VIEW_FIT');
        } else if (e.key === '1') {
          e.preventDefault();
          handleAction('VIEW_ACTUAL');
        } else if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          handleAction('VIEW_ZOOM_IN');
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          handleAction('VIEW_ZOOM_OUT');
        } else if (e.key === 'r') {
          e.preventDefault();
          handleAction('VIEW_SHOW_RULERS');
        }
      }
      
      // Tool shortcuts (single key, no modifiers)
      if (!ctrlOrCmd && !e.altKey && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'v':
            e.preventDefault();
            handleToolChange('select');
            break;
          case 'p':
            e.preventDefault();
            handleToolChange('pen');
            break;
          case 'm':
            e.preventDefault();
            handleToolChange('rectangle');
            break;
          case 'l':
            e.preventDefault();
            handleToolChange('ellipse');
            break;
          case 't':
            e.preventDefault();
            handleToolChange('text');
            break;
          case 'h':
            e.preventDefault();
            handleToolChange('pan');
            break;
          case 'z':
            e.preventDefault();
            handleToolChange('zoom');
            break;
          case 'a':
            e.preventDefault();
            handleToolChange('direct-select');
            break;
        }
      }
      
      // Delete key
      if ((e.key === 'Delete' || e.key === 'Backspace') && !ctrlOrCmd) {
        if (state.selectedLayerId) {
          e.preventDefault();
          handleAction('EDIT_DELETE');
        }
      }
      
      // Escape to deselect
      if (e.key === 'Escape') {
        e.preventDefault();
        handleLayerSelect(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedLayerId, handleAction, handleToolChange, handleLayerSelect]);

  // Handle pan
  const handlePan = useCallback((pan: { x: number; y: number }) => {
    setState(prev => ({ ...prev, pan }));
  }, []);

  // Handle zoom
  const handleZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(10, Math.min(500, zoom)) }));
  }, []);

  // Handle generate
  const handleGenerate = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isGenerating: true }));
      // Simulate generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Generation complete', 'success');
    } catch (error) {
      showToast('Generation failed', 'error');
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  }, [showToast]);

  return (
    <ErrorBoundary>
      <div className="w-screen h-screen bg-[var(--xibalba-grey-000)] text-[var(--xibalba-text-000)] flex flex-col font-sans overflow-hidden">
        {/* Header with File Menu */}
        <ErrorBoundary>
          <div className="border-b border-white/10 bg-[var(--xibalba-grey-050)]">
            <ProfessionalFileMenu 
              onAction={handleAction}
              onLayoutChange={handleLayoutChange}
            />
          </div>
        </ErrorBoundary>

        {/* Main Content Area */}
        <div className="flex-1 flex bg-[var(--xibalba-grey-000)] overflow-hidden relative">
          {/* Left Sidebar */}
          {panelVisibility['left-sidebar'] && (
            <ErrorBoundary>
              <LeftSidebar 
                state={state}
                setState={setState}
                onGenerate={handleGenerate}
                activeTool={state.activeTool}
                onToolChange={handleToolChange}
              />
            </ErrorBoundary>
          )}

          {/* Center Canvas Area - Must account for right sidebar width */}
          <div className="flex-1 flex flex-col overflow-hidden relative z-canvas">
            {/* Power User Toolbar */}
            <ErrorBoundary>
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
            </ErrorBoundary>

            {/* Canvas */}
            <div className="flex-1 relative overflow-hidden z-canvas-content">
              <ErrorBoundary>
                <DraftsmanCanvas 
                  svgContent={state.currentSvg}
                  layers={state.layers}
                  activeTool={state.activeTool}
                  selectedLayerId={state.selectedLayerId}
                  zoom={state.zoom}
                  pan={state.pan}
                  onPan={handlePan}
                  onZoom={handleZoom}
                  onSelectLayer={handleLayerSelect}
                  onCreateLayer={(layer: VectorLayer) => {
                    setState(prev => {
                      const newLayers = [...prev.layers, layer];
                      // Update SVG and state together
                      setTimeout(() => updateSvgFromLayers(newLayers), 0);
                      return { ...prev, layers: newLayers, selectedLayerId: layer.id };
                    });
                    showToast(`Created ${layer.name}`, 'success');
                  }}
                  onUpdateLayer={(id: string, updates: Partial<VectorLayer>) => {
                    const newLayers = state.layers.map(l => l.id === id ? { ...l, ...updates } : l);
                    updateSvgFromLayers(newLayers);
                    setState(prev => ({
                      ...prev,
                      layers: newLayers
                    }));
                  }}
                  keyframes={keyframes}
                  frameState={frameState}
                  onKeyframeAdd={(kf) => setKeyframes(prev => [...prev, kf])}
                  onKeyframeUpdate={(id, props) => setKeyframes(prev => prev.map(k => k.id === id ? { ...k, ...props } : k))}
                  onKeyframeDelete={(id) => setKeyframes(prev => prev.filter(k => k.id !== id))}
                  showGuides={showGuides}
                  snapToGrid={snapToGrid}
                  snapToGuides={snapToGuides}
                  gridSize={gridSize}
                  measurementUnit="px"
                  onUnitChange={(unit) => showToast(`Unit changed to ${unit}`, 'info')}
                  toolProperties={toolProperties}
                  isSpacebarDown={false}
                />
              </ErrorBoundary>
            </div>
          </div>

          {/* Right Sidebar - Fixed positioned, outside flex flow */}
          {panelVisibility['right-sidebar'] && (
            <ErrorBoundary>
              <RightSidebar
              layers={state.layers || []}
              selectedLayerId={state.selectedLayerId}
              activeTool={state.activeTool}
              toolProperties={toolProperties}
              onToolPropertiesChange={handleToolPropertiesChange}
              onSelectLayer={handleLayerSelect}
              onToggleVisibility={(id) => {
                const newLayers = state.layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l);
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
              }}
              onToggleLock={(id) => {
                const newLayers = state.layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l);
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
              }}
              onUpdateProperty={(id, property, value) => {
                const newLayers = state.layers.map(l => {
                  if (l.id === id) {
                    return { ...l, [property]: value };
                  }
                  return l;
                });
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
                // Track property update
                if (typeof window !== 'undefined' && (window as any).clickTrackingService) {
                  (window as any).clickTrackingService.trackClick(
                    'property',
                    property,
                    `Updated ${property}`,
                    'update',
                    { layerId: id, value, property }
                  );
                }
              }}
              onUpdateShapeProperty={(id, property, value) => {
                const newLayers = state.layers.map(l => {
                  if (l.id === id && l.shape) {
                    return {
                      ...l,
                      shape: { ...l.shape, [property]: value }
                    };
                  }
                  return l;
                });
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
                // Track shape property update
                if (typeof window !== 'undefined' && (window as any).clickTrackingService) {
                  (window as any).clickTrackingService.trackClick(
                    'shape-property',
                    property,
                    `Updated shape ${property}`,
                    'update',
                    { layerId: id, value, property }
                  );
                }
              }}
              onDeleteLayer={(id) => {
                const newLayers = state.layers.filter(l => l.id !== id);
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: prev.selectedLayerId === id ? null : prev.selectedLayerId }));
              }}
              onDuplicateLayer={(id) => {
                const layer = state.layers.find(l => l.id === id);
                if (layer) {
                  const newLayer = { ...layer, id: `${id}_copy_${Date.now()}`, name: `${layer.name} Copy` };
                  const newLayers = [...state.layers, newLayer];
                  updateSvgFromLayers(newLayers);
                  setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: newLayer.id }));
                }
              }}
              onReorderLayer={(oldIndex, newIndex) => {
                const newLayers = [...state.layers];
                const [moved] = newLayers.splice(oldIndex, 1);
                newLayers.splice(newIndex, 0, moved);
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
                showToast('Layer reordered', 'success');
              }}
              onRenameLayer={(id, name) => {
                const newLayers = state.layers.map(l => l.id === id ? { ...l, name } : l);
                updateSvgFromLayers(newLayers);
                setState(prev => ({
                  ...prev,
                  layers: newLayers
                }));
                showToast('Layer renamed', 'success');
              }}
              onUpdateLayer={(id, updates) => {
                const newLayers = state.layers.map(l => l.id === id ? { ...l, ...updates } : l);
                updateSvgFromLayers(newLayers);
                setState(prev => ({
                  ...prev,
                  layers: newLayers
                }));
              }}
              onCreateLayer={() => {
                const newLayer: VectorLayer = {
                  id: `layer_${Date.now()}`,
                  name: 'New Layer',
                  color: toolProperties.fill || 'var(--xibalba-text-000, #ffffff)',
                  stroke: toolProperties.stroke || 'var(--xibalba-grey-000, #000000)',
                  strokeWidth: toolProperties.strokeWidth || 1,
                  opacity: toolProperties.opacity || 1,
                  visible: true,
                  locked: false,
                  shape: { type: 'path', d: 'M 0 0', nodes: [] }
                };
                const newLayers = [...state.layers, newLayer];
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: newLayer.id }));
              }}
              onCreateSublayer={(parentId) => {
                const parentLayer = state.layers.find(l => l.id === parentId);
                if (parentLayer) {
                  const sublayer: VectorLayer = {
                    id: `sublayer_${Date.now()}`,
                    name: `${parentLayer.name} Sublayer`,
                    color: toolProperties.fill || 'var(--xibalba-text-000, #ffffff)',
                    stroke: toolProperties.stroke || 'var(--xibalba-grey-000, #000000)',
                    strokeWidth: toolProperties.strokeWidth || 1,
                    opacity: toolProperties.opacity || 1,
                    visible: true,
                    locked: false,
                    shape: { type: 'path', d: 'M 0 0', nodes: [] }
                  };
                  const newLayers = state.layers.map(l => {
                    if (l.id === parentId) {
                      return { ...l, children: [...(l.children || []), sublayer] };
                    }
                    return l;
                  });
                  updateSvgFromLayers(newLayers);
                  setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: sublayer.id }));
                  showToast('Sublayer created', 'success');
                }
              }}
              onGroupLayers={(ids) => {
                if (ids.length > 1) {
                  const selectedLayers = state.layers.filter(l => ids.includes(l.id));
                  const groupLayer: VectorLayer = {
                    id: `group_${Date.now()}`,
                    name: `Group`,
                    visible: true,
                    locked: false,
                    color: selectedLayers[0]?.color || 'var(--xibalba-text-000, #ffffff)',
                    stroke: selectedLayers[0]?.stroke || 'var(--xibalba-grey-000, #000000)',
                    strokeWidth: selectedLayers[0]?.strokeWidth || 1,
                    opacity: selectedLayers[0]?.opacity || 1,
                    shape: { type: 'path', d: '', nodes: [] },
                    children: selectedLayers
                  };
                  const newLayers = [
                    ...state.layers.filter(l => !ids.includes(l.id)),
                    groupLayer
                  ];
                  updateSvgFromLayers(newLayers);
                  setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: groupLayer.id }));
                  showToast('Layers grouped', 'success');
                }
              }}
              onUngroupLayer={(id) => {
                const groupLayer = state.layers.find(l => l.id === id);
                if (groupLayer && groupLayer.children && groupLayer.children.length > 0) {
                  const newLayers = [
                    ...state.layers.filter(l => l.id !== id),
                    ...groupLayer.children
                  ];
                  updateSvgFromLayers(newLayers);
                  setState(prev => ({ ...prev, layers: newLayers }));
                  showToast('Layers ungrouped', 'success');
                }
              }}
              onCreateClippingMask={(layerId, maskId) => {
                const newLayers = state.layers.map(l => {
                  if (l.id === layerId) {
                    return { ...l, clippingMask: maskId };
                  }
                  return l;
                });
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
                showToast('Clipping mask created', 'success');
              }}
              onReleaseClippingMask={(layerId) => {
                const newLayers = state.layers.map(l => {
                  if (l.id === layerId) {
                    const { clippingMask, ...rest } = l;
                    return rest;
                  }
                  return l;
                });
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
                showToast('Clipping mask released', 'success');
              }}
              onBringToFront={(id) => {
                const index = state.layers.findIndex(l => l.id === id);
                if (index >= 0 && index < state.layers.length - 1) {
                  const newLayers = [...state.layers];
                  const [moved] = newLayers.splice(index, 1);
                  newLayers.push(moved);
                  updateSvgFromLayers(newLayers);
                  setState(prev => ({ ...prev, layers: newLayers }));
                  showToast('Brought to front', 'success');
                }
              }}
              onSendToBack={(id) => {
                const index = state.layers.findIndex(l => l.id === id);
                if (index > 0) {
                  const newLayers = [...state.layers];
                  const [moved] = newLayers.splice(index, 1);
                  newLayers.unshift(moved);
                  updateSvgFromLayers(newLayers);
                  setState(prev => ({ ...prev, layers: newLayers }));
                  showToast('Sent to back', 'success');
                }
              }}
              onBringForward={(id) => {
                const index = state.layers.findIndex(l => l.id === id);
                if (index >= 0 && index < state.layers.length - 1) {
                  const newLayers = [...state.layers];
                  const [moved] = newLayers.splice(index, 1);
                  newLayers.splice(index + 1, 0, moved);
                  updateSvgFromLayers(newLayers);
                  setState(prev => ({ ...prev, layers: newLayers }));
                  showToast('Brought forward', 'success');
                }
              }}
              onSendBackward={(id) => {
                const index = state.layers.findIndex(l => l.id === id);
                if (index > 0) {
                  const newLayers = [...state.layers];
                  const [moved] = newLayers.splice(index, 1);
                  newLayers.splice(index - 1, 0, moved);
                  updateSvgFromLayers(newLayers);
                  setState(prev => ({ ...prev, layers: newLayers }));
                  showToast('Sent backward', 'success');
                }
              }}
              onExpandAppearance={(id) => {
                const layer = state.layers.find(l => l.id === id);
                if (layer && layer.shape.type === 'path') {
                  // Convert strokes to filled paths
                  const newLayers = state.layers.map(l => {
                    if (l.id === id && l.strokeWidth > 0) {
                      return { ...l, strokeWidth: 0, color: l.stroke };
                    }
                    return l;
                  });
                  updateSvgFromLayers(newLayers);
                  setState(prev => ({ ...prev, layers: newLayers }));
                  showToast('Appearance expanded', 'success');
                }
              }}
              onCreateOutlines={(id) => {
                const layer = state.layers.find(l => l.id === id);
                if (layer && layer.shape.type === 'text') {
                  // Convert text to path outlines
                  const outlineLayer: VectorLayer = {
                    id: `outline_${id}_${Date.now()}`,
                    name: `${layer.name} Outlines`,
                    color: layer.color,
                    stroke: 'none',
                    strokeWidth: 0,
                    opacity: layer.opacity,
                    visible: layer.visible,
                    locked: false,
                    shape: { type: 'path', d: '', nodes: [] } // TODO: Convert text to path
                  };
                  const newLayers = [...state.layers, outlineLayer];
                  updateSvgFromLayers(newLayers);
                  setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: outlineLayer.id }));
                  showToast('Outlines created', 'success');
                }
              }}
              snapshots={state.snapshots || []}
              onRestoreSnapshot={(svg) => {
                const restoredLayers = syncLayersFromSvg(svg);
                setState(prev => ({ ...prev, currentSvg: svg, layers: restoredLayers }));
                showToast('Snapshot restored', 'success');
              }}
              onTerminalCommand={(cmd) => {
                // Handle terminal commands
                const newLog = {
                  id: `log_${Date.now()}`,
                  text: `$ ${cmd}`,
                  type: 'command' as const,
                  timestamp: Date.now()
                };
                setState(prev => ({
                  ...prev,
                  terminalLogs: [...prev.terminalLogs, newLog]
                }));
                // TODO: Execute command via MCP or local system
                showToast(`Command: ${cmd}`, 'info');
              }}
              keyframes={keyframes}
              frameState={frameState}
              onScriptChange={(frame, layerId, script) => {
                const existingKf = keyframes.find(k => k.frame === frame && k.layerId === layerId);
                if (existingKf) {
                  setKeyframes(prev => prev.map(k => k.id === existingKf.id ? { ...k, script } : k));
                } else {
                  setKeyframes(prev => [...prev, { id: `kf_${Date.now()}`, frame, layerId, script, properties: {} }]);
                }
              }}
              state={state}
              setState={setState}
            />
            </ErrorBoundary>
          )}
        </div>

        {/* Footer */}
        <ErrorBoundary>
          <Footer
            state={state}
            onAction={handleAction}
          />
        </ErrorBoundary>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={state.toasts || []} />

      {/* Welcome Screen */}
      {showWelcome && (
        <WelcomeScreen
          onDismiss={() => {
            setShowWelcome(false);
            localStorage.setItem('vforge_welcome_dismissed', 'true');
          }}
          onStartTutorial={() => {
            setShowWelcome(false);
            localStorage.setItem('vforge_welcome_dismissed', 'true');
            showToast('Tutorial coming soon!', 'info');
          }}
        />
      )}

      {/* Error Dashboard */}
      {showErrorDashboard && (
        <ErrorDashboard onClose={() => setShowErrorDashboard(false)} />
      )}
    </ErrorBoundary>
  );
};

export default App;

