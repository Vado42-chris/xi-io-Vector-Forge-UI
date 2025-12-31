/**
 * Command Registry Service
 * VS Code-inspired command system
 * 
 * #hashtag: command-registry vs-code-inspired keyboard-first
 */

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  handler: (...args: any[]) => void | Promise<void>;
  enabled?: () => boolean;
  visible?: () => boolean;
  category?: string;
  icon?: string;
}

class CommandRegistry {
  private commands: Map<string, Command> = new Map();

  /**
   * Register a command
   */
  register(command: Command): void {
    this.commands.set(command.id, command);
    console.log(`CommandRegistry: Registered command ${command.id}`);
  }

  /**
   * Execute a command
   */
  execute(commandId: string, ...args: any[]): void {
    const command = this.commands.get(commandId);
    if (!command) {
      console.warn(`CommandRegistry: Command ${commandId} not found`);
      return;
    }

    if (command.enabled && !command.enabled()) {
      console.warn(`CommandRegistry: Command ${commandId} is disabled`);
      return;
    }

    try {
      command.handler(...args);
    } catch (error) {
      console.error(`CommandRegistry: Error executing ${commandId}:`, error);
    }
  }

  /**
   * Get all commands
   */
  getCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  /**
   * Get commands by category
   */
  getCommandsByCategory(category: string): Command[] {
    return this.getCommands().filter(c => c.category === category);
  }

  /**
   * Get command by shortcut
   */
  getCommandByShortcut(shortcut: string): Command | undefined {
    return this.getCommands().find(c => c.shortcut === shortcut);
  }

  /**
   * Check if command is enabled
   */
  isEnabled(commandId: string): boolean {
    const command = this.commands.get(commandId);
    if (!command) return false;
    return command.enabled ? command.enabled() : true;
  }

  /**
   * Check if command is visible
   */
  isVisible(commandId: string): boolean {
    const command = this.commands.get(commandId);
    if (!command) return false;
    return command.visible ? command.visible() : true;
  }
}

export const commandRegistry = new CommandRegistry();

