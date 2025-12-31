/**
 * Screen Reader Announcer Component
 * Announces UI changes to screen readers
 * 
 * Accessibility: Configurable verbosity, live region announcements
 * 
 * #hashtag: accessibility screen-reader announcements
 */

import React, { useEffect, useRef } from 'react';

interface ScreenReaderAnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
  verbosity?: 'brief' | 'normal' | 'verbose';
}

const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps> = ({
  message,
  priority = 'polite',
  verbosity = 'normal',
}) => {
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && announcerRef.current) {
      // Clear previous message
      announcerRef.current.textContent = '';
      
      // Set new message after a brief delay to ensure screen readers pick it up
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = message;
        }
      }, 100);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div
      ref={announcerRef}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only absolute -left-[10000px] w-px h-px overflow-hidden"
    >
      {message}
    </div>
  );
};

// Hook for easy usage
export const useScreenReaderAnnouncement = () => {
  const [message, setMessage] = React.useState<string>('');
  const [priority, setPriority] = React.useState<'polite' | 'assertive'>('polite');

  const announce = React.useCallback((msg: string, pri: 'polite' | 'assertive' = 'polite') => {
    setMessage(msg);
    setPriority(pri);
    // Clear message after announcement
    setTimeout(() => setMessage(''), 1000);
  }, []);

  return { announce, message, priority };
};

export default ScreenReaderAnnouncer;

