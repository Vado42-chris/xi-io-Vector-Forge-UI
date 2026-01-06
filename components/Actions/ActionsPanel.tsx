/**
 * Actions Panel - Hashtag System
 * Your ActionScript equivalent - Flash's killer feature
 * Make this prominent (F9 shortcut)
 */

import React, { useState, useRef, useEffect } from 'react';
import './ActionsPanel.css';

interface ActionsPanelProps {
  code: string;
  onChange: (code: string) => void;
  onValidate?: () => boolean;
  frameNumber?: number;
  layerId?: string | null;
  objectId?: string | null;
}

const ActionsPanel: React.FC<ActionsPanelProps> = ({
  code,
  onChange,
  onValidate,
  frameNumber = 1,
  layerId = null,
  objectId = null,
}) => {
  const [activeTab, setActiveTab] = useState<'frame' | 'object' | 'timeline'>('frame');
  const [showSnippets, setShowSnippets] = useState(false);
  const [showBehaviors, setShowBehaviors] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [code]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to validate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onValidate?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onValidate]);

  const handleValidate = () => {
    if (onValidate) {
      const isValid = onValidate();
      if (isValid) {
        alert('✅ Syntax valid!');
      } else {
        alert('❌ Syntax error - check console');
      }
    }
  };

  const insertSnippet = (snippet: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newCode = code.substring(0, start) + snippet + code.substring(end);
      onChange(newCode);
      setShowSnippets(false);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPos = start + snippet.length;
          textareaRef.current.setSelectionRange(newPos, newPos);
        }
      }, 0);
    }
  };

  const snippets = [
    { name: 'Fade In', code: '#onEnter {\n  this.fadeIn(duration: "1s", easing: "easeOut");\n}' },
    { name: 'Fade Out', code: '#onExit {\n  this.fadeOut(duration: "0.5s");\n}' },
    { name: 'Click Handler', code: '#onClick {\n  // Your code here\n}' },
    { name: 'Slide Animation', code: '#onEnter {\n  this.slideFrom(x: -100, duration: "1s");\n}' },
    { name: 'Scale Animation', code: '#onEnter {\n  this.scale(1.1, duration: "0.3s");\n}' },
    { name: 'Go to Frame', code: '#onClick {\n  this.gotoFrame(10);\n}' },
  ];

  return (
    <div className="actions-panel">
      <div className="actions-header">
        <div className="actions-title">
          <h3>Actions</h3>
          <span className="actions-context">
            {activeTab === 'frame' && frameNumber && `Frame ${frameNumber}`}
            {activeTab === 'object' && objectId && `Object: ${objectId}`}
            {activeTab === 'timeline' && 'Timeline'}
          </span>
        </div>
        <div className="actions-tabs">
          <button
            className={activeTab === 'frame' ? 'active' : ''}
            onClick={() => setActiveTab('frame')}
            title="Frame Actions"
          >
            Frame
          </button>
          <button
            className={activeTab === 'object' ? 'active' : ''}
            onClick={() => setActiveTab('object')}
            title="Object Actions"
          >
            Object
          </button>
          <button
            className={activeTab === 'timeline' ? 'active' : ''}
            onClick={() => setActiveTab('timeline')}
            title="Timeline Actions"
          >
            Timeline
          </button>
        </div>
      </div>

      <div className="actions-editor-container">
        <textarea
          ref={textareaRef}
          className="actions-editor"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`// ${activeTab === 'frame' ? 'Frame' : activeTab === 'object' ? 'Object' : 'Timeline'} Actions
// Enter hashtag code here

#onEnter {
  this.fadeIn(duration: "1s", easing: "easeOut");
}

#onClick {
  this.gotoFrame(10);
  #emit("buttonClicked");
}

#onExit {
  this.fadeOut(duration: "0.5s");
}`}
          spellCheck={false}
          wrap="off"
        />
      </div>

      <div className="actions-footer">
        <div className="actions-footer-left">
          <button
            onClick={handleValidate}
            title="Check Syntax (Ctrl+Enter)"
          >
            Check Syntax
          </button>
          <div className="dropdown">
            <button
              onClick={() => setShowSnippets(!showSnippets)}
              title="Code Snippets"
            >
              Snippets ▼
            </button>
            {showSnippets && (
              <div className="dropdown-menu">
                {snippets.map((snippet, i) => (
                  <button
                    key={i}
                    onClick={() => insertSnippet(snippet.code)}
                    className="dropdown-item"
                  >
                    {snippet.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="actions-footer-right">
          <button title="Help (F1)">Help</button>
        </div>
      </div>
    </div>
  );
};

export default ActionsPanel;
