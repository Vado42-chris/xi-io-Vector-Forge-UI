/**
 * Guided Workflow Service
 * Manages step-by-step tutorials, interactive help, and contextual tips
 * 
 * #hashtag: guided-workflow service
 */

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string; // CSS selector or component ID
  action?: string; // Action to perform or hint
  hint?: string; // Additional hint text
  completed?: boolean;
}

export interface GuidedWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'onboarding' | 'feature' | 'troubleshooting' | 'advanced';
  steps: WorkflowStep[];
  estimatedTime?: number; // in minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface WorkflowProgress {
  workflowId: string;
  currentStep: number;
  completedSteps: Set<string>;
  startedAt: number;
  completedAt?: number;
}

class GuidedWorkflowService {
  private workflows: Map<string, GuidedWorkflow> = new Map();
  private activeWorkflow: WorkflowProgress | null = null;
  private completedWorkflows: Set<string> = new Set();
  private storageKey = 'vectorforge-guided-workflows';

  constructor() {
    this.loadWorkflows();
    this.loadProgress();
    this.initializeDefaultWorkflows();
  }

  /**
   * Initialize default workflows
   */
  private initializeDefaultWorkflows(): void {
    // Batch Operations Workflow
    const batchOpsWorkflow: GuidedWorkflow = {
      id: 'batch-operations',
      name: 'Batch File Operations',
      description: 'Learn how to perform batch file operations efficiently',
      category: 'feature',
      difficulty: 'beginner',
      estimatedTime: 5,
      steps: [
        {
          id: 'step-1',
          title: 'Select Files',
          description: 'Navigate to the directory and select files you want to operate on',
          targetElement: '.batch-operations-file-tree',
          action: 'Click checkboxes next to files to select them',
          hint: 'You can select multiple files at once',
        },
        {
          id: 'step-2',
          title: 'Choose Operation',
          description: 'Select the type of operation you want to perform',
          targetElement: '.batch-operations-ops',
          action: 'Click on Create, Delete, Move, or Copy',
          hint: 'Each operation has different requirements',
        },
        {
          id: 'step-3',
          title: 'Set Destination (if needed)',
          description: 'For Move and Copy operations, specify the destination path',
          targetElement: '#destination',
          action: 'Enter the destination directory path',
          hint: 'Use relative paths within your project',
        },
        {
          id: 'step-4',
          title: 'Preview Operation',
          description: 'Preview what will happen before executing',
          targetElement: '.preview-button',
          action: 'Click "Preview Operation" to see what will happen',
          hint: 'This helps prevent mistakes',
        },
        {
          id: 'step-5',
          title: 'Execute',
          description: 'Execute the operation after reviewing the preview',
          targetElement: '.execute-button',
          action: 'Click "Execute Operation" to perform the operation',
          hint: 'You can undo the operation if needed',
        },
      ],
    };

    // Project Wizard Workflow
    const projectWizardWorkflow: GuidedWorkflow = {
      id: 'project-wizard',
      name: 'Create a New Project',
      description: 'Step-by-step guide to creating a new project',
      category: 'onboarding',
      difficulty: 'beginner',
      estimatedTime: 10,
      steps: [
        {
          id: 'step-1',
          title: 'Open Project Wizard',
          description: 'Start the project creation wizard',
          action: 'Click "Set Up Project" in the Action Center or use Ctrl+Shift+P',
          hint: 'The wizard will guide you through project setup',
        },
        {
          id: 'step-2',
          title: 'Enter Project Details',
          description: 'Fill in your project name, type, and location',
          action: 'Enter project information in the form',
          hint: 'Choose a descriptive name and appropriate project type',
        },
        {
          id: 'step-3',
          title: 'Select Template (Optional)',
          description: 'Choose a template if you want to start from a template',
          action: 'Browse and select a template',
          hint: 'Templates provide a starting structure',
        },
        {
          id: 'step-4',
          title: 'Choose Features',
          description: 'Select the features you want in your project',
          action: 'Check the features you need',
          hint: 'You can add more features later',
        },
        {
          id: 'step-5',
          title: 'Review and Create',
          description: 'Review your project settings and create it',
          action: 'Click "Create Project" to generate your project',
          hint: 'The wizard will create all necessary files and folders',
        },
      ],
    };

    // Schema Builder Workflow
    const schemaBuilderWorkflow: GuidedWorkflow = {
      id: 'schema-builder',
      name: 'Build a JSON Schema',
      description: 'Create a JSON schema visually without writing JSON',
      category: 'feature',
      difficulty: 'intermediate',
      estimatedTime: 8,
      steps: [
        {
          id: 'step-1',
          title: 'Open Schema Builder',
          description: 'Start the schema builder',
          action: 'Open Schema Builder from the Action Center',
          hint: 'No JSON knowledge required!',
        },
        {
          id: 'step-2',
          title: 'Name Your Schema',
          description: 'Give your schema a descriptive name',
          action: 'Enter a name in the "Schema Name" field',
          hint: 'Use PascalCase for schema names (e.g., UserProfile)',
        },
        {
          id: 'step-3',
          title: 'Add Fields',
          description: 'Add fields to your schema',
          action: 'Click "Add Field" and fill in field details',
          hint: 'Each field needs a name and type',
        },
        {
          id: 'step-4',
          title: 'Configure Fields',
          description: 'Set field properties like required, min/max, patterns',
          action: 'Click on a field to edit its properties',
          hint: 'Configure validation rules for each field',
        },
        {
          id: 'step-5',
          title: 'Preview and Export',
          description: 'Preview your schema and export it',
          action: 'Review the JSON preview and click "Export Schema"',
          hint: 'You can export as JSON Schema, TypeScript, or Zod',
        },
      ],
    };

    this.workflows.set(batchOpsWorkflow.id, batchOpsWorkflow);
    this.workflows.set(projectWizardWorkflow.id, projectWizardWorkflow);
    this.workflows.set(schemaBuilderWorkflow.id, schemaBuilderWorkflow);
  }

  /**
   * Get all workflows
   */
  getAllWorkflows(): GuidedWorkflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Get workflow by ID
   */
  getWorkflow(id: string): GuidedWorkflow | null {
    return this.workflows.get(id) || null;
  }

  /**
   * Get workflows by category
   */
  getWorkflowsByCategory(category: GuidedWorkflow['category']): GuidedWorkflow[] {
    return Array.from(this.workflows.values()).filter(w => w.category === category);
  }

  /**
   * Start a workflow
   */
  startWorkflow(workflowId: string): boolean {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      return false;
    }

    this.activeWorkflow = {
      workflowId,
      currentStep: 0,
      completedSteps: new Set(),
      startedAt: Date.now(),
    };

    this.saveProgress();
    return true;
  }

  /**
   * Get current workflow progress
   */
  getCurrentWorkflow(): WorkflowProgress | null {
    return this.activeWorkflow;
  }

  /**
   * Get current step
   */
  getCurrentStep(): WorkflowStep | null {
    if (!this.activeWorkflow) {
      return null;
    }

    const workflow = this.workflows.get(this.activeWorkflow.workflowId);
    if (!workflow) {
      return null;
    }

    return workflow.steps[this.activeWorkflow.currentStep] || null;
  }

  /**
   * Complete current step
   */
  completeStep(stepId: string): boolean {
    if (!this.activeWorkflow) {
      return false;
    }

    this.activeWorkflow.completedSteps.add(stepId);
    this.activeWorkflow.currentStep++;

    const workflow = this.workflows.get(this.activeWorkflow.workflowId);
    if (workflow && this.activeWorkflow.currentStep >= workflow.steps.length) {
      // Workflow completed
      this.activeWorkflow.completedAt = Date.now();
      this.completedWorkflows.add(this.activeWorkflow.workflowId);
      this.activeWorkflow = null;
    }

    this.saveProgress();
    return true;
  }

  /**
   * Go to next step
   */
  nextStep(): boolean {
    if (!this.activeWorkflow) {
      return false;
    }

    const workflow = this.workflows.get(this.activeWorkflow.workflowId);
    if (!workflow) {
      return false;
    }

    if (this.activeWorkflow.currentStep < workflow.steps.length - 1) {
      this.activeWorkflow.currentStep++;
      this.saveProgress();
      return true;
    }

    return false;
  }

  /**
   * Go to previous step
   */
  previousStep(): boolean {
    if (!this.activeWorkflow) {
      return false;
    }

    if (this.activeWorkflow.currentStep > 0) {
      this.activeWorkflow.currentStep--;
      this.saveProgress();
      return true;
    }

    return false;
  }

  /**
   * Cancel current workflow
   */
  cancelWorkflow(): void {
    this.activeWorkflow = null;
    this.saveProgress();
  }

  /**
   * Check if workflow is completed
   */
  isWorkflowCompleted(workflowId: string): boolean {
    return this.completedWorkflows.has(workflowId);
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(workflowId: string): number {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      return 0;
    }

    if (this.completedWorkflows.has(workflowId)) {
      return 100;
    }

    if (this.activeWorkflow && this.activeWorkflow.workflowId === workflowId) {
      return (this.activeWorkflow.currentStep / workflow.steps.length) * 100;
    }

    return 0;
  }

  /**
   * Save progress to localStorage
   */
  private saveProgress(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const progressData = {
          activeWorkflow: this.activeWorkflow ? {
            ...this.activeWorkflow,
            completedSteps: Array.from(this.activeWorkflow.completedSteps),
          } : null,
          completedWorkflows: Array.from(this.completedWorkflows),
        };
        localStorage.setItem(this.storageKey, JSON.stringify(progressData));
      } catch (error) {
        console.error('GuidedWorkflowService: Failed to save progress:', error);
      }
    }
  }

  /**
   * Load progress from localStorage
   */
  private loadProgress(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const progressStr = localStorage.getItem(this.storageKey);
        if (progressStr) {
          const progressData = JSON.parse(progressStr);
          if (progressData.activeWorkflow) {
            this.activeWorkflow = {
              ...progressData.activeWorkflow,
              completedSteps: new Set(progressData.activeWorkflow.completedSteps),
            };
          }
          this.completedWorkflows = new Set(progressData.completedWorkflows || []);
        }
      } catch (error) {
        console.error('GuidedWorkflowService: Failed to load progress:', error);
      }
    }
  }

  /**
   * Load workflows from storage (for custom workflows)
   */
  private loadWorkflows(): void {
    // In the future, this could load custom workflows from storage
    // For now, we use the default workflows
  }
}

export const guidedWorkflowService = new GuidedWorkflowService();

