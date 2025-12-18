import { BaseToolHandler, ToolExecutionContext, GenericToolSpec, ToolArguments, HandlerContext } from './base-handler.js';

/**
 * Configuration for creating a simple client handler
 * Reduces boilerplate for handlers that just wrap a single client
 */
export interface SimpleClientConfig<TToolName extends string, TClient> {
  /** Tool configuration mapping tool names to specs */
  toolConfig: Record<TToolName, GenericToolSpec<ToolArguments, any>>;
  /** Set of tool names for O(1) lookup */
  toolNameSet: Set<TToolName>;
  /** Key name for the client in the execution context */
  clientContextKey: string;
  /** Human-readable client name for logging/errors */
  clientDisplayName: string;
  /** Factory function to create the client */
  createClient: () => TClient;
}

/**
 * Generic handler for tools that use a single stateless client
 * Eliminates boilerplate for simple documentation-style handlers
 *
 * @example
 * const handler = createSimpleClientHandler({
 *   toolConfig: DOCS_TOOL_CONFIG,
 *   toolNameSet: DOC_TOOL_NAMES_SET,
 *   clientContextKey: 'docsClient',
 *   clientDisplayName: 'Documentation',
 *   createClient: () => new SFCCDocumentationClient(),
 * });
 */
export class SimpleClientHandler<TToolName extends string, TClient> extends BaseToolHandler<TToolName> {
  private client: TClient | null = null;
  private readonly config: SimpleClientConfig<TToolName, TClient>;

  constructor(
    context: HandlerContext,
    subLoggerName: string,
    config: SimpleClientConfig<TToolName, TClient>,
  ) {
    super(context, subLoggerName);
    this.config = config;
  }

  protected async onInitialize(): Promise<void> {
    if (!this.client) {
      this.client = this.config.createClient();
      this.logger.debug(`${this.config.clientDisplayName} client initialized`);
    }
  }

  protected async onDispose(): Promise<void> {
    this.client = null;
    this.logger.debug(`${this.config.clientDisplayName} client disposed`);
  }

  protected getToolNameSet(): Set<TToolName> {
    return this.config.toolNameSet;
  }

  protected getToolConfig(): Record<string, GenericToolSpec<ToolArguments, any>> {
    return this.config.toolConfig;
  }

  protected async createExecutionContext(): Promise<ToolExecutionContext> {
    if (!this.client) {
      throw new Error(`${this.config.clientDisplayName} client not initialized`);
    }

    return {
      handlerContext: this.context,
      logger: this.logger,
      [this.config.clientContextKey]: this.client,
    };
  }
}

