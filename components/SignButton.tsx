/**
 * Sign & Append Button
 * Creates proof bundle from current drawing
 * #hashtag: proof signing verification
 */

import React, { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { signAndAppend } from './actions/signAndAppend';

interface SignButtonProps {
  /** Current SVG content to sign */
  svgContent: string;
  /** Callback when signing completes */
  onSigned?: (bundlePath: string) => void;
  /** Callback for errors */
  onError?: (error: string) => void;
  /** Button label */
  label?: string;
  /** Button className */
  className?: string;
}

export const SignButton: React.FC<SignButtonProps> = ({
  svgContent,
  onSigned,
  onError,
  label = 'Sign & Create Proof',
  className = '',
}) => {
  const [isSigning, setIsSigning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'signing' | 'success' | 'error'>('idle');

  const handleSign = async () => {
    if (!svgContent || svgContent.trim().length === 0) {
      const errorMsg = 'No drawing to sign. Please create a drawing first.';
      setStatus('error');
      onError?.(errorMsg);
      return;
    }

    setIsSigning(true);
    setStatus('signing');

    try {
      const result = await signAndAppend(svgContent, {
        onProgress: step => {
          // Update status message based on progress
          if (step.includes('Signing')) setStatus('signing');
        },
      });

      if (!result.success) {
        throw new Error(result.error || 'Signing failed');
      }

      setStatus('success');
      onSigned?.(result.bundlePath || 'proof_bundle.zip');

      // Reset status after 2 seconds
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setStatus('error');
      onError?.(errorMsg);
      console.error('Signing error:', error);
    } finally {
      setIsSigning(false);
    }
  };

  const getButtonText = () => {
    if (status === 'signing') return 'Signing...';
    if (status === 'success') return '✓ Signed!';
    if (status === 'error') return 'Error - Try Again';
    return label;
  };

  const getButtonClass = () => {
    const base = 'px-4 py-2 rounded font-medium transition-colors';
    const state =
      status === 'signing'
        ? 'bg-[var(--vectorforge-accent)] opacity-75 cursor-wait'
        : status === 'success'
          ? 'bg-green-600 hover:bg-green-700'
          : status === 'error'
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-[var(--vectorforge-accent)] hover:bg-[var(--vectorforge-accent-hover)] text-white';
    return `${base} ${state} ${className}`;
  };

  return (
    <ErrorBoundary>
      <button
        onClick={handleSign}
        disabled={isSigning || !svgContent || svgContent.trim().length === 0}
        className={getButtonClass()}
        aria-label={label}
        title={
          svgContent ? 'Sign current drawing and create proof bundle' : 'Create a drawing first'
        }
      >
        {getButtonText()}
      </button>
    </ErrorBoundary>
  );
};

export default SignButton;
