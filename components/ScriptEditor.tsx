/**
 * #hashtag: script-editor
 * #purpose: Professional script editor component with MCP integration for VectorForge timeline scripting
 * #provides: Code editing, syntax highlighting, AI-powered completion, validation, documentation
 * #usage: Import and use in RightSidebar for timeline script editing
 * #related: scriptParser, scriptExecutor, mcpScriptService, RightSidebar
 * 
 * VectorForge Script Editor Component
 * Plain language hashtag command editor with MCP protocol integration
 * Follows Xibalba coding standards: TypeScript strict, error boundaries, loading states
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { parseScript, formatCommand, getCommandSyntax, getAllCommands, ScriptCommand } from '../services/scriptParser';
import { executeScript, ExecutionContext } from '../services/scriptExecutor';
import { getMCPCompletions, validateWithMCP, getMCPDocumentation, getMCPCodeSuggestions, MCPCompletion } from '../services/mcpScriptService';
import { VectorLayer } from '../types';
import ErrorBoundary from './ErrorBoundary';

interface ScriptEditorProps {
  frame: number;
  layerId: string | null;
  layers: VectorLayer[];
  script?: string;
  onScriptChange: (script: string) => void;
  onExecute?: (script: string) => void;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({
  frame,
  layerId,
  layers,
  script = '',
  onScriptChange,
  onExecute
}) => {
  const [scriptText, setScriptText] = useState(script);
  const [parsedScript, setParsedScript] = useState(parseScript(script));
  const [showPalette, setShowPalette] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [autoComplete, setAutoComplete] = useState<{ show: boolean; commands: Array<{ name: string; category: string; syntax: string }>; position: number }>({ show: false, commands: [], position: 0 });
  const [mcpCompletions, setMcpCompletions] = useState<MCPCompletion[]>([]);
  const [isLoadingMCP, setIsLoadingMCP] = useState(false);
  const [mcpValidations, setMcpValidations] = useState<Array<{ line: number; severity: 'error' | 'warning' | 'info'; message: string; suggestion?: string }>>([]);
  const [mcpSuggestions, setMcpSuggestions] = useState<Array<{ line: number; suggestion: string; reason: string }>>([]);
  const [selectedCommandDoc, setSelectedCommandDoc] = useState<string | null>(null);
  const [commandDocumentation, setCommandDocumentation] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setScriptText(script);
    setParsedScript(parseScript(script));
  }, [script]);

  // MCP-powered validation on script change
  useEffect(() => {
    if (scriptText.trim()) {
      validateWithMCP(scriptText).then(validations => {
        setMcpValidations(validations);
      });
      
      // Get code suggestions
      getMCPCodeSuggestions(scriptText, {
        frame,
        layerId,
        layers: layers.map(l => ({ id: l.id, name: l.name }))
      }).then(suggestions => {
        setMcpSuggestions(suggestions);
      });
    } else {
      setMcpValidations([]);
      setMcpSuggestions([]);
    }
  }, [scriptText, frame, layerId, layers]);

  // Load documentation when command is selected
  useEffect(() => {
    if (selectedCommandDoc) {
      setIsLoadingMCP(true);
      getMCPDocumentation(selectedCommandDoc).then(doc => {
        setCommandDocumentation(doc);
        setIsLoadingMCP(false);
      });
    } else {
      setCommandDocumentation(null);
    }
  }, [selectedCommandDoc]);

  const handleScriptChange = (value: string) => {
    setScriptText(value);
    const parsed = parseScript(value);
    setParsedScript(parsed);
    onScriptChange(value);
  };

  const [autoCompleteIndex, setAutoCompleteIndex] = useState(0);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const cursorPos = textarea.selectionStart;
    const textBefore = scriptText.substring(0, cursorPos);
    const lines = textBefore.split('\n');
    const cursorLine = lines.length - 1;
    const lastLine = lines[cursorLine] || '';
    const cursorColumn = lastLine.length;
    
    // MCP-powered auto-complete on # or when typing after #
    if (e.key === '#' || (lastLine.includes('#') && /^[a-zA-Z]*$/.test(e.key))) {
      const lastWord = lastLine.split(/\s+/).pop() || '';
      
      if (lastWord.startsWith('#')) {
        setIsLoadingMCP(true);
        
        // Get MCP-powered completions
        const mcpCompletions = await getMCPCompletions(scriptText, cursorLine, cursorColumn, {
          frame,
          layerId,
          layers: layers.map(l => ({ id: l.id, name: l.name }))
        });
        
        setMcpCompletions(mcpCompletions);
        setIsLoadingMCP(false);
        
        // Also show basic completions
        const searchTerm = lastWord.slice(1).toLowerCase();
        const allCommands = getAllCommands();
        const filtered = allCommands.filter(cmd => 
          cmd.name.toLowerCase().startsWith(searchTerm)
        );
        
        if (filtered.length > 0 || mcpCompletions.length > 0) {
          setAutoComplete({
            show: true,
            commands: filtered,
            position: cursorPos
          });
          setAutoCompleteIndex(0);
        }
      }
    }

    // Handle auto-complete selection
    if (autoComplete.show) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAutoCompleteIndex(prev => 
          prev < autoComplete.commands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAutoCompleteIndex(prev => 
          prev > 0 ? prev - 1 : autoComplete.commands.length - 1
        );
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const selectedCmd = autoComplete.commands[autoCompleteIndex];
        if (selectedCmd) {
          const beforeHash = lastLine.substring(0, lastLine.lastIndexOf('#'));
          const newText = scriptText.substring(0, cursorPos - lastLine.length + beforeHash.length) +
                         `#${selectedCmd.name} ` +
                         scriptText.substring(cursorPos);
          handleScriptChange(newText);
          setAutoComplete({ show: false, commands: [], position: 0 });
          
          // Set cursor after inserted command
          setTimeout(() => {
            const newPos = cursorPos - lastLine.length + beforeHash.length + selectedCmd.name.length + 2;
            textarea.setSelectionRange(newPos, newPos);
          }, 0);
        }
      } else if (e.key === 'Escape') {
        setAutoComplete({ show: false, commands: [], position: 0 });
      }
    } else if (e.key === 'Escape') {
      setAutoComplete({ show: false, commands: [], position: 0 });
    }
  };

  const handleTest = async () => {
    if (!onExecute) return;

    const context: ExecutionContext = {
      frame,
      layers,
      variables: {},
      eventHandlers: new Map(),
      pendingEvents: []
    };

    const result = await executeScript(scriptText, context);
    
    if (result.success) {
      onExecute(scriptText);
      // Show success message
    } else {
      // Show error message
      console.error('Script execution failed:', result.errors);
    }
  };

  const insertCommand = (commandSyntax: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textBefore = scriptText.substring(0, cursorPos);
    const textAfter = scriptText.substring(cursorPos);
    
    const newText = textBefore + commandSyntax + '\n' + textAfter;
    handleScriptChange(newText);
    
    // Set cursor after inserted command
    setTimeout(() => {
      textarea.focus();
      const newPos = cursorPos + commandSyntax.length + 1;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const getLineClass = (lineNumber: number) => {
    const error = parsedScript.errors.find(e => e.line === lineNumber);
    if (error) return 'text-[var(--vectorforge-accent)]';
    return '';
  };

  const allCommands = getAllCommands();
  const categories = Array.from(new Set(allCommands.map(c => c.category)));

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full bg-[var(--xibalba-grey-050)]">
      {/* Header */}
      <div className="xibalba-section-header-professional flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">code</span>
          <span>Scripts</span>
          {parsedScript.errors.length > 0 && (
            <span className="text-[var(--vectorforge-accent)] text-xs">
              {parsedScript.errors.length} error{parsedScript.errors.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowPalette(!showPalette)}
            className="xibalba-toolbar-button-professional"
            title="Command Palette"
          >
            <span className="material-symbols-outlined text-[14px]">apps</span>
          </button>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="xibalba-toolbar-button-professional"
            title="Help"
          >
            <span className="material-symbols-outlined text-[14px]">help</span>
          </button>
          <button
            onClick={handleTest}
            className="xibalba-toolbar-button-professional"
            title="Test Script"
            disabled={!scriptText.trim()}
          >
            <span className="material-symbols-outlined text-[14px]">play_arrow</span>
          </button>
        </div>
      </div>

      {/* Frame/Layer Info */}
      <div className="px-4 py-2 text-xs text-[var(--xibalba-text-100)] border-b border-white/10 shrink-0">
        Frame: {frame} {layerId && `| Layer: ${layers.find(l => l.id === layerId)?.name || layerId}`}
      </div>

      <div className="flex-1 flex min-h-0 relative">
        {/* Script Editor */}
        <div className="flex-1 flex flex-col min-h-0">
          <textarea
            ref={textareaRef}
            value={scriptText}
            onChange={(e) => handleScriptChange(e.target.value)}
            onKeyDown={handleKeyDown}
              placeholder="#move layer1 x:100 y:50&#10;#rotate layer1 angle:45&#10;#fade layer1 opacity:0.5"
              className="script-editor-textarea flex-1 w-full p-4 font-mono text-sm bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-100)] border-none resize-none focus:outline-none xibalba-scrollbar"
          />
          
          {/* Error Display */}
          {parsedScript.errors.length > 0 && (
            <div className="border-t border-[var(--vectorforge-accent)]/20 bg-[var(--vectorforge-accent)]/10 p-2 text-xs text-[var(--vectorforge-accent)] max-h-24 overflow-y-auto">
              {parsedScript.errors.map((error, idx) => (
                <div key={idx}>
                  Line {error.line}: {error.message}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Command Palette Sidebar */}
        {showPalette && (
          <div className="w-64 border-l border-white/10 bg-[var(--xibalba-grey-100)] flex flex-col shrink-0">
            <div className="p-2 border-b border-white/10 shrink-0">
              <input
                type="text"
                placeholder="Search commands..."
                className="xibalba-input-professional w-full text-xs"
                onChange={(e) => {
                  const search = e.target.value.toLowerCase();
                  const filtered = allCommands.filter(cmd => 
                    cmd.name.toLowerCase().includes(search) ||
                    cmd.syntax.toLowerCase().includes(search)
                  );
                  setAutoComplete({ ...autoComplete, commands: filtered });
                }}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto xibalba-scrollbar">
              {categories.map(category => (
                <div key={category} className="mb-4">
                  <div className="px-3 py-2 text-xs font-semibold text-[var(--xibalba-text-100)] bg-[var(--xibalba-grey-150)]">
                    {category}
                  </div>
                  {allCommands
                    .filter(cmd => cmd.category === category)
                    .map(cmd => (
                      <button
                        key={cmd.name}
                        onClick={() => insertCommand(cmd.syntax)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-150)] border-b border-white/5"
                        onMouseEnter={() => setSelectedCommand(cmd.name)}
                      >
                        <div className="font-mono text-[var(--xibalba-accent)]">#{cmd.name}</div>
                        <div className="text-[var(--xibalba-text-100)] text-sm mt-1">{cmd.syntax}</div>
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Sidebar */}
        {showHelp && selectedCommand && (
          <div className="w-80 border-l border-white/10 bg-[var(--xibalba-grey-100)] p-4 overflow-y-auto xibalba-scrollbar shrink-0">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[var(--xibalba-text-100)] mb-2">
                #{selectedCommand}
              </h3>
              <div className="font-mono text-xs text-[var(--xibalba-accent)] mb-2">
                {getCommandSyntax(selectedCommand)}
              </div>
              <div className="text-xs text-[var(--xibalba-text-100)]">
                {/* TODO: Add command descriptions */}
                Command description and examples will be added here.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MCP-Powered Auto-complete Dropdown */}
      {(autoComplete.show && (autoComplete.commands.length > 0 || mcpCompletions.length > 0)) && (
        <div className="absolute bg-[var(--xibalba-grey-200)] border border-white/20 shadow-lg z-50 max-h-48 overflow-y-auto rounded">
          {/* MCP Completions (prioritized) */}
          {mcpCompletions.map((completion, idx) => (
            <button
              key={`mcp-${idx}`}
              onClick={() => {
                const textarea = textareaRef.current;
                if (!textarea) return;
                
                const cursorPos = textarea.selectionStart;
                const textBefore = scriptText.substring(0, cursorPos);
                const lastLine = textBefore.split('\n').pop() || '';
                const beforeHash = lastLine.substring(0, lastLine.lastIndexOf('#'));
                
                const newText = scriptText.substring(0, cursorPos - lastLine.length + beforeHash.length) +
                               completion.insertText || `#${completion.text} ` +
                               scriptText.substring(cursorPos);
                handleScriptChange(newText);
                setAutoComplete({ show: false, commands: [], position: 0 });
                setMcpCompletions([]);
                
                setTimeout(() => {
                  const newPos = cursorPos - lastLine.length + beforeHash.length + (completion.insertText || `#${completion.text} `).length;
                  textarea.setSelectionRange(newPos, newPos);
                  textarea.focus();
                }, 0);
              }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] flex items-center gap-2 ${
                idx === autoCompleteIndex && mcpCompletions.length > 0 ? 'bg-[var(--xibalba-grey-250)]' : ''
              }`}
              title={completion.description}
            >
              <span className="material-symbols-outlined text-[12px] text-[var(--xibalba-accent)]">auto_awesome</span>
              <span className="font-mono text-[var(--xibalba-accent)]">{completion.displayText}</span>
              {completion.description && (
                <span className="ml-auto text-[var(--xibalba-text-100)] text-sm">{completion.description}</span>
              )}
            </button>
          ))}
          
          {/* Standard Completions */}
          {autoComplete.commands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => {
                const textarea = textareaRef.current;
                if (!textarea) return;
                
                const cursorPos = textarea.selectionStart;
                const textBefore = scriptText.substring(0, cursorPos);
                const lastLine = textBefore.split('\n').pop() || '';
                const beforeHash = lastLine.substring(0, lastLine.lastIndexOf('#'));
                
                const newText = scriptText.substring(0, cursorPos - lastLine.length + beforeHash.length) +
                               `#${cmd.name} ` +
                               scriptText.substring(cursorPos);
                handleScriptChange(newText);
                setAutoComplete({ show: false, commands: [], position: 0 });
                
                setTimeout(() => {
                  const newPos = cursorPos - lastLine.length + beforeHash.length + cmd.name.length + 2;
                  textarea.setSelectionRange(newPos, newPos);
                  textarea.focus();
                }, 0);
              }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-[var(--xibalba-grey-250)] ${
                idx === autoCompleteIndex ? 'bg-[var(--xibalba-grey-250)]' : ''
              }`}
            >
              <span className="font-mono text-[var(--xibalba-accent)]">#{cmd.name}</span>
              <span className="ml-2 text-[var(--xibalba-text-100)]">{cmd.syntax}</span>
            </button>
          )          )}
        </div>
      )}

      {/* MCP Validations Display */}
      {mcpValidations.length > 0 && (
        <div className="border-t border-white/10 p-2 space-y-1 max-h-32 overflow-y-auto">
          {mcpValidations.map((validation, idx) => (
            <div
              key={idx}
              className={`text-xs ${
                validation.severity === 'error' ? 'text-[var(--vectorforge-accent)]' :
                validation.severity === 'warning' ? 'text-[var(--vectorforge-accent)]' :
                'text-[var(--xibalba-text-100)]'
              }`}
            >
              Line {validation.line}: {validation.message}
              {validation.suggestion && (
                <div className="text-[var(--xibalba-text-100)] ml-4">
                  💡 {validation.suggestion}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MCP Code Suggestions */}
      {mcpSuggestions.length > 0 && (
        <div className="border-t border-white/10 p-2 bg-[var(--xibalba-grey-100)]">
          <div className="text-xs font-semibold text-[var(--xibalba-text-100)] mb-2">
            AI Suggestions
          </div>
          {mcpSuggestions.map((suggestion, idx) => (
            <div key={idx} className="text-xs text-[var(--xibalba-text-100)] mb-1">
              Line {suggestion.line}: {suggestion.suggestion}
              <div className="text-sm text-[var(--xibalba-text-100)] ml-2">
                {suggestion.reason}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MCP Loading Indicator */}
      {isLoadingMCP && (
        <div className="absolute top-2 right-2 text-xs text-[var(--xibalba-text-100)] flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
          <span>AI analyzing...</span>
        </div>
      )}
      </div>
    </ErrorBoundary>
  );
};

export default ScriptEditor;

