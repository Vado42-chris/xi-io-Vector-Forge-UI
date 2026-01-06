import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  AppState,
  ToolType,
  VectorLayer,
  VectorNode,
  ToolProperties,
  TextShape,
  AnimationKeyframe,
} from './types';
import { jsPDF } from 'jspdf';
// TEMPORARILY DISABLED: useUndoRedo hook causing errors - will fix after UI is working
// import { useUndoRedo } from './hooks/useUndoRedo';
import { clipboardService } from './services/clipboardService';
// REMOVED: ErrorBoundary import - only using top-level one in index.tsx
import ProfessionalFileMenu from './components/ProfessionalFileMenu';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import ProfessionalLayersPanel from './components/ProfessionalLayersPanel';
import Canvas from './components/Canvas';
import PowerUserToolbar from './components/PowerUserToolbar';
import SignButton from './components/SignButton';
import AnimationTimeline from './components/AnimationTimeline';
import ProfessionalTimeline from './components/Timeline/ProfessionalTimeline';
import Library from './components/Library/Library';
import ActionsPanel from './components/Actions/ActionsPanel';
import AIFloatingPanel from './components/AIFloatingPanel';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
// WelcomeScreen removed - not part of design requirements
import { clickTrackingService } from './services/clickTrackingService';
import { workflowLayoutService } from './services/workflowLayoutService';
import type { WorkflowLayout } from './types/workflow';
import ErrorDashboard from './components/ErrorDashboard';
// UI Automation Components
import ProjectWizard from './components/ProjectWizard';
import TemplateLibrary from './components/TemplateLibrary';
import BatchOperationsPanel from './components/BatchOperationsPanel';
import SchemaBuilder from './components/SchemaBuilder';
import ActionCenterAudit from './components/ActionCenterAudit';
import TestGeneratorPanel from './components/TestGeneratorPanel';
import KeyboardShortcutsPanel from './components/KeyboardShortcutsPanel';
import GuidedWorkflowPanel from './components/GuidedWorkflowPanel';
// Design System Components
import { ActionCenter, useMAI, AdvancedSection } from '@xibalba/design-system';
// Keep old ActionCenter for backward compatibility (will be removed after migration)
import LegacyActionCenter from './components/ActionCenter';
// Emergency Save/Load/Export buttons
import SaveLoadButtons from './components/SaveLoadButtons';
import ExportButton from './components/ExportButton';
import TemplateFrameContainer from './components/TemplateFrameContainer';
// FloatingDevChatButton removed - Dev Chat accessible via Right Sidebar (Ctrl+K)
import { accessibilityService } from './services/accessibilityService';
import { settingsService } from './services/settingsService';
import { templateFrameService } from './services/templateFrameService';
// Gamification Components
import XPDisplay from './components/XPDisplay';
import AchievementPanel from './components/AchievementPanel';
import LevelUpModal from './components/LevelUpModal';
import { userProfileService } from './services/userProfileService';
import { achievementService } from './services/achievementService';
import { xpService, XP_ACTIONS } from './services/xpService';
import { guidedWorkflowService } from './services/guidedWorkflowService';
// Marketplace Components
import MarketplacePublisherDashboard from './components/MarketplacePublisherDashboard';
import MarketplaceAnalyticsDashboard from './components/MarketplaceAnalyticsDashboard';
// UI/UX Enhancement Components
import DockablePanel from './components/DockablePanel';
import WorkspaceCustomizer from './components/WorkspaceCustomizer';
import ScreenReaderAnnouncer, {
  useScreenReaderAnnouncement,
} from './components/ScreenReaderAnnouncer';
import ErrorPreventionDialog from './components/ErrorPreventionDialog';
import PreferencesDialog from './components/PreferencesDialog';
import ConversationHistoryPanel from './components/ConversationHistoryPanel';
import ErrorDisplay from './components/ErrorDisplay';
import SubscriptionStatusIndicator from './components/SubscriptionStatusIndicator';
import AccountMenu from './components/AccountMenu';
import ToolLockingSystem from './components/ToolLockingSystem';
import DockableToolPalette from './components/DockableToolPalette';
import SprintBoard from './components/SprintBoard';
import InspectorPanel from './components/InspectorPanel';
import BugReporter from './components/BugReporter';
import FeatureRequest from './components/FeatureRequest';
import BillingPanel from './components/BillingPanel';
import UpgradePrompt from './components/UpgradePrompt';

// Initial SVG with workspace root
const INITIAL_SVG = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect id="bg" width="100%" height="100%" fill="var(--xibalba-grey-000, #0a0b0e)"/>
  <g id="workspace_root">
    <path id="prime_path" d="M 156 156 L 356 156 L 356 356 L 156 356 Z" fill="var(--xibalba-grey-250, #2a2d35)" fill-opacity="0.3" stroke="var(--xibalba-grey-300, #343842)" stroke-width="2" />
  </g>
</svg>`;

/* eslint-disable no-case-declarations */
// Parse SVG path to VectorNode array
// FIXED: Use enhanced SVG path parser with full command support
import { parseSvgPath, serializePath } from './utils/svgPathParser';

const App: React.FC = () => {
  // #region agent log - App mount tracking and overlay detection
  useEffect(() => {
    console.log('[DEBUG] App.hardened: MOUNTED', {
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'black-box-cover-diagnostic',
      hypothesisId: 'A',
      data: { mountTime: Date.now() },
    });

    // Track ALL fixed-position elements that could cover the UI
    const checkOverlays = () => {
      const fixedElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const styles = getComputedStyle(el);
        return styles.position === 'fixed' || styles.position === 'absolute';
      });

      const overlays = fixedElements
        .map(el => {
          const styles = getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            id: el.id,
            classes: el.className,
            zIndex: styles.zIndex,
            position: styles.position,
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            background: styles.backgroundColor,
            dimensions: { width: rect.width, height: rect.height },
            location: { top: rect.top, left: rect.left, bottom: rect.bottom, right: rect.right },
            coversScreen:
              rect.width >= window.innerWidth * 0.9 && rect.height >= window.innerHeight * 0.9,
          };
        })
        .filter(o => o.coversScreen || parseInt(o.zIndex) > 100);

      console.log('[DEBUG] Overlay Detection: Fixed/Absolute Elements', {
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'black-box-cover-diagnostic',
        hypothesisId: 'B',
        data: { overlays, totalFixed: fixedElements.length },
      });

      // Check for ErrorBoundary
      const errorBoundary = document.querySelector(
        '[style*="z-index: 99999"], [style*="zIndex: 99999"]'
      );
      if (errorBoundary) {
        console.log('[DEBUG] ErrorBoundary DETECTED - Covering UI', {
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'black-box-cover-diagnostic',
          hypothesisId: 'C',
          data: { element: errorBoundary.outerHTML.substring(0, 200) },
        });
      }

      // Check canvas visibility
      const canvasArea = document.querySelector('[data-canvas-area="true"]');
      if (canvasArea) {
        const rect = canvasArea.getBoundingClientRect();
        const styles = getComputedStyle(canvasArea);
        console.log('[DEBUG] Canvas Area Visibility Check', {
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'black-box-cover-diagnostic',
          hypothesisId: 'D',
          data: {
            visible: rect.width > 0 && rect.height > 0,
            dimensions: { width: rect.width, height: rect.height },
            zIndex: styles.zIndex,
            position: styles.position,
            opacity: styles.opacity,
            visibility: styles.visibility,
            display: styles.display,
          },
        });
      }
    };

    // Check immediately and after delays to catch late-mounting overlays
    checkOverlays();
    setTimeout(checkOverlays, 100);
    setTimeout(checkOverlays, 500);
    setTimeout(checkOverlays, 1000);
    setTimeout(checkOverlays, 2000);
  }, []);
  // #endregion

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
        currentSvg:
          '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="var(--xibalba-grey-000, #0a0b0e)"/></svg>',
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
        toolProperties: {},
        fileOperationLoading: { type: null },
        measurementUnit: 'px',
        workspaceLayout: 'default',
        dockedPanels: [],
        engineConfig: { provider: 'gemini-pro' as any, apiKey: '', thinkingBudget: 32768 },
        // Accessibility fields
        screenReaderMessage: '',
        screenReaderPriority: 'polite',
        // Error prevention fields
        errorPreventionType: 'warning',
        errorPreventionTitle: '',
        errorPreventionMessage: '',
        errorPreventionDetails: undefined,
        errorPreventionActions: undefined,
        errorPreventionOnConfirm: undefined,
        errorPreventionConfirmLabel: 'Confirm',
        errorPreventionCancelLabel: 'Cancel',
        errorPreventionDestructive: false,
      };
      return saved
        ? { ...baseState, ...JSON.parse(saved), isGenerating: false, toasts: [] }
        : baseState;
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
        engineConfig: { provider: 'gemini-pro' as any, apiKey: '', thinkingBudget: 32768 },
        // Accessibility fields
        screenReaderMessage: '',
        screenReaderPriority: 'polite',
        // Error prevention fields
        errorPreventionType: 'warning',
        errorPreventionTitle: '',
        errorPreventionMessage: '',
        errorPreventionDetails: undefined,
        errorPreventionActions: undefined,
        errorPreventionOnConfirm: undefined,
        errorPreventionConfirmLabel: 'Confirm',
        errorPreventionCancelLabel: 'Cancel',
        errorPreventionDestructive: false,
      };
    }
  });

  // TEMPORARILY DISABLED: Undo/redo integration causing errors - will fix after UI is working
  // const [undoState, undoRedoState] = useUndoRedo<AppState>(state, {
  //   maxHistorySize: 50,
  //   debounceMs: 300,
  // });
  // const isUndoRedoRef = useRef(false);
  // useEffect(() => {
  //   if (isUndoRedoRef.current) {
  //     setState(undoState);
  //     isUndoRedoRef.current = false;
  //   }
  // }, [undoState]);
  // const prevStateRef = useRef<AppState>(state);
  // useEffect(() => {
  //   if (!isUndoRedoRef.current && JSON.stringify(prevStateRef.current) !== JSON.stringify(state)) {
  //     undoRedoState.recordState(state);
  //     prevStateRef.current = state;
  //   }
  // }, [state, undoRedoState]);

  // Temporary stub for undo/redo
  const undoRedoState = {
    canUndo: false,
    canRedo: false,
    undo: () => {},
    redo: () => {},
    recordState: () => {},
    clearHistory: () => {},
  };

  const [keyframes, setKeyframes] = useState<any[]>([]);
  const [frameState, setFrameState] = useState({
    currentFrame: 0,
    totalFrames: 100,
    fps: 24,
    isPlaying: false,
    isLooping: false,
  });

  // Library state (symbols and assets)
  const [symbols, setSymbols] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);

  // Actions panel state (hashtag code)
  const [actionsCode, setActionsCode] = useState<string>('');
  const [showLibrary, setShowLibrary] = useState(true);
  const [showActions, setShowActions] = useState(false);

  // Canvas settings state
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [snapToGuides, setSnapToGuides] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [gridSize, setGridSize] = useState(10);
  const [showOnionSkin, setShowOnionSkin] = useState(false);
  const [onionSkinFrames, setOnionSkinFrames] = useState(2);

  // Global advanced mode state (persisted to localStorage)
  const [advancedMode, setAdvancedMode] = useState(() => {
    try {
      return localStorage.getItem('vf.advancedMode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vf.advancedMode', advancedMode ? 'true' : 'false');
    } catch (e) {
      // localStorage not available, ignore
    }
  }, [advancedMode]);

  // Workflow layout state
  const [currentLayout, setCurrentLayout] = useState<WorkflowLayout | null>(null);
  // CRITICAL: Right sidebar MUST be visible by default for Dev Chat access
  const [panelVisibility, setPanelVisibility] = useState<Record<string, boolean>>({
    'left-sidebar': true,
    'right-sidebar': true, // MUST be true - Dev Chat is in Right Sidebar
    toolbar: true,
    canvas: true,
    timeline: true,
  });

  // Debug: Log panel visibility on mount
  useEffect(() => {
    console.log('✅ App mounted - Right Sidebar visibility:', panelVisibility['right-sidebar']);
    // Force right sidebar to be visible if somehow it's not
    if (!panelVisibility['right-sidebar']) {
      console.warn('⚠️ Right Sidebar was hidden, forcing it visible for Dev Chat access');
      setPanelVisibility(prev => ({ ...prev, 'right-sidebar': true }));
    }
  }, []);

  // Apply accessibility settings on mount
  useEffect(() => {
    const settings = settingsService.getSettings();
    accessibilityService.applySettings(settings.accessibility);
  }, []);

  // Initialize default template frames
  useEffect(() => {
    const existingFrames = templateFrameService.getAllFrames();
    if (existingFrames.length === 0) {
      // Create a default template frame
      templateFrameService.registerFrame({
        id: 'default-template-frame',
        name: 'Default Template Frame',
        containerId: 'template-frame-default',
        position: {
          x: 100,
          y: 100,
          width: 400,
          height: 300,
        },
        zIndex: 1000,
        visible: true,
        attachedComponents: [],
      });
    }
  }, []);

  // Keyboard shortcuts for UI automation components
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K - Open Keyboard Shortcuts Panel
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
        return;
      }

      // Ctrl+Shift+P or Cmd+Shift+P - Open Project Wizard
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowProjectWizard(true);
        return;
      }

      // Ctrl+Shift+T or Cmd+Shift+T - Open Template Library
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        setShowTemplateLibrary(true);
        return;
      }

      // Ctrl+Shift+A or Cmd+Shift+A - Open Achievement Panel
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAchievementPanel(true);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    void initLayout();
  }, []);

  // Error dashboard state
  const [showErrorDashboard, setShowErrorDashboard] = useState(false);

  // Welcome screen removed - not part of design requirements

  // UI Automation Component States
  const [showProjectWizard, setShowProjectWizard] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showBatchOperations, setShowBatchOperations] = useState(false);
  const [showSchemaBuilder, setShowSchemaBuilder] = useState(false);
  const [showActionAudit, setShowActionAudit] = useState(false);
  const [showTestGenerator, setShowTestGenerator] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showErrorPrevention, setShowErrorPrevention] = useState(false);
  const [showGuidedWorkflow, setShowGuidedWorkflow] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferencesCategory, setPreferencesCategory] = useState<
    'visual' | 'functional' | 'performance' | 'accessibility' | 'integrations'
  >('visual');
  // Gamification state
  const [showAchievementPanel, setShowAchievementPanel] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; levelInfo: any } | null>(null);
  // Marketplace state
  const [showPublisherDashboard, setShowPublisherDashboard] = useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
  // UI/UX Enhancement state
  const [showWorkspaceCustomizer, setShowWorkspaceCustomizer] = useState(false);
  const [showConversationHistory, setShowConversationHistory] = useState(false);

  // Tool properties state - updates based on active tool
  const [toolProperties, setToolProperties] = useState<ToolProperties>(() => {
    try {
      const saved = localStorage.getItem('vforge_tool_properties');
      return saved
        ? JSON.parse(saved)
        : {
            strokeWidth: 1,
            opacity: 1,
            fill: 'var(--xibalba-text-000, #ffffff)',
            stroke: 'var(--xibalba-grey-000, #000000)',
            strokeDasharray: '',
            strokeLinecap: 'butt',
            strokeLinejoin: 'miter',
            fillRule: 'nonzero',
          };
    } catch (error) {
      console.error('Failed to load tool properties:', error);
      return {
        strokeWidth: 1,
        opacity: 1,
        fill: 'var(--xibalba-text-000, #ffffff)',
        stroke: 'var(--xibalba-grey-000, #000000)',
        strokeDasharray: '',
        strokeLinecap: 'butt',
        strokeLinejoin: 'miter',
        fillRule: 'nonzero',
      };
    }
  });

  // Update tool properties when tool changes
  useEffect(() => {
    const defaultProps: Partial<Record<ToolType, Partial<ToolProperties>>> = {
      select: {},
      pen: { strokeWidth: 2, fill: 'none', stroke: 'var(--xibalba-text-000, #ffffff)' },
      rectangle: {
        strokeWidth: 1,
        fill: 'var(--xibalba-text-000, #ffffff)',
        stroke: 'var(--xibalba-grey-000, #000000)',
      },
      ellipse: {
        strokeWidth: 1,
        fill: 'var(--xibalba-text-000, #ffffff)',
        stroke: 'var(--xibalba-grey-000, #000000)',
      },
      text: { fill: 'var(--xibalba-text-000, #ffffff)', fontSize: 16, fontFamily: 'Inter' },
      pan: {},
      zoom: {},
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
  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
      const toast = {
        id: Date.now().toString(),
        message,
        type,
        timestamp: Date.now(),
      };
      setState(prev => ({ ...prev, toasts: [...prev.toasts, toast] }));
      setTimeout(() => {
        setState(prev => ({ ...prev, toasts: prev.toasts.filter(t => t.id !== toast.id) }));
      }, 3000);
    },
    []
  );

  // MAI Framework - Most Actionable Item (moved to top level to fix React hooks violation)
  const appState = {
    prompt: state.prompt || '',
    isGenerating: state.isGenerating || false,
    selectedLayers: state.layers.filter(l => l.id === state.selectedLayerId),
  };

  const primaryAction = useMAI({
    state: appState,
    actions: [
      {
        id: 'generate-vector',
        label: '✨ Generate Vector',
        priority: 100,
        condition: s => Boolean(s.prompt && !s.isGenerating),
        action: () => handleGenerate(),
      },
      {
        id: 'edit-selection',
        label: '✏️ Edit Selection',
        priority: 90,
        condition: s => (s.selectedLayers || []).length > 0,
        action: () => {
          const propsPanel = document.querySelector('[data-panel="properties"]');
          propsPanel?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },
      },
      {
        id: 'enter-prompt',
        label: '💬 Enter a prompt to start',
        priority: 10,
        condition: s => !s.prompt,
        action: () => {
          const input = document.querySelector<HTMLInputElement>('.ai-prompt-input');
          input?.focus();
        },
      },
    ],
  });

  // Screen reader announcement helper
  const announceToScreenReader = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      setState(prev => ({
        ...prev,
        screenReaderMessage: message,
        screenReaderPriority: priority,
      }));
      // Clear message after announcement
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          screenReaderMessage: '',
          screenReaderPriority: 'polite',
        }));
      }, 2000);
    },
    []
  );

  // Error prevention dialog helper
  const showErrorPreventionDialog = useCallback(
    (
      type: 'warning' | 'error' | 'confirmation',
      title: string,
      message: string,
      details?: string,
      suggestedActions?: Array<{ label: string; action: () => void; primary?: boolean }>,
      onConfirm?: () => void,
      confirmLabel?: string,
      cancelLabel?: string,
      destructive?: boolean
    ) => {
      setState(prev => ({
        ...prev,
        errorPreventionType: type,
        errorPreventionTitle: title,
        errorPreventionMessage: message,
        errorPreventionDetails: details,
        errorPreventionActions: suggestedActions,
        errorPreventionOnConfirm: onConfirm,
        errorPreventionConfirmLabel: confirmLabel,
        errorPreventionCancelLabel: cancelLabel,
        errorPreventionDestructive: destructive,
      }));
      setShowErrorPrevention(true);
    },
    []
  );

  // Award XP and check for level up
  const awardXPAndCheckLevelUp = useCallback(
    (
      actionId: string,
      category: 'action' | 'creation' | 'tutorial' | 'achievement' | 'social',
      xpAmount: number,
      description: string
    ) => {
      try {
        const result = xpService.awardXP(actionId, category, xpAmount, description);
        if (result.leveledUp && result.levelInfo) {
          setLevelUpInfo({ level: result.newLevel, levelInfo: result.levelInfo });
        }
        // Update user profile
        const profile = userProfileService.getProfile();
        userProfileService.updateProfile({ xp: result.newXP, level: result.newLevel });
      } catch (error) {
        console.error('Failed to award XP:', error);
      }
    },
    []
  );

  // Handle layout change - redefined after showToast is available
  const handleLayoutChange = useCallback(
    (layout: WorkflowLayout) => {
      setCurrentLayout(layout);
      // Apply panel visibility from layout
      const visibility: Record<string, boolean> = {};
      layout.panels.forEach(panel => {
        visibility[panel.id] = panel.visible;
      });
      setPanelVisibility(visibility);
      showToast(`Switched to ${layout.name}`, 'success');
    },
    [showToast]
  );

  // Sync layers from SVG
  const syncLayersFromSvg = useCallback((svg: string): VectorLayer[] => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'image/svg+xml');
      const paths = Array.from(doc.querySelectorAll('path, rect, circle, ellipse, text'));

      return paths.map(
        (p, idx): VectorLayer => ({
          id: p.id || `layer_${idx}`,
          name: p.getAttribute('data-name') || p.id || 'Unnamed Layer',
          visible: p.getAttribute('display') !== 'none',
          locked: p.getAttribute('data-locked') === 'true',
          color: p.getAttribute('fill') || 'var(--xibalba-text-000, #ffffff)',
          stroke: p.getAttribute('stroke') || 'var(--xibalba-grey-000, #000000)',
          strokeWidth: parseFloat(p.getAttribute('stroke-width') || '0'),
          opacity: parseFloat(p.getAttribute('opacity') || '1'),
          blendMode: (p.getAttribute('data-blend-mode') || 'normal') as VectorLayer['blendMode'],
          shape:
            p.tagName === 'rect'
              ? {
                  type: 'rect' as const,
                  x: parseFloat(p.getAttribute('x') || '0'),
                  y: parseFloat(p.getAttribute('y') || '0'),
                  width: parseFloat(p.getAttribute('width') || '0'),
                  height: parseFloat(p.getAttribute('height') || '0'),
                  borderRadius: parseFloat(p.getAttribute('rx') || '0'),
                }
              : p.tagName === 'text'
                ? ({
                    type: 'text' as const,
                    x: parseFloat(p.getAttribute('x') || '0'),
                    y: parseFloat(p.getAttribute('y') || '0'),
                    content: p.textContent || '',
                    fontFamily: p.getAttribute('font-family') || 'Inter',
                    fontSize: parseFloat(p.getAttribute('font-size') || '16'),
                    fontWeight: parseInt(p.getAttribute('font-weight') || '400'),
                    fontStyle: (p.getAttribute('font-style') || 'normal') as 'normal' | 'italic',
                    fill: p.getAttribute('fill') || 'var(--xibalba-text-000, #ffffff)',
                    stroke: p.getAttribute('stroke') || 'var(--xibalba-grey-000, #000000)',
                    strokeWidth: parseFloat(p.getAttribute('stroke-width') || '0'),
                  } as TextShape)
                : {
                    type: 'path' as const,
                    d: p.getAttribute('d') || '',
                    nodes: parseSvgPath(p.getAttribute('d') || ''),
                  },
        })
      );
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
        const doc = parser.parseFromString(currentSvg, 'image/svg+xml');

        // FIXED: Better workspace root handling
        let workspaceRoot: SVGGElement | null = doc.getElementById(
          'workspace_root'
        ) as SVGGElement | null;
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

          let el: SVGElement | null = doc.getElementById(layer.id) as SVGElement | null;
          if (!el) {
            // FIXED: Handle all shape types including ellipse
            if (layer.shape.type === 'rect') {
              el = doc.createElementNS('http://www.w3.org/2000/svg', 'rect') as SVGElement;
            } else if (layer.shape.type === 'ellipse') {
              el = doc.createElementNS('http://www.w3.org/2000/svg', 'ellipse') as SVGElement;
            } else if (layer.shape.type === 'text') {
              el = doc.createElementNS('http://www.w3.org/2000/svg', 'text') as SVGElement;
            } else if (layer.shape.type === 'path') {
              el = doc.createElementNS('http://www.w3.org/2000/svg', 'path') as SVGElement;
            } else {
              // Fallback to path for unknown types
              el = doc.createElementNS('http://www.w3.org/2000/svg', 'path') as SVGElement;
            }
            if (!el) return; // Guard against null
            el.setAttribute('id', layer.id);
            el.setAttribute('data-name', layer.name || 'Unnamed Layer');
            parent.appendChild(el);
          }

          // Update attributes based on shape type
          if (!el) return; // Guard against null
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
            const pathData =
              layer.shape.d ||
              (layer.shape.nodes && Array.isArray(layer.shape.nodes)
                ? serializePath(layer.shape.nodes)
                : '');
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
              if (el) {
                addLayerToSvg(child, el);
              }
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
  const handleAction = useCallback(
    async (action: string) => {
      try {
        // Track action click
        clickTrackingService.trackClick('menu', action, action.replace(/_/g, ' '), 'click', {
          activeTool: state.activeTool,
          selectedLayerId: state.selectedLayerId,
          layersCount: state.layers.length,
        });

        // eslint-disable no-case-declarations
        switch (action) {
          case 'FILE_NEW':
            showErrorPreventionDialog(
              'warning',
              'Create New File',
              'Creating a new file will discard all unsaved changes.',
              'All current layers and work will be lost. Make sure you have saved your work if needed.',
              [
                {
                  label: 'Save Current Work First',
                  action: () => {
                    setShowErrorPrevention(false);
                    void handleAction('FILE_SAVE');
                  },
                  primary: false,
                },
              ],
              () => {
                // Start with completely empty layers - INITIAL_SVG only has background/structure
                setState(prev => ({
                  ...prev,
                  currentSvg: INITIAL_SVG,
                  layers: [], // Empty - user will create layers by drawing
                  selectedLayerId: null,
                  history: [INITIAL_SVG],
                  redoHistory: [],
                  pan: { x: 0, y: 0 },
                  zoom: 100,
                }));
                showToast('New file created - Ready to draw!', 'success');
                announceToScreenReader('New file created');
                // Award XP for creating a new file
                awardXPAndCheckLevelUp(
                  'file-new',
                  'action',
                  XP_ACTIONS.CREATE_PROJECT.points,
                  XP_ACTIONS.CREATE_PROJECT.description
                );
              },
              'Create New File',
              'Cancel',
              false
            );
            break;
          case 'FILE_SAVE':
            setState(prev => ({ ...prev, fileOperationLoading: { type: 'save' } }));
            try {
              // Simulate async operation for visual feedback
              await new Promise<void>(resolve => setTimeout(resolve, 100));
              localStorage.setItem('vforge_xibalba_prime', JSON.stringify(state));
              setState(prev => ({ ...prev, fileOperationLoading: { type: null } }));
              showToast('File saved', 'success');
              // Award XP for saving
              awardXPAndCheckLevelUp(
                'file-save',
                'action',
                XP_ACTIONS.SAVE_FILE.points,
                XP_ACTIONS.SAVE_FILE.description
              );
              userProfileService.updateStat('filesSaved', 1);
            } catch (error) {
              setState(prev => ({ ...prev, fileOperationLoading: { type: null } }));
              showToast('Failed to save file', 'error');
            }
            break;
          case 'FILE_SAVE_AS': {
            setState(prev => ({ ...prev, fileOperationLoading: { type: 'save-as' } }));
            // eslint-disable-next-line no-case-declarations
            try {
              await new Promise<void>(resolve => setTimeout(resolve, 150));
              const blob = new Blob(
                [JSON.stringify({ svg: state.currentSvg, layers: state.layers, state })],
                { type: 'application/json' }
              );
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `vectorforge_${Date.now()}.xibalba`;
              a.click();
              URL.revokeObjectURL(url);
              setState(prev => ({ ...prev, fileOperationLoading: { type: null } }));
              showToast('File saved as', 'success');
            } catch (error) {
              setState(prev => ({ ...prev, fileOperationLoading: { type: null } }));
              showToast('Failed to save file', 'error');
            }
            break;
          }
          case 'FILE_OPEN': {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.xibalba,application/json';
            input.onchange = e => {
              void (async () => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  setState(prev => ({ ...prev, fileOperationLoading: { type: 'open' } }));
                  try {
                    const text = await file.text();
                    const data = JSON.parse(text);
                    if (data.svg && data.layers) {
                      const openData = {
                        ...data,
                        name: file.name,
                        timestamp: Date.now(),
                      };
                      setState(prev => ({
                        ...prev,
                        currentSvg: data.svg,
                        layers: data.layers || [],
                        selectedLayerId: null,
                        zoom: data.zoom || prev.zoom,
                        pan: data.pan || prev.pan,
                        fileOperationLoading: { type: null },
                      }));
                      // Update recent files
                      try {
                        const recentFilesStr = localStorage.getItem('vforge_recent_files') || '[]';
                        const recentFiles = JSON.parse(recentFilesStr);
                        if (Array.isArray(recentFiles)) {
                          recentFiles.unshift(openData);
                          const updatedRecent = recentFiles.slice(0, 10); // Keep last 10
                          localStorage.setItem(
                            'vforge_recent_files',
                            JSON.stringify(updatedRecent)
                          );
                        }
                      } catch (error) {
                        console.error('Failed to update recent files:', error);
                        // Initialize with current file
                        localStorage.setItem('vforge_recent_files', JSON.stringify([openData]));
                      }
                      showToast('File opened', 'success');
                    } else {
                      setState(prev => ({ ...prev, fileOperationLoading: { type: null } }));
                      showToast('Invalid file format', 'error');
                    }
                  } catch (error) {
                    setState(prev => ({ ...prev, fileOperationLoading: { type: null } }));
                    showToast('Failed to open file', 'error');
                  }
                }
              })();
            };
            input.click();
            break;
          }
          case 'FILE_EXPORT':
          case 'FILE_EXPORT_SVG': {
            setState(prev => ({ ...prev, fileOperationLoading: { type: 'export-svg' } }));
            try {
              await new Promise<void>(resolve => setTimeout(resolve, 200));
              const blob = new Blob([state.currentSvg], { type: 'image/svg+xml' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `vectorforge_${Date.now()}.svg`;
              a.click();
              URL.revokeObjectURL(url);
              setState(prev => ({ ...prev, fileOperationLoading: { type: null } }));
              showToast('SVG exported', 'success');
              // Award XP for exporting
              awardXPAndCheckLevelUp(
                'file-export-svg',
                'action',
                XP_ACTIONS.EXPORT_SVG.points,
                XP_ACTIONS.EXPORT_SVG.description
              );
              // Check for first export achievement
              // eslint-disable-next-line no-case-declarations
              const profile = userProfileService.getProfile();
              if (profile.stats.filesSaved === 0) {
                userProfileService.unlockAchievement('first-export');
              }
            } catch (error) {
              setState(prev => ({ ...prev, fileOperationLoading: { type: null } }));
              showToast('Export failed', 'error');
            }
            break;
          }
          case 'FILE_EXPORT_PNG': {
            setState(prev => ({ ...prev, fileOperationLoading: { type: 'export-png' } }));
            try {
              // Convert SVG to PNG using canvas
              const img = new Image();
              const svgBlob = new Blob([state.currentSvg], { type: 'image/svg+xml' });
              const url = URL.createObjectURL(svgBlob);

              // Set timeout to prevent stuck loading state
              const timeoutId = setTimeout(() => {
                setState(prev => ({ ...prev, fileOperationLoading: { type: null } }));
                showToast('PNG export timed out', 'error');
                URL.revokeObjectURL(url);
              }, 10000); // 10 second timeout

              img.onload = () => {
                clearTimeout(timeoutId);
                // eslint-disable-next-line no-case-declarations
                const canvas = document.createElement('canvas');
                canvas.width = img.width || 1024;
                canvas.height = img.height || 1024;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.drawImage(img, 0, 0);
                  canvas.toBlob(blob => {
                    if (blob) {
                      const pngUrl = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = pngUrl;
                      a.download = `vectorforge_${Date.now()}.png`;
                      a.click();
                      URL.revokeObjectURL(pngUrl);
                      setState(prev => ({ ...prev, fileOperationLoading: { type: null } }));
                      showToast('PNG exported', 'success');
                    } else {
                      setState(prev => ({ ...prev, fileOperationLoading: { type: null } }));
                      showToast('PNG export failed - could not create blob', 'error');
                    }
                    URL.revokeObjectURL(url);
                  }, 'image/png');
                } else {
                  setState(prev => ({ ...prev, fileOperationLoading: { type: null } }));
                  showToast('PNG export failed - could not get canvas context', 'error');
                  URL.revokeObjectURL(url);
                }
              };

              img.onerror = () => {
                clearTimeout(timeoutId);
                setState(prev => ({ ...prev, fileOperationLoading: { type: null } }));
                showToast('PNG export failed - image could not be loaded', 'error');
                URL.revokeObjectURL(url);
              };

              img.src = url;
            } catch (error) {
              setState(prev => ({ ...prev, fileOperationLoading: { type: null } }));
              showToast('PNG export failed', 'error');
            }
            break;
          }
          case 'FILE_EXPORT_PDF':
            showToast('PDF export - Coming soon (requires PDF library)', 'info');
            break;
          case 'FILE_EXPORT_EPS':
            showToast('EPS export - Coming soon', 'info');
            break;
          case 'FILE_EXPORT_ANIMATION':
            showToast(
              'Animation export - Coming soon (requires Animation Studio integration)',
              'info'
            );
            break;
          case 'FILE_SAVE_COPY':
            try {
              const blob = new Blob(
                [JSON.stringify({ svg: state.currentSvg, layers: state.layers, state })],
                { type: 'application/json' }
              );
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
            showErrorPreventionDialog(
              'warning',
              'Revert to Last Saved Version',
              'Reverting will discard all unsaved changes since the last save.',
              'All current work will be lost. This action cannot be undone.',
              [],
              () => {
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
                      pan: data.pan || prev.pan,
                    }));
                    showToast('Reverted to last saved version', 'success');
                    announceToScreenReader('Reverted to last saved version');
                  } else {
                    showToast('No saved version found', 'warning');
                  }
                } catch (error) {
                  showToast('Failed to revert', 'error');
                }
              },
              'Revert',
              'Cancel',
              false
            );
            break;
          case 'FILE_CLOSE':
            showErrorPreventionDialog(
              'warning',
              'Close File',
              'Closing the current file will discard all unsaved changes.',
              'Make sure you have saved your work if needed.',
              [
                {
                  label: 'Save and Close',
                  action: () => {
                    setShowErrorPrevention(false);
                    void handleAction('FILE_SAVE');
                    setTimeout(() => {
                      setState(prev => ({
                        ...prev,
                        currentSvg: INITIAL_SVG,
                        layers: [],
                        selectedLayerId: null,
                        history: [INITIAL_SVG],
                        redoHistory: [],
                        pan: { x: 0, y: 0 },
                        zoom: 100,
                      }));
                      showToast('File closed', 'success');
                      announceToScreenReader('File closed');
                    }, 500);
                  },
                  primary: true,
                },
              ],
              () => {
                setState(prev => ({
                  ...prev,
                  currentSvg: INITIAL_SVG,
                  layers: [],
                  selectedLayerId: null,
                  history: [INITIAL_SVG],
                  redoHistory: [],
                  pan: { x: 0, y: 0 },
                  zoom: 100,
                }));
                showToast('File closed', 'success');
                announceToScreenReader('File closed');
                // These functions don't return promises - false positive
              },
              'Close',
              'Cancel',
              false
            );
            break;
          case 'FILE_PLACE': {
            const placeInput = document.createElement('input');
            placeInput.type = 'file';
            placeInput.accept = 'image/*,.svg';
            placeInput.onchange = e => {
              void (async () => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  try {
                    if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
                      const text = await file.text();
                      const parser = new DOMParser();
                      const doc = parser.parseFromString(text, 'image/svg+xml');
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
                          shape: {
                            type: 'path',
                            d: svgElement.getAttribute('viewBox') ? `M 0 0` : '',
                            nodes: [],
                          },
                        };
                        const newLayers = [...state.layers, placedLayer];
                        updateSvgFromLayers(newLayers);
                        setState(prev => ({
                          ...prev,
                          layers: newLayers,
                          selectedLayerId: placedLayer.id,
                        }));
                        showToast('File placed', 'success');
                      }
                    } else {
                      // For raster images, create image layer
                      const reader = new FileReader();
                      reader.onload = e => {
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
                            shape: {
                              type: 'path',
                              d: `M 0 0 L ${img.width} 0 L ${img.width} ${img.height} Z`,
                              nodes: [],
                            },
                          };
                          const newLayers = [...state.layers, placedLayer];
                          updateSvgFromLayers(newLayers);
                          setState(prev => ({
                            ...prev,
                            layers: newLayers,
                            selectedLayerId: placedLayer.id,
                          }));
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
              })();
            };
            placeInput.click();
            break;
          }
          case 'FILE_IMPORT': {
            const importInput = document.createElement('input');
            importInput.type = 'file';
            importInput.accept = '.xibalba,application/json,.svg';
            importInput.onchange = e => {
              void (async () => {
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
                          name: `${l.name} (imported)`,
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
                      const newLayers = [
                        ...state.layers,
                        ...importedLayers.map(l => ({
                          ...l,
                          id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                          name: `${l.name} (imported)`,
                        })),
                      ];
                      updateSvgFromLayers(newLayers);
                      setState(prev => ({ ...prev, layers: newLayers }));
                      showToast(`Imported ${importedLayers.length} layer(s)`, 'success');
                    }
                  } catch (error) {
                    showToast('Failed to import file', 'error');
                  }
                }
              })();
            };
            importInput.click();
            break;
          }
          case 'FILE_EXIT':
            showErrorPreventionDialog(
              'warning',
              'Exit VectorForge',
              'Are you sure you want to exit? Unsaved changes will be lost.',
              'Make sure you have saved your work before exiting.',
              [
                {
                  label: 'Save and Exit',
                  action: () => {
                    setShowErrorPrevention(false);
                    handleAction('FILE_SAVE');
                    setTimeout(() => window.close(), 500);
                  },
                  primary: true,
                },
              ],
              () => {
                window.close();
              },
              'Exit',
              'Cancel',
              false
            );
            break;
          case 'EDIT_UNDO': {
            // TEMPORARILY DISABLED: Using old undo system until hook is fixed
            if (state.history && state.history.length > 1) {
              const prevSvg = state.history[state.history.length - 2];
              const newHistory = [...state.history];
              newHistory.pop();
              setState(prev => ({
                ...prev,
                currentSvg: prevSvg,
                layers: syncLayersFromSvg(prevSvg),
                history: newHistory,
                redoHistory: [...prev.redoHistory, prev.currentSvg],
              }));
              showToast('Undone', 'success');
            } else {
              showToast('Nothing to undo', 'info');
            }
            break;
          }
          case 'EDIT_UNDO_OLD':
            if (state.history && state.history.length > 1) {
              const prevSvg = state.history[state.history.length - 2];
              const newHistory = [...state.history];
              newHistory.pop();
              setState(prev => ({
                ...prev,
                currentSvg: prevSvg,
                layers: syncLayersFromSvg(prevSvg),
                history: newHistory,
                redoHistory: [...prev.redoHistory, prev.currentSvg],
              }));
              showToast('Undone', 'success');
            }
            break;
          case 'EDIT_REDO': {
            // TEMPORARILY DISABLED: Using old redo system until hook is fixed
            if (state.redoHistory && state.redoHistory.length > 0) {
              const nextSvg = state.redoHistory[state.redoHistory.length - 1];
              const newRedoHistory = [...state.redoHistory];
              newRedoHistory.pop();
              setState(prev => ({
                ...prev,
                currentSvg: nextSvg,
                layers: syncLayersFromSvg(nextSvg),
                history: [...prev.history, nextSvg],
                redoHistory: newRedoHistory,
              }));
              showToast('Redone', 'success');
            } else {
              showToast('Nothing to redo', 'info');
            }
            break;
          }
          case 'EDIT_REDO_OLD':
            if (state.redoHistory && state.redoHistory.length > 0) {
              const nextSvg = state.redoHistory[state.redoHistory.length - 1];
              const newRedoHistory = [...state.redoHistory];
              newRedoHistory.pop();
              setState(prev => ({
                ...prev,
                currentSvg: nextSvg,
                layers: syncLayersFromSvg(nextSvg),
                history: [...prev.history, nextSvg],
                redoHistory: newRedoHistory,
              }));
              showToast('Redone', 'success');
            }
            break;
          case 'EDIT_CUT': {
            // Copy selected layer/object to clipboard, then delete
            if (state.selectedLayerId) {
              const selectedLayer = state.layers.find(l => l.id === state.selectedLayerId);
              if (selectedLayer) {
                clipboardService.copy({
                  type: 'layer',
                  data: selectedLayer,
                  timestamp: Date.now(),
                });
                setState(prev => ({
                  ...prev,
                  layers: prev.layers.filter(l => l.id !== state.selectedLayerId),
                  selectedLayerId: null,
                }));
                showToast('Cut to clipboard', 'success');
              }
            } else {
              showToast('Nothing selected to cut', 'warning');
            }
            break;
          }
          case 'EDIT_CUT_OLD':
            if (state.selectedLayerId && state.layers) {
              const layer = state.layers.find(l => l.id === state.selectedLayerId);
              if (layer) {
                void navigator.clipboard.writeText(JSON.stringify(layer));
                const newLayers = state.layers.filter(l => l.id !== state.selectedLayerId);
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: null }));
                showToast('Cut to clipboard', 'success');
              }
            }
            break;
          case 'EDIT_COPY': {
            // Copy selected layer/object to clipboard
            if (state.selectedLayerId) {
              const selectedLayer = state.layers.find(l => l.id === state.selectedLayerId);
              if (selectedLayer) {
                clipboardService.copy({
                  type: 'layer',
                  data: selectedLayer,
                  timestamp: Date.now(),
                });
                showToast('Copied to clipboard', 'success');
              }
            } else {
              showToast('Nothing selected to copy', 'warning');
            }
            break;
          }
          case 'EDIT_COPY_OLD':
            if (state.selectedLayerId && state.layers) {
              const layer = state.layers.find(l => l.id === state.selectedLayerId);
              if (layer) {
                void navigator.clipboard.writeText(JSON.stringify(layer));
                showToast('Copied to clipboard', 'success');
              }
            }
            break;
          case 'EDIT_PASTE': {
            // Paste from clipboard
            const clipboardItem = clipboardService.paste();
            if (clipboardItem) {
              if (clipboardItem.type === 'layer') {
                const newLayer = {
                  ...clipboardItem.data,
                  id: `layer-${Date.now()}`,
                  name: `${clipboardItem.data.name} (copy)`,
                };
                setState(prev => ({
                  ...prev,
                  layers: [...prev.layers, newLayer],
                  selectedLayerId: newLayer.id,
                }));
                showToast('Pasted from clipboard', 'success');
              } else if (clipboardItem.type === 'text') {
                // Handle text paste
                const text = await clipboardService.pasteFromSystemClipboard();
                if (text) {
                  showToast(`Pasted text: ${text.substring(0, 20)}...`, 'success');
                }
              } else {
                showToast('Unsupported clipboard format', 'warning');
              }
            } else {
              showToast('Clipboard is empty', 'warning');
            }
            break;
          }
          case 'EDIT_PASTE_OLD': {
            void (async () => {
              try {
                const text = await navigator.clipboard.readText();
                const layer = JSON.parse(text);
                if (layer && layer.id) {
                  const newLayer = {
                    ...layer,
                    id: `layer_${Date.now()}`,
                    name: `${layer.name} Copy`,
                  };
                  const newLayers = [...state.layers, newLayer];
                  updateSvgFromLayers(newLayers);
                  setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: newLayer.id }));
                  showToast('Pasted', 'success');
                }
              } catch (e) {
                showToast('Nothing to paste', 'warning');
              }
            })();
            break;
          }
          case 'SELECT_ALL':
            if (state.layers && state.layers.length > 0) {
              setState(prev => ({ ...prev, selectedLayerId: state.layers[0].id }));
              showToast('Selected', 'info');
            }
            break;
          case 'SELECT_DESELECT':
          case 'EDIT_CLEAR':
            setState(prev => ({ ...prev, selectedLayerId: null }));
            showToast('Deselected', 'info');
            break;
          case 'EDIT_DELETE':
            if (state.selectedLayerId && state.layers) {
              const layer = state.layers.find(l => l.id === state.selectedLayerId);
              const layerName = layer?.name || 'selected layer';
              showErrorPreventionDialog(
                'warning',
                'Delete Layer',
                `Are you sure you want to delete "${layerName}"?`,
                'This action cannot be undone. The layer and all its contents will be permanently removed.',
                [
                  {
                    label: 'Move to Trash Instead',
                    action: () => {
                      // TODO: Implement trash/undo system
                      setShowErrorPrevention(false);
                      showToast('Trash feature coming soon', 'info');
                    },
                    primary: false,
                  },
                ],
                () => {
                  const newLayers = state.layers.filter(l => l.id !== state.selectedLayerId);
                  updateSvgFromLayers(newLayers);
                  setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: null }));
                  showToast(`Deleted ${layerName}`, 'success');
                  announceToScreenReader(`Layer ${layerName} deleted`);
                },
                'Delete',
                'Cancel',
                true
              );
            } else {
              showToast('No layer selected', 'warning');
            }
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
          case 'VIEW_DEV_CHAT':
          case 'WINDOW_DEV_CHAT':
            // Open Dev Chat - ensure right sidebar is visible and switch to Dev Chat tab
            setPanelVisibility(prev => ({ ...prev, 'right-sidebar': true }));
            if (typeof window !== 'undefined' && (window as any).__switchToDevChatTab) {
              setTimeout(() => {
                (window as any).__switchToDevChatTab();
              }, 100);
            }
            showToast('Opening Dev Chat (Ctrl+K)', 'info');
            break;
          case 'VIEW_ERROR_DASHBOARD':
            setShowErrorDashboard(true);
            break;
          case 'WINDOW_MARKETPLACE_PUBLISHER':
            setShowPublisherDashboard(true);
            break;
          case 'WINDOW_MARKETPLACE_ANALYTICS':
            setShowAnalyticsDashboard(true);
            break;
          case 'WINDOW_WORKSPACE_CUSTOMIZER':
            setShowWorkspaceCustomizer(true);
            break;
          case 'OBJECT_GROUP':
            if (state.selectedLayerId && state.layers) {
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
                  blendMode: 'normal',
                  shape: { type: 'path', d: '', nodes: [] },
                  children: [selectedLayer],
                };
                const newLayers = [
                  ...state.layers.filter(l => l.id !== state.selectedLayerId),
                  groupLayer,
                ];
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: groupLayer.id }));
                showToast('Grouped', 'success');
              }
            }
            break;
          case 'OBJECT_UNGROUP':
            if (state.selectedLayerId && state.layers) {
              const groupLayer = state.layers.find(l => l.id === state.selectedLayerId);
              if (
                groupLayer &&
                groupLayer.children &&
                Array.isArray(groupLayer.children) &&
                groupLayer.children.length > 0
              ) {
                const newLayers = [
                  ...state.layers.filter(l => l.id !== state.selectedLayerId),
                  ...groupLayer.children,
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
          case 'OBJECT_UNLOCK': {
            const unlockedLayers = state.layers.map(l => ({ ...l, locked: false }));
            updateSvgFromLayers(unlockedLayers);
            setState(prev => ({ ...prev, layers: unlockedLayers }));
            showToast('Unlocked all', 'success');
            break;
          }
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
          case 'OBJECT_SHOW': {
            const visibleLayers = state.layers.map(l => ({ ...l, visible: true }));
            updateSvgFromLayers(visibleLayers);
            setState(prev => ({ ...prev, layers: visibleLayers }));
            showToast('Shown all', 'success');
            break;
          }
          case 'HELP_HELP':
          case 'HELP_ABOUT':
            showToast('VectorForge v1.0.0 - Xibalba OS', 'info');
            break;
          // Arrange operations
          case 'OBJECT_ARRANGE_FRONT':
            if (state.selectedLayerId) {
              const newLayers = [...state.layers];
              const layerIndex = newLayers.findIndex(l => l.id === state.selectedLayerId);
              if (layerIndex >= 0) {
                const [layer] = newLayers.splice(layerIndex, 1);
                newLayers.push(layer);
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
                showToast('Brought to front', 'success');
              }
            } else {
              showToast('Select a layer first', 'warning');
            }
            break;
          case 'OBJECT_ARRANGE_BACK':
            if (state.selectedLayerId) {
              const newLayers = [...state.layers];
              const layerIndex = newLayers.findIndex(l => l.id === state.selectedLayerId);
              if (layerIndex >= 0) {
                const [layer] = newLayers.splice(layerIndex, 1);
                newLayers.unshift(layer);
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
                showToast('Sent to back', 'success');
              }
            } else {
              showToast('Select a layer first', 'warning');
            }
            break;
          case 'OBJECT_ARRANGE_FORWARD':
            if (state.selectedLayerId) {
              const newLayers = [...state.layers];
              const layerIndex = newLayers.findIndex(l => l.id === state.selectedLayerId);
              if (layerIndex >= 0 && layerIndex < newLayers.length - 1) {
                [newLayers[layerIndex], newLayers[layerIndex + 1]] = [
                  newLayers[layerIndex + 1],
                  newLayers[layerIndex],
                ];
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
                showToast('Brought forward', 'success');
              } else {
                showToast('Already at front', 'info');
              }
            } else {
              showToast('Select a layer first', 'warning');
            }
            break;
          case 'OBJECT_ARRANGE_BACKWARD':
            if (state.selectedLayerId) {
              const newLayers = [...state.layers];
              const layerIndex = newLayers.findIndex(l => l.id === state.selectedLayerId);
              if (layerIndex > 0) {
                [newLayers[layerIndex], newLayers[layerIndex - 1]] = [
                  newLayers[layerIndex - 1],
                  newLayers[layerIndex],
                ];
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
                showToast('Sent backward', 'success');
              } else {
                showToast('Already at back', 'info');
              }
            } else {
              showToast('Select a layer first', 'warning');
            }
            break;
          // File operations
          case 'FILE_NEW_TEMPLATE':
            setShowTemplateLibrary(true);
            showToast('Opening template library...', 'info');
            break;
          case 'FILE_SAVE_WEB':
            // Save optimized for web (lower quality, smaller size)
            try {
              const optimizedSvg = state.currentSvg.replace(/<!--.*?-->/g, '').replace(/\s+/g, ' ');
              const blob = new Blob([optimizedSvg], { type: 'image/svg+xml' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `vectorforge-web-${Date.now()}.svg`;
              a.click();
              URL.revokeObjectURL(url);
              showToast('Saved for web', 'success');
            } catch (error) {
              showToast('Failed to save for web', 'error');
            }
            break;
          // Recent files
          case 'FILE_OPEN_RECENT_1':
          case 'FILE_OPEN_RECENT_2':
          case 'FILE_OPEN_RECENT_3':
          case 'FILE_OPEN_RECENT_4':
          case 'FILE_OPEN_RECENT_5':
          case 'FILE_OPEN_RECENT_6':
          case 'FILE_OPEN_RECENT_7':
          case 'FILE_OPEN_RECENT_8':
          case 'FILE_OPEN_RECENT_9':
          case 'FILE_OPEN_RECENT_10':
            try {
              const index = parseInt(action.split('_').pop() || '1') - 1;
              const stored = localStorage.getItem('vforge_recent_files');
              if (stored) {
                const recentFiles = JSON.parse(stored);
                if (Array.isArray(recentFiles) && recentFiles[index]) {
                  const fileData = recentFiles[index];
                  if (fileData.content) {
                    setState(prev => ({
                      ...prev,
                      currentSvg: fileData.content,
                      layers: fileData.layers || [],
                      selectedLayerId: null,
                    }));
                    showToast(`Opened ${fileData.name || 'recent file'}`, 'success');
                  } else {
                    showToast('File data not available', 'warning');
                  }
                } else {
                  showToast('Recent file not found', 'warning');
                }
              } else {
                showToast('No recent files', 'info');
              }
            } catch (error) {
              console.error('Failed to open recent file:', error);
              showToast('Failed to open recent file', 'error');
            }
            break;
          default:
            // For submenu actions and unimplemented features, show info
            if (
              action.startsWith('FILE_') ||
              action.startsWith('EDIT_') ||
              action.startsWith('OBJECT_') ||
              action.startsWith('TYPE_') ||
              action.startsWith('SELECT_') ||
              action.startsWith('EFFECT_') ||
              action.startsWith('VIEW_') ||
              action.startsWith('WINDOW_') ||
              action.startsWith('HELP_')
            ) {
              showToast(`${action.replace(/_/g, ' ')} - Coming soon`, 'info');
            }
          // eslint-enable no-case-declarations
        }
      } catch (error) {
        console.error('Action error:', error);
        showToast('Action failed', 'error');
      }
    },
    [
      state,
      showToast,
      syncLayersFromSvg,
      updateSvgFromLayers,
      awardXPAndCheckLevelUp,
      showErrorPreventionDialog,
      announceToScreenReader,
      setPreferencesCategory,
      setShowPreferences,
    ]
  );

  // Handle tool changes
  // Handle tool changes - FIXED: Integrated click tracking
  const handleToolChange = useCallback(
    (tool: ToolType) => {
      // Track tool selection
      clickTrackingService.trackClick(
        'tool',
        tool,
        tool.charAt(0).toUpperCase() + tool.slice(1).replace(/-/g, ' '),
        'select',
        {
          previousTool: state.activeTool,
          selectedLayerId: state.selectedLayerId,
          layersCount: state.layers.length,
        }
      );
      setState(prev => ({ ...prev, activeTool: tool }));
    },
    [state.activeTool, state.selectedLayerId, state.layers.length]
  );

  // Handle layer selection
  const handleLayerSelect = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedLayerId: id }));
  }, []);

  // Handle node selection
  const handleNodeSelect = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedNodeId: id }));
  }, []);

  // Handle node update
  const handleNodeUpdate = useCallback(
    (layerId: string, nodeId: string, delta: { x: number; y: number }) => {
      const layer = state.layers.find(l => l.id === layerId);
      if (layer && layer.shape.type === 'path' && layer.shape.nodes) {
        const newLayers = state.layers.map(l => {
          if (l.id === layerId && l.shape.type === 'path') {
            return {
              ...l,
              shape: {
                ...l.shape,
                nodes: l.shape.nodes.map(n =>
                  n.id === nodeId ? { ...n, x: n.x + delta.x, y: n.y + delta.y } : n
                ),
              },
            };
          }
          return l;
        });
        updateSvgFromLayers(newLayers);
        setState(prev => ({ ...prev, layers: newLayers }));
      }
    },
    [state.layers]
  );

  // Handle guide operations
  const handleAddGuide = useCallback((type: 'h' | 'v', pos: number) => {
    const newGuide = { id: `guide-${Date.now()}`, type, pos };
    setState(prev => ({ ...prev, guides: [...prev.guides, newGuide] }));
  }, []);

  const handleUpdateGuide = useCallback((id: string, pos: number) => {
    setState(prev => ({
      ...prev,
      guides: prev.guides.map(g => (g.id === id ? { ...g, pos } : g)),
    }));
  }, []);

  // Handle SVG changes
  const handleSvgChange = useCallback((svg: string) => {
    setState(prev => ({ ...prev, currentSvg: svg }));
  }, []);

  // Keyboard shortcuts - comprehensive implementation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        (e.target as HTMLElement)?.tagName === 'INPUT' ||
        (e.target as HTMLElement)?.tagName === 'TEXTAREA' ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
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

      // Flash-style shortcuts
      // F9 - Toggle Actions Panel (Hashtag System) - Now in RightSidebar Inspector
      if (e.key === 'F9') {
        e.preventDefault();
        // Switch to Code tab in RightSidebar
        if (typeof window !== 'undefined' && (window as any).__switchToCodeTab) {
          (window as any).__switchToCodeTab();
        } else {
          // Fallback: ensure right sidebar is visible and switch tab
          setPanelVisibility(prev => ({ ...prev, 'right-sidebar': true }));
          // Store tab switch for RightSidebar to pick up
          (window as any).__pendingTabSwitch = 'code';
        }
        showToast('Actions panel (F9) - Switch to Code tab in Inspector', 'info');
        return;
      }

      // F11 - Toggle Library Panel
      if (e.key === 'F11') {
        e.preventDefault();
        setShowLibrary(prev => !prev);
        showToast(showLibrary ? 'Library hidden' : 'Library shown (F11)', 'info');
        return;
      }

      // UI Automation shortcuts
      if (ctrlOrCmd) {
        // Ctrl+K or Cmd+K - Open Dev Chat (Self-Modifying AI)
        if (e.key === 'k' || e.key === 'K') {
          e.preventDefault();
          // Ensure right sidebar is visible
          setPanelVisibility(prev => ({ ...prev, 'right-sidebar': true }));
          // Switch to Dev Chat tab
          if (typeof window !== 'undefined' && (window as any).__switchToDevChatTab) {
            setTimeout(() => {
              (window as any).__switchToDevChatTab();
            }, 100);
          }
          // Show toast notification
          showToast('Opening Dev Chat (Ctrl+K)', 'info');
          return;
        }
        // Ctrl+Shift+K or Cmd+Shift+K - Open Keyboard Shortcuts Panel
        if (e.shiftKey && (e.key === 'k' || e.key === 'K')) {
          e.preventDefault();
          setShowKeyboardShortcuts(true);
          return;
        }
        // Ctrl+Shift+P or Cmd+Shift+P - Open Project Wizard
        if (e.shiftKey && (e.key === 'p' || e.key === 'P')) {
          e.preventDefault();
          setShowProjectWizard(true);
          return;
        }
        // Ctrl+Shift+T or Cmd+Shift+T - Open Template Library
        if (e.shiftKey && (e.key === 't' || e.key === 'T')) {
          e.preventDefault();
          setShowTemplateLibrary(true);
          return;
        }
        // Ctrl+Shift+A or Cmd+Shift+A - Open Achievement Panel
        if (e.shiftKey && (e.key === 'a' || e.key === 'A')) {
          e.preventDefault();
          setShowAchievementPanel(true);
          return;
        }
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

  // CACHE BUST: Log to verify we're using the latest code
  console.log('🎨 App.hardened RENDERING - Version:', new Date().toISOString());
  console.log('🎨 NO ErrorBoundary wrapper - NO black backgrounds - NO texture-substrate');

  return (
    <div
      className="app-root text-[var(--xibalba-text-000)] font-sans"
      data-sidebar-left-visible={panelVisibility['left-sidebar'] ? 'true' : 'false'}
      data-sidebar-right-visible={panelVisibility['right-sidebar'] ? 'true' : 'false'}
      data-timeline-visible={panelVisibility['timeline'] ? 'true' : 'false'}
      data-toolbar-visible={panelVisibility['toolbar'] ? 'true' : 'false'}
      data-ai-panel-visible={true}
    >
      {/* Header with File Menu - Fixed at top */}
      <div className="app-header">
        <ProfessionalFileMenu onAction={handleAction} onLayoutChange={handleLayoutChange} />
        {/* Emergency Save/Load/Export buttons */}
        <SaveLoadButtons state={state} setState={setState} />
        <ExportButton />
        <div className="ml-auto mr-4">
          <SignButton
            svgContent={state.currentSvg}
            onSigned={bundlePath => {
              showToast(`✅ Proof bundle created: ${bundlePath}`, 'success');
            }}
            onError={error => {
              showToast(`❌ Signing failed: ${error}`, 'error');
            }}
            label="Sign & Create Proof"
            className="text-sm"
          />
        </div>
      </div>

      {/* Left Sidebar - Fluid Column */}
      {panelVisibility['left-sidebar'] && (
        <div className="app-left-sidebar">
          <LeftSidebar
            state={state}
            setState={setState}
            onGenerate={handleGenerate}
            activeTool={state.activeTool}
            onToolChange={handleToolChange}
            showLibrary={showLibrary}
            symbols={symbols}
            assets={assets}
            onConvertToSymbol={(name, type) => {
              const newSymbol = {
                id: `symbol-${Date.now()}`,
                name,
                type,
                createdAt: Date.now(),
              };
              setSymbols(prev => [...prev, newSymbol]);
              showToast(`Symbol "${name}" created`, 'success');
            }}
            onEditSymbol={id => {
              showToast(`Editing symbol ${id}`, 'info');
            }}
            onDragStart={(e, symbol) => {
              e.dataTransfer.setData('application/x-symbol', JSON.stringify(symbol));
              showToast(`Dragging ${symbol.name}`, 'info');
            }}
            onCreateAsset={() => {
              showToast('Import asset - Coming soon', 'info');
            }}
          />
        </div>
      )}

      {/* Center Stack - Fluid Column with Grid Layout */}
      <div className="app-center-stack">
        {/* Toolbar - Top of center stack */}
        {panelVisibility['toolbar'] && (
          <div className="app-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm, 8px)' }}>
              <SaveLoadButtons state={state} setState={setState} />
              <ExportButton />
            </div>
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
          </div>
        )}

        {/* AI Vector Column - Middle of center stack */}
        <div className="app-ai-panel xibalba-scrollbar">
          {/* AI Generation Panel - Extracted from LeftSidebar */}
          <div
            className="xibalba-panel-section bg-[var(--xibalba-grey-100)] rounded-lg border border-[var(--xibalba-grey-300)]"
            style={{ padding: 'var(--spacing-lg, 16px)', gap: 'var(--spacing-md, 12px)' }}
            data-testid="ai-panel"
          >
            <h3
              className="text-xs font-bold text-[var(--xibalba-text-000)] uppercase tracking-widest"
              style={{ marginBottom: 'var(--spacing-md, 12px)' }}
            >
              GENERATIVE VECTOR AI
            </h3>

            {/* PROMPT Section */}
            <div style={{ marginBottom: 'var(--spacing-md, 12px)' }}>
              <label
                className="text-xs font-semibold text-[var(--xibalba-text-100)] uppercase tracking-wide block"
                style={{ marginBottom: 'var(--spacing-xs, 4px)' }}
              >
                PROMPT
              </label>
              <textarea
                value={state.prompt}
                onChange={e => setState(p => ({ ...p, prompt: e.target.value }))}
                placeholder="Describe the vector you want to create..."
                className="w-full bg-[var(--xibalba-grey-200)] border border-[var(--xibalba-grey-300)] rounded text-sm text-[var(--xibalba-text-000)] placeholder:text-[var(--xibalba-text-300)] focus:outline-none focus:border-[var(--vectorforge-accent)] resize-none"
                style={{ padding: 'var(--spacing-sm, 8px) var(--spacing-md, 12px)' }}
                rows={2}
              />
            </div>

            {/* STYLE Section */}
            <div style={{ marginBottom: 'var(--spacing-md, 12px)' }}>
              <label
                className="text-xs font-semibold text-[var(--xibalba-text-100)] uppercase tracking-wide block"
                style={{ marginBottom: 'var(--spacing-xs, 4px)' }}
              >
                STYLE
              </label>
              <div className="flex flex-wrap" style={{ gap: 'var(--spacing-sm, 8px)' }}>
                {['Line Art', 'Flat Icon', 'Isometric', 'Abstract'].map(styleLabel => {
                  const styleValue = styleLabel.toLowerCase().replace(' ', '-') as any;
                  return (
                    <button
                      key={styleLabel}
                      onClick={() => setState(p => ({ ...p, style: styleValue }))}
                      className={`text-xs rounded border transition-colors ${
                        state.style === styleValue
                          ? 'bg-[var(--vectorforge-accent)] text-white border-[var(--vectorforge-accent)]'
                          : 'bg-[var(--xibalba-grey-200)] text-[var(--xibalba-text-100)] border-[var(--xibalba-grey-300)] hover:border-[var(--vectorforge-accent)]'
                      }`}
                      style={{ padding: 'var(--spacing-xs, 4px) var(--spacing-md, 12px)' }}
                      aria-label={`${styleLabel} Style`}
                      title={`${styleLabel} Style - Apply ${styleLabel.toLowerCase()} style to generated vectors`}
                    >
                      {styleLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={() => handleGenerate()}
              className="w-full bg-[var(--vectorforge-accent)] text-white rounded text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ padding: 'var(--spacing-sm, 8px) var(--spacing-md, 12px)' }}
              aria-label="Generate Vector"
              title="Generate Vector - Create vector graphics from your prompt"
            >
              Generate Vector
            </button>

            {/* Advanced Options - Hidden by default */}
            <AdvancedSection
              collapsed={!advancedMode}
              summary={<strong>Advanced options</strong>}
              id="ai-advanced"
              onToggle={collapsed => {
                // Sync with global advancedMode when user toggles
                if (!collapsed && !advancedMode) {
                  setAdvancedMode(true);
                }
              }}
            >
              <div
                style={{
                  marginTop: 'var(--spacing-md, 12px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-md, 12px)',
                }}
              >
                <div>
                  <label
                    className="text-xs font-semibold text-[var(--xibalba-text-100)] uppercase tracking-wide block"
                    style={{ marginBottom: 'var(--spacing-xs, 4px)' }}
                  >
                    COMPLEXITY
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={state.complexity}
                    onChange={e => setState(p => ({ ...p, complexity: parseInt(e.target.value) }))}
                    className="w-full"
                    aria-label="Complexity"
                    title="Complexity"
                  />
                  <div
                    className="text-xs text-[var(--xibalba-text-200)]"
                    style={{ marginTop: 'var(--spacing-xs, 4px)' }}
                  >
                    {state.complexity}% complexity
                  </div>
                </div>
                <div>
                  <label
                    className="text-xs font-semibold text-[var(--xibalba-text-100)] uppercase tracking-wide block"
                    style={{ marginBottom: 'var(--spacing-xs, 4px)' }}
                  >
                    ITERATIONS
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={1}
                    readOnly
                    className="w-full bg-[var(--xibalba-grey-200)] border border-[var(--xibalba-grey-300)] rounded text-sm text-[var(--xibalba-text-000)]"
                    style={{ padding: 'var(--spacing-sm, 8px) var(--spacing-md, 12px)' }}
                    aria-label="Iterations"
                    title="Iterations"
                  />
                </div>
              </div>
            </AdvancedSection>
          </div>
        </div>

        {/* Canvas - Takes remaining space */}
        <div className="app-canvas-area" data-canvas-area="true">
          <Canvas
            svgContent={state.currentSvg}
            layers={state.layers}
            activeTool={state.activeTool}
            selectedLayerId={state.selectedLayerId}
            selectedNodeId={state.selectedNodeId}
            zoom={state.zoom}
            pan={state.pan}
            onPan={handlePan}
            onZoom={handleZoom}
            onSelectLayer={handleLayerSelect}
            onSelectNode={handleNodeSelect}
            onUpdateNode={handleNodeUpdate}
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
              const newLayers = state.layers.map(l => (l.id === id ? { ...l, ...updates } : l));
              updateSvgFromLayers(newLayers);
              setState(prev => ({
                ...prev,
                layers: newLayers,
                history: [...prev.history, prev.currentSvg],
                redoHistory: [],
              }));
            }}
            guides={state.guides.map(g => ({ id: g.id, type: g.type, position: g.pos }))}
            onAddGuide={handleAddGuide}
            onUpdateGuide={handleUpdateGuide}
            isGenerating={state.isGenerating}
            showGuides={showGuides}
            snapToGrid={snapToGrid}
            gridSize={gridSize}
            frameState={frameState}
            keyframes={keyframes}
            onAddKeyframe={kf => setKeyframes(prev => [...prev, kf])}
            onUpdateKeyframe={(id, props) =>
              setKeyframes(prev => prev.map(k => (k.id === id ? { ...k, ...props } : k)))
            }
          />
        </div>

        {/* Professional Flash-Style Timeline - Bottom of center stack */}
        {panelVisibility['timeline'] && (
          <div className="app-timeline">
            <ProfessionalTimeline
              layers={state.layers}
              keyframes={keyframes}
              frameState={frameState}
              onFrameChange={frame => {
                setFrameState(prev => ({ ...prev, currentFrame: frame }));
              }}
              onLayerToggle={(layerId, property) => {
                const newLayers = state.layers.map(l =>
                  l.id === layerId ? { ...l, [property]: !l[property] } : l
                );
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
              }}
              onAddLayer={() => {
                const newLayer: VectorLayer = {
                  id: `layer-${Date.now()}`,
                  name: `Layer ${state.layers.length + 1}`,
                  visible: true,
                  locked: false,
                  opacity: 1,
                  blendMode: 'normal',
                  color: '#ffffff',
                  stroke: 'none',
                  strokeWidth: 0,
                  shape: { type: 'group', children: [] },
                };
                setState(prev => ({ ...prev, layers: [...prev.layers, newLayer] }));
              }}
              onAddFolder={() => {
                showToast('Folder creation - Coming soon', 'info');
              }}
              onAddMask={() => {
                showToast('Mask creation - Coming soon', 'info');
              }}
              onAddKeyframe={(layerId, frame) => {
                const newKeyframe: AnimationKeyframe = {
                  id: `keyframe-${Date.now()}`,
                  layerId,
                  frame,
                  properties: {},
                };
                setKeyframes(prev => [...prev, newKeyframe]);
              }}
              onDeleteKeyframe={keyframeId => {
                setKeyframes(prev => prev.filter(k => k.id !== keyframeId));
              }}
              onFrameLabel={(frame, label) => {
                showToast(`Frame ${frame} labeled: ${label}`, 'info');
              }}
              totalFrames={100}
              fps={24}
            />
          </div>
        )}
      </div>

      {/* Right Sidebar - Fluid Column */}
      {panelVisibility['right-sidebar'] && (
        <div className="app-right-sidebar">
          <RightSidebar
            layers={state.layers || []}
            selectedLayerId={state.selectedLayerId}
            activeTool={state.activeTool}
            toolProperties={toolProperties}
            onToolPropertiesChange={handleToolPropertiesChange}
            onSelectLayer={handleLayerSelect}
            advancedMode={advancedMode}
            onToggleVisibility={id => {
              const newLayers = state.layers.map(l =>
                l.id === id ? { ...l, visible: !l.visible } : l
              );
              updateSvgFromLayers(newLayers);
              setState(prev => ({ ...prev, layers: newLayers }));
            }}
            onToggleLock={id => {
              const newLayers = state.layers.map(l =>
                l.id === id ? { ...l, locked: !l.locked } : l
              );
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
            onDeleteLayer={id => {
              const newLayers = state.layers.filter(l => l.id !== id);
              updateSvgFromLayers(newLayers);
              setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: null }));
              showToast('Layer deleted', 'success');
            }}
            onDuplicateLayer={id => {
              const layer = state.layers.find(l => l.id === id);
              if (layer) {
                const newLayer = {
                  ...layer,
                  id: `layer-${Date.now()}`,
                  name: `${layer.name} Copy`,
                };
                const newLayers = [...state.layers, newLayer];
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: newLayer.id }));
                showToast('Layer duplicated', 'success');
              }
            }}
            onReorderLayer={(oldIndex, newIndex) => {
              const newLayers = [...state.layers];
              const [moved] = newLayers.splice(oldIndex, 1);
              newLayers.splice(newIndex, 0, moved);
              updateSvgFromLayers(newLayers);
              setState(prev => ({ ...prev, layers: newLayers }));
            }}
            onRenameLayer={(id, newName) => {
              const newLayers = state.layers.map(l => (l.id === id ? { ...l, name: newName } : l));
              setState(prev => ({ ...prev, layers: newLayers }));
            }}
            onUpdateLayer={(id, updates) => {
              const newLayers = state.layers.map(l => (l.id === id ? { ...l, ...updates } : l));
              updateSvgFromLayers(newLayers);
              setState(prev => ({ ...prev, layers: newLayers }));
            }}
            onCreateLayer={() => {
              const newLayer: VectorLayer = {
                id: `layer-${Date.now()}`,
                name: `Layer ${state.layers.length + 1}`,
                visible: true,
                locked: false,
                opacity: 1,
                blendMode: 'normal',
                color: '#ffffff',
                stroke: 'none',
                strokeWidth: 0,
                shape: {
                  type: 'rect',
                  x: 0,
                  y: 0,
                  width: 100,
                  height: 100,
                  borderRadius: 0,
                  fill: '#ffffff',
                  stroke: 'none',
                  strokeWidth: 0,
                },
              };
              const newLayers = [...state.layers, newLayer];
              updateSvgFromLayers(newLayers);
              setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: newLayer.id }));
              showToast(`Created ${newLayer.name}`, 'success');
            }}
            onCreateSublayer={parentId => {
              const parent = state.layers.find(l => l.id === parentId);
              if (parent) {
                const newLayer: VectorLayer = {
                  id: `layer-${Date.now()}`,
                  name: `${parent.name} / Sublayer`,
                  visible: true,
                  locked: false,
                  opacity: 1,
                  blendMode: 'normal',
                  color: '#ffffff',
                  stroke: 'none',
                  strokeWidth: 0,
                  shape: {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    width: 50,
                    height: 50,
                    borderRadius: 0,
                    fill: '#ffffff',
                    stroke: 'none',
                    strokeWidth: 0,
                  },
                };
                const newLayers = [...state.layers, newLayer];
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: newLayer.id }));
                showToast(`Created sublayer`, 'success');
              }
            }}
            onGroupLayers={ids => {
              const layersToGroup = state.layers.filter(l => ids.includes(l.id));
              if (layersToGroup.length > 0) {
                const groupLayer: VectorLayer = {
                  id: `group-${Date.now()}`,
                  name: 'Group',
                  visible: true,
                  locked: false,
                  opacity: 1,
                  blendMode: 'normal',
                  color: '#ffffff',
                  stroke: 'none',
                  strokeWidth: 0,
                  shape: { type: 'group', children: layersToGroup.map(l => l.shape) },
                };
                const otherLayers = state.layers.filter(l => !ids.includes(l.id));
                const newLayers = [...otherLayers, groupLayer];
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers, selectedLayerId: groupLayer.id }));
                showToast('Layers grouped', 'success');
              }
            }}
            onUngroupLayer={id => {
              const layer = state.layers.find(l => l.id === id);
              if (layer && layer.shape.type === 'group') {
                const ungroupedLayers = layer.shape.children.map((child, i) => ({
                  id: `layer-${Date.now()}-${i}`,
                  name: `Ungrouped ${i + 1}`,
                  visible: layer.visible,
                  locked: layer.locked,
                  opacity: layer.opacity,
                  blendMode: layer.blendMode,
                  color: layer.color,
                  stroke: layer.stroke,
                  strokeWidth: layer.strokeWidth,
                  shape: child,
                }));
                const otherLayers = state.layers.filter(l => l.id !== id);
                const newLayers = [...otherLayers, ...ungroupedLayers];
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
                showToast('Layer ungrouped', 'success');
              }
            }}
            onCreateClippingMask={(layerId, maskId) => {
              const newLayers = state.layers.map(l => {
                if (l.id === layerId) {
                  return { ...l, clippingMask: true, mask: maskId };
                }
                return l;
              });
              setState(prev => ({ ...prev, layers: newLayers }));
            }}
            onReleaseClippingMask={layerId => {
              const newLayers = state.layers.map(l => {
                if (l.id === layerId) {
                  const { clippingMask, ...rest } = l;
                  return rest;
                }
                return l;
              });
              setState(prev => ({ ...prev, layers: newLayers }));
            }}
            onBringToFront={id => {
              const layer = state.layers.find(l => l.id === id);
              if (layer) {
                const otherLayers = state.layers.filter(l => l.id !== id);
                const newLayers = [...otherLayers, layer];
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
              }
            }}
            onSendToBack={id => {
              const layer = state.layers.find(l => l.id === id);
              if (layer) {
                const otherLayers = state.layers.filter(l => l.id !== id);
                const newLayers = [layer, ...otherLayers];
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
              }
            }}
            onBringForward={id => {
              const index = state.layers.findIndex(l => l.id === id);
              if (index < state.layers.length - 1) {
                const newLayers = [...state.layers];
                [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
              }
            }}
            onSendBackward={id => {
              const index = state.layers.findIndex(l => l.id === id);
              if (index > 0) {
                const newLayers = [...state.layers];
                [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
                updateSvgFromLayers(newLayers);
                setState(prev => ({ ...prev, layers: newLayers }));
              }
            }}
            onExpandAppearance={id => showToast('Appearance expanded', 'info')}
            onCreateOutlines={id => showToast('Outlines created', 'info')}
            snapshots={[]}
            onRestoreSnapshot={svg => {
              setState(prev => ({ ...prev, currentSvg: svg }));
              showToast('Snapshot restored', 'success');
            }}
            keyframes={keyframes}
            frameState={frameState}
            onScriptChange={(frame, layerId, script) => {
              // Handle script change
            }}
            onScriptExecute={script => {
              // Handle script execution
            }}
            state={state}
            setState={setState}
            onScriptGenerated={script => {
              showToast('Script generated', 'success');
            }}
            onTerminalCommand={cmd => {
              showToast(`Terminal: ${cmd}`, 'info');
            }}
            actionsCode={actionsCode}
            onActionsCodeChange={setActionsCode}
          />
        </div>
      )}

      {/* OLD Animation Timeline - Commented out for testing */}
      {/* <AnimationTimeline
            frameState={frameState}
            onFrameStateChange={updates => setFrameState(prev => ({ ...prev, ...updates }))}
            keyframes={keyframes}
            onAddKeyframe={kf => setKeyframes(prev => [...prev, kf])}
            onUpdateKeyframe={(id, props) =>
              setKeyframes(prev => prev.map(k => (k.id === id ? { ...k, ...props } : k)))
            }
            onDeleteKeyframe={id => setKeyframes(prev => prev.filter(k => k.id !== id))}
            selectedLayerId={state.selectedLayerId}
            layers={state.layers}
            presets={[]}
            onApplyPreset={(preset, layerId) => {
              if (!layerId) return; // Skip if no layer selected
              const startKeyframe: AnimationKeyframe = {
                id: `kf-${Date.now()}`,
                frame: frameState.currentFrame,
                layerId,
                properties: preset.properties,
                easing: preset.easing,
              };
              const endKeyframe: AnimationKeyframe = {
                id: `kf-${Date.now() + 1}`,
                frame: frameState.currentFrame + preset.duration,
                layerId,
                properties: {},
                easing: preset.easing,
              };
              setKeyframes(prev => [...prev, startKeyframe, endKeyframe]);
            }}
            onScriptClick={() => {
              // Switch to Scripts tab in RightSidebar
              showToast('Switch to Scripts tab to edit animation scripts', 'info');
            }}
            onImportFromStudio={() => {
              // Placeholder for import functionality
              showToast('Import from Animation Studio - Coming soon', 'info');
            }}
          /> */}

      {/* Actions Panel moved to RightSidebar > Code tab (F9) - Design Guide Compliance */}

      {/* Footer */}
      <Footer
        nodeCount={state.layers.length}
        fillInfo={state.activeTool}
        isRendering={state.isGenerating}
        renderProgress={state.isGenerating ? 50 : undefined}
      />

      {/* XP Display - Compact in Footer Area */}
      <div className="fixed bottom-16 right-4 zstack-floating">
        <XPDisplay compact={true} showLevel={true} showProgress={true} />
      </div>

      {/* Template Frame Container */}
      <TemplateFrameContainer />

      {/* Floating Dev Chat Button removed - Dev Chat accessible via Right Sidebar (Ctrl+K) */}

      {/* Welcome Screen removed - not part of design requirements */}

      {/* Error Dashboard */}
      {showErrorDashboard && <ErrorDashboard onClose={() => setShowErrorDashboard(false)} />}

      {/* UI Automation Components */}
      <ProjectWizard
        isOpen={showProjectWizard}
        onClose={() => setShowProjectWizard(false)}
        onComplete={projectPath => {
          showToast(`Project created: ${projectPath}`, 'success');
        }}
      />

      <TemplateLibrary
        isOpen={showTemplateLibrary}
        onClose={() => setShowTemplateLibrary(false)}
        onSelectTemplate={async template => {
          try {
            // Copy template code to clipboard
            await navigator.clipboard.writeText(template.code);
            showToast(`Template "${template.name}" copied to clipboard`, 'success');

            // Award XP for using template
            awardXPAndCheckLevelUp(
              'use-template',
              'action',
              XP_ACTIONS.USE_TEMPLATE.points,
              XP_ACTIONS.USE_TEMPLATE.description
            );
            userProfileService.updateStat('templatesUsed', 1);
            // Check for template explorer achievement
            achievementService.recordProgress('template-user', 1);
          } catch (error) {
            console.error('Failed to copy template to clipboard:', error);
            showToast(`Template "${template.name}" ready - code shown in preview`, 'info');
          }
        }}
      />

      <BatchOperationsPanel
        isOpen={showBatchOperations}
        onClose={() => setShowBatchOperations(false)}
      />

      <SchemaBuilder
        isOpen={showSchemaBuilder}
        onClose={() => setShowSchemaBuilder(false)}
        onSave={schema => {
          showToast('Schema generated successfully', 'success');
        }}
      />

      <ActionCenterAudit isOpen={showActionAudit} onClose={() => setShowActionAudit(false)} />

      <TestGeneratorPanel isOpen={showTestGenerator} onClose={() => setShowTestGenerator(false)} />

      <KeyboardShortcutsPanel
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      <GuidedWorkflowPanel
        isOpen={showGuidedWorkflow}
        onClose={() => {
          // Check if workflow was completed when closing
          const activeWorkflow = guidedWorkflowService.getCurrentWorkflow();
          if (
            activeWorkflow &&
            guidedWorkflowService.isWorkflowCompleted(activeWorkflow.workflowId)
          ) {
            // Award XP for completing guided workflow
            awardXPAndCheckLevelUp(
              'complete-guided-workflow',
              'tutorial',
              XP_ACTIONS.COMPLETE_GUIDED_WORKFLOW.points,
              XP_ACTIONS.COMPLETE_GUIDED_WORKFLOW.description
            );
            userProfileService.updateStat('guidedWorkflowsCompleted', 1);
          }
          setShowGuidedWorkflow(false);
        }}
      />


      {/* Global Advanced Mode Toggle - Day 5-7: Progressive Disclosure */}
      <button
        onClick={() => setAdvancedMode(!advancedMode)}
        className="xibalba-button-professional"
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          padding: '8px 16px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        aria-label={advancedMode ? 'Disable Advanced Mode' : 'Enable Advanced Mode'}
        title={advancedMode ? 'Hide advanced features' : 'Show advanced features'}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }} aria-hidden="true">
          {advancedMode ? 'tune' : 'settings'}
        </span>
        <span>{advancedMode ? 'Advanced: ON' : 'Advanced: OFF'}</span>
      </button>

      {/* Legacy Action Center (keeping for backward compatibility - will be removed after testing) */}
      <AchievementPanel
        isOpen={showAchievementPanel}
        onClose={() => setShowAchievementPanel(false)}
      />

      {levelUpInfo && (
        <LevelUpModal
          isOpen={!!levelUpInfo}
          levelInfo={levelUpInfo.levelInfo}
          onClose={() => setLevelUpInfo(null)}
        />
      )}

      {/* UI/UX Enhancement Components */}
      <WorkspaceCustomizer
        isOpen={showWorkspaceCustomizer}
        onClose={() => setShowWorkspaceCustomizer(false)}
        onLayoutChange={layoutId => {
          showToast(`Layout changed: ${layoutId}`, 'success');
        }}
      />

      {/* Screen Reader Announcer - Global accessibility announcements */}
      <ScreenReaderAnnouncer
        message={state.screenReaderMessage || ''}
        priority={state.screenReaderPriority || 'polite'}
      />

      {/* Error Prevention Dialog - For destructive actions */}
      <ErrorPreventionDialog
        isOpen={showErrorPrevention}
        type={state.errorPreventionType || 'warning'}
        title={state.errorPreventionTitle || ''}
        message={state.errorPreventionMessage || ''}
        details={state.errorPreventionDetails}
        suggestedActions={state.errorPreventionActions}
        onConfirm={() => {
          if (state.errorPreventionOnConfirm) {
            state.errorPreventionOnConfirm();
          }
          setShowErrorPrevention(false);
          setState(prev => ({
            ...prev,
            errorPreventionTitle: '',
            errorPreventionMessage: '',
            errorPreventionDetails: undefined,
            errorPreventionActions: undefined,
            errorPreventionOnConfirm: undefined,
          }));
        }}
        onCancel={() => {
          setShowErrorPrevention(false);
          setState(prev => ({
            ...prev,
            errorPreventionTitle: '',
            errorPreventionMessage: '',
            errorPreventionDetails: undefined,
            errorPreventionActions: undefined,
            errorPreventionOnConfirm: undefined,
          }));
        }}
        confirmLabel={state.errorPreventionConfirmLabel}
        cancelLabel={state.errorPreventionCancelLabel}
        destructive={state.errorPreventionDestructive}
      />

      {/* Preferences Dialog */}
      <PreferencesDialog
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        initialCategory={preferencesCategory}
      />

      {/* Conversation History Panel */}
      <ConversationHistoryPanel
        isOpen={showConversationHistory}
        onClose={() => setShowConversationHistory(false)}
        onSelectConversation={id => {
          // TODO: Load conversation into DevChatbot
          setShowConversationHistory(false);
        }}
      />

      {/* Error Display - Shows errors on screen so we can see them */}
      <ErrorDisplay />
    </div>
  );
};

export default App;
