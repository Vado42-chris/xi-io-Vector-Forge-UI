/**
 * Project Wizard Component
 * Visual wizard to set up new projects, generate file structures
 * 
 * Accessibility: Screen reader support, keyboard navigation, high contrast
 * Design: Large buttons (44x44px), clear hierarchy, icons + text labels
 * 
 * #hashtag: project-setup wizard accessibility
 */

import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { useFileSystem } from '../hooks/useFileSystem';
import { projectWizardService, ProjectConfig } from '../services/projectWizardService';
import ProgressBarFill from './ProgressBarFill';

interface ProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (projectPath: string) => void;
}

type WizardStep = 'welcome' | 'details' | 'template' | 'features' | 'review' | 'creating';

interface ProjectDetails {
  name: string;
  type: 'react' | 'node' | 'typescript' | 'vanilla' | 'custom';
  location: string;
}

interface ProjectFeature {
  id: string;
  label: string;
  description: string;
  icon: string;
  selected: boolean;
}

const ProjectWizard: React.FC<ProjectWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    name: '',
    type: 'react',
    location: '.',
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [features, setFeatures] = useState<ProjectFeature[]>([
    { id: 'typescript', label: 'TypeScript', description: 'Add TypeScript support', icon: 'code', selected: false },
    { id: 'testing', label: 'Testing', description: 'Add Jest and testing setup', icon: 'science', selected: false },
    { id: 'linting', label: 'Linting', description: 'Add ESLint and Prettier', icon: 'checklist', selected: false },
    { id: 'git', label: 'Git', description: 'Initialize Git repository', icon: 'folder', selected: false },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  const fileSystem = useFileSystem();

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('welcome');
      setProjectDetails({ name: '', type: 'react', location: '.' });
      setSelectedTemplate(null);
      setFeatures(features.map(f => ({ ...f, selected: false })));
      setError(null);
    }
  }, [isOpen]);

  const handleNext = () => {
    setError(null);
    
    if (currentStep === 'welcome') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      if (!projectDetails.name.trim()) {
        setError('Project name is required');
        return;
      }
      setCurrentStep('template');
    } else if (currentStep === 'template') {
      setCurrentStep('features');
    } else if (currentStep === 'features') {
      setCurrentStep('review');
    } else if (currentStep === 'review') {
      handleCreate();
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep === 'details') {
      setCurrentStep('welcome');
    } else if (currentStep === 'template') {
      setCurrentStep('details');
    } else if (currentStep === 'features') {
      setCurrentStep('template');
    } else if (currentStep === 'review') {
      setCurrentStep('features');
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    setCurrentStep('creating');
    setError(null);
    setProgress(0);
    setProgressMessage('');

    try {
      // Validate project name
      const validation = projectWizardService.validateProjectName(projectDetails.name);
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid project name');
      }

      // Create project configuration
      const config: ProjectConfig = {
        name: projectDetails.name,
        type: projectDetails.type,
        location: projectDetails.location,
        template: selectedTemplate || undefined,
        features: features.filter(f => f.selected).map(f => f.id),
      };

      // Create project with progress tracking
      const projectPath = await projectWizardService.createProject(
        config,
        (progressValue, message) => {
          setProgress(progressValue);
          setProgressMessage(message);
        }
      );
      
      if (onComplete) {
        onComplete(projectPath);
      }
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      setCurrentStep('review');
    } finally {
      setIsCreating(false);
      setProgress(0);
      setProgressMessage('');
    }
  };

  const toggleFeature = (featureId: string) => {
    setFeatures(features.map(f => 
      f.id === featureId ? { ...f, selected: !f.selected } : f
    ));
  };

  const templates = [
    { id: 'react', label: 'React App', description: 'Create React application', icon: '⚛️' },
    { id: 'node', label: 'Node.js', description: 'Create Node.js project', icon: '🟢' },
    { id: 'typescript', label: 'TypeScript', description: 'Create TypeScript project', icon: '📘' },
    { id: 'vanilla', label: 'Vanilla JS', description: 'Create vanilla JavaScript project', icon: '📄' },
  ];

  const stepLabels = ['Welcome', 'Details', 'Template', 'Features', 'Review', 'Creating'];
  const currentStepIndex = ['welcome', 'details', 'template', 'features', 'review', 'creating'].indexOf(currentStep);

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div 
        className="fixed inset-0 zstack-modal-backdrop flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-wizard-title"
      >
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] rounded-lg w-[90vw] max-w-3xl h-[85vh] max-h-[700px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]" aria-hidden="true">
                folder
              </span>
              <h2 id="project-wizard-title" className="text-xl font-bold text-[var(--xibalba-text-000)]">
                Set Up New Project
              </h2>
            </div>
            <button
              onClick={onClose}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Close project wizard"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-100)]">close</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4">
            <div className="flex items-center gap-2 mb-2">
              {stepLabels.map((label, index) => (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        index <= currentStepIndex
                          ? 'bg-[var(--xibalba-accent)] text-white'
                          : 'bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-100)]'
                      }`}
                      aria-label={`Step ${index + 1}: ${label}`}
                    >
                      {index + 1}
                    </div>
                    {index < stepLabels.length - 1 && (
                      <div
                        className={`h-1 w-12 transition-colors ${
                          index < currentStepIndex
                            ? 'bg-[var(--xibalba-accent)]'
                            : 'bg-[var(--xibalba-grey-100)]'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <p className="text-sm text-[var(--xibalba-text-100)]" aria-live="polite">
              Step {currentStepIndex + 1} of {stepLabels.length}: {stepLabels[currentStepIndex]}
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {currentStep === 'welcome' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--xibalba-text-000)] mb-4">
                    Welcome to Project Setup
                  </h3>
                  <p className="text-[var(--xibalba-text-100)] text-lg">
                    Let's set up your new project. This wizard will guide you through:
                  </p>
                </div>
                <ul className="space-y-3 list-none">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[var(--xibalba-accent)] mt-1" aria-hidden="true">
                      check_circle
                    </span>
                    <span className="text-[var(--xibalba-text-100)]">Choose project name and type</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[var(--xibalba-accent)] mt-1" aria-hidden="true">
                      check_circle
                    </span>
                    <span className="text-[var(--xibalba-text-100)]">Select a template</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[var(--xibalba-accent)] mt-1" aria-hidden="true">
                      check_circle
                    </span>
                    <span className="text-[var(--xibalba-text-100)]">Add optional features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[var(--xibalba-accent)] mt-1" aria-hidden="true">
                      check_circle
                    </span>
                    <span className="text-[var(--xibalba-text-100)]">Review and create</span>
                  </li>
                </ul>
              </div>
            )}

            {currentStep === 'details' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[var(--xibalba-text-000)]">Project Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="project-name" className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                      Project Name *
                    </label>
                    <input
                      id="project-name"
                      type="text"
                      value={projectDetails.name}
                      onChange={(e) => setProjectDetails({ ...projectDetails, name: e.target.value })}
                      className="xibalba-input w-full min-h-[44px] px-4 py-2"
                      placeholder="my-awesome-project"
                      aria-required="true"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label htmlFor="project-type" className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                      Project Type
                    </label>
                    <select
                      id="project-type"
                      value={projectDetails.type}
                      onChange={(e) => setProjectDetails({ ...projectDetails, type: e.target.value as ProjectDetails['type'] })}
                      className="xibalba-input w-full min-h-[44px] px-4 py-2"
                    >
                      <option value="react">React App</option>
                      <option value="node">Node.js</option>
                      <option value="typescript">TypeScript</option>
                      <option value="vanilla">Vanilla JavaScript</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="project-location" className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                      Location
                    </label>
                    <input
                      id="project-location"
                      type="text"
                      value={projectDetails.location}
                      onChange={(e) => setProjectDetails({ ...projectDetails, location: e.target.value })}
                      className="xibalba-input w-full min-h-[44px] px-4 py-2"
                      placeholder="."
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'template' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[var(--xibalba-text-000)]">Choose Template</h3>
                <p className="text-[var(--xibalba-text-100)]">
                  Select a template to start with. You can customize it later.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 border-2 rounded-lg transition-all min-h-[120px] flex flex-col items-center justify-center gap-2 ${
                        selectedTemplate === template.id
                          ? 'border-[var(--xibalba-accent)] bg-[var(--xibalba-grey-100)]'
                          : 'border-[var(--xibalba-grey-100)] hover:border-[var(--xibalba-accent)]'
                      }`}
                      aria-pressed={selectedTemplate === template.id}
                    >
                      <span className="text-3xl" aria-hidden="true">{template.icon}</span>
                      <span className="font-semibold text-[var(--xibalba-text-000)]">{template.label}</span>
                      <span className="text-sm text-[var(--xibalba-text-100)]">{template.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 'features' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[var(--xibalba-text-000)]">Optional Features</h3>
                <p className="text-[var(--xibalba-text-100)]">
                  Select additional features to include in your project.
                </p>
                
                <div className="space-y-3">
                  {features.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`w-full p-4 border-2 rounded-lg transition-all text-left flex items-start gap-3 min-h-[80px] ${
                        feature.selected
                          ? 'border-[var(--xibalba-accent)] bg-[var(--xibalba-grey-100)]'
                          : 'border-[var(--xibalba-grey-100)] hover:border-[var(--xibalba-accent)]'
                      }`}
                      aria-pressed={feature.selected}
                    >
                      <span className="material-symbols-outlined text-[var(--xibalba-accent)] mt-1" aria-hidden="true">
                        {feature.icon}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-[var(--xibalba-text-000)]">{feature.label}</div>
                        <div className="text-sm text-[var(--xibalba-text-100)]">{feature.description}</div>
                      </div>
                      <span className="material-symbols-outlined text-[var(--xibalba-accent)]" aria-hidden="true">
                        {feature.selected ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 'review' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[var(--xibalba-text-000)]">Review</h3>
                <p className="text-[var(--xibalba-text-100)]">
                  Review your project settings before creating.
                </p>
                
                <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg space-y-3">
                  <div>
                    <span className="font-semibold text-[var(--xibalba-text-000)]">Project Name: </span>
                    <span className="text-[var(--xibalba-text-100)]">{projectDetails.name}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--xibalba-text-000)]">Type: </span>
                    <span className="text-[var(--xibalba-text-100)]">{projectDetails.type}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--xibalba-text-000)]">Location: </span>
                    <span className="text-[var(--xibalba-text-100)]">{projectDetails.location}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--xibalba-text-000)]">Template: </span>
                    <span className="text-[var(--xibalba-text-100)]">
                      {templates.find(t => t.id === selectedTemplate)?.label || 'None'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--xibalba-text-000)]">Features: </span>
                    <span className="text-[var(--xibalba-text-100)]">
                      {features.filter(f => f.selected).map(f => f.label).join(', ') || 'None'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'creating' && (
              <div className="space-y-6 flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--xibalba-accent)] border-t-transparent" aria-label="Creating project" />
                <p className="text-lg text-[var(--xibalba-text-000)]">
                  {progressMessage || 'Creating your project...'}
                </p>
                <div className="w-full max-w-md">
                  <div className="bg-[var(--xibalba-grey-100)] rounded-full h-2 overflow-hidden">
                    <ProgressBarFill
                      progress={progress}
                      className="bg-[var(--xibalba-accent)] h-full transition-all duration-300 progress-bar-fill"
                      ariaLabel={`Progress: ${progress}%`}
                    />
                  </div>
                  <p className="text-sm text-[var(--xibalba-text-100)] mt-2 text-center">
                    {progress}% complete
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-[var(--vectorforge-accent)]/20 border border-[var(--vectorforge-accent)] rounded-lg">
                <p className="text-[var(--vectorforge-accent)]">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6">
            <button
              onClick={handleBack}
              disabled={currentStep === 'welcome' || currentStep === 'creating'}
              className="xibalba-button-secondary min-w-[120px] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Go back to previous step"
            >
              <span className="material-symbols-outlined mr-2" aria-hidden="true">arrow_back</span>
              Back
            </button>
            
            <button
              onClick={currentStep === 'review' ? handleCreate : handleNext}
              disabled={currentStep === 'creating'}
              className="xibalba-button-primary min-w-[120px] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={currentStep === 'review' ? 'Create project' : 'Continue to next step'}
            >
              {currentStep === 'review' ? 'Create Project' : 'Next'}
              {currentStep !== 'review' && (
                <span className="material-symbols-outlined ml-2" aria-hidden="true">arrow_forward</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProjectWizard;

