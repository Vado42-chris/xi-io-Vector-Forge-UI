/**
 * Template Variable Form Component
 * Visual form for template variable substitution
 * 
 * #hashtag: template-variables component
 */

import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Template, TemplateVariable } from '../services/templateService';
import { templateService } from '../services/templateService';

interface TemplateVariableFormProps {
  template: Template;
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (code: string) => void;
}

const TemplateVariableForm: React.FC<TemplateVariableFormProps> = ({
  template,
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (isOpen && template.variables) {
      // Initialize variables with default values
      const initialVars: Record<string, string> = {};
      template.variables.forEach(variable => {
        initialVars[variable.name] = variable.defaultValue || '';
      });
      setVariables(initialVars);
      setErrors({});
      updatePreview(initialVars);
    }
  }, [isOpen, template]);

  const updatePreview = (vars: Record<string, string>) => {
    try {
      const generated = templateService.generateCode(template, vars);
      setPreview(generated);
    } catch (error) {
      setPreview('Error generating preview');
    }
  };

  const handleVariableChange = (name: string, value: string) => {
    const newVariables = { ...variables, [name]: value };
    setVariables(newVariables);

    // Validate
    const variable = template.variables?.find(v => v.name === name);
    if (variable) {
      const newErrors = { ...errors };
      
      if (variable.required && !value.trim()) {
        newErrors[name] = 'This field is required';
      } else if (variable.type === 'number' && value && isNaN(Number(value))) {
        newErrors[name] = 'Must be a number';
      } else {
        delete newErrors[name];
      }
      
      setErrors(newErrors);
    }

    updatePreview(newVariables);
  };

  const handleGenerate = () => {
    // Validate all required fields
    const requiredErrors: Record<string, string> = {};
    template.variables?.forEach(variable => {
      if (variable.required && !variables[variable.name]?.trim()) {
        requiredErrors[variable.name] = 'This field is required';
      }
    });

    if (Object.keys(requiredErrors).length > 0) {
      setErrors(requiredErrors);
      return;
    }

    const generated = templateService.generateCode(template, variables);
    onGenerate(generated);
    onClose();
  };

  if (!isOpen || !template.variables || template.variables.length === 0) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 zstack-modal-backdrop flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-variables-title"
      >
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg w-[90vw] max-w-3xl h-[85vh] max-h-[700px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]" aria-hidden="true">
                code
              </span>
              <h2 id="template-variables-title" className="text-xl font-bold text-[var(--xibalba-text-000)]">
                Configure Template Variables
              </h2>
            </div>
            <button
              onClick={onClose}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Close variable form"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-100)]">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Left Panel - Variables Form */}
            <div className="w-1/2 border-r border-white/10 p-6 overflow-y-auto">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[var(--xibalba-text-000)] mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-[var(--xibalba-text-100)]">{template.description}</p>
              </div>

              <div className="space-y-4">
                {template.variables.map((variable) => (
                  <div key={variable.name}>
                    <label
                      htmlFor={`var-${variable.name}`}
                      className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2"
                    >
                      {variable.label || variable.name}
                      {variable.required && (
                        <span className="text-[var(--vectorforge-accent)] ml-1" aria-label="Required">*</span>
                      )}
                    </label>
                    {variable.description && (
                      <p className="text-xs text-[var(--xibalba-text-100)] mb-2">
                        {variable.description}
                      </p>
                    )}
                    {variable.type === 'select' && variable.options ? (
                      <select
                        id={`var-${variable.name}`}
                        value={variables[variable.name] || ''}
                        onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                        className="xibalba-input w-full min-h-[44px]"
                        aria-required={variable.required}
                        aria-invalid={!!errors[variable.name]}
                        aria-describedby={errors[variable.name] ? `error-${variable.name}` : undefined}
                      >
                        <option value="">Select an option...</option>
                        {variable.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : variable.type === 'boolean' ? (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={variables[variable.name] === 'true'}
                          onChange={(e) => handleVariableChange(variable.name, e.target.checked ? 'true' : 'false')}
                          className="w-5 h-5 cursor-pointer"
                          aria-required={variable.required}
                        />
                        <span className="text-sm text-[var(--xibalba-text-000)]">
                          {variables[variable.name] === 'true' ? 'Yes' : 'No'}
                        </span>
                      </label>
                    ) : (
                      <input
                        id={`var-${variable.name}`}
                        type={variable.type === 'number' ? 'number' : 'text'}
                        value={variables[variable.name] || ''}
                        onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                        placeholder={variable.defaultValue || `Enter ${variable.label || variable.name}`}
                        className={`xibalba-input w-full min-h-[44px] ${
                          errors[variable.name] ? 'border-[var(--vectorforge-accent)]' : ''
                        }`}
                        aria-required={variable.required}
                        aria-invalid={!!errors[variable.name]}
                        aria-describedby={errors[variable.name] ? `error-${variable.name}` : undefined}
                      />
                    )}
                    {errors[variable.name] && (
                      <p
                        id={`error-${variable.name}`}
                        className="text-xs text-[var(--vectorforge-accent)] mt-1"
                        role="alert"
                      >
                        {errors[variable.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/2 p-6 overflow-y-auto flex flex-col">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[var(--xibalba-text-000)] mb-2">
                  Generated Code Preview
                </h3>
                <p className="text-sm text-[var(--xibalba-text-100)]">
                  Preview of the code with your variable values
                </p>
              </div>
              <div className="flex-1 bg-[var(--xibalba-grey-100)] p-4 rounded-lg overflow-auto">
                <pre className="text-sm font-mono text-[var(--xibalba-text-000)] whitespace-pre-wrap">
                  <code>{preview || template.code}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="xibalba-button-secondary min-w-[120px] min-h-[44px]"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={Object.keys(errors).length > 0}
              className="xibalba-button-primary min-w-[120px] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Generate code"
            >
              <span className="material-symbols-outlined mr-2" aria-hidden="true">code</span>
              Generate Code
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TemplateVariableForm;

