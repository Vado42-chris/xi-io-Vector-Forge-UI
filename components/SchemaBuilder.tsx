/**
 * Schema Builder Component
 * Visual form builder for JSON schemas (no JSON writing required)
 * 
 * Accessibility: Screen reader support, keyboard navigation, clear labels
 * Design: Drag-and-drop form fields, live JSON preview
 * 
 * #hashtag: schema-builder json-form accessibility
 */

import React, { useState, useMemo } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { schemaBuilderService, ExportFormat } from '../services/schemaBuilderService';

interface SchemaBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (schema: any) => void;
}

interface SchemaField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description?: string;
  defaultValue?: any;
  min?: number;
  max?: number;
  pattern?: string;
}

const SchemaBuilder: React.FC<SchemaBuilderProps> = ({ isOpen, onClose, onSave }) => {
  const [schemaName, setSchemaName] = useState('');
  const [fields, setFields] = useState<SchemaField[]>([]);
  const [selectedField, setSelectedField] = useState<SchemaField | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json-schema');
  const [exportPath, setExportPath] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportMessage, setExportMessage] = useState('');

  const fieldTypes = [
    { value: 'string', label: 'String', icon: 'text_fields' },
    { value: 'number', label: 'Number', icon: 'numbers' },
    { value: 'boolean', label: 'Boolean', icon: 'toggle_on' },
    { value: 'array', label: 'Array', icon: 'list' },
    { value: 'object', label: 'Object', icon: 'data_object' },
  ];

  const generatedSchema = useMemo(() => {
    const schema: any = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      title: schemaName || 'Untitled Schema',
      properties: {},
      required: [],
    };

    fields.forEach((field) => {
      schema.properties[field.name] = {
        type: field.type,
        description: field.description || '',
      };

      if (field.type === 'number') {
        if (field.min !== undefined) {
          schema.properties[field.name].minimum = field.min;
        }
        if (field.max !== undefined) {
          schema.properties[field.name].maximum = field.max;
        }
      }

      if (field.type === 'string' && field.pattern) {
        schema.properties[field.name].pattern = field.pattern;
      }

      if (field.required) {
        schema.required.push(field.name);
      }
    });

    return schema;
  }, [schemaName, fields]);

  const addField = () => {
    const newField: SchemaField = {
      id: `field-${Date.now()}`,
      name: '',
      type: 'string',
      required: false,
    };
    setFields([...fields, newField]);
    setSelectedField(newField);
  };

  const updateField = (fieldId: string, updates: Partial<SchemaField>) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, ...updates } : f));
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates });
    }
  };

  const deleteField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId));
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  const handleSave = async () => {
    // Validate schema
    const validation = schemaBuilderService.validateSchema(generatedSchema);
    if (!validation.valid) {
      alert(`Schema validation failed: ${validation.errors.join(', ')}`);
      return;
    }

    // If export path is provided, save to file
    if (exportPath) {
      setIsExporting(true);
      setExportProgress(0);
      setExportMessage('');

      try {
        await schemaBuilderService.exportSchema(
          generatedSchema,
          exportPath,
          exportFormat,
          (progress, message) => {
            setExportProgress(progress);
            setExportMessage(message);
          }
        );

        // Call onSave callback if provided
        if (onSave) {
          onSave(generatedSchema);
        }

        // Close after successful export
        onClose();
      } catch (error) {
        alert(`Failed to export schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsExporting(false);
      }
    } else {
      // Just call onSave callback without file export
      if (onSave) {
        onSave(generatedSchema);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 zstack-modal-backdrop flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="schema-builder-title"
      >
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] rounded-lg w-[95vw] max-w-6xl h-[90vh] max-h-[800px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]" aria-hidden="true">
                schema
              </span>
              <h2 id="schema-builder-title" className="text-xl font-bold text-[var(--xibalba-text-000)]">
                Schema Builder
              </h2>
            </div>
            <button
              onClick={onClose}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Close schema builder"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-100)]" aria-hidden="true" data-icon="close"></span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Left Panel - Form Builder */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="schema-name" className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                    Schema Name
                  </label>
                  <input
                    id="schema-name"
                    type="text"
                    value={schemaName}
                    onChange={(e) => setSchemaName(e.target.value)}
                    className="xibalba-input w-full min-h-[44px]"
                    placeholder="MySchema"
                    aria-label="Schema name"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[var(--xibalba-text-000)]">Fields</h3>
                    <button
                      onClick={addField}
                      className="xibalba-button-secondary min-h-[44px]"
                      aria-label="Add new field"
                    >
                      <span className="material-symbols-outlined mr-2" aria-hidden="true" data-icon="add"></span>
                      Add Field
                    </button>
                  </div>

                  {fields.length === 0 && (
                    <div className="text-center py-12 bg-[var(--xibalba-grey-100)] rounded-lg">
                      <p className="text-[var(--xibalba-text-100)]">No fields yet</p>
                      <p className="text-sm text-[var(--xibalba-text-100)] mt-2">Click "Add Field" to get started</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {fields.map((field) => (
                      <div
                        key={field.id}
                        className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                          selectedField?.id === field.id
                            ? 'border-[var(--xibalba-accent)] bg-[var(--xibalba-grey-100)]'
                            : 'border-[var(--xibalba-grey-100)] hover:border-[var(--xibalba-accent)]'
                        }`}
                        onClick={() => setSelectedField(field)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[var(--xibalba-accent)]" aria-hidden="true">
                              {fieldTypes.find(t => t.value === field.type)?.icon || 'code'}
                            </span>
                            <span className="font-semibold text-[var(--xibalba-text-000)]">
                              {field.name || 'Unnamed Field'}
                            </span>
                            {field.required && (
                              <span className="px-2 py-1 text-xs bg-[var(--xibalba-accent)] text-white rounded" aria-label="Required field">
                                Required
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteField(field.id);
                            }}
                            className="p-1 hover:bg-[var(--xibalba-grey-200)] rounded min-w-[32px] min-h-[32px]"
                            aria-label={`Delete field ${field.name}`}
                          >
                            <span className="material-symbols-outlined text-sm text-[var(--vectorforge-accent)]" aria-hidden="true" data-icon="delete"></span>
                          </button>
                        </div>
                        <p className="text-sm text-[var(--xibalba-text-100)]">
                          Type: {fieldTypes.find(t => t.value === field.type)?.label || field.type}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Field Editor / Preview */}
            <div className="w-1/2 p-6 overflow-y-auto">
              {selectedField ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-[var(--xibalba-text-000)]">Edit Field</h3>
                  
                  <div>
                    <label htmlFor="field-name" className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                      Field Name *
                    </label>
                    <input
                      id="field-name"
                      type="text"
                      value={selectedField.name}
                      onChange={(e) => updateField(selectedField.id, { name: e.target.value })}
                      className="xibalba-input w-full min-h-[44px]"
                      placeholder="fieldName"
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="field-type" className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                      Field Type
                    </label>
                    <select
                      id="field-type"
                      value={selectedField.type}
                      onChange={(e) => updateField(selectedField.id, { type: e.target.value as SchemaField['type'] })}
                      className="xibalba-input w-full min-h-[44px]"
                    >
                      {fieldTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="field-description" className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                      Description
                    </label>
                    <textarea
                      id="field-description"
                      value={selectedField.description || ''}
                      onChange={(e) => updateField(selectedField.id, { description: e.target.value })}
                      className="xibalba-input w-full min-h-[100px]"
                      placeholder="Field description..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="field-required"
                      checked={selectedField.required}
                      onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <label htmlFor="field-required" className="text-[var(--xibalba-text-000)] cursor-pointer">
                      Required field
                    </label>
                  </div>

                  {selectedField.type === 'number' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="field-min" className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                          Minimum
                        </label>
                        <input
                          id="field-min"
                          type="number"
                          value={selectedField.min || ''}
                          onChange={(e) => updateField(selectedField.id, { min: e.target.value ? Number(e.target.value) : undefined })}
                          className="xibalba-input w-full min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label htmlFor="field-max" className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                          Maximum
                        </label>
                        <input
                          id="field-max"
                          type="number"
                          value={selectedField.max || ''}
                          onChange={(e) => updateField(selectedField.id, { max: e.target.value ? Number(e.target.value) : undefined })}
                          className="xibalba-input w-full min-h-[44px]"
                        />
                      </div>
                    </div>
                  )}

                  {selectedField.type === 'string' && (
                    <div>
                      <label htmlFor="field-pattern" className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                        Pattern (Regex)
                      </label>
                      <input
                        id="field-pattern"
                        type="text"
                        value={selectedField.pattern || ''}
                        onChange={(e) => updateField(selectedField.id, { pattern: e.target.value || undefined })}
                        className="xibalba-input w-full min-h-[44px]"
                        placeholder="^[a-zA-Z]+$"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[var(--xibalba-text-100)]">Select a field to edit</p>
                </div>
              )}

              {/* Preview Toggle */}
              <div className="mt-6 pt-6">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full flex items-center justify-between p-3 bg-[var(--xibalba-grey-100)] rounded-lg hover:bg-[var(--xibalba-grey-200)] transition-colors min-h-[44px]"
                  aria-expanded={showPreview}
                >
                  <span className="font-semibold text-[var(--xibalba-text-000)]">JSON Preview</span>
                  <span className="material-symbols-outlined">
                    {showPreview ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {showPreview && (
                  <div className="mt-4">
                    <pre className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg overflow-x-auto text-sm font-mono text-[var(--xibalba-text-000)]">
                      <code>{JSON.stringify(generatedSchema, null, 2)}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-4 p-6">
            {/* Export Options */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label htmlFor="export-format" className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                  Export Format
                </label>
                <select
                  id="export-format"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  className="xibalba-input min-h-[44px]"
                  disabled={isExporting}
                >
                  <option value="json-schema">JSON Schema</option>
                  <option value="typescript">TypeScript Interface</option>
                  <option value="zod">Zod Schema</option>
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="export-path" className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                  File Path (optional)
                </label>
                <input
                  id="export-path"
                  type="text"
                  value={exportPath}
                  onChange={(e) => setExportPath(e.target.value)}
                  className="xibalba-input w-full min-h-[44px]"
                  placeholder="schemas/mySchema"
                  disabled={isExporting}
                />
              </div>
            </div>

            {/* Export Progress */}
            {isExporting && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[var(--xibalba-text-000)]">{exportMessage || 'Exporting...'}</span>
                  <span className="text-sm text-[var(--xibalba-text-100)]">{Math.round(exportProgress)}%</span>
                </div>
                <div className="w-full bg-[var(--xibalba-grey-100)] rounded-full h-2">
                  <div
                    className="schema-export-progress-fill"
                    style={{ '--schema-export-progress': `${exportProgress}%` } as React.CSSProperties}
                    role="progressbar"
                    aria-valuenow={exportProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={onClose}
                className="xibalba-button-secondary min-w-[120px] min-h-[44px]"
                aria-label="Cancel"
                disabled={isExporting}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={fields.length === 0 || !schemaName || isExporting}
                className="xibalba-button-primary min-w-[120px] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Generate schema"
              >
                <span className="material-symbols-outlined mr-2" aria-hidden="true" data-icon="save"></span>
                {exportPath ? 'Export Schema' : 'Generate Schema'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SchemaBuilder;

