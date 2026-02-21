import { BaseToolHandler, ToolExecutionContext, GenericToolSpec, HandlerContext, ToolArguments } from './base-handler.js';
import { ClientFactory } from './client-factory.js';
import { teardownLifecycleClient } from './lifecycle-utils.js';

/**
 * Abstract base class for handlers that need a client with factory-based creation.
 * This provides a simpler alternative to SimpleClientHandler when you need
 * access to ClientFactory for more complex client creation scenarios.
 *
 * Use this when:
 * - Your client needs ClientFactory for creation (e.g., requires config/credentials)
 * - You need a simple single-client handler pattern
 *
 * Use SimpleClientHandler when:
 * - Your client has a simple constructor with no dependencies
 * - You want the most minimal boilerplate
 */
export abstract class AbstractClientHandler<TToolName extends string, TClient> extends BaseToolHandler<TToolName> {
  protected client: TClient | null = null;
  protected clientFactory: ClientFactory;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
    this.clientFactory = new ClientFactory(context, this.logger);
  }

  /**
   * Create the client for this handler.
   * Returns null if the client cannot be created (e.g., missing credentials).
   */
  protected abstract createClient(): TClient | null;

  /**
   * Get the context key used to expose the client in the execution context.
   */
  protected abstract getClientContextKey(): string;

  /**
   * Get a descriptive name for the client (used in logging and error messages).
   */
  protected abstract getClientDisplayName(): string;

  /**
   * Get the error message when the client is not available.
   * Override this for custom error messages.
   */
  protected getClientRequiredError(): string {
    return `${this.getClientDisplayName()} client not initialized`;
  }

  protected async onInitialize(): Promise<void> {
    this.client = this.createClient();
    if (this.client) {
      this.logger.debug(`${this.getClientDisplayName()} client initialized`);
    }
  }

  protected async onDispose(): Promise<void> {
    const client = this.client;
    this.client = null;

    if (client) {
      await teardownLifecycleClient(client);
    }

    this.logger.debug(`${this.getClientDisplayName()} client disposed`);
  }

  protected async createExecutionContext(): Promise<ToolExecutionContext> {
    if (!this.client) {
      throw new Error(this.getClientRequiredError());
    }

    return {
      handlerContext: this.context,
      logger: this.logger,
      [this.getClientContextKey()]: this.client,
    };
  }

  /**
   * Abstract method to get tool configuration.
   * Each concrete handler implements this with their specific config.
   */
  protected abstract getToolConfig(): Record<TToolName, GenericToolSpec<ToolArguments, unknown>>;

  /**
   * Abstract method to get tool name set for O(1) lookup.
   * Each concrete handler implements this with their specific tool set.
   */
  protected abstract getToolNameSet(): Set<TToolName>;
}
