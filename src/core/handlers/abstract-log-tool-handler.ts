import { GenericToolSpec, HandlerContext } from './base-handler.js';
import { AbstractClientHandler } from './abstract-client-handler.js';
import { ClientFactory } from './client-factory.js';
import { SFCCLogClient } from '../../clients/logs/index.js';

/**
 * Abstract base class for log-related tool handlers
 * Extends AbstractClientHandler with log-specific functionality
 *
 * This class simplifies creating log handlers by providing:
 * - Automatic LogClient creation via ClientFactory
 * - Standardized context key and display name
 * - Convenient getLogClient() helper method
 */
export abstract class AbstractLogToolHandler<
  TToolName extends string = string,
> extends AbstractClientHandler<TToolName, SFCCLogClient> {
  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  protected createClient(): SFCCLogClient | null {
    return this.clientFactory.createLogClient();
  }

  protected getClientContextKey(): string {
    return 'logClient';
  }

  protected getClientDisplayName(): string {
    return 'Log';
  }

  /**
   * Override to use the standard Log error message from ClientFactory.
   */
  protected getClientRequiredError(): string {
    return ClientFactory.getClientRequiredError('Log');
  }

  /**
   * Get the log client with proper error handling
   * Convenience method for cleaner code in handlers
   */
  protected getLogClient(): SFCCLogClient {
    if (!this.client) {
      throw new Error(this.getClientRequiredError());
    }
    return this.client;
  }

  /**
   * Abstract method to get tool configuration
   * Each concrete log handler implements this with their specific config
   */
  protected abstract getToolConfig(): Record<TToolName, GenericToolSpec>;

  /**
   * Abstract method to get tool name set for O(1) lookup
   * Each concrete log handler implements this with their specific tool set
   */
  protected abstract getToolNameSet(): Set<TToolName>;
}
