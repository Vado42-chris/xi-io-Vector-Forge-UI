/**
 * Guided Workflow Panel Component
 * Displays step-by-step tutorials and interactive help
 * 
 * #hashtag: guided-workflow component
 */

import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { guidedWorkflowService, GuidedWorkflow, WorkflowStep } from '../services/guidedWorkflowService';

interface GuidedWorkflowPanelProps {
  isOpen: boolean;
  onClose: () => void;
  workflowId?: string; // Optional: start with specific workflow
}

const GuidedWorkflowPanel: React.FC<GuidedWorkflowPanelProps> = ({ isOpen, onClose, workflowId }) => {
  const [workflows, setWorkflows] = useState<GuidedWorkflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<GuidedWorkflow | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadWorkflows();
      if (workflowId) {
        const workflow = guidedWorkflowService.getWorkflow(workflowId);
        if (workflow) {
          setSelectedWorkflow(workflow);
          startWorkflow(workflowId);
        }
      }
    }
  }, [isOpen, workflowId]);

  useEffect(() => {
    if (isActive) {
      updateCurrentStep();
    }
  }, [isActive]);

  const loadWorkflows = () => {
    const allWorkflows = guidedWorkflowService.getAllWorkflows();
    setWorkflows(allWorkflows);
  };

  const startWorkflow = (id: string) => {
    if (guidedWorkflowService.startWorkflow(id)) {
      setIsActive(true);
      setCurrentStepIndex(0);
      updateCurrentStep();
    }
  };

  const updateCurrentStep = () => {
    const step = guidedWorkflowService.getCurrentStep();
    const progress = guidedWorkflowService.getCurrentWorkflow();
    if (step && progress) {
      setCurrentStep(step);
      setCurrentStepIndex(progress.currentStep);
    } else {
      setIsActive(false);
      setCurrentStep(null);
    }
  };

  const handleNext = () => {
    if (guidedWorkflowService.nextStep()) {
      updateCurrentStep();
    } else {
      // Workflow completed
      setIsActive(false);
      setCurrentStep(null);
    }
  };

  const handlePrevious = () => {
    if (guidedWorkflowService.previousStep()) {
      updateCurrentStep();
    }
  };

  const handleCompleteStep = (stepId: string) => {
    guidedWorkflowService.completeStep(stepId);
    updateCurrentStep();
  };

  const handleCancel = () => {
    guidedWorkflowService.cancelWorkflow();
    setIsActive(false);
    setCurrentStep(null);
    setSelectedWorkflow(null);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-[var(--vectorforge-accent)]';
      case 'intermediate': return 'text-[var(--vectorforge-accent)]';
      case 'advanced': return 'text-[var(--vectorforge-accent)]';
      default: return 'text-[var(--xibalba-text-100)]';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'onboarding': return 'school';
      case 'feature': return 'featured_play_list';
      case 'troubleshooting': return 'bug_report';
      case 'advanced': return 'rocket_launch';
      default: return 'help';
    }
  };

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 zstack-modal-backdrop flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guided-workflow-title"
      >
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] rounded-lg w-[90vw] max-w-5xl h-[85vh] max-h-[700px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]" aria-hidden="true">
                school
              </span>
              <h2 id="guided-workflow-title" className="text-xl font-bold text-[var(--xibalba-text-000)]">
                Guided Workflows
              </h2>
            </div>
            <button
              onClick={onClose}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Close guided workflows"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-100)]" aria-hidden="true" data-icon="close"></span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {!isActive ? (
              /* Workflow Selection */
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[var(--xibalba-text-000)] mb-2">Available Workflows</h3>
                  <p className="text-sm text-[var(--xibalba-text-100)]">
                    Choose a workflow to get step-by-step guidance
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workflows.map((workflow) => {
                    const completion = guidedWorkflowService.getCompletionPercentage(workflow.id);
                    const isCompleted = guidedWorkflowService.isWorkflowCompleted(workflow.id);

                    return (
                      <div
                        key={workflow.id}
                        className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg hover:bg-[var(--xibalba-grey-150)] transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedWorkflow(workflow);
                          startWorkflow(workflow.id);
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Start workflow: ${workflow.name}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[var(--xibalba-accent)]" aria-hidden="true">
                              {getCategoryIcon(workflow.category)}
                            </span>
                            <h4 className="font-semibold text-[var(--xibalba-text-000)]">{workflow.name}</h4>
                          </div>
                          {isCompleted && (
                            <span className="material-symbols-outlined text-[var(--vectorforge-accent)] text-sm" aria-label="Completed">
                              check_circle
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--xibalba-text-100)] mb-3">{workflow.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            {workflow.difficulty && (
                              <span className={getDifficultyColor(workflow.difficulty)}>
                                {workflow.difficulty}
                              </span>
                            )}
                            {workflow.estimatedTime && (
                              <span className="text-[var(--xibalba-text-100)]">
                                ~{workflow.estimatedTime} min
                              </span>
                            )}
                            <span className="text-[var(--xibalba-text-100)]">
                              {workflow.steps.length} steps
                            </span>
                          </div>
                          {completion > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-[var(--xibalba-grey-200)] rounded-full overflow-hidden">
                                <div
                                  className="workflow-progress-fill"
                                  style={{ '--workflow-progress': `${completion}%` } as React.CSSProperties}
                                  role="progressbar"
                                  aria-valuenow={completion}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                />
                              </div>
                              <span className="text-[var(--xibalba-text-100)]">{Math.round(completion)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Active Workflow Steps */
              <div className="flex-1 overflow-y-auto p-6">
                {selectedWorkflow && currentStep && (
                  <>
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-[var(--xibalba-text-000)]">
                          {selectedWorkflow.name}
                        </h3>
                        <span className="text-sm text-[var(--xibalba-text-100)]">
                          Step {currentStepIndex + 1} of {selectedWorkflow.steps.length}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[var(--xibalba-grey-200)] rounded-full overflow-hidden">
                        <div
                          className="workflow-progress-fill"
                          style={{ '--workflow-progress': `${((currentStepIndex + 1) / selectedWorkflow.steps.length) * 100}%` } as React.CSSProperties}
                          role="progressbar"
                          aria-valuenow={currentStepIndex + 1}
                          aria-valuemin={0}
                          aria-valuemax={selectedWorkflow.steps.length}
                        />
                      </div>
                    </div>

                    {/* Current Step */}
                    <div className="bg-[var(--xibalba-grey-100)] p-6 rounded-lg mb-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--xibalba-accent)] flex items-center justify-center text-white font-bold">
                          {currentStepIndex + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-[var(--xibalba-text-000)] mb-2">
                            {currentStep.title}
                          </h4>
                          <p className="text-[var(--xibalba-text-100)] mb-4">{currentStep.description}</p>
                          {currentStep.action && (
                            <div className="bg-[var(--xibalba-grey-200)] p-3 rounded-lg mb-3">
                              <p className="text-sm font-semibold text-[var(--xibalba-text-000)] mb-1">Action:</p>
                              <p className="text-sm text-[var(--xibalba-text-100)]">{currentStep.action}</p>
                            </div>
                          )}
                          {currentStep.hint && (
                            <div className="bg-[var(--xibalba-accent)]/20 p-3 rounded-lg">
                              <p className="text-sm font-semibold text-[var(--xibalba-accent)] mb-1 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm" aria-hidden="true" data-icon="lightbulb"></span>
                                Hint
                              </p>
                              <p className="text-sm text-[var(--xibalba-text-100)]">{currentStep.hint}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Step List */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">All Steps:</h5>
                      {selectedWorkflow.steps.map((step, index) => (
                        <div
                          key={step.id}
                          className={`p-3 rounded-lg transition-all ${
                            index === currentStepIndex
                              ? 'bg-[var(--xibalba-grey-100)]'
                              : index < currentStepIndex
                              ? 'bg-[var(--vectorforge-accent)]/10'
                              : 'bg-[var(--xibalba-grey-050)]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {index < currentStepIndex ? (
                              <span className="material-symbols-outlined text-[var(--vectorforge-accent)] text-sm" aria-label="Completed">
                                check_circle
                              </span>
                            ) : (
                              <span className="text-sm font-semibold text-[var(--xibalba-text-100)] w-6">
                                {index + 1}
                              </span>
                            )}
                            <span className="text-sm text-[var(--xibalba-text-000)]">{step.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6">
            {isActive ? (
              <>
                <button
                  onClick={handleCancel}
                  className="xibalba-button-secondary min-w-[120px] min-h-[44px]"
                  aria-label="Cancel workflow"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStepIndex === 0}
                    className="xibalba-button-secondary min-w-[120px] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous step"
                  >
                    <span className="material-symbols-outlined mr-2" aria-hidden="true" data-icon="arrow_back"></span>
                    Previous
                  </button>
                  <button
                    onClick={() => currentStep && handleCompleteStep(currentStep.id)}
                    className="xibalba-button-secondary min-w-[120px] min-h-[44px]"
                    aria-label="Mark step as complete"
                  >
                    <span className="material-symbols-outlined mr-2" aria-hidden="true" data-icon="check"></span>
                    Complete Step
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentStepIndex >= (selectedWorkflow?.steps.length || 0) - 1}
                    className="xibalba-button-primary min-w-[120px] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next step"
                  >
                    Next
                    <span className="material-symbols-outlined ml-2" aria-hidden="true" data-icon="arrow_forward"></span>
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onClose}
                className="xibalba-button-primary min-w-[120px] min-h-[44px] ml-auto"
                aria-label="Close"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default GuidedWorkflowPanel;

