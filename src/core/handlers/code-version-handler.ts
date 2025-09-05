import { BaseToolHandler, ToolExecutionContext, GenericToolSpec, HandlerContext, ToolArguments } from './base-handler.js';
import { OCAPICodeVersionsClient } from '../../clients/ocapi/code-versions-client.js';
import { ClientFactory } from './client-factory.js';
import {
  CODE_VERSION_TOOL_CONFIG,
  CodeVersionToolName,
  CODE_VERSION_TOOL_NAMES_SET,
} from '../../tool-configs/code-version-tool-config.js';

/**
 * Handler for code version management tools using config-driven dispatch
 * Provides code version listing, activation, and deployment management
 */
export class CodeVersionToolHandler extends BaseToolHandler<CodeVersionToolName> {
  private codeVersionsClient: OCAPICodeVersionsClient | null = null;
  private clientFactory: ClientFactory;

  constructor(context: HandlerContext, subLoggerName: string) {
    super(context, subLoggerName);
    this.clientFactory = new ClientFactory(context, this.logger);
  }

  protected async onInitialize(): Promise<void> {
    this.codeVersionsClient = this.clientFactory.createCodeVersionsClient();
    if (this.codeVersionsClient) {
      this.logger.debug('Code versions client initialized');
    }
  }

  protected async onDispose(): Promise<void> {
    this.codeVersionsClient = null;
    this.logger.debug('Code versions client disposed');
  }

  canHandle(toolName: string): boolean {
    return CODE_VERSION_TOOL_NAMES_SET.has(toolName as CodeVersionToolName);
  }

  protected getToolNameSet(): Set<CodeVersionToolName> {
    return CODE_VERSION_TOOL_NAMES_SET;
  }

  protected getToolConfig(): Record<string, GenericToolSpec<ToolArguments, any>> {
    return CODE_VERSION_TOOL_CONFIG;
  }

  protected async createExecutionContext(): Promise<ToolExecutionContext> {
    if (!this.codeVersionsClient) {
      throw new Error(ClientFactory.getClientRequiredError('OCAPI'));
    }

    return {
      handlerContext: this.context,
      logger: this.logger,
      codeVersionsClient: this.codeVersionsClient,
    };
  }
}
