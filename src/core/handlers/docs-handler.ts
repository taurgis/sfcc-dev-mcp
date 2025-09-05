import { BaseToolHandler, ToolExecutionContext, GenericToolSpec, ToolArguments, HandlerContext } from './base-handler.js';
import { SFCCDocumentationClient } from '../../clients/docs-client.js';
import { DOCS_TOOL_CONFIG, DocToolName, DOC_TOOL_NAMES_SET } from '../../tool-configs/docs-tool-config.js';

/**
 * Handler for SFCC documentation tools using config-driven dispatch
 * Provides access to SFCC class information, search, and documentation
 */
export class DocsToolHandler extends BaseToolHandler<DocToolName> {
  private docsClient: SFCCDocumentationClient | null = null;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
  }

  protected async onInitialize(): Promise<void> {
    if (!this.docsClient) {
      this.docsClient = new SFCCDocumentationClient();
      this.logger.debug('Documentation client initialized');
    }
  }

  protected async onDispose(): Promise<void> {
    this.docsClient = null;
    this.logger.debug('Documentation client disposed');
  }

  canHandle(toolName: string): boolean {
    return DOC_TOOL_NAMES_SET.has(toolName as DocToolName);
  }

  protected getToolNameSet(): Set<DocToolName> {
    return DOC_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<string, GenericToolSpec<ToolArguments, any>> {
    return DOCS_TOOL_CONFIG;
  }

  protected async createExecutionContext(): Promise<ToolExecutionContext> {
    if (!this.docsClient) {
      throw new Error('Documentation client not initialized');
    }

    return {
      handlerContext: this.context,
      logger: this.logger,
      docsClient: this.docsClient,
    };
  }
}
