/**
 * Clipboard Service
 * Phase 3: User Flow Completion
 * 
 * Handles copy/paste operations for layers and objects
 * NO INLINE STYLES - All styling via CSS classes
 */

export interface ClipboardItem {
  type: 'layer' | 'object' | 'text';
  data: any;
  timestamp: number;
}

class ClipboardService {
  private clipboard: ClipboardItem | null = null;
  private listeners: Set<() => void> = new Set();

  /**
   * Copy item to clipboard
   */
  copy(item: ClipboardItem): void {
    this.clipboard = {
      ...item,
      timestamp: Date.now(),
    };
    this.notifyListeners();
  }

  /**
   * Paste item from clipboard
   */
  paste(): ClipboardItem | null {
    return this.clipboard;
  }

  /**
   * Check if clipboard has content
   */
  hasContent(): boolean {
    return this.clipboard !== null;
  }

  /**
   * Clear clipboard
   */
  clear(): void {
    this.clipboard = null;
    this.notifyListeners();
  }

  /**
   * Subscribe to clipboard changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Copy to system clipboard (for text)
   */
  async copyToSystemClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  /**
   * Paste from system clipboard (for text)
   */
  async pasteFromSystemClipboard(): Promise<string | null> {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        return await navigator.clipboard.readText();
      }
      return null;
    } catch (error) {
      console.error('Failed to paste from clipboard:', error);
      return null;
    }
  }
}

export const clipboardService = new ClipboardService();

