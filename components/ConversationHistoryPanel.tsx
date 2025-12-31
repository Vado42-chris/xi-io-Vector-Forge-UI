/**
 * Conversation History Panel
 * Browse and search past conversations
 * 
 * #hashtag: conversation-management history search
 */

import React, { useState, useEffect, useMemo } from 'react';
import { conversationHistoryService, ConversationMetadata } from '../services/conversationHistoryService';
import ErrorBoundary from './ErrorBoundary';

interface ConversationHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation?: (id: string) => void;
}

const ConversationHistoryPanel: React.FC<ConversationHistoryPanelProps> = ({
  isOpen,
  onClose,
  onSelectConversation
}) => {
  const [conversations, setConversations] = useState<ConversationMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'devchat' | 'filebrowser' | 'terminal'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  const loadConversations = () => {
    setIsLoading(true);
    try {
      const all = conversationHistoryService.getAllConversations();
      setConversations(all);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Filter by platform
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(c => c.platform === selectedPlatform);
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(c => c.tags.includes(selectedTag));
    }

    // Search
    if (searchQuery) {
      const searchResults = conversationHistoryService.searchConversations(searchQuery);
      filtered = filtered.filter(c => searchResults.some(r => r.id === c.id));
    }

    return filtered;
  }, [conversations, selectedPlatform, selectedTag, searchQuery]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    conversations.forEach(c => c.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [conversations]);

  const handleDelete = (id: string) => {
    if (confirm('Delete this conversation?')) {
      conversationHistoryService.deleteConversation(id);
      loadConversations();
    }
  };

  const handleExport = (id: string) => {
    const exported = conversationHistoryService.exportConversation(id);
    const blob = new Blob([exported], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 zstack-modal flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] rounded-lg w-[90vw] max-w-4xl h-[85vh] max-h-[700px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]" aria-hidden="true" data-icon="history">history</span>
              <div>
                <h2 className="text-xl font-bold text-[var(--xibalba-text-000)]">Conversation History</h2>
                <p className="text-sm text-[var(--xibalba-text-100)]">
                  {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} total
                  {filteredConversations.length !== conversations.length && (
                    <> • {filteredConversations.length} shown</>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-100)]" aria-hidden="true" data-icon="close">close</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="px-6 pb-4 space-y-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="xibalba-input-professional w-full"
            />
            <div className="flex gap-3">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as any)}
                className="xibalba-input-professional"
              >
                <option value="all">All Platforms</option>
                <option value="devchat">Dev Chat</option>
                <option value="filebrowser">File Browser</option>
                <option value="terminal">Terminal</option>
              </select>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="xibalba-input-professional"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {isLoading ? (
              <div className="text-center py-12 text-[var(--xibalba-text-100)]">
                <span className="material-symbols-outlined text-4xl mb-2 block animate-spin" aria-hidden="true" data-icon="refresh">refresh</span>
                <p>Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12 text-[var(--xibalba-text-100)]">
                <span className="material-symbols-outlined text-4xl mb-2 block" aria-hidden="true" data-icon="inbox">inbox</span>
                <p className="mb-2">No conversations found</p>
                <p className="text-sm text-[var(--xibalba-text-100)]">
                  {conversations.length === 0 
                    ? 'Start chatting in Dev Chat to create your first conversation'
                    : 'Try adjusting your search or filters'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredConversations.map(conv => (
                  <div
                    key={conv.id}
                    className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg hover:bg-[var(--xibalba-grey-150)] transition-colors cursor-pointer"
                    onClick={() => onSelectConversation?.(conv.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-[var(--xibalba-text-000)]">{conv.title}</span>
                          <span className="text-sm px-2 py-0.5 bg-[var(--xibalba-grey-200)] rounded text-[var(--xibalba-text-100)]">
                            {conv.platform}
                          </span>
                        </div>
                        {conv.summary && (
                          <p className="text-xs text-[var(--xibalba-text-100)] mb-2 line-clamp-2">{conv.summary}</p>
                        )}
                        <div className="flex items-center gap-3 text-sm text-[var(--xibalba-text-100)]">
                          <span>{conv.messageCount} messages</span>
                          <span>•</span>
                          <span>{new Date(conv.lastUpdated).toLocaleDateString()}</span>
                          {conv.tags.length > 0 && (
                            <>
                              <span>•</span>
                              <div className="flex gap-1">
                                {conv.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="px-1.5 py-0.5 bg-[var(--xibalba-grey-200)] rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExport(conv.id);
                          }}
                          className="p-1.5 hover:bg-[var(--xibalba-grey-200)] rounded transition-colors"
                          title="Export"
                        >
                          <span className="material-symbols-outlined text-sm" aria-hidden="true" data-icon="download">download</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(conv.id);
                          }}
                          className="p-1.5 hover:bg-[var(--vectorforge-accent)]/20 rounded transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-sm text-[var(--vectorforge-accent)]" aria-hidden="true" data-icon="delete">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ConversationHistoryPanel;

