import { BaseToolHandler, GenericToolSpec, ToolExecutionContext, HandlerContext } from './base-handler.js';
import { SFCCLogClient } from '../../clients/logs/index.js';
import { ClientFactory } from './client-factory.js';

/**
 * Abstract base class for log-related tool handlers
 * Extends the generic config-driven handler with log-specific functionality
 */
export abstract class AbstractLogToolHandler<TToolName extends string = string> extends BaseToolHandler<TToolName> {
  protected logClient: SFCCLogClient | null = null;
  protected clientFactory: ClientFactory;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
    this.clientFactory = new ClientFactory(context, this.logger);
  }

  protected async onInitialize(): Promise<void> {
    this.logClient = this.clientFactory.createLogClient();
    if (this.logClient) {
      this.logger.debug('Log client initialized');
    }
  }

  protected async onDispose(): Promise<void> {
    this.logClient = null;
    this.logger.debug('Log client disposed');
  }

  /**
   * Get the log client with proper error handling
   * Eliminates repetitive null checks in handlers
   */
  protected getLogClient(): SFCCLogClient {
    if (!this.logClient) {
      throw new Error(ClientFactory.getClientRequiredError('Log'));
    }
    return this.logClient;
  }

  /**
   * Create execution context for log tools
   * Provides access to log client and handler context
   */
  protected async createExecutionContext(): Promise<ToolExecutionContext> {
    return {
      handlerContext: this.context,
      logger: this.logger,
      logClient: this.getLogClient(),
    };
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
  protected abstract getToolNameSet(): Set<string>;
}
