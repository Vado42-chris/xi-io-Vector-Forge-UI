/**
 * Bug Reporter Component
 * Allows users to report bugs and issues
 * Integrates with change log service for tracking
 */

import React, { useState } from 'react';
import { changeLogService } from '../services/changeLogService';
import { securityService } from '../services/securityService';

interface BugReporterProps {
  onClose?: () => void;
  onReportSubmitted?: (bugId: string) => void;
}

const BugReporter: React.FC<BugReporterProps> = ({ onClose, onReportSubmitted }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [expected, setExpected] = useState('');
  const [actual, setActual] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [category, setCategory] = useState<string>('UI');
  const [browserInfo, setBrowserInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bugId, setBugId] = useState<string | null>(null);

  // Capture browser info on mount
  React.useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };
    setBrowserInfo(JSON.stringify(info, null, 2));
  }, []);

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
      const sanitizedSteps = securityService.sanitizeInput(steps);
      const sanitizedExpected = securityService.sanitizeInput(expected);
      const sanitizedActual = securityService.sanitizeInput(actual);

      // Create bug report entry
      const bugReport = {
        type: 'bugfix' as const,
        category,
        title: sanitizedTitle,
        description: [
          sanitizedDescription,
          steps && `**Steps to Reproduce:**\n${sanitizedSteps}`,
          expected && `**Expected Behavior:**\n${sanitizedExpected}`,
          actual && `**Actual Behavior:**\n${sanitizedActual}`,
          `**Severity:** ${severity}`,
          `**Browser Info:**\n\`\`\`json\n${browserInfo}\n\`\`\``,
        ].filter(Boolean).join('\n\n'),
        tags: ['bug', 'user-reported', severity],
        relatedIssues: [],
      };

      const entry = changeLogService.addChange(bugReport);
      setBugId(entry.id);
      setSubmitted(true);

      if (onReportSubmitted) {
        onReportSubmitted(entry.id);
      }

      // Reset form after delay
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setSteps('');
        setExpected('');
        setActual('');
        setSeverity('medium');
        setCategory('UI');
        setSubmitted(false);
        setBugId(null);
        if (onClose) {
          onClose();
        }
      }, 3000);
    } catch (error: any) {
      console.error('Failed to submit bug report:', error);
      alert(`Failed to submit bug report: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[var(--xibalba-grey-100)] min-h-[400px]">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-lg font-black text-[var(--xibalba-text-000)] mb-2">
          Bug Report Submitted
        </h3>
        <p className="text-sm text-[var(--xibalba-text-100)] mb-4">
          Thank you for reporting this issue!
        </p>
        {bugId && (
          <p className="text-xs text-[var(--xibalba-text-100)] font-mono">
            Bug ID: {bugId}
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
          <span className="material-symbols-outlined text-[16px]">bug_report</span>
          <span className="text-xs font-black uppercase tracking-widest">Report Bug</span>
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
            Title <span className="text-[var(--vectorforge-accent)]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief description of the bug"
            required
            className="xibalba-input-professional w-full"
          />
        </div>

        {/* Description */}
        <div>
          <label className="xibalba-label-professional mb-1 block">
            Description <span className="text-[var(--vectorforge-accent)]">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened..."
            required
            rows={4}
            className="xibalba-input-professional w-full resize-none"
          />
        </div>

        {/* Steps to Reproduce */}
        <div>
          <label className="xibalba-label-professional mb-1 block">
            Steps to Reproduce
          </label>
          <textarea
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            placeholder="1. Go to...\n2. Click on...\n3. See error..."
            rows={4}
            className="xibalba-input-professional w-full resize-none"
          />
        </div>

        {/* Expected vs Actual */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="xibalba-label-professional mb-1 block">
              Expected Behavior
            </label>
            <textarea
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
              placeholder="What should happen?"
              rows={3}
              className="xibalba-input-professional w-full resize-none"
            />
          </div>
          <div>
            <label className="xibalba-label-professional mb-1 block">
              Actual Behavior
            </label>
            <textarea
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              placeholder="What actually happened?"
              rows={3}
              className="xibalba-input-professional w-full resize-none"
            />
          </div>
        </div>

        {/* Severity and Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="xibalba-label-professional mb-1 block">
              Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
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
              <option value="Security">Security</option>
              <option value="API">API</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Browser Info (read-only) */}
        <div>
          <label className="xibalba-label-professional mb-1 block">
            Browser Information (auto-captured)
          </label>
          <textarea
            value={browserInfo}
            readOnly
            rows={8}
            className="xibalba-input-professional w-full resize-none bg-[var(--xibalba-grey-200)] text-[var(--xibalba-text-100)] font-mono text-sm"
          />
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
            {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BugReporter;

