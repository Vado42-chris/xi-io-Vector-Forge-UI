/**
 * #hashtag: ai-chatbot
 * #purpose: AI chatbot for natural language to hashtag command translation
 * #provides: Conversational interface for users to control VectorForge with plain English
 * #usage: Import and use in LeftSidebar or as floating panel
 * #related: naturalLanguageTranslator, scriptParser, scriptExecutor, mcpScriptService
 * 
 * AI Chatbot Component
 * Makes VectorForge accessible through natural language conversation
 * Translates user requests to hashtag commands automatically
 * Follows Xibalba standards: NO inline styles, component-based, error boundaries
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { translateToHashtags, getNaturalLanguageExamples } from '../services/naturalLanguageTranslator';
import { parseScript } from '../services/scriptParser';
import { VectorLayer } from '../types';
import ProgressBar from './ProgressBar';

interface AIChatbotProps {
  frame: number;
  layerId: string | null;
  layers: VectorLayer[];
  currentScript?: string;
  onScriptGenerated: (script: string) => void;
  onExecuteScript?: (script: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  hashtagScript?: string;
  timestamp: number;
  confidence?: number;
  errors?: string[];
}

const AIChatbot: React.FC<AIChatbotProps> = ({
  frame,
  layerId,
  layers,
  currentScript,
  onScriptGenerated,
  onExecuteScript
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'system',
      content: 'Hi! I\'m your VectorForge assistant. Tell me what you want to animate, and I\'ll create the hashtag commands for you. Try: "Move the circle to the right" or "Rotate the button 45 degrees".',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState<number | undefined>(undefined);
  const [showExamples, setShowExamples] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const examples = getNaturalLanguageExamples();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle user message
  const handleSend = useCallback(async () => {
    if (!input.trim() || isTranslating) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTranslating(true);
    setTranslationProgress(0);

    // Simulate progress (since translation is async)
    const progressInterval = setInterval(() => {
      setTranslationProgress(prev => {
        if (prev === undefined || prev >= 90) return prev;
        return prev + 10;
      });
    }, 100);

    try {
      // Translate natural language to hashtags
      const result = await translateToHashtags({
        userMessage: input.trim(),
        context: {
          frame,
          layerId,
          layers: layers.map(l => ({ id: l.id, name: l.name })),
          currentScript
        }
      });

      clearInterval(progressInterval);
      setTranslationProgress(100);

      // Create assistant response
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.explanation,
        hashtagScript: result.hashtagScript,
        timestamp: Date.now(),
        confidence: result.confidence,
        errors: result.errors
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If translation was successful, offer to execute
      if (result.hashtagScript && !result.hashtagScript.startsWith('//')) {
        // Validate the script
        const parsed = parseScript(result.hashtagScript);
        if (parsed.isValid) {
          // Auto-send to script editor
          onScriptGenerated(result.hashtagScript);
        }
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try rephrasing your request.`,
        timestamp: Date.now()
      };
      clearInterval(progressInterval);
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTranslating(false);
      setTimeout(() => setTranslationProgress(undefined), 500);
    }
  }, [input, isTranslating, frame, layerId, layers, currentScript, onScriptGenerated]);

  // Handle Enter key (Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Insert example into input
  const handleUseExample = (example: string) => {
    setInput(example);
    inputRef.current?.focus();
    setShowExamples(false);
  };

  return (
    <div className="xibalba-panel-elevated-professional flex flex-col h-full">
      {/* Header */}
      <div className="xibalba-panel-header shrink-0 flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[var(--xibalba-accent)]">smart_toy</span>
          <h3 className="xibalba-text-heading">AI Assistant</h3>
        </div>
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="xibalba-button-professional text-sm"
          title="Show examples"
        >
          <span className="material-symbols-outlined text-[16px] mr-1">help</span>
          Examples
        </button>
      </div>

      {/* Examples Panel */}
      {showExamples && (
        <div className="xibalba-panel-elevated-professional border-b border-white/10 max-h-64 overflow-y-auto xibalba-scrollbar">
          <div className="p-4">
            <h4 className="xibalba-text-subheading mb-3">Try these examples:</h4>
            <div className="space-y-2">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => handleUseExample(ex.example)}
                  className="xibalba-interactive w-full text-left p-3 rounded border border-white/10 hover:border-[var(--xibalba-accent)] transition-colors"
                >
                  <div className="xibalba-text-body font-medium">{ex.example}</div>
                  <div className="xibalba-text-caption font-mono text-[var(--xibalba-accent)] mt-1">
                    {ex.hashtag}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto xibalba-scrollbar p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 ${
                message.role === 'user'
                  ? 'bg-[var(--xibalba-accent)] text-white'
                  : message.role === 'system'
                  ? 'bg-[var(--xibalba-grey-100)] xibalba-text-caption'
                  : 'bg-[var(--xibalba-grey-200)] xibalba-text-body'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {/* Show hashtag script if available */}
              {message.hashtagScript && (
                <div className="mt-2 pt-2 border-t border-white/20">
                  <div className="xibalba-text-caption mb-1">Generated Script:</div>
                  <code className="block bg-black/30 p-2 rounded font-mono text-xs overflow-x-auto">
                    {message.hashtagScript}
                  </code>
                  {message.confidence !== undefined && (
                    <div className="xibalba-text-caption mt-1">
                      Confidence: {Math.round(message.confidence * 100)}%
                    </div>
                  )}
                </div>
              )}

              {/* Show errors if any */}
              {message.errors && message.errors.length > 0 && (
                <div className="mt-2 pt-2 border-t border-red-500/30">
                  <div className="xibalba-text-caption text-red-400 mb-1">Issues:</div>
                  <ul className="list-disc list-inside text-xs text-red-300">
                    {message.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action buttons for valid scripts */}
              {message.hashtagScript && 
               !message.hashtagScript.startsWith('//') && 
               message.errors === undefined && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => onScriptGenerated(message.hashtagScript!)}
                    className="xibalba-button-professional text-xs px-2 py-1"
                  >
                    <span className="material-symbols-outlined text-[14px] mr-1">code</span>
                    Use Script
                  </button>
                  {onExecuteScript && (
                    <button
                      onClick={() => onExecuteScript(message.hashtagScript!)}
                      className="xibalba-button-professional text-xs px-2 py-1"
                    >
                      <span className="material-symbols-outlined text-[14px] mr-1">play_arrow</span>
                      Execute
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTranslating && (
          <div className="flex justify-start">
            <div className="bg-[var(--xibalba-grey-200)] p-3 w-full max-w-md">
              <ProgressBar
                progress={translationProgress}
                label="Translating to hashtags..."
                size="sm"
                variant="accent"
                showPercentage={translationProgress !== undefined}
              />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell me what you want to animate... (e.g., 'Move the circle to the right')"
            className="xibalba-input-professional flex-1 resize-none min-h-[60px] max-h-[120px]"
            disabled={isTranslating}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTranslating}
            className="xibalba-button-professional shrink-0 self-end"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
        <div className="xibalba-text-caption mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;

