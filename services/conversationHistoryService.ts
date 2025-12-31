/**
 * Conversation History Service
 * Manages conversation storage, indexing, and search
 * 
 * #hashtag: conversation-management local-storage search indexing
 * 
 * Uses seed-based approach: Store minimal metadata, reconstruct full conversations on demand
 */

export interface ConversationMetadata {
  id: string;
  title: string;
  platform: 'devchat' | 'filebrowser' | 'terminal' | 'other';
  createdAt: number;
  lastUpdated: number;
  messageCount: number;
  tags: string[];
  summary?: string;
  linkedFiles?: string[];
  linkedCommands?: string[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  actions?: Array<{
    type: string;
    path?: string;
    command?: string;
    result?: string;
  }>;
}

export interface Conversation {
  metadata: ConversationMetadata;
  messages: ConversationMessage[];
}

class ConversationHistoryService {
  private storageKey = 'vectorforge-conversations';
  private indexKey = 'vectorforge-conversation-index';
  private conversations: Map<string, Conversation> = new Map();
  private index: ConversationMetadata[] = [];

  constructor() {
    // Defer localStorage access to prevent blocking render
    if (typeof window !== 'undefined') {
      try {
        this.loadIndex();
      } catch (error) {
        console.error('ConversationHistoryService: Failed to load index, using defaults:', error);
        this.index = [];
      }
    }
  }

  /**
   * Save a conversation
   */
  saveConversation(conversation: Conversation): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      // Store full conversation
      this.conversations.set(conversation.metadata.id, conversation);
      localStorage.setItem(
        `${this.storageKey}-${conversation.metadata.id}`,
        JSON.stringify(conversation)
      );

      // Update index
      const existingIndex = this.index.findIndex(
        c => c.id === conversation.metadata.id
      );
      if (existingIndex >= 0) {
        this.index[existingIndex] = conversation.metadata;
      } else {
        this.index.push(conversation.metadata);
      }

      // Sort by last updated (newest first)
      this.index.sort((a, b) => b.lastUpdated - a.lastUpdated);

      // Save index
      this.saveIndex();
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }

  /**
   * Load a conversation by ID
   */
  loadConversation(id: string): Conversation | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    try {
      // Check cache first
      if (this.conversations.has(id)) {
        return this.conversations.get(id)!;
      }

      // Load from storage
      const stored = localStorage.getItem(`${this.storageKey}-${id}`);
      if (stored) {
        const conversation = JSON.parse(stored) as Conversation;
        this.conversations.set(id, conversation);
        return conversation;
      }

      return null;
    } catch (error) {
      console.error('Failed to load conversation:', error);
      return null;
    }
  }

  /**
   * Get all conversation metadata (for listing)
   */
  getAllConversations(): ConversationMetadata[] {
    return [...this.index];
  }

  /**
   * Search conversations
   */
  searchConversations(query: string): ConversationMetadata[] {
    const lowerQuery = query.toLowerCase();
    return this.index.filter(meta => {
      // Search in title
      if (meta.title.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in tags
      if (meta.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;
      
      // Search in summary
      if (meta.summary?.toLowerCase().includes(lowerQuery)) return true;
      
      return false;
    });
  }

  /**
   * Search within conversation messages
   */
  searchMessages(conversationId: string, query: string): ConversationMessage[] {
    const conversation = this.loadConversation(conversationId);
    if (!conversation) return [];

    const lowerQuery = query.toLowerCase();
    return conversation.messages.filter(msg =>
      msg.content.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Delete a conversation
   */
  deleteConversation(id: string): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      // Remove from cache
      this.conversations.delete(id);

      // Remove from storage
      localStorage.removeItem(`${this.storageKey}-${id}`);

      // Remove from index
      this.index = this.index.filter(c => c.id !== id);

      // Save index
      this.saveIndex();
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  }

  /**
   * Create conversation metadata from messages
   */
  createMetadata(
    id: string,
    platform: ConversationMetadata['platform'],
    messages: ConversationMessage[],
    title?: string
  ): ConversationMetadata {
    // Extract tags from messages
    const tags: string[] = [];
    const linkedFiles: string[] = [];
    const linkedCommands: string[] = [];

    messages.forEach(msg => {
      // Extract file paths
      if (msg.actions) {
        msg.actions.forEach(action => {
          if (action.path && !linkedFiles.includes(action.path)) {
            linkedFiles.push(action.path);
          }
          if (action.command && !linkedCommands.includes(action.command)) {
            linkedCommands.push(action.command);
          }
        });
      }

      // Extract tags from content
      const fileMatch = msg.content.match(/`([^`]+\.(tsx?|jsx?|json|md|css))`/g);
      if (fileMatch) {
        fileMatch.forEach(m => {
          const tag = m.replace(/`/g, '').split('.').pop();
          if (tag && !tags.includes(tag)) tags.push(tag);
        });
      }
    });

    // Generate summary from first few messages
    const summary = messages
      .slice(0, 3)
      .map(m => m.content.substring(0, 100))
      .join(' ')
      .substring(0, 200);

    // Generate title if not provided
    const generatedTitle = title || this.generateTitle(messages);

    return {
      id,
      title: generatedTitle,
      platform,
      createdAt: messages[0]?.timestamp || Date.now(),
      lastUpdated: messages[messages.length - 1]?.timestamp || Date.now(),
      messageCount: messages.length,
      tags,
      summary,
      linkedFiles,
      linkedCommands
    };
  }

  /**
   * Generate title from messages
   */
  private generateTitle(messages: ConversationMessage[]): string {
    // Try to extract a meaningful title from first user message
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      const content = firstUserMessage.content.substring(0, 50);
      return content.split('\n')[0].trim();
    }

    // Fallback to timestamp-based title
    const date = new Date(messages[0]?.timestamp || Date.now());
    return `Conversation ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  /**
   * Load index from storage
   */
  private loadIndex(): void {
    try {
      const stored = localStorage.getItem(this.indexKey);
      if (stored) {
        this.index = JSON.parse(stored) as ConversationMetadata[];
      }
    } catch (error) {
      console.error('Failed to load conversation index:', error);
      this.index = [];
    }
  }

  /**
   * Save index to storage
   */
  private saveIndex(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      localStorage.setItem(this.indexKey, JSON.stringify(this.index));
    } catch (error) {
      console.error('Failed to save conversation index:', error);
    }
  }

  /**
   * Get conversations by platform
   */
  getConversationsByPlatform(platform: ConversationMetadata['platform']): ConversationMetadata[] {
    return this.index.filter(c => c.platform === platform);
  }

  /**
   * Get conversations by tag
   */
  getConversationsByTag(tag: string): ConversationMetadata[] {
    return this.index.filter(c => c.tags.includes(tag));
  }

  /**
   * Export conversation for backup
   */
  exportConversation(id: string): string {
    const conversation = this.loadConversation(id);
    if (!conversation) return '';

    return JSON.stringify(conversation, null, 2);
  }

  /**
   * Import conversation from backup
   */
  importConversation(json: string): boolean {
    try {
      const conversation = JSON.parse(json) as Conversation;
      this.saveConversation(conversation);
      return true;
    } catch (error) {
      console.error('Failed to import conversation:', error);
      return false;
    }
  }
}

export const conversationHistoryService = new ConversationHistoryService();

