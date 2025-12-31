/**
 * Action Center Audit Component
 * Visual checklist for menu actions, one-click fixes
 *
 * Accessibility: Screen reader support, keyboard navigation, clear status indicators
 * Design: Checklist with status badges, filter buttons, one-click fix
 *
 * #hashtag: menu-audit action-handlers accessibility
 */

import React, { useState, useMemo, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { menuActionAuditService, MenuAction } from '../services/menuActionAuditService';
import { menuASTParser, MenuStructure } from '../services/menuASTParser';

interface ActionCenterAuditProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActionCenterAudit: React.FC<ActionCenterAuditProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'done' | 'needs-work' | 'missing'>('all');
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [menuActions, setMenuActions] = useState<MenuAction[]>([]);
  const [menuStructure, setMenuStructure] = useState<MenuStructure | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [selectedAction, setSelectedAction] = useState<MenuAction | null>(null);
  const [qualityMetrics, setQualityMetrics] = useState<any>(null);
  const [showQualityCheck, setShowQualityCheck] = useState(false);
  const [showTestGenerator, setShowTestGenerator] = useState(false);
  const [testCode, setTestCode] = useState<string>('');

  // Load menu actions on mount
  useEffect(() => {
    if (isOpen) {
      loadMenuActions();
      loadMenuStructure();
    }
  }, [isOpen]);

  const loadMenuStructure = async () => {
    try {
      const structure = await menuASTParser.parseMenuStructure();
      setMenuStructure(structure);
    } catch (error) {
      console.error('Failed to load menu structure:', error);
    }
  };

  const handleQualityCheck = async (action: MenuAction) => {
    setSelectedAction(action);
    setShowQualityCheck(true);
    setIsLoading(true);
    try {
      const metrics = await menuASTParser.analyzeHandlerQuality(action.id);
      setQualityMetrics(metrics);
    } catch (error) {
      console.error('Failed to analyze handler quality:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTest = async (action: MenuAction) => {
    setSelectedAction(action);
    setShowTestGenerator(true);
    setIsLoading(true);
    try {
      const code = await menuASTParser.generateHandlerTest(action.id);
      setTestCode(code);
    } catch (error) {
      console.error('Failed to generate test:', error);
      setTestCode('// Failed to generate test code');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMenuActions = async () => {
    setIsLoading(true);
    try {
      const actions = await menuActionAuditService.auditMenuActions();
      setMenuActions(actions);
    } catch (error) {
      console.error('Failed to load menu actions:', error);
      // Keep empty array, component will show empty state
    } finally {
      setIsLoading(false);
    }
  };

  const filteredActions = useMemo(() => {
    if (filter === 'all') return menuActions;
    return menuActions.filter(action => action.status === filter);
  }, [filter]);

  const stats = useMemo(() => {
    return {
      total: menuActions.length,
      done: menuActions.filter(a => a.status === 'done').length,
      needsWork: menuActions.filter(a => a.status === 'needs-work').length,
      missing: menuActions.filter(a => a.status === 'missing').length,
    };
  }, []);

  const toggleActionSelection = (actionId: string) => {
    const newSelection = new Set(selectedActions);
    if (newSelection.has(actionId)) {
      newSelection.delete(actionId);
    } else {
      newSelection.add(actionId);
    }
    setSelectedActions(newSelection);
  };

  const handleGenerateHandlers = async () => {
    if (selectedActions.size === 0) {
      const missingActions = menuActions.filter(
        a => a.status === 'missing' || a.status === 'needs-work'
      );
      setSelectedActions(new Set(missingActions.map(a => a.id)));
      return;
    }

    setIsGenerating(true);
    setGeneratedCount(0);
    setProgressMessage('');

    try {
      const actionsToGenerate = Array.from(selectedActions);

      // Generate handlers
      const results = await menuActionAuditService.generateHandlers(
        actionsToGenerate,
        (progress, message) => {
          setGeneratedCount(Math.floor((progress / 100) * actionsToGenerate.length));
          setProgressMessage(message);
        }
      );

      // Check for errors
      const errors = results.filter(r => !r.success);
      if (errors.length > 0) {
        console.error('Some handlers failed to generate:', errors);
        // Could show error toast here
      }

      // Reload menu actions to update status
      await loadMenuActions();

      // Clear selection after successful generation
      if (errors.length === 0) {
        setSelectedActions(new Set());
      }
    } catch (error) {
      console.error('Failed to generate handlers:', error);
    } finally {
      setIsGenerating(false);
      setProgressMessage('');
    }
  };

  const getStatusIcon = (status: MenuAction['status']) => {
    switch (status) {
      case 'done':
        return '✅';
      case 'needs-work':
        return '⚠️';
      case 'missing':
        return '❌';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: MenuAction['status']) => {
    switch (status) {
      case 'done':
        return 'text-[var(--vectorforge-accent)]';
      case 'needs-work':
        return 'text-[var(--vectorforge-accent)]';
      case 'missing':
        return 'text-[var(--vectorforge-accent)]';
      default:
        return 'text-[var(--xibalba-text-100)]';
    }
  };

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 zstack-modal-backdrop flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-audit-title"
      >
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg w-[90vw] max-w-5xl h-[85vh] max-h-[700px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]"
                aria-hidden="true"
              >
                checklist
              </span>
              <h2
                id="action-audit-title"
                className="text-xl font-bold text-[var(--xibalba-text-000)]"
              >
                Menu Action Audit
              </h2>
            </div>
            <button
              onClick={onClose}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Close action audit"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-100)]">
                close
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="px-6 py-4 border-b border-white/10">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--xibalba-text-000)]">
                  {stats.total}
                </div>
                <div className="text-sm text-[var(--xibalba-text-100)]">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--vectorforge-accent)]">{stats.done}</div>
                <div className="text-sm text-[var(--xibalba-text-100)]">Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--vectorforge-accent)]">{stats.needsWork}</div>
                <div className="text-sm text-[var(--xibalba-text-100)]">Needs Work</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--vectorforge-accent)]">{stats.missing}</div>
                <div className="text-sm text-[var(--xibalba-text-100)]">Missing</div>
              </div>
            </div>
            {menuStructure && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-sm text-[var(--xibalba-text-100)]">
                  Menu Structure: {menuStructure.totalActions} total actions,{' '}
                  {menuStructure.implementedActions} implemented,{' '}
                  {menuStructure.missingActions.length} missing
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] ${
                  filter === 'all'
                    ? 'bg-[var(--xibalba-accent)] text-white'
                    : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-100)] hover:bg-[var(--xibalba-grey-200)]'
                }`}
                aria-pressed={filter === 'all'}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter('done')}
                className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] ${
                  filter === 'done'
                    ? 'bg-[var(--xibalba-accent)] text-white'
                    : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-100)] hover:bg-[var(--xibalba-grey-200)]'
                }`}
                aria-pressed={filter === 'done'}
              >
                Done ({stats.done})
              </button>
              <button
                onClick={() => setFilter('needs-work')}
                className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] ${
                  filter === 'needs-work'
                    ? 'bg-[var(--xibalba-accent)] text-white'
                    : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-100)] hover:bg-[var(--xibalba-grey-200)]'
                }`}
                aria-pressed={filter === 'needs-work'}
              >
                Needs Work ({stats.needsWork})
              </button>
              <button
                onClick={() => setFilter('missing')}
                className={`px-4 py-2 rounded-lg transition-colors min-h-[44px] ${
                  filter === 'missing'
                    ? 'bg-[var(--xibalba-accent)] text-white'
                    : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-100)] hover:bg-[var(--xibalba-grey-200)]'
                }`}
                aria-pressed={filter === 'missing'}
              >
                Missing ({stats.missing})
              </button>
            </div>
          </div>

          {/* Checklist */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-[var(--xibalba-text-100)]">Loading menu actions...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredActions.map(action => {
                  const isSelected = selectedActions.has(action.id);
                  return (
                    <div
                      key={action.id}
                      className={`p-4 border-2 rounded-lg transition-all flex items-start gap-3 min-h-[80px] ${
                        isSelected
                          ? 'border-[var(--xibalba-accent)] bg-[var(--xibalba-grey-100)]'
                          : 'border-[var(--xibalba-grey-100)] hover:border-[var(--xibalba-accent)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleActionSelection(action.id)}
                        className="w-5 h-5 mt-1 cursor-pointer"
                        aria-label={`Select ${action.label}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xl" aria-label={`Status: ${action.status}`}>
                            {getStatusIcon(action.status)}
                          </span>
                          <span className={`font-semibold ${getStatusColor(action.status)}`}>
                            {action.label}
                          </span>
                          <span className="px-2 py-1 text-xs bg-[var(--xibalba-grey-200)] text-[var(--xibalba-text-100)] rounded">
                            {action.category}
                          </span>
                        </div>
                        {action.description && (
                          <p className="text-sm text-[var(--xibalba-text-100)]">
                            {action.description}
                          </p>
                        )}
                        <div className="mt-2 text-xs text-[var(--xibalba-text-100)] font-mono">
                          ID: {action.id}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {action.handlerExists && (
                          <>
                            <button
                              onClick={() => handleQualityCheck(action)}
                              className="xibalba-button-secondary min-w-[100px] min-h-[44px] text-sm"
                              aria-label={`Check quality for ${action.label}`}
                            >
                              <span
                                className="material-symbols-outlined mr-1 text-sm"
                                aria-hidden="true"
                              >
                                analytics
                              </span>
                              Quality
                            </button>
                            <button
                              onClick={() => handleGenerateTest(action)}
                              className="xibalba-button-secondary min-w-[100px] min-h-[44px] text-sm"
                              aria-label={`Generate test for ${action.label}`}
                            >
                              <span
                                className="material-symbols-outlined mr-1 text-sm"
                                aria-hidden="true"
                              >
                                science
                              </span>
                              Test
                            </button>
                          </>
                        )}
                        {(action.status === 'missing' || action.status === 'needs-work') && (
                          <button
                            onClick={() => {
                              setSelectedActions(new Set([action.id]));
                              handleGenerateHandlers();
                            }}
                            className="xibalba-button-secondary min-w-[120px] min-h-[44px]"
                            aria-label={`Generate handler for ${action.label}`}
                          >
                            <span className="material-symbols-outlined mr-2" aria-hidden="true">
                              code
                            </span>
                            Generate
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isLoading && filteredActions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[var(--xibalba-text-100)]">No actions found</p>
                <p className="text-sm text-[var(--xibalba-text-100)] mt-2">
                  Try adjusting your filter
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10">
            <div className="text-sm text-[var(--xibalba-text-100)]" aria-live="polite">
              {selectedActions.size > 0 && !isGenerating && (
                <span>
                  {selectedActions.size} action{selectedActions.size !== 1 ? 's' : ''} selected
                </span>
              )}
              {isGenerating && (
                <div>
                  <div>
                    Generating handlers... {generatedCount} of {selectedActions.size}
                  </div>
                  {progressMessage && <div className="text-xs mt-1">{progressMessage}</div>}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="xibalba-button-secondary min-w-[120px] min-h-[44px]"
                aria-label="Close"
              >
                Close
              </button>
              <button
                onClick={handleGenerateHandlers}
                disabled={isGenerating || (selectedActions.size === 0 && filter === 'all')}
                className="xibalba-button-primary min-w-[180px] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Generate handlers for selected actions"
              >
                {selectedActions.size === 0 ? (
                  <>
                    <span className="material-symbols-outlined mr-2" aria-hidden="true">
                      auto_fix
                    </span>
                    Fix All Missing
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2" aria-hidden="true">
                      code
                    </span>
                    Generate Handlers
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Check Modal */}
      {showQualityCheck && selectedAction && (
        <div
          className="fixed inset-0 zstack-dialog flex items-center justify-center bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quality-check-title"
        >
          <div className="xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg w-[90vw] max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3
                id="quality-check-title"
                className="text-xl font-bold text-[var(--xibalba-text-000)]"
              >
                Handler Quality Analysis: {selectedAction.label}
              </h3>
              <button
                onClick={() => {
                  setShowQualityCheck(false);
                  setQualityMetrics(null);
                }}
                className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
                aria-label="Close quality check"
              >
                <span className="material-symbols-outlined text-[var(--xibalba-text-100)]">
                  close
                </span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-[var(--xibalba-text-100)]">Analyzing handler...</p>
                </div>
              ) : qualityMetrics ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                      <div className="text-sm text-[var(--xibalba-text-100)] mb-1">
                        Handler Exists
                      </div>
                      <div
                        className={`text-lg font-bold ${qualityMetrics.exists ? 'text-[var(--vectorforge-accent)]' : 'text-[var(--vectorforge-accent)]'}`}
                      >
                        {qualityMetrics.exists ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                      <div className="text-sm text-[var(--xibalba-text-100)] mb-1">Complexity</div>
                      <div className="text-lg font-bold text-[var(--xibalba-text-000)]">
                        {qualityMetrics.complexity}
                      </div>
                    </div>
                    <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                      <div className="text-sm text-[var(--xibalba-text-100)] mb-1">
                        Error Handling
                      </div>
                      <div
                        className={`text-lg font-bold ${qualityMetrics.hasErrorHandling ? 'text-[var(--vectorforge-accent)]' : 'text-[var(--vectorforge-accent)]'}`}
                      >
                        {qualityMetrics.hasErrorHandling ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                      <div className="text-sm text-[var(--xibalba-text-100)] mb-1">Logging</div>
                      <div
                        className={`text-lg font-bold ${qualityMetrics.hasLogging ? 'text-[var(--vectorforge-accent)]' : 'text-[var(--vectorforge-accent)]'}`}
                      >
                        {qualityMetrics.hasLogging ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                  {qualityMetrics.suggestions && qualityMetrics.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-[var(--xibalba-text-000)] mb-2">
                        Suggestions
                      </h4>
                      <ul className="space-y-2">
                        {qualityMetrics.suggestions.map((suggestion: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-[var(--xibalba-text-100)]"
                          >
                            <span
                              className="material-symbols-outlined text-[var(--xibalba-accent)] text-sm mt-0.5"
                              aria-hidden="true"
                            >
                              lightbulb
                            </span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[var(--xibalba-text-100)]">No quality metrics available</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end p-6 border-t border-white/10">
              <button
                onClick={() => {
                  setShowQualityCheck(false);
                  setQualityMetrics(null);
                }}
                className="xibalba-button-secondary min-w-[120px] min-h-[44px]"
                aria-label="Close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Generator Modal */}
      {showTestGenerator && selectedAction && (
        <div
          className="fixed inset-0 zstack-dialog flex items-center justify-center bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="test-generator-title"
        >
          <div className="xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg w-[90vw] max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3
                id="test-generator-title"
                className="text-xl font-bold text-[var(--xibalba-text-000)]"
              >
                Test Code Generator: {selectedAction.label}
              </h3>
              <button
                onClick={() => {
                  setShowTestGenerator(false);
                  setTestCode('');
                }}
                className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
                aria-label="Close test generator"
              >
                <span className="material-symbols-outlined text-[var(--xibalba-text-100)]">
                  close
                </span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-[var(--xibalba-text-100)]">Generating test code...</p>
                </div>
              ) : (
                <pre className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg overflow-x-auto text-sm font-mono text-[var(--xibalba-text-000)]">
                  <code>{testCode || '// No test code generated'}</code>
                </pre>
              )}
            </div>
            <div className="flex items-center justify-end gap-4 p-6 border-t border-white/10">
              <button
                onClick={() => {
                  if (testCode) {
                    navigator.clipboard.writeText(testCode);
                  }
                }}
                className="xibalba-button-secondary min-w-[120px] min-h-[44px]"
                aria-label="Copy test code"
              >
                <span className="material-symbols-outlined mr-2" aria-hidden="true">
                  content_copy
                </span>
                Copy Code
              </button>
              <button
                onClick={() => {
                  setShowTestGenerator(false);
                  setTestCode('');
                }}
                className="xibalba-button-primary min-w-[120px] min-h-[44px]"
                aria-label="Close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default ActionCenterAudit;
