/**
 * Feature Request Component
 * Allows users to submit feature requests
 * Integrates with change log service for tracking
 */

import React, { useState } from 'react';
import { changeLogService } from '../services/changeLogService';
import { securityService } from '../services/securityService';

interface FeatureRequestProps {
  onClose?: () => void;
  onRequestSubmitted?: (requestId: string) => void;
}

const FeatureRequest: React.FC<FeatureRequestProps> = ({ onClose, onRequestSubmitted }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [useCase, setUseCase] = useState('');
  const [benefits, setBenefits] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [category, setCategory] = useState<string>('UI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize inputs
      const sanitizedTitle = securityService.sanitizeInput(title);
      const sanitizedDescription = securityService.sanitizeInput(description);
      const sanitizedUseCase = securityService.sanitizeInput(useCase);
      const sanitizedBenefits = securityService.sanitizeInput(benefits);

      // Create feature request entry
      const featureRequest = {
        type: 'feature' as const,
        category,
        title: sanitizedTitle,
        description: [
          sanitizedDescription,
          useCase && `**Use Case:**\n${sanitizedUseCase}`,
          benefits && `**Benefits:**\n${sanitizedBenefits}`,
          `**Priority:** ${priority}`,
        ].filter(Boolean).join('\n\n'),
        tags: ['feature-request', 'user-requested', priority],
        relatedIssues: [],
      };

      const entry = changeLogService.addChange(featureRequest);
      setRequestId(entry.id);
      setSubmitted(true);

      if (onRequestSubmitted) {
        onRequestSubmitted(entry.id);
      }

      // Reset form after delay
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setUseCase('');
        setBenefits('');
        setPriority('medium');
        setCategory('UI');
        setSubmitted(false);
        setRequestId(null);
        if (onClose) {
          onClose();
        }
      }, 3000);
    } catch (error: any) {
      console.error('Failed to submit feature request:', error);
      alert(`Failed to submit feature request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[var(--xibalba-grey-100)] min-h-[400px]">
        <div className="text-6xl mb-4">✨</div>
        <h3 className="text-lg font-black text-[var(--xibalba-text-000)] mb-2">
          Feature Request Submitted
        </h3>
        <p className="text-sm text-[var(--xibalba-text-200)] mb-4">
          Thank you for your suggestion!
        </p>
        {requestId && (
          <p className="text-xs text-[var(--xibalba-text-300)] font-mono">
            Request ID: {requestId}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--xibalba-grey-050)]">
      {/* Header */}
      <div className="xibalba-section-header-professional flex items-center justify-between shrink-0 px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">lightbulb</span>
          <span className="text-xs font-black uppercase tracking-widest">Feature Request</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="xibalba-interactive p-1 hover:bg-[var(--xibalba-grey-150)] rounded"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto xibalba-scrollbar p-4 space-y-4">
        {/* Title */}
        <div>
          <label className="xibalba-label-professional mb-1 block">
            Feature Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of the feature"
            required
            className="xibalba-input-professional w-full"
          />
        </div>

        {/* Description */}
        <div>
          <label className="xibalba-label-professional mb-1 block">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the feature in detail..."
            required
            rows={4}
            className="xibalba-input-professional w-full resize-none"
          />
        </div>

        {/* Use Case */}
        <div>
          <label className="xibalba-label-professional mb-1 block">
            Use Case
          </label>
          <textarea
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            placeholder="Describe when and how you would use this feature..."
            rows={3}
            className="xibalba-input-professional w-full resize-none"
          />
        </div>

        {/* Benefits */}
        <div>
          <label className="xibalba-label-professional mb-1 block">
            Benefits
          </label>
          <textarea
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            placeholder="What benefits would this feature provide?"
            rows={3}
            className="xibalba-input-professional w-full resize-none"
          />
        </div>

        {/* Priority and Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="xibalba-label-professional mb-1 block">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="xibalba-input-professional w-full"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="xibalba-label-professional mb-1 block">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="xibalba-input-professional w-full"
            >
              <option value="UI">UI</option>
              <option value="Animation">Animation</option>
              <option value="Scripting">Scripting</option>
              <option value="Performance">Performance</option>
              <option value="Workflow">Workflow</option>
              <option value="Export">Export</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[var(--xibalba-grey-200)] text-[var(--xibalba-text-100)] text-xs font-black uppercase tracking-widest hover:bg-[var(--xibalba-grey-300)] transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim()}
            className="px-4 py-2 bg-[var(--xibalba-accent)] text-[var(--xibalba-text-000)] text-xs font-black uppercase tracking-widest hover:bg-[var(--xibalba-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feature Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeatureRequest;

