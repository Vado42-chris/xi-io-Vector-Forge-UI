/**
 * Floating Dev Chat Button
 * Always visible, always accessible
 * Makes the self-modifying chatbot easy to find
 */

import React, { useState } from 'react';

interface FloatingDevChatButtonProps {
  onOpen: () => void;
}

export const FloatingDevChatButton: React.FC<FloatingDevChatButtonProps> = ({ onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Debug: Log when component mounts
  React.useEffect(() => {
    console.log('✅ FloatingDevChatButton mounted and visible');
  }, []);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        // Navigate to /devchat route OR open in Right Sidebar
        const path = window.location.pathname;
        if (path === '/devchat' || path === '/devchat/') {
          // Already on devchat page, just call onOpen to ensure sidebar is visible
          onOpen();
        } else {
          // Navigate to /devchat route
          window.history.pushState({}, '', '/devchat');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="floating-dev-chat-button"
      title="Open Dev Chat - Self-Modifying AI (Ctrl+K)"
      aria-label="Open Dev Chat"
    >
      <span className="material-symbols-outlined">
        {isHovered ? 'smart_toy' : 'chat'}
      </span>
      {isHovered && (
        <span className="floating-dev-chat-button-tooltip">
          Dev Chat (Ctrl+K)
        </span>
      )}
    </button>
  );
};

export default FloatingDevChatButton;

